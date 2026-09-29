import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/Input";
import { ErrorBanner } from "@/components/ui/Misc";
import { AuthApi } from "@/lib/resources";
import { extractError } from "@/lib/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await AuthApi.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid reset link" subtitle="This link is missing its reset token.">
        <p className="text-sm text-ink-2">
          Request a new link from the{" "}
          <Link to="/forgot-password" className="font-medium text-accent-600 hover:text-accent-700">
            forgot password
          </Link>{" "}
          page.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Choose a new password" subtitle="Make it at least 6 characters.">
      {done ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-sm text-ink-1">
            Your password has been reset. You can sign in with it now.
          </div>
          <Link to="/login">
            <Button className="w-full">Sign in</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <ErrorBanner message={error} />}
          <PasswordInput
            label="New password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
          <PasswordInput
            label="Confirm new password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
          />
          <Button type="submit" className="w-full" loading={loading}>
            Reset password
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
