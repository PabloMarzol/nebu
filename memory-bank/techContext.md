# Technical Context - NebulaX

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: TradingView Lightweight Charts v5
- **State Management**: React Query (TanStack Query) for server state
- **HTTP Client**: Native fetch API with React Query
- **Build Tool**: Vite with TypeScript support

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with modular route structure
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom wallet-based authentication
- **Market Data**: Hyperliquid API integration
- **WebSocket**: Real-time market data feeds

### Key Dependencies
- **TradingView Charts**: v5 for professional charting
- **React Query**: v5 for data fetching and caching
- **Tailwind CSS**: v3 for responsive styling
- **Express**: v4 for API server
- **Drizzle ORM**: For database operations
- **Hyperliquid SDK**: Custom integration for market data

## Architecture Patterns

### Component Architecture
- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Feature-Based Structure**: Components grouped by functionality (trading, markets, etc.)
- **Custom Hooks**: Reusable logic extracted into custom React hooks
- **Service Layer**: API calls abstracted into service functions

### Data Flow Patterns
- **React Query**: Centralized data fetching with automatic caching
- **Optimistic Updates**: UI updates before API confirmation for better UX
- **Error Boundaries**: Graceful error handling at component level
- **Loading States**: Consistent loading indicators across the platform

### State Management Strategy
- **Server State**: Managed by React Query with automatic synchronization
- **Client State**: Local React state for UI interactions
- **Global State**: Context providers for authentication and theme
- **Persistent State**: Local storage for user preferences

## API Integration Patterns

### Hyperliquid Integration
- **Real-time Data**: WebSocket connections for live price feeds
- **RESTful APIs**: HTTP endpoints for historical data and trading
- **Error Handling**: Retry logic with exponential backoff
- **Rate Limiting**: Respectful API usage with request throttling

### Data Transformation
- **Type Safety**: Strong typing for all API responses
- **Data Normalization**: Consistent data structures across components
- **Caching Strategy**: Intelligent caching based on data volatility
- **Fallback Handling**: Graceful degradation when APIs fail

## Security Considerations

### Authentication
- **Wallet-Based Auth**: Users connect via Web3 wallets
- **Session Management**: Secure token-based sessions
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation for all user inputs

### Data Protection
- **Environment Variables**: Sensitive data stored in .env files
- **HTTPS Enforcement**: All communications encrypted
- **Database Security**: Parameterized queries to prevent SQL injection
- **API Key Management**: Secure storage and rotation of API credentials

## Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Lazy loading for route-based components
- **Image Optimization**: WebP format with responsive sizing
- **Bundle Analysis**: Regular analysis and optimization
- **Caching Strategy**: Service worker for offline functionality

### Backend Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Response Compression**: Gzip compression for API responses
- **Caching Layers**: Redis for frequently accessed data

## Development Workflow

### Code Quality
- **TypeScript**: Strict typing throughout the codebase
- **ESLint**: Code linting with custom rules
- **Prettier**: Consistent code formatting
- **Pre-commit Hooks**: Automated quality checks

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Critical user flow testing
- **Performance Tests**: Load testing for high-traffic scenarios

### Deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Environment Management**: Development, staging, production configs
- **Database Migrations**: Version-controlled schema changes
- **Rollback Strategy**: Quick reversion for failed deployments

## OnRamp Money Integration - Technical Details

### Integration Architecture
- **Service**: OnRamp Money LP (Liquidity Provider)
- **Purpose**: Fiat-to-crypto on-ramp for seamless token purchases
- **Authentication**: HMAC-SHA512 webhook signature verification
- **Supported Currencies**: INR, TRY, AED, MXN, VND, NGN
- **Supported Cryptos**: USDT, USDC, BUSD, ETH, BNB, MATIC, SOL
- **Networks**: BEP20, MATIC20, ERC20, TRC20, Solana

### Environment Variables Required
```bash
# OnRamp Money Configuration
ONRAMP_APP_ID=your_app_id          # Get from OnRamp Money dashboard
ONRAMP_API_KEY=your_api_key        # For webhook signature verification
ONRAMP_BASE_URL=https://onramp.money  # Base URL for OnRamp Money platform
FRONTEND_URL=https://your-domain.com  # Your frontend URL for redirects
```

