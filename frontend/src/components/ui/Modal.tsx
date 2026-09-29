import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8" onClick={onClose}>
      <div
        className="flex max-h-[calc(100vh-4rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-1 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-6 py-4">
          <h2 className="text-base font-semibold text-ink-0">{title}</h2>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink-0">
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="shrink-0 border-t border-surface-border px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
