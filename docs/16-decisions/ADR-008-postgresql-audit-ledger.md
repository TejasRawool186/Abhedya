# ADR-008: PostgreSQL Cryptographically Chained Audit Ledger

- **Status:** **APPROVED & ADOPTED**
- **Date:** 2026-09-09
- **Author:** Quantum Compilers Architecture Team

---

## 1. Context & Problem Statement
Industrial safety compliance directives (OISD-105, ISO 27001) mandate an auditable, non-repudiable log of all automated decisions, safety advice, and human operator approvals. Standard application database logs can be surreptitiously edited or deleted by database administrators, failing regulatory audit integrity standards.

---

## 2. Decision
Implement an **Immutable Audit Ledger** in PostgreSQL using cryptographic SHA-256 hash chaining:
- Each audit record includes a `previous_hash` and computes `current_hash = SHA-256(previous_hash + payload + metadata)`.
- Any unauthorized update or row deletion breaks the mathematical hash chain, immediately exposing tampering.
- Generated `.docx` reports embed the SHA-256 hash in their header for cross-verification.

---

## 3. Consequences
- **Positive:** Legally defensible, tamper-evident auditability without the overhead or complexity of distributed blockchain networks.
- **Negative:** Additional compute overhead for hashing each event payload during high-throughput tasks.

---

## 4. Security Impact
Guarantees non-repudiation and detects retroactive log alteration, satisfying statutory safety requirements.
