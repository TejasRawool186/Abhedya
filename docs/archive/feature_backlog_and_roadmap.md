# Sovereign AI Workbench — Feature Audit & Open WebUI Gap Analysis Roadmap

**Project:** Sovereign AI Workbench for Confidential Industrial Intelligence  
**Document Version:** 2.0.0  
**Last Updated:** 2026-09-02  
**Branch:** `tejas`  

---

## 1. Executive Summary & Progress Audit

The **Sovereign AI Workbench** has completed **Phase 1 & Phase 2** of its frontend and layout overhaul, successfully implementing a 3-column high-density industrial workbench inspired by **Open WebUI**. The system is built for zero-egress, air-gapped confidential industrial intelligence (e.g., refinery SOP inspection, P&ID analysis, corrosion reporting).

This document provides:
1. **Completion Status Audit** of the current system architecture.
2. **Open WebUI Feature Gap Analysis** detailing features present in Open WebUI that are currently missing in our system.
3. **Phase 3 & 4 Roadmap Specifications** for integrating these missing capabilities into our sovereign industrial platform.

---

## 2. Completed Capabilities (Status: ✅ Done)

| Module / Component | Architecture / Implementation | Status |
| :--- | :--- | :--- |
| **AppShell Layout** | 3-Column layout (`Header`, `Sidebar`, `ChatContainer`, `ContextPanel`) | ✅ Completed |
| **Model Selection** | Multi-model selector (`DeepSeek-R1 14B`, `Llama-3.3 70B`, `Qwen-2.5-Coder`) | ✅ Completed |
| **Air-Gap Telemetry** | Real-time `NetworkSentinelView` (0 Bytes outbound egress monitoring) | ✅ Completed |
| **Document Knowledge Base** | `DocumentRepository` view with drag-and-drop local vector ingestion | ✅ Completed |
| **Audit Compliance Trail** | `AuditTrailView` tracking execution steps and operator approvals | ✅ Completed |
| **Agent Execution Trace** | Live `ExecutionTimeline` stepper with node-level progress (`ocr_extract` → `rag_search` → `recommend` → `human_checkpoint`) | ✅ Completed |
| **Human-in-the-Loop (HITL)** | `ApprovalCheckpoint` modal for Approve / Edit / Reject workflow | ✅ Completed |
| **Industrial Deliverable Gen** | `.docx` Executive Report generator & verified download component (`DownloadResult.tsx`) | ✅ Completed |
| **State Management** | Centralized Zustand `useTaskStore.ts` tracking workspace tabs, tasks, models, and telemetry | ✅ Completed |
| **Production Build** | Clean Next.js 16 / Turbopack TypeScript build passing with 0 errors | ✅ Completed |
| **Git Branching** | Pushed to remote branch `tejas` | ✅ Completed |

---

## 3. Open WebUI Feature Gap Analysis & Industrial Backlog

Based on a thorough audit of **Open WebUI** features against our current implementation, the following **8 key feature areas** are identified for integration:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                     OPEN WEBUI FEATURE GAP MATRIX FOR SOVEREIGN WORKBENCH        │
└───────────────────────────────────────────────────────────────────────────────────┘

   ┌────────────────────────────────┐         ┌────────────────────────────────┐
   │ 1. Generation Parameters Panel │         │ 2. Dual-Model Arena Comparison │
   │ • Temp, Top-P, Repeat Penalty  │         │ • Side-by-side output evaluation│
   │ • Custom System Prompt Modal   │         │ • DeepSeek vs Llama 3.3 matrix │
   └───────────────┬────────────────┘         └───────────────┬────────────────┘
                   │                                          │
                   ▼                                          ▼
   ┌────────────────────────────────┐         ┌────────────────────────────────┐
   │ 3. Voice Dictation (STT / TTS) │         │ 4. Tagged RAG Collections      │
   │ • Offline Whisper STT input    │         │ • #Hydrocracker-SOPs buckets   │
   │ • Local Piper TTS audio output │         │ • Filterable vector domains    │
   └───────────────┬────────────────┘         └───────────────┬────────────────┘
                   │                                          │
                   ▼                                          ▼
   ┌────────────────────────────────┐         ┌────────────────────────────────┐
   │ 5. Slash Prompts & Templates   │         │ 6. Full Chat Transcript Export │
   │ • '/' quick macro shortcuts    │         │ • Export `.md` and `.json` logs│
   │ • Custom SOP inspection sheets │         │ • Session import / restoration │
   └───────────────┬────────────────┘         └───────────────┬────────────────┘
                   │                                          │
                   ▼                                          ▼
   ┌────────────────────────────────┐         ┌────────────────────────────────┐
   │ 7. Inline Data Visualization   │         │ 8. Multi-Operator RBAC & Sign  │
   │ • Dynamic Plotly/Chart.js graphs│        │ • Engineer vs Manager vs Audit │
   │ • Pyodide sandbox execution    │         │ • Signed cryptographic hashes  │
   └────────────────────────────────┘         └────────────────────────────────┘
