import { useEffect, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Card, EmptyState, PageLoader, Spinner } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  ApplicationApi,
  CompanyApi,
  ExperienceApi,
  LearnerProfileApi,
  MessageApi,
  WorkspaceApi,
} from "@/lib/resources";
import type { MessageResponse } from "@/lib/types";
import { clsx } from "clsx";

interface Contact {
  key: string;
  userId: string;
  name: string;
  experienceId?: string;
  experienceTitle: string;
}

export default function Messages() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Contact | null>(null);

  useEffect(() => {
    const load = async () => {
      if (user?.role === "COMPANY") {
        const experiences = await ExperienceApi.listMine();
        const lists = await Promise.all(
          experiences.map(async (exp) => {
            const apps = await ApplicationApi.listForExperience(exp.id).catch(() => []);
            const accepted = apps.filter((a) => a.status === "ACCEPTED");
            const withUsers = await Promise.all(
              accepted.map(async (a) => {
                const profile = await LearnerProfileApi.getById(a.learnerId).catch(() => null);
                if (!profile) return null;
                const c: Contact = {
                  key: `${exp.id}-${profile.userId}`,
                  userId: profile.userId,
                  name: a.learnerName,
                  experienceId: exp.id,
                  experienceTitle: exp.title,
                };
                return c;
              })
            );
            return withUsers.filter((c): c is Contact => c !== null);
          })
        );
        setContacts(lists.flat());
      } else {
        const workspaces = await WorkspaceApi.listMine();
        const withUsers = await Promise.all(
          workspaces.map(async (w) => {
            const exp = await ExperienceApi.getById(w.experienceId).catch(() => null);
            if (!exp) return null;
            const company = await CompanyApi.getById(exp.companyId).catch(() => null);
            if (!company) return null;
            const c: Contact = {
              key: w.id,
              userId: company.userId,
              name: w.companyName,
              experienceId: w.experienceId,
              experienceTitle: w.experienceTitle,
            };
            return c;
          })
        );
        setContacts(withUsers.filter((c): c is Contact => c !== null));
      }
    };
    load().finally(() => setLoading(false));
  }, [user?.role]);

  if (loading) return <PageLoader />;

  return (
    <div>
      <PageHeader title="Messages" description="Conversations tied to your active workspaces." />
      {contacts.length === 0 ? (
        <EmptyState title="No conversations yet" description="Messages open up once an application is accepted." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <div className="space-y-1">
              {contacts.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActive(c)}
                  className={clsx(
                    "w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    active?.key === c.key ? "bg-accent-500/15 text-accent-600" : "text-ink-1 hover:bg-surface-2"
                  )}
                >
                  <p className="font-medium">{c.name}</p>
                  <p className="truncate text-xs text-ink-3">{c.experienceTitle}</p>
                </button>
              ))}
            </div>
          </Card>
          <div className="lg:col-span-2">
            {active ? <Thread contact={active} /> : <Card className="flex h-full items-center justify-center text-sm text-ink-3">Select a conversation</Card>}
          </div>
        </div>
      )}
    </div>
  );
}

function Thread({ contact }: { contact: Contact }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => MessageApi.withUser(contact.userId).then(setMessages);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact.userId]);

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      await MessageApi.send({ receiverId: contact.userId, content: content.trim(), experienceId: contact.experienceId });
      setContent("");
      await load();
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="flex h-[500px] flex-col">
      <div className="border-b border-surface-border pb-3">
        <p className="text-sm font-medium text-ink-0">{contact.name}</p>
        <p className="text-xs text-ink-3">{contact.experienceTitle}</p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-ink-3">No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === user?.userId;
            return (
              <div key={m.id} className={clsx("flex", mine ? "justify-end" : "justify-start")}>
                <div className={clsx("max-w-[75%] rounded-2xl px-4 py-2 text-sm", mine ? "bg-accent-500 text-surface-0" : "bg-surface-3 text-ink-0")}>
                  {m.content}
                </div>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={onSend} className="flex gap-2 border-t border-surface-border pt-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-surface-border bg-surface-2 px-3.5 py-2.5 text-sm text-ink-0 outline-none focus:border-accent-500"
        />
        <Button type="submit" loading={sending} size="md">
          <Send size={16} />
        </Button>
      </form>
    </Card>
  );
}
