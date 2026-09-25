import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { ExperienceApi } from "@/lib/resources";
import type { ExperienceResponse } from "@/lib/types";

export default function CompanyExperiences() {
  const [experiences, setExperiences] = useState<ExperienceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ExperienceApi.listMine()
      .then(setExperiences)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title="Experiences"
        description="Create, publish, and manage the experiences you host."
        action={
          <Link to="/app/company/experiences/new">
            <Button>
              <Plus size={16} /> New experience
            </Button>
          </Link>
        }
      />
      {experiences.length === 0 ? (
        <EmptyState title="No experiences yet" description="Post your first experience to start receiving applications." />
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <Link key={exp.id} to={`/app/company/experiences/${exp.id}`}>
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
