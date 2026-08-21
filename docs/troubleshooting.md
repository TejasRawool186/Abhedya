# Troubleshooting & Fallback Playbook

Refer to this playbook if hardware constraints, OCR errors, or network issues occur.

---

## 1. Hardware Fallbacks (Weak or No GPU)

| Component | Default (GPU 8–16GB) | Fallback (Weak / CPU-Only) | Action to Switch |
| :--- | :--- | :--- | :--- |
| **Reasoning Model** | `Qwen2.5-7B-Instruct` | `Qwen2.5-3B` or `Llama-3.2-3B` | Update `REASONING_MODEL` in `.env` |
| **Coding Model** | `Qwen2.5-Coder-7B` | `Qwen2.5-Coder-1.5B` | Update `CODING_MODEL` in `.env` |
| **Vision Model** | `Qwen2-VL-7B` | PaddleOCR only (skip image reasoning) | Toggle `SKIP_VLM=true` in `.env` |
| **Vector DB** | Qdrant (Docker) | Chroma (in-memory) | Update vector client initialization |
| **Relational DB** | PostgreSQL | SQLite (`sqlite:///./test.db`) | Update `DATABASE_URL` in `.env` |

---

## 2. Common Issues & Solutions

### Issue: Ollama model download hangs or fails during air-gap test
- **Cause:** Host is disconnected from internet before `pull_models.sh` completed.
- **Solution:** Re-connect temporarily, ensure all models are listed in `ollama list`, then re-disconnect.

### Issue: PaddleOCR table parsing fails on noisy scanned document
- **Cause:** Scan resolution too low or distorted image angles.
- **Solution:** Use pre-processed test scans in `data/sample_scans/` with balanced contrast.

### Issue: LangGraph execution hits recursion limit
- **Cause:** Cyclic loop in error-correction state.
- **Solution:** Ensure max retries in `sandbox_exec.py` is clamped to 2 iterations before routing to `error`.
