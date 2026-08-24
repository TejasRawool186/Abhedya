from typing import Optional, List
from pydantic import BaseModel

class NetworkStatusResponse(BaseModel):
    external_connections: int
    uploads: int
    downloads: int
    status: str
    last_checked: str
    blocked_attempts: int = 0

class NetworkEventLogRequest(BaseModel):
    direction: str  # 'inbound' | 'outbound'
    dest: str
    allowed: bool = False

class NetworkEventResponse(BaseModel):
    id: int
    ts: Optional[str] = None
    direction: Optional[str] = None
    dest: Optional[str] = None
    allowed: bool

