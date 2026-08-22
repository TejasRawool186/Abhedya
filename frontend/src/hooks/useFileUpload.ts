import { useCallback, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { uploadFile } from "@/lib/api";
import { isAllowedFileType, generateId } from "@/lib/utils";
import type { UploadedFile, UploadStatus } from "@/types/file";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export interface UseFileUploadReturn {
  uploading: boolean;
  upload: (file: File) => Promise<UploadedFile | null>;
  validateFile: (file: File) => { valid: boolean; error?: string };
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const addAttachment = useTaskStore((s) => s.addAttachment);
  const updateAttachment = useTaskStore((s) => s.updateAttachment);

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      if (!isAllowedFileType(file.name)) {
        return {
          valid: false,
          error:
            "Invalid file type. Allowed: PDF, PNG, JPG, XLSX.",
        };
      }
      if (file.size > MAX_FILE_SIZE) {
        return {
          valid: false,
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
        };
      }
      if (file.size === 0) {
        return {
          valid: false,
          error: "File is empty.",
        };
      }
      return { valid: true };
    },
    []
  );

  const upload = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      const validation = validateFile(file);
      if (!validation.valid) {
        const failedFile = addAttachment({
          filename: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          uploadStatus: "error" as UploadStatus,
          progress: 0,
          error: validation.error,
        });
        return failedFile;
      }

      setUploading(true);

      const attachmentId = generateId();
      const pendingFile = addAttachment({
        filename: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadStatus: "uploading" as UploadStatus,
        progress: 0,
      });
      const trackingId = pendingFile.id;

      try {
        updateAttachment(trackingId, {
          uploadStatus: "validating",
        });

        const response = await uploadFile(file, (progress) => {
          updateAttachment(trackingId, {
            uploadStatus: "uploading",
            progress,
          });
        });

        const uploadedAt = new Date().toISOString();
        updateAttachment(trackingId, {
          documentId: response.document_id,
          uploadStatus: "success",
          progress: 100,
          uploadedAt,
        });

        return {
          ...pendingFile,
          documentId: response.document_id,
          uploadStatus: "success",
          progress: 100,
          uploadedAt,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Upload failed";
        updateAttachment(trackingId, {
          uploadStatus: "error",
          error: message,
        });
        return null;
      } finally {
        setUploading(false);
      }
    },
    [validateFile, addAttachment, updateAttachment]
  );

  return {
    uploading,
    upload,
    validateFile,
  };
}
