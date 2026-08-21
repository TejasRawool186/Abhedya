# PS ID 26117 · MRPL · Smart Automation
# Sovereign AI Workbench
## Developer Implementation Plan

*Repo layout, API contracts, DB schema, agent-graph spec, prompts, and dev tickets for the MVP build*

| Scope | Hackathon MVP — see Section 10 for cut-lines |
| :--- | :--- |
| **Companion doc** | `MRPL_Sovereign_AI_Workbench_Architecture.docx` (pitch/architecture) |
| **Stack** | Next.js · FastAPI · LangGraph · Ollama · Qdrant · PostgreSQL · Docker Compose |

---

## 1. Repository Layout

```text
mrpl-ai-workbench/
├── docker-compose.yml
├── .env.example
├── scripts/
│   ├── pull_models.sh          # ollama pull for every model, run once, offline after
│   └── seed_rag.py             # loads sample_sops/ into Qdrant
├── data/
│   ├── sample_sops/            # synthetic SOPs, .md or .txt
│   └── sample_scans/           # 2-3 rehearsed demo documents
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py             # FastAPI app, CORS, router mounting
│       ├── api/
│       │   ├── chat.py         # POST /api/chat
│       │   ├── upload.py       # POST /api/upload
│       │   ├── tasks.py        # GET /api/tasks/{id}/stream, /approve, /download
│       │   └── network.py      # GET /api/network/status
│       ├── agent/
│       │   ├── state.py        # WorkbenchState pydantic model
│       │   ├── graph.py        # LangGraph StateGraph wiring
│       │   ├── router.py       # classify_task() rule + LLM fallback
│       │   └── nodes/
│       │       ├── classify.py
│       │       ├── ocr.py
│       │       ├── vision.py
│       │       ├── extract_findings.py
│       │       ├── rag_search.py
│       │       ├── recommend.py
│       │       ├── generate_docx.py
│       │       └── sandbox_exec.py
│       ├── models/
│       │   ├── ollama_client.py
│       │   └── embeddings.py
│       ├── rag/
│       │   ├── indexer.py
│       │   └── retriever.py
│       ├── tools/
│       │   ├── ocr_tool.py     # PaddleOCR wrapper
│       │   ├── docx_writer.py  # python-docx template filler
│       │   ├── xlsx_reader.py  # openpyxl reader
│       │   └── sandbox.py      # subprocess/Docker sandbox runner
│       ├── db/
│       │   ├── models.py       # SQLAlchemy ORM
│       │   └── session.py
│       └── network_sentinel/
│           └── monitor.py      # /proc/net/tcp poller
├── sandbox-runner/
│   └── Dockerfile              # no-network image for generated code
└── frontend/
    ├── package.json
    └── app/
        ├── page.tsx            # main chat screen
        ├── components/
        │   ├── ChatWindow.tsx
        │   ├── FileUpload.tsx
        │   ├── AgentTrace.tsx      # SSE-driven step list
        │   ├── NetworkSentinel.tsx # polls /api/network/status
        │   └── ApprovalCheckpoint.tsx
        ├── lib/api.ts
        └── store/useTaskStore.ts   # Zustand
```

---

## 2. Local Environment — `docker-compose.yml` (skeleton)

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - OLLAMA_HOST=http://ollama:11434
      - QDRANT_HOST=http://qdrant:6333
      - DATABASE_URL=postgresql://mrpl:mrpl@postgres:5432/workbench
    depends_on: [ollama, qdrant, postgres]
    volumes:
      - ./data:/app/data
      - uploads:/app/uploads

  ollama:
    image: ollama/ollama
    volumes: ["ollama_models:/root/.ollama"]
    # GPU passthrough: deploy.resources.reservations.devices (nvidia) if available

  qdrant:
    image: qdrant/qdrant
    volumes: ["qdrant_data:/qdrant/storage"]

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: mrpl
      POSTGRES_PASSWORD: mrpl
      POSTGRES_DB: workbench
    volumes: ["pg_data:/var/lib/postgresql/data"]

networks:
  default:
    internal: true   # <-- structural sovereignty proof, see Sec. 8 of architecture doc

volumes:
  ollama_models: {}
  qdrant_data: {}
  pg_data: {}
  uploads: {}
```

> **Setup order (run once, with internet, before demo day):**
> 1. `docker compose up -d ollama qdrant postgres`
> 2. `bash scripts/pull_models.sh`
> 3. `python scripts/seed_rag.py`
> 4. Flip network to `internal: true` and rebuild.

---

## 3. Database Schema (PostgreSQL DDL)

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  task_type TEXT,                 -- 'doc_reasoning' | 'multimodal_agentic' | 'coding_agentic' | 'rag_qa'
  status TEXT DEFAULT 'pending',  -- pending|running|awaiting_approval|done|error
  selected_models TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE agent_steps (
  id SERIAL PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  node_name TEXT NOT NULL,        -- e.g. 'ocr_extract'
  tool TEXT,
  input JSONB,
  output JSONB,
  ts TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  filename TEXT,
  doc_type TEXT,   -- 'upload' | 'generated'
  storage_path TEXT,
  ts TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE knowledge_chunks (
  id SERIAL PRIMARY KEY,
  source_doc TEXT,
  content TEXT,
  qdrant_point_id UUID            -- embedding lives in Qdrant, text mirrored here
);

CREATE TABLE network_events (
  id SERIAL PRIMARY KEY,
  ts TIMESTAMPTZ DEFAULT now(),
  direction TEXT,
  dest TEXT,
  allowed BOOLEAN
);
```

