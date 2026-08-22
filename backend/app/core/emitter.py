import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.models import AgentStep, Task
from app.core.sse_manager import sse_manager

logger = logging.getLogger("workbench.emitter")

async def emit_step(
    task_id: str,
    node_name: str,
    output: Dict[str, Any],
    tool: Optional[str] = None,
    input_data: Optional[Dict[str, Any]] = None,
    event_type: str = "step",
    db: Optional[Session] = None,
) -> AgentStep:
    """
    Centralized event producer helper.
    Dual-writes to PostgreSQL (agent_steps table) and pushes live SSE event to subscribers.
    """
    now = datetime.now(timezone.utc)
    step_record = None

    # 1. Dual Write Part A: Database persistence
    own_session = False
    if db is None:
        db = SessionLocal()
        own_session = True

    try:
        step_record = AgentStep(
            task_id=task_id,
            node_name=node_name,
            tool=tool,
            input=input_data,
            output=output,
            ts=now,
        )
        db.add(step_record)
        db.commit()
        db.refresh(step_record)
    except Exception as e:
        logger.error("Failed to persist step for task %s to DB: %s", task_id, e)
        db.rollback()
    finally:
        if own_session:
            db.close()

    # 2. Dual Write Part B: Real-time SSE stream push
    sse_payload = {
        "node_name": node_name,
        "output": output,
        "tool": tool,
        "ts": now.isoformat(),
    }
    await sse_manager.publish(task_id, event_type=event_type, data=sse_payload)
    logger.info("Emitted step [%s] for task %s (type=%s)", node_name, task_id, event_type)

    return step_record


async def emit_checkpoint(
    task_id: str,
    node_name: str = "human_checkpoint",
    recommendation: Optional[str] = None,
    output: Optional[Dict[str, Any]] = None,
    db: Optional[Session] = None,
):
    """Emit human checkpoint event and mark task as awaiting_approval."""
    own_session = False
    if db is None:
        db = SessionLocal()
        own_session = True

    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            task.status = "awaiting_approval"
            db.commit()
    except Exception as e:
        logger.error("Failed to update task status to awaiting_approval: %s", e)
        db.rollback()
    finally:
        if own_session:
            db.close()

    payload = output or {}
    if recommendation:
        payload["recommendation"] = recommendation

    await emit_step(
        task_id=task_id,
        node_name=node_name,
        output=payload,
        event_type="checkpoint",
    )


async def emit_done(
    task_id: str,
    docx_path: Optional[str] = None,
    output: Optional[Dict[str, Any]] = None,
    db: Optional[Session] = None,
):
    """Mark task as done and emit terminal 'done' SSE event."""
    own_session = False
    if db is None:
        db = SessionLocal()
        own_session = True

    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            task.status = "done"
            db.commit()
    except Exception as e:
        logger.error("Failed to update task status to done: %s", e)
        db.rollback()
    finally:
        if own_session:
            db.close()

    payload = output or {"status": "done"}
    if docx_path:
        payload["docx_path"] = docx_path

    await emit_step(
        task_id=task_id,
        node_name="complete",
        output=payload,
        event_type="done",
    )


async def emit_error(
    task_id: str,
    error_message: str,
    node_name: str = "error",
    db: Optional[Session] = None,
):
    """Mark task as error and emit 'error' SSE event."""
    own_session = False
    if db is None:
        db = SessionLocal()
        own_session = True

    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            task.status = "error"
            db.commit()
    except Exception as e:
        logger.error("Failed to update task status to error: %s", e)
        db.rollback()
    finally:
        if own_session:
            db.close()

    await emit_step(
        task_id=task_id,
        node_name=node_name,
        output={"error": error_message},
        event_type="error",
    )
