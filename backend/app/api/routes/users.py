from fastapi import APIRouter, Depends, HTTPException, status
from app.api.routes.auth import get_current_user
from app.db.collections import get_users_collection, get_fitness_profiles_collection, get_fitness_plans_collection
from app.core.logging import logger

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def read_user_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "is_active": current_user.get("is_active", True),
    }


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(current_user: dict = Depends(get_current_user)):
    try:
        users_col = await get_users_collection()
        profiles_col = await get_fitness_profiles_collection()
        plans_col = await get_fitness_plans_collection()
        
        user_id = str(current_user["_id"])
        
        # Delete user plans, profiles, and user record
        await plans_col.delete_many({"user_id": user_id})
        await profiles_col.delete_many({"user_id": user_id})
        await users_col.delete_one({"_id": current_user["_id"]})
        
        logger.info(f"User deleted: {current_user['email']}")
        return
    except Exception as e:
        logger.error(f"Delete user error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete account: {str(e)}")
