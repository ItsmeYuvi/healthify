import google.generativeai as genai
import json

from app.core.config import settings
from app.core.logging import logger
from app.models.fitness_profile import FitnessProfileCreate


genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel(settings.gemini_model)


async def generate_fitness_plan(profile: FitnessProfileCreate) -> dict:
    """Generate a personalized fitness plan using Gemini AI."""

    prompt = f"""
    You are an expert fitness coach, yoga instructor, and nutritionist. 
    Create a detailed, personalized 1-week fitness and diet plan for a user with the following profile:
    
    - Goal: {profile.goal.value.replace('_', ' ').title()}
    - Age: {profile.age}
    - Gender: {profile.gender}
    - Height: {profile.height_cm} cm
    - Weight: {profile.weight_kg} kg
    - Activity Level: {profile.activity_level.value.replace('_', ' ').title()}
    - Diet Preference: {profile.diet_preference.value.replace('_', ' ').title()}
    - Allergies: {', '.join(profile.allergies) if profile.allergies else 'None'}
    - Medical Conditions: {', '.join(profile.medical_conditions) if profile.medical_conditions else 'None'}
    - Workout Days Per Week: {profile.workout_days_per_week}
    - Workout Duration: {profile.workout_duration_minutes} minutes
    - Include Yoga: {profile.yoga_interest}

    Indian Cuisine Diet Adaptations:
    - Customize all diet plans to incorporate common, healthy Indian dishes and ingredients (e.g., Roti, Chapati, Paneer Bhurji, Moong Dal Chilla, Vegetable Dalia, Oats Upma, Idli with Sambar, Poha, Khichdi, Dal Tadka, Chana Masala, Rajma, Palak Paneer, Tandoori Chicken, Fish Tikka, Egg Bhurji, Chicken Curry, etc.).
    - Ensure it is strictly tailored to Indian users' food culture and dietary habits while matching their specific diet preference (e.g., if vegetarian, do NOT include egg, chicken, meat or fish; if vegan, use plant-based alternatives like tofu, soy chunks, dal, almond milk; if keto, focus on paneer, eggs, chicken, healthy fats).
    - Ensure macronutrient and calorie targets are precisely met.
    - Ensure meal instructions and names reflect authentic Indian preparations (e.g., preparation steps like boiling, roasting, sautéing in minimal oil).

    Crucial Structure Requirements:
    1. The plan must span exactly 7 days (Day 1 to Day 7).
    2. Every single day (Day 1 to 7) MUST include a full, personalized 'meals' diet plan matching the user's diet preferences and constraints.
    3. Exactly {profile.workout_days_per_week} days of the week should contain workout 'exercises' and 'yoga_routine' (if include yoga is true). These should be spread out logically (e.g. if 3 days, place them on Day 1, Day 3, and Day 5).
    4. The remaining {7 - profile.workout_days_per_week} days are REST days. For these rest days, the 'exercises' list and 'yoga_routine' list MUST be empty arrays `[]`, and the focus should indicate "Rest & Recovery" or "Active Recovery".

    Return ONLY a valid JSON object with the following exact structure:
    {{
        "plan_name": "string",
        "duration_weeks": 1,
        "goal": "string",
        "daily_plans": [
            {{
                "day": 1,
                "focus": "string (e.g., Upper Body Strength or Rest & Recovery)",
                "exercises": [
                    {{
                        "name": "string",
                        "sets": 3,
                        "reps": "string (e.g., '10-12' or '30 seconds')",
                        "rest_seconds": 60,
                        "notes": "string"
                    }}
                ],
                "yoga_routine": [
                    {{
                        "name": "string",
                        "duration_seconds": 300,
                        "difficulty": "beginner|intermediate|advanced",
                        "benefits": "string"
                    }}
                ],
                "meals": [
                    {{
                        "meal_type": "breakfast|lunch|dinner|snack",
                        "name": "string",
                        "calories": 400,
                        "protein_g": 25.0,
                        "carbs_g": 45.0,
                        "fats_g": 12.0,
                        "ingredients": ["string"],
                        "instructions": "string"
                    }}
                ]
            }}
        ]
    }}

    Ensure the plan is realistic, safe, and tailored to the user's specific goal and constraints.
    If the goal is fat loss, include cardio and HIIT elements. If muscle build, prioritize resistance training.
    """

    try:
        logger.info("Calling Gemini AI for fitness plan generation...")
        response = await model.generate_content_async(prompt)
        text = response.text

        # Clean up markdown code blocks if present
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        plan_data = json.loads(text)
        logger.info("Fitness plan generated successfully.")
        return plan_data
    except Exception as e:
        logger.error(f"Gemini generation failed: {e}")
        # Return a fallback minimal plan with 7 days meals and workout_days_per_week workouts
        daily_plans = []
        for d in range(1, 8):
            is_workout_day = (d in (1, 3, 5)) if profile.workout_days_per_week >= 3 else (d == 1)
            daily_plans.append({
                "day": d,
                "focus": "Full Body Conditioning" if is_workout_day else "Rest & Recovery",
                "exercises": [
                    {"name": "Bodyweight Squats", "sets": 3, "reps": "15", "rest_seconds": 60, "notes": "Warmup exercise"},
                    {"name": "Pushups", "sets": 3, "reps": "10-12", "rest_seconds": 60, "notes": "Focus on form"},
                    {"name": "Plank", "sets": 3, "reps": "30 seconds", "rest_seconds": 45, "notes": "Keep core tight"}
                ] if is_workout_day else [],
                "yoga_routine": [
                    {"name": "Child's Pose", "duration_seconds": 180, "difficulty": "beginner", "benefits": "Stretches lower back"}
                ] if (is_workout_day and profile.yoga_interest) else [],
                "meals": [
                    {"meal_type": "breakfast", "name": "Scrambled Eggs with Toast", "calories": 350, "protein_g": 20.0, "carbs_g": 25.0, "fats_g": 15.0, "ingredients": ["Eggs", "Whole wheat bread"], "instructions": "Scramble eggs and serve with toast"},
                    {"meal_type": "lunch", "name": "Chicken Salad Wrap", "calories": 450, "protein_g": 30.0, "carbs_g": 35.0, "fats_g": 12.0, "ingredients": ["Chicken breast", "Tortilla", "Lettuce"], "instructions": "Wrap chicken and lettuce in tortilla"},
                    {"meal_type": "dinner", "name": "Baked Salmon with Broccoli", "calories": 500, "protein_g": 35.0, "carbs_g": 15.0, "fats_g": 22.0, "ingredients": ["Salmon", "Broccoli"], "instructions": "Bake salmon and steam broccoli"}
                ]
            })
        return {
            "plan_name": "Basic Fitness Plan",
            "duration_weeks": 1,
            "goal": profile.goal.value,
            "daily_plans": daily_plans
        }


