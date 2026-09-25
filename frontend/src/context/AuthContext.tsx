import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getToken, registerUnauthorizedHandler, setToken } from "@/lib/api";
import { AuthApi } from "@/lib/resources";
import type { Role } from "@/lib/types";

interface SessionUser {
  userId: string;
  fullName: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (body: { fullName: string; email: string; password: string; phoneNumber?: string; role: Role }) => Promise<SessionUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const SESSION_KEY = "pathforge_session";

function readSession(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

function writeSession(user: SessionUser | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const session = readSession();
    if (token && session) setUser(session);
    setLoading(false);
    registerUnauthorizedHandler(() => {
      setUser(null);
      writeSession(null);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await AuthApi.login({ email, password });
    const session: SessionUser = { userId: res.userId, fullName: res.fullName, email: res.email, role: res.role };
    setToken(res.token);
    writeSession(session);
    setUser(session);
    return session;
  }, []);

  const register = useCallback(
    async (body: { fullName: string; email: string; password: string; phoneNumber?: string; role: Role }) => {
      const res = await AuthApi.register(body);
      const session: SessionUser = { userId: res.userId, fullName: res.fullName, email: res.email, role: res.role };
      setToken(res.token);
      writeSession(session);
      setUser(session);
      return session;
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    writeSession(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
