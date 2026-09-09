# Developer Rotation Matrix & Cross-Learning Cadence
## Peer Programming, Cross-Workstream Reviews & Controlled Chaos Drills

---

## 1. Cadence of Cross-Training Activities

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       WEEKLY CROSS-LEARNING CADENCE                         │
├───────────────┬───────────────────────────────┬─────────────────────────────┤
│ DAY / CADENCE │ ACTIVITY                      │ PARTICIPANTS & FORMAT       │
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ Bi-Weekly     │ Architecture Walkthrough      │ All 6 Developers; Workstream│
│ (Even Weeks)  │ Deep Code Review              │ Lead presents internal code │
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ Weekly        │ Pair Programming Rotation     │ Paired developers (4 hours) │
│ (Mid-Week)    │ (Cross-Workstream Task)       │ working outside focus area  │
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ Continuous    │ Mandatory PR Cross-Review     │ At least 1 reviewer from an │
│ (All PRs)     │                               │ unrelated workstream        │
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ Milestone     │ Controlled Chaos Drill        │ Developers debug injected   │
│ (W8 & W10)    │ Fault Injection Testing       │ faults in foreign components│
└───────────────┴───────────────────────────────┴─────────────────────────────┘
```

---

## 2. Pair Programming Rotation Schedule

| Week | Workstream Pairings | Focus Learning Objectives |
| :---: | :--- | :--- |
| **Week 2** | WS 1 (UI) + WS 2 (Gateway) | Align SSE event consumers with FastAPI event generators. |
| **Week 3** | WS 3 (Models) + WS 4 (Multimodal) | Connect PaddleOCR table JSON outputs to the prompt input formatter. |
| **Week 4** | WS 5 (Sandbox) + WS 6 (Security) | Verify Docker container isolation flags and cgroup memory ceilings. |
| **Week 5** | WS 1 (UI) + WS 4 (RAG) | Build the interactive `RAGSourceCard` citation drawer in Next.js. |
| **Week 6** | WS 2 (Gateway) + WS 3 (Models) | Implement LangGraph cyclic revision nodes and prompt injection guards. |
| **Week 7** | WS 1 (UI) + WS 5 (HITL) | Build the interactive `ApprovalPanel` modal and review state transitions. |
| **Week 8** | WS 5 (DocGen) + WS 6 (Audit) | Embed SHA-256 audit hashes into synthesized Word documents. |
| **Week 9** | WS 2 (Gateway) + WS 6 (Sentinel) | Test Linux socket monitoring under continuous background load. |
| **Week 10**| **All Developers Rotate** | Chaos drill: diagnosing simulated OOM, network leaks, and syntax errors. |

---

## 3. The Controlled Chaos Drill (Weeks 8 & 10)
To verify diagnostic capability under pressure:
1. An instructor or lead developer injects a controlled defect into a subsystem (e.g., malformed JSON in router heuristic, infinite loop in sandbox script, corrupted PDF upload).
2. A developer from an *unrelated workstream* is given the terminal and 45 minutes to locate the root cause, explain the failure mechanism, and implement a passing test.
