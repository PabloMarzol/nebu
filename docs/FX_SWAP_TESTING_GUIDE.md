# FX Swap Testing Guide - Stripe Live Account

## Overview
This guide provides comprehensive testing procedures for the FX swap functionality when transitioning from Stripe test mode to live production.

## Current Architecture
- **Stripe Payment Processing**: Handles GBP payments via cards
- **0x Protocol Integration**: Executes on-chain swaps (WETH → USDT)
- **Multi-source FX Rates**: Chainlink → CoinGecko fallback
- **Automated Execution**: Post-payment swap and transfer workflow

## Pre-Production Testing Checklist

### 1. Environment Configuration
```bash
# Required for live testing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLIC_KEY=pk_live_...

# Blockchain configuration
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
HOT_WALLET_PRIVATE_KEY=0x... # Mainnet hot wallet with sufficient ETH and WETH
ZERO_X_API_KEY=your_0x_api_key

# Optional monitoring
WEBHOOK_URL=https://your-domain.com/api/fx-swap/webhook
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### 2. Hot Wallet Requirements
- **ETH Balance**: Minimum 0.1 ETH for gas fees
- **WETH Balance**: Minimum 1 WETH for swaps
- **USDT Balance**: Minimum 1000 USDT for user transfers
- **Monitoring**: Set up balance alerts

### 3. Test Scenarios

#### A. Small Amount Test (£10-50)
```
1. Create FX swap for £10-50
2. Complete Stripe payment
3. Verify payment webhook received
4. Monitor swap execution
5. Check USDT received in destination wallet
6. Verify order status updates
```

#### B. Medium Amount Test (£100-500)
```
1. Create FX swap for £100-500
2. Complete Stripe payment
3. Verify FX rate locking
4. Monitor 0x quote execution
5. Check gas fee calculations
6. Verify USDT transfer completion
```

#### C. Large Amount Test (£1000+)
```
1. Create FX swap for £1000+
2. Complete Stripe payment
3. Verify daily limits handling
4. Monitor multi-hop swaps if needed
5. Check slippage protection
6. Verify complete execution
```

### 4. Monitoring Setup

The system now includes comprehensive monitoring tools accessible via these endpoints:

#### Real-time System Status
```bash
curl http://localhost:5000/api/fx-swap/monitoring/status
```

This provides:
- Hot wallet balances (ETH, WETH, USDT)
- Low balance warnings
- Recent order activity (last 24h)
- Failed orders in the last hour
- System health checks (Stripe, Blockchain, 0x, Database)

#### Order Details & Diagnostics
```bash
curl http://localhost:5000/api/fx-swap/monitoring/orders/{orderId}
```

This shows:
- Complete order information
- Execution timeline with durations
- Wallet operations history
- Potential issues identification
- Rate age and execution time diagnostics

#### Manual Swap Execution (Testing)
```bash
curl -X POST http://localhost:5000/api/fx-swap/monitoring/test-swap \
  -H "Content-Type: application/json" \
  -d '{"orderId": "your-order-id"}'
```

Use this to manually trigger swap execution for testing.

#### FX Rate History
```bash
curl "http://localhost:5000/api/fx-swap/monitoring/rate-history?hours=24&currency=GBP"
```

Provides rate volatility analysis and historical data.

### 5. Live Testing Procedures

#### Phase 1: Small Amount Testing (£10-50)
```bash
# 1. Create a small FX swap
curl -X POST http://localhost:5000/api/fx-swap/create-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_WALLET_TOKEN" \
  -d '{
    "gbpAmount": 25,
    "destinationWallet": "0xYourWalletAddress",
    "targetToken": "USDT"
  }'

# 2. Monitor the payment process
# - Complete the Stripe payment in the frontend
# - Watch the monitoring dashboard for real-time updates

# 3. Verify completion
curl http://localhost:5000/api/fx-swap/monitoring/orders/{orderId}
```

#### Phase 2: Medium Amount Testing (£100-500)
Follow the same process with larger amounts to test:
- FX rate locking mechanisms
- 0x Protocol quote execution
- Gas fee calculations
- Multi-confirmation requirements

#### Phase 3: Large Amount Testing (£1000+)
Test with significant amounts to verify:
- Daily limit handling
- Slippage protection
- Multi-hop swap execution
- Complete end-to-end flow

### 6. Validation Checklist

#### ✅ Payment Processing
- [ ] Stripe payment intent created successfully
- [ ] Payment webhook received and processed
- [ ] Order status updated to STRIPE_CONFIRMED
- [ ] No payment failures or disputes

#### ✅ FX Rate Handling
- [ ] Rate fetched from reliable source (Chainlink/CoinGecko)
- [ ] Rate locked within 30-second window
- [ ] Rate validation passed before swap execution
- [ ] No significant rate movements during execution

#### ✅ 0x Protocol Integration
- [ ] Swap quote obtained successfully
- [ ] Quote execution completed on-chain
- [ ] Transaction confirmed (3+ confirmations)
- [ ] Gas fees within expected range

#### ✅ Token Transfer
- [ ] USDT transferred to user wallet
- [ ] Transfer transaction confirmed
- [ ] Correct amount received by user
- [ ] No transfer failures

#### ✅ Error Handling
- [ ] Graceful handling of payment failures
- [ ] Proper error messages and logging
- [ ] Order status updated correctly on failures
- [ ] User notification system working

### 7. Production Readiness Checklist

#### Security
- [ ] Hot wallet private keys securely stored
- [ ] Webhook endpoints properly secured
- [ ] Rate limiting implemented
- [ ] Input validation in place

#### Monitoring
- [ ] Balance monitoring alerts configured
- [ ] Failed transaction notifications set up
- [ ] System health monitoring active
- [ ] Performance metrics tracking enabled

#### Compliance
- [ ] Daily limits properly configured
- [ ] Audit trail maintained
- [ ] User transaction history accessible
- [ ] Regulatory requirements met

### 8. Troubleshooting Common Issues

#### Payment Failures
- Check Stripe webhook configuration
- Verify payment intent metadata
- Review error logs in monitoring dashboard

#### Swap Execution Failures
- Check hot wallet balances
- Verify 0x API connectivity
- Review gas price settings
- Check for rate expiration

#### Transfer Failures
- Verify USDT balance in hot wallet
- Check destination wallet validity
- Review transfer gas limits
- Monitor blockchain congestion

### 9. Performance Optimization

#### For High Volume
- Implement batch processing
- Optimize database queries
- Add caching for FX rates
- Consider load balancing

#### For Better UX
- Reduce execution time
- Improve error messaging
- Add progress indicators
- Optimize frontend performance

This comprehensive testing approach ensures your FX swap system is production-ready when transitioning from Stripe test to live environment.
