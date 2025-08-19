from anthropic.types import TextBlock
from anthropic.types.beta import BetaMessage, BetaTextBlock, BetaToolUseBlock, BetaMessageParam
from typing import List, AsyncGenerator, Dict, Any, Optional
from functools import partial
import logging
import time
from datetime import datetime

from app.config.settings import Settings
from app.services.response_service import ResponseService
from app.services.executor_client import ExecutorClient
from app.planner.anthropic_agent import AnthropicActor
from app.core.exceptions import ActorServiceError

logger = logging.getLogger(__name__)


class ConversationSummarizer:
    """Handles conversation summarization logic."""
    
    def __init__(self, actor: AnthropicActor):
        self.actor = actor
    
    def create_summary(self, messages: List[BetaMessageParam]) -> str:
        """Create a summary of the conversation history."""
        try:
            # Create a summarization prompt
            conversation_text = self._format_conversation_for_summary(messages)
            
            summary_prompt = f"""
            Please create a concise summary of this computer use conversation between a user and an AI assistant.
            
            Focus on:
            1. The main task or goal the user is trying to achieve
            2. Key computer actions already taken (screenshots, clicks, typing, scrolling, etc.)
            3. Current state/progress toward the goal
            4. Any important context needed for continuing the task
            5. What has been accomplished so far
            
            Keep the summary under 500 words but include all essential context for continuing the computer use session.
            
            Conversation to summarize:
            {conversation_text}
            
            Summary:
            """
            
            summary_messages = [{
                "role": "user", 
                "content": [TextBlock(type="text", text=summary_prompt)]
            }]
            
            # Use a separate API call for summarization (won't interfere with tool execution)
            response = self.actor(messages=summary_messages)
            
            # Extract summary text
            summary = ""
            for block in response.content:
                if isinstance(block, BetaTextBlock):
                    summary += block.text
            
            return summary.strip()
            
        except Exception as e:
            logger.error(f"Error creating summary: {str(e)}")
            # Return a basic summary if AI summarization fails
            return self._create_basic_summary(messages)
    
    def _format_conversation_for_summary(self, messages: List[BetaMessageParam]) -> str:
        """Format conversation messages for summarization."""
        formatted = []
        
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            
            if isinstance(content, str):
                formatted.append(f"{role.upper()}: {content}")
            elif isinstance(content, list):
                text_parts = []
                tool_parts = []
                
                for item in content:
                    if isinstance(item, dict):
                        if item.get("type") == "text":
                            text_parts.append(item.get("text", ""))
                        elif item.get("type") == "tool_use":
                            tool_name = item.get("name", "unknown_tool")
                            tool_input = item.get("input", {})
                            tool_parts.append(f"Used {tool_name}: {self._format_tool_input(tool_input)}")
                        elif item.get("type") == "tool_result":
                            tool_id = item.get("tool_use_id", "unknown")
                            is_error = item.get("is_error", False)
                            status = "ERROR" if is_error else "SUCCESS"
                            # Don't include full image data in summary
                            content_summary = self._summarize_tool_result(item.get("content", ""))
                            tool_parts.append(f"Tool result ({status}): {content_summary}")
                    elif hasattr(item, 'type'):
                        # Handle BetaBlock objects
                        if item.type == "text":
                            text_parts.append(getattr(item, 'text', ''))
                        elif item.type == "tool_use":
                            tool_name = getattr(item, 'name', 'unknown_tool')
                            tool_input = getattr(item, 'input', {})
                            tool_parts.append(f"Used {tool_name}: {self._format_tool_input(tool_input)}")
                
                msg_text = " ".join(text_parts) if text_parts else ""
                tool_text = " | ".join(tool_parts) if tool_parts else ""
                
                full_text = f"{msg_text} {tool_text}".strip()
                if full_text:
                    formatted.append(f"{role.upper()}: {full_text}")
        
        return "\n\n".join(formatted)
    
    def _format_tool_input(self, tool_input: Dict[str, Any]) -> str:
        """Format tool input for summary."""
        if not tool_input:
            return ""
        
        # Simplify common tool inputs
        if "action" in tool_input:
            action = tool_input["action"]
            if action == "screenshot":
                return "took screenshot"
            elif action in ["left_click", "right_click", "double_click"]:
                coord = tool_input.get("coordinate", "")
                return f"{action} at {coord}" if coord else action
            elif action == "type":
                text = tool_input.get("text", "")
                return f"typed '{text[:50]}...'" if len(text) > 50 else f"typed '{text}'"
            elif action == "scroll":
                direction = tool_input.get("scroll_direction", "down")
                return f"scrolled {direction}"
        
        # For other inputs, show key-value pairs
        return ", ".join([f"{k}={v}" for k, v in tool_input.items()])
    
    def _summarize_tool_result(self, content) -> str:
        """Summarize tool result content for the summary."""
        if isinstance(content, list):
            # Look for text content, ignore images
            text_parts = []
            has_image = False
            for item in content:
                if isinstance(item, dict):
                    if item.get("type") == "text":
                        text_parts.append(item.get("text", ""))
                    elif item.get("type") == "image":
                        has_image = True
            
            result = " ".join(text_parts) if text_parts else "completed"
            if has_image:
                result += " (with screenshot)"
            return result
        else:
            # Simple string content
            content_str = str(content)
            return content_str[:100] + "..." if len(content_str) > 100 else content_str
    
    def _create_basic_summary(self, messages: List[BetaMessageParam]) -> str:
        """Create a basic summary when AI summarization fails."""
        user_messages = [msg for msg in messages if msg["role"] == "user"]
        tool_actions = []
        
        for msg in messages:
            if msg["role"] == "assistant" and isinstance(msg["content"], list):
                for item in msg["content"]:
                    if isinstance(item, dict) and item.get("type") == "tool_use":
                        action = item.get("input", {}).get("action", item.get("name", "unknown"))
                        tool_actions.append(action)
                    elif hasattr(item, 'type') and item.type == "tool_use":
                        action = getattr(item, 'input', {}).get("action", getattr(item, 'name', "unknown"))
                        tool_actions.append(action)
        
        summary = f"User has sent {len(user_messages)} messages. "
        if tool_actions:
            summary += f"Computer actions taken: {', '.join(set(tool_actions))}. "
        summary += f"Conversation started at {datetime.now().isoformat()}."
        
        return summary


