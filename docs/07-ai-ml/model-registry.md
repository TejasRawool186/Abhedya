# Sovereign Model Registry & Inference Runtime
## Local Open-Weight Models, Quantization Tiers & Ollama Integration

---

## 1. Local Runtime Engine
All artificial intelligence models in ABHEDYA AI execute 100% locally via an **Ollama daemon** (`ollama/ollama:latest`) running inside the isolated Docker network or on the host loopback (`localhost:11434`). The system enforces a strict architectural rule: **no code path may attempt remote cloud LLM fallback.**

---

## 2. Supported Open-Weight Model Matrix

| Model Identifier | Parameter Count | Quantization | Context Window | Primary Task Assignment | VRAM Footprint |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **`qwen2.5:14b`** | 14.7B | Q4_K_M (GGUF) | 32,768 | Heavy Engineering Reasoning, Standards Compliance, Root-Cause Analysis | ~9.2 GB |
| **`qwen2.5:7b`** | 7.6B | Q4_K_M (GGUF) | 32,768 | Fast Operational QA, Task Classification, Rationale Synthesis | ~4.8 GB |
| **`qwen2.5-vl:7b`** | 7.6B | FP16 / Q8 | 8,192 | Multimodal Defect Analysis, Scanned Drawing & Diagram Inspection | ~6.5 GB |
| **`qwen2.5-coder:7b`**| 7.6B | Q4_K_M (GGUF) | 16,384 | Sandboxed Python Generation, Mathematical Calculations | ~4.9 GB |
| **`bge-m3`** | 568M | FP16 (Local) | 8,192 | Dense & Multi-Vector Semantic Embeddings for Sovereign RAG | ~1.2 GB |

---

## 3. Dynamic Configuration Registry (`backend/app/core/config.py`)

Model assignments are decoupled from application code and managed via configuration:

```yaml
# Enclave Model Registry
models:
  reasoning:
    provider: "ollama"
    model_name: "qwen2.5:14b"
    fallback_name: "qwen2.5:7b"
    temperature: 0.1
    max_tokens: 2048

  vision:
    provider: "ollama"
    model_name: "qwen2.5-vl:7b"
    temperature: 0.0
    max_tokens: 1536

  coding:
    provider: "ollama"
    model_name: "qwen2.5-coder:7b"
    temperature: 0.0
    max_tokens: 1024

  embedding:
    provider: "local_fastembed"
    model_name: "BAAI/bge-m3"
```

---

## 4. Model Pre-Warming & VRAM Management
To satisfy hackathon demo latency targets and prevent OOM faults:
- **Pre-Warming:** On container boot, a warm-up prompt is sent to `qwen2.5:7b` to pre-load weights into GPU memory.
- **Model Eviction:** Unused models are unloaded after 5 minutes of inactivity (`keep_alive: 5m`).
- **Sequential Ingestion:** VLM visual inspection unloads before the 14B reasoning model is loaded for report synthesis.
