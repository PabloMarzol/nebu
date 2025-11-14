import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });

  try {
    console.log('[Migration] Connecting to database...');

    // Read migration file
    const migrationPath = join(__dirname, 'migrations', '004_add_onramp_money_orders_table.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('[Migration] Running OnRamp Money migration...');

    // Execute migration
    await pool.query(migrationSQL);

    console.log('[Migration] ✅ Migration completed successfully!');

    // Verify table was created
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'onramp_money_orders'
    `);

    if (result.rows.length > 0) {
      console.log('[Migration] ✅ Table "onramp_money_orders" verified');
    } else {
      console.log('[Migration] ⚠️  Warning: Table not found after migration');
    }

  } catch (error) {
    console.error('[Migration] ❌ Error running migration:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('[Migration] Database connection closed');
  }
}

runMigration();
