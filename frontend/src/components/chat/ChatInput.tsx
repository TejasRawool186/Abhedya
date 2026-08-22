import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useChat } from "@/hooks/useChat";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/Button";
import { Send, Paperclip, Square } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_INPUT_LENGTH = 4000;

export function ChatInput() {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, isSending } = useChat();
  const isStreaming = useTaskStore((s) => s.isStreaming);
  const setStreaming = useTaskStore((s) => s.setStreaming);
  const activeTask = useTaskStore((s) => s.activeTask);

  const disabled = isSending || (!value.trim() && !activeTask);

  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    const scrollHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = scrollHeight + "px";
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = e.target.value.slice(0, MAX_INPUT_LENGTH);
      setValue(nextValue);
      autoResize();
    },
    [autoResize]
  );

  const handleSubmit = useCallback(async () => {
    if (disabled || !value.trim()) return;
    const message = value;
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await sendMessage(message);
  }, [disabled, value, sendMessage]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleCancel = useCallback(() => {
    setStreaming(false);
  }, [setStreaming]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      onDragOver={handleDragOver}
      className="border-t border-border bg-panel/80 backdrop-blur-sm px-4 md:px-6 py-4"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        <div className="flex items-end gap-3 rounded-xl border border-border bg-background/60 p-2 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all">
          <div className="flex-shrink-0 pl-1 pb-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted hover:text-foreground h-9 w-9"
              title="Attach file"
              disabled={isStreaming}
            >
              <Paperclip size={18} />
            </Button>
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isStreaming
                  ? "Agent is processing…"
                  : "Ask about findings, risks, compliance, or upload a report to analyze…"
              }
              disabled={isStreaming}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent px-2 py-2",
                "text-sm text-foreground placeholder:text-muted/70",
                "focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed",
                "max-h-[200px] overflow-y-auto"
              )}
              style={{ minHeight: "36px" }}
            />
          </div>

          <div className="flex-shrink-0 pb-1.5 pr-1">
            {isStreaming ? (
              <Button
                variant="danger"
                size="md"
                onClick={handleCancel}
                leftIcon={<Square size={14} fill="currentColor" />}
              >
                Stop
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={!value.trim() || isSending}
                rightIcon={<Send size={16} />}
                loading={isSending}
              >
                Send
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3 text-[10px] text-muted">
            <span>
              <kbd className="px-1.5 py-0.5 rounded border-border bg-panel-2 border text-[9px] font-mono">
                Enter
              </kbd>{" "}
              to send
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded border-border bg-panel-2 border text-[9px] font-mono">
                Shift
              </kbd>{" "}
              +{" "}
              <kbd className="px-1.5 py-0.5 rounded border-border bg-panel-2 border text-[9px] font-mono">
                Enter
              </kbd>{" "}
              newline
            </span>
          </div>
          <span className="text-[10px] text-muted tabular-nums">
            {value.length}/{MAX_INPUT_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
}
