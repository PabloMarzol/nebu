# NebulAX Exchange - Complete Technology Stack

**Version:** 1.0
**Last Updated:** 2025-11-18
**Status:** Production

---

## Table of Contents

1. [Overview](#overview)
2. [Frontend Stack](#frontend-stack)
3. [Backend Stack](#backend-stack)
4. [Database & ORM](#database--orm)
5. [Blockchain & Web3](#blockchain--web3)
6. [Payment Integrations](#payment-integrations)
7. [External APIs & Services](#external-apis--services)
8. [Development Tools](#development-tools)
9. [Infrastructure & Deployment](#infrastructure--deployment)
10. [Testing & Quality Assurance](#testing--quality-assurance)

---

## Overview

NebulAX Exchange is a full-stack cryptocurrency trading platform with fiat on-ramp capabilities, DEX aggregation, AI-powered trading insights, and multi-chain support.

**Core Technologies:**
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **Blockchain:** Viem + Wagmi (multi-chain)
- **Real-time:** Socket.io + WebSocket
- **Styling:** Tailwind CSS + Radix UI

---

## Frontend Stack

### Core Framework & Build Tools

| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **React** | 18.3.1 | UI framework | [React Docs](https://react.dev) |
| **TypeScript** | 5.6.3 | Type safety | [TS Docs](https://typescriptlang.org) |
| **Vite** | 5.4.14 | Build tool & dev server | [Vite Docs](https://vitejs.dev) |
| **Wouter** | 3.3.5 | Lightweight routing | [Wouter Docs](https://github.com/molefrog/wouter) |

### State Management

```typescript
// Server State - React Query
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchInterval: 5000, // Auto-refresh market data
      retry: 3,
    },
  },
});

// Example: Market data query
const { data: marketData, isLoading } = useQuery({
  queryKey: ['market-data', symbol],
  queryFn: () => fetchMarketData(symbol),
});

// Example: Place order mutation
const placeOrderMutation = useMutation({
  mutationFn: placeOrder,
  onSuccess: () => {
    queryClient.invalidateQueries(['orders']);
    queryClient.invalidateQueries(['portfolio']);
  },
});
```

| Package | Version | Purpose |
|---------|---------|---------|
| **@tanstack/react-query** | 5.60.5 | Server state management, caching |
| **React Context** | Built-in | Global UI state (theme, auth) |
| **React Hook Form** | 7.55.0 | Form state & validation |

### UI Components & Styling

```typescript
// Radix UI Components (headless, accessible)
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tabs from '@radix-ui/react-tabs';

// Tailwind CSS with theme system
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        // ... custom theme colors
      },
    },
  },
};
```

| Package | Version | Purpose |
|---------|---------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **@radix-ui/react-*** | ~1.2.x | Accessible UI primitives |
| **class-variance-authority** | 0.7.1 | Type-safe component variants |
| **clsx** | 2.1.1 | Conditional class names |
| **tailwind-merge** | 2.6.0 | Merge Tailwind classes |
| **framer-motion** | 11.18.2 | Animations & transitions |
| **lucide-react** | 0.453.0 | Icon library |
| **next-themes** | 0.4.6 | Dark mode support |

### Charts & Data Visualization

**Primary: TradingView Lightweight Charts (Candlesticks & Trading)**

```typescript
import { createChart, ColorType } from 'lightweight-charts';

// Create candlestick chart
const chart = createChart(chartContainerRef.current, {
  width: 800,
  height: 400,
  layout: {
    background: { type: ColorType.Solid, color: '#1a1a1a' },
    textColor: '#d1d4dc',
  },
  grid: {
    vertLines: { color: '#2a2e39' },
    horzLines: { color: '#2a2e39' },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
});

// Add candlestick series
const candlestickSeries = chart.addCandlestickSeries({
  upColor: '#26a69a',
  downColor: '#ef5350',
  borderVisible: false,
  wickUpColor: '#26a69a',
  wickDownColor: '#ef5350',
});

// Set OHLC data
candlestickSeries.setData([
  { time: '2023-01-01', open: 100, high: 110, low: 95, close: 105 },
  { time: '2023-01-02', open: 105, high: 115, low: 100, close: 112 },
  // ... more candles
]);

// Add volume series
const volumeSeries = chart.addHistogramSeries({
  color: '#26a69a',
  priceFormat: { type: 'volume' },
  priceScaleId: '',
});

volumeSeries.setData([
  { time: '2023-01-01', value: 1000000, color: '#26a69a' },
  { time: '2023-01-02', value: 1200000, color: '#ef5350' },
]);
```

**Chart Libraries:**

| Package | Version | Use Case | Features |
|---------|---------|----------|----------|
| **lightweight-charts** | 5.0.9 | **Primary: Trading charts** | Candlesticks, OHLC, line, area, volume, real-time updates |
| **lightweight-charts-react-wrapper** | 2.1.1 | React integration for LWC | Type-safe React components |
| **recharts** | 2.15.2 | Portfolio charts | Pie charts, bar charts, simple analytics |
| **react-chartjs-2** | 5.3.0 | Dashboard metrics | Line charts, radar charts |
| **chart.js** | 4.5.0 | Chart.js core (for react-chartjs-2) | General charting |
| **d3** | 7.9.0 | Custom visualizations | Advanced data transformations |
| **d3-time-format** | 4.1.0 | Date formatting for charts | Time axis formatting |

**When to Use Each:**

```typescript
// ✅ TradingView Lightweight Charts - FOR TRADING CHARTS
// Use for: Candlestick charts, price charts, volume charts
// Pros: Optimized for financial data, real-time updates, 60fps
// Cons: Not suitable for pie charts or general analytics
import { createChart } from 'lightweight-charts';

// ✅ Recharts - FOR PORTFOLIO ANALYTICS
// Use for: Asset allocation pie charts, portfolio performance
// Pros: Easy to use, responsive, good for simple charts
// Cons: Not optimized for real-time trading data
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

<PieChart width={400} height={400}>
  <Pie
    data={portfolioData}
    dataKey="value"
    nameKey="asset"
    cx="50%"
    cy="50%"
    outerRadius={80}
  >
    {portfolioData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>

// ✅ Chart.js - FOR DASHBOARD METRICS
// Use for: Trade history, P&L charts, general metrics
// Pros: Flexible, many chart types, good documentation
// Cons: Heavier bundle size
import { Line } from 'react-chartjs-2';

// ✅ D3 - FOR CUSTOM VISUALIZATIONS
// Use for: Order book depth chart, heatmaps, network graphs
// Pros: Maximum flexibility, powerful data transformations
// Cons: Steeper learning curve, manual DOM manipulation
import * as d3 from 'd3';
```

**Chart Implementation Best Practices:**

```typescript
// ✅ Recommended: Separate chart configuration
// src/features/trading/config/chartConfig.ts
export const CANDLESTICK_CHART_OPTIONS = {
  layout: {
    background: { type: ColorType.Solid, color: 'transparent' },
    textColor: '#d1d4dc',
  },
  grid: {
    vertLines: { color: '#2a2e39' },
    horzLines: { color: '#2a2e39' },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  rightPriceScale: {
    borderColor: '#2a2e39',
  },
  timeScale: {
    borderColor: '#2a2e39',
    timeVisible: true,
  },
};

// ✅ Custom hook for chart management
// src/features/trading/hooks/useTradingChart.ts
export function useTradingChart(symbol: string) {
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, CANDLESTICK_CHART_OPTIONS);
    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
    });
    candlestickRef.current = candlestickSeries;

    return () => {
      chart.remove();
    };
  }, []);

  return { chart: chartRef.current, candlestickSeries: candlestickRef.current };
}
```

### Web3 Integration

```typescript
// Viem + Wagmi setup
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'wagmi/chains';
import { walletConnect, coinbaseWallet, injected } from 'wagmi/connectors';

const config = createConfig({
  chains: [mainnet, polygon, arbitrum],
  connectors: [
    injected(),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
    coinbaseWallet({ appName: 'NebulAX Exchange' }),
  ],
  transports: {
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
  },
});

// Usage in components
import { useAccount, useBalance, useWriteContract } from 'wagmi';

function WalletInfo() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <div>
      {isConnected && (
        <p>Balance: {balance?.formatted} {balance?.symbol}</p>
      )}
    </div>
  );
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **viem** | 2.38.0 | Low-level Ethereum library (type-safe) |
| **wagmi** | 2.19.2 | React hooks for Web3 |
| **@0x/swap-ts-sdk** | 2.1.1 | 0x Protocol DEX aggregation |
| **ethers** | 6.15.0 | Legacy Web3 library (being phased out) |

### Forms & Validation

```typescript
// React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const placeOrderSchema = z.object({
  symbol: z.string().min(1, 'Symbol required'),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['market', 'limit']),
  amount: z.number().positive('Amount must be positive'),
  price: z.number().positive().optional(),
});

type PlaceOrderForm = z.infer<typeof placeOrderSchema>;

// Use in component
function TradeForm() {
  const form = useForm<PlaceOrderForm>({
    resolver: zodResolver(placeOrderSchema),
    defaultValues: {
      side: 'buy',
      type: 'limit',
    },
  });

  const onSubmit = (data: PlaceOrderForm) => {
    placeOrderMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **react-hook-form** | 7.55.0 | Form state management |
| **@hookform/resolvers** | 3.10.0 | Validation resolvers |
| **zod** | 3.24.2 | Schema validation |

### Payment UI Components

| Package | Version | Purpose |
|---------|---------|---------|
| **@stripe/react-stripe-js** | 3.8.1 | Stripe payment forms |
| **@stripe/stripe-js** | 7.7.0 | Stripe.js library |
| **qrcode** | 1.5.4 | QR code generation (crypto addresses) |
| **input-otp** | 1.4.2 | OTP input components |

---

## Backend Stack

### Core Framework

```typescript
// Express.js setup with TypeScript
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trading', tradingRoutes);
app.use('/api/market-data', marketDataRoutes);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
```

| Package | Version | Purpose |
|---------|---------|---------|
| **express** | 4.21.2 | Web framework |
| **helmet** | 8.1.0 | Security headers |
| **cors** | Latest | CORS middleware |
| **express-rate-limit** | 7.5.1 | Rate limiting |
| **dotenv** | 17.2.1 | Environment variables |

### Authentication & Security

```typescript
// JWT-based authentication
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

// Generate JWT token
export function generateToken(userId: string, walletAddress: string) {
  return jwt.sign(
    { id: userId, walletAddress },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

// 2FA with TOTP
export function generate2FASecret(userId: string) {
  return speakeasy.generateSecret({
    name: `NebulAX (${userId})`,
    length: 32,
  });
}

export function verify2FAToken(secret: string, token: string) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2,
  });
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **jsonwebtoken** | 9.0.2 | JWT token generation/verification |
| **speakeasy** | 2.0.0 | 2FA TOTP implementation |

### Real-time Communication

```typescript
// Socket.io setup
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Market data broadcasting
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('subscribe', (symbol: string) => {
    socket.join(`market:${symbol}`);
  });

  socket.on('unsubscribe', (symbol: string) => {
    socket.leave(`market:${symbol}`);
  });
});

// Broadcast price updates
export function broadcastPriceUpdate(symbol: string, data: any) {
  io.to(`market:${symbol}`).emit('price-update', data);
}
```

| Package | Version | Purpose |
|---------|---------|---------|
| **socket.io** | 4.8.1 | WebSocket server |
| **socket.io-client** | 4.8.1 | WebSocket client (frontend) |
| **ws** | 8.18.3 | WebSocket protocol implementation |

### Email & Notifications

| Package | Version | Purpose |
|---------|---------|---------|
| **@sendgrid/mail** | 8.1.5 | SendGrid email API |
| **nodemailer** | 7.0.3 | Email sending (alternative) |
| **twilio** | 5.7.1 | SMS notifications |

### Data Processing & Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| **memoizee** | 0.4.17 | Function memoization (caching) |
| **date-fns** | 3.6.0 | Date manipulation |
| **zod-validation-error** | 3.4.0 | Better Zod error messages |

---

## Database & ORM

### PostgreSQL + Drizzle ORM

```typescript
// Drizzle schema definition
// db/schema/users.ts
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  walletAddress: varchar('wallet_address', { length: 42 }).unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  kycLevel: integer('kyc_level').default(0),
  verified: boolean('verified').default(false),
  twoFactorSecret: varchar('two_factor_secret', { length: 64 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Query examples
import { db } from './db';
import { eq, and, desc } from 'drizzle-orm';

// Select user by email
const user = await db.select()
  .from(users)
  .where(eq(users.email, 'user@example.com'))
  .limit(1);

// Insert new order
const order = await db.insert(orders).values({
  userId: user.id,
  symbol: 'BTC/USDT',
  side: 'buy',
  amount: '0.001',
  price: '65000',
}).returning();

// Update order status
await db.update(orders)
  .set({ status: 'filled', updatedAt: new Date() })
  .where(eq(orders.id, orderId));

// Complex query with joins
const userOrders = await db.select({
  order: orders,
  user: users,
})
  .from(orders)
  .leftJoin(users, eq(orders.userId, users.id))
  .where(eq(users.id, userId))
  .orderBy(desc(orders.createdAt))
  .limit(10);
```

| Package | Version | Purpose |
|---------|---------|---------|
| **drizzle-orm** | 0.39.1 | Type-safe ORM |
| **drizzle-kit** | 0.31.5 | Database migrations |
| **drizzle-zod** | 0.7.0 | Generate Zod schemas from Drizzle |
| **pg** | 8.16.3 | PostgreSQL client |
| **@neondatabase/serverless** | 0.10.4 | Neon serverless driver |

**Environment Variables:**

```bash
DATABASE_URL="postgres://postgres:password@localhost:5432/nebulax_exchange_db"
```

**Migration Workflow:**

```bash
# Generate migration
pnpm drizzle-kit generate:pg

# Push schema to database
pnpm db:push

# Run migration
pnpm migrate
```

---

## Blockchain & Web3

### Multi-Chain Support

```typescript
// Chain configuration
export const SUPPORTED_CHAINS = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
  },
  polygon: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
  },
} as const;

// Default network (from .env)
export const DEFAULT_NETWORK = process.env.DEFAULT_NETWORK || 'arbitrum';
export const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://arb1.arbitrum.io/rpc';
export const CHAIN_ID = parseInt(process.env.CHAIN_ID || '42161');
```

### 0x Protocol Integration (DEX Aggregation)

```typescript
// 0x Protocol for crypto swaps
import { SwapQuoter } from '@0x/swap-ts-sdk';

const quoter = new SwapQuoter({
  chainId: CHAIN_ID,
  apiKey: process.env.ZERO_X_API_KEY,
});

// Get swap quote
async function getSwapQuote(params: {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  takerAddress: string;
}) {
  const quote = await quoter.getQuote({
    sellToken: params.sellToken,
    buyToken: params.buyToken,
    sellAmount: params.sellAmount,
    takerAddress: params.takerAddress,
    slippagePercentage: 0.01, // 1% slippage
  });

  return {
    price: quote.price,
    guaranteedPrice: quote.guaranteedPrice,
    to: quote.to,
    data: quote.data,
    value: quote.value,
    gasPrice: quote.gasPrice,
    estimatedGas: quote.estimatedGas,
  };
}

// Execute swap
async function executeSwap(quote: any, walletClient: any) {
  const hash = await walletClient.sendTransaction({
    to: quote.to,
    data: quote.data,
    value: quote.value,
  });

  return hash;
}
```

**Environment Variables:**

```bash
# 0x Protocol
ZERO_X_API_KEY=your_0x_api_key
VITE_ZERO_X_API_KEY=your_0x_api_key  # Frontend

# Gasless approvals
PAIRING_CODE=your_pairing_code
```

### Hyperliquid Integration (Trading)

```typescript
// Hyperliquid API integration
import { Hyperliquid } from '@nktkas/hyperliquid';

const hl = new Hyperliquid({
  testnet: process.env.HYPERLIQUID_TESTNET === 'true',
  walletAddress: process.env.HYPERLIQUID_WALLET,
  privateKey: process.env.HYPERLIQUID_PRIVATE_KEY,
});

// Place order
async function placeOrder(params: {
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  size: number;
}) {
  const order = await hl.placeOrder({
    coin: params.symbol,
    isBuy: params.side === 'buy',
    px: params.price,
    sz: params.size,
    orderType: { limit: { tif: 'Gtc' } },
  });

  return order;
}
```

**Environment Variables:**

```bash
HYPERLIQUID_TESTNET=false
HYPERLIQUID_WALLET=0x...
HYPERLIQUID_PRIVATE_KEY=...
```

---

## Payment Integrations

### Stripe (Credit/Debit Cards)

```typescript
// Stripe setup
import Stripe from 'stripe';

const stripe = new Stripe(
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_LIVE_SECRET_KEY!
    : process.env.STRIPE_SECRET_KEY!,
  { apiVersion: '2024-11-20.acacia' }
);

// Create payment intent
async function createPaymentIntent(amount: number, currency: string) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    automatic_payment_methods: { enabled: true },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
  };
}

// Webhook handler
import { Webhook } from 'stripe';

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
  }

  res.json({ received: true });
});
```

**Environment Variables:**

```bash
# Stripe (Development)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe (Production)
STRIPE_LIVE_SECRET_KEY=sk_live_...
VITE_STRIPE_LIVE_KEY=pk_live_...
```

### OnRamp Money (Fiat-to-Crypto)

```typescript
// OnRamp Money integration
interface OnRampOrderParams {
  fiatAmount: number;
  fiatCurrency: string;
  cryptoCurrency: string;
  network: string;
  walletAddress: string;
  paymentMethod: number;
}

async function createOnRampOrder(userId: string, params: OnRampOrderParams) {
  const merchantRecognitionId = `${userId}-${Date.now()}`;

  const orderData = {
    appId: parseInt(process.env.ONRAMP_APP_ID || '2'),
    fiatType: getFiatTypeCode(params.fiatCurrency),
    fiatAmount: params.fiatAmount,
    cryptoAmount: 0, // Will be calculated by OnRamp
    cryptoCurrency: params.cryptoCurrency,
    network: params.network,
    walletAddress: params.walletAddress,
    paymentMethod: params.paymentMethod,
    merchantRecognitionId,
    redirectUrl: `${process.env.FRONTEND_URL}/onramp/callback`,
  };

  // Save to database
  const order = await db.insert(onrampMoneyOrders).values({
    userId,
    ...orderData,
  }).returning();

  // Return OnRamp URL
  return {
    onrampUrl: `${process.env.ONRAMP_BASE_URL}/order/${merchantRecognitionId}`,
    orderId: order[0].id,
  };
}

// Webhook signature verification
import crypto from 'crypto';

function verifyOnRampWebhook(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha512', process.env.ONRAMP_API_KEY!)
    .update(payload)
    .digest('hex')
    .toUpperCase();

  return expectedSignature === signature;
}
```

**Environment Variables:**

```bash
# OnRamp Money
ONRAMP_APP_ID=your_app_id
ONRAMP_API_KEY=your_api_key
ONRAMP_BASE_URL=https://onramp.money
FRONTEND_URL=http://localhost:5000
```

**Supported Currencies:**
- Fiat: GBP, USD, EUR, INR, TRY, AED, MXN, VND, NGN
- Crypto: USDT, USDC, BUSD, ETH, BNB, MATIC, SOL
- Networks: BEP20, MATIC20, ERC20, TRC20, Solana

### NowPayments (Crypto Payments)

**Environment Variables:**

```bash
NOWPAYMENT_API_KEY=...
NOWPAYMENT_PUBLIC_KEY=...
NOWPAYMENT_IPN_SECRET_KEY=...
NOWPAYMENT_PAYMENT_LINK=https://nowpayments.io
```

### ChangeNow (Crypto Exchange)

**Environment Variables:**

```bash
CHANGENOW_API_KEY=...
```

### PayPal Integration

```typescript
import { PayPalServerSDK } from '@paypal/paypal-server-sdk';

const paypal = new PayPalServerSDK({
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
});
```

---

## External APIs & Services

### AI & Market Intelligence

#### Groq API (AI Trading Insights)

```typescript
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
});

// Generate trading signal
async function generateTradingSignal(symbol: string, marketData: any) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a professional cryptocurrency trading analyst.',
      },
      {
        role: 'user',
        content: `Analyze ${symbol} with the following data: ${JSON.stringify(marketData)}`,
      },
    ],
    model: 'llama-3.1-70b-versatile',
    temperature: 0.7,
    max_tokens: 1000,
  });

  return completion.choices[0]?.message?.content;
}
```

**Environment Variables:**

```bash
GROK_API_KEY=gsk_...
```

#### Anthropic Claude (Alternative AI)

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function analyzeMarket(prompt: string) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content;
}
```

