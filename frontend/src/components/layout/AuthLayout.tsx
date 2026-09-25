import type { ReactNode } from "react";

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="grid min-h-screen bg-surface-0 text-ink-0 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent-500 shadow-[0_0_20px_-2px_rgba(209,41,58,0.6)]" />
            <span className="text-lg font-semibold">PathForge</span>
          </div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-ink-2">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-surface-1 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(209,41,58,0.28),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(209,41,58,0.16),transparent_40%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div />
          <div className="space-y-6">
            <div className="card glow-accent max-w-sm space-y-4 p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-accent-400">Verified passport</p>
              <p className="text-lg font-medium text-ink-0">
                "PathForge turned my first real project into proof employers actually trust."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent-500/20" />
                <div>
                  <p className="text-sm font-medium text-ink-0">Chidinma A.</p>
                  <p className="text-xs text-ink-3">Product Design Experience Record</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                ["1,200+", "Learners"],
                ["300+", "Companies"],
                ["4,800+", "Experiences"],
              ].map(([num, label]) => (
                <div key={label} className="card p-4">
                  <p className="text-xl font-semibold text-accent-400">{num}</p>
                  <p className="text-xs text-ink-3">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
