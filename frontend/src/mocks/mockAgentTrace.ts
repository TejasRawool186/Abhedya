import { AgentTraceStep } from "@/types/agent";

export const defaultExecutionSteps: AgentTraceStep[] = [
  {
    id: "step-1",
    node: "ocr_extract",
    label: "Multimodal Table & NDT OCR",
    description: "Extracting tabular wall thickness data and CML tags via local PaddleOCR / PyMuPDF",
    status: "pending",
    logs: [],
  },
  {
    id: "step-2",
    node: "rag_search",
    label: "Confidential SOP Vector Search",
    description: "Querying local ChromaDB/Qdrant vector store for API 570, OISD-105 & MRPL standards",
    status: "pending",
    logs: [],
  },
  {
    id: "step-3",
    node: "recommend",
    label: "Industrial Reasoning & Risk Scoring",
    description: "Computing corrosion rates, remaining life estimation & OISD compliance validation",
    status: "pending",
    logs: [],
  },
  {
    id: "step-4",
    node: "human_checkpoint",
    label: "Human-in-the-Loop Verification Gate",
    description: "Mandatory engineer sign-off required for safety critical equipment intervention",
    status: "pending",
    logs: [],
  },
  {
    id: "step-5",
    node: "generate_docx",
    label: "Cryptographic Deliverable Release",
    description: "Compiling executive inspection report with SHA-256 digital signature stamp",
    status: "pending",
    logs: [],
  },
];
