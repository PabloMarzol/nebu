import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function checkTableExists() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Check if alt5_accounts table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'alt5_accounts'
      );
    `);
    
    console.log('alt5_accounts table exists:', result.rows[0].exists);
    
    if (result.rows[0].exists) {
      // Check the table structure
      const tableInfo = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'alt5_accounts'
        ORDER BY ordinal_position;
      `);
      
      console.log('\nTable structure:');
      tableInfo.rows.forEach(col => {
        console.log(`${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
      });
    }
    
    await client.end();
  } catch (err) {
    console.error('Error:', err);
    await client.end();
  }
}

checkTableExists();
