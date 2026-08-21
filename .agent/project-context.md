# Project Context for AI Coding Assistants

## 1. Project Overview
- **Project Name:** Sovereign On-Premise Agentic AI Workbench
- **Target Organization:** Mangalore Refinery and Petrochemicals Limited (MRPL)
- **Problem Statement ID:** PS ID 26117 (Smart Automation)
- **Core Mission:** Deliver a verifiably air-gapped, multi-model agentic AI workbench capable of processing confidential industrial documents, executing code in a sandbox, and generating formal approval notes with zero external network connectivity.

## 2. Architectural Constraints
- **Zero Outbound Calls:** Absolutely no network traffic to external public endpoints (OpenAI, HuggingFace runtime, etc.). All inference runs locally via Ollama (`localhost:11434`).
- **Dynamic Routing:** Requests must be routed across specialized models (`Qwen2.5-7B` for reasoning, `Qwen2-VL-7B` for vision/diagrams, `Qwen2.5-Coder-7B` for coding) rather than single generic prompting.
- **Agentic Visibility:** LangGraph execution nodes must stream intermediate state steps via SSE to the frontend `AgentTrace` component.
- **Human Checkpoint:** High-impact recommendations require human authorization via the `/api/tasks/{id}/approve` endpoint before final `.docx` generation.

## 3. Team Structure (5 Developers - Development Focus)
- **Dev 1 (Frontend Lead):** Next.js UI, Tailwind styling, Zustand store, live SSE `AgentTrace` (`frontend/`)
- **Dev 2 (Backend & DB Lead):** FastAPI gateway, SSE streaming engine, PostgreSQL DDL/ORM, file storage (`backend/app/api/`, `backend/app/db/`)
- **Dev 3 (Agent Orchestration Lead):** LangGraph StateGraph, 2-stage dynamic router, human checkpoint node, auto-retry loops (`backend/app/agent/`)
- **Dev 4 (AI/ML Multimodal & RAG):** PaddleOCR table parsing, Qwen2-VL diagram analysis, Qdrant indexer & retriever (`backend/app/rag/`, `backend/app/tools/ocr_tool.py`)
- **Dev 5 (AI Language, Tools & DocGen):** Structured JSON prompts, `python-docx` approval note generation, sandboxed code executor (`backend/app/tools/docx_writer.py`, `backend/app/tools/sandbox.py`)
