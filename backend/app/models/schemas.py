from pydantic import BaseModel, Field
from typing import List


class TextRequest(BaseModel):
    """Request model for text input."""
    text: str = Field(..., description="Input text to process", min_length=1)


class TextResponse(BaseModel):
    """Response model for processed text."""
    response: List[str] = Field(default_factory=list, description="Processed text blocks")


class HealthResponse(BaseModel):
    """Health check response model."""
    message: str
    status: str
    version: str