import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/Misc";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Landing from "@/pages/public/Landing";
import VerifyPassport from "@/pages/public/VerifyPassport";

import TalentDashboard from "@/pages/talent/Dashboard";
import TalentProjects from "@/pages/talent/Projects";
import TalentProjectDetail from "@/pages/talent/ProjectDetail";
import TalentApplications from "@/pages/talent/Applications";
import TalentWorkspaces from "@/pages/talent/Workspaces";
import TalentWorkspaceDetail from "@/pages/talent/WorkspaceDetail";
import TalentPassport from "@/pages/talent/Passport";
import TalentProfile from "@/pages/talent/Profile";

import CompanyDashboard from "@/pages/company/Dashboard";
import CompanyProjects from "@/pages/company/Projects";
import ProjectForm from "@/pages/company/ProjectForm";
import ProjectManage from "@/pages/company/ProjectManage";
import CompanyProfile from "@/pages/company/Profile";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminCompanies from "@/pages/admin/Companies";
import AdminProjects from "@/pages/admin/Projects";
import AdminUsers from "@/pages/admin/Users";
import AdminReports from "@/pages/admin/Reports";

import Messages from "@/pages/shared/Messages";
import Notifications from "@/pages/shared/Notifications";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Landing />;
  const home = user.role === "COMPANY" ? "/app/company" : user.role === "ADMIN" ? "/app/admin" : "/app/talent";
  return <Navigate to={home} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyPassport />} />

      {/* Talent */}
      <Route path="/app/talent" element={<ProtectedRoute roles={["TALENT"]}><TalentDashboard /></ProtectedRoute>} />
      <Route path="/app/talent/projects" element={<ProtectedRoute roles={["TALENT"]}><TalentProjects /></ProtectedRoute>} />
      <Route path="/app/talent/projects/:id" element={<ProtectedRoute roles={["TALENT"]}><TalentProjectDetail /></ProtectedRoute>} />
      <Route path="/app/talent/applications" element={<ProtectedRoute roles={["TALENT"]}><TalentApplications /></ProtectedRoute>} />
      <Route path="/app/talent/workspaces" element={<ProtectedRoute roles={["TALENT"]}><TalentWorkspaces /></ProtectedRoute>} />
      <Route path="/app/talent/workspaces/:id" element={<ProtectedRoute roles={["TALENT"]}><TalentWorkspaceDetail /></ProtectedRoute>} />
      <Route path="/app/talent/passport" element={<ProtectedRoute roles={["TALENT"]}><TalentPassport /></ProtectedRoute>} />
      <Route path="/app/talent/messages" element={<ProtectedRoute roles={["TALENT"]}><Messages /></ProtectedRoute>} />
      <Route path="/app/talent/notifications" element={<ProtectedRoute roles={["TALENT"]}><Notifications /></ProtectedRoute>} />
      <Route path="/app/talent/profile" element={<ProtectedRoute roles={["TALENT"]}><TalentProfile /></ProtectedRoute>} />

      {/* Company */}
      <Route path="/app/company" element={<ProtectedRoute roles={["COMPANY"]}><CompanyDashboard /></ProtectedRoute>} />
      <Route path="/app/company/projects" element={<ProtectedRoute roles={["COMPANY"]}><CompanyProjects /></ProtectedRoute>} />
      <Route path="/app/company/projects/new" element={<ProtectedRoute roles={["COMPANY"]}><ProjectForm /></ProtectedRoute>} />
      <Route path="/app/company/projects/:id" element={<ProtectedRoute roles={["COMPANY"]}><ProjectManage /></ProtectedRoute>} />
      <Route path="/app/company/projects/:id/edit" element={<ProtectedRoute roles={["COMPANY"]}><ProjectForm /></ProtectedRoute>} />
      <Route path="/app/company/messages" element={<ProtectedRoute roles={["COMPANY"]}><Messages /></ProtectedRoute>} />
      <Route path="/app/company/notifications" element={<ProtectedRoute roles={["COMPANY"]}><Notifications /></ProtectedRoute>} />
      <Route path="/app/company/profile" element={<ProtectedRoute roles={["COMPANY"]}><CompanyProfile /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/app/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/app/admin/companies" element={<ProtectedRoute roles={["ADMIN"]}><AdminCompanies /></ProtectedRoute>} />
      <Route path="/app/admin/projects" element={<ProtectedRoute roles={["ADMIN"]}><AdminProjects /></ProtectedRoute>} />
      <Route path="/app/admin/users" element={<ProtectedRoute roles={["ADMIN"]}><AdminUsers /></ProtectedRoute>} />
      <Route path="/app/admin/reports" element={<ProtectedRoute roles={["ADMIN"]}><AdminReports /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
