import { useState } from "react";
import type { Message } from "../types/ChatType";
import { sendChat } from "../services/ChatBotService";

export const useChatBotState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await handleAgentResponse(input);
  };

  const handleAgentResponse = async (userInput: string) => {
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "agent", message: "..." }]);

    const responses = await sendChat(userInput);

    setMessages((prev) => {
      const withoutTyping = prev.filter((msg) => msg.message !== "...");
      return [
        ...withoutTyping,
        ...responses.map((r) => ({ role: "agent", message: r })),
      ];
    });

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
