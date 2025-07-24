from functools import lru_cache
from app.config.settings import Settings
from app.services.actor_service import ActorService


@lru_cache()
def get_settings() -> Settings:
    """Get application settings (cached singleton)."""
    return Settings()


@lru_cache()
def get_actor_service() -> ActorService:
    """Get actor service instance (cached singleton)."""
    settings = get_settings()
    return ActorService(settings)