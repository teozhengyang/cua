import type { ModelFormConfig } from "../types/ModelsFormType";

/**
 * Validates if an API key has a reasonable format
 */
export const validateApiKey = (apiKey: string): boolean => {
  return apiKey.trim().length >= 0; // Minimum reasonable API key length
};

/**
 * Validates the complete model configuration
 */
export const validateModelConfig = (config: ModelFormConfig): string[] => {
  const errors: string[] = [];
  
  if (config.modelType === "Unified") {
    if (!config.claudeApiKey || !validateApiKey(config.claudeApiKey)) {
      errors.push("Claude API key is required and must be at least 8 characters");
    }
  } else {
    // Validate planner API key only for GPT and API-based Qwen
    if (config.plannerModel === "GPT" || 
        (config.plannerModel === "Qwen" && config.qwenDeploymentType === 'api-based')) {
      if (!config.plannerApiKey || !validateApiKey(config.plannerApiKey)) {
        errors.push("Planner API key is required and must be at least 8 characters");
      }
    }
    
    // For local deployments, validate folder paths; for API-based, validate server URL
    if (config.qwenDeploymentType === 'local') {
      if (config.plannerModel === "Qwen" && !config.plannerFolderPath?.trim()) {
        errors.push("Planner folder path is required for local Qwen deployment");
      }
      if (config.actorModel === "ShowUI" && !config.actorFolderPath?.trim()) {
        errors.push("Actor folder path is required for ShowUI");
      }
    } else if (config.qwenDeploymentType === 'api-based') {
      if (config.actorModel === "UI-TARS" && !config.actorServerUrl?.trim()) {
        errors.push("Actor server URL is required for UI-TARS");
      }
    }
  }
  
  return errors;
};

/**
 * Masks sensitive information in configuration for display
 */
export const maskSensitiveConfig = (config: ModelFormConfig) => {
  return {
    ...config,
    claudeApiKey: config.claudeApiKey ? "••••••••" : "(empty)",
    plannerApiKey: config.plannerApiKey ? "••••••••" : "(empty)",
    plannerFolderPath: config.plannerFolderPath || "(not set)",
    actorFolderPath: config.actorFolderPath || "(not set)",
    actorServerUrl: config.actorServerUrl || "(not set)",
  };
};

/**
 * Formats timestamp for chat messages
 */
export const formatTimestamp = (date: Date = new Date()): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Creates a delay promise for simulating streaming
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Sanitizes user input to prevent basic XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
};

/**
 * Checks if a value is not null or undefined
 */
export const isNotNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Type-safe object entries
 */
export const objectEntries = <T extends Record<string, unknown>>(obj: T): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};
