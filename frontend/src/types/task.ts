import { Message } from "./chat";
import { AgentTraceStep } from "./agent";

export type OperatorRole =
  | "Lead Corrosion Specialist"
  | "Field NDT Inspector"
  | "Plant Safety Auditor"
  | "Refinery Operations Chief";

export type TaskStatus =
  | "DRAFT"
  | "RUNNING"
  | "AWAITING_APPROVAL"
  | "COMPLETED"
  | "REJECTED";

export interface TaskItem {
  id: string;
  title: string;
  category: "UT_AUDIT" | "VIBRATION_FFT" | "OISD_PERMIT" | "CORROSION_RATE" | "CUSTOM";
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  summary: string;
  messages: Message[];
  traceSteps: AgentTraceStep[];
  deliverableUrl?: string;
  deliverableHash?: string;
  pinned?: boolean;
}

export interface AuditLogEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  action: "TASK_INITIATED" | "STEP_COMPLETED" | "APPROVAL_GRANTED" | "APPROVAL_REJECTED" | "DELIVERABLE_SIGNED";
  operator: string;
  operatorRole: OperatorRole;
  timestamp: string;
  sha256Hash: string;
  details: string;
  verified: boolean;
}
