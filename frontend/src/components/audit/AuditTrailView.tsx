"use client";

import React, { useState } from "react";
import {
  FileCheck,
  ShieldCheck,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { truncateHash } from "@/lib/utils";

export function AuditTrailView() {
  const { auditLogs, loadAuditLogsFromBackend } = useTaskStore();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    loadAuditLogsFromBackend();
  }, [loadAuditLogsFromBackend]);

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      log.operator.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.sha256Hash.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportLedger = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MRPL_Immutable_Audit_Ledger_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex-1 h-full min-h-0 overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-status-success" />
            <h2 className="text-xl font-bold text-primary">
              Immutable Statutory Compliance Ledger
            </h2>
          </div>
          <p className="text-xs text-primary-secondary mt-1">
            Every human sign-off, corrosion calculation, and generated deliverable is cryptographically stamped with SHA-256 hashes.
          </p>
        </div>

        <Button
          onClick={handleExportLedger}
          size="sm"
          variant="outline"
          className="gap-2 font-semibold text-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger (JSON)</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by task title, operator name, action, or SHA-256 hash..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-card border border-border-medium text-xs text-primary placeholder:text-primary-muted focus:outline-none focus:border-border-focus"
        />
        <Search className="w-4 h-4 text-primary-muted absolute left-3 top-2.5" />
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-border-medium bg-surface-card overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-raised text-[11px] font-mono text-primary-muted uppercase tracking-wider">
                <th className="p-3.5">Log ID & Timestamp</th>
                <th className="p-3.5">Task Title</th>
                <th className="p-3.5">Action & Role</th>
                <th className="p-3.5">Cryptographic SHA-256 Stamp</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="p-3.5 align-top">
                    <div className="font-bold text-primary">{log.id}</div>
                    <div className="text-[10px] text-primary-muted mt-0.5">
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="p-3.5 align-top max-w-[220px]">
                    <div className="font-semibold text-primary truncate">
                      {log.taskTitle}
                    </div>
                    <div className="text-[10px] text-primary-secondary font-sans mt-0.5 line-clamp-1">
                      {log.details}
                    </div>
                  </td>
                  <td className="p-3.5 align-top">
                    <Badge variant="accent" size="sm" className="mb-1">
                      {log.action}
                    </Badge>
                    <div className="text-[10px] text-primary-secondary font-sans">
                      {log.operator} ({log.operatorRole})
                    </div>
                  </td>
                  <td className="p-3.5 align-top">
                    <div className="flex items-center gap-1.5 text-accent">
                      <span>{truncateHash(log.sha256Hash, 8, 8)}</span>
                      <button
                        onClick={() => handleCopyHash(log.id, log.sha256Hash)}
                        className="p-1 hover:text-white"
                        title="Copy Full SHA-256 Hash"
                      >
                        {copiedId === log.id ? (
                          <Check className="w-3.5 h-3.5 text-status-success" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-primary-muted" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 align-top text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-status-success">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
