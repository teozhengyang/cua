import type { MessageBubbleProps } from "../../types/ChatType";

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, role }) => {
  const isUser = role === "user";
  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      <div className={`chat-bubble ${isUser ? "chat-bubble-info" : "chat-bubble-success"}`}>
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;