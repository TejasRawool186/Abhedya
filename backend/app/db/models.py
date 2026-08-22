import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    Integer,
    Boolean,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def get_utc_now():
    return datetime.now(timezone.utc)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    prompt = Column(Text, nullable=False)
    task_type = Column(String(50), nullable=True)  # 'doc_reasoning' | 'multimodal_agentic' | 'coding_agentic' | 'rag_qa'
    status = Column(String(30), default="pending", nullable=False)  # pending | running | awaiting_approval | done | error
    selected_models = Column(JSON, nullable=True)  # list of model names
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    # Relationships
    steps = relationship("AgentStep", back_populates="task", cascade="all, delete-orphan", order_by="AgentStep.id")
    documents = relationship("Document", back_populates="task")

    def to_dict(self):
        return {
            "id": self.id,
            "prompt": self.prompt,
            "task_type": self.task_type,
            "status": self.status,
            "selected_models": self.selected_models,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class AgentStep(Base):
    __tablename__ = "agent_steps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String(36), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    node_name = Column(String(100), nullable=False)  # e.g., 'ocr_extract', 'rag_search_sop'
    tool = Column(String(100), nullable=True)
    input = Column(JSON, nullable=True)
    output = Column(JSON, nullable=True)
    ts = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    # Relationships
    task = relationship("Task", back_populates="steps")

    def to_dict(self):
        return {
            "id": self.id,
            "task_id": self.task_id,
            "node_name": self.node_name,
            "tool": self.tool,
            "input": self.input,
            "output": self.output,
            "ts": self.ts.isoformat() if self.ts else None,
        }


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(36), ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True)
    filename = Column(String(255), nullable=False)
    doc_type = Column(String(50), nullable=False)  # 'upload' | 'generated'
    storage_path = Column(Text, nullable=False)
    ts = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    # Relationships
    task = relationship("Task", back_populates="documents")

    def to_dict(self):
        return {
            "id": self.id,
            "task_id": self.task_id,
            "filename": self.filename,
            "doc_type": self.doc_type,
            "storage_path": self.storage_path,
            "ts": self.ts.isoformat() if self.ts else None,
        }


class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_doc = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    qdrant_point_id = Column(String(36), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "source_doc": self.source_doc,
            "content": self.content,
            "qdrant_point_id": self.qdrant_point_id,
        }


class NetworkEvent(Base):
    __tablename__ = "network_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ts = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    direction = Column(String(20), nullable=True)  # 'inbound' | 'outbound'
    dest = Column(String(255), nullable=True)
    allowed = Column(Boolean, default=False, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "ts": self.ts.isoformat() if self.ts else None,
            "direction": self.direction,
            "dest": self.dest,
            "allowed": self.allowed,
        }
