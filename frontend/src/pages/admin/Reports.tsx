import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState, PageLoader } from "@/components/ui/Misc";
import { AdminApi } from "@/lib/resources";
import type { ReportResponse } from "@/lib/types";
import { useToast } from "@/context/ToastContext";
import { extractError } from "@/lib/api";

export default function AdminReports() {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { push } = useToast();

  const load = () => AdminApi.listOpenReports().then(setReports);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const resolve = async (id: string, status: "RESOLVED" | "DISMISSED") => {
    setBusyId(id);
    try {
      await AdminApi.resolveReport(id, status);
      push(`Report ${status.toLowerCase()}`, "success");
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
      <PageHeader title="Reports" description="Open reports filed by learners and companies." />
      {reports.length === 0 ? (
        <EmptyState title="No open reports" description="You're all caught up." />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-ink-0">{r.reason}</p>
                <p className="mt-1 text-xs text-ink-3">
                  Filed by {r.reporterName} · {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" loading={busyId === r.id} onClick={() => resolve(r.id, "DISMISSED")}>
                  Dismiss
                </Button>
                <Button size="sm" loading={busyId === r.id} onClick={() => resolve(r.id, "RESOLVED")}>
                  Resolve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