### Market Data APIs

#### CoinGecko (Price & Market Data)

```typescript
// CoinGecko API
async function getCoinPrice(coinId: string) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`,
    {
      headers: {
        'x-cg-pro-api-key': process.env.COINGECKO_API_KEY,
      },
    }
  );

  return response.json();
}
```

**Environment Variables:**

```bash
COINGECKO_API_KEY=CG-...
```

### Session & Authentication

**Environment Variables:**

```bash
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
SESSION_SECRET=your_session_secret
```

### Email Configuration

**Environment Variables:**

```bash
FROM_EMAIL=noreply@nebulax.exchange
SUPPORT_EMAIL=support@nebulax.exchange
```

### Development Tools

**Environment Variables:**

```bash
NGROK_API_KEY=...  # For webhook testing
```

---

## Development Tools

### Code Quality & Linting

| Package | Version | Purpose |
|---------|---------|---------|
| **typescript** | 5.6.3 | Type checking |
| **tsx** | 4.19.1 | TypeScript execution |
| **esbuild** | 0.25.0 | Fast bundler |
| **cross-env** | 10.0.0 | Cross-platform env vars |
| **husky** | 9.1.7 | Git hooks |

### Testing

| Package | Version | Purpose |
|---------|---------|---------|
| **@playwright/test** | 1.54.2 | E2E testing |
| **supertest** | 7.1.3 | API testing |

**Test Scripts:**

```bash
# Run API tests
pnpm test:api

