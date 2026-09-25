import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, ErrorBanner, StatusBadge } from "@/components/ui/Misc";
import { AdminApi, CompanyApi } from "@/lib/resources";
import type { CompanyResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function AdminCompanies() {
  const [companyId, setCompanyId] = useState("");
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const { push } = useToast();

  const lookup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setCompany(null);
    setLoading(true);
    try {
      const res = await CompanyApi.getById(companyId.trim());
      setCompany(res);
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const setStatus = async (status: "VERIFIED" | "REJECTED" | "SUSPENDED") => {
    if (!company) return;
    setBusy(true);
    try {
      const res = await AdminApi.verifyCompany(company.id, status);
      setCompany(res);
      push(`Company marked ${status.toLowerCase()}`, "success");
    } catch (err) {
      push(extractError(err).message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="Companies" description="Look up a company by ID to review and verify it." />

      <Card className="mb-6">
        <form onSubmit={lookup} className="flex gap-2">
          <Input placeholder="Company ID" value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="flex-1" />
          <Button type="submit" loading={loading}>
            Look up
          </Button>
        </form>
        <p className="mt-2 text-xs text-ink-3">
          Tip: company IDs can be found in application/experience details, or the company's own profile response.
        </p>
      </Card>

      {error && <ErrorBanner message={error} />}

      {company && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-ink-0">{company.name}</p>
              <p className="text-sm text-ink-2">{company.email}</p>
            </div>
            <StatusBadge status={company.verificationStatus} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-ink-3">Website</p>
              <p className="text-ink-0">{company.website ?? "—"}</p>
            </div>
            <div>
              <p className="text-ink-3">Business registration no.</p>
              <p className="text-ink-0">{company.businessRegistrationNo ?? "—"}</p>
            </div>
          </div>
          {company.description && <p className="text-sm text-ink-1">{company.description}</p>}
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
