import { memo, useCallback, useRef, useEffect } from "react";
import { useChatBotState } from "../../hooks/useChatBotState";
import MessageBubble from "./MessageBubble";
import LoadingSpinner from "../common/LoadingSpinner";
import ValidationErrors from "../common/ValidationErrors";
import { APP_CONFIG } from "../../constants";

const ChatBot = memo(() => {
  const { 
    messages, 
    input, 
    setInput, 
    isStreaming, 
    error,
    hasMessages,
    currentStatus,
    sendMessage, 
    clearMessages, 
    clearError 
  } = useChatBotState();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (error) clearError();
  }, [setInput, error, clearError]);

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Computer Use Agent
        </h2>
        {hasMessages && (
          <button
            onClick={clearMessages}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4">
          <ValidationErrors 
            errors={[error]} 
            onDismiss={clearError}
          />
        </div>
      )}

      {/* Status Display */}
      {isStreaming && currentStatus && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <LoadingSpinner size="sm" />
            <span>{currentStatus}</span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm">Start a conversation by typing a message below</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <MessageBubble key={`${idx}-${msg.message}`} {...msg} />
            ))
          )}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500"
          placeholder={APP_CONFIG.PLACEHOLDERS.CHAT_INPUT}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          disabled={isStreaming}
        />
        <button 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed min-w-[80px]" 
          onClick={sendMessage} 
          disabled={isStreaming || !input.trim()}
        >
          {isStreaming ? (
            <LoadingSpinner size="sm" />
          ) : (
            APP_CONFIG.BUTTONS.SEND
          )}
        </button>
      </div>
    </div>
  );
});

ChatBot.displayName = 'ChatBot';

export default ChatBot;