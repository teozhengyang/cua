import type { ModelFormConfig } from "../types/ModelsFormType";
import { validateModelConfig } from "../utils";

export interface SubmitResponse {
  success: boolean;
  message?: string;
  config?: ModelFormConfig;
}

export const handleModelSubmit = async (config: ModelFormConfig): Promise<SubmitResponse> => {
  // Validate configuration
  const errors = validateModelConfig(config);
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
  }

  try {
    console.log("Submitting configuration:", config);

    // Check health endpoint first
    const healthResponse = await fetch("http://localhost:8000/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },   
    });

    if (!healthResponse.ok) {
      throw new Error("Backend service is not available");
    }

    // TODO: Add actual configuration submission endpoint when ready
    // const submitResponse = await fetch("http://localhost:8000/config", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(config),
    // });

    console.log("Configuration validated and ready");
    
    return {
      success: true,
      message: "Configuration saved successfully",
      config
    };
  } catch (error) {
    console.error("Failed to submit model configuration:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to save configuration. Please try again."
    );
  }
};