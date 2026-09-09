# SIH Demonstration Backup & Contingency Plan
## Redundancy Architecture, Pre-Recorded Video Runs & Failure Recovery

---

## 1. Hackathon Reality & Contingency Philosophy
Live hackathon presentations face unpredictable hazards: power outages, projector resolution mismatches, GPU thermal throttling, and OS driver conflicts.

ABHEDYA AI implements a **Three-Tier Failover Protocol** ensuring that the presentation succeeds under any technical failure.

---

## 2. The Three Failover Tiers

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THREE-TIER CONTINGENCY ARCHITECTURE                   │
├────────┬───────────────────────────┬────────────────────────────────────────┤
│ TIER   │ MODE                      │ TRIGGER CONDITION                      │
├────────┼───────────────────────────┼────────────────────────────────────────┤
│ Tier 1 │ Primary Live Execution    │ Standard presentation state; all local │
│        │ (100% Air-Gapped Laptop)  │ models and services healthy.           │
├────────┼───────────────────────────┼────────────────────────────────────────┤
│ Tier 2 │ Standby Cloned Laptop     │ Primary laptop experiences OS crash,   │
│        │ (Hot Standby Enclave)     │ thermal throttling, or hardware fault. │
├────────┼───────────────────────────┼────────────────────────────────────────┤
│ Tier 3 │ 4K Screen-Captured Video  │ Both laptops fail or presentation time │
│        │ + Physical Word Artifacts │ restricted to under 90 seconds.        │
└────────┴───────────────────────────┴────────────────────────────────────────┘
```

---

## 3. Tier 2: Secondary Hot-Standby Machine
- A secondary identical laptop is maintained running the exact same stack (`docker compose up -d`).
- Seeded with the same synthetic SOP corpus and cached Ollama model weights.
- Switching HDMI cables takes under 10 seconds.

---

## 4. Tier 3: 4K Master Video & Physical Deliverables
- A high-resolution, unedited 4K video recording of the complete 3-minute golden path execution is stored on the local desktop (`~/Desktop/ABHEDYA_GOLDEN_DEMO_4K.mp4`).
- **Physical Deliverables:** Three printed, spiral-bound copies of the generated `Inspection_Approval_Note.docx` report are brought to the judging table so judges can physically inspect the final output while the video plays.

---

## 5. Failure-Specific Action Protocol

| Failure Event | Immediate Remediation Action | Spoken Response to Judges |
| :--- | :--- | :--- |
| **GPU OOM (Out-of-Memory)** | Backend automatically downscales to 4-bit `qwen2.5:7b` via router fallback. | "Our Adaptive Router detected high memory pressure and gracefully downscaled to our lightweight 7B model." |
| **Ollama Daemon Hangs** | Run quick restart script: `systemctl restart ollama` or switch to Tier 2 laptop. | "Switching to our secondary hot-standby node." |
| **Projector Resolution Bug** | Press `Ctrl + -` / `Ctrl + +` in browser; Next.js `AppShell` automatically adapts. | Seamless visual adjustment. |
| **File Upload Stalls** | Click **[DEMO MODE: PRESET 1]** in the composer to load cached inspection payload. | "Triggering our pre-loaded refinery asset profile." |
