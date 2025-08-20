from anthropic.types import TextBlock
from anthropic.types.beta import BetaMessage, BetaTextBlock, BetaToolUseBlock, BetaMessageParam
from typing import List, AsyncGenerator, Dict, Any, Optional, Tuple
from functools import partial
import logging
import time

from app.config.settings import Settings
from app.services.response_service import ResponseService
from app.services.executor_client import ExecutorClient
from app.planner.anthropic_agent import AnthropicActor
from app.core.exceptions import ActorServiceError
from app.services.summary_service import SummaryService

logger = logging.getLogger(__name__)


class ActorService:
    """Service for managing the Anthropic actor and text processing with conversation summarization."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.response_service = ResponseService()
        self.executor_client = ExecutorClient(settings)
        self._actor = self._create_actor()
        self.summary_service = SummaryService(self._actor)
        
        # Conversation state with summarization support
        self._conversation_history: List[BetaMessageParam] = []
        self.current_summary: Optional[str] = None
        self.messages_since_summary = 0
        self.summary_threshold = getattr(settings, 'summary_threshold', 5)
        
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
        return self.messages_since_summary >= self.summary_threshold
    
    def _create_summary(self):
        """Create a new conversation summary and clear history."""
        logger.info("Creating conversation summary...")
        self.current_summary = self.summary_service.create_summary(self._conversation_history)
        # Clear the entire history since we now have a summary
        self._conversation_history = []
        self.messages_since_summary = 0
        logger.info(f"Summary created successfully (length: {len(self.current_summary)} chars)")
        logger.info("Conversation history cleared - will use summary-only approach")
    
    def _create_messages_with_summary_only(self, new_user_message: Dict[str, Any]) -> List[BetaMessageParam]:
        """Create message list with only summary and new user message."""
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
            
            # Add new user message with continuation context
            messages.append({
                "role": "user",
                "content": [TextBlock(type="text", text=new_user_message["content"][0].text)]
            })
        else:
            # If no summary, just return the new user message
            messages.append(new_user_message)
        
        return messages
    
    def _get_api_messages_for_iteration(self, iteration: int, user_message: BetaMessageParam, text: str) -> List[BetaMessageParam]:
        """Get appropriate messages for the current iteration."""
        if iteration == 0:
            # For the first iteration
            if self.current_summary:
                # Use summary-only approach if we have a summary
                return self._create_messages_with_summary_only(user_message)
            else:
                # Use full history if no summary yet, but ensure we have at least the user message
                if self._conversation_history:
                    return self._conversation_history + [user_message]
                else:
                    # If no history yet (first message), just return the user message
                    return [user_message]
        else:
            # For subsequent iterations in the same conversation turn
            # Always use recent history (since we haven't summarized mid-turn)
            # Ensure we always return at least one message
            if self._conversation_history:
                return self._conversation_history
            else:
                # Fallback to user message if history is somehow empty
                return [user_message]
    
    def _create_mid_conversation_summary(self):
        """Create summary and clear history completely."""
        logger.info("Creating mid-conversation summary...")
        self.current_summary = self.summary_service.create_summary(self._conversation_history)
        
        # Clear the entire history since we now have a summary
        self._conversation_history = []
        self.messages_since_summary = 0
        
        logger.info(f"Mid-conversation summary created. History completely cleared.")
    
    def _format_tool_result_content(self, tool_result) -> Any:
        """Format tool result content for conversation."""
        if hasattr(tool_result, 'base64_image') and tool_result.base64_image:
            # For screenshots, include both text and image
            return [
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
            return str(tool_result.output)
    
    async def _execute_tool_and_create_result(self, content_block: BetaToolUseBlock) -> Dict[str, Any]:
        """Execute a tool and create the result dictionary."""
        try:
            tool_result = await self.executor_client.execute_tool_use(content_block)
            tool_result_content = self._format_tool_result_content(tool_result)
            
            return {
                "type": "tool_result",
                "tool_use_id": content_block.id,
                "content": tool_result_content
            }
        except Exception as e:
            logger.error(f"Tool execution failed: {str(e)}")
            return {
                "type": "tool_result",
                "tool_use_id": content_block.id,
                "content": f"Error: {str(e)}",
                "is_error": True
            }
    
    async def _process_message_content(self, beta_message: BetaMessage) -> Tuple[List[Dict[str, Any]], List[str], bool]:
        """Process message content and return tool results, text responses, and whether tools were used."""
        tool_results = []
        text_responses = []
        has_tool_use = False
        
        for content_block in beta_message.content:
            if isinstance(content_block, BetaToolUseBlock):
                has_tool_use = True
                logger.info(f"Executing tool: {content_block.name}")
                tool_result = await self._execute_tool_and_create_result(content_block)
                tool_results.append(tool_result)
            elif isinstance(content_block, BetaTextBlock):
                text_responses.append(content_block.text)
        
        return tool_results, text_responses, has_tool_use
    
    async def _process_message_content_with_stream(self, beta_message: BetaMessage) -> AsyncGenerator[Dict[str, Any], None]:
        """Process message content with streaming updates."""
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
                
                # Execute tool and get result
                tool_result_dict = await self._execute_tool_and_create_result(content_block)
                tool_results.append(tool_result_dict)
                
                # Send appropriate completion/error message
                if tool_result_dict.get("is_error"):
                    yield {
                        "type": "tool_error",
                        "tool_name": content_block.name,
                        "action": action,
                        "message": f"Error executing {tool_description}: {tool_result_dict['content']}",
                        "timestamp": time.time()
                    }
                else:
                    result_summary = str(tool_result_dict['content'])
                    if len(result_summary) > 200:
                        result_summary = result_summary[:200] + "..."
                    
                    yield {
                        "type": "tool_complete",
                        "tool_name": content_block.name,
                        "action": action,
                        "message": f"Completed {tool_description}",
                        "result_summary": result_summary,
                        "timestamp": time.time()
                    }
            
            elif isinstance(content_block, BetaTextBlock):
                text_responses.append(content_block.text)
                
                # Send assistant text response immediately
                yield {
                    "type": "assistant_message",
                    "message": content_block.text,
                    "timestamp": time.time()
                }
        
        # Return final results
        yield {
            "type": "processing_complete",
            "tool_results": tool_results,
            "text_responses": text_responses,
            "has_tool_use": has_tool_use
        }
    
    def _handle_iteration_results(
        self, 
        tool_results: List[Dict[str, Any]], 
        text_responses: List[str], 
        has_tool_use: bool, 
        responses: List[str]
    ) -> bool:
        """Handle iteration results and return whether to continue."""
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
                return True
        
        # If we have text responses, add them to our final responses
        if text_responses:
            responses.extend(text_responses)
            
        # If no tool use, we're done
        return has_tool_use
    
    async def process_text_with_tools_stream(self, text: str) -> AsyncGenerator[Dict[str, Any], None]:
        """Process text input with tool execution support and stream updates with summarization."""
        try:
            # Check if we need to create a summary before processing
            if self._should_create_summary():
                yield {
                    "type": "status",
                    "message": "Creating conversation summary...",
                    "timestamp": time.time()
                }
                
                self._create_summary()
                
                yield {
                    "type": "status",
                    "message": "Summary created, conversation history optimized...",
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
            
            iteration = 0
            while True:
                iteration += 1
                yield {
                    "type": "status",
                    "message": f"Processing request...",
                    "timestamp": time.time()
                }
                
                logger.info(f"Processing iteration {iteration}")
                
                # Get response from Claude
                yield {
                    "type": "status",
                    "message": "Getting response from Claude...",
                    "timestamp": time.time()
                }
                
                # Decide which messages to send to the actor
                api_messages = self._get_api_messages_for_iteration(iteration - 1, user_message, text)
                beta_message = self._actor(messages=api_messages)
                
                # Add assistant message to conversation history
                assistant_message = {
                    "role": "assistant",
                    "content": beta_message.content
                }
                self._conversation_history.append(assistant_message)
                self.messages_since_summary += 1
                
                # Process message content with streaming
                async for update in self._process_message_content_with_stream(beta_message):
                    if update["type"] == "processing_complete":
                        tool_results = update["tool_results"]
                        text_responses = update["text_responses"]
                        has_tool_use = update["has_tool_use"]
                        break
                    else:
                        yield update
                
                # Handle results and check if we should continue
                should_continue = self._handle_iteration_results(tool_results, text_responses, has_tool_use, responses)
                
                if not should_continue:
                    break
                
                # Check if we should create a mid-conversation summary
                if self._should_create_summary():
                    yield {
                        "type": "status",
                        "message": "Creating mid-conversation summary to optimize performance...",
                        "timestamp": time.time()
                    }
                    self._create_mid_conversation_summary()
            
            # Send final completion status
            yield {
                "type": "conversation_complete",
                "message": "Conversation completed successfully",
                "total_responses": len(responses),
                "conversation_stats": self.get_conversation_stats(),
                "timestamp": time.time()
            }
            
            logger.info(f"Processed {len(responses)} text blocks from conversation")
            self.response_service.clear_old_responses()
            
        except Exception as e:
            logger.error(f"Error processing text with tools stream: {str(e)}")
            yield {
                "type": "error",
                "message": f"Text processing failed: {str(e)}",
                "timestamp": time.time()
            }
            raise ActorServiceError(f"Text processing failed: {str(e)}")

    async def process_text_with_tools(self, text: str) -> List[str]:
        """Process text input with tool execution support in a conversation loop with summarization."""
        try:
            # Check if we need to create a summary before processing
            if self._should_create_summary():
                self._create_summary()
            
            # Add user message to conversation history
            user_message = {
                "role": "user",
                "content": [TextBlock(type="text", text=text)],
            }
            self._conversation_history.append(user_message)
            self.messages_since_summary += 1
            
            responses = []
            
            iteration = 0
            while True:
                iteration += 1
                logger.info(f"Processing iteration {iteration}")
                
                # Decide which messages to send to the actor
                api_messages = self._get_api_messages_for_iteration(iteration - 1, user_message, text)
                beta_message = self._actor(messages=api_messages)
                
                # Add assistant message to conversation history
                assistant_message = {
                    "role": "assistant",
                    "content": beta_message.content
                }
                self._conversation_history.append(assistant_message)
                self.messages_since_summary += 1
                
                # Process message content
                tool_results, text_responses, has_tool_use = await self._process_message_content(beta_message)
                
                # Handle results and check if we should continue
                should_continue = self._handle_iteration_results(tool_results, text_responses, has_tool_use, responses)
                
                if not should_continue:
                    break
                
                # Check if we should create a mid-conversation summary
                if self._should_create_summary():
                    self._create_mid_conversation_summary()
            
            logger.info(f"Processed {len(responses)} text blocks from conversation")
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
        self.current_summary = self.summary_service.create_summary(self._conversation_history)
        self._conversation_history = []  # Clear history after creating summary
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