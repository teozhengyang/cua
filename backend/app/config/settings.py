from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # API Configuration
    title: str = "Computer Use Agent API"
    description: str = "FastAPI backend for Computer Use Agent with Anthropic Claude integration"
    version: str = "1.0.0"
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True

    # Actor Configuration
    planner_model: str = "claude-3-5-sonnet-20241022"
    actor_provider: str = "anthropic"
    system_prompt_suffix: str = "You are a helpful computer use agent that can interact with the desktop environment."
    api_key: str = ""
    max_tokens: int = 4096
    only_n_most_recent_images: int = 10
    selected_screen: int = 0

    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    class Config:
        env_file = ".env"
        case_sensitive = False