export interface KnowledgeDocument {
  id: string;
  name: string;
  category: "SOP" | "API_STANDARD" | "OISD_STANDARD" | "EQUIPMENT_MANUAL" | "INSPECTION_LOG";
  tags: string[];
  fileSize: number;
  uploadedAt: string;
  sha256: string;
  vectorChunksCount: number;
  status: "indexed" | "processing" | "failed";
  similarityScore?: number;
}
