# Development Guide

This document outlines the local developer workflow, project layout, and coding standards.

---

## 1. Repository Directory Structure

```text
mrpl-ai-workbench/
├── docker-compose.yml
├── .env.example
├── scripts/
│   ├── pull_models.sh          # ollama pull for every model
│   └── seed_rag.py             # loads sample_sops/ into Qdrant
├── data/
│   ├── sample_sops/            # synthetic SOPs (.md / .txt)
│   └── sample_scans/           # 2-3 rehearsed demo scans
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py             # FastAPI entrypoint
│       ├── api/                # API router modules
│       ├── agent/              # LangGraph graph, state, and nodes
│       ├── models/             # Ollama and embedding connectors
│       ├── rag/                # Indexer and retriever
│       ├── tools/              # OCR, docx-writer, sandbox tools
│       ├── db/                 # SQLAlchemy models & sessions
│       └── network_sentinel/   # /proc/net/tcp monitor
├── sandbox-runner/
│   └── Dockerfile              # Zero-network code sandbox
└── frontend/
    ├── package.json
    └── app/
        ├── page.tsx            # Main application UI
        ├── components/         # UI subcomponents
        ├── lib/api.ts          # API consumer
        └── store/              # Zustand state store
```

---

## 2. Running Services Locally for Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

---

## 3. Coding Guidelines & Standards

- **Python (Backend):**
  - Follow PEP 8 with type annotations (`typing`, Pydantic v2).
  - All agent nodes must emit a step event using `emit_step(task_id, node_name, output)` to persist to `agent_steps` and push to SSE.
  - Never make outbound HTTP/HTTPS requests in any tool or node; use local clients (`http://ollama:11434`, `http://qdrant:6333`).
- **TypeScript / React (Frontend):**
  - Strict type checking enabled in `tsconfig.json`.
  - Use Zustand for shared task and sentinel states.
  - Handle stream reconnection gracefully in `AgentTrace.tsx`.

---

## 4. Git Branching Strategy

- `main`: Stable demo-ready branch.
- `feat/<role>-<feature-name>`: Feature branches based on team split (e.g., `feat/backend-router`, `feat/frontend-trace`, `feat/aiml-ocr`).
- Merge via Pull Request with code review by at least one teammate.
