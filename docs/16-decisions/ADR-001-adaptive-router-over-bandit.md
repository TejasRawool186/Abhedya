# ADR-001: Adoption of Multi-Factor Adaptive Router over Contextual Bandits

- **Status:** **APPROVED & ADOPTED**
- **Date:** 2026-09-09
- **Author:** Quantum Compilers Architecture Team

---

## 1. Context & Problem Statement
Earlier conceptual documentation (`MRPL_Sovereign_AI_Workbench_Architecture.docx`) proposed a "Contextual-Bandit Model Router". Contextual bandits require continuous online reinforcement learning, reward feedback functions, and exploration policies that introduce non-deterministic model selection. In an air-gapped refinery operations enclave, stochastic model exploration is prohibited because safety-critical tasks demand deterministic, explainable behavior.

---

## 2. Decision
Adopt a deterministic, explainable **Adaptive AI Model Router** driven by a multi-factor heuristic:
1. **Task Classification:** Categorizes prompts into operational QA, multimodal inspection, coding calculation, or standards compliance.
2. **Modality Detection:** Detects attached scanned PDFs, images, or spreadsheets.
3. **Resource Awareness:** Inspects local GPU VRAM availability before dispatching heavy 14B models.
4. **Latency Budget:** Routes quick operational queries to lightweight 7B models.

---

## 3. Consequences
- **Positive:** Eliminates unsubstantiated claims; provides 100% reproducible routing decisions; renders clear explanations to operators in the UI.
- **Negative:** Does not adapt via online learning; requires manual threshold tuning when introducing new models.

---

## 4. Security Impact
Deterministic routing prevents adversarial prompt injection payloads from biasing bandit rewards to force selection of weaker models.
