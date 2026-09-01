"use client";

import React, { useEffect, useRef } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useAgentTrace } from "@/hooks/useAgentTrace";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import {
  ShieldCheck,
  Cpu,
  Lock,
  Sparkles,
  Search,
  FileCheck2,
  AlertTriangle,
  Loader2,
  Wrench
} from "lucide-react";

export const ChatContainer: React.FC = () => {
  const messages = useTaskStore((s) => s.messages);
  const activeTask = useTaskStore((s) => s.activeTask);
  const isStreaming = useTaskStore((s) => s.isStreaming);
  const selectedModel = useTaskStore((s) => s.selectedModel);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hook connecting SSE stream for active task
  useAgentTrace(activeTask?.id);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--background)] relative overflow-hidden">
      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          /* Empty / Welcome State Open WebUI Style */
          <div className="max-w-2xl mx-auto my-auto py-12 text-center space-y-6 select-none">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(5,150,105,0.3)]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-mono font-bold text-zinc-100 tracking-tight">
                Sovereign AI Workbench
              </h2>
              <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
                Air-gapped, zero-egress industrial intelligence platform powered by local Ollama models. Upload inspection reports, query SOPs, or execute high-assurance tasks.
              </p>
            </div>

            {/* Sovereign Guarantees Badges Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-left font-mono text-[11px]">
              <div className="p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> ZERO EGRESS
                </div>
                <div className="text-[10px] text-zinc-400">100% local processing. No data leaves premise.</div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" /> LOCAL MODEL
                </div>
                <div className="text-[10px] text-zinc-400">{selectedModel}</div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5" /> HITL GATE
                </div>
                <div className="text-[10px] text-zinc-400">Human-in-the-loop approval before report synthesis.</div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Conversation Stream */
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id || index}
                message={msg}
                isLast={index === messages.length - 1}
              />
            ))}

            {/* Streaming Active Spinner Banner */}
            {isStreaming && (
              <div className="w-full max-w-4xl mx-auto p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 font-mono text-xs text-emerald-300 flex items-center gap-2.5 shadow-md">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Sovereign Agent Executing Pipeline Node…</span>
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Rich Composer Box */}
      <Composer />
    </div>
  );
};
