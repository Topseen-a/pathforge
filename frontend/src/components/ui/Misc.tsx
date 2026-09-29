import type { ReactNode } from "react";
import { clsx } from "clsx";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("card p-5", className)}>{children}</div>;
}

const badgeTones: Record<string, string> = {
  neutral: "bg-surface-3 text-ink-1",
  accent: "bg-accent-500/15 text-accent-600",
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-amber-500/15 text-amber-400",
  danger: "bg-red-500/15 text-red-400",
  info: "bg-sky-500/15 text-sky-400",
};

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", badgeTones[tone])}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, keyof typeof badgeTones> = {
    DRAFT: "neutral",
    PUBLISHED: "success",
    CLOSED: "neutral",
    PENDING: "warning",
    ACCEPTED: "success",
    REJECTED: "danger",
    VERIFIED: "success",
    SUSPENDED: "danger",
    TODO: "neutral",
    IN_PROGRESS: "info",
    SUBMITTED: "warning",
    APPROVED: "success",
    COMPLETED: "success",
    ACTIVE: "success",
    OPEN: "warning",
    RESOLVED: "success",
    DISMISSED: "neutral",
  };
  return <Badge tone={map[status] ?? "neutral"}>{status.replace(/_/g, " ")}</Badge>;
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-surface-border px-6 py-14 text-center">
      <p className="text-sm font-medium text-ink-0">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-2">{description}</p>}
      {action}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <span className={clsx("inline-block h-5 w-5 animate-spin rounded-full border-2 border-ink-3 border-t-accent-500", className)} />;
}

export function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner />
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{message}</div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <Card className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="font-mono text-xs font-medium uppercase tracking-wide text-ink-2">{label}</p>
        <p className="mt-2 truncate text-2xl font-semibold text-ink-0">{value}</p>
        {hint && <p className="mt-1 text-xs text-ink-3">{hint}</p>}
      </div>
      {icon && <div className="shrink-0 rounded-xl bg-accent-500/10 p-2.5 text-accent-600">{icon}</div>}
    </Card>
  );
}
