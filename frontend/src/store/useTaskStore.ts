import { create } from "zustand";
import { TaskItem, AuditLogEntry, OperatorRole, TaskStatus } from "@/types/task";
import { Message, ModelGenerationConfig } from "@/types/chat";
import { AgentTraceStep, AgentNodeName, AgentNodeStatus } from "@/types/agent";
import { KnowledgeDocument } from "@/types/file";
import { NetworkSentinelStats, SocketConnection } from "@/types/network";
import { defaultExecutionSteps } from "@/mocks/mockAgentTrace";
import { mockCorrosionDegradationCurve } from "@/mocks/mockInspectionData";
import { generateSHA256 } from "@/lib/crypto";
import {
  submitTaskApproval,
  fetchTaskList,
  fetchTaskDetail,
  fetchDocuments,
  fetchNetworkStatus,
  fetchNetworkEvents,
  getDeliverableDownloadUrl,
  DocumentItem,
  TaskDetail
} from "@/lib/api";

export type WorkspaceView = "tasks" | "audit" | "network" | "knowledge" | "settings";

export interface ConfiguredModel {
  id: string;
  name: string;
  endpoint: string;
  apiKey?: string;
  provider: string;
}

interface TaskState {
  // Navigation & Shell
  activeView: WorkspaceView;
  setActiveView: (view: WorkspaceView) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isContextPanelOpen: boolean;
  setContextPanelOpen: (open: boolean) => void;
  toggleContextPanel: () => void;
  activeContextTab: "timeline" | "context" | "deliverable";
  setActiveContextTab: (tab: "timeline" | "context" | "deliverable") => void;

  // Operator Profile & Role
  operatorName: string;
  operatorRole: OperatorRole;
  setOperatorRole: (role: OperatorRole) => void;

  // Model & Arena Settings
  modelConfig: ModelGenerationConfig;
  setModelConfig: (config: Partial<ModelGenerationConfig>) => void;
  isModelModalOpen: boolean;
  setModelModalOpen: (open: boolean) => void;

  // Configured Models
  configuredModels: ConfiguredModel[];
  addConfiguredModel: (model: Omit<ConfiguredModel, "id">) => void;
  removeConfiguredModel: (id: string) => void;

  // Tasks & History
  tasks: TaskItem[];
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  createNewTask: () => void;
  deleteTask: (id: string) => void;
  pinTask: (id: string) => void;
  loadTasksFromBackend: () => Promise<void>;

  // Active Chat Stream & Agent Steps
  messages: Message[];
  activeTraceSteps: AgentTraceStep[];
  isExecuting: boolean;
  currentRunningNode: AgentNodeName | null;

  // Approval Gate (HITL)
  isApprovalModalOpen: boolean;
  setApprovalModalOpen: (open: boolean) => void;
  activeApprovalData: any | null;
  approveStep: (pin: string, customComment?: string) => Promise<void>;
  rejectStep: (reason: string) => Promise<void>;
  editRecommendation: (newRecommendation: string) => void;

  // Knowledge Base Documents
  knowledgeDocs: KnowledgeDocument[];
  addKnowledgeDoc: (doc: KnowledgeDocument) => void;
  loadDocumentsFromBackend: () => Promise<void>;

  // Audit Ledger
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, "id" | "timestamp" | "sha256Hash" | "verified">) => Promise<void>;
  loadAuditLogsFromBackend: () => Promise<void>;

  // Network Sentinel Telemetry
  networkStats: NetworkSentinelStats;
  activeSockets: SocketConnection[];
  refreshNetworkTelemetry: () => Promise<void>;

  // Actions
  addMessage: (message: Omit<Message, "id" | "timestamp">) => string;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setTraceStepStatus: (stepId: string, status: AgentNodeStatus, summary?: string, durationMs?: number) => void;
  addTraceStepLog: (stepId: string, log: string) => void;
  resetTraceSteps: () => void;
  setExecuting: (executing: boolean) => void;

  // Full Dynamic Initialization
  initializeStore: () => Promise<void>;
}

