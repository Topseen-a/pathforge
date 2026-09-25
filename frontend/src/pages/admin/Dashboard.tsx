import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Flag, Users, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { PageLoader, StatCard } from "@/components/ui/Misc";
import { AdminApi, ExperienceApi } from "@/lib/resources";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ users: number; reports: number; experiences: number } | null>(null);

  useEffect(() => {
    Promise.all([
      AdminApi.listUsers().catch(() => []),
      AdminApi.listOpenReports().catch(() => []),
      ExperienceApi.listPublished().catch(() => []),
    ]).then(([users, reports, experiences]) => {
      setStats({ users: users.length, reports: reports.length, experiences: experiences.length });
    });
  }, []);

  if (!stats) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Admin overview" description="Moderate companies, experiences, users, and reports." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats.users} icon={<Users size={18} />} />
        <StatCard label="Published experiences" value={stats.experiences} icon={<Briefcase size={18} />} />
        <StatCard label="Open reports" value={stats.reports} icon={<Flag size={18} />} />
        <StatCard label="Companies" value="—" icon={<Building2 size={18} />} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/app/admin/reports" className="card p-5 hover:border-accent-500/40">
          <p className="text-sm font-medium text-ink-0">Review open reports</p>
          <p className="mt-1 text-xs text-ink-3">Resolve or dismiss flagged content and users.</p>
        </Link>
        <Link to="/app/admin/companies" className="card p-5 hover:border-accent-500/40">
          <p className="text-sm font-medium text-ink-0">Verify companies</p>
          <p className="mt-1 text-xs text-ink-3">Approve companies before they can publish experiences.</p>
        </Link>
      </div>
    </div>
  );
}
