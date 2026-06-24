import google.generativeai as genai
import json

from app.core.config import settings
from app.core.logging import logger
from app.models.fitness_profile import FitnessProfileCreate


genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel(settings.gemini_model)


def _calculate_fallback_targets(profile: FitnessProfileCreate) -> dict:
    weight = profile.weight_kg
    height = profile.height_cm
    age = profile.age
    
    # Mifflin-St Jeor Equation
    if profile.gender.lower() == "male":
        bmr = 10.0 * weight + 6.25 * height - 5.0 * age + 5.0
    else:
        bmr = 10.0 * weight + 6.25 * height - 5.0 * age - 161.0
        
    # Activity factor
    activity = profile.activity_level.value.lower()
    if "sedentary" in activity:
        activity_factor = 1.2
    elif "lightly" in activity:
        activity_factor = 1.375
    elif "moderately" in activity:
        activity_factor = 1.55
    elif "very" in activity:
        activity_factor = 1.725
    elif "super" in activity:
        activity_factor = 1.9
    else:
        activity_factor = 1.2
        
    tdee = bmr * activity_factor
    
    # Goal adjustment
    goal = profile.goal.value.lower()
    if "fat_loss" in goal:
        target_calories = int(tdee * 0.8)
    elif "weight_gain" in goal or "muscle_build" in goal:
        target_calories = int(tdee * 1.1)
    else:
        target_calories = int(tdee)
        
    # Standard macro splits: 30% Protein, 45% Carbs, 25% Fats
    protein_g = round((target_calories * 0.30) / 4.0, 1)
    carbs_g = round((target_calories * 0.45) / 4.0, 1)
    fats_g = round((target_calories * 0.25) / 9.0, 1)
    
    return {
        "calories": target_calories,
        "protein_g": protein_g,
        "carbs_g": carbs_g,
        "fats_g": fats_g
    }


