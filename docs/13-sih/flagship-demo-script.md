# SIH Flagship Demonstration Script
## 3-Minute Minute-by-Minute Golden Path Demonstration Guide

---

## 1. Demonstration Philosophy
The demonstration must tell a cohesive, grounded story that moves the judges from the **industrial challenge** to **sovereign execution**, **verification**, and **auditable delivery** in under 180 seconds.

---

## 2. Minute-by-Minute Demonstration Flow

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SIH 3-MINUTE GOLDEN PATH TIMELINE                           │
├───────────────┬───────────────────────────────┬─────────────────────────────┤
│ TIMESTAMP     │ SPEAKER NARRATIVE             │ ON-SCREEN ACTION / PROOF    │
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ 00:00 - 00:30 │ Industrial Problem & Air-Gap  │ Disconnect Wi-Fi & Ethernet;│
│               │ Challenge (MRPL Refinery).    │ Point to Sentinel: 0 Egress │
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ 00:30 - 01:15 │ Multimodal Ingestion & Model  │ Upload NDT PDF & pipe photo;│
│               │ Routing (OCR + Vision-LLM).   │ Router selects Qwen2.5-VL   │
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ 01:15 - 01:50 │ Grounded RAG & Sandboxed Math │ Vector search API 570 SOP;  │
│               │ Execution (Corrosion Rate).   │ Sandbox executes Python math│
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ 01:50 - 02:30 │ Self-RAG Fact-Checking & 4-Eye│ Self-RAG passes grounding;  │
│               │ Human Authorization.          │ Operator signs approval     │
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ 02:30 - 03:00 │ Deliverable Download & Audit  │ Open Inspection Note .docx; │
│               │ Cryptographic Proof.          │ Show SHA-256 hash in DB     │
└───────────────┴───────────────────────────────┴─────────────────────────────┘
```

---

## 3. Spoken Script & Action Checklist

### 00:00 – 00:30: The Hook & Physical Air-Gap
- **Speaker:** "Respected judges, continuous-process refineries like MRPL manage thousands of miles of hazardous high-pressure piping. One corroded pipe elbow can cause a catastrophic explosion. Cloud AI is illegal here because uploading piping diagrams breaches national infrastructure security. But manual engineering reviews take weeks."
- **Action:** *Physically unplug the Ethernet cable. Show Wi-Fi is toggled off.*
- **Visual:** Point to top bar: `Network Sentinel: AIR-GAPPED (0 Outbound Sockets)`. "Our workbench runs 100% locally. Watch."

### 00:30 – 01:15: Multimodal Ingestion & Adaptive Routing
- **Speaker:** "Our inspector uploads a real scanned ultrasonic thickness log and a photograph of pipe line HC-102-B."
- **Action:** Drag and drop `HC_102_B_UT_Inspection_Report.pdf` and `corrosion_flange.png` into Composer. Click **[ANALYZE ASSET]**.
- **Visual:** Real-time timeline streams. `ModelRouterCard` displays:
  - *Task:* `MULTIMODAL_INSPECTION`
  - *Models Selected:* `Qwen2.5-VL-7B (Vision)` + `Qwen2.5-14B (Reasoning)`
  - *Rationale:* *Scanned tabular PDF requires OCR; corrosion defect requires visual geometry analysis.*
- **Visual:** Timeline displays extracted wall thickness: `Nominal: 6.02mm · Actual: 3.20mm`.

### 01:15 – 01:50: Grounded Sovereign RAG & Sandboxed Math
- **Speaker:** "ABHEDYA AI queries our internal Qdrant knowledge base. It retrieves API 570 Clause 7.1 for in-service piping. To calculate the remaining life, the agent generates Python code executed inside a network-denied Docker sandbox."
- **Visual:** `ToolExecutionCard` shows sandbox execution output:
  - `Corrosion Rate = 0.56 mm/year`
  - `Remaining Service Life = 1.25 years` (Statutory Retirement: $2.50\text{mm}$).

### 01:50 – 02:30: Self-RAG Critique & Human Authorization
- **Speaker:** "Before an engineer sees advice, our inline Self-RAG critique gate verifies that every number is grounded in the retrieved standard."
- **Visual:** `VerificationCard` flashes green: `ISREL: 0.95 · ISSUP: 1.00 (VERIFIED)`.
- **Speaker:** "Industrial AI must never execute autonomously. Execution halts at our 4-Eye Approval Checkpoint."
- **Action:** `ApprovalCheckpoint` modal appears. Speaker clicks **Edit**, changes replacement schedule from 12 months to 6 months, enters Operator ID `OP-9921-MRPL`, and clicks **[APPROVE & SIGN]**.

### 02:30 – 03:00: Deliverable Synthesis & Tamper-Evident Audit
- **Speaker:** "The system synthesizes an official corporate document."
- **Action:** Click **[DOWNLOAD DELIVERABLE]**. Open `Inspection_Approval_Note_HC-102-B.docx` in Word.
- **Visual:** Show Word document: header metadata, NDT data table, embedded corrosion photo, API 570 citations, and SHA-256 digital stamp.
- **Speaker:** "Look at the Sentinel: throughout this entire multimodal workflow, **0 bytes left this laptop**. Every step is sealed in our cryptographic audit ledger. This is ABHEDYA AI: Intelligence that stays inside your walls."
