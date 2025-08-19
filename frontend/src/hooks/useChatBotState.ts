import { useState, useCallback, useMemo } from "react";
import type { Message } from "../types/ChatType";
import { chatStreamService, type StreamUpdate } from "../services/ChatStreamService";
import { TYPING_INDICATOR } from "../constants";
import { sanitizeInput, formatTimestamp } from "../utils";

export const useChatBotState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("");

  // Memoized empty state check
  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateLastMessage = useCallback((newText: string) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      const lastMessage = prev[prev.length - 1];
      if (lastMessage.role === "agent") {
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, message: newText }
        ];
      }
      return prev;
    });
  }, []);

  const removeTypingIndicator = useCallback(() => {
    setMessages(prev => prev.filter(msg => msg.message !== TYPING_INDICATOR));
  }, []);

  const handleStreamUpdate = useCallback((update: StreamUpdate) => {
    switch (update.type) {
      case 'status':
        setCurrentStatus(update.message || "");
        break;
        
      case 'user_message':
        // User message already added, just update status
        setCurrentStatus("Processing your request...");
        break;
        
      case 'assistant_message':
        removeTypingIndicator();
        addMessage({
          role: "agent",
          message: update.message || "",
          timestamp: formatTimestamp()
        });
        setCurrentStatus("");
        break;
        
      case 'tool_execution': {
        const executingAction = update.action || update.tool_name;
        setCurrentStatus(`Executing ${executingAction}...`);
        // Optionally add a tool execution indicator message
        addMessage({
          role: "agent", 
          message: `🔧 Executing ${executingAction}...`,
          timestamp: formatTimestamp()
        });
        break;
      }
        
      case 'tool_complete': {
        const completedAction = update.action || update.tool_name;
        setCurrentStatus(`Completed ${completedAction}`);
        // Update the last tool execution message with completion
        updateLastMessage(`✅ Completed ${completedAction}: ${update.result_summary}`);
        break;
      }
        
      case 'tool_error': {
        const errorAction = update.action || update.tool_name;
        setCurrentStatus(`Error in ${errorAction}`);
        updateLastMessage(`❌ Error in ${errorAction}: ${update.message}`);
        break;
      }
        
      case 'conversation_complete':
        setCurrentStatus("Conversation completed");
        removeTypingIndicator();
        break;
        
      case 'error':
        setError(update.message || "Unknown error occurred");
        removeTypingIndicator();
        setCurrentStatus("");
        break;
    }
  }, [addMessage, updateLastMessage, removeTypingIndicator]);

  const handleAgentResponse = useCallback(async (userInput: string) => {
    setIsStreaming(true);
    setCurrentStatus("Starting conversation...");
    
    // Add typing indicator
    addMessage({ 
      role: "agent", 
      message: TYPING_INDICATOR,
      timestamp: formatTimestamp()
    });

    try {
      await chatStreamService.sendChatStream(
        userInput,
        handleStreamUpdate,
        () => {
          setIsStreaming(false);
          setCurrentStatus("");
          removeTypingIndicator();
        },
        (errorMessage: string) => {
          setError(errorMessage);
          setIsStreaming(false);
          setCurrentStatus("");
          removeTypingIndicator();
          
          // Add error message to chat
          addMessage({
            role: "agent",
            message: "Sorry, I encountered an error while processing your request. Please try again.",
            timestamp: formatTimestamp()
          });
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response from agent");
      setIsStreaming(false);
      setCurrentStatus("");
      removeTypingIndicator();
      
      // Add error message to chat
      addMessage({
        role: "agent",
        message: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: formatTimestamp()
      });
    }
  }, [addMessage, removeTypingIndicator, handleStreamUpdate]);

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
    setCurrentStatus("");
    chatStreamService.disconnect();
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
    currentStatus,
    sendMessage,
    clearMessages,
    clearError,
  };
};
