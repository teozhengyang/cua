import logging
import sys
from app.config.settings import Settings


def setup_logging() -> None:
    """Configure application logging."""
    settings = Settings()
    
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper()),
        format=settings.log_format,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ]
    )
    
    # Configure third-party loggers
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("anthropic").setLevel(logging.WARNING)
    
    logger = logging.getLogger(__name__)
    logger.info("Logging configured successfully")