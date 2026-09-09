"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Mic,
  MicOff,
  ArrowUp,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { AttachedFile } from "@/types/chat";
import { SlashCommandMenu, SlashCommand } from "./SlashCommandMenu";
import { formatBytes } from "@/lib/utils";

interface ComposerProps {
  onSendMessage: (content: string, attachments: AttachedFile[]) => void;
}

export function Composer({ onSendMessage }: ComposerProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [slashFilter, setSlashFilter] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isExecuting } = useTaskStore();

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [content]);

  // Handle Slash command trigger
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);

    if (val.startsWith("/")) {
      setSlashFilter(val.slice(1));
    } else {
      setSlashFilter(null);
    }
  };

  const handleSelectSlashCommand = (cmd: SlashCommand) => {
    setContent(cmd.prompt);
    setSlashFilter(null);
    if (cmd.key === "ut-audit") {
      // Auto attach sample hydrocracker UT log if not already attached
      if (!attachments.some((a) => a.name.includes("hydrocracker"))) {
        setAttachments((prev) => [
          ...prev,
          {
            id: `att-${Date.now()}`,
            name: "hydrocracker_ut_log.pdf",
            size: 2450000,
            type: "application/pdf",
          },
        ]);
      }
    }
    textareaRef.current?.focus();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: AttachedFile[] = Array.from(files).map((file) => ({
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      rawFile: file,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate Whisper.cpp offline transcription
      setTimeout(() => {
        setContent(
          "Analyze the pump P-102B vibration frequency spectrum and flag bearing outer race defects."
        );
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!content.trim() && attachments.length === 0) || isExecuting) return;

    onSendMessage(content.trim(), attachments);
    setContent("");
    setAttachments([]);
    setSlashFilter(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && slashFilter === null) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = (content.trim() || attachments.length > 0) && !isExecuting;

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 pb-6 select-none">
      {/* Slash command floating popup */}
      {slashFilter !== null && (
        <SlashCommandMenu
          filter={slashFilter}
          onSelect={handleSelectSlashCommand}
          onClose={() => setSlashFilter(null)}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx,.json"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Claude-style Floating Composer */}
      <div className="relative rounded-3xl bg-surface-card border border-border-subtle focus-within:border-border-medium transition-all duration-200 shadow-composer">
        {/* Attachment Chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-0">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface border border-border-subtle text-xs text-primary"
              >
                <FileText className="w-3.5 h-3.5 text-accent" />
                <span className="font-medium truncate max-w-[180px]">
                  {file.name}
                </span>
                <span className="text-[10px] text-primary-muted">
                  ({formatBytes(file.size)})
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(file.id)}
                  className="p-0.5 hover:text-status-danger text-primary-muted rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="How can Claude help you today?"
          className="w-full bg-transparent px-5 py-4 text-[15px] text-primary placeholder:text-primary-muted/60 focus:outline-none resize-none min-h-[56px] max-h-[200px] leading-relaxed"
        />

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-primary-muted hover:text-primary-secondary hover:bg-surface-hover transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-[18px] h-[18px]" />
            </button>

            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2 rounded-xl transition-colors ${
                isRecording
                  ? "text-status-danger bg-status-danger/15 animate-pulse"
                  : "text-primary-muted hover:text-primary-secondary hover:bg-surface-hover"
              }`}
              title="Voice dictation"
            >
              {isRecording ? (
                <MicOff className="w-[18px] h-[18px]" />
              ) : (
                <Mic className="w-[18px] h-[18px]" />
              )}
            </button>

          </div>

          {/* Right: Send Button (Claude-style circle arrow) */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!canSend}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${
              canSend
                ? "bg-accent text-white hover:bg-accent-hover active:scale-95"
                : "bg-surface-hover text-primary-muted cursor-not-allowed"
            }`}
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
