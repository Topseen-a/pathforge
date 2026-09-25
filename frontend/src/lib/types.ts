// Shared types mirroring the PathForge Spring Boot backend DTOs.

export type Role = "LEARNER" | "COMPANY" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "SUSPENDED";
export type WorkMode = "REMOTE" | "ONSITE" | "HYBRID";
export type ExperienceStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
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

export interface LearnerProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  bio?: string;
  location?: string;
  education?: string;
  interests?: string;
  portfolioUrl?: string;
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

export interface LearnerSkillResponse {
  skillId: string;
  name: string;
  category?: string;
  proficiency?: string;
}

export interface ExperienceSkillResponse {
  skillId: string;
  name: string;
  category?: string;
}

export interface ExperienceResponse {
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
  status: ExperienceStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationResponse {
  id: string;
  experienceId: string;
  experienceTitle: string;
  learnerId: string;
  learnerName: string;
  status: ApplicationStatus;
  coverNote?: string;
  createdAt?: string;
}

export interface WorkspaceResponse {
  id: string;
  applicationId: string;
  experienceId: string;
  experienceTitle: string;
  companyId: string;
  companyName: string;
  learnerId: string;
  learnerName: string;
  createdAt?: string;
}

export interface TaskResponse {
  id: string;
  experienceId: string;
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
  learnerId: string;
  learnerName: string;
  content?: string;
  fileUrl?: string;
  submittedAt?: string;
}

export interface EvaluationResponse {
  id: string;
  experienceId: string;
  experienceTitle: string;
  learnerId: string;
  learnerName: string;
  evaluatorId: string;
  professionalismRating: number;
  skillRating: number;
  communicationRating: number;
  feedback?: string;
  createdAt?: string;
}

export interface ExperienceRecordResponse {
  id: string;
  experienceId: string;
  experienceTitle: string;
  companyName: string;
  learnerId: string;
  learnerName: string;
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
  experienceId?: string;
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
  experienceId?: string;
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
