import { Client } from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    const sql = readFileSync('./migrations/004_add_onramp_money_orders_table.sql', 'utf8');
    
    await client.query(sql);
    console.log('Migration executed successfully');
    
    await client.end();
  } catch (err) {
    console.error('Error:', err);
    await client.end();
  }
}

runMigration();
