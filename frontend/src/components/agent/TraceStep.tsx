import { memo, useState } from "react";
import { cn, formatTimestamp, formatDuration } from "@/lib/utils";
import { TraceStatus } from "./TraceStatus";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, ChevronRight, TerminalSquare } from "lucide-react";
import type { AgentTraceStep, AgentStepStatus } from "@/types/agent";

interface TraceStepProps {
  step: AgentTraceStep;
  isLast: boolean;
}

const statusLabel: Record<AgentStepStatus, string> = {
  pending: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
};

const badgeVariant: Record<AgentStepStatus, any> = {
  pending: "default",
  running: "accent",
  completed: "success",
  failed: "danger",
};

export const TraceStep = memo(function TraceStep({ step, isLast }: TraceStepProps) {
  const [expanded, setExpanded] = useState(false);
  const hasOutput = step.output && step.output.trim().length > 0;
  const showOutputToggle = hasOutput && step.status !== "running";

  return (
    <div className="relative flex gap-3 pl-1 animate-fade-in">
      {!isLast && (
        <div
          className={cn(
            "absolute left-[17px] top-7 w-px transition-colors duration-500",
            step.status === "completed"
              ? "bg-success/30"
              : step.status === "failed"
              ? "bg-danger/30"
              : step.status === "running"
              ? "bg-accent/40"
              : "bg-border"
          )}
          style={{ height: "calc(100% + 0.25rem)" }}
          aria-hidden="true"
        />
      )}

      <div className="flex-shrink-0 pt-1 relative z-10">
        <TraceStatus status={step.status} size="md" />
      </div>

      <div className="flex-1 min-w-0 pb-4">
        <div
          className={cn(
            "flex items-center gap-2 cursor-pointer select-none",
            showOutputToggle ? "" : ""
          )}
          onClick={() => showOutputToggle && setExpanded((e) => !e)}
          role={showOutputToggle ? "button" : undefined}
          tabIndex={showOutputToggle ? 0 : undefined}
          onKeyDown={(e) => {
            if (showOutputToggle && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setExpanded((ex) => !ex);
            }
          }}
        >
          <span
            className={cn(
              "text-sm font-medium tracking-tight",
              step.status === "completed"
                ? "text-foreground"
                : step.status === "failed"
                ? "text-danger"
                : step.status === "running"
                ? "text-foreground"
                : "text-muted"
            )}
          >
            {step.nodeName}
          </span>

          <Badge variant={badgeVariant[step.status]} className="text-[9px]">
            {statusLabel[step.status]}
          </Badge>

          <div className="ml-auto flex items-center gap-2">
            {step.durationMs !== undefined && step.status === "completed" && (
              <span className="text-[10px] text-muted tabular-nums">
                {formatDuration(step.durationMs)}
              </span>
            )}
            <span className="text-[10px] text-muted tabular-nums">
              {formatTimestamp(step.timestamp)}
            </span>
            {showOutputToggle && (
              expanded ? (
                <ChevronDown size={13} className="text-muted" />
              ) : (
                <ChevronRight size={13} className="text-muted" />
              )
            )}
          </div>
        </div>

        {showOutputToggle && expanded && (
          <div className="mt-2 rounded-lg border border-border bg-panel-2/60 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/60 bg-background/40">
              <TerminalSquare size={12} className="text-muted" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                Step Output
              </span>
            </div>
            <pre className="p-3 text-[11px] font-mono text-foreground/80 leading-relaxed overflow-x-auto">
              {step.output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
});
