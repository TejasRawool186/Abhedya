# ADR-002: Formalization of Constitutional Policy Layer over Compiler Claims

- **Status:** **APPROVED & ADOPTED**
- **Date:** 2026-09-09
- **Author:** Quantum Compilers Architecture Team

---

## 1. Context & Problem Statement
Early presentation drafts referenced a "Constitutional Compiler" that allegedly compiled safety policies into binary machine-level constraints. No formal grammar, AST parser, or compiler codebase existed to substantiate this term. Continuing to claim a compiler damages technical credibility during rigorous hackathon judging.

---

## 2. Decision
Formalize governance under the **Constitutional Policy Layer**, implemented via five hierarchical tiers (L0 to L4):
- **L0:** Signed baseline policy and zero-egress invariants.
- **L1:** Role-Based Access Control (RBAC) mapping roles to permitted models and tools.
- **L2:** Context grounding constraints restricting reasoning to retrieved SOP text.
- **L3:** Verification invariants mandating Self-RAG critique passes.
- **L4:** Risk directives enforcing 4-Eye human approvals for high-risk actions.

---

## 3. Consequences
- **Positive:** Replaces an unbuilt abstraction with an auditable, Pydantic-validated policy engine.
- **Negative:** Requires explicit policy schemas rather than arbitrary natural-language policy expressions.

---

## 4. Security Impact
Establishes a verifiable perimeter ensuring operator roles cannot exceed least-privilege boundaries.