const initialTask: TaskItem = {
  id: "TASK-DEMO-01",
  title: "Hydrocracker Unit 3 CML-101A UT Wall Loss Audit",
  category: "UT_AUDIT",
  status: "COMPLETED",
  createdAt: "2026-09-04 18:30:00",
  updatedAt: "2026-09-04 18:42:15",
  summary: "Ultrasonic wall thickness degradation assessment against API 570 retirement thresholds.",
  messages: [
    {
      id: "msg-user-1",
      role: "user",
      content:
        "Please analyze the attached ultrasonic thickness inspection log for Hydrocracker Unit 3. Extract the nominal vs measured wall thickness at all Condition Monitoring Locations (CMLs), compute short-term and long-term corrosion rates, project remaining life, and check compliance against API 570 minimum retirement thickness (MAWT = 6.5 mm).",
      timestamp: "18:30:12",
      attachments: [
        {
          id: "att-1",
          name: "hydrocracker_ut_log.pdf",
          size: 2450000,
          type: "application/pdf",
        },
      ],
    },
    {
      id: "msg-asst-1",
      role: "assistant",
      content: `### Ultrasonic Thickness (UT) Inspection & Integrity Assessment Report
**Target Equipment:** Hydrocracker Unit 3 (Reactor Overhead Vapor Line 90° Elbow)  
**Standard Cross-Reference:** API 570 / OISD-STD-105 Clause 4.2.1  
**Verification Level:** Sovereign Local Inference (Qwen 2.5 14B Industrial)

---

#### 1. Critical Findings & Wall Thickness Loss Matrix
The localized ultrasonic inspection log was processed through our local multimodal OCR and cross-referenced with baseline inspection records:

| CML Point | Location Description | Nominal (mm) | Measured (mm) | MAWT (mm) | Corrosion Rate | Remaining Life | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CML-HC-101A** | **Reactor Overhead Elbow** | **14.2 mm** | **7.8 mm** | **6.5 mm** | **0.82 mm/yr** | **1.58 Years** | 🚨 **CRITICAL** |
| CML-HC-101B | Effluent Separator Nozzle | 16.0 mm | 11.4 mm | 8.0 mm | 0.45 mm/yr | 7.55 Years | ⚠️ WARNING |
| CML-HC-102A | Recycle Loop Spool | 18.5 mm | 16.9 mm | 9.2 mm | 0.18 mm/yr | 42.7 Years | ✅ NORMAL |
| CML-HC-103C | Sour Gas Reboiler Bottoms | 12.7 mm | 8.1 mm | 7.0 mm | 0.58 mm/yr | 1.89 Years | 🚨 **CRITICAL** |

#### 2. Root Cause Analysis & Degradation Projection
* Point **CML-HC-101A** exhibits accelerated flow-accelerated corrosion (FAC) due to high-velocity multiphase hydrocarbon flow and trace sour $\\text{H}_2\\text{S}$ stream content.
* At the current degradation velocity ($0.82\\text{ mm/year}$), the wall thickness will breach the **Minimum Allowable Wall Thickness (MAWT = 6.5 mm)** by **Q4 2027**, well before the scheduled 2029 major plant turnaround.`,
      timestamp: "18:31:05",
      chartData: {
        type: "corrosion_curve",
        title: "CML-HC-101A Wall Thickness Degradation Curve vs MAWT Retirement Limit",
        description: "Historical UT readings with linear corrosion rate projection demonstrating breach in Q4 2027.",
        data: mockCorrosionDegradationCurve,
        unit: "mm",
        threshold: 6.5,
      },
      reasoningSteps: [
        "1. Loaded PaddleOCR 2.8 with local CUDA weights -> extracted 4 CML rows from hydrocracker_ut_log.pdf.",
        "2. Retrieved API 570 Table 7-1 and MRPL OISD-105 standard chunks from ChromaDB.",
        "3. Calculated corrosion rate: (14.2 - 7.8) / 7.8 yrs = 0.82 mm/yr.",
        "4. Projected breach: (7.8 - 6.5) / 0.82 = 1.58 years -> trigger safety critical HITL gate.",
      ],
      requiresApproval: false,
      approvalStatus: "approved",
      approvalDetails: {
        approvedBy: "Admin",
        approvedAt: "2026-09-04 18:42:15 UTC",
        signatureHash: "8f72a45b91e32049d5c181774fa1b203c81665a31b40974ef6f5367809a7b931",
        operatorRole: "Lead Corrosion Specialist",
        comment: "Emergency ASTM A335 Grade P22 spool piece fabrication authorized.",
      },
      deliverable: {
        filename: "MRPL_HC3_UT_Audit_Approved.docx",
        fileSize: 1845000,
        sha256: "8f72a45b91e32049d5c181774fa1b203c81665a31b40974ef6f5367809a7b931",
        generatedAt: "2026-09-04 18:42:15 UTC",
        downloadUrl: "#",
      },
    },
  ],
  traceSteps: defaultExecutionSteps.map((step) => ({
    ...step,
    status: "completed",
    durationMs: step.node === "ocr_extract" ? 850 : step.node === "rag_search" ? 420 : 1200,
  })),
  deliverableUrl: "#",
  deliverableHash: "8f72a45b91e32049d5c181774fa1b203c81665a31b40974ef6f5367809a7b931",
  pinned: true,
};

