"use client";

import React from "react";
import {
  Plus,
  MessageSquare,
  FileText,
  ShieldCheck,
  History,
  HardDrive,
  CheckCircle2,
  Lock,
  ChevronRight,
  Database,
  Cpu,
  Layers,
  Terminal
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";

export const Sidebar: React.FC = () => {
  const sidebarOpen = useTaskStore((s) => s.sidebarOpen);
  const activeTab = useTaskStore((s) => s.activeTab);
  const setActiveTab = useTaskStore((s) => s.setActiveTab);
  const resetTask = useTaskStore((s) => s.resetTask);
  const recentTasks = useTaskStore((s) => s.recentTasks);
  const activeTask = useTaskStore((s) => s.activeTask);
  const setTask = useTaskStore((s) => s.setTask);

  if (!sidebarOpen) return null;

  const handleNewTask = () => {
    resetTask();
    setActiveTab("workbench");
  };

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--panel)] flex flex-col shrink-0 z-10 h-full select-none transition-all duration-200">
      {/* New Task Button */}
      <div className="p-3 border-b border-[var(--border)]">
        <button
          onClick={handleNewTask}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Sovereign Task</span>
        </button>
      </div>

      {/* Main Workspace Navigation Sections */}
      <div className="p-2 space-y-1 border-b border-[var(--border)] text-xs font-medium">
        <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
          Workbench Workspace
        </div>

        <button
          onClick={() => setActiveTab("workbench")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
            activeTab === "workbench"
              ? "bg-emerald-950/70 text-emerald-300 font-semibold border border-emerald-800/50"
              : "text-zinc-300 hover:bg-[var(--panel-2)] hover:text-zinc-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <MessageSquare className={`w-4 h-4 ${activeTab === "workbench" ? "text-emerald-400" : "text-zinc-400"}`} />
            <span>Task Execution</span>
          </div>
          {activeTab === "workbench" && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
            activeTab === "documents"
              ? "bg-emerald-950/70 text-emerald-300 font-semibold border border-emerald-800/50"
              : "text-zinc-300 hover:bg-[var(--panel-2)] hover:text-zinc-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className={`w-4 h-4 ${activeTab === "documents" ? "text-emerald-400" : "text-zinc-400"}`} />
            <span>Knowledge Base & SOPs</span>
          </div>
          {activeTab === "documents" && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
            activeTab === "audit"
              ? "bg-emerald-950/70 text-emerald-300 font-semibold border border-emerald-800/50"
              : "text-zinc-300 hover:bg-[var(--panel-2)] hover:text-zinc-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <History className={`w-4 h-4 ${activeTab === "audit" ? "text-emerald-400" : "text-zinc-400"}`} />
            <span>Audit Trail & Traceability</span>
          </div>
          {activeTab === "audit" && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
            activeTab === "security"
              ? "bg-emerald-950/70 text-emerald-300 font-semibold border border-emerald-800/50"
              : "text-zinc-300 hover:bg-[var(--panel-2)] hover:text-zinc-100"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className={`w-4 h-4 ${activeTab === "security" ? "text-emerald-400" : "text-zinc-400"}`} />
            <span>Network Sentinel</span>
          </div>
          {activeTab === "security" && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>

      {/* Recent Tasks List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider flex items-center justify-between">
          <span>Recent Industrial Tasks</span>
          <span className="text-zinc-400">{recentTasks.length}</span>
        </div>

        {recentTasks.length === 0 ? (
          <div className="p-3 text-center text-xs text-zinc-400 border border-dashed border-[var(--border)] rounded-md">
            No recent tasks recorded.
          </div>
        ) : (
          recentTasks.map((item) => {
            const isSelected = activeTask?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTask({
                    id: item.id,
                    prompt: item.title,
                    status: item.status,
                    createdAt: item.timestamp,
                    updatedAt: item.timestamp,
                  });
                  setActiveTab("workbench");
                }}
                className={`w-full text-left p-2 rounded-md border text-xs transition-all ${
                  isSelected
                    ? "bg-emerald-950/60 border-emerald-700/60 text-emerald-200"
                    : "bg-[var(--panel-2)]/40 border-transparent hover:border-[var(--border)] text-zinc-300 hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium truncate">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    item.status === "completed" ? "bg-emerald-400" : "bg-amber-400"
                  }`} />
                  <span className="truncate">{item.title}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-400 font-mono">
                  <span>{item.id}</span>
                  <span className="uppercase text-[9px] text-emerald-400/80">{item.status}</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Enclave Operator Footer */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--panel-2)]/60 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-700/50 flex items-center justify-center text-emerald-300 font-mono font-bold text-xs">
            OP
          </div>
          <div className="flex-1 truncate">
            <div className="font-semibold text-zinc-200 text-xs flex items-center gap-1">
              <span>Plant Operator</span>
              <Lock className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-[10px] text-zinc-400 font-mono truncate">
              MRPL Refinery Enclave #01
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
