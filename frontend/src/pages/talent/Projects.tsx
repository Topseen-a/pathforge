import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { Input } from "@/components/ui/Input";
import { ProjectApi } from "@/lib/resources";
import type { ProjectResponse } from "@/lib/types";

export default function TalentProjects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<string>("ALL");

  useEffect(() => {
    ProjectApi.listPublished()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      projects.filter((e) => {
        const matchesQuery =
          e.title.toLowerCase().includes(query.toLowerCase()) || e.companyName.toLowerCase().includes(query.toLowerCase());
        const matchesMode = mode === "ALL" || e.workMode === mode;
        return matchesQuery && matchesMode;
      }),
    [projects, query, mode]
  );

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Browse projects" description="Discover published, company-hosted work experiences." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" size={16} />
          <Input placeholder="Search by title or company" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          {["ALL", "REMOTE", "PHYSICAL", "HYBRID"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`cursor-pointer rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                mode === m ? "border-accent-500 bg-accent-500/10 text-accent-600" : "border-surface-border text-ink-2 hover:bg-surface-2"
              }`}
            >
              {m === "ALL" ? "All" : m === "PHYSICAL" ? "Onsite" : m.charAt(0) + m.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No projects match your search" description="Try a different keyword or filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((exp) => (
            <Link key={exp.id} to={`/app/talent/projects/${exp.id}`} className="block h-full">
              <Card className="h-full space-y-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-500/40 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-semibold text-ink-0">{exp.title}</p>
                    <p className="text-sm text-ink-2">{exp.companyName}</p>
                  </div>
                  <StatusBadge status={exp.workMode} />
                </div>
                <p className="line-clamp-2 text-sm text-ink-2">{exp.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
                  {exp.location && <span>{exp.location}</span>}
                  {exp.durationDays && <span>· {exp.durationDays} days</span>}
                  <span>· {exp.paid ? `Paid${exp.compensationAmount ? ` · ₦${exp.compensationAmount.toLocaleString()}` : ""}` : "Unpaid"}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
