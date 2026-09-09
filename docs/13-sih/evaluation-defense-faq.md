# SIH Judge Defense & Technical FAQ
## Structured Architectural Responses for Technical Evaluators

---

## 1. Core Technical Defense Themes
During the SIH evaluation, judges will test the boundaries of the system across **sovereignty**, **latency**, **safety**, and **practical industrial utility**. All six team members must be prepared to deliver precise, confident responses.

---

## 2. Frequently Asked Technical Questions

### Q1: "How can you prove this is truly air-gapped and not secretly calling an external API?"
- **Answer:** *"Respected judges, we prove sovereignty in three ways: First, look at our active Network Sentinel: it queries the Linux kernel `/proc/net/tcp` socket table and verifies 0 external connections. Second, our host firewall runs `iptables` with a default-deny policy on the output chain. Third, we are operating right now with all physical Wi-Fi and Ethernet interfaces disabled. The model weights (`Qwen2.5`, `Llama3`), embeddings, and Qdrant vector database reside 100% locally on this workstation's NVMe drive."*

### Q2: "Why not just use Open WebUI or Ollama's default web interface?"
- **Answer:** *"Open WebUI is a conversational interface; ABHEDYA AI is an autonomous industrial workflow engine. Open WebUI cannot parse scanned tabular NDT logs with PaddleOCR, execute math scripts in a network-denied Docker sandbox, evaluate factual grounding via Self-RAG, enforce a 4-Eye human approval checkpoint, or synthesize formatted corporate Word inspection reports with cryptographic audit hashes. We built an enterprise workbench, not a chatbot."*

### Q3: "What happens if the local open-weight model hallucinates and gives dangerous refinery advice?"
- **Answer:** *"We implement a three-layer safety gate: First, our Constitutional Policy restricts the model's generation temperature to 0.0 and forces grounding in retrieved SOP context. Second, our inline Self-RAG critique gate verifies that all quantitative claims have an explicit citation in the retrieved API/OISD standard; if ungrounded, it triggers an automated revision loop. Third, execution halts deterministically at our Human-in-the-Loop checkpoint—no recommendation can be published without an authorized engineer's sign-off."*

### Q4: "Why did you choose Qdrant over ChromaDB or Faiss?"
- **Answer:** *"Qdrant provides enterprise-grade HNSW indexing in a standalone, lightweight Rust binary. It natively supports rich payload filtering, allowing us to implement Tagged Collections (e.g., `#Hydrocracker-SOPs`) so semantic search can be scoped directly to relevant plant process units. Furthermore, Qdrant persists efficiently to encrypted local volumes without Python runtime overhead."*

### Q5: "How does the system handle running on consumer hardware without an A100 GPU?"
- **Answer:** *"Our Adaptive AI Model Router is resource-aware. It routes fast operational queries to quantized 7B models (~4.8GB VRAM) and loads our 14B reasoning model only when complex standards reasoning is required. Multimodal vision models unload dynamically after feature extraction. This keeps peak VRAM below 16GB, allowing the entire workbench to run smoothly on standard workstations equipped with an RTX 4080 or RTX 3090."*

### Q6: "Why did you move away from your earlier 'Contextual-Bandit' router?"
- **Answer:** *"We made a deliberate engineering decision in our architecture review (recorded in ADR-001) to eliminate academic overclaiming. In an air-gapped industrial facility, a true contextual bandit requires online exploration and external feedback loops that are inappropriate for safety-critical operations. We replaced it with an explainable, deterministic multi-factor router based on task modality, reasoning complexity, latency targets, and local VRAM budgets."*
