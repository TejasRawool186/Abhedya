# Getting Started

Follow this setup guide to bootstrap the Sovereign AI Workbench locally in a single-machine environment.

---

## 1. Prerequisites

- **Host OS:** Linux (Ubuntu 22.04+ recommended) or Windows with WSL2 / Docker Desktop
- **GPU:** NVIDIA GPU with 8GB–16GB VRAM (CUDA 12+ / NVIDIA Container Toolkit)
  - *CPU-only / Low VRAM Fallback:* Supported via smaller quantized models (see [Troubleshooting](troubleshooting.md))
- **Software Dependencies:**
  - Docker & Docker Compose v2+
  - Python 3.11+
  - Node.js 18+ (for local frontend dev)

---

## 2. One-Time Setup Workflow (Online Phase)

Run these steps **once** while connected to the internet before air-gapping the system for demo or production.

### Step 1: Start Core Infrastructure
```bash
docker compose up -d ollama qdrant postgres
```

### Step 2: Pre-pull Open-Weight Models into Ollama
Run the automated model pulling script to cache all model weights locally:
```bash
bash scripts/pull_models.sh
```
*Models pulled:*
- `qwen2.5:7b-instruct-q4_K_M` (Reasoning & general routing)
- `qwen2.5-coder:7b` (Code synthesis & calculations)
- `qwen2-vl:7b` (Multimodal diagram & scan analysis)
- `bge-small-en` (Local embedding model)

### Step 3: Seed Synthetic SOP Knowledge Base
Extract, chunk, embed, and index synthetic SOP documents into Qdrant:
```bash
python scripts/seed_rag.py
```

### Step 4: Flip Network to Air-Gapped Mode
Edit `docker-compose.yml` to ensure the internal network restriction is active:
```yaml
networks:
  default:
    internal: true # Disables default gateway to the internet
```
Rebuild and launch the full stack:
```bash
docker compose up -d --build
```

---

## 3. Verifying Local Installation

1. **Web UI:** Navigate to `http://localhost:3000`
2. **API Health:** Check `http://localhost:8000/api/network/status` (Sentinel should report `status: AIR-GAPPED` and `external_connections: 0`)
3. **Run Golden Path Demo:** Upload `data/sample_scans/sample_inspection_1.png` and verify agentic trace stream.
