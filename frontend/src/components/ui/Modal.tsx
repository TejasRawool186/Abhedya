import {
  useEffect,
  useRef,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    title,
    description,
    children,
    footer,
    showCloseButton = true,
    closeOnBackdropClick = true,
    className,
    ...props
  },
  ref
) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        className
      )}
      {...props}
      ref={ref}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
        className={cn(
          "relative z-10 w-full max-w-lg",
          "bg-[#121212] border border-[#242424] rounded-none shadow-2xl",
          "flex flex-col max-h-[85vh]"
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-5 border-b border-[#242424] bg-[#181818]">
            <div className="flex-1 pr-4">
              {title && (
                <h2
                  id="modal-title"
                  className="text-base font-bold text-[#F5F5F5] font-mono uppercase tracking-tight"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-1 text-xs text-zinc-400 font-mono"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close modal"
                className="shrink-0 -mt-1 -mr-2 text-zinc-400 hover:text-zinc-100 rounded-none"
              >
                <X size={18} />
              </Button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-[#242424] bg-[#181818] rounded-none">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});
