import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Card, ErrorBanner, PageLoader } from "@/components/ui/Misc";
import { ExperienceApi } from "@/lib/resources";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import type { WorkMode } from "@/lib/types";

export default function ExperienceForm() {
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
    ExperienceApi.getById(id)
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
      const res = isEdit && id ? await ExperienceApi.update(id, body) : await ExperienceApi.create(body);
      push(isEdit ? "Experience updated" : "Experience created", "success");
      navigate(`/app/company/experiences/${res.id}`);
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={isEdit ? "Edit experience" : "Post a new experience"} description="Describe the work experience you're offering learners." />
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
            placeholder="What will the learner do, and what will they learn?"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Work mode" value={form.workMode} onChange={(e) => setForm({ ...form, workMode: e.target.value as WorkMode })}>
              <option value="REMOTE">Remote</option>
              <option value="ONSITE">Onsite</option>
              <option value="HYBRID">Hybrid</option>
            </Select>
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
            <label className="flex items-center gap-2 pt-6 text-sm text-ink-1">
              <input type="checkbox" checked={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.checked })} className="h-4 w-4 rounded border-surface-border accent-accent-500" />
              This experience is paid
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
              {isEdit ? "Save changes" : "Create experience"}
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
