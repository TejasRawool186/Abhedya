import React from "react";
import { Check, X, ShieldAlert, ShieldCheck } from "lucide-react";

export function ThreatMatrix() {
  const comparisonData = [
    {
      dimension: "Data Exfiltration & Residency",
      cloudRisk: "Proprietary refinery P&IDs, ultrasonic wall thickness logs, and safety bypass limits uploaded to external third-party cloud servers.",
      sovereignSolution: "100% On-Premise. Sockets hard-blocked at kernel level (/proc/net/tcp). Zero outbound bytes can leave local network.",
      isCritical: true,
    },
    {
      dimension: "Statutory Compliance (OISD / ISO / API)",
      cloudRisk: "Violates OISD-105, ISO 27001, and Critical Infrastructure Directives regarding critical asset confidentiality.",
      sovereignSolution: "Fully compliant with Indian Ministry of Petroleum & Natural Gas standards and API 570/510 inspection rules.",
      isCritical: false,
    },
    {
      dimension: "Hallucination & Safety Control",
      cloudRisk: "Stochastic responses without engineering grounding; unverified recommendations on high-pressure steam lines.",
      sovereignSolution: "Deterministic LangGraph agent orchestration with mandatory Human-in-the-Loop (HITL) engineer sign-off.",
      isCritical: true,
    },
    {
      dimension: "Offline Network Reliability",
      cloudRisk: "100% reliant on external WAN/internet connectivity; rendered completely unusable during refinery blackouts or air-gaps.",
      sovereignSolution: "100% operational offline in air-gapped field trailers with local CUDA RTX workstation acceleration.",
      isCritical: false,
    },
    {
      dimension: "Auditability & Deliverables",
      cloudRisk: "Transient chat history; lack of cryptographic chain of custody for formal statutory safety inquiries.",
      sovereignSolution: "Immutable SHA-256 digital signature stamp embedded directly into official compliance .docx deliverables.",
      isCritical: false,
    },
  ];

  return (
    <section id="threat-matrix" className="relative py-20 border-t border-border-subtle bg-surface/30 overflow-hidden">
      {/* Technical Blueprint Engineering Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/img/2.png')",
        }}
      />

      {/* Dark navy overlay - lightened so blueprint drawing lines and details shine through */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(8, 17, 28, 0.58) 0%, rgba(6, 14, 24, 0.42) 50%, rgba(8, 17, 28, 0.68) 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs font-mono mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            INDUSTRIAL SECURITY VULNERABILITY AUDIT
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            Public Cloud AI vs Sovereign Enclave
          </h2>
          <p className="mt-3 text-sm sm:text-base text-primary-secondary">
            Why consumer and SaaS AI platforms pose unacceptable catastrophic hazards to high-pressure continuous refinery operations.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="rounded-2xl border border-[#071B26]/60 bg-[#071B26]/75 backdrop-blur-md overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#071B26]/60 bg-[#071B26]/80">
                  <th className="p-4 sm:p-5 text-xs font-semibold text-primary-secondary uppercase tracking-wider w-1/4">
                    Evaluation Dimension
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-semibold text-status-danger uppercase tracking-wider w-[37.5%]">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      Commercial Cloud AI (ChatGPT / Claude SaaS)
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 text-xs font-semibold text-status-success uppercase tracking-wider w-[37.5%]">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      OnPremisAI Sovereign Enclave
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {comparisonData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-surface-hover/50 transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-semibold text-primary align-top">
                      {row.dimension}
                    </td>
                    <td className="p-4 sm:p-5 text-primary-secondary align-top bg-status-danger/[0.02]">
                      <div className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-status-danger shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{row.cloudRisk}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-primary align-top bg-status-success/[0.02]">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-medium">{row.sovereignSolution}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
