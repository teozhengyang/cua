import { memo } from "react";
import type { MessageBubbleProps } from "../../types/ChatType";
import { TYPING_INDICATOR } from "../../constants";

const MessageBubble = memo<MessageBubbleProps>(({ message, role, timestamp }) => {
  const isUser = role === "user";
  const isTyping = message === TYPING_INDICATOR;
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] p-3 rounded-lg ${
        isUser 
          ? "bg-blue-600 text-white" 
          : isTyping
            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800"
            : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600"
      }`}>
        <div className="flex items-start gap-2">
          <div className="text-sm leading-relaxed break-words flex-1">
            {isTyping ? (
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            ) : (
              <div>
                <div className="whitespace-pre-wrap">{message}</div>
                {timestamp && (
                  <div className="text-xs opacity-60 mt-1">
                    {timestamp}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;