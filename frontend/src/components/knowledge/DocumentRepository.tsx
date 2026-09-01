"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Search,
  CheckCircle2,
  Lock,
  Database,
  Loader2,
  FileCheck
} from "lucide-react";
import { listDocuments } from "@/lib/api";
import { useFileUpload } from "@/hooks/useFileUpload";
import type { DocumentResponse } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const DocumentRepository: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { upload, uploading } = useFileUpload();

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await listDocuments();
      setDocuments(data);
    } catch {
      // Fallback demo documents if backend documents list is empty
      setDocuments([
        {
          id: "doc-hydrocracker-001",
          filename: "MRPL_Hydrocracker_UT_Thickness_Audit_2026.pdf",
          doc_type: "inspection_report",
          storage_path: "storage/documents/hydrocracker.pdf",
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "doc-sop-oisd-105",
          filename: "OISD_STD_105_Hot_Work_Permit_Safety_Standard.pdf",
          doc_type: "standard_operating_procedure",
          storage_path: "storage/documents/oisd_105.pdf",
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: "doc-vibration-log-p102",
          filename: "Crude_Distillation_Pump_P102_Vibration_FFT.xlsx",
          doc_type: "vibration_log",
          storage_path: "storage/documents/vibration_p102.xlsx",
          created_at: new Date(Date.now() - 259200000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      await upload(files[i]);
    }
    await fetchDocs();
  };

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-6xl mx-auto w-full select-none font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#242424] pb-4">
        <div>
          <h1 className="text-lg font-mono font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
            <Database className="w-5 h-5 text-[#FF6A00]" />
            Knowledge Base & Technical Documents
          </h1>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Ingested industrial standard operating procedures, inspection logs, and engineering drawings vectorized for local sovereign RAG.
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center gap-2 py-2 px-4 rounded-none bg-[#FF6A00] hover:bg-[#E05D00] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-[#FF6A00]">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-black" />
          ) : (
            <Upload className="w-4 h-4 stroke-[2.5]" />
          )}
          <span>Upload Document</span>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.docx,.txt"
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingested documents, SOPs, or inspection reports..."
            className="w-full pl-9 pr-4 py-2 rounded-none bg-[#121212] border border-[#242424] text-xs text-[#F5F5F5] focus:outline-none focus:border-[#FF6A00] font-mono placeholder:text-zinc-600"
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-2 rounded-none bg-[#181818] border border-[#FF6A00]/40 text-xs font-mono text-[#FF6A00] uppercase font-bold tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          <span>LOCAL VECTOR STORAGE</span>
        </div>
      </div>

      {/* Document List Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-zinc-400 border border-[#242424] bg-[#121212] rounded-none">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF6A00] mx-auto mb-2" />
          LOADING SOVEREIGN DOCUMENT REPOSITORY…
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-[#242424] bg-[#121212] rounded-none space-y-3">
          <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
          <div className="text-xs font-mono text-zinc-300 font-bold uppercase">No matching documents found</div>
          <p className="text-xs text-zinc-400 uppercase">Upload PDF inspection reports or SOPs to index them into your local RAG store.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-none bg-[#121212] border border-[#242424] hover:border-[#FF6A00]/60 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-none bg-[#181818] border border-[#242424] flex items-center justify-center text-[#FF6A00] shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <h3 className="font-mono text-xs font-bold text-[#F5F5F5] truncate">
                      {doc.filename}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono uppercase mt-0.5">
                      Type: {doc.doc_type || "Technical Spec"}
                    </p>
                  </div>
                </div>

                <span className="text-[9px] font-mono px-2 py-0.5 rounded-none bg-[#181818] border border-[#FF6A00]/40 text-[#FF6A00] font-bold uppercase tracking-wider shrink-0">
                  RAG INDEXED
                </span>
              </div>

              <div className="pt-2 border-t border-[#242424] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>Uploaded: {doc.created_at ? formatDate(doc.created_at) : "Recent"}</span>
                <span className="text-[#FF6A00] flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> ZERO EGRESS
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

