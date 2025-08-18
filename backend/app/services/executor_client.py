"""
Executor Client Service for communicating with the standalone executor app.
"""
import logging
import httpx
from typing import List, Dict, Any, Optional
from anthropic.types.beta import BetaToolUseBlock

from app.config.settings import Settings
from app.core.exceptions import ActorServiceError

logger = logging.getLogger(__name__)


class ToolResult:
    """Simple tool result class for compatibility."""
    def __init__(self, output: str, base64_image: Optional[str] = None):
        self.output = output
        self.base64_image = base64_image


class ExecutorClient:
    """Client for communicating with the standalone executor service."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.executor_url = getattr(settings, 'executor_url', 'http://localhost:8001')
        self.timeout = 30.0
        logger.info(f"ExecutorClient initialized with URL: {self.executor_url}")
    
    async def execute_tool_use(self, tool_use_block: BetaToolUseBlock) -> ToolResult:
        """Execute a tool use block via the executor service."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "tool_name": tool_use_block.name,
                    "tool_input": tool_use_block.input,
                    "tool_use_id": tool_use_block.id
                }
                
                logger.info(f"Sending tool execution request to executor: {tool_use_block.name}")
                
                response = await client.post(
                    f"{self.executor_url}/computer/execute-tool",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code != 200:
                    error_msg = f"Executor returned status {response.status_code}: {response.text}"
                    logger.error(error_msg)
                    raise ActorServiceError(error_msg)
                
                result_data = response.json()
                
                if not result_data.get("success", False):
                    error_msg = result_data.get("error", "Unknown error from executor")
                    logger.error(f"Tool execution failed: {error_msg}")
                    raise ActorServiceError(error_msg)
                
                # Create a ToolResult object
                tool_result = ToolResult(output=result_data["output"])
                
                # Add base64_image if present
                if result_data.get("base64_image"):
                    tool_result.base64_image = result_data["base64_image"]
                
                logger.info(f"Tool execution completed successfully: {tool_use_block.name}")
                return tool_result
                
        except httpx.RequestError as e:
            error_msg = f"Failed to connect to executor service: {str(e)}"
            logger.error(error_msg)
            raise ActorServiceError(error_msg)
        except Exception as e:
            error_msg = f"Unexpected error during tool execution: {str(e)}"
            logger.error(error_msg)
            raise ActorServiceError(error_msg)
    
    async def get_available_tools(self) -> List[str]:
        """Get list of available tools from the executor service."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.executor_url}/computer/tools")
                
                if response.status_code != 200:
                    error_msg = f"Failed to get tools: {response.status_code}"
                    logger.error(error_msg)
                    raise ActorServiceError(error_msg)
                
                data = response.json()
                return data.get("tools", [])
                
        except httpx.RequestError as e:
            error_msg = f"Failed to connect to executor service: {str(e)}"
            logger.error(error_msg)
            raise ActorServiceError(error_msg)
        except Exception as e:
            error_msg = f"Unexpected error getting tools: {str(e)}"
            logger.error(error_msg)
            raise ActorServiceError(error_msg)
    
    async def health_check(self) -> bool:
        """Check if the executor service is healthy."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.executor_url}/health")
                return response.status_code == 200
        except Exception:
            return False
