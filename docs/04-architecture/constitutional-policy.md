# Constitutional Policy Layer Specification
## Tiered Governance, Role Controls & Risk-Aware Execution Rules

---

## 1. Architectural Intent & Correction
Earlier documentation iterations referenced a "Constitutional Compiler". As formalized in **ADR-002**, the authoritative architecture replaces this terminology with the **Constitutional Policy Layer**. 

The policy layer establishes five strict hierarchical governance tiers (L0 to L4) that constrain what models, tools, and data can be accessed based on the active operator's role and the detected task risk.

---

## 2. Hierarchical Policy Tiers (L0 to L4)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONSTITUTIONAL POLICY HIERARCHY                          │
├────────┬─────────────────────────┬──────────────────────────────────────────┤
│ TIER   │ LEVEL NAME              │ ENFORCED CONSTRAINT                      │
├────────┼─────────────────────────┼──────────────────────────────────────────┤
│ **L0** │ Immutable Baseline      │ Cryptographic policy hash; zero-egress   │
│        │                         │ enforcement; no external cloud calls.    │
├────────┼─────────────────────────┼──────────────────────────────────────────┤
│ **L1** │ Role & Permission Rules │ RBAC permissions governing allowed tools │
│        │                         │ and model sizes per operator role.       │
├────────┼─────────────────────────┼──────────────────────────────────────────┤
│ **L2** │ Context & Evidence Rules│ Grounding constraint; models restricted  │
│        │                         │ to reasoning over verified retrieved SOPs│
├────────┼─────────────────────────┼──────────────────────────────────────────┤
│ **L3** │ Verification Gate       │ Mandatory Self-RAG critique pass prior   │
│        │                         │ to draft presentation.                   │
├────────┼─────────────────────────┼──────────────────────────────────────────┤
│ **L4** │ Risk Directives         │ Automatic 4-Eye approval requirement for │
│        │                         │ High/Critical operational recommendations│
└────────┴─────────────────────────┴──────────────────────────────────────────┘
```

---

## 3. Detailed Tier Specifications

### Tier L0: Immutable Baseline Enclave Invariants
- **Policy Hash:** The baseline policy file (`policy_l0.json`) is cryptographically signed with a SHA-256 hash verified at application startup.
- **Inviolable Rules:**
  - *Rule 0.1:* No outbound network connections may be established under any operational condition.
  - *Rule 0.2:* No raw unredacted data may be written to unencrypted storage volumes.
  - *Rule 0.3:* In case of any policy contradiction, the most restrictive safety rule takes precedence.

### Tier L1: Role-Based Access Control (RBAC) Directives

| Operator Role | Allowed Tasks | Permitted Tools | Permitted Models |
| :--- | :--- | :--- | :--- |
| **Field Inspector** | File upload, OCR extraction, query SOPs | PaddleOCR, RAG search | 7B Models (Fast) |
| **Corrosion Engineer**| Remaining life calculations, corrosion analysis | Docker sandbox, XLSX reader | 7B & 14B Models |
| **Plant Manager** | Full workflow approval, deliverable generation | All tools + DocGen writer | All Local Models |
| **Compliance Auditor**| Read-only audit trail inspection, export logs | Audit log reader | 7B Models |

### Tier L2: Context Grounding Constraints
- When a task is marked `COMPLIANCE_CRITICAL`, the policy layer enforces a zero-temperature parameter (`temperature: 0.0`) in the model invocation payload.
- System prompt injection restricts the LLM from utilizing parametric pre-training memory for quantitative standards, forcing exclusive reliance on retrieved context chunks.

### Tier L3: Verification Invariants
- Execution cannot transition from reasoning to human review without passing through the Self-RAG critique gate.
- Output failing claim support (`ISSUP = FALSE`) is blocked from display until corrected by the revision node.

### Tier L4: Risk-Adaptive Directives
Risk levels are computed dynamically based on the target asset's operational hazard level:
- **`LOW` (General SOP QA):** Automated completion permitted; deliverable generated directly.
- **`MEDIUM` (Routine Inspection Review):** Single operator acknowledgement required.
- **`HIGH` / `CRITICAL` (Pipe Derating / Shutdown Recommendation):** Execution halts deterministically; requires 4-Eye digital sign-off from Lead Engineer.
