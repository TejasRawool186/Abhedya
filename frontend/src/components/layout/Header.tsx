"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PanelLeft,
  PanelRight,
  Download,
  Sparkles,
  FileText,
  FileCode,
} from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";

export function Header() {
  const {
    isSidebarOpen,
    toggleSidebar,
    isContextPanelOpen,
    toggleContextPanel,
    messages,
  } = useTaskStore();

  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  const handleExport = (format: "md" | "json") => {
    setIsExportDropdownOpen(false);
    let dataStr = "";
    let filename = `OnPremisAI_Task_Export_${Date.now()}`;

    if (format === "md") {
      dataStr = messages
        .map(
          (m) =>
            `## ${m.role.toUpperCase()} [${m.timestamp}]\n\n${m.content}\n\n---\n`
        )
        .join("\n");
      filename += ".md";
    } else {
      dataStr = JSON.stringify(messages, null, 2);
      filename += ".json";
    }

    const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 bg-surface border-b border-border-subtle flex items-center justify-between px-4 z-30 select-none">
      {/* Left: Sidebar toggle + Logo */}
      <div className="flex items-center gap-2">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-primary-muted hover:text-primary hover:bg-surface-hover transition-colors"
            title="Open sidebar (Ctrl+B)"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}


        <Link href="/" className="flex items-center gap-2 ml-1">
          <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="font-semibold text-sm text-primary tracking-tight hidden sm:inline">
            OnPremisAI
          </span>
        </Link>
      </div>

      {/* Right side: Export & Drawer Toggle */}
      <div className="flex items-center gap-1">
        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            className="p-1.5 rounded-lg text-primary-muted hover:text-primary hover:bg-surface-hover transition-colors"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </button>

          {isExportDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-surface-card border border-border-subtle shadow-floating py-1 z-50">
              <div className="px-3 py-2 text-[11px] text-primary-muted font-medium">
                Export Session
              </div>
              <button
                onClick={() => handleExport("md")}
                className="w-full text-left px-3 py-2 text-[13px] text-primary hover:bg-surface-hover flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-primary-muted" />
                <span>Markdown (.md)</span>
              </button>
              <button
                onClick={() => handleExport("json")}
                className="w-full text-left px-3 py-2 text-[13px] text-primary hover:bg-surface-hover flex items-center gap-2"
              >
                <FileCode className="w-3.5 h-3.5 text-primary-muted" />
                <span>Audit JSON (.json)</span>
              </button>
            </div>
          )}
        </div>

        {/* Context Panel Toggle */}
        <button
          onClick={toggleContextPanel}
          className={`p-1.5 rounded-lg transition-colors ${
            isContextPanelOpen
              ? "text-accent bg-accent/10"
              : "text-primary-muted hover:text-primary hover:bg-surface-hover"
          }`}
          title="Toggle Context Panel"
        >
          <PanelRight className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