async def generate_next_week_fitness_plan(profile: FitnessProfileCreate, prev_plan: dict) -> dict:
    """Generate a progressed plan for the next week based on the previous week's plan."""

    prompt = f"""
    You are an expert fitness coach, yoga instructor, and nutritionist. 
    Create a detailed, progressed fitness and diet plan for WEEK {prev_plan.get('week_number', 1) + 1} based on the user's profile and their previous week's plan (Week {prev_plan.get('week_number', 1)}).
    
    User Profile:
    - Goal: {profile.goal.value.replace('_', ' ').title()}
    - Age: {profile.age}
    - Gender: {profile.gender}
    - Height: {profile.height_cm} cm
    - Weight: {profile.weight_kg} kg
    - Activity Level: {profile.activity_level.value.replace('_', ' ').title()}
    - Diet Preference: {profile.diet_preference.value.replace('_', ' ').title()}
    - Allergies: {', '.join(profile.allergies) if profile.allergies else 'None'}
    - Medical Conditions: {', '.join(profile.medical_conditions) if profile.medical_conditions else 'None'}
    - Workout Days Per Week: {profile.workout_days_per_week}
    - Workout Duration: {profile.workout_duration_minutes} minutes
    - Include Yoga: {profile.yoga_interest}

    Previous Week's Plan (Week {prev_plan.get('week_number', 1)}):
    {json.dumps(prev_plan, indent=2)}

    Indian Cuisine Diet Adaptations:
    - Customize all diet plans to incorporate common, healthy Indian dishes and ingredients (e.g., Roti, Chapati, Paneer Bhurji, Moong Dal Chilla, Vegetable Dalia, Oats Upma, Idli with Sambar, Poha, Khichdi, Dal Tadka, Chana Masala, Rajma, Palak Paneer, Tandoori Chicken, Fish Tikka, Egg Bhurji, Chicken Curry, etc.).
    - Ensure it is strictly tailored to Indian users' food culture and dietary habits while matching their specific diet preference (e.g., if vegetarian, do NOT include egg, chicken, meat or fish; if vegan, use plant-based alternatives like tofu, soy chunks, dal, almond milk; if keto, focus on paneer, eggs, chicken, healthy fats).
    - Ensure macronutrient and calorie targets are precisely met.
    - Ensure meal instructions and names reflect authentic Indian preparations (e.g., preparation steps like boiling, roasting, sautéing in minimal oil).

    Crucial Progression & Structure Requirements:
    1. Progress the workouts logically for Week {prev_plan.get('week_number', 1) + 1} (e.g., slightly increase weights, sets, reps, or introduce evolved exercise variations, while keeping the duration safe).
    2. Keep the diet plan consistent but introduce refreshing meal variations that match their macros and diet preferences.
    3. The plan must span exactly 7 days (Day 1 to Day 7).
    4. Every single day (Day 1 to 7) MUST include a full, personalized 'meals' diet plan.
    5. Exactly {profile.workout_days_per_week} days of the week should contain workout 'exercises' and 'yoga_routine' (if include yoga is true). Spaced out logically.
    6. The remaining {7 - profile.workout_days_per_week} days are REST days (empty 'exercises' and 'yoga_routine' arrays, focus on recovery).
    
    Return ONLY a valid JSON object with the following exact structure:
    {{
        "plan_name": "string (e.g., Week {prev_plan.get('week_number', 1) + 1} - Progressive Strength)",
        "duration_weeks": 1,
        "goal": "string",
        "daily_plans": [
            {{
                "day": 1,
                "focus": "string",
                "exercises": [
                    {{
                        "name": "string",
                        "sets": 3,
                        "reps": "string",
                        "rest_seconds": 60,
                        "notes": "string"
                    }}
                ],
                "yoga_routine": [
                    {{
                        "name": "string",
                        "duration_seconds": 300,
                        "difficulty": "beginner|intermediate|advanced",
                        "benefits": "string"
                    }}
                ],
                "meals": [
                    {{
                        "meal_type": "breakfast|lunch|dinner|snack",
                        "name": "string",
                        "calories": 400,
                        "protein_g": 25.0,
                        "carbs_g": 45.0,
                        "fats_g": 12.0,
                        "ingredients": ["string"],
                        "instructions": "string"
                    }}
                ]
            }}
        ]
    }}
    """

    try:
        logger.info("Calling Gemini AI for next week plan generation...")
        response = await model.generate_content_async(prompt)
        text = response.text

        # Clean up markdown code blocks if present
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        plan_data = json.loads(text)
        logger.info("Next week plan generated successfully.")
        return plan_data
    except Exception as e:
        logger.error(f"Gemini generation failed for next week: {e}")
        # Call generate_fitness_plan fallback
        fallback = await generate_fitness_plan(profile)
        fallback["plan_name"] = f"Week {prev_plan.get('week_number', 1) + 1} - Progressive Plan"
        return fallback
