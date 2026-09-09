# ADR-003: Selection of LangGraph as Sole Agent Orchestration Framework

- **Status:** **APPROVED & ADOPTED**
- **Date:** 2026-09-09
- **Author:** Quantum Compilers Architecture Team

---

## 1. Context & Problem Statement
The initial backend implementation relied on a linear procedural async script in `backend/app/api/chat.py`. While simple, procedural scripts cannot support:
1. Cyclic revision loops required when verification fails.
2. Deterministic pause/resume semantics required for human authorization gates.
3. Checkpointed state persistence to survive server restarts.

---

## 2. Decision
Adopt **LangGraph** (`langgraph>=0.2.0`) as the exclusive framework for all agentic workflows:
- Workflows are declared and compiled as explicit `StateGraph` instances.
- State is encapsulated in an immutable, Pydantic-validated `WorkbenchState`.
- Checkpoints are backed by PostgreSQL, enabling clean resume on `POST /api/tasks/{id}/approve`.

---

## 3. Consequences
- **Positive:** True cyclic execution; robust interrupt checkpoints; clean visual alignment with real-time SSE steppers.
- **Negative:** Adds `langgraph` dependency; requires explicit state migration if state schema changes.

---

## 4. Security Impact
State immutability prevents cross-task memory pollution and prompt poisoning across task lifecycles.
