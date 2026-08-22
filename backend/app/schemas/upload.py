from pydantic import BaseModel

class UploadResponse(BaseModel):
    document_id: str
    filename: str
    storage_path: str
