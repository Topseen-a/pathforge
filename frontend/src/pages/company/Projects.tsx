import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { ProjectApi } from "@/lib/resources";
import type { ProjectResponse } from "@/lib/types";

export default function CompanyProjects() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProjectApi.listMine()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Create, publish, and manage the projects you host."
        action={
          <Link to="/app/company/projects/new">
            <Button>
              <Plus size={16} /> New project
            </Button>
          </Link>
        }
      />
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Post your first project to start receiving applications." />
      ) : (
        <div className="space-y-3">
          {projects.map((exp) => (
            <Link key={exp.id} to={`/app/company/projects/${exp.id}`}>
              <Card className="flex items-center justify-between transition-colors hover:border-accent-500/40">
                <div>
                  <p className="text-sm font-medium text-ink-0">{exp.title}</p>
                  <p className="text-xs text-ink-3">
                    {exp.workMode} · {exp.paid ? "Paid" : "Unpaid"}
                  </p>
                </div>
                <StatusBadge status={exp.status} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
