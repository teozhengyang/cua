import { useState } from "react";
import MessageBubble from "./messageBubble";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: "user", message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    simulateAgentStream(input);
  };

  const simulateAgentStream = async () => {
    setIsStreaming(true);

    // Show "typing" indicator
    setMessages((prev) => [...prev, { role: "agent", message: "..." }]);

    const simulatedChunks = [
      "Let me handle that for you...",
      "Opening the calendar app...",
      "Creating event titled 'Team Sync'...",
      "Scheduled for tomorrow at 10 AM.",
      "All done! ✅"
    ];

    for (let i = 0; i < simulatedChunks.length; i++) {
      await new Promise((res) => setTimeout(res, 1000));

      // Replace "..." with first real message or append after
      setMessages((prev) => {
        const withoutTyping = prev.filter((msg) => msg.message !== "...");
        return [...withoutTyping, { role: "agent", message: simulatedChunks[i] }, { role: "agent", message: "..." }];
      });
    }

    // Remove final "..." bubble
    setMessages((prev) => prev.filter((msg) => msg.message !== "..."));
    setIsStreaming(false);
  };

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

export default Chatbot;
