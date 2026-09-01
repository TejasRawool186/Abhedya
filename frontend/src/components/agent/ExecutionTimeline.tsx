"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Search,
  Brain,
  Wrench,
  FileCheck,
  Zap
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import type { AgentTraceStep } from "@/types/agent";

interface PipelineNodeDef {
  key: string;
  label: string;
  nodeNames: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const PIPELINE_NODES: PipelineNodeDef[] = [
  { key: "classified", label: "Task Classified", nodeNames: ["classifier"], icon: Zap },
  { key: "risk", label: "Risk Assessed", nodeNames: ["risk_eval"], icon: ShieldAlert },
  { key: "knowledge", label: "Knowledge Retrieved", nodeNames: ["knowledge_retrieval", "parse_documents"], icon: Search },
  { key: "planning", label: "Agent Planning", nodeNames: ["agent_planning", "compare_and_recommend"], icon: Brain },
  { key: "tools", label: "Tool Execution", nodeNames: ["code_gen", "extract_findings", "execute_tool"], icon: Wrench },
  { key: "verification", label: "Verification Gate", nodeNames: ["verification_gate"], icon: FileCheck },
  { key: "deliverable", label: "Deliverable Generated", nodeNames: ["synthesize_response", "complete"], icon: CheckCircle2 },
];

export const ExecutionTimeline: React.FC = () => {
  const agentSteps = useTaskStore((s) => s.agentSteps);
  const activeTask = useTaskStore((s) => s.activeTask);
  const isStreaming = useTaskStore((s) => s.isStreaming);

  const getStepStatus = (nodeDef: PipelineNodeDef) => {
    if (!activeTask) return "idle";

    const executedSteps = agentSteps.filter((step) =>
      nodeDef.nodeNames.includes(step.nodeName)
    );

    if (executedSteps.length > 0) {
      const lastStep = executedSteps[executedSteps.length - 1];
      return lastStep.status || "completed";
    }

    if (isStreaming) {
      // Check if previous step completed
      return "pending";
    }

    return "idle";
  };

  return (
    <div className="space-y-1.5 py-1">
      {PIPELINE_NODES.map((node, index) => {
        const status = getStepStatus(node);
        const Icon = node.icon;

        let statusBg = "bg-zinc-900 border-zinc-800 text-zinc-400";
        let iconColor = "text-zinc-400";

        if (status === "completed") {
          statusBg = "bg-emerald-950/70 border-emerald-800/60 text-emerald-300";
          iconColor = "text-emerald-400";
        } else if (status === "running" || (status === "pending" && isStreaming)) {
          statusBg = "bg-amber-950/70 border-amber-800/60 text-amber-300";
          iconColor = "text-amber-400";
        } else if (status === "failed") {
          statusBg = "bg-red-950/70 border-red-800/60 text-red-300";
          iconColor = "text-red-400";
        }

        return (
          <div
            key={node.key}
            className={`p-2 rounded-md border text-[11px] font-mono flex items-center justify-between transition-all ${statusBg}`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] text-zinc-400 w-4 font-bold shrink-0">{index + 1}.</span>
              <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
              <span className="font-medium truncate">{node.label}</span>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              {status === "completed" ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> DONE
                </span>
              ) : status === "running" || (status === "pending" && isStreaming) ? (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800">
                  <Loader2 className="w-3 h-3 animate-spin" /> ACTIVE
                </span>
              ) : status === "failed" ? (
                <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-950 px-1.5 py-0.5 rounded border border-red-800">
                  <AlertTriangle className="w-3 h-3" /> FAIL
                </span>
              ) : (
                <span className="text-[9px] text-zinc-400 font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                  WAITING
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
