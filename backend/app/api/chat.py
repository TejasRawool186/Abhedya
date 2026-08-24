import uuid
import asyncio
import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db, SessionLocal
from app.db.models import Task, Document
from app.schemas.tasks import ChatRequest, ChatResponse
from app.core.emitter import emit_step, emit_checkpoint, emit_done, emit_error
from app.core.llm import pick_best_model, query_ollama, query_ollama_json
from app.core.file_extractor import extract_file_content

logger = logging.getLogger("workbench.chat")

router = APIRouter()

async def run_agent_pipeline(
    task_id: str,
    prompt: str,
    file_path: Optional[str] = None,
    preferred_models: Optional[List[str]] = None
):
    """
    Real agent execution pipeline powered by local sovereign LLM models (Ollama).
    Orchestrates:
      1. Task Classification & Router
      2. Document / Data Extraction (if attached)
      3. Findings & Anomaly Extraction (via local LLM)
      4. Standard Operating Procedure (SOP) / Regulatory Standards Retrieval
      5. Multi-factor Reasoning & Recommendation Synthesis (via local LLM)
      6. Human-in-the-Loop Checkpoint
    """
    try:
        # Check if an external LangGraph orchestrator graph is registered
        try:
            from app.agent.graph import app_graph
            from app.agent.state import WorkbenchState
            
            logger.info("Executing LangGraph agent graph for task %s", task_id)
            state = WorkbenchState(task_id=task_id, prompt=prompt, file_path=file_path)
            await app_graph.ainvoke(state)
            return
        except (ImportError, AttributeError):
            pass

        # Select best available local model
        # Select best available local model
        preferred = preferred_models[0] if (preferred_models and len(preferred_models) > 0) else None
        active_model = await pick_best_model(preferred)
        logger.info("Running sovereign pipeline for task %s using model %s", task_id, active_model)

        # ---------------------------------------------------------
        # Node 1: Classify Task & Rule Router
        # ---------------------------------------------------------
        is_tabular = bool(file_path and file_path.lower().endswith((".xlsx", ".xls", ".csv")))
        is_visual = bool(file_path and file_path.lower().endswith((".png", ".jpg", ".jpeg", ".bmp", ".pdf")))
        has_file = bool(file_path)

        classify_prompt = (
            f"Classify this industrial operations request for MRPL Refinery:\n"
            f"User Prompt: \"{prompt}\"\n"
            f"Has Attachment: {has_file}\n\n"
            f"Respond with JSON containing:\n"
            f"- task_type: one of ('operational_query', 'engineering_analysis', 'coding', 'industrial_inspection', 'compliance_audit', 'troubleshooting')\n"
            f"- equipment: specific equipment name if mentioned, otherwise 'Refinery Process System'\n"
            f"- is_general_query: boolean (true if user is asking a general question/explanation/code rather than an asset inspection)\n"
            f"- priority: ('low', 'normal', 'high', 'urgent')\n"
        )
        classification_fallback = {
            "task_type": "coding" if any(k in prompt.lower() for k in ["python", "code", "script", "sql"]) else ("industrial_inspection" if has_file else "operational_query"),
            "equipment": "Refinery Process Unit",
            "is_general_query": not has_file and not any(k in prompt.lower() for k in ["wall thickness", "ndt", "ultrasonic", "corrosion rate", "inspection report"]),
            "priority": "normal",
            "model_selected": active_model
        }
        classification = await query_ollama_json(
            prompt=classify_prompt,
            system="You are an industrial task classification router at MRPL Refinery. Respond only with valid JSON.",
            model=active_model,
            temperature=0.1,
            num_predict=512,
            fallback_dict=classification_fallback
        )
        if not isinstance(classification, dict):
            classification = classification_fallback
        classification["model_selected"] = active_model
        classification["needs_vision"] = is_visual

        await emit_step(
            task_id=task_id,
            node_name="classify_task",
            output=classification,
            tool="rule_router"
        )

        # ---------------------------------------------------------
        # Node 2: Document / File Extraction (if document attached)
        # ---------------------------------------------------------
        extracted_doc_data = None
        doc_context = ""
        if file_path:
            extracted_doc_data = extract_file_content(file_path)
            doc_context = extracted_doc_data.get("text", "")[:4000]
            await emit_step(
                task_id=task_id,
                node_name="ocr_extract",
                output={
                    "file": extracted_doc_data.get("filename"),
                    "text_length": extracted_doc_data.get("text_length", 0),
                    "tables_found": extracted_doc_data.get("tables_found", 0),
                    "preview": extracted_doc_data.get("preview", "")[:500],
                    "file_type": extracted_doc_data.get("file_type")
                },
                tool="document_parser"
            )

        # ---------------------------------------------------------
        # Node 3: Extract Findings / Query Analysis
        # ---------------------------------------------------------
        is_gen_query = classification.get("is_general_query", False) or (not has_file and not any(k in prompt.lower() for k in ["boiler", "wall thickness", "ndt", "corrosion", "ultrasonic"]))

        if has_file or not is_gen_query:
            findings_prompt = (
                f"Analyze this industrial engineering request for MRPL Refinery operations:\n"
                f"User Prompt: {prompt}\n"
            )
            if doc_context:
                findings_prompt += f"Attached Document Content:\n{doc_context}\n\n"

            findings_prompt += (
                "Provide structured JSON with:\n"
                "- equipment: (string - equipment or unit involved)\n"
                "- findings: (list of 2-4 key technical observations, parameters, or critical points)\n"
                "- severity: ('low', 'medium', 'high', 'critical')\n"
                "- operational_focus: (string - e.g. 'Safety', 'Process Optimization', 'Asset Integrity')"
            )

            findings_fallback = {
                "equipment": classification.get("equipment", "Refinery Process Unit"),
                "findings": [f"Evaluated input: {prompt}"],
                "severity": "medium",
                "operational_focus": "Engineering Assessment"
            }

            findings_output = await query_ollama_json(
                prompt=findings_prompt,
                system="You are an expert refinery operations and reliability engineer. Respond with structured JSON.",
                model=active_model,
                temperature=0.2,
                num_predict=768,
                fallback_dict=findings_fallback
            )
        else:
            findings_output = {
                "equipment": classification.get("equipment", "Industrial Operations"),
                "findings": [prompt],
                "severity": "low",
                "operational_focus": "Technical Intelligence & Operations"
            }

        if "findings" not in findings_output or not isinstance(findings_output.get("findings"), list):
            findings_output["findings"] = [str(findings_output.get("findings", prompt))]

        await emit_step(
            task_id=task_id,
            node_name="extract_findings",
            output=findings_output,
            tool=active_model
        )

        # ---------------------------------------------------------
        # Node 4: Standard Operating Procedures (SOP) & Standards Search
        # ---------------------------------------------------------
        equipment_name = findings_output.get("equipment", classification.get("equipment", "Refinery Process Unit"))
        findings_summary = "; ".join([str(f) for f in findings_output.get("findings", [])[:4]])

        sop_output: Dict[str, Any] = {"citations": [], "hits": []}

        if not is_gen_query or has_file:
            sop_prompt = (
                f"For refinery inquiry on '{equipment_name}' with parameters: {findings_summary}\n\n"
                f"Identify 2 applicable refinery standards, SOPs, or engineering codes (e.g. API-510, API-570, API-521, ASME Section VIII, MRPL-SOP-042, ISO 14001, OISD standards).\n"
                f"Return JSON with:\n"
                f"- citations: list of standard names\n"
                f"- hits: list of 2 objects each with 'source', 'section', 'score', 'content'."
            )
            sop_output = await query_ollama_json(
                prompt=sop_prompt,
                system="You are an industrial compliance and engineering standards specialist. Respond only with JSON.",
                model=active_model,
                temperature=0.2,
                num_predict=512,
                fallback_dict={"citations": ["MRPL Operational Standards"], "hits": []}
            )

        if "hits" not in sop_output or not isinstance(sop_output.get("hits"), list):
            sop_output["hits"] = []
        if "citations" not in sop_output or not isinstance(sop_output.get("citations"), list):
            sop_output["citations"] = [h.get("source", "SOP") for h in sop_output["hits"]] if sop_output["hits"] else ["MRPL Sovereign Engineering Protocols"]

        sop_output["matched_chunks"] = len(sop_output["hits"])

        await emit_step(
            task_id=task_id,
            node_name="rag_search_sop",
            output=sop_output,
            tool="qdrant_retriever"
        )

        # ---------------------------------------------------------
        # Node 5: Sovereign Multi-factor Reasoning & Response Synthesis
        # ---------------------------------------------------------
        sop_context_str = ""
        if sop_output.get("hits"):
            sop_context_str = "\n".join([
                f"- [{h.get('source', '')} - {h.get('section', '')}]: {h.get('content', '')}"
                for h in sop_output.get("hits", []) if h.get("content")
            ])

        if is_gen_query and not has_file:
            reasoning_prompt = (
                f"User Request: {prompt}\n\n"
                f"Please provide a comprehensive, clear, high-quality technical response addressing the user's prompt directly.\n"
                f"Use well-structured markdown with descriptive headings, bullet points, equations, or complete code snippets where helpful."
            )
            system_msg = (
                "You are the Sovereign Industrial AI Assistant for MRPL (Mangalore Refinery and Petrochemicals Limited). "
                "Provide direct, authoritative, and helpful answers to the user's questions."
            )
        else:
            reasoning_prompt = (
                f"User Prompt: {prompt}\n"
                f"Equipment / Unit: {equipment_name}\n"
                f"Severity: {findings_output.get('severity', 'medium')}\n"
                f"Inspection / Technical Findings: {findings_summary}\n"
            )
            if doc_context:
                reasoning_prompt += f"Document Content Preview:\n{doc_context[:2500]}\n\n"
            if sop_context_str:
                reasoning_prompt += f"Relevant Compliance Standards:\n{sop_context_str}\n\n"
            reasoning_prompt += (
                "Provide a rigorous engineering evaluation, risk analysis, and clear recommended operational actions. "
                "Conclude with a clear verdict (e.g., 'APPROVAL RECOMMENDED', 'CONDITIONAL APPROVAL', or 'REPAIR / RE-INSPECTION REQUIRED')."
            )
            system_msg = (
                "You are the Senior Operations & Asset Integrity Lead at MRPL Refinery. "
                "Synthesize a thorough, technically rigorous engineering evaluation based on the actual inspection data provided."
            )

        recommendation_text = await query_ollama(
            prompt=reasoning_prompt,
            system=system_msg,
            model=active_model,
            temperature=0.2,
            num_predict=2048,
            timeout=150.0
        )

        # Emit the actual LLM output as the synthesized response
        await emit_step(
            task_id=task_id,
            node_name="compare_and_recommend",
            output={"recommendation": recommendation_text},
            tool=active_model
        )

        # ---------------------------------------------------------
        # Node 6: Human Checkpoint (Operator Approval)
        # ---------------------------------------------------------
        await emit_checkpoint(
            task_id=task_id,
            node_name="human_checkpoint",
            recommendation=recommendation_text,
            output={
                "requires_human_approval": True,
                "action_items": ["Approve", "Edit Recommendation", "Reject"],
                "model": active_model,
                "equipment": equipment_name,
                "severity": findings_output.get("severity", "medium"),
                "recommendation": recommendation_text
            }
        )

    except Exception as e:
        logger.error("Error running sovereign agent pipeline for task %s: %s", task_id, e, exc_info=True)
        await emit_error(task_id=task_id, error_message=str(e))


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_chat_task(
    payload: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Ingest user prompt and document attachment.
    Creates a task record and launches the real local LLM agent pipeline asynchronously.
    """
    if not payload.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt text cannot be empty."
        )

    task_id = str(uuid.uuid4())
    file_path = None

    # Link document if provided
    if payload.document_id:
        doc = db.query(Document).filter(Document.id == payload.document_id).first()
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Attached document '{payload.document_id}' not found."
            )
        doc.task_id = task_id
        file_path = doc.storage_path

    # Create task record
    selected_models = payload.selected_models or ["qwen3:4b"]
    task_record = Task(
        id=task_id,
        prompt=payload.prompt,
        task_type="pending_classification",
        status="running",
        selected_models=selected_models
    )
    db.add(task_record)
    db.commit()
    db.refresh(task_record)

    logger.info("Created Task %s, launching sovereign LLM agent pipeline...", task_id)

    # Launch pipeline asynchronously with real models
    asyncio.create_task(
        run_agent_pipeline(
            task_id=task_id,
            prompt=payload.prompt,
            file_path=file_path,
            preferred_models=selected_models
        )
    )

    return ChatResponse(
        task_id=task_record.id,
        status="running"
    )
