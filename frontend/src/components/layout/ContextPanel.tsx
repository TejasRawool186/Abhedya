"use client";

import React from "react";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Badge } from "@/components/ui/Badge";

export function ContextPanel() {
  const {
    isContextPanelOpen,
    activeTraceSteps,
    isExecuting,
  } = useTaskStore();

  if (!isContextPanelOpen) return null;

  return (
    <aside className="w-[320px] h-full bg-surface border-l border-border-subtle flex flex-col shrink-0 select-none overflow-hidden">
      {/* Panel Header */}
      <div className="p-3 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          <span className="text-[13px] font-medium text-primary">
            Execution Trace
          </span>
        </div>
        <Badge variant={isExecuting ? "warning" : "success"} size="sm">
          {isExecuting ? "Running" : "Ready"}
        </Badge>
      </div>

      {/* Execution Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-border-subtle">
          {activeTraceSteps.map((step, idx) => {
            const isCompleted = step.status === "completed";
            const isRunning = step.status === "running";
            const isWaiting = step.status === "waiting_approval";
            const isFailed = step.status === "failed";

            return (
              <div key={step.id} className="relative group">
                {/* Node status dot */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                    isCompleted
                      ? "bg-status-success/15 border-status-success/40 text-status-success"
                      : isRunning
                      ? "bg-accent/15 border-accent/40 text-accent animate-pulse"
                      : isWaiting
                      ? "bg-status-warning/15 border-status-warning/40 text-status-warning"
                      : isFailed
                      ? "bg-status-danger/15 border-status-danger/40 text-status-danger"
                      : "bg-surface-card border-border-subtle text-primary-muted"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-medium">
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-surface-card border border-border-subtle">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-medium text-primary">
                      {step.label}
                    </span>
                    {step.durationMs && (
                      <span className="text-[10px] text-primary-muted">
                        {step.durationMs}ms
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-accent mb-1">
                    {step.node}
                  </div>

                  <p className="text-xs text-primary-secondary leading-relaxed">
                    {step.description}
                  </p>

                  {step.outputSummary && (
                    <div className="mt-2 p-2 rounded-lg bg-status-success/5 border border-status-success/15 text-[11px] text-status-success">
                      ✓ {step.outputSummary}
                    </div>
                  )}

                  {step.logs.length > 0 && (
                    <div className="mt-2 space-y-0.5">
                      {step.logs.map((log, logIdx) => (
                        <div
                          key={logIdx}
                          className="text-[10px] font-mono text-primary-muted truncate"
                        >
                          &gt; {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
