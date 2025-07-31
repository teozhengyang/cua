import { useState, useCallback, useMemo } from "react";
import type { Message } from "../types/ChatType";
import { sendChat } from "../services/ChatBotService";
import { TYPING_INDICATOR } from "../constants";
import { sanitizeInput, formatTimestamp } from "../utils";

export const useChatBotState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized empty state check
  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const removeTypingIndicator = useCallback(() => {
    setMessages(prev => prev.filter(msg => msg.message !== TYPING_INDICATOR));
  }, []);

  const handleAgentResponse = useCallback(async (userInput: string) => {
    setIsStreaming(true);
    
    // Add typing indicator
    addMessage({ 
      role: "agent", 
      message: TYPING_INDICATOR,
      timestamp: formatTimestamp()
    });

    try {
      const responses = await sendChat(userInput);

      setMessages(prev => {
        const withoutTyping = prev.filter(msg => msg.message !== TYPING_INDICATOR);
        return [
          ...withoutTyping,
          ...responses.map((r): Message => ({ 
            role: "agent", 
            message: r,
            timestamp: formatTimestamp()
          })),
        ];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response from agent");
      removeTypingIndicator();
      
      // Add error message to chat
      addMessage({
        role: "agent",
        message: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: formatTimestamp()
      });
    } finally {
      setIsStreaming(false);
    }
  }, [addMessage, removeTypingIndicator]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const sanitizedInput = sanitizeInput(input);
    const userMessage: Message = { 
      role: "user", 
      message: sanitizedInput,
      timestamp: formatTimestamp()
    };
    
    addMessage(userMessage);
    setInput("");
    setError(null);
    
    await handleAgentResponse(sanitizedInput);
  }, [input, isStreaming, addMessage, handleAgentResponse]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    input,
    setInput,
    isStreaming,
    error,
    hasMessages,
    sendMessage,
    clearMessages,
    clearError,
  };
};
