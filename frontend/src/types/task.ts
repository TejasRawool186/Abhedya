export type TaskStatus =
  | "idle"
  | "created"
  | "running"
  | "awaiting_approval"
  | "completed"
  | "failed";

export interface Task {
  id: string;
  status: TaskStatus;
  prompt: string;
  documentId?: string;
  createdAt: string;
  updatedAt: string;
  outputFormat?: "docx" | "xlsx";
  downloadUrl?: string;
}
