# ADR-006: Implementation of Self-RAG Verification Gate

- **Status:** **APPROVED & ADOPTED**
- **Date:** 2026-09-09
- **Author:** Quantum Compilers Architecture Team

---

## 1. Context & Problem Statement
Directly displaying raw LLM-generated recommendations in safety-critical refinery operations introduces catastrophic risk. If an ungrounded hallucination recommends delaying maintenance on a thin-walled pipe, physical rupture may occur. A mechanism is required to automatically inspect and critique answers before human presentation.

---

## 2. Decision
Implement an inline **Self-RAG Critique Gate** as a mandatory evaluation node in LangGraph:
- Assesses retrieval relevance (`ISREL`) and factual claim grounding (`ISSUP`).
- If `ISSUP < 0.80`, the graph automatically branches to a revision node (up to 2 retries).
- Output failing revision is explicitly flagged as `VERIFICATION_FAILED` and escalated to mandatory human engineering review.

---

## 3. Consequences
- **Positive:** Automated detection and correction of hallucinations; prevents unverified advice from reaching the UI.
- **Negative:** Adds ~6–8 seconds of latency for the critique pass; does not provide a 100% mathematical guarantee of absolute truth.

---

## 4. Security Impact
Drastically reduces the risk of AI-induced industrial accidents caused by hallucinated standards or incorrect formulas.
