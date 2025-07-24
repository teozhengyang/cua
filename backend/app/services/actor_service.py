from anthropic.types import TextBlock
from anthropic.types.beta import BetaMessage, BetaTextBlock
from typing import List
from functools import partial
import logging

from app.config.settings import Settings
from app.services.response_service import ResponseService
from app.planner.anthropic_agent import AnthropicActor
from app.core.exceptions import ActorServiceError

logger = logging.getLogger(__name__)


class ActorService:
    """Service for managing the Anthropic actor and text processing."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.response_service = ResponseService()
        self._actor = self._create_actor()
        logger.info("ActorService initialized successfully")
    
    def _create_actor(self) -> AnthropicActor:
        """Create and configure the Anthropic actor."""
        try:
            return AnthropicActor(
                model=self.settings.planner_model,
                provider=self.settings.actor_provider,
                system_prompt_suffix=self.settings.system_prompt_suffix,
                api_key=self.settings.api_key,
                api_response_callback=partial(
                    self.response_service.api_response_callback
                ),
                max_tokens=self.settings.max_tokens,
                only_n_most_recent_images=self.settings.only_n_most_recent_images,
                selected_screen=self.settings.selected_screen
            )
        except Exception as e:
            logger.error(f"Failed to create actor: {str(e)}")
            raise ActorServiceError(f"Actor initialization failed: {str(e)}")
    
    def process_text(self, text: str) -> List[str]:
        """Process text input and return extracted text blocks."""
        try:
            messages = [
                {
                    "role": "user",
                    "content": [TextBlock(type="text", text=text)],
                }
            ]
            
            logger.info(f"Processing text input (length: {len(text)})")
            beta_message = self._actor(messages=messages)
            
            # Extract text blocks
            texts = [
                block.text
                for block in beta_message.content
                if isinstance(block, BetaTextBlock)
            ]
            
            logger.info(f"Extracted {len(texts)} text blocks from response")
            
            # Clean up old responses periodically
            self.response_service.clear_old_responses()
            
            return texts
            
        except Exception as e:
            logger.error(f"Error processing text: {str(e)}")
            raise ActorServiceError(f"Text processing failed: {str(e)}")
    
    def process_text_raw(self, text: str) -> BetaMessage:
        """Process text input and return raw response."""
        try:
            messages = [
                {
                    "role": "user",
                    "content": [TextBlock(type="text", text=text)],
                }
            ]
            
            logger.info(f"Processing raw text input (length: {len(text)})")
            response = self._actor(messages=messages)
            
            # Clean up old responses periodically
            self.response_service.clear_old_responses()
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing raw text: {str(e)}")
            raise ActorServiceError(f"Raw text processing failed: {str(e)}")
