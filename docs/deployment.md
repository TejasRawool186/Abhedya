# Deployment & Sandbox Setup

The entire application runs on a single host machine via Docker Compose, isolated from the external internet.

---

## 1. Docker Compose Stack (`docker-compose.yml`)

```yaml
version: "3.8"

services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - OLLAMA_HOST=http://ollama:11434
      - QDRANT_HOST=http://qdrant:6333
      - DATABASE_URL=postgresql://mrpl:mrpl@postgres:5432/workbench
    depends_on: [ollama, qdrant, postgres]
    volumes:
      - ./data:/app/data
      - uploads:/app/uploads
      - generated:/app/generated

  ollama:
    image: ollama/ollama:latest
    volumes: ["ollama_models:/root/.ollama"]
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

  qdrant:
    image: qdrant/qdrant:latest
    volumes: ["qdrant_data:/qdrant/storage"]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: mrpl
      POSTGRES_PASSWORD: mrpl
      POSTGRES_DB: workbench
    volumes: ["pg_data:/var/lib/postgresql/data"]

networks:
  default:
    internal: true   # Eliminates external default gateway

volumes:
  ollama_models: {}
  qdrant_data: {}
  pg_data: {}
  uploads: {}
  generated: {}
```

---

## 2. Zero-Network Sandbox Runner (`sandbox-runner/Dockerfile`)

For executing dynamically generated Python code safely without network access or host escape:

```dockerfile
FROM python:3.11-slim
RUN pip install --no-cache-dir numpy pandas openpyxl scipy
USER nobody
WORKDIR /sandbox
ENTRYPOINT ["python"]
```

Execution flags:
- `--network none`
- `--cpus 1.0`
- `--memory 512m`
- `--pids-limit 64`
- 10-second timeout enforcement wrapper
