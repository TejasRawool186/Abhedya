# Air-Gap Offline Packaging Guide
## Pre-Enclave Bundling, Model Weight Extraction & Sneakernet Deployment

---

## 1. Overview & Objectives
Deploying into a true air-gapped facility (such as an oil refinery server room or a secure defense bunker) precludes running `docker pull`, `pip install`, or `npm install` on the target machine.

This guide details the procedure for packaging the entire ABHEDYA AI stack into an **offline installer bundle** that can be transported via an encrypted, scanned USB drive.

---

## 2. Packaging Procedure (On Connected Build Machine)

### Step 1: Export Docker Images
```bash
mkdir -p /tmp/abhedya_offline_bundle/images

# Build local application images
docker compose build

# Save all container images to tar archives
docker save -o /tmp/abhedya_offline_bundle/images/frontend.tar abhedya-frontend:latest
docker save -o /tmp/abhedya_offline_bundle/images/backend.tar abhedya-backend:latest
docker save -o /tmp/abhedya_offline_bundle/images/postgres.tar postgres:16-alpine
docker save -o /tmp/abhedya_offline_bundle/images/qdrant.tar qdrant/qdrant:latest
docker save -o /tmp/abhedya_offline_bundle/images/sandbox.tar abhedya-sandbox-runner:latest
```

### Step 2: Package Pre-Pulled Ollama Model Weights
```bash
mkdir -p /tmp/abhedya_offline_bundle/models

# Archive local Ollama blobs and manifests (~25GB)
tar -czvf /tmp/abhedya_offline_bundle/models/ollama_weights.tar.gz -C ~/.ollama .
```

### Step 3: Bundle Repository & Assets
```bash
# Package application source, scripts, and sample SOPs
tar -czvf /tmp/abhedya_offline_bundle/source.tar.gz \
  --exclude="node_modules" \
  --exclude="venv" \
  --exclude=".git" \
  .
```

---

## 3. Installation Procedure (On Target Air-Gapped Machine)

```bash
# 1. Unpack source files
tar -xzvf source.tar.gz
cd Sovereign_AI_Workbench_for_Confidential_Industrial_Intelligence

# 2. Load Docker container images
for img in /path/to/bundle/images/*.tar; do
    docker load -i "$img"
done

# 3. Restore Ollama model weights
mkdir -p ~/.ollama
tar -xzvf /path/to/bundle/models/ollama_weights.tar.gz -C ~/.ollama

# 4. Boot stack and seed knowledge store
docker compose up -d
docker compose exec backend python scripts/seed_sops.py

# 5. Enforce host firewall
sudo bash scripts/enforce_airgap.sh
```
The workbench is now fully operational at `http://localhost:3000/workbench` with zero external connectivity.
