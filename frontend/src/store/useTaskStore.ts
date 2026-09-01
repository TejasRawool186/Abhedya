import { create } from "zustand";
import type { Message } from "@/types/chat";
import type { Task, TaskStatus } from "@/types/task";
import type { AgentTraceStep } from "@/types/agent";
import type { UploadedFile } from "@/types/file";
import type { NetworkStatus } from "@/types/network";
import { generateId } from "@/lib/utils";

export interface ApprovalState {
  required: boolean;
  recommendation: string;
  status: "idle" | "pending" | "approved" | "rejected" | "edited";
  decision?: "approve" | "reject" | "edit";
  editedRecommendation?: string;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  confidence?: number;
}

export interface RecentTaskItem {
  id: string;
  title: string;
  timestamp: string;
  status: TaskStatus;
  taskType?: string;
}

interface TaskState {
  activeTask: Task | null;
  messages: Message[];
  attachments: UploadedFile[];
  agentSteps: AgentTraceStep[];
  approval: ApprovalState;
  network: NetworkStatus | null;
  isStreaming: boolean;
  
  // UI & Workspace States
  selectedModel: string;
  availableModels: { id: string; name: string; tag: string; icon?: string }[];
  sidebarOpen: boolean;
  contextPanelOpen: boolean;
  activeTab: "workbench" | "documents" | "audit" | "security";
  recentTasks: RecentTaskItem[];
}

interface TaskActions {
  setTask: (task: Task) => void;
  setTaskStatus: (status: TaskStatus) => void;
  resetTask: () => void;

  addMessage: (message: Omit<Message, "id" | "timestamp">) => Message;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;

  addAttachment: (file: Omit<UploadedFile, "id" | "uploadStatus" | "progress"> & { uploadStatus?: UploadedFile["uploadStatus"]; progress?: number }) => UploadedFile;
  updateAttachment: (id: string, updates: Partial<UploadedFile>) => void;
  removeAttachment: (id: string) => void;
  getActiveDocumentId: () => string | undefined;

  addAgentStep: (step: AgentTraceStep) => void;
  updateAgentStep: (id: string, updates: Partial<AgentTraceStep>) => void;
  clearAgentSteps: () => void;

  setApproval: (approval: Partial<ApprovalState>) => void;
  setApprovalRecommendation: (recommendation: string, riskLevel?: "LOW" | "MEDIUM" | "HIGH", confidence?: number) => void;
  submitApproval: (decision: "approve" | "reject" | "edit", edited?: string) => void;
  resetApproval: () => void;

  setNetworkStatus: (status: NetworkStatus) => void;
  setStreaming: (streaming: boolean) => void;

  markTaskComplete: (outputFormat?: "docx" | "xlsx", downloadUrl?: string) => void;
  addError: (message: string) => void;

  // UI Actions
  setSelectedModel: (model: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleContextPanel: () => void;
  setContextPanelOpen: (open: boolean) => void;
  setActiveTab: (tab: "workbench" | "documents" | "audit" | "security") => void;
  addRecentTask: (task: { id: string; title: string; status: TaskStatus; taskType?: string }) => void;
}

export type UseTaskStore = TaskState & TaskActions;

const DEFAULT_MODELS = [
  { id: "qwen2.5-14b-industrial", name: "Qwen 2.5 14B Industrial", tag: "RECOMMENDED • ZERO EGRESS" },
  { id: "llama3-8b-enclave", name: "Llama 3 8B Sovereign Enclave", tag: "FAST • AIR-GAPPED" },
  { id: "qwen2.5-vl-7b", name: "Qwen 2.5 VL 7B (Vision & OCR)", tag: "DOCUMENT & INSPECTION OCR" },
  { id: "deepseek-coder-14b", name: "DeepSeek Coder 14B", tag: "ANALYSIS & CODE" },
];

const initialState: TaskState = {
  activeTask: null,
  messages: [],
  attachments: [],
  agentSteps: [],
  approval: {
    required: false,
    recommendation: "",
    status: "idle",
  },
  network: null,
  isStreaming: false,
  selectedModel: "qwen2.5-14b-industrial",
  availableModels: DEFAULT_MODELS,
  sidebarOpen: true,
  contextPanelOpen: true,
  activeTab: "workbench",
  recentTasks: [
    {
      id: "demo-task-001",
      title: "MRPL Hydrocracker Corrosion & Thickness Audit",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "completed",
      taskType: "inspection_report",
    },
    {
      id: "demo-task-002",
      title: "Refinement Unit Vibration Anomaly Analysis",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "completed",
      taskType: "anomaly_detection",
    },
  ],
};

export const useTaskStore = create<UseTaskStore>((set, get) => ({
  ...initialState,

  setTask: (task) => set({ activeTask: task }),

  setTaskStatus: (status) =>
    set((state) => ({
      activeTask: state.activeTask
        ? { ...state.activeTask, status, updatedAt: new Date().toISOString() }
        : null,
    })),

  resetTask: () =>
    set((state) => ({
      activeTask: null,
      messages: [],
      attachments: [],
      agentSteps: [],
      approval: {
        required: false,
        recommendation: "",
        status: "idle",
      },
      isStreaming: false,
    })),

  addMessage: (message) => {
    const existing = get().messages;
    const lastMsg = existing[existing.length - 1];
    if (lastMsg && lastMsg.role === message.role && lastMsg.content === message.content) {
      return lastMsg;
    }

    const fullMessage: Message = {
      ...message,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, fullMessage] }));
    return fullMessage;
  },

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  clearMessages: () => set({ messages: [] }),

