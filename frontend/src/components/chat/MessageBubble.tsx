"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileText,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Download,
  Copy,
  Check,
  User,
  Sparkles,
} from "lucide-react";
import { Message } from "@/types/chat";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CorrosionChart } from "@/components/charts/CorrosionChart";
import { VibrationFFTChart } from "@/components/charts/VibrationFFTChart";
import { formatBytes, truncateHash } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const [copied, setCopied] = useState(false);
  const { setApprovalModalOpen } = useTaskStore();

  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col gap-2 w-full ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      {/* Message Header */}
      <div className="flex items-center gap-2 px-1 text-xs text-primary-muted">
        <div className="flex items-center gap-1.5">
          {isUser ? (
            <>
              <User className="w-3.5 h-3.5 text-primary-secondary" />
              <span className="font-medium text-primary-secondary">Operator</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="font-medium text-accent">
                OnPremisAI Enclave
              </span>
            </>
          )}
        </div>
        <span>•</span>
        <span>{message.timestamp}</span>
      </div>

      {/* Message Box */}
      <div
        className={`rounded-2xl w-full transition-all ${
          isUser
            ? "bg-surface-card/80 border border-border-subtle p-5 max-w-3xl"
            : "p-5"
        }`}
      >
        {/* User Attached File Chips */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b border-border-subtle">
            {message.attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border-medium text-xs font-mono text-primary"
              >
                <FileText className="w-4 h-4 text-accent" />
                <span className="font-medium">{file.name}</span>
                <span className="text-[10px] text-primary-muted">
                  ({formatBytes(file.size)})
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Assistant Collapsible Reasoning Trace */}
        {!isUser && message.reasoningSteps && message.reasoningSteps.length > 0 && (
          <div className="mb-4 rounded-xl bg-surface border border-border-subtle overflow-hidden">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full px-3 py-2 text-xs font-mono flex items-center justify-between text-primary-secondary hover:text-primary hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Chain of Thought Reasoning Trace ({message.reasoningSteps.length} Steps)</span>
              </div>
              {showReasoning ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {showReasoning && (
              <div className="p-3 bg-canvas/60 border-t border-border-subtle space-y-1.5 text-xs font-mono text-primary-secondary">
                {message.reasoningSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-accent">❯</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Message Content Markdown */}
        <div className="prose-claude max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Dynamic Inline Charts */}
        {message.chartData?.type === "corrosion_curve" && (
          <CorrosionChart
            data={message.chartData.data}
            title={message.chartData.title}
            description={message.chartData.description}
            threshold={message.chartData.threshold}
          />
        )}

        {message.chartData?.type === "vibration_fft" && (
          <VibrationFFTChart
            data={message.chartData.data}
            title={message.chartData.title}
            description={message.chartData.description}
            threshold={message.chartData.threshold}
          />
        )}

        {/* Human-in-the-Loop Required Banner */}
        {message.requiresApproval && message.approvalStatus === "pending" && (
          <div className="mt-5 p-4 rounded-xl bg-status-warning/8 border border-status-warning/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-status-warning/15 border border-status-warning/30 flex items-center justify-center text-status-warning shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-status-warning">
                  Human Verification Required
                </h4>
                <p className="text-[11px] text-primary-secondary mt-0.5">
                  Remaining life &lt; 2 years. Awaiting operator digital sign-off.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setApprovalModalOpen(true)}
              className="shrink-0 text-xs px-4"
              size="sm"
            >
              Review & Sign
            </Button>
          </div>
        )}

        {/* Operator Approved Stamp Card */}
        {message.approvalStatus === "approved" && message.approvalDetails && (
          <div className="mt-5 p-4 rounded-xl bg-status-success/10 border border-status-success/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-status-success/20 flex items-center justify-center text-status-success shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-status-success">
                    APPROVED & DIGITALLY SIGNED
                  </span>
                  <Badge variant="success" size="sm">
                    {message.approvalDetails.operatorRole}
                  </Badge>
                </div>
                <div className="text-[11px] font-mono text-primary-muted mt-0.5">
                  Signed by {message.approvalDetails.approvedBy} • {message.approvalDetails.approvedAt}
                </div>
              </div>
            </div>
            <div className="text-[11px] font-mono text-primary-muted">
              SHA: {truncateHash(message.approvalDetails.signatureHash || "", 6, 6)}
            </div>
          </div>
        )}

        {/* Verified Deliverable Download Card */}
        {message.deliverable && (
          <div className="mt-4 p-4 rounded-xl bg-surface-card border border-border-medium flex items-center justify-between gap-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-primary">
                  {message.deliverable.filename}
                </h4>
                <div className="text-[10px] sm:text-[11px] font-mono text-primary-muted">
                  {formatBytes(message.deliverable.fileSize)} • SHA-256: {truncateHash(message.deliverable.sha256, 8, 6)}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                alert(`Downloading official deliverable: ${message.deliverable?.filename}`);
              }}
              className="shrink-0 gap-1.5 font-semibold text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        )}

        {/* Message Footer Action bar */}
        <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-border-subtle/50 text-[11px] font-mono text-primary-muted">
          <button
            onClick={handleCopy}
            className="p-1 hover:text-primary transition-colors flex items-center gap-1"
            title="Copy Message Text"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-status-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
