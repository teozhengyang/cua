from anthropic.types import TextBlock
from anthropic.types.beta import BetaTextBlock, BetaMessageParam
from typing import List, Dict, Any
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class SummaryService:
    """Handles conversation summarization logic."""
    
    def __init__(self, actor):
        self.actor = actor
    
    def create_summary(self, messages: List[BetaMessageParam]) -> str:
        """Create a summary of the conversation history."""
        try:
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
                text_parts, tool_parts = self._process_message_content(content)
                
                msg_text = " ".join(text_parts) if text_parts else ""
                tool_text = " | ".join(tool_parts) if tool_parts else ""
                
                full_text = f"{msg_text} {tool_text}".strip()
                if full_text:
                    formatted.append(f"{role.upper()}: {full_text}")
        
        return "\n\n".join(formatted)
    
    def _process_message_content(self, content: List) -> tuple[List[str], List[str]]:
        """Process message content and return text parts and tool parts."""
        text_parts = []
        tool_parts = []
        
        for item in content:
            if isinstance(item, dict):
                text_parts, tool_parts = self._process_dict_content_item(item, text_parts, tool_parts)
            elif hasattr(item, 'type'):
                text_parts, tool_parts = self._process_block_content_item(item, text_parts, tool_parts)
        
        return text_parts, tool_parts
    
    def _process_dict_content_item(self, item: Dict[str, Any], text_parts: List[str], tool_parts: List[str]) -> tuple[List[str], List[str]]:
        """Process dictionary content items."""
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
            content_summary = self._summarize_tool_result(item.get("content", ""))
            tool_parts.append(f"Tool result ({status}): {content_summary}")
        
        return text_parts, tool_parts
    
    def _process_block_content_item(self, item, text_parts: List[str], tool_parts: List[str]) -> tuple[List[str], List[str]]:
        """Process block content items."""
        if item.type == "text":
            text_parts.append(getattr(item, 'text', ''))
        elif item.type == "tool_use":
            tool_name = getattr(item, 'name', 'unknown_tool')
            tool_input = getattr(item, 'input', {})
            tool_parts.append(f"Used {tool_name}: {self._format_tool_input(tool_input)}")
        
        return text_parts, tool_parts
    
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
        tool_actions = self._extract_tool_actions_from_messages(messages)
        
        summary = f"User has sent {len(user_messages)} messages. "
        if tool_actions:
            summary += f"Computer actions taken: {', '.join(set(tool_actions))}. "
        summary += f"Conversation started at {datetime.now().isoformat()}."
        
        return summary
    
    def _extract_tool_actions_from_messages(self, messages: List[BetaMessageParam]) -> List[str]:
        """Extract tool actions from messages."""
        tool_actions = []
        
        for msg in messages:
            if msg["role"] == "assistant" and isinstance(msg["content"], list):
                for item in msg["content"]:
                    action = self._get_action_from_item(item)
                    if action:
                        tool_actions.append(action)
        
        return tool_actions
    
    def _get_action_from_item(self, item) -> str:
        """Get action from a content item."""
        if isinstance(item, dict) and item.get("type") == "tool_use":
            return item.get("input", {}).get("action", item.get("name", "unknown"))
        elif hasattr(item, 'type') and item.type == "tool_use":
            return getattr(item, 'input', {}).get("action", getattr(item, 'name', "unknown"))
        return None