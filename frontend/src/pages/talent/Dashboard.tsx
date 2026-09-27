import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ClipboardList, Award, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader, StatCard, StatusBadge } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { ApplicationApi, ProjectApi, PassportApi, WorkspaceApi } from "@/lib/resources";
import type { ApplicationResponse, ExperienceRecordResponse, ProjectResponse, WorkspaceResponse } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

export default function TalentDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceResponse[]>([]);
  const [passport, setPassport] = useState<ExperienceRecordResponse[]>([]);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ApplicationApi.listMine().catch(() => []),
      WorkspaceApi.listMine().catch(() => []),
      PassportApi.getMine().catch(() => []),
      ProjectApi.listPublished().catch(() => []),
    ]).then(([a, w, p, e]) => {
      setApplications(a);
      setWorkspaces(w);
      setPassport(p);
      setProjects(e.slice(0, 4));
      setLoading(false);
    });
  }, []);

  if (loading) return <PageLoader />;

  const pending = applications.filter((a) => a.status === "PENDING").length;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? ""}`}
        description="Here's where your PathForge journey stands today."
        action={
          <Link to="/app/talent/projects">
            <Button>Browse projects</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Applications" value={applications.length} hint={`${pending} pending`} icon={<ClipboardList size={18} />} />
        <StatCard label="Active workspaces" value={workspaces.length} icon={<FolderKanban size={18} />} />
        <StatCard label="Passport records" value={passport.length} hint="Verified experiences" icon={<Award size={18} />} />
        <StatCard label="Open opportunities" value={projects.length} hint="Currently published" icon={<Briefcase size={18} />} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-0">Recommended projects</h2>
            <Link to="/app/talent/projects" className="text-xs font-medium text-accent-600 hover:text-accent-700">
              View all
            </Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState title="No open projects yet" description="Check back soon — new opportunities are published regularly." />
          ) : (
            <div className="space-y-3">
              {projects.map((exp) => (
                <Link
                  key={exp.id}
                  to={`/app/talent/projects/${exp.id}`}
                  className="flex items-center justify-between rounded-xl border border-surface-border px-4 py-3 transition-colors hover:border-accent-500/40 hover:bg-surface-2"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-0">{exp.title}</p>
                    <p className="text-xs text-ink-3">{exp.companyName} · {exp.workMode}</p>
                  </div>
                  <StatusBadge status={exp.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-semibold text-ink-0">Recent applications</h2>
          {applications.length === 0 ? (
            <EmptyState title="No applications yet" />
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <p className="truncate text-sm text-ink-1">{a.projectTitle}</p>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
