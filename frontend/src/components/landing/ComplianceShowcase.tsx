import React from "react";
import { CheckCircle2, ShieldCheck, Award, Lock, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function ComplianceShowcase() {
  const complianceStandards = [
    {
      code: "OISD-STD-105",
      title: "Work Permit System (Govt. of India)",
      description:
        "Mandatory Oil Industry Safety Directorate protocol for hot work, cold work, vehicle entry, and confined space entry inside Indian hydrocarbon installations.",
      status: "100% Enforced",
      icon: Award,
    },
    {
      code: "API 570 / 510",
      title: "Piping & Pressure Vessel Inspection Code",
      description:
        "American Petroleum Institute international standards for calculating Minimum Allowable Wall Thickness (MAWT), remaining pipe life, and corrosion degradation thresholds.",
      status: "Calibrated Rules",
      icon: FileText,
    },
    {
      code: "ISO/IEC 27001",
      title: "Information Security Management",
      description:
        "Rigid air-gapped security perimeter preventing intellectual property exfiltration, unauthorized telemetry leaks, and adversarial prompt poisoning.",
      status: "Air-Gap Certified",
      icon: Lock,
    },
    {
      code: "CMMC Level 3",
      title: "Critical Infrastructure Cyber Resilience",
      description:
        "Department of Defense cybersecurity maturity framework alignment ensuring state-actor level resiliency on refinery operational technology (OT) edge nodes.",
      status: "Hardware Gated",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="compliance" className="py-20 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="success" className="mb-3">
            STATUTORY & REGULATORY COMPLIANCE
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            Built Directly to Indian & International Refinery Standards
          </h2>
          <p className="mt-3 text-sm sm:text-base text-primary-secondary">
            OnPremisAI does not merely generate text—it enforces statutory safety checklists, deterministic math formulas, and cryptographic auditability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {complianceStandards.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="p-6 bg-[#071B26]/75 backdrop-blur-md border-[#071B26]/60 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-status-success/10 border border-status-success/25 flex items-center justify-center text-status-success shrink-0 mt-1">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-primary font-mono">
                      {item.code}
                    </h3>
                    <Badge variant="success">{item.status}</Badge>
                  </div>
                  <h4 className="text-xs font-semibold text-accent-hover mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-primary-secondary leading-relaxed">
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
