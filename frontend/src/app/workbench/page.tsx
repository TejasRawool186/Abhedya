"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useTaskStore } from "@/store/useTaskStore";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { AuditTrailView } from "@/components/audit/AuditTrailView";
import { NetworkSentinelView } from "@/components/security/NetworkSentinelView";
import { SettingsView } from "@/components/settings/SettingsView";
import { DocumentRepository } from "@/components/knowledge/DocumentRepository";
import { ApprovalCheckpoint } from "@/components/approval/ApprovalCheckpoint";
import { ModelConfigModal } from "@/components/chat/ModelConfigModal";
import { ArenaComparisonView } from "@/components/chat/ArenaComparisonView";

export default function WorkbenchPage() {
  const { activeView, modelConfig } = useTaskStore();

  const renderActiveView = () => {
    if (modelConfig.isArenaMode && activeView === "tasks") {
      return <ArenaComparisonView />;
    }

    switch (activeView) {
      case "tasks":
        return <ChatContainer />;
      case "knowledge":
        return <DocumentRepository />;
      case "audit":
        return <AuditTrailView />;
      case "network":
        return <NetworkSentinelView />;
      case "settings":
        return <SettingsView />;
      default:
        return <ChatContainer />;
    }
  };

  return (
    <AppShell>
      {/* Active Main View - Screen Fit Container */}
      <div className="flex-1 w-full h-full min-h-0 flex flex-col overflow-hidden">
        {renderActiveView()}
      </div>

      {/* Global Enclave Modals & HITL Gates */}
      <ApprovalCheckpoint />
      <ModelConfigModal />
    </AppShell>
  );
}
