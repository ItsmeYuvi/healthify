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
    Create a detailed, personalized 1-week fitness plan for a user with the following profile:
    
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

    Return ONLY a valid JSON object with the following exact structure:
    {{
        "plan_name": "string",
        "duration_weeks": 1,
        "goal": "string",
        "daily_plans": [
            {{
                "day": 1,
                "focus": "string (e.g., Upper Body Strength)",
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
    If yoga_interest is true, include yoga_routine for every day. Otherwise, yoga_routine can be empty list.
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
        # Return a fallback minimal plan so the app doesn't crash
        return {
            "plan_name": "Basic Fitness Plan",
            "duration_weeks": 1,
            "goal": profile.goal.value,
            "daily_plans": []
        }
