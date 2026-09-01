# OnPremisAI — Sovereign AI Workbench for Confidential Industrial Intelligence
## Master Technical Specification, Architectural Blueprint, & Comprehensive Development Roadmap

**Project Name:** OnPremisAI — Sovereign AI Workbench for Confidential Industrial Intelligence  
**Target Organization:** Mangalore Refinery and Petrochemicals Limited (MRPL)  
**Problem Statement ID:** PS ID 26117 (Smart Automation)  
**Document Version:** 3.0.0 (Master Edition)  
**Last Updated:** September 2, 2026  
**Repository Branch:** `tejas`  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Industrial Challenge
Modern continuous-process facilities such as oil refineries (e.g., MRPL), petrochemical complexes, and high-assurance defense manufacturing plants generate massive volumes of highly confidential operational data—ranging from Non-Destructive Testing (NDT) wall-thickness inspection logs to Piping and Instrumentation Diagrams (P&IDs) and Oil Industry Safety Directorate (OISD) compliance permits.

Public cloud AI services (e.g., OpenAI ChatGPT, Anthropic Claude, public SaaS platforms) are **strictly prohibited** in these high-hazard industrial environments due to:
1. **Data Exfiltration Risk:** Leaking proprietary refinery layout, catalyst formulations, or vulnerability logs to external networks.
2. **Regulatory & Compliance Penalties:** Violations of OISD-105, ISO 27001, CMMC Level 3, and national critical infrastructure security directives.
3. **Unchecked AI Execution:** Risk of AI hallucinations generating unverified engineering advice that could lead to catastrophic equipment failure or human injury.

