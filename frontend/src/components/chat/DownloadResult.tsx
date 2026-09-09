"use client";

import React, { useState } from "react";
import { FileCheck, Download, Copy, Check, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatBytes, truncateHash } from "@/lib/utils";

interface DownloadResultProps {
  filename: string;
  fileSize: number;
  sha256: string;
  generatedAt: string;
  signedBy: string;
  operatorRole: string;
}

export function DownloadResult({
  filename,
  fileSize,
  sha256,
  generatedAt,
  signedBy,
  operatorRole,
}: DownloadResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-5 bg-surface-card border-border-medium shadow-floating space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-status-success" />
          <h4 className="text-xs font-bold font-mono text-primary uppercase">
            Official Statutory Deliverable
          </h4>
        </div>
        <Badge variant="success" size="sm">
          SHA-256 VERIFIED
        </Badge>
      </div>

      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
          <FileCheck className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-primary truncate">{filename}</h3>
          <div className="text-[11px] font-mono text-primary-muted mt-0.5">
            Size: {formatBytes(fileSize)} • Stamped: {generatedAt}
          </div>
          <div className="text-[11px] text-primary-secondary mt-1">
            Signed by <strong className="text-primary">{signedBy}</strong> ({operatorRole})
          </div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-surface border border-border-subtle">
        <div className="flex items-center justify-between mb-1 text-[10px] font-mono uppercase text-primary-muted">
          <span>SHA-256 Cryptographic Stamp</span>
          <button
            onClick={handleCopy}
            className="hover:text-accent flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-status-success" />
                <span className="text-status-success">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Hash</span>
              </>
            )}
          </button>
        </div>
        <div className="text-[11px] font-mono text-accent break-all">
          {sha256}
        </div>
      </div>

      <Button
        onClick={() => {
          alert(`Downloading verified inspection audit deliverable:\n${filename}\n\nSHA-256: ${sha256}`);
        }}
        className="w-full justify-center gap-2 font-semibold shadow-glow"
      >
        <Download className="w-4 h-4" />
        <span>Download Official .docx Report</span>
      </Button>
    </Card>
  );
}
