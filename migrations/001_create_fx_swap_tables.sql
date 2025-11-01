BEGIN;

-- 1. FX Rate Snapshots - Historical rate tracking for audit & compliance
CREATE TABLE fx_rate_snapshots (
    id SERIAL PRIMARY KEY,
    
    -- Rate details
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    rate DECIMAL(18, 8) NOT NULL,
    
    -- Source details
    source VARCHAR(50) NOT NULL, -- chainlink, pyth, coingecko, aggregated
    source_metadata JSONB, -- API response, oracle address, etc.
    confidence_score DECIMAL(5, 4), -- 0.0000 to 1.0000
    
    -- Market conditions
    spread_percent DECIMAL(8, 6), -- bid-ask spread as percentage
    volume_24h DECIMAL(30, 18), -- 24h trading volume in base currency
    
    -- Timestamps
    fetched_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for fx_rate_snapshots
CREATE INDEX idx_fx_rate_snapshots_pair ON fx_rate_snapshots(from_currency, to_currency);
CREATE INDEX idx_fx_rate_snapshots_source ON fx_rate_snapshots(source);
CREATE INDEX idx_fx_rate_snapshots_fetched ON fx_rate_snapshots(fetched_at);

-- 2. FX Swap Configs - Platform settings and parameters
CREATE TABLE fx_swap_configs (
    id SERIAL PRIMARY KEY,
    
    -- Configuration details
    config_name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Fee structure
    base_fee_percent DECIMAL(8, 6) NOT NULL, -- Base fee percentage
    min_fee_amount DECIMAL(30, 18) NOT NULL, -- Minimum fee in GBP
    max_fee_amount DECIMAL(30, 18), -- Maximum fee cap in GBP
    
    -- Limits
    min_swap_amount DECIMAL(30, 18) NOT NULL, -- Minimum swap in GBP
    max_swap_amount DECIMAL(30, 18) NOT NULL, -- Maximum swap in GBP
    daily_limit_amount DECIMAL(30, 18), -- Daily limit per user in GBP
    
    -- Risk parameters
    max_slippage_percent DECIMAL(5, 4) NOT NULL, -- Maximum allowed slippage
    rate_validity_seconds INTEGER NOT NULL DEFAULT 60, -- How long rates are valid
    retry_attempts INTEGER NOT NULL DEFAULT 3,
    
    -- Hot wallet settings
    hot_wallet_address VARCHAR(42) NOT NULL, -- Ethereum address (0x + 40 chars)
    hot_wallet_min_balance DECIMAL(30, 18) NOT NULL, -- Minimum USDT balance to maintain
    
    -- System settings
    maintenance_mode BOOLEAN NOT NULL DEFAULT false,
    maintenance_message TEXT,
    
    -- Audit fields
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255), -- Admin user who created this config
    updated_by VARCHAR(255)  -- Admin user who last updated this config
);

-- Create indexes for fx_swap_configs
CREATE INDEX idx_fx_swap_configs_active ON fx_swap_configs(is_active);
CREATE INDEX idx_fx_swap_configs_name ON fx_swap_configs(config_name);

-- Insert default configuration
INSERT INTO fx_swap_configs (
    config_name,
    is_active,
    base_fee_percent,
    min_fee_amount,
    max_fee_amount,
    min_swap_amount,
    max_swap_amount,
    daily_limit_amount,
    max_slippage_percent,
    rate_validity_seconds,
    retry_attempts,
    hot_wallet_address,
    hot_wallet_min_balance,
    maintenance_mode,
    created_by
) VALUES (
    'default_config',
    true,
    0.015, -- 1.5% base fee
    2.00, -- £2 minimum fee
    50.00, -- £50 maximum fee
    10.00, -- £10 minimum swap
    5000.00, -- £5000 maximum swap
    10000.00, -- £10k daily limit
    0.05, -- 5% max slippage
    60, -- 60 seconds rate validity
    3, -- 3 retry attempts
    '0x0000000000000000000000000000000000000000', -- TODO: Replace with actual hot wallet
    1000.00, -- 1000 USDT minimum balance
    false, -- Not in maintenance mode
    'system_init'
);

COMMIT;






