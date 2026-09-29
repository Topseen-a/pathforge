// Shared types mirroring the PathForge Spring Boot backend DTOs.

export type Role = "TALENT" | "COMPANY" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";
export type WorkMode = "REMOTE" | "PHYSICAL" | "HYBRID";
export type ProjectStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type ApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "SUBMITTED" | "APPROVED" | "COMPLETED";
export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

export interface AuthResponse {
  token: string;
  userId: string;
  fullName: string;
  email: string;
  role: Role;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  status: UserStatus;
  createdAt?: string;
}

export interface TalentProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  bio?: string;
  location?: string;
  education?: string;
  interests?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyResponse {
  id: string;
  userId: string;
  fullName: string;
  name: string;
  email: string;
  description?: string;
  website?: string;
  businessRegistrationNo?: string;
  logoUrl?: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillResponse {
  id: string;
  name: string;
  category?: string;
}

export interface TalentSkillResponse {
  skillId: string;
  name: string;
  category?: string;
  proficiency?: string;
}

export interface ProjectSkillResponse {
  skillId: string;
  name: string;
  category?: string;
}

export interface ProjectResponse {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  workMode: WorkMode;
  location?: string;
  paid: boolean;
  compensationAmount?: number;
  durationDays?: number;
  status: ProjectStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationResponse {
  id: string;
  projectId: string;
  projectTitle: string;
  talentId: string;
  talentName: string;
  status: ApplicationStatus;
  coverNote?: string;
  createdAt?: string;
}

export interface WorkspaceResponse {
  id: string;
  applicationId: string;
  projectId: string;
  projectTitle: string;
  companyId: string;
  companyName: string;
  talentId: string;
  talentName: string;
  createdAt?: string;
}

export interface TaskResponse {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmissionResponse {
  id: string;
  taskId: string;
  talentId: string;
  talentName: string;
  content?: string;
  fileUrl?: string;
  submittedAt?: string;
}

export interface EvaluationResponse {
  id: string;
  projectId: string;
  projectTitle: string;
  talentId: string;
  talentName: string;
  evaluatorId: string;
  professionalismRating: number;
  skillRating: number;
  communicationRating: number;
  feedback?: string;
  createdAt?: string;
}

export interface ExperienceRecordResponse {
  id: string;
  projectId: string;
  projectTitle: string;
  companyName: string;
  talentId: string;
  talentName: string;
  verificationStatus: VerificationStatus;
  verificationCode: string;
  completedAt?: string;
}

export interface MessageResponse {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  projectId?: string;
  content: string;
  createdAt?: string;
}

export interface NotificationResponse {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

export interface ReportResponse {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  projectId?: string;
  reason: string;
  status: ReportStatus;
  createdAt?: string;
}

export interface ApiError {
  timestamp?: string;
  status?: number;
  error?: string;
  message: string;
  validationErrors?: Record<string, string>;
}