def _get_raw_fallback_meals(day: int, diet_preference: str) -> list:
    pref = diet_preference.lower() if diet_preference else "no_preference"
    
    if "keto" in pref:
        meals = {
            1: [
                {"meal_type": "breakfast", "name": "Butter Paneer Bhurji", "calories": 420, "protein_g": 20.0, "carbs_g": 6.0, "fats_g": 35.0, "ingredients": ["Paneer", "Butter", "Onions", "Spices"], "instructions": "Sauté paneer in butter with spices and onions."},
                {"meal_type": "lunch", "name": "Grilled Chicken Tikka with Salad", "calories": 510, "protein_g": 40.0, "carbs_g": 5.0, "fats_g": 35.0, "ingredients": ["Chicken breast", "Yogurt marinade", "Butter", "Cucumber", "Lettuce"], "instructions": "Grill marinated chicken, brush with butter, serve with salad."},
                {"meal_type": "dinner", "name": "Salmon Butter Fry with Broccoli", "calories": 550, "protein_g": 35.0, "carbs_g": 6.0, "fats_g": 42.0, "ingredients": ["Salmon fillet", "Butter", "Broccoli", "Garlic"], "instructions": "Pan-fry salmon in butter. Sauté broccoli with garlic."}
            ],
            2: [
                {"meal_type": "breakfast", "name": "Cheese Omelette in Ghee", "calories": 440, "protein_g": 24.0, "carbs_g": 2.0, "fats_g": 36.0, "ingredients": ["3 Eggs", "Cheddar cheese", "Ghee", "Spinach"], "instructions": "Whisk eggs, cook in ghee, fold in cheese and spinach."},
                {"meal_type": "lunch", "name": "Tofu & Mushroom Stir-Fry", "calories": 390, "protein_g": 18.0, "carbs_g": 7.0, "fats_g": 32.0, "ingredients": ["Tofu", "Mushrooms", "Sesame oil", "Zucchini", "Soy sauce"], "instructions": "Stir-fry tofu and vegetables in sesame oil."},
                {"meal_type": "dinner", "name": "Chicken Malai Tikka", "calories": 440, "protein_g": 38.0, "carbs_g": 4.0, "fats_g": 30.0, "ingredients": ["Chicken breast", "Heavy cream", "Cheese", "Spices"], "instructions": "Bake cream-marinated chicken tikka until tender."}
            ],
            3: [
                {"meal_type": "breakfast", "name": "Bulletproof Coffee & Nuts Mix", "calories": 310, "protein_g": 6.0, "carbs_g": 4.0, "fats_g": 30.0, "ingredients": ["Coffee", "MCT Oil", "Butter", "Almonds", "Walnuts"], "instructions": "Blend coffee with oil and butter. Serve with nuts."},
                {"meal_type": "lunch", "name": "Egg Salad with Keto Mayo", "calories": 460, "protein_g": 21.0, "carbs_g": 3.0, "fats_g": 40.0, "ingredients": ["3 Eggs", "Keto mayonnaise", "Celery", "Mustard"], "instructions": "Chop boiled eggs, mix with mayo, celery, and mustard."},
                {"meal_type": "dinner", "name": "Grilled Butter Paneer Tikka", "calories": 530, "protein_g": 28.0, "carbs_g": 7.0, "fats_g": 45.0, "ingredients": ["Paneer cubes", "Bell peppers", "Butter", "Spices"], "instructions": "Skewer paneer and peppers, grill with butter."}
            ],
            4: [
                {"meal_type": "breakfast", "name": "Avocado Spinach Protein Smoothie", "calories": 350, "protein_g": 26.0, "carbs_g": 5.0, "fats_g": 25.0, "ingredients": ["Avocado", "Spinach", "Whey protein", "Unsweetened almond milk"], "instructions": "Blend all ingredients until smooth."},
                {"meal_type": "lunch", "name": "Chicken Curry in Coconut Milk", "calories": 480, "protein_g": 36.0, "carbs_g": 6.0, "fats_g": 34.0, "ingredients": ["Chicken", "Coconut milk", "Curry spices", "Onion"], "instructions": "Simmer chicken in thick spiced coconut milk curry."},
                {"meal_type": "dinner", "name": "Baked Cod with Lemon Butter", "calories": 410, "protein_g": 32.0, "carbs_g": 2.0, "fats_g": 30.0, "ingredients": ["Cod fillet", "Butter", "Lemon juice", "Garlic"], "instructions": "Bake cod drizzled with melted garlic lemon butter."}
            ],
            5: [
                {"meal_type": "breakfast", "name": "Scrambled Paneer & Mushrooms", "calories": 380, "protein_g": 18.0, "carbs_g": 5.0, "fats_g": 32.0, "ingredients": ["Paneer", "Button mushrooms", "Olive oil", "Green chilies"], "instructions": "Sauté mushrooms, add crumbled paneer and spices."},
                {"meal_type": "lunch", "name": "Sautéed Butter Prawns with Spinach", "calories": 440, "protein_g": 30.0, "carbs_g": 4.0, "fats_g": 32.0, "ingredients": ["Prawns", "Butter", "Garlic", "Spinach"], "instructions": "Sauté prawns in garlic butter, add spinach until wilted."},
                {"meal_type": "dinner", "name": "Grilled Chicken Breast with Avocado", "calories": 490, "protein_g": 40.0, "carbs_g": 6.0, "fats_g": 33.0, "ingredients": ["Chicken breast", "Olive oil", "Avocado", "Lime"], "instructions": "Run chicken on grill, serve with sliced avocado and lime."}
            ],
            6: [
                {"meal_type": "breakfast", "name": "Egg Spinach Muffins", "calories": 360, "protein_g": 22.0, "carbs_g": 3.0, "fats_g": 28.0, "ingredients": ["4 Eggs", "Spinach", "Cheese", "Olive oil"], "instructions": "Whisk eggs with spinach and cheese, bake in muffin tin."},
                {"meal_type": "lunch", "name": "Paneer Butter Masala (Keto Style)", "calories": 520, "protein_g": 20.0, "carbs_g": 8.0, "fats_g": 46.0, "ingredients": ["Paneer", "Heavy cream", "Butter", "Tomato paste", "Spices"], "instructions": "Simmer paneer in a rich, buttery, cream-thickened tomato gravy."},
                {"meal_type": "dinner", "name": "Grilled Chicken Chop with Cauliflower Mash", "calories": 480, "protein_g": 36.0, "carbs_g": 5.0, "fats_g": 34.0, "ingredients": ["Chicken chop", "Cauliflower", "Butter", "Cream"], "instructions": "Grill chicken. Mash steamed cauliflower with butter and cream."}
            ],
            7: [
                {"meal_type": "breakfast", "name": "Keto Almond Flour Pancakes", "calories": 390, "protein_g": 12.0, "carbs_g": 6.0, "fats_g": 35.0, "ingredients": ["Almond flour", "Eggs", "Heavy cream", "Butter"], "instructions": "Mix ingredients, cook in butter like pancakes."},
                {"meal_type": "lunch", "name": "Chicken Caesar Salad (No Croutons)", "calories": 460, "protein_g": 34.0, "carbs_g": 4.0, "fats_g": 34.0, "ingredients": ["Grilled chicken", "Romaine lettuce", "Parmesan", "Caesar dressing"], "instructions": "Toss lettuce with dressing, top with grilled chicken and cheese."},
                {"meal_type": "dinner", "name": "Lamb Seekh Kebab with Mint Dip", "calories": 490, "protein_g": 32.0, "carbs_g": 5.0, "fats_g": 38.0, "ingredients": ["Minced lamb", "Spices", "Greek yogurt", "Mint"], "instructions": "Skewer and grill kebabs, serve with mint yogurt dip."}
            ]
        }
    elif "vegan" in pref:
        meals = {
            1: [
                {"meal_type": "breakfast", "name": "Tofu Scramble with Spinach & Oats Toast", "calories": 340, "protein_g": 18.0, "carbs_g": 38.0, "fats_g": 12.0, "ingredients": ["Tofu", "Spinach", "Turmeric", "Oats bread"], "instructions": "Crumble tofu, sauté with turmeric and spinach. Serve with toasted oats bread."},
                {"meal_type": "lunch", "name": "Masala Soya Chunks Curry", "calories": 420, "protein_g": 28.0, "carbs_g": 45.0, "fats_g": 10.0, "ingredients": ["Soya chunks", "Onions", "Tomatoes", "Garlic", "Spices"], "instructions": "Boil soya chunks, then simmer in a spicy onion-tomato gravy."},
                {"meal_type": "dinner", "name": "Dal Tadka with Brown Rice", "calories": 400, "protein_g": 15.0, "carbs_g": 65.0, "fats_g": 8.0, "ingredients": ["Yellow lentils", "Brown rice", "Cumin", "Garlic", "Olive oil"], "instructions": "Cook lentils and rice. Temper lentils with cumin, garlic, and oil."}
            ],
            2: [
                {"meal_type": "breakfast", "name": "Moong Dal Chilla with Tofu Stuffing", "calories": 350, "protein_g": 16.0, "carbs_g": 48.0, "fats_g": 10.0, "ingredients": ["Moong dal batter", "Crumbled tofu", "Onions", "Chili"], "instructions": "Pour batter on griddle, stuff with seasoned tofu, fold."},
                {"meal_type": "lunch", "name": "Chana Masala with Chapati & Salad", "calories": 480, "protein_g": 18.0, "carbs_g": 72.0, "fats_g": 12.0, "ingredients": ["Chickpeas", "Spices", "2 Whole wheat chapatis", "Cucumber", "Tomato"], "instructions": "Cook chickpeas in spicy gravy, serve with chapatis and salad."},
                {"meal_type": "dinner", "name": "Spinach Tofu Curry", "calories": 410, "protein_g": 22.0, "carbs_g": 32.0, "fats_g": 20.0, "ingredients": ["Tofu", "Spinach purée", "Garlic", "Coconut milk"], "instructions": "Cook tofu cubes in spiced spinach purée with a splash of coconut milk."}
            ],
            3: [
                {"meal_type": "breakfast", "name": "Vegetable Oats Upma", "calories": 330, "protein_g": 10.0, "carbs_g": 52.0, "fats_g": 9.0, "ingredients": ["Rolled oats", "Mustard seeds", "Carrots", "Beans", "Almonds"], "instructions": "Dry roast oats. Sauté mustard seeds, veggies, and almonds, add oats and water."},
                {"meal_type": "lunch", "name": "Yellow Split Pea Dal with Quinoa", "calories": 440, "protein_g": 18.0, "carbs_g": 68.0, "fats_g": 10.0, "ingredients": ["Yellow split peas", "Quinoa", "Spinach", "Lemon juice"], "instructions": "Cook split peas and quinoa separately. Combine and garnish with spinach and lemon."},
                {"meal_type": "dinner", "name": "Grilled Tofu with Stir-fried Green Beans", "calories": 380, "protein_g": 20.0, "carbs_g": 22.0, "fats_g": 24.0, "ingredients": ["Tofu block", "Green beans", "Carrots", "Soy sauce", "Sesame oil"], "instructions": "Grill tofu. Stir-fry green beans and carrots in sesame oil with soy sauce."}
            ],
            4: [
                {"meal_type": "breakfast", "name": "Mixed Sprouts Salad", "calories": 310, "protein_g": 14.0, "carbs_g": 48.0, "fats_g": 8.0, "ingredients": ["Moong sprouts", "Pomegranate", "Peanuts", "Lemon", "Coriander"], "instructions": "Mix steamed sprouts with peanuts, pomegranate, lemon juice, and coriander."},
                {"meal_type": "lunch", "name": "Tofu Wrap with Mint Chutney", "calories": 440, "protein_g": 22.0, "carbs_g": 54.0, "fats_g": 14.0, "ingredients": ["Whole wheat tortilla", "Grilled tofu", "Onions", "Mint coriander chutney"], "instructions": "Spread mint chutney on tortilla, fill with tofu and onions, wrap tightly."},
                {"meal_type": "dinner", "name": "Moong Dal Khichdi (Vegan)", "calories": 400, "protein_g": 14.0, "carbs_g": 68.0, "fats_g": 8.0, "ingredients": ["Moong dal", "Rice", "Turmeric", "Cumin", "Olive oil"], "instructions": "Pressure cook dal and rice with turmeric. Temper with cumin in oil."}
            ],
            5: [
                {"meal_type": "breakfast", "name": "Besan Chilla (Chickpea Pancakes)", "calories": 320, "protein_g": 12.0, "carbs_g": 46.0, "fats_g": 10.0, "ingredients": ["Gram flour (Besan)", "Onions", "Ajwain", "Green coriander"], "instructions": "Make a smooth batter with water and chopped onions, cook on pan."},
                {"meal_type": "lunch", "name": "Rajma Masala with Brown Rice", "calories": 450, "protein_g": 16.0, "carbs_g": 72.0, "fats_g": 10.0, "ingredients": ["Red kidney beans", "Brown rice", "Ginger-garlic paste", "Tomato"], "instructions": "Simmer kidney beans in thick ginger-garlic tomato gravy. Serve with brown rice."},
                {"meal_type": "dinner", "name": "Soya Chunks Bhurji", "calories": 390, "protein_g": 26.0, "carbs_g": 38.0, "fats_g": 12.0, "ingredients": ["Soya granules", "Onions", "Tomatoes", "Capsicum", "Oil"], "instructions": "Sauté chopped onions, tomatoes, capsicum. Add boiled soya granules and spices."}
            ],
            6: [
                {"meal_type": "breakfast", "name": "Vegetable Dalia (Broken Wheat)", "calories": 320, "protein_g": 10.0, "carbs_g": 55.0, "fats_g": 7.0, "ingredients": ["Broken wheat (Dalia)", "Green peas", "Carrots", "Oil"], "instructions": "Roast dalia, cook with water and mixed vegetables in a pressure cooker."},
                {"meal_type": "lunch", "name": "Mushroom Tikka with Peppers", "calories": 340, "protein_g": 12.0, "carbs_g": 38.0, "fats_g": 16.0, "ingredients": ["Button mushrooms", "Bell peppers", "Soy yogurt marinade", "Spices"], "instructions": "Marinate mushrooms and peppers in spiced soy yogurt, grill till charred."},
                {"meal_type": "dinner", "name": "Mixed Lentil Soup with Roasted Makhana", "calories": 350, "protein_g": 16.0, "carbs_g": 52.0, "fats_g": 9.0, "ingredients": ["Masoor dal", "Moong dal", "Foxnuts (Makhana)", "Olive oil"], "instructions": "Boil mixed lentils, temper with cumin. Serve with roasted makhana."}
            ],
            7: [
                {"meal_type": "breakfast", "name": "Idli with Sambar & Coconut Chutney", "calories": 350, "protein_g": 10.0, "carbs_g": 62.0, "fats_g": 6.0, "ingredients": ["3 Rice Idlis", "Mixed vegetable sambar", "Coconut", "Mustard seeds"], "instructions": "Steam idlis, serve hot with vegetable sambar and fresh coconut chutney."},
                {"meal_type": "lunch", "name": "Aloo Baingan with Chapati & Salad", "calories": 410, "protein_g": 10.0, "carbs_g": 64.0, "fats_g": 12.0, "ingredients": ["Potatoes", "Eggplant", "Spices", "2 Chapatis", "Salad greens"], "instructions": "Cook potatoes and eggplant with Indian spices. Serve with chapatis and salad."},
                {"meal_type": "dinner", "name": "Vegetable Pulao with Mint Chutney", "calories": 400, "protein_g": 10.0, "carbs_g": 68.0, "fats_g": 10.0, "ingredients": ["Basmati rice", "Carrots", "Peas", "Spices", "Mint leaves"], "instructions": "Cook rice with vegetables and whole spices. Serve with fresh mint chutney."}
            ]
        }
    elif "vegetarian" in pref or "gluten_free" in pref:
        meals = {
            1: [
                {"meal_type": "breakfast", "name": "Paneer Bhurji with Whole Wheat Roti", "calories": 380, "protein_g": 22.0, "carbs_g": 35.0, "fats_g": 16.0, "ingredients": ["Paneer", "Butter", "Onions", "2 Rotis"], "instructions": "Sauté crumbled paneer in butter with onions and spices, serve with rotis."},
                {"meal_type": "lunch", "name": "Masala Soya Chunks Curry", "calories": 420, "protein_g": 28.0, "carbs_g": 45.0, "fats_g": 10.0, "ingredients": ["Soya chunks", "Tomato gravy", "Spices", "Cucumber salad"], "instructions": "Simmer boiled soya chunks in rich onion-tomato gravy. Serve with cucumber salad."},
                {"meal_type": "dinner", "name": "Dal Tadka with Brown Rice", "calories": 400, "protein_g": 15.0, "carbs_g": 65.0, "fats_g": 8.0, "ingredients": ["Yellow lentils", "Brown rice", "Ghee", "Garlic", "Cumin"], "instructions": "Cook lentils and rice. Temper lentils with garlic and cumin in ghee."}
            ],
            2: [
                {"meal_type": "breakfast", "name": "Moong Dal Chilla with Paneer Stuffing", "calories": 360, "protein_g": 18.0, "carbs_g": 46.0, "fats_g": 12.0, "ingredients": ["Moong dal batter", "Crumbled paneer", "Green chili", "Corriander"], "instructions": "Spread batter on pan, stuff with paneer, grill until golden."},
                {"meal_type": "lunch", "name": "Chana Masala with Chapati & Salad", "calories": 480, "protein_g": 18.0, "carbs_g": 72.0, "fats_g": 12.0, "ingredients": ["Chickpeas", "Spices", "2 Whole wheat chapatis", "Salad greens"], "instructions": "Cook chickpeas in spicy masala gravy, serve with chapatis and fresh salad."},
                {"meal_type": "dinner", "name": "Palak Paneer", "calories": 430, "protein_g": 24.0, "carbs_g": 18.0, "fats_g": 30.0, "ingredients": ["Paneer", "Spinach purée", "Ghee", "Cream", "Spices"], "instructions": "Cook paneer cubes in spiced spinach purée finished with cream."}
            ],
            3: [
                {"meal_type": "breakfast", "name": "Vegetable Oats Upma with Almonds", "calories": 330, "protein_g": 10.0, "carbs_g": 52.0, "fats_g": 9.0, "ingredients": ["Oats", "Veggies", "Mustard seeds", "Almonds"], "instructions": "Sauté veggies and roasted oats with mustard seeds and water."},
                {"meal_type": "lunch", "name": "Kadhi Pakora with Steamed Rice", "calories": 450, "protein_g": 12.0, "carbs_g": 70.0, "fats_g": 14.0, "ingredients": ["Besan (Gram flour)", "Yogurt", "Spices", "Rice", "Salad"], "instructions": "Make yogurt-gram flour curry with dumplings, serve over steamed rice."},
                {"meal_type": "dinner", "name": "Grilled Tofu with Stir-fried Green Beans", "calories": 380, "protein_g": 20.0, "carbs_g": 22.0, "fats_g": 24.0, "ingredients": ["Tofu", "Green beans", "Carrots", "Sesame oil"], "instructions": "Grill tofu, toss with stir-fried green beans and carrots in sesame oil."}
            ],
            4: [
                {"meal_type": "breakfast", "name": "Sprouts Salad with Pomegranate & Curd", "calories": 310, "protein_g": 15.0, "carbs_g": 42.0, "fats_g": 9.0, "ingredients": ["Mixed sprouts", "Pomegranate", "Yogurt (Curd)", "Spices"], "instructions": "Combine steamed sprouts with pomegranate, low-fat yogurt, and salt."},
                {"meal_type": "lunch", "name": "Paneer Wrap with Mint Chutney", "calories": 460, "protein_g": 22.0, "carbs_g": 48.0, "fats_g": 20.0, "ingredients": ["Whole wheat chapati", "Grilled paneer", "Mint chutney", "Onions"], "instructions": "Wrap grilled paneer and sliced onions in a chapati spread with mint chutney."},
                {"meal_type": "dinner", "name": "Moong Dal Khichdi & Curd", "calories": 420, "protein_g": 15.0, "carbs_g": 68.0, "fats_g": 10.0, "ingredients": ["Moong dal", "Rice", "Ghee", "Curd"], "instructions": "Cook dal and rice together with turmeric, top with ghee, serve with curd."}
            ],
            5: [
                {"meal_type": "breakfast", "name": "Besan Chilla with Mint Chutney", "calories": 320, "protein_g": 12.0, "carbs_g": 46.0, "fats_g": 10.0, "ingredients": ["Besan (Gram flour)", "Spices", "Onions", "Mint leaves"], "instructions": "Prepare besan batter with spices, spread on griddle. Serve with mint chutney."},
                {"meal_type": "lunch", "name": "Rajma Masala with Brown Rice", "calories": 450, "protein_g": 16.0, "carbs_g": 72.0, "fats_g": 10.0, "ingredients": ["Kidney beans", "Brown rice", "Tomatoes", "Onions", "Spices"], "instructions": "Cook kidney beans in spiced tomato gravy, serve with brown rice."},
                {"meal_type": "dinner", "name": "Soya Chunks Bhurji with Chapati", "calories": 410, "protein_g": 26.0, "carbs_g": 44.0, "fats_g": 14.0, "ingredients": ["Soya granules", "Onions", "Tomato", "1 Chapati", "Cucumber raita"], "instructions": "Sauté soya granules with onions and tomato, serve with chapati and raita."}
            ],
            6: [
                {"meal_type": "breakfast", "name": "Vegetable Dalia (Broken Wheat)", "calories": 320, "protein_g": 10.0, "carbs_g": 55.0, "fats_g": 7.0, "ingredients": ["Broken wheat (Dalia)", "Veggies", "Ghee"], "instructions": "Cook dalia with mixed vegetables and spices in pressure cooker, top with ghee."},
                {"meal_type": "lunch", "name": "Paneer Tikka with Grilled Bell Peppers", "calories": 440, "protein_g": 24.0, "carbs_g": 15.0, "fats_g": 32.0, "ingredients": ["Paneer", "Yogurt marinade", "Bell peppers", "Onions"], "instructions": "Marinate paneer and veggies in spiced yogurt, bake/grill until charred."},
                {"meal_type": "dinner", "name": "Mixed Lentil Soup with Roasted Makhana", "calories": 350, "protein_g": 16.0, "carbs_g": 52.0, "fats_g": 9.0, "ingredients": ["Mixed dals", "Ghee", "Foxnuts (Makhana)"], "instructions": "Prepare mixed lentil soup. Serve with crunchy dry-roasted makhana."}
            ],
            7: [
                {"meal_type": "breakfast", "name": "Idli with Sambar & Coconut Chutney", "calories": 350, "protein_g": 10.0, "carbs_g": 62.0, "fats_g": 6.0, "ingredients": ["3 Rice Idlis", "Vegetable Sambar", "Coconut chutney"], "instructions": "Steam idlis, serve with warm vegetable sambar and fresh coconut chutney."},
                {"meal_type": "lunch", "name": "Aloo Baingan with Chapati & Salad", "calories": 410, "protein_g": 10.0, "carbs_g": 64.0, "fats_g": 12.0, "ingredients": ["Potatoes", "Eggplant", "2 Chapatis", "Salad greens"], "instructions": "Cook potatoes and eggplant in typical Indian masala. Serve with chapatis and salad."},
                {"meal_type": "dinner", "name": "Vegetable Pulao with Mixed Veg Raita", "calories": 430, "protein_g": 12.0, "carbs_g": 66.0, "fats_g": 12.0, "ingredients": ["Basmati rice", "Veggies", "Yogurt", "Cucumber", "Spices"], "instructions": "Cook spiced vegetable rice. Serve with cool cucumber raita."}
            ]
        }
    else:
        meals = {
            1: [
                {"meal_type": "breakfast", "name": "Paneer Bhurji with Whole Wheat Roti", "calories": 380, "protein_g": 22.0, "carbs_g": 35.0, "fats_g": 16.0, "ingredients": ["Paneer", "Butter", "Onions", "2 Rotis"], "instructions": "Sauté crumbled paneer in butter with onions and spices, serve with rotis."},
                {"meal_type": "lunch", "name": "Tandoori Chicken Tikka with Salad", "calories": 450, "protein_g": 40.0, "carbs_g": 12.0, "fats_g": 18.0, "ingredients": ["Chicken breast", "Yogurt", "Lemon", "Cucumber", "Onion"], "instructions": "Grill marinated chicken tikka cubes, serve with lemon and onion cucumber salad."},
                {"meal_type": "dinner", "name": "Dal Tadka with Brown Rice & Broccoli", "calories": 400, "protein_g": 15.0, "carbs_g": 65.0, "fats_g": 8.0, "ingredients": ["Yellow lentils", "Brown rice", "Broccoli", "Garlic", "Ghee"], "instructions": "Cook dal and brown rice. Temper dal with garlic in ghee. Serve with steamed broccoli."}
            ],
            2: [
                {"meal_type": "breakfast", "name": "Egg White Scramble with Oats Toast", "calories": 320, "protein_g": 24.0, "carbs_g": 28.0, "fats_g": 10.0, "ingredients": ["3 Egg whites", "Spinach", "Olive oil", "2 slices Oats bread"], "instructions": "Scramble egg whites with spinach in oil. Serve with toasted oats bread."},
                {"meal_type": "lunch", "name": "Chicken Curry with Chapati & Veggies", "calories": 520, "protein_g": 38.0, "carbs_g": 45.0, "fats_g": 16.0, "ingredients": ["Chicken curry", "2 Chapatis", "Stir-fried vegetables"], "instructions": "Cook chicken curry in light gravy. Serve with hot chapatis and veggies."},
                {"meal_type": "dinner", "name": "Baked Salmon Tikka with Quinoa", "calories": 480, "protein_g": 35.0, "carbs_g": 30.0, "fats_g": 18.0, "ingredients": ["Salmon fillet", "Tandoori marinade", "Quinoa", "Asparagus"], "instructions": "Bake marinated salmon, serve with cooked quinoa and grilled asparagus."}
            ],
            3: [
                {"meal_type": "breakfast", "name": "Moong Dal Chilla with Mint Chutney", "calories": 310, "protein_g": 14.0, "carbs_g": 45.0, "fats_g": 8.0, "ingredients": ["Moong dal batter", "Onions", "Green chili", "Mint chutney"], "instructions": "Make thin pancakes from split green gram batter, serve with spicy mint chutney."},
                {"meal_type": "lunch", "name": "Fish Curry with Steamed Brown Rice", "calories": 470, "protein_g": 32.0, "carbs_g": 50.0, "fats_g": 12.0, "ingredients": ["Fish fillet", "Coconut tamarind curry", "Brown rice", "Salad"], "instructions": "Cook fish in coconut tamarind curry, serve over steamed brown rice and salad."},
                {"meal_type": "dinner", "name": "Grilled Herb Chicken with Zucchini", "calories": 420, "protein_g": 42.0, "carbs_g": 15.0, "fats_g": 10.0, "ingredients": ["Chicken breast", "Herbs", "Zucchini", "Olive oil"], "instructions": "Grill herb-crusted chicken breast. Sauté zucchini in olive oil."}
            ],
            4: [
                {"meal_type": "breakfast", "name": "Oats Upma with Peanuts", "calories": 340, "protein_g": 10.0, "carbs_g": 50.0, "fats_g": 12.0, "ingredients": ["Oats", "Mustard seeds", "Veggies", "Peanuts"], "instructions": "Cook roasted oats with tempered mustard seeds, onions, mixed veggies, and peanuts."},
                {"meal_type": "lunch", "name": "Egg Bhurji (3 eggs) with Rotis", "calories": 490, "protein_g": 28.0, "carbs_g": 38.0, "fats_g": 18.0, "ingredients": ["3 Eggs", "Onions", "Tomatoes", "Green chilies", "2 Rotis"], "instructions": "Scramble eggs with sautéed onions, tomatoes, and spices. Serve with hot rotis."},
                {"meal_type": "dinner", "name": "Mixed Lentil Soup with Grilled Paneer", "calories": 410, "protein_g": 24.0, "carbs_g": 30.0, "fats_g": 14.0, "ingredients": ["Mixed lentils", "Paneer block", "Spices", "Ghee"], "instructions": "Prepare hot lentil soup. Serve with pan-grilled paneer cubes."},
            ],
            5: [
                {"meal_type": "breakfast", "name": "Sattu Shake with Banana", "calories": 360, "protein_g": 18.0, "carbs_g": 55.0, "fats_g": 6.0, "ingredients": ["Sattu (Chickpea flour)", "Water or Milk", "1 Banana", "Jaggery (optional)"], "instructions": "Blend sattu powder, milk/water, banana, and a touch of jaggery until smooth."},
                {"meal_type": "lunch", "name": "Chicken Salad Wrap", "calories": 440, "protein_g": 35.0, "carbs_g": 30.0, "fats_g": 12.0, "ingredients": ["Chicken breast", "Whole wheat wrap", "Lettuce", "Yogurt dip"], "instructions": "Wrap shredded boiled chicken and lettuce in a wrap with mint yogurt spread."},
                {"meal_type": "dinner", "name": "Stir-fried Tofu with Broccoli & Peppers", "calories": 390, "protein_g": 20.0, "carbs_g": 25.0, "fats_g": 18.0, "ingredients": ["Tofu block", "Broccoli", "Bell peppers", "Soy sauce", "Ginger", "Oil"], "instructions": "Sauté tofu, broccoli, and peppers with soy sauce and ginger in minimal oil."}
            ],
            6: [
                {"meal_type": "breakfast", "name": "Vegetable Dalia (Broken Wheat)", "calories": 320, "protein_g": 12.0, "carbs_g": 52.0, "fats_g": 8.0, "ingredients": ["Dalia", "Peas", "Carrots", "Onion", "Ghee"], "instructions": "Pressure cook roasted dalia with onions, carrots, peas, and a dollop of ghee."},
                {"meal_type": "lunch", "name": "Poha with Sprouts & Peanuts", "calories": 380, "protein_g": 12.0, "carbs_g": 55.0, "fats_g": 10.0, "ingredients": ["Flattened rice (Poha)", "Sprouts", "Peanuts", "Onions", "Curry leaves"], "instructions": "Sauté onions, peanuts, curry leaves, add steamed sprouts and washed poha, cook."},
                {"meal_type": "dinner", "name": "Baked Garlic Butter Fish & Cauliflower", "calories": 450, "protein_g": 36.0, "carbs_g": 18.0, "fats_g": 20.0, "ingredients": ["Fish fillet", "Garlic", "Butter", "Cauliflower florets"], "instructions": "Bake fish in garlic butter. Roast cauliflower alongside."}
            ],
            7: [
                {"meal_type": "breakfast", "name": "Idli with Sambar & Coconut Chutney", "calories": 350, "protein_g": 10.0, "carbs_g": 62.0, "fats_g": 6.0, "ingredients": ["3 Rice Idlis", "Mixed veggie Sambar", "Coconut chutney"], "instructions": "Steam idlis, serve with warm vegetable sambar and fresh coconut chutney."},
                {"meal_type": "lunch", "name": "Rajma Masala with Jeera Rice", "calories": 460, "protein_g": 18.0, "carbs_g": 72.0, "fats_g": 10.0, "ingredients": ["Red kidney beans", "Basmati rice", "Jeera (Cumin)", "Ghee"], "instructions": "Simmer kidney beans in thick spiced gravy. Serve with hot cumin rice."},
                {"meal_type": "dinner", "name": "Chicken Tikka Salad", "calories": 410, "protein_g": 38.0, "carbs_g": 12.0, "fats_g": 18.0, "ingredients": ["Grilled chicken tikka", "Salad greens", "Olive oil dressing"], "instructions": "Toss chicken tikka with mixed greens and a light olive oil vinaigrette."}
            ]
        }
    return meals.get(day, meals[1])


