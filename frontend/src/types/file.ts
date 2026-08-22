export type UploadStatus =
  | "idle"
  | "uploading"
  | "success"
  | "error"
  | "validating";

export interface UploadedFile {
  id: string;
  documentId?: string;
  filename: string;
  size: number;
  type: string;
  uploadStatus: UploadStatus;
  progress: number;
  error?: string;
  uploadedAt?: string;
}

export type AllowedFileType = "pdf" | "png" | "jpg" | "jpeg" | "xlsx";
