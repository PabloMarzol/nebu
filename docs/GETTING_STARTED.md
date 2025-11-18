# Getting Started - New Crypto Trading Platform

This guide will help you set up the development environment and start building the new cryptocurrency trading platform.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20.x LTS** - [Download](https://nodejs.org/)
- **PNPM 8.x+** - `npm install -g pnpm`
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/) or use Neon/Supabase
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)

---

## Project Initialization

### Step 1: Create Project Structure

```bash
# Create root directory
mkdir crypto-platform && cd crypto-platform

# Initialize PNPM workspace
pnpm init

# Create workspace structure
mkdir -p apps/web backend shared/schema packages/{ui,config,types,utils} docs scripts
```

### Step 2: Set Up Workspace Configuration

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'backend'
```

Create root `package.json`:

```json
{
  "name": "crypto-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter web dev",
    "dev:backend": "pnpm --filter backend dev",
    "dev:all": "pnpm --parallel dev",
    "build": "pnpm --filter web build",
    "build:backend": "pnpm --filter backend build",
    "lint": "pnpm --recursive lint",
    "test": "pnpm --recursive test",
    "type-check": "pnpm --recursive type-check"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.6.3",
    "prettier": "^3.1.0",
    "eslint": "^8.55.0"
  }
}
```

---

## Frontend Setup (apps/web)

### Step 1: Initialize Vite + React + TypeScript

```bash
cd apps/web
pnpm create vite@latest . --template react-ts
```

### Step 2: Install Dependencies

```bash
# Core dependencies
pnpm add react@^18.3.1 react-dom@^18.3.1

# Routing
pnpm add wouter

# State management
pnpm add @tanstack/react-query@^5.60.5

# Forms
pnpm add react-hook-form @hookform/resolvers zod

# Web3
pnpm add viem@^2.38.0 wagmi@^2.19.2 @wagmi/core

# UI Components
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs
pnpm add @radix-ui/react-select @radix-ui/react-toast

# Styling
pnpm add tailwindcss@^3.4.17 postcss autoprefixer
pnpm add clsx tailwind-merge

# Animation
pnpm add framer-motion@^11.18.2

# Charts
pnpm add lightweight-charts@^4.0.0

# HTTP Client
pnpm add axios

# Real-time
pnpm add socket.io-client

# Dev dependencies
pnpm add -D @types/react @types/react-dom
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D eslint-plugin-react-hooks eslint-plugin-react-refresh
pnpm add -D vite-tsconfig-paths
```

### Step 3: Configure Tailwind

```bash
pnpm dlx tailwindcss init -p
```

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
        border: 'hsl(var(--border))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Step 4: Create Base Structure

```bash
cd src

# Create feature directories
mkdir -p features/{auth,trading,swap,ai,portfolio,theme}/{components,hooks,services}

# Create shared directories
mkdir -p components/{ui,layout,common}
mkdir -p lib/{api,web3}
mkdir -p hooks contexts types styles config
```

### Step 5: Set Up Environment Variables

Create `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_ZERO_X_API_KEY=your_0x_api_key
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_id
```

Create `src/config/env.ts`:

```typescript
export const env = {
  apiUrl: import.meta.env.VITE_API_URL,
  zeroXApiKey: import.meta.env.VITE_ZERO_X_API_KEY,
  walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
};
```

---

## Backend Setup

### Step 1: Initialize Backend Project

```bash
cd ../../backend
pnpm init
```

Create `package.json`:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "drizzle-kit push:pg",
    "migrate:generate": "drizzle-kit generate:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

### Step 2: Install Dependencies

```bash
# Framework
pnpm add express

# Database
pnpm add drizzle-orm@^0.39.1 postgres
pnpm add drizzle-kit -D

# Validation
pnpm add zod

# Authentication
pnpm add jsonwebtoken bcrypt

# Web3
pnpm add viem

# Security
pnpm add helmet cors express-rate-limit

# Session
pnpm add express-session connect-pg-simple

# Real-time
pnpm add socket.io

# Utilities
pnpm add dotenv

# External APIs
pnpm add axios
pnpm add stripe
pnpm add groq-sdk

# Dev dependencies
pnpm add -D typescript tsx
pnpm add -D @types/express @types/node
pnpm add -D @types/jsonwebtoken @types/bcrypt
pnpm add -D @types/express-session
```

### Step 3: TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 4: Create Backend Structure

```bash
mkdir -p src/{config,middleware,routes,controllers,services/{auth,trading,swap,ai,portfolio,blockchain,notification},lib/{integrations,utils,websocket},jobs,types}
mkdir -p migrations tests/{unit,integration}
```

### Step 5: Environment Variables

Create `.env`:

```env
# Application
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/crypto_platform

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long

