# Smart India Hackathon: SIH26117 Analysis
## Sovereign On-Premise Agentic AI Workbench using Open-Weight Multimodal LLMs for Confidential Industrial Work

---

## 1. Official Problem Statement Metadata
- **Problem Statement ID:** SIH26117
- **Theme:** Smart Automation
- **Category:** Software
- **Assigned Ministry / Organization:** High-Hazard Industrial Sector (Refinery & Petrochemicals Domain)
- **Team:** Quantum Compilers
- **Authoritative Solution Name:** **ABHEDYA AI**

---

## 2. Problem Statement Decomposition

### Core Challenge
Industrial organizations handling sensitive, mission-critical operations cannot utilize commercial cloud-based Large Language Models (LLMs) due to data privacy, intellectual property protection, and national security mandates. However, manual technical evaluation of unstructured multimodal data (scanned logs, P&IDs, operational manuals) results in critical maintenance backlogs, human oversight errors, and delayed response to asset degradation.

### User Personas & Stakeholders
1. **Plant Inspection Engineer (Primary Operator):** Uploads daily ultrasonic testing (UT) thickness logs and field inspection photos; requires automated anomaly detection and remaining life estimation.
2. **Lead Corrosion / Reliability Engineer (Approver):** Evaluates AI-generated maintenance recommendations against statutory codes (API 570, OISD-105); provides binding 4-Eye digital approval.
3. **Plant Safety & Compliance Auditor (Auditor):** Inspects historical audit logs and execution traces to verify compliance with national safety directives and data isolation laws.
4. **Enclave Systems Administrator (DevOps/SecOps):** Deploys and monitors the on-premise hardware stack, ensuring zero network leakage and maximum local GPU utilization.

---

## 3. Strict SIH Technical Constraints
To achieve a top-tier evaluation score, the solution must strictly adhere to these boundary conditions:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SIH26117 MANDATORY CONSTRAINTS                        │
├────────────────────────────┬────────────────────────────────────────────────┤
│ 1. 100% Air-Gapped         │ Must run with zero active outbound Internet    │
│                            │ connections (verifiable via tcpdump/Sentinel). │
├────────────────────────────┼────────────────────────────────────────────────┤
│ 2. Open-Weight Models Only │ Prohibited from utilizing proprietary APIs     │
│                            │ (OpenAI, Anthropic, Google Gemini Cloud).      │
├────────────────────────────┼────────────────────────────────────────────────┤
│ 3. Multimodal Capability   │ Must ingest and interpret scanned documents,   │
│                            │ handwritten logs, and engineering diagrams.    │
├────────────────────────────┼────────────────────────────────────────────────┤
│ 4. Grounded Citations      │ All advice must be verifiable against local    │
│                            │ SOPs and standards without hallucination.      │
├────────────────────────────┼────────────────────────────────────────────────┤
│ 5. Human Oversight Gate    │ High-impact actions must not be autonomous;    │
│                            │ require Human-in-the-Loop review & sign-off.   │
├────────────────────────────┼────────────────────────────────────────────────┤
│ 6. Auditable Deliverables  │ Must generate real enterprise deliverables     │
│                            │ (.docx/.xlsx) with cryptographic hash traces.  │
└────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 4. Innovation & Competitive Differentiation
1. **Explainable Adaptive Model Routing:** Dynamically selects the most suitable local open-weight model based on task complexity, modality, latency targets, and local VRAM budgets.
2. **Vision-Native Document Understanding:** Combines PaddleOCR for tabular parsing and Qwen2.5-VL for visual defect inspection, avoiding generic plain-text loss of structure.
3. **Inline Self-RAG Critique Gate:** Implements algorithmic verification of retrieval relevance (`ISREL`) and claim grounding (`ISSUP`) before human presentation.
4. **Network-Denied Docker Sandbox:** Safely executes generated Python math scripts inside an isolated container with `--network none` and strict resource caps.
5. **Visible Zero-Egress Sentinel:** Provides real-time Linux kernel socket telemetry proving zero outbound data transfer during live operations.
