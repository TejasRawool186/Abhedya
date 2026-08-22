import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { cn, formatTimestamp } from "@/lib/utils";
import type { Message } from "@/types/chat";
import { AlertTriangle, User, Bot } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface MessageBubbleProps {
  message: Message;
}

const roleConfig = {
  user: {
    container: "justify-end",
    bubble: "bg-accent/90 text-white border-accent/50",
    meta: "text-white/70",
    label: "YOU",
    icon: User,
    badgeVariant: "accent" as const,
  },
  assistant: {
    container: "justify-start",
    bubble: "bg-panel-2 text-foreground border-border",
    meta: "text-muted",
    label: "AI AGENT",
    icon: Bot,
    badgeVariant: "outline" as const,
  },
  system: {
    container: "justify-center",
    bubble: "bg-muted-2/20 text-muted border-border/50 text-xs max-w-md",
    meta: "text-muted",
    label: "SYSTEM",
    icon: Bot,
    badgeVariant: "default" as const,
  },
  error: {
    container: "justify-start",
    bubble: "bg-danger/10 text-danger border-danger/30",
    meta: "text-danger/70",
    label: "ERROR",
    icon: AlertTriangle,
    badgeVariant: "danger" as const,
  },
};

export const MessageBubble = memo(function MessageBubble({
  message,
}: MessageBubbleProps) {
  const config = roleConfig[message.role];
  const Icon = config.icon;

  const isMarkdown = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in",
        config.container
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] md:max-w-[75%] gap-3",
          message.role === "user" ? "flex-row-reverse" : "flex-row"
        )}
      >
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center",
            message.role === "user"
              ? "bg-white/15 text-white"
              : message.role === "error"
              ? "bg-danger/20 text-danger"
              : "bg-panel text-accent border border-border"
          )}
          aria-hidden="true"
        >
          <Icon size={16} strokeWidth={2} />
        </div>

        <div className="flex flex-col gap-1.5 min-w-0">
          <div
            className={cn(
              "flex items-center gap-2",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <Badge variant={config.badgeVariant} className="text-[9px]">
              {config.label}
            </Badge>
            <span className={cn("text-[10px]", config.meta)}>
              {formatTimestamp(message.timestamp)}
            </span>
          </div>

          <div
            className={cn(
              "px-4 py-3 rounded-xl border shadow-sm",
              "break-words whitespace-normal",
              config.bubble
            )}
          >
            {isMarkdown ? (
              <div className="markdown-content text-[13.5px] leading-relaxed">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ) : (
              <p
                className={cn(
                  "text-[13.5px] leading-relaxed",
                  message.role === "system" ? "text-center" : ""
                )}
              >
                {message.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
