import { useEffect, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, ErrorBanner, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { CompanyApi } from "@/lib/resources";
import type { CompanyResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function CompanyProfile() {
  const { push } = useToast();
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [exists, setExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", businessRegistrationNo: "", description: "", website: "" });

  useEffect(() => {
    CompanyApi.getMine()
      .then((c) => {
        setCompany(c);
        setForm({
          name: c.name,
          businessRegistrationNo: c.businessRegistrationNo ?? "",
          description: c.description ?? "",
          website: c.website ?? "",
        });
      })
      .catch(() => setExists(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = exists && company ? await CompanyApi.update(form) : await CompanyApi.create(form);
      setCompany(res);
      setExists(true);
      push("Company profile saved", "success");
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Company profile"
        description="This is what talents see before applying to your projects."
        action={company && <StatusBadge status={company.verificationStatus} />}
      />
      <Card>
        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} />
          </div>
        )}
        <form onSubmit={onSave} className="space-y-4">
          <Input label="Company name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
            <Input label="Business registration no." value={form.businessRegistrationNo} onChange={(e) => setForm({ ...form, businessRegistrationNo: e.target.value })} />
          </div>
          <Textarea label="About" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell talents about your company..." />
          <Button type="submit" loading={saving}>
            {exists ? "Save changes" : "Create profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
