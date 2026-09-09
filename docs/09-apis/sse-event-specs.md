# Server-Sent Events (SSE) Stream Specification
## Event Types, Payloads, Heartbeats & Reconnection Replay

---

## 1. Streaming Protocol Overview
Real-time node progress tracking in ABHEDYA AI is delivered over a single unidirectional Server-Sent Events (SSE) stream via `GET /api/tasks/{task_id}/stream`.

The stream serves two primary functions:
1. **Live Step Telemetry:** Streams active node transitions, tool executions, and critique scores as they occur.
2. **Reconnection Catch-Up:** When a client connects or reconnects mid-execution, all historical steps persisted in PostgreSQL are immediately replayed before live events begin.

---

## 2. Event Types & Payloads

### 1. `event: step`
- Emitted when an internal LangGraph node begins or completes execution.
- **Data Payload:**
  ```json
  {
    "node_name": "retrieve_sop_evidence",
    "status": "completed",
    "tool": "qdrant_vector_search",
    "output": {
      "chunks_retrieved": 3,
      "top_citation": "API 570 Section 7.1.1 (Page 14)",
      "similarity": 0.94
    },
    "ts": "2026-09-09T10:15:12.450Z"
  }
  ```

---

### 2. `event: checkpoint` (Human Approval Required)
- Emitted when the LangGraph workflow reaches the `human_checkpoint` node and halts.
- **Data Payload:**
  ```json
  {
    "node_name": "human_checkpoint",
    "status": "awaiting_approval",
    "risk_level": "HIGH",
    "proposed_action": "Accelerate UT inspection intervals to 6 months.",
    "evidence_citations": ["API 570 Clause 7.1", "OISD-105 Clause 4.2"],
    "requires_signoff": true,
    "ts": "2026-09-09T10:15:25.100Z"
  }
  ```

---

### 3. `event: done` (Task Completion)
- Emitted when the deliverable has been synthesized and the audit ledger entry committed.
- **Data Payload:**
  ```json
  {
    "node_name": "complete",
    "status": "completed",
    "deliverable_url": "/api/tasks/task_8819234/download",
    "filename": "Inspection_Approval_Note_HC-102-B.docx",
    "audit_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "ts": "2026-09-09T10:15:40.000Z"
  }
  ```

---

### 4. `event: error`
- Emitted when an unrecoverable exception occurs.
- **Data Payload:**
  ```json
  {
    "node_name": "execute_sandbox_tool",
    "status": "error",
    "error_message": "Execution timed out (exceeded 10.0s sandbox limit).",
    "ts": "2026-09-09T10:15:18.200Z"
  }
  ```

---

## 3. Keep-Alive Heartbeats
To prevent intermediary proxies or browsers from terminating idle connections during extended LLM reasoning steps:
- A comment ping is emitted every 15 seconds if no live event has been queued:
  ```text
  : ping
  ```
