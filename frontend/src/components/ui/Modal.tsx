import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-surface-border bg-surface-1 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-0">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-2 hover:bg-surface-2 hover:text-ink-0">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
