# ADR-004: Ephemeral Docker Containers for Code Execution

- **Status:** **APPROVED & ADOPTED**
- **Date:** 2026-09-09
- **Author:** Quantum Compilers Architecture Team

---

## 1. Context & Problem Statement
Engineering inspection analysis requires mathematical computation (e.g., remaining life, corrosion rates). Executing generated Python scripts on the host OS via `subprocess.run` or `exec()` exposes the workstation to Remote Code Execution (RCE), filesystem traversal, and socket leakage. Client-side execution (e.g., Pyodide in the browser) cannot handle heavy numerical libraries or persistent audit trails.

---

## 2. Decision
Execute all generated Python scripts inside an ephemeral, dedicated Docker container (`abhedya-sandbox-runner`):
- Mandatory `--network none` drops all network interfaces except loopback.
- Hard resource caps: 512MB RAM, 2.0 CPUs, 64 PIDs.
- Immutable read-only root filesystem with ephemeral memory-backed `/tmp`.
- Forced timeout termination at 10.0 seconds.

---

## 3. Consequences
- **Positive:** Complete operating system and network isolation; prevents denial of service and data exfiltration.
- **Negative:** Container spawn overhead introduces ~800ms of execution latency.

---

## 4. Security Impact
Completely eliminates code injection and remote command execution risks on the host workstation.
