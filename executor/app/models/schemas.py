from pydantic import BaseModel, Field
from typing import List, Optional, Tuple, Dict, Any


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


class ComputerActionRequest(BaseModel):
    """Request model for computer use actions."""
    action: Optional[str] = Field(None, description="Action type (click, type, scroll, etc.)")
    text: Optional[str] = Field(None, description="Text to type")
    coordinate: Optional[Tuple[int, int]] = Field(None, description="X, Y coordinates for click actions")
    scroll_direction: Optional[str] = Field("down", description="Scroll direction (up, down, left, right)")
    scroll_amount: Optional[int] = Field(3, description="Amount to scroll")


class ComputerActionResponse(BaseModel):
    """Response model for computer use actions."""
    success: bool = Field(..., description="Whether the action was successful")
    output: str = Field(..., description="Action result message")
    base64_image: Optional[str] = Field(None, description="Base64 encoded screenshot if applicable")
    error: Optional[str] = Field(None, description="Error message if action failed")


class ToolUseRequest(BaseModel):
    """Request model for tool use execution."""
    tool_name: str = Field(..., description="Name of the tool to execute")
    tool_input: Dict[str, Any] = Field(..., description="Input parameters for the tool")
    tool_use_id: str = Field(..., description="Unique identifier for this tool use")


class ToolUseResponse(BaseModel):
    """Response model for tool use execution."""
    success: bool = Field(..., description="Whether the tool execution was successful")
    tool_use_id: str = Field(..., description="The tool use ID from the request")
    output: str = Field(..., description="Tool execution result")
    base64_image: Optional[str] = Field(None, description="Base64 encoded image if applicable")
    error: Optional[str] = Field(None, description="Error message if execution failed")