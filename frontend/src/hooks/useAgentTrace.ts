import { useEffect, useCallback, useRef } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { connectTaskStream } from "@/lib/sse";
import { getDownloadUrl } from "@/lib/api";
import type { AgentTraceStep, AgentNodeName } from "@/types/agent";

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
      onStep: (rawStep) => {
        const stepId = `${taskId}_step_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        const mappedStep: AgentTraceStep = {
          id: stepId,
          taskId: taskId,
          nodeName: (rawStep.node_name as AgentNodeName) || "agent_planning",
          status: "completed",
          timestamp: rawStep.ts || new Date().toISOString(),
          input: rawStep.input,
          output: rawStep.output,
          tool: rawStep.tool,
        };

        addAgentStep(mappedStep);

        // Update task status based on current active node
        if (rawStep.node_name === "classifier") {
          setTaskStatus("processing");
        } else if (rawStep.node_name === "risk_eval") {
          setTaskStatus("processing");
        }

        // If step output contains final text response, display it in chat
        if (rawStep.output) {
          const content =
            (rawStep.output.recommendation as string) ||
            (rawStep.output.final_response as string) ||
            (rawStep.output.answer as string) ||
            (rawStep.output.result as string) ||
            (rawStep.output.summary as string);

          if (content && typeof content === "string") {
            const existingMessages = useTaskStore.getState().messages;
            const alreadyAdded = existingMessages.some(
              (m) => m.role === "assistant" && m.content === content
            );
            if (!alreadyAdded) {
              addMessage({
                role: "assistant",
                content,
              });
            }
          }
        }
      },

      onCheckpoint: (checkpoint) => {
        setTaskStatus("checkpoint");
        setApprovalRecommendation(
          checkpoint.recommendation,
          checkpoint.risk_level,
          checkpoint.confidence
        );

        if (checkpoint.recommendation && typeof checkpoint.recommendation === "string") {
          const existingMessages = useTaskStore.getState().messages;
          const alreadyAdded = existingMessages.some(
            (m) => m.role === "assistant" && m.content === checkpoint.recommendation
          );
          if (!alreadyAdded) {
            addMessage({
              role: "assistant",
              content: `**[OPERATOR APPROVAL CHECKPOINT REQUIRED]**\n\n${checkpoint.recommendation}`,
            });
          }
        }
      },

      onComplete: (data) => {
        const downloadUrl = getDownloadUrl(taskId);
        markTaskComplete("docx", downloadUrl);
      },

      onDone: () => {
        setStreaming(false);
      },

      onError: (err) => {
        addError(err.message || "Trace stream connection failed");
        setStreaming(false);
      },
    });

    connectedRef.current = true;
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
