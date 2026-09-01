import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "success" | "danger" | "ghost";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-2 focus-visible:ring-accent/50 border border-accent",
  secondary:
    "bg-panel-2 text-foreground hover:bg-border/60 focus-visible:ring-muted/50 border border-border",
  success:
    "bg-success/90 text-white hover:bg-success focus-visible:ring-success/50 border border-success",
  danger:
    "bg-danger/90 text-white hover:bg-danger focus-visible:ring-danger/50 border border-danger",
  ghost:
    "bg-transparent text-foreground hover:bg-panel-2 focus-visible:ring-muted/50 border border-transparent",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
  icon: "h-10 w-10 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    className,
    children,
    onClick,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-none font-mono font-bold uppercase tracking-wider",
        "transition-all duration-150 ease-out",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00]",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "active:scale-[0.98]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" variant="light" />
      ) : (
        leftIcon
      )}
      {size !== "icon" && children}
      {!loading && rightIcon}
    </button>
  );
});
