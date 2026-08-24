import io
import sys
import time
from pathlib import Path

# Ensure backend root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import init_db
from app.db.models import Task, Document, AgentStep

import io
import sys
import time
from pathlib import Path

# Ensure backend root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import init_db
from app.db.models import Task, Document, AgentStep

def test_phase3_approval_and_sentinel():
    print("==================================================")
    print("[TEST] Running Dev 2 Phase 3 Verification Suite")
    print("==================================================")

    init_db()

    with TestClient(app) as client:
        # 1. Test POST /api/upload
        print("1. Uploading test inspection document...")
        dummy_file = io.BytesIO(b"Boiler Unit 4 ultrasonic inspection findings")
        upload_resp = client.post("/api/upload", files={"file": ("boiler_report.png", dummy_file, "image/png")})
        assert upload_resp.status_code == 200, f"Upload failed: {upload_resp.text}"
        doc_id = upload_resp.json()["document_id"]
        print(f"   [OK] Uploaded document: {doc_id}")

        # 2. Test POST /api/chat
        print("2. Starting chat pipeline to reach human checkpoint...")
        chat_resp = client.post("/api/chat", json={
            "prompt": "Evaluate wall thickness against SOP-042",
            "document_id": doc_id
        })
        assert chat_resp.status_code == 202
        task_id = chat_resp.json()["task_id"]
        print(f"   [OK] Launched task: {task_id}")

        # 3. Wait for task to execute and reach human_checkpoint
        print("3. Waiting for agent execution to reach awaiting_approval checkpoint...")
        for _ in range(50):
            time.sleep(0.8)
            detail_resp = client.get(f"/api/tasks/{task_id}")
            assert detail_resp.status_code == 200
            if detail_resp.json()["status"] == "awaiting_approval":
                break

        detail_data = detail_resp.json()
        assert detail_data["status"] == "awaiting_approval", f"Expected awaiting_approval, got {detail_data['status']}"
        print(f"   [OK] Current Task Status: {detail_data['status']}")

        # 4. Test POST /api/tasks/{id}/approve (Operator Approval)
        print("4. Testing POST /api/tasks/{id}/approve (Approve Decision)...")
        approve_resp = client.post(f"/api/tasks/{task_id}/approve", json={
            "decision": "approve",
            "edits": None
        })
        assert approve_resp.status_code == 200, f"Approval failed: {approve_resp.text}"
        approve_data = approve_resp.json()
        assert approve_data["decision"] == "approve"
        print(f"   [OK] Approval submitted: status='{approve_data['status']}', message='{approve_data['message']}'")

        # 5. Wait for deliverable document generation to complete
        print("5. Waiting for deliverable document generation to finalize...")
        final_status = None
        for _ in range(25):
            time.sleep(0.5)
            updated_task_resp = client.get(f"/api/tasks/{task_id}")
            assert updated_task_resp.status_code == 200
            final_status = updated_task_resp.json()["status"]
            if final_status == "done":
                break

        assert final_status == "done", f"Expected final status 'done', got '{final_status}'"
        print(f"   [OK] Final Task Status: '{final_status}'")

        # 6. Test GET /api/tasks/{id}/download
        print("6. Testing GET /api/tasks/{id}/download (Deliverable File Stream)...")
        download_resp = client.get(f"/api/tasks/{task_id}/download")
        assert download_resp.status_code == 200, f"Download failed: {download_resp.text}"
        assert len(download_resp.content) > 0
        assert "application/vnd.openxmlformats-officedocument.wordprocessingml.document" in download_resp.headers["content-type"]
        print(f"   [OK] Downloaded deliverable ({len(download_resp.content)} bytes)")

        # 7. Test POST /api/tasks/{id}/approve with 'edit' decision
        print("7. Testing operator 'edit' decision flow...")
        chat_resp2 = client.post("/api/chat", json={
            "prompt": "Inspect flange pressure rating",
        })
        task_id2 = chat_resp2.json()["task_id"]
        for _ in range(50):
            time.sleep(0.8)
            r = client.get(f"/api/tasks/{task_id2}")
            if r.json()["status"] == "awaiting_approval":
                break
        
        edit_resp = client.post(f"/api/tasks/{task_id2}/approve", json={
            "decision": "edit",
            "edits": "MODIFIED RECOMMENDATION: Replace flange gasket immediately under SOP-108."
        })
        assert edit_resp.status_code == 200
        assert edit_resp.json()["decision"] == "edit"
        print("   [OK] Edit decision accepted and finalization triggered.")

        # 8. Test POST /api/tasks/{id}/approve with 'reject' decision
        print("8. Testing operator 'reject' decision flow...")
        chat_resp3 = client.post("/api/chat", json={
            "prompt": "Corrosion scan on heat exchanger",
        })
        task_id3 = chat_resp3.json()["task_id"]
        for _ in range(50):
            time.sleep(0.8)
            r = client.get(f"/api/tasks/{task_id3}")
            if r.json()["status"] == "awaiting_approval":
                break
        
        reject_resp = client.post(f"/api/tasks/{task_id3}/approve", json={
            "decision": "reject",
            "edits": "Insufficient inspection data provided."
        })
        assert reject_resp.status_code == 200
        assert reject_resp.json()["status"] == "rejected"
        print("   [OK] Reject decision processed cleanly.")

        # 9. Test GET /api/network/status
        print("9. Testing GET /api/network/status (Air-Gap Sentinel)...")
        network_resp = client.get("/api/network/status")
        assert network_resp.status_code == 200, f"Network status failed: {network_resp.text}"
        net_data = network_resp.json()
        assert "external_connections" in net_data
        assert "status" in net_data
        assert "last_checked" in net_data
        print(f"   [OK] Air-Gap Network Status: {net_data['status']}, External Connections: {net_data['external_connections']}")

    print("==================================================")
    print("[SUCCESS] All Dev 2 Phase 3 Verification Tests Passed!")
    print("==================================================")

if __name__ == "__main__":
    test_phase3_approval_and_sentinel()
