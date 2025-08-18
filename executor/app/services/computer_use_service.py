"""
Computer Use Service for managing computer automation tasks.
"""
import logging
from typing import List, Dict, Any, Optional
from anthropic.types.beta import BetaMessage, BetaTextBlock, BetaToolUseBlock

from app.config.settings import Settings
from app.tools import ComputerTool, BashTool, EditTool, ToolCollection, ToolResult
from app.core.exceptions import ActorServiceError

logger = logging.getLogger(__name__)


class ComputerUseService:
    """Service for managing computer use operations and tool execution."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.tool_collection = ToolCollection(
            ComputerTool(selected_screen=settings.selected_screen),
            BashTool(),
            EditTool(),
        )
        logger.info("ComputerUseService initialized successfully")
    
    async def execute_tool_use(self, tool_use_block: BetaToolUseBlock) -> ToolResult:
        """Execute a tool use block and return the result."""
        try:
            tool_name = tool_use_block.name
            tool_input = tool_use_block.input
            
            logger.info(f"Executing tool: {tool_name} with input: {tool_input}")
            
            # Use the tool collection's run method
            result = await self.tool_collection.run(name=tool_name, tool_input=tool_input)
            
            logger.info(f"Tool execution completed: {tool_name}")
            return result
            
        except Exception as e:
            logger.error(f"Error executing tool {tool_use_block.name}: {str(e)}")
            raise ActorServiceError(f"Tool execution failed: {str(e)}")
    
    async def process_message_with_tools(self, message: BetaMessage) -> List[Dict[str, Any]]:
        """Process a message that may contain tool use blocks."""
        results = []
        
        try:
            for content_block in message.content:
                if isinstance(content_block, BetaToolUseBlock):
                    # Execute the tool
                    tool_result = await self.execute_tool_use(content_block)
                    
                    # Format the result for response
                    result_data = {
                        "type": "tool_result",
                        "tool_use_id": content_block.id,
                        "content": tool_result.output
                    }
                    
                    # Add base64 image if available (for screenshots)
                    if hasattr(tool_result, 'base64_image') and tool_result.base64_image:
                        result_data["content"] = [
                            {"type": "text", "text": tool_result.output},
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/png",
                                    "data": tool_result.base64_image
                                }
                            }
                        ]
                    
                    results.append(result_data)
                    
                elif isinstance(content_block, BetaTextBlock):
                    # Handle text responses
                    results.append({
                        "type": "text",
                        "content": content_block.text
                    })
            
            return results
            
        except Exception as e:
            logger.error(f"Error processing message with tools: {str(e)}")
            raise ActorServiceError(f"Message processing failed: {str(e)}")
    
    def get_available_tools(self) -> List[str]:
        """Get list of available tools."""
        return list(self.tool_collection.tool_map.keys())
    
    async def take_screenshot(self) -> ToolResult:
        """Take a screenshot using the computer tool."""
        try:
            computer_tool = ComputerTool(selected_screen=self.settings.selected_screen)
            result = await computer_tool(action="screenshot")
            return result
        except Exception as e:
            logger.error(f"Error taking screenshot: {str(e)}")
            raise ActorServiceError(f"Screenshot failed: {str(e)}")
    
    async def click_at_coordinates(self, x: int, y: int) -> ToolResult:
        """Click at specific coordinates."""
        try:
            computer_tool = ComputerTool(selected_screen=self.settings.selected_screen)
            result = await computer_tool(action="left_click", coordinate=(x, y))
            return result
        except Exception as e:
            logger.error(f"Error clicking at coordinates ({x}, {y}): {str(e)}")
            raise ActorServiceError(f"Click failed: {str(e)}")
    
    async def type_text(self, text: str) -> ToolResult:
        """Type text using the computer tool."""
        try:
            computer_tool = ComputerTool(selected_screen=self.settings.selected_screen)
            result = await computer_tool(action="type", text=text)
            return result
        except Exception as e:
            logger.error(f"Error typing text: {str(e)}")
            raise ActorServiceError(f"Text input failed: {str(e)}")
    
    async def scroll(self, direction: str = "down", amount: int = 3) -> ToolResult:
        """Scroll in the specified direction."""
        try:
            computer_tool = ComputerTool(selected_screen=self.settings.selected_screen)
            result = await computer_tool(
                action="scroll", 
                scroll_direction=direction, 
                scroll_amount=amount
            )
            return result
        except Exception as e:
            logger.error(f"Error scrolling {direction}: {str(e)}")
            raise ActorServiceError(f"Scroll failed: {str(e)}")