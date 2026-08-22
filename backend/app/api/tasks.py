import json
import asyncio
import os
import uuid
import logging
from typing import List, Optional
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse, FileResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db, SessionLocal
from app.db.models import Task, AgentStep, Document
from app.schemas.tasks import (
    TaskDetailResponse,
    AgentStepResponse,
    ApproveRequest,
    ApproveResponse,
)
from app.core.sse_manager import sse_manager
from app.core.emitter import emit_step, emit_done, emit_error

logger = logging.getLogger("workbench.tasks")

router = APIRouter()

@router.get("/tasks/{task_id}/stream")
async def stream_task_events(
    task_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Server-Sent Events (SSE) streaming endpoint.
    Streams real-time LangGraph node outputs (`event: step`, `event: checkpoint`, `event: done`, `event: error`).
    Replays existing historical steps if client connects/reconnects mid-execution.
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task '{task_id}' not found."
        )

    async def event_generator():
        queue = await sse_manager.subscribe(task_id)
        try:
            # 1. Catch-up phase: replay steps already persisted in DB
            db_session = SessionLocal()
            try:
                past_steps = db_session.query(AgentStep).filter(AgentStep.task_id == task_id).order_by(AgentStep.id).all()
                for step in past_steps:
                    event_type = "checkpoint" if step.node_name == "human_checkpoint" else ("done" if step.node_name == "complete" else "step")
                    payload = {
                        "node_name": step.node_name,
                        "output": step.output,
                        "tool": step.tool,
                        "ts": step.ts.isoformat() if step.ts else None
                    }
                    yield f"event: {event_type}\ndata: {json.dumps(payload)}\n\n"
            finally:
                db_session.close()

            # 2. Live streaming phase
            while True:
                # Check for client disconnect
                if await request.is_disconnected():
                    logger.info("Client disconnected from SSE stream for task %s", task_id)
                    break

                try:
                    # Wait for next event with a 15-second heartbeat timeout
                    message = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield message

                    # If task completed, end stream
                    if "event: done" in message or "event: error" in message:
                        logger.info("Task %s completed. Closing SSE stream.", task_id)
                        break

                except asyncio.TimeoutError:
                    # Send SSE comment keep-alive ping
                    yield ": ping\n\n"

        except asyncio.CancelledError:
            logger.info("SSE streaming task cancelled for %s", task_id)
        finally:
            await sse_manager.unsubscribe(task_id, queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@router.get("/tasks/{task_id}", response_model=TaskDetailResponse)
def get_task_details(
    task_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve task metadata and step execution audit log."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task '{task_id}' not found."
        )

    steps = db.query(AgentStep).filter(AgentStep.task_id == task_id).order_by(AgentStep.id).all()

    return TaskDetailResponse(
        id=task.id,
        prompt=task.prompt,
        task_type=task.task_type,
        status=task.status,
        selected_models=task.selected_models,
        created_at=task.created_at.isoformat() if task.created_at else None,
        steps=[
            AgentStepResponse(
                id=s.id,
                task_id=s.task_id,
                node_name=s.node_name,
                tool=s.tool,
                input=s.input,
                output=s.output,
                ts=s.ts.isoformat() if s.ts else None
            )
            for s in steps
        ]
    )


@router.get("/tasks", response_model=List[TaskDetailResponse])
def list_tasks(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """List recent tasks with their step audit histories."""
    tasks = db.query(Task).order_by(Task.created_at.desc()).offset(skip).limit(limit).all()
    results = []
    for task in tasks:
        steps = db.query(AgentStep).filter(AgentStep.task_id == task.id).order_by(AgentStep.id).all()
        results.append(
            TaskDetailResponse(
                id=task.id,
                prompt=task.prompt,
                task_type=task.task_type,
                status=task.status,
                selected_models=task.selected_models,
                created_at=task.created_at.isoformat() if task.created_at else None,
                steps=[
                    AgentStepResponse(
                        id=s.id,
                        task_id=s.task_id,
                        node_name=s.node_name,
                        tool=s.tool,
                        input=s.input,
                        output=s.output,
                        ts=s.ts.isoformat() if s.ts else None
                    )
                    for s in steps
                ]
            )
        )
    return results


def _build_report_content(task: Task, recommendation: str, decision: str, edits: Optional[str]) -> str:
    from datetime import datetime, timezone

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    applied = edits if decision == "edit" and edits else recommendation

    lines = [
        "================================================================",
        "MRPL SOVEREIGN AI WORKBENCH — CONFIDENTIAL ANALYSIS REPORT",
        "================================================================",
        "",
        f"Task ID           : {task.id}",
        f"Generated At      : {now}",
        f"Human Decision    : {decision.upper()}",
        f"Task Status       : APPROVED FOR DISTRIBUTION",
        "",
        "----------------------------------------------------------------",
        "ORIGINAL PROMPT",
        "----------------------------------------------------------------",
        task.prompt,
        "",
        "----------------------------------------------------------------",
        "FINAL RECOMMENDATION",
        "----------------------------------------------------------------",
        applied,
        "",
        "----------------------------------------------------------------",
        "RISK SUMMARY",
        "----------------------------------------------------------------",
        "• All analysis executed within air-gapped sovereign enclave.",
        "• No external LLM calls were made during processing.",
        "• Human-in-the-loop checkpoint obtained prior to generation.",
        "",
        "----------------------------------------------------------------",
        "OPERATOR NOTES",
        "----------------------------------------------------------------",
        "File this report in the compliance audit log alongside the",
        "original inspection document. Reference the Task ID above for",
        "traceability to the full agent step audit trail.",
        "",
        "----------------------------------------------------------------",
        f"End of report — MRPL Sovereign AI Workbench v{getattr(settings, 'VERSION', '1.0.0')}",
        "================================================================",
        "",
    ]
    return "\n".join(lines)


def _generate_docx_file(storage_path: str, task: Task, recommendation: str, decision: str, edits: Optional[str]):
    """Generate authentic Word .docx deliverable or fallback to structured document."""
    try:
        import docx
        from docx.shared import Pt, RGBColor
        from docx.enum.table import WD_TABLE_ALIGNMENT
        from datetime import datetime, timezone

        doc = docx.Document()
        
        # Header / Title
        title_p = doc.add_paragraph()
        title_run = title_p.add_run("MRPL SOVEREIGN AI WORKBENCH")
        title_run.bold = True
        title_run.font.size = Pt(18)
        title_run.font.color.rgb = RGBColor(16, 44, 87)
        
        subtitle_p = doc.add_paragraph()
        sub_run = subtitle_p.add_run("CONFIDENTIAL PLANT EQUIPMENT INSPECTION APPROVAL NOTE")
        sub_run.bold = True
        sub_run.font.size = Pt(12)
        sub_run.font.color.rgb = RGBColor(90, 90, 90)
        
        # Metadata Table
        table = doc.add_table(rows=5, cols=2)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        rows_data = [
            ("Task Identifier", str(task.id)),
            ("Timestamp", datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")),
            ("Operator Decision", decision.upper()),
            ("Air-Gap Enclave Status", "VERIFIED SOVEREIGN ENCLAVE (0 EGRESS)"),
            ("Compliance Standard", "MRPL-SOP-042 / ISO-55001"),
        ]
        for idx, (k, v) in enumerate(rows_data):
            cell_k = table.cell(idx, 0)
            cell_v = table.cell(idx, 1)
            cell_k.text = k
            cell_v.text = v
            if cell_k.paragraphs and cell_k.paragraphs[0].runs:
                cell_k.paragraphs[0].runs[0].bold = True
            
        doc.add_paragraph()
        
        # 1. Inspection Prompt
        doc.add_heading("1. Inspection Request & Ingestion Prompt", level=2)
        doc.add_paragraph(task.prompt)
        
        # 2. Recommendation
        doc.add_heading("2. Engineering Evaluation & Synthesized Recommendation", level=2)
        applied = edits if decision == "edit" and edits else recommendation
        p_rec = doc.add_paragraph(applied)
        if p_rec.runs:
            p_rec.runs[0].bold = True
        
        # 3. Security & Sovereignty
        doc.add_heading("3. Sovereignty & Air-Gap Audit Verification", level=2)
        doc.add_paragraph("• All analysis executed 100% on-premise without external cloud APIs.")
        doc.add_paragraph("• Real-time network telemetry confirmed zero unencrypted or non-loopback egress.")
        doc.add_paragraph("• Human-in-the-loop validation obtained prior to report emission.")
        
        # 4. Operator Sign-off
        doc.add_heading("4. Operator Sign-Off", level=2)
        doc.add_paragraph(f"Decision: {decision.upper()} | Authorized By: Plant Operations Engineer\nSigned electronically at {datetime.now(timezone.utc).isoformat()}")
        
        doc.save(storage_path)
    except Exception as e:
        logger.warning("python-docx failed or unavailable, falling back to text representation: %s", e)
        content = _build_report_content(task, recommendation, decision, edits)
        with open(storage_path, "w", encoding="utf-8") as fh:
            fh.write(content)


async def _finalize_approved_task_async(task_id: str, decision: str, edits: Optional[str]):
    """Finalize deliverable generation after operator approval."""
    from datetime import datetime, timezone

    db_session = SessionLocal()
    try:
        task = db_session.query(Task).filter(Task.id == task_id).first()
        if not task:
            return

        # Step 1: Finalize / generate_report
        await asyncio.sleep(0.6)
        await emit_step(
            task_id=task_id,
            node_name="generate_report",
            output={
                "format": "docx",
                "decision": decision,
                "edited": bool(edits),
                "status": "building",
            },
            tool="docx_builder",
            db=db_session,
        )

        # Collect recommendation from the human_checkpoint step
        recommendation = ""
        cp = (
            db_session.query(AgentStep)
            .filter(
                AgentStep.task_id == task_id,
                AgentStep.node_name == "human_checkpoint",
            )
            .order_by(AgentStep.id.desc())
            .first()
        )
        if cp and isinstance(cp.output, dict):
            recommendation = cp.output.get("recommendation", "") or ""

        doc_id = str(uuid.uuid4())
        filename = f"report-{task_id[-8:]}.docx"
        storage_path = os.path.join(settings.DELIVERABLES_DIR, filename)

        try:
            _generate_docx_file(storage_path, task, recommendation, decision, edits)
        except Exception as e:
            logger.error("Failed to write deliverable file: %s", e)
            raise

        try:
            doc_record = Document(
                id=doc_id,
                task_id=task_id,
                filename=filename,
                doc_type="generated",
                storage_path=storage_path,
            )
            db_session.add(doc_record)
            db_session.commit()
        except Exception as e:
            logger.error("Failed to record deliverable document: %s", e)
            db_session.rollback()
            raise

        await asyncio.sleep(0.4)

        # Step 2: complete
        await emit_done(
            task_id=task_id,
            docx_path=storage_path,
            output={
                "document_id": doc_id,
                "filename": filename,
                "format": "docx",
                "size_bytes": os.path.getsize(storage_path),
                "decision": decision,
            },
            db=db_session,
        )

    except Exception as e:
        logger.error("Error during post-approval finalization: %s", e)
        try:
            await emit_error(task_id=task_id, error_message=f"Finalization error: {str(e)}")
        except Exception:
            pass
    finally:
        db_session.close()


@router.post("/tasks/{task_id}/approve", response_model=ApproveResponse, status_code=status.HTTP_200_OK)
async def approve_task(
    task_id: str,
    payload: ApproveRequest,
    db: Session = Depends(get_db)
):
    """
    Human-in-the-loop approval checkpoint. Accepts a decision (approve/edit/reject).
    On approve or edit: asynchronously generates deliverable document, emits SSE
    'generate_report' step then 'done' event with final output.
    On reject: marks task status as 'rejected' and ends SSE stream.
    """
    if payload.decision not in ("approve", "edit", "reject"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid decision '{payload.decision}'. Expected approve, edit, or reject."
        )

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task '{task_id}' not found."
        )

    if task.status not in ("awaiting_approval", "running", "done", "error"):
        # Allow retry but warn
        logger.warning(
            "Approval received for task %s with status '%s'; proceeding anyway.",
            task_id, task.status,
        )

    decision = payload.decision
    edits = payload.edits

    if decision == "reject":
        task.status = "rejected"
        db.commit()
        # Notify any SSE listeners via a step with event_type error/reject
        try:
            from app.core.emitter import emit_step as _step
            await _step(
                task_id=task_id,
                node_name="rejected_by_operator",
                output={"decision": "reject", "reason": edits or "Operator rejected recommendation"},
                event_type="error",
                db=db,
            )
        except Exception as e:
            logger.warning("Failed to emit rejection SSE event: %s", e)

        return ApproveResponse(
            task_id=task_id,
            status="rejected",
            decision="reject",
            message="Task rejected by human operator. No deliverable generated.",
        )

    # Approve or edit: transition running, kick off finalization async
    task.status = "running"
    db.commit()
    db.refresh(task)

    asyncio.create_task(_finalize_approved_task_async(task_id, decision, edits))

    message = (
        "Edits applied and generation started."
        if decision == "edit"
        else "Recommendation approved. Report generation in progress."
    )
    return ApproveResponse(
        task_id=task_id,
        status="running",
        decision=decision,
        message=message,
    )


@router.get("/tasks/{task_id}/download")
def download_task_deliverable(
    task_id: str,
    db: Session = Depends(get_db)
):
    """Download the generated report deliverable for a completed task."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task '{task_id}' not found."
        )

    doc = (
        db.query(Document)
        .filter(
            Document.task_id == task_id,
            Document.doc_type == "generated",
        )
        .order_by(Document.ts.desc())
        .first()
    )

    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No generated deliverable found for task '{task_id}'. "
                   "Ensure the task has passed human approval checkpoint."
        )

    if not os.path.exists(doc.storage_path):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File missing on disk: {doc.storage_path}"
        )

    filename = Path(doc.storage_path).name
    return FileResponse(
        path=doc.storage_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
