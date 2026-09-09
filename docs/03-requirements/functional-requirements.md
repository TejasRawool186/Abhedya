# Functional Requirements Specification (FR-01 to FR-12)
## ABHEDYA AI Sovereign Industrial Workbench

---

## 1. System Capability Matrix

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUNCTIONAL REQUIREMENTS OVERVIEW                         │
├────────┬───────────────────────────────────────────┬────────────────────────┤
│ REQ ID │ REQUIREMENT TITLE                         │ TARGET SUBSYSTEM       │
├────────┼───────────────────────────────────────────┼────────────────────────┤
│ FR-01  │ Multipart Confidential File Ingestion     │ FastAPI Gateway        │
│ FR-02  │ Vision-Native Multimodal Extraction       │ PaddleOCR / Qwen2.5-VL │
│ FR-03  │ Explainable Adaptive Model Routing        │ Adaptive Router        │
│ FR-04  │ Sovereign Hybrid Knowledge Retrieval      │ Qdrant Vector Store    │
│ FR-05  │ Multi-Step Agentic Workflow Orchestration │ LangGraph StateGraph   │
│ FR-06  │ Isolated Network-Denied Code Sandbox      │ Docker Runner          │
│ FR-07  │ Inline Self-RAG Verification & Critique   │ Critique Gate          │
│ FR-08  │ Deterministic Human-in-the-Loop Checkpoint│ HITL Subsystem         │
│ FR-09  │ Formal Deliverable Synthesis (.docx/.xlsx)│ Docx / Xlsx Writer     │
│ FR-10  │ Tamper-Evident Immutable Audit Logging    │ PostgreSQL Ledger      │
│ FR-11  │ Real-Time Air-Gap Telemetry Monitoring    │ Network Sentinel       │
│ FR-12  │ Industrial Control Console Interface      │ Next.js 16 Workbench   │
└────────┴───────────────────────────────────────────┴────────────────────────┘
```

---

## 2. Detailed Functional Specifications

### FR-01: Multipart Confidential File Ingestion
- **Description:** The system shall accept simultaneous uploads of scanned inspection reports (`.pdf`), high-resolution defect images (`.png`, `.jpg`, `.jpeg`), spreadsheets (`.xlsx`, `.csv`), and plain text files.
- **Constraints:** Maximum upload size: 25MB per file. The gateway must validate file magic numbers to block disguised executable binaries and persist files locally to `/data/uploads/{task_id}/`.

### FR-02: Vision-Native Multimodal Extraction
- **Description:** The system shall process uploaded artifacts using specialized local vision models:
  - Tabular ultrasonic thickness logs and scanned text must be processed by **PaddleOCR** to extract tabular columns (`Location`, `Nominal`, `Actual`, `Retirement`).
  - Engineering drawings (P&IDs) and defect photographs must be processed by **Qwen2.5-VL** to identify structural anomalies, corrosion pitting, and equipment tag IDs.

### FR-03: Explainable Adaptive Model Routing
- **Description:** The system shall analyze the user's prompt, attachment metadata, and task classification to dynamically select the most appropriate local open-weight model:
  - `Qwen2.5-VL-7B` for vision-intensive or image-attached tasks.
  - `Qwen2.5-14B` for complex multi-step industrial reasoning and compliance audits.
  - `Qwen2.5-Coder-7B` for data analysis, math calculations, and Python script generation.
  - `Qwen2.5-7B` for fast operational queries and summarization.
- **Explainability:** The router must emit machine-readable rationale displaying why the model was chosen.

### FR-04: Sovereign Hybrid Knowledge Retrieval
- **Description:** The system shall query an internal **Qdrant** vector database seeded with synthetic MRPL Standard Operating Procedures (SOPs), OISD directives, and API inspection codes (API 570, API 510, API 653).
- **Output:** Every retrieved evidence item must return the document title, exact section, page number, and semantic relevance score.

### FR-05: Multi-Step Agentic Workflow Orchestration
- **Description:** All complex workflows must execute as a compiled **LangGraph** `StateGraph`. The graph shall maintain an immutable `WorkbenchState` tracking: task parameters, extracted text, visual findings, retrieved citations, generated plan, tool outputs, verification scores, and approval state.

### FR-06: Isolated Network-Denied Code Sandbox
- **Description:** When mathematical computations (such as pipe corrosion rate, remaining service life, or wall thickness degradation) are required, the agent shall generate a self-contained Python script.
- **Security:** The script must execute inside an ephemeral Docker container spawned with `--network none`, a read-only root filesystem, memory capped at 512MB, and an execution timeout of 10 seconds.

### FR-07: Inline Self-RAG Verification & Critique
- **Description:** Before presenting engineering recommendations to the operator, the agent must pass output through an inline Self-RAG critique node evaluating:
  1. `ISREL`: Is retrieved context relevant to the query? (Threshold $\ge 0.70$)
  2. `ISSUP`: Is the generated claim supported by retrieved evidence? (Boolean / Grounding Score $\ge 0.80$)
- **Self-Healing:** If `ISSUP` fails, the graph must trigger an automated revision node (max 2 retries) before proceeding.

### FR-08: Deterministic Human-in-the-Loop Checkpoint
- **Description:** For all tasks classified as `HIGH` or `CRITICAL` risk (e.g., equipment retirement, emergency derating, shutdown recommendations), graph execution must halt.
- **Operator Actions:** The human operator must be presented with:
  - **Approve:** Authorizes the recommendation and triggers deliverable generation.
  - **Edit:** Modifies the recommendation text, recalculates parameters, and signs off.
  - **Reject:** Aborts the action and logs rationale to the audit trail.

### FR-09: Formal Deliverable Synthesis (.docx / .xlsx)
- **Description:** Upon task approval, the system shall synthesize publication-grade corporate deliverables:
  - `Inspection_Approval_Note.docx`: Formatted executive inspection note with metadata header, tabular NDT readings, embedded defect photo, SOP citations, and digital approval stamp.
  - `Corrosion_Assessment.xlsx`: Multi-sheet spreadsheet with degradation formulas and alert thresholds.

### FR-10: Tamper-Evident Immutable Audit Logging
- **Description:** Every task lifecycle event (creation, file upload, routing, retrieval, sandbox execution, verification, operator decision, and document generation) must be written to PostgreSQL.
- **Integrity:** Each audit record shall compute a cryptographic SHA-256 hash chaining back to the previous event hash.

### FR-11: Real-Time Air-Gap Telemetry Monitoring
- **Description:** The system shall continuously inspect Linux `/proc/net/tcp` and host network sockets via `psutil` to verify zero outbound network packets.
- **Alerting:** If an unauthorized socket connection is detected, the UI must immediately display a red security warning banner.

### FR-12: Industrial Control Console Interface
- **Description:** The Next.js 16 frontend shall implement a high-density 3-column `AppShell` complying 100% with the Black + Safety Orange industrial design system (`#000000`, `#FF6A00`, `0px` rectangular `rounded-none` geometry, monospace data displays).
- **Streaming:** Must consume real-time Server-Sent Events (SSE) from `/api/tasks/{id}/stream` to render live node progress steppers.
