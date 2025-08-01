export interface Message {
  role: "user" | "agent";
  message: string;
  timestamp?: string;
}

export type MessageBubbleProps = Message;
