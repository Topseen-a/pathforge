import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/Misc";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyPassport from "@/pages/public/VerifyPassport";

import LearnerDashboard from "@/pages/learner/Dashboard";
import LearnerExperiences from "@/pages/learner/Experiences";
import LearnerExperienceDetail from "@/pages/learner/ExperienceDetail";
import LearnerApplications from "@/pages/learner/Applications";
import LearnerWorkspaces from "@/pages/learner/Workspaces";
import LearnerWorkspaceDetail from "@/pages/learner/WorkspaceDetail";
import LearnerPassport from "@/pages/learner/Passport";
import LearnerProfile from "@/pages/learner/Profile";

import CompanyDashboard from "@/pages/company/Dashboard";
import CompanyExperiences from "@/pages/company/Experiences";
import ExperienceForm from "@/pages/company/ExperienceForm";
import ExperienceManage from "@/pages/company/ExperienceManage";
import CompanyProfile from "@/pages/company/Profile";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminCompanies from "@/pages/admin/Companies";
import AdminExperiences from "@/pages/admin/Experiences";
import AdminUsers from "@/pages/admin/Users";
import AdminReports from "@/pages/admin/Reports";

import Messages from "@/pages/shared/Messages";
import Notifications from "@/pages/shared/Notifications";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  const home = user.role === "COMPANY" ? "/app/company" : user.role === "ADMIN" ? "/app/admin" : "/app/learner";
  return <Navigate to={home} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyPassport />} />

      {/* Learner */}
      <Route path="/app/learner" element={<ProtectedRoute roles={["LEARNER"]}><LearnerDashboard /></ProtectedRoute>} />
      <Route path="/app/learner/experiences" element={<ProtectedRoute roles={["LEARNER"]}><LearnerExperiences /></ProtectedRoute>} />
      <Route path="/app/learner/experiences/:id" element={<ProtectedRoute roles={["LEARNER"]}><LearnerExperienceDetail /></ProtectedRoute>} />
      <Route path="/app/learner/applications" element={<ProtectedRoute roles={["LEARNER"]}><LearnerApplications /></ProtectedRoute>} />
      <Route path="/app/learner/workspaces" element={<ProtectedRoute roles={["LEARNER"]}><LearnerWorkspaces /></ProtectedRoute>} />
      <Route path="/app/learner/workspaces/:id" element={<ProtectedRoute roles={["LEARNER"]}><LearnerWorkspaceDetail /></ProtectedRoute>} />
      <Route path="/app/learner/passport" element={<ProtectedRoute roles={["LEARNER"]}><LearnerPassport /></ProtectedRoute>} />
      <Route path="/app/learner/messages" element={<ProtectedRoute roles={["LEARNER"]}><Messages /></ProtectedRoute>} />
      <Route path="/app/learner/notifications" element={<ProtectedRoute roles={["LEARNER"]}><Notifications /></ProtectedRoute>} />
      <Route path="/app/learner/profile" element={<ProtectedRoute roles={["LEARNER"]}><LearnerProfile /></ProtectedRoute>} />

      {/* Company */}
      <Route path="/app/company" element={<ProtectedRoute roles={["COMPANY"]}><CompanyDashboard /></ProtectedRoute>} />
      <Route path="/app/company/experiences" element={<ProtectedRoute roles={["COMPANY"]}><CompanyExperiences /></ProtectedRoute>} />
      <Route path="/app/company/experiences/new" element={<ProtectedRoute roles={["COMPANY"]}><ExperienceForm /></ProtectedRoute>} />
      <Route path="/app/company/experiences/:id" element={<ProtectedRoute roles={["COMPANY"]}><ExperienceManage /></ProtectedRoute>} />
      <Route path="/app/company/experiences/:id/edit" element={<ProtectedRoute roles={["COMPANY"]}><ExperienceForm /></ProtectedRoute>} />
      <Route path="/app/company/messages" element={<ProtectedRoute roles={["COMPANY"]}><Messages /></ProtectedRoute>} />
      <Route path="/app/company/notifications" element={<ProtectedRoute roles={["COMPANY"]}><Notifications /></ProtectedRoute>} />
      <Route path="/app/company/profile" element={<ProtectedRoute roles={["COMPANY"]}><CompanyProfile /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/app/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/app/admin/companies" element={<ProtectedRoute roles={["ADMIN"]}><AdminCompanies /></ProtectedRoute>} />
      <Route path="/app/admin/experiences" element={<ProtectedRoute roles={["ADMIN"]}><AdminExperiences /></ProtectedRoute>} />
      <Route path="/app/admin/users" element={<ProtectedRoute roles={["ADMIN"]}><AdminUsers /></ProtectedRoute>} />
      <Route path="/app/admin/reports" element={<ProtectedRoute roles={["ADMIN"]}><AdminReports /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
