import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Table as TableIcon,
  File,
  X,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import {
  cn,
  formatFileSize,
  getFileIconType,
  truncateString,
} from "@/lib/utils";
import type { UploadedFile } from "@/types/file";

const statusConfig = {
  idle: { label: "Ready", variant: "default" as const, Icon: File },
  uploading: {
    label: "Uploading",
    variant: "accent" as const,
    Icon: LoaderCircle,
  },
  validating: {
    label: "Validating",
    variant: "warning" as const,
    Icon: LoaderCircle,
  },
  success: {
    label: "Ready",
    variant: "success" as const,
    Icon: CheckCircle2,
  },
  error: { label: "Failed", variant: "danger" as const, Icon: AlertCircle },
};

const iconMap = {
  pdf: { Icon: FileText, color: "text-danger" },
  image: { Icon: ImageIcon, color: "text-accent" },
  spreadsheet: { Icon: TableIcon, color: "text-success" },
  unknown: { Icon: File, color: "text-muted" },
};

function FileRow({ file }: { file: UploadedFile }) {
  const removeAttachment = useTaskStore((s) => s.removeAttachment);
  const { Icon, color } = iconMap[getFileIconType(file.filename)];
  const status = statusConfig[file.uploadStatus];
  const StatusIcon = status.Icon;

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-panel-2/60 px-3 py-2 animate-fade-in">
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-md bg-background border border-border flex items-center justify-center",
          color
        )}
      >
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-medium text-foreground truncate"
            title={file.filename}
          >
            {truncateString(file.filename, 36)}
          </span>
          <Badge variant={status.variant} className="text-[9px] shrink-0">
            <StatusIcon
              size={10}
              className={cn(
                status.variant === "accent" || status.variant === "warning"
                  ? "animate-spin"
                  : ""
              )}
            />
            {status.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-muted">
            {formatFileSize(file.size)}
          </span>
          {(file.uploadStatus === "uploading" ||
            file.uploadStatus === "validating") && (
            <div className="flex-1 max-w-32 h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-200"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}
          {file.uploadStatus === "success" && file.documentId && (
            <span className="text-[10px] text-muted font-mono">
              ID: {truncateString(file.documentId, 10)}
            </span>
          )}
          {file.uploadStatus === "error" && file.error && (
            <span className="text-[10px] text-danger truncate">
              {file.error}
            </span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeAttachment(file.id)}
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-danger"
        title="Remove file"
      >
        <X size={14} />
      </Button>
    </div>
  );
}

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, validateFile } = useFileUpload();
  const attachments = useTaskStore((s) => s.attachments);
  const isStreaming = useTaskStore((s) => s.isStreaming);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        await upload(file);
      }
    },
    [upload]
  );

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        e.target.value = "";
      }
    },
    [processFiles]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!isStreaming && !uploading) {
      inputRef.current?.click();
    }
  }, [isStreaming, uploading]);

  const disabled = isStreaming || uploading;

  return (
    <div className="px-4 md:px-6 pt-4 pb-2">
      <div className="max-w-4xl mx-auto flex flex-col gap-2.5">
        {attachments.length > 0 && (
          <div className="flex flex-col gap-2">
            {attachments.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </div>
        )}

        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={cn(
            "relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden",
            disabled
              ? "opacity-50 cursor-not-allowed border-border/50 bg-panel/30"
              : isDragging
              ? "border-accent bg-accent/5 scale-[1.005]"
              : "border-border bg-panel-2/30 hover:border-muted-2 hover:bg-panel-2/60"
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload files"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.xlsx"
            multiple
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />

          <div className="flex items-center gap-4 px-4 py-3">
            <div
              className={cn(
                "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                isDragging
                  ? "bg-accent text-white"
                  : "bg-panel text-muted border border-border"
              )}
            >
              {uploading ? (
                <Spinner size="sm" variant={isDragging ? "light" : "accent"} />
              ) : (
                <UploadCloud size={22} strokeWidth={1.8} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">
                {uploading
                  ? "Uploading file…"
                  : isDragging
                  ? "Drop files here to upload"
                  : "Drag & drop files or click to browse"}
              </div>
              <div className="text-[11px] text-muted mt-0.5">
                PDF · PNG · JPG · XLSX — max 50 MB per file
              </div>
            </div>

            <div className="flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={disabled}
              >
                Browse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
