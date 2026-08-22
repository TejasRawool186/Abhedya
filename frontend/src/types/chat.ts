export type MessageRole = "user" | "assistant" | "system" | "error";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}
