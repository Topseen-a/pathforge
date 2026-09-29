import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { ApplicationApi } from "@/lib/resources";
import type { ApplicationResponse } from "@/lib/types";

export default function TalentApplications() {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApplicationApi.listMine()
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="My applications" description="Track the status of every project you've applied to." />
      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse open projects and apply to start building your passport."
          action={
            <Link to="/app/talent/projects" className="text-sm font-medium text-accent-600 hover:text-accent-700">
              Browse projects →
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <Card key={a.id} className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-ink-0">{a.projectTitle}</p>
                <p className="text-xs text-ink-3">Applied {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}</p>
              </div>
              <StatusBadge status={a.status} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
