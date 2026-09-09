# Engineering & Coding Standards
## Conventional Commits, Formatting, Type Checking & Review Hygiene

---

## 1. Branching & Git Conventions
- **Main Stable Branch:** `main` (Production & SIH evaluation ready).
- **Active Development Branch:** `dev` (Integrated features).
- **Workstream Feature Branches:** `feat/ws<N>-<feature-description>`
  - e.g., `feat/ws3-adaptive-router-heuristic`
  - e.g., `feat/ws5-docker-sandbox-runner`

---

## 2. Conventional Commit Standards
All commits must follow the **Conventional Commits** specification:

```text
<type>(<scope>): <short summary>

[optional body explaining WHY the change was made]
```

### Approved Types:
- `feat`: A new user-facing capability or architectural node.
- `fix`: A bug fix in an existing capability.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves execution or retrieval latency.
- `test`: Adding missing unit, integration, or security tests.
- `docs`: Documentation updates only.
- `chore`: Build tasks, dependency updates, or formatting changes.

### Example Commit Messages:
```text
feat(router): add explainable multi-factor task heuristic
feat(rag): integrate Qdrant HNSW vector retrieval with citations
feat(sandbox): enforce --network none on Docker execution container
fix(sse): resolve event stream duplicate delivery on client reconnect
docs(adr): document ADR-001 pivot to adaptive model router
```

---

## 3. Code Formatting & Quality Tooling

### Python Backend (`backend/`)
- **Type Annotations:** Mandatory Pydantic or Python type hints on all public functions.
- **Formatter:** Black (`black --line-length 100 backend/`)
- **Linter:** Flake8 & Ruff (`ruff check backend/`)
- **Type Checker:** Mypy (`mypy backend/app/`)

### TypeScript Frontend (`frontend/`)
- **Framework:** Next.js 16 (Turbopack) with Strict TypeScript.
- **Type Safety:** `noImplicitAny: true` enforced in `tsconfig.json`.
- **Linter:** ESLint (`npm run lint`).
- **Design Rule:** 100% adherence to Black + Safety Orange industrial design tokens (`rounded-none`, `#FF6A00`). No hardcoded arbitrary rounded border radius.

---

## 4. Pull Request Review Hygiene
1. Every PR must have at least one approving review from a developer belonging to an **unrelated workstream** (enforces cross-training).
2. The author must provide proof of automated test passage before merge.
3. No PR may introduce external cloud API dependencies or unvetted external telemetry libraries.
