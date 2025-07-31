import { useChatBotState } from "../../hooks/useChatBotState";
import MessageBubble from "./MessageBubble";

const ChatBot = () => {
  // Use hook useChatBotState to manage chat state
  const { messages, input, setInput, isStreaming, sendMessage } = useChatBotState();

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Computer Use Agent
        </h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx + msg.message} {...msg} />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-500"
          placeholder="Type your task here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isStreaming}
        />
        <button 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" 
          onClick={sendMessage} 
          disabled={isStreaming}
        >
          {isStreaming ? "Processing..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;