  addAttachment: (file) => {
    const fullFile: UploadedFile = {
      ...file,
      id: generateId(),
      uploadStatus: file.uploadStatus ?? "idle",
      progress: file.progress ?? 0,
    };
    set((state) => ({ attachments: [...state.attachments, fullFile] }));
    return fullFile;
  },

  updateAttachment: (id, updates) =>
    set((state) => ({
      attachments: state.attachments.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),

  removeAttachment: (id) =>
    set((state) => ({
      attachments: state.attachments.filter((f) => f.id !== id),
    })),

  getActiveDocumentId: () => {
    const successFile = get().attachments.find(
      (f) => f.uploadStatus === "success" && f.documentId
    );
    return successFile?.documentId;
  },

  addAgentStep: (step) =>
    set((state) => {
      const existingIndex = state.agentSteps.findIndex((s) => s.id === step.id);
      if (existingIndex >= 0) {
        const updated = [...state.agentSteps];
        updated[existingIndex] = { ...updated[existingIndex], ...step };
        return { agentSteps: updated };
      }
      return { agentSteps: [...state.agentSteps, step] };
    }),

  updateAgentStep: (id, updates) =>
    set((state) => ({
      agentSteps: state.agentSteps.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),

  clearAgentSteps: () => set({ agentSteps: [] }),

  setApproval: (approval) =>
    set((state) => ({
      approval: { ...state.approval, ...approval },
    })),

  setApprovalRecommendation: (recommendation, riskLevel, confidence) =>
    set((state) => ({
      approval: {
        ...state.approval,
        required: true,
        recommendation,
        riskLevel: riskLevel || "MEDIUM",
        confidence: confidence || 0.92,
        status: "pending",
      },
    })),

  submitApproval: (decision, edited) => {
    const updates: Partial<ApprovalState> = {
      decision,
      status:
        decision === "approve"
          ? "approved"
          : decision === "reject"
          ? "rejected"
          : "edited",
    };
    if (edited) {
      updates.editedRecommendation = edited;
    }
    set((state) => ({ approval: { ...state.approval, ...updates } }));
  },

  resetApproval: () =>
    set({
      approval: {
        required: false,
        recommendation: "",
        status: "idle",
      },
    }),

  setNetworkStatus: (status) => set({ network: status }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  markTaskComplete: (outputFormat, downloadUrl) =>
    set((state) => ({
      activeTask: state.activeTask
        ? {
            ...state.activeTask,
            status: "completed",
            outputFormat,
            downloadUrl,
            updatedAt: new Date().toISOString(),
          }
        : null,
      isStreaming: false,
      approval: {
        ...state.approval,
        required: false,
        status: state.approval.decision === "reject" ? "rejected" : state.approval.status,
      },
    })),

  addError: (message) => {
    const errorMessage: Message = {
      id: generateId(),
      role: "error",
      content: message,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, errorMessage],
      activeTask: state.activeTask
        ? { ...state.activeTask, status: "failed", updatedAt: new Date().toISOString() }
        : null,
      isStreaming: false,
    }));
  },

  // UI Actions
  setSelectedModel: (model) => set({ selectedModel: model }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleContextPanel: () => set((state) => ({ contextPanelOpen: !state.contextPanelOpen })),
  setContextPanelOpen: (open) => set({ contextPanelOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  addRecentTask: (task) =>
    set((state) => {
      const newItem: RecentTaskItem = {
        ...task,
        timestamp: new Date().toISOString(),
      };
      const filtered = state.recentTasks.filter((t) => t.id !== task.id);
      return { recentTasks: [newItem, ...filtered].slice(0, 15) };
    }),
}));
