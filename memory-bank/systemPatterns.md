# System Patterns - NebulaX

## Core Architectural Patterns

### 1. Data Flow Architecture
```
User Interface → React Query → API Services → Hyperliquid API
     ↓              ↓             ↓              ↓
Local State ← Cache Management ← Error Handling ← Data Transformation
```

### 2. Component Hierarchy Pattern
```
App (Router)
├── Trading Dashboard
│   ├── TradingChart (Live data + historical)
│   ├── OrderBook (Real-time depth)
│   ├── MarketDataStatus (Connection health)
│   └── HyperliquidTradingPanel (Order management)
├── Markets Overview
│   ├── SimpleMarketTable (Market list)
│   └── MarketDataStatus
└── Professional Trading Page
    ├── Advanced Charting
    ├── Portfolio Management
    └── Trading Tools
```

### 3. State Management Pattern
- **Server State**: React Query with automatic refetching
- **Client State**: Local React state for UI interactions
- **Global State**: Context providers for auth/theme
- **Persistent State**: LocalStorage for preferences

## Key Design Patterns

### 1. Real-Time Data Pattern
```typescript
// Live price updates with React Query
const { data: priceData } = useQuery({
  queryKey: ['hyperliquid', 'allmids'],
  queryFn: getHyperliquidAllMids,
  refetchInterval: 3000, // 3-second updates
  retry: 2,
});
```

### 2. Chart Update Pattern
```typescript
// Smooth chart updates without reset
useEffect(() => {
  if (!chartRef.current || !chartData.length) return;
  
  // Update entire dataset for reliability
  const newData = updateLastCandle(chartData, currentPrice);
  candlestickSeriesRef.current.setData(newData);
}, [currentPrice]);
```

### 3. Error Recovery Pattern
```typescript
// Graceful fallback to mock data
const dataToUse = historicalData && historicalData.length > 0 
  ? historicalData 
  : generateFallbackData(currentPrice);
```

### 4. Type Safety Pattern
```typescript
// Strong typing for API responses
interface OrderBookResponse {
  coin: string;
  time: number;
  levels: [OrderBookLevel[], OrderBookLevel[]]; // [bids, asks]
}
```

## Component Communication Patterns

### 1. Parent-Child Communication
- Props drilling for direct parent-child relationships
- Callback functions for child-to-parent communication
- Context providers for cross-component state

### 2. Sibling Communication
- Shared parent state management
- React Query cache for shared server state
- Custom events for real-time updates

### 3. Service Layer Communication
```typescript
// Centralized API service layer
export const hyperliquidService = {
  getAllMids: () => fetch('/api/hyperliquid/allmids'),
  getOrderBook: (symbol: string) => fetch(`/api/hyperliquid/orderbook/${symbol}`),
  getCandleData: (symbol: string, interval: string) => 
    fetch(`/api/hyperliquid/candles/${symbol}?interval=${interval}`)
};
```

## Data Management Patterns

### 1. Caching Strategy
- **React Query**: Automatic caching with stale-while-revalidate
- **Time-based invalidation**: Different refresh rates for different data types
- **Optimistic updates**: UI updates before API confirmation
- **Background refetching**: Silent data updates without user interruption

### 2. Error Handling Pattern
```typescript
// Consistent error handling across components
try {
  const data = await fetchMarketData();
  return { success: true, data };
} catch (error) {
  console.error('[Component] Error:', error);
  return { success: false, error: error.message };
}
```

### 3. Loading State Pattern
```typescript
// Unified loading experience
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <NoDataMessage />;
return <DataComponent data={data} />;
```

## Performance Patterns

### 1. Rendering Optimization
- **React.memo**: For expensive components that don't need frequent re-renders
- **useMemo/useCallback**: For computed values and function references
- **Code splitting**: Route-based lazy loading
- **Virtual scrolling**: For large data lists

### 2. Data Fetching Optimization
- **Debouncing**: For search and filter operations
- **Request deduplication**: React Query's built-in request caching
- **Pagination**: For large datasets
- **Selective updates**: Only update changed data points

### 3. Chart Performance
- **Data sampling**: Reduce data points for better performance
- **Canvas rendering**: TradingView charts use canvas for smooth rendering
- **Efficient updates**: Update only the last candle instead of entire dataset
- **Zoom preservation**: Maintain user zoom/pan state during updates

## Security Patterns

### 1. Authentication Flow
```
User → Wallet Connection → Signature Verification → Session Token → Authenticated Access
```

### 2. API Security
- **Environment variables**: Sensitive data never hardcoded
- **Input validation**: Server-side validation for all inputs
- **Rate limiting**: Prevent API abuse
- **CORS configuration**: Proper cross-origin setup

### 3. Data Protection
- **HTTPS only**: All communications encrypted
- **No sensitive data in URLs**: Use request bodies for sensitive info
- **Session management**: Secure token handling
- **Database security**: Parameterized queries

