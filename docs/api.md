# API Contracts Specification

The Backend API is exposed over FastAPI on port `8000`. All requests and responses operate strictly over local loopback / Docker network.

---

## 1. Endpoints Overview

| Method & Path | Request Payload | Response Format | Purpose |
| :--- | :--- | :--- | :--- |
| `POST /api/upload` | `multipart/form-data` (file) | JSON | Ingests document, returns `document_id` |
| `POST /api/chat` | JSON: `{ prompt, document_id? }` | JSON: `{ task_id }` | Spawns LangGraph agentic background task |
| `GET /api/tasks/{id}/stream` | None (SSE Stream) | `text/event-stream` | Streams real-time LangGraph node updates |
| `POST /api/tasks/{id}/approve` | JSON: `{ decision, edits? }` | JSON: `{ status }` | Human checkpoint: `approve`, `edit`, or `reject` |
| `GET /api/tasks/{id}/download` | None | File Stream (`.docx`/`.xlsx`) | Downloads final generated deliverable |
| `GET /api/network/status` | None | JSON | Returns real-time air-gap connection metrics |

---

## 2. Detailed Schemas

### `POST /api/upload`
**Request:**
- Content-Type: `multipart/form-data`
- Body: `file: <Binary>`

**Response (200 OK):**
```json
{
  "document_id": "8f3b2c1a-5d6e-4e3a-9c7f-1a2b3c4d5e6f",
  "filename": "inspection_boiler_scan_4.png",
  "storage_path": "/app/uploads/8f3b2c1a_inspection_boiler_scan_4.png"
}
```

---

### `POST /api/chat`
**Request:**
```json
{
  "prompt": "Analyze this scanned inspection report and draft an approval note.",
  "document_id": "8f3b2c1a-5d6e-4e3a-9c7f-1a2b3c4d5e6f"
}
```

**Response (202 Accepted):**
```json
{
  "task_id": "d4a1c2e3-f4b5-4a6c-8e7f-0a1b2c3d4e5f",
  "status": "running"
}
```

---

### `GET /api/tasks/{id}/stream`
**Response (Server-Sent Events):**
```text
event: step
data: {"node_name": "classify_task", "output": {"task_type": "multimodal_agentic"}, "ts": "2026-08-22T03:10:00Z"}

event: step
data: {"node_name": "ocr_extract", "output": {"text_length": 1420, "tables_found": 2}, "ts": "2026-08-22T03:10:02Z"}

event: checkpoint
data: {"node_name": "human_checkpoint", "recommendation": "APPROVAL RECOMMENDED based on SOP-042", "ts": "2026-08-22T03:10:08Z"}
```

---

### `POST /api/tasks/{id}/approve`
**Request:**
```json
{
  "decision": "approve",
  "edits": null
}
```
**Response (200 OK):**
```json
{
  "task_id": "d4a1c2e3-f4b5-4a6c-8e7f-0a1b2c3d4e5f",
  "status": "resumed"
}
```

---

### `GET /api/network/status`
**Response (200 OK):**
```json
{
  "external_connections": 0,
  "uploads": 0,
  "downloads": 0,
  "status": "AIR-GAPPED",
  "last_checked": "2026-08-22T03:10:15Z"
}
```
