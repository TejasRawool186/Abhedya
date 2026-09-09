# Changelog

All notable changes to the Sovereign AI Workbench will be documented in this file.

---

## [0.3.0-Abhedya] - 2026-09-09

### Architectural Realignment & Documentation Restructuring
- **Brand & Identity Realignment:**
  - Formally rebranded from working concept `OnPremisAI` to **ABHEDYA AI** ("Invulnerable / Impenetrable").
  - Adopted the defensive sovereignty shield identity with Gold, Green, and Red indicator indicators.
- **Architectural Specification Overhaul:**
  - Replaced legacy "Contextual-Bandit Model Router" claims with the deterministic, explainable **Adaptive AI Model Router** (ADR-001).
  - Formalized the **Constitutional Policy Layer** (L0–L4) replacing unbuilt "compiler" terminology (ADR-002).
  - Standardized on **LangGraph** `StateGraph` as the sole agentic orchestration engine with deterministic memory checkpoints (ADR-003).
  - Enforced the **Network-Denied Docker Execution Sandbox** (`--network none`, 512MB RAM cap) for generated Python math scripts (ADR-004).
  - Standardized on **Qdrant** as the primary sovereign HNSW vector store with tagged collection filtering (ADR-005).
  - Implemented the **Self-RAG Critique Gate** for automated factual grounding evaluation (`ISREL`, `ISSUP`) and cyclic revisions (ADR-006).
  - Implemented the **Immutable Audit Ledger** in PostgreSQL with forward-chained SHA-256 cryptographic hashes (ADR-008).
- **Documentation Restructuring:**
  - Organized `docs/` into 16 numbered directories (`01-overview` through `16-decisions`) with master navigation in `docs/README.md`.
  - Authored complete **12-Week Master Development Roadmap** across 5 phases and **6 Technical Workstreams** (eliminating developer role siloing).
  - Established team-wide cross-training curriculum (Levels 1–6) and developer rotation matrix.
  - Moved legacy, outdated files (`5_member_development_plan.md`, `MRPL_Developer_Implementation_Plan.md`, `MRPL_Sovereign_AI_Workbench_Architecture.md`, `feature_backlog_and_roadmap.md`) to `docs/archive/`.

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
