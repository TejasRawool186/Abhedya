# Zero-Egress Enclave Architecture & Network Sentinel
## Defense-in-Depth Air-Gap Isolation, Socket Telemetry & Host Firewall Enforcement

---

## 1. Architectural Definition & Principles
A "Zero-Egress Enclave" is an operational compute environment where outbound network transmission is physically or cryptographically impossible. In ABHEDYA AI, data sovereignty is not merely a UI claim; it is enforced across **five distinct architectural layers**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FIVE-LAYER ZERO-EGRESS DEFENSE STACK                     │
├────────────────────────────┬────────────────────────────────────────────────┤
│ Layer 1: Network Hardware  │ Physical disconnect (Wi-Fi off, RJ45 unplugged)│
├────────────────────────────┼────────────────────────────────────────────────┤
│ Layer 2: Host Firewall     │ iptables / ufw default-deny outbound rules     │
├────────────────────────────┼────────────────────────────────────────────────┤
│ Layer 3: Container Network │ Docker internal bridge network (no gateway)    │
├────────────────────────────┼────────────────────────────────────────────────┤
│ Layer 4: Execution Sandbox │ Ephemeral containers spawned with --net none   │
├────────────────────────────┼────────────────────────────────────────────────┤
│ Layer 5: Active Sentinel   │ Continuous Linux socket inspection daemon      │
└────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 2. Layer-by-Layer Enforcement Mechanisms

### Layer 1: Physical Disconnection
- For live demonstrations and high-assurance industrial environments, physical network interfaces (Wi-Fi adapters and Ethernet cables) are powered down or disconnected.
- The entire system (frontend, backend, database, vector store, and model weights) resides locally on the workstation.

### Layer 2: Host Operating System Firewall (`iptables`)
- Outbound network packets are dropped at the Linux kernel level:
  ```bash
  # scripts/enforce_airgap.sh
  iptables -P OUTPUT DROP
  iptables -A OUTPUT -o lo -j ACCEPT
  iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
  # Allow internal Docker bridge traffic only
  iptables -A OUTPUT -d 172.16.0.0/12 -j ACCEPT
  ```

### Layer 3: Docker Internal Bridge Network
- In `docker-compose.yml`, services communicate over a custom isolated bridge network with the external gateway disabled:
  ```yaml
  networks:
    sovereign-enclave:
      internal: true
      driver: bridge
  ```

### Layer 4: Ephemeral Execution Sandbox
- Generated Python code (corrosion calculations) is spawned in a separate container with network access completely disabled:
  ```bash
  docker run --rm --network none --memory 512m --cpus 2.0 sandbox-runner python script.py
  ```

### Layer 5: Active Network Sentinel Daemon
- The `NetworkSentinelMonitor` (`backend/app/network_sentinel/monitor.py`) polls system socket states every 2 seconds:
  - Inspects `/proc/net/tcp` and `/proc/net/tcp6` in Linux environments.
  - Queries `psutil.net_connections(kind='inet')` across active processes.
  - Flags any connection whose destination IP address is not RFC-1918 private (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) or loopback (`127.0.0.1`, `::1`).

---

## 3. Real-Time Telemetry API (`/api/network/status`)

```json
{
  "air_gapped": true,
  "outbound_bytes_sent": 0,
  "active_sockets": 3,
  "blocked_attempts": 0,
  "node_name": "SOVEREIGN-MRPL-ENCLAVE-01",
  "interfaces": {
    "eth0": "DOWN",
    "wlan0": "DOWN",
    "docker0": "ACTIVE_INTERNAL"
  },
  "last_checked": "2026-09-09T10:14:00Z"
}
```

---

## 4. UI Sentinel Widget (`NetworkSentinelView`)
The top bar of the ABHEDYA AI Workbench continuously renders the **Sentinel Widget**:
- **Status Badge:** `● AIR-GAPPED (VERIFIED)` in bright green monospace.
- **Connection Counter:** `Outbound Sockets: 0 · Egress: 0 KB`.
- **Alert State:** If an outbound socket attempt occurs, the widget immediately pulses red and triggers an audible alert: `SECURITY ALERT: OUTBOUND CONNECTION DETECTED`.
