import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Eye, EyeOff } from "lucide-react";
import { clsx } from "clsx";

interface FieldWrapProps {
  label?: string;
  error?: string;
  hint?: string;
}

const baseFieldClass =
  "w-full rounded-2xl border border-surface-border bg-surface-2 px-3.5 py-2.5 text-sm text-ink-0 placeholder:text-ink-3 outline-none transition-colors focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldWrapProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <label className="block space-y-1.5" htmlFor={inputId}>
        {label && <span className="text-xs font-medium text-ink-1">{label}</span>}
        <input ref={ref} id={inputId} className={clsx(baseFieldClass, error && "border-red-500/60", className)} {...rest} />
        {hint && !error && <span className="text-xs text-ink-3">{hint}</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </label>
    );
  }
);
Input.displayName = "Input";

export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldWrapProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id || rest.name;
    return (
      <label className="block space-y-1.5" htmlFor={inputId}>
        {label && <span className="text-xs font-medium text-ink-1">{label}</span>}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className={clsx(baseFieldClass, "pr-10", error && "border-red-500/60", className)}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-ink-3 hover:text-ink-0"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {hint && !error && <span className="text-xs text-ink-3">{hint}</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </label>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldWrapProps
>(({ label, error, hint, className, id, ...rest }, ref) => {
  const inputId = id || rest.name;
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label && <span className="text-xs font-medium text-ink-1">{label}</span>}
      <textarea ref={ref} id={inputId} className={clsx(baseFieldClass, "min-h-[100px] resize-y", error && "border-red-500/60", className)} {...rest} />
      {hint && !error && <span className="text-xs text-ink-3">{hint}</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
});
Textarea.displayName = "Textarea";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends FieldWrapProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({ label, error, hint, value, onChange, options, placeholder, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="block space-y-1.5" ref={rootRef}>
      {label && <span className="text-xs font-medium text-ink-1">{label}</span>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={clsx(
            baseFieldClass,
            "flex cursor-pointer items-center justify-between text-left hover:border-ink-3/50",
            error && "border-red-500/60",
            className
          )}
        >
          <span className={selected ? "text-ink-0" : "text-ink-3"}>{selected?.label ?? placeholder ?? "Select..."}</span>
          <ChevronDown size={16} className={clsx("shrink-0 text-ink-3 transition-transform duration-200", open && "rotate-180")} />
        </button>
        {open && (
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-2xl border border-surface-border bg-surface-1 p-1.5 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-surface-3",
                  opt.value === value ? "font-medium text-accent-600" : "text-ink-1"
                )}
              >
                {opt.label}
                {opt.value === value && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
      {hint && !error && <span className="text-xs text-ink-3">{hint}</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
