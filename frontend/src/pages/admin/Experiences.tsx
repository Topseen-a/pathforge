import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { AdminApi, ExperienceApi } from "@/lib/resources";
import type { ExperienceResponse } from "@/lib/types";
import { useToast } from "@/context/ToastContext";
import { extractError } from "@/lib/api";

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<ExperienceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { push } = useToast();

  const load = () => ExperienceApi.listPublished().then(setExperiences);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const moderate = async (id: string) => {
    setBusyId(id);
    try {
      await AdminApi.moderateExperience(id);
      push("Experience closed by moderation", "success");
      await load();
    } catch (err) {
      push(extractError(err).message, "error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Experiences" description="Currently published experiences across the platform." />
      {experiences.length === 0 ? (
        <EmptyState title="No published experiences" />
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <Card key={exp.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-0">{exp.title}</p>
                <p className="text-xs text-ink-3">{exp.companyName} · {exp.workMode}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={exp.status} />
                <Button size="sm" variant="danger" loading={busyId === exp.id} onClick={() => moderate(exp.id)}>
                  Force close
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
