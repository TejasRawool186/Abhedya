import { useEffect, useRef, memo } from "react";
import { MessageBubble } from "./MessageBubble";
import { useTaskStore } from "@/store/useTaskStore";
import { Spinner } from "@/components/ui/Spinner";
import { Bot, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const MessageList = memo(function MessageList() {
  const messages = useTaskStore((s) => s.messages);
  const isStreaming = useTaskStore((s) => s.isStreaming);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    } else if (scrollRef.current && messages.length === 0) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages.length, isStreaming]);

  if (messages.length === 0 && !isStreaming) {
    return (
      <div
        ref={scrollRef}
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto"
      >
        <div className="flex flex-col items-center text-center max-w-md gap-5 animate-fade-in">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-panel border border-border flex items-center justify-center shadow-lg">
              <ShieldCheck
                size={40}
                className="text-accent"
                strokeWidth={1.5}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-panel-2 border border-border flex items-center justify-center">
              <Bot size={16} className="text-muted" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              Sovereign AI Workbench
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Upload an inspection report, compliance document, or industrial
              data file. Ask questions about findings, risks, or
              recommendations — all processing happens on-device within the
              air-gapped secure enclave.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full pt-2">
            {[
              { label: "PDF Report", hint: "Inspection" },
              { label: "Image Scan", hint: "PNG / JPG" },
              { label: "Spreadsheet", hint: "XLSX Data" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-panel-2/50 p-3 flex flex-col gap-0.5"
              >
                <div className="text-[11px] font-medium text-foreground">
                  {item.label}
                </div>
                <div className="text-[10px] text-muted">{item.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-5"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : undefined}
          >
            <MessageBubble message={message} />
          </div>
        ))}

        {isStreaming &&
          messages.length > 0 &&
          messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-panel-2 border border-border">
                <Spinner size="sm" variant="accent" />
                <span className="text-sm text-muted">
                  Agent is processing your request…
                </span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
});
