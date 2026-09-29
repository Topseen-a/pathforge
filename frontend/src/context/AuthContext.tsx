import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getToken, registerUnauthorizedHandler, setToken } from "@/lib/api";
import { AuthApi, CompanyApi, TalentProfileApi } from "@/lib/resources";
import type { Role } from "@/lib/types";

interface SessionUser {
  userId: string;
  fullName: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (body: { fullName: string; email: string; password: string; phoneNumber?: string; role: Role }) => Promise<SessionUser>;
  logout: () => void;
  setAvatarUrl: (avatarUrl: string | undefined) => void;
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

function fetchAvatarUrl(role: Role): Promise<string | undefined> {
  if (role === "COMPANY") return CompanyApi.getMine().then((c) => c.logoUrl).catch(() => undefined);
  if (role === "TALENT") return TalentProfileApi.getMine().then((p) => p.avatarUrl).catch(() => undefined);
  return Promise.resolve(undefined);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applyAvatar = useCallback((session: SessionUser) => {
    fetchAvatarUrl(session.role).then((avatarUrl) => {
      if (avatarUrl) {
        setUser((prev) => (prev ? { ...prev, avatarUrl } : prev));
        writeSession({ ...session, avatarUrl });
      }
    });
  }, []);

  useEffect(() => {
    const token = getToken();
    const session = readSession();
    if (token && session) {
      setUser(session);
      applyAvatar(session);
    }
    setLoading(false);
    registerUnauthorizedHandler(() => {
      setUser(null);
      writeSession(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await AuthApi.login({ email, password });
      const session: SessionUser = { userId: res.userId, fullName: res.fullName, email: res.email, role: res.role };
      setToken(res.token);
      writeSession(session);
      setUser(session);
      applyAvatar(session);
      return session;
    },
    [applyAvatar]
  );

  const register = useCallback(
    async (body: { fullName: string; email: string; password: string; phoneNumber?: string; role: Role }) => {
      const res = await AuthApi.register(body);
      const session: SessionUser = { userId: res.userId, fullName: res.fullName, email: res.email, role: res.role };
      setToken(res.token);
      writeSession(session);
      setUser(session);
      applyAvatar(session);
      return session;
    },
    [applyAvatar]
  );

  const logout = useCallback(() => {
    setToken(null);
    writeSession(null);
    setUser(null);
  }, []);

  const setAvatarUrl = useCallback((avatarUrl: string | undefined) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, avatarUrl };
      writeSession(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setAvatarUrl }),
    [user, loading, login, register, logout, setAvatarUrl]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
