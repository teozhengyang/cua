import { useChatBotState } from "../../hooks/useChatBotState";
import MessageBubble from "./MessageBubble";

const ChatBot = () => {
  // Use hook useChatBotState to manage chat state
  const { messages, input, setInput, isStreaming, sendMessage } = useChatBotState();

  return (
    <div className="space-y-4 bg-base-100 rounded-lg shadow h-full">

      {/* Title of the chat component */}
      <h2 className="text-2xl font-bold text-center mb-4">Chat with Agent</h2>

      {/* Display messages in a scrollable area */}
      {/* Each message is rendered using the MessageBubble component */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx + msg.message} {...msg} />
        ))}
      </div>

      {/* Input area for user to type messages */}
      {/* Input field and send button */}
      {/* Input is disabled when isStreaming is true to prevent multiple submissions */}
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