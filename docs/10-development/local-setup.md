# Local Developer Environment Setup
## Prerequisites, Repository Configuration, Model Pulling & Stack Initialization

---

## 1. Prerequisites
- **Operating System:** Ubuntu 22.04 / 24.04 LTS, Windows 11 with WSL2, or macOS (Apple Silicon).
- **Node.js:** v20.x or later (`npm` v10+).
- **Python:** v3.11.x or later (`pip`, `venv`).
- **Docker:** Docker Engine 25.0+ and Docker Compose v2.20+.
- **Ollama:** v0.3.0+ running locally on port 11434.
- **Hardware Minimum:** 16GB RAM, 50GB free disk space; dedicated NVIDIA GPU recommended.

---

## 2. Step-by-Step Setup Guide

### Step 1: Clone Repository & Configure Environment
```bash
git clone https://github.com/TejasRawool186/Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence.git
cd Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence

# Copy environment configurations
cp backend/.env.example backend/.env
```

### Step 2: Pull Sovereign Models via Ollama
Ensure your local Ollama daemon is running (`ollama serve`), then pull the required open-weight models:
```bash
# Pull essential baseline models
ollama pull qwen2.5:7b
ollama pull qwen2.5:14b
ollama pull qwen2.5-coder:7b
ollama pull qwen2.5-vl:7b
```

### Step 3: Launch Supporting Infrastructure via Docker Compose
Start the isolated PostgreSQL database and Qdrant vector store:
```bash
docker compose up -d db qdrant
```

### Step 4: Setup & Run FastAPI Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

# Run database migrations and start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Verify backend health: `curl http://localhost:8000/health` (should return `{"status": "ok"}`).

### Step 5: Setup & Run Next.js Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:3000` to view the standalone landing page, or `http://localhost:3000/workbench` to open the operational workbench.

---

## 3. Seed Knowledge Corpus
To populate the local Qdrant vector store with synthetic MRPL SOPs:
```bash
python scripts/seed_sops.py
```
This indexes the documents located in `data/sample_sops/` into Qdrant collection `sovereign_sops`.
