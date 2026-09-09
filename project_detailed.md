# ABHEDYA AI — Sovereign AI Workbench for Confidential Industrial Intelligence
## Master Technical Specification, Architectural Blueprint & Comprehensive Development Roadmap

**Project Name:** ABHEDYA AI — Sovereign AI Workbench for Confidential Industrial Intelligence  
**Former Working Concept:** OnPremisAI  
**Target Organization Context:** Mangalore Refinery and Petrochemicals Limited (MRPL) / Critical Process Infrastructure  
**Problem Statement ID:** PS ID SIH26117 (Smart Automation · Software Category)  
**Team Name:** Quantum Compilers  
**Document Version:** 4.0.0 (Post-Architecture Realignment Master Edition)  
**Last Updated:** September 9, 2026  
**Repository Branch:** `tejas`  
**Core Product Promise:** *Intelligence that stays inside your walls.*

---

## 1. Executive Summary & Problem Statement

### 1.1 The Industrial Challenge
Continuous-process manufacturing environments such as petroleum refineries (e.g., MRPL), petrochemical complexes, and high-assurance defense plants generate massive volumes of highly confidential, safety-critical operational documentation:
- **Non-Destructive Testing (NDT) Logs:** Ultrasonic wall-thickness measurements along critical high-pressure pipelines, heat exchanger shells, and reaction vessels.
- **Piping & Instrumentation Diagrams (P&IDs):** Highly proprietary schematics depicting asset metallurgy, valve assemblies, operating envelopes, and emergency shutdown logic.
- **Statutory Safety Standards:** Mandatory regulatory directives from the Oil Industry Safety Directorate (OISD-105, OISD-118) and the American Petroleum Institute (API 570, API 510, API 653).

In these environments, utilizing commercial public cloud AI services (e.g., OpenAI ChatGPT, Anthropic Claude, cloud SaaS APIs) is **strictly prohibited** due to:
1. **Critical Infrastructure Security Risks:** Leaking refinery layouts, vessel thicknesses, or vulnerability profiles to foreign cloud infrastructure.
2. **Proprietary Process Theft:** Exposing proprietary crude blend optimizations, catalyst formulations, and operational limits.
3. **Catastrophic Hallucinations:** Autonomous execution of unverified engineering advice in process units risking explosions, chemical leaks, or human casualties.

Conversely, manual engineering review of thousands of scanned physical logs creates critical maintenance backlogs, increasing the probability of catastrophic mechanical failure.

