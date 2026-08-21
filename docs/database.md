# Database & Storage Design

The system relies on PostgreSQL 16 for structured relational metadata and Qdrant for dense vector search over confidential plant SOPs.

---

## 1. PostgreSQL Schema (DDL)

```sql
-- Main task requests
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  task_type TEXT,                 -- 'doc_reasoning' | 'multimodal_agentic' | 'coding_agentic' | 'rag_qa'
  status TEXT DEFAULT 'pending',  -- pending | running | awaiting_approval | done | error
  selected_models TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Real-time execution audit log
CREATE TABLE agent_steps (
  id SERIAL PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  node_name TEXT NOT NULL,        -- e.g., 'ocr_extract', 'rag_search_sop'
  tool TEXT,
  input JSONB,
  output JSONB,
  ts TIMESTAMPTZ DEFAULT now()
);

-- File registry for uploads and deliverables
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  doc_type TEXT NOT NULL,         -- 'upload' | 'generated'
  storage_path TEXT NOT NULL,
  ts TIMESTAMPTZ DEFAULT now()
);

-- Text mirror for indexed RAG chunks
CREATE TABLE knowledge_chunks (
  id SERIAL PRIMARY KEY,
  source_doc TEXT NOT NULL,
  content TEXT NOT NULL,
  qdrant_point_id UUID
);

-- Network event monitor log for sovereignty audit
CREATE TABLE network_events (
  id SERIAL PRIMARY KEY,
  ts TIMESTAMPTZ DEFAULT now(),
  direction TEXT,
  dest TEXT,
  allowed BOOLEAN DEFAULT FALSE
);
```

---

## 2. Qdrant Vector Collection Specification

- **Collection Name:** `mrpl_sops`
- **Vector Dimension:** 384 (matching `bge-small-en`)
- **Distance Metric:** Cosine
- **Payload Schema:**
  - `source_doc`: String (e.g. `SOP-042-boiler-inspection.md`)
  - `section`: String
  - `content`: String
  - `chunk_id`: Integer
