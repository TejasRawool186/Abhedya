# ABHEDYA AI — Sovereign AI Workbench for Confidential Industrial Intelligence
> **SIH Problem Statement:** SIH26117 | **Theme:** Smart Automation | **Category:** Software  
> **Team:** Quantum Compilers | **Target Facility:** Mangalore Refinery and Petrochemicals Limited (MRPL)  
> **Core Product Promise:** *Intelligence that stays inside your walls.*

---

## 🛡️ Executive Summary

**ABHEDYA AI** (Sanskrit for *invulnerable*, *impenetrable*, and *unbreakable*) is a verifiably air-gapped, multi-model agentic AI workbench engineered for continuous-process industrial facilities—such as petroleum refineries, petrochemical complexes, and high-assurance defense plants.

Modern industrial facilities generate massive volumes of highly confidential operational data: scanned ultrasonic wall-thickness Non-Destructive Testing (NDT) logs, Piping and Instrumentation Diagrams (P&IDs), and Oil Industry Safety Directorate (OISD) compliance permits. Public cloud AI platforms (OpenAI ChatGPT, Anthropic Claude, cloud SaaS) are **strictly prohibited** in these high-hazard enclaves due to:
1. **Critical Infrastructure Security Risks:** Leaking plant layouts, process vessel geometries, or vulnerability logs.
2. **Proprietary Process Theft:** Exposing proprietary crude blend recipes, catalyst formulations, and operational envelopes.
3. **Catastrophic Hallucination:** Autonomous execution of unverified engineering advice in process units risking explosions or loss of life.

ABHEDYA AI eliminates these risks by operating **100% on-premise without a single outbound network packet**, combining local GPU-accelerated open-weight models (`Qwen2.5`, `Llama3`, `DeepSeek`), multimodal vision/OCR, hybrid vector retrieval, network-denied code execution sandboxes, inline Self-RAG verification, and mandatory 4-Eye human approval checkpoints.

---

## 🏛️ The 9-Layer Sovereign Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ABHEDYA AI WORKBENCH                                    │
│       3-Column Industrial Interface · Black + Safety Orange · Zero-Egress Sentinel      │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Localhost REST & SSE
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                     FASTAPI GATEWAY                                     │
│                     Request Validation · Multipart Ingestion · SSE Queue                │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Kernel Socket Audit
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  ZERO-EGRESS SENTINEL                                   │
│            Host iptables Default-Deny · /proc/net/tcp Poller · 0 Egress Bytes           │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Validated Request
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                ADAPTIVE AI MODEL ROUTER                                 │
│        Explainable Task Heuristic · Modality · VRAM Headroom · Latency Targets          │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Policy Enforcement
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               CONSTITUTIONAL POLICY LAYER                               │
│               Tiered Governance (L0–L4) · RBAC · Context Bounds · Risk Directives       │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Execution State
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                LANGGRAPH ORCHESTRATOR                                   │
│         Compiled StateGraph: Ingest ➔ Route ➔ Retrieve ➔ Plan ➔ Sandbox ➔ Critique      │
└───────────────────────┬─────────────────────────────────────────┬───────────────────────┘
                        │                                         │
                        ▼                                         ▼
┌───────────────────────────────────────────────┐ ┌───────────────────────────────────────┐
│           MULTIMODAL & HYBRID RAG             │ │          SECURE TOOL SANDBOX          │
│ • PaddleOCR (Tabular NDT Log Parsing)         │ │ • Ephemeral Docker Runner             │
│ • Qwen2.5-VL (Diagram & Corrosion Inspection) │ │ • --network none (Complete Air-Gap)   │
│ • ColPali (Vision-Native Page Retrieval)      │ │ • 512MB RAM Cap · 10s Execution Limit │
│ • Qdrant HNSW Vector Search (BGE-M3)          │ │ • Python Math & Corrosion Rate Script │
│ • GraphRAG (Topological Asset Relations)      │ │ • Openpyxl Spreadsheet Analysis       │
└───────────────────────┬───────────────────────┘ └───────────────────┬───────────────────┘
                        │                                             │
                        └───────────────────────┬─────────────────────┘
                                                │ Raw Output & Evidence
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SELF-RAG CRITIQUE GATE                                  │
│              Retrieval Relevance (ISREL) · Claim Support (ISSUP) · Revision Loop        │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Evaluated Claim
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                HUMAN-IN-THE-LOOP (HITL)                                 │
│           Deterministic State Pause · 4-Eye Operator Review · Cryptographic Sign-Off    │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ Authorized Artifact
                                            ▼
