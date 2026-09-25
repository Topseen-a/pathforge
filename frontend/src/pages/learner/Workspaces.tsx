import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader } from "@/components/ui/Misc";
import { WorkspaceApi } from "@/lib/resources";
import type { WorkspaceResponse } from "@/lib/types";

export default function LearnerWorkspaces() {
  const [workspaces, setWorkspaces] = useState<WorkspaceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    WorkspaceApi.listMine()
      .then(setWorkspaces)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Workspaces" description="Active work experiences you've been accepted into." />
      {workspaces.length === 0 ? (
        <EmptyState title="No workspaces yet" description="Accepted applications automatically open a workspace here." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {workspaces.map((w) => (
            <Link key={w.id} to={`/app/learner/workspaces/${w.id}`}>
              <Card className="flex items-start gap-3 transition-colors hover:border-accent-500/40">
                <div className="rounded-xl bg-accent-500/10 p-2.5 text-accent-400">
                  <FolderKanban size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-0">{w.experienceTitle}</p>
                  <p className="text-xs text-ink-3">{w.companyName}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
