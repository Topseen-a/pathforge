-- V3__escrow_payments.sql
-- Replaces the platform_fees fee-ledger with genuine escrow: PathForge
-- collects the full company payment (compensation + platform fee) via
-- Paystack, holds it, and releases the learner's share on completion.

DROP TABLE IF EXISTS platform_fees;

CREATE TABLE bank_accounts (
       id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       learner_id                  UUID NOT NULL UNIQUE REFERENCES learner_profiles(id) ON DELETE CASCADE,
       bank_code                   VARCHAR(10) NOT NULL,
       bank_name                   VARCHAR(100) NOT NULL,
       account_number              VARCHAR(20) NOT NULL,
       account_name                VARCHAR(150) NOT NULL,
       paystack_recipient_code     VARCHAR(50),
       created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
       updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE escrow_transactions (
     id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     workspace_id                UUID NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
     compensation_amount         DECIMAL(10, 2) NOT NULL,
     platform_fee_amount         DECIMAL(10, 2) NOT NULL,
     total_amount                DECIMAL(10, 2) NOT NULL,
     status                      VARCHAR(20) NOT NULL DEFAULT 'AWAITING_PAYMENT'
         CHECK (status IN ('AWAITING_PAYMENT', 'FUNDED', 'RELEASED', 'REFUNDED', 'FAILED')),
     paystack_reference          VARCHAR(100) UNIQUE,
     paystack_transfer_code      VARCHAR(100),
     funded_at                   TIMESTAMPTZ,
     released_at                 TIMESTAMPTZ,
     created_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bank_accounts_learner_id ON bank_accounts(learner_id);
CREATE INDEX idx_escrow_transactions_workspace_id ON escrow_transactions(workspace_id);
CREATE INDEX idx_escrow_transactions_status ON escrow_transactions(status);