┌───────────────────────────────────────────┴─────────────────────────────────────────────┐
│                                                                                         │
│                     ▼                                                   ▼               │
│        ┌─────────────────────────┐                         ┌─────────────────────────┐  │
│        │  DELIVERABLE SYNTHESIS  │                         │ IMMUTABLE AUDIT LEDGER  │  │
│        │  Official .docx / .xlsx │                         │ PostgreSQL SHA-256      │  │
│        │  Executive Inspection   │                         │ Forward Chained Hashes  │  │
│        │  Approval Notes         │                         │ Non-Repudiable Log      │  │
│        └─────────────────────────┘                         └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Flagship Industrial Workflow (Golden Path)

The flagship demonstration showcases a continuous inspection-to-approval workflow for **MRPL Hydrocracker Unit line HC-102-B**:

1. **Intake:** Operator uploads scanned physical ultrasonic NDT thickness logs and a pipe corrosion macro-photograph.
2. **Multimodal Ingestion:** **PaddleOCR** extracts tabular thickness columns (`Nominal: 6.02mm`, `Actual: 3.20mm`); **Qwen2.5-VL** classifies severe pitting corrosion adjacent to weld HAZ.
3. **Adaptive Routing:** Router evaluates task modality and complexity, selecting `Qwen2.5-VL` (Vision) and `Qwen2.5-14B` (Reasoning).
4. **Sovereign RAG:** Queries local **Qdrant** vector store, retrieving exact clauses from synthetic MRPL In-Service Piping Inspection Manual (API 570 Section 7).
5. **Sandboxed Math Execution:** Spawns an isolated Docker container with `--network none`; executes Python code calculating corrosion rate ($CR = 0.56\text{ mm/yr}$) and remaining service life ($RL = 1.25\text{ yrs}$).
6. **Self-RAG Critique:** Automated critique gate verifies claim support against retrieved standard (`ISREL: 0.95`, `ISSUP: 1.00`).
7. **Human-in-the-Loop Checkpoint:** State machine halts deterministically. Lead Corrosion Engineer reviews evidence, edits replacement deadline to 6 months, and enters digital signature.
8. **Deliverable Synthesis:** Generates standardized `Inspection_Approval_Note.docx` featuring corporate formatting, embedded defect photo, citations, and SHA-256 verification stamp.
9. **Tamper-Evident Audit:** Appends cryptographic SHA-256 chained entry into PostgreSQL `audit_logs`.
10. **Zero-Egress Proof:** Network Sentinel confirms **0 bytes outbound traffic** throughout the entire multi-model workflow.

---

## 🚀 Quick Start (Local Enclave Setup)

### 1. Prerequisites
- Linux (Ubuntu 22.04/24.04), Windows 11 with WSL2, or macOS.
- Docker Engine 25.0+ with Docker Compose v2.20+.
- Node.js v20.x+ & Python 3.11+.
- Local Ollama daemon running on port `11434`.
- NVIDIA GPU recommended (RTX 4080 / 4090 / 3090).

### 2. Pull Sovereign Open-Weight Models
```bash
# Pull essential local open-weight models
ollama pull qwen2.5:7b
ollama pull qwen2.5:14b
ollama pull qwen2.5-coder:7b
ollama pull qwen2.5-vl:7b
```

### 3. Launch Full Multi-Container Enclave
```bash
# Clone repository
git clone https://github.com/TejasRawool186/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence.git
cd Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence

# Boot frontend, backend, PostgreSQL, and Qdrant
docker compose up -d

# Seed Qdrant vector database with synthetic MRPL SOPs
docker compose exec backend python scripts/seed_sops.py
```

### 4. Access the Workbench
- **Operational Industrial Workbench:** `http://localhost:3000/workbench`
- **Product Landing Page:** `http://localhost:3000/`
- **FastAPI OpenAPI Interactive Docs:** `http://localhost:8000/docs`

---

## 📁 Repository Structure

