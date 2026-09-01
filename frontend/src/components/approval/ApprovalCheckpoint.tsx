"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldAlert,
  CheckSquare,
  Edit3,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitApproval as apiSubmitApproval } from "@/lib/api";

export const ApprovalCheckpoint = memo(function ApprovalCheckpoint() {
  const approval = useTaskStore((s) => s.approval);
  const activeTask = useTaskStore((s) => s.activeTask);
  const storeSubmitApproval = useTaskStore((s) => s.submitApproval);
  const resetApproval = useTaskStore((s) => s.resetApproval);
  const addMessage = useTaskStore((s) => s.addMessage);
  const addError = useTaskStore((s) => s.addError);
  const setStreaming = useTaskStore((s) => s.setStreaming);

  const [showEdit, setShowEdit] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [loadingDecision, setLoadingDecision] = useState<
    "approve" | "reject" | "edit" | null
  >(null);

  const isOpen =
    approval.required &&
    approval.status !== "approved" &&
    approval.status !== "rejected" &&
    approval.status !== "edited";

  useEffect(() => {
    if (isOpen) {
      setEditedText(approval.recommendation);
    }
  }, [isOpen, approval.recommendation]);

  const handleSubmitDecision = useCallback(
    async (decision: "approve" | "reject" | "edit", edited?: string) => {
      if (!activeTask) return;
      setLoadingDecision(decision);

      try {
        storeSubmitApproval(decision, edited);

        await apiSubmitApproval(activeTask.id, {
          decision,
          ...(edited ? { edits: edited } : {}),
        });

        if (decision === "approve" || decision === "edit") {
          setShowEdit(false);
          setStreaming(true);
          setLoadingDecision(null);
        } else {
          addMessage({
            role: "system",
            content:
              "Recommendation rejected by human operator. Task cancelled. Upload new data or provide revised instructions to begin a new analysis.",
          });
          resetApproval();
          setStreaming(false);
          setLoadingDecision(null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to submit decision";
        addError(message);
        resetApproval();
        setLoadingDecision(null);
      }
    },
    [
      activeTask,
      storeSubmitApproval,
      addMessage,
      addError,
      resetApproval,
      setStreaming,
    ]
  );

  return (
    <Modal
      open={isOpen}
      onClose={() => {}}
      closeOnBackdropClick={false}
      showCloseButton={false}
      title={undefined}
      description={undefined}
      className={cn(showEdit ? "z-[60]" : "")}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#242424]">
          <div className="w-11 h-11 rounded-none bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldAlert size={22} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-bold text-[#F5F5F5] tracking-tight font-mono uppercase">
                Human Approval Checkpoint
              </h2>
              <Badge variant="warning" className="text-[9px]">
                <AlertTriangle size={10} />
                HITL GATE
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              A sovereign AI recommendation has been generated. Please review
              and decide before final deliverable report synthesis.
            </p>
          </div>
        </div>

        {!showEdit ? (
          <div className="rounded-none border border-[#242424] bg-[#121212] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#262626] bg-[#181818] font-mono">
              <Badge variant="accent" className="text-[9px]">
                RECOMMENDATION
              </Badge>
              <span className="text-[10px] text-[#FF6A00] font-bold ml-auto">
                Confidence: {Math.round((approval.confidence || 0.94) * 100)}%
              </span>
            </div>
            <div className="max-h-[40vh] overflow-y-auto p-4 font-mono leading-relaxed text-xs text-[#F5F5F5] whitespace-pre-wrap">
              {approval.recommendation}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="text-[9px]">
                <Edit3 size={10} />
                EDIT MODE
              </Badge>
              <span className="text-[10px] text-zinc-400 font-mono">
                Modify recommendation text below before operator sign-off.
              </span>
            </div>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className={cn(
                "w-full h-[40vh] rounded-none border border-[#242424] bg-[#000000]",
                "p-4 text-xs text-[#F5F5F5] font-mono leading-relaxed",
                "focus:outline-none focus:border-[#FF6A00]",
                "resize-none"
              )}
            />
          </div>
        )}

        <div className="flex items-center flex-wrap gap-2 pt-4 border-t border-[#242424]">
          {!showEdit ? (
            <>
              <Button
                variant="primary"
                size="md"
                leftIcon={<CheckSquare size={15} />}
                loading={loadingDecision === "approve"}
                onClick={() => handleSubmitDecision("approve")}
              >
                Approve Recommendation
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Edit3 size={15} />}
                onClick={() => setShowEdit(true)}
                disabled={loadingDecision !== null}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="md"
                leftIcon={<XCircle size={15} />}
                loading={loadingDecision === "reject"}
                onClick={() => handleSubmitDecision("reject")}
                className="ml-auto"
              >
                Reject Task
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowEdit(false)}
                disabled={loadingDecision !== null}
              >
                Cancel Edit
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<CheckSquare size={15} />}
                loading={loadingDecision === "edit"}
                onClick={() => handleSubmitDecision("edit", editedText)}
                disabled={!editedText.trim()}
                className="ml-auto"
              >
                Submit Edited
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
});

