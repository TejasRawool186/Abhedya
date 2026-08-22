import { memo, useState, useCallback, useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import ReactMarkdown from "react-markdown";
import {
  ShieldAlert,
  CheckSquare,
  Edit3,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { approveTask, downloadTask } from "@/lib/api";

export const ApprovalCheckpoint = memo(function ApprovalCheckpoint() {
  const approval = useTaskStore((s) => s.approval);
  const activeTask = useTaskStore((s) => s.activeTask);
  const submitApproval = useTaskStore((s) => s.submitApproval);
  const resetApproval = useTaskStore((s) => s.resetApproval);
  const addMessage = useTaskStore((s) => s.addMessage);
  const addError = useTaskStore((s) => s.addError);
  const markTaskComplete = useTaskStore((s) => s.markTaskComplete);
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
        submitApproval(decision, edited);

        await approveTask(activeTask.id, {
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
      submitApproval,
      markTaskComplete,
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
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-11 h-11 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning">
            <ShieldAlert size={22} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-semibold text-foreground tracking-tight">
                Human Approval Required
              </h2>
              <Badge variant="warning" className="text-[9px]">
                <AlertTriangle size={10} />
                HITL
              </Badge>
            </div>
            <p className="text-xs text-muted">
              A sovereign AI recommendation has been generated. Please review
              and decide before final report is generated.
            </p>
          </div>
        </div>

        {!showEdit ? (
          <div className="rounded-xl border border-border bg-panel-2/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-background/30">
              <Badge variant="accent" className="text-[9px]">
                RECOMMENDATION
              </Badge>
              <span className="text-[10px] text-muted ml-auto">
                Confidence: 94%
              </span>
            </div>
            <div className="max-h-[40vh] overflow-y-auto p-4">
              <div className="markdown-content text-[13px] leading-relaxed">
                <ReactMarkdown>{approval.recommendation}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="text-[9px]">
                <Edit3 size={10} />
                EDIT MODE
              </Badge>
              <span className="text-[10px] text-muted">
                Modify the recommendation text below, then submit.
              </span>
            </div>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className={cn(
                "w-full h-[40vh] rounded-xl border border-border bg-background",
                "p-4 text-[13px] text-foreground font-mono leading-relaxed",
                "focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50",
                "resize-none"
              )}
            />
          </div>
        )}

        <div className="flex items-center flex-wrap gap-2 pt-4 border-t border-border">
          {!showEdit ? (
            <>
              <Button
                variant="success"
                size="md"
                leftIcon={<CheckSquare size={15} />}
                loading={loadingDecision === "approve"}
                onClick={() => handleSubmitDecision("approve")}
              >
                Approve
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Edit3 size={15} />}
                onClick={() => setShowEdit(true)}
                disabled={loadingDecision !== null}
              >
                Edit Recommendation
              </Button>
              <Button
                variant="danger"
                size="md"
                leftIcon={<XCircle size={15} />}
                loading={loadingDecision === "reject"}
                onClick={() => handleSubmitDecision("reject")}
                className="ml-auto"
              >
                Reject
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
