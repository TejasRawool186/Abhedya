from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel

class ChatRequest(BaseModel):
    prompt: str
    document_id: Optional[str] = None
    selected_models: Optional[List[str]] = None

class ChatResponse(BaseModel):
    task_id: str
    status: str

class ApproveRequest(BaseModel):
    decision: str  # "approve" | "edit" | "reject"
    edits: Optional[str] = None

class ApproveResponse(BaseModel):
    task_id: str
    status: str
    decision: str
    message: Optional[str] = None

class AgentStepResponse(BaseModel):
    id: int
    task_id: str
    node_name: str
    tool: Optional[str] = None
    input: Optional[Dict[str, Any]] = None
    output: Optional[Dict[str, Any]] = None
    ts: Optional[str] = None

class TaskDetailResponse(BaseModel):
    id: str
    prompt: str
    task_type: Optional[str] = None
    status: str
    selected_models: Optional[List[str]] = None
    created_at: Optional[str] = None
    steps: List[AgentStepResponse] = []
