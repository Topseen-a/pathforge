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