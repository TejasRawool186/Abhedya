import io
import time
import uuid
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db.session import init_db, get_db, SessionLocal
from app.db.models import Task, AgentStep, Document, NetworkEvent

def test_full_backend_dev2_suite():
    init_db()
    client = TestClient(app)

    print("\n[TEST 1] System Health and Root Verification")
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ("healthy", "degraded")
    assert "database" in data

    res = client.get("/")
    assert res.status_code == 200
    assert "docs" in res.json()

    print("[TEST 2] Document Upload Ingestion (/api/upload)")
    dummy_bytes = b"%PDF-1.4 Mock Scanned Boiler Inspection Report MRPL-2026-B4"
    file_payload = ("boiler_scan_unit4.pdf", io.BytesIO(dummy_bytes), "application/pdf")
    res = client.post("/api/upload", files={"file": file_payload})
    assert res.status_code == 200, res.text
    upload_data = res.json()
    doc_id = upload_data["document_id"]
    assert doc_id is not None
    assert upload_data["filename"] == "boiler_scan_unit4.pdf"

    print("[TEST 3] Document Query Endpoints (/api/documents)")
    res = client.get("/api/documents")
    assert res.status_code == 200
    docs = res.json()
    assert any(d["id"] == doc_id for d in docs)

    res = client.get(f"/api/documents/{doc_id}")
    assert res.status_code == 200
    assert res.json()["filename"] == "boiler_scan_unit4.pdf"

    print("[TEST 4] Task Initialization (/api/chat)")
    chat_payload = {
        "prompt": "Evaluate wall thickness on Boiler B-402 against SOP-042",
        "document_id": doc_id,
        "selected_models": ["Qwen2.5-7B-Instruct", "qwen2-vl:7b"]
    }
    res = client.post("/api/chat", json=chat_payload)
    assert res.status_code == 202
    task_id = res.json()["task_id"]
    assert task_id is not None

    print("[TEST 5] Task Details & List Query (/api/tasks)")
    res = client.get(f"/api/tasks/{task_id}")
    assert res.status_code == 200
    t_data = res.json()
    assert t_data["id"] == task_id
    assert t_data["prompt"] == chat_payload["prompt"]

    res = client.get("/api/tasks")
    assert res.status_code == 200
    all_tasks = res.json()
    assert any(t["id"] == task_id for t in all_tasks)

    print("[TEST 6] Real-time SSE Stream (/api/tasks/{id}/stream)")
    with client.stream("GET", f"/api/tasks/{task_id}/stream") as response:
        assert response.status_code == 200
        event_lines = []
        for line in response.iter_lines():
            if line:
                event_lines.append(line)
            if any("event: checkpoint" in l for l in event_lines):
                break
    assert any("event: step" in l or "event: checkpoint" in l for l in event_lines)

    print("[TEST 7] Human Checkpoint Approval (/api/tasks/{id}/approve)")
    res = client.get(f"/api/tasks/{task_id}")
    assert res.json()["status"] == "awaiting_approval"

    approve_payload = {
        "decision": "edit",
        "edits": "APPROVED WITH MODIFICATIONS: Proceed with shutdown scheduled on 2026-08-30. Replace flange gasket per SOP-108."
    }
    res = client.post(f"/api/tasks/{task_id}/approve", json=approve_payload)
    assert res.status_code == 200
    assert res.json()["status"] == "running"
    assert res.json()["decision"] == "edit"

    # Allow async generator to complete DOCX writing
    time.sleep(2.0)

    res = client.get(f"/api/tasks/{task_id}")
    assert res.json()["status"] == "done"

    print("[TEST 8] Deliverable Download (/api/tasks/{id}/download)")
    res = client.get(f"/api/tasks/{task_id}/download")
    assert res.status_code == 200
    assert len(res.content) > 100
    assert "wordprocessingml" in res.headers.get("content-type", "")

    print("[TEST 9] Network Sentinel Air-Gap Telemetry (/api/network/status)")
    res = client.get("/api/network/status")
    assert res.status_code == 200
    net_data = res.json()
    assert "external_connections" in net_data
    assert "status" in net_data
    assert net_data["uploads"] >= 1
    assert net_data["downloads"] >= 1

    print("[TEST 10] Network Event Audit Trail Logging (/api/network/events)")
    log_payload = {
        "direction": "outbound",
        "dest": "api.openai.com:443",
        "allowed": False
    }
    res = client.post("/api/network/events", json=log_payload)
    assert res.status_code == 201
    event_id = res.json()["id"]
    assert event_id is not None
    assert res.json()["allowed"] is False

    res = client.get("/api/network/events")
    assert res.status_code == 200
    events = res.json()
    assert any(e["id"] == event_id for e in events)

    print("\n[SUCCESS] All 10 Dev 2 Full Backend Capabilities Verified Successfully!\n")
