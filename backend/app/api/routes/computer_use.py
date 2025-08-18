from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Any, Dict, List
import logging

from app.models.schemas import ComputerActionRequest, ComputerActionResponse
from app.services.executor_client import ExecutorClient
from app.api.dependencies import get_executor_client
from app.core.exceptions import ActorServiceError

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/screenshot", response_model=ComputerActionResponse)
async def take_screenshot(
    executor_client: ExecutorClient = Depends(get_executor_client)
) -> ComputerActionResponse:
    """Take a screenshot of the current screen (proxied to executor)."""
    try:
        # Check executor health first
        is_healthy = await executor_client.health_check()
        if not is_healthy:
            raise HTTPException(status_code=503, detail="Executor service is not available")
        
        # For screenshot, we can make a direct HTTP call to the executor
        import httpx
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(f"{executor_client.executor_url}/computer/screenshot")
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to take screenshot")
            
            data = response.json()
            return ComputerActionResponse(**data)
            
    except ActorServiceError as e:
        logger.error(f"Executor client error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error taking screenshot: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/click", response_model=ComputerActionResponse)
async def click_at_coordinates(
    request: ComputerActionRequest,
    executor_client: ExecutorClient = Depends(get_executor_client)
) -> ComputerActionResponse:
    """Click at specific coordinates (proxied to executor)."""
    try:
        if not request.coordinate or len(request.coordinate) != 2:
            raise HTTPException(status_code=400, detail="Valid coordinates (x, y) are required")
        
        # Check executor health first
        is_healthy = await executor_client.health_check()
        if not is_healthy:
            raise HTTPException(status_code=503, detail="Executor service is not available")
        
        # Proxy to executor
        import httpx
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{executor_client.executor_url}/computer/click",
                json=request.dict()
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to click")
            
            data = response.json()
            return ComputerActionResponse(**data)
            
    except ActorServiceError as e:
        logger.error(f"Executor client error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error clicking: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/type", response_model=ComputerActionResponse)
async def type_text(
    request: ComputerActionRequest,
    executor_client: ExecutorClient = Depends(get_executor_client)
) -> ComputerActionResponse:
    """Type text at the current cursor position (proxied to executor)."""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        # Check executor health first
        is_healthy = await executor_client.health_check()
        if not is_healthy:
            raise HTTPException(status_code=503, detail="Executor service is not available")
        
        # Proxy to executor
        import httpx
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{executor_client.executor_url}/computer/type",
                json=request.dict()
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to type text")
            
            data = response.json()
            return ComputerActionResponse(**data)
            
    except ActorServiceError as e:
        logger.error(f"Executor client error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error typing: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/scroll", response_model=ComputerActionResponse)
async def scroll_page(
    request: ComputerActionRequest,
    executor_client: ExecutorClient = Depends(get_executor_client)
) -> ComputerActionResponse:
    """Scroll the page in the specified direction (proxied to executor)."""
    try:
        # Check executor health first
        is_healthy = await executor_client.health_check()
        if not is_healthy:
            raise HTTPException(status_code=503, detail="Executor service is not available")
        
        # Proxy to executor
        import httpx
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{executor_client.executor_url}/computer/scroll",
                json=request.dict()
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to scroll")
            
            data = response.json()
            return ComputerActionResponse(**data)
            
    except ActorServiceError as e:
        logger.error(f"Executor client error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error scrolling: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/tools")
async def get_available_tools(
    executor_client: ExecutorClient = Depends(get_executor_client)
) -> Dict[str, List[str]]:
    """Get list of available computer use tools (proxied to executor)."""
    try:
        tools = await executor_client.get_available_tools()
        return {"tools": tools}
    except Exception as e:
        logger.error(f"Error getting available tools: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/health")
async def check_executor_health(
    executor_client: ExecutorClient = Depends(get_executor_client)
) -> Dict[str, bool]:
    """Check if the executor service is healthy."""
    try:
        is_healthy = await executor_client.health_check()
        return {"healthy": is_healthy}
    except Exception as e:
        logger.error(f"Error checking executor health: {str(e)}")
        return {"healthy": False}
