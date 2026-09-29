import { useState, type FormEvent } from "react";
import { Card, ErrorBanner } from "@/components/ui/Misc";
import { PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthApi } from "@/lib/resources";
import { extractError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export function ChangePasswordCard() {
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
