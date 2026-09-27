import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { NotificationApi } from "@/lib/resources";
import type { NotificationResponse } from "@/lib/types";
import { clsx } from "clsx";

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => NotificationApi.list().then(setNotifications);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await NotificationApi.markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Notifications" description="Updates on your applications, tasks, and messages." />
      {notifications.length === 0 ? (
        <EmptyState title="You're all caught up" description="New notifications will show up here." />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <Card key={n.id} className={clsx("flex items-start justify-between gap-3", !n.read && "border-accent-500/30 bg-accent-500/5")}>
              <div className="flex items-start gap-3">
                <div className={clsx("mt-0.5 rounded-lg p-2", n.read ? "bg-surface-3 text-ink-3" : "bg-accent-500/15 text-accent-600")}>
                  <Bell size={14} />
                </div>
                <div>
                  <p className="text-sm text-ink-0">{n.message}</p>
                  <p className="mt-1 text-xs text-ink-3">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</p>
                </div>
              </div>
              {!n.read && (
                <Button size="sm" variant="ghost" onClick={() => markRead(n.id)} title="Mark as read">
                  <CheckCheck size={14} />
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
