from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class Exercise(BaseModel):
    name: str
    sets: int
    reps: str
    rest_seconds: int
    notes: Optional[str] = None


class YogaPose(BaseModel):
    name: str
    duration_seconds: int
    difficulty: str
    benefits: str


class Meal(BaseModel):
    meal_type: str  # breakfast, lunch, dinner, snack
    name: str
    calories: int
    protein_g: float
    carbs_g: float
    fats_g: float
    ingredients: List[str]
    instructions: Optional[str] = None


class DayPlan(BaseModel):
    day: int
    focus: str
    exercises: Optional[List[Exercise]] = None
    yoga_routine: Optional[List[YogaPose]] = None
    meals: Optional[List[Meal]] = None


class FitnessPlanCreate(BaseModel):
    profile_id: str


class FitnessPlanInDB(FitnessPlanCreate):
    id: str = Field(..., alias="_id")
    user_id: str
    plan_name: str
    goal: str
    duration_weeks: int
    week_number: int = Field(default=1)
    daily_plans: List[DayPlan]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class WeekInfo(BaseModel):
    id: str
    week_number: int


class FitnessPlanResponse(BaseModel):
    id: str
    user_id: str
    profile_id: str
    plan_name: str
    goal: str
    duration_weeks: int
    week_number: int = 1
    daily_plans: List[DayPlan]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    weeks: Optional[List[WeekInfo]] = None
