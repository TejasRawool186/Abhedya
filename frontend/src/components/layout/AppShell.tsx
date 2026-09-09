"use client";

import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ContextPanel } from "./ContextPanel";
import { useTaskStore } from "@/store/useTaskStore";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen h-[100dvh] w-full flex flex-col bg-canvas text-primary overflow-hidden">
      {/* Global Header */}
      <Header />

      {/* Main 3-Column Shell Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden w-full">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Workspace Stage */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 h-full w-full bg-canvas overflow-hidden relative">
          {children}
        </main>

        {/* Right Context Drawer */}
        <ContextPanel />
      </div>
    </div>
  );
}
