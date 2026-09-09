# Product Charter: ABHEDYA AI
## Sovereign On-Premise Agentic AI Workbench for Confidential Industrial Intelligence

---

## 1. Executive Summary
**ABHEDYA AI** (derived from the Sanskrit word for *invulnerable*, *impenetrable*, and *unbreakable*) is an on-premise, multi-model agentic AI workbench purpose-built for continuous-process industrial environments such as petroleum refineries, petrochemical plants, and defense manufacturing facilities.

The platform processes high-hazard, confidential operational inputs—ranging from scanned ultrasonic Non-Destructive Testing (NDT) logs to Piping and Instrumentation Diagrams (P&IDs)—entirely within the enterprise's physical or air-gapped network boundary. It combines local open-weight large language models, multimodal computer vision, vector knowledge retrieval, network-denied code execution sandboxes, automated fact-checking, and mandatory human authorization checkpoints to produce verified, auditable engineering deliverables.

---

## 2. Core Value Proposition & Tagline

> ### *"Intelligence that stays inside your walls."*

While modern enterprises seek the productivity benefits of generative AI, high-hazard facilities face existential risks if confidential operational data leaves their private boundary:
1. **National Critical Infrastructure Vulnerability:** Leaked refinery layouts or vulnerability logs can be exploited by foreign adversaries.
2. **Proprietary Process Theft:** Uncontrolled distribution of proprietary catalyst formulations, crude blend optimizations, or operating envelopes.
3. **Catastrophic Hallucination:** Autonomous execution of ungrounded engineering advice in chemical process units, risking fatal industrial explosions.

ABHEDYA AI eliminates these risks by enforcing five fundamental invariants:
- **Sovereignty:** No outbound network packets; verifiably operational with physical network interfaces disconnected.
- **Adaptivity:** Dynamically assigns the optimal local open-weight model based on task modality, reasoning complexity, and local GPU VRAM budgets.
- **Agency:** Autonomous planning and multi-step execution beyond basic chat conversational interfaces.
- **Verification:** Inline self-critique (Self-RAG) assessing retrieval relevance and factual grounding before presenting advice.
- **Human Oversight:** High-risk operational decisions halt deterministically until signed off by an authorized human engineer.

---

## 3. Brand & Project Evolution

| Attribute | Legacy Working Concept | Authoritative Baseline (`ABHEDYA AI`) |
| :--- | :--- | :--- |
| **Product Name** | OnPremisAI | **ABHEDYA AI** |
| **Visual Identity** | Isometric 3D wireframe cube | **Defensive Shield with segmented Gold, Green, and Red sovereignty indicators** |
| **Team Name** | Quantum Compilers | **Quantum Compilers** |
| **Primary Theme** | Smart Automation (SIH26117) | **Smart Automation (SIH26117)** |
| **Target Audience** | Generic industrial operators | **Inspection Engineers, Plant Managers, Safety Auditors (MRPL Context)** |
| **Core Architecture** | Linear RAG Chatbot | **9-Layer Multi-Model Agentic Orchestration Enclave** |

---

## 4. Key Performance Invariants

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        ABHEDYA AI ARCHITECTURAL INVARIANTS                      │
├──────────────────────────┬──────────────────────────────────────────────────────┤
│ Zero External Egress     │ Exactly 0 outbound network bytes during execution    │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ 100% Local Inference     │ Powered by Ollama hosting Qwen2.5, Llama3, DeepSeek  │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ Multimodal Ingestion     │ Native OCR (PaddleOCR) & Vision-Language (Qwen2.5-VL)│
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ Grounded Evidence        │ All advice cited to internal SOPs indexed in Qdrant  │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ Isolated Execution       │ Code math executed in Docker with --network none     │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ Fact-Checking Gate       │ Inline Self-RAG scoring retrieval & claim support    │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ 4-Eye Approval           │ Graph execution halts until operator signs decision  │
├──────────────────────────┼──────────────────────────────────────────────────────┤
│ Cryptographic Audit      │ SHA-256 hash chains recorded for all system events   │
└──────────────────────────┴──────────────────────────────────────────────────────┘
```
