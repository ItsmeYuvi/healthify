from motor.motor_asyncio import AsyncIOMotorClient
import certifi

from app.core.config import settings
from app.core.logging import logger

_client: AsyncIOMotorClient = None


async def get_db_client() -> AsyncIOMotorClient:
    """Return the singleton MongoDB client."""
    global _client
    if _client is None:
        logger.info("Initializing MongoDB connection...")
        _client = AsyncIOMotorClient(
            settings.mongodb_uri,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
        )
    return _client


async def get_database():
    """Return the Healthify database instance."""
    client = await get_db_client()
    return client[settings.mongodb_db_name]


async def close_db_connection():
    """Gracefully close MongoDB connection."""
    global _client
    if _client:
        _client.close()
        _client = None
        logger.info("MongoDB connection closed.")
