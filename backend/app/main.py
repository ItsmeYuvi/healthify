from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import logger
from app.db.connection import close_db_connection
from app.api.routes import auth, plans, users, health


limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Healthify backend starting up...")
    yield
    logger.info("Healthify backend shutting down...")
    await close_db_connection()


app = FastAPI(
    title="Healthify API",
    description="AI-powered fitness, yoga & nutrition planner",
    version="1.0.0",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS - must list exact origins when allow_credentials=True
# "*" does NOT work with credentials in browsers
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
]

# Add the configured frontend URL (set via FRONTEND_URL env var on Render)
if settings.frontend_url and settings.frontend_url not in origins:
    origins.append(settings.frontend_url)

# Also add known production domains as fallback
known_production_domains = [
    "https://healthify-hmlk3dhmj-team-x17.vercel.app",
    "https://healthify-8nox0uj8v-team-x17.vercel.app",
    "https://healthify-team-x17.vercel.app",
]
for domain in known_production_domains:
    if domain not in origins:
        origins.append(domain)

logger.info(f"CORS configured for origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(plans.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(health.router, prefix="/api/v1")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
