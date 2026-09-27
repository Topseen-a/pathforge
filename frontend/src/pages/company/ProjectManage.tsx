import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, ErrorBanner, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { ProjectApi } from "@/lib/resources";
import type { ProjectResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { clsx } from "clsx";
import ApplicationsTab from "./tabs/ApplicationsTab";
import TasksTab from "./tabs/TasksTab";
import SkillsTab from "./tabs/SkillsTab";

const TABS = ["Overview", "Applications", "Tasks", "Skills"] as const;
type Tab = (typeof TABS)[number];

export default function ProjectManage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("Overview");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => (id ? ProjectApi.getById(id).then(setProject) : Promise.resolve());

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <PageLoader />;
  if (!project) return <ErrorBanner message="Project not found." />;

  const runAction = async (fn: () => Promise<unknown>, message: string) => {
    setBusy(true);
    setError("");
    try {
      await fn();
      push(message, "success");
      await load();
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!project) return;
    if (!window.confirm("Delete this draft project? This can't be undone.")) return;
    setBusy(true);
    setError("");
    try {
      await ProjectApi.remove(project.id);
      push("Project deleted", "success");
      navigate("/app/company/projects");
    } catch (err) {
      setError(extractError(err).message);
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={project.title}
        description={`${project.workMode} · ${project.paid ? "Paid" : "Unpaid"}`}
        action={<StatusBadge status={project.status} />}
      />

      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2 border-b border-surface-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              tab === t ? "border-accent-500 text-accent-600" : "border-transparent text-ink-2 hover:text-ink-0"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <Card className="space-y-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-1">{project.description}</p>
          <div className="grid grid-cols-3 gap-4 border-t border-surface-border pt-4 text-sm">
            <div>
              <p className="text-ink-3">Compensation</p>
              <p className="text-ink-0">{project.paid ? `₦${project.compensationAmount?.toLocaleString() ?? "—"}` : "Unpaid"}</p>
            </div>
            <div>
              <p className="text-ink-3">Duration</p>
              <p className="text-ink-0">{project.durationDays ? `${project.durationDays} days` : "—"}</p>
            </div>
            <div>
              <p className="text-ink-3">Location</p>
              <p className="text-ink-0">{project.location ?? "—"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 border-t border-surface-border pt-4">
            <Link to={`/app/company/projects/${project.id}/edit`}>
              <Button variant="outline" disabled={project.status === "CLOSED"}>
                Edit
              </Button>
            </Link>
            {project.status === "DRAFT" && (
              <Button loading={busy} onClick={() => runAction(() => ProjectApi.publish(project.id), "Project published")}>
                Publish
              </Button>
            )}
            {project.status !== "CLOSED" && (
              <Button variant="danger" loading={busy} onClick={() => runAction(() => ProjectApi.close(project.id), "Project closed")}>
                Close
              </Button>
            )}
            {project.status === "DRAFT" && (
              <Button variant="danger" loading={busy} onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      )}

      {tab === "Applications" && <ApplicationsTab projectId={project.id} />}
      {tab === "Tasks" && <TasksTab projectId={project.id} />}
      {tab === "Skills" && <SkillsTab projectId={project.id} />}
    </div>
  );
}
