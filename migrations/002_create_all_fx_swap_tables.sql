BEGIN;

-- 1. FX Swap Orders - Main order tracking table (MISSING - CREATE IT)
CREATE TABLE fx_swap_orders (
    id VARCHAR(36) PRIMARY KEY, -- UUID format
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    
    -- Stripe payment details
    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
    client_order_id VARCHAR(255) NOT NULL UNIQUE,
    
    -- Fiat input
    fiat_currency VARCHAR(10) NOT NULL, -- GBP, EUR, USD
    fiat_amount DECIMAL(18, 2) NOT NULL,
    
    -- Target crypto output
    target_token VARCHAR(20) NOT NULL, -- USDT, USDC, DAI
    target_token_amount DECIMAL(30, 18),
    destination_wallet VARCHAR(42) NOT NULL, -- 0x...
    
    -- FX rate snapshot
    fx_rate DECIMAL(18, 8) NOT NULL, -- GBP->USD rate
    fx_rate_source VARCHAR(50) NOT NULL, -- chainlink, pyth, coingecko
    fx_rate_timestamp TIMESTAMP NOT NULL,
    
    -- Fees
    platform_fee_percent DECIMAL(5, 4) NOT NULL, -- e.g., 0.5%
    platform_fee_amount DECIMAL(18, 8),
    network_fee_amount DECIMAL(30, 18), -- Gas fee in ETH/native token
    total_fees_usd DECIMAL(18, 2),
    
    -- 0x swap execution details
    zero_x_quote_id VARCHAR(255),
    zero_x_swap_data JSONB, -- Full quote response
    executed_price DECIMAL(30, 18), -- Actual execution price
    slippage_percent DECIMAL(5, 4), -- Actual slippage
    
    -- Transaction hashes
    swap_tx_hash VARCHAR(66), -- 0x + 64 chars
    transfer_tx_hash VARCHAR(66), -- Transfer to user wallet
    
    -- Status tracking
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    
    -- Error handling
    error_message TEXT,
    error_code VARCHAR(50),
    retry_count INTEGER DEFAULT 0,
    
    -- Timestamps for each stage
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    stripe_confirmed_at TIMESTAMP,
    fx_rate_locked_at TIMESTAMP,
    swap_started_at TIMESTAMP,
    swap_completed_at TIMESTAMP,
    transfer_started_at TIMESTAMP,
    completed_at TIMESTAMP,
    failed_at TIMESTAMP,
    
    -- Audit fields
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Create indexes for fx_swap_orders
CREATE INDEX idx_fx_swap_user ON fx_swap_orders(user_id);
CREATE INDEX idx_fx_swap_stripe_payment ON fx_swap_orders(stripe_payment_intent_id);
CREATE INDEX idx_fx_swap_status ON fx_swap_orders(status);
CREATE INDEX idx_fx_swap_created ON fx_swap_orders(created_at);

-- 2. FX Wallet Operations - Track all USDT transfers to user wallets (MISSING - CREATE IT)
CREATE TABLE fx_wallet_operations (
    id SERIAL PRIMARY KEY,
    fx_swap_order_id VARCHAR(36) NOT NULL REFERENCES fx_swap_orders(id),
    
    -- Operation details
    operation_type VARCHAR(30) NOT NULL, -- transfer_to_user, refund
    token VARCHAR(20) NOT NULL,
    amount DECIMAL(30, 18) NOT NULL,
    
    -- Addresses
    from_address VARCHAR(42) NOT NULL, -- Platform hot wallet
    to_address VARCHAR(42) NOT NULL, -- User wallet or refund address
    
    -- Blockchain details
    chain_id INTEGER NOT NULL, -- 1 for mainnet, 11155111 for sepolia
    network VARCHAR(30) NOT NULL, -- mainnet, sepolia
    tx_hash VARCHAR(66),
    block_number INTEGER,
    confirmations INTEGER DEFAULT 0,
    required_confirmations INTEGER DEFAULT 3,
    
    -- Gas tracking
    gas_price DECIMAL(30, 18), -- in wei
    gas_used INTEGER,
    gas_fee_paid DECIMAL(30, 18), -- in native token
    gas_fee_usd DECIMAL(18, 2),
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    
    error_message TEXT,
    
    -- Timing
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    broadcast_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    failed_at TIMESTAMP
);

-- Create indexes for fx_wallet_operations
CREATE INDEX idx_fx_wallet_order ON fx_wallet_operations(fx_swap_order_id);
CREATE INDEX idx_fx_wallet_tx_hash ON fx_wallet_operations(tx_hash);
CREATE INDEX idx_fx_wallet_status ON fx_wallet_operations(status);

-- 3. FX Balance Reconciliations - Daily/hourly balance checks (MISSING - CREATE IT)
CREATE TABLE fx_balance_reconciliations (
    id SERIAL PRIMARY KEY,
    
    -- Reconciliation period
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    reconciliation_type VARCHAR(30) NOT NULL, -- hourly, daily, manual
    
    -- Fiat side (Stripe)
    stripe_fiat_currency VARCHAR(10) NOT NULL,
    stripe_opening_balance DECIMAL(18, 2),
    stripe_inflows DECIMAL(18, 2), -- Total deposits
    stripe_outflows DECIMAL(18, 2), -- Total withdrawals/refunds
    stripe_closing_balance DECIMAL(18, 2),
    stripe_expected_balance DECIMAL(18, 2),
    stripe_difference DECIMAL(18, 2),
    
    -- Crypto side (On-chain wallets)
    crypto_token VARCHAR(20) NOT NULL,
    crypto_opening_balance DECIMAL(30, 18),
    crypto_swap_acquired DECIMAL(30, 18), -- Bought via 0x
    crypto_transferred_out DECIMAL(30, 18), -- Sent to users
    crypto_closing_balance DECIMAL(30, 18),
    crypto_expected_balance DECIMAL(30, 18),
    crypto_difference DECIMAL(30, 18),
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    
    discrepancy_notes TEXT,
    resolved_by VARCHAR(36), -- Admin user ID
    resolved_at TIMESTAMP,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for fx_balance_reconciliations
CREATE INDEX idx_fx_reconciliation_period ON fx_balance_reconciliations(period_end);
CREATE INDEX idx_fx_reconciliation_status ON fx_balance_reconciliations(status);


DROP TABLE IF EXISTS fx_rate_snapshots CASCADE;

CREATE TABLE fx_rate_snapshots (
    id SERIAL PRIMARY KEY,
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    rate DECIMAL(18, 8) NOT NULL,
    source VARCHAR(50) NOT NULL,
    source_metadata JSONB,
    confidence_score DECIMAL(5, 4),
    spread_percent DECIMAL(5, 4),
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_fx_rate_pair ON fx_rate_snapshots(from_currency, to_currency);
CREATE INDEX idx_fx_rate_timestamp ON fx_rate_snapshots(timestamp);


-- 4. Update fx_swap_configs table to match schema (ADD MISSING COLUMNS)
-- First, let's add any missing columns to the existing fx_swap_configs table
ALTER TABLE fx_swap_configs 
ADD COLUMN IF NOT EXISTS platform_fee_percent DECIMAL(5, 4) NOT NULL DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS min_platform_fee_usd DECIMAL(18, 2) DEFAULT 1.00,
ADD COLUMN IF NOT EXISTS max_platform_fee_usd DECIMAL(18, 2) DEFAULT 50.00,
ADD COLUMN IF NOT EXISTS min_swap_amount_gbp DECIMAL(18, 2) NOT NULL DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS max_swap_amount_gbp DECIMAL(18, 2) NOT NULL DEFAULT 10000.00,
ADD COLUMN IF NOT EXISTS daily_user_limit_gbp DECIMAL(18, 2) DEFAULT 5000.00,
ADD COLUMN IF NOT EXISTS max_slippage_percent DECIMAL(5, 4) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS fx_rate_validity_seconds INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS required_block_confirmations INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS fx_rate_sources TEXT[] NOT NULL DEFAULT ARRAY['chainlink', 'coingecko'],
ADD COLUMN IF NOT EXISTS hot_wallet_address VARCHAR(42) NOT NULL DEFAULT '0x0000000000000000000000000000000000000000',
ADD COLUMN IF NOT EXISTS hot_wallet_min_balance DECIMAL(30, 18) NOT NULL DEFAULT 1000.00,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_message TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

-- Remove old columns that don't match the schema
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS config_name;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS base_fee_percent;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS min_fee_amount;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS max_fee_amount;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS min_swap_amount;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS max_swap_amount;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS daily_limit_amount;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS rate_validity_seconds;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS retry_attempts;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS created_by;
ALTER TABLE fx_swap_configs DROP COLUMN IF EXISTS updated_by;

-- Clear and insert proper default configuration
DELETE FROM fx_swap_configs;
INSERT INTO fx_swap_configs (
    platform_fee_percent,
    min_platform_fee_usd,
    max_platform_fee_usd,
    min_swap_amount_gbp,
    max_swap_amount_gbp,
    daily_user_limit_gbp,
    max_slippage_percent,
    fx_rate_validity_seconds,
    required_block_confirmations,
    fx_rate_sources,
    hot_wallet_address,
    hot_wallet_min_balance,
    is_active,
    maintenance_mode
) VALUES (
    0.015, -- 1.5% platform fee
    1.00, -- $1 minimum fee
    50.00, -- $50 maximum fee
    10.00, -- £10 minimum swap
    5000.00, -- £5000 maximum swap
    10000.00, -- £10k daily limit
    0.05, -- 5% max slippage
    60, -- 60 seconds rate validity
    3, -- 3 block confirmations
    ARRAY['chainlink', 'coingecko'], -- Rate sources
    '0x0000000000000000000000000000000000000000', -- TODO: Replace with actual hot wallet
    1000.00, -- 1000 USDT minimum balance
    true, -- Active
    false -- Not in maintenance mode
);

COMMIT;