# Run Playwright tests
pnpm playwright test

# Health check
pnpm health
```

---

## Infrastructure & Deployment

### Build & Deployment

```bash
# Development
pnpm dev

# Production build
pnpm build:prod

# Start production server
pnpm start

# Database operations
pnpm db:push
pnpm migrate
pnpm partial-migrate

# Deployment
pnpm deploy
pnpm deploy:prod
```

### Environment Setup

```bash
# Required environment variables (.env)
DATABASE_URL=
GROK_API_KEY=
ETHEREUM_RPC_URL=
SENDGRID_API_KEY=
SESSION_SECRET=
COINGECKO_API_KEY=
CHANGENOW_API_KEY=
NOWPAYMENT_API_KEY=
NOWPAYMENT_PUBLIC_KEY=
NOWPAYMENT_IPN_SECRET_KEY=
ONRAMP_APP_ID=
ONRAMP_API_KEY=
STRIPE_SECRET_KEY=
VITE_STRIPE_PUBLIC_KEY=
STRIPE_WEBHOOK_SECRET=
ZERO_X_API_KEY=
VITE_ZERO_X_API_KEY=
HYPERLIQUID_WALLET=
HYPERLIQUID_PRIVATE_KEY=
JWT_SECRET=
JWT_EXPIRATION=7d
FRONTEND_URL=http://localhost:5000
```

### Docker Support

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 5000

CMD ["pnpm", "start"]
```

