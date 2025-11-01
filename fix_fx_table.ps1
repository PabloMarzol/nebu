# Fix FX Rate Snapshots Table - PowerShell Script
# Run this in your NebulaX project directory

Write-Host "🔧 Fixing fx_rate_snapshots table..." -ForegroundColor Cyan

# Create the Node.js fix script
$fixScript = @"
const { Pool } = require('pg');
require('dotenv').config();

async function fixFxRateSnapshotsTable() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: false
    });

    try {
        console.log('🔧 Fixing fx_rate_snapshots table...');
        
        // Check if table exists first
        const tableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'fx_rate_snapshots'
            )
        `);
        
        console.log('Table exists:', tableExists.rows[0].exists);
        
        // Drop and recreate the table to ensure correct structure
        await pool.query('DROP TABLE IF EXISTS fx_rate_snapshots CASCADE');
        console.log('✅ Dropped existing table');
        
        // Create the table with correct structure
        await pool.query(`
            CREATE TABLE fx_rate_snapshots (
                id SERIAL PRIMARY KEY,
                
                -- Rate details
                from_currency VARCHAR(10) NOT NULL,
                to_currency VARCHAR(10) NOT NULL,
                rate DECIMAL(18, 8) NOT NULL,
                
                -- Source details
                source VARCHAR(50) NOT NULL,
                source_metadata JSONB,
                
                -- Quality metrics
                confidence_score DECIMAL(5, 4),
                spread_percent DECIMAL(5, 4),
                
                -- Timing - THIS IS THE MISSING COLUMN
                timestamp TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() NOT NULL
            )
        `);
        console.log('✅ Created fx_rate_snapshots table with correct structure');
        
        // Create indexes
        await pool.query('CREATE INDEX idx_fx_rate_pair ON fx_rate_snapshots(from_currency, to_currency)');
        await pool.query('CREATE INDEX idx_fx_rate_timestamp ON fx_rate_snapshots(timestamp)');
        console.log('✅ Created indexes');
        
        // Verify the table structure
        const columns = await pool.query(`
            SELECT 
                column_name, 
                data_type, 
                is_nullable,
                column_default
            FROM information_schema.columns 
            WHERE table_name = 'fx_rate_snapshots' 
            ORDER BY ordinal_position
        `);
        
        console.log('\n📋 Table structure:');
        columns.rows.forEach(col => {
            console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
        });
        
        // Test insert to verify structure works
        await pool.query(`
            INSERT INTO fx_rate_snapshots (
                from_currency, 
                to_currency, 
                rate, 
                source, 
                source_metadata, 
                confidence_score, 
                spread_percent, 
                timestamp
            ) VALUES (
                'GBP', 
                'USD', 
                1.2845, 
                'test_fix', 
                '{"test": true}', 
                0.9500, 
                0.0025, 
                NOW()
            )
        `);
        console.log('✅ Test insert successful');
        
        // Clean up test record
        await pool.query("DELETE FROM fx_rate_snapshots WHERE source = 'test_fix'");
        console.log('✅ Cleaned up test data');
        
        console.log('\n🎉 fx_rate_snapshots table fixed successfully!');
        
    } catch (error) {
        console.error('❌ Error fixing table:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run the fix
fixFxRateSnapshotsTable()
    .then(() => {
        console.log('\n✅ Database fix completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Database fix failed:', error);
        process.exit(1);
    });
"@

# Write the script to a temporary file
$fixScript | Out-File -FilePath "temp_fix_db.js" -Encoding utf8

Write-Host "Running database fix..." -ForegroundColor Yellow

try {
    # Run the fix script
    node temp_fix_db.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database table fixed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Database fix failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error running database fix: $_" -ForegroundColor Red
    exit 1
} finally {
    # Clean up temporary file
    Remove-Item "temp_fix_db.js" -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Try running the FX swap quote API again" -ForegroundColor White
Write-Host "2. Test with: POST /api/fx-swap/quote" -ForegroundColor White
Write-Host "3. Body: { \"gbpAmount\": 100, \"targetToken\": \"USDT\" }" -ForegroundColor White
Write-Host ""