import json
import asyncio
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.session import get_db, SessionLocal
from app.db.models import Task, AgentStep
from app.schemas.tasks import TaskDetailResponse, AgentStepResponse
from app.core.sse_manager import sse_manager

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
