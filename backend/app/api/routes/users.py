from fastapi import APIRouter, Depends
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def read_user_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "is_active": current_user.get("is_active", True),
    }
