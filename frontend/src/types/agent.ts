export type AgentStepStatus = "pending" | "running" | "completed" | "failed";

export type AgentNodeName =
  | "ingest"
  | "extract"
  | "verify"
  | "synthesize"
  | "audit"
  | string;

export interface AgentTraceStep {
  id: string;
  taskId?: string;
  nodeName: string;
  tool?: string;
  status: AgentStepStatus;
  input?: any;
  output?: any;
  timestamp: string;
  durationMs?: number;
}