def _get_fallback_meals_for_day(day: int, diet_preference: str, targets: dict) -> list:
    base_meals = _get_raw_fallback_meals(day, diet_preference)
    scaled_meals = []
    proportions = {
        "breakfast": 0.30,
        "lunch": 0.40,
        "dinner": 0.30
    }
    
    for meal in base_meals:
        m_type = meal["meal_type"]
        prop = proportions.get(m_type, 0.30)
        scaled_meal = meal.copy()
        scaled_meal["calories"] = int(targets["calories"] * prop)
        scaled_meal["protein_g"] = round(targets["protein_g"] * prop, 1)
        scaled_meal["carbs_g"] = round(targets["carbs_g"] * prop, 1)
        scaled_meal["fats_g"] = round(targets["fats_g"] * prop, 1)
        scaled_meals.append(scaled_meal)
        
    return scaled_meals


def _get_fallback_exercises_for_day(day: int, goal: str) -> list:
    g = goal.lower() if goal else "general_health"
    
    if "muscle" in g or "gain" in g:
        reps_val = "8-10"
        sets_val = 4
        rest_val = 90
    elif "loss" in g or "endurance" in g:
        reps_val = "15-20"
        sets_val = 3
        rest_val = 45
    else:
        reps_val = "12-15"
        sets_val = 3
        rest_val = 60

    exercises = {
        1: [
            {"name": "Bodyweight Squats", "focus_area": "Quads & Glutes", "sets": sets_val, "reps": reps_val, "rest_seconds": rest_val, "instruction": "Stand with feet shoulder-width apart. Lower your hips back and down. Keep chest up.", "notes": "Warmup exercise"},
            {"name": "Pushups", "focus_area": "Chest & Triceps", "sets": sets_val, "reps": reps_val, "rest_seconds": rest_val, "instruction": "Start in a high plank. Lower body until chest is just above floor. Push back up.", "notes": "Focus on form"},
            {"name": "Plank", "focus_area": "Core", "sets": sets_val, "reps": "30-45 seconds" if "loss" in g or "endurance" in g else "60 seconds", "rest_seconds": rest_val, "instruction": "Hold a forearm plank position. Keep body in a straight line.", "notes": "Keep core tight"}
        ],
        2: [
            {"name": "Bicycle Crunches", "focus_area": "Abs & Obliques", "sets": sets_val, "reps": "20 total", "rest_seconds": rest_val, "instruction": "Lie flat on back. Alternate touching opposite elbow to opposite knee while cycling legs.", "notes": "Move slowly and control"},
            {"name": "Supermans", "focus_area": "Lower Back & Glutes", "sets": sets_val, "reps": "12-15", "rest_seconds": rest_val, "instruction": "Lie face down. Simultaneously lift arms, chest, and legs off the floor. Hold for 2 seconds.", "notes": "Strengthens posterior chain"},
            {"name": "Bird-Dog", "focus_area": "Core & Stability", "sets": sets_val, "reps": "10 per side", "rest_seconds": rest_val, "instruction": "On hands and knees, extend opposite arm and leg straight out. Return to start and alternate.", "notes": "Keep hips square to floor"}
        ],
        3: [
            {"name": "Forward Lunges", "focus_area": "Quads & Glutes", "sets": sets_val, "reps": "12 per leg", "rest_seconds": rest_val, "instruction": "Step forward with one leg, lower hips until both knees bend at 90-degree angles. Keep torso upright.", "notes": "Focus on balance"},
            {"name": "Glute Bridges", "focus_area": "Glutes & Hamstrings", "sets": sets_val, "reps": "15", "rest_seconds": rest_val, "instruction": "Lie on your back, knees bent. Raise hips off the floor until your knees, hips, and shoulders form a straight line.", "notes": "Squeeze glutes at top"},
            {"name": "Calf Raises", "focus_area": "Calves", "sets": sets_val, "reps": "20", "rest_seconds": rest_val, "instruction": "Stand on the edge of a step. Raise heels as high as possible, then lower them below the step level.", "notes": "Hold at the peak for 1 second"}
        ],
        4: [
            {"name": "Incline Pushups", "focus_area": "Lower Chest", "sets": sets_val, "reps": reps_val, "rest_seconds": rest_val, "instruction": "Place hands on an elevated surface like a bench. Lower chest to the surface and push up.", "notes": "Keep body straight"},
            {"name": "Tricep Bench Dips", "focus_area": "Triceps", "sets": sets_val, "reps": reps_val, "rest_seconds": rest_val, "instruction": "Sit on edge of a chair/bench. Slide off with hands supporting weight. Lower hips, then push back up.", "notes": "Keep elbows close to body"},
            {"name": "Shoulder Taps", "focus_area": "Shoulders & Core", "sets": sets_val, "reps": "20 total", "rest_seconds": rest_val, "instruction": "In a high plank, tap your left shoulder with your right hand, then right shoulder with left hand.", "notes": "Minimize hip rocking"}
        ],
        5: [
            {"name": "Mountain Climbers", "focus_area": "Core & Cardio", "sets": sets_val, "reps": "40 seconds" if "loss" in g or "endurance" in g else "30 seconds", "rest_seconds": rest_val, "instruction": "Start in a high plank. Alternate bringing knees to chest as fast as possible.", "notes": "Maintain a flat back"},
            {"name": "Burpees", "focus_area": "Full Body & Cardio", "sets": sets_val, "reps": "8-10" if "muscle" in g else "12-15", "rest_seconds": rest_val, "instruction": "Drop into a squat, kick feet back to plank, do a pushup, jump back to squat, then jump up explosively.", "notes": "Take your time"},
            {"name": "Jumping Jacks", "focus_area": "Full Body & Cardio", "sets": sets_val, "reps": "60 seconds" if "loss" in g or "endurance" in g else "45 seconds", "rest_seconds": rest_val, "instruction": "Start with feet together and arms at sides. Jump while spreading legs and raising arms overhead.", "notes": "Keep a steady rhythm"}
        ],
        6: [
            {"name": "High Knees", "focus_area": "Cardio & Legs", "sets": sets_val, "reps": "45 seconds", "rest_seconds": rest_val, "instruction": "Run in place, bringing your knees up to hip height. Pump your arms.", "notes": "Land softly on toes"},
            {"name": "Side Planks", "focus_area": "Obliques", "sets": sets_val, "reps": "30 seconds per side", "rest_seconds": rest_val, "instruction": "Lie on side supported by elbow. Lift hips until body is in straight line. Hold.", "notes": "Keep hips high"},
            {"name": "Flutter Kicks", "focus_area": "Lower Abs", "sets": sets_val, "reps": "30 seconds", "rest_seconds": rest_val, "instruction": "Lie on back, hands under hips. Lift legs slightly. Alternately kick legs up and down.", "notes": "Press lower back into floor"}
        ],
        7: [
            {"name": "Bodyweight Squats", "focus_area": "Quads & Glutes", "sets": sets_val, "reps": reps_val, "rest_seconds": rest_val, "instruction": "Stand with feet shoulder-width apart. Lower your hips back and down. Keep chest up.", "notes": "Focus on range of motion"},
            {"name": "Pushups", "focus_area": "Chest & Triceps", "sets": sets_val, "reps": reps_val, "rest_seconds": rest_val, "instruction": "Start in a high plank. Lower body until chest is just above floor. Push back up.", "notes": "Maintain strict form"},
            {"name": "Plank", "focus_area": "Core", "sets": sets_val, "reps": "45 seconds", "rest_seconds": rest_val, "instruction": "Hold a forearm plank position. Keep body in a straight line.", "notes": "Keep core tight"}
        ]
    }
    return exercises.get(day, [])


