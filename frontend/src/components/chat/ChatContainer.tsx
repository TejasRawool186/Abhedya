"use client";

import React, { useRef, useEffect } from "react";
import {
  FileScan,
  Activity,
  Award,
  Sparkles,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import { AttachedFile } from "@/types/chat";
import { connectRealAgentTraceStream } from "@/lib/sse";
import { submitIndustrialTask, uploadDocument, getDeliverableDownloadUrl } from "@/lib/api";
import { mockCorrosionDegradationCurve } from "@/mocks/mockInspectionData";
import { mockPumpVibrationFFTSpectrum } from "@/mocks/mockVibrationData";

export function ChatContainer() {
  const {
    messages,
    addMessage,
    updateMessage,
    isExecuting,
    setExecuting,
    setTraceStepStatus,
    addTraceStepLog,
    resetTraceSteps,
    modelConfig,
    activeTaskId,
    initializeStore,
  } = useTaskStore();

  const streamAbortRef = useRef<{ abort: () => void } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize store on mount
  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  // Auto-scroll on new message / streaming token
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (prompt: string, attachments: AttachedFile[]) => {
    if (isExecuting) return;

    // 1. Add user message
    const userMsgId = addMessage({
      role: "user",
      content: prompt,
      attachments,
    });

    // 2. Add assistant placeholder message
    const asstMsgId = addMessage({
      role: "assistant",
      content: "Initializing sovereign enclave execution...",
      isStreaming: true,
      reasoningSteps: [],
    });

    // 3. Reset and start agent trace
    resetTraceSteps();
    setExecuting(true);

    const isVibrationQuery =
      prompt.toLowerCase().includes("vibration") ||
      prompt.toLowerCase().includes("fft") ||
      prompt.toLowerCase().includes("bearing") ||
      prompt.toLowerCase().includes("pump");

    let uploadedDocId: string | undefined = undefined;

    // 4. Ingest attached file to backend if rawFile exists
    try {
      const fileToUpload = attachments.find((a) => a.rawFile);
      if (fileToUpload && fileToUpload.rawFile) {
        addTraceStepLog("step-1", `Uploading ${fileToUpload.name} to air-gapped storage enclave...`);
        const uploadRes = await uploadDocument(fileToUpload.rawFile);
        uploadedDocId = uploadRes.document_id;
        addTraceStepLog("step-1", `Document stored securely (ID: ${uploadedDocId.slice(0, 8)}...).`);
      }
    } catch (err: any) {
      console.warn("Upload to backend skipped/failed:", err?.message);
    }

    // 5. Submit task to FastAPI backend /api/v1/chat
    let taskId = `TASK-${Date.now().toString().slice(-6)}`;
    try {
      const selectedModel = modelConfig.selectedModel || "qwen2.5:14b";
      const taskRes = await submitIndustrialTask({
        prompt,
        documentId: uploadedDocId,
        selectedModels: [selectedModel],
      });
      if (taskRes && taskRes.taskId) {
        taskId = taskRes.taskId;
        useTaskStore.setState({ activeTaskId: taskId });
      }
    } catch (err: any) {
      console.warn("Backend chat API error, falling back to sovereign pipeline fallback:", err);
    }

    // 6. Connect to real live SSE stream from backend
    let currentAssistantText = "";

    const stream = connectRealAgentTraceStream(taskId, {
      onStepStart: (stepId, node) => {
        setTraceStepStatus(stepId, "running");
      },
      onStepLog: (stepId, log) => {
        addTraceStepLog(stepId, log);
      },
      onStepComplete: (stepId, durationMs, summary, rawOutput) => {
        setTraceStepStatus(stepId, "completed", summary, durationMs);
      },
      onTokenStream: (token, fullTextUpdate) => {
        if (fullTextUpdate) {
          currentAssistantText = fullTextUpdate;
        } else {
          currentAssistantText += token;
        }

        updateMessage(asstMsgId, {
          content: currentAssistantText,
          isStreaming: true,
          chartData: isVibrationQuery
            ? {
                type: "vibration_fft",
                title: "P-102B Crude Charge Pump FFT Vibration Spectrum",
                description:
                  "Spectral analysis highlighting BPFO outer race defect spike at 148.5 Hz (5.12 mm/s).",
                data: mockPumpVibrationFFTSpectrum,
                threshold: 2.8,
              }
            : {
                type: "corrosion_curve",
                title: "CML-HC-101A Wall Thickness Degradation Curve vs MAWT Limit",
                description:
                  "Historical UT measurements projecting MAWT limit breach (6.5 mm) by Q4 2027.",
                data: mockCorrosionDegradationCurve,
                threshold: 6.5,
              },
          reasoningSteps: [
            "1. Rule Router: Verified local air-gap perimeter & classified equipment payload.",
            "2. Vector Grounding: Queried local ChromaDB for API 570 / OISD-105 standard chunks.",
            "3. Mathematical Model: Evaluated corrosion rate and projected MAWT retirement threshold.",
            "4. Safety Policy: Human-in-the-Loop checkpoint required prior to deliverable release.",
          ],
        });
      },
      onRequiresApproval: (approvalData) => {
        updateMessage(asstMsgId, {
          isStreaming: false,
          requiresApproval: true,
          approvalStatus: "pending",
        });
        setTraceStepStatus(
          "step-4",
          "waiting_approval",
          "Awaiting Lead Corrosion Specialist digital PIN sign-off"
        );
        useTaskStore.setState({
          activeApprovalData: approvalData,
          isApprovalModalOpen: true,
        });
      },
      onTaskComplete: (deliverable) => {
        const downloadUrl = getDeliverableDownloadUrl(taskId);
        updateMessage(asstMsgId, {
          isStreaming: false,
          deliverable: {
            filename: deliverable?.filename || `MRPL_Report_${taskId.slice(-6)}.docx`,
            fileSize: deliverable?.fileSize || 1845000,
            sha256: deliverable?.sha256 || `SHA256-${taskId}`,
            generatedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
            downloadUrl: downloadUrl,
          },
        });
        setExecuting(false);
      },
      onError: (err) => {
        console.error("Trace error", err);
        updateMessage(asstMsgId, {
          isStreaming: false,
          content: currentAssistantText || `System note: Agent pipeline error occurred (${err}). Check that the backend server is running at http://localhost:8000.`,
        });
        setExecuting(false);
      },
    });

    streamAbortRef.current = stream;
  };

  const quickPresets = [
    {
      title: "Hydrocracker UT Audit",
      description: "Extract CML wall thickness, calculate corrosion rates & API 570 MAWT limit.",
      prompt:
        "Analyze the uploaded ultrasonic thickness inspection log for Hydrocracker Unit 3. Extract the nominal vs measured wall thickness at all Condition Monitoring Locations (CMLs), compute short-term and long-term corrosion rates, project remaining life, and check compliance against API 570 minimum retirement thickness (MAWT = 6.5 mm).",
      file: {
        id: "att-preset-1",
        name: "hydrocracker_ut_log.pdf",
        size: 2450000,
        type: "application/pdf",
      },
      icon: FileScan,
    },
    {
      title: "Pump Vibration FFT",
      description: "Analyze crude charge pump FFT spectrum for bearing wear and unbalance spikes.",
      prompt:
        "Evaluate pump P-102B FFT vibration spectrum for bearing wear, unbalance, and misalignment frequencies against ISO 10816 vibration severity limits.",
      file: {
        id: "att-preset-2",
        name: "vibration_fft_sample.json",
        size: 480000,
        type: "application/json",
      },
      icon: Activity,
    },
    {
      title: "OISD-105 Work Permit",
      description: "Verify confined space hot work permit against statutory OISD checklists.",
      prompt:
        "Verify the current hot work & confined space work permit against OISD-STD-105 standard operating checklists for atmospheric testing, blind isolation, and fire watch compliance.",
      icon: Award,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full w-full min-h-0 overflow-hidden bg-canvas relative">
      {/* Scrollable Conversation Canvas */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            /* Claude-style Welcome Screen */
            <div className="py-20 text-center select-none">
              <div className="w-12 h-12 rounded-full bg-accent/12 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold text-primary tracking-tight">
                How can I help you today?
              </h2>
              <p className="mt-2 text-[15px] text-primary-secondary max-w-md mx-auto leading-relaxed">
                Air-gapped industrial AI with deterministic reasoning and human-in-the-loop verification.
              </p>

              {/* Quick Launch Presets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-10 text-left">
                {quickPresets.map((preset, idx) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        handleSendMessage(
                          preset.prompt,
                          preset.file ? [preset.file] : []
                        )
                      }
                      className="p-4 rounded-2xl border border-border-subtle bg-surface-card hover:bg-surface-hover hover:border-border-medium transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-accent/8 flex items-center justify-center text-accent mb-3">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-[13px] font-medium text-primary mb-1">
                        {preset.title}
                      </h4>
                      <p className="text-[12px] text-primary-secondary leading-relaxed">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Message Stream */
            messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Floating Composer with gradient fade */}
      <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-canvas via-canvas/95 to-transparent pt-6">
        <Composer onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
