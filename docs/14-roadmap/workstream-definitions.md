# Six Technical Workstream Definitions
## Operational Scopes, Inputs, Outputs & Definition of Done (No Developer Role Siloing)

---

## 1. Principles of Workstream Allocation
To prevent developer siloing, work is divided into **six technical workstreams**, NOT fixed developer personas:
- Developers will choose their initial primary workstream at kickoff.
- Every developer participates in weekly pair programming rotations and cross-workstream code reviews.
- By Week 12, all six developers must understand and be capable of debugging every workstream.

---

## 2. Workstream 1: Workbench Platform & User Experience
- **Purpose:** Deliver a responsive, high-density industrial control console that visually communicates sovereign execution, real-time agent traces, and human oversight.
- **Components Covered:** `frontend/src/app/*`, `components/layout/*`, `components/chat/*`, `components/approval/*`, `components/security/*`, `store/useTaskStore.ts`.
- **Core Responsibilities:**
  - Implement 3-column AppShell complying 100% with Black + Safety Orange theme (`rounded-none`, `#FF6A00`, monospace telemetry).
  - Build live `AgentTimeline` subscribing to `/api/tasks/{id}/stream` SSE events.
  - Implement dynamic `ModelRouterCard` displaying task classification and explainable rationale.
  - Build interactive `ApprovalPanel` enabling Approve, Edit, and Reject decisions.
  - Render dynamic `RAGSourceCard` with direct text excerpts and page numbers.
- **Inputs:** Backend REST API contracts, SSE stream specifications.
- **Outputs:** Fully functional Next.js production build with 0 TypeScript/ESLint warnings.
- **Definition of Done:** Zero mock data; live state driven entirely by backend SSE events; passes full UI test run.

---

## 3. Workstream 2: API Gateway & Agent Orchestration
- **Purpose:** Build the nervous system of ABHEDYA AI, managing task lifecycles, state machine compilation, and deterministic human checkpoints.
- **Components Covered:** `backend/app/main.py`, `backend/app/api/*`, `backend/app/agent/graph.py`, `backend/app/agent/state.py`, `backend/app/core/sse_manager.py`.
- **Core Responsibilities:**
  - Build and compile the LangGraph `StateGraph` linking all nodes.
  - Implement deterministic pause/resume execution semantics via LangGraph checkpoints.
  - Refactor `api/chat.py` and `api/tasks.py` to dispatch graph invocations in background tasks.
  - Maintain a robust SSE event broadcaster (`sse_manager.py`) with heartbeat keep-alives and reconnection replay.
  - Enforce request validation, file upload sanitization, and structured Pydantic schemas.
- **Inputs:** Specialized nodes from Workstreams 3, 4, and 5.
- **Outputs:** Compiled, testable LangGraph workflow emitting real-time telemetry over SSE.
- **Definition of Done:** Complete task execution traverses all graph nodes with verified state transitions; pauses correctly at HITL checkpoint.

---

## 4. Workstream 3: Adaptive Model Routing & Sovereign LLM Runtime
- **Purpose:** Engineer the local model execution layer and an explainable routing engine that matches tasks to optimal local open-weight models.
- **Components Covered:** `backend/app/core/llm.py`, `backend/app/agent/router.py`, `backend/app/core/policy.py`, `scripts/pull_models.sh`.
- **Core Responsibilities:**
  - Implement local model registry interfacing with Ollama over local loopback (`localhost:11434`).
  - Build the **Adaptive AI Model Router** using multi-factor heuristic logic (task type, input modality, complexity, latency target, VRAM usage).
  - Implement the **Constitutional Policy Layer** (L0–L4 rules).
  - Author robust prompt templates with system prompt boundaries and structured JSON extraction schemas.
  - Formulate fallback strategies: local model alternative selection when preferred model is busy.
- **Inputs:** Raw task prompts and file metadata from Workstream 2.
- **Outputs:** Routing decisions with machine-readable rationale; reliable local model inference.
- **Definition of Done:** Automated test proves three distinct task classes route to three distinct models; zero external API requests.

