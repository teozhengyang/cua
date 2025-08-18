from anthropic.types import TextBlock
from anthropic.types.beta import BetaMessage, BetaTextBlock, BetaToolUseBlock
from typing import List, AsyncGenerator, Dict, Any
from functools import partial
import logging
import time

from app.config.settings import Settings
from app.services.response_service import ResponseService
from app.services.executor_client import ExecutorClient
from app.planner.anthropic_agent import AnthropicActor
from app.core.exceptions import ActorServiceError

logger = logging.getLogger(__name__)


class ActorService:
    """Service for managing the Anthropic actor and text processing."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.response_service = ResponseService()
        self.executor_client = ExecutorClient(settings)
        self._actor = self._create_actor()
        self._conversation_history = []
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
    
    async def process_text_with_tools_stream(self, text: str, max_iterations: int = 20) -> AsyncGenerator[Dict[str, Any], None]:
        """Process text input with tool execution support and stream updates."""
        try:
            # Send initial status
            yield {
                "type": "status",
                "message": "Starting conversation...",
                "timestamp": time.time()
            }
            
            # Add user message to conversation history
            user_message = {
                "role": "user",
                "content": [TextBlock(type="text", text=text)],
            }
            self._conversation_history.append(user_message)
            
            # Send user message confirmation
            yield {
                "type": "user_message",
                "message": text,
                "timestamp": time.time()
            }
            
            responses = []
            
            for iteration in range(max_iterations):
                yield {
                    "type": "status",
                    "message": f"Processing iteration {iteration + 1}/{max_iterations}...",
                    "timestamp": time.time()
                }
                
                logger.info(f"Processing iteration {iteration + 1}/{max_iterations}")
                
                # Get response from Claude
                yield {
                    "type": "status",
                    "message": "Getting response from Claude...",
                    "timestamp": time.time()
                }
                
                beta_message = self._actor(messages=self._conversation_history)
                
                # Add assistant message to conversation history
                assistant_message = {
                    "role": "assistant",
                    "content": beta_message.content
                }
                self._conversation_history.append(assistant_message)
                
                # Check if the response contains tool use blocks
                tool_results = []
                text_responses = []
                has_tool_use = False
                
                for content_block in beta_message.content:
                    if isinstance(content_block, BetaToolUseBlock):
                        has_tool_use = True
                        logger.info(f"Executing tool: {content_block.name}")
                        
                        # Send tool execution status
                        yield {
                            "type": "tool_execution",
                            "tool_name": content_block.name,
                            "tool_input": content_block.input,
                            "message": f"Executing...",
                            "timestamp": time.time()
                        }
                        
                        # Execute the tool via executor service
                        try:
                            tool_result = await self.executor_client.execute_tool_use(content_block)
                            
                            # Send tool completion
                            yield {
                                "type": "tool_complete",
                                "tool_name": content_block.name,
                                "message": f"Completed {content_block.name}",
                                "result_summary": str(tool_result.output)[:200] + "..." if len(str(tool_result.output)) > 200 else str(tool_result.output),
                                "timestamp": time.time()
                            }
                            
                            # Create tool result for conversation - ensure proper format
                            if hasattr(tool_result, 'base64_image') and tool_result.base64_image:
                                # For screenshots, include both text and image
                                tool_result_content = [
                                    {"type": "text", "text": str(tool_result.output)},
                                    {
                                        "type": "image",
                                        "source": {
                                            "type": "base64",
                                            "media_type": "image/png",
                                            "data": tool_result.base64_image
                                        }
                                    }
                                ]
                            else:
                                # For other actions, just text
                                tool_result_content = str(tool_result.output)
                            
                            tool_results.append({
                                "type": "tool_result",
                                "tool_use_id": content_block.id,
                                "content": tool_result_content
                            })
                            
                        except Exception as e:
                            logger.error(f"Tool execution failed: {str(e)}")
                            
                            # Send tool error
                            yield {
                                "type": "tool_error",
                                "tool_name": content_block.name,
                                "message": f"Error executing {content_block.name}: {str(e)}",
                                "timestamp": time.time()
                            }
                            
                            tool_results.append({
                                "type": "tool_result",
                                "tool_use_id": content_block.id,
                                "content": f"Error: {str(e)}",
                                "is_error": True
                            })
                    
                    elif isinstance(content_block, BetaTextBlock):
                        text_responses.append(content_block.text)
                        
                        # Send assistant text response immediately
                        yield {
                            "type": "assistant_message",
                            "message": content_block.text,
                            "timestamp": time.time()
                        }
                
                # If there were tool uses, add the results to conversation and continue
                if has_tool_use:
                    if tool_results:
                        self._conversation_history.append({
                            "role": "user",
                            "content": tool_results
                        })
                    
                    # If this was just tool use without final response, continue the loop
                    if not text_responses:
                        continue
                
                # If we have text responses, add them to our final responses
                if text_responses:
                    responses.extend(text_responses)
                    
                # If no tool use, we're done
                if not has_tool_use:
                    break
            
            # Send final completion status
            yield {
                "type": "conversation_complete",
                "message": "Conversation completed successfully",
                "total_responses": len(responses),
                "timestamp": time.time()
            }
            
            logger.info(f"Processed {len(responses)} text blocks from conversation")
            
            # Clean up old responses periodically
            self.response_service.clear_old_responses()
            
        except Exception as e:
            logger.error(f"Error processing text with tools stream: {str(e)}")
            yield {
                "type": "error",
                "message": f"Text processing failed: {str(e)}",
                "timestamp": time.time()
            }
            raise ActorServiceError(f"Text processing failed: {str(e)}")

    async def process_text_with_tools(self, text: str, max_iterations: int = 20) -> List[str]:
        """Process text input with tool execution support in a conversation loop."""
        try:
            # Add user message to conversation history
            user_message = {
                "role": "user",
                "content": [TextBlock(type="text", text=text)],
            }
            self._conversation_history.append(user_message)
            
            responses = []
            
            for iteration in range(max_iterations):
                logger.info(f"Processing iteration {iteration + 1}/{max_iterations}")
                
                # Get response from Claude
                beta_message = self._actor(messages=self._conversation_history)
                
                # Add assistant message to conversation history
                assistant_message = {
                    "role": "assistant",
                    "content": beta_message.content
                }
                self._conversation_history.append(assistant_message)
                
                # Check if the response contains tool use blocks
                tool_results = []
                text_responses = []
                has_tool_use = False
                
                for content_block in beta_message.content:
                    if isinstance(content_block, BetaToolUseBlock):
                        has_tool_use = True
                        logger.info(f"Executing tool: {content_block.name}")
                        
                        # Execute the tool via executor service
                        try:
                            tool_result = await self.executor_client.execute_tool_use(content_block)
                            
                            # Create tool result for conversation - ensure proper format
                            if hasattr(tool_result, 'base64_image') and tool_result.base64_image:
                                # For screenshots, include both text and image
                                tool_result_content = [
                                    {"type": "text", "text": str(tool_result.output)},
                                    {
                                        "type": "image",
                                        "source": {
                                            "type": "base64",
                                            "media_type": "image/png",
                                            "data": tool_result.base64_image
                                        }
                                    }
                                ]
                            else:
                                # For other actions, just text
                                tool_result_content = str(tool_result.output)
                            
                            tool_results.append({
                                "type": "tool_result",
                                "tool_use_id": content_block.id,
                                "content": tool_result_content
                            })
                            
                        except Exception as e:
                            logger.error(f"Tool execution failed: {str(e)}")
                            tool_results.append({
                                "type": "tool_result",
                                "tool_use_id": content_block.id,
                                "content": f"Error: {str(e)}",
                                "is_error": True
                            })
                    
                    elif isinstance(content_block, BetaTextBlock):
                        text_responses.append(content_block.text)
                
                # If there were tool uses, add the results to conversation and continue
                if has_tool_use:
                    if tool_results:
                        self._conversation_history.append({
                            "role": "user",
                            "content": tool_results
                        })
                    
                    # If this was just tool use without final response, continue the loop
                    if not text_responses:
                        continue
                
                # If we have text responses, add them to our final responses
                if text_responses:
                    responses.extend(text_responses)
                    
                # If no tool use, we're done
                if not has_tool_use:
                    break
            
            logger.info(f"Processed {len(responses)} text blocks from conversation")
            
            # Clean up old responses periodically
            self.response_service.clear_old_responses()
            
            return responses if responses else ["I completed the requested actions."]
            
        except Exception as e:
            logger.error(f"Error processing text with tools: {str(e)}")
            raise ActorServiceError(f"Text processing failed: {str(e)}")
    
    def process_text(self, text: str) -> List[str]:
        """Process text input and return extracted text blocks (legacy method)."""
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
    
    def clear_conversation_history(self):
        """Clear the conversation history."""
        self._conversation_history = []
        logger.info("Conversation history cleared")
    
    def get_conversation_length(self) -> int:
        """Get the number of messages in conversation history."""
        return len(self._conversation_history)
    
    async def get_available_tools(self) -> List[str]:
        """Get list of available tools from executor service."""
        try:
            return await self.executor_client.get_available_tools()
        except Exception as e:
            logger.error(f"Error getting available tools: {str(e)}")
            raise ActorServiceError(f"Failed to get available tools: {str(e)}")
    
    async def check_executor_health(self) -> bool:
        """Check if the executor service is healthy."""
        try:
            return await self.executor_client.health_check()
        except Exception as e:
            logger.error(f"Error checking executor health: {str(e)}")
            return False
