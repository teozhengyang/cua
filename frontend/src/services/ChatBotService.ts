import { sanitizeInput } from "../utils";

export interface ChatResponse {
  response: string[];
  error?: string;
}

export const sendChat = async (userInput: string): Promise<string[]> => {
  // Sanitize input before sending
  const sanitizedInput = sanitizeInput(userInput);
  
  if (!sanitizedInput.trim()) {
    throw new Error("Please provide a valid message");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const res = await fetch("http://localhost:8000/planner/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ text: sanitizedInput }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = `Server error: ${res.status}`;
      
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignore JSON parsing errors for error response
      }
      
      throw new Error(errorMessage);
    }

    const data: ChatResponse = await res.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    if (!Array.isArray(data.response)) {
      throw new Error("Invalid response format from server");
    }

    return data.response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    }
    
    throw new Error("Failed to connect to the chat service. Please check your connection and try again.");
  }
};
