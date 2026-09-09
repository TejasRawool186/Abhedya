import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer";

    const variants = {
      primary:
        "bg-accent text-white hover:bg-accent-hover active:bg-accent-pressed shadow-sm",
      secondary:
        "bg-surface-card text-primary hover:bg-surface-hover border border-border-subtle",
      outline:
        "border border-border-medium bg-transparent text-primary hover:bg-surface-hover",
      ghost:
        "bg-transparent text-primary-secondary hover:text-primary hover:bg-surface-hover",
      danger:
        "bg-status-danger/15 text-status-danger hover:bg-status-danger/25 border border-status-danger/30",
    };

    const sizes = {
      sm: "h-8 px-3 text-[13px] rounded-lg gap-1.5",
      md: "h-9 px-4 text-sm rounded-lg gap-2",
      lg: "h-10 px-5 text-sm rounded-xl gap-2",
      icon: "h-8 w-8 p-0 rounded-lg justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
