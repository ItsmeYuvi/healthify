from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.connection import get_database


async def get_users_collection(db: AsyncIOMotorDatabase = None):
    if db is None:
        db = await get_database()
    return db["users"]


async def get_fitness_profiles_collection(db: AsyncIOMotorDatabase = None):
    if db is None:
        db = await get_database()
    return db["fitness_profiles"]


async def get_fitness_plans_collection(db: AsyncIOMotorDatabase = None):
    if db is None:
        db = await get_database()
    return db["fitness_plans"]


async def get_workouts_collection(db: AsyncIOMotorDatabase = None):
    if db is None:
        db = await get_database()
    return db["workouts"]


async def get_meals_collection(db: AsyncIOMotorDatabase = None):
    if db is None:
        db = await get_database()
    return db["meals"]


async def get_progress_logs_collection(db: AsyncIOMotorDatabase = None):
    if db is None:
        db = await get_database()
    return db["progress_logs"]
