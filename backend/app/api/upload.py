import os
import uuid
import logging
import aiofiles
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.db.models import Document
from app.schemas.upload import UploadResponse

logger = logging.getLogger("workbench.upload")

router = APIRouter()

ALLOWED_EXTENSIONS = {
    ".pdf", ".png", ".jpg", ".jpeg", ".bmp", ".tiff",
    ".xlsx", ".xls", ".csv",
    ".docx", ".doc", ".txt", ".md"
}

@router.post("/upload", response_model=UploadResponse, status_code=status.HTTP_200_OK)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Ingest uploaded inspection document, engineering drawing, or spreadsheet.
    Saves file to confidential local storage and creates document registry record.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload payload."
        )

    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{file_ext}'. Allowed types: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    document_id = str(uuid.uuid4())
    # Sanitize filename (remove directory traversals)
    safe_filename = Path(file.filename).name.replace(" ", "_")
    stored_filename = f"{document_id}_{safe_filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, stored_filename)

    try:
        # Stream file to disk
        async with aiofiles.open(file_path, "wb") as out_file:
            while content := await file.read(1024 * 1024):  # 1MB chunks
                await out_file.write(content)
        
        logger.info("Successfully wrote uploaded file to %s (%s)", file_path, document_id)
    except Exception as e:
        logger.error("Failed to write uploaded file to disk: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist file to local storage: {str(e)}"
        )

    # Record in database
    try:
        doc_record = Document(
            id=document_id,
            filename=safe_filename,
            doc_type="upload",
            storage_path=file_path
        )
        db.add(doc_record)
        db.commit()
        db.refresh(doc_record)
    except Exception as e:
        logger.error("Failed to record document metadata in DB: %s", e)
        # Attempt to cleanup file
        if os.path.exists(file_path):
            os.remove(file_path)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record document in database: {str(e)}"
        )

    return UploadResponse(
        document_id=doc_record.id,
        filename=doc_record.filename,
        storage_path=doc_record.storage_path
    )
