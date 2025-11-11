# ALT5 FX Swap Integration - Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying and testing the ALT5 FX swap integration in production.

## ✅ Current Status
- **ALT5 Trading Service**: Fully implemented and tested
- **Authentication**: 2FA with TOTP working correctly
- **API Endpoints**: All routes implemented and tested
- **Client Component**: Complete UI for fiat-to-crypto conversion
- **Database Schema**: Tables created and migrations applied

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# ALT5 Trading Configuration
ALT5_TRADING_EMAIL=your_email@domain.com
ALT5_TRADING_PASSWORD=your_password
ALT5_TRADING_BASE_URL=https://trade.alt5pro.com
ALT5_2FA_TOTP_SECRET_PRODUCTION=your_base32_secret

# Optional overrides
ALT5_SECURITY_GROUP=exchange-users
```

### Validation Script
Run the validation script to verify configuration:
```bash
node validate-alt5-config.js
```

## 🚀 Deployment Steps

### 1. Database Setup
```bash
# Run migrations
npm run db:migrate

# Verify tables
npm run db:check
```

### 2. Service Testing
```bash
# Test ALT5 connectivity
curl http://localhost:5000/api/alt5-trading/test

# Test authentication
node test-alt5-service.js
```

### 3. API Endpoints Testing

#### Test On-Ramp Creation
```bash
curl -X POST http://localhost:5000/api/alt5-trading/on-ramp \
  -H "Content-Type: application/json" \
  -d '{
    "gbpAmount": 100,
    "destinationWallet": "0x742d35Cc6634C0532925a3b8D4e6D3b6e8d3e8A0",
    "targetToken": "USDT",
    "userId": "test_user_123",
    "clientOrderId": "test_order_123"
  }'
```

#### Test Account Details
```bash
curl http://localhost:5000/api/alt5-trading/account/test_user_123
```

#### Test Order Status
```bash
curl http://localhost:5000/api/alt5-trading/order-status/test_order_123
```

## 📋 API Endpoints

### Core Endpoints
- `POST /api/alt5-trading/on-ramp` - Create fiat-to-crypto order
- `GET /api/alt5-trading/account/:userId` - Get user account details
- `POST /api/alt5-trading/order` - Create trading order
- `GET /api/alt5-trading/orders/active/:userId` - Get active orders
- `GET /api/alt5-trading/orders/history/:userId` - Get order history
- `GET /api/alt5-trading/deposit-details/:userId` - Get bank transfer details
- `GET /api/alt5-trading/balance/:userId` - Get account balance
- `GET /api/alt5-trading/order-status/:orderId` - Get order status
- `GET /api/alt5-trading/test` - Test service connectivity

## 🔒 Security Configuration

### Rate Limiting
Add to server configuration:
```javascript
import rateLimit from 'express-rate-limit';

const alt5Limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/alt5-trading', alt5Limiter);
```

### Input Validation
All endpoints include comprehensive input validation:
- Amount limits: £25 - £50,000
- Wallet address validation
- Token symbol validation
- User ID sanitization

## 🧪 Testing Checklist

### Pre-deployment Tests
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] ALT5 authentication working
- [ ] API endpoints responding
- [ ] Client component rendering
- [ ] Error handling working

### End-to-End Tests
- [ ] Create on-ramp order
- [ ] Receive bank transfer details
- [ ] Check order status
- [ ] Verify account balance
- [ ] Test error scenarios

### Production Tests
- [ ] SSL/TLS certificates
- [ ] Domain configuration
- [ ] Load balancer setup
- [ ] Database connection pooling
- [ ] Monitoring and alerts

## 📊 Monitoring & Alerts

### Key Metrics to Monitor
- Authentication success/failure rates
- API response times
- Order creation rates
- Error rates by endpoint
- Database connection health

### Alert Thresholds
- Authentication failure rate > 5%
- API response time > 5 seconds
- Error rate > 1%
- Database connection failures

## 🚨 Troubleshooting

### Common Issues

#### Authentication Failures
1. Check TOTP secret validity
2. Verify email/password
3. Check account 2FA settings
4. Review rate limiting

#### API Errors
1. Check network connectivity
2. Verify ALT5 service status
3. Review request parameters
4. Check server logs

#### Database Issues
1. Verify migrations applied
2. Check connection strings
3. Review table permissions
4. Check for data corruption

### Debug Commands
```bash
# Check service status
curl http://localhost:5000/api/alt5-trading/test

# Check database
npm run db:check

# View logs
tail -f logs/alt5-trading.log

# Test authentication
node validate-alt5-config.js
```

## 🔄 Maintenance

### Regular Tasks
- [ ] Rotate TOTP secrets quarterly
- [ ] Update API keys annually
- [ ] Review rate limits monthly
- [ ] Monitor error logs daily
- [ ] Test disaster recovery procedures

### Backup Strategy
- Database backups every 6 hours
- Configuration backups daily
- Log retention for 30 days
- Disaster recovery testing monthly

## 📞 Support

### Internal Contacts
- Technical Lead: [Your Name]
- Database Admin: [DBA Name]
- Security Team: [Security Contact]

### External Support
- ALT5 Support: support@alt5.com
- Technical Documentation: https://docs.alt5.com

## 🎯 Next Steps

1. **Immediate**: Run validation script
2. **Short-term**: Complete end-to-end testing
3. **Medium-term**: Implement monitoring
4. **Long-term**: Performance optimization

## 📈 Performance Optimization

### Caching Strategy
- Cache account details for 5 minutes
- Cache order status for 30 seconds
- Cache deposit addresses for 1 hour

### Database Optimization
- Add indexes on frequently queried fields
- Implement connection pooling
- Use read replicas for queries

### API Optimization
- Implement request batching
- Add response compression
- Use CDN for static assets
