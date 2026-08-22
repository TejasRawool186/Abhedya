export type AgentStepStatus = "pending" | "running" | "completed" | "failed";

export interface AgentTraceStep {
  id: string;
  nodeName: string;
  tool?: string;
  status: AgentStepStatus;
  input?: any;
  output?: any;
  timestamp: string;
  durationMs?: number;
}
