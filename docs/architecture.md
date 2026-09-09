# System Architecture (Reference Pointer)

> **AUTHORITATIVE NOTE:** This document has been superseded by the post-architecture-change canonical specifications. Please refer to:
> - **Primary System Architecture Blueprint:** [`docs/04-architecture/architecture-overview.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/04-architecture/architecture-overview.md)
> - **Adaptive Model Router Specification:** [`docs/04-architecture/adaptive-router.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/04-architecture/adaptive-router.md)
> - **Constitutional Policy Layer:** [`docs/04-architecture/constitutional-policy.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/04-architecture/constitutional-policy.md)
> - **Zero-Egress Enclave & Sentinel:** [`docs/04-architecture/zero-egress-enclave.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/04-architecture/zero-egress-enclave.md)
> - **LangGraph Orchestrator StateGraph:** [`docs/05-system-design/orchestrator-langgraph.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/05-system-design/orchestrator-langgraph.md)

---

## The 9-Layer Sovereign Architecture Summary

```
[UI: ABHEDYA Workbench] ──► [FastAPI Gateway] ──► [Zero-Egress Sentinel] ──► [Adaptive Model Router]
                                                                                     │
[Deliverables (.docx)] ◄── [HITL 4-Eye Gate] ◄── [Self-RAG Critique] ◄── [LangGraph StateGraph Core]
          │                                                                      │
          └─────────────► [PostgreSQL Immutable Audit Ledger] ◄───────────────────┘
```

For the comprehensive, detailed architecture specification with sequence diagrams, trust boundaries, and component interaction matrices, see [`docs/04-architecture/architecture-overview.md`](file:///d:/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence/docs/04-architecture/architecture-overview.md).
