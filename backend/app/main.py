import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.db.session import init_db, get_db
from app.api import upload, chat, tasks

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("workbench.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database tables and verify storage paths
    logger.info("Initializing %s v%s...", settings.PROJECT_NAME, settings.VERSION)
    try:
        init_db()
        logger.info("Database schemas ready.")
    except Exception as e:
        logger.error("Error during database startup: %s", e)
    
    yield
    
    # Shutdown
    logger.info("Shutting down %s...", settings.PROJECT_NAME)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Sovereign AI Workbench for Confidential Industrial Intelligence - Smart Automation for MRPL (PS ID 26117)",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Setup CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(upload.router, prefix=settings.API_V1_STR, tags=["Upload"])
app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["Chat"])
app.include_router(tasks.router, prefix=settings.API_V1_STR, tags=["Tasks"])
try:
    from app.api import network as network_api
    app.include_router(network_api.router, prefix=settings.API_V1_STR, tags=["Network"])
except Exception as e:  # pragma: no cover - defensive import
    logging.getLogger("workbench.api").warning("Could not mount network API router: %s", e)

@app.get("/health", status_code=status.HTTP_200_OK, tags=["System"])
@app.get(f"{settings.API_V1_STR}/health", status_code=status.HTTP_200_OK, tags=["System"])
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint to verify API and Database connectivity."""
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/", tags=["System"])
def root():
    return {
        "message": "Welcome to MRPL Sovereign AI Workbench API",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
