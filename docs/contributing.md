# Contribution Guidelines & Team Split

This project follows a strict 5-member division of responsibilities (excluding deployment) for rapid, conflict-free development during the hackathon window.

---

## 1. 5-Developer Role Split

| Role | Primary Responsibilities | Key Deliverables |
| :--- | :--- | :--- |
| **Dev 1: Frontend Lead** | Next.js UI, Tailwind styling, Zustand store, SSE integration | `ChatWindow`, `AgentTrace`, `NetworkSentinel`, `ApprovalCheckpoint` |
| **Dev 2: Backend & DB Lead** | FastAPI endpoints, PostgreSQL schema, SSE streaming engine | `main.py`, `api/chat.py`, `api/tasks.py`, `db/models.py` |
| **Dev 3: Agent Orchestration Lead** | LangGraph StateGraph, 2-stage dynamic router, human checkpoint | `agent/graph.py`, `agent/router.py`, `agent/state.py` |
| **Dev 4: AI/ML Multimodal & RAG Lead** | PaddleOCR pipeline, Qwen2-VL integration, Qdrant indexer & retriever | `ocr_tool.py`, `indexer.py`, `retriever.py`, `models/embeddings.py` |
| **Dev 5: AI Language, Tools & DocGen Lead** | Structured JSON prompts, python-docx generator, sandboxed code executor | `extract_findings.py`, `recommend.py`, `docx_writer.py`, `sandbox.py` |

---

## 2. Pull Request & Commit Rules

1. Branch naming: `feat/<role>-<feature>` or `fix/<role>-<issue>`
2. All commits must have descriptive messages explaining changes.
3. No PR should introduce external cloud API dependencies (e.g. OpenAI, Anthropic, HuggingFace Hub runtime downloads).
