import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Production database configuration for Render
const getDatabaseConfig = () => {
  // Check if we're in production (Render environment)
  const isProduction = process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL;

  console.log('[Database] Environment:', process.env.NODE_ENV);
  console.log('[Database] DATABASE_URL present:', !!databaseUrl);
  
  if (!databaseUrl) {
    console.error('[Database] ❌ DATABASE_URL is not set!');
    console.error('[Database] Please set DATABASE_URL in your Render environment variables');
    throw new Error('DATABASE_URL must be set for database connection');
  }

  // For Render production, we need to handle SSL properly
  const config = {
    connectionString: databaseUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  };

  console.log('[Database] Configuration created successfully');
  console.log('[Database] SSL enabled:', !!config.ssl);
  console.log('[Database] Max connections:', config.max);
  
  return config;
};

try {
  const dbConfig = getDatabaseConfig();
  console.log('[Database] Creating connection pool...');
  
  export const pool = new Pool(dbConfig);
  
  // Test connection immediately
  pool.on('connect', () => {
    console.log('[Database] ✅ New client connected');
  });
  
  pool.on('error', (err) => {
    console.error('[Database] ❌ Unexpected error on idle client', err);
  });
  
  pool.on('remove', () => {
    console.log('[Database] Client removed');
  });

  export const db = drizzle({ client: pool, schema });
  
  console.log('[Database] ✅ Database connection established successfully');
  
} catch (error) {
  console.error('[Database] ❌ Failed to initialize database:', error.message);
  console.error('[Database] Please ensure DATABASE_URL is properly configured in your environment');
  
  // In production, we should fail fast
  if (process.env.NODE_ENV === 'production') {
    console.error('[Database] Cannot start without database connection in production');
    process.exit(1);
  }
  
  // For development, create a mock connection
  console.warn('[Database] Creating mock database for development');
  export const pool = {
    query: async () => ({ rows: [] }),
    on: () => {},
    end: async () => {},
  };
  
  export const db = {
    select: () => ({ from: () => ({ where: () => ({ execute: async () => [] }) }) }),
    insert: () => ({ values: () => ({ execute: async () => ({}) }) }),
    update: () => ({ set: () => ({ where: () => ({ execute: async () => ({}) }) }) }),
    delete: () => ({ where: () => ({ execute: async () => ({}) }) }),
  };
}
