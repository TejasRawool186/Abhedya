from pydantic import BaseModel

class NetworkStatusResponse(BaseModel):
    external_connections: int
    uploads: int
    downloads: int
    status: str
    last_checked: str
