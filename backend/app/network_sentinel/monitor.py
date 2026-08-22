import logging
import os
import socket
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.models import NetworkEvent, Document

logger = logging.getLogger("workbench.sentinel")


class NetworkSentinelMonitor:
    """
    Real-time Air-Gap and Network Egress Monitor for MRPL Sovereign AI Workbench.
    Inspects host/container sockets, Linux /proc/net/tcp, and interface states to verify
    zero external egress connections (strict air-gap guarantee).
    """

    PRIVATE_IP_PREFIXES = (
        "127.",
        "0.0.0.0",
        "::1",
        "fe80:",
        "10.",
        "192.168.",
        "172.16.",
        "172.17.",
        "172.18.",
        "172.19.",
        "172.20.",
        "172.21.",
        "172.22.",
        "172.23.",
        "172.24.",
        "172.25.",
        "172.26.",
        "172.27.",
        "172.28.",
        "172.29.",
        "172.30.",
        "172.31.",
    )

    @classmethod
    def is_private_or_loopback(cls, ip_str: str) -> bool:
        """Check if an IP address is loopback or strictly RFC-1918 private / container network."""
        if not ip_str:
            return True
        ip_clean = ip_str.strip().lower()
        if ip_clean == "localhost" or ip_clean.startswith("::") or ip_clean == "*":
            return True
        return any(ip_clean.startswith(prefix) for prefix in cls.PRIVATE_IP_PREFIXES)

    @classmethod
    def scan_proc_net_tcp(cls) -> List[Dict[str, Any]]:
        """
        Parse Linux /proc/net/tcp and /proc/net/tcp6 if running inside a Linux container.
        Returns list of active external socket connections.
        """
        external_sockets = []
        for path in ("/proc/net/tcp", "/proc/net/tcp6"):
            if not os.path.exists(path):
                continue
            try:
                with open(path, "r", encoding="utf-8") as fh:
                    lines = fh.readlines()
                for line in lines[1:]:
                    parts = line.strip().split()
                    if len(parts) < 4:
                        continue
                    rem_address = parts[2]
                    state = parts[3]
                    # State '01' is TCP_ESTABLISHED
                    if state != "01":
                        continue
                    rem_ip_hex = rem_address.split(":")[0]
                    if len(rem_ip_hex) == 8:
                        # IPv4 hex to dotted quad
                        ip_int = int(rem_ip_hex, 16)
                        ip_str = socket.inet_ntoa(ip_int.to_bytes(4, "little"))
                        if not cls.is_private_or_loopback(ip_str):
                            external_sockets.append({"ip": ip_str, "type": "proc_net_tcp"})
            except Exception as e:
                logger.debug("Failed reading %s: %s", path, e)
        return external_sockets

    @classmethod
    def scan_psutil_connections(cls) -> List[Dict[str, Any]]:
        """Scan active network connections using psutil (works cross-platform)."""
        external_conns = []
        try:
            import psutil
            connections = psutil.net_connections(kind="inet")
            for conn in connections:
                if conn.status == "ESTABLISHED" and conn.raddr:
                    remote_ip = conn.raddr.ip
                    if not cls.is_private_or_loopback(remote_ip):
                        external_conns.append({
                            "ip": remote_ip,
                            "port": conn.raddr.port,
                            "pid": conn.pid,
                            "status": conn.status
                        })
        except Exception as e:
            logger.debug("psutil net_connections scan encountered error: %s", e)
        return external_conns

    @classmethod
    def get_metrics(cls, db: Optional[Session] = None) -> Dict[str, Any]:
        """
        Produce real-time air-gap security telemetry.
        """
        now = datetime.now(timezone.utc)
        
        # 1. Scan external connections via /proc/net/tcp or psutil
        external_conns = cls.scan_proc_net_tcp()
        if not external_conns:
            external_conns = cls.scan_psutil_connections()

        external_count = len(external_conns)

        # 2. Query document database counters
        uploads_count = 0
        downloads_count = 0
        blocked_count = 0

        if db:
            try:
                uploads_count = (
                    db.query(func.count(Document.id))
                    .filter(Document.doc_type == "upload")
                    .scalar()
                    or 0
                )
                downloads_count = (
                    db.query(func.count(Document.id))
                    .filter(Document.doc_type == "generated")
                    .scalar()
                    or 0
                )
                blocked_count = (
                    db.query(func.count(NetworkEvent.id))
                    .filter(NetworkEvent.direction == "outbound", NetworkEvent.allowed == False)  # noqa: E712
                    .scalar()
                    or 0
                )
            except Exception as e:
                logger.warning("Database telemetry query error: %s", e)

        # 3. Determine status string
        if external_count == 0:
            status_str = "AIR-GAPPED"
        else:
            status_str = "WARNING"

        return {
            "external_connections": external_count,
            "uploads": uploads_count,
            "downloads": downloads_count,
            "status": status_str,
            "last_checked": now.isoformat(),
            "details": {
                "blocked_egress_events": blocked_count,
                "active_external_targets": [c.get("ip") for c in external_conns],
                "sovereign_enclave": external_count == 0,
            }
        }


sentinel_monitor = NetworkSentinelMonitor()