---

## 4. API Contract

| Method & Path | Request | Response | Notes |
| :--- | :--- | :--- | :--- |
| `POST /api/upload` | `multipart file` | `{ document_id, filename }` | Stores to `/app/uploads`, row in `documents` |
| `POST /api/chat` | `{ prompt, document_id? }` | `{ task_id }` | Creates task row, kicks off `graph.ainvoke()` as background task |
| `GET /api/tasks/{id}/stream` | — (SSE) | `event: step 
 data: {node_name, output, ts}` | Frontend `AgentTrace` subscribes here; one event per LangGraph node |
| `POST /api/tasks/{id}/approve` | `{ decision: approve\|edit\|reject, edits? }` | `{ status }` | Unblocks the `human_checkpoint` node (Section 5) |
| `GET /api/tasks/{id}/download` | — | File stream (`.docx`/`.xlsx`) | Only available once `status = done` |
| `GET /api/network/status` | — | `{ external_connections, uploads, downloads, status }` | Polled every 1–2s by `NetworkSentinel.tsx` |

---

## 5. Agent Graph Spec (LangGraph)

### 5.1 State Schema

```python
from pydantic import BaseModel

class WorkbenchState(BaseModel):
    task_id: str
    prompt: str
    file_path: str | None = None
    task_type: str | None = None       # set by classify
    ocr_text: str | None = None
    ocr_tables: list | None = None
    vision_findings: str | None = None
    findings_json: dict | None = None  # structured extraction
    sop_hits: list[dict] | None = None # [{text, source, score}]
    recommendation: str | None = None
    approved: bool | None = None
    docx_path: str | None = None
    error: str | None = None
```

### 5.2 Node Contracts

| Node | Reads | Writes | Model / Tool Used |
| :--- | :--- | :--- | :--- |
| `classify_task` | `prompt`, `file_path` | `task_type` | Rule filter → Qwen2.5-7B JSON fallback |
| `ocr_extract` | `file_path` | `ocr_text`, `ocr_tables` | PaddleOCR (skipped if `task_type=coding`) |
| `vision_analyze` | `file_path` | `vision_findings` | Qwen2-VL (skipped if no images) |
| `extract_findings` | `ocr_text`, `vision_findings` | `findings_json` | Qwen2.5-7B, forced JSON schema |
| `rag_search_sop` | `findings_json` | `sop_hits` | `bge-small-en` → Qdrant top-k=5 |
| `compare_and_recommend` | `findings_json`, `sop_hits` | `recommendation` | Qwen2.5-7B |
| `human_checkpoint` | `recommendation` | `approved` (blocks until API call) | — (see Sec. 4, `/approve`) |
| `generate_docx` | `findings_json`, `recommendation` | `docx_path` | python-docx, Approval Note template |
| `validate_output` | `docx_path` | `status=done` or `error` | Re-open file, assert required section headers exist |

> **Note:** Every node write is also persisted as a row in `agent_steps` and pushed over the SSE stream — that single behavior is what powers both the live demo trace and the audit log, so implement it once as a small `emit_step()` helper called at the end of every node, not per-node.

---

## 6. Prompt Templates

### 6.1 Classifier (Stage-2 fallback)

```text
SYSTEM:
You are a task router. Respond with ONLY valid JSON, no prose:
{"task_type": "doc_reasoning|multimodal_agentic|coding_agentic|rag_qa",
 "needs_vision": bool, "needs_rag": bool, "needs_sandbox": bool}

USER: {prompt}
Attached file type: {mime_type or 'none'}
```

### 6.2 Findings Extraction

```text
SYSTEM:
Extract structured inspection findings from the OCR/vision text below.
Return ONLY JSON: {"equipment": str, "findings": [str],
"severity": "low|medium|high", "dates": [str]}

OCR TEXT: {ocr_text}
VISION NOTES: {vision_findings}
```

### 6.3 Recommendation

```text
SYSTEM:
Given these findings and the matched SOP excerpts, write a 3-5
sentence recommendation for an approval note. Cite SOP sources
by name. End with one line: 'APPROVAL RECOMMENDED' or
'FURTHER REVIEW REQUIRED'.

FINDINGS: {findings_json}
SOP EXCERPTS: {sop_hits}
```

---

