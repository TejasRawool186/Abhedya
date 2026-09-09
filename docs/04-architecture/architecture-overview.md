# System Architecture Overview
## The 9-Layer Sovereign Architecture of ABHEDYA AI

---

## 1. High-Level Architectural Flow

ABHEDYA AI replaces generic conversational chatbot designs with an industrial-grade, multi-stage agentic workflow:

```
                    ┌─────────────────────────────┐
                    │     ABHEDYA AI WORKBENCH    │
                    │ (Next.js 16 · Black+Orange) │
                    └──────────────┬──────────────┘
                                   │ Localhost REST & SSE
                                   ▼
                    ┌─────────────────────────────┐
                    │       FASTAPI GATEWAY       │
                    │   Payload & File Handling   │
                    └──────────────┬──────────────┘
                                   │ Socket Telemetry
                                   ▼
                    ┌─────────────────────────────┐
                    │    ZERO-EGRESS SENTINEL     │
                    │  Host /proc/net/tcp Poller  │
                    └──────────────┬──────────────┘
                                   │ Validated Request
                                   ▼
                    ┌─────────────────────────────┐
                    │   ADAPTIVE AI MODEL ROUTER  │
                    │ Task + Modality + VRAM Logic│
                    └──────────────┬──────────────┘
                                   │ Policy Constraints
                                   ▼
                    ┌─────────────────────────────┐
                    │  CONSTITUTIONAL POLICY (L0) │
                    │ Role + Risk + Context Rules │
                    └──────────────┬──────────────┘
                                   │ Execution State
                                   ▼
                    ┌─────────────────────────────┐
                    │    LANGGRAPH ORCHESTRATOR   │
                    │   StateGraph Execution Core │
                    └───────┬─────────┬───────────┘
                            │         │
              ┌─────────────┘         └─────────────┐
              ▼                                     ▼
     ┌──────────────────┐                  ┌──────────────────┐
     │ MULTIMODAL / RAG │                  │ SECURE SANDBOX   │
     │                  │                  │                  │
     │ PaddleOCR        │                  │ Docker Isolated  │
     │ Qwen2.5-VL       │                  │ Python Math      │
     │ ColPali          │                  │ Spreadsheet Calc │
     │ Qdrant Vector DB │                  │ Resource Capped  │
     └─────────┬────────┘                  └─────────┬────────┘
               │                                     │
               └────────────────┬────────────────────┘
                                ▼
                    ┌─────────────────────────────┐
                    │   SELF-RAG CRITIQUE GATE    │
                    │ ISREL / ISSUP Verification  │
                    └──────────────┬──────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                    needs review          passed
                         │                   │
                         ▼                   ▼
              ┌──────────────────┐  ┌────────────────────┐
              │ HUMAN APPROVAL   │  │ DELIVERABLE        │
              │ 4-Eye Sign-Off   │  │ .docx / .xlsx      │
              └────────┬─────────┘  └──────────┬─────────┘
                       │                       │
                       └──────────┬────────────┘
                                  ▼
                    ┌─────────────────────────────┐
                    │    IMMUTABLE AUDIT LEDGER   │
                    │  PostgreSQL SHA-256 Chained │
                    └─────────────────────────────┘
```

---

## 2. The Nine Canonical System Layers

