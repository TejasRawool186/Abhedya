from typing import Optional
from pydantic import BaseModel

class UploadResponse(BaseModel):
    document_id: str
    filename: str
    storage_path: str

class DocumentResponse(BaseModel):
    id: str
    task_id: Optional[str] = None
    filename: str
    doc_type: str
    storage_path: str
    created_at: Optional[str] = None

