import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
        {error && <span className="text-xs text-red-400">{error}</span>}
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
        {error && <span className="text-xs text-red-400">{error}</span>}
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
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
});
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & FieldWrapProps
>(({ label, error, hint, className, id, children, ...rest }, ref) => {
  const inputId = id || rest.name;
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      {label && <span className="text-xs font-medium text-ink-1">{label}</span>}
      <select ref={ref} id={inputId} className={clsx(baseFieldClass, error && "border-red-500/60", className)} {...rest}>
        {children}
      </select>
      {hint && !error && <span className="text-xs text-ink-3">{hint}</span>}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
});
Select.displayName = "Select";
