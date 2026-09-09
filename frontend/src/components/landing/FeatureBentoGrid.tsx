import React from "react";
import {
  FileScan,
  Database,
  GitBranch,
  UserCheck,
  ShieldCheck,
  FileCheck,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function FeatureBentoGrid() {
  const features = [
    {
      icon: FileScan,
      title: "Multimodal P&ID & UT Inspection OCR",
      description:
        "Local PaddleOCR and PyMuPDF pipeline automatically extracts wall thickness logs, corrosion rates (mm/yr), CML coordinates, and valve tags from field scans with zero cloud transfer.",
      badge: "Local PaddleOCR",
      badgeVariant: "accent" as const,
      colSpan: "md:col-span-2",
    },
    {
      icon: Database,
      title: "Confidential RAG Vector Engine",
      description:
        "High-density ChromaDB/Qdrant vector store indexing plant-specific SOPs, safety bulletins, and API 570/510 standards with sub-second semantic retrieval.",
      badge: "BGE-M3 Embedded",
      badgeVariant: "info" as const,
      colSpan: "md:col-span-1",
    },
    {
      icon: UserCheck,
      title: "Human-in-the-Loop (HITL) Gate",
      description:
        "Safety-critical decisions cannot execute autonomously. Mandatory digital PIN verification and dual-engineer sign-off for critical high-hazard maintenance actions.",
      badge: "4-Eye Principle",
      badgeVariant: "warning" as const,
      colSpan: "md:col-span-1",
    },
    {
      icon: GitBranch,
      title: "Deterministic LangGraph Multi-Agent Orchestration",
      description:
        "Stateful 6-node deterministic workflow ensuring verifiable step-by-step reasoning from raw ultrasonic log ingestion to verified deliverable generation.",
      badge: "LangGraph 6-Node",
      badgeVariant: "default" as const,
      colSpan: "md:col-span-2",
    },
    {
      icon: ShieldCheck,
      title: "Zero-Egress Network Sentinel",
      description:
        "Active kernel-level socket poller inspecting /proc/net/tcp every 15 seconds, mathematically guaranteeing 0 outbound bytes exit the refinery enclave.",
      badge: "0 Outbound Sockets",
      badgeVariant: "success" as const,
      colSpan: "md:col-span-1",
    },
    {
      icon: FileCheck,
      title: "Cryptographic Deliverable Synthesis",
      description:
        "Automated compilation of official Word (.docx) inspection audits, stamped with SHA-256 digital hashes for immutable statutory verification.",
      badge: "SHA-256 Stamped",
      badgeVariant: "accent" as const,
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <section id="capabilities" className="relative py-20 border-t border-border-subtle overflow-hidden">
      {/* Wide Cinematic Refinery Landscape Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[center_top] sm:bg-[center_top_18%] md:bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/img/3.png')",
        }}
      />

      {/* Subtle dark blue gradient overlay - lightened for rich landscape visibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(7, 16, 27, 0.52) 0%, rgba(6, 14, 23, 0.35) 40%, rgba(7, 16, 27, 0.62) 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="accent" className="mb-3">
            MISSION-CRITICAL CAPABILITIES
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            Engineered for Continuous High-Hazard Manufacturing
          </h2>
          <p className="mt-3 text-sm sm:text-base text-primary-secondary">
            A purpose-built stack designed to eradicate hallucinations, enforce refinery standard operating procedures, and protect proprietary intelligence.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                variant="interactive"
                className={`p-6 flex flex-col justify-between ${item.colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={item.badgeVariant}>{item.badge}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-primary-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
