# Configuration Specification

All configurable options for the Sovereign AI Workbench are managed via environment variables and configuration files.

---

## 1. Environment Variables (`.env.example`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `OLLAMA_HOST` | `http://ollama:11434` | Internal URL for the Ollama inference server |
| `QDRANT_HOST` | `http://qdrant:6333` | Internal URL for Qdrant Vector Database |
| `DATABASE_URL` | `postgresql://mrpl:mrpl@postgres:5432/workbench` | PostgreSQL connection string |
| `UPLOAD_DIR` | `/app/uploads` | Local directory for storing uploaded user files |
| `GENERATED_DIR` | `/app/generated` | Storage path for output `.docx` and `.xlsx` files |
| `EMBEDDING_MODEL` | `bge-small-en` | Name of the local embedding model in Ollama |
| `REASONING_MODEL` | `qwen2.5:7b-instruct-q4_K_M` | Primary reasoning model name |
| `VISION_MODEL` | `qwen2-vl:7b` | Multimodal vision-language model name |
| `CODING_MODEL` | `qwen2.5-coder:7b` | Coding assistant model name |
| `SANDBOX_TIMEOUT_SECONDS` | `10` | Maximum execution time for sandboxed code |
| `SENTINEL_POLL_INTERVAL_MS` | `1000` | Polling frequency for Network Sentinel |

---

## 2. Docker Compose Network Configuration

To enforce structural air-gapping, Docker Compose uses an internal network bridge:

```yaml
networks:
  default:
    internal: true # Prevents Docker from creating external NAT gateway rules
```

---

## 3. Model Configuration Fallbacks (`models.yaml`)

```yaml
models:
  reasoning:
    primary: "qwen2.5:7b-instruct-q4_K_M"
    fallback_low_vram: "qwen2.5:3b"
    fallback_cpu: "llama-3.2:3b"
  vision:
    primary: "qwen2-vl:7b"
    fallback: "paddleocr_only"
  coding:
    primary: "qwen2.5-coder:7b"
    fallback: "qwen2.5-coder:1.5b"
  embeddings:
    primary: "bge-small-en"
```
