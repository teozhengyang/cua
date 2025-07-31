// Application-wide constants
export const APP_CONFIG = {
  // Panel dimensions
  PANEL_WIDTH_PERCENTAGE: 25, // 25% width for models panel
  HOVER_AREA_WIDTH: 48, // 12 * 4 = 48px in Tailwind
  
  // Animation durations
  TRANSITION_DURATION: 200,
  STREAM_CHUNK_DELAY: 1000,
  
  // UI Text
  PLACEHOLDERS: {
    CHAT_INPUT: "Type your task here...",
    API_KEY_PLANNER: "Enter planner API key",
    API_KEY_ACTOR: "Enter actor API key",
    API_KEY_CLAUDE: "Enter Claude API key",
  },
  
  // Button Labels
  BUTTONS: {
    SEND: "Send",
    START_AGENT: "Start Agent",
    RESET_FORM: "Reset Form",
    SHOW_CONFIG: "Show configuration panel",
  },
  
  // Model Options
  MODEL_TYPES: {
    UNIFIED: "Unified",
    PLANNER_ACTOR: "Planner + Actor",
  } as const,
  
  // Available Models
  MODELS: {
    CLAUDE: "claude",
    GPT: "GPT",
    QWEN: "Qwen",
    SHOW_UI: "ShowUI",
    UI_TARS: "UI-TARS",
  } as const,
} as const;

// Chat simulation messages
export const SIMULATION_MESSAGES = [
  "Let me handle that for you...",
  "Opening the calendar app...",
  "Creating event titled 'Team Sync'...",
  "Scheduled for tomorrow at 10 AM.",
  "All done! ✅"
] as const;

// Typing indicator
export const TYPING_INDICATOR = "..." as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  CHAT: "/api/chat",
  MODELS: "/api/models",
  CONFIG: "/api/config",
} as const;
