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

  const sendMessage = useCallback(
    async (prompt: string) => {
      if (isSendingRef.current || isStreaming) return;
      if (!prompt.trim()) return;

      isSendingRef.current = true;

      addMessage({
        role: "user",
        content: prompt.trim(),
      });

      try {
        const documentId = getActiveDocumentId();

        const request: ChatRequest = {
          prompt: prompt.trim(),
          ...(documentId ? { document_id: documentId } : {}),
        };

        const response = await sendChat(request);

        setTask({
          id: response.task_id,
          status: response.status,
          prompt: prompt.trim(),
          documentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to send message";
        addError(message);
      } finally {
        isSendingRef.current = false;
      }
    },
    [addMessage, setTask, getActiveDocumentId, addError, isStreaming]
  );

  return {
    isSending: isSendingRef.current || isStreaming,
    sendMessage,
  };
}
