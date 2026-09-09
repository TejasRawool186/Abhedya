"use client";

import React from "react";
import { Sparkles, Cpu, CheckCircle2, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CorrosionChart } from "@/components/charts/CorrosionChart";
import { mockCorrosionDegradationCurve } from "@/mocks/mockInspectionData";

export function ArenaComparisonView() {
  return (
    <div className="w-full flex-1 h-full min-h-0 overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-primary">
              Dual-Model Arena Evaluation Grid
            </h2>
          </div>
          <p className="text-xs text-primary-secondary mt-1">
            Synchronized side-by-side inference benchmark on local CUDA hardware.
          </p>
        </div>
        <Badge variant="accent">ARENA ACTIVE</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model A: Qwen 2.5 14B */}
        <Card className="p-5 bg-surface-card border-border-medium shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-bold text-primary font-mono">
                Model A: Qwen 2.5 14B Industrial
              </h3>
            </div>
            <span className="text-[10px] font-mono text-status-success">
              48.2 tok/s • 340ms TTFT
            </span>
          </div>

          <div className="prose-claude text-xs">
            <p>
              <strong>Corrosion Degradation Assessment:</strong><br />
              Target: Hydrocracker Unit 3 Reactor Overhead (CML-HC-101A).<br />
              Corrosion rate: <code>0.82 mm/year</code>. Wall thickness will breach MAWT (6.5 mm) in <strong>1.58 years (Q4 2027)</strong>.
            </p>
            <p>
              <strong>API 570 Mandate:</strong> Fabricate ASTM A335 Grade P22 spool piece for immediate mini-shutdown installation.
            </p>
          </div>

          <CorrosionChart
            data={mockCorrosionDegradationCurve}
            title="Qwen 2.5: MAWT Degradation Curve"
            threshold={6.5}
          />
        </Card>

        {/* Model B: DeepSeek R1 14B */}
        <Card className="p-5 bg-surface-card border-border-medium shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-status-info" />
              <h3 className="text-xs font-bold text-primary font-mono">
                Model B: DeepSeek R1 14B Distill
              </h3>
            </div>
            <span className="text-[10px] font-mono text-status-info">
              42.8 tok/s • 410ms TTFT
            </span>
          </div>

          <div className="prose-claude text-xs">
            <p>
              <strong>Chain of Thought Reasoning:</strong><br />
              &lt;think&gt;<br />
              Checking wall loss: 14.2 mm nominal -&gt; 7.8 mm measured over 7.8 years of service. Rate = (14.2 - 7.8)/7.8 = 0.8205 mm/yr.<br />
              Distance to retirement: 7.8 - 6.5 = 1.3 mm. Life = 1.3 / 0.8205 = 1.584 years.<br />
              &lt;/think&gt;
            </p>
            <p>
              <strong>Recommended Action:</strong> Critical risk. Turnaround is 2029, failure projected in 2027. Immediate PAUT NDT and intermediate replacement required.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface border border-border-subtle text-xs font-mono">
            <div className="text-accent-hover font-semibold mb-1">
              Deterministic Agreement: 100% Match
            </div>
            <div className="text-primary-muted text-[11px]">
              Both models independently compute 0.82 mm/yr and Q4 2027 MAWT breach.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
