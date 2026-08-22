import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.db.session import get_db
from typing import List
from app.db.models import NetworkEvent
from app.schemas.network import (
    NetworkStatusResponse,
    NetworkEventLogRequest,
    NetworkEventResponse,
)
from app.network_sentinel.monitor import sentinel_monitor

logger = logging.getLogger("workbench.network")

router = APIRouter()


@router.get("/network/status", response_model=NetworkStatusResponse, status_code=status.HTTP_200_OK)
def get_network_status(db: Session = Depends(get_db)):
    """
    Return current air-gap / perimeter status for Network Sentinel UI widget.
    Audits active host/container sockets, counts upload/download documents,
    and returns real-time sovereign enclave status.
    """
    metrics = sentinel_monitor.get_metrics(db=db)
    return NetworkStatusResponse(
        external_connections=metrics["external_connections"],
        uploads=metrics["uploads"],
        downloads=metrics["downloads"],
        status=metrics["status"],
        last_checked=metrics["last_checked"],
    )


@router.post("/network/events", response_model=NetworkEventResponse, status_code=status.HTTP_201_CREATED)
def log_network_event(
    payload: NetworkEventLogRequest,
    db: Session = Depends(get_db)
):
    """
    Record an intercepted network egress/ingress attempt into the audit log.
    Ensures complete compliance auditability for security verification.
    """
    event = NetworkEvent(
        direction=payload.direction,
        dest=payload.dest,
        allowed=payload.allowed
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return NetworkEventResponse(
        id=event.id,
        ts=event.ts.isoformat() if event.ts else None,
        direction=event.direction,
        dest=event.dest,
        allowed=event.allowed
    )


@router.get("/network/events", response_model=List[NetworkEventResponse], status_code=status.HTTP_200_OK)
def list_network_events(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List recent network security audit events."""
    events = db.query(NetworkEvent).order_by(NetworkEvent.ts.desc()).offset(skip).limit(limit).all()
    return [
        NetworkEventResponse(
            id=e.id,
            ts=e.ts.isoformat() if e.ts else None,
            direction=e.direction,
            dest=e.dest,
            allowed=e.allowed
        )
        for e in events
    ]