### 1.2 The Sovereign Solution: ABHEDYA AI
**ABHEDYA AI** (Sanskrit for *invulnerable*, *impenetrable*, and *unbreakable*) is a verifiably air-gapped, multi-model agentic AI workbench engineered specifically for confidential industrial operations. It operates 100% on-premise without a single outbound network packet, combining local open-weight large language models (`Qwen2.5`, `Llama3`, `DeepSeek`), multimodal vision/OCR pipelines, sovereign vector retrieval, network-denied code execution sandboxes, inline Self-RAG verification, and mandatory 4-Eye human approval checkpoints.

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               ABHEDYA AI SOVEREIGN ENCLAVE                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

  [ OPERATOR CONSOLE ]  ────────► [ FASTAPI GATEWAY ]  ◄───► [ ZERO-EGRESS SENTINEL ]
    (Next.js 16 UI)                 (Port 8000)                (0 Outbound Network Bytes)
           │                                │
           ▼                                ▼
  ┌─────────────────┐             ┌──────────────────────┐
  │ STANDALONE      │             │ ADAPTIVE AI ROUTER   │
  │ LANDING PAGE    │             │ Task / VRAM Logic    │
  │ (http://.../)   │             └──────────┬───────────┘
  └────────┬────────┘                        │
           │                                 ▼
           ▼                      ┌──────────────────────┐
  ┌─────────────────┐             │ CONSTITUTIONAL POLICY│
  │ WORKBENCH APP   │             │ Tiered L0-L4 Rules   │
  │ (/workbench)    │             └──────────┬───────────┘
  └─────────────────┘                        │
                                             ▼
                                  ┌──────────────────────┐
                                  │ LANGGRAPH AGENT      │
                                  │ ORCHESTRATOR         │
                                  └──────────┬───────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
            ┌──────────────────────┐                    ┌──────────────────────┐
            │ MULTIMODAL & RAG     │                    │ SECURE TOOL SANDBOX  │
            │ PaddleOCR / Qwen-VL  │                    │ Docker --net none    │
            │ Qdrant Vector Engine │                    │ Python Math Runner   │
            └──────────┬───────────┘                    └──────────┬───────────┘
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                                  ┌──────────────────────┐
                                  │ SELF-RAG CRITIQUE    │
                                  │ ISREL / ISSUP Gate   │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │ 4-EYE HUMAN APPROVAL │
                                  │ Deterministic Pause  │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │ DELIVERABLE & AUDIT  │
                                  │ Official .docx Note  │
                                  │ SHA-256 SQL Ledger   │
                                  └──────────────────────┘
```

---

## 2. Current Implementation Reality vs. Authoritative Architecture

Following a systematic audit of the repository (`backend/`, `frontend/`, and `docs/`), the true state of implementation is classified according to our strict evidence-based reality model:

| Architectural Layer | Current State | Code & File Evidence | Target Architecture Requirement |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | **PARTIALLY IMPLEMENTED** | `frontend/src/app/`, `frontend/src/components/` | Next.js 16 3-column AppShell, Black+Orange theme (`#FF6A00`), standalone landing page (`/`), and interactive workbench (`/workbench`). Some components currently rely on mock data (`src/mocks/`). |
| **Backend Gateway** | **PARTIALLY IMPLEMENTED** | `backend/app/main.py`, `api/chat.py`, `api/tasks.py` | FastAPI gateway with file upload and SSE streaming endpoints (`/tasks/{id}/stream`). Procedural pipeline currently used in `chat.py`. |
| **Agent Orchestrator** | **MISSING** | `backend/app/api/chat.py` (lines 37–46) | `app/agent/` directory is missing. Code catches `ImportError` on `app.agent.graph` and executes a sequential fallback. LangGraph StateGraph must be compiled. |
| **Model Router** | **PROTOTYPE** | `backend/app/core/llm.py` | Basic string matching queries local Ollama tags. Needs full multi-factor heuristic (modality, complexity, VRAM headroom, latency). |
| **Multimodal / OCR** | **PROTOTYPE** | `backend/app/core/file_extractor.py` | Plain text extraction via `pypdf` and `openpyxl`. PaddleOCR, Qwen2.5-VL, and ColPali integration are required. |
| **Knowledge / RAG** | **MISSING** | `backend/requirements.txt` | No vector client in requirements. Qdrant HNSW vector store and synthetic SOP corpus ingestion must be established. |
| **Tool Execution** | **MISSING** | `backend/app/tools/` | Only `docx_writer.py` exists. Ephemeral Docker container sandbox with `--network none` must be built. |
| **Verification Gate** | **MISSING** | `backend/app/api/chat.py` | Output is presented directly without automated critique. Self-RAG `ISREL`/`ISSUP` critique and revision loops must be added. |
| **Human Checkpoint** | **PARTIALLY IMPLEMENTED** | `backend/app/api/tasks.py`, `ApprovalCheckpoint.tsx` | Task status transitions to `awaiting_approval`, but pause/resume relies on manual DB polling rather than LangGraph interrupt. |
| **Audit Ledger** | **PARTIALLY IMPLEMENTED** | `backend/app/db/models.py` | `tasks` and `agent_steps` tables exist. Full `audit_logs` table with forward SHA-256 cryptographic chaining must be added. |
| **Zero-Egress Security** | **PROTOTYPE** | `backend/app/network_sentinel/monitor.py` | Socket monitor inspects `/proc/net/tcp` and `psutil`. Active host `iptables` default-deny rules and automated tests must be added. |
| **Deployment Assets** | **IMPLEMENTED** | `docker-compose.yml` (Root) | Turnkey 5-service Docker Compose file linking frontend, backend, PostgreSQL, and Qdrant over an internal network. |

---

## 3. Architecture Changes from Previous Plan

### 3.1 What Changed and Why
1. **Product Rebranding (OnPremisAI $\rightarrow$ ABHEDYA AI):**
   - *Rationale:* Aligns the platform with Indian national sovereignty, critical infrastructure defense, and the SIH theme. Brand visual identity updated from a 3D wireframe cube to a pitch-black defensive shield with Gold, Green, and Red sovereignty indicators.
2. **Elimination of Speculative Claims (Contextual-Bandit $\rightarrow$ Adaptive Router):**
   - *Rationale:* Formalized in **ADR-001**. Contextual bandits require online reinforcement learning and stochastic exploration, which are unsafe in safety-critical process units. Replaced with an explainable, deterministic multi-factor heuristic router.
3. **Formalization of Governance (Constitutional Compiler $\rightarrow$ Constitutional Policy Layer):**
   - *Rationale:* Formalized in **ADR-002**. Replaced non-existent compiler claims with a 5-tier policy framework (L0–L4) enforcing role-based permissions and safety boundaries.
4. **Adoption of LangGraph State Machine:**
   - *Rationale:* Formalized in **ADR-003**. Replaced monolithic procedural scripts with a compiled cyclic state machine supporting automated revision loops and deterministic human approval checkpoints.
5. **Enforcement of Containerized Code Sandboxing:**
   - *Rationale:* Formalized in **ADR-004**. Generated Python calculation scripts must run in ephemeral Docker containers with `--network none` and strict resource limits to prevent remote code execution on the host.
6. **Standardization on Qdrant Vector Engine:**
   - *Rationale:* Formalized in **ADR-005**. Consolidated dual vector engine mentions into a single standalone Rust-based Qdrant service supporting HNSW indexing and Tagged Knowledge Collections.
7. **Implementation of Self-RAG Quality Gate:**
   - *Rationale:* Formalized in **ADR-006**. Introduced automated factual grounding checks (`ISREL`, `ISSUP`) to prevent hallucinated engineering recommendations from reaching the operator.
8. **Reorganization of Team Structure (5 Roles $\rightarrow$ 6 Workstreams):**
   - *Rationale:* Replaced rigid 5-developer functional siloing with 6 technical workstreams and a mandatory cross-training curriculum, ensuring every developer understands the complete system end-to-end.

---

## 4. The 9-Layer Authoritative System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: ABHEDYA AI WORKBENCH CONSOLE (Next.js 16 Turbopack)                            │
│ 3-Column Enclave Shell · Black + Safety Orange (#FF6A00) · 0px Rectangular Geometry    │
│ [Sidebar: Workspaces & Presets] · [Center: Chat & Composer] · [Right: Context & Trace]  │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Localhost HTTP REST & SSE Stream
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 2: FASTAPI APPLICATION GATEWAY (Python 3.11 / Uvicorn)                            │
│ /api/chat · /api/upload · /api/tasks/{id}/stream · /api/tasks/{id}/approve · /network   │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Kernel Socket Audit
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 3: ZERO-EGRESS NETWORK SENTINEL                                                   │
│ Linux /proc/net/tcp Poller · psutil Socket Audit · Host iptables Default-Deny Egress    │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Validated Request Payload
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 4: ADAPTIVE AI MODEL ROUTER                                                       │
│ Explainable Multi-Factor Heuristic: Task Modality + Complexity + VRAM Headroom + Risk   │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Policy Directives
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 5: CONSTITUTIONAL POLICY LAYER (Tiered L0–L4 Governance)                          │
│ L0 Immutable Hash · L1 Role RBAC · L2 Context Bounds · L3 Verification · L4 Risk Direct │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Execution State Payload
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 6: LANGGRAPH AGENT ORCHESTRATOR                                                   │
│ Compiled StateGraph: Ingest ➔ Route ➔ Retrieve ➔ Plan ➔ Sandbox ➔ Critique ➔ HITL      │
└───────────────────────┬─────────────────────────────────────────┬───────────────────────┘
                        │                                         │
                        ▼                                         ▼
┌───────────────────────────────────────────────┐ ┌───────────────────────────────────────┐
│ LAYER 7A: MULTIMODAL & HYBRID RAG             │ │ LAYER 7B: SECURE TOOL SANDBOX         │
│ • PaddleOCR (Tabular NDT Log Extraction)      │ │ • Ephemeral Docker Execution Runner   │
│ • Qwen2.5-VL (Defect & P&ID Diagram Analysis) │ │ • --network none (Complete Isolation) │
│ • ColPali (Vision-Native PDF Page Retrieval)  │ │ • 512MB RAM Ceiling · 10.0s Timeout   │
│ • Qdrant HNSW Vector Store (BGE-M3)           │ │ • Python Math & Corrosion Rate Script │
│ • GraphRAG (Topological Asset Relations)      │ │ • Openpyxl Spreadsheet Analysis       │
└───────────────────────┬───────────────────────┘ └───────────────────┬───────────────────┘
                        │                                             │
                        └───────────────────────┬─────────────────────┘
                                                │ Raw Results & Evidence
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 8: SELF-RAG CRITIQUE GATE                                                         │
│ Algorithmic Grounding Check: Retrieval Relevance (ISREL) · Claim Support (ISSUP)        │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Verified Finding
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ LAYER 9: HUMAN OVERSIGHT & DELIVERABLE SYNTHESIS                                        │
│ 4-Eye Approval Checkpoint · python-docx Official Report · PostgreSQL SHA-256 Audit Log  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. End-to-End Flagship Workflow: NDT Corrosion Audit

The system converges on a single, reproducible golden path workflow demonstrating the entire architectural chain:

1. **Intake & Upload:**
   - Field Inspector uploads scanned ultrasonic thickness log `HC_102_B_UT_Inspection_Report.pdf` and equipment photograph `corrosion_flange.png`.
   - FastAPI gateway validates MIME magic bytes, stores files locally in `/data/uploads/`, and creates `Task(status="pending")`.
2. **Zero-Egress Assertion:**
   - Network Sentinel verifies `0 active external sockets` and logs network status.
3. **Multimodal Ingestion:**
   - **PaddleOCR** parses tabular wall thickness columns:
     - Point P-01: Nominal $6.02\text{ mm}$, Actual $3.20\text{ mm}$, Minimum Required $2.50\text{ mm}$.
   - **Qwen2.5-VL** analyzes the flange photo, detecting severe localized pitting corrosion adjacent to the weld heat-affected zone (HAZ).
4. **Adaptive Model Routing:**
   - Task classified as `MULTIMODAL_INSPECTION` (High Priority).
   - Router selects `Qwen2.5-VL-7B` for visual reasoning and `Qwen2.5-14B` for engineering standards evaluation.
   - UI renders `ModelRouterCard` detailing the explainable rationale.
5. **Sovereign Hybrid RAG:**
   - Queries local Qdrant vector database (`sovereign_sops` collection).
   - Retrieves exact clauses from the MRPL In-Service Piping Inspection Manual (API 570 Section 7).
   - UI renders `RAGSourceCard` with direct page citations (`Page 14`).
6. **Isolated Sandbox Tool Execution:**
   - The agent formulates a calculation plan and generates Python code to evaluate remaining service life:
     $$\text{Corrosion Rate } (CR) = \frac{6.02\text{ mm} - 3.20\text{ mm}}{5\text{ years}} = 0.564\text{ mm/year}$$
     $$\text{Remaining Life } (RL) = \frac{3.20\text{ mm} - 2.50\text{ mm}}{0.564\text{ mm/year}} = 1.24\text{ years}$$
   - Script executes inside an ephemeral Docker container with `--network none` and 512MB RAM cap.
7. **Self-RAG Grounding Critique:**
   - Critique gate assesses draft recommendations against API 570 Section 7 Table 4.
   - Scores: `ISREL = 0.95`, `ISSUP = 1.00`. Verification passes.
8. **Human-in-the-Loop (4-Eye) Checkpoint:**
   - Because calculated remaining life is under 2 years, the Constitutional Policy Layer flags the task as `CRITICAL RISK`.
   - LangGraph execution halts; state freezes; SSE emits `event: checkpoint`.
   - Lead Corrosion Engineer reviews findings in the `ApprovalPanel` modal, modifies replacement deadline to 6 months, enters operator ID `OP-9921-MRPL`, and signs off.
9. **Deliverable Synthesis:**
   - System synthesizes `Inspection_Approval_Note_HC-102-B.docx` complete with corporate header, NDT tables, embedded defect photo, API 570 citations, and SHA-256 digital stamp.
10. **Immutable Audit Persistence:**
    - Appends forward-chained SHA-256 record to PostgreSQL `audit_logs`.
    - Sentinel confirms **0 outbound bytes sent** throughout the entire workflow.

---

## 6. Open WebUI Industrial Gap Analysis & Enhancement Backlog

An evaluation was conducted against Open WebUI to identify essential enterprise capabilities required for continuous-process refinery operations:

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                OPEN WEBUI VS. ABHEDYA AI CAPABILITY MATRIX                        │
└───────────────────────────────────────────────────────────────────────────────────┘

  OPEN WEBUI STANDARD FEATURE           ABHEDYA AI INDUSTRIAL ADAPTATION
  ---------------------------           --------------------------------
  1. Temperature Sliders                ► Fine-Grained Model Generation Controls Modal
  2. Arena Dual Model Chat              ► Dual-Model Arena Comparison View (DeepSeek vs Llama)
  3. Web Speech API Voice               ► Air-Gapped Offline Whisper STT & Piper TTS
  4. Knowledge Base Folders             ► Tagged RAG Collections (#Hydrocracker-SOPs)
  5. Slash Prompts (/)                  ► Industrial SOP Template Shortcut Library (/ut-audit)
  6. Export Chat (.json/.md)            ► Full Audit Transcript Export & Session Restore
  7. Code Interpreter Pyodide           ► Inline Recharts Vibration FFT & Corrosion Degradation
  8. Basic SSO / User Roles             ► Multi-Operator RBAC & Cryptographic Digital Sign-Off
```

### Feature Implementation Status:
1. **Model Generation Control Panel (`ModelConfigModal.tsx`):** Allows engineers to set temperature to `0.0` for strict safety compliance or `0.7` for fault investigation.
2. **Side-by-Side Arena View (`ArenaComparisonView.tsx`):** Enables concurrent comparison between reasoning models (`DeepSeek-R1`) and general models (`Llama-3.3-70B`) on complex pressure vessel calculations.
3. **Tagged Knowledge Collections (`#Collection`):** Scopes semantic vector search directly to plant units (`#Hydrocracker`, `#Boiler-Inspection`).
4. **Slash Command Library (`/`):** Fast macro invocation for standard inspection templates (`/ut-audit`, `/corrosion-rate`, `/oisd-permit-check`).
5. **Interactive Inline Charts:** Dynamic Recharts graphs rendering wall-thickness degradation curves and vibration FFT spectral spikes with threshold overlay lines.
6. **Multi-Operator RBAC & Cryptographic Sign-Off:** Enforces 4-Eye principles for high-risk industrial approvals.

---

## 7. Minute API Contracts & Database Schema

### 7.1 Key REST Endpoints

#### 1. Submit New Task
- **Endpoint:** `POST /api/chat`
- **Request Body:**
  ```json
  {
    "prompt": "Analyze MRPL Hydrocracker NDT wall thickness logs for pipe line HC-102-B.",
    "document_id": "doc_9823471",
    "preferred_models": ["qwen2.5:14b", "qwen2.5-vl:7b"],
    "parameters": {
      "temperature": 0.0,
      "top_p": 0.95
    }
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "task_id": "task_8819234",
    "status": "processing",
    "created_at": "2026-09-09T10:15:00Z"
  }
  ```

#### 2. SSE Agent Trace Stream
- **Endpoint:** `GET /api/tasks/{task_id}/stream`
- **Content-Type:** `text/event-stream`
- **Event Types:** `event: step`, `event: checkpoint`, `event: done`, `event: error`.
- **Keep-Alive:** Comment ping (`: ping\n\n`) every 15 seconds.

#### 3. Submit Human Approval Decision
- **Endpoint:** `POST /api/tasks/{task_id}/approve`
- **Request Body:**
  ```json
  {
    "decision": "approve",
    "edited_recommendation": "Accelerate UT inspection to 6-month intervals; prepare replacement spool.",
    "operator_id": "OP-9921-MRPL",
    "operator_role": "Lead Corrosion Engineer",
    "notes": "Verified against API 570 Section 7 Table 4."
  }
  ```

#### 4. Network Sentinel Telemetry
- **Endpoint:** `GET /api/network/status`
- **Response (200 OK):**
  ```json
  {
    "air_gapped": true,
    "outbound_bytes_sent": 0,
    "active_sockets": 3,
    "blocked_attempts": 0,
    "node_name": "SOVEREIGN-MRPL-ENCLAVE-01",
    "last_checked": "2026-09-09T10:17:00Z"
  }
  ```

---

### 7.2 PostgreSQL Relational DDL Schema

```sql
-- Core Tasks Table
CREATE TABLE tasks (
    id VARCHAR(64) PRIMARY KEY,
    prompt TEXT NOT NULL,
    task_type VARCHAR(50),
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    priority VARCHAR(16) DEFAULT 'normal',
    risk_level VARCHAR(16) DEFAULT 'LOW',
    selected_models JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- LangGraph Execution Steps Table
CREATE TABLE agent_steps (
    id BIGSERIAL PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    node_name VARCHAR(64) NOT NULL,
    tool VARCHAR(64),
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(32) NOT NULL,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Uploaded & Synthesized Documents Table
CREATE TABLE documents (
    id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) REFERENCES tasks(id) ON DELETE SET NULL,
    filename TEXT NOT NULL,
    doc_type VARCHAR(64) NOT NULL, -- 'upload' or 'generated'
    storage_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Human Approvals Table
CREATE TABLE approvals (
    id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    operator_id VARCHAR(64) NOT NULL,
    operator_role VARCHAR(64) NOT NULL,
    decision VARCHAR(32) NOT NULL, -- 'approve', 'edit', 'reject'
    edited_text TEXT,
    notes TEXT,
    signature_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Synthesized Deliverables Table
CREATE TABLE deliverables (
    id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    format VARCHAR(32) NOT NULL, -- 'docx', 'xlsx', 'code'
    file_path TEXT NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Forward-Chained Tamper-Evident Audit Ledger Table
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    sequence_num BIGSERIAL NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    event_payload JSONB NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_task ON audit_logs(task_id);
CREATE INDEX idx_audit_chain ON audit_logs(sequence_num);
```

---

## 8. Six Development Workstreams (No Developer Role Siloing)

To ensure full system ownership and eliminate knowledge silos across the 6-developer team, responsibilities are structured as **technical workstreams**:

1. **Workstream 1: Workbench Platform & User Experience**
   - *Scope:* Next.js 16 AppShell, real-time SSE timeline, Model Router card, RAG source cards, and Approval panel.
   - *DoD:* Zero mock data; live state driven entirely by backend SSE events.
2. **Workstream 2: API Gateway & Agent Orchestration**
   - *Scope:* FastAPI lifecycle, LangGraph compiled StateGraph, and pause/resume checkpoints.
   - *DoD:* Complete task execution traverses all graph nodes; pauses correctly at HITL checkpoint.
3. **Workstream 3: Adaptive Model Routing & Sovereign LLM Runtime**
   - *Scope:* Local Ollama open-weight registry, explainable multi-factor router, and prompt templates.
   - *DoD:* Three distinct task classes route to three distinct models; zero external API calls.
4. **Workstream 4: Multimodal Ingestion & Hybrid Agentic RAG**
   - *Scope:* PaddleOCR tabular parsing, Qwen2.5-VL defect analysis, and Qdrant vector retrieval.
   - *DoD:* Scanned PDF yields structured table; vector search retrieves exact SOP clause with $>0.82$ similarity.
5. **Workstream 5: Secure Sandbox, Verification & Deliverable Synthesis**
   - *Scope:* Ephemeral Docker sandbox runner, Self-RAG critique gate, and `.docx` report writer.
   - *DoD:* Sandboxed code runs isolated with no network access; generated `.docx` matches corporate template.
6. **Workstream 6: Zero-Egress Security & Enclave Infrastructure**
   - *Scope:* Master Docker Compose stack, Linux socket sentinel, and PostgreSQL audit ledger.
   - *DoD:* Stack boots with a single command; automated egress test verifies 0 outbound packets.

---

## 9. 12-Week Master Development Roadmap

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       12-WEEK DEVELOPMENT PHASING                           │
├─────────┬──────────────┬────────────────────────────────────────────────────┤
│ Phase 1 │ Weeks 1–2    │ Foundation, Alignment & Enclave Baseline           │
├─────────┼──────────────┼────────────────────────────────────────────────────┤
│ Phase 2 │ Weeks 3–5    │ Core Sovereign Subsystem Construction              │
├─────────┼──────────────┼────────────────────────────────────────────────────┤
│ Phase 3 │ Weeks 6–8    │ Intelligence & Workflow Integration                │
├─────────┼──────────────┼────────────────────────────────────────────────────┤
│ Phase 4 │ Weeks 9–10   │ Hardening, Security Validation & Resilience        │
├─────────┼──────────────┼────────────────────────────────────────────────────┤
│ Phase 5 │ Weeks 11–12  │ SIH MVP Finalization & Rehearsal                   │
└─────────┴──────────────┴────────────────────────────────────────────────────┘
```

- **Week 1:** Master Docker Compose baseline; Pydantic `WorkbenchState` frozen; Ollama connectivity established.
- **Week 2:** LangGraph StateGraph skeleton; SSE streaming catch-up phase; initial Zero-Egress test harness.
- **Week 3:** Adaptive AI Model Router heuristic; PaddleOCR table extraction pipeline; GPU allocation tuned.
- **Week 4:** Qdrant vector database seeded with synthetic MRPL SOPs; HNSW semantic search with citations.
- **Week 5:** Ephemeral Docker sandbox runner (`--network none`); Constitutional Policy Layer (L0–L4 rules).
- **Week 6:** Self-RAG critique gate; automated evaluation of `ISREL` and `ISSUP`; cyclic revision loop.
- **Week 7:** Human-in-the-Loop checkpoint; deterministic graph interrupt and resume; approval database table.
- **Week 8:** Synthesis of `Inspection_Approval_Note.docx`; SHA-256 forward hash chaining in PostgreSQL.
- **Week 9:** Host `iptables` default-deny egress enforcement; automated physical network disconnect test.
- **Week 10:** Stress testing under simulated OOM and malformed files; PostgreSQL automated backup script.
- **Week 11:** 1-Click Demo Mode launcher; pre-warmed models; 10 consecutive flawless golden path rehearsals.
- **Week 12:** Final documentation freeze; 4K backup demonstration video recorded; technical judge defense mock.

---

## 10. Team Cross-Training & Explanation Mastery Framework

By Week 12, all six developers must be capable of independently defending the system across six mastery levels:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SIX-LEVEL MASTERY BENCHMARKS                          │
├─────────┬──────────────────────────┬────────────────────────────────────────┤
│ Level 1 │ Product & Industrial Why │ Refinery risks, cloud AI prohibitions, │
│         │                          │ and SIH26117 smart automation context. │
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Level 2 │ Architecture Blueprint   │ Draw all 9 layers from memory; explain │
│         │                          │ trust perimeters and data lifecycle.   │
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Level 3 │ Code & Implementation    │ Walk through LangGraph StateGraph,     │
│         │                          │ Ollama loopback, and Qdrant retrieval. │
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Level 4 │ Security & Air-Gap Proof │ Defend iptables rules, socket poller,  │
│         │                          │ Self-RAG critique, and audit chaining. │
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Level 5 │ Operations & Debugging   │ Launch stack from cold boot, diagnose  │
│         │                          │ simulated faults, and execute tests.   │
├─────────┼──────────────────────────┼────────────────────────────────────────┤
│ Level 6 │ Personal Contribution    │ Articulate personal code contributions,│
│         │                          │ trade-offs, and systemic alignment.    │
└─────────┴──────────────────────────┴────────────────────────────────────────┘
```

---

## 11. SIH MVP Definition of Done (DoD)

The ABHEDYA AI workbench is certified as **SIH MVP Complete** only when:
1. **Functional:** Flagship inspection workflow executes end-to-end (scanned PDF $\rightarrow$ OCR $\rightarrow$ VLM $\rightarrow$ Router $\rightarrow$ RAG $\rightarrow$ Sandbox $\rightarrow$ Self-RAG $\rightarrow$ HITL $\rightarrow$ DOCX $\rightarrow$ Audit).
2. **Technical:** 100% open-weight models running locally via Ollama; zero external cloud API keys; Next.js builds with 0 errors.
3. **Security:** Host firewall blocks outbound traffic; Sentinel confirms 0 external bytes sent; Docker sandbox has `--network none`.
4. **Operational:** Entire stack boots cleanly via `docker compose up -d`; automated tests achieve 100% pass rate.
5. **Demonstrable:** 3-minute golden path demo executes reliably from cold boot in under 60 seconds.

---

*This master document serves as the authoritative single source of truth for the ABHEDYA AI engineering team, architectural auditors, and SIH evaluators.*