# External APIs
ZERO_X_API_KEY=your_0x_api_key
ONRAMP_API_KEY=your_onramp_api_key
GROQ_API_KEY=your_groq_api_key
COINBASE_API_KEY=your_coinbase_api_key

# Services
STRIPE_SECRET_KEY=your_stripe_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SENDGRID_API_KEY=your_sendgrid_key
```

Create `src/config/env.ts`:

```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  ZERO_X_API_KEY: z.string(),
  ONRAMP_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
```

---

## Database Setup

### Step 1: Set Up PostgreSQL

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL
# macOS: brew install postgresql@15
# Ubuntu: sudo apt-get install postgresql-15

# Start PostgreSQL
# macOS: brew services start postgresql@15
# Ubuntu: sudo systemctl start postgresql

# Create database
createdb crypto_platform
```

**Option B: Neon Database (Recommended)**

1. Go to [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in `.env`

### Step 2: Create Schema Files

Create `shared/schema/core.schema.ts`:

```typescript
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique(),
  walletAddress: varchar('wallet_address', { length: 255 }).unique(),
  username: varchar('username', { length: 100 }).unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### Step 3: Configure Drizzle

Create `drizzle.config.ts` in backend:

```typescript
import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
  schema: '../shared/schema/*.schema.ts',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Step 4: Run Migrations

```bash
cd backend

# Generate migration
pnpm migrate:generate

# Push to database
pnpm migrate

# Open Drizzle Studio to inspect database
pnpm db:studio
```

---

## Running the Project

### Option 1: Run Services Individually

```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

### Option 2: Run All Services (Recommended)

```bash
# From root directory
pnpm dev:all
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## Development Workflow

### 1. Create a New Feature

```bash
# Example: Creating swap feature
cd apps/web/src/features

# Create feature directory
mkdir -p swap/{components,hooks,services}

# Create files
touch swap/components/SwapInterface.tsx
touch swap/hooks/useSwapQuote.ts
touch swap/services/swapService.ts
touch swap/types.ts
touch swap/index.ts
```

### 2. Add Database Table

```bash
# Create schema file
cd shared/schema
touch swap.schema.ts
```

Add table definition:

```typescript
export const swapOrders = pgTable('swap_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  // ... other fields
});
```

Generate and run migration:

```bash
cd backend
pnpm migrate:generate
pnpm migrate
```

### 3. Create API Endpoint

```bash
# Create route file
cd backend/src/routes
touch swap.routes.ts

# Create service
cd ../services/swap
touch SwapService.ts
```

### 4. Test Your Changes

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Type check
pnpm type-check

# Lint
pnpm lint
```

---

## Useful Commands

### PNPM Workspace Commands

```bash
# Install dependency for specific package
pnpm --filter web add axios

# Run script in specific package
pnpm --filter backend dev

# Run script in all packages
pnpm --recursive build

# Run scripts in parallel
pnpm --parallel dev
```

### Database Commands

```bash
# Generate migration
pnpm --filter backend migrate:generate

# Apply migration
pnpm --filter backend migrate

# Open Drizzle Studio
pnpm --filter backend db:studio
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/swap-integration

# Commit changes
git add .
git commit -m "feat: implement crypto swap with 0x protocol"

# Push to remote
git push origin feature/swap-integration
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL
```

### PNPM Issues

```bash
# Clear PNPM store
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Path Aliases Not Working

Ensure `vite-tsconfig-paths` is installed and configured:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
```

---

## Next Steps

1. ✅ **Set up development environment** (this guide)
2. 📖 **Read Architecture Decisions** (`docs/ARCHITECTURE_DECISIONS.md`)
3. 📋 **Review Project Structure** (`NEW_PROJECT_STRUCTURE.md`)
4. 🚀 **Start with Phase 1** - Foundation implementation
5. 🧪 **Write tests** as you build features
6. 📚 **Document** your code and decisions

---

## Resources

### Documentation
- [React Query Docs](https://tanstack.com/query/latest)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Viem Docs](https://viem.sh/)
- [Wagmi Docs](https://wagmi.sh/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

### API References
- [0x Protocol API](https://0x.org/docs/api)
- [OnRamp Money API](https://docs.onramp.money/)
- [Groq API](https://console.groq.com/docs)

### Tools
- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview)
- [React Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools)

---

**Need Help?**
- Check existing issues in the repository
- Review the codebase documentation
- Ask in team chat/slack

Happy coding! 🚀
