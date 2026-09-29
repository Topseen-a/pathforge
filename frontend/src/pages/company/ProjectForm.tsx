import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Card, ErrorBanner, PageLoader } from "@/components/ui/Misc";
import { ProjectApi } from "@/lib/resources";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { WorkMode } from "@/lib/types";

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { push } = useToast();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    workMode: "REMOTE" as WorkMode,
    location: "",
    paid: false,
    compensationAmount: "",
    durationDays: "",
  });

  useEffect(() => {
    if (!id) return;
    ProjectApi.getById(id)
      .then((exp) =>
        setForm({
          title: exp.title,
          description: exp.description,
          workMode: exp.workMode,
          location: exp.location ?? "",
          paid: exp.paid,
          compensationAmount: exp.compensationAmount ? String(exp.compensationAmount) : "",
          durationDays: exp.durationDays ? String(exp.durationDays) : "",
        })
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const body = {
      title: form.title,
      description: form.description,
      workMode: form.workMode,
      location: form.location || undefined,
      paid: form.paid,
      compensationAmount: form.paid && form.compensationAmount ? Number(form.compensationAmount) : undefined,
      durationDays: form.durationDays ? Number(form.durationDays) : undefined,
    };
    try {
      const res = isEdit && id ? await ProjectApi.update(id, body) : await ProjectApi.create(body);
      push(isEdit ? "Project updated" : "Project created", "success");
      navigate(`/app/company/projects/${res.id}`);
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton />
      <PageHeader title={isEdit ? "Edit project" : "Post a new project"} description="Describe the work experience you're offering talents." />
      <Card>
        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} />
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Junior Product Designer" />
          <Textarea
            label="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What will the talent do, and what will they learn?"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Work mode"
              value={form.workMode}
              onChange={(v) => setForm({ ...form, workMode: v as WorkMode })}
              options={[
                { value: "REMOTE", label: "Remote" },
                { value: "PHYSICAL", label: "Onsite" },
                { value: "HYBRID", label: "Hybrid" },
              ]}
            />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lagos, Nigeria" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (days)"
              type="number"
              min={1}
              value={form.durationDays}
              onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
            />
            <label className="flex cursor-pointer items-center gap-2 pt-6 text-sm text-ink-1">
              <input
                type="checkbox"
                checked={form.paid}
                onChange={(e) => setForm({ ...form, paid: e.target.checked })}
                className="h-4 w-4 cursor-pointer rounded border-surface-border accent-accent-500"
              />
              This project is paid
            </label>
          </div>
          {form.paid && (
            <Input
              label="Compensation (₦)"
              type="number"
              min={0}
              value={form.compensationAmount}
              onChange={(e) => setForm({ ...form, compensationAmount: e.target.value })}
              placeholder="30000"
            />
          )}
          <div className="flex gap-3">
            <Button type="submit" loading={saving}>
              {isEdit ? "Save changes" : "Create project"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
