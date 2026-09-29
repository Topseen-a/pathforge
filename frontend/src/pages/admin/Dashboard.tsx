import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Flag, Users, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { PageLoader, StatCard } from "@/components/ui/Misc";
import { AdminApi, ProjectApi } from "@/lib/resources";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ users: number; reports: number; projects: number; companies: number } | null>(null);

  useEffect(() => {
    Promise.all([
      AdminApi.listUsers().catch(() => []),
      AdminApi.listOpenReports().catch(() => []),
      ProjectApi.listPublished().catch(() => []),
      AdminApi.listCompanies().catch(() => []),
    ]).then(([users, reports, projects, companies]) => {
      setStats({ users: users.length, reports: reports.length, projects: projects.length, companies: companies.length });
    });
  }, []);

  if (!stats) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Admin overview" description="Moderate companies, projects, users, and reports." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={stats.users} icon={<Users size={18} />} />
        <StatCard label="Published projects" value={stats.projects} icon={<Briefcase size={18} />} />
        <StatCard label="Open reports" value={stats.reports} icon={<Flag size={18} />} />
        <StatCard label="Companies" value={stats.companies} icon={<Building2 size={18} />} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/app/admin/reports" className="card p-5 hover:border-accent-500/40">
          <p className="text-sm font-medium text-ink-0">Review open reports</p>
          <p className="mt-1 text-xs text-ink-3">Resolve or dismiss flagged content and users.</p>
        </Link>
        <Link to="/app/admin/companies" className="card p-5 hover:border-accent-500/40">
          <p className="text-sm font-medium text-ink-0">Verify companies</p>
          <p className="mt-1 text-xs text-ink-3">Approve companies before they can publish projects.</p>
        </Link>
      </div>
    </div>
  );
}
