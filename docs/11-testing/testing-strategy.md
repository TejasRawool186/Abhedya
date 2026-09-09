# Comprehensive Testing Strategy
## Unit, Integration, Sandbox Isolation & End-to-End Test Harness

---

## 1. Multi-Tier Testing Pyramid
In compliance with the **Verification Before Completion** standard, no task or milestone may be claimed complete without fresh, repeatable test evidence.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TESTING PYRAMID TIERS                            │
├────────┬───────────────────────────┬────────────────────────────────────────┤
│ TIER   │ LEVEL                     │ SCOPE & AUTOMATION TOOLING             │
├────────┼───────────────────────────┼────────────────────────────────────────┤
│ Tier 1 │ Unit Tests                │ Pytest; isolated functions & heuristics│
├────────┼───────────────────────────┼────────────────────────────────────────┤
│ Tier 2 │ Integration Tests         │ FastAPI TestClient; LangGraph flows    │
├────────┼───────────────────────────┼────────────────────────────────────────┤
│ Tier 3 │ Security Sandbox Tests    │ Docker CLI; memory limits & timeouts   │
├────────┼───────────────────────────┼────────────────────────────────────────┤
│ Tier 4 │ Air-Gap Zero-Egress Tests │ Bash + ss + tcpdump; socket monitoring │
├────────┼───────────────────────────┼────────────────────────────────────────┤
│ Tier 5 │ End-to-End System Tests   │ Playwright; golden path UI execution   │
└────────┴───────────────────────────┴────────────────────────────────────────┘
```

---

## 2. Test Execution Commands

```bash
# 1. Run all backend unit and integration tests
cd backend
pytest -v tests/

# 2. Run router heuristic tests specifically
pytest -v tests/test_router.py

# 3. Run sandbox container isolation test
pytest -v tests/test_sandbox.py

# 4. Execute zero-egress automated validation
bash scripts/verify_zero_egress.sh

# 5. Execute frontend build & type check
cd frontend
npm run build
```

---

## 3. Tier 2: StateGraph Integration Testing
Integration tests in `backend/tests/test_graph.py` verify that LangGraph transitions execute cleanly:
- **Test Case 1 (Standard Inspection Flow):** Asserts that an inspection query transitions through `classify` $\rightarrow$ `ingest` $\rightarrow$ `retrieve` $\rightarrow$ `plan` $\rightarrow$ `tool` $\rightarrow$ `critique` $\rightarrow$ `human_checkpoint`.
- **Test Case 2 (Revision Trigger):** Injects an ungrounded claim into the draft state; asserts that the critique node returns `issup_score < 0.80` and successfully routes to `revise_recommendation`.
- **Test Case 3 (Approval Execution):** Posts `POST /api/tasks/{id}/approve`; asserts that the graph resumes execution and writes the `.docx` file to `/data/deliverables/`.

---

## 4. Tier 3: Sandbox Vulnerability & Stress Testing
Automated security tests in `backend/tests/test_sandbox.py` execute adversarial payloads inside the sandbox container:
1. **Network Escape Test:** Script attempting `urllib.request.urlopen("http://8.8.8.8")` asserts `OSError: Network is unreachable`.
2. **Infinite Loop Test:** Script executing `while True: pass` asserts termination at $10.0\pm 0.5$ seconds with exit code $-1$.
3. **Memory Exhaustion Test:** Script allocating $1\text{GB}$ array asserts termination via Linux OOM killer within the $512\text{MB}$ limit.
4. **Filesystem Write Test:** Script attempting `open('/etc/test.txt', 'w')` asserts `ReadOnlyFilesystemError`.
