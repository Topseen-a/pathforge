import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Pencil, Plus, UserRound, X } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { ChangePasswordCard } from "@/components/ChangePasswordCard";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card, ErrorBanner, PageLoader } from "@/components/ui/Misc";
import { TalentProfileApi, TalentSkillApi } from "@/lib/resources";
import type { TalentProfileResponse, TalentSkillResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

const MAX_AVATAR_BYTES = 1_500_000;

const emptyForm = { bio: "", location: "", education: "", interests: "", portfolioUrl: "", avatarUrl: "" };

export default function TalentProfile() {
  const { push } = useToast();
  const { setAvatarUrl } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<TalentProfileResponse | null>(null);
  const [exists, setExists] = useState(true);
  const [skills, setSkills] = useState<TalentSkillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [newSkill, setNewSkill] = useState("");

  const loadFormFrom = (p: TalentProfileResponse) =>
    setForm({
      bio: p.bio ?? "",
      location: p.location ?? "",
      education: p.education ?? "",
      interests: p.interests ?? "",
      portfolioUrl: p.portfolioUrl ?? "",
      avatarUrl: p.avatarUrl ?? "",
    });

  useEffect(() => {
    Promise.all([
      TalentProfileApi.getMine()
        .then((p) => {
          setProfile(p);
          loadFormFrom(p);
        })
        .catch(() => {
          setExists(false);
          setIsEditing(true);
        }),
      TalentSkillApi.listMine().catch(() => []).then((s) => setSkills(s)),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      push("Please choose an image file", "error");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      push("Profile photo must be under 1.5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatarUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = exists && profile ? await TalentProfileApi.update(form) : await TalentProfileApi.create(form);
      setProfile(res);
      setExists(true);
      setIsEditing(false);
      setAvatarUrl(res.avatarUrl);
      push("Profile saved", "success");
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    if (profile) loadFormFrom(profile);
    setError("");
    setIsEditing(false);
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

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="My profile" description="This is what companies see when reviewing your applications." />

      <Card className="mb-6">
        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} />
          </div>
        )}

        {isEditing ? (
          <form onSubmit={onSave} className="space-y-4">
            <div className="mb-2 flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-full border border-surface-border bg-surface-2"
              >
                {form.avatarUrl ? (
                  <img src={form.avatarUrl} alt="Profile photo" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-3">
                    <UserRound size={28} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Change
                </div>
              </button>
              <div>
                <p className="text-sm font-medium text-ink-0">Profile photo</p>
                <p className="text-xs text-ink-3">PNG or JPG, up to 1.5MB.</p>
                {form.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, avatarUrl: "" }))}
                    className="mt-1 cursor-pointer text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
            </div>
            <Textarea label="Bio" placeholder="Tell companies about yourself..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lagos, Nigeria" />
              <Input label="Education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="Undergraduate" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Interests" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="Digital marketing, UI/UX" />
              <Input label="Portfolio URL" value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex gap-3">
              <Button type="submit" loading={saving}>
                {exists ? "Save changes" : "Create profile"}
              </Button>
              {exists && (
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        ) : (
          profile && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-surface-border bg-surface-2">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Profile photo" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-3">
                      <UserRound size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-ink-0">{profile.fullName}</p>
                  <p className="truncate text-sm text-ink-3">{profile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-surface-border pt-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-ink-3">Location</p>
                  <p className="text-ink-0">{profile.location || "—"}</p>
                </div>
                <div>
                  <p className="text-ink-3">Education</p>
                  <p className="text-ink-0">{profile.education || "—"}</p>
                </div>
                <div>
                  <p className="text-ink-3">Interests</p>
                  <p className="text-ink-0">{profile.interests || "—"}</p>
                </div>
                <div>
                  <p className="text-ink-3">Portfolio</p>
                  {profile.portfolioUrl ? (
                    <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="text-ink-0 hover:text-accent-600">
                      {profile.portfolioUrl}
                    </a>
                  ) : (
                    <p className="text-ink-0">—</p>
                  )}
                </div>
              </div>

              <div className="border-t border-surface-border pt-4">
                <p className="mb-1 text-sm text-ink-3">Bio</p>
                <p className="whitespace-pre-line text-sm text-ink-1">{profile.bio || "No bio yet."}</p>
              </div>

              <Button type="button" onClick={() => setIsEditing(true)}>
                <Pencil size={14} /> Edit profile
              </Button>
            </div>
          )
        )}
      </Card>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-ink-0">Skills</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s.skillId} className="flex items-center gap-1.5 rounded-full bg-surface-3 px-3 py-1.5 text-xs text-ink-1">
              {s.name}
              <button onClick={() => removeSkill(s.skillId)} className="cursor-pointer text-ink-3 hover:text-red-400">
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

      <ChangePasswordCard />
    </div>
  );
}
