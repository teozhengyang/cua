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
            "type": "computer_20250124",
            "name": "computer",
            "display_width_px": 1920,
            "display_height_px": 1080,
            "display_number": self.selected_screen,
        }


class BashTool(BaseAnthropicTool):
    """Bash tool for command execution."""
    
    def to_params(self) -> BetaToolUnionParam:
        return {
            "type": "bash_20250124",
            "name": "bash",
        }


class EditTool(BaseAnthropicTool):
    """Text editor tool for file editing."""
    
    def to_params(self) -> BetaToolUnionParam:
        return {
            "type": "text_editor_20250728",
            "name": "str_replace_editor",
        }


class ToolCollection:
    """Collection of tools for Claude API."""
    
    def __init__(self, *tools: BaseAnthropicTool):
        self.tools = tools
        self.tool_map = {tool.__class__.__name__.lower().replace('tool', ''): tool for tool in tools}
    
    def to_params(self) -> list[BetaToolUnionParam]:
        """Return tool parameters for Claude API."""
        return [tool.to_params() for tool in self.tools]