---

## Testing & Quality Assurance

### Testing Strategy

**1. Unit Tests**
- Component testing with React Testing Library
- Service layer testing
- Utility function testing

**2. Integration Tests**
- API endpoint testing with Supertest
- Database integration tests
- External API mocks

**3. E2E Tests**
- Critical user flows with Playwright
- Trading flow testing
- Payment flow testing

**4. Performance Tests**
- Chart rendering performance
- Real-time data updates
- Load testing for high-frequency trading

### Code Quality Checklist

- ✅ TypeScript strict mode enabled
- ✅ ESLint configured
- ✅ Prettier for code formatting
- ✅ Husky pre-commit hooks
- ✅ 80%+ test coverage goal
- ✅ No console.log in production
- ✅ Security audit with npm audit

---

## Best Practices

### Frontend Best Practices

```typescript
// ✅ DO: Use React Query for server state
const { data, isLoading } = useQuery(['orders'], fetchOrders);

// ❌ DON'T: Use useState for server data
const [orders, setOrders] = useState([]);
useEffect(() => { fetchOrders().then(setOrders); }, []);

// ✅ DO: Use Zod for validation
const schema = z.object({ email: z.string().email() });

// ❌ DON'T: Manual validation
if (!email.includes('@')) throw new Error('Invalid email');

// ✅ DO: Use TradingView Lightweight Charts for candlesticks
import { createChart } from 'lightweight-charts';

// ❌ DON'T: Use Chart.js for trading charts
import { Line } from 'react-chartjs-2';
```