class ActorService:
    """Service for managing the Anthropic actor and text processing with conversation summarization."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.response_service = ResponseService()
        self.executor_client = ExecutorClient(settings)
        self._actor = self._create_actor()
        self.summarizer = ConversationSummarizer(self._actor)
        
        # Conversation state with summarization support
        self._conversation_history: List[BetaMessageParam] = []
        self.current_summary: Optional[str] = None
        self.messages_since_summary = 0
        self.summary_threshold = getattr(settings, 'summary_threshold', 5)  # Summarize after N messages
        
        logger.info("ActorService initialized successfully with summarization support")
    
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
    
    def _should_create_summary(self) -> bool:
        """Determine if a new summary should be created."""
        return (
            len(self._conversation_history) > self.summary_threshold and
            self.messages_since_summary >= self.summary_threshold
        )
    
    def _create_messages_with_summary(self, new_user_message: Dict[str, Any]) -> List[BetaMessageParam]:
        """Create message list with summary instead of full history."""
        messages = []
        
        # Add summary if available
        if self.current_summary:
            summary_message = {
                "role": "user",
                "content": [TextBlock(
                    type="text", 
                    text=f"[CONVERSATION SUMMARY]\n{self.current_summary}\n[END SUMMARY]\n\nContinuing from where we left off..."
                )]
            }
            messages.append(summary_message)
        
        # Add recent messages (keep last few for immediate context)
        recent_messages_count = min(4, len(self._conversation_history))  # Keep last 4 messages
        if recent_messages_count > 0:
            messages.extend(self._conversation_history[-recent_messages_count:])
        
        # Add new user message
        messages.append(new_user_message)
        
        return messages

    async def process_text_with_tools_stream(self, text: str, max_iterations: int = 20) -> AsyncGenerator[Dict[str, Any], None]:
        """Process text input with tool execution support and stream updates with summarization."""
        try:
            # Check if we need to create a summary before processing
            if self._should_create_summary():
                yield {
                    "type": "status",
                    "message": "Creating conversation summary...",
                    "timestamp": time.time()
                }
                
                logger.info("Creating conversation summary...")
                self.current_summary = self.summarizer.create_summary(self._conversation_history)
                self.messages_since_summary = 0
                logger.info(f"Summary created successfully (length: {len(self.current_summary)} chars)")
                
                yield {
                    "type": "status",
                    "message": "Summary created, optimizing conversation history...",
                    "timestamp": time.time()
                }
            
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
            self.messages_since_summary += 1
            
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
                
                # Decide which messages to send to the actor
                if self.current_summary and iteration == 0:
                    # For the first iteration, use summary approach if we have one
                    api_messages = self._create_messages_with_summary(user_message)
                    # Remove the duplicate user message since it's already included
                    api_messages = api_messages[:-1] + [{
                        "role": "user",
                        "content": [TextBlock(type="text", text=text)]
                    }]
                else:
                    # For subsequent iterations or when no summary, use recent history
                    recent_count = min(8, len(self._conversation_history))
                    api_messages = self._conversation_history[-recent_count:]
                
                beta_message = self._actor(messages=api_messages)
                
                # Add assistant message to conversation history
                assistant_message = {
                    "role": "assistant",
                    "content": beta_message.content
                }
                self._conversation_history.append(assistant_message)
                self.messages_since_summary += 1
                
                # Check if the response contains tool use blocks
                tool_results = []
                text_responses = []
                has_tool_use = False
                
                for content_block in beta_message.content:
                    if isinstance(content_block, BetaToolUseBlock):
                        has_tool_use = True
                        logger.info(f"Executing tool: {content_block.name}")
                        
                        # Extract action for more descriptive messages
                        action = content_block.input.get('action', '') if isinstance(content_block.input, dict) else ''
                        tool_description = f"{action}" if action else content_block.name
                        
                        # Send tool execution status
                        yield {
                            "type": "tool_execution",
                            "tool_name": content_block.name,
                            "tool_input": content_block.input,
                            "action": action,
                            "message": f"Executing {tool_description}...",
                            "timestamp": time.time()
                        }
                        
                        # Execute the tool via executor service
                        try:
                            tool_result = await self.executor_client.execute_tool_use(content_block)

                            # Send tool completion
                            yield {
                                "type": "tool_complete",
                                "tool_name": content_block.name,
                                "action": action,
                                "message": f"Completed {tool_description}",
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
                                "action": action,
                                "message": f"Error executing {tool_description}: {str(e)}",
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
                        tool_result_message = {
                            "role": "user",
                            "content": tool_results
                        }
                        self._conversation_history.append(tool_result_message)
                        self.messages_since_summary += 1
                    
                    # If this was just tool use without final response, continue the loop
                    if not text_responses:
                        continue
                
                # If we have text responses, add them to our final responses
                if text_responses:
                    responses.extend(text_responses)
                    
                # If no tool use, we're done
                if not has_tool_use:
                    break
                
                # Check if we should create a mid-conversation summary to keep history manageable
                if self._should_create_summary():
                    yield {
                        "type": "status",
                        "message": "Creating mid-conversation summary to optimize performance...",
                        "timestamp": time.time()
                    }
                    
                    # Create summary but keep some recent context
                    logger.info("Creating mid-conversation summary...")
                    self.current_summary = self.summarizer.create_summary(self._conversation_history)
                    
                    # Keep only the most recent messages and clear the rest
                    recent_messages = self._conversation_history[-4:] if len(self._conversation_history) > 4 else self._conversation_history
                    self._conversation_history = recent_messages
                    self.messages_since_summary = len(recent_messages)
                    
                    logger.info(f"Mid-conversation summary created. History trimmed to {len(recent_messages)} recent messages")
            
            # Send final completion status
            yield {
                "type": "conversation_complete",
                "message": "Conversation completed successfully",
                "total_responses": len(responses),
                "conversation_stats": self.get_conversation_stats(),
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
        """Process text input with tool execution support in a conversation loop with summarization."""
        try:
            # Check if we need to create a summary before processing
            if self._should_create_summary():
                logger.info("Creating conversation summary...")
                self.current_summary = self.summarizer.create_summary(self._conversation_history)
                self.messages_since_summary = 0
                logger.info(f"Summary created successfully (length: {len(self.current_summary)} chars)")
            
            # Add user message to conversation history
            user_message = {
                "role": "user",
                "content": [TextBlock(type="text", text=text)],
            }
            self._conversation_history.append(user_message)
            self.messages_since_summary += 1
            
            responses = []
            
            for iteration in range(max_iterations):
                logger.info(f"Processing iteration {iteration + 1}/{max_iterations}")
                
                # Decide which messages to send to the actor
                if self.current_summary and iteration == 0:
                    # For the first iteration, use summary approach if we have one
                    api_messages = self._create_messages_with_summary(user_message)
                    # Remove the duplicate user message since it's already included
                    api_messages = api_messages[:-1] + [{
                        "role": "user",
                        "content": [TextBlock(type="text", text=text)]
                    }]
                else:
                    # For subsequent iterations or when no summary, use recent history
                    recent_count = min(8, len(self._conversation_history))
                    api_messages = self._conversation_history[-recent_count:]
                
                # Get response from Claude
                beta_message = self._actor(messages=api_messages)
                
                # Add assistant message to conversation history
                assistant_message = {
                    "role": "assistant",
                    "content": beta_message.content
                }
                self._conversation_history.append(assistant_message)
                self.messages_since_summary += 1
                
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
                        tool_result_message = {
                            "role": "user",
                            "content": tool_results
                        }
                        self._conversation_history.append(tool_result_message)
                        self.messages_since_summary += 1
                    
                    # If this was just tool use without final response, continue the loop
                    if not text_responses:
                        continue
                
                # If we have text responses, add them to our final responses
                if text_responses:
                    responses.extend(text_responses)
                    
                # If no tool use, we're done
                if not has_tool_use:
                    break
                
                # Check if we should create a mid-conversation summary to keep history manageable
                if self._should_create_summary():
                    logger.info("Creating mid-conversation summary...")
                    self.current_summary = self.summarizer.create_summary(self._conversation_history)
                    
                    # Keep only the most recent messages and clear the rest
                    recent_messages = self._conversation_history[-4:] if len(self._conversation_history) > 4 else self._conversation_history
                    self._conversation_history = recent_messages
                    self.messages_since_summary = len(recent_messages)
                    
                    logger.info(f"Mid-conversation summary created. History trimmed to {len(recent_messages)} recent messages")
            
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
        """Clear the conversation history and summary."""
        logger.info("Clearing conversation history and summary")
        self._conversation_history = []
        self.current_summary = None
        self.messages_since_summary = 0
    
    def get_conversation_length(self) -> int:
        """Get the number of messages in conversation history."""
        return len(self._conversation_history)
    
    def get_conversation_stats(self) -> Dict[str, Any]:
        """Get statistics about the current conversation."""
        return {
            "total_messages": len(self._conversation_history),
            "messages_since_summary": self.messages_since_summary,
            "has_summary": self.current_summary is not None,
            "summary_length": len(self.current_summary) if self.current_summary else 0,
            "summary_threshold": self.summary_threshold
        }
    
    def force_create_summary(self) -> str:
        """Force creation of a conversation summary."""
        if not self._conversation_history:
            return "No conversation history to summarize."
        
        logger.info("Force creating conversation summary...")
        self.current_summary = self.summarizer.create_summary(self._conversation_history)
        self.messages_since_summary = 0
        logger.info(f"Summary created successfully (length: {len(self.current_summary)} chars)")
        return self.current_summary
    
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