```text
Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/
├── docker-compose.yml                        # Turnkey multi-container enclave deployment
├── README.md                                 # Master repository overview (You are here)
├── new_plan.md                               # Authoritative master architectural blueprint
│
├── docs/                                     # 16-Directory Canonical Documentation Suite
│   ├── README.md                             # Master documentation hub & reading paths
│   ├── 01-overview/                          # Product charter & MRPL refinery operational context
│   ├── 02-problem-statement/                 # SIH26117 breakdown & competitive matrix (Open WebUI/Dify)
│   ├── 03-requirements/                      # Functional (FR-01-12) & Non-Functional SLAs
│   ├── 04-architecture/                      # 9-Layer architecture, Adaptive Router, Policy, Sentinel
│   ├── 05-system-design/                     # LangGraph StateGraph, Docker sandbox, audit ledger
│   ├── 06-data/                              # PostgreSQL DDL schema & corpus management
│   ├── 07-ai-ml/                             # Model registry, multimodal pipeline, hybrid RAG, Self-RAG
│   ├── 08-security/                          # STRIDE threat model & technical security controls
│   ├── 09-apis/                              # FastAPI REST API reference & SSE stream specifications
│   ├── 10-development/                       # Local developer setup & coding standards
│   ├── 11-testing/                           # Multi-tier testing strategy & air-gap validation tests
│   ├── 12-deployment/                        # Compose deployment & air-gap sneakernet packaging
│   ├── 13-sih/                               # Flagship demo script, contingency plan & judge FAQ
│   ├── 14-roadmap/                           # 12-Week master roadmap & 6 workstream definitions
│   ├── 15-team-knowledge/                    # Cross-training curriculum (Levels 1–6) & rotation matrix
│   ├── 16-decisions/                         # Canonical Architecture Decision Records (ADR-001 to 008)
│   ├── dev/                                  # Individual developer engineering logs
│   └── archive/                              # Preserved historical & superseded documents
│
├── backend/                                  # FastAPI & LangGraph Application Service
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py                           # Application gateway entrypoint
│   │   ├── api/                              # REST endpoints (/chat, /upload, /tasks, /network)
│   │   ├── agent/                            # LangGraph StateGraph, router & execution nodes
│   │   ├── core/                             # Local Ollama client, config, SSE manager
│   │   ├── rag/                              # Qdrant retriever & semantic indexing
│   │   ├── tools/                            # Ephemeral Docker sandbox & docx_writer
│   │   ├── network_sentinel/                 # Linux /proc/net/tcp socket monitor daemon
│   │   └── db/                               # SQLAlchemy ORM models & session management
│   └── tests/                                # Automated unit, integration & security test suites
│
├── frontend/                                 # Next.js 16 (Turbopack) Industrial Control Console
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts                    # Industrial Black + Safety Orange theme tokens
│   └── src/
│       ├── app/                              # App Router pages (/workbench, /chat, /)
│       ├── components/                       # AppShell, ChatContainer, Timeline, Approval, Sentinel
│       ├── store/                            # Zustand global application state store
│       └── lib/                              # API client & SSE event stream consumer
│
├── data/                                     # Persistent local storage
│   ├── sample_sops/                          # Synthetic MRPL inspection & safety standards
│   ├── sample_scans/                         # Scanned ultrasonic wall thickness logs
│   └── deliverables/                         # Synthesized .docx executive inspection reports
│
└── scripts/                                  # Setup & Verification Tools
    ├── pull_models.sh                        # Offline model weight downloader
    ├── seed_sops.py                          # Ingests synthetic SOPs into Qdrant
    ├── enforce_airgap.sh                     # Host iptables default-deny configuration
    └── verify_zero_egress.sh                 # Automated socket audit verification harness
```

---

## 🗺️ 12-Week Roadmap & 6 Technical Workstreams

The project is executed across **five phases** and **six technical workstreams** (no developer role siloing):
- **Workstream 1 (Platform & UI/UX):** Next.js 16 AppShell, real-time SSE timeline, Model Router card, and Approval panel.
- **Workstream 2 (Gateway & Orchestration):** FastAPI lifecycle, LangGraph compiled StateGraph, and pause/resume checkpoints.
- **Workstream 3 (Models & Adaptive Router):** Ollama open-weight registry, explainable multi-factor router, and prompt templates.
- **Workstream 4 (Multimodal & Hybrid RAG):** PaddleOCR table parsing, Qwen2.5-VL defect inspection, and Qdrant vector retrieval.
- **Workstream 5 (Sandbox, Verification & DocGen):** Ephemeral Docker sandbox runner, Self-RAG critique gate, and `.docx` writer.
- **Workstream 6 (Zero-Egress Security & Infra):** Master Docker Compose stack, Linux socket sentinel, and PostgreSQL audit ledger.

Full weekly tasks, dependencies, and exit criteria are detailed in [`docs/14-roadmap/12-week-development-plan.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/14-roadmap/12-week-development-plan.md).

---

## 🔒 Security & Air-Gap Compliance Verification

To verify that the workbench operates under strict zero-egress conditions:
```bash
# Execute automated socket audit & sandbox isolation test
bash scripts/verify_zero_egress.sh
```
The test inspects kernel network tables and verifies that **zero external packets** are transmitted during active inference.

---

## 👥 Team: Quantum Compilers
Built with pride for the **Smart India Hackathon (SIH 2026)**.  
*Intelligence that stays inside your walls.*
