import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Textarea, Input } from "@/components/ui/Input";
import { Card, EmptyState, ErrorBanner, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { SubmissionApi, TaskApi, WorkspaceApi } from "@/lib/resources";
import type { SubmissionResponse, TaskResponse, WorkspaceResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function LearnerWorkspaceDetail() {
  const { id } = useParams<{ id: string }>();
  const { push } = useToast();
  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<TaskResponse | null>(null);

  const load = async () => {
    if (!id) return;
    const ws = await WorkspaceApi.getById(id);
    setWorkspace(ws);
    const t = await TaskApi.listForExperience(ws.experienceId);
    setTasks(t);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <PageLoader />;
  if (!workspace) return <ErrorBanner message="Workspace not found." />;

  return (
    <div>
      <PageHeader title={workspace.experienceTitle} description={`Workspace with ${workspace.companyName}`} />

      {tasks.length === 0 ? (
        <EmptyState title="No tasks assigned yet" description="The company hasn't posted any tasks for this experience yet." />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink-0">{task.title}</p>
                  <p className="mt-1 text-sm text-ink-2">{task.description}</p>
                  {task.dueDate && <p className="mt-1 text-xs text-ink-3">Due {new Date(task.dueDate).toLocaleDateString()}</p>}
                </div>
                <StatusBadge status={task.status} />
              </div>
              <div className="border-t border-surface-border pt-3">
                {activeTask?.id === task.id ? (
                  <SubmissionForm
                    task={task}
                    onDone={() => {
                      setActiveTask(null);
                      push("Work submitted", "success");
                      load();
                    }}
                    onCancel={() => setActiveTask(null)}
                  />
                ) : (
                  <TaskSubmissions taskId={task.id} onSubmitClick={() => setActiveTask(task)} disabled={task.status === "APPROVED" || task.status === "COMPLETED"} />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskSubmissions({ taskId, onSubmitClick, disabled }: { taskId: string; onSubmitClick: () => void; disabled: boolean }) {
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  useEffect(() => {
    SubmissionApi.listMineForTask(taskId).then(setSubmissions).catch(() => {});
  }, [taskId]);

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-ink-3">
        {submissions.length > 0 ? `Last submitted ${new Date(submissions[0].submittedAt ?? "").toLocaleString()}` : "No submissions yet"}
      </p>
      <Button size="sm" variant={submissions.length > 0 ? "outline" : "primary"} onClick={onSubmitClick} disabled={disabled}>
        {submissions.length > 0 ? "Resubmit" : "Submit work"}
      </Button>
    </div>
  );
}

function SubmissionForm({ task, onDone, onCancel }: { task: TaskResponse; onDone: () => void; onCancel: () => void }) {
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !fileUrl.trim()) {
      setError("Provide a description of your work or a link to it.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await SubmissionApi.submit(task.id, { content: content || undefined, fileUrl: fileUrl || undefined });
      onDone();
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {error && <ErrorBanner message={error} />}
      <Textarea label="Description" placeholder="Describe what you completed..." value={content} onChange={(e) => setContent(e.target.value)} />
      <Input label="File / link (optional)" placeholder="https://..." value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={submitting}>
          Submit
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
