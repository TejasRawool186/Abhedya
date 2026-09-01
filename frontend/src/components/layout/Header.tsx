"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Cpu,
  PanelLeft,
  PanelRight,
  Server,
  Activity,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export const Header: React.FC = () => {
  const sidebarOpen = useTaskStore((s) => s.sidebarOpen);
  const toggleSidebar = useTaskStore((s) => s.toggleSidebar);
  const contextPanelOpen = useTaskStore((s) => s.contextPanelOpen);
  const toggleContextPanel = useTaskStore((s) => s.toggleContextPanel);
  const network = useTaskStore((s) => s.network);
  const selectedModel = useTaskStore((s) => s.selectedModel);
  const setSelectedModel = useTaskStore((s) => s.setSelectedModel);
  const availableModels = useTaskStore((s) => s.availableModels);
  
  const { refresh } = useNetworkStatus(15000, true);

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--panel)] px-4 flex items-center justify-between shrink-0 z-20 select-none">
      {/* Left: Sidebar Toggle + Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-emerald-400/70 hover:text-emerald-400 hover:bg-[var(--panel-2)] transition-colors border border-transparent hover:border-[var(--border)]"
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(5,150,105,0.25)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-zinc-100 tracking-tight font-mono">
                OnPremis<span className="text-emerald-400 font-bold">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 font-medium">
                Workbench v2.4
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden md:block">
              Sovereign AI Workbench for Confidential Industrial Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Sovereign Status Pills + Model Selector */}
      <div className="hidden lg:flex items-center gap-2.5">
        {/* Model Selector Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--panel-2)] border border-[var(--border)]">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-transparent text-xs font-mono font-medium text-zinc-200 focus:outline-none cursor-pointer pr-1"
          >
            {availableModels.map((m) => (
              <option key={m.id} value={m.id} className="bg-zinc-900 text-zinc-200">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Security Status Badges */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LOCAL AI</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-mono text-emerald-400">
          <Lock className="w-3 h-3" />
          <span>ZERO EGRESS</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700/60 text-[11px] font-mono text-zinc-300">
          <Server className="w-3 h-3 text-emerald-400" />
          <span>AIR-GAPPED ENCLAVE</span>
        </div>
      </div>

      {/* Right: Network Status + Context Panel Toggle */}
      <div className="flex items-center gap-3">
        {/* Air-gap Network Sentinel Ping */}
        <button
          onClick={refresh}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[var(--panel-2)] border border-[var(--border)] hover:border-emerald-700/60 transition-colors text-xs font-mono text-zinc-300"
          title="Click to verify network sentinel status"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>{network?.node_name || "SOVEREIGN-NODE"}</span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-800/40">
            0 BYTES OUT
          </span>
        </button>

        {/* Right Inspector Panel Toggle */}
        <button
          onClick={toggleContextPanel}
          className={`p-1.5 rounded-lg border transition-colors ${
            contextPanelOpen
              ? "bg-emerald-950/60 text-emerald-400 border-emerald-700/50"
              : "text-zinc-400 hover:text-zinc-200 bg-[var(--panel-2)] border-[var(--border)]"
          }`}
          title={contextPanelOpen ? "Hide Execution Inspector" : "Show Execution Inspector"}
        >
          <PanelRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
