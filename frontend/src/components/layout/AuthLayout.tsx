import type { ReactNode } from "react";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="grid min-h-screen bg-surface-0 text-ink-0 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent-500" />
            <span className="text-lg font-semibold">PathForge</span>
          </div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-ink-2">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-forest-bg lg:block">
        <div className="relative flex h-full flex-col justify-between p-12">
          <div />
          <div className="space-y-6">
            <div className="max-w-sm space-y-4 rounded-3xl border border-forest-border bg-forest-card p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-accent-400">Verified passport</p>
              <p className="text-lg font-medium text-forest-ink">
                "PathForge turned my first real project into proof employers actually trust."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent-500/25" />
                <div>
                  <p className="text-sm font-medium text-forest-ink">Chidinma A.</p>
                  <p className="text-xs text-forest-ink-dim">Product Design Experience Record</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                ["1,200+", "Learners"],
                ["300+", "Companies"],
                ["4,800+", "Experiences"],
              ].map(([num, label]) => (
                <div key={label} className="rounded-2xl border border-forest-border bg-forest-card p-4">
                  <p className="text-xl font-semibold text-accent-400">{num}</p>
                  <p className="text-xs text-forest-ink-dim">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
