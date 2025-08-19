import { sanitizeInput } from "../utils";

export interface StreamUpdate {
  type: 'status' | 'user_message' | 'assistant_message' | 'tool_execution' | 'tool_complete' | 'tool_error' | 'conversation_complete' | 'error' | 'complete';
  message?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  action?: string;
  result_summary?: string;
  total_responses?: number;
  timestamp: number;
}

export type StreamUpdateCallback = (update: StreamUpdate) => void;
export type StreamCompleteCallback = () => void;
export type StreamErrorCallback = (error: string) => void;

export class ChatStreamService {
  private eventSource: EventSource | null = null;
  private abortController: AbortController | null = null;

  async sendChatStream(
    userInput: string,
    onUpdate: StreamUpdateCallback,
    onComplete: StreamCompleteCallback,
    onError: StreamErrorCallback
  ): Promise<void> {
    // Sanitize input before sending
    const sanitizedInput = sanitizeInput(userInput);
    
    if (!sanitizedInput.trim()) {
      onError("Please provide a valid message");
      return;
    }

    try {
      // First, send the POST request to initiate streaming
      this.abortController = new AbortController();
      
      const response = await fetch("http://localhost:8000/planner/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ text: sanitizedInput }),
        signal: this.abortController.signal,
      });

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Ignore JSON parsing errors for error response
        }
        
        throw new Error(errorMessage);
      }

      // Create EventSource from the response
      if (!response.body) {
        throw new Error("No response body received");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            onComplete();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = line.slice(6); // Remove 'data: ' prefix
                if (data.trim()) {
                  const update: StreamUpdate = JSON.parse(data);
                  onUpdate(update);
                  
                  // Check if this is a completion or error
                  if (update.type === 'complete' || update.type === 'conversation_complete') {
                    onComplete();
                    return;
                  } else if (update.type === 'error') {
                    onError(update.message || "Unknown error occurred");
                    return;
                  }
                }
              } catch (parseError) {
                console.warn("Failed to parse SSE data:", parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          onError("Request was cancelled");
        } else {
          onError(error.message);
        }
      } else {
        onError("Failed to connect to the chat service. Please check your connection and try again.");
      }
    }
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

// Export singleton instance
export const chatStreamService = new ChatStreamService();
