# Docker Compose Deployment Guide
## Multi-Container Enclave Orchestration, Internal Networking & GPU Configuration

---

## 1. Master Service Architecture (`docker-compose.yml`)

The production enclave runs five tightly coupled services over an isolated internal network:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: abhedya-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    networks:
      - sovereign-enclave

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: abhedya-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./data:/data
    environment:
      - DATABASE_URL=postgresql://abhedya:confidential_pw@db:5432/sovereign_db
      - QDRANT_HOST=qdrant
      - QDRANT_PORT=6333
      - OLLAMA_HOST=http://host.docker.internal:11434
    depends_on:
      - db
      - qdrant
    networks:
      - sovereign-enclave

  db:
    image: postgres:16-alpine
    container_name: abhedya-db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=abhedya
      - POSTGRES_PASSWORD=confidential_pw
      - POSTGRES_DB=sovereign_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sovereign-enclave

  qdrant:
    image: qdrant/qdrant:latest
    container_name: abhedya-qdrant
    restart: unless-stopped
    volumes:
      - qdrant_data:/qdrant/storage
    networks:
      - sovereign-enclave

networks:
  sovereign-enclave:
    driver: bridge
    internal: false # internal: true used in production deployment with host iptables drop

volumes:
  postgres_data:
  qdrant_data:
```

---

## 2. NVIDIA GPU Pass-Through Configuration
For systems with an NVIDIA discrete GPU (RTX 4080/4090), pass the GPU into the Ollama container or run Ollama natively on the host:
```bash
# Verify NVIDIA Container Toolkit installation
nvidia-smi
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi
```

---

## 3. Operational Management Commands

```bash
# Launch entire stack in background
docker compose up -d

# View live container logs
docker compose logs -f backend

# Shut down stack preserving volumes
docker compose down

# Wipe all state and reset database (DEVELOPMENT ONLY)
docker compose down -v
```
