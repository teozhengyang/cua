"""
Tool definitions for use with Anthropic Claude API.
These are lightweight tool definitions that only provide the schema to Claude.
Actual execution is handled by the executor service.
"""
from abc import ABC, abstractmethod
from anthropic.types.beta import BetaToolUnionParam


class BaseAnthropicTool(ABC):
    """Abstract base class for Anthropic-defined tools."""

    @abstractmethod
    def to_params(self) -> BetaToolUnionParam:
        """Return the tool parameters for Claude API."""
        pass


class ComputerTool(BaseAnthropicTool):
    """Computer tool for screen interaction."""
    
    def __init__(self, selected_screen: int = 0):
        self.selected_screen = selected_screen
    
    def to_params(self) -> BetaToolUnionParam:
        return {
            "name": "computer",
            "type": "custom",
            "description": "Control the mouse, keyboard, and screen using simulated actions.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "description": "The action to perform. Examples: mouse_move, left_click, type, key, screenshot, scroll.",
                        "enum": [
                            "key", "type", "mouse_move", "left_click", "left_click_drag",
                            "right_click", "middle_click", "double_click", "screenshot",
                            "cursor_position", "left_press", "scroll"
                        ]
                    },
                    "text": {
                        "type": "string",
                        "description": "The text or key combination to type (used for type/key actions)."
                    },
                    "coordinate": {
                        "type": "array",
                        "items": {"type": "integer"},
                        "minItems": 2,
                        "maxItems": 2,
                        "description": "The (x, y) coordinates on the screen."
                    },
                    "scroll_direction": {
                        "type": "string",
                        "enum": ["up", "down", "left", "right"],
                        "description": "Direction to scroll."
                    },
                    "scroll_amount": {
                        "type": "integer",
                        "description": "How much to scroll."
                    }
                },
                "required": ["action"]
            }
        }



class BashTool(BaseAnthropicTool):
    """Bash tool for command execution."""
    
    def to_params(self) -> BetaToolUnionParam:
        return {
            "name": "bash",
            "type": "custom",
            "description": "Run shell commands and return stdout/stderr.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "command": {
                        "type": "string",
                        "description": "The shell command to execute"
                    }
                },
                "required": ["command"]
            }
        }


class EditTool(BaseAnthropicTool):
    """Text editor tool for file editing."""
    
    def to_params(self) -> BetaToolUnionParam:
        return {
            "name": "str_replace_editor",
            "type": "custom",
            "input_schema": {
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "The original text"},
                    "instructions": {"type": "string", "description": "How to edit the text"}
                },
                "required": ["text", "instructions"]
            }
        }


class ToolCollection:
    """Collection of tools for Claude API."""
    
    def __init__(self, *tools: BaseAnthropicTool):
        self.tools = tools
        self.tool_map = {tool.__class__.__name__.lower().replace('tool', ''): tool for tool in tools}
    
    def to_params(self) -> list[BetaToolUnionParam]:
        """Return tool parameters for Claude API."""
        return [tool.to_params() for tool in self.tools]