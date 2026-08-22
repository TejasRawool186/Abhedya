"use client";

import dynamic from "next/dynamic";
import { useTaskStore } from "@/store/useTaskStore";
import { useAgentTrace } from "@/hooks/useAgentTrace";

const NetworkSentinel = dynamic(
  () => import("@/components/network/NetworkSentinel").then((m) => m.NetworkSentinel),
  { ssr: false }
);

const ChatWindow = dynamic(
  () => import("@/components/chat/ChatWindow").then((m) => m.ChatWindow),
  { ssr: false }
);

const AgentTrace = dynamic(
  () => import("@/components/agent/AgentTrace").then((m) => m.AgentTrace),
  { ssr: false }
);

const ApprovalCheckpoint = dynamic(
  () => import("@/components/approval/ApprovalCheckpoint").then((m) => m.ApprovalCheckpoint),
  { ssr: false }
);

export default function ChatPage() {
  const activeTask = useTaskStore((s) => s.activeTask);
  useAgentTrace(activeTask?.id);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 max-w-[1800px] mx-auto w-full">
        <aside className="lg:col-span-3 flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r border-border order-2 lg:order-1">
          <div className="flex-1 flex flex-col min-h-0 max-h-[50vh] lg:max-h-none overflow-hidden">
            <NetworkSentinel />
          </div>
        </aside>

        <main className="lg:col-span-6 flex flex-col min-h-0 order-1 lg:order-2">
          <ChatWindow />
        </main>

        <aside className="lg:col-span-3 flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-border order-3 min-h-[420px] lg:min-h-0">
          <AgentTrace />
        </aside>
      </div>

      <ApprovalCheckpoint />
    </div>
  );
}
