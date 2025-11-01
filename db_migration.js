import pkg from "pg";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; 

async function fixFxRateTable() {
    const pool = new Pool({ 
        connectionString: process.env.DATABASE_URL, 
        ssl: false 
    });
    
    try {
        // Just fix the fx_rate_snapshots table
        await pool.query('DROP TABLE IF EXISTS fx_rate_snapshots CASCADE');
        
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
        
        console.log('✅ fx_rate_snapshots table fixed successfully');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

fixFxRateTable();

