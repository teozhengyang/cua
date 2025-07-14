// components/chat/ChatBot.tsx
import React from "react";
import { useChatBotState } from "../../hooks/useChatBotState";
import MessageBubble from "./MessageBubble";

const ChatBot: React.FC = () => {
  const { messages, input, setInput, isStreaming, sendMessage } = useChatBotState();

  return (
    <div className="p-4 space-y-4 bg-base-100 rounded-lg shadow h-full">
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx + msg.message} {...msg} />
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="input input-bordered w-full"
          placeholder="Type your task here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isStreaming}
        />
        <button className="btn btn-primary" onClick={sendMessage} disabled={isStreaming}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;