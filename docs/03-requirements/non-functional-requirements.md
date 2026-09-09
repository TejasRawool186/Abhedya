# Non-Functional Requirements Specification
## Performance, Security, Reliability & Sovereignty Service Level Agreements (SLAs)

---

## 1. Non-Functional Requirements Summary

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                   NON-FUNCTIONAL REQUIREMENTS MATRIX                        │
├────────┬───────────────────────────────────────────┬────────────────────────┤
│ NFR ID │ CATEGORY                                  │ TARGET METRIC / SLA    │
├────────┼───────────────────────────────────────────┼────────────────────────┤
│ NFR-01 │ Air-Gap Data Sovereignty                  │ 0 Outbound Packets     │
│ NFR-02 │ End-to-End Workflow Latency               │ $\le 60$ Seconds       │
│ NFR-03 │ Local GPU Memory Footprint (VRAM)         │ $\le 16$ GB Allocation │
│ NFR-04 │ Vector Retrieval Precision & Latency      │ Top-3 Recall $\ge 85\%$│
│ NFR-05 │ Ephemeral Sandbox Isolation & Limits      │ 512MB RAM / 10s Timeout│
│ NFR-06 │ Cryptographic Audit Traceability          │ SHA-256 Chained Hash   │
│ NFR-07 │ High-Availability & Cold Boot Time        │ Stack Boots in $< 90$s │
│ NFR-08 │ Accessibility & Design System Compliance  │ 100% Black+Orange Theme│
└────────┴───────────────────────────────────────────┴────────────────────────┘
```

---

## 2. Detailed Quality Attributes & Constraints

### NFR-01: Air-Gap Data Sovereignty & Zero Egress
- **Target SLA:** Exactly **0 bytes** of outbound data transmitted beyond the defined host boundary during all task execution cycles.
- **Verification Method:** Verified through continuous kernel socket inspection (`/proc/net/tcp`), automated `tcpdump` packet capture, and physical disconnection of network hardware during operation.
- **Fail-Safe:** The system must never attempt an external cloud LLM fallback if a local model crashes or runs out of memory; it must fail safely with an explicit local error.

### NFR-02: End-to-End Workflow Latency
- **Target SLA:** Complete execution of the flagship multimodal inspection workflow (upload $\rightarrow$ OCR $\rightarrow$ routing $\rightarrow$ RAG retrieval $\rightarrow$ plan $\rightarrow$ tool execution $\rightarrow$ Self-RAG critique $\rightarrow$ deliverable synthesis) shall complete in **under 60 seconds** on standard demo hardware (NVIDIA RTX 4080/4090).
- **Subsystem Latency Budgets:**
  - File extraction & OCR: $\le 8\text{ seconds}$
  - Model classification & routing: $\le 3\text{ seconds}$
  - Qdrant vector retrieval: $\le 150\text{ milliseconds}$
  - LLM multi-factor reasoning: $\le 25\text{ seconds}$
  - Docker sandbox calculation: $\le 3\text{ seconds}$
  - Self-RAG critique verification: $\le 8\text{ seconds}$
  - Document synthesis (`.docx`): $\le 2\text{ seconds}$

### NFR-03: Local GPU Memory (VRAM) Footprint
- **Target SLA:** Total peak VRAM consumption during concurrent model execution shall not exceed **16GB** (enabling deployment on commodity consumer GPUs such as RTX 4080 16GB or RTX 3090 24GB).
- **Enforcement:** Ollama dynamic unloading of idle models (`keep_alive: 5m`); use of quantized 4-bit/8-bit GGUF model weights for 14B models.

### NFR-04: Vector Retrieval Precision & Recall
- **Target SLA:** Semantic vector search across the synthetic MRPL SOP corpus in Qdrant must achieve **$\ge 85\%$ top-3 recall** on statutory compliance queries (API 570, OISD-105).
- **Index Optimization:** HNSW index configured with $M=16$, $ef_{\text{construct}}=100$, and cosine distance metric using local BGE-M3 embeddings.

### NFR-05: Ephemeral Sandbox Isolation & Resource Limits
- **Target SLA:** Generated Python execution containers must be constrained to:
  - Memory: hard limit of `512MB` (OOM kill triggered immediately if exceeded).
  - CPU: throttled to maximum 2 CPU cores (`cpus: 2.0`).
  - Network: `--network none` (no external interfaces except loopback).
  - Timeout: forced SIGKILL after `10.0 seconds`.

### NFR-06: Cryptographic Audit Traceability
- **Target SLA:** Every audit event in the PostgreSQL `audit_logs` table must be sealed with a SHA-256 cryptographic digest of the current record payload appended to the prior record's hash, ensuring complete forward-integrity.

### NFR-07: Turnkey Deployment & Cold Boot Time
- **Target SLA:** From a cold host state, the entire five-service Docker Compose stack (frontend, backend, Qdrant, PostgreSQL, Ollama) must reach a fully operational and healthy state in **under 90 seconds**.

### NFR-08: Industrial Design System Compliance
- **Target SLA:** The user interface must adhere 100% to the OnPremisAI / ABHEDYA AI Black + Safety Orange design tokens (`#000000` background, `#FF6A00` safety orange accents, strict `0px` rectangular `rounded-none` borders, and high-density monospace data displays). No rounded SaaS-style cards or generic purple AI gradients.
