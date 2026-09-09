# PS ID 26117 · MRPL · Smart Automation
# Sovereign On-Premise Agentic AI Workbench
## Open-Weight Multimodal LLMs for Confidential Industrial Work
### Refined Architecture & Implementation Playbook
*for Mangalore Refinery and Petrochemicals Limited (MRPL)*

| Theme | Smart Automation |
| :--- | :--- |
| **Category** | Software |
| **Organization** | Mangalore Refinery and Petrochemicals Limited (MRPL) |
| **Core claim to prove** | Zero external network calls, end-to-end, on camera |

---

## 1. Executive Summary

MRPL's problem statement is not really asking for “a chatbot on a local model.” It is asking for proof of **three separate hard claims** at once:
1. A system can automatically use the **right model** for the right job,
2. That system can **act** — plan, call tools, use a sandbox, produce a real file — not just answer in text, and
3. It can do all of that with **verifiably zero** outbound network traffic.

Most hackathon teams will build a RAG chatbot with a nice UI and call it a day. That does not satisfy any of the three claims above on its own, and it will not win against a team that stages a live “pull the ethernet cable” demo.

This document refines the SRS you already drafted into a **buildable, judged, and demo-optimized** plan: a leaner architecture that a 4–6 person team can actually finish inside a hackathon window, a concrete tech-stack with fallback options if GPU hardware at the venue is weak, a day-by-day build order, and a scripted demo that hits every one of MRPL's stated judging hooks in under 6 minutes.

---

## 2. Refining the Problem — What the Judges Are Actually Scoring

Read literally, the problem statement scores four things, in this order of weight:

