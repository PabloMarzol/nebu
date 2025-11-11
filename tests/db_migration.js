import pkg from "pg";
import fs from "fs";
import dotenv from "dotenv";
import { randomFillSync } from "crypto";

dotenv.config();

const { Pool } = pkg; 

async function runMigrations() {
    const pool = new Pool({ 
        connectionString: process.env.DATABASE_URL, 
        ssl: false 
    });
    
    try {
        // Create alt5_accounts table if it doesn't exist
        const alt5TableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'alt5_accounts'
            )
        `);
        
        if (!alt5TableExists.rows[0].exists) {
            await pool.query(`
                CREATE TABLE alt5_accounts (
                    id SERIAL PRIMARY KEY,
                    user_id VARCHAR(36) NOT NULL,
                    alt5_account_id VARCHAR(255) NOT NULL UNIQUE,
                    alt5_user_id VARCHAR(255) NOT NULL,
                    master_account BOOLEAN DEFAULT false NOT NULL,
                    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
                )
            `);
            
            await pool.query('CREATE INDEX idx_alt5_accounts_user ON alt5_accounts(user_id)');
            await pool.query('CREATE INDEX idx_alt5_accounts_alt5_id ON alt5_accounts(alt5_account_id)');
            await pool.query('CREATE INDEX idx_alt5_accounts_master ON alt5_accounts(master_account)');
            
            console.log('✅ alt5_accounts table created successfully');
        } else {
            console.log('✅ alt5_accounts table already exists');
        }

        // Create fx_rate_snapshots table if it doesn't exist (fix existing migration)
        const fxRateTableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'fx_rate_snapshots'
            )
        `);
        
        if (!fxRateTableExists.rows[0].exists) {
            await pool.query(`
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
                )
            `);
            
            await pool.query('CREATE INDEX idx_fx_rate_pair ON fx_rate_snapshots(from_currency, to_currency)');
            await pool.query('CREATE INDEX idx_fx_rate_timestamp ON fx_rate_snapshots(timestamp)');
            
            console.log('✅ fx_rate_snapshots table created successfully');
        } else {
            console.log('✅ fx_rate_snapshots table already exists');
        }

        // Create fx_wallet_operations table if it doesn't exist
        const walletOpsTableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'fx_wallet_operations'
            )
        `);
        
        if (!walletOpsTableExists.rows[0].exists) {
            await pool.query(`
                CREATE TABLE fx_wallet_operations (
                    id SERIAL PRIMARY KEY,
                    fx_swap_order_id VARCHAR(36) NOT NULL,
                    operation_type VARCHAR(30) NOT NULL,
                    token VARCHAR(20) NOT NULL,
                    amount DECIMAL(30, 18) NOT NULL,
                    from_address VARCHAR(42) NOT NULL,
                    to_address VARCHAR(42) NOT NULL,
                    chain_id INTEGER NOT NULL,
                    network VARCHAR(30) NOT NULL,
                    tx_hash VARCHAR(6),
                    block_number INTEGER,
                    confirmations INTEGER DEFAULT 0,
                    required_confirmations INTEGER DEFAULT 3,
                    status VARCHAR(30) NOT NULL DEFAULT 'pending',
                    error_message TEXT,
                    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                    broadcast_at TIMESTAMP,
                    confirmed_at TIMESTAMP,
                    failed_at TIMESTAMP
                )
            `);
            
            await pool.query('CREATE INDEX idx_fx_wallet_order ON fx_wallet_operations(fx_swap_order_id)');
            await pool.query('CREATE INDEX idx_fx_wallet_tx_hash ON fx_wallet_operations(tx_hash)');
            await pool.query('CREATE INDEX idx_fx_wallet_status ON fx_wallet_operations(status)');
            
            console.log('✅ fx_wallet_operations table created successfully');
        } else {
            console.log('✅ fx_wallet_operations table already exists');
        }

        // Create fx_balance_reconciliations table if it doesn't exist
        const reconcilTableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'fx_balance_reconciliations'
            )
        `);
        
        if (!reconcilTableExists.rows[0].exists) {
            await pool.query(`
                CREATE TABLE fx_balance_reconciliations (
                    id SERIAL PRIMARY KEY,
                    period_start TIMESTAMP NOT NULL,
                    period_end TIMESTAMP NOT NULL,
                    reconciliation_type VARCHAR(30) NOT NULL,
                    stripe_fiat_currency VARCHAR(10) NOT NULL,
                    stripe_opening_balance DECIMAL(18, 2),
                    stripe_inflows DECIMAL(18, 2),
                    stripe_outflows DECIMAL(18, 2),
                    stripe_closing_balance DECIMAL(18, 2),
                    stripe_expected_balance DECIMAL(18, 2),
                    stripe_difference DECIMAL(18, 2),
                    crypto_token VARCHAR(20) NOT NULL,
                    crypto_opening_balance DECIMAL(30, 18),
                    crypto_swap_acquired DECIMAL(30, 18),
                    crypto_transferred_out DECIMAL(30, 18),
                    crypto_closing_balance DECIMAL(30, 18),
                    crypto_expected_balance DECIMAL(30, 18),
                    crypto_difference DECIMAL(30, 18),
                    status VARCHAR(30) NOT NULL DEFAULT 'pending',
                    discrepancy_notes TEXT,
                    resolved_by VARCHAR(36),
                    resolved_at TIMESTAMP,
                    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
                )
            `);
            
            await pool.query('CREATE INDEX idx_fx_reconciliation_period ON fx_balance_reconciliations(period_end)');
            await pool.query('CREATE INDEX idx_fx_reconciliation_status ON fx_balance_reconciliations(status)');
            
            console.log('✅ fx_balance_reconciliations table created successfully');
        } else {
            console.log('✅ fx_balance_reconciliations table already exists');
        }

        // Create fx_swap_configs table if it doesn't exist
        const configTableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'fx_swap_configs'
            )
        `);
        
        if (!configTableExists.rows[0].exists) {
            await pool.query(`
                CREATE TABLE fx_swap_configs (
                    id SERIAL PRIMARY KEY,
                    platform_fee_percent DECIMAL(5, 4) NOT NULL DEFAULT '0.5',
                    min_platform_fee_usd DECIMAL(18, 2) DEFAULT '1.00',
                    max_platform_fee_usd DECIMAL(18, 2) DEFAULT '50.00',
                    min_swap_amount_gbp DECIMAL(18, 2) NOT NULL DEFAULT '5.00',
                    max_swap_amount_gbp DECIMAL(18, 2) NOT NULL DEFAULT '100.00',
                    daily_user_limit_gbp DECIMAL(18, 2) DEFAULT '5000.00',
                    max_slippage_percent DECIMAL(5, 4) DEFAULT '1.0',
                    fx_rate_validity_seconds INTEGER DEFAULT 30,
                    required_block_confirmations INTEGER DEFAULT 3,
                    fx_rate_sources TEXT[] NOT NULL,
                    hot_wallet_address VARCHAR(42) NOT NULL,
                    hot_wallet_min_balance DECIMAL(30, 18) NOT NULL,
                    is_active BOOLEAN NOT NULL DEFAULT true,
                    maintenance_mode BOOLEAN DEFAULT false,
                    maintenance_message TEXT,
                    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
                )
            `);
            
            console.log('✅ fx_swap_configs table created successfully');
        } else {
            console.log('✅ fx_swap_configs table already exists');
        }

        // Ensure fx_swap_orders table has the necessary columns for ALT5 integration
        const fxSwapTableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'fx_swap_orders'
            )
        `);
        
        if (fxSwapTableExists.rows[0].exists) {
            // Check and add ALT5 related columns if they don't exist
            const columns = await pool.query(`
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = 'fx_swap_orders'
            `);
            
            const columnNames = columns.rows.map(col => col.column_name);
            
            if (!columnNames.includes('alt5_account_id')) {
                await pool.query('ALTER TABLE fx_swap_orders ADD COLUMN alt5_account_id VARCHAR(255)');
                console.log('✅ alt5_account_id column added to fx_swap_orders');
            }
            
            if (!columnNames.includes('alt5_order_id')) {
                await pool.query('ALTER TABLE fx_swap_orders ADD COLUMN alt5_order_id VARCHAR(255)');
                console.log('✅ alt5_order_id column added to fx_swap_orders');
            }
            
            if (!columnNames.includes('deposit_status')) {
                await pool.query('ALTER TABLE fx_swap_orders ADD COLUMN deposit_status VARCHAR(50) DEFAULT \'pending\'');
                console.log('✅ deposit_status column added to fx_swap_orders');
            }
        } else {
            // Create fx_swap_orders table if it doesn't exist
            await pool.query(`
                CREATE TABLE fx_swap_orders (
                    id VARCHAR(36) PRIMARY KEY,
                    user_id VARCHAR(36) NOT NULL,
                    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
                    client_order_id VARCHAR(255) NOT NULL UNIQUE,
                    fiat_currency VARCHAR(10) NOT NULL,
                    fiat_amount DECIMAL(18, 2) NOT NULL,
                    target_token VARCHAR(20) NOT NULL,
                    target_token_amount DECIMAL(30, 18),
                    destination_wallet VARCHAR(42) NOT NULL,
                    fx_rate DECIMAL(18, 8) NOT NULL,
                    fx_rate_source VARCHAR(50) NOT NULL,
                    fx_rate_timestamp TIMESTAMP NOT NULL,
                    platform_fee_percent DECIMAL(5, 4) NOT NULL,
                    platform_fee_amount DECIMAL(18, 8),
                    network_fee_amount DECIMAL(30, 18),
                    total_fees_usd DECIMAL(18, 2),
                    zero_x_quote_id VARCHAR(255),
                    zero_x_swap_data JSONB,
                    executed_price DECIMAL(30, 18),
                    slippage_percent DECIMAL(5, 4),
                    swap_tx_hash VARCHAR(66),
                    transfer_tx_hash VARCHAR(66),
                    status VARCHAR(30) NOT NULL DEFAULT 'pending',
                    error_message TEXT,
                    error_code VARCHAR(50),
                    retry_count INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
                    stripe_confirmed_at TIMESTAMP,
                    fx_rate_locked_at TIMESTAMP,
                    swap_started_at TIMESTAMP,
                    swap_completed_at TIMESTAMP,
                    transfer_started_at TIMESTAMP,
                    completed_at TIMESTAMP,
                    failed_at TIMESTAMP,
                    ip_address VARCHAR(45),
                    user_agent TEXT,
                    alt5_account_id VARCHAR(255),
                    alt5_order_id VARCHAR(255),
                    deposit_status VARCHAR(50) DEFAULT 'pending'
                )
            `);
            
            await pool.query('CREATE INDEX idx_fx_swap_user ON fx_swap_orders(user_id)');
            await pool.query('CREATE INDEX idx_fx_swap_stripe_payment ON fx_swap_orders(stripe_payment_intent_id)');
            await pool.query('CREATE INDEX idx_fx_swap_status ON fx_swap_orders(status)');
            await pool.query('CREATE INDEX idx_fx_swap_created ON fx_swap_orders(created_at)');
            
            console.log('✅ fx_swap_orders table created successfully');
        }

        console.log('✅ All database migrations completed successfully!');
    } catch (error) {
        console.error('❌ Error during migrations:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

runMigrations().catch(console.error);


