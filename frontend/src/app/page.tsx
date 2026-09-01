"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Cpu,
  FileCheck2,
  Activity,
  Terminal,
  ArrowRight,
  CheckCircle2,
  Database,
  FileText,
  Zap,
  Layers,
  Server,
  ShieldAlert,
  HardDrive
} from "lucide-react";

export default function StandaloneLandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans selection:bg-[#FF6A00] selection:text-black">
      {/* Top Industrial Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#0B0B0B]/90 backdrop-blur border-b border-[#242424] px-6 py-3.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FF6A00]/10 border border-[#FF6A00]/50 flex items-center justify-center text-[#FF6A00] shadow-[0_0_12px_rgba(255,106,0,0.25)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#F5F5F5] tracking-tight font-sans">
                OnPremis<span className="text-[#FF6A00]">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#FF6A00]/10 border border-[#FF6A00]/40 text-[#FF6A00] font-bold">
                SOVEREIGN v2.4
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-400">
              Confidential Industrial Intelligence Platform
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs text-zinc-400">
          <a href="#features" className="hover:text-[#FF6A00] transition-colors uppercase">
            [Capabilities]
          </a>
          <a href="#architecture" className="hover:text-[#FF6A00] transition-colors uppercase">
            [Architecture]
          </a>
          <a href="#compliance" className="hover:text-[#FF6A00] transition-colors uppercase">
            [Compliance]
          </a>
          <a href="#audit" className="hover:text-[#FF6A00] transition-colors uppercase">
            [Audit Trail]
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[11px] font-mono text-[#FF6A00] font-bold">
            <span className="w-2 h-2 bg-[#FF6A00] animate-pulse" />
            <span>AIR-GAP VERIFIED</span>
          </div>

          <Link
            href="/workbench"
            className="px-4 py-2 bg-[#FF6A00] text-black font-mono font-bold text-xs uppercase hover:bg-[#ff7b1a] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,106,0,0.3)]"
          >
            <span>LAUNCH WORKBENCH</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#FF6A00]/10 border border-[#FF6A00]/40 text-[#FF6A00] font-mono text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Egress • On-Premise GPU Inference • Industrial Grade</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F5F5F5] tracking-tight font-sans max-w-4xl mx-auto leading-tight uppercase">
            Sovereign AI Workbench for <span className="text-[#FF6A00]">Confidential</span> Industrial Intelligence
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Air-gapped LLM orchestration engineered for oil refineries, petrochemical complexes, and defense infrastructure. 100% data residency with deterministic human-in-the-loop compliance.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono pt-4">
            <Link
              href="/workbench"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6A00] text-black font-bold text-sm uppercase hover:bg-[#ff7b1a] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,106,0,0.35)]"
            >
              <span>ENTER SOVEREIGN WORKBENCH</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#architecture"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#121212] border border-[#242424] text-zinc-300 font-bold text-sm uppercase hover:border-[#FF6A00] hover:text-[#FF6A00] transition-all flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span>VIEW ARCHITECTURE</span>
            </a>
          </div>
        </div>

        {/* Live Industrial Console Preview Card */}
        <div className="bg-[#0D0D0D] border border-[#242424] p-4 sm:p-6 font-mono text-xs space-y-4 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#242424] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#FF6A00]" />
              <span className="text-[#FF6A00] font-bold uppercase">
                ENCLAVE TELEMETRY MONITORS // NODE: MRPL-REFINERY-01
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 uppercase">STATUS: 0 OUTBOUND PACKETS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            <div className="p-3 bg-[#141414] border border-[#242424] space-y-1">
              <div className="text-zinc-500 text-[10px]">MODEL INFERENCE ENGINE</div>
              <div className="text-[#F5F5F5] font-bold text-xs truncate">Qwen 2.5 14B Industrial</div>
              <div className="text-[10px] text-[#FF6A00]">LOCAL CUDA ACCELERATED</div>
            </div>

            <div className="p-3 bg-[#141414] border border-[#242424] space-y-1">
              <div className="text-zinc-500 text-[10px]">VECTOR INDEX (RAG)</div>
              <div className="text-[#F5F5F5] font-bold text-xs">ChromaDB Local Engine</div>
              <div className="text-[10px] text-[#FF6A00]">AIR-GAPPED EMBEDDINGS</div>
            </div>

            <div className="p-3 bg-[#141414] border border-[#242424] space-y-1">
              <div className="text-zinc-500 text-[10px]">NETWORK SENTINEL</div>
              <div className="text-[#F5F5F5] font-bold text-xs">Zero Egress Verified</div>
              <div className="text-[10px] text-[#FF6A00]">0 BYTES EXFILTRATED</div>
            </div>

            <div className="p-3 bg-[#141414] border border-[#242424] space-y-1">
              <div className="text-zinc-500 text-[10px]">HUMAN CHECKPOINT</div>
              <div className="text-[#F5F5F5] font-bold text-xs">HITL Approval Gate</div>
              <div className="text-[10px] text-[#FF6A00]">DETERMINISTIC SIGN-OFF</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sovereign Capabilities Grid */}
      <section id="features" className="px-6 py-16 bg-[#090909] border-t border-[#242424]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 font-mono">
            <span className="text-[#FF6A00] text-xs font-bold uppercase tracking-wider">
              // CORE SYSTEM CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5F5F5] uppercase">
              Engineered for Sovereign Industrial Operations
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              Purpose-built tools for high-hazard environments where public cloud services are strictly prohibited.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {/* Card 1 */}
            <div className="p-6 bg-[#121212] border border-[#242424] hover:border-[#FF6A00]/60 transition-colors space-y-4 group">
              <div className="w-10 h-10 bg-[#FF6A00]/10 border border-[#FF6A00]/40 flex items-center justify-center text-[#FF6A00]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] transition-colors uppercase">
                Air-Gapped Zero-Egress
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Guaranteed zero external network packet transmission. All prompt synthesis, document chunking, and model inference execute inside local hardware boundaries.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-[#121212] border border-[#242424] hover:border-[#FF6A00]/60 transition-colors space-y-4 group">
              <div className="w-10 h-10 bg-[#FF6A00]/10 border border-[#FF6A00]/40 flex items-center justify-center text-[#FF6A00]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] transition-colors uppercase">
                NDT & Inspection RAG
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Semantic retrieval across hydrocracker wall thickness logs, ultrasonic testing reports, P&ID schematics, and pipe corrosion inspection files.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-[#121212] border border-[#242424] hover:border-[#FF6A00]/60 transition-colors space-y-4 group">
              <div className="w-10 h-10 bg-[#FF6A00]/10 border border-[#FF6A00]/40 flex items-center justify-center text-[#FF6A00]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] transition-colors uppercase">
                OISD Safety Standard Auditing
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Automated cross-checking of Hot Work Permits, Vessel Entry Protocols, and Refinery Safety SOPs against OISD-105 regulations.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 bg-[#121212] border border-[#242424] hover:border-[#FF6A00]/60 transition-colors space-y-4 group">
              <div className="w-10 h-10 bg-[#FF6A00]/10 border border-[#FF6A00]/40 flex items-center justify-center text-[#FF6A00]">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] transition-colors uppercase">
                Vibration FFT Telemetry
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Spectral analysis of pump bearing frequencies and acoustic telemetry to detect cavitation and mechanical fatigue prior to catastrophic failure.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 bg-[#121212] border border-[#242424] hover:border-[#FF6A00]/60 transition-colors space-y-4 group">
              <div className="w-10 h-10 bg-[#FF6A00]/10 border border-[#FF6A00]/40 flex items-center justify-center text-[#FF6A00]">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] transition-colors uppercase">
                Human-In-The-Loop Checkpoint
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Strict operator approval gates preventing AI agents from outputting unverified industrial recommendations without engineer sign-off.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 bg-[#121212] border border-[#242424] hover:border-[#FF6A00]/60 transition-colors space-y-4 group">
              <div className="w-10 h-10 bg-[#FF6A00]/10 border border-[#FF6A00]/40 flex items-center justify-center text-[#FF6A00]">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F5F5F5] group-hover:text-[#FF6A00] transition-colors uppercase">
                Cryptographic Audit Log
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Tamper-proof execution ledger recording all model prompts, context references, tool invocations, and operator decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Architecture Section */}
      <section id="architecture" className="px-6 py-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 font-mono">
          <span className="text-[#FF6A00] text-xs font-bold uppercase tracking-wider">
            // AIR-GAPPED HARDWARE & SOFTWARE STACK
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#F5F5F5] uppercase">
            Technical Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
          <div className="p-6 bg-[#0D0D0D] border border-[#242424] space-y-4">
            <h3 className="text-sm font-bold text-[#FF6A00] uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4" /> LOCAL INFERENCE ACCELERATION
            </h3>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                <span>Qwen 2.5 14B Industrial (FP16 Quantized GPU Weights)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                <span>Llama 3 8B Sovereign Enclave (High-Speed Local Inference)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                <span>Qwen 2.5 VL 7B (Document OCR & P&ID Vision Analysis)</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#0D0D0D] border border-[#242424] space-y-4">
            <h3 className="text-sm font-bold text-[#FF6A00] uppercase flex items-center gap-2">
              <HardDrive className="w-4 h-4" /> SOVEREIGN DATA STORAGE & RAG
            </h3>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                <span>ChromaDB Vector Store (Local Persistent Indexing)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                <span>BGE-M3 Multilingual & Industrial Technical Embeddings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
                <span>Local SQLite Sovereign Audit Ledger with Cryptographic Hashing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Compliance Standards Banner */}
      <section id="compliance" className="px-6 py-12 bg-[#090909] border-y border-[#242424]">
        <div className="max-w-6xl mx-auto font-mono text-center space-y-6">
          <span className="text-xs text-zinc-500 uppercase tracking-widest">
            COMPLIANCE & INDUSTRIAL SAFETY STANDARDS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-[#F5F5F5] uppercase">
            <div className="p-4 bg-[#121212] border border-[#242424] text-[#FF6A00]">
              OISD-105 REFINERY SAFETY
            </div>
            <div className="p-4 bg-[#121212] border border-[#242424] text-[#FF6A00]">
              ISO 27001 AIR-GAP
            </div>
            <div className="p-4 bg-[#121212] border border-[#242424] text-[#FF6A00]">
              API 570 / 510 INSPECTION
            </div>
            <div className="p-4 bg-[#121212] border border-[#242424] text-[#FF6A00]">
              CMMC LEVEL 3 ENCLAVE
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center space-y-6 font-mono">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F5F5F5] uppercase">
          Ready to Initialize Sovereign Intelligence?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Launch the OnPremisAI Workbench workspace to perform confidential RAG searches, NDT audits, and safety verifications.
        </p>

        <div className="pt-4">
          <Link
            href="/workbench"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#FF6A00] text-black font-bold text-sm uppercase hover:bg-[#ff7b1a] transition-all shadow-[0_0_25px_rgba(255,106,0,0.4)]"
          >
            <span>ENTER WORKBENCH NOW</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#242424] bg-[#050505] font-mono text-xs text-zinc-500 text-center select-none space-y-2">
        <div className="flex items-center justify-center gap-2 text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-[#FF6A00]" />
          <span className="font-bold text-zinc-200">OnPremisAI</span> — Sovereign AI Workbench for Confidential Industrial Intelligence
        </div>
        <p className="text-[11px] text-zinc-600">
          Air-Gapped Enclave Build v2.4.0 • Zero Egress Verified • All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