* **Sovereignty proof** — a visible, undeniable demonstration that no data or request left the machine. This is the single line that appears twice in the brief (*“that's the actual proof of the sovereign claim, not just a statement of it”*). Treat it as the headline feature, not an appendix.
* **Model routing across genuinely different task types** — not two prompts to the same model with different system prompts. Judges will ask “how did it decide?” and expect a real classifier or rule engine, not a coin flip.
* **Agentic, multi-step execution** — visible planning, visible tool calls, visible intermediate state. A single LLM call that “feels smart” is not agentic.
* **A real deliverable file** — a `.docx` (or `.xlsx`) that a refinery engineer could plausibly attach to an email, generated from a scanned, messy input document.

Everything else in the original SRS — RBAC, audit dashboards, admin panels, multi-user auth — is **real product scope, not hackathon scope**. Building those first is the most common way teams run out of time before they build the one thing that actually gets marked. Section 10 below draws a hard line between what to build now and what to fake or defer.

---

## 3. Winning Strategy — Differentiators

### 3.1 Make sovereignty a feature, not a footnote
* Build a visible, live-updating “Network Sentinel” panel in the UI that counts outbound connections in real time (see Section 8).
* Script the demo so that literally pulling the Ethernet/Wi-Fi mid-demo is the climax, and the workbench keeps working.
* Log every single tool/model call with a timestamp and destination = `localhost`, and show that log on screen.

### 3.2 Make routing legible, not magical
* Show the router's decision as a small on-screen trace: *“Classified as: vision + retrieval → routed to Qwen2-VL + bge-embed”*. A visible decision beats a correct-but-invisible one for judging.

### 3.3 Make the agent's plan visible
* Stream each step of the LangGraph plan into the UI as it happens (*“OCR running…”* → *“Searching SOPs…”* → *“Drafting note…”*), the same pattern used by Claude/Cursor — judges recognize it instantly as “agentic” even before reading the code.

### 3.4 Anchor everything in one flagship use case
* Pick **ONE** end-to-end flow — *scanned inspection report → approval note* — and make it flawless. A second use case (coding agent) is a bonus, not a co-equal priority. Depth on one flow beats breadth across five half-working ones.

---

## 4. System Architecture (Hackathon-Scoped)

This trims the original SRS architecture to what a small team can actually wire together and defend live. Five layers, each independently demoable:

```text
┌────────────────────────────────────────────────────────────┐
│  1. UI  (Next.js)                                          │
│     Chat + file upload + live agent-trace + Network Sentinel│
└───────────────────────────┬────────────────────────────────┘
                            │  localhost only
┌───────────────────────────▼────────────────────────────────┐
│  2. API Gateway  (FastAPI)                                 │
│     /chat  /upload  /task/{id}/stream  /network/status     │
└───────────────────────────┬────────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────────┐
│  3. Orchestration (LangGraph)                              │
│   Classifier ─▶ Router ─▶ Planner ─▶ Tool-loop ─▶ Composer │
└───────┬───────────────┬───────────────┬────────────────────┘
        │               │               │
┌───────▼──────┐ ┌──────▼───────┐ ┌─────▼────────┐
│ 4a. Model pool││ 4b. Tool belt ││ 4c. RAG store │
│ Ollama-served ││ OCR / Sandbox ││ Qdrant +      │
│ Qwen2.5, Qwen ││ python-docx / ││ local embed   │
│ 2-VL, embed   ││ openpyxl      ││ model         │
└───────────────┘└───────────────┘└───────────────┘
                            │
┌───────────────────────────▼────────────────────────────────┐
│  5. Sentinel  (network namespace + firewall, not just UI)  │
│     iptables/ufw DROP-all-egress + syscall/conn logger     │
└────────────────────────────────────────────────────────────┘
        EVERYTHING ABOVE RUNS IN ONE DOCKER COMPOSE STACK,
                NO CONTAINER HAS INTERNET EGRESS
```

> **Key simplification vs. original SRS:** **no separate auth/RBAC service, no admin console, no auditor role** for the hackathon build — those are named as future roadmap in the pitch deck instead (judges respond well to *“we know what production needs, here is why we scoped it out for the demo”*).

---

## 5. Technology Stack — With Fallbacks

Choose the smallest stack that is (a) fully open-weight, (b) runs offline, and (c) has good docs so debugging doesn't eat the clock. Primary picks assume a single mid-range GPU (8–16GB VRAM); fallbacks assume CPU-only or a laptop.

| Layer | Primary Choice | Fallback (Weak / No GPU) | Why |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js + React + Tailwind | same | Fast to build, matches Tejas's existing stack |
| **Backend / API** | Python + FastAPI | same | Async streaming for agent trace, easy tool wiring |
| **Agent framework** | LangGraph | Manual state machine (dict-based) | Explicit graph = visible plan for demo |
| **Local inference** | Ollama | Ollama with 1B–4B quantized models | One-command model pulls, works fully offline once pulled |
| **Reasoning LLM** | Qwen2.5-7B-Instruct (Q4) | Qwen2.5-3B / Llama-3.2-3B | Strong reasoning per VRAM, good instruction following |
| **Coding LLM** | Qwen2.5-Coder-7B | Qwen2.5-Coder-1.5B | Best small open coding model class |
| **Vision / OCR model** | Qwen2-VL-7B (or 2B) | PaddleOCR only | Handles both OCR-style and diagram description in one |
| **Dedicated OCR** | PaddleOCR / Tesseract | Tesseract only | Table + layout extraction on scans |
| **Embeddings** | `bge-small-en` (local) | same (tiny, runs on CPU) | Fast, no GPU required |
| **Vector DB** | Qdrant (Docker) | Chroma (in-process) | Both trivial to run locally |
| **Relational DB** | PostgreSQL | SQLite | Task/audit metadata |
| **Sandbox** | Docker container, no network | subprocess + resource limits (`ulimit`) | Isolation for generated code |
| **Doc generation** | `python-docx`, `openpyxl` | same | Matches FR-15/16 exactly |
| **Network isolation** | Docker network (no gateway) + `iptables` | OS-level firewall rules only | Proof needs to be structural, not just a dashboard |
| **Deployment** | Docker Compose, single machine | same | Judges can literally unplug the router |

---

## 6. Model Router — Concrete Design

A two-stage router keeps this both explainable and reliable on stage:

* **Stage 1 — Rule pre-filter (deterministic, instant):** File MIME type + a handful of regex/keyword checks on the prompt (*“write a function”*, *“calculate”*, *“.py”* → coding; image/PDF-with-images present → vision path). This alone resolves ~70% of routing correctly and is instant — good for the demo's snappy feel.
* **Stage 2 — LLM classifier fallback:** For ambiguous prompts, a single fast call to the small reasoning model with a structured-JSON system prompt (*“respond ONLY with {task_type, needs_vision, needs_rag, needs_sandbox}”*) decides the route.

### Route Table to Demo on Stage:

| User Intent (Example) | Detected `task_type` | Model(s) Engaged | Tools Engaged |
| :--- | :--- | :--- | :--- |
| *“Summarize this SOP”* | `doc_reasoning` | Qwen2.5-7B | RAG search |
| *“Analyze this scanned inspection report and draft an approval note”* | `multimodal_agentic` | Qwen2-VL + Qwen2.5-7B | OCR, RAG, docx-writer |
| *“Write Python to compute pressure drop from this Excel”* | `coding_agentic` | Qwen2.5-Coder-7B | xlsx-reader, sandbox |
| *“What does clause 4.2 of the safety SOP say?”* | `rag_qa` | Qwen2.5-7B + `bge-embed` | RAG search only |

---

## 7. Agentic Workflow — Flagship Flow

**Flagship use case:** *“Analyze this scanned inspection report and prepare an approval note.”*

Implemented as an explicit LangGraph state graph so every node can stream a status line to the UI:

```text
upload_doc
   │
   ├──▶ classify_task            ("multimodal_agentic")
   ├──▶ ocr_extract              (PaddleOCR: text + layout + tables)
   ├──▶ vision_analyze           (Qwen2-VL: diagrams / photos / handwriting)
   ├──▶ extract_findings         (Qwen2.5-7B: structured findings JSON)
   ├──▶ rag_search_sop           (Qdrant: top-k relevant SOP chunks + citations)
   ├──▶ compare_and_recommend    (Qwen2.5-7B: findings vs SOP → recommendation)
   ├──▶ human_checkpoint         (approve / edit / reject — FR-18)
   ├──▶ generate_docx            (python-docx: Approval Note template)
   ├──▶ validate_output          (re-open file, check required sections present)
   └──▶ present_result           (download link + full trace log)
```

> **The `human_checkpoint` node matters for judging:** it directly satisfies FR-18 (*“no automatic high-impact action without authorization”*) and it is also a natural place to pause for the live demo narration.

---

## 8. Sovereignty Proof — The Feature That Wins This

Do this at two levels so the claim can't be waved away as “just a UI element”:

### 8.1 Structural (The Real Proof)
* Run the whole Compose stack on a Docker network with `internal: true` (no gateway to the host's internet-facing NIC).
* Add an explicit `iptables`/`ufw` egress-DROP rule on the host as a second layer, logging any blocked attempt.
* All models pre-pulled into Ollama's local model store before the demo; no “model download” calls can happen at runtime.

### 8.2 Visible (The Demo Proof)
* A small Network Sentinel service tails connection syscalls (or reads `/proc/net/tcp`) and streams a live counter to the UI:  
  **`External connections: 0 • Data uploads: 0 • Status: ✔ AIR-GAPPED`**
* Mid-demo: physically disconnect the network cable / disable Wi-Fi, then run the flagship flow again in front of judges. Same result, same speed.

> This section alone maps directly onto MRPL's own words in the brief:  
> *“That's the actual proof of the sovereign claim, not just a statement of it.”*

---

## 9. Data Model (Trimmed for MVP)

| Entity | Key Fields | Notes |
| :--- | :--- | :--- |
| `Task` | `id`, `prompt`, `task_type`, `status`, `selected_model`, `created_at` | One row per user request |
| `AgentStep` | `id`, `task_id`, `node_name`, `tool`, `input`, `output`, `ts` | Powers the live trace UI + audit log |
| `Document` | `id`, `filename`, `type`, `storage_path`, `uploaded_by`, `ts` | Uploaded + generated files |
| `KnowledgeChunk` | `id`, `document_id`, `content`, `embedding`, `source_ref` | Synthetic SOP corpus for RAG demo |
| `NetworkEvent` | `id`, `ts`, `direction`, `dest`, `allowed(bool)` | Feeds the Sentinel panel |

---

## 10. MVP Scope — Build This, Defer That

### 10.1 Build (Demo-Critical)
* [x] Rule + LLM-fallback router across ≥ 3 task types
* [x] Flagship agentic flow end-to-end (scan → findings → SOP match → approval note `.docx`)
* [x] OCR + vision understanding on a real scanned/photographed document
* [x] Local RAG over a small synthetic SOP set with visible citations
* [x] Sandboxed code-execution flow as a secondary demo beat
* [x] Live agent-trace UI + Network Sentinel
* [x] Structural network isolation you can prove by unplugging a cable

### 10.2 Fake / Stub (Mention as Roadmap, Don't Build)
* **Full RBAC with 4 distinct roles** — hardcode a single demo login instead
* **Admin console for adding/removing models** — show a `models.yaml` file and say *“adding a model is a one-line config change”*
* **Full audit dashboard with filters/search** — a scrolling trace log is enough
* **PDF generation (FR-17)** — keep `.docx`/`.xlsx` only, mention PDF as trivial follow-on
* **Multi-GPU / multi-node scaling** — mention in architecture slide only

---

## 11. Build Plan (36–48-Hour Hackathon Window)

| Phase | Hours | Owner Focus | Deliverable at End of Phase |
| :--- | :--- | :--- | :--- |
| **0. Setup** | 0–2 | Whole team | Repo, Docker Compose skeleton, Ollama models pulled, Qdrant + Postgres up |
| **1. Core plumbing** | 2–8 | Backend | FastAPI gateway, file upload, basic chat round-trip to one local model |
| **2. Router + multi-model** | 8–14 | Backend | Rule + LLM classifier routing to ≥ 3 models correctly |
| **3. OCR + Vision** | 10–18 | AI/ML | Scanned doc → extracted text + layout; vision model describing an image |
| **4. RAG** | 14–20 | AI/ML | Synthetic SOP corpus indexed; grounded, cited answers |
| **5. Agent graph** | 16–26 | Backend + AI | LangGraph flagship flow wired end-to-end, streaming steps |
| **6. Doc generation** | 20–26 | Backend | `python-docx` Approval Note template filled from agent output |
| **7. Sandbox coding path** | 22–28 | Backend | Second flow: `xlsx` read → generated Python → sandbox run → result |
| **8. Sentinel + isolation** | 18–30 (parallel) | DevOps-minded | Compose network locked down, `iptables` rule, live counter API |
| **9. Frontend** | 6–32 (parallel) | Frontend (Tejas) | Chat UI, upload, live trace panel, Sentinel widget, download flow |
| **10. Integration + hardening** | 30–36 | Whole team | All flows work back-to-back without restarts; error states handled |
| **11. Demo rehearsal** | 36–42 | Whole team | Timed run-through incl. the cable-pull moment, fix rough edges |
| **12. Deck + doc polish** | 40–46 | Whole team | Pitch deck, this document trimmed to a 1-pager, backup video recorded |

> **Insurance policy:** Record a full clean run of both flows (including the network-pull moment) on video by hour ~40, before the live-demo slot, in case of venue Wi-Fi/AV issues. Judges accept a backup video far better than a broken live demo.

---

## 12. Suggested Team Split (6 people)

| Role | Owns | Suggested Fit |
| :--- | :--- | :--- |
| **Frontend lead** | Next.js UI, live trace panel, Sentinel widget, upload/download UX | Tejas — matches existing React/Next.js + Zustand experience |
| **Backend / orchestration lead** | FastAPI gateway, LangGraph graph, routing logic | Strongest Python/async teammate |
| **AI/ML — language** | Prompting, structured-output reliability, coding-agent path | Teammate comfortable with LLM prompting/eval |
| **AI/ML — multimodal** | OCR pipeline, vision model integration, RAG indexing | Teammate comfortable with CV/embeddings |
| **Infra / sovereignty** | Docker Compose, network isolation, Sentinel backend, GPU setup | Teammate comfortable with Docker/networking |
| **Docs generation + demo lead** | `python-docx` template, demo script, pitch deck, timing | Whoever is strongest presenter |

---

## 13. Demo Script (Target: 5–6 Minutes)

* **0:00–0:30** — State the problem in MRPL's own terms: confidential P&IDs, financials, correspondence can't touch cloud AI. Show the blank Network Sentinel: `0 external connections`.
* **0:30–1:30** — Upload a scanned inspection report. Narrate the live trace as it appears: `classify` → `OCR` → `vision` → `findings` → `SOP search with citations` → `recommendation`.
* **1:30–2:15** — Hit the human-approval checkpoint, approve it, watch the `.docx` generate and open it — a real, readable approval note.
* **2:15–3:00** — Switch task: paste/upload an Excel file, ask for a Python calculation. Show routing switch to the coding model and sandboxed execution with a visible result.
* **3:00–4:00** — **The centerpiece:** physically unplug the network cable / kill Wi-Fi on stage. Re-run (or continue) either flow. Same result, Sentinel still at `0` external connections throughout.
* **4:00–4:45** — 30-second architecture recap slide: multi-model routing, agentic tool use, local RAG, structural network isolation — explicitly mapped back to MRPL's four judging hooks from Section 2.
* **4:45–5:30** — Close with roadmap: RBAC, admin console, audit dashboard, PDF export, multi-GPU scaling — shows you scoped deliberately, not because you ran out of time.

---

## 14. Risk Register

| Risk | Likelihood | Mitigation |
| :--- | :--- | :--- |
| **Venue GPU is weaker than expected** | Medium | Fallback model sizes pre-tested in Section 5; keep a CPU-only profile ready |
| **OCR/vision accuracy on a messy scan is poor on stage** | Medium | Pre-select and lightly pre-process 2–3 known-good sample docs; keep one as rehearsed golden path |
| **LangGraph learning curve eats build time** | Low–Medium | Fallback: hand-rolled Python state machine with the same node names |
| **Live network-pull demo fails to impress** | Medium | Make the Sentinel counter and a terminal ping/curl failure both visible simultaneously |
| **Integration breaks night before demo** | High (always) | Freeze feature work by hour ~34; hours 34–42 are integration + rehearsal only, no new features |

---

## 15. How This Maps to the Original SRS

Every functional requirement in your uploaded SRS (FR-01 through FR-25) is still architecturally supported by this design — authentication, RBAC, full audit trail, admin model management, PDF export, and scale-out are all natural extensions of the same LangGraph + FastAPI + Docker Compose core.

This document simply reorders the roadmap so the hackathon build spends 100% of its limited hours on the four things in Section 2 that are actually judged, and defers the remaining production-hardening requirements to an explicit, clearly-communicated “next phase” slide.\n