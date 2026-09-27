import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorBanner } from "@/components/ui/Misc";
import { useAuth } from "@/context/AuthContext";
import { extractError } from "@/lib/api";
import type { Role } from "@/lib/types";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("TALENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await register({ fullName, email, password, phoneNumber, role });
      const home = session.role === "COMPANY" ? "/app/company" : "/app/talent";
      navigate(home, { replace: true });
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join as a talent to build project, or a company to host talent.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("TALENT")}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              role === "TALENT" ? "border-accent-500 bg-accent-500/10 text-accent-600" : "border-surface-border text-ink-2"
            }`}
          >
            I'm a talent
          </button>
          <button
            type="button"
            onClick={() => setRole("COMPANY")}
            className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
              role === "COMPANY" ? "border-accent-500 bg-accent-500/10 text-accent-600" : "border-surface-border text-ink-2"
            }`}
          >
            I'm a company
          </button>
        </div>
        <Input label="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
        <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input label="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+234..." />
        <Input label="Password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-2">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-accent-600 hover:text-accent-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
