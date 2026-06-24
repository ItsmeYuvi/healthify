from fastapi import APIRouter
from app.db.connection import get_database

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "healthify-backend"}


@router.get("/health/db")
async def db_health_check():
    try:
        db = await get_database()
        await db.command("ping")
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}
