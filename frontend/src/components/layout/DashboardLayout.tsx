import { type ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  FolderKanban,
  Award,
  MessageSquare,
  Bell,
  Users,
  ShieldCheck,
  Flag,
  Building2,
  UserRound,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { NotificationApi } from "@/lib/resources";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const learnerNav: NavItem[] = [
  { to: "/app/learner", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { to: "/app/learner/experiences", label: "Browse Experiences", icon: <Briefcase size={18} /> },
  { to: "/app/learner/applications", label: "My Applications", icon: <ClipboardList size={18} /> },
  { to: "/app/learner/workspaces", label: "Workspaces", icon: <FolderKanban size={18} /> },
  { to: "/app/learner/passport", label: "Passport", icon: <Award size={18} /> },
  { to: "/app/learner/messages", label: "Messages", icon: <MessageSquare size={18} /> },
  { to: "/app/learner/profile", label: "Profile", icon: <UserRound size={18} /> },
];

const companyNav: NavItem[] = [
  { to: "/app/company", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { to: "/app/company/experiences", label: "Experiences", icon: <Briefcase size={18} /> },
  { to: "/app/company/messages", label: "Messages", icon: <MessageSquare size={18} /> },
  { to: "/app/company/profile", label: "Company Profile", icon: <Building2 size={18} /> },
];

const adminNav: NavItem[] = [
  { to: "/app/admin", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { to: "/app/admin/companies", label: "Companies", icon: <Building2 size={18} /> },
  { to: "/app/admin/experiences", label: "Experiences", icon: <Briefcase size={18} /> },
  { to: "/app/admin/users", label: "Users", icon: <Users size={18} /> },
  { to: "/app/admin/reports", label: "Reports", icon: <Flag size={18} /> },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = user?.role === "COMPANY" ? companyNav : user?.role === "ADMIN" ? adminNav : learnerNav;
  const notificationsPath =
    user?.role === "COMPANY" ? "/app/company/notifications" : user?.role === "ADMIN" ? "/app/admin" : "/app/learner/notifications";

  useEffect(() => {
    let mounted = true;
    NotificationApi.countUnread()
      .then((n) => mounted && setUnread(n))
      .catch(() => {});
    const interval = setInterval(() => {
      NotificationApi.countUnread()
        .then((n) => mounted && setUnread(n))
        .catch(() => {});
    }, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-glow min-h-screen bg-surface-0 text-ink-0 lg:flex">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-accent-500" />
          <span className="font-semibold">PathForge</span>
        </div>
        <button onClick={() => setMobileOpen((o) => !o)} className="rounded-lg p-2 hover:bg-surface-2">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={clsx(
          "w-64 shrink-0 border-r border-surface-border bg-surface-1 lg:flex lg:flex-col",
          mobileOpen ? "block" : "hidden lg:flex"
        )}
      >
        <div className="hidden items-center gap-2 px-6 py-6 lg:flex">
          <div className="h-8 w-8 rounded-full bg-accent-500 shadow-[0_0_20px_-2px_rgba(209,41,58,0.6)]" />
          <span className="text-lg font-semibold">PathForge</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split("/").length === 3}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-accent-500/15 text-accent-400" : "text-ink-2 hover:bg-surface-2 hover:text-ink-0"
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 border-t border-surface-border px-3 py-4">
          <NavLink
            to={notificationsPath}
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink-0"
          >
            <span className="flex items-center gap-3">
              <Bell size={18} /> Notifications
            </span>
            {unread > 0 && (
              <span className="rounded-full bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-surface-0">
                {unread}
              </span>
            )}
          </NavLink>
          <button
            onClick={toggle}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-2 hover:bg-surface-2 hover:text-ink-0"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-3 text-sm font-semibold">
              {user?.fullName?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-0">{user?.fullName}</p>
              <p className="truncate text-xs text-ink-3">{user?.role}</p>
            </div>
            <button onClick={handleLogout} title="Log out" className="rounded-lg p-1.5 text-ink-2 hover:bg-surface-2 hover:text-red-400">
              <LogOut size={16} />
            </button>
          </div>
          {user?.role === "ADMIN" && (
            <div className="flex items-center gap-2 rounded-xl bg-accent-500/10 px-3 py-2 text-xs text-accent-400">
              <ShieldCheck size={14} /> Admin access
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-ink-0">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
      </div>
      {action}
    </div>
  );
}
