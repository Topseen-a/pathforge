import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, ErrorBanner, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ApplicationApi, ProjectApi, ProjectSkillApi } from "@/lib/resources";
import type { ProjectResponse, ProjectSkillResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function TalentProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [skills, setSkills] = useState<ProjectSkillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [coverNote, setCoverNote] = useState("");
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([ProjectApi.getById(id), ProjectSkillApi.list(id).catch(() => [])])
      .then(([exp, sk]) => {
        setProject(exp);
        setSkills(sk);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!project) return <ErrorBanner message="Project not found." />;

  const onApply = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError("");
    setApplying(true);
    try {
      await ApplicationApi.apply(id, { coverNote });
      setApplied(true);
      push("Application submitted", "success");
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={project.title} description={project.companyName} action={<StatusBadge status={project.status} />} />

      <Card className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={project.workMode} />
          {project.location && <span className="text-sm text-ink-2">{project.location}</span>}
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-ink-1">{project.description}</p>
        <div className="grid grid-cols-2 gap-4 border-t border-surface-border pt-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-ink-3">Compensation</p>
            <p className="text-ink-0">{project.paid ? `₦${project.compensationAmount?.toLocaleString() ?? "—"}` : "Unpaid"}</p>
          </div>
          <div>
            <p className="text-ink-3">Duration</p>
            <p className="text-ink-0">{project.durationDays ? `${project.durationDays} days` : "—"}</p>
          </div>
          <div>
            <p className="text-ink-3">Mode</p>
            <p className="text-ink-0">{project.workMode}</p>
          </div>
        </div>
        {skills.length > 0 && (
          <div className="border-t border-surface-border pt-4">
            <p className="mb-2 text-sm text-ink-3">Skills wanted</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.skillId} className="rounded-full bg-surface-3 px-3 py-1 text-xs text-ink-1">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {project.status !== "PUBLISHED" ? (
        <ErrorBanner message="This project is not currently accepting applications." />
      ) : applied ? (
        <Card className="text-center text-sm text-accent-600">Your application has been submitted. Track it under My Applications.</Card>
      ) : (
        <Card className="space-y-4">
          <h2 className="text-base font-semibold text-ink-0">Apply for this project</h2>
          {error && <ErrorBanner message={error} />}
          <form onSubmit={onApply} className="space-y-4">
            <Textarea
              label="Cover note (optional)"
              placeholder="Tell the company why you're a great fit..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
            />
            <div className="flex gap-3">
              <Button type="submit" loading={applying}>
                Submit application
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Back
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
