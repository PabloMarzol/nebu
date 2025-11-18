# Architecture Decision Records (ADR)

This document captures key architectural decisions made for the new cryptocurrency trading platform.

---

## ADR-001: Monorepo Structure

**Status:** Approved
**Date:** 2025-11-18
**Context:** Need to decide on project organization strategy

### Decision

Adopt a monorepo structure using PNPM workspaces with the following organization:

```
crypto-platform/
├── apps/           # Applications (web, admin, mobile)
├── packages/       # Shared packages (ui, config, types, utils)
├── backend/        # Backend API server
└── shared/         # Shared schemas and types
```

### Rationale

1. **Code Sharing**: Easy sharing of types, components, and utilities
2. **Atomic Changes**: Change frontend and backend in a single commit
3. **Consistent Tooling**: Unified linting, testing, and build processes
4. **Better Developer Experience**: Single `pnpm install` for all dependencies

### Alternatives Considered

- **Polyrepo**: Rejected due to complexity in managing shared code
- **Turborepo**: Considered but overkill for initial project size

### Consequences

- Requires careful dependency management
- Build times may increase as project grows
- Need to implement proper caching strategies

---

## ADR-002: React Query for Server State

**Status:** Approved
**Date:** 2025-11-18
**Context:** Need robust solution for server state management

### Decision

Use **@tanstack/react-query** (React Query) for all server state management.

### Rationale

**Proven Success in NebulaX:**
- 169 instances of `useQuery`/`useMutation` in current codebase
- Excellent caching and deduplication
- Automatic background refetching
- Built-in loading/error states
- Optimistic updates support

**Key Benefits:**
```typescript
// Automatic caching and deduplication
const { data, isLoading } = useQuery({
  queryKey: ['market-data', symbol],
  queryFn: () => fetchMarketData(symbol),
  staleTime: 5000,        // Data fresh for 5 seconds
  refetchInterval: 5000,  // Auto-refresh every 5 seconds
});

// Mutations with cache invalidation
const mutation = useMutation({
  mutationFn: placeOrder,
  onSuccess: () => {
    queryClient.invalidateQueries(['orders']);
  },
});
```

### Alternatives Considered

- **Redux Toolkit Query**: More boilerplate, steeper learning curve
- **SWR**: Less features, smaller ecosystem
- **Custom fetch hooks**: Reinventing the wheel

### Consequences

- Need to structure query keys properly
- Must understand cache invalidation
- Bundle size increase (~13kb gzipped)

---

## ADR-003: Drizzle ORM over Prisma

**Status:** Approved
**Date:** 2025-11-18
**Context:** Database ORM selection

### Decision

Use **Drizzle ORM** instead of Prisma for database access.

### Rationale

**NebulaX Uses Drizzle Successfully:**
- 140+ tables managed with Drizzle schemas
- Type-safe queries with excellent TypeScript inference
- SQL-like query builder (easier for developers familiar with SQL)
- Smaller runtime footprint
- Better performance for complex queries

**Example:**
```typescript
// Clear, type-safe queries
const orders = await db
  .select()
  .from(ordersTable)
  .where(eq(ordersTable.userId, userId))
  .orderBy(desc(ordersTable.createdAt))
  .limit(10);
```

### Alternatives Considered

- **Prisma**: Heavier runtime, less control over SQL
- **TypeORM**: Decorator-based, verbose
- **Kysely**: Good but less ecosystem support

### Consequences

- Manual migration files (SQL)
- Slightly more boilerplate for relations
- Better performance and bundle size

---

## ADR-004: Feature-Based Frontend Structure

**Status:** Approved
**Date:** 2025-11-18
**Context:** Frontend code organization

### Decision

Organize frontend code by **features** rather than technical layers.

### Structure

```
src/features/
├── auth/           # All auth-related code
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types.ts
├── trading/        # All trading code
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types.ts
└── swap/           # All swap code
```

### Rationale

**Proven in NebulaX:**
- 50+ component categories organized by feature
- Easy to find related code
- Better encapsulation and reusability
- Scales well as features grow

