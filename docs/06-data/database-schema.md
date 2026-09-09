# Database Schema Specification
## PostgreSQL Relational Storage, SQLAlchemy Models & Migration Strategy

---

## 1. Storage Architecture
ABHEDYA AI utilizes a single, isolated PostgreSQL database instance (`postgres:16-alpine`) hosted inside the internal Docker bridge network. The database maintains operational task lifecycles, real-time agent execution traces, document metadata, knowledge chunks, and the cryptographic audit ledger.

---

## 2. Complete Entity-Relationship Model

```mermaid
erDiagram
    TASKS ||--o{ AGENT_STEPS : contains
    TASKS ||--o{ DOCUMENTS : associates
    TASKS ||--o{ APPROVALS : requires
    TASKS ||--o{ DELIVERABLES : produces
    TASKS ||--o{ AUDIT_LOGS : records

    TASKS {
        varchar(64) id PK
        text prompt
        varchar(50) task_type
        varchar(32) status
        varchar(16) priority
        varchar(16) risk_level
        jsonb selected_models
        timestamp created_at
        timestamp completed_at
    }

    AGENT_STEPS {
        serial id PK
        varchar(64) task_id FK
        varchar(64) node_name
        varchar(64) tool
        jsonb input_data
        jsonb output_data
        varchar(32) status
        integer execution_time_ms
        timestamp created_at
    }

    DOCUMENTS {
        varchar(64) id PK
        varchar(64) task_id FK
        text filename
        varchar(64) doc_type
        text storage_path
        integer file_size
        varchar(64) mime_type
        timestamp created_at
    }

    APPROVALS {
        varchar(64) id PK
        varchar(64) task_id FK
        varchar(64) operator_id
        varchar(64) operator_role
        varchar(32) decision
        text notes
        varchar(64) signature_hash
        timestamp created_at
    }

    DELIVERABLES {
        varchar(64) id PK
        varchar(64) task_id FK
        text filename
        varchar(32) format
        text file_path
        varchar(64) sha256_hash
        timestamp created_at
    }

    AUDIT_LOGS {
        varchar(64) id PK
        varchar(64) task_id FK
        bigserial sequence_num
        varchar(64) event_type
        varchar(64) actor_id
        jsonb event_payload
        varchar(64) previous_hash
        varchar(64) current_hash
        timestamp created_at
    }
```

---

## 3. SQLAlchemy Implementation (`backend/app/db/models.py`)

The codebase models are aligned with the target schema:
- `Task`: Root task object with relationships to steps, documents, and approvals.
- `AgentStep`: Captures node execution for SSE replay and UI timeline rendering.
- `Document`: Tracks both user-uploaded raw files and system-generated outputs.
- `Approval`: Records operator decisions (`approve`, `edit`, `reject`) and digital signatures.
- `Deliverable`: Tracks synthesized `.docx` and `.xlsx` files with SHA-256 hashes.
- `AuditLog`: Enforces the forward-chained SHA-256 audit ledger.
- `NetworkEvent`: Logs network boundary violations or suspicious socket states.

---

## 4. Migration Strategy
Database migrations are managed using **Alembic**:
- Initial baseline migration creates all core tables.
- Automatic table creation fallback exists in `backend/app/db/session.py` for rapid prototyping (`Base.metadata.create_all(bind=engine)`).
- SQLite in-memory fallback is supported exclusively for headless unit testing (`sqlite:///:memory:`).