---

## 5. Workstream 4: Multimodal Ingestion & Hybrid Agentic RAG
- **Purpose:** Provide the workbench with deep vision-native document intelligence and high-precision sovereign knowledge retrieval.
- **Components Covered:** `backend/app/rag/*`, `backend/app/tools/ocr_tool.py`, `backend/app/models/embeddings.py`, `data/sample_sops/*`.
- **Core Responsibilities:**
  - Integrate PaddleOCR for high-fidelity extraction of scanned tabular inspection logs and stamps.
  - Integrate Qwen2.5-VL for visual diagram interpretation and surface corrosion identification.
  - Implement document chunking, BGE-M3 local embedding generation, and Qdrant HNSW vector indexing.
  - Build semantic search retriever returning top-$k$ chunks with document metadata, page numbers, and similarity scores.
  - Seed knowledge store with realistic synthetic MRPL SOPs (OISD-105, API 570, API 653, NDT logs).
- **Inputs:** Raw uploaded files (PDF, PNG, JPG, XLSX) from Workstream 2.
- **Outputs:** Grounded evidence chunks, extracted text, and visual anomaly descriptions.
- **Definition of Done:** Scanned PDF report yields structured table data; vector search retrieves exact corresponding SOP paragraph with $>0.82$ similarity.

---

## 6. Workstream 5: Secure Sandbox, Verification & Deliverable Synthesis
- **Purpose:** Enable isolated numerical code execution, automated quality verification, and professional document synthesis.
- **Components Covered:** `backend/app/tools/sandbox.py`, `backend/app/agent/nodes/self_rag.py`, `backend/app/tools/docx_writer.py`, `backend/app/tools/xlsx_analyzer.py`.
- **Core Responsibilities:**
  - Implement an ephemeral Docker sandbox runner executing generated Python code with `--network none`, CPU/RAM limits, and execution timeouts.
  - Build the **Self-RAG Critique Gate** evaluating retrieval relevance (`ISREL`) and factual grounding (`ISSUP`), triggering automated revision on failure.
  - Enhance `docx_writer.py` to synthesize publication-quality `Inspection_Approval_Note.docx` with embedded evidence citations, charts, and operator signatures.
  - Implement `openpyxl` analyzer for calculating corrosion rates and wall thickness trends from spreadsheets.
- **Inputs:** LLM reasoning drafts from Workstream 3; retrieved evidence from Workstream 4.
- **Outputs:** Verified mathematical results, critique evaluations, and generated downloadable documents.
- **Definition of Done:** Sandboxed code calculating corrosion rate runs isolated with no network access; generated `.docx` file matches official corporate layout.

---

## 7. Workstream 6: Zero-Egress Security & Enclave Infrastructure
- **Purpose:** Guarantee, enforce, and demonstrate complete air-gap sovereignty, data persistence, and system-wide auditability.
- **Components Covered:** `docker-compose.yml`, `backend/app/network_sentinel/*`, `backend/app/db/*`, `scripts/verify_zero_egress.sh`.
- **Core Responsibilities:**
  - Create and maintain the master `docker-compose.yml` linking frontend, backend, Qdrant, PostgreSQL, and Ollama on an internal bridge network.
  - Implement active kernel-level egress blocking scripts (`iptables`/`ufw`) and enhance `NetworkSentinelMonitor`.
  - Implement the **Immutable Audit Ledger** in PostgreSQL, computing SHA-256 hashes of all task inputs, intermediate traces, approvals, and outputs.
  - Author automated air-gap verification scripts (`verify_zero_egress.sh`) for pre-demo validation.
  - Manage database migrations via Alembic and ensure robust local volume persistence.
- **Inputs:** Container specifications and service requirements from all workstreams.
- **Outputs:** Turnkey Docker Compose orchestration, persistent database ledger, and verified zero-egress enforcement.
- **Definition of Done:** Entire stack boots with a single `docker compose up`; automated egress test verifies 0 outbound packets under continuous load.
