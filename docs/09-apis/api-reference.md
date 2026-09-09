# API Reference Specification
## FastAPI REST Endpoints, Payloads, Schemas & Status Codes

---

## 1. Base URL & Protocol
- **Protocol:** HTTP/1.1 (Local loopback or isolated internal container network)
- **Base URL:** `http://localhost:8000/api`
- **Content-Type:** `application/json` (unless multipart form data for uploads)

---

## 2. Core Endpoint Specifications

### 1. Submit New Task / Chat Prompt
- **Endpoint:** `POST /api/chat`
- **Description:** Submits an engineering query or inspection task, initiating the LangGraph background workflow.
- **Request Body:**
  ```json
  {
    "prompt": "Analyze MRPL Hydrocracker NDT wall thickness logs for pipe line HC-102-B.",
    "document_id": "doc_9823471",
    "preferred_models": ["qwen2.5:14b", "qwen2.5-vl:7b"],
    "parameters": {
      "temperature": 0.1,
      "top_p": 0.95
    }
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "task_id": "task_8819234",
    "status": "processing",
    "created_at": "2026-09-09T10:15:00Z"
  }
  ```

---

### 2. Upload Confidential Document
- **Endpoint:** `POST /api/upload`
- **Description:** Multipart file upload for scanned NDT PDFs, defect images, or spreadsheets.
- **Form Data:** `file: Binary`
- **Response (200 OK):**
  ```json
  {
    "document_id": "doc_9823471",
    "filename": "HC_102_B_UT_Inspection_Report.pdf",
    "file_size": 2489201,
    "mime_type": "application/pdf",
    "created_at": "2026-09-09T10:14:55Z"
  }
  ```

---

### 3. Server-Sent Events (SSE) Agent Trace Stream
- **Endpoint:** `GET /api/tasks/{task_id}/stream`
- **Description:** Streams real-time LangGraph node execution events to the frontend timeline.
- **Response Headers:**
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache, no-transform`
- **Stream Event Types:** See [`docs/09-apis/sse-event-specs.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/09-apis/sse-event-specs.md).

---

### 4. Human-in-the-Loop Operator Decision
- **Endpoint:** `POST /api/tasks/{task_id}/approve`
- **Description:** Submits human operator decision to resume paused LangGraph execution.
- **Request Body:**
  ```json
  {
    "decision": "approve",
    "edited_recommendation": "Accelerate UT inspection to 6-month intervals; prepare replacement spool.",
    "operator_id": "OP-9921-MRPL",
    "operator_role": "Lead Corrosion Engineer",
    "notes": "Verified against API 570 Section 7 Table 4."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "task_id": "task_8819234",
    "status": "processing_deliverable",
    "approved_at": "2026-09-09T10:16:30Z"
  }
  ```

---

### 5. Download Synthesized Deliverable
- **Endpoint:** `GET /api/tasks/{task_id}/download`
- **Description:** Downloads the generated executive `.docx` report or `.xlsx` evaluation.
- **Response:**
  - Binary stream (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
  - Header: `Content-Disposition: attachment; filename="Inspection_Approval_Note_HC-102-B.docx"`

---

### 6. Zero-Egress Network Sentinel Telemetry
- **Endpoint:** `GET /api/network/status`
- **Description:** Queries the Linux socket monitor to verify active air-gap integrity.
- **Response (200 OK):**
  ```json
  {
    "air_gapped": true,
    "outbound_bytes_sent": 0,
    "active_sockets": 3,
    "blocked_attempts": 0,
    "node_name": "SOVEREIGN-MRPL-ENCLAVE-01",
    "last_checked": "2026-09-09T10:17:00Z"
  }
  ```