**Benefits:**
- New developers can understand features independently
- Easy to delete/refactor entire features
- Clear boundaries between domains
- Supports parallel development

### Alternatives Considered

- **Technical Layers** (components/, hooks/, services/): Rejected - hard to find related code
- **Domain-Driven Design**: Too complex for initial implementation

### Consequences

- Need clear guidelines for shared code
- May have some code duplication across features
- Requires discipline to maintain boundaries

---

## ADR-005: Viem + Wagmi for Web3

**Status:** Approved
**Date:** 2025-11-18
**Context:** Web3 library selection

### Decision

Use **viem** (low-level) + **wagmi** (React hooks) for all Web3 interactions.

### Rationale

**Modern, TypeScript-First Stack:**
```typescript
// Type-safe, modern API
const { data: balance } = useBalance({
  address: walletAddress,
});

const { writeContract } = useWriteContract();

await writeContract({
  address: tokenAddress,
  abi: ERC20_ABI,
  functionName: 'approve',
  args: [spenderAddress, amount],
});
```

**NebulaX Already Uses This:**
- viem 2.38.0 in current codebase
- wagmi 2.19.2 for React integration
- Excellent TypeScript support
- Better performance than ethers.js
- Smaller bundle size

### Alternatives Considered

- **ethers.js v6**: Still in codebase but being phased out
- **web3.js**: Outdated, poor TypeScript support

### Consequences

- Learning curve for developers used to ethers.js
- Smaller ecosystem compared to ethers (but growing)
- Better DX and performance

---

## ADR-006: WebSocket Context for Real-Time Data

**Status:** Approved
**Date:** 2025-11-18
**Context:** Real-time price and market data

### Decision

Use **React Context + Socket.io** for real-time data distribution.

### Pattern

```typescript
// Provider wraps app
<LiveDataProvider>
  <App />
</LiveDataProvider>

// Components subscribe
const { prices } = useLiveData();
```

### Rationale

**NebulaX Pattern Analysis:**
- `LiveDataProvider` handles WebSocket connection
- `HyperliquidDataProvider` for exchange data
- Single WebSocket connection shared across app
- Automatic cleanup on unmount

**Benefits:**
- Single source of truth
- Reduced WebSocket connections
- Easy to mock for testing
- Type-safe data access

### Alternatives Considered

- **useWebSocket hook per component**: Too many connections
- **Redux middleware**: Too complex
- **React Query subscriptions**: Not designed for WebSockets

### Consequences

- Need to handle connection state carefully
- Reconnection logic required
- Memory leaks possible if not cleaned up

---

## ADR-007: 0x Protocol for DEX Aggregation

**Status:** Approved
**Date:** 2025-11-18
**Context:** Crypto-to-crypto swap provider

### Decision

Use **0x Protocol v2** for decentralized exchange aggregation.

### Rationale

**NebulaX Uses 0x Successfully:**
- Multi-chain support (Ethereum, Polygon, Arbitrum, BSC, Base, Optimism)
- Aggregates liquidity from multiple DEXes
- Competitive pricing and gas optimization
- Gasless swaps support
- Well-documented API

**Integration Points:**
```typescript
// Simple quote fetching
const quote = await fetch(
  `https://api.0x.org/swap/v1/quote?${params}`,
  { headers: { '0x-api-key': API_KEY } }
);

