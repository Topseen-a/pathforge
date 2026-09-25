import { api } from "./api";
import type {
  ApplicationResponse,
  AuthResponse,
  CompanyResponse,
  EvaluationResponse,
  ExperienceRecordResponse,
  ExperienceResponse,
  ExperienceSkillResponse,
  LearnerProfileResponse,
  LearnerSkillResponse,
  MessageResponse,
  NotificationResponse,
  ReportResponse,
  Role,
  SkillResponse,
  SubmissionResponse,
  TaskResponse,
  UserResponse,
  VerificationStatus,
  WorkspaceResponse,
} from "./types";

// ---------- Auth ----------
export const AuthApi = {
  register: (body: { fullName: string; email: string; password: string; phoneNumber?: string; role: Role }) =>
    api.post<AuthResponse>("/auth/register", body).then((r) => r.data),
  login: (body: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", body).then((r) => r.data),
};

// ---------- Learner profile ----------
export const LearnerProfileApi = {
  create: (body: Partial<LearnerProfileResponse>) =>
    api.post<LearnerProfileResponse>("/learners/me/profile", body).then((r) => r.data),
  update: (body: Partial<LearnerProfileResponse>) =>
    api.put<LearnerProfileResponse>("/learners/me/profile", body).then((r) => r.data),
  getMine: () => api.get<LearnerProfileResponse>("/learners/me/profile").then((r) => r.data),
  getById: (profileId: string) =>
    api.get<LearnerProfileResponse>(`/learners/${profileId}/profile`).then((r) => r.data),
};

// ---------- Company profile ----------
export const CompanyApi = {
  create: (body: Partial<CompanyResponse>) => api.post<CompanyResponse>("/companies/me", body).then((r) => r.data),
  update: (body: Partial<CompanyResponse>) => api.put<CompanyResponse>("/companies/me", body).then((r) => r.data),
  getMine: () => api.get<CompanyResponse>("/companies/me").then((r) => r.data),
  getById: (companyId: string) => api.get<CompanyResponse>(`/companies/${companyId}`).then((r) => r.data),
};

// ---------- Skills ----------
export const SkillApi = {
  list: () => api.get<SkillResponse[]>("/skills").then((r) => r.data),
  create: (body: { name: string; category?: string }) =>
    api.post<SkillResponse>("/skills", body).then((r) => r.data),
};

export const LearnerSkillApi = {
  listMine: () => api.get<LearnerSkillResponse[]>("/learners/me/skills").then((r) => r.data),
  add: (body: { skillName: string; category?: string; proficiency?: string }) =>
    api.post<LearnerSkillResponse>("/learners/me/skills", body).then((r) => r.data),
  remove: (skillId: string) => api.delete(`/learners/me/skills/${skillId}`).then((r) => r.data),
};

export const ExperienceSkillApi = {
  list: (experienceId: string) =>
    api.get<ExperienceSkillResponse[]>(`/experiences/${experienceId}/skills`).then((r) => r.data),
  add: (experienceId: string, body: { skillName: string; category?: string }) =>
    api.post<ExperienceSkillResponse>(`/experiences/${experienceId}/skills`, body).then((r) => r.data),
  remove: (experienceId: string, skillId: string) =>
    api.delete(`/experiences/${experienceId}/skills/${skillId}`).then((r) => r.data),
};

// ---------- Experiences ----------
export const ExperienceApi = {
  create: (body: Partial<ExperienceResponse>) =>
    api.post<ExperienceResponse>("/experiences", body).then((r) => r.data),
  update: (id: string, body: Partial<ExperienceResponse>) =>
    api.put<ExperienceResponse>(`/experiences/${id}`, body).then((r) => r.data),
  publish: (id: string) => api.post<ExperienceResponse>(`/experiences/${id}/publish`).then((r) => r.data),
  close: (id: string) => api.post<ExperienceResponse>(`/experiences/${id}/close`).then((r) => r.data),
  getById: (id: string) => api.get<ExperienceResponse>(`/experiences/${id}`).then((r) => r.data),
  listPublished: () => api.get<ExperienceResponse[]>("/experiences").then((r) => r.data),
  listMine: () => api.get<ExperienceResponse[]>("/experiences/mine").then((r) => r.data),
  remove: (id: string) => api.delete(`/experiences/${id}`).then((r) => r.data),
};

// ---------- Applications ----------
export const ApplicationApi = {
  apply: (experienceId: string, body: { coverNote?: string }) =>
    api.post<ApplicationResponse>(`/experiences/${experienceId}/applications`, body).then((r) => r.data),
  listForExperience: (experienceId: string) =>
    api.get<ApplicationResponse[]>(`/experiences/${experienceId}/applications`).then((r) => r.data),
  listMine: () => api.get<ApplicationResponse[]>("/applications/mine").then((r) => r.data),
  getById: (applicationId: string) =>
    api.get<ApplicationResponse>(`/applications/${applicationId}`).then((r) => r.data),
  decide: (applicationId: string, status: "ACCEPTED" | "REJECTED") =>
    api.put<ApplicationResponse>(`/applications/${applicationId}/decision`, { status }).then((r) => r.data),
};

// ---------- Workspaces ----------
export const WorkspaceApi = {
  listMine: () => api.get<WorkspaceResponse[]>("/workspaces/mine").then((r) => r.data),
  getById: (id: string) => api.get<WorkspaceResponse>(`/workspaces/${id}`).then((r) => r.data),
};

// ---------- Tasks ----------
export const TaskApi = {
  create: (experienceId: string, body: { title: string; description: string; dueDate?: string }) =>
    api.post<TaskResponse>(`/experiences/${experienceId}/tasks`, body).then((r) => r.data),
  update: (experienceId: string, taskId: string, body: Partial<TaskResponse>) =>
    api.put<TaskResponse>(`/experiences/${experienceId}/tasks/${taskId}`, body).then((r) => r.data),
  updateStatus: (experienceId: string, taskId: string, status: string) =>
    api
      .put<TaskResponse>(`/experiences/${experienceId}/tasks/${taskId}/status`, { status })
      .then((r) => r.data),
  listForExperience: (experienceId: string) =>
    api.get<TaskResponse[]>(`/experiences/${experienceId}/tasks`).then((r) => r.data),
};

// ---------- Submissions ----------
export const SubmissionApi = {
  submit: (taskId: string, body: { content?: string; fileUrl?: string }) =>
    api.post<SubmissionResponse>(`/tasks/${taskId}/submissions`, body).then((r) => r.data),
  listForTask: (taskId: string) => api.get<SubmissionResponse[]>(`/tasks/${taskId}/submissions`).then((r) => r.data),
  listMineForTask: (taskId: string) =>
    api.get<SubmissionResponse[]>(`/tasks/${taskId}/submissions/mine`).then((r) => r.data),
  listMine: () => api.get<SubmissionResponse[]>("/submissions/mine").then((r) => r.data),
};

// ---------- Evaluations ----------
export const EvaluationApi = {
  create: (
    experienceId: string,
    learnerId: string,
    body: { professionalismRating: number; skillRating: number; communicationRating: number; feedback?: string }
  ) =>
    api
      .post<EvaluationResponse>(`/experiences/${experienceId}/learners/${learnerId}/evaluation`, body)
      .then((r) => r.data),
  get: (experienceId: string, learnerId: string) =>
    api
      .get<EvaluationResponse>(`/experiences/${experienceId}/learners/${learnerId}/evaluation`)
      .then((r) => r.data),
  listMine: () => api.get<EvaluationResponse[]>("/evaluations/mine").then((r) => r.data),
};

// ---------- Passport ----------
export const PassportApi = {
  getMine: () => api.get<ExperienceRecordResponse[]>("/passport/mine").then((r) => r.data),
  getById: (recordId: string) => api.get<ExperienceRecordResponse>(`/passport/${recordId}`).then((r) => r.data),
  verifyByCode: (code: string) =>
    api.get<ExperienceRecordResponse>(`/verify/${code}`).then((r) => r.data),
};

// ---------- Messaging ----------
export const MessageApi = {
  send: (body: { receiverId: string; content: string; experienceId?: string }) =>
    api.post<MessageResponse>("/messages", body).then((r) => r.data),
  withUser: (otherUserId: string) =>
    api.get<MessageResponse[]>(`/messages/with/${otherUserId}`).then((r) => r.data),
  forExperience: (experienceId: string) =>
    api.get<MessageResponse[]>(`/messages/experience/${experienceId}`).then((r) => r.data),
};

// ---------- Notifications ----------
export const NotificationApi = {
  list: () => api.get<NotificationResponse[]>("/notifications").then((r) => r.data),
  listUnread: () => api.get<NotificationResponse[]>("/notifications/unread").then((r) => r.data),
  countUnread: () => api.get<number>("/notifications/unread/count").then((r) => r.data),
  markRead: (id: string) => api.put<NotificationResponse>(`/notifications/${id}/read`).then((r) => r.data),
};

// ---------- Reports ----------
export const ReportApi = {
  file: (body: { reportedUserId?: string; experienceId?: string; reason: string }) =>
    api.post<ReportResponse>("/reports", body).then((r) => r.data),
  listMine: () => api.get<ReportResponse[]>("/reports/mine").then((r) => r.data),
};

// ---------- Admin ----------
export const AdminApi = {
  verifyCompany: (companyId: string, status: VerificationStatus) =>
    api
      .put<CompanyResponse>(`/admin/companies/${companyId}/verify`, null, { params: { status } })
      .then((r) => r.data),
  moderateExperience: (experienceId: string) =>
    api.put<ExperienceResponse>(`/admin/experiences/${experienceId}/moderate`).then((r) => r.data),
  listUsers: () => api.get<UserResponse[]>("/admin/users").then((r) => r.data),
  getUser: (userId: string) => api.get<UserResponse>(`/admin/users/${userId}`).then((r) => r.data),
  suspendUser: (userId: string) => api.put<UserResponse>(`/admin/users/${userId}/suspend`).then((r) => r.data),
  reactivateUser: (userId: string) =>
    api.put<UserResponse>(`/admin/users/${userId}/reactivate`).then((r) => r.data),
  listOpenReports: () => api.get<ReportResponse[]>("/admin/reports").then((r) => r.data),
  resolveReport: (reportId: string, status: "RESOLVED" | "DISMISSED") =>
    api.put<ReportResponse>(`/admin/reports/${reportId}/resolve`, null, { params: { status } }).then((r) => r.data),
};
