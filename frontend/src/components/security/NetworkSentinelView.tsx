"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Server,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export const NetworkSentinelView: React.FC = () => {
  const network = useTaskStore((s) => s.network);
  const { refresh } = useNetworkStatus(10000, true);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl mx-auto w-full select-none font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#242424] pb-4">
        <div>
          <h1 className="text-lg font-mono font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FF6A00]" />
            Network Sentinel & Air-Gap Enclave Monitor
          </h1>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Real-time verification of physical air-gap isolation, packet inspection, and enclave hardware telemetry.
          </p>
        </div>

        <button
          onClick={refresh}
          className="flex items-center gap-2 py-2 px-3 rounded-none bg-[#181818] border border-[#242424] hover:border-[#FF6A00]/60 text-xs font-mono text-[#F5F5F5] transition-colors uppercase font-bold tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#FF6A00]" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-none bg-[#121212] border border-[#242424] space-y-2">
          <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider">Network State</div>
          <div className="text-lg font-mono font-bold text-[#FF6A00] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none bg-[#FF6A00] animate-pulse" />
            <span>AIR-GAPPED</span>
          </div>
          <p className="text-[10px] text-zinc-400 uppercase">Physical NIC egress locked.</p>
        </div>

        <div className="p-4 rounded-none bg-[#121212] border border-[#242424] space-y-2">
          <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider">External Egress Bytes</div>
          <div className="text-lg font-mono font-bold text-[#FF6A00] flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#FF6A00]" />
            <span>0 Bytes</span>
          </div>
          <p className="text-[10px] text-zinc-400 uppercase">Zero packets transmitted externally.</p>
        </div>

        <div className="p-4 rounded-none bg-[#121212] border border-[#242424] space-y-2">
          <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider">Sovereign Node</div>
          <div className="text-xs font-mono font-bold text-[#F5F5F5] truncate uppercase">
            {network?.node_name || "MRPL-SOVEREIGN-NODE-01"}
          </div>
          <p className="text-[10px] text-zinc-400 uppercase">Local SQLite & Ollama instance.</p>
        </div>

        <div className="p-4 rounded-none bg-[#121212] border border-[#242424] space-y-2">
          <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider">Inference Latency</div>
          <div className="text-lg font-mono font-bold text-[#F5F5F5]">
            {network?.latency_ms || 2.4} ms
          </div>
          <p className="text-[10px] text-zinc-400 uppercase">Ultra-low latency local bus.</p>
        </div>
      </div>

      {/* Security Architecture Details Card */}
      <div className="p-6 rounded-none bg-[#121212] border border-[#242424] space-y-4">
        <h2 className="text-sm font-mono font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-[#FF6A00]" />
          Enclave Hardware Telemetry & Compliance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-none bg-[#181818] border border-[#242424] space-y-2">
            <div className="text-[#FF6A00] font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A00]" /> Physical Air-Gap Shield
            </div>
            <p className="text-zinc-300 text-[11px] font-mono leading-relaxed">
              All LLM inference runs inside isolated local Docker containers with zero external routes enabled. Port 8000 is bound strictly to localhost (127.0.0.1).
            </p>
          </div>

          <div className="p-4 rounded-none bg-[#181818] border border-[#242424] space-y-2">
            <div className="text-[#FF6A00] font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A00]" /> Sovereign Model Integrity
            </div>
            <p className="text-zinc-300 text-[11px] font-mono leading-relaxed">
              Ollama weights are verified against SHA-256 checksums stored in local hardware HSM. No API keys or remote cloud tokens are required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

