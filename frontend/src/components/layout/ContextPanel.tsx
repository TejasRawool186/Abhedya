"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Cpu,
  FileCheck2,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  FileText,
  X,
  Server,
  Zap
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { ExecutionTimeline } from "@/components/agent/ExecutionTimeline";

export const ContextPanel: React.FC = () => {
  const contextPanelOpen = useTaskStore((s) => s.contextPanelOpen);
  const toggleContextPanel = useTaskStore((s) => s.toggleContextPanel);
  const activeTask = useTaskStore((s) => s.activeTask);
  const selectedModel = useTaskStore((s) => s.selectedModel);
  const approval = useTaskStore((s) => s.approval);
  const attachments = useTaskStore((s) => s.attachments);
  const network = useTaskStore((s) => s.network);
  const agentSteps = useTaskStore((s) => s.agentSteps);

  if (!contextPanelOpen) return null;

  const riskLevel = approval.riskLevel || (activeTask ? "MEDIUM" : "LOW");

  return (
    <aside className="w-80 border-l border-[var(--border)] bg-[var(--panel)] flex flex-col shrink-0 z-10 h-full select-none overflow-y-auto">
      {/* Inspector Header */}
      <div className="p-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--panel-2)]/60">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
            Task Execution Inspector
          </h3>
        </div>
        <button
          onClick={toggleContextPanel}
          className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-[var(--panel-2)] transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 space-y-4 text-xs">
        {/* 1. Sovereign Security & Risk Audit Card */}
        <div className="p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Security Architecture
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 font-bold">
              AIR-GAPPED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
              <div className="text-zinc-400 text-[9px] uppercase">Egress Traffic</div>
              <div className="text-emerald-400 font-bold text-xs flex items-center gap-1 mt-0.5">
                <Lock className="w-3 h-3" />
                <span>0 Bytes</span>
              </div>
            </div>

            <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800">
              <div className="text-zinc-400 text-[9px] uppercase">Risk Level</div>
              <div className={`font-bold text-xs flex items-center gap-1 mt-0.5 ${
                riskLevel === "HIGH"
                  ? "text-red-400"
                  : riskLevel === "MEDIUM"
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}>
                <AlertOctagon className="w-3 h-3" />
                <span>{riskLevel}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-zinc-400 font-mono space-y-1 pt-1 border-t border-zinc-800">
            <div className="flex justify-between">
              <span>Execution Enclave:</span>
              <span className="text-zinc-300 font-semibold">{network?.node_name || "SOVEREIGN-NODE"}</span>
            </div>
            <div className="flex justify-between">
              <span>Verification Gate:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> PASSED
              </span>
            </div>
          </div>
        </div>

        {/* 2. Active Sovereign Model Info Card */}
        <div className="p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 font-semibold uppercase">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              Sovereign LLM Engine
            </span>
            <span className="text-[10px] text-emerald-400">ON-PREMISE</span>
          </div>

          <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 space-y-1">
            <div className="font-mono text-xs font-semibold text-zinc-200 truncate">
              {selectedModel}
            </div>
            <div className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Context: 32K tokens • Quantization: INT8</span>
            </div>
          </div>
        </div>

        {/* 3. Pipeline Execution Timeline Stepper */}
        <div className="p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 font-semibold uppercase">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Agentic Pipeline Nodes
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">{agentSteps.length} Steps</span>
          </div>

          <ExecutionTimeline />
        </div>

        {/* 4. Ingested Documents & Knowledge Base Context */}
        <div className="p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 font-semibold uppercase">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Active Knowledge Attachments
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">{attachments.length} Loaded</span>
          </div>

          {attachments.length === 0 ? (
            <div className="p-2.5 text-center text-[11px] text-zinc-400 border border-dashed border-zinc-800 rounded">
              No custom files attached for this task.
            </div>
          ) : (
            <div className="space-y-1.5">
              {attachments.map((file) => (
                <div key={file.id} className="p-2 rounded bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-mono text-[11px] text-zinc-200 truncate">{file.filename}</div>
                      <div className="text-[9px] text-zinc-400 font-mono">
                        {file.documentId ? `ID: ${file.documentId.substring(0, 12)}...` : "Uploaded"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    RAG READY
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Operator Checkpoint Status */}
        {approval.required && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Operator Approval Pending</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-mono">
              The Sovereign Agent has generated a recommendation requiring explicit human validation before final report synthesis.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
