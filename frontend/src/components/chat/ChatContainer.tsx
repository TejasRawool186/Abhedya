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
  FileCheck2,
  Loader2
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
    <div className="flex-1 flex flex-col min-h-0 bg-[#000000] relative overflow-hidden">
      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          /* Landing Page Hero View - Sovereign Industrial Intelligence Hub */
          <div className="max-w-4xl mx-auto my-auto py-8 space-y-8 select-none font-mono">
            {/* Header Badge & Hero Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6A00]/10 border border-[#FF6A00]/40 text-[#FF6A00] text-xs font-bold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Air-Gapped Sovereign Enclave • Active Status: Secure</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight uppercase">
                OnPremisAI Workbench
              </h1>

              <p className="text-xs text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Confidential Industrial Intelligence Platform for Refineries, Petrochemicals, & Sovereign Manufacturing.
              </p>
            </div>

            {/* Sovereign Guarantees Telemetry Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 bg-[#121212] border border-[#242424] space-y-1 relative group hover:border-[#FF6A00]/40 transition-colors">
                <div className="text-[#FF6A00] font-bold text-xs flex items-center gap-1.5 uppercase">
                  <Lock className="w-3.5 h-3.5" /> ZERO EGRESS
                </div>
                <div className="text-[11px] text-zinc-400">100% on-premise execution. Outbound web network disabled.</div>
              </div>

              <div className="p-3 bg-[#121212] border border-[#242424] space-y-1 relative group hover:border-[#FF6A00]/40 transition-colors">
                <div className="text-[#FF6A00] font-bold text-xs flex items-center gap-1.5 uppercase">
                  <Cpu className="w-3.5 h-3.5" /> HARDWARE ENGINE
                </div>
                <div className="text-[11px] text-zinc-300 font-bold truncate">{selectedModel}</div>
              </div>

              <div className="p-3 bg-[#121212] border border-[#242424] space-y-1 relative group hover:border-[#FF6A00]/40 transition-colors">
                <div className="text-[#FF6A00] font-bold text-xs flex items-center gap-1.5 uppercase">
                  <FileCheck2 className="w-3.5 h-3.5" /> HITL APPROVAL
                </div>
                <div className="text-[11px] text-zinc-400">Deterministic human sign-off checkpoint for critical tasks.</div>
              </div>
            </div>

            {/* Industrial Quick-Launch Workspace Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 uppercase font-bold border-b border-[#242424] pb-2">
                <span>Quick-Launch Industrial Presets</span>
                <span className="text-[#FF6A00]">Select to Initialize Workspace</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <button
                  type="button"
                  onClick={() => {
                    useTaskStore.getState().addMessage({
                      role: "user",
                      content: "Execute MRPL Hydrocracker Unit Inspection & NDT Thickness Audit based on recent NDT reports.",
                    });
                  }}
                  className="p-4 bg-[#121212] border border-[#242424] hover:border-[#FF6A00] transition-colors text-left space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] uppercase">
                      [01] Hydrocracker Thickness Audit
                    </span>
                    <FileCheck2 className="w-4 h-4 text-zinc-500 group-hover:text-[#FF6A00]" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Analyze non-destructive testing (NDT) wall thickness logs and generate compliance report.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    useTaskStore.getState().addMessage({
                      role: "user",
                      content: "Verify OISD-105 Safety Standard Compliance for Hot Work Permit in Crude Distillation Unit.",
                    });
                  }}
                  className="p-4 bg-[#121212] border border-[#242424] hover:border-[#FF6A00] transition-colors text-left space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] uppercase">
                      [02] OISD-105 Safety Verification
                    </span>
                    <ShieldCheck className="w-4 h-4 text-zinc-500 group-hover:text-[#FF6A00]" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Cross-reference hot work permits against OISD-105 refinery safety regulations.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    useTaskStore.getState().addMessage({
                      role: "user",
                      content: "Perform FFT Spectrum & Vibration Anomaly Analysis on Pump-201A acoustic telemetry.",
                    });
                  }}
                  className="p-4 bg-[#121212] border border-[#242424] hover:border-[#FF6A00] transition-colors text-left space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] uppercase">
                      [03] Vibration Anomaly FFT
                    </span>
                    <Cpu className="w-4 h-4 text-zinc-500 group-hover:text-[#FF6A00]" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Inspect telemetry sensor FFT spikes for bearing fatigue and impeller cavitation risks.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    useTaskStore.getState().addMessage({
                      role: "user",
                      content: "Query internal knowledge base for confidential refinery SOP emergency shutdown procedure.",
                    });
                  }}
                  className="p-4 bg-[#121212] border border-[#242424] hover:border-[#FF6A00] transition-colors text-left space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] uppercase">
                      [04] Confidential SOP Vector Search
                    </span>
                    <Lock className="w-4 h-4 text-zinc-500 group-hover:text-[#FF6A00]" />
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Air-gapped vector retrieval across internal manuals, P&IDs, and plant documentation.
                  </p>
                </button>
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
              <div className="w-full max-w-4xl mx-auto p-3 rounded-none bg-[#121212] border border-[#FF6A00]/40 font-mono text-xs text-[#FF6A00] flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF6A00]" />
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

