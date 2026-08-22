import { memo } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { TraceStep } from "./TraceStep";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Workflow, RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const AgentTrace = memo(function AgentTrace() {
  const agentSteps = useTaskStore((s) => s.agentSteps);
  const activeTask = useTaskStore((s) => s.activeTask);
  const isStreaming = useTaskStore((s) => s.isStreaming);
  const clearAgentSteps = useTaskStore((s) => s.clearAgentSteps);

  const completedCount = agentSteps.filter(
    (s) => s.status === "completed"
  ).length;
  const failedCount = agentSteps.filter((s) => s.status === "failed").length;
  const runningCount = agentSteps.filter((s) => s.status === "running").length;

  return (
    <Card className="h-full flex flex-col border-l border-border">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent border border-accent/30">
              <Workflow size={16} strokeWidth={2} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Agent Trace
                {isStreaming && (
                  <Activity
                    size={11}
                    className="text-accent animate-pulse-slow"
                  />
                )}
              </CardTitle>
              <CardDescription>
                {activeTask
                  ? `Processing pipeline — ${agentSteps.length} nodes`
                  : "Start a task to trace execution"}
              </CardDescription>
            </div>
          </div>

          {agentSteps.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearAgentSteps}
              title="Clear trace"
              className="h-8 w-8 text-muted hover:text-foreground"
            >
              <RefreshCw size={14} />
            </Button>
          )}
        </div>

        {agentSteps.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {completedCount > 0 && (
              <Badge variant="success" className="text-[10px]">
                {completedCount} complete
              </Badge>
            )}
            {runningCount > 0 && (
              <Badge variant="accent" className="text-[10px]">
                {runningCount} running
              </Badge>
            )}
            {failedCount > 0 && (
              <Badge variant="danger" className="text-[10px]">
                {failedCount} failed
              </Badge>
            )}
            {agentSteps.filter((s) => s.status === "pending").length > 0 && (
              <Badge variant="default" className="text-[10px]">
                {agentSteps.filter((s) => s.status === "pending").length} queued
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-y-auto">
        {agentSteps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4">
            <div className="w-14 h-14 rounded-2xl bg-panel border border-border flex items-center justify-center mb-3">
              <Workflow size={26} className="text-muted-2" strokeWidth={1.5} />
            </div>
            <h4 className="text-xs font-medium text-foreground mb-1">
              No active pipeline
            </h4>
            <p className="text-[11px] text-muted max-w-xs leading-relaxed">
              Agent execution steps will appear here as your task is processed
              through the sovereign workflow graph.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {agentSteps.map((step, idx) => (
              <TraceStep
                key={step.id}
                step={step}
                isLast={idx === agentSteps.length - 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
