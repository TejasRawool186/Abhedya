# 12-Week Master Development Roadmap
## Engineering Schedule, Phasing Gates & Deliverables (Weeks 1 to 12)

---

## 1. Roadmap Architecture & Phasing
The roadmap transforms the existing prototype into a production-quality, air-gapped SIH MVP over a structured 12-week timeline. Work is divided into **five sequential phases** executed across **six technical workstreams**.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       12-WEEK DEVELOPMENT TIMELINE                          │
├─────────┬──────────────────────────┬────────────────────────────────────────┤
│ PHASE   │ WEEKS                    │ STRATEGIC MILESTONE FOCUS              │
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Phase 1 │ Weeks 1–2                │ Foundation, Alignment & Enclave Baseline│
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Phase 2 │ Weeks 3–5                │ Core Sovereign Subsystem Construction  │
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Phase 3 │ Weeks 6–8                │ Intelligence & Workflow Integration    │
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Phase 4 │ Weeks 9–10               │ Hardening, Security & Resilience       │
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Phase 5 │ Weeks 11–12              │ SIH MVP Finalization & Rehearsal       │
└─────────┴──────────────────────────┴────────────────────────────────────────┘
```

---

## 2. Phase 1: Foundation, Alignment & Enclave Baseline

### Week 1 — Repository Reconciliation, Infrastructure & Architecture Freeze
- **Primary Objective:** Boot the multi-service Docker Compose stack locally, resolve repository-code discrepancies, and freeze Pydantic State schemas and API contracts.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Audit frontend types; eliminate broken mock references; bind store to OpenAPI contract. | None | Clean `frontend/` compile without mock errors. |
| **WS 2 (Gateway)** | Define `WorkbenchState` in Pydantic; scaffold modular `backend/app/agent/` package. | None | Committed `state.py` and OpenAPI schema. |
| **WS 3 (Models)** | Author `scripts/pull_models.sh`; test Ollama connectivity; build model registry YAML. | Local Ollama | Verified CLI script pulling `qwen2.5:7b`. |
| **WS 4 (RAG)** | Deploy Qdrant vector database container; initialize collection schemas. | None | Qdrant service responding on port 6333. |
| **WS 5 (Tools)** | Audit `docx_writer.py`; define standard JSON schema for inspection report variables. | None | Standardized template schema documentation. |
| **WS 6 (Infra)** | **[CRITICAL]** Author master `docker-compose.yml` linking frontend, backend, db, and qdrant. | None | `docker compose up` boots core stack cleanly. |

- **Integration:** Backend container connects to PostgreSQL and Qdrant over Docker bridge network.
- **Security:** Configure `.env.example`; verify no services expose unauthenticated management ports.
- **Testing:** Pytest verifies database connection pool and Qdrant health check.
- **Documentation:** Publish `docs/04-architecture/architecture-overview.md` and `docs/10-development/local-setup.md`.
- **Knowledge Sharing:** **All-Hands Architecture Walkthrough** — Lead architect presents canonical 9-layer flow.
- **Exit Criteria:** All six developers can boot the base stack with a single `docker compose up` command.

---

### Week 2 — Orchestrator Skeleton, Data Layer & Zero-Egress Baseline
- **Primary Objective:** Build LangGraph state machine skeleton, initialize database migrations, and establish the automated zero-egress test harness.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Build dynamic `AgentTimeline` rendering real-time SSE step nodes (`pending`, `active`, `done`). | WS 2 contracts | Interactive timeline component in test route. |
| **WS 2 (Gateway)** | Scaffold LangGraph `StateGraph` with dummy nodes; implement SSE streaming generator. | WS 6 DB | LangGraph compiles; stream returns dummy step events. |
| **WS 3 (Models)** | Build structured JSON extraction wrapper around Ollama; author classification prompt templates. | WS 3 (W1) | `query_ollama_json` returning validated Pydantic models. |
| **WS 4 (RAG)** | Implement PyPDF and openpyxl file extraction pipeline; configure BGE-M3 local embedding model. | WS 4 (W1) | Text and tabular extraction service operational. |
| **WS 5 (Tools)** | Create base Dockerfile for `sandbox-runner`; implement timeout and subprocess wrapper. | None | `sandbox-runner` Docker image building cleanly. |
| **WS 6 (Infra)** | Author `scripts/verify_zero_egress.sh`; configure `NetworkSentinelMonitor` socket poller. | WS 6 (W1) | Egress script verifies 0 external connections. |

- **Integration:** Frontend connects to `/api/tasks/{id}/stream` and renders live step updates from LangGraph dummy nodes.
- **Security:** Verify `NetworkSentinelMonitor` flags an alert if an external socket is opened.
- **Testing:** Integration test: `POST /api/chat` creates DB record, triggers dummy graph, streams 3 SSE events.
- **Documentation:** Publish `docs/05-system-design/orchestrator-langgraph.md` and `docs/09-apis/sse-event-specs.md`.
- **Knowledge Sharing:** **LangGraph & State Machine Workshop** — Understanding state transitions and SSE streams.
- **Exit Criteria:** LangGraph executes dummy pipeline end-to-end; SSE events stream reliably to UI.

---

## 3. Phase 2: Core Sovereign Subsystem Construction

### Week 3 — Adaptive AI Model Router & Multimodal Ingestion Pipeline
- **Primary Objective:** Implement explainable task-based model routing and integrate PaddleOCR for scanned inspection log parsing.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Build `ModelRouterCard` displaying task classification badge, selected model, and routing rationale. | WS 3 API | Router UI card integrated into chat view. |
| **WS 2 (Gateway)** | Wire routing node into LangGraph; pass dynamic model parameters downstream into state. | WS 3 router | Routing node actively executes as Node 1 in graph. |
| **WS 3 (Models)** | Implement **Adaptive AI Model Router** heuristic logic (task type, modality, latency, VRAM). | WS 3 (W2) | Router module selecting between Qwen2.5, VL, and Coder. |
| **WS 4 (RAG)** | Integrate PaddleOCR service; implement table extraction parsing NDT thickness columns. | WS 4 (W2) | Extractor converting scanned NDT tables to structured JSON. |
| **WS 5 (Tools)** | Build spreadsheet analysis tool (`xlsx_analyzer.py`) computing corrosion trends from tabular data. | WS 5 (W1) | Analytical tool calculating metal loss and corrosion rates. |
| **WS 6 (Infra)** | Set up GPU pass-through configuration in Compose; monitor VRAM consumption during model loads. | WS 6 (W1) | GPU acceleration verified for Ollama and PaddleOCR. |

- **Integration:** Uploading a scanned PDF triggers PaddleOCR extraction; extracted text feeds into the Adaptive Router.
- **Security:** File upload validation enforces 25MB limit and validates MIME magic bytes.
- **Testing:** Unit tests verify router classifies at least 5 distinct prompt types correctly; PaddleOCR parses sample NDT sheet.
- **Documentation:** Publish `docs/04-architecture/adaptive-router.md` and `docs/07-ai-ml/multimodal-pipeline.md`.
- **Knowledge Sharing:** **Multimodal Processing & OCR Deep Dive** — Bounding box extraction and table reconstruction.
- **Exit Criteria:** Scanned NDT document uploads cleanly, extracts tabular thickness readings, and selects optimal local model.

---

### Week 4 — Hybrid Agentic RAG & Sovereign Knowledge Store
- **Primary Objective:** Ingest synthetic MRPL refinery SOPs into Qdrant and implement semantic retrieval with exact source citations.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Build `RAGSourceCard` displaying clickable citation badges, document titles, pages, and scores. | WS 4 schema | Expandable evidence drawer in UI Context Panel. |
| **WS 2 (Gateway)** | Implement LangGraph retrieval node querying Qdrant; inject retrieved context into `WorkbenchState`. | WS 4 retriever | Retrieval node executing as Node 3 in LangGraph. |
| **WS 3 (Models)** | Implement grounded prompt generation injecting retrieved context with strict anti-hallucination rules. | WS 4 chunks | LLM generates answers referencing specific `[Source N]` tags. |
| **WS 4 (RAG)** | Implement semantic chunker; seed Qdrant with synthetic MRPL SOPs (OISD-105, API 570). | WS 6 Qdrant | Vector collection indexed with $>500$ verified SOP chunks. |
| **WS 5 (Tools)** | Implement citation validation utility checking that generated citations exist in retrieved context. | WS 2 state | Validator flagging ungrounded citation references. |
| **WS 6 (Infra)** | Configure Qdrant HNSW indexing parameters for sub-50ms local retrieval; persist on encrypted volume. | WS 4 data | Persistent, high-performance local vector store. |

- **Integration:** Submitting an equipment query retrieves corresponding SOP clauses from Qdrant and displays citations in the UI.
- **Security:** Ensure knowledge corpus is stored strictly in local Docker volumes; zero external network requests during retrieval.
- **Testing:** RAG retrieval benchmark asserts top-3 recall $>90\%$ across 20 synthetic refinery compliance questions.
- **Documentation:** Publish `docs/07-ai-ml/hybrid-rag.md` and `docs/06-data/corpus-management.md`.
- **Knowledge Sharing:** **RAG Mechanics & Vector Search Masterclass** — Embeddings, distance metrics, and chunking trade-offs.
- **Exit Criteria:** User queries regarding pipe inspection return exact clauses from local API 570 standard with page-level citations.

---

### Week 5 — Secure Tool Execution Sandbox & Constitutional Policy Layer
- **Primary Objective:** Enforce safe, network-denied code execution in Docker and implement the Constitutional Policy governance engine.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Build `ToolExecutionCard` showing sandboxed code input, stdout output, execution time, and security badge. | WS 5 runner | Dedicated tool execution trace view in timeline. |
| **WS 2 (Gateway)** | Implement tool invocation node in LangGraph; route numerical calculation sub-tasks to sandbox. | WS 5 sandbox | Tool execution node integrated into graph flow. |
| **WS 3 (Models)** | Implement **Constitutional Policy Layer** (L0–L4 rules); configure coding prompt template for Python. | WS 2 state | Policy engine filtering prompts and enforcing role rules. |
| **WS 4 (RAG)** | Add visual diagram inspection node using Qwen2.5-VL for corrosion and defect detection in images. | Local VLM | Vision analysis node outputting structured defect labels. |
| **WS 5 (Tools)** | Implement **Network-Denied Docker Sandbox** (`sandbox.py`) executing generated Python scripts. | WS 6 Docker | Ephemeral sandbox running code with strict 512MB/10s caps. |
| **WS 6 (Infra)** | Configure Docker daemon permissions allowing backend to spawn sibling containers with `--network none`. | Host Docker | Isolated container runner operational on host. |

- **Integration:** LLM generates Python code to calculate remaining pipe life; code executes inside isolated container; output returns to graph.
- **Security:** Sandbox container verification: test script attempting socket connection fails with `Network unreachable`.
- **Testing:** Sandbox stress test: verify infinite loops are terminated at 10s timeout and memory bombs are killed at 512MB.
- **Documentation:** Publish `docs/05-system-design/tool-sandbox-design.md` and `docs/04-architecture/constitutional-policy.md`.
- **Knowledge Sharing:** **Container Security & Sandboxing Protocols** — Inspecting namespaces, cgroups, and seccomp profiles.
- **Exit Criteria:** Mathematical calculations execute safely in network-isolated container; results feed back into LangGraph state.

---

## 4. Phase 3: Intelligence & End-to-End Workflow Integration

### Week 6 — Self-RAG Critique Gate & Revision Loop
- **Primary Objective:** Build the automated verification gate checking retrieval relevance and claim support, triggering revisions on failure.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Build `VerificationCard` displaying ISREL and ISSUP metric badges, status (`PASS`/`REVISE`), and critique notes. | WS 5 schema | Live verification badge and inspection panel in UI. |
| **WS 2 (Gateway)** | Implement conditional edges in LangGraph routing output to revision node if critique fails (max 2 retries). | WS 5 critique | Self-healing revision loop operational in graph. |
| **WS 3 (Models)** | Author Self-RAG critique prompts evaluating factual consistency between SOP evidence and draft answer. | WS 3 prompts | Critique evaluator returning structured verification scores. |
| **WS 4 (RAG)** | Implement fallback retrieval query reformulation when initial relevance score is below threshold. | WS 4 RAG | Query expansion algorithm retrieving broader context. |
| **WS 5 (Tools)** | Implement `self_rag.py` evaluation module computing composite grounding score from LLM critique tokens. | WS 3 evaluator | Algorithmic scoring module driving graph branching. |
| **WS 6 (Infra)** | Log verification metrics and revision counts to PostgreSQL for quality and latency tracking. | WS 6 DB | Persistent table capturing verification telemetry. |

- **Integration:** If reasoning model generates an ungrounded claim, Self-RAG critique rejects it, triggers revision node, and produces a corrected draft.
- **Security:** Prevents hallucinations or prompt injections from masquerading as verified engineering recommendations.
- **Testing:** Unit test forces an ungrounded statement into critique node; verifies state correctly routes to `revise` edge.
- **Documentation:** Publish `docs/07-ai-ml/self-rag-verification.md`.
- **Knowledge Sharing:** **Automated Verification & Self-RAG Seminar** — Analyzing critique tokens and loop termination.
- **Exit Criteria:** Verification gate successfully identifies and revises ungrounded engineering claims in automated test run.

---

### Week 7 — Human-in-the-Loop (HITL) Checkpoint & 4-Eye Approval
- **Primary Objective:** Implement deterministic graph pause and resume mechanics for human operator authorization of high-risk actions.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Enhance `ApprovalPanel` with side-by-side comparison of proposed action, evidence, risk badge, and edit box. | WS 2 API | Polished human approval interface with Approve/Edit/Reject. |
| **WS 2 (Gateway)** | Implement LangGraph interrupt checkpoint; pause execution state in DB; implement `POST /api/tasks/{id}/approve`. | WS 2 graph | Graph state freezes at checkpoint; resumes upon API call. |
| **WS 3 (Models)** | Implement risk classification algorithm assigning risk level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) to proposed actions. | WS 3 router | Automated risk score driving mandatory approval rules. |
| **WS 4 (RAG)** | Package full evidence dossier (SOP excerpts, OCR snippets, defect coordinates) for presentation in approval modal. | WS 4 context | Structured audit dossier payload sent with approval event. |
| **WS 5 (Tools)** | Wire operator edit capabilities allowing engineer to modify recommendation text before report synthesis. | WS 1 UI | Editable state payload merged into final deliverable node. |
| **WS 6 (Infra)** | Create `approvals` database table recording operator ID, role, timestamp, decision, and digital signature. | WS 6 DB | Tamper-evident SQL audit table capturing operator sign-off. |

- **Integration:** Graph reaches `human_checkpoint`, pauses, and emits `event: approval_required`; operator approves in UI; graph completes.
- **Security:** High-risk actions cannot proceed without an authenticated operator sign-off record.
- **Testing:** End-to-end test validates that a task in `awaiting_approval` state cannot be bypassed without approval API call.
- **Documentation:** Publish `docs/05-system-design/audit-ledger-design.md` (Approval Section).
- **Knowledge Sharing:** **Human-in-the-Loop Safety Engineering** — Failure modes of autonomous AI and industrial 4-Eye principles.
- **Exit Criteria:** Workflow halts deterministically; operator approval successfully triggers deliverable generation and audit logging.

---

### Week 8 — Deliverable Synthesis & Immutable Audit Ledger
- **Primary Objective:** Synthesize official corporate inspection `.docx` documents and record tamper-evident cryptographic audit logs.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Implement `DownloadResult` card allowing direct download of generated `.docx` report with preview metadata. | WS 2 download | Download button and document summary preview in UI. |
| **WS 2 (Gateway)** | Implement `GET /api/tasks/{id}/download` endpoint serving generated `.docx` file with strict access headers. | WS 5 docx | Secure file delivery endpoint in FastAPI. |
| **WS 3 (Models)** | Implement executive summary synthesizer formatting findings, SOP citations, and approval signatures into report sections. | WS 3 models | Structured JSON payload feeding Word document builder. |
| **WS 4 (RAG)** | Inject high-resolution image crops (corrosion defects) and OCR tables into deliverable generation payload. | WS 4 vision | Visual assets formatted for document embedding. |
| **WS 5 (Tools)** | Refactor `docx_writer.py` to produce standardized `Inspection_Approval_Note.docx` matching MRPL corporate branding. | WS 3 payload | Production-grade `.docx` generator with tables and images. |
| **WS 6 (Infra)** | Implement SHA-256 cryptographic audit chaining in PostgreSQL, hashing all task inputs, traces, approvals, and outputs. | WS 6 DB | Immutable audit trail verifiable via cryptographic hash. |

- **Integration:** Approved task triggers `docx_writer.py`, saves `.docx` to `/data/deliverables`, computes SHA-256 hash, and logs to `audit_logs`.
- **Security:** Generated `.docx` file contains an embedded digital verification stamp containing the database audit record SHA-256 hash.
- **Testing:** Verify generated `.docx` opens in Microsoft Word / LibreOffice without formatting errors; verify audit hash matches file contents.
- **Documentation:** Publish `docs/05-system-design/audit-ledger-design.md` and `docs/06-data/database-schema.md`.
- **Knowledge Sharing:** **Document Synthesis & Cryptographic Audit Trails** — XML manipulation, digital signatures, and compliance ledgers.
- **Exit Criteria:** System generates a fully styled `.docx` report with evidence citations and records an immutable SHA-256 audit entry.

---

## 5. Phase 4: Hardening, Security Validation & Resilience

### Week 9 — Host-Level Egress Enforcement & Physical Air-Gap Testing
- **Primary Objective:** Implement host-level firewall enforcement and prove 100% operational capability with physical network disconnected.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Connect `NetworkSentinelView` to live `/api/network/status` endpoint, rendering real-time socket telemetry. | WS 6 API | Live telemetry panel displaying `External Sockets: 0`. |
| **WS 2 (Gateway)** | Implement `/api/network/status` endpoint returning kernel socket metrics and network isolation state. | WS 6 sentinel | Real-time network telemetry API endpoint. |
| **WS 3 (Models)** | Audit all model invocation wrappers to ensure no external telemetry or Hugging Face hub calls are attempted. | WS 3 models | Air-gap hardened model loading configuration. |
| **WS 4 (RAG)** | Audit embedding and OCR libraries to ensure no remote model download checks occur at runtime. | WS 4 pipelines | 100% offline-cached model assets and weights. |
| **WS 5 (Tools)** | Perform sandbox escape vulnerability testing; verify sandbox cannot access host filesystem outside `/tmp`. | WS 5 sandbox | Security audit report confirming container containment. |
| **WS 6 (Infra)** | **[CRITICAL]** Author `scripts/enforce_airgap.sh` configuring host `iptables` default-deny egress; run physical disconnect test. | Host root | Production-grade firewall enforcement script. |

- **Integration:** System runs the complete flagship inspection workflow while physical Ethernet is unplugged and Wi-Fi is disabled.
- **Security:** Run `nmap` and `tcpdump` during task execution; assert zero outbound packets leave the host network interface.
- **Testing:** Execute `scripts/verify_zero_egress.sh` under sustained load; verify 100% pass rate with zero socket leaks.
- **Documentation:** Publish `docs/04-architecture/zero-egress-enclave.md` and `docs/11-testing/zero-egress-validation.md`.
- **Knowledge Sharing:** **Air-Gap Penetration Testing & Network Forensics** — Using `tcpdump`, `ss`, and `iptables` to verify isolation.
- **Exit Criteria:** Complete inspection task succeeds with host network physically disconnected; Sentinel confirms 0 external bytes sent.

---

### Week 10 — Stress Testing, Failure Recovery & Edge Case Hardening
- **Primary Objective:** Ensure the workbench fails safely under resource exhaustion, corrupted inputs, and model timeouts.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Implement graceful error boundaries, toast alerts for failed operations, and reconnect logic for broken SSE streams. | WS 1 UI | Robust UI handling network disconnects and errors. |
| **WS 2 (Gateway)** | Implement task timeout middleware, graceful cancellation handlers, and dead-letter queue for failed tasks. | WS 2 gateway | Resilient API gateway preventing hanging worker threads. |
| **WS 3 (Models)** | Implement model OOM fallback: downscale to quantized 7B model if 14B model exhausts GPU VRAM. | WS 3 models | Dynamic VRAM-aware model fallback logic. |
| **WS 4 (RAG)** | Handle corrupted PDF/image uploads gracefully; return clean user error when OCR finds zero readable text. | WS 4 OCR | Input sanitization handling corrupted binary payloads. |
| **WS 5 (Tools)** | Harden sandbox against infinite loops, memory fork bombs, and malformed spreadsheet equations. | WS 5 sandbox | Sandbox failure handler returning structured error JSON. |
| **WS 6 (Infra)** | Implement automated PostgreSQL backup script and database recovery procedure; test container restart resilience. | WS 6 DB | Automated backup script and recovery documentation. |

- **Integration:** Introduce synthetic failure (kill Ollama daemon); verify system emits clean error event and does not crash backend.
- **Security:** Test prompt injection attacks; verify system prompt enclosure holds.
- **Testing:** Execute automated stress suite simulating 10 concurrent heavy tasks; verify zero deadlocks and graceful queuing.
- **Documentation:** Publish `docs/troubleshooting.md` and update `docs/08-security/threat-model.md`.
- **Knowledge Sharing:** **Chaos Engineering & Failure Recovery Workshop** — Injecting faults, simulating OOM, and debugging post-mortems.
- **Exit Criteria:** System survives OOM injection, malformed files, and process restarts without state corruption or unhandled crashes.

---

## 6. Phase 5: SIH MVP Finalization, Rehearsal & Delivery

### Week 11 — Flagship Demo Golden Path Integration & Rehearsal
- **Primary Objective:** Polish and lock the end-to-end SIH flagship demonstration workflow into a seamless, reproducible story.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Add Demo Mode quick-launch preset loading sample inspection assets; polish transitions and loading skeletons. | All WS | 1-click golden path demo launcher in UI. |
| **WS 2 (Gateway)** | Optimize end-to-end execution latency; pre-warm local models on startup to avoid cold-start delays. | All WS | Sub-45s total execution time for golden path. |
| **WS 3 (Models)** | Fine-tune classification and reasoning prompts on sample MRPL inspection data to guarantee accurate output. | WS 3 prompts | Golden path responses verified for technical accuracy. |
| **WS 4 (RAG)** | Curate golden sample dataset (scanned ultrasonic log, corroded pipe photograph, API 570 Section 7 extract). | WS 4 data | Standardized demo dataset committed in `data/demo/`. |
| **WS 5 (Tools)** | Verify generated `Inspection_Approval_Note.docx` layout, typography, and image alignment are flawless. | WS 5 docx | Pixel-perfect executive deliverable artifact. |
| **WS 6 (Infra)** | Package complete standalone offline installer bundle including all container images and model weights. | All WS | Turnkey deployment tarball for demo laptop setup. |

- **Integration:** Rehearse complete flagship demo from cold boot to final `.docx` download 10 times consecutively with zero failures.
- **Security:** Record pre-demo baseline audit hash and demonstrate that database records match physical deliverable hash.
- **Testing:** Full regression test suite execution; 100% passing across unit, integration, and security tests.
- **Documentation:** Publish `docs/13-sih/flagship-demo-script.md` and `docs/13-sih/backup-contingency-plan.md`.
- **Knowledge Sharing:** **Full Team Demo Rehearsal #1** — Every developer executes the demo end-to-end and delivers the pitch.
- **Exit Criteria:** 10 consecutive flawless executions of the golden path demo; total runtime under 60 seconds.

---

### Week 12 — Final Documentation Freeze, Video Backup & Judge Defense
- **Primary Objective:** Freeze all documentation, record backup demonstration video, and prepare the entire team for technical judging.
- **Workstream Activities:**

| Workstream | Tasks | Dependencies | Deliverable |
| :--- | :--- | :--- | :--- |
| **WS 1 (UI)** | Final visual audit; verify responsive scaling on presentation displays; ensure zero console warnings. | None | Production frontend bundle locked. |
| **WS 2 (Gateway)** | Final code cleanup; ensure clean logging formatting; remove debugging endpoints. | None | Backend production codebase locked. |
| **WS 3 (Models)** | Document model selection benchmarks, parameter counts, and quantization levels for judge evaluation. | None | Model performance whitepaper in docs. |
| **WS 4 (RAG)** | Document vector retrieval precision/recall benchmarks and embedding performance metrics. | None | Retrieval evaluation metrics in docs. |
| **WS 5 (Tools)** | Assemble sample deliverable showcase (sample DOCX, XLSX, and code artifacts) for physical inspection. | None | Printed / downloadable deliverable portfolio. |
| **WS 6 (Infra)** | Record 4K backup demonstration video with physical network disconnect proof; freeze Git `main` branch. | All WS | Master demo video and finalized GitHub repository. |

- **Integration:** Repository documentation matches codebase 100%; all obsolete markdown files archived or deleted.
- **Security:** Final security certification: run automated zero-egress audit and archive signed test certificate in repository.
- **Testing:** Verify clean git clone and deployment on a completely clean secondary laptop with no prior caching.
- **Documentation:** Publish `docs/13-sih/evaluation-defense-faq.md` and finalize `docs/README.md`.
- **Knowledge Sharing:** **Judge Defense Mock Session** — Grilling all six team members on architecture, security, and edge cases.
- **Exit Criteria:** System passes Clean Machine Deployment Test; all six developers pass Level 1–6 technical defense examination.
