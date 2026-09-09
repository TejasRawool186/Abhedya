export type AgentNodeName =
  | "ocr_extract"
  | "rag_search"
  | "recommend"
  | "human_checkpoint"
  | "generate_docx"
  | "monte_carlo";

export type AgentNodeStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "waiting_approval";

export interface AgentTraceStep {
  id: string;
  node: AgentNodeName;
  label: string;
  description: string;
  status: AgentNodeStatus;
  durationMs?: number;
  startTime?: number;
  endTime?: number;
  logs: string[];
  outputSummary?: string;
  metadata?: Record<string, any>;
}

export interface SSETraceEvent {
  stepId: string;
  node: AgentNodeName;
  status: AgentNodeStatus;
  log?: string;
  token?: string;
  durationMs?: number;
  outputSummary?: string;
  isFinal?: boolean;
}
