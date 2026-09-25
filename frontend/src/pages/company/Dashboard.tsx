import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ClipboardList, Users, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader, StatCard, StatusBadge } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { CompanyApi, ExperienceApi } from "@/lib/resources";
import type { CompanyResponse, ExperienceResponse } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [experiences, setExperiences] = useState<ExperienceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([CompanyApi.getMine().catch(() => null), ExperienceApi.listMine().catch(() => [])]).then(([c, e]) => {
      setCompany(c);
      setExperiences(e);
      setLoading(false);
    });
  }, []);

  if (loading) return <PageLoader />;

  const published = experiences.filter((e) => e.status === "PUBLISHED").length;
  const drafts = experiences.filter((e) => e.status === "DRAFT").length;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.fullName?.split(" ")[0] ?? ""}`}
        description="Manage your experiences, applicants, and evaluations."
        action={
          <Link to="/app/company/experiences/new">
            <Button>Post an experience</Button>
          </Link>
        }
      />

      {company && company.verificationStatus !== "VERIFIED" && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          Your company is {company.verificationStatus.toLowerCase()}. You'll need to be verified by an admin before you can publish experiences.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total experiences" value={experiences.length} icon={<Briefcase size={18} />} />
        <StatCard label="Published" value={published} icon={<CheckCircle2 size={18} />} />
        <StatCard label="Drafts" value={drafts} icon={<ClipboardList size={18} />} />
        <StatCard label="Verification" value={company?.verificationStatus ?? "—"} icon={<Users size={18} />} />
      </div>

      <Card className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-0">Your experiences</h2>
          <Link to="/app/company/experiences" className="text-xs font-medium text-accent-400 hover:text-accent-300">
            View all
          </Link>
        </div>
        {experiences.length === 0 ? (
          <EmptyState title="No experiences posted yet" description="Post your first work experience to start receiving applications." />
        ) : (
          <div className="space-y-3">
            {experiences.slice(0, 6).map((exp) => (
              <Link
                key={exp.id}
                to={`/app/company/experiences/${exp.id}`}
                className="flex items-center justify-between rounded-xl border border-surface-border px-4 py-3 hover:border-accent-500/40 hover:bg-surface-2"
              >
                <p className="text-sm font-medium text-ink-0">{exp.title}</p>
                <StatusBadge status={exp.status} />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
