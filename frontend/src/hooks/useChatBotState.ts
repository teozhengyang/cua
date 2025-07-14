// components/chat/useChatBot.ts
import { useState } from "react";
import type { Message } from "../types/ChatType";

export const useChatBotState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    simulateAgentStream(input);
  };

  const simulateAgentStream = async (input: string) => {
    setIsStreaming(true);

    if (!input) {
      setMessages((prev) => [...prev, { role: "agent", message: "Please provide a task." }]);
      setIsStreaming(false);
      return;
    } else {
      setMessages((prev) => [...prev, { role: "agent", message: "..." }]);
    }

    const simulatedChunks = [
      "Let me handle that for you...",
      "Opening the calendar app...",
      "Creating event titled 'Team Sync'...",
      "Scheduled for tomorrow at 10 AM.",
      "All done! ✅"
    ];

    for (let i = 0; i < simulatedChunks.length; i++) {
      await new Promise((res) => setTimeout(res, 1000));

      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => msg.message !== "...");
        // Show current chunk + typing indicator except after last chunk
        if (i === simulatedChunks.length - 1) {
          return [...withoutTyping, { role: "agent", message: simulatedChunks[i] }];
        }
        return [...withoutTyping, { role: "agent", message: simulatedChunks[i] }, { role: "agent", message: "..." }];
      });
    }

    setIsStreaming(false);
  };

  return {
    messages,
    input,
    setInput,
    isStreaming,
    sendMessage,
  };
};
