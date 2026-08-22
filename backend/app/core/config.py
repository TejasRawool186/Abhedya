import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List

# Base backend directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "MRPL Sovereign AI Workbench API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Database: Default to Postgres, fallback or configurable via env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://mrpl:mrpl@localhost:5432/workbench")
    # Set USE_SQLITE_FALLBACK=True to auto-fallback to sqlite if Postgres fails to connect
    USE_SQLITE_FALLBACK: bool = True

    # Storage paths
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))
    DELIVERABLES_DIR: str = os.getenv("DELIVERABLES_DIR", str(BASE_DIR / "deliverables"))

    # CORS origins for frontend UI
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    # External air-gap services
    OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "http://localhost:6333")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

# Ensure storage directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.DELIVERABLES_DIR, exist_ok=True)
