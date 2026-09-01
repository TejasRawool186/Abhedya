# Changelog

All notable changes to the Sovereign AI Workbench will be documented in this file.

---

## [0.2.0-Workbench] - 2026-09-02

### Added & Refactored
- **Open WebUI-Inspired 3-Column AppShell Architecture:**
  - `Header.tsx`: Integrated top bar with model selection (`DeepSeek-R1 14B`, `Llama-3.3 70B`, `Qwen-2.5-Coder`), workspace navigation tabs, and real-time Air-Gap Network Enclave badge.
  - `Sidebar.tsx`: Collapsible left navigation bar featuring Quick Task templates (MRPL Hydrocracker UT Audit, Anomaly Analysis, OISD Safety Verification), task filter search, and active task history.
  - `ContextPanel.tsx`: Right inspector displaying real-time agent execution state, `ExecutionTimeline` stepper, network packet telemetry (0 Bytes egress), and hardware enclave security status.
- **Dedicated Workbench Views:**
  - `ChatContainer.tsx`: Central workspace feed with empty-state sovereign guarantee cards, message bubble rendering, and prompt composer.
  - `DocumentRepository.tsx`: Knowledge base repository for local document ingestion and vector RAG management.
  - `AuditTrailView.tsx`: Compliance audit trail viewer for operational tracking and audit log inspection.
  - `NetworkSentinelView.tsx`: Real-time enclave telemetry monitor tracking zero-egress guarantees.
- **Enhanced State & Utilities:**
  - Updated `useTaskStore.ts` with multi-model support, tab navigation, context inspector toggle, and approval state management.
  - Extended `api.ts` with missing approval, document download, and sentinel telemetry polling hooks.
  - Added `ExecutionTimeline` for real-time node-level agent execution progress.
- **Branch & Build Verification:**
  - Clean TypeScript compilation with Next.js 16.
  - Committed and pushed to remote branch `tejas`.

---

## [0.1.0-MVP] - 2026-08-22

### Added
- Complete 5-layer architecture design with local Ollama inference.
- LangGraph agentic orchestration graph for multimodal inspection document analysis.
- Two-stage dynamic model router (Regex rule-filter + LLM classifier).
- Network Sentinel connection logger & air-gap validation service.
- PostgreSQL DDL schema & Qdrant vector store integration.
- Human-in-the-loop approval checkpoint node (FR-18).
- `python-docx` industrial Approval Note generator.
- Project documentation suite in `docs/` and AI agent context in `.agent/`.
