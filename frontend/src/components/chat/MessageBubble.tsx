"use client";

import React from "react";
import { ShieldCheck, User, CheckCircle2, Cpu, AlertTriangle } from "lucide-react";
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
      <div className="w-full max-w-4xl mx-auto my-3 p-3 rounded-none bg-red-950/40 border border-red-800/60 text-red-200 text-xs font-mono flex items-start gap-2.5">
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
      <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border font-mono font-bold text-xs ${
        isUser
          ? "bg-[#1C1C1C] border-[#2A2A2A] text-zinc-200"
          : "bg-[#FF6A00]/10 border-[#FF6A00]/50 text-[#FF6A00]"
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4 text-[#FF6A00]" />}
      </div>

      {/* Message Box */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header Metadata */}
        <div className={`flex items-center gap-2 text-[11px] font-mono ${isUser ? "justify-end text-zinc-400" : "text-zinc-400"}`}>
          <span className="font-bold text-[#F5F5F5]">{isUser ? "Plant Operator" : "OnPremisAI Engine"}</span>
          <span>•</span>
          <span>{formatDate(message.timestamp)}</span>
          {!isUser && (
            <>
              <span>•</span>
              <span className="text-[#FF6A00] flex items-center gap-1 font-bold">
                <Cpu className="w-3 h-3 text-[#FF6A00]" /> {selectedModel}
              </span>
            </>
          )}
        </div>

        {/* Content Body */}
        <div className={`p-4 rounded-none border leading-relaxed text-xs font-mono ${
          isUser
            ? "bg-[#161616] border-[#262626] text-[#F5F5F5]"
            : "bg-[#121212] border-[#242424] text-[#F5F5F5]"
        }`}>
          {/* Format text line breaks */}
          <div className="space-y-3 whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Assistant Security Audit Footer */}
          {!isUser && (
            <div className="mt-3 pt-3 border-t border-[#242424] flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-[#FF6A00] flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-[#FF6A00]" /> ZERO EGRESS VERIFIED
                </span>
                <span>|</span>
                <span>SANDBOX ENCLAVE</span>
              </div>
              <span className="text-zinc-400 font-bold">SOVEREIGN AI</span>
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