### 1.2 The Sovereign Solution: OnPremisAI
**OnPremisAI** is a verifiably air-gapped, multi-model agentic AI workbench engineered specifically for confidential industrial operations. It operates 100% on-premise without a single outbound network packet, combining local GPU LLM inference with vector search (RAG), multimodal OCR/diagram analysis, sandboxed code execution, and deterministic Human-in-the-Loop (HITL) approval gates.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                     ONPREMISAI AIR-GAPPED INDUSTRIAL ENCLAVE                      │
└───────────────────────────────────────────────────────────────────────────────────┘

  [ OPERATOR CONSOLE ]  ────────► [ FASTAPI AIR-GAP GATEWAY ] ◄───► [ NETWORK SENTINEL ]
    (Next.js 16 UI)                    (Port 8000)                  (0 Outbound Bytes)
           │                                    │
           ▼                                    ▼
  ┌─────────────────┐                ┌──────────────────────┐
  │ STANDALONE      │                │ LANGGRAPH AGENT      │
  │ LANDING PAGE    │                │ ORCHESTRATOR         │
  │ (http://.../)   │                └──────────┬───────────┘
  └────────┬────────┘                           │
           │                                    ▼
           ▼                         ┌──────────────────────┐
  ┌─────────────────┐                │ OLLAMA LOCAL GPU     │
  │ WORKBENCH APP   │                │ (Qwen 2.5 14B /      │
  │ (/workbench)    │                │  Llama 3 8B Enclave) │
  └─────────────────┘                └──────────┬───────────┘
                                                │
                                                ▼
                                     ┌──────────────────────┐
                                     │ CHROMADB / QDRANT    │
                                     │ LOCAL VECTOR ENGINE  │
                                     └──────────────────────┘
```

---

## 2. Current Progress & Built Architecture (Completed Audit)

The repository has reached **Phase 1, Phase 2, and Landing Transformation Completion** on the `tejas` branch. The system includes both a **Standalone Marketing & Architecture Landing Page** and the **Interactive Industrial Workbench Application**.

### 2.1 Complete Architectural Stack

| Layer | Component Technology | Role & Purpose | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16.3.2 (Turbopack) | Server-side rendering & high-performance UI app | ✅ Built & Verified |
| **Styling & Theme** | Tailwind CSS + Custom CSS Variables | Industrial "Black + Orange" design system (`#FF6A00` accent, 0px `rounded-none` geometry) | ✅ Built & Verified |
| **State Management** | Zustand (`useTaskStore.ts`) | Centralized state for tasks, messages, attachments, models, and telemetry | ✅ Built & Verified |
| **SSE Streaming** | EventSource Hook (`useAgentTrace.ts`) | Real-time streaming of LangGraph agent steps (`ocr_extract` → `rag_search` → `recommend` → `human_checkpoint`) | ✅ Built & Verified |
| **Backend API Gateway** | Python FastAPI (`uvicorn`) | REST endpoints, SSE stream provider, network sentinel monitor | ✅ Built & Verified |
| **Agent Orchestration** | LangGraph (`StateGraph`) | Multi-step agent execution graph with conditional routing and Human-in-the-Loop checkpoints | ✅ Built & Verified |
| **Local LLM Engine** | Ollama Engine (`localhost:11434`) | Air-gapped model runner (`Qwen2.5-14B`, `Llama3-8B-Enclave`, `Qwen2.5-VL-7B`, `DeepSeek-Coder-14B`) | ✅ Built & Verified |
| **Vector RAG Store** | ChromaDB & Qdrant Engine | Local vector embeddings (`BGE-M3`) for confidential SOPs and P&ID documents | ✅ Built & Verified |
| **Document Processing** | PaddleOCR & PyMuPDF | Extraction of tabular NDT logs, wall thickness readings, and technical scans | ✅ Built & Verified |
| **Deliverable Writer** | `python-docx` Template Filler | Synthesis of official `.docx` executive inspection reports after operator approval | ✅ Built & Verified |
| **Database Ledger** | PostgreSQL (SQLAlchemy ORM) | Persistent database for audit trails, task logs, operator decisions, and document metadata | ✅ Built & Verified |
| **Air-Gap Monitor** | Network Sentinel (`/proc/net/tcp`) | Continuous kernel socket poller verifying zero outbound network packets | ✅ Built & Verified |

---

### 2.2 UI/UX Industrial Design System

The application strictly implements the **OnPremisAI Black + Orange Industrial Design System**:
- **Background Palette:** Deep Black (`#000000`) and Dark Enclave Zinc (`#121212`, `#0D0D0D`).
- **Border Geometry:** 100% Rectangular `0px` border radius (`rounded-none`). No rounded buttons or soft SaaS cards.
- **Accent Palette:** High-visibility Safety Orange (`#FF6A00`), Amber Warning (`#D97706`), and Dark Zinc Borders (`#242424`).
- **Typography:** High-density Monospace (`font-mono`) for technical data, status badges, timestamps, and model telemetry; clean sans-serif for body reading.
- **Layout Architecture:** 3-Column Air-Gapped Control Hub:
  - **Left Sidebar (`Sidebar.tsx`):** Workspace switcher (`Workbench`, `Documents`, `Audit Trail`, `Network Sentinel`), quick-launch presets, and task history.
  - **Center Workspace (`ChatContainer.tsx` / `Composer.tsx`):** Main agent conversation stream, rich command prompt box, and quick preset launch cards.
  - **Right Inspector Panel (`ContextPanel.tsx` / `ExecutionTimeline.tsx`):** Real-time LangGraph node execution stepper and active document context.

---

### 2.3 Standalone Landing Page vs. Workbench Routes

The application splits its user interface into two distinct, high-impact endpoints:

1. **Standalone Landing Page (`http://localhost:3000/`)**
   - **File:** `frontend/src/app/page.tsx`
   - **Purpose:** Standalone product landing page introducing OnPremisAI to refinery leadership, compliance auditors, and security officers.
   - **Features:** Hero section with air-gap verification badge, live enclave telemetry console preview, core capabilities grid, technical architecture stack breakdown, compliance standards banner (OISD-105, ISO 27001, API 570/510, CMMC Level 3), and primary CTA buttons (`LAUNCH WORKBENCH`).

2. **Interactive Sovereign Workbench (`http://localhost:3000/workbench` & `/chat`)**
   - **Files:** `frontend/src/app/workbench/page.tsx` and `frontend/src/app/chat/page.tsx`
   - **Purpose:** The actual operational interface for engineers to query SOPs, run NDT audits, inspect vibration FFTs, and execute human-in-the-loop approvals.

---

## 3. Open WebUI Feature Gap Analysis & Integrated Industrial Backlog

To ensure OnPremisAI surpasses generic open-source LLM interfaces, an audit was conducted against **Open WebUI**. The following **8 major feature areas** have been incorporated into our industrial enhancement backlog:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                OPEN WEBUI VS. ONPREMISAI FEATURE MATRIX                           │
└───────────────────────────────────────────────────────────────────────────────────┘

  OPEN WEBUI STANDARD FEATURE           ONPREMISAI INDUSTRIAL ADAPTATION
  ---------------------------           --------------------------------
  1. Temperature Sliders                ► Fine-Grained Model Generation Controls Modal
  2. Arena Dual Model Chat              ► Dual-Model Arena Comparison View (DeepSeek vs Llama)
  3. Web Speech API Voice               ► Air-Gapped Offline Whisper STT & Piper TTS
  4. Knowledge Base Folders             ► Tagged RAG Collections (#Hydrocracker-SOPs)
  5. Slash Prompts (/)                  ► Industrial SOP Template Shortcut Library
  6. Export Chat (.json/.md)            ► Full Audit Transcript Export & Session Restore
  7. Code Interpreter Pyodide           ► Inline Recharts Vibration FFT & Corrosion Degradation
  8. Basic SSO / User Roles             ► Multi-Operator RBAC & Cryptographic Digital Sign-Off
```

### Detailed Feature Specifications:

1. **Fine-Grained Model Generation Control Panel (`ModelConfigModal.tsx`)**
   - *Utility:* Allows refinery engineers to set Temperature to `0.0` for strict safety compliance audits or `0.7` for fault investigation.
   - *Controls:* Sliders for `Temperature`, `Top-P`, `Frequency Penalty`, `Max Tokens`, and `Custom System Prompt`.

2. **Multi-Model Side-by-Side Arena View**
   - *Utility:* Enables concurrent comparison between reasoning models (`DeepSeek-R1`) and general engineering models (`Llama-3.3-70B`) on complex heat exchanger or pressure vessel calculations.
   - *Implementation:* 2-column grid in `ChatContainer.tsx` driven by parallel SSE streams in `useAgentTrace.ts`.

3. **Air-Gapped Offline Voice Dictation (STT / TTS)**
   - *Utility:* Field operators wearing heavy protective gear (PPE/gloves) can dictate inspection findings directly into the workbench via offline `Whisper.cpp` STT.

4. **Tagged RAG Knowledge Base Collections (`#Collection`)**
   - *Utility:* Organize uploaded manuals into plant-specific tags (`#Hydrocracker-SOPs`, `#Boiler-Inspection-2026`, `#Piping-API570`). Allows filtering RAG vector search to specific tags using `@` or `#` in `Composer.tsx`.

5. **Slash Commands (`/`) & Industrial SOP Template Library**
   - *Utility:* Fast macro invocation for standard inspection templates (`/ut-audit`, `/corrosion-rate`, `/oisd-permit-check`).

6. **Full Session Transcript Export & Restore**
   - *Utility:* Export complete unformatted chat transcripts in Markdown (`.md`) or JSON (`.json`) formats for offline compliance archiving.

7. **Inline Interactive Charts & Plot Overlays**
   - *Utility:* Render dynamic Recharts / Chart.js graphs inside `MessageBubble.tsx` for wall-thickness degradation curves and vibration FFT spectral spikes with threshold overlay lines.

8. **Multi-Operator Role-Based Access Control (RBAC) & Digital Sign-Off**
   - *Utility:* Enforces 4-Eye Principle for high-risk industrial approvals (`Field Inspector` submits → `Lead Engineer` verifies → `Safety Officer` signs off with SHA-256 digital stamp).

---

## 4. Comprehensive Future Roadmap & Phase Breakdown

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPMENT ROADMAP PHASES                              │
└───────────────────────────────────────────────────────────────────────────────────┘

  PHASE 1 & PHASE 2 (COMPLETED ✅)
  ├── ✅ 3-Column AppShell Layout (Header, Sidebar, ChatContainer, ContextPanel)
  ├── ✅ Zero-Egress Air-Gap Telemetry Engine & Network Sentinel
  ├── ✅ DocumentRepository, AuditTrailView, NetworkSentinelView
  ├── ✅ Black + Orange Industrial Design System (0px rounded-none geometry)
  ├── ✅ Standalone Landing Page (http://localhost:3000/) & Workbench Route (/workbench)
  └── ✅ Verified Next.js 16 Production Build & Push to 'tejas' Branch

  PHASE 3 (NEXT SPRINT — USER INTERACTION & KNOWLEDGE)
  ├── 🔲 Feature 1: Fine-Grained Model Generation Controls Panel (Temp, Top-P, System Prompt)
  ├── 🔲 Feature 4: Tagged RAG Knowledge Base Collections (#Hydrocracker-SOPs)
  ├── 🔲 Feature 5: Slash Commands (/) & Industrial SOP Prompt Templates
  └── 🔲 Feature 6: Full Session Transcript Export (.md / .json)

  PHASE 4 (FUTURE SPRINT — ADVANCED INDUSTRIAL CAPABILITIES)
  ├── 🔲 Feature 2: Multi-Model Side-by-Side Arena Comparison View
  ├── 🔲 Feature 3: Air-Gapped STT / TTS Voice Dictation (Whisper.cpp)
  ├── 🔲 Feature 7: Inline Interactive Charts & Vibration FFT Overlays (Recharts)
  └── 🔲 Feature 8: Multi-Operator RBAC & Cryptographic Digital Signatures
```

---

## 5. Team Work Breakdown Structure (5-Developer Team)

| Developer Role | Core Responsibilities & Focus Areas | Completed Deliverables | Upcoming Roadmap Tasks |
| :--- | :--- | :--- | :--- |
| **Dev 1 (Frontend Lead — Tejas)** | Next.js UI, Tailwind Styling, Zustand Store, Component Architecture, Landing Page | AppShell layout, Black + Orange design refactor, Standalone Landing Page, Workbench routing, Next.js build validation | Build `ModelConfigModal.tsx`, `/` Slash Command menu, and Session Export (`.md`/`.json`) |
| **Dev 2 (Backend & DB Lead)** | FastAPI Gateway, SSE Engine, PostgreSQL DDL/ORM, Network Sentinel | REST API routers (`chat`, `upload`, `tasks`, `network`), SSE streaming engine, SQLAlchemy schema | Add `collection_ids` filtering to RAG API, `prompt_templates` DDL, custom model temperature parameters |
| **Dev 3 (Agent Orchestration Lead)** | LangGraph StateGraph, Dynamic Router, Human Checkpoint | LangGraph execution graph, dynamic task classification, approval node logic | Enable parallel dual-graph execution for Arena view and digital signature validation |
| **Dev 4 (AI/ML & RAG Lead)** | PaddleOCR, Qwen2-VL, ChromaDB/Qdrant Vector Indexing | Document upload parser, vector embedding pipeline, RAG semantic search | Tagged vector collection indexing (`#Hydrocracker-SOPs`) and multi-modal P&ID extraction |
| **Dev 5 (Tools & DocGen Lead)** | Prompt Templates, `python-docx` Generator, Sandbox Execution | `docx_writer.py` report generator, `sandbox.py` subprocess runner | Author industrial prompt templates, format chart payload JSON schemas for frontend Recharts rendering |

---

## 6. Complete Directory Structure

```text
Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/
├── docker-compose.yml
├── README.md
├── project_detailed.md                  # <-- MASTER TECHNICAL SPECIFICATION & ROADMAP
├── .agent/
│   └── project-context.md               # AGY & AI assistant context file
├── docs/
│   ├── 5_member_development_plan.md
│   ├── MRPL_Developer_Implementation_Plan.md
│   ├── MRPL_Sovereign_AI_Workbench_Architecture.md
│   ├── feature_backlog_and_roadmap.md
│   ├── api.md
│   ├── architecture.md
│   ├── changelog.md
│   └── configuration.md
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py                      # FastAPI App Gateway
│       ├── api/
│       │   ├── chat.py                  # POST /api/chat
│       │   ├── upload.py                # POST /api/upload
│       │   ├── tasks.py                 # GET /api/tasks/{id}/stream, /approve, /download
│       │   └── network.py               # GET /api/network/status
│       ├── agent/
│       │   ├── state.py                 # WorkbenchState Pydantic model
│       │   ├── graph.py                 # LangGraph StateGraph
│       │   ├── router.py                # 2-stage dynamic classifier
│       │   └── nodes/
│       │       ├── ocr.py
│       │       ├── rag_search.py
│       │       ├── recommend.py
│       │       └── generate_docx.py
│       ├── rag/
│       │   ├── indexer.py               # Document chunking & embedding
│       │   └── retriever.py             # Vector similarity search
│       ├── tools/
│       │   ├── ocr_tool.py              # PaddleOCR wrapper
│       │   ├── docx_writer.py           # python-docx template builder
│       │   └── sandbox.py               # Sandboxed execution runner
│       └── db/
│           ├── models.py                # SQLAlchemy ORM models
│           └── session.py               # PostgreSQL connection manager
└── frontend/
    ├── package.json
    ├── next.config.ts
    └── src/
        ├── app/
        │   ├── layout.tsx               # Root HTML layout
        │   ├── globals.css              # Custom CSS variables & tokens
        │   ├── page.tsx                 # STANDALONE INDUSTRIAL LANDING PAGE (http://localhost:3000/)
        │   ├── workbench/
        │   │   └── page.tsx             # INTERACTIVE WORKBENCH APP (http://localhost:3000/workbench)
        │   └── chat/
        │       └── page.tsx             # CHAT ROUTE WORKBENCH APP (http://localhost:3000/chat)
        ├── components/
        │   ├── layout/
        │   │   ├── AppShell.tsx         # 3-Column main layout container
        │   │   ├── Header.tsx           # Sovereign top navigation & status bar
        │   │   ├── Sidebar.tsx          # Workspace & task navigation
        │   │   └── ContextPanel.tsx     # Right inspector panel
        │   ├── chat/
        │   │   ├── ChatContainer.tsx    # Message list & quick preset launch cards
        │   │   ├── MessageBubble.tsx    # High-contrast message cards
        │   │   ├── Composer.tsx         # Command console input box
        │   │   └── DownloadResult.tsx   # Verified report export card
        │   ├── agent/
        │   │   └── ExecutionTimeline.tsx# Real-time SSE node execution stepper
        │   ├── approval/
        │   │   └── ApprovalCheckpoint.tsx# Human-in-the-Loop approval modal
        │   ├── knowledge/
        │   │   └── DocumentRepository.tsx# RAG document management grid
        │   ├── audit/
        │   │   └── AuditTrailView.tsx   # Compliance log table
        │   ├── security/
        │   │   └── NetworkSentinelView.tsx# Zero-egress telemetry dashboard
        │   ├── network/
        │   │   └── NetworkSentinel.tsx  # Network status summary card
        │   └── ui/
        │       ├── Button.tsx           # Sharp 0px rectangular button
        │       ├── Badge.tsx            # Industrial status badge
        │       ├── Card.tsx             # Black + Orange card container
        │       └── Modal.tsx            # Control modal overlay
        ├── hooks/
        │   ├── useAgentTrace.ts         # SSE streaming connection hook
        │   └── useNetworkStatus.ts      # Air-gap network poller
        ├── lib/
        │   ├── api.ts                   # Axios / fetch wrapper
        │   ├── sse.ts                   # SSE stream consumer
        │   └── utils.ts                 # Helper utilities
        └── store/
            └── useTaskStore.ts          # Central Zustand state store
```

---

## 7. Minute API Contracts & Database Schema

### 7.1 Key REST API Endpoints

#### 1. Submit New Task / Chat Prompt
- **Endpoint:** `POST /api/chat`
- **Request Body:**
  ```json
  {
    "prompt": "Analyze MRPL Hydrocracker NDT wall thickness logs for pipe line HC-102-B.",
    "model": "qwen2.5-14b-industrial",
    "document_id": "doc_9823471",
    "parameters": {
      "temperature": 0.1,
      "top_p": 0.95
    }
  }
  ```
- **Response:**
  ```json
  {
    "task_id": "task_8819234",
    "status": "processing",
    "created_at": "2026-09-02T01:25:00Z"
  }
  ```

#### 2. SSE Agent Trace Stream
- **Endpoint:** `GET /api/tasks/{task_id}/stream`
- **Stream Format:** `text/event-stream`
- **Event Types:**
  - `step`: Emits current node execution (`node_name`, `status`, `logs`, `output`).
  - `approval_required`: Emits when Human-in-the-Loop approval checkpoint is reached.
  - `completed`: Emits final recommendation and output deliverable download URL.

#### 3. Submit Human Approval Decision
- **Endpoint:** `POST /api/tasks/{task_id}/approve`
- **Request Body:**
  ```json
  {
    "decision": "approve",
    "edited_recommendation": null,
    "operator_id": "OP-9921-MRPL",
    "operator_role": "Lead Corrosion Engineer"
  }
  ```

#### 4. Air-Gap Network Sentinel Telemetry
- **Endpoint:** `GET /api/network/status`
- **Response:**
  ```json
  {
    "air_gapped": true,
    "outbound_bytes_sent": 0,
    "active_sockets": 3,
    "node_name": "SOVEREIGN-MRPL-NODE-01",
    "last_checked": "2026-09-02T01:25:05Z"
  }
  ```

---

### 7.2 PostgreSQL Database DDL Schema

```sql
-- Core Tasks Table
CREATE TABLE tasks (
    id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    model_used VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'processing',
    output_format VARCHAR(16),
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LangGraph Agent Steps Table
CREATE TABLE agent_steps (
    id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) REFERENCES tasks(id) ON DELETE CASCADE,
    step_name VARCHAR(64) NOT NULL,
    node_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    logs TEXT,
    execution_time_ms INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Uploaded Documents Metadata Table
CREATE TABLE documents (
    id VARCHAR(64) PRIMARY KEY,
    filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(64) NOT NULL,
    storage_path TEXT NOT NULL,
    vector_collection VARCHAR(64) DEFAULT 'default',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Compliance Ledger Table
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) REFERENCES tasks(id),
    operator_id VARCHAR(64) NOT NULL,
    operator_role VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    decision VARCHAR(32),
    sha256_hash VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 8. Verification Protocols & Definition of Done

To ensure maximum software quality and compliance with industrial safety mandates, all updates must satisfy the following **Definition of Done (DoD)**:

1. **Zero Outbound Traffic Verification:** Network Sentinel must confirm `0 BYTES` external data egress during end-to-end task execution.
2. **Build Integrity:** `npm run build` inside `frontend/` must compile cleanly via Next.js Turbopack with 0 TypeScript or lint errors.
3. **Design System Adherence:** 100% compliance with Black + Orange aesthetics (`rounded-none`, `#FF6A00` accents, `font-mono` data displays). No legacy rounded corners or generic colors.
4. **Human Gate Enforcement:** No final report `.docx` file can be rendered or downloaded without explicit operator signature via `ApprovalCheckpoint`.
5. **Git Hygiene:** All code must be cleanly committed and pushed to remote branch `tejas`.

---

*This master document serves as the single source of truth for the OnPremisAI Sovereign AI Workbench development team, architectural auditors, and project managers.*
