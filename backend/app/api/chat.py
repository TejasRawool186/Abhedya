import uuid
import asyncio
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db, SessionLocal
from app.db.models import Task, Document
from app.schemas.tasks import ChatRequest, ChatResponse
from app.core.emitter import emit_step, emit_checkpoint, emit_done, emit_error

logger = logging.getLogger("workbench.chat")

router = APIRouter()

async def run_agent_pipeline_fallback(task_id: str, prompt: str, file_path: Optional[str]):
    """
    Fallback agent execution pipeline if LangGraph orchestrator is still under development.
    Emits structured steps so Dev 1's AgentTrace UI can render the real-time node outputs.
    When Dev 3 plugs in `agent.graph`, this smoothly transitions to `graph.ainvoke()`.
    """
    try:
        # Check if LangGraph agent graph is available
        try:
            from app.agent.graph import app_graph
            from app.agent.state import WorkbenchState
            
            logger.info("Executing LangGraph agent graph for task %s", task_id)
            state = WorkbenchState(task_id=task_id, prompt=prompt, file_path=file_path)
            await app_graph.ainvoke(state)
            return
        except (ImportError, AttributeError):
            logger.info("Using built-in agent pipeline simulator for task %s", task_id)

        # 1. Node: Classify Task
        await asyncio.sleep(0.8)
        task_type = "coding_agentic" if (file_path and file_path.endswith((".xlsx", ".csv"))) else "multimodal_agentic"
        await emit_step(
            task_id=task_id,
            node_name="classify_task",
            output={
                "task_type": task_type,
                "needs_vision": bool(file_path and file_path.endswith((".png", ".jpg", ".pdf"))),
                "needs_rag": True,
                "model_selected": "qwen2.5-7b"
            },
            tool="rule_router"
        )

        # 2. Node: OCR / Data Extraction
        await asyncio.sleep(1.2)
        if file_path:
            await emit_step(
                task_id=task_id,
                node_name="ocr_extract",
                output={
                    "file": file_path.split("/")[-1].split("\\")[-1],
                    "text_length": 1420,
                    "tables_found": 2,
                    "preview": "MRPL Boiler Inspection Unit 4: Wall thickness measured at 4.2mm (Min allowed: 4.0mm)."
                },
                tool="paddle_ocr"
            )

        # 3. Node: Extract Findings
        await asyncio.sleep(1.0)
        findings = {
            "equipment": "Boiler Unit #4 Pressure Shell",
            "findings": [
                "Local corrosion observed on south flange",
                "Ultrasonic thickness measurement: 4.2mm (Baseline: 6.0mm)",
                "Operating pressure: 42.5 bar"
            ],
            "severity": "medium",
            "dates": ["2026-08-20"]
        }
        await emit_step(
            task_id=task_id,
            node_name="extract_findings",
            output=findings,
            tool="qwen2.5-7b"
        )

        # 4. Node: RAG Search SOP
        await asyncio.sleep(1.1)
        sop_hits = [
            {
                "source": "SOP-042-boiler-inspection.md",
                "section": "Section 3.1: Minimum Wall Thickness & Pressure Vessel Safety",
                "score": 0.91,
                "content": "For Boiler Shell Class-A, minimum allowable wall thickness is 4.0mm at 45 bar. Immediate shutdown required if below 3.8mm."
            },
            {
                "source": "SOP-108-flange-corrosion-limits.md",
                "section": "Section 2.4: Flange Surface Degradation",
                "score": 0.84,
                "content": "Superficial flange corrosion requires chemical cleaning and anti-corrosive coating during next turnaround."
            }
        ]
        await emit_step(
            task_id=task_id,
            node_name="rag_search_sop",
            output={"matched_chunks": len(sop_hits), "citations": ["SOP-042", "SOP-108"], "hits": sop_hits},
            tool="qdrant_retriever"
        )

        # 5. Node: Compare and Recommend
        await asyncio.sleep(1.0)
        recommendation = (
            "Based on SOP-042 (Section 3.1), measured wall thickness of 4.2mm meets safe operating threshold (min 4.0mm). "
            "South flange corrosion is superficial as per SOP-108 and requires cleaning at next scheduled turnaround. "
            "APPROVAL RECOMMENDED with re-inspection in 6 months."
        )
        await emit_step(
            task_id=task_id,
            node_name="compare_and_recommend",
            output={"recommendation": recommendation},
            tool="qwen2.5-7b"
        )

        # 6. Node: Human Checkpoint
        await emit_checkpoint(
            task_id=task_id,
            node_name="human_checkpoint",
            recommendation=recommendation,
            output={"requires_human_approval": True, "action_items": ["Approve", "Edit Recommendation", "Reject"]}
        )

    except Exception as e:
        logger.error("Error running agent pipeline for task %s: %s", task_id, e)
        await emit_error(task_id=task_id, error_message=str(e))


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_chat_task(
    payload: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Ingest user prompt and document attachment.
    Creates a task record and launches the LangGraph agent pipeline asynchronously.
    """
    if not payload.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt text cannot be empty."
        )

    task_id = str(uuid.uuid4())
    file_path = None

    # Link document if provided
    if payload.document_id:
        doc = db.query(Document).filter(Document.id == payload.document_id).first()
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Attached document '{payload.document_id}' not found."
            )
        doc.task_id = task_id
        file_path = doc.storage_path

    # Create task record
    task_record = Task(
        id=task_id,
        prompt=payload.prompt,
        task_type="pending_classification",
        status="running",
        selected_models=payload.selected_models or ["qwen2.5-7b"]
    )
    db.add(task_record)
    db.commit()
    db.refresh(task_record)

    logger.info("Created Task %s, launching background pipeline worker...", task_id)

    # Launch pipeline asynchronously
    asyncio.create_task(run_agent_pipeline_fallback(task_id, payload.prompt, file_path))

    return ChatResponse(
        task_id=task_record.id,
        status="running"
    )
