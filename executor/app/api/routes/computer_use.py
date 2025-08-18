from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Any, Dict, List
import logging

from app.models.schemas import ComputerActionRequest, ComputerActionResponse, ToolUseRequest, ToolUseResponse
from app.services.computer_use_service import ComputerUseService
from app.api.dependencies import get_computer_use_service
from app.core.exceptions import ActorServiceError

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/screenshot", response_model=ComputerActionResponse)
async def take_screenshot(
    computer_service: ComputerUseService = Depends(get_computer_use_service)
) -> ComputerActionResponse:
    """Take a screenshot of the current screen."""
    try:
        result = await computer_service.take_screenshot()
        return ComputerActionResponse(
            success=True,
            output=result.output,
            base64_image=getattr(result, 'base64_image', None)
        )
    except ActorServiceError as e:
        logger.error(f"Computer use service error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error taking screenshot: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/click", response_model=ComputerActionResponse)
async def click_at_coordinates(
    request: ComputerActionRequest,
    computer_service: ComputerUseService = Depends(get_computer_use_service)
) -> ComputerActionResponse:
    """Click at specific coordinates."""
    try:
        if not request.coordinate or len(request.coordinate) != 2:
            raise HTTPException(status_code=400, detail="Valid coordinates (x, y) are required")
        
        x, y = request.coordinate
        result = await computer_service.click_at_coordinates(x, y)
        return ComputerActionResponse(
            success=True,
            output=result.output,
            base64_image=getattr(result, 'base64_image', None)
        )
    except ActorServiceError as e:
        logger.error(f"Computer use service error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error clicking: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/type", response_model=ComputerActionResponse)
async def type_text(
    request: ComputerActionRequest,
    computer_service: ComputerUseService = Depends(get_computer_use_service)
) -> ComputerActionResponse:
    """Type text at the current cursor position."""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        result = await computer_service.type_text(request.text)
        return ComputerActionResponse(
            success=True,
            output=result.output,
            base64_image=getattr(result, 'base64_image', None)
        )
    except ActorServiceError as e:
        logger.error(f"Computer use service error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error typing: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/scroll", response_model=ComputerActionResponse)
async def scroll_page(
    request: ComputerActionRequest,
    computer_service: ComputerUseService = Depends(get_computer_use_service)
) -> ComputerActionResponse:
    """Scroll the page in the specified direction."""
    try:
        direction = request.scroll_direction or "down"
        amount = request.scroll_amount or 3
        
        result = await computer_service.scroll(direction, amount)
        return ComputerActionResponse(
            success=True,
            output=result.output,
            base64_image=getattr(result, 'base64_image', None)
        )
    except ActorServiceError as e:
        logger.error(f"Computer use service error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error scrolling: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/execute-tool", response_model=ToolUseResponse)
async def execute_tool_use(
    request: ToolUseRequest,
    computer_service: ComputerUseService = Depends(get_computer_use_service)
) -> ToolUseResponse:
    """Execute a tool use block with the specified tool and input."""
    try:
        # Create a mock tool use block for compatibility
        class MockToolUseBlock:
            def __init__(self, name: str, input_data: Dict[str, Any], tool_id: str):
                self.name = name
                self.input = input_data
                self.id = tool_id
        
        mock_block = MockToolUseBlock(
            name=request.tool_name,
            input_data=request.tool_input,
            tool_id=request.tool_use_id
        )
        
        result = await computer_service.execute_tool_use(mock_block)
        
        return ToolUseResponse(
            success=True,
            tool_use_id=request.tool_use_id,
            output=result.output,
            base64_image=getattr(result, 'base64_image', None)
        )
    except ActorServiceError as e:
        logger.error(f"Computer use service error: {str(e)}")
        return ToolUseResponse(
            success=False,
            tool_use_id=request.tool_use_id,
            output="",
            error=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error executing tool: {str(e)}")
        return ToolUseResponse(
            success=False,
            tool_use_id=request.tool_use_id,
            output="",
            error="Internal server error"
        )


@router.get("/tools")
async def get_available_tools(
    computer_service: ComputerUseService = Depends(get_computer_use_service)
) -> Dict[str, List[str]]:
    """Get list of available computer use tools."""
    try:
        tools = computer_service.get_available_tools()
        return {"tools": tools}
    except Exception as e:
        logger.error(f"Error getting available tools: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
