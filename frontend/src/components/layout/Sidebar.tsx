"use client";

import React from "react";
import {
  Plus,
  MessageSquare,
  FileText,
  ShieldCheck,
  History,
  Lock,
  ChevronRight
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
    <aside className="w-64 border-r border-[var(--border)] bg-[#0B0B0B] flex flex-col shrink-0 z-10 h-full select-none transition-all duration-200">
      {/* New Task Button */}
      <div className="p-3 border-b border-[var(--border)]">
        <button
          onClick={handleNewTask}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-none bg-[#FF6A00] hover:bg-[#E05D00] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(255,106,0,0.25)] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Sovereign Task</span>
        </button>
      </div>

      {/* Main Workspace Navigation Sections */}
      <div className="py-2 space-y-0.5 border-b border-[var(--border)] text-xs font-medium">
        <div className="px-3 py-1 text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-widest">
          Workbench Workspace
        </div>

        <button
          onClick={() => setActiveTab("workbench")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-colors border-l-2 ${
            activeTab === "workbench"
              ? "bg-[#141414] text-[#F5F5F5] font-bold border-[#FF6A00]"
              : "text-zinc-400 hover:bg-[#121212] hover:text-zinc-200 border-transparent"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <MessageSquare className={`w-4 h-4 ${activeTab === "workbench" ? "text-[#FF6A00]" : "text-zinc-400"}`} />
            <span>Task Execution</span>
          </div>
          {activeTab === "workbench" && <ChevronRight className="w-3.5 h-3.5 text-[#FF6A00]" />}
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-colors border-l-2 ${
            activeTab === "documents"
              ? "bg-[#141414] text-[#F5F5F5] font-bold border-[#FF6A00]"
              : "text-zinc-400 hover:bg-[#121212] hover:text-zinc-200 border-transparent"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className={`w-4 h-4 ${activeTab === "documents" ? "text-[#FF6A00]" : "text-zinc-400"}`} />
            <span>Knowledge Base & SOPs</span>
          </div>
          {activeTab === "documents" && <ChevronRight className="w-3.5 h-3.5 text-[#FF6A00]" />}
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-colors border-l-2 ${
            activeTab === "audit"
              ? "bg-[#141414] text-[#F5F5F5] font-bold border-[#FF6A00]"
              : "text-zinc-400 hover:bg-[#121212] hover:text-zinc-200 border-transparent"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <History className={`w-4 h-4 ${activeTab === "audit" ? "text-[#FF6A00]" : "text-zinc-400"}`} />
            <span>Audit Trail & Traceability</span>
          </div>
          {activeTab === "audit" && <ChevronRight className="w-3.5 h-3.5 text-[#FF6A00]" />}
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-colors border-l-2 ${
            activeTab === "security"
              ? "bg-[#141414] text-[#F5F5F5] font-bold border-[#FF6A00]"
              : "text-zinc-400 hover:bg-[#121212] hover:text-zinc-200 border-transparent"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className={`w-4 h-4 ${activeTab === "security" ? "text-[#FF6A00]" : "text-zinc-400"}`} />
            <span>Network Sentinel</span>
          </div>
          {activeTab === "security" && <ChevronRight className="w-3.5 h-3.5 text-[#FF6A00]" />}
        </button>
      </div>

      {/* Recent Tasks List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider flex items-center justify-between">
          <span>Recent Industrial Tasks</span>
          <span className="text-zinc-400">{recentTasks.length}</span>
        </div>

        {recentTasks.length === 0 ? (
          <div className="p-3 text-center text-xs text-zinc-400 border border-dashed border-[var(--border)] rounded-none font-mono">
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
                className={`w-full text-left p-2 rounded-none border text-xs transition-all ${
                  isSelected
                    ? "bg-[#FF6A00]/10 border-[#FF6A00]/60 text-zinc-100 font-medium"
                    : "bg-[#121212]/60 border-[#1C1C1C] hover:border-[#262626] text-zinc-300 hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium truncate">
                  <span className={`w-1.5 h-1.5 rounded-none shrink-0 ${
                    item.status === "completed" ? "bg-[#FF6A00]" : "bg-amber-400"
                  }`} />
                  <span className="truncate font-sans">{item.title}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-400 font-mono">
                  <span>{item.id}</span>
                  <span className="uppercase text-[9px] text-[#FF6A00] font-bold">{item.status}</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Enclave Operator Footer */}
      <div className="p-3 border-t border-[var(--border)] bg-[#0E0E0E] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-none bg-[#FF6A00]/10 border border-[#FF6A00]/40 flex items-center justify-center text-[#FF6A00] font-mono font-bold text-xs">
            OP
          </div>
          <div className="flex-1 truncate">
            <div className="font-semibold text-zinc-200 text-xs flex items-center gap-1">
              <span>Plant Operator</span>
              <Lock className="w-3 h-3 text-[#FF6A00]" />
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

