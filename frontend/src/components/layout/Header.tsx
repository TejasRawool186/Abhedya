"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Cpu,
  PanelLeft,
  PanelRight,
  Server,
  Activity
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
    <header className="h-14 border-b border-[var(--border)] bg-[#0B0B0B] px-4 flex items-center justify-between shrink-0 z-20 select-none">
      {/* Left: Sidebar Toggle + Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-none text-zinc-400 hover:text-[#FF6A00] hover:bg-[#141414] transition-colors border border-transparent hover:border-[#262626]"
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-none bg-[#FF6A00]/10 border border-[#FF6A00]/40 flex items-center justify-center text-[#FF6A00] shadow-[0_0_10px_rgba(255,106,0,0.2)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#F5F5F5] tracking-tight font-sans">
                OnPremis<span className="text-[#FF6A00] font-bold">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-none bg-[#FF6A00]/10 border border-[#FF6A00]/40 text-[#FF6A00] font-bold tracking-wider">
                SOVEREIGN v2.4
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
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-none bg-[#121212] border border-[#262626] focus-within:border-[#FF6A00]">
          <Cpu className="w-3.5 h-3.5 text-[#FF6A00]" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-transparent text-xs font-mono font-medium text-zinc-200 focus:outline-none cursor-pointer pr-1"
          >
            {availableModels.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#121212] text-zinc-200">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Security Status Badges */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[11px] font-mono text-[#FF6A00] font-bold">
          <span className="w-2 h-2 rounded-none bg-[#FF6A00] animate-pulse" />
          <span>LOCAL AI</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[11px] font-mono text-[#FF6A00]">
          <Lock className="w-3 h-3 text-[#FF6A00]" />
          <span>ZERO EGRESS</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#141414] border border-[#262626] text-[11px] font-mono text-zinc-300">
          <Server className="w-3 h-3 text-[#FF6A00]" />
          <span>AIR-GAPPED ENCLAVE</span>
        </div>
      </div>

      {/* Right: Network Status + Context Panel Toggle */}
      <div className="flex items-center gap-3">
        {/* Air-gap Network Sentinel Ping */}
        <button
          onClick={refresh}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-none bg-[#121212] border border-[#262626] hover:border-[#FF6A00]/60 transition-colors text-xs font-mono text-zinc-300"
          title="Click to verify network sentinel status"
        >
          <Activity className="w-3.5 h-3.5 text-[#FF6A00]" />
          <span>{network?.node_name || "SOVEREIGN-NODE"}</span>
          <span className="text-[10px] text-[#FF6A00] font-bold bg-[#FF6A00]/10 px-1 py-0.5 rounded-none border border-[#FF6A00]/40">
            0 BYTES OUT
          </span>
        </button>

        {/* Right Inspector Panel Toggle */}
        <button
          onClick={toggleContextPanel}
          className={`p-1.5 rounded-none border transition-colors ${
            contextPanelOpen
              ? "bg-[#FF6A00]/10 text-[#FF6A00] border-[#FF6A00]/60"
              : "text-zinc-400 hover:text-zinc-200 bg-[#121212] border-[#262626]"
          }`}
          title={contextPanelOpen ? "Hide Execution Inspector" : "Show Execution Inspector"}
        >
          <PanelRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

