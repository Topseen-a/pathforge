import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { AdminApi } from "@/lib/resources";
import type { CompanyResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CompanyResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const { push } = useToast();

  const load = () => AdminApi.listCompanies().then(setCompanies);

  useEffect(() => {
    load()
      .catch((err) => push(extractError(err).message, "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (status: "VERIFIED" | "REJECTED" | "SUSPENDED") => {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await AdminApi.verifyCompany(selected.id, status);
      setSelected(res);
      setCompanies((prev) => prev.map((c) => (c.id === res.id ? res : c)));
      push(`Company marked ${status.toLowerCase()}`, "success");
    } catch (err) {
      push(extractError(err).message, "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Companies" description="Review and verify registered companies." />

      {companies.length === 0 ? (
        <EmptyState title="No companies yet" description="Registered companies will show up here." />
      ) : (
        <div className="mb-6 space-y-3">
          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-surface-border bg-surface-1 p-4 text-left transition-colors hover:border-accent-500/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-0">{c.name}</p>
                <p className="truncate text-xs text-ink-3">{c.email}</p>
              </div>
              <StatusBadge status={c.verificationStatus} />
            </button>
          ))}
        </div>
      )}

      {selected && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-ink-0">{selected.name}</p>
              <p className="text-sm text-ink-2">{selected.email}</p>
            </div>
            <StatusBadge status={selected.verificationStatus} />
          </div>
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-ink-3">Website</p>
              <p className="text-ink-0">{selected.website ?? "—"}</p>
            </div>
            <div>
              <p className="text-ink-3">Business registration no.</p>
              <p className="text-ink-0">{selected.businessRegistrationNo ?? "—"}</p>
            </div>
          </div>
          {selected.description && <p className="text-sm text-ink-1">{selected.description}</p>}
          <div className="flex flex-wrap gap-2 border-t border-surface-border pt-4">
            <Button size="sm" loading={busy} onClick={() => setStatus("VERIFIED")}>
              Verify
            </Button>
            <Button size="sm" variant="outline" loading={busy} onClick={() => setStatus("REJECTED")}>
              Reject
            </Button>
            <Button size="sm" variant="danger" loading={busy} onClick={() => setStatus("SUSPENDED")}>
              Suspend
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
