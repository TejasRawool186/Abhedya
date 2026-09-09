# ABHEDYA AI — Documentation Master Hub
## Sovereign AI Workbench for Confidential Industrial Intelligence

> **SIH Problem Statement:** SIH26117 | **Theme:** Smart Automation | **Category:** Software  
> **Target Facility Context:** Mangalore Refinery and Petrochemicals Limited (MRPL)  
> **Team:** Quantum Compilers | **Repository:** `Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence`  
> **Core Promise:** *Intelligence that stays inside your walls.*

---

## 1. Navigating This Documentation

This directory contains the canonical technical documentation, architectural specifications, security models, and the 12-week engineering roadmap for **ABHEDYA AI**. All documents reflect the post-architecture-change baseline established in [`new_plan.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/new_plan.md).

```
docs/
├── README.md                                 # ← YOU ARE HERE: Master Navigation Hub
├── 01-overview/                              # Product Charter, Identity & Industrial Context
│   ├── product-charter.md                    # Core promise, brand evolution (OnPremisAI → ABHEDYA AI)
│   └── industrial-context.md                 # MRPL refinery operations, NDT inspection, OISD standards
├── 02-problem-statement/                     # SIH26117 Problem & Market Analysis
│   ├── sih-problem-statement.md              # SIH26117 breakdown, constraints, evaluation criteria
│   └── competitive-landscape.md              # Comparison vs. Open WebUI, Dify, Palantir AIP
├── 03-requirements/                          # Formal Specifications
│   ├── functional-requirements.md            # Detailed FR-01 through FR-12 specifications
│   └── non-functional-requirements.md        # Latency, air-gap SLA, VRAM budgets, security standards
├── 04-architecture/                          # Canonical System Architecture
│   ├── architecture-overview.md              # Authoritative 9-layer system blueprint & data flow
│   ├── adaptive-router.md                    # Multi-factor model routing heuristic specification
│   ├── constitutional-policy.md              # Tiered governance rules (L0–L4) specification
│   └── zero-egress-enclave.md                # Network isolation, sentinel socket poller, firewall rules
├── 05-system-design/                         # Detailed Subsystem Engineering
│   ├── orchestrator-langgraph.md             # StateGraph schemas, nodes, conditional edges, checkpoints
│   ├── tool-sandbox-design.md                # Docker execution runner, resource limits, security sandbox
│   └── audit-ledger-design.md                # Cryptographic hash chains, tamper-evident SQL schema
├── 06-data/                                  # Data Architecture & Storage
│   ├── database-schema.md                    # PostgreSQL DDL, SQLAlchemy models, migration strategy
│   └── corpus-management.md                  # Synthetic MRPL SOPs, inspection manuals, P&IDs
├── 07-ai-ml/                                 # AI, Models & Inference
│   ├── model-registry.md                     # Supported open-weight models, quantization, Ollama tags
│   ├── multimodal-pipeline.md                # PaddleOCR, Qwen2.5-VL, ColPali integration architecture
│   ├── hybrid-rag.md                         # Qdrant HNSW vector search, chunking, GraphRAG links
│   └── self-rag-verification.md              # Critique prompts, ISREL/ISSUP scoring, revision loops
├── 08-security/                              # Security & Trust Architecture
│   ├── threat-model.md                       # STRIDE matrix, trust boundaries, attack surface analysis
│   └── security-controls.md                  # Input sanitization, least privilege, zero-egress tests
├── 09-apis/                                  # Communication Protocols & Contracts
│   ├── api-reference.md                      # OpenAPI specs, REST endpoints, JSON payload schemas
│   └── sse-event-specs.md                    # Server-Sent Events stream specification & node types
├── 10-development/                           # Engineering Guides
│   ├── local-setup.md                        # Prerequisites, Ollama model pulling, environment setup
│   └── coding-standards.md                   # Conventional commits, formatting, type checking
├── 11-testing/                               # Quality Assurance & Verification
│   ├── testing-strategy.md                   # Unit, integration, sandbox isolation, and mock suites
│   └── zero-egress-validation.md             # Automated air-gap and physical disconnect test scripts
├── 12-deployment/                            # Production Enclave Deployment
│   ├── compose-deployment.md                 # Docker Compose configuration, GPU pass-through
│   └── airgap-packaging.md                   # Offline bundle creation, pre-pulled weights packaging
├── 13-sih/                                   # SIH Demonstration & Evaluation
│   ├── flagship-demo-script.md               # Minute-by-minute golden path demo flow
│   ├── backup-contingency-plan.md            # Pre-recorded video runs, fallback mock switches
│   └── evaluation-defense-faq.md             # Technical defense answers for hackathon judges
├── 14-roadmap/                               # Execution Plan & Workstreams
│   ├── 12-week-development-plan.md           # Master weekly schedule and delivery gates (Weeks 1–12)
│   └── workstream-definitions.md             # Scope, inputs, outputs for all 6 workstreams
├── 15-team-knowledge/                        # Cross-Training & Mastery
│   ├── cross-training-curriculum.md          # Multi-level explanation guides (Levels 1–6)
│   └── rotation-matrix.md                    # Cross-review, pair programming, and learning cadence
├── 16-decisions/                             # Architecture Decision Records (ADRs)
│   ├── ADR-001-adaptive-router-over-bandit.md
│   ├── ADR-002-constitutional-policy-layer.md
│   ├── ADR-003-langgraph-orchestrator.md
│   ├── ADR-004-docker-sandbox-execution.md
│   ├── ADR-005-qdrant-vector-database.md
│   ├── ADR-006-self-rag-verification-gate.md
│   ├── ADR-007-abhedya-ai-rebranding.md
│   └── ADR-008-postgresql-audit-ledger.md
├── dev/                                      # Individual Developer Engineering Logs
└── archive/                                  # Deprecated & Superseded Historical Documents
```

---

## 2. Reading Paths by Audience

### 👨‍💻 New Developer Joining the Project
1. Start with [`01-overview/product-charter.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/01-overview/product-charter.md) to understand the mission and why cloud AI is prohibited.
2. Review [`04-architecture/architecture-overview.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/04-architecture/architecture-overview.md) to learn the 9 system layers and data flows.
3. Follow [`10-development/local-setup.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/10-development/local-setup.md) to boot the local development environment.
4. Study [`14-roadmap/workstream-definitions.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/14-roadmap/workstream-definitions.md) and [`15-team-knowledge/cross-training-curriculum.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/15-team-knowledge/cross-training-curriculum.md).

