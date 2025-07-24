from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # API Configuration
    title: str
    description: str
    version: str
    host: str
    port: int
    debug: bool

    # Actor Configuration
    planner_model: str
    actor_provider: str
    system_prompt_suffix: str
    api_key: str
    max_tokens: int
    only_n_most_recent_images: int
    selected_screen: int

    # Logging Configuration
    log_level: str
    log_format: str

    class Config:
        env_file = ".env"
        case_sensitive = False