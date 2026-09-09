# Adaptive AI Model Router Specification
## Explainable Multi-Factor Local Model Selection Engine

---

## 1. Architectural Intent & Correction
Earlier documentation iterations (`MRPL_Sovereign_AI_Workbench_Architecture.docx`) referenced an experimental "Contextual-Bandit Model Router". As formalized in **ADR-001**, the authoritative architecture replaces this theoretical claim with an explainable, deterministic **Adaptive AI Model Router**.

In an air-gapped industrial environment, routing must be deterministic, transparent, and reproducible to satisfy statutory auditability requirements.

---

## 2. Multi-Factor Routing Policy Formulation

The router dynamically evaluates six operational signals before dispatching inference:

$$\text{Model Selection } M^* = \arg\max_{m \in \mathcal{M}_{\text{avail}}} \mathcal{F}\Big(\text{Task Type}, \text{Modality}, \text{Complexity}, \text{Risk Level}, \text{Latency Target}, \text{VRAM Budget}\Big)$$

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADAPTIVE ROUTER DECISION FLOWCHART                       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
                       [Task Classification & File Inspection]
                                       │
                ┌──────────────────────┴──────────────────────┐
                │ Has Image / Diagram / Scanned PDF?          │
                └──────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
             YES│                             │NO
                ▼                             ▼
      [Select Qwen2.5-VL-7B]        [Evaluate Prompt Intent]
      (Vision-Language Model)                 │
                               ┌──────────────┴──────────────┐
                               │ Requires Math / Python Code?│
                               └──────────────┬──────────────┘
                                              │
                               ┌──────────────┴──────────────┐
                            YES│                             │NO
                               ▼                             ▼
                     [Select Qwen2.5-Coder]        [Evaluate Risk / Depth]
                     (Specialized Coder 7B)                  │
                                              ┌──────────────┴──────────────┐
                                              │ High Risk / Multi-Step Plan?│
                                              └──────────────┬──────────────┘
                                                             │
                                              ┌──────────────┴──────────────┐
                                           YES│                             │NO
                                              ▼                             ▼
                                    [Select Qwen2.5-14B]          [Select Qwen2.5-7B]
                                    (Heavy Reasoning Core)        (Fast General Model)
```

---

## 3. Supported Task Classes & Mapping Matrix

| Task Classification | Input Signals | Primary Model | Fallback Model | Selection Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **`MULTIMODAL_INSPECTION`** | Image (`.png`, `.jpg`) or scanned PDF attached | `Qwen2.5-VL-7B` | `Qwen2.5-7B` (OCR text only) | Visual reasoning required for corrosion pitting and diagram inspection. |
| **`ENGINEERING_REASONING`** | High-risk NDT audit, OISD compliance, root-cause | `Qwen2.5-14B` | `Llama-3-8B` | High context window and parameter depth needed for complex standards reasoning. |
| **`CODE_CALCULATION`** | Corrosion rate, remaining life, math formulas | `Qwen2.5-Coder-7B` | `Qwen2.5-7B` | Optimized code generation for sandboxed Python execution. |
| **`OPERATIONAL_QA`** | General procedure queries, SOP lookup | `Qwen2.5-7B` | `Mistral-7B` | Fast response latency and low VRAM footprint for routine plant inquiries. |
| **`DELIVERABLE_SYNTHESIS`** | Post-approval executive summary generation | `Qwen2.5-14B` | `Qwen2.5-7B` | Requires high linguistic structure and accurate citation placement. |

---

## 4. Hardware & Resource Awareness
The router interfaces directly with system telemetry to avoid GPU Out-Of-Memory (OOM) crashes:
- **VRAM Headroom Check:** If allocated VRAM exceeds 85% of total capacity, the router automatically downscales from 14B models to 4-bit quantized 7B alternatives.
- **Sequential Ingestion:** Multimodal extraction (PaddleOCR / VLM) completes and unloads before the heavy reasoning model is loaded into GPU memory.

---

## 5. UI Transparency Requirement (`ModelRouterCard`)
The routing decision is never hidden from the operator. The frontend renders a dedicated `ModelRouterCard` displaying:
1. **Task Type Badge:** e.g., `MULTIMODAL_INSPECTION` (High Priority).
2. **Selected Models:** e.g., `Qwen2.5-VL-7B (Vision)` + `Qwen2.5-14B (Reasoning)`.
3. **Routing Rationale:** *"Scanned ultrasonic report attached; requires table extraction and multi-factor compliance reasoning against API 570."*
