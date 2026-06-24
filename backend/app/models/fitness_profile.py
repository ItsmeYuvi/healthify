from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class FitnessGoal(str, Enum):
    FAT_LOSS = "fat_loss"
    WEIGHT_GAIN = "weight_gain"
    MUSCLE_BUILD = "muscle_build"
    ENDURANCE = "endurance"
    FLEXIBILITY = "flexibility"
    GENERAL_HEALTH = "general_health"


class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"
    LIGHTLY_ACTIVE = "lightly_active"
    MODERATELY_ACTIVE = "moderately_active"
    VERY_ACTIVE = "very_active"
    SUPER_ACTIVE = "super_active"


class DietPreference(str, Enum):
    NO_PREFERENCE = "no_preference"
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    KETO = "keto"
    PALEO = "paleo"
    HALAL = "halal"
    GLUTEN_FREE = "gluten_free"


class FitnessProfileCreate(BaseModel):
    goal: FitnessGoal
    age: int = Field(..., ge=10, le=100)
    gender: str = Field(..., pattern="^(male|female|other)$")
    height_cm: float = Field(..., ge=50, le=300)
    weight_kg: float = Field(..., ge=20, le=500)
    activity_level: ActivityLevel
    diet_preference: DietPreference = DietPreference.NO_PREFERENCE
    allergies: Optional[List[str]] = Field(default_factory=list)
    medical_conditions: Optional[List[str]] = Field(default_factory=list)
    workout_days_per_week: int = Field(default=3, ge=1, le=7)
    workout_duration_minutes: int = Field(default=45, ge=10, le=300)
    yoga_interest: bool = False


class FitnessProfileInDB(FitnessProfileCreate):
    id: str = Field(..., alias="_id")
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class FitnessProfileResponse(FitnessProfileCreate):
    id: str
    user_id: str
    created_at: datetime
