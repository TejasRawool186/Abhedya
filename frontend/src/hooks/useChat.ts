import { useCallback, useRef } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { sendChat } from "@/lib/api";
import type { ChatRequest } from "@/lib/api";

export interface UseChatReturn {
  isSending: boolean;
  sendMessage: (prompt: string) => Promise<void>;
}

export function useChat(): UseChatReturn {
  const isSendingRef = useRef(false);
  const addMessage = useTaskStore((s) => s.addMessage);
  const setTask = useTaskStore((s) => s.setTask);
  const getActiveDocumentId = useTaskStore((s) => s.getActiveDocumentId);
  const addError = useTaskStore((s) => s.addError);
  const isStreaming = useTaskStore((s) => s.isStreaming);
  const selectedModel = useTaskStore((s) => s.selectedModel);
  const addRecentTask = useTaskStore((s) => s.addRecentTask);

  const sendMessage = useCallback(
    async (prompt: string) => {
      if (isSendingRef.current || isStreaming) return;
      if (!prompt.trim()) return;

      isSendingRef.current = true;

      const userText = prompt.trim();
      addMessage({
        role: "user",
        content: userText,
      });

      try {
        const documentId = getActiveDocumentId();

        const request: ChatRequest = {
          prompt: userText,
          selected_models: [selectedModel],
          ...(documentId ? { document_id: documentId } : {}),
        };

        const response = await sendChat(request);

        setTask({
          id: response.task_id,
          status: (response.status as any) || "queued",
          prompt: userText,
          documentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        addRecentTask({
          id: response.task_id,
          title: userText.length > 45 ? userText.substring(0, 45) + "..." : userText,
          status: "processing",
        });

      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to initiate task";
        addError(message);
      } finally {
        isSendingRef.current = false;
      }
    },
    [addMessage, setTask, getActiveDocumentId, addError, isStreaming, selectedModel, addRecentTask]
  );

  return {
    isSending: isSendingRef.current || isStreaming,
    sendMessage,
  };
}
