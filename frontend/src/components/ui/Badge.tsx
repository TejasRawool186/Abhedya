import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "accent";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-surface-card text-primary-secondary border-border-subtle",
    success: "bg-status-success/10 text-status-success border-status-success/20",
    warning: "bg-status-warning/10 text-status-warning border-status-warning/20",
    danger: "bg-status-danger/10 text-status-danger border-status-danger/20",
    info: "bg-status-info/10 text-status-info border-status-info/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    outline: "bg-transparent text-primary-secondary border-border-medium",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px] font-mono tracking-tight",
    md: "px-2 py-0.5 text-[11px] font-mono",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-medium whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
