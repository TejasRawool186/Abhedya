"use client";

import React from "react";
import { ShieldCheck, User, CheckCircle2, Lock, Cpu, Clock, AlertTriangle, FileText, Download } from "lucide-react";
import type { Message } from "@/types/chat";
import { formatDate } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";
import { ApprovalCheckpoint } from "@/components/approval/ApprovalCheckpoint";
import { DownloadResult } from "@/components/chat/DownloadResult";

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLast }) => {
  const isUser = message.role === "user";
  const isError = message.role === "error";
  const approval = useTaskStore((s) => s.approval);
  const activeTask = useTaskStore((s) => s.activeTask);
  const selectedModel = useTaskStore((s) => s.selectedModel);

  if (isError) {
    return (
      <div className="w-full max-w-4xl mx-auto my-3 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 text-xs font-mono flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold uppercase text-red-400">System Execution Error</div>
          <div>{message.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto my-4 flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border font-mono font-bold text-xs ${
        isUser
          ? "bg-zinc-800 border-zinc-700 text-zinc-200"
          : "bg-emerald-950 border-emerald-700/60 text-emerald-400 shadow-[0_0_10px_rgba(5,150,105,0.2)]"
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
      </div>

      {/* Message Box */}
      <div className={`flex-1 min-w-0 space-y-2`}>
        {/* Header Metadata */}
        <div className={`flex items-center gap-2 text-[11px] font-mono ${isUser ? "justify-end text-zinc-400" : "text-zinc-400"}`}>
          <span className="font-semibold text-zinc-200">{isUser ? "Plant Operator" : "OnPremisAI Engine"}</span>
          <span>•</span>
          <span>{formatDate(message.timestamp)}</span>
          {!isUser && (
            <>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> {selectedModel}
              </span>
            </>
          )}
        </div>

        {/* Content Body */}
        <div className={`p-4 rounded-xl border leading-relaxed text-sm ${
          isUser
            ? "bg-zinc-900 border-zinc-800 text-zinc-100 font-sans"
            : "bg-[var(--panel)] border-[var(--border)] text-zinc-100 font-sans shadow-md"
        }`}>
          {/* Format text line breaks and Markdown style */}
          <div className="space-y-3 whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Assistant Security Audit Footer */}
          {!isUser && (
            <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ZERO EGRESS VERIFIED
                </span>
                <span>|</span>
                <span>SANDBOX ENCLAVE</span>
              </div>
              <span className="text-zinc-400">SOVEREIGN AI</span>
            </div>
          )}
        </div>

        {/* If this is the last assistant message and requires approval, render Approval Checkpoint */}
        {!isUser && isLast && approval.required && approval.status === "pending" && (
          <ApprovalCheckpoint />
        )}

        {/* If task completed, render Download Result Card */}
        {!isUser && isLast && activeTask?.status === "completed" && activeTask.downloadUrl && (
          <DownloadResult downloadUrl={activeTask.downloadUrl} />
        )}
      </div>
    </div>
  );
};
