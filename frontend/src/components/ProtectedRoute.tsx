import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageLoader } from "@/components/ui/Misc";
import type { Role } from "@/lib/types";

export function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: Role[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) {
    const home = user.role === "COMPANY" ? "/app/company" : user.role === "ADMIN" ? "/app/admin" : "/app/learner";
    return <Navigate to={home} replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}
