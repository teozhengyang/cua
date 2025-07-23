from fastapi import APIRouter, Depends
from app.models.schemas import HealthResponse
from app.config.settings import Settings
from app.api.dependencies import get_settings

router = APIRouter()


@router.get("/", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)) -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(
        message="FastAPI backend is running!",
        status="healthy",
        version=settings.version
    )


@router.get("/health", response_model=HealthResponse)
async def detailed_health_check(settings: Settings = Depends(get_settings)) -> HealthResponse:
    """Detailed health check endpoint."""
    return HealthResponse(
        message="All systems operational",
        status="healthy",
        version=settings.version
    )