### API Endpoints
```
# User-facing endpoints (require authentication)
POST   /api/onramp-money/create-order    # Create new order
GET    /api/onramp-money/order/:id       # Get order status
GET    /api/onramp-money/orders           # Get user order history

# Webhook endpoint (OnRamp Money server-to-server)
POST   /api/onramp-money/webhook          # Status update callback

# Public endpoints
GET    /api/onramp-money/currencies       # Supported fiat currencies
GET    /api/onramp-money/cryptos          # Supported cryptocurrencies

# Redirect handler
GET    /api/onramp-money/callback         # User redirect after payment
```

### Database Schema
```sql
-- OnRamp Money orders table
CREATE TABLE onramp_money_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  order_id VARCHAR(255),                    -- OnRamp's order ID
  merchant_recognition_id VARCHAR(255) UNIQUE,
  fiat_amount DECIMAL(10, 2) NOT NULL,
  fiat_currency VARCHAR(10) NOT NULL,
  fiat_type INTEGER NOT NULL,
  crypto_amount DECIMAL(18, 8),
  crypto_currency VARCHAR(20) NOT NULL,
  network VARCHAR(50) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  payment_method INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  onramp_url TEXT,
  redirect_url TEXT,
  phone_number VARCHAR(50),
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_onramp_orders_user_id ON onramp_money_orders(user_id);
CREATE INDEX idx_onramp_orders_status ON onramp_money_orders(status);
CREATE INDEX idx_onramp_orders_order_id ON onramp_money_orders(order_id);
CREATE INDEX idx_onramp_orders_merchant_id ON onramp_money_orders(merchant_recognition_id);
CREATE INDEX idx_onramp_orders_created_at ON onramp_money_orders(created_at DESC);
```

## OnRamp Money Troubleshooting Guide

### Issue 1: 401 Unauthorized Error on Order Creation

**Symptoms:**
- API returns 401 status code
- Error message: "Authentication required"

**Possible Causes:**
1. User not authenticated (wallet not connected)
2. Session cookie expired
3. Auth middleware not configured correctly

**Solutions:**
```typescript
// Check authentication status
const { isAuthenticated } = useWalletAuth();
if (!isAuthenticated) {
  // Prompt user to connect wallet
  return <ConnectWalletPrompt />;
}

// Verify session cookie is included in request
fetch('/api/onramp-money/create-order', {
  credentials: 'include',  // Required for session cookies
  method: 'POST',
  body: JSON.stringify(orderData)
});
```

**Verification Steps:**
1. Check browser console for authentication errors
2. Verify `requireAuth` middleware is applied to route
3. Check server logs for authentication failures
4. Verify user session exists in database

---

### Issue 2: Webhook Signature Verification Failed

**Symptoms:**
- Webhook returns 403 Forbidden
- Server log: "Webhook signature verification failed"
- Order status not updating

**Possible Causes:**
1. `ONRAMP_API_KEY` environment variable not set
2. API key mismatch between OnRamp dashboard and server
3. Payload modification in transit
4. Signature header missing or malformed

**Solutions:**
```bash
# 1. Verify environment variable is set
echo $ONRAMP_API_KEY

# 2. Check OnRamp Money dashboard settings
# - Navigate to Settings > API Credentials
# - Verify API key matches environment variable
# - Regenerate if necessary

# 3. Check server logs for detailed error
grep "Webhook signature" /var/log/app.log

# Expected log format:
# [OnRamp Money] ❌ Webhook signature verification failed
# [OnRamp Money] Expected signature: abc123...
# [OnRamp Money] Received signature: xyz789...
# [OnRamp Money] Payload length: 256
```

**Verification Script:**
```typescript
// Test signature verification locally
import crypto from 'crypto';

const payload = '{"orderId":"123","status":"success"}';
const apiKey = process.env.ONRAMP_API_KEY;

const signature = crypto
  .createHmac('sha512', apiKey)
  .update(payload)
  .digest('hex')
  .toUpperCase();

console.log('Generated signature:', signature);
// Compare with signature from OnRamp Money webhook logs
```

---

### Issue 3: Excessive Logging from 0x Services

**Symptoms:**
- Console flooded with token fetch logs
- Performance degradation
- Logs appearing every 5 minutes during background revalidation

**Solution:**
```typescript
// Enable debug mode only when needed
// In browser console:
localStorage.setItem('DEBUG_0X', 'true');  // Enable
localStorage.removeItem('DEBUG_0X');        // Disable

// Or set NODE_ENV for production
process.env.NODE_ENV = 'production';  // Disables debug logs
```

