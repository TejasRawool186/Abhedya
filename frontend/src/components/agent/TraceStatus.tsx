import { memo } from "react";
import { cn } from "@/lib/utils";
import type { AgentStepStatus } from "@/types/agent";
import { Check, X, Loader2 } from "lucide-react";

interface TraceStatusProps {
  status: AgentStepStatus;
  size?: "sm" | "md";
}

const sizeMap = {
  sm: "w-5 h-5 [&>svg]:w-3 [&>svg]:h-3",
  md: "w-6 h-6 [&>svg]:w-3.5 [&>svg]:h-3.5",
};

export const TraceStatus = memo(function TraceStatus({
  status,
  size = "md",
}: TraceStatusProps) {
  const base =
    "flex items-center justify-center rounded-full shrink-0 transition-all";

  switch (status) {
    case "pending":
      return (
        <span
          className={cn(
            base,
            sizeMap[size],
            "border-2 border-dashed border-muted-2 text-muted-2"
          )}
          aria-label="Pending"
        />
      );
    case "running":
      return (
        <span
          className={cn(
            base,
            sizeMap[size],
            "bg-accent/15 text-accent border border-accent/30"
          )}
          aria-label="Running"
        >
          <Loader2 className="animate-spin" strokeWidth={2.5} />
        </span>
      );
    case "completed":
      return (
        <span
          className={cn(
            base,
            sizeMap[size],
            "bg-success/15 text-success border border-success/30"
          )}
          aria-label="Completed"
        >
          <Check strokeWidth={3} />
        </span>
      );
    case "failed":
      return (
        <span
          className={cn(
            base,
            sizeMap[size],
            "bg-danger/15 text-danger border border-danger/30"
          )}
          aria-label="Failed"
        >
          <X strokeWidth={3} />
        </span>
      );
  }
});