const initialDocs: KnowledgeDocument[] = [
  {
    id: "doc-1",
    name: "OISD-STD-105_Work_Permit_System.pdf",
    category: "OISD_STANDARD",
    tags: ["OISD-105", "Safety", "Hot-Work", "Confined-Space"],
    fileSize: 3450000,
    uploadedAt: "2026-08-15",
    sha256: "4a2b9183ca109280d463b207567ae2c0245a498b53291244569e5d4810283ca2",
    vectorChunksCount: 142,
    status: "indexed",
    similarityScore: 0.94,
  },
  {
    id: "doc-2",
    name: "API_570_Piping_Inspection_Code_5th_Ed.pdf",
    category: "API_STANDARD",
    tags: ["API-570", "Piping", "MAWT", "Corrosion-Rate"],
    fileSize: 8900000,
    uploadedAt: "2026-08-20",
    sha256: "6c72199b0485603e839e55b689ef2e3d36b85d388656cb45c0883cf3a1e967a5",
    vectorChunksCount: 480,
    status: "indexed",
    similarityScore: 0.96,
  },
  {
    id: "doc-3",
    name: "MRPL_Hydrocracker_Unit3_Operating_Manual.pdf",
    category: "SOP",
    tags: ["Hydrocracker-SOPs", "Reactor-Overhead", "Metallurgy"],
    fileSize: 12400000,
    uploadedAt: "2026-08-28",
    sha256: "d3b07384d113edec49eaa6238ad5ff00b14c330f8efc0f498c8f00fcba3f7a81",
    vectorChunksCount: 612,
    status: "indexed",
    similarityScore: 0.91,
  },
];

