import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg";
type Variant = "default" | "light" | "accent" | "success" | "danger";

export interface SpinnerProps {
  size?: Size;
  variant?: Variant;
  className?: string;
  label?: string;
}

const sizeMap: Record<Size, string> = {
  xs: "h-3 w-3 border-2",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-[3px]",
  lg: "h-10 w-10 border-4",
};

const variantMap: Record<Variant, string> = {
  default: "border-muted-2 border-t-foreground",
  light: "border-white/30 border-t-white",
  accent: "border-accent/30 border-t-accent",
  success: "border-success/30 border-t-success",
  danger: "border-danger/30 border-t-danger",
};

export function Spinner({
  size = "md",
  variant = "default",
  className,
  label,
}: SpinnerProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        label ? "" : "inline-block"
      )}
    >
      <span
        role="status"
        aria-label={label || "Loading"}
        className={cn(
          "inline-block rounded-full animate-spin",
          sizeMap[size],
          variantMap[variant],
          className
        )}
      />
      {label && (
        <span className="text-xs text-muted font-medium">{label}</span>
      )}
    </span>
  );
}
