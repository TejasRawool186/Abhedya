"use client";

import React, { useState, useRef } from "react";
import {
  Send,
  Paperclip,
  X,
  FileText,
  Loader2,
  Cpu,
  Lock,
  ShieldCheck,
  FileSearch,
  Wrench,
  AlertCircle
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useChat } from "@/hooks/useChat";

const QUICK_PROMPTS = [
  {
    icon: FileSearch,
    label: "Inspection Report Audit",
    prompt: "Analyze the uploaded ultrasonic thickness & corrosion inspection report for MRPL Hydrocracker Unit #3. Identify critical thickness losses, calculate remaining wall life, and generate compliance recommendations.",
  },
  {
    icon: Wrench,
    label: "Equipment Vibration Anomaly",
    prompt: "Evaluate vibration data and bearing temperature logs for Crude Distillation Pump P-102. Determine root cause of anomalous high frequency FFT peaks and recommend maintenance window.",
  },
  {
    icon: ShieldCheck,
    label: "Safety SOP Compliance Check",
    prompt: "Cross-reference current refinery hot work permits against OISD-STD-105 standard operating procedures. Flag any missing gas testing logs or unapproved isolation barriers.",
  },
];

export const Composer: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const attachments = useTaskStore((s) => s.attachments);
  const removeAttachment = useTaskStore((s) => s.removeAttachment);
  const selectedModel = useTaskStore((s) => s.selectedModel);
  const isStreaming = useTaskStore((s) => s.isStreaming);

  const { upload, uploading } = useFileUpload();
  const { sendMessage, isSending } = useChat();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!inputPrompt.trim() || isSending || isStreaming) return;
    const text = inputPrompt;
    setInputPrompt("");
    await sendMessage(text);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      await upload(files[i]);
    }
    e.target.value = "";
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 select-none">
      {/* Quick Task Shortcuts (when prompt is short / clean slate) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold shrink-0">
          Quick Tasks:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              onClick={() => setInputPrompt(qp.prompt)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#121212] border border-[#242424] hover:border-[#FF6A00] text-[11px] font-mono text-zinc-300 hover:text-[#FF6A00] transition-colors shrink-0"
            >
              <Icon className="w-3 h-3 text-[#FF6A00] shrink-0" />
              <span>{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Open WebUI Industrial Styled Composer Box */}
      <div className="rounded-none bg-[#121212] border border-[#242424] focus-within:border-[#FF6A00] transition-all relative overflow-hidden">
        {/* Attached Files Bar inside Composer */}
        {attachments.length > 0 && (
          <div className="p-2.5 border-b border-[#262626] flex items-center gap-2 overflow-x-auto bg-[#181818]">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-2.5 py-1 rounded-none bg-[#1C1C1C] border border-[#333] text-xs font-mono text-zinc-200 shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-[#FF6A00]" />
                <span className="truncate max-w-[140px]">{file.filename}</span>

                {file.uploadStatus === "uploading" || file.uploadStatus === "validating" ? (
                  <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
                ) : file.uploadStatus === "success" ? (
                  <span className="text-[9px] text-[#FF6A00] font-bold bg-[#FF6A00]/10 px-1 py-0.2 rounded-none border border-[#FF6A00]/40">
                    READY
                  </span>
                ) : (
                  <AlertCircle className="w-3 h-3 text-red-400" />
                )}

                <button
                  onClick={() => removeAttachment(file.id)}
                  className="p-0.5 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your sovereign industrial task, attach inspection logs/SOPs, or enter query..."
          rows={3}
          className="w-full p-3 bg-transparent text-sm text-[#F5F5F5] placeholder-zinc-500 focus:outline-none resize-none font-mono leading-relaxed"
        />

        {/* Bottom Actions Bar */}
        <div className="px-3 py-2 border-t border-[#242424] bg-[#181818] flex items-center justify-between">
          {/* Left Controls: File Upload + Sovereign Badges */}
          <div className="flex items-center gap-2">
            <label className="p-1.5 rounded-none text-zinc-400 hover:text-[#FF6A00] hover:bg-[#222] cursor-pointer transition-colors border border-transparent hover:border-[#333]">
              <Paperclip className="w-4 h-4" />
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.docx,.txt"
                className="hidden"
                disabled={uploading}
              />
            </label>

            {/* Model Tag Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-[#1C1C1C] border border-[#2A2A2A] text-[10px] font-mono text-zinc-300">
              <Cpu className="w-3 h-3 text-[#FF6A00]" />
              <span className="font-bold truncate max-w-[120px]">{selectedModel}</span>
            </div>

            {/* Zero Egress Badge */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-none bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[10px] font-mono text-[#FF6A00] font-bold">
              <Lock className="w-3 h-3 text-[#FF6A00]" />
              <span>ZERO EGRESS</span>
            </div>
          </div>

          {/* Right Action: Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!inputPrompt.trim() || isSending || isStreaming}
            className={`flex items-center gap-1.5 py-1.5 px-4 rounded-none font-mono text-xs uppercase font-bold tracking-wider transition-all ${
              !inputPrompt.trim() || isSending || isStreaming
                ? "bg-[#222222] text-zinc-500 cursor-not-allowed border border-[#333333]"
                : "bg-[#FF6A00] hover:bg-[#FF8533] text-black active:scale-95"
            }`}
          >
            {isSending || isStreaming ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>EXECUTING...</span>
              </>
            ) : (
              <>
                <span>RUN TASK</span>
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