**Affected Logs:**
- Token list fetching and caching
- Gasless token approval checks
- Quote routing decisions
- Price response structures

**Before Fix:**
```
⚡ Fetching tokens for chain: 137
✅ Using cached tokens (age: 6min)
🔄 Revalidating in background...
Gasless approval tokens for chain 137: [...]
Successfully processed 45 tokens with gasless support info
```

**After Fix (production):**
```
(No logs unless errors occur)
```

---

### Issue 4: Order Status Not Updating (Webhook + Polling)

**Symptoms:**
- Order stuck in "pending" status
- Webhook not received or processed
- Polling not triggering updates

**Diagnostic Steps:**

1. **Check Webhook Configuration:**
```bash
# Verify webhook URL is correctly configured in OnRamp dashboard
# Format: https://your-domain.com/api/onramp-money/webhook

# Test webhook endpoint
curl -X POST https://your-domain.com/api/onramp-money/webhook \
  -H "x-onramp-payload: {\"orderId\":\"test\",\"status\":\"success\"}" \
  -H "x-onramp-signature: YOUR_SIGNATURE"
```

2. **Verify Polling is Active:**
```typescript
// Check OnRampMoneyStatus component state
// Look for "Auto-refreshing" indicator next to pending orders
// Polling runs every 10 seconds for pending orders
```

3. **Check Server Logs:**
```bash
# Look for webhook receipts
grep "Received valid webhook" /var/log/app.log

# Check for order status updates
grep "Order status updated" /var/log/app.log

# Verify polling requests
grep "GET /api/onramp-money/order/" /var/log/access.log
```

**Manual Status Update (temporary fix):**
```sql
-- Manually update order status in database
UPDATE onramp_money_orders
SET status = 'success',
    completed_at = NOW(),
    updated_at = NOW()
WHERE order_id = 'YOUR_ORDER_ID';
```

---

### Issue 5: Rate Limit Exceeded on Webhook

**Symptoms:**
- Webhook returns 429 Too Many Requests
- Multiple orders failing to update

**Cause:**
- More than 100 webhook requests per minute from same IP
- DDoS attack or misconfiguration

**Solution:**
```typescript
// Adjust rate limits if needed (server/routes/onramp-money-routes.ts)
const WEBHOOK_RATE_LIMIT = 100;  // Increase if legitimate traffic
const RATE_LIMIT_WINDOW = 60 * 1000;  // 1 minute

// Monitor rate limiter
console.log('Active rate limit records:', webhookRateLimiter.size);

// Clear specific IP if needed
webhookRateLimiter.delete('IP_ADDRESS');
```

---

### Issue 6: Missing Environment Variables

**Symptoms:**
- Service logs configuration warnings on startup
- Webhook verification always fails
- Orders created with default sandbox appId

**Warnings to Look For:**
```
[OnRamp Money] Configuration warnings:
  - ONRAMP_APP_ID is not set or using sandbox (appId: 2)
  - ONRAMP_API_KEY is not set. Webhook verification will fail
  - ONRAMP_BASE_URL is using default value
```

**Solution:**
```bash
# Create or update .env file
cat > .env << EOF
ONRAMP_APP_ID=your_production_app_id
ONRAMP_API_KEY=your_secret_api_key
ONRAMP_BASE_URL=https://onramp.money
FRONTEND_URL=https://your-domain.com
EOF

# Restart server to load new environment variables
npm run dev  # Development
pm2 restart app  # Production
```

---

### Debugging Tools

**1. Signature Validation Test:**
```bash
# Run signature processing test
node tests/test-signature-processing.cjs
```

**2. Check Order Flow:**
```typescript
// Enable verbose logging in OnRampMoneyWidget
console.log('Creating order with:', {
  fiatAmount, fiatCurrency, cryptoCurrency,
  network, walletAddress, paymentMethod
});
```

**3. Database Query for Order Status:**
```sql
-- Check recent orders
SELECT
  id, order_id, status,
  fiat_amount, crypto_currency,
  created_at, completed_at
FROM onramp_money_orders
ORDER BY created_at DESC
LIMIT 10;

-- Count orders by status
SELECT status, COUNT(*) as count
FROM onramp_money_orders
GROUP BY status;
```

**4. Monitor Real-time Logs:**
```bash
# Follow server logs
tail -f /var/log/app.log | grep "OnRamp Money"

# Watch for webhook activity
tail -f /var/log/app.log | grep "webhook"
```
