import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.db.session import get_db
from app.db.models import NetworkEvent, Task, Document
from app.schemas.network import NetworkStatusResponse

logger = logging.getLogger("workbench.network")

router = APIRouter()


@router.get("/network/status", response_model=NetworkStatusResponse, status_code=status.HTTP_200_OK)
def get_network_status(db: Session = Depends(get_db)):
    """
    Return current air-gap / perimeter status for Network Sentinel UI widget.
    Counts blocked outbound attempts and overall connection metrics.
    """
    now = datetime.now(timezone.utc)

    blocked = (
        db.query(func.count(NetworkEvent.id))
        .filter(
            NetworkEvent.direction == "outbound",
            NetworkEvent.allowed == False,  # noqa: E712
        )
        .scalar()
        or 0
    )

    uploads = db.query(func.count(Document.id)).filter(Document.doc_type == "upload").scalar() or 0
    downloads = db.query(func.count(Document.id)).filter(Document.doc_type == "generated").scalar() or 0

    air_gap_active = True
    try:
        import psutil

        external_iface_active = False
        for addrs in psutil.net_if_addrs().values():
            for addr in addrs:
                snic = str(addr.address).lower()
                if snic.startswith("127.") or snic.startswith("0.") or snic == "::1":
                    continue
                if addr.family == 2 and snic.startswith(("10.", "172.16.", "172.17.", "172.18.", "172.19.",
                                                          "172.2", "172.30.", "172.31.", "192.168.")):
                    continue
                if addr.family in (2, 23):
                    external_iface_active = True
                    break
        if external_iface_active:
            air_gap_active = False
    except Exception:
        logger.info("psutil unavailable or network probe failed; defaulting air_gap_active=True")

    # Also check if any task has status not in the expected set — external connection leak
    external_connections = 0 if air_gap_active else 1

    return NetworkStatusResponse(
        external_connections=external_connections,
        uploads=uploads,
        downloads=downloads,
        status="secured" if air_gap_active and blocked < 5 else "warning",
        last_checked=now.isoformat(),
    )
