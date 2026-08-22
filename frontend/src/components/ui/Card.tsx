import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Card({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border bg-panel shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-5 pb-3", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className, children, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-sm font-semibold leading-none tracking-wide text-foreground uppercase",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, children, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cn("text-xs text-muted", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={cn("p-5 pt-2", className)} {...props}>
        {children}
      </div>
    );
  }
);

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter({ className, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-5 pt-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
