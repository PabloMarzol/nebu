-- Migration: Add alt5_accounts table

BEGIN;

-- Create alt5_accounts table
CREATE TABLE alt5_accounts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    alt5_account_id VARCHAR(255) NOT NULL UNIQUE,
    alt5_user_id VARCHAR(255) NOT NULL,
    master_account BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for alt5_accounts
CREATE INDEX idx_alt5_accounts_user ON alt5_accounts(user_id);
CREATE INDEX idx_alt5_accounts_alt5_id ON alt5_accounts(alt5_account_id);
CREATE INDEX idx_alt5_accounts_master ON alt5_accounts(master_account);

COMMIT;
