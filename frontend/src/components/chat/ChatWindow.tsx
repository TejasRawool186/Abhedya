import { useCallback, useEffect, useRef } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { MessageList } from "./MessageList";
import { FileUpload } from "./FileUpload";
import { ChatInput } from "./ChatInput";
import { DownloadResult } from "./DownloadResult";
import { approveTask, downloadTask } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";

export function ChatWindow() {
  const activeTask = useTaskStore((s) => s.activeTask);
  const approval = useTaskStore((s) => s.approval);
  const addMessage = useTaskStore((s) => s.addMessage);
  const addError = useTaskStore((s) => s.addError);
  const submitApproval = useTaskStore((s) => s.submitApproval);
  const resetApproval = useTaskStore((s) => s.resetApproval);
  const markTaskComplete = useTaskStore((s) => s.markTaskComplete);
  const setStreaming = useTaskStore((s) => s.setStreaming);

  const lastRecommendationRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !approval.required ||
      !activeTask ||
      !approval.recommendation ||
      approval.status === "approved" ||
      approval.status === "rejected" ||
      approval.status === "edited"
    ) {
      return;
    }

    if (lastRecommendationRef.current === `${activeTask.id}:${approval.recommendation}`) {
      return;
    }

    lastRecommendationRef.current = `${activeTask.id}:${approval.recommendation}`;
    addMessage({
      role: "assistant",
      content: approval.recommendation,
    });
  }, [approval.required, approval.recommendation, approval.status, activeTask, addMessage]);

  const handlePostApprovalContinue = useCallback(
    async (decision: "approve" | "reject" | "edit", edited?: string) => {
      if (!activeTask) return;

      submitApproval(decision, edited);

      try {
        await approveTask(activeTask.id, {
          decision,
          ...(edited ? { edits: edited } : {}),
        });

        if (decision === "approve" || decision === "edit") {
          setStreaming(true);
        } else {
          addMessage({
            role: "system",
            content:
              "Recommendation rejected. Task has been cancelled. You may provide new instructions or upload a different file.",
          });
          resetApproval();
          setStreaming(false);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to submit approval decision";
        addError(message);
        resetApproval();
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
    <section className="flex-1 flex flex-col min-h-0 bg-panel/40 border-x border-border">
      <header className="flex-shrink-0 border-b border-border bg-panel/90 backdrop-blur-sm px-5 md:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
          <h1 className="text-sm font-semibold tracking-wide text-foreground uppercase">
            Workbench Chat
          </h1>
          {activeTask && (
            <Badge variant="outline" className="text-[9px] font-mono">
              TASK: {activeTask.id.slice(-8)}
            </Badge>
          )}
        </div>
        <DownloadResult downloadUrl={activeTask?.downloadUrl} />
      </header>

      <MessageList />
      <FileUpload />
      <ChatInput />
    </section>
  );
}
