"use client";

import React from "react";
import {
  CheckCircle2,
  Loader2,
  AlertTriangle,
  ShieldAlert,
  Search,
  Brain,
  Wrench,
  FileCheck,
  Zap
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";

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
      return "pending";
    }

    return "idle";
  };

  return (
    <div className="space-y-1.5 py-1">
      {PIPELINE_NODES.map((node, index) => {
        const status = getStepStatus(node);
        const Icon = node.icon;

        let statusBg = "bg-[#121212] border-[#242424] text-zinc-400";
        let iconColor = "text-zinc-400";

        if (status === "completed") {
          statusBg = "bg-[#FF6A00]/10 border-[#FF6A00]/40 text-[#FF6A00]";
          iconColor = "text-[#FF6A00]";
        } else if (status === "running" || (status === "pending" && isStreaming)) {
          statusBg = "bg-amber-950/50 border-amber-600/50 text-amber-300";
          iconColor = "text-amber-400";
        } else if (status === "failed") {
          statusBg = "bg-red-950/50 border-red-700/50 text-red-300";
          iconColor = "text-red-400";
        }

        return (
          <div
            key={node.key}
            className={`p-2 rounded-none border text-[11px] font-mono flex items-center justify-between transition-all ${statusBg}`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-[10px] text-zinc-400 w-4 font-bold shrink-0">{index + 1}.</span>
              <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
              <span className="font-medium truncate font-sans text-zinc-200">{node.label}</span>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              {status === "completed" ? (
                <span className="flex items-center gap-1 text-[10px] text-[#FF6A00] font-bold bg-[#FF6A00]/10 px-1.5 py-0.5 rounded-none border border-[#FF6A00]/40">
                  <CheckCircle2 className="w-3 h-3" /> DONE
                </span>
              ) : status === "running" || (status === "pending" && isStreaming) ? (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded-none border border-amber-700/60">
                  <Loader2 className="w-3 h-3 animate-spin" /> ACTIVE
                </span>
              ) : status === "failed" ? (
                <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-950/80 px-1.5 py-0.5 rounded-none border border-red-700/60">
                  <AlertTriangle className="w-3 h-3" /> FAIL
                </span>
              ) : (
                <span className="text-[9px] text-zinc-400 font-mono uppercase px-1.5 py-0.5 rounded-none bg-[#181818] border border-[#262626]">
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

