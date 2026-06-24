from fastapi import APIRouter, HTTPException, Depends, status
from bson import ObjectId
from datetime import datetime

from app.models.fitness_profile import FitnessProfileCreate, FitnessProfileResponse
from app.models.plan import FitnessPlanCreate, FitnessPlanInDB, FitnessPlanResponse
from app.services.gemini_service import generate_fitness_plan
from app.db.collections import get_fitness_profiles_collection, get_fitness_plans_collection
from app.api.routes.auth import get_current_user
from app.core.logging import logger

router = APIRouter(prefix="/plans", tags=["Fitness Plans"])


@router.post("/profile", response_model=FitnessProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_profile(
    profile: FitnessProfileCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        profiles_col = await get_fitness_profiles_collection()
        profile_data = profile.model_dump()
        profile_data["user_id"] = str(current_user["_id"])
        profile_data["created_at"] = datetime.utcnow()
        profile_data["updated_at"] = datetime.utcnow()
        result = await profiles_col.insert_one(profile_data)
        
        created = await profiles_col.find_one({"_id": result.inserted_id})
        return {
            "id": str(created["_id"]),
            **{k: v for k, v in created.items() if k != "_id"}
        }
    except Exception as e:
        logger.error(f"Create profile error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create profile: {str(e)}")


@router.get("/profile", response_model=FitnessProfileResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    try:
        profiles_col = await get_fitness_profiles_collection()
        profile = await profiles_col.find_one({"user_id": str(current_user["_id"])})
        if not profile:
            raise HTTPException(status_code=404, detail="Fitness profile not found")
        return {
            "id": str(profile["_id"]),
            **{k: v for k, v in profile.items() if k != "_id"}
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get profile error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")


@router.post("/generate", response_model=FitnessPlanResponse, status_code=status.HTTP_201_CREATED)
async def generate_plan(
    plan_req: FitnessPlanCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        profiles_col = await get_fitness_profiles_collection()
        plans_col = await get_fitness_plans_collection()

        profile = await profiles_col.find_one({
            "_id": ObjectId(plan_req.profile_id),
            "user_id": str(current_user["_id"])
        })
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found for this user")

        # Remove internal fields before passing to Gemini
        profile_clean = {k: v for k, v in profile.items() if k not in ("_id", "user_id", "created_at", "updated_at")}
        from app.models.fitness_profile import FitnessProfileCreate
        profile_obj = FitnessProfileCreate(**profile_clean)

        plan_data = await generate_fitness_plan(profile_obj)

        plan_doc = {
            "user_id": str(current_user["_id"]),
            "profile_id": plan_req.profile_id,
            "plan_name": plan_data.get("plan_name", "Custom Plan"),
            "goal": plan_data.get("goal", profile_obj.goal.value),
            "duration_weeks": plan_data.get("duration_weeks", 1),
            "daily_plans": plan_data.get("daily_plans", []),
            "created_at": datetime.utcnow(),
        }
        result = await plans_col.insert_one(plan_doc)
        created = await plans_col.find_one({"_id": result.inserted_id})
        logger.info(f"Plan generated for user {current_user['_id']}: {plan_doc['plan_name']}")

        return {
            "id": str(created["_id"]),
            **{k: v for k, v in created.items() if k != "_id"}
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Generate plan error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate plan: {str(e)}")


@router.get("/", response_model=list[FitnessPlanResponse])
async def list_plans(current_user: dict = Depends(get_current_user)):
    try:
        plans_col = await get_fitness_plans_collection()
        cursor = plans_col.find({"user_id": str(current_user["_id"])})
        plans = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            plans.append(doc)
        return plans
    except Exception as e:
        logger.error(f"List plans error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch plans: {str(e)}")
