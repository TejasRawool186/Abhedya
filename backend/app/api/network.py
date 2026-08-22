import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.db.session import get_db
from app.schemas.network import NetworkStatusResponse
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
