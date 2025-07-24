from enum import StrEnum


class APIProvider(StrEnum):
    """Supported API providers."""
    ANTHROPIC = "anthropic"
    BEDROCK = "bedrock"
    VERTEX = "vertex"
    OPENAI = "openai"
    QWEN = "qwen"
    SSH = "ssh"