// types/chat.ts

export interface Message {
  role: string;
  message: string;
}

export type MessageBubbleProps = Message
