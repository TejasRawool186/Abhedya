import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "accent"
  | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  default:
    "bg-panel-2 text-foreground border-border",
  success:
    "bg-success/15 text-success border-success/30",
  warning:
    "bg-warning/15 text-warning border-warning/30",
  danger:
    "bg-danger/15 text-danger border-danger/30",
  accent:
    "bg-accent/15 text-accent border-accent/30",
  outline:
    "bg-transparent text-foreground border-border",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "default", className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-[10px] font-semibold uppercase tracking-wider",
        "transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