| Layer | Canonical Subsystem | Technology Stack | Core Responsibility |
| :---: | :--- | :--- | :--- |
| **L1** | **ABHEDYA AI Workbench** | Next.js 16 (Turbopack), React, Tailwind, Zustand | 3-Column industrial interface (`AppShell`, `ChatContainer`, `ExecutionTimeline`, `ContextPanel`). |
| **L2** | **FastAPI Gateway** | Python, FastAPI, Uvicorn, Pydantic | API routing, multipart file ingestion, session token validation, and SSE event streaming. |
| **L3** | **Zero-Egress Sentinel** | Python daemon, Linux `/proc/net/tcp`, `psutil` | Continuous socket inspection asserting 0 external egress packets; host firewall enforcement. |
| **L4** | **Adaptive AI Model Router** | Multi-factor heuristic engine | Task classification, modality routing, and resource/VRAM-aware local model dispatch. |
| **L5** | **Constitutional Policy Layer** | Tiered policy engine (L0–L4) | Enforces role-based permissions, risk directives, context boundaries, and mandatory approvals. |
| **L6** | **LangGraph Orchestrator** | LangGraph `StateGraph`, Memory Checkpointer | Multi-step cyclic execution: ingestion $\rightarrow$ retrieval $\rightarrow$ planning $\rightarrow$ tool use $\rightarrow$ verification $\rightarrow$ HITL. |
| **L7a**| **Multimodal Intelligence** | PaddleOCR, Qwen2.5-VL, ColPali | Tabular thickness extraction from scanned logs and visual corrosion defect identification. |
| **L7b**| **Hybrid Agentic RAG** | Qdrant, BGE-M3 Embeddings, GraphRAG | High-precision semantic search across synthetic MRPL SOPs (API 570, OISD-105) with citations. |
| **L7c**| **Isolated Tool Sandbox** | Docker Engine (`--network none`) | Ephemeral container execution of generated Python code for corrosion rate and remaining life math. |
| **L8** | **Self-RAG Critique Gate** | Algorithmic critique prompts | Checks retrieval relevance (`ISREL`) and claim grounding (`ISSUP`), triggering automated revisions. |
| **L9** | **Human Control & Audit** | PostgreSQL, `python-docx`, SHA-256 | 4-Eye approval checkpoint, corporate `.docx` report synthesis, and cryptographic audit logging. |

---

## 3. End-to-End Data Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Plant Engineer
    participant UI as ABHEDYA Workbench (Next.js)
    participant API as FastAPI Gateway
    participant Sentinel as Zero-Egress Sentinel
    participant Router as Adaptive Model Router
    participant Graph as LangGraph Orchestrator
    participant Vision as Multimodal / RAG
    participant Sandbox as Docker Sandbox
    participant Critique as Self-RAG Gate
    participant DB as PostgreSQL Ledger

    Operator->>UI: Uploads NDT Report (PDF) + Pipe Photo (PNG)
    UI->>API: POST /api/chat (Multipart payload)
    API->>Sentinel: Check network egress state
    Sentinel-->>API: Status: Air-Gapped (0 outbound sockets)
    API->>DB: Create Task(status="pending")
    API->>Router: Classify task & evaluate constraints
    Router-->>API: Select Qwen2.5-VL (Vision) + Qwen2.5-14B (Reasoning)
    API->>Graph: Invoke StateGraph(WorkbenchState)
    Graph->>Vision: Run PaddleOCR on PDF & VLM on Image
    Vision-->>Graph: Extracted table data & corrosion tags
    Graph->>Vision: Query Qdrant for API 570 Section 7
    Vision-->>Graph: Retrieved SOP clauses with page citations
    Graph->>Sandbox: Execute remaining life calculation script
    Sandbox-->>Graph: CR = 0.56 mm/yr, RL = 1.25 years
    Graph->>Critique: Evaluate ISREL & ISSUP grounding
    Critique-->>Graph: Verification passed (Confidence 0.94)
    Graph->>DB: Save checkpoint; state="awaiting_approval"
    Graph-->>UI: SSE Event: approval_required
    Operator->>UI: Reviews findings, edits schedule, clicks [APPROVE]
    UI->>API: POST /api/tasks/{id}/approve (Digital signature)
    API->>Graph: Resume execution from checkpoint
    Graph->>Graph: Synthesize Inspection_Approval_Note.docx
    Graph->>DB: Append SHA-256 hashed audit log record
    Graph-->>UI: SSE Event: completed (Download URL)
    Operator->>UI: Downloads finalized executive Word report
```

---

## 4. Trust Boundaries & Enclave Isolation

1. **Boundary 1 (Input Perimeter):** All uploaded files are validated at the FastAPI gateway via MIME magic bytes; executable payloads are rejected.
2. **Boundary 2 (Model Perimeter):** Models execute via local loopback (`localhost:11434`) using Ollama; external API calls are blocked at the kernel network namespace.
3. **Boundary 3 (Execution Perimeter):** Generated calculation scripts execute exclusively inside an isolated Docker container with `--network none` and strict memory/time constraints.
4. **Boundary 4 (Authorization Perimeter):** Recommendations cannot transition to completed deliverables without passing the Self-RAG critique gate and human approval checkpoint.
