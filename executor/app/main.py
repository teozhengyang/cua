from fastapi import FastAPI
from app.config.settings import Settings
from app.api.routes import computer_use
from app.core.logging import setup_logging
import logging

from fastapi.middleware.cors import CORSMiddleware 

logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    settings = Settings()
    
    # Setup logging
    setup_logging()
    
    app = FastAPI(
        title=settings.title,
        description=settings.description,
        version=settings.version,
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(computer_use.router, prefix="/computer", tags=["Computer Use"])
    
    logger.info(f"FastAPI application created: {settings.title} v{settings.version}")
    
    return app
