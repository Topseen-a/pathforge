import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { AdminApi } from "@/lib/resources";
import type { UserResponse } from "@/lib/types";
import { useToast } from "@/context/ToastContext";
import { extractError } from "@/lib/api";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const { push } = useToast();

  const load = () => AdminApi.listUsers().then(setUsers);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => users.filter((u) => u.fullName.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())),
    [users, query]
  );

  const toggleStatus = async (u: UserResponse) => {
    setBusyId(u.id);
    try {
      if (u.status === "ACTIVE") {
        await AdminApi.suspendUser(u.id);
        push("User suspended", "success");
      } else {
        await AdminApi.reactivateUser(u.id);
        push("User reactivated", "success");
      }
      await load();
    } catch (err) {
      push(extractError(err).message, "error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Users" description="Suspend or reactivate talent, company, and admin accounts." />
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" size={16} />
        <Input placeholder="Search by name or email" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
      </div>
      <div className="space-y-2">
        {filtered.map((u) => (
          <Card key={u.id} className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-0">{u.fullName}</p>
              <p className="truncate text-xs text-ink-3">
                {u.email} · {u.role}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <StatusBadge status={u.status} />
              <Button
                size="sm"
                variant={u.status === "ACTIVE" ? "danger" : "outline"}
                loading={busyId === u.id}
                onClick={() => toggleStatus(u)}
                className="whitespace-nowrap"
              >
                {u.status === "ACTIVE" ? "Suspend" : "Reactivate"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
