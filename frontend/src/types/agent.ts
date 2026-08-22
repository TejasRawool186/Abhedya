export type AgentStepStatus = "pending" | "running" | "completed" | "failed";

export interface AgentTraceStep {
  id: string;
  nodeName: string;
  status: AgentStepStatus;
  output?: string;
  timestamp: string;
  durationMs?: number;
}
