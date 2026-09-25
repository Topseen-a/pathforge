import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, ErrorBanner, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { ExperienceApi } from "@/lib/resources";
import type { ExperienceResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { clsx } from "clsx";
import ApplicationsTab from "./tabs/ApplicationsTab";
import TasksTab from "./tabs/TasksTab";
import SkillsTab from "./tabs/SkillsTab";

const TABS = ["Overview", "Applications", "Tasks", "Skills"] as const;
type Tab = (typeof TABS)[number];

export default function ExperienceManage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [experience, setExperience] = useState<ExperienceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("Overview");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => (id ? ExperienceApi.getById(id).then(setExperience) : Promise.resolve());

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <PageLoader />;
  if (!experience) return <ErrorBanner message="Experience not found." />;

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
    if (!experience) return;
    if (!window.confirm("Delete this draft experience? This can't be undone.")) return;
    setBusy(true);
    setError("");
    try {
      await ExperienceApi.remove(experience.id);
      push("Experience deleted", "success");
      navigate("/app/company/experiences");
    } catch (err) {
      setError(extractError(err).message);
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={experience.title}
        description={`${experience.workMode} · ${experience.paid ? "Paid" : "Unpaid"}`}
        action={<StatusBadge status={experience.status} />}
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
              tab === t ? "border-accent-500 text-accent-400" : "border-transparent text-ink-2 hover:text-ink-0"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <Card className="space-y-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-1">{experience.description}</p>
          <div className="grid grid-cols-3 gap-4 border-t border-surface-border pt-4 text-sm">
            <div>
              <p className="text-ink-3">Compensation</p>
              <p className="text-ink-0">{experience.paid ? `₦${experience.compensationAmount?.toLocaleString() ?? "—"}` : "Unpaid"}</p>
            </div>
            <div>
              <p className="text-ink-3">Duration</p>
              <p className="text-ink-0">{experience.durationDays ? `${experience.durationDays} days` : "—"}</p>
            </div>
            <div>
              <p className="text-ink-3">Location</p>
              <p className="text-ink-0">{experience.location ?? "—"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 border-t border-surface-border pt-4">
            <Link to={`/app/company/experiences/${experience.id}/edit`}>
              <Button variant="outline" disabled={experience.status === "CLOSED"}>
                Edit
              </Button>
            </Link>
            {experience.status === "DRAFT" && (
              <Button loading={busy} onClick={() => runAction(() => ExperienceApi.publish(experience.id), "Experience published")}>
                Publish
              </Button>
            )}
            {experience.status !== "CLOSED" && (
              <Button variant="danger" loading={busy} onClick={() => runAction(() => ExperienceApi.close(experience.id), "Experience closed")}>
                Close
              </Button>
            )}
            {experience.status === "DRAFT" && (
              <Button variant="danger" loading={busy} onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      )}

      {tab === "Applications" && <ApplicationsTab experienceId={experience.id} />}
      {tab === "Tasks" && <TasksTab experienceId={experience.id} />}
      {tab === "Skills" && <SkillsTab experienceId={experience.id} />}
    </div>
  );
}
