# Dev Log: Nidhish (Dev 5 - Language, LLM & Document Intelligence Lead)

## 2026-08-23 & 2026-08-24
- **Local Sovereign LLM Integration (`backend/app/core/llm.py`)**:
  - Implemented asynchronous client for local Ollama inference (`query_ollama`, `query_ollama_json`, `get_available_models`, `pick_best_model`).
  - Added dynamic model selection and fallback matrix across on-premise SLMs/LLMs: `qwen3:4b`, `phi4-mini`, `qwen2.5:7b`, `llama3.2:3b`, `deepseek-r1:1.5b`, `mistral`.
  - Implemented automatic `<think>...</think>` tag stripping and reasoning parser for reasoning models like DeepSeek-R1 and Qwen3.
  - Implemented robust JSON extractor (`extract_json_from_text`) handling markdown code fences, unescaped JSON, and fallback dictionaries for structured node outputs.
  - Configured high-token context budget (`num_predict=2048`, `timeout=150.0s`) for industrial engineering evaluations.

- **Multimodal Document Extraction Engine (`backend/app/core/file_extractor.py`)**:
  - Engineered universal file parsing module `extract_file_content` supporting:
    - **PDF Documents** via `pypdf` with page-by-page extraction and truncation safety.
    - **Word Documents (`.docx`)** via `python-docx` with paragraph and multi-table parsing.
    - **Excel Spreadsheets (`.xlsx`, `.xls`)** via `openpyxl` with multi-sheet row samples and table detection.
    - **Structured & Plain Data**: `.csv`, `.json`, `.yaml`, `.txt`, `.log`, `.md`.
    - **Visual Inspection Metadata**: image attachment dimensions, file size, and visual inspection tagging.
  - Generated structured previews, table counts, and content chunks directly ingested into LLM reasoning nodes.

- **Sovereign Agent Pipeline & Reasoning Graph (`backend/app/api/chat.py`)**:
  - Upgraded async background pipeline worker to `run_agent_pipeline` powered by local LLM nodes:
    - **Node 1 (`classify_query`)**: LLM-based query classification (`equipment_inspection`, `root_cause_analysis`, `corrosion_study`, `sop_compliance`, `general_technical_query`, `data_analysis_code_gen`).
    - **Node 2 (`extract_document_data`)**: Dynamic file parsing and multi-table context extraction.
    - **Node 3 (`extract_findings`)**: Structured JSON extraction for equipment tag, operating parameters, severity rating, and anomaly findings.
    - **Node 4 (`retrieve_sops`)**: Domain knowledge grounding against MRPL OISD, ASME Section VIII, and API 510/570 standards.
    - **Node 5 (`compare_and_recommend`)**: Synthesis of technical evaluation, risk matrix, and operational recommendations.
    - **Node 6 (`human_checkpoint`)**: Operator gate with `Approve`, `Edit Recommendation`, and `Reject` actions.

- **Frontend Connectivity & Real-time Trace Synchronization (`frontend/src/hooks/useAgentTrace.ts`)**:
  - Connected LLM step synthesis (`compare_and_recommend`, `synthesize_response`, `code_gen`) to live chat UI.
  - Resolved chat duplication issues: added deduplication guards across SSE step streaming and human checkpoint events.
  - Ensured markdown rendering for technical reports, tables, equations, and code blocks.

- **Air-Gap Telemetry & Network Sentinel Alignment (`backend/app/api/network.py`, `backend/app/schemas/network.py`)**:
  - Updated `NetworkStatusResponse` schema and API with `blocked_attempts` to feed the frontend `NetworkSentinel` widget with live egress telemetry.

- **Testing & Verification**:
  - Updated Phase 2, Phase 3, and full backend test suites (`backend/tests/`) to support both mock mode and live Ollama LLM execution.
  - Verified 100% end-to-end pass rate across uploads, file extraction, LLM reasoning steps, SSE streaming, and human approvals.
