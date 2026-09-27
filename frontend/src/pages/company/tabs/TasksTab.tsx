import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Card, EmptyState, ErrorBanner, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { SubmissionApi, TaskApi } from "@/lib/resources";
import type { SubmissionResponse, TaskResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { clsx } from "clsx";

export default function TasksTab({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { push } = useToast();

  const load = () => TaskApi.listForProject(projectId).then(setTasks);

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => setShowForm((s) => !s)}>
          <Plus size={14} /> New task
        </Button>
      </div>

      {showForm && (
        <NewTaskForm
          projectId={projectId}
          onDone={() => {
            setShowForm(false);
            push("Task created", "success");
            load();
          }}
        />
      )}

      {tasks.length === 0 ? (
        <EmptyState title="No tasks yet" description="Create tasks so accepted talents know what to work on." />
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task} projectId={projectId} onChanged={load} />)
      )}
    </div>
  );
}

function NewTaskForm({ projectId, onDone }: { projectId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await TaskApi.create(projectId, { title, description, dueDate: dueDate || undefined });
      onDone();
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      {error && (
        <div className="mb-3">
          <ErrorBanner message={error} />
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea label="Description" required value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Due date (optional)" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <Button type="submit" size="sm" loading={saving}>
          Create task
        </Button>
      </form>
    </Card>
  );
}

function TaskCard({ task, projectId, onChanged }: { task: TaskResponse; projectId: string; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const { push } = useToast();

  const loadSubs = () => {
    setLoadingSubs(true);
    SubmissionApi.listForTask(task.id)
      .then(setSubmissions)
      .finally(() => setLoadingSubs(false));
  };

  const toggle = () => {
    setOpen((o) => !o);
    if (!open) loadSubs();
  };

  const approve = async () => {
    try {
      await TaskApi.updateStatus(projectId, task.id, "APPROVED");
      push("Task approved", "success");
      onChanged();
    } catch (err) {
      push(extractError(err).message, "error");
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ink-0">{task.title}</p>
          <p className="mt-1 text-sm text-ink-2">{task.description}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>
      <div className="flex items-center gap-3 border-t border-surface-border pt-3">
        <button onClick={toggle} className="text-xs font-medium text-accent-600 hover:text-accent-700">
          {open ? "Hide submissions" : "View submissions"}
        </button>
        {task.status === "SUBMITTED" && (
          <Button size="sm" variant="outline" onClick={approve}>
            Approve submission
          </Button>
        )}
      </div>
      {open && (
        <div className="space-y-2 border-t border-surface-border pt-3">
          {loadingSubs ? (
            <p className="text-xs text-ink-3">Loading...</p>
          ) : submissions.length === 0 ? (
            <p className="text-xs text-ink-3">No submissions yet.</p>
          ) : (
            submissions.map((s) => (
              <div key={s.id} className={clsx("rounded-lg bg-surface-2 p-3 text-sm")}>
                <p className="font-medium text-ink-0">{s.talentName}</p>
                {s.content && <p className="mt-1 text-ink-1">{s.content}</p>}
                {s.fileUrl && (
                  <a href={s.fileUrl} target="_blank" rel="noreferrer" className="mt-1 block text-accent-600 hover:underline">
                    {s.fileUrl}
                  </a>
                )}
                <p className="mt-1 text-xs text-ink-3">{s.submittedAt ? new Date(s.submittedAt).toLocaleString() : ""}</p>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}
