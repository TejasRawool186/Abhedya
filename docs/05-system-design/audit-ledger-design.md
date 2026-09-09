# Immutable Audit Ledger Design
## Tamper-Evident Event Logging, Cryptographic Hash Chaining & Regulatory Compliance

---

## 1. Compliance Requirements & Objectives
Refinery operations under statutory safety mandates (such as OISD-105, API 570, and ISO 27001) require that all automated decisions, safety assessments, and operator approvals be permanently recorded.

The **Immutable Audit Ledger** in ABHEDYA AI guarantees:
1. **Traceability:** Every final deliverable (`.docx`/`.xlsx`) maps directly to the specific task prompt, model versions, retrieved SOP evidence chunks, and operator sign-off.
2. **Forward Integrity (Tamper Evidence):** Database records are cryptographically chained using SHA-256 hashes; altering or deleting any historical record invalidates all subsequent hashes.
3. **Non-Repudiation:** Operator approvals capture authenticated user IDs, roles, timestamps, and digital sign-off signatures.

---

## 2. PostgreSQL DDL Schema (`audit_logs`)

```sql
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    sequence_num BIGSERIAL NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    actor_type VARCHAR(32) NOT NULL, -- 'SYSTEM', 'MODEL', 'OPERATOR'
    actor_id VARCHAR(64) NOT NULL,
    event_payload JSONB NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_task_id ON audit_logs(task_id);
CREATE INDEX idx_audit_seq ON audit_logs(sequence_num);
```

---

## 3. Cryptographic Hash Chaining Formulation

For each audit entry $k$, the cryptographic digest is computed as:

$$\text{Hash}_k = \text{SHA-256}\Big(\text{Hash}_{k-1} \;\|\; \text{task\_id} \;\|\; \text{sequence\_num} \;\|\; \text{event\_type} \;\|\; \text{actor\_id} \;\|\; \text{event\_payload} \;\|\; \text{created\_at}\Big)$$

```text
┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│      AUDIT ENTRY 1     │       │      AUDIT ENTRY 2     │       │      AUDIT ENTRY 3     │
│  Type: task_created    │       │  Type: model_selected  │       │  Type: approval_signed │
│  Prev: GENESIS_HASH    │ ───►  │  Prev: HASH_1          │ ───►  │  Prev: HASH_2          │
│  Hash: HASH_1          │       │  Hash: HASH_2          │       │  Hash: HASH_3          │
└────────────────────────┘       └────────────────────────┘       └────────────────────────┘
```

---

## 4. Auditable Lifecycle Event Types

| Event Identifier | Actor | Payload Captured |
| :--- | :--- | :--- |
| `task_created` | Operator | Initial prompt, uploaded document metadata, IP address. |
| `files_parsed` | System (OCR/VLM) | Extracted text length, detected tables, visual anomaly tags. |
| `model_routed` | Adaptive Router | Selected reasoning & vision models, heuristic routing score. |
| `evidence_retrieved` | RAG Retriever | Top-$k$ SOP document chunks, page citations, similarity scores. |
| `tool_executed` | Sandbox Runner | Generated Python script, exit code, stdout numerical results. |
| `verification_passed` | Self-RAG Gate | `ISREL` score, `ISSUP` score, critique reasoning. |
| `approval_granted` | Lead Engineer | Operator ID, role, edited text, digital approval stamp. |
| `deliverable_created` | Docx Writer | Final `.docx` filename, local storage path, file SHA-256 hash. |

---

## 5. Deliverable Digital Stamp
When an executive `Inspection_Approval_Note.docx` is generated, the document header embeds a **Cryptographic Verification Stamp**:
- **Task ID:** `task_8819234`
- **Audit Hash:** `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
- **Approving Authority:** `OP-9921-MRPL (Lead Corrosion Engineer)`
- **Timestamp:** `2026-09-09 10:14:00 UTC`
An auditor inspecting the physical or digital document can query the PostgreSQL database to verify that the file has not been altered since generation.
