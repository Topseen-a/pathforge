-- V2__rename_learner_to_talent_and_experience_to_project.sql
-- Renames the "learner" role/concept to "talent", and the "experience" listing
-- entity to "project" — the two concepts were confusingly overloaded with the
-- "Experience Passport" (verified outcome) concept, which keeps its name.
-- The experience_records table (and its columns other than the FKs below) is
-- intentionally left untouched: it represents the verified Experience itself.

-- ============================================================
-- Role rename: LEARNER -> TALENT
-- ============================================================

ALTER TABLE users DROP CONSTRAINT users_role_check;
UPDATE users SET role = 'TALENT' WHERE role = 'LEARNER';
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('TALENT', 'COMPANY', 'ADMIN'));

-- ============================================================
-- Table renames
-- ============================================================

ALTER TABLE learner_profiles RENAME TO talent_profiles;
ALTER TABLE learner_skills RENAME TO talent_skills;
ALTER TABLE experiences RENAME TO projects;
ALTER TABLE experience_skills RENAME TO project_skills;

-- ============================================================
-- Column renames
-- ============================================================

ALTER TABLE talent_skills RENAME COLUMN learner_id TO talent_id;

ALTER TABLE project_skills RENAME COLUMN experience_id TO project_id;

ALTER TABLE tasks RENAME COLUMN experience_id TO project_id;

ALTER TABLE applications RENAME COLUMN experience_id TO project_id;
ALTER TABLE applications RENAME COLUMN learner_id TO talent_id;
ALTER TABLE applications RENAME CONSTRAINT uq_applications_experience_learner TO uq_applications_project_talent;

ALTER TABLE workspaces RENAME COLUMN experience_id TO project_id;
ALTER TABLE workspaces RENAME COLUMN learner_id TO talent_id;
ALTER TABLE workspaces RENAME CONSTRAINT uq_workspaces_experience_learner TO uq_workspaces_project_talent;

ALTER TABLE submissions RENAME COLUMN learner_id TO talent_id;

ALTER TABLE evaluations RENAME COLUMN experience_id TO project_id;
ALTER TABLE evaluations RENAME COLUMN learner_id TO talent_id;
ALTER TABLE evaluations RENAME CONSTRAINT uq_evaluations_experience_learner TO uq_evaluations_project_talent;

ALTER TABLE experience_records RENAME COLUMN experience_id TO project_id;
ALTER TABLE experience_records RENAME COLUMN learner_id TO talent_id;
ALTER TABLE experience_records RENAME CONSTRAINT uq_experience_records_learner_experience TO uq_experience_records_talent_project;

ALTER TABLE messages RENAME COLUMN experience_id TO project_id;

ALTER TABLE reports RENAME COLUMN experience_id TO project_id;

-- ============================================================
-- Index renames (cosmetic, but kept consistent with the new naming)
-- ============================================================

ALTER INDEX idx_learner_profiles_user_id RENAME TO idx_talent_profiles_user_id;
ALTER INDEX idx_learner_skills_skill_id RENAME TO idx_talent_skills_skill_id;
ALTER INDEX idx_experiences_company_id RENAME TO idx_projects_company_id;
ALTER INDEX idx_experience_skills_skill_id RENAME TO idx_project_skills_skill_id;
ALTER INDEX idx_tasks_experience_id RENAME TO idx_tasks_project_id;
ALTER INDEX idx_applications_experience_id RENAME TO idx_applications_project_id;
ALTER INDEX idx_applications_learner_id RENAME TO idx_applications_talent_id;
ALTER INDEX idx_workspaces_experience_id RENAME TO idx_workspaces_project_id;
ALTER INDEX idx_workspaces_learner_id RENAME TO idx_workspaces_talent_id;
ALTER INDEX idx_submissions_learner_id RENAME TO idx_submissions_talent_id;
ALTER INDEX idx_evaluations_experience_id RENAME TO idx_evaluations_project_id;
ALTER INDEX idx_evaluations_learner_id RENAME TO idx_evaluations_talent_id;
ALTER INDEX idx_experience_records_learner_id RENAME TO idx_experience_records_talent_id;
ALTER INDEX idx_experience_records_experience_id RENAME TO idx_experience_records_project_id;
ALTER INDEX idx_messages_experience_id RENAME TO idx_messages_project_id;
ALTER INDEX idx_reports_experience_id RENAME TO idx_reports_project_id;
