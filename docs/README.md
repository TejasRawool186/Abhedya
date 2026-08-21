# Sovereign On-Premise Agentic AI Workbench

**PS ID 26117 · Smart Automation · Mangalore Refinery and Petrochemicals Limited (MRPL)**

The **Sovereign AI Workbench** is a fully air-gapped, on-premise, multimodal agentic AI platform designed for highly confidential industrial operations (e.g., refinery inspection reports, confidential P&IDs, financial data, and proprietary engineering calculations). It guarantees **verifiably zero outbound network calls** while dynamically routing tasks across specialized open-weight models, executing sandboxed tools, and producing auditable industrial deliverables (.docx / .xlsx).

---

## 📑 Documentation Index

| Document | Purpose |
| :--- | :--- |
| [Getting Started](getting-started.md) | Single-node Docker Compose setup, model pulling, and seeding RAG |
| [Architecture](architecture.md) | 5-layer system design, model router, and LangGraph agent workflow |
| [Development](development.md) | Local development guidelines, team ownership, and branch workflow |
| [Configuration](configuration.md) | Environment variables, model configs, and network parameters |
| [API Contracts](api.md) | REST and Server-Sent Events (SSE) endpoints specification |
| [Database Schema](database.md) | PostgreSQL DDL, ORM entities, and Qdrant vector store structure |
| [Deployment](deployment.md) | Docker Compose orchestration, network isolation, and sandbox setup |
| [Testing & DoD](testing.md) | Definition of Done, golden-path test scans, and cable-pull offline test |
| [Contributing](contributing.md) | 6-person team responsibilities, PR standards, and commit conventions |
| [Troubleshooting](troubleshooting.md) | Hardware fallbacks (low VRAM/CPU-only), OCR edge cases, and recovery |
| [Security & Sovereignty](security.md) | Structural air-gapping, Docker `internal: true`, Network Sentinel, and iptables |
| [Changelog](changelog.md) | MVP release notes and milestone tracker |

---

## 🚀 Core Technology Stack

- **Frontend:** Next.js (React, Tailwind CSS, Zustand)
- **API Gateway:** Python (FastAPI, Uvicorn, Async SSE)
- **Agent Orchestration:** LangGraph (StateGraph), Pydantic
- **Local Inference:** Ollama (`Qwen2.5-7B-Instruct`, `Qwen2.5-Coder-7B`, `Qwen2-VL-7B`)
- **Document OCR & Vision:** PaddleOCR, Tesseract, Qwen2-VL
- **Vector Search & RAG:** Qdrant Vector DB, `bge-small-en` (local embeddings)
- **Relational Storage:** PostgreSQL 16 (SQLAlchemy / raw DDL)
- **Document Generation:** `python-docx`, `openpyxl`
- **Sovereignty & Isolation:** Docker Compose (`internal: true`), Linux `iptables`/`ufw`, Network Sentinel (`/proc/net/tcp` monitoring)

---

## 👥 Team Split (6 Developers)
- **Frontend Lead:** Next.js UI, Live Trace panel, Sentinel widget, upload/download UX (Tejas)
- **Backend / Orchestration Lead:** FastAPI gateway, LangGraph state machine, dynamic routing
- **AI/ML (Language):** Prompt engineering, JSON reliability, coding agent & sandbox integration
- **AI/ML (Multimodal & RAG):** OCR pipeline, Qwen2-VL integration, Qdrant indexer & retriever
- **Infra & Sovereignty:** Docker Compose lockdown, Network Sentinel daemon, GPU/VRAM setup
- **Docs & Demo Lead:** python-docx templating, test scan corpus, demo choreography