// Execute swap
await walletClient.sendTransaction({
  to: quote.to,
  data: quote.data,
  value: quote.value,
});
```

### Alternatives Considered

- **1inch**: Good but more complex API
- **ParaSwap**: Less chain support
- **Direct DEX integration**: Too much maintenance

### Consequences

- Dependency on 0x API availability
- Need to handle API rate limits
- API key management required

---

## ADR-008: OnRamp Money for Fiat Onboarding

**Status:** Approved
**Date:** 2025-11-18
**Context:** Fiat-to-crypto conversion provider

### Decision

Use **OnRamp Money** as primary fiat onboarding provider.

### Rationale

**Already Integrated in NebulaX:**
- Multi-currency support (GBP, USD, EUR, INR)
- Multi-network delivery (Ethereum, Polygon, BSC, Arbitrum)
- Multiple payment methods
- Competitive fees
- Webhook callbacks for status updates

**User Flow:**
```
User Input → Quote → Payment → Order Tracking → Crypto Delivery
```

### Alternatives Considered

- **RAMP**: Already integrated as secondary option
- **ALT5**: Used for GBP trading specifically
- **Stripe + Custom**: Too complex to build/maintain

### Consequences

- Need to maintain multiple provider integrations
- Provider fees impact user experience
- KYC requirements vary by provider

---

## ADR-009: Groq API for AI Trading Features

**Status:** Approved
**Date:** 2025-11-18
**Context:** AI trading assistance and signals

### Decision

Use **Groq API** with LLaMA models for AI features.

### Rationale

**NebulaX Implementation:**
```typescript
// Fast inference with Groq
const completion = await groq.chat.completions.create({
  messages: [
    { role: 'system', content: tradingExpertPrompt },
    { role: 'user', content: userQuery },
  ],
  model: 'llama-3.1-70b-versatile',
  temperature: 0.7,
});
```

**Benefits:**
- Extremely fast inference (much faster than OpenAI)
- Cost-effective for high-volume requests
- Good quality for financial analysis
- Supports function calling

**Use Cases:**
- Trading signal generation
- Market sentiment analysis
- Portfolio optimization suggestions
- Natural language command parsing

### Alternatives Considered

- **OpenAI GPT-4**: Too expensive for real-time features
- **Anthropic Claude**: Good but slower
- **Local models**: Infrastructure complexity

### Consequences

- API dependency and costs
- Need prompt engineering
- Rate limiting considerations

---

## ADR-010: TailwindCSS for Styling

**Status:** Approved
**Date:** 2025-11-18
**Context:** CSS framework selection

### Decision

Use **Tailwind CSS 3.4+** with custom theme system.

### Rationale

**NebulaX Success:**
- Utility-first approach speeds development
- Custom themes via CSS variables
- Excellent dark mode support
- Small production bundle (with PurgeCSS)
- Great IDE support (autocomplete)

**Theme Implementation:**
```typescript
// CSS variables for themes
:root {
  --background: 0 0% 5%;
  --foreground: 0 0% 95%;
  --primary: 262 83% 70%;
}

