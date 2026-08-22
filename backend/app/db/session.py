import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
from app.db.models import Base

logger = logging.getLogger("workbench.db")

def create_db_engine():
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            echo=False
        )
        # Test connection
        with engine.connect() as conn:
            logger.info("Successfully connected to primary database at %s", settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL)
        return engine
    except Exception as e:
        if settings.USE_SQLITE_FALLBACK:
            sqlite_url = "sqlite:///./workbench_local.db"
            logger.warning(
                "Failed to connect to primary DB (%s). Falling back to SQLite (%s) for local development.",
                e,
                sqlite_url
            )
            return create_engine(
                sqlite_url,
                connect_args={"check_same_thread": False},
                echo=False
            )
        else:
            logger.error("Database connection failed and fallback disabled: %s", e)
            raise e

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Create all tables defined in models if they do not exist."""
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")

def get_db():
    """FastAPI Dependency for database session injection."""
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
