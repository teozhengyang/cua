from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Any, Dict
import logging

from app.models.schemas import TextRequest, TextResponse
from app.services.actor_service import ActorService
from app.api.dependencies import get_actor_service
from app.core.exceptions import ActorServiceError

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=TextResponse)
async def process_message(
    request: TextRequest,
    actor_service: ActorService = Depends(get_actor_service)
) -> TextResponse:
    """Process text item and return extracted text blocks."""
    try:
        texts = actor_service.process_text(request.text)
        return TextResponse(response=texts)
    except ActorServiceError as e:
        logger.error(f"Actor service error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error processing item: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/raw")
async def process_item_raw(
    request: TextRequest,
    actor_service: ActorService = Depends(get_actor_service)
) -> JSONResponse:
    """Process text item and return raw response."""
    try:
        response = actor_service.process_text_raw(request.text)
        
        # Handle Pydantic model serialization
        if hasattr(response, "model_dump"):
            content = response.model_dump()
        elif hasattr(response, "dict"):
            content = response.dict()
        else:
            content = response.__dict__
        
        return JSONResponse(content=content)
    except ActorServiceError as e:
        logger.error(f"Actor service error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error processing raw item: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
