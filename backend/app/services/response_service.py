
from anthropic import APIResponse
from anthropic.types.beta import BetaMessage
from typing import Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class ResponseService:
    """Service for handling and storing API responses."""
    
    def __init__(self):
        self.response_state: Dict[str, Any] = {}
    
    def api_response_callback(self, response: APIResponse[BetaMessage]) -> None:
        """Callback to store API responses with timestamp."""
        try:
            response_id = datetime.now().isoformat()
            self.response_state[response_id] = response
            logger.debug(f"Stored response with ID: {response_id}")
        except Exception as e:
            logger.error(f"Error storing API response: {str(e)}")
    
    def get_response_count(self) -> int:
        """Get the total number of stored responses."""
        return len(self.response_state)
    
    def clear_old_responses(self, max_responses: int = 100) -> None:
        """Clear old responses to prevent memory buildup."""
        if len(self.response_state) > max_responses:
            # Keep only the most recent responses
            sorted_keys = sorted(self.response_state.keys())
            keys_to_remove = sorted_keys[:-max_responses]
            for key in keys_to_remove:
                del self.response_state[key]
            logger.info(f"Cleared {len(keys_to_remove)} old responses")
