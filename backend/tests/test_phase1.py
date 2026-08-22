import os
import sys
import uuid
from pathlib import Path

# Ensure backend root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import init_db, SessionLocal, engine
from app.db.models import Task, AgentStep, Document, KnowledgeChunk, NetworkEvent
from app.schemas.tasks import ChatRequest, ApproveRequest, TaskDetailResponse
from app.schemas.upload import UploadResponse
from app.schemas.network import NetworkStatusResponse

def test_phase1_components():
    print("==================================================")
    print("[TEST] Running Dev 2 Phase 1 Verification Suite")
    print("==================================================")

    # 1. Test Database Table Initialization
    print("1. Testing DB Initialization and Tables...")
    init_db()
    
    # 2. Test DB CRUD Operations with SessionLocal
    print("2. Testing DB ORM Operations...")
    db = SessionLocal()
    try:
        # Create Task
        test_task_id = str(uuid.uuid4())
        task = Task(
            id=test_task_id,
            prompt="Analyze boiler corrosion report",
            task_type="multimodal_agentic",
            status="pending",
            selected_models=["qwen2.5-7b", "qwen2-vl:7b"]
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        assert task.id == test_task_id
        assert task.status == "pending"
        print(f"   [OK] Created Task record: {task.id} [{task.task_type}]")

        # Create AgentStep
        step = AgentStep(
            task_id=test_task_id,
            node_name="classify_task",
            tool="rule_router",
            input={"prompt": task.prompt},
            output={"task_type": "multimodal_agentic"}
        )
        db.add(step)
        db.commit()
        db.refresh(step)
        assert step.id is not None
        assert step.node_name == "classify_task"
        print(f"   [OK] Created AgentStep: #{step.id} for task {step.task_id}")

        # Create Document
        doc_id = str(uuid.uuid4())
        doc = Document(
            id=doc_id,
            task_id=test_task_id,
            filename="inspection_boiler_scan_4.png",
            doc_type="upload",
            storage_path=f"/app/uploads/{doc_id}_inspection_boiler_scan_4.png"
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        assert doc.id == doc_id
        print(f"   [OK] Created Document record: {doc.filename} ({doc.doc_type})")

        # Query and relationship check
        queried_task = db.query(Task).filter(Task.id == test_task_id).first()
        assert len(queried_task.steps) == 1
        assert len(queried_task.documents) == 1
        print(f"   [OK] Relationships verified (Task -> {len(queried_task.steps)} steps, {len(queried_task.documents)} docs)")

    finally:
        db.close()

    # 3. Test Pydantic Schemas
    print("3. Testing Pydantic Schemas...")
    chat_req = ChatRequest(prompt="Test prompt", document_id=doc_id)
    assert chat_req.prompt == "Test prompt"
    assert chat_req.document_id == doc_id

    appr_req = ApproveRequest(decision="approve", edits=None)
    assert appr_req.decision == "approve"

    net_resp = NetworkStatusResponse(
        external_connections=0,
        uploads=0,
        downloads=0,
        status="AIR-GAPPED",
        last_checked="2026-08-22T03:10:15Z"
    )
    assert net_resp.status == "AIR-GAPPED"
    print("   [OK] Pydantic schemas validated.")

    # 4. Test FastAPI TestClient Endpoints
    print("4. Testing FastAPI Health Endpoints...")
    with TestClient(app) as client:
        # Test Root
        res_root = client.get("/")
        assert res_root.status_code == 200
        print(f"   [OK] GET / -> 200 OK: {res_root.json()['message']}")

        # Test /health
        res_health = client.get("/health")
        assert res_health.status_code == 200
        data = res_health.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"
        print(f"   [OK] GET /health -> 200 OK: Status={data['status']}, Database={data['database']}")

        # Test /api/health
        res_api_health = client.get("/api/health")
        assert res_api_health.status_code == 200
        print(f"   [OK] GET /api/health -> 200 OK")

        # Test OpenAPI docs schema
        res_openapi = client.get("/openapi.json")
        assert res_openapi.status_code == 200
        print(f"   [OK] GET /openapi.json -> 200 OK (OpenAPI Title: {res_openapi.json()['info']['title']})")

    print("==================================================")
    print("[SUCCESS] All Dev 2 Phase 1 Verification Tests Passed!")
    print("==================================================")

if __name__ == "__main__":
    test_phase1_components()
