-- V1__init_schema.sql
-- PathForge initial schema, generated from the agreed ERD.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Accounts
-- ============================================================

CREATE TABLE users (
       id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       full_name       VARCHAR(150) NOT NULL,
       email           VARCHAR(150) NOT NULL UNIQUE,
       phone_number    VARCHAR(20),
       password_hash   VARCHAR(255) NOT NULL,
       role            VARCHAR(20) NOT NULL
           CHECK (role IN ('LEARNER', 'COMPANY', 'ADMIN')),
       status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
           CHECK (status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED')),
       created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
       updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE learner_profiles (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      bio             TEXT,
      location        VARCHAR(150),
      education       VARCHAR(255),
      interests       TEXT,
      portfolio_url   VARCHAR(255),
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE companies (
       id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id                     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
       name                        VARCHAR(150) NOT NULL,
       description                 TEXT,
       website                     VARCHAR(255),
       business_registration_no   VARCHAR(100),
       verification_status        VARCHAR(20) NOT NULL DEFAULT 'PENDING'
           CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
       verified_at                 TIMESTAMPTZ,
       created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
       updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Skills subsystem
-- ============================================================

CREATE TABLE skills (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    category    VARCHAR(100)
);

CREATE TABLE learner_skills (
    learner_id      UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    skill_id        UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency     VARCHAR(20),
    PRIMARY KEY (learner_id, skill_id)
);

-- ============================================================
-- Experience marketplace
-- ============================================================

CREATE TABLE experiences (
     id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     company_id              UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     title                   VARCHAR(150) NOT NULL,
     description             TEXT,
     category                VARCHAR(100),
     objective               TEXT,
     duration_days           INT,
     compensation_amount     DECIMAL(10, 2),
     is_paid                 BOOLEAN NOT NULL DEFAULT FALSE,
     location                VARCHAR(150),
     work_mode               VARCHAR(20)
         CHECK (work_mode IN ('REMOTE', 'PHYSICAL', 'HYBRID')),
     status                  VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
         CHECK (status IN ('DRAFT', 'PUBLISHED', 'IN_PROGRESS', 'CLOSED', 'COMPLETED')),
     application_deadline    DATE,
     max_participants        INT NOT NULL DEFAULT 1,
     evaluation_criteria     TEXT,
     created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE experience_skills (
       experience_id   UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
       skill_id        UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
       PRIMARY KEY (experience_id, skill_id)
);

CREATE TABLE tasks (
       id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       experience_id   UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
       title           VARCHAR(150) NOT NULL,
       description     TEXT,
       deadline        DATE,
       status          VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED'
           CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'NEEDS_REVISION', 'COMPLETED')),
       created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
       updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE applications (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      experience_id   UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
      learner_id      UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
      motivation      TEXT,
      status          VARCHAR(20) NOT NULL DEFAULT 'PENDING'
          CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'INFO_REQUESTED')),
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT uq_applications_experience_learner UNIQUE (experience_id, learner_id)
);

-- ============================================================
-- Learner workspace
-- ============================================================

CREATE TABLE workspaces (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id   UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    learner_id      UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    application_id  UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_workspaces_experience_learner UNIQUE (experience_id, learner_id)
);

CREATE TABLE submissions (
     id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
     learner_id      UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
     content         TEXT,
     file_url        VARCHAR(255),
     submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Evaluation & trust
-- ============================================================

CREATE TABLE evaluations (
     id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     experience_id               UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
     learner_id                  UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
     evaluator_id                UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
     overall_rating              DECIMAL(3, 2),
     quality_rating               DECIMAL(3, 2),
     communication_rating        DECIMAL(3, 2),
     professionalism_rating      DECIMAL(3, 2),
     feedback                    TEXT,
     created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
     CONSTRAINT uq_evaluations_experience_learner UNIQUE (experience_id, learner_id)
);

CREATE TABLE experience_records (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id              UUID NOT NULL REFERENCES learner_profiles(id) ON DELETE CASCADE,
    experience_id           UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    evaluation_id           UUID NOT NULL UNIQUE REFERENCES evaluations(id) ON DELETE RESTRICT,
    verification_status     VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
    verification_code       VARCHAR(50) UNIQUE,
    completed_at            TIMESTAMPTZ,
    CONSTRAINT uq_experience_records_learner_experience UNIQUE (learner_id, experience_id)
);

-- ============================================================
-- Platform services
-- ============================================================

CREATE TABLE messages (
      id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sender_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      receiver_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      experience_id   UUID REFERENCES experiences(id) ON DELETE SET NULL,
      content         TEXT NOT NULL,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   type        VARCHAR(50),
   message     TEXT,
   is_read     BOOLEAN NOT NULL DEFAULT FALSE,
   created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reports (
     id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     reporter_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     reported_user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
     experience_id       UUID REFERENCES experiences(id) ON DELETE SET NULL,
     reason              VARCHAR(100),
     description         TEXT,
     status              VARCHAR(20) NOT NULL DEFAULT 'OPEN'
         CHECK (status IN ('OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED')),
     created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes on foreign keys (Postgres does not add these automatically)
-- ============================================================

CREATE INDEX idx_learner_profiles_user_id ON learner_profiles(user_id);
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_learner_skills_skill_id ON learner_skills(skill_id);
CREATE INDEX idx_experiences_company_id ON experiences(company_id);
CREATE INDEX idx_experience_skills_skill_id ON experience_skills(skill_id);
CREATE INDEX idx_tasks_experience_id ON tasks(experience_id);
CREATE INDEX idx_applications_experience_id ON applications(experience_id);
CREATE INDEX idx_applications_learner_id ON applications(learner_id);
CREATE INDEX idx_workspaces_experience_id ON workspaces(experience_id);
CREATE INDEX idx_workspaces_learner_id ON workspaces(learner_id);
CREATE INDEX idx_submissions_task_id ON submissions(task_id);
CREATE INDEX idx_submissions_learner_id ON submissions(learner_id);
CREATE INDEX idx_evaluations_experience_id ON evaluations(experience_id);
CREATE INDEX idx_evaluations_learner_id ON evaluations(learner_id);
CREATE INDEX idx_evaluations_evaluator_id ON evaluations(evaluator_id);
CREATE INDEX idx_experience_records_learner_id ON experience_records(learner_id);
CREATE INDEX idx_experience_records_experience_id ON experience_records(experience_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_experience_id ON messages(experience_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_reported_user_id ON reports(reported_user_id);
CREATE INDEX idx_reports_experience_id ON reports(experience_id);

-- V2__business_model.sql
-- Adds the business-model layer from PRD section 8: platform fees on paid
-- placements, company subscriptions (the "talent-development package"),
-- and sponsored experience campaigns.

CREATE TABLE subscriptions (
       id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
       plan            VARCHAR(30) NOT NULL DEFAULT 'TALENT_DEVELOPMENT'
           CHECK (plan IN ('TALENT_DEVELOPMENT')),
       status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
           CHECK (status IN ('ACTIVE', 'CANCELLED', 'EXPIRED')),
       started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
       expires_at      TIMESTAMPTZ,
       created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sponsorships (
      id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
      title               VARCHAR(150) NOT NULL,
      description         TEXT,
      target_audience     TEXT,
      slots_committed     INT,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE experiences
    ADD COLUMN sponsorship_id UUID REFERENCES sponsorships(id) ON DELETE SET NULL;

CREATE TABLE platform_fees (
   id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   workspace_id            UUID NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
   compensation_amount     DECIMAL(10, 2) NOT NULL,
   fee_amount              DECIMAL(10, 2) NOT NULL,
   status                  VARCHAR(20) NOT NULL DEFAULT 'PENDING'
       CHECK (status IN ('PENDING', 'INVOICED', 'PAID', 'WAIVED')),
   created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_company_id ON subscriptions(company_id);
CREATE INDEX idx_sponsorships_company_id ON sponsorships(company_id);
CREATE INDEX idx_experiences_sponsorship_id ON experiences(sponsorship_id);
CREATE INDEX idx_platform_fees_workspace_id ON platform_fees(workspace_id);