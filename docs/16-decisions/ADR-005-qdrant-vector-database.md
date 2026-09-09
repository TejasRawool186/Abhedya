# ADR-005: Standardization on Qdrant as Primary Sovereign Vector Store

- **Status:** **APPROVED & ADOPTED**
- **Date:** 2026-09-09
- **Author:** Quantum Compilers Architecture Team

---

## 1. Context & Problem Statement
Early documentation mentioned both ChromaDB and Qdrant. Maintaining dual vector database backends creates dependency bloat, divergent indexing strategies, and split testing efforts. A single high-performance, air-gappable vector engine is needed.

---

## 2. Decision
Standardize exclusively on **Qdrant** (`qdrant/qdrant:latest`) running as an independent service in Docker:
- Utilizes Rust-native HNSW vector indexing for sub-50ms query response.
- Supports native payload metadata filtering, enabling Tagged Knowledge Collections (`#Hydrocracker`, `#Boiler-Inspection`).
- Persists reliably to encrypted local disk volumes without Python runtime dependencies.

---

## 3. Consequences
- **Positive:** Single unified vector backend; superior retrieval speed; native support for tagged collection filtering.
- **Negative:** Requires running a dedicated Docker container service on port 6333.

---

## 4. Security Impact
Qdrant is bound strictly to the internal Docker bridge network with no host port exposure in production enclaves.