def _get_fallback_yoga_for_day(day: int) -> list:
    yoga = {
        1: [
            {"name": "Child's Pose", "focus_area": "Lower Back", "duration_seconds": 180, "difficulty": "beginner", "instruction": "Kneel, sit on heels, stretch arms forward and lower chest to floor.", "benefits": "Stretches lower back"}
        ],
        2: [
            {"name": "Cobra Pose", "focus_area": "Spine & Chest", "duration_seconds": 120, "difficulty": "beginner", "instruction": "Lie face down. Place hands under shoulders. Press tops of feet down and lift chest.", "benefits": "Strengthens spine and opens chest"}
        ],
        3: [
            {"name": "Downward-Facing Dog", "focus_area": "Hamstrings & Shoulders", "duration_seconds": 150, "difficulty": "beginner", "instruction": "Start on hands and knees. Lift hips up and back to form an inverted V shape. Keep heels pressing down.", "benefits": "Stretches hamstrings and calves, strengthens shoulders"}
        ],
        4: [
            {"name": "Warrior I Pose", "focus_area": "Hips & Legs", "duration_seconds": 180, "difficulty": "beginner", "instruction": "Step one foot back, bend front knee to 90 degrees. Reach arms overhead and look up.", "benefits": "Builds leg strength and stretches hips"}
        ],
        5: [
            {"name": "Tree Pose", "focus_area": "Legs & Balance", "duration_seconds": 120, "difficulty": "beginner", "instruction": "Stand on one leg, place the sole of other foot on inner thigh or calf. Bring hands to chest.", "benefits": "Improves balance and focus, strengthens ankles"}
        ],
        6: [
            {"name": "Sphinx Pose", "focus_area": "Lower Back & Chest", "duration_seconds": 180, "difficulty": "beginner", "instruction": "Lie on belly, elbows under shoulders, forearms flat. Press into forearms and lift chest.", "benefits": "Gentle backbend that opens chest and stimulates abdominal organs"}
        ],
        7: [
            {"name": "Cat-Cow Stretch", "focus_area": "Spine & Neck", "duration_seconds": 120, "difficulty": "beginner", "instruction": "On hands and knees, arch back up (Cat) then curve spine down and lift head (Cow).", "benefits": "Improves spinal mobility and coordination"}
        ]
    }
    return yoga.get(day, [])


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
    2. Every single day (Day 1 to 7) MUST include a full, personalized 'meals' diet plan matching the user's diet preferences and constraints. CRUCIAL: Provide highly diverse Indian meals. DO NOT repeat the same meals every day. Each day must have distinct, varied meal options.
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
                        "focus_area": "string (which muscle group)",
                        "sets": 3,
                        "reps": "string (e.g., '10-12' or '30 seconds')",
                        "rest_seconds": 60,
                        "instruction": "string (detailed execution steps)",
                        "notes": "string"
                    }}
                ],
                "yoga_routine": [
                    {{
                        "name": "string",
                        "focus_area": "string (targeted body part)",
                        "duration_seconds": 300,
                        "difficulty": "beginner|intermediate|advanced",
                        "instruction": "string (detailed steps)",
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
        
        # Calculate target calories and macros based on user profile
        targets = _calculate_fallback_targets(profile)
        
        # Select workout days dynamically to match exactly the user's input
        workout_days = set()
        w_days = profile.workout_days_per_week
        if w_days >= 7:
            workout_days = {1, 2, 3, 4, 5, 6, 7}
        elif w_days == 6:
            workout_days = {1, 2, 3, 5, 6, 7}
        elif w_days == 5:
            workout_days = {1, 2, 3, 5, 6}
        elif w_days == 4:
            workout_days = {1, 3, 5, 6}
        elif w_days == 3:
            workout_days = {1, 3, 5}
        elif w_days == 2:
            workout_days = {1, 5}
        else:
            workout_days = {1}
            
        daily_plans = []
        for d in range(1, 8):
            is_workout_day = d in workout_days
            focus = "Rest & Recovery"
            exercises = []
            yoga_routine = []
            
            if is_workout_day:
                if d == 1:
                    focus = "Full Body Conditioning"
                elif d == 2:
                    focus = "Core & Balance"
                elif d == 3:
                    focus = "Lower Body & Glutes"
                elif d == 4:
                    focus = "Upper Body Strength"
                elif d == 5:
                    focus = "Cardio & HIIT"
                elif d == 6:
                    focus = "Cardio & Core"
                else:
                    focus = "Full Body Strength"
                
                exercises = _get_fallback_exercises_for_day(d, profile.goal.value)
                
                if profile.yoga_interest:
                    yoga_routine = _get_fallback_yoga_for_day(d)
            
            daily_plans.append({
                "day": d,
                "focus": focus,
                "exercises": exercises,
                "yoga_routine": yoga_routine,
                "meals": _get_fallback_meals_for_day(d, profile.diet_preference.value, targets)
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
    2. Keep the diet plan consistent but introduce refreshing meal variations that match their macros and diet preferences. CRUCIAL: Provide highly diverse Indian meals. DO NOT repeat the same meals every day.
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
                        "focus_area": "string",
                        "sets": 3,
                        "reps": "string",
                        "rest_seconds": 60,
                        "instruction": "string",
                        "notes": "string"
                    }}
                ],
                "yoga_routine": [
                    {{
                        "name": "string",
                        "focus_area": "string",
                        "duration_seconds": 300,
                        "difficulty": "beginner|intermediate|advanced",
                        "instruction": "string",
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
