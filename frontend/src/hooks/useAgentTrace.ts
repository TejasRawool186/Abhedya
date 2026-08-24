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
        // If this step produced the synthesized response or recommendation, display it in the chat
        if (
          step.nodeName === "compare_and_recommend" ||
          step.nodeName === "synthesize_response" ||
          step.nodeName === "code_gen"
        ) {
          const content =
            step.output?.recommendation ||
            step.output?.answer ||
            step.output?.code_snippet ||
            step.output?.result;
          if (content && typeof content === "string") {
            addMessage({
              role: "assistant",
              content,
            });
          }
        }
      },
      onStatus: (status) => {
        setTaskStatus(status);
      },
      onApprovalRequired: (recommendation) => {
        setApprovalRecommendation(recommendation);
        // Only add message if it wasn't already emitted by compare_and_recommend step
        if (recommendation && typeof recommendation === "string") {
          const existingMessages = useTaskStore.getState().messages;
          const alreadyAdded = existingMessages.some(
            (m) => m.role === "assistant" && m.content === recommendation
          );
          if (!alreadyAdded) {
            addMessage({
              role: "assistant",
              content: recommendation,
            });
          }
        }
      },
      onComplete: (outputFormat, downloadUrl) => {
        markTaskComplete(outputFormat, downloadUrl);
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
