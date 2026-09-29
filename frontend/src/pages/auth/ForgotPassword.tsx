import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorBanner } from "@/components/ui/Misc";
import { AuthApi } from "@/lib/resources";
import { extractError } from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await AuthApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter your email and we'll send you a link to reset it.">
      {sent ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-sm text-ink-1">
            If an account exists for <span className="font-medium text-ink-0">{email}</span>, a reset link is on its
            way. Check your inbox — the link expires in an hour.
          </div>
          <Link to="/login" className="inline-block text-sm font-medium text-accent-600 hover:text-accent-700">
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <ErrorBanner message={error} />}
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Button type="submit" className="w-full" loading={loading}>
            Send reset link
          </Button>
          <Link to="/login" className="inline-block text-sm font-medium text-ink-2 hover:text-ink-0">
            ← Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
