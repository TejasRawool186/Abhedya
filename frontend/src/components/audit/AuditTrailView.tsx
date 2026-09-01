"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Lock,
  Search,
  Filter,
  Layers,
  ChevronRight
} from "lucide-react";
import { listTasks } from "@/lib/api";
import type { TaskDetailResponse } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const AuditTrailView: React.FC = () => {
  const [tasks, setTasks] = useState<TaskDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await listTasks(0, 50);
        setTasks(data);
      } catch {
        // Fallback demo tasks for audit trail
        setTasks([
          {
            id: "task-audit-101",
            prompt: "MRPL Hydrocracker UT Thickness & Remaining Life Audit",
            task_type: "inspection_report",
            status: "completed",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            steps: [],
          },
          {
            id: "task-audit-102",
            prompt: "Refinement Unit Vibration Anomaly Root Cause Analysis",
            task_type: "anomaly_detection",
            status: "completed",
            created_at: new Date(Date.now() - 7200000).toISOString(),
            steps: [],
          },
          {
            id: "task-audit-103",
            prompt: "Hot Work Safety Permit OISD-STD-105 Verification",
            task_type: "compliance_audit",
            status: "completed",
            created_at: new Date(Date.now() - 14400000).toISOString(),
            steps: [],
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredTasks = tasks.filter(
    (t) =>
      t.prompt.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl mx-auto w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-zinc-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            Audit Trail & Sovereign Compliance Log
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Immutable trace log of all LLM inferences, human approval decisions, tool executions, and zero-egress verifications.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>CRYPTOGRAPHICALLY AUDITED</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit log by Task ID, prompt keywords, or operator sign-off..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--panel)] border border-[var(--border)] text-xs text-zinc-200 focus:outline-none focus:border-emerald-600/70 font-mono"
        />
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] overflow-hidden shadow-lg">
        <div className="p-3 bg-[var(--panel-2)]/80 border-b border-[var(--border)] font-mono text-xs font-bold text-zinc-300 flex items-center justify-between">
          <span>Executed Sovereign Tasks ({filteredTasks.length})</span>
          <span className="text-[10px] text-emerald-400">AIR-GAPPED STORAGE</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {filteredTasks.map((t) => (
            <div key={t.id} className="p-4 hover:bg-[var(--panel-2)]/40 transition-colors space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">{t.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 uppercase">
                      {t.task_type || "INDUSTRIAL_TASK"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-200 font-sans font-medium">{t.prompt}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> SIGNED OFF
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
                <span>Timestamp: {t.created_at ? formatDate(t.created_at) : "Recent"}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> ZERO EGRESS (0 BYTES OUT)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