```

---

## 4. Feature Specifications & Roadmap Details

### 🎛️ Feature 1: Fine-Grained Model Generation Control Panel
* **Open WebUI Source:** Chat Settings Modal / System Parameter Sliders
* **Industrial Utility:** Allows refinery engineers to lower temperature to `0.0` for strict compliance/audit tasks (e.g. OISD safety standard checks) or raise it to `0.7` for root-cause fault investigation.
* **Spec:**
  - Add `ModelConfigModal.tsx` accessible from the Header model dropdown.
  - Sliders for: `Temperature` (0.0 – 1.0), `Top-P` (0.0 – 1.0), `Frequency Penalty`, `Max Tokens`, and `Custom System Prompt`.
  - Store parameters in `useTaskStore.ts` and pass in `POST /api/chat` payload.

---

### ⚔️ Feature 2: Multi-Model Side-by-Side Comparison (Arena View)
* **Open WebUI Source:** Dual Model Chat View / Split Screen Arena
* **Industrial Utility:** Compare reasoning outputs between reasoning models (`DeepSeek-R1`) and general coding/analysis models (`Llama-3.3-70B`) on complex engineering calculations.
* **Spec:**
  - Enable multi-selection in Header dropdown (`selectedModels: string[]`).
  - Layout switch in `ChatContainer.tsx` to render a 2-column grid when 2 models are selected.
  - Concurrent SSE stream handling in `useAgentTrace.ts` for dual-task execution.

---

### 🎙️ Feature 3: Air-Gapped Voice Dictation & Audio Response (STT / TTS)
* **Open WebUI Source:** Web Speech API & Whisper Audio Integration
* **Industrial Utility:** Field operators wearing gloves and protective gear can dictating inspection findings (e.g. "Flange F-102 showing minor surface pitting, 1.2mm depth") directly into the Workbench.
* **Spec:**
  - Add mic button to `Composer.tsx`.
  - Integrate offline local `Whisper.cpp` / Web Audio API for Speech-to-Text.
  - Add speaker toggle on `MessageBubble.tsx` using local browser TTS or offline Piper TTS daemon.

---

### 📚 Feature 4: Tagged Knowledge Base Collections (`#Collection`)
* **Open WebUI Source:** Knowledge Collections & Workspace Tagging
* **Industrial Utility:** Group uploaded documents into plant-specific RAG domains (e.g. `#Hydrocracker-SOPs`, `#Boiler-Inspection-2025`, `#Piping-Standards`).
* **Spec:**
  - Update `DocumentRepository.tsx` to support Tag Management and Collection grouping.
  - Add `@` or `#` trigger in `Composer.tsx` to filter vector search queries to specific document tags.
  - Update backend `rag/retriever.py` to accept `collection_ids` filter parameter for Qdrant payload queries.

---

### ⚡ Feature 5: Slash Commands (`/`) & SOP Prompt Template Library
* **Open WebUI Source:** Prompt Template Store & `/` Slash Command Menu
* **Industrial Utility:** Quick invocation of standard inspection templates (e.g. `/ut-audit`, `/corrosion-rate`, `/safety-permit-check`).
* **Spec:**
  - Create `src/components/chat/SlashCommandMenu.tsx` triggered when typing `/` in `Composer.tsx`.
  - Store custom prompt templates in local browser storage or PostgreSQL `prompt_templates` table.
  - Provide pre-loaded industrial templates matching MRPL operational standards.

---

