import { useState, useCallback, type ChangeEvent } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Download,
  FileText,
  Table2,
  CheckSquare,
  Edit3,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { downloadTask } from "@/lib/api";

interface DownloadResultProps {
  onPostApproval?: (
    decision: "approve" | "reject" | "edit",
    edited?: string
  ) => Promise<void>;
}

export function DownloadResult({ onPostApproval }: DownloadResultProps) {
  const activeTask = useTaskStore((s) => s.activeTask);
  const approval = useTaskStore((s) => s.approval);
  const isStreaming = useTaskStore((s) => s.isStreaming);
  const addError = useTaskStore((s) => s.addError);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [downloading, setDownloading] = useState(false);

  const isCompleted = activeTask?.status === "completed";
  const needsApproval =
    approval.required &&
    approval.status !== "approved" &&
    approval.status !== "rejected" &&
    approval.status !== "edited";

  const ext = activeTask?.outputFormat ?? "docx";
  const FileIcon = ext === "xlsx" ? Table2 : FileText;

  const handleApprove = useCallback(async () => {
    await onPostApproval?.("approve");
  }, [onPostApproval]);

  const handleReject = useCallback(async () => {
    await onPostApproval?.("reject");
  }, [onPostApproval]);

  const handleEditOpen = useCallback(() => {
    setEditedText(approval.recommendation);
    setShowEditModal(true);
  }, [approval.recommendation]);

  const handleEditSubmit = useCallback(async () => {
    setShowEditModal(false);
    await onPostApproval?.("edit", editedText);
  }, [editedText, onPostApproval]);

  const handleDownload = useCallback(async () => {
    if (!activeTask) return;

    if (activeTask.downloadUrl) {
      const a = document.createElement("a");
      a.href = activeTask.downloadUrl;
      a.download = `report-${activeTask.id.slice(-8)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    setDownloading(true);
    try {
      const blob = await downloadTask(activeTask.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${activeTask.id.slice(-8)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Download failed";
      addError(message);
    } finally {
      setDownloading(false);
    }
  }, [activeTask, ext, addError]);

  if (needsApproval) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="warning" className="text-[10px]">
          <AlertTriangle size={11} />
          Approval Required
        </Badge>
        <Button
          variant="success"
          size="sm"
          leftIcon={<CheckSquare size={14} />}
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Edit3 size={14} />}
          onClick={handleEditOpen}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<XCircle size={14} />}
          onClick={handleReject}
        >
          Reject
        </Button>

        <Modal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Recommendation"
          description="Modify the recommendation text before submitting."
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleEditSubmit}
                disabled={!editedText.trim()}
                leftIcon={<CheckSquare size={14} />}
              >
                Submit Edited
              </Button>
            </>
          }
        >
          <textarea
            value={editedText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setEditedText(e.target.value)
            }
            className={cn(
              "w-full h-72 rounded-lg border border-border bg-background",
              "p-3 text-sm text-foreground font-mono",
              "focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50",
              "resize-none"
            )}
          />
        </Modal>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="success" className="text-[10px]">
          Complete
        </Badge>
        <Button
          variant="success"
          size="sm"
          leftIcon={
            downloading ? (
              <FileIcon size={14} className="animate-pulse" />
            ) : (
              <Download size={14} />
            )
          }
          onClick={handleDownload}
          loading={downloading}
        >
          Download .{ext.toUpperCase()}
        </Button>
      </div>
    );
  }

  if (isStreaming) {
    return <Badge variant="accent">PROCESSING…</Badge>;
  }

  return <Badge variant="default">Idle</Badge>;
}
