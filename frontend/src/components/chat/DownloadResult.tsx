"use client";

import { useState, useCallback } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/Button";
import {
  Download,
  FileText
} from "lucide-react";
import { getDownloadUrl } from "@/lib/api";

interface DownloadResultProps {
  downloadUrl?: string;
}

export function DownloadResult({ downloadUrl: propUrl }: DownloadResultProps) {
  const activeTask = useTaskStore((s) => s.activeTask);
  const [downloading, setDownloading] = useState(false);

  const taskId = activeTask?.id;
  const targetUrl = propUrl || (taskId ? getDownloadUrl(taskId) : null);

  const handleDownload = useCallback(() => {
    if (!targetUrl) return;
    setDownloading(true);
    const a = document.createElement("a");
    a.href = targetUrl;
    a.download = `Sovereign-Report-${taskId ? taskId.slice(-8) : "deliverable"}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 1500);
  }, [targetUrl, taskId]);

  return (
    <div className="mt-3 p-3.5 rounded-none bg-[#121212] border border-[#FF6A00]/50 font-mono text-xs flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-none bg-[#FF6A00]/10 border border-[#FF6A00]/50 flex items-center justify-center text-[#FF6A00]">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-[#F5F5F5] flex items-center gap-1.5 uppercase">
            <span>Sovereign Report Deliverable</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-none bg-[#FF6A00]/10 border border-[#FF6A00]/40 text-[#FF6A00] font-bold">
              VERIFIED .DOCX
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
            Generated on-premise with zero cloud egress. Executive Word report ready.
          </p>
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        leftIcon={<Download size={15} />}
        onClick={handleDownload}
        loading={downloading}
      >
        Download Report
      </Button>
    </div>
  );
}