### 📄 Feature 6: Full Session Transcript Export & Session Restore
* **Open WebUI Source:** Export Chat (`.json`, `.md`, `.pdf`) & Import Chat
* **Industrial Utility:** Store unformatted operational transcripts alongside official `.docx` report deliverables for permanent local audit archives.
* **Spec:**
  - Add "Export Chat" dropdown in `Header.tsx` or `ContextPanel.tsx`.
  - Options: Export as Markdown (`.md`), JSON (`.json`), or Print/PDF.
  - Support restoring past chat sessions from local backup files.

---

### 📈 Feature 7: Inline Interactive Charts & Client Sandbox Execution
* **Open WebUI Source:** Pyodide / Code Interpreter Chart Rendering
* **Industrial Utility:** Visualize thickness degradation curves, vibration time-series data, and temperature profiles directly inside chat responses.
* **Spec:**
  - Detect python chart generation or structured JSON tabular output in `MessageBubble.tsx`.
  - Embed `Recharts` / `Chart.js` components for interactive hover, zooming, and threshold line overlays (e.g. Minimum Allowable Wall Thickness line).

---

### 🔐 Feature 8: Multi-Operator Role-Based Access Control (RBAC) & Digital Sign-Off
* **Open WebUI Source:** Admin Panel, User Management & SSO
* **Industrial Utility:** Enforce 4-Eye Principle for high-risk industrial approvals (`Field Inspector` submits → `Plant Manager` approves → `Auditor` logs).
* **Spec:**
  - Add Operator Role switch in `Header.tsx` (`Inspector`, `Lead Engineer`, `Safety Auditor`).
  - Require cryptographically signed digital approval stamp in `ApprovalCheckpoint.tsx`.
  - Log operator identity and role in PostgreSQL `agent_steps` and `audit_logs`.

---

## 5. Implementation Roadmap Schedule

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           IMPLEMENTATION PHASES                                   │
└───────────────────────────────────────────────────────────────────────────────────┘

  PHASE 1 & 2 (COMPLETED)
  ├── ✅ 3-Column AppShell Layout (Header, Sidebar, ChatContainer, ContextPanel)
  ├── ✅ Core Task Routing, AgentTrace SSE Stepper & Network Sentinel (0 Egress)
  ├── ✅ DocumentRepository, AuditTrailView, NetworkSentinelView
  └── ✅ Verified Next.js 16 Production Build & Push to 'tejas' Branch

  PHASE 3 (NEXT SPRINT — USER INTERACTION & KNOWLEDGE)
  ├── 🔲 Feature 1: Model Generation Controls Panel (Temp, Top-P, System Prompt)
  ├── 🔲 Feature 4: Tagged Knowledge Base Collections (#Hydrocracker-SOPs)
  ├── 🔲 Feature 5: Slash Commands (/) & Prompt Template Library
  └── 🔲 Feature 6: Full Session Export (.md / .json)

  PHASE 4 (FUTURE SPRINT — ADVANCED INDUSTRIAL CAPABILITIES)
  ├── 🔲 Feature 2: Dual-Model Arena Comparison View
  ├── 🔲 Feature 3: Air-Gapped STT / TTS Voice Dictation
  ├── 🔲 Feature 7: Inline Interactive Charts & Plot Overlays
  └── 🔲 Feature 8: Multi-Operator RBAC & Digital Signature Sign-Off
```

---

## 6. Developer Task Assignment Updates

- **Dev 1 (Frontend Lead — Tejas):**
  - Completed: Workbench layout, `AppShell`, `ChatContainer`, `DocumentRepository`, `AuditTrailView`, `NetworkSentinelView`, Zustand state update, Next.js build validation, git push.
  - Next Tasks: Build `ModelConfigModal.tsx`, implement `/` Slash Command menu in `Composer.tsx`, and add Session Export (.md/.json).
- **Dev 2 (Backend & DB Lead):**
  - Next Tasks: Add `collection_ids` filtering to Qdrant RAG API, add `prompt_templates` DDL schema, and update `/api/chat` to receive custom temperature/parameter overrides.
- **Dev 3 (Agent Orchestration Lead):**
  - Next Tasks: Support dual-model parallel graph execution for Arena comparison view and bind operator digital signatures to `human_checkpoint`.
- **Dev 4 (Multimodal & RAG Lead):**
  - Next Tasks: Implement collection-based vector indexing and tag-based document segment retrieval.
- **Dev 5 (AI Language & Tools Lead):**
  - Next Tasks: Author prompt templates for industrial inspection shortcuts and configure chart payload output schema for inline rendering.
