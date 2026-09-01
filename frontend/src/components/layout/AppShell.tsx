"use client";

import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ContextPanel } from "./ContextPanel";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--background)] text-zinc-100 overflow-hidden font-sans antialiased">
      {/* Top Sovereign Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Collapsible Left Sidebar */}
        <Sidebar />

        {/* Center Content Workspace */}
        <main className="flex-1 flex flex-col min-w-0 bg-[var(--background)] overflow-hidden relative">
          {children}
        </main>

        {/* Collapsible Right Inspector Context Panel */}
        <ContextPanel />
      </div>
    </div>
  );
};
