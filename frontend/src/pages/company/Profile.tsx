import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Building2, ExternalLink, Pencil } from "lucide-react";
import { PageHeader } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input, PasswordInput, Textarea } from "@/components/ui/Input";
import { Card, ErrorBanner, PageLoader, StatusBadge } from "@/components/ui/Misc";
import { AuthApi, CompanyApi } from "@/lib/resources";
import type { CompanyResponse } from "@/lib/types";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const MAX_LOGO_BYTES = 1_500_000;

function ChangePasswordCard() {
  const { push } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    setSaving(true);
    try {
      await AuthApi.changePassword(currentPassword, newPassword);
      push("Password updated", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mt-6">
      <h2 className="mb-4 text-base font-semibold text-ink-0">Change password</h2>
      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <PasswordInput
          label="Current password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <PasswordInput
            label="New password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
          <PasswordInput
            label="Confirm new password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="outline" loading={saving}>
          Update password
        </Button>
      </form>
    </Card>
  );
}

const emptyForm = { name: "", businessRegistrationNo: "", description: "", website: "", logoUrl: "" };

export default function CompanyProfile() {
  const { push } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [exists, setExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadFormFrom = (c: CompanyResponse) =>
    setForm({
      name: c.name,
      businessRegistrationNo: c.businessRegistrationNo ?? "",
      description: c.description ?? "",
      website: c.website ?? "",
      logoUrl: c.logoUrl ?? "",
    });

  useEffect(() => {
    CompanyApi.getMine()
      .then((c) => {
        setCompany(c);
        loadFormFrom(c);
      })
      .catch(() => {
        setExists(false);
        setIsEditing(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const onLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      push("Please choose an image file", "error");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      push("Logo image must be under 1.5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = exists && company ? await CompanyApi.update(form) : await CompanyApi.create(form);
      setCompany(res);
      setExists(true);
      setIsEditing(false);
      push("Company profile saved", "success");
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    if (company) loadFormFrom(company);
    setError("");
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Company profile"
        description="This is what talents see before applying to your projects."
        action={company && <StatusBadge status={company.verificationStatus} />}
      />
      <Card>
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
                className="group relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-surface-border bg-surface-2"
              >
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt="Company logo" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-3">
                    <Building2 size={28} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Change
                </div>
              </button>
              <div>
                <p className="text-sm font-medium text-ink-0">Company logo</p>
                <p className="text-xs text-ink-3">PNG or JPG, up to 1.5MB.</p>
                {form.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, logoUrl: "" }))}
                    className="mt-1 cursor-pointer text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
            </div>
            <Input label="Company name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
              <Input label="Business registration no." value={form.businessRegistrationNo} onChange={(e) => setForm({ ...form, businessRegistrationNo: e.target.value })} />
            </div>
            <Textarea label="About" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell talents about your company..." />
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
          company && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-surface-border bg-surface-2">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt="Company logo" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-3">
                      <Building2 size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-ink-0">{company.name}</p>
                  <p className="truncate text-sm text-ink-3">{company.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-surface-border pt-4 text-sm">
                <div>
                  <p className="text-ink-3">Website</p>
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-ink-0 hover:text-accent-600"
                    >
                      {company.website} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <p className="text-ink-0">—</p>
                  )}
                </div>
                <div>
                  <p className="text-ink-3">Business registration no.</p>
                  <p className="text-ink-0">{company.businessRegistrationNo || "—"}</p>
                </div>
              </div>

              <div className="border-t border-surface-border pt-4">
                <p className="mb-1 text-sm text-ink-3">About</p>
                <p className="whitespace-pre-line text-sm text-ink-1">{company.description || "No description yet."}</p>
              </div>

              <Button type="button" onClick={() => setIsEditing(true)}>
                <Pencil size={14} /> Edit profile
              </Button>
            </div>
          )
        )}
      </Card>
      <ChangePasswordCard />
    </div>
  );
}
