# Testing Strategy & Definition of Done

This document provides testing procedures and the Definition of Done (DoD) for MVP judging.

---

## 1. Definition of Done (DoD) Checklist

- [ ] **Flagship Scan Flow:** Start-to-finish execution on golden-path scan (`data/sample_scans/sample_inspection_1.png`) without manual intervention except clicking the approval checkpoint.
- [ ] **Second Scan Generalization:** Works cleanly on a secondary, un-rehearsed sample scan.
- [ ] **Coding Agent Sandbox Flow:** Computes numerical formulas from Excel and outputs verified results without crashing.
- [ ] **RAG Grounding & Citations:** Every generated recommendation cites at least one valid SOP source document.
- [ ] **AgentTrace Streaming:** Real-time UI updates show every node transition in order without silent errors.
- [ ] **Network Sentinel Air-Gap:** Counter remains strictly at `0` external calls throughout.
- [ ] **Physical Cable-Pull Test:** Pulling Ethernet/disabling Wi-Fi mid-flow causes zero disruption.
- [ ] **DOCX Template Validation:** Generated `.docx` file opens in Microsoft Word/LibreOffice with all required headings populated.
- [ ] **Backup Video:** Full clean run recorded on video as insurance before live demo slot.

---

## 2. Test Execution Commands

### Unit & Integration Tests (Backend)
```bash
cd backend
pytest tests/
```

### RAG Index & Retrieval Validation
```bash
python scripts/test_rag_retrieval.py
```

### Sandbox Execution Test
```bash
python backend/app/tools/sandbox.py --test
```
