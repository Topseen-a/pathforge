import { useEffect, useState } from "react";
import { Card, EmptyState, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { ApplicationApi } from "@/lib/resources";
import type { ApplicationResponse } from "@/lib/types";
import { useToast } from "@/context/ToastContext";
import { extractError } from "@/lib/api";
import EvaluateModal from "./EvaluateModal";

export default function ApplicationsTab({ projectId }: { projectId: string }) {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { push } = useToast();
  const [evaluating, setEvaluating] = useState<ApplicationResponse | null>(null);

  const load = () => ApplicationApi.listForProject(projectId).then(setApplications);

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const decide = async (id: string, status: "ACCEPTED" | "REJECTED") => {
    setBusyId(id);
    try {
      await ApplicationApi.decide(id, status);
      push(`Application ${status.toLowerCase()}`, "success");
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
      {applications.length === 0 ? (
        <EmptyState title="No applications yet" description="Applicants will appear here once they apply." />
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <Card key={a.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-ink-0">{a.talentName}</p>
                {a.coverNote && <p className="mt-1 max-w-md text-sm text-ink-2">{a.coverNote}</p>}
                <p className="mt-1 text-xs text-ink-3">Applied {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                {a.status === "PENDING" ? (
                  <>
                    <Button size="sm" variant="outline" loading={busyId === a.id} onClick={() => decide(a.id, "REJECTED")}>
                      Reject
                    </Button>
                    <Button size="sm" loading={busyId === a.id} onClick={() => decide(a.id, "ACCEPTED")}>
                      Accept
                    </Button>
                  </>
                ) : (
                  <>
                    <StatusBadge status={a.status} />
                    {a.status === "ACCEPTED" && (
                      <Button size="sm" variant="outline" onClick={() => setEvaluating(a)}>
                        Evaluate
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {evaluating && (
        <EvaluateModal
          projectId={projectId}
          application={evaluating}
          onClose={() => setEvaluating(null)}
          onDone={() => {
            setEvaluating(null);
            push("Evaluation submitted — passport record created", "success");
          }}
        />
      )}
    </div>
  );
}
