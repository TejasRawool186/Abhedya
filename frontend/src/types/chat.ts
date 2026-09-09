import { AgentTraceStep } from "./agent";

export type MessageRole = "user" | "assistant" | "system";

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  parsedSummary?: string;
  rawFile?: File;
  documentId?: string;
}

export interface InlineChartData {
  type: "corrosion_curve" | "vibration_fft";
  title: string;
  description?: string;
  data: any[];
  unit?: string;
  threshold?: number;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  attachments?: AttachedFile[];
  reasoningSteps?: string[];
  isStreaming?: boolean;
  chartData?: InlineChartData;
  traceSteps?: AgentTraceStep[];
  requiresApproval?: boolean;
  approvalStatus?: "pending" | "approved" | "rejected" | "modified";
  approvalDetails?: {
    approvedBy?: string;
    approvedAt?: string;
    signatureHash?: string;
    operatorRole?: string;
    comment?: string;
  };
  deliverable?: {
    filename: string;
    fileSize: number;
    sha256: string;
    generatedAt: string;
    downloadUrl: string;
  };
}

export interface ModelGenerationConfig {
  temperature: number;
  topP: number;
  contextWindowBudget: number;
  maxTokens: number;
  systemPrompt: string;
  selectedModel: string;
  secondaryModel?: string;
  isArenaMode: boolean;
}
