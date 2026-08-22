import { useEffect, useCallback, useRef } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { connectTaskStream } from "@/lib/sse";

export interface UseAgentTraceReturn {
  connected: boolean;
  reconnect: () => void;
}

export function useAgentTrace(taskId: string | null | undefined): UseAgentTraceReturn {
  const disconnectRef = useRef<(() => void) | null>(null);
  const connectedRef = useRef(false);

  const addMessage = useTaskStore((s) => s.addMessage);
  const addAgentStep = useTaskStore((s) => s.addAgentStep);
  const setTaskStatus = useTaskStore((s) => s.setTaskStatus);
  const setApprovalRecommendation = useTaskStore((s) => s.setApprovalRecommendation);
  const markTaskComplete = useTaskStore((s) => s.markTaskComplete);
  const addError = useTaskStore((s) => s.addError);
  const setStreaming = useTaskStore((s) => s.setStreaming);

  const connect = useCallback(() => {
    if (!taskId) return;

    if (disconnectRef.current) {
      disconnectRef.current();
      disconnectRef.current = null;
    }

    setStreaming(true);

    disconnectRef.current = connectTaskStream(taskId, {
      onOpen: () => {
        connectedRef.current = true;
      },
      onStep: (step) => {
        addAgentStep(step);
      },
      onStatus: (status) => {
        setTaskStatus(status);
      },
      onApprovalRequired: (recommendation) => {
        setApprovalRecommendation(recommendation);
      },
      onComplete: (outputFormat, downloadUrl) => {
        markTaskComplete(outputFormat, downloadUrl);
        addMessage({
          role: "assistant",
          content: "Analysis complete. Your generated report is ready for download.",
        });
      },
      onError: (message) => {
        addError(message);
      },
      onClose: () => {
        connectedRef.current = false;
        setStreaming(false);
      },
    });
  }, [
    taskId,
    addMessage,
    addAgentStep,
    setTaskStatus,
    setApprovalRecommendation,
    markTaskComplete,
    addError,
    setStreaming,
  ]);

  useEffect(() => {
    if (!taskId) {
      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }
      connectedRef.current = false;
      return;
    }

    connect();

    return () => {
      if (disconnectRef.current) {
        disconnectRef.current();
        disconnectRef.current = null;
      }
      connectedRef.current = false;
    };
  }, [taskId, connect]);

  return {
    connected: connectedRef.current,
    reconnect: connect,
  };
}
