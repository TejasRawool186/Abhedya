import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive" | "flat";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variants = {
    default: "bg-[#071B26]/75 backdrop-blur-md border border-[#071B26]/60 rounded-xl",
    elevated: "bg-[#071B26]/75 backdrop-blur-md border border-[#071B26]/70 shadow-floating rounded-xl",
    interactive:
      "bg-[#071B26]/75 backdrop-blur-md border border-[#071B26]/60 hover:border-accent/40 hover:bg-[#071B26]/85 transition-all duration-150 cursor-pointer rounded-xl",
    flat: "bg-[#071B26]/60 backdrop-blur-md border border-[#071B26]/40 rounded-xl",
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