## 7. Frontend Component Contracts

| Component | Responsibility | Key Props / State |
| :--- | :--- | :--- |
| `ChatWindow` | Prompt input + message history | `messages[]`, `onSend(prompt, file)` |
| `FileUpload` | Drag/drop, calls `/api/upload`, returns `document_id` | `onUploaded(document_id)` |
| `AgentTrace` | Subscribes to SSE stream, renders step-by-step list live | `taskId` → `EventSource(/api/tasks/{id}/stream)` |
| `NetworkSentinel` | Polls `/api/network/status` every 1–2s, big visible counter | `status: {external_connections, ...}` |
| `ApprovalCheckpoint` | Shown when `status=awaiting_approval`; Approve/Edit/Reject buttons | `onDecision(decision, edits?)` |

---

## 8. Dev Tickets by Owner

Same 6-role split as the architecture doc, broken into concrete, checkable tickets. Copy this section straight into your tracker of choice (GitHub Projects / Notion / Trello).

### 8.1 Backend / Orchestration Lead
- [ ] Scaffold FastAPI app, CORS, health check
- [ ] SQLAlchemy models + Alembic (or raw DDL) migration for Section 3 schema
- [ ] `POST /api/chat` creates task row, launches `graph.ainvoke()` in background
- [ ] SSE endpoint streams `agent_steps` as they're inserted (LISTEN/NOTIFY or simple poll loop)
- [ ] `classify_task` rule-filter + LLM-fallback implementation
- [ ] `human_checkpoint` node that blocks on a DB flag, resumed by `/approve`

### 8.2 AI/ML — Language
- [ ] Ollama client wrapper with retry + structured-JSON parsing helper
- [ ] `extract_findings` + `compare_and_recommend` prompt implementations, tested against 3 sample docs
- [ ] Coding-agent path: prompt → code → `sandbox.py` → auto-fix-on-error loop (max 2 retries)

### 8.3 AI/ML — Multimodal
- [ ] PaddleOCR wrapper returning text + bounding boxes + best-effort tables
- [ ] Qwen2-VL integration via Ollama for image/diagram description
- [ ] `indexer.py`: chunk `sample_sops/`, embed with `bge-small-en`, upsert to Qdrant
- [ ] `retriever.py`: top-k search + score threshold + source citation formatting

### 8.4 Infra / Sovereignty
- [ ] `docker-compose.yml` finalized, `internal:true` network, healthchecks on every service
- [ ] `sandbox-runner` Dockerfile: no network, cpu/mem/pids limits, 10s timeout wrapper
- [ ] `network_sentinel/monitor.py` polling `/proc/net/tcp` or using `psutil`, exposed via `/api/network/status`
- [ ] Host-level `iptables`/`ufw` egress-DROP rule + documented one-command demo toggle

### 8.5 Frontend Lead
- [ ] Chat screen: prompt box + file upload + message list
- [ ] `AgentTrace` component wired to SSE, one row per node with icon per status
- [ ] `NetworkSentinel` widget, prominent, top of screen, red/green state
- [ ] `ApprovalCheckpoint` UI with Approve/Edit/Reject
- [ ] Download button that only enables at `status=done`

### 8.6 Docs / Demo Lead
- [ ] Approval Note `.docx` template (`python-docx`) matching FR-15 sections exactly
- [ ] 2–3 rehearsed sample scans in `data/sample_scans/`, pre-tested for good OCR results
- [ ] Synthetic SOP set (5–10 short docs) covering the findings in the chosen sample scans
- [ ] Demo script rehearsed against Section 13 of the architecture doc; backup video recorded

---

## 9. Definition of Done — MVP Demo Readiness

- [ ] Flagship flow runs start-to-finish on the golden-path sample scan without manual intervention except the approval click
- [ ] A second, different sample scan also works (not just the one rehearsed doc)
- [ ] Coding-agent path produces a working script and a visible result on a sample Excel file
- [ ] RAG answers show at least one correct SOP citation, verified against the actual source text
- [ ] `AgentTrace` shows every node firing in the right order with no silent failures
- [ ] `NetworkSentinel` reads `0` throughout a full run
- [ ] Pulling the network cable mid-run does not break either flow
- [ ] Generated `.docx` opens cleanly in Word/LibreOffice with all required sections populated
- [ ] Full clean run recorded on video as a fallback before the live slot

---

## 10. Explicit Cut-Lines (Do Not Build For MVP)

- **Multi-user auth / JWT / RBAC** — single hardcoded session is enough
- **Admin console for model management** — a `models.yaml` file is enough
- **PDF export (FR-17)** — `.docx`/`.xlsx` only
- **Full audit dashboard with search/filter** — the raw `agent_steps` table + `AgentTrace` view is enough
- **Multi-GPU / multi-node scaling** — architecture-slide only, not code

> If any of the above starts eating build hours, stop and re-read Section 9 — everything there is what actually gets scored.\n