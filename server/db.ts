import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Enhanced database configuration for production deployment
const getDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  
  console.log('[Database] Initializing database connection...');
  console.log('[Database] Environment:', process.env.NODE_ENV);
  console.log('[Database] DATABASE_URL present:', !!databaseUrl);
  
  if (!databaseUrl) {
    console.error('[Database] ❌ DATABASE_URL is not set!');
    console.error('[Database] Please ensure DATABASE_URL is configured in your environment variables');
    
    // In production, we must fail fast
    if (isProduction) {
      throw new Error('DATABASE_URL must be set for database connection in production');
    }
    
    // For development, show warning but continue
    console.warn('[Database] ⚠️  DATABASE_URL not found - using fallback configuration');
    return null;
  }

  // Parse database URL to extract connection details
  try {
    const config = {
      connectionString: databaseUrl,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
    };

    console.log('[Database] Configuration created successfully');
    console.log('[Database] SSL enabled:', !!config.ssl);
    console.log('[Database] Max connections:', config.max);
    
    return config;
  } catch (error) {
    console.error('[Database] ❌ Error parsing DATABASE_URL:', error.message);
    throw new Error('Invalid DATABASE_URL format');
  }
};

// Initialize database connection
let pool;
let db;

try {
  const dbConfig = getDatabaseConfig();
  
  if (dbConfig) {
    console.log('[Database] Creating connection pool...');
    pool = new Pool(dbConfig);
    
    // Add connection event handlers
    pool.on('connect', () => {
      console.log('[Database] ✅ New client connected');
    });
    
    pool.on('error', (err) => {
      console.error('[Database] ❌ Unexpected error on idle client', err);
    });
    
    pool.on('remove', () => {
      console.log('[Database] Client removed');
    });

    db = drizzle({ client: pool, schema });
    console.log('[Database] ✅ Database connection established successfully');
  } else {
    // Fallback for development without database
    console.warn('[Database] ⚠️  Creating mock database connection for development');
    pool = {
      query: async () => ({ rows: [] }),
      on: () => {},
      end: async () => {},
    };
    
    db = {
      select: () => ({ from: () => ({ where: () => ({ execute: async () => [] }) }) }),
      insert: () => ({ values: () => ({ execute: async () => ({}) }) }),
      update: () => ({ set: () => ({ where: () => ({ execute: async () => ({}) }) }) }),
      delete: () => ({ where: () => ({ execute: async () => ({}) }) }),
    };
  }
  
} catch (error) {
  console.error('[Database] ❌ Failed to initialize database:', error.message);
  
  // In production, we should fail fast
  if (process.env.NODE_ENV === 'production') {
    console.error('[Database] Cannot start without database connection in production');
    process.exit(1);
  }
  
  // For development, create a mock connection
  console.warn('[Database] ⚠️  Creating mock database for development');
  pool = {
    query: async () => ({ rows: [] }),
    on: () => {},
    end: async () => {},
  };
  
  db = {
    select: () => ({ from: () => ({ where: () => ({ execute: async () => [] }) }) }),
    insert: () => ({ values: () => ({ execute: async () => ({}) }) }),
    update: () => ({ set: () => ({ where: () => ({ execute: async () => ({}) }) }) }),
    delete: () => ({ where: () => ({ execute: async () => ({}) }) }),
  };
}

export { pool, db };
