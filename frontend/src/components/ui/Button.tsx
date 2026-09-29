import { type ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent-500 text-ink-0 hover:bg-accent-600 font-semibold",
  accent: "bg-ink-0 text-surface-0 hover:opacity-90 font-semibold",
  secondary: "bg-surface-3 text-ink-0 hover:bg-surface-4",
  ghost: "bg-transparent text-ink-1 hover:bg-surface-3 hover:text-ink-0",
  outline: "bg-transparent border border-surface-border text-ink-0 hover:bg-surface-2 hover:border-surface-4",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3.5 py-1.5 rounded-full",
  md: "text-sm px-5 py-2.5 rounded-full",
  lg: "text-base px-6 py-3 rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex cursor-pointer items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {loading && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