### 🛡️ Industrial Safety & Security Auditor
1. [`04-architecture/zero-egress-enclave.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/04-architecture/zero-egress-enclave.md) — Network boundary and firewall controls.
2. [`08-security/threat-model.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/08-security/threat-model.md) — Attack surfaces, STRIDE assessment, and trust boundaries.
3. [`05-system-design/audit-ledger-design.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/05-system-design/audit-ledger-design.md) — SHA-256 cryptographic audit chaining.
4. [`11-testing/zero-egress-validation.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/11-testing/zero-egress-validation.md) — Repeatable air-gap test procedures.

### 🏆 SIH Hackathon Evaluator / Judge
1. [`02-problem-statement/sih-problem-statement.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/02-problem-statement/sih-problem-statement.md) — Problem-to-solution mapping for SIH26117.
2. [`04-architecture/architecture-overview.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/04-architecture/architecture-overview.md) — Technical differentiators (Zero-Egress Sentinel, Adaptive Router, Self-RAG).
3. [`13-sih/flagship-demo-script.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/13-sih/flagship-demo-script.md) — Minute-by-minute demonstration flow.
4. [`13-sih/evaluation-defense-faq.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/13-sih/evaluation-defense-faq.md) — Answers to core technical defense inquiries.

---

## 3. Authoritative Architectural Principles

1. **Strict Sovereignty (Air-Gapped):** 100% on-premise execution using local open-weight models (`Qwen2.5`, `Llama3`, `DeepSeek`). Zero external cloud API calls.
2. **Explainable Adaptivity:** Multi-factor routing (modality, reasoning complexity, resource availability) without unverified claims of "contextual bandits".
3. **Multimodal Engineering Intelligence:** Vision-native document understanding (PaddleOCR, Qwen2.5-VL, ColPali) handling scanned NDT logs and engineering drawings.
4. **Factual Grounding & Verification:** Sovereign RAG anchored in local SOPs with inline Self-RAG critique checking retrieval relevance (`ISREL`) and claim grounding (`ISSUP`).
5. **Human Control & Auditability:** High-risk actions halt at a Human-in-the-Loop checkpoint; all decisions and outputs are cryptographically hashed into an immutable audit ledger.
