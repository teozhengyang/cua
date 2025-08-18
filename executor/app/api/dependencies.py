from functools import lru_cache
from app.config.settings import Settings
from app.services.computer_use_service import ComputerUseService


@lru_cache()
def get_settings() -> Settings:
    """Get application settings (cached singleton)."""
    return Settings()

@lru_cache()
def get_computer_use_service() -> ComputerUseService:
    """Get computer use service instance (cached singleton)."""
    settings = get_settings()
    return ComputerUseService(settings)