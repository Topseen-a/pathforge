import { useEffect, useState } from "react";
import { Award, Copy } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { PassportApi } from "@/lib/resources";
import type { ExperienceRecordResponse } from "@/lib/types";
import { useToast } from "@/context/ToastContext";

export default function TalentPassport() {
  const [records, setRecords] = useState<ExperienceRecordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  useEffect(() => {
    PassportApi.getMine()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    push("Verification code copied", "success");
  };

  return (
    <div>
      <PageHeader title="Experience passport" description="Verified proof of every completed work experience." />
      {records.length === 0 ? (
        <EmptyState title="No verified experiences yet" description="Completed and evaluated experiences appear here automatically." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {records.map((r) => (
            <Card key={r.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-accent-500/10 p-2 text-accent-600">
                    <Award size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-0">{r.projectTitle}</p>
                    <p className="text-xs text-ink-3">{r.companyName}</p>
                  </div>
                </div>
                <StatusBadge status={r.verificationStatus} />
              </div>
              <button
                onClick={() => copyCode(r.verificationCode)}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-xs font-mono text-ink-1 hover:bg-surface-3"
              >
                {r.verificationCode}
                <Copy size={12} />
              </button>
              {r.completedAt && <p className="text-xs text-ink-3">Completed {new Date(r.completedAt).toLocaleDateString()}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
