import type { MessageBubbleProps } from "../../types/ChatType";

const MessageBubble = ({ message, role } : MessageBubbleProps) => {
  // Determine if the message is from the user or agent
  const isUser = role === "user";

  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      {/* Render the message bubble with appropriate styling based on the role */}
      <div className={`chat-bubble ${isUser ? "chat-bubble-info" : "chat-bubble-success"}`}>
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;