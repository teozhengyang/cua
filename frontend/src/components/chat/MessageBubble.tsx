import type { MessageBubbleProps } from "../../types/ChatType";

const MessageBubble = ({ message, role } : MessageBubbleProps) => {
  // Determine if the message is from the user or agent
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {/* Render the message bubble with appropriate styling based on the role */}
      <div className={`max-w-[80%] p-3 rounded-lg ${
        isUser 
          ? "bg-blue-600 text-white" 
          : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600"
      }`}>
        <div className="flex items-start gap-2">
            <div className="text-sm leading-relaxed break-words">
              {message}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;