### Backend Best Practices

```typescript
// ✅ DO: Use service layer
class OrderService {
  async placeOrder(userId: string, data: any) { /* ... */ }
}

// ❌ DON'T: Put logic in routes
app.post('/orders', (req, res) => {
  // Complex business logic here
});

// ✅ DO: Use Drizzle ORM
const users = await db.select().from(usersTable);

// ❌ DON'T: Raw SQL strings
const users = await db.query('SELECT * FROM users');

// ✅ DO: Validate with Zod
const validated = orderSchema.parse(req.body);

// ❌ DON'T: Trust user input
const order = req.body; // No validation
```

### Security Best Practices

```typescript
// ✅ DO: Use environment variables
const apiKey = process.env.API_KEY;

// ❌ DON'T: Hardcode secrets
const apiKey = 'sk_live_1234567890';

// ✅ DO: Verify webhook signatures
const isValid = verifySignature(payload, signature);

// ❌ DON'T: Trust all webhooks
await processWebhook(req.body);

// ✅ DO: Implement rate limiting
app.use('/api/', rateLimiter);

// ❌ DON'T: Allow unlimited requests
```

---

## Quick Reference

### Chart Library Decision Matrix

| Use Case | Library | Why |
|----------|---------|-----|
| Candlestick charts | **Lightweight Charts** | Optimized for financial data, 60fps |
| Price line charts | **Lightweight Charts** | Real-time updates, smooth rendering |
| Volume bars | **Lightweight Charts** | Integrated with price charts |
| Portfolio pie charts | **Recharts** | Simple, responsive, easy to use |
| P&L line charts | **Chart.js** | Flexible, good for dashboards |
| Order book depth | **D3** | Custom visualization needed |
| Heatmaps | **D3** | Maximum flexibility |