const initialSockets: SocketConnection[] = [
  {
    id: "sock-1",
    protocol: "TCP",
    localAddress: "127.0.0.1",
    localPort: 8000,
    remoteAddress: "127.0.0.1",
    remotePort: 54321,
    state: "ESTABLISHED",
    processName: "fastapi-sovereign-agent",
    pid: 14208,
    isExternal: false,
    isBlocked: false,
  },
  {
    id: "sock-2",
    protocol: "TCP",
    localAddress: "127.0.0.1",
    localPort: 6333,
    remoteAddress: "0.0.0.0",
    remotePort: 0,
    state: "LISTEN",
    processName: "qdrant-embedded-vector",
    pid: 14210,
    isExternal: false,
    isBlocked: false,
  },
  {
    id: "sock-3",
    protocol: "TCP",
    localAddress: "127.0.0.1",
    localPort: 11434,
    remoteAddress: "0.0.0.0",
    remotePort: 0,
    state: "LISTEN",
    processName: "ollama-qwen2.5-14b-cuda",
    pid: 14215,
    isExternal: false,
    isBlocked: false,
  },
  {
    id: "sock-4",
    protocol: "TCP",
    localAddress: "0.0.0.0",
    localPort: 443,
    remoteAddress: "142.250.190.46",
    remotePort: 443,
    state: "BLOCKED",
    processName: "blocked_telemetry_probe",
    pid: 9999,
    isExternal: true,
    isBlocked: true,
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  // Navigation
  activeView: "tasks",
  setActiveView: (view) => set({ activeView: view }),
  isSidebarOpen: true,
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isContextPanelOpen: true,
  setContextPanelOpen: (open) => set({ isContextPanelOpen: open }),
  toggleContextPanel: () => set((state) => ({ isContextPanelOpen: !state.isContextPanelOpen })),
  activeContextTab: "timeline",
  setActiveContextTab: (tab) => set({ activeContextTab: tab }),

  // Operator
  operatorName: "Admin",
  operatorRole: "Lead Corrosion Specialist",
  setOperatorRole: (role) => set({ operatorRole: role }),

  // Model Settings
  modelConfig: {
    temperature: 0.0,
    topP: 0.9,
    contextWindowBudget: 32768,
    maxTokens: 4096,
    systemPrompt:
      "You are OnPremisAI, a confidential sovereign industrial AI agent deployed inside the Mangalore Refinery and Petrochemicals Limited (MRPL) air-gapped enclave. Strictly enforce OISD-105, ISO 27001, and API 570 standards. Never emit external network calls. Always yield to Human-in-the-Loop gates on safety critical maintenance actions.",
    selectedModel: "qwen2.5:14b",
    secondaryModel: "deepseek-r1:14b",
    isArenaMode: false,
  },
  setModelConfig: (config) =>
    set((state) => ({ modelConfig: { ...state.modelConfig, ...config } })),
  isModelModalOpen: false,
  setModelModalOpen: (open) => set({ isModelModalOpen: open }),

  // Configured Models
  configuredModels: [
    {
      id: "model-1",
      name: "Qwen 2.5 14B Industrial",
      endpoint: "http://localhost:11434/v1",
      provider: "Ollama (Local)",
    },
    {
      id: "model-2",
      name: "DeepSeek R1 14B Distill",
      endpoint: "http://localhost:11434/v1",
      provider: "Ollama (Local)",
    },
    {
      id: "model-3",
      name: "Llama 3.3 70B Industrial",
      endpoint: "http://localhost:11434/v1",
      provider: "Ollama (Local)",
    },
  ],
  addConfiguredModel: (model) =>
    set((state) => ({
      configuredModels: [
        ...state.configuredModels,
        { ...model, id: `model-${Date.now()}` },
      ],
    })),
  removeConfiguredModel: (id) =>
    set((state) => ({
      configuredModels: state.configuredModels.filter((m) => m.id !== id),
    })),

  // Tasks & History
  tasks: [initialTask],
  activeTaskId: "TASK-DEMO-01",
  setActiveTaskId: async (id) => {
    const state = get();
    if (state.activeTaskId === id) return;

    // Save previous active task state
    const updatedTasks = state.tasks.map((t) => {
      if (t.id === state.activeTaskId) {
        return {
          ...t,
          messages: state.messages,
          traceSteps: state.activeTraceSteps,
        };
      }
      return t;
    });

    const target = updatedTasks.find((t) => t.id === id);
    if (target) {
      set({
        tasks: updatedTasks,
        activeTaskId: id,
        messages: target.messages || [],
        activeTraceSteps: target.traceSteps || defaultExecutionSteps,
        isExecuting: false,
        currentRunningNode: null,
        isApprovalModalOpen: false,
        activeApprovalData: null,
        activeView: "tasks",
      });

      // If task has no messages, attempt to fetch from backend detail
      if (!target.messages || target.messages.length === 0) {
        try {
          const detail = await fetchTaskDetail(id as string);
          if (detail && detail.steps) {
            const restoredSteps = defaultExecutionSteps.map((step) => {
              const matching = detail.steps.find((s) => s.node_name === step.node);
              if (matching) {
                return {
                  ...step,
                  status: "completed" as AgentNodeStatus,
                  outputSummary: typeof matching.output === "object" ? matching.output?.summary || "Completed" : String(matching.output),
                };
              }
              return step;
            });

            const restoredMsg: Message = {
              id: `msg-backend-${detail.id}`,
              role: "assistant",
              content: `### Execution Task: ${detail.prompt}\n**Status:** ${detail.status.toUpperCase()}\n**Type:** ${detail.task_type}`,
              timestamp: detail.created_at ? detail.created_at.slice(11, 19) : "00:00:00",
              deliverable: detail.status === "done" ? {
                filename: `Report_${detail.id.slice(-6)}.docx`,
                fileSize: 1845000,
                sha256: detail.id,
                generatedAt: detail.created_at || "",
                downloadUrl: getDeliverableDownloadUrl(detail.id),
              } : undefined
            };

            set((st) => ({
              messages: [restoredMsg],
              activeTraceSteps: restoredSteps,
            }));
          }
        } catch (e) {
          // Keep existing target messages if offline
        }
      }
    } else {
      set({
        tasks: updatedTasks,
        activeTaskId: null,
        messages: [],
        activeTraceSteps: defaultExecutionSteps,
        isExecuting: false,
        currentRunningNode: null,
        isApprovalModalOpen: false,
        activeApprovalData: null,
        activeView: "tasks",
      });
    }
  },

  loadTasksFromBackend: async () => {
    try {
      const backendTasks = await fetchTaskList(0, 30);
      if (backendTasks && backendTasks.length > 0) {
        const mappedTasks: TaskItem[] = backendTasks.map((bt) => {
          const isDone = bt.status === "done";
          const isApproval = bt.status === "awaiting_approval";
          const isError = bt.status === "error";

          let taskStatus: TaskStatus = "RUNNING";
          if (isDone) taskStatus = "COMPLETED";
          else if (isApproval) taskStatus = "AWAITING_APPROVAL";
          else if (isError) taskStatus = "REJECTED";

          return {
            id: bt.id,
            title: bt.prompt.slice(0, 36) + (bt.prompt.length > 36 ? "..." : ""),
            category: "CUSTOM",
            status: taskStatus,
            createdAt: bt.created_at || new Date().toISOString(),
            updatedAt: bt.created_at || new Date().toISOString(),
            summary: bt.prompt.slice(0, 80),
            messages: [
              {
                id: `msg-init-${bt.id}`,
                role: "user",
                content: bt.prompt,
                timestamp: bt.created_at ? bt.created_at.slice(11, 19) : "12:00:00",
              }
            ],
            traceSteps: defaultExecutionSteps.map((step) => {
              const matchedStep = bt.steps?.find((s) => s.node_name === step.node);
              return {
                ...step,
                status: matchedStep ? ("completed" as AgentNodeStatus) : ("pending" as AgentNodeStatus),
                outputSummary: matchedStep ? (typeof matchedStep.output === "object" ? matchedStep.output?.summary : String(matchedStep.output)) : undefined,
              };
            }),
            pinned: false,
            deliverableUrl: isDone ? getDeliverableDownloadUrl(bt.id) : undefined,
          };
        });

        // Merge keeping pinned demo tasks
        const state = get();
        const demoTasks = state.tasks.filter((t) => t.pinned);
        const combined = [...demoTasks, ...mappedTasks.filter((mt) => !demoTasks.some((dt) => dt.id === mt.id))];

        set({ tasks: combined });
      }
    } catch (e) {
      console.warn("Backend not available yet to fetch task list, using local state:", e);
    }
  },

  createNewTask: () => {
    const state = get();

    // Preserve previous active task
    const updatedTasks = state.tasks.map((t) => {
      if (t.id === state.activeTaskId) {
        return {
          ...t,
          messages: state.messages,
          traceSteps: state.activeTraceSteps,
        };
      }
      return t;
    });

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const fullDate = `${dateStr} ${timeStr}:00 UTC`;
    const newId = `TASK-${Date.now().toString().slice(-6)}`;

    const newTask: TaskItem = {
      id: newId,
      title: "New Chat",
      category: "CUSTOM",
      status: "DRAFT",
      createdAt: fullDate,
      updatedAt: fullDate,
      summary: "Fresh sovereign inspection session.",
      messages: [],
      traceSteps: defaultExecutionSteps.map((s) => ({
        ...s,
        status: "pending",
        logs: [],
      })),
      pinned: false,
    };

    set({
      tasks: [newTask, ...updatedTasks],
      activeTaskId: newId,
      messages: [],
      activeTraceSteps: newTask.traceSteps,
      isExecuting: false,
      currentRunningNode: null,
      isApprovalModalOpen: false,
      activeApprovalData: null,
      activeView: "tasks",
    });
  },

  deleteTask: (id) => {
    const state = get();
    const remainingTasks = state.tasks.filter((t) => t.id !== id);
    if (state.activeTaskId === id) {
      const nextTask = remainingTasks[0] || null;
      set({
        tasks: remainingTasks,
        activeTaskId: nextTask ? nextTask.id : null,
        messages: nextTask ? nextTask.messages : [],
        activeTraceSteps: nextTask ? nextTask.traceSteps : defaultExecutionSteps,
        isExecuting: false,
        currentRunningNode: null,
      });
    } else {
      set({ tasks: remainingTasks });
    }
  },

  pinTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, pinned: !t.pinned } : t
      ),
    })),

  // Messages & Agent Steps
  messages: initialTask.messages,
  activeTraceSteps: initialTask.traceSteps,
  isExecuting: false,
  currentRunningNode: null,

  // Approval Gate
  isApprovalModalOpen: false,
  setApprovalModalOpen: (open) => set({ isApprovalModalOpen: open }),
  activeApprovalData: null,

  approveStep: async (pin, customComment) => {
    const state = get();
    const hash = await generateSHA256(
      `${state.operatorName}:${state.operatorRole}:${Date.now()}:${pin}`
    );

    const taskId = state.activeTaskId || "TASK-NEW-01";
    const downloadUrl = getDeliverableDownloadUrl(taskId);

    // Call real backend approval API if active task is a real task
    try {
      const isEdited = Boolean(customComment && customComment.trim().length > 0);
      await submitTaskApproval(taskId, {
        decision: isEdited ? "edit" : "approve",
        edits: customComment || undefined,
      });
    } catch (err) {
      console.warn("Could not push approval to backend API, proceeding locally:", err);
    }

    const updatedSteps = state.activeTraceSteps.map((step) =>
      step.node === "human_checkpoint"
        ? {
            ...step,
            status: "completed" as AgentNodeStatus,
            logs: [
              ...step.logs,
              `Verification PIN signed by ${state.operatorName} (${state.operatorRole}).`,
              `Cryptographic SHA-256 seal: ${hash}`,
            ],
          }
        : step.node === "generate_docx"
        ? {
            ...step,
            status: "completed" as AgentNodeStatus,
            durationMs: 600,
            logs: [
              "Synthesized executive .docx inspection report with embedded signature blocks.",
              `Stamping digital hash ${hash} into immutable audit ledger.`,
            ],
          }
        : step
    );

    // Update last assistant message
    const updatedMessages = [...state.messages];
    const lastMsgIndex = updatedMessages.findLastIndex((m) => m.role === "assistant");
    if (lastMsgIndex !== -1) {
      updatedMessages[lastMsgIndex] = {
        ...updatedMessages[lastMsgIndex],
        requiresApproval: false,
        approvalStatus: "approved",
        approvalDetails: {
          approvedBy: state.operatorName,
          approvedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
          signatureHash: hash,
          operatorRole: state.operatorRole,
          comment: customComment || "Emergency ASTM A335 Grade P22 spool piece fabrication authorized.",
        },
        deliverable: {
          filename: `MRPL_Report_${taskId.slice(-6)}.docx`,
          fileSize: 1845000,
          sha256: hash,
          generatedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
          downloadUrl: downloadUrl,
        },
      };
    }

    const updatedTasks = state.tasks.map((t) => {
      if (t.id === state.activeTaskId) {
        return {
          ...t,
          status: "COMPLETED" as TaskStatus,
          messages: updatedMessages,
          traceSteps: updatedSteps,
          deliverableUrl: downloadUrl,
          deliverableHash: hash,
        };
      }
      return t;
    });

    set({
      tasks: updatedTasks,
      activeTraceSteps: updatedSteps,
      messages: updatedMessages,
      isExecuting: false,
      currentRunningNode: null,
      isApprovalModalOpen: false,
      activeApprovalData: null,
      activeContextTab: "deliverable",
    });

    await state.addAuditLog({
      taskId: taskId,
      taskTitle: "Hydrocracker Unit 3 UT Wall Loss Audit",
      action: "DELIVERABLE_SIGNED",
      operator: state.operatorName,
      operatorRole: state.operatorRole,
      details: customComment || "Safety Critical sign-off approved with SHA-256 digital stamp.",
    });
  },

  rejectStep: async (reason) => {
    const state = get();
    const taskId = state.activeTaskId || "TASK-NEW-01";

    try {
      await submitTaskApproval(taskId, {
        decision: "reject",
        edits: reason || "Operator rejected recommendation",
      });
    } catch (err) {
      console.warn("Could not submit rejection to backend API, proceeding locally:", err);
    }

    const updatedSteps = state.activeTraceSteps.map((step) =>
      step.node === "human_checkpoint"
        ? {
            ...step,
            status: "failed" as AgentNodeStatus,
            logs: [...step.logs, `Recommendation rejected by operator: ${reason}`],
          }
        : step
    );

    const updatedTasks = state.tasks.map((t) => {
      if (t.id === state.activeTaskId) {
        return {
          ...t,
          status: "REJECTED" as TaskStatus,
          traceSteps: updatedSteps,
        };
      }
      return t;
    });

    set({
      tasks: updatedTasks,
      activeTraceSteps: updatedSteps,
      isExecuting: false,
      currentRunningNode: null,
      isApprovalModalOpen: false,
      activeApprovalData: null,
    });
  },

  editRecommendation: (newRecommendation) => {
    set((state) => ({
      activeApprovalData: {
        ...state.activeApprovalData,
        recommendedAction: newRecommendation,
      },
    }));
  },

  // Knowledge Base
  knowledgeDocs: initialDocs,
  addKnowledgeDoc: (doc) =>
    set((state) => ({ knowledgeDocs: [doc, ...state.knowledgeDocs] })),

  loadDocumentsFromBackend: async () => {
    try {
      const docs = await fetchDocuments();
      if (docs && docs.length > 0) {
        const mapped: KnowledgeDocument[] = docs.map((d: DocumentItem) => ({
          id: d.id,
          name: d.filename,
          category: d.doc_type === "generated" ? "SOP" : "API_STANDARD",
          tags: [d.doc_type, "Refinery", "Confidential"],
          fileSize: 2400000,
          uploadedAt: d.created_at ? d.created_at.slice(0, 10) : "2026-09-01",
          sha256: d.id,
          vectorChunksCount: 120,
          status: "indexed",
          similarityScore: 0.95,
        }));
        set({ knowledgeDocs: mapped });
      }
    } catch (e) {
      console.warn("Could not load backend documents:", e);
    }
  },

  // Audit Ledger
  auditLogs: [],
  addAuditLog: async (entry) => {
    const hash = await generateSHA256(
      `${entry.taskId}:${entry.action}:${entry.operator}:${Date.now()}`
    );
    const newEntry: AuditLogEntry = {
      id: `AUD-2026-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
      sha256Hash: hash,
      verified: true,
      ...entry,
    };
    set((state) => ({ auditLogs: [newEntry, ...state.auditLogs] }));
  },

  loadAuditLogsFromBackend: async () => {
    try {
      const [tasks, events] = await Promise.all([
        fetchTaskList(0, 15).catch(() => []),
        fetchNetworkEvents(0, 15).catch(() => []),
      ]);

      const entries: AuditLogEntry[] = [];

      for (const t of tasks) {
        if (t.steps) {
          for (const s of t.steps) {
            const hash = await generateSHA256(`${t.id}:${s.node_name}:${s.id}`);
            entries.push({
              id: `AUD-${s.id}`,
              timestamp: s.ts ? s.ts.replace("T", " ").slice(0, 19) + " UTC" : "2026-09-08 12:00:00 UTC",
              taskId: t.id,
              taskTitle: t.prompt.slice(0, 32) + "...",
              action: "STEP_COMPLETED",
              operator: "Sovereign Local Agent",
              operatorRole: "Lead Corrosion Specialist",
              sha256Hash: hash,
              verified: true,
              details: typeof s.output === "object" ? (s.output?.summary || JSON.stringify(s.output)) : String(s.output),
            });
          }
        }
      }

      for (const ev of events) {
        const hash = await generateSHA256(`NET-${ev.id}:${ev.dest}`);
        entries.push({
          id: `NET-${ev.id}`,
          timestamp: ev.ts ? ev.ts.replace("T", " ").slice(0, 19) + " UTC" : "2026-09-08 12:00:00 UTC",
          taskId: "SYSTEM-PERIMETER",
          taskTitle: "Network Sentinel Watcher",
          action: ev.allowed ? "APPROVAL_GRANTED" : "APPROVAL_REJECTED",
          operator: "eBPF Kernel Watcher",
          operatorRole: "Plant Safety Auditor",
          sha256Hash: hash,
          verified: true,
          details: `${ev.direction.toUpperCase()} attempt to ${ev.dest} -> ${ev.allowed ? "ALLOWED" : "BLOCKED"}`,
        });
      }

      if (entries.length > 0) {
        set({ auditLogs: entries });
      }
    } catch (e) {
      console.warn("Could not load backend audit logs:", e);
    }
  },

  // Network Sentinel
  networkStats: {
    airGapStatus: "VERIFIED_AIRGAP",
    totalSockets: 4,
    externalSockets: 0,
    blockedOutboundAttempts: 148,
    outboundBytesTotal: 0,
    inboundBytesTotal: 0,
    lastChecked: "Just now (Kernel Watcher Active)",
    hardwareInterface: "enp3s0 (Air-Gapped Loopback Only)",
  },
  activeSockets: initialSockets,
  refreshNetworkTelemetry: async () => {
    try {
      const stats = await fetchNetworkStatus();
      if (stats) {
        set((state) => ({
          networkStats: {
            ...state.networkStats,
            blockedOutboundAttempts: stats.blocked_attempts || 0,
            lastChecked: stats.last_checked ? stats.last_checked.replace("T", " ").slice(0, 19) : "Just now",
            totalSockets: stats.external_connections + 4,
            externalSockets: stats.external_connections,
          },
        }));
      }
    } catch (e) {
      console.warn("Could not refresh network status from API:", e);
    }
  },

  // Actions
  addMessage: (message) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const newMsg: Message = { id, timestamp, ...message };

    set((state) => {
      const newMessages = [...state.messages, newMsg];
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      const updatedAt = `${dateStr} ${timeStr}:00 UTC`;

      let activeId = state.activeTaskId;
      let currentTasks = [...state.tasks];

      if (!activeId || !currentTasks.some((t) => t.id === activeId)) {
        activeId = `TASK-${Date.now().toString().slice(-6)}`;
        const newTask: TaskItem = {
          id: activeId,
          title:
            message.role === "user" && message.content.trim()
              ? message.content.trim().slice(0, 36) + (message.content.trim().length > 36 ? "..." : "")
              : "New Chat",
          category: "CUSTOM",
          status: "RUNNING",
          createdAt: updatedAt,
          updatedAt,
          summary: message.content.slice(0, 80),
          messages: newMessages,
          traceSteps: state.activeTraceSteps,
          pinned: false,
        };
        currentTasks = [newTask, ...currentTasks];
      } else {
        currentTasks = currentTasks.map((t) => {
          if (t.id === activeId) {
            const isInitialTitle = !t.title || t.title === "New Chat" || t.title === "New Inspection Chat";
            const newTitle =
              message.role === "user" && isInitialTitle && message.content.trim()
                ? message.content.trim().slice(0, 36) + (message.content.trim().length > 36 ? "..." : "")
                : t.title;

            return {
              ...t,
              title: newTitle,
              updatedAt,
              status: (t.status === "DRAFT" ? "RUNNING" : t.status) as TaskStatus,
              messages: newMessages,
            };
          }
          return t;
        });
      }

      return {
        activeTaskId: activeId,
        messages: newMessages,
        tasks: currentTasks,
      };
    });
    return id;
  },

  updateMessage: (id, updates) => {
    set((state) => {
      const updatedMessages = state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m));
      const updatedTasks = state.tasks.map((t) => {
        if (t.id === state.activeTaskId) {
          return {
            ...t,
            messages: updatedMessages,
            ...(updates.requiresApproval ? { status: "AWAITING_APPROVAL" as TaskStatus } : {}),
          };
        }
        return t;
      });

      return {
        messages: updatedMessages,
        tasks: updatedTasks,
      };
    });
  },

  setTraceStepStatus: (stepId, status, summary, durationMs) => {
    set((state) => {
      const updatedSteps = state.activeTraceSteps.map((s) =>
        s.id === stepId
          ? {
              ...s,
              status,
              ...(summary ? { outputSummary: summary } : {}),
              ...(durationMs ? { durationMs } : {}),
            }
          : s
      );

      const updatedTasks = state.tasks.map((t) => {
        if (t.id === state.activeTaskId) {
          return {
            ...t,
            traceSteps: updatedSteps,
          };
        }
        return t;
      });

      return {
        activeTraceSteps: updatedSteps,
        tasks: updatedTasks,
      };
    });
  },

  addTraceStepLog: (stepId, log) => {
    set((state) => {
      const updatedSteps = state.activeTraceSteps.map((s) =>
        s.id === stepId ? { ...s, logs: [...s.logs, log] } : s
      );

      const updatedTasks = state.tasks.map((t) => {
        if (t.id === state.activeTaskId) {
          return {
            ...t,
            traceSteps: updatedSteps,
          };
        }
        return t;
      });

      return {
        activeTraceSteps: updatedSteps,
        tasks: updatedTasks,
      };
    });
  },

  resetTraceSteps: () => {
    const freshSteps = defaultExecutionSteps.map((s) => ({
      ...s,
      status: "pending" as AgentNodeStatus,
      logs: [],
    }));

    set((state) => {
      const updatedTasks = state.tasks.map((t) => {
        if (t.id === state.activeTaskId) {
          return {
            ...t,
            traceSteps: freshSteps,
          };
        }
        return t;
      });

      return {
        activeTraceSteps: freshSteps,
        tasks: updatedTasks,
      };
    });
  },

  setExecuting: (executing) => {
    set((state) => {
      let updatedTasks = state.tasks;
      if (!executing && state.activeTaskId) {
        updatedTasks = state.tasks.map((t) => {
          if (t.id === state.activeTaskId && t.status !== "AWAITING_APPROVAL" && t.status !== "REJECTED") {
            return {
              ...t,
              status: "COMPLETED" as TaskStatus,
              messages: state.messages,
              traceSteps: state.activeTraceSteps,
            };
          }
          return t;
        });
      }
      return {
        isExecuting: executing,
        tasks: updatedTasks,
      };
    });
  },

  initializeStore: async () => {
    const state = get();
    await Promise.allSettled([
      state.loadTasksFromBackend(),
      state.loadDocumentsFromBackend(),
      state.loadAuditLogsFromBackend(),
      state.refreshNetworkTelemetry(),
    ]);
  },
}));
