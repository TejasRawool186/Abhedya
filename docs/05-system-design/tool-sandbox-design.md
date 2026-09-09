# Isolated Tool Execution Sandbox Design
## Ephemeral Container Execution, Resource Caps & Network-Denied Security

---

## 1. Threat Model & Design Requirements
In industrial AI applications, generating and executing Python code (such as structural calculations, corrosion rates, or spreadsheet analysis) is essential. However, executing unvetted AI-generated code directly on the host operating system creates critical security vulnerabilities:
- **Remote Code Execution (RCE):** Malicious prompts could attempt file system traversal or data exfiltration.
- **Resource Exhaustion (DoS):** Infinite while-loops or memory fork-bombs crashing the host system.
- **Network Egress Leakage:** Generated scripts opening outbound sockets to transmit refinery data.

To eliminate these attack vectors, all code execution in ABHEDYA AI occurs inside an **isolated, ephemeral Docker container** managed by `backend/app/tools/sandbox.py`.

---

## 2. Container Isolation Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EPHEMERAL EXECUTION SANDBOX BOUNDARY                   │
├────────────────────────────┬────────────────────────────────────────────────┤
│ Isolation Primitive        │ Docker Engine Container (Alpine / Python 3.11) │
├────────────────────────────┼────────────────────────────────────────────────┤
│ Network Mode               │ --network none (Complete network interface drop)│
├────────────────────────────┼────────────────────────────────────────────────┤
│ Memory Limit               │ --memory 512m (Hard cgroup memory ceiling)     │
├────────────────────────────┼────────────────────────────────────────────────┤
│ CPU Allocation             │ --cpus 2.0 (Throttled processor quota)         │
├────────────────────────────┼────────────────────────────────────────────────┤
│ Execution Timeout          │ 10.0 Seconds (SIGKILL on overrun)              │
├────────────────────────────┼────────────────────────────────────────────────┤
│ Filesystem Security        │ --read-only with ephemeral /tmp mounted in RAM │
├────────────────────────────┼────────────────────────────────────────────────┤
│ User Privilege             │ Non-root user (UID 10001)                      │
└────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 3. The Execution Lifecycle (`backend/app/tools/sandbox.py`)

```python
import subprocess
import tempfile
import os
from typing import Dict, Any

class DockerSandboxRunner:
    """Safely executes generated Python code inside an isolated Docker container."""
    
    SANDBOX_IMAGE = "abhedya-sandbox-runner:latest"
    TIMEOUT_SECONDS = 10.0
    
    @classmethod
    def execute_script(cls, python_code: str) -> Dict[str, Any]:
        with tempfile.TemporaryDirectory() as temp_dir:
            script_path = os.path.join(temp_dir, "script.py")
            with open(script_path, "w", encoding="utf-8") as f:
                f.write(python_code)
                
            cmd = [
                "docker", "run", "--rm",
                "--network", "none",
                "--memory", "512m",
                "--cpus", "2.0",
                "--pids-limit", "64",
                "-v", f"{script_path}:/app/script.py:ro",
                cls.SANDBOX_IMAGE,
                "python", "/app/script.py"
            ]
            
            try:
                result = subprocess.run(
                    cmd,
                    capture_output=True,
                    text=True,
                    timeout=cls.TIMEOUT_SECONDS
                )
                return {
                    "success": result.returncode == 0,
                    "stdout": result.stdout.strip(),
                    "stderr": result.stderr.strip(),
                    "exit_code": result.returncode
                }
            except subprocess.TimeoutExpired:
                return {
                    "success": False,
                    "stdout": "",
                    "stderr": "Execution timed out (exceeded 10.0s limit).",
                    "exit_code": -1
                }
```

---

## 4. Failure Modes & Automated Recovery
1. **Syntax Error / Runtime Exception:**
   - Captured in `stderr`; returned to LangGraph `execute_tool` node.
   - If retries $< 2$, the agent reformulates the Python code based on the traceback.
2. **Infinite Loop:**
   - Terminated by host process timeout at 10.0 seconds with `SIGKILL`.
   - Returns clean error message; state machine continues without hanging.
3. **Network Call Attempt:**
   - Any attempt to import `socket` and connect to an IP fails immediately with `OSError: [Errno 101] Network is unreachable`.