### API Integration Priority

| Priority | Service | Purpose |
|----------|---------|---------|
| **P0 (Critical)** | PostgreSQL | Database |
| **P0 (Critical)** | 0x Protocol | DEX swaps |
| **P0 (Critical)** | Viem/Wagmi | Web3 connectivity |
| **P1 (High)** | OnRamp Money | Fiat onboarding |
| **P1 (High)** | Stripe | Card payments |
| **P1 (High)** | Groq API | AI features |
| **P2 (Medium)** | Hyperliquid | Trading (if needed) |
| **P2 (Medium)** | CoinGecko | Market data |
| **P3 (Low)** | NowPayments | Alternative payments |
| **P3 (Low)** | ChangeNow | Alternative swaps |

---

## Support & Resources

### Documentation Links

- [React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Viem](https://viem.sh)
- [Wagmi](https://wagmi.sh)
- [0x Protocol](https://0x.org/docs/api)
- [OnRamp Money](https://docs.onramp.money)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction)

### Getting Help

- Review [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) for WHY decisions were made
- Check [GETTING_STARTED.md](./GETTING_STARTED.md) for setup instructions
- See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for task tracking
- Consult [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) for API details

---

**Last Updated:** 2025-11-18
**Maintainer:** Development Team
**Version:** 1.0
