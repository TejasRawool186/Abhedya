"use client";

import React, { useState } from "react";
import {
  Upload,
  FileSearch,
  BookOpen,
  Cpu,
  UserCheck,
  FileCheck,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function InteractivePipeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "1",
      icon: Upload,
      name: "Field Upload",
      node: "input_stage",
      shortDesc: "UT Log & PDF Ingestion",
      latency: "Local Disk",
      details:
        "Field inspectors ingest raw ultrasonic thickness (UT) inspection scans, vibration time-series FFT JSON, or mobile photos of refinery P&ID tags into the local air-gapped staging buffer.",
      tech: "Local File System / Zero Cloud Upload",
    },
    {
      id: "2",
      icon: FileSearch,
      name: "Multimodal OCR",
      node: "ocr_extract",
      shortDesc: "PaddleOCR Extraction",
      latency: "~850ms",
      details:
        "Local PaddleOCR 2.8 and PyMuPDF parse noisy engineering tables, extracting Condition Monitoring Location (CML) coordinates, nominal thicknesses, and measured values into structured JSON.",
      tech: "PaddleOCR 2.8 + PyMuPDF on CUDA RTX",
    },
    {
      id: "3",
      icon: BookOpen,
      name: "SOP RAG Search",
      node: "rag_search",
      shortDesc: "Semantic SOP Retrieval",
      latency: "~420ms",
      details:
        "Embeddings are computed using local BGE-M3. ChromaDB retrieves relevant sections from API 570, OISD-STD-105, and MRPL plant operating manuals with cosine similarity > 0.90.",
      tech: "ChromaDB / Qdrant Embedded + BGE-M3",
    },
    {
      id: "4",
      icon: Cpu,
      name: "Industrial Reasoning",
      node: "recommend",
      shortDesc: "Corrosion Calculations",
      latency: "~1200ms",
      details:
        "Qwen 2.5 14B calculates short-term vs long-term corrosion rates (mm/year), calculates remaining equipment life, flags MAWT retirement breaches, and formats maintenance recommendations.",
      tech: "Qwen 2.5 14B Industrial (CUDA Q4_K_M)",
    },
    {
      id: "5",
      icon: UserCheck,
      name: "HITL Verification",
      node: "human_checkpoint",
      shortDesc: "Mandatory Engineer Sign",
      latency: "Human Gated",
      details:
        "The agent automatically suspends execution at this gate. The Lead Corrosion Engineer reviews findings, adjusts replacement intervals if needed, and signs using an authenticated PIN.",
      tech: "Deterministic State Gate + SHA-256 Signature",
    },
    {
      id: "6",
      icon: FileCheck,
      name: "Signed Deliverable",
      node: "generate_docx",
      shortDesc: "Verified DOCX Release",
      latency: "~600ms",
      details:
        "The approved findings are synthesized into an official Word (.docx) inspection report stamped with the operator's digital signature and SHA-256 hash in the immutable audit ledger.",
      tech: "Docx Synthesizer + SHA-256 Audit Trail",
    },
  ];

  return (
    <section id="pipeline" className="relative py-20 border-t border-border-subtle bg-surface/20 overflow-hidden">
      {/* Cinematic GPU/Data-Center Corridor Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[center_center] pointer-events-none"
        style={{
          backgroundImage: "url('/img/hero3.png')",
        }}
      />

      {/* Dark navy overlay/gradient - lightened so GPU corridor and sunset view are clearly visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(5, 12, 22, 0.58) 0%, rgba(5, 12, 22, 0.40) 50%, rgba(5, 12, 22, 0.68) 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="accent" className="mb-3">
            LANGGRAPH 6-NODE ORCHESTRATION
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            Deterministic Agentic Execution Pipeline
          </h2>
          <p className="mt-3 text-sm sm:text-base text-primary-secondary">
            Click each step below to inspect how confidential refinery field telemetry transitions through the multi-agent reasoning graph.
          </p>
        </div>

        {/* Stepper Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between ${
                  isActive
                    ? "bg-[#071B26] border-accent shadow-glow"
                    : "bg-[#071B26]/75 backdrop-blur-md border-[#071B26]/60 hover:border-border-medium hover:bg-[#071B26]/85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-accent text-white"
                        : "bg-[#071B26]/60 text-primary-muted"
                    }`}
                  >
                    {step.id}
                  </div>
                  <span className="text-[10px] font-mono text-primary-muted">
                    {step.latency}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-primary truncate">
                    {step.name}
                  </div>
                  <div className="text-[11px] text-primary-muted truncate">
                    {step.shortDesc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep Dive Card */}
        <Card className="p-6 sm:p-8 bg-[#071B26]/75 backdrop-blur-md border-[#071B26]/60 shadow-floating">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                {React.createElement(steps[activeStep].icon, {
                  className: "w-6 h-6",
                })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-accent font-semibold">
                    STAGE {steps[activeStep].id} OF 6
                  </span>
                  <Badge variant="outline">{steps[activeStep].node}</Badge>
                </div>
                <h3 className="text-xl font-bold text-primary mt-0.5">
                  {steps[activeStep].name}: {steps[activeStep].shortDesc}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="accent">LATENCY: {steps[activeStep].latency}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="md:col-span-2">
              <h4 className="text-xs font-semibold text-primary-secondary uppercase tracking-wider mb-2">
                Operational Behavior & Reasoning Flow
              </h4>
              <p className="text-sm text-primary leading-relaxed">
                {steps[activeStep].details}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#071B26]/60 backdrop-blur-md border border-[#071B26]/40">
              <h4 className="text-xs font-semibold text-primary-secondary uppercase tracking-wider mb-2">
                Enclave Engine Stack
              </h4>
              <div className="text-xs font-mono text-accent-hover font-semibold">
                {steps[activeStep].tech}
              </div>
              <div className="mt-3 text-[11px] text-primary-muted">
                Zero Cloud Egress Guaranteed
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
