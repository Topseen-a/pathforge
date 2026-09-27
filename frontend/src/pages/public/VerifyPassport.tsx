import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, ErrorBanner, StatusBadge } from "@/components/ui/Misc";
import { PassportApi } from "@/lib/resources";
import { extractError } from "@/lib/api";
import type { ExperienceRecordResponse } from "@/lib/types";
import { Logo } from "@/components/Logo";

export default function VerifyPassport() {
  const [code, setCode] = useState("");
  const [record, setRecord] = useState<ExperienceRecordResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setRecord(null);
    setLoading(true);
    try {
      const res = await PassportApi.verifyByCode(code.trim());
      setRecord(res);
    } catch (err) {
      setError(extractError(err).message || "No record found for that verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 px-6 py-16 text-ink-0">
      <div className="mx-auto max-w-lg">
        <div className="mb-10 flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-semibold">PathForge</span>
        </div>
        <div className="mb-2 flex items-center gap-2 text-accent-600">
          <ShieldCheck size={20} />
          <span className="text-sm font-medium uppercase tracking-wide">Passport verification</span>
        </div>
        <h1 className="text-2xl font-semibold">Verify an experience record</h1>
        <p className="mt-2 text-sm text-ink-2">
          Enter the verification code printed on a learner's PathForge experience passport to confirm it's genuine.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex gap-2">
          <Input
            placeholder="e.g. PF-8F3A21C0"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" loading={loading}>
            Verify
          </Button>
        </form>

        {error && (
          <div className="mt-4">
            <ErrorBanner message={error} />
          </div>
        )}

        {record && (
          <Card className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-accent-600">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">Record verified</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-ink-0">{record.experienceTitle}</p>
              <p className="text-sm text-ink-2">{record.companyName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-ink-3">Learner</p>
                <p className="text-ink-0">{record.learnerName}</p>
              </div>
              <div>
                <p className="text-ink-3">Status</p>
                <StatusBadge status={record.verificationStatus} />
              </div>
              <div>
                <p className="text-ink-3">Completed</p>
                <p className="text-ink-0">{record.completedAt ? new Date(record.completedAt).toLocaleDateString() : "—"}</p>
              </div>
              <div>
                <p className="text-ink-3">Code</p>
                <p className="font-mono text-ink-0">{record.verificationCode}</p>
              </div>
            </div>
          </Card>
        )}

        <p className="mt-10 text-sm text-ink-2">
          <Link to="/login" className="font-medium text-accent-600 hover:text-accent-700">
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
