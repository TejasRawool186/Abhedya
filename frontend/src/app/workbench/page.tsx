"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { DocumentRepository } from "@/components/knowledge/DocumentRepository";
import { AuditTrailView } from "@/components/audit/AuditTrailView";
import { NetworkSentinelView } from "@/components/security/NetworkSentinelView";
import { useTaskStore } from "@/store/useTaskStore";

export default function WorkbenchPage() {
  const activeTab = useTaskStore((s) => s.activeTab);

  return (
    <AppShell>
      {activeTab === "workbench" && <ChatContainer />}
      {activeTab === "documents" && <DocumentRepository />}
      {activeTab === "audit" && <AuditTrailView />}
      {activeTab === "security" && <NetworkSentinelView />}
    </AppShell>
  );
}
