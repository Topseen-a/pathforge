import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui/Input";
import { ErrorBanner } from "@/components/ui/Misc";
import { useAuth } from "@/context/AuthContext";
import { extractError } from "@/lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await login(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      const home =
        session.role === "COMPANY" ? "/app/company" : session.role === "ADMIN" ? "/app/admin" : "/app/talent";
      navigate(from || home, { replace: true });
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue building your work experience.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <div>
          <PasswordInput label="Password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <Link to="/forgot-password" className="mt-1.5 inline-block text-xs font-medium text-accent-600 hover:text-accent-700">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-2">
        New to PathForge?{" "}
        <Link to="/register" className="font-medium text-accent-600 hover:text-accent-700">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-sm text-ink-2">
        <Link to="/verify" className="font-medium text-ink-1 hover:text-ink-0">
          Verify a passport record →
        </Link>
      </p>
    </AuthLayout>
  );
}