// Apply with Tailwind
<div className="bg-background text-foreground border-primary">
```

### Alternatives Considered

- **Styled Components**: Runtime cost, larger bundle
- **CSS Modules**: More boilerplate
- **Vanilla CSS**: Too much manual work

### Consequences

- Longer class names
- Need to configure PurgeCSS properly
- Custom components require Tailwind knowledge

---

## ADR-011: JWT for Authentication

**Status:** Approved
**Date:** 2025-11-18
**Context:** Authentication token strategy

### Decision

Use **JWT tokens** for API authentication after wallet signature verification.

### Flow

```
1. User signs message with wallet
2. Backend verifies signature (EIP-191)
3. Backend issues JWT token (7-day expiry)
4. Client includes token in Authorization header
5. Backend verifies JWT on each request
```

### Rationale

- Stateless authentication
- No session storage needed
- Easy to scale horizontally
- Standard Bearer token pattern
- Can include user metadata in token

### Implementation

```typescript
// Generate token
const token = jwt.sign(
  { id: user.id, walletAddress },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Verify token
const payload = jwt.verify(token, JWT_SECRET);
```

### Alternatives Considered

- **Session-based auth**: Requires Redis/DB, harder to scale
- **OAuth 2.0**: Overkill for Web3 app

### Consequences

- Need secure JWT_SECRET management
- Token refresh mechanism needed
- Logout requires token blacklisting or short expiry

---

## ADR-012: PostgreSQL as Primary Database

**Status:** Approved
**Date:** 2025-11-18
**Context:** Database selection

### Decision

Use **PostgreSQL 15+** (via Neon/Supabase) as primary database.

### Rationale

**NebulaX Requirements:**
- 140+ tables with complex relationships
- JSONB support for flexible data (order metadata, AI analysis)
- Strong ACID guarantees for financial data
- Excellent indexing for performance
- Full-text search capabilities
- Mature ecosystem and tooling

**Key Features Used:**
- JSONB columns for flexible data
- Composite indexes for query optimization
- Transactions for order execution
- Audit trails with timestamps
- Foreign keys for referential integrity

### Alternatives Considered

- **MongoDB**: Lacks strong consistency for financial data
- **MySQL**: Good but PostgreSQL has better JSON support
- **Timescale**: Considered for time-series but PostgreSQL sufficient

### Consequences

- Need proper indexing strategy
- Migrations must be carefully planned
- Backup and recovery procedures critical

---

## ADR-013: Express.js for Backend Framework

**Status:** Approved
**Date:** 2025-11-18
**Context:** Backend framework selection

### Decision

Use **Express.js 4.x** with TypeScript.

### Rationale

**NebulaX Implementation:**
- Mature, stable framework
- Huge ecosystem of middleware
- Simple, unopinionated
- Excellent TypeScript support
- Easy to test

**Middleware Stack:**
```typescript
app.use(helmet());              // Security headers
app.use(cors());                // CORS
app.use(express.json());        // JSON parsing
app.use(rateLimiter);          // Rate limiting
app.use(requestLogger);        // Logging
app.use('/api', routes);       // API routes
app.use(errorHandler);         // Error handling
```

### Alternatives Considered

- **Fastify**: Faster but less ecosystem
- **NestJS**: Too opinionated, steep learning curve
- **Koa**: Smaller ecosystem
- **Hono**: Too new, less mature

### Consequences

- Need to manually structure code
- Security middleware must be added
- More boilerplate than opinionated frameworks

---

## ADR-014: Service Layer Pattern

**Status:** Approved
**Date:** 2025-11-18
**Context:** Backend code organization

### Decision

Implement **Service Layer** pattern for business logic.

### Structure

```
Routes → Controllers → Services → Database
```

### Example

```typescript
// Route
router.post('/orders', authenticate, tradingController.placeOrder);

// Controller
async placeOrder(req, res, next) {
  const order = await orderExecutionService.placeOrder(
    req.user.id,
    req.body
  );
  res.status(201).json(order);
}

// Service
class OrderExecutionService {
  async placeOrder(userId, orderData) {
    await this.validateBalance(userId, orderData);
    const order = await db.insert(orders).values(...);
    await this.matchOrder(order);
    return order;
  }
}
```

### Rationale

**NebulaX Has 73 Services:**
- Clear separation of concerns
- Reusable business logic
- Easy to test in isolation
- Support for complex workflows

### Consequences

- More files and boilerplate
- Need clear service boundaries
- Services can become too large if not managed

---

## ADR-15: Zod for Runtime Validation

**Status:** Approved
**Date:** 2025-11-18
**Context:** Request validation and type safety

### Decision

Use **Zod** for schema validation on both frontend and backend.

### Rationale

**Type-Safe Validation:**
```typescript
// Define schema once
const placeOrderSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(['buy', 'sell']),
  amount: z.number().positive(),
});

// Use in React Hook Form
const form = useForm({
  resolver: zodResolver(placeOrderSchema),
});

// Use on backend
const validatedData = placeOrderSchema.parse(req.body);
```

**Benefits:**
- TypeScript inference from schemas
- Shared validation between client/server
- Excellent error messages
- Composable schemas
- Integration with Drizzle ORM

### Alternatives Considered

- **Yup**: Less TypeScript support
- **Joi**: Node-only, no TS inference
- **io-ts**: More complex API

### Consequences

- Bundle size increase (~8kb gzipped)
- Learning curve for complex schemas
- Need to maintain schemas alongside types

---

## Summary

These 15 Architecture Decision Records form the foundation of the new cryptocurrency trading platform. Each decision is based on:

1. **Proven patterns** from the NebulaX codebase analysis
2. **Modern best practices** in web development
3. **Scalability** and maintainability considerations
4. **Developer experience** optimization

**Next Steps:**
1. Review and approve ADRs
2. Begin Phase 1 implementation
3. Document new decisions as they arise
4. Iterate based on real-world usage

---

**Maintained by:** Development Team
**Last Updated:** 2025-11-18
