from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import Field


_ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
_ENV_PATH = _ROOT_DIR / ".env"


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # Gemini AI
    gemini_api_key: str = Field(..., alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-2.5-flash", alias="GEMINI_MODEL")

    # MongoDB
    mongodb_uri: str = Field(..., alias="MONGODB_URI")
    mongodb_db_name: str = Field(default="healthify_db", alias="MONGODB_DB_NAME")

    # API
    api_host: str = Field(default="0.0.0.0", alias="API_HOST")
    api_port: int = Field(default=8000, alias="API_PORT")
    api_base_url: str = Field(default="http://localhost:8000", alias="API_BASE_URL")

    # Frontend (for CORS)
    frontend_url: str = Field(default="http://localhost:3000", alias="FRONTEND_URL")

    # Security
    jwt_secret_key: str = Field(..., alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=7, alias="REFRESH_TOKEN_EXPIRE_DAYS")

    # Rate Limiting
    rate_limit_per_minute: int = Field(default=30, alias="RATE_LIMIT_PER_MINUTE")

    class Config:
        env_file = str(_ENV_PATH)
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