## Testing Patterns

### 1. Component Testing
- **Unit tests**: Individual component functionality
- **Integration tests**: Component interaction testing
- **Snapshot tests**: UI consistency checking
- **Mock data**: Consistent test data generation

### 2. API Testing
- **Service mocking**: Mock external API calls
- **Error scenario testing**: Test failure modes
- **Performance testing**: Load testing critical paths
- **Contract testing**: API response validation

## Deployment Patterns

### 1. Environment Management
- **Development**: Local development with mock data
- **Staging**: Production-like environment with test data
- **Production**: Live environment with real data

### 2. Database Patterns
- **Migration system**: Version-controlled schema changes
- **Connection pooling**: Efficient database resource usage
- **Backup strategy**: Regular data backups
- **Rollback capability**: Quick reversion for failed deployments

### 3. Monitoring Patterns
- **Health checks**: Regular system status verification
- **Error tracking**: Centralized error logging
- **Performance monitoring**: Response time and throughput tracking
- **User analytics**: Behavior and usage pattern analysis

## OnRamp Money Integration Patterns

### 1. Fiat-to-Crypto On-Ramp Architecture
```
User → OnRampMoneyWidget → Backend API → OnRamp Money LP
  ↓                ↓              ↓              ↓
Order Created → URL Generated → User Redirect → Payment Processing
  ↓                                              ↓
Order Status ← Webhook Callback ← Status Update ← Transaction Complete
  ↓
Polling Mechanism (fallback)
```

### 2. Order Flow Pattern
```typescript
// 1. Order Creation
POST /api/onramp-money/create-order
  → Validates inputs (amount, currency, wallet)
  → Generates merchant recognition ID
  → Creates database record
  → Returns OnRamp Money URL

// 2. User Payment
  → User redirected to OnRamp Money platform
  → Completes payment via UPI/Bank Transfer
  → OnRamp Money processes transaction

// 3. Status Updates (Dual-Path)
  Path A: Webhook (Primary)
    POST /api/onramp-money/webhook
      → HMAC-SHA512 signature verification
      → Rate limiting check
      → Status code mapping
      → Database update

  Path B: Polling (Fallback)
    GET /api/onramp-money/order/:id
      → Every 10 seconds for pending orders
      → Silent background updates
      → Auto-refresh UI indicator
```

### 3. Security Pattern for OnRamp Integration
```typescript
// Multi-layer security approach
1. Webhook Signature Verification (HMAC-SHA512)
   - Primary security mechanism
   - Prevents unauthorized webhook calls
   - Logs verification failures with partial signatures

2. Rate Limiting
   - 100 requests/minute per IP
   - In-memory rate limiter with automatic cleanup
   - Prevents webhook abuse

3. Environment Variable Validation
   - Startup configuration validation
   - Warning logs for missing credentials
   - Graceful degradation
```

### 4. Error Handling Pattern
```typescript
// Robust error handling with user-friendly messages
try {
  const result = await onRampMoneyService.createOrder(request);
  if (!result.success) {
    return { error: result.error, suggestions: [...] };
  }
} catch (error) {
  console.error('[OnRamp Money]:', error);
  return {
    error: 'Service temporarily unavailable',
    fallback: 'Please try again or use alternative method'
  };
}
```

### 5. Polling Strategy Pattern
```typescript
// Smart polling for order status updates
useEffect(() => {
  if (order?.status !== 'pending') return;

  const interval = setInterval(() => {
    fetchOrderStatus(orderId, true); // Silent fetch
  }, 10000); // 10 seconds

  return () => clearInterval(interval);
}, [order?.status]);
```

### 6. Logging Optimization Pattern
```typescript
// Debug mode logging utility
const DEBUG_MODE =
  process.env.NODE_ENV === 'development' ||
  localStorage.getItem('DEBUG_0X') === 'true';

function debugLog(...args: any[]) {
  if (DEBUG_MODE) console.log(...args);
}

// Production: Minimal logging
// Development: Verbose logging with toggle
```

### 7. Configuration Validation Pattern
```typescript
// Startup validation with warnings
class OnRampMoneyService {
  constructor() {
    this.validateConfiguration();
  }

  private validateConfiguration(): void {
    const warnings: string[] = [];

    if (!this.config.apiKey) {
      warnings.push('ONRAMP_API_KEY not set');
    }

    if (warnings.length > 0) {
      console.warn('[OnRamp Money] Warnings:', warnings);
    }
  }
}
```

### 8. Database Order Management Pattern
```sql
-- Order lifecycle tracking
CREATE TABLE onramp_money_orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id VARCHAR, -- OnRamp's order ID
  merchant_recognition_id VARCHAR UNIQUE,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_user_status ON onramp_money_orders(user_id, status);
CREATE INDEX idx_order_id ON onramp_money_orders(order_id);
```
