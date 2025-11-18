# Cryptocurrency Trading Platform - Foundation Structure

**Version:** 1.0
**Date:** 2025-11-18
**Based on:** NebulaX Analysis + Foundational Plan

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Architecture](#core-architecture)
5. [Feature Implementation Guide](#feature-implementation-guide)
6. [Database Schema Design](#database-schema-design)
7. [Security Implementation](#security-implementation)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Strategy](#deployment-strategy)
10. [Development Roadmap](#development-roadmap)

---

## Executive Summary

This document establishes the foundational architecture for a new cryptocurrency trading platform built from the ground up. Drawing from the proven patterns of NebulaX and incorporating modern best practices, this structure provides a scalable, secure, and maintainable foundation.

**Core Objectives:**
- **Modularity:** Feature-based architecture with clear separation of concerns
- **Scalability:** Support for high-frequency trading and real-time data
- **Security:** Multi-layered security with compliance built-in
- **Performance:** Optimized for sub-second trade execution
- **Maintainability:** Clear code organization and documentation

---

## Technology Stack

### Frontend Stack

```typescript
{
  "framework": "React 18.3+",
  "language": "TypeScript 5.6+",
  "build-tool": "Vite 5.4+",
  "styling": "Tailwind CSS 3.4+",
  "routing": "Wouter 3.3+ (lightweight) or React Router 6.x",
  "state-management": {
    "server-state": "@tanstack/react-query 5.x",
    "local-state": "React Context + useState/useReducer",
    "persistence": "localStorage / IndexedDB"
  },
  "animation": "Framer Motion 11.x",
  "charts": "TradingView Lightweight Charts 4.x",
  "web3": {
    "core": "viem 2.x + wagmi 2.x",
    "wallet-connect": "RainbowKit or ConnectKit"
  },
  "forms": "React Hook Form + Zod validation",
  "ui-components": "shadcn/ui (Radix UI primitives)"
}
```

### Backend Stack

```typescript
{
  "runtime": "Node.js 20.x LTS",
  "language": "TypeScript 5.6+",
  "framework": "Express.js 4.x",
  "database": {
    "primary": "PostgreSQL 15+ (via Neon/Supabase)",
    "orm": "Drizzle ORM 0.39+",
    "migrations": "Drizzle Kit"
  },
  "real-time": "Socket.io 4.x",
  "validation": "Zod 3.x",
  "authentication": {
    "wallet": "viem + EIP-191 signing",
    "2fa": "Speakeasy (TOTP)",
    "sessions": "express-session + connect-pg-simple"
  },
  "security": {
    "helmet": "Security headers",
    "rate-limiting": "express-rate-limit",
    "cors": "cors middleware"
  },
  "monitoring": {
    "logging": "Winston or Pino",
    "apm": "New Relic or Datadog"
  }
}
```

### External Integrations

| Service | Purpose | Priority |
|---------|---------|----------|
| **0x Protocol v2** | DEX aggregation for crypto swaps | High |
| **OnRamp Money** | Fiat-to-crypto onboarding | High |
| **Stripe** | Payment processing | High |
| **Hyperliquid** | Perpetual futures trading | Medium |
| **Groq API** | AI trading assistance (LLaMA models) | Medium |
| **CoinGecko/CoinMarketCap** | Market data & pricing | High |
| **Coinbase WebSocket** | Real-time price feeds | High |
| **Twilio** | SMS notifications | Low |
| **SendGrid** | Email notifications | Low |

---

## Project Structure

### Monorepo Organization

```
crypto-platform/
├── apps/
│   ├── web/                          # Main web application
│   ├── admin/                        # Admin dashboard (optional)
│   └── mobile/                       # React Native app (future)
├── packages/
│   ├── ui/                           # Shared UI components
│   ├── config/                       # Shared config (eslint, tsconfig)
│   ├── types/                        # Shared TypeScript types
│   └── utils/                        # Shared utilities
├── backend/
│   ├── src/
│   │   ├── server.ts                 # Express server entry
│   │   ├── routes/                   # API routes
│   │   ├── services/                 # Business logic
│   │   ├── middleware/               # Express middleware
│   │   ├── lib/                      # Helper utilities
│   │   └── jobs/                     # Background jobs (Bull/BullMQ)
│   ├── migrations/                   # Database migrations
│   └── tests/                        # Backend tests
├── shared/
│   ├── schema/                       # Database schemas (Drizzle)
│   │   ├── core.schema.ts            # Users, auth, wallets
│   │   ├── trading.schema.ts         # Orders, trades, positions
│   │   ├── swap.schema.ts            # Swap orders
│   │   ├── ai.schema.ts              # AI signals & analysis
│   │   ├── compliance.schema.ts      # KYC, AML, SAR
│   │   └── index.ts                  # Export all schemas
│   └── types/                        # Shared types
├── docs/                             # Documentation
│   ├── architecture/                 # Architecture decisions
│   ├── api/                          # API documentation
│   └── guides/                       # Developer guides
├── scripts/                          # Build & deployment scripts
├── .github/                          # GitHub Actions workflows
├── docker-compose.yml                # Local development setup
├── turbo.json                        # Turborepo config (optional)
├── package.json                      # Root package.json
└── pnpm-workspace.yaml               # PNPM workspace config
```

### Frontend Structure (apps/web)

```
apps/web/
├── src/
│   ├── main.tsx                      # Application entry
│   ├── App.tsx                       # Root component with routing
│   ├── routes.tsx                    # Centralized route definitions
│   │
│   ├── features/                     # Feature-based modules
│   │   ├── auth/                     # Authentication feature
│   │   │   ├── components/           # Auth-specific components
│   │   │   ├── hooks/                # useAuth, useWalletAuth
│   │   │   ├── services/             # auth API calls
│   │   │   ├── types.ts              # Auth types
│   │   │   └── index.ts              # Public exports
│   │   │
│   │   ├── trading/                  # Trading feature
│   │   │   ├── components/
│   │   │   │   ├── TradingPanel.tsx
│   │   │   │   ├── TradingChart.tsx
│   │   │   │   ├── OrderBook.tsx
│   │   │   │   ├── PositionTable.tsx
│   │   │   │   └── OrderHistory.tsx
│   │   │   ├── layouts/
│   │   │   │   ├── SpotTradingLayout.tsx
│   │   │   │   └── FuturesTradingLayout.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useMarketData.ts
│   │   │   │   ├── usePlaceOrder.ts
│   │   │   │   └── useOrderBook.ts
│   │   │   ├── services/
│   │   │   │   └── tradingService.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── swap/                     # Swap feature
│   │   │   ├── components/
│   │   │   │   ├── SwapInterface.tsx
│   │   │   │   ├── CryptoSwap.tsx
│   │   │   │   ├── OnRampWidget.tsx
│   │   │   │   └── SwapSuccessModal.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSwapQuote.ts
│   │   │   │   ├── useExecuteSwap.ts
│   │   │   │   └── useTokenList.ts
│   │   │   ├── services/
│   │   │   │   ├── zeroXService.ts
│   │   │   │   └── onRampService.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── ai/                       # AI Assistant feature
│   │   │   ├── components/
│   │   │   │   ├── AIAssistant.tsx
│   │   │   │   ├── SignalCard.tsx
│   │   │   │   └── MarketAnalysis.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAIChat.ts
│   │   │   │   └── useTradingSignals.ts
│   │   │   ├── services/
│   │   │   │   └── aiService.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── portfolio/                # Portfolio management
│   │   │   ├── components/
│   │   │   │   ├── PortfolioOverview.tsx
│   │   │   │   ├── AssetAllocation.tsx
│   │   │   │   └── PerformanceChart.tsx
│   │   │   ├── hooks/
│   │   │   │   └── usePortfolio.ts
│   │   │   └── index.ts
│   │   │
│   │   └── theme/                    # Theme system
│   │       ├── components/
│   │       │   └── ThemeSwitcher.tsx
│   │       ├── hooks/
│   │       │   └── useTheme.ts
│   │       ├── themes.ts             # Theme definitions
│   │       └── index.ts
│   │
│   ├── components/                   # Shared components
│   │   ├── ui/                       # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── Toast.tsx
│   │
│   ├── lib/                          # Core libraries
│   │   ├── api/                      # API client
│   │   │   ├── client.ts             # Axios instance
│   │   │   └── queryClient.ts        # React Query client
│   │   ├── web3/                     # Web3 utilities
│   │   │   ├── config.ts             # Wagmi config
│   │   │   └── utils.ts
│   │   └── utils.ts                  # General utilities
│   │
│   ├── hooks/                        # Global hooks
│   │   ├── useWebSocket.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   │
│   ├── contexts/                     # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── LiveDataContext.tsx
│   │
│   ├── types/                        # TypeScript types
│   │   ├── api.types.ts
│   │   └── app.types.ts
│   │
│   ├── styles/                       # Global styles
│   │   ├── globals.css
│   │   └── themes.css
│   │
│   └── config/                       # App configuration
│       ├── constants.ts
│       └── env.ts                    # Environment variables
│
├── public/                           # Static assets
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── tests/                            # E2E tests
│   ├── e2e/
│   └── integration/
│
├── index.html                        # HTML template
├── vite.config.ts                    # Vite configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json
```

### Backend Structure

```
backend/
├── src/
│   ├── server.ts                     # Express app initialization
│   │
│   ├── config/                       # Configuration
│   │   ├── database.ts               # DB connection
│   │   ├── env.ts                    # Environment variables
│   │   └── constants.ts
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.middleware.ts        # Authentication
│   │   ├── validation.middleware.ts  # Request validation
│   │   ├── error.middleware.ts       # Error handling
│   │   ├── logging.middleware.ts     # Request logging
│   │   └── rateLimit.middleware.ts   # Rate limiting
│   │
│   ├── routes/                       # API routes
│   │   ├── index.ts                  # Route aggregator
│   │   ├── auth.routes.ts
│   │   ├── trading.routes.ts
│   │   ├── swap.routes.ts
│   │   ├── ai.routes.ts
│   │   ├── portfolio.routes.ts
│   │   ├── market.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── controllers/                  # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── trading.controller.ts
│   │   ├── swap.controller.ts
│   │   └── ai.controller.ts
│   │
│   ├── services/                     # Business logic
│   │   ├── auth/
│   │   │   ├── WalletAuthService.ts
│   │   │   ├── TwoFactorService.ts
│   │   │   └── SessionService.ts
│   │   │
│   │   ├── trading/
│   │   │   ├── OrderExecutionService.ts
│   │   │   ├── PositionManagementService.ts
│   │   │   ├── MarketDataService.ts
│   │   │   └── TradingEngineService.ts
│   │   │
│   │   ├── swap/
│   │   │   ├── ZeroXService.ts
│   │   │   ├── OnRampService.ts
│   │   │   └── SwapExecutionService.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── AITradingService.ts
│   │   │   ├── SignalGenerationService.ts
│   │   │   └── MarketAnalysisService.ts
│   │   │
│   │   ├── portfolio/
│   │   │   ├── PortfolioService.ts
│   │   │   └── BalanceService.ts
│   │   │
│   │   ├── blockchain/
│   │   │   ├── BlockchainService.ts
│   │   │   └── WalletService.ts
│   │   │
│   │   └── notification/
│   │       ├── EmailService.ts
│   │       └── SMSService.ts
│   │
│   ├── lib/                          # Helper libraries
│   │   ├── integrations/
│   │   │   ├── zeroX.ts
│   │   │   ├── onRamp.ts
│   │   │   ├── hyperliquid.ts
│   │   │   └── groq.ts
│   │   ├── utils/
│   │   │   ├── crypto.ts
│   │   │   ├── validation.ts
│   │   │   └── formatting.ts
│   │   └── websocket/
│   │       ├── server.ts
│   │       └── handlers.ts
│   │
│   ├── jobs/                         # Background jobs
│   │   ├── marketData.job.ts
│   │   ├── portfolio.job.ts
│   │   └── compliance.job.ts
│   │
│   └── types/                        # TypeScript types
│       ├── express.d.ts              # Express type extensions
│       └── services.types.ts
│
├── migrations/                       # Database migrations
│   └── 0001_initial_schema.sql
│
├── tests/                            # Backend tests
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── tsconfig.json
└── package.json
```

---

## Core Architecture

### 1. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   UI Layer   │───▶│  Hook Layer  │───▶│Service Layer │  │
│  │ (Components) │    │ (React Query)│    │ (API Calls)  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         ▼                    ▼                    ▼          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React Context (Global State)               │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                   ┌────────┴────────┐
                   │   HTTP/WS       │
                   └────────┬────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                         Backend                              │
├─────────────────────────────────────────────────────────────┤
│                           │                                  │
│  ┌──────────────┐    ┌────────────┐    ┌──────────────┐    │
│  │   Routes     │───▶│Controllers │───▶│  Services    │    │
│  │ (Endpoints)  │    │ (Handler)  │    │(Business     │    │
│  └──────────────┘    └────────────┘    │ Logic)       │    │
│                                         └──────┬───────┘    │
│                                                │             │
│  ┌──────────────────────────────────────────────┼──────┐   │
│  │                 Database Layer                │      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────▼───┐  │   │
│  │  │PostgreSQL  │◀─│Drizzle ORM │◀─│ Repositories │  │   │
│  │  └────────────┘  └────────────┘  └──────────────┘  │   │
│  └───────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 2. State Management Strategy

#### Server State (React Query)

```typescript
// apps/web/src/lib/api/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,              // 5 seconds
      cacheTime: 10 * 60 * 1000,    // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Usage in components
const { data, isLoading } = useQuery({
  queryKey: ['market-data', symbol],
  queryFn: () => fetchMarketData(symbol),
  refetchInterval: 5000, // Refresh every 5 seconds
});
```

#### Local State (React Context)

```typescript
// apps/web/src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  walletAddress: string | null;
  isAuthenticated: boolean;
  login: (walletAddress: string, signature: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // ... implementation

  return (
    <AuthContext.Provider value={{ user, walletAddress, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### Real-time State (WebSocket Context)

```typescript
// apps/web/src/contexts/LiveDataContext.tsx
interface LiveDataContextType {
  prices: Record<string, number>;
  orderBooks: Record<string, OrderBook>;
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
}

export const LiveDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(WS_URL);

    socketRef.current.on('price-update', (data: { symbol: string; price: number }) => {
      setPrices(prev => ({ ...prev, [data.symbol]: data.price }));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ... implementation
};
```

### 3. API Service Layer Pattern

```typescript
// apps/web/src/features/trading/services/tradingService.ts
import { apiClient } from '@/lib/api/client';
import type { Order, PlaceOrderRequest } from '../types';

export const tradingService = {
  /**
   * Place a new order
   */
  placeOrder: async (orderData: PlaceOrderRequest): Promise<Order> => {
    const { data } = await apiClient.post<Order>('/api/trading/orders', orderData);
    return data;
  },

  /**
   * Get user's open orders
   */
  getOpenOrders: async (): Promise<Order[]> => {
    const { data } = await apiClient.get<Order[]>('/api/trading/orders/open');
    return data;
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (orderId: string): Promise<void> => {
    await apiClient.delete(`/api/trading/orders/${orderId}`);
  },
};

// Usage in hooks
// apps/web/src/features/trading/hooks/usePlaceOrder.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tradingService } from '../services/tradingService';

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tradingService.placeOrder,
    onSuccess: () => {
      // Invalidate orders cache to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
```

### 4. Backend Service Layer Pattern

```typescript
// backend/src/services/trading/OrderExecutionService.ts
import { db } from '@/config/database';
import { orders, trades } from '@shared/schema';
import type { Order, PlaceOrderRequest } from '@shared/types';

export class OrderExecutionService {
  /**
   * Place a new order
   */
  async placeOrder(userId: string, orderData: PlaceOrderRequest): Promise<Order> {
    // Validate user balance
    await this.validateBalance(userId, orderData);

    // Create order in database
    const [order] = await db.insert(orders).values({
      userId,
      symbol: orderData.symbol,
      side: orderData.side,
      type: orderData.type,
      amount: orderData.amount,
      price: orderData.price,
      status: 'pending',
    }).returning();

    // Execute matching logic
    await this.matchOrder(order);

    return order;
  }

  /**
   * Match order against order book
   */
  private async matchOrder(order: Order): Promise<void> {
    // Implementation for order matching
    // ...
  }

  /**
   * Validate user has sufficient balance
   */
  private async validateBalance(userId: string, orderData: PlaceOrderRequest): Promise<void> {
    // Implementation for balance validation
    // ...
  }
}

export const orderExecutionService = new OrderExecutionService();
```

### 5. Route Controller Pattern

```typescript
// backend/src/controllers/trading.controller.ts
import { Request, Response, NextFunction } from 'express';
import { orderExecutionService } from '@/services/trading/OrderExecutionService';
import { placeOrderSchema } from '@shared/schema/validation';

export class TradingController {
  /**
   * POST /api/trading/orders
   * Place a new order
   */
  async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      const orderData = placeOrderSchema.parse(req.body);

      // Get authenticated user ID from middleware
      const userId = req.user!.id;

      // Execute order
      const order = await orderExecutionService.placeOrder(userId, orderData);

      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/trading/orders/open
   * Get user's open orders
   */
  async getOpenOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const orders = await orderExecutionService.getOpenOrders(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
}

export const tradingController = new TradingController();
```

### 6. Middleware Pattern

```typescript
// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '@/lib/utils/crypto';

/**
 * Verify user authentication via JWT
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload = await verifyJWT(token);
    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Verify wallet signature
 */
export const verifyWalletAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { walletAddress, signature, message } = req.body;

    // Verify signature using viem
    const isValid = await verifySignature(walletAddress, message, signature);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    req.walletAddress = walletAddress;
    next();
  } catch (error) {
    next(error);
  }
};
```

---

## Feature Implementation Guide

### Feature 1: OnRamp Flow (Fiat-to-Crypto)

#### Overview
Integrate OnRamp Money for fiat-to-crypto conversions with support for multiple currencies and payment methods.

#### Architecture

```
User Input → OnRamp Widget → Quote API → Payment Processing → Order Tracking → Crypto Delivery
```

#### Implementation Steps

##### 1. Database Schema

```typescript
// shared/schema/onramp.schema.ts
import { pgTable, uuid, varchar, decimal, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const onRampOrders = pgTable('onramp_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Order details
  orderId: varchar('order_id', { length: 100 }).notNull().unique(), // OnRamp Money order ID

  // Fiat details
  fiatCurrency: varchar('fiat_currency', { length: 10 }).notNull(), // GBP, USD, EUR, INR
  fiatAmount: decimal('fiat_amount', { precision: 20, scale: 2 }).notNull(),

  // Crypto details
  cryptoCurrency: varchar('crypto_currency', { length: 10 }).notNull(), // USDT, USDC, ETH
  cryptoAmount: decimal('crypto_amount', { precision: 30, scale: 18 }),
  network: varchar('network', { length: 50 }).notNull(), // ethereum, polygon, bsc, arbitrum
  walletAddress: varchar('wallet_address', { length: 255 }).notNull(),

  // Pricing
  exchangeRate: decimal('exchange_rate', { precision: 20, scale: 8 }),
  fees: jsonb('fees').$type<{
    platformFee: number;
    networkFee: number;
    providerFee: number;
    totalFee: number;
  }>(),

  // Payment
  paymentMethod: varchar('payment_method', { length: 50 }), // bank_transfer, card, instant_bank
  paymentDetails: jsonb('payment_details'),

  // Status tracking
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  // pending → awaiting_payment → processing → completed → failed → refunded

  // Transaction hash
  txHash: varchar('tx_hash', { length: 255 }),

  // Metadata
  metadata: jsonb('metadata'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
});
```

##### 2. Frontend Component

```typescript
// apps/web/src/features/swap/components/OnRampWidget.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnRampQuote, useCreateOnRampOrder } from '../hooks/useOnRamp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const onRampSchema = z.object({
  fiatAmount: z.number().min(25).max(50000),
  fiatCurrency: z.enum(['GBP', 'USD', 'EUR', 'INR']),
  cryptoCurrency: z.enum(['USDT', 'USDC', 'ETH', 'BTC']),
  network: z.enum(['ethereum', 'polygon', 'bsc', 'arbitrum']),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

type OnRampFormData = z.infer<typeof onRampSchema>;

export const OnRampWidget: React.FC = () => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<OnRampFormData>({
    resolver: zodResolver(onRampSchema),
    defaultValues: {
      fiatCurrency: 'GBP',
      cryptoCurrency: 'USDT',
      network: 'polygon',
    },
  });

  const formValues = watch();

  // Get quote (debounced)
  const { data: quote, isLoading: isLoadingQuote } = useOnRampQuote({
    fiatAmount: formValues.fiatAmount,
    fiatCurrency: formValues.fiatCurrency,
    cryptoCurrency: formValues.cryptoCurrency,
  });

  // Create order mutation
  const createOrderMutation = useCreateOnRampOrder();

  const onSubmit = async (data: OnRampFormData) => {
    await createOrderMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>You Pay</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Amount"
            {...register('fiatAmount', { valueAsNumber: true })}
          />
          <Select {...register('fiatCurrency')}>
            <option value="GBP">GBP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="INR">INR</option>
          </Select>
        </div>
        {errors.fiatAmount && <p className="text-red-500">{errors.fiatAmount.message}</p>}
      </div>

      <div>
        <label>You Receive</label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={quote?.cryptoAmount || '---'}
            disabled
          />
          <Select {...register('cryptoCurrency')}>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="ETH">ETH</option>
          </Select>
        </div>
      </div>

      <div>
        <label>Network</label>
        <Select {...register('network')}>
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="bsc">BSC</option>
          <option value="arbitrum">Arbitrum</option>
        </Select>
      </div>

      <div>
        <label>Wallet Address</label>
        <Input
          type="text"
          placeholder="0x..."
          {...register('walletAddress')}
        />
        {errors.walletAddress && <p className="text-red-500">{errors.walletAddress.message}</p>}
      </div>

      {quote && (
        <div className="border p-4 rounded">
          <p>Exchange Rate: {quote.exchangeRate}</p>
          <p>Platform Fee: {quote.fees.platformFee} {formValues.fiatCurrency}</p>
          <p>Network Fee: {quote.fees.networkFee} {formValues.fiatCurrency}</p>
          <p>Total: {quote.total} {formValues.fiatCurrency}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!quote || createOrderMutation.isPending}
      >
        {createOrderMutation.isPending ? 'Processing...' : 'Continue to Payment'}
      </Button>
    </form>
  );
};
```

##### 3. Backend Service

```typescript
// backend/src/services/swap/OnRampService.ts
import axios from 'axios';
import { db } from '@/config/database';
import { onRampOrders } from '@shared/schema';

interface OnRampQuoteRequest {
  fiatAmount: number;
  fiatCurrency: string;
  cryptoCurrency: string;
}

interface OnRampQuote {
  cryptoAmount: string;
  exchangeRate: string;
  fees: {
    platformFee: number;
    networkFee: number;
    providerFee: number;
    totalFee: number;
  };
  total: number;
}

export class OnRampService {
  private readonly apiKey = process.env.ONRAMP_API_KEY!;
  private readonly apiUrl = 'https://api.onramp.money';

  /**
   * Get quote for fiat-to-crypto conversion
   */
  async getQuote(params: OnRampQuoteRequest): Promise<OnRampQuote> {
    const response = await axios.post(`${this.apiUrl}/v1/quotes`, {
      fiatAmount: params.fiatAmount,
      fiatCurrency: params.fiatCurrency,
      cryptoCurrency: params.cryptoCurrency,
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      cryptoAmount: response.data.cryptoAmount,
      exchangeRate: response.data.rate,
      fees: {
        platformFee: response.data.fees.platform,
        networkFee: response.data.fees.network,
        providerFee: response.data.fees.provider,
        totalFee: response.data.fees.total,
      },
      total: params.fiatAmount + response.data.fees.total,
    };
  }

  /**
   * Create OnRamp order
   */
  async createOrder(userId: string, orderData: any): Promise<any> {
    // Create order with OnRamp Money
    const response = await axios.post(`${this.apiUrl}/v1/orders`, {
      fiatAmount: orderData.fiatAmount,
      fiatCurrency: orderData.fiatCurrency,
      cryptoCurrency: orderData.cryptoCurrency,
      network: orderData.network,
      walletAddress: orderData.walletAddress,
      callbackUrl: `${process.env.API_URL}/api/onramp/callback`,
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Store order in database
    const [order] = await db.insert(onRampOrders).values({
      userId,
      orderId: response.data.orderId,
      fiatCurrency: orderData.fiatCurrency,
      fiatAmount: orderData.fiatAmount,
      cryptoCurrency: orderData.cryptoCurrency,
      network: orderData.network,
      walletAddress: orderData.walletAddress,
      status: 'pending',
    }).returning();

    return {
      order,
      paymentUrl: response.data.paymentUrl,
    };
  }

  /**
   * Handle OnRamp callback (webhook)
   */
  async handleCallback(payload: any): Promise<void> {
    const { orderId, status, txHash } = payload;

    await db.update(onRampOrders)
      .set({
        status,
        txHash,
        updatedAt: new Date(),
        ...(status === 'completed' && { completedAt: new Date() }),
      })
      .where(eq(onRampOrders.orderId, orderId));
  }
}

export const onRampService = new OnRampService();
```

##### 4. API Routes

```typescript
// backend/src/routes/onramp.routes.ts
import { Router } from 'express';
import { authenticate } from '@/middleware/auth.middleware';
import { onRampService } from '@/services/swap/OnRampService';

const router = Router();

/**
 * GET /api/onramp/quote
 * Get quote for fiat-to-crypto conversion
 */
router.get('/quote', authenticate, async (req, res, next) => {
  try {
    const { fiatAmount, fiatCurrency, cryptoCurrency } = req.query;

    const quote = await onRampService.getQuote({
      fiatAmount: Number(fiatAmount),
      fiatCurrency: fiatCurrency as string,
      cryptoCurrency: cryptoCurrency as string,
    });

    res.json(quote);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/onramp/orders
 * Create OnRamp order
 */
router.post('/orders', authenticate, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const result = await onRampService.createOrder(userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/onramp/callback
 * Webhook callback from OnRamp Money
 */
router.post('/callback', async (req, res, next) => {
  try {
    await onRampService.handleCallback(req.body);
    res.status(200).send('OK');
  } catch (error) {
    next(error);
  }
});

export default router;
```

---

### Feature 2: Crypto Swap (0x Protocol)

#### Overview
Integrate 0x Protocol v2 for decentralized crypto-to-crypto swaps with multi-chain support.

#### Architecture

```
Token Selection → Quote Fetching → Approval (if needed) → Swap Execution → Transaction Monitoring
```

#### Implementation Steps

##### 1. Database Schema

```typescript
// shared/schema/swap.schema.ts
export const swapOrders = pgTable('swap_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Swap details
  chainId: integer('chain_id').notNull(), // 1 (Ethereum), 137 (Polygon), etc.

  // Input token
  sellToken: varchar('sell_token', { length: 255 }).notNull(), // Token address
  sellAmount: decimal('sell_amount', { precision: 30, scale: 18 }).notNull(),

  // Output token
  buyToken: varchar('buy_token', { length: 255 }).notNull(),
  buyAmount: decimal('buy_amount', { precision: 30, scale: 18 }).notNull(),

  // Pricing
  price: decimal('price', { precision: 30, scale: 18 }).notNull(),
  guaranteedPrice: decimal('guaranteed_price', { precision: 30, scale: 18 }),

  // Slippage
  slippagePercent: decimal('slippage_percent', { precision: 5, scale: 2 }).default('0.5'),

  // 0x quote data
  quoteId: varchar('quote_id', { length: 255 }),
  zeroXData: jsonb('zero_x_data'),

  // Transaction
  txHash: varchar('tx_hash', { length: 255 }),

  // Status
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  // pending → approval_needed → approving → approved → executing → completed → failed

  // Gas
  gasEstimate: varchar('gas_estimate', { length: 100 }),
  gasUsed: varchar('gas_used', { length: 100 }),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
});
```

##### 2. Frontend Service

```typescript
// apps/web/src/features/swap/services/zeroXService.ts
import { createPublicClient, createWalletClient, http, type Address } from 'viem';
import { mainnet, polygon, arbitrum } from 'viem/chains';

interface SwapQuote {
  sellAmount: string;
  buyAmount: string;
  price: string;
  guaranteedPrice: string;
  gas: string;
  to: Address;
  data: `0x${string}`;
  value: string;
  allowanceTarget?: Address;
}

export class ZeroXService {
  private readonly apiUrl = 'https://api.0x.org';

  /**
   * Get swap quote from 0x API
   */
  async getSwapQuote(params: {
    chainId: number;
    sellToken: Address;
    buyToken: Address;
    sellAmount: string;
    slippagePercentage: number;
    takerAddress: Address;
  }): Promise<SwapQuote> {
    const queryParams = new URLSearchParams({
      sellToken: params.sellToken,
      buyToken: params.buyToken,
      sellAmount: params.sellAmount,
      slippagePercentage: params.slippagePercentage.toString(),
      takerAddress: params.takerAddress,
    });

    const response = await fetch(
      `${this.apiUrl}/swap/v1/quote?${queryParams}`,
      {
        headers: {
          '0x-api-key': import.meta.env.VITE_ZERO_X_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch swap quote');
    }

    return response.json();
  }

  /**
   * Check if token approval is needed
   */
  async checkAllowance(params: {
    tokenAddress: Address;
    ownerAddress: Address;
    spenderAddress: Address;
    chainId: number;
  }): Promise<bigint> {
    const client = createPublicClient({
      chain: this.getChain(params.chainId),
      transport: http(),
    });

    const allowance = await client.readContract({
      address: params.tokenAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [params.ownerAddress, params.spenderAddress],
    });

    return allowance as bigint;
  }

  /**
   * Approve token spending
   */
  async approveToken(params: {
    tokenAddress: Address;
    spenderAddress: Address;
    amount: bigint;
    chainId: number;
  }): Promise<`0x${string}`> {
    const walletClient = createWalletClient({
      chain: this.getChain(params.chainId),
      transport: http(),
    });

    const hash = await walletClient.writeContract({
      address: params.tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [params.spenderAddress, params.amount],
    });

    return hash;
  }

  private getChain(chainId: number) {
    switch (chainId) {
      case 1: return mainnet;
      case 137: return polygon;
      case 42161: return arbitrum;
      default: throw new Error(`Unsupported chain: ${chainId}`);
    }
  }
}

export const zeroXService = new ZeroXService();

const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
] as const;
```

##### 3. Frontend Component

```typescript
// apps/web/src/features/swap/components/CryptoSwap.tsx
import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { useDebounce } from '@/hooks/useDebounce';
import { useSwapQuote, useExecuteSwap } from '../hooks/useSwap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TokenSelect } from './TokenSelect';

export const CryptoSwap: React.FC = () => {
  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [sellToken, setSellToken] = useState<Token | null>(null);
  const [buyToken, setBuyToken] = useState<Token | null>(null);
  const [sellAmount, setSellAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  const debouncedSellAmount = useDebounce(sellAmount, 300);

  // Get swap quote
  const { data: quote, isLoading: isLoadingQuote } = useSwapQuote({
    chainId: chainId!,
    sellToken: sellToken?.address,
    buyToken: buyToken?.address,
    sellAmount: debouncedSellAmount ? parseUnits(debouncedSellAmount, sellToken?.decimals ?? 18).toString() : undefined,
    slippagePercentage: slippage,
    takerAddress: address!,
  }, {
    enabled: !!sellToken && !!buyToken && !!debouncedSellAmount && !!address,
  });

  // Execute swap mutation
  const executeSwapMutation = useExecuteSwap();

  const handleSwap = async () => {
    if (!quote || !walletClient) return;

    await executeSwapMutation.mutateAsync({
      quote,
      walletClient,
    });
  };

  const buyAmount = quote?.buyAmount
    ? formatUnits(BigInt(quote.buyAmount), buyToken?.decimals ?? 18)
    : '---';

  return (
    <div className="space-y-4">
      <div>
        <label>You Pay</label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="0.0"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
          />
          <TokenSelect
            selectedToken={sellToken}
            onSelect={setSellToken}
            chainId={chainId}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSellToken(buyToken);
            setBuyToken(sellToken);
          }}
        >
          ↓
        </Button>
      </div>

      <div>
        <label>You Receive</label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="0.0"
            value={buyAmount}
            disabled
          />
          <TokenSelect
            selectedToken={buyToken}
            onSelect={setBuyToken}
            chainId={chainId}
          />
        </div>
      </div>

      {quote && (
        <div className="border p-4 rounded space-y-2">
          <div className="flex justify-between">
            <span>Price:</span>
            <span>1 {sellToken?.symbol} = {quote.price} {buyToken?.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Slippage:</span>
            <span>{slippage}%</span>
          </div>
          <div className="flex justify-between">
            <span>Gas Estimate:</span>
            <span>{quote.gas}</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleSwap}
        disabled={!quote || executeSwapMutation.isPending || isLoadingQuote}
        className="w-full"
      >
        {executeSwapMutation.isPending ? 'Swapping...' : 'Swap'}
      </Button>
    </div>
  );
};
```

---

### Feature 3: Trading Components

#### TradingView Chart Integration

```typescript
// apps/web/src/features/trading/components/TradingChart.tsx
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useMarketData } from '../hooks/useMarketData';

interface TradingChartProps {
  symbol: string;
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
}

export const TradingChart: React.FC<TradingChartProps> = ({ symbol, interval }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const { data: candleData } = useMarketData({
    symbol,
    interval,
    type: 'candles',
  });

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#0a0a0a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#1a1a1a' },
        horzLines: { color: '#1a1a1a' },
      },
      crosshair: {
        mode: 0,
      },
      timeScale: {
        borderColor: '#2a2a2a',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.remove();
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (candleData && candlestickSeriesRef.current) {
      const formattedData = candleData.map(candle => ({
        time: candle.timestamp / 1000, // Convert to seconds
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));

      candlestickSeriesRef.current.setData(formattedData);
    }
  }, [candleData]);

  return (
    <div className="w-full h-full">
      <div ref={chartContainerRef} />
    </div>
  );
};
```

#### Order Book Component

```typescript
// apps/web/src/features/trading/components/OrderBook.tsx
import { useMemo } from 'react';
import { useOrderBook } from '../hooks/useOrderBook';
import { cn } from '@/lib/utils';

interface OrderBookProps {
  symbol: string;
}

export const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const { data: orderBook } = useOrderBook(symbol);

  const maxTotal = useMemo(() => {
    if (!orderBook) return 0;

    const maxBid = Math.max(...orderBook.bids.map(b => b.total));
    const maxAsk = Math.max(...orderBook.asks.map(a => a.total));

    return Math.max(maxBid, maxAsk);
  }, [orderBook]);

  if (!orderBook) {
    return <div>Loading order book...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="grid grid-cols-3 gap-2 p-2 text-xs text-gray-400 border-b">
        <div>Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="flex-1 overflow-auto">
        {orderBook.asks.slice().reverse().map((ask, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-2 p-2 text-xs relative"
          >
            <div
              className="absolute inset-0 bg-red-500/10"
              style={{ width: `${(ask.total / maxTotal) * 100}%` }}
            />
            <div className="text-red-500 relative z-10">{ask.price.toFixed(2)}</div>
            <div className="text-right relative z-10">{ask.amount.toFixed(4)}</div>
            <div className="text-right relative z-10">{ask.total.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="p-4 text-center border-y">
        <div className="text-xl font-bold">
          {orderBook.bids[0]?.price.toFixed(2)}
        </div>
        <div className="text-xs text-gray-400">
          Spread: {(orderBook.asks[0]?.price - orderBook.bids[0]?.price).toFixed(2)}
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex-1 overflow-auto">
        {orderBook.bids.map((bid, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-2 p-2 text-xs relative"
          >
            <div
              className="absolute inset-0 bg-green-500/10"
              style={{ width: `${(bid.total / maxTotal) * 100}%` }}
            />
            <div className="text-green-500 relative z-10">{bid.price.toFixed(2)}</div>
            <div className="text-right relative z-10">{bid.amount.toFixed(4)}</div>
            <div className="text-right relative z-10">{bid.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### Trading Panel Component

```typescript
// apps/web/src/features/trading/components/TradingPanel.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePlaceOrder } from '../hooks/usePlaceOrder';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const orderSchema = z.object({
  type: z.enum(['market', 'limit']),
  side: z.enum(['buy', 'sell']),
  amount: z.number().positive(),
  price: z.number().positive().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface TradingPanelProps {
  symbol: string;
  currentPrice: number;
}

export const TradingPanel: React.FC<TradingPanelProps> = ({ symbol, currentPrice }) => {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      type: 'market',
      side: 'buy',
    },
  });

  const { data: balance } = useWalletBalance();
  const placeOrderMutation = usePlaceOrder();

  const amount = watch('amount');
  const price = watch('price') || currentPrice;

  const total = amount * price;

  const onSubmit = async (data: OrderFormData) => {
    await placeOrderMutation.mutateAsync({
      symbol,
      ...data,
      price: data.type === 'market' ? undefined : data.price,
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={side} onValueChange={(v) => setSide(v as 'buy' | 'sell')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy" className="text-green-500">Buy</TabsTrigger>
          <TabsTrigger value="sell" className="text-red-500">Sell</TabsTrigger>
        </TabsList>

        <TabsContent value={side} className="space-y-4 mt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Order Type */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={orderType === 'market' ? 'default' : 'outline'}
                onClick={() => {
                  setOrderType('market');
                  setValue('type', 'market');
                }}
                className="flex-1"
              >
                Market
              </Button>
              <Button
                type="button"
                variant={orderType === 'limit' ? 'default' : 'outline'}
                onClick={() => {
                  setOrderType('limit');
                  setValue('type', 'limit');
                }}
                className="flex-1"
              >
                Limit
              </Button>
            </div>

            {/* Price (for limit orders) */}
            {orderType === 'limit' && (
              <div>
                <label className="text-sm">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={currentPrice.toString()}
                  {...register('price', { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                )}
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="text-sm">Amount</label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Percentage buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const maxAmount = balance?.[side === 'buy' ? 'USDT' : symbol] || 0;
                    const calculatedAmount = (maxAmount * percent) / 100;
                    setValue('amount', calculatedAmount);
                  }}
                >
                  {percent}%
                </Button>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between p-3 bg-gray-800 rounded">
              <span className="text-sm text-gray-400">Total:</span>
              <span className="font-medium">{total.toFixed(2)} USDT</span>
            </div>

            {/* Available Balance */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>Available:</span>
              <span>
                {balance?.[side === 'buy' ? 'USDT' : symbol]?.toFixed(4) || '0.0000'}{' '}
                {side === 'buy' ? 'USDT' : symbol}
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className={cn(
                'w-full',
                side === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              )}
              disabled={placeOrderMutation.isPending}
            >
              {placeOrderMutation.isPending
                ? 'Placing Order...'
                : `${side.toUpperCase()} ${symbol}`}
              </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

---

### Feature 4: Theme System

```typescript
// apps/web/src/features/theme/themes.ts
export interface Theme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
}

export const themes: Record<string, Theme> = {
  dark: {
    name: 'Dark Mode',
    colors: {
      background: '0 0% 5%',
      foreground: '0 0% 95%',
      primary: '262 83% 70%',
      secondary: '240 5% 20%',
      accent: '262 83% 60%',
      muted: '240 5% 15%',
      border: '240 5% 20%',
      success: '142 71% 45%',
      error: '0 72% 51%',
      warning: '38 92% 50%',
    },
  },
  light: {
    name: 'Light Mode',
    colors: {
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      primary: '262 83% 58%',
      secondary: '210 40% 96%',
      accent: '262 83% 58%',
      muted: '210 40% 96%',
      border: '214 32% 91%',
      success: '142 71% 45%',
      error: '0 72% 51%',
      warning: '38 92% 50%',
    },
  },
  cyber: {
    name: 'Cyber Punk',
    colors: {
      background: '270 20% 5%',
      foreground: '180 100% 80%',
      primary: '180 100% 50%',
      secondary: '280 80% 50%',
      accent: '340 100% 60%',
      muted: '270 20% 10%',
      border: '180 100% 30%',
      success: '120 100% 50%',
      error: '0 100% 60%',
      warning: '50 100% 60%',
    },
  },
};

// apps/web/src/features/theme/hooks/useTheme.ts
import { useEffect, useState } from 'react';
import { themes, type Theme } from '../themes';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('dark');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName: string) => {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    localStorage.setItem('theme', themeName);
  };

  const changeTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    applyTheme(themeName);
  };

  return {
    currentTheme,
    themes,
    changeTheme,
  };
};

// apps/web/src/features/theme/components/ThemeSwitcher.tsx
import { useTheme } from '../hooks/useTheme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, themes, changeTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {themes[currentTheme]?.name || 'Theme'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(themes).map(([key, theme]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => changeTheme(key)}
          >
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

---

## Database Schema Design

### Core Tables

```typescript
// shared/schema/core.schema.ts
import { pgTable, uuid, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core';

/**
 * Users table
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Authentication
  email: varchar('email', { length: 255 }).unique(),
  passwordHash: varchar('password_hash', { length: 255 }),

  // Wallet
  walletAddress: varchar('wallet_address', { length: 255 }).unique(),

  // Profile
  username: varchar('username', { length: 100 }).unique(),
  displayName: varchar('display_name', { length: 255 }),
  avatarUrl: text('avatar_url'),

  // 2FA
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),

  // Email verification
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),

  // KYC
  kycStatus: varchar('kyc_status', { length: 50 }).default('none'),
  // none | pending | approved | rejected
  kycLevel: integer('kyc_level').default(0), // 0-3

  // Account settings
  accountStatus: varchar('account_status', { length: 50 }).default('active'),
  // active | suspended | banned

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
});

/**
 * Sessions table
 */
export const sessions = pgTable('sessions', {
  sid: varchar('sid', { length: 255 }).primaryKey(),
  sess: jsonb('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

/**
 * Wallets table
 */
export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  address: varchar('address', { length: 255 }).notNull().unique(),
  chainId: integer('chain_id').notNull(),

  // Metadata
  label: varchar('label', { length: 255 }),
  isPrimary: boolean('is_primary').default(false),

  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

### Trading Tables

```typescript
// shared/schema/trading.schema.ts

/**
 * Orders table
 */
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),

  // Order details
  symbol: varchar('symbol', { length: 20 }).notNull(), // BTC/USDT
  side: varchar('side', { length: 10 }).notNull(), // buy | sell
  type: varchar('type', { length: 20 }).notNull(), // market | limit | stop

  // Amounts
  amount: decimal('amount', { precision: 30, scale: 18 }).notNull(),
  price: decimal('price', { precision: 30, scale: 18 }),
  filled: decimal('filled', { precision: 30, scale: 18 }).default('0'),

  // Status
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  // pending | partial | filled | cancelled | rejected

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  filledAt: timestamp('filled_at'),
});

/**
 * Trades table
 */
export const trades = pgTable('trades', {
  id: uuid('id').primaryKey().defaultRandom(),

  orderId: uuid('order_id').notNull().references(() => orders.id),
  userId: uuid('user_id').notNull().references(() => users.id),

  symbol: varchar('symbol', { length: 20 }).notNull(),
  side: varchar('side', { length: 10 }).notNull(),

  amount: decimal('amount', { precision: 30, scale: 18 }).notNull(),
  price: decimal('price', { precision: 30, scale: 18 }).notNull(),

  // Fees
  fee: decimal('fee', { precision: 30, scale: 18 }).default('0'),
  feeCurrency: varchar('fee_currency', { length: 10 }),

  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Positions table (for futures)
 */
export const positions = pgTable('positions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),

  symbol: varchar('symbol', { length: 20 }).notNull(),
  side: varchar('side', { length: 10 }).notNull(), // long | short

  // Position details
  entryPrice: decimal('entry_price', { precision: 30, scale: 18 }).notNull(),
  currentPrice: decimal('current_price', { precision: 30, scale: 18 }),
  quantity: decimal('quantity', { precision: 30, scale: 18 }).notNull(),

  // Leverage & Margin
  leverage: integer('leverage').default(1),
  margin: decimal('margin', { precision: 30, scale: 18 }).notNull(),

  // Risk management
  liquidationPrice: decimal('liquidation_price', { precision: 30, scale: 18 }),
  stopLoss: decimal('stop_loss', { precision: 30, scale: 18 }),
  takeProfit: decimal('take_profit', { precision: 30, scale: 18 }),

  // P&L
  unrealizedPnL: decimal('unrealized_pnl', { precision: 30, scale: 18 }).default('0'),
  realizedPnL: decimal('realized_pnl', { precision: 30, scale: 18 }).default('0'),

  status: varchar('status', { length: 20 }).default('open'),
  // open | closed | liquidated

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  closedAt: timestamp('closed_at'),
});
```

---

## Security Implementation

### 1. Wallet Authentication

```typescript
// backend/src/services/auth/WalletAuthService.ts
import { createPublicClient, http, verifyMessage } from 'viem';
import { mainnet } from 'viem/chains';
import jwt from 'jsonwebtoken';
import { db } from '@/config/database';
import { users } from '@shared/schema';

export class WalletAuthService {
  /**
   * Generate authentication message for signing
   */
  generateAuthMessage(walletAddress: string): string {
    const nonce = Math.floor(Math.random() * 1000000);
    const timestamp = Date.now();

    return `Sign this message to authenticate with NebulaX Trading Platform\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
  }

  /**
   * Verify wallet signature and create/update user
   */
  async verifyAndAuthenticate(
    walletAddress: string,
    message: string,
    signature: `0x${string}`
  ): Promise<{ user: any; token: string }> {
    // Verify signature
    const isValid = await verifyMessage({
      address: walletAddress as `0x${string}`,
      message,
      signature,
    });

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // Find or create user
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1);

    if (!user) {
      [user] = await db.insert(users).values({
        walletAddress,
        username: `user_${walletAddress.slice(0, 8)}`,
      }).returning();
    } else {
      // Update last login
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        walletAddress: user.walletAddress,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return { user, token };
  }
}

export const walletAuthService = new WalletAuthService();
```

### 2. Rate Limiting

```typescript
// backend/src/middleware/rateLimit.middleware.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

/**
 * General API rate limit
 */
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
});

/**
 * Strict rate limit for sensitive endpoints
 */
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
});

/**
 * Trading rate limit
 */
export const tradingLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:trading:',
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 orders per minute
  message: 'Trading rate limit exceeded.',
});
```

### 3. Input Validation

```typescript
// shared/schema/validation.ts
import { z } from 'zod';

export const placeOrderSchema = z.object({
  symbol: z.string().min(1).max(20),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['market', 'limit', 'stop']),
  amount: z.number().positive(),
  price: z.number().positive().optional(),
});

export const swapQuoteSchema = z.object({
  chainId: z.number().int().positive(),
  sellToken: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  buyToken: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  sellAmount: z.string(),
  slippagePercentage: z.number().min(0).max(50),
  takerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

// Usage in routes
app.post('/api/trading/orders', async (req, res, next) => {
  try {
    const validatedData = placeOrderSchema.parse(req.body);
    // Process order...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
});
```

---

## Testing Strategy

### Unit Tests

```typescript
// backend/tests/unit/services/OrderExecutionService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { OrderExecutionService } from '@/services/trading/OrderExecutionService';

describe('OrderExecutionService', () => {
  let service: OrderExecutionService;

  beforeEach(() => {
    service = new OrderExecutionService();
  });

  describe('placeOrder', () => {
    it('should place a market buy order', async () => {
      const order = await service.placeOrder('user-id', {
        symbol: 'BTC/USDT',
        side: 'buy',
        type: 'market',
        amount: 0.1,
      });

      expect(order).toBeDefined();
      expect(order.status).toBe('pending');
    });

    it('should reject order if insufficient balance', async () => {
      await expect(
        service.placeOrder('user-id', {
          symbol: 'BTC/USDT',
          side: 'buy',
          type: 'market',
          amount: 1000000,
        })
      ).rejects.toThrow('Insufficient balance');
    });
  });
});
```

### Integration Tests

```typescript
// backend/tests/integration/trading.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '@/server';

describe('Trading API', () => {
  describe('POST /api/trading/orders', () => {
    it('should place an order with valid data', async () => {
      const response = await request(app)
        .post('/api/trading/orders')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          symbol: 'BTC/USDT',
          side: 'buy',
          type: 'market',
          amount: 0.1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/trading/orders')
        .send({
          symbol: 'BTC/USDT',
          side: 'buy',
          type: 'market',
          amount: 0.1,
        });

      expect(response.status).toBe(401);
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// apps/web/tests/e2e/trading.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Trading Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/trading');
    // Connect wallet and authenticate
    await page.click('[data-testid="connect-wallet"]');
    // ... wallet connection logic
  });

  test('should place a market order', async ({ page }) => {
    // Select trading pair
    await page.selectOption('[data-testid="symbol-select"]', 'BTC/USDT');

    // Enter amount
    await page.fill('[data-testid="amount-input"]', '0.1');

    // Click buy button
    await page.click('[data-testid="buy-button"]');

    // Wait for confirmation
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();

    // Verify order appears in history
    await expect(
      page.locator('[data-testid="order-history"]').locator('text=BTC/USDT')
    ).toBeVisible();
  });
});
```

---

## Deployment Strategy

### Environment Configuration

```typescript
// backend/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  API_URL: z.string().url(),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),

  // External APIs
  ZERO_X_API_KEY: z.string(),
  ONRAMP_API_KEY: z.string(),
  GROQ_API_KEY: z.string(),
  COINBASE_API_KEY: z.string(),

  // Services
  STRIPE_SECRET_KEY: z.string(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

### Docker Compose (Local Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: crypto_platform
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: crypto_platform_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://crypto_platform:dev_password@postgres:5432/crypto_platform_db
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Run E2E tests
        run: pnpm test:e2e

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.0.3
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## Development Roadmap

### Phase 1: Foundation (Weeks 1-2)

- [ ] Set up project structure
- [ ] Initialize database with core schema
- [ ] Implement wallet authentication
- [ ] Create base UI components
- [ ] Set up routing and navigation

### Phase 2: Core Trading (Weeks 3-4)

- [ ] Implement order placement
- [ ] Build trading chart component
- [ ] Create order book display
- [ ] Add portfolio tracking
- [ ] Implement WebSocket for real-time data

### Phase 3: Swap Integration (Week 5)

- [ ] Integrate 0x Protocol for crypto swaps
- [ ] Integrate OnRamp Money for fiat onboarding
- [ ] Build swap UI components
- [ ] Add transaction monitoring

### Phase 4: AI Features (Week 6)

- [ ] Integrate Groq API
- [ ] Build AI assistant UI
- [ ] Implement trading signal generation
- [ ] Add market analysis

### Phase 5: Theme & Polish (Week 7)

- [ ] Implement theme system
- [ ] Add animations and transitions
- [ ] Mobile responsiveness
- [ ] Performance optimization

### Phase 6: Testing & Security (Week 8)

- [ ] Write unit tests
- [ ] Write integration tests
- [ ] E2E testing with Playwright
- [ ] Security audit
- [ ] Performance testing

### Phase 7: Deployment (Week 9)

- [ ] Set up CI/CD pipeline
- [ ] Deploy to production
- [ ] Monitor and optimize
- [ ] Documentation

---

## Conclusion

This foundation structure provides a comprehensive blueprint for building a modern cryptocurrency trading platform. Key takeaways:

1. **Modular Architecture**: Feature-based organization for scalability
2. **Type Safety**: Full TypeScript coverage with Zod validation
3. **Real-time Capabilities**: WebSocket integration for live data
4. **Security First**: Wallet auth, rate limiting, input validation
5. **Developer Experience**: Clear patterns, testing, documentation

**Next Steps:**
1. Review and approve this structure
2. Set up development environment
3. Begin Phase 1 implementation
4. Iterate based on feedback

---

**Document Version:** 1.0
**Last Updated:** 2025-11-18
**Maintained by:** Development Team
