import { useEffect, useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, ErrorBanner, PageLoader } from "@/components/ui/Misc";
import { TalentProfileApi, TalentSkillApi } from "@/lib/resources";
import type { TalentProfileResponse, TalentSkillResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function TalentProfile() {
  const { push } = useToast();
  const [profile, setProfile] = useState<TalentProfileResponse | null>(null);
  const [exists, setExists] = useState(true);
  const [skills, setSkills] = useState<TalentSkillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ bio: "", location: "", education: "", interests: "", portfolioUrl: "" });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    Promise.all([
      TalentProfileApi.getMine().catch(() => {
        setExists(false);
        return null;
      }),
      TalentSkillApi.listMine().catch(() => []),
    ]).then(([p, s]) => {
      if (p) {
        setProfile(p);
        setForm({
          bio: p.bio ?? "",
          location: p.location ?? "",
          education: p.education ?? "",
          interests: p.interests ?? "",
          portfolioUrl: p.portfolioUrl ?? "",
        });
      }
      setSkills(s);
      setLoading(false);
    });
  }, []);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = exists && profile ? await TalentProfileApi.update(form) : await TalentProfileApi.create(form);
      setProfile(res);
      setExists(true);
      push("Profile saved", "success");
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const s = await TalentSkillApi.add({ skillName: newSkill.trim() });
      setSkills((prev) => [...prev, s]);
      setNewSkill("");
    } catch (err) {
      push(extractError(err).message, "error");
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      await TalentSkillApi.remove(skillId);
      setSkills((prev) => prev.filter((s) => s.skillId !== skillId));
    } catch (err) {
      push(extractError(err).message, "error");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="My profile" description="This is what companies see when reviewing your applications." />

      <Card className="mb-6">
        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} />
          </div>
        )}
        <form onSubmit={onSave} className="space-y-4">
          <Textarea label="Bio" placeholder="Tell companies about yourself..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lagos, Nigeria" />
            <Input label="Education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="Undergraduate" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Interests" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="Digital marketing, UI/UX" />
            <Input label="Portfolio URL" value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} placeholder="https://..." />
          </div>
          <Button type="submit" loading={saving}>
            {exists ? "Save changes" : "Create profile"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-ink-0">Skills</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s.skillId} className="flex items-center gap-1.5 rounded-full bg-surface-3 px-3 py-1.5 text-xs text-ink-1">
              {s.name}
              <button onClick={() => removeSkill(s.skillId)} className="text-ink-3 hover:text-red-400">
                <X size={12} />
              </button>
            </span>
          ))}
          {skills.length === 0 && <p className="text-sm text-ink-3">No skills added yet.</p>}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Add a skill, e.g. Figma" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="flex-1" />
          <Button type="button" variant="outline" onClick={addSkill}>
            <Plus size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
}
