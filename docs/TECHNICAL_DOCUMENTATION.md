# NebulaX Exchange - Technical Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [API Documentation](#api-documentation)
3. [Database Schema](#database-schema)
4. [Security Implementation](#security-implementation)
5. [Deployment Guide](#deployment-guide)
6. [Monitoring & Logging](#monitoring--logging)
7. [Testing Framework](#testing-framework)
8. [Troubleshooting](#troubleshooting)

## System Architecture

### Overview
NebulaX Exchange is a full-stack cryptocurrency trading platform built with:
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Real-time**: WebSocket simulation for market data
- **Hosting**: Replit with autoscale deployment

### Component Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vite)  │◄──►│   (Express)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   API Routes    │    │   Schema        │
│   - Trading     │    │   - Auth        │    │   - Users       │
│   - Portfolio   │    │   - Trading     │    │   - Orders      │
│   - Admin       │    │   - Market Data │    │   - Trades      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST /api/auth/login
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### GET /api/auth/user
Get current authenticated user information.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "kycLevel": 1,
    "verified": true
  }
}
```

### Trading Endpoints

#### GET /api/market-data
Get live market data for all supported trading pairs.

**Response:**
```json
{
  "data": [
    {
      "symbol": "BTC/USDT",
      "price": 65000.00,
      "change": 2.5,
      "volume": 1250000,
      "high": 66000,
      "low": 64000
    }
  ]
}
```

#### POST /api/orders
Place a new trading order.

**Request Body:**
```json
{
  "symbol": "BTC/USDT",
  "side": "buy",
  "type": "limit",
  "amount": "0.001",
  "price": "65000"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "symbol": "BTC/USDT",
    "side": "buy",
    "type": "limit",
    "amount": "0.001",
    "price": "65000",
    "status": "pending"
  }
}
```

#### GET /api/portfolio
Get user's portfolio information.

**Response:**
```json
{
  "balances": {
    "BTC": "0.0025",
    "ETH": "0.15",
    "USDT": "1000.00"
  },
  "totalValue": "2500.00",
  "pnl": "+150.00"
}
```

### Communication Endpoints

#### POST /api/sms/send
Send SMS notification.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "message": "Your verification code is: 123456"
}
```

#### POST /api/ai-trading/chat
Interact with AI Trading Assistant.

**Request Body:**
```json
{
  "message": "What is the current BTC price trend?"
}
```

**Response:**
```json
{
  "response": "Based on current market data, BTC is showing bullish momentum with a 2.5% increase over the last 24 hours. The price has broken above key resistance levels...",
  "confidence": 0.85
}
```

## Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  password_hash VARCHAR(255),
  kyc_level INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### portfolios
```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  symbol VARCHAR(10) NOT NULL,
  balance DECIMAL(20,8) DEFAULT 0,
  locked_balance DECIMAL(20,8) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  symbol VARCHAR(20) NOT NULL,
  side VARCHAR(10) NOT NULL,
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  price DECIMAL(20,8),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### trades
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  symbol VARCHAR(20) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  price DECIMAL(20,8) NOT NULL,
  fee DECIMAL(20,8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security Implementation

### Authentication & Authorization
- **Session Management**: PostgreSQL-backed sessions with express-session
- **Password Security**: bcrypt hashing with salt rounds
- **Rate Limiting**: Express-rate-limit with Redis backing
- **Input Validation**: Zod schema validation on all inputs
- **CSRF Protection**: Built-in CSRF tokens for state-changing operations

### API Security
- **Rate Limiting**: Multiple tiers (general, auth, trading, SMS)
- **Input Sanitization**: SQL injection and XSS prevention
- **Security Headers**: Helmet.js with CSP policies
- **IP Blocking**: Automatic blocking for suspicious activities

### Data Protection
- **Encryption**: AES-256 for sensitive data at rest
- **TLS**: HTTPS enforcement in production
- **Data Validation**: Comprehensive input validation
- **Audit Logging**: All security events logged

## Deployment Guide

### Replit Deployment

1. **Environment Setup**
```bash
# Install dependencies
npm install

# Set environment variables
DATABASE_URL=postgresql://...
NODE_ENV=production
```

2. **Database Migration**
```bash
# Run database migrations
npm run db:push
```

3. **Production Build**
```bash
# Build frontend assets
npm run build

# Start production server
npm start
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Authentication
SESSION_SECRET=your-secret-key-here

# External APIs
SENDGRID_API_KEY=SG.xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
OPENAI_API_KEY=sk-xxx

# Application
NODE_ENV=production
PORT=5000
```

## Monitoring & Logging

### System Monitoring
- **Performance Metrics**: Response time, memory usage, CPU usage
- **Error Tracking**: Automated error detection and alerting
- **Security Monitoring**: Suspicious activity detection
- **Uptime Monitoring**: Health checks and status reporting

### Log Management
- **Structured Logging**: JSON-formatted logs with timestamps
- **Log Rotation**: Automatic log archiving
- **Security Logs**: All security events tracked
- **Performance Logs**: Request/response metrics

### Health Checks
- **GET /api/health**: System health status
- **GET /api/metrics**: Performance metrics
- **GET /api/security**: Security status

## Testing Framework

### Automated Tests
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **Security Tests**: SQL injection, XSS protection
- **Performance Tests**: Response time validation

### Test Execution
```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --grep "Authentication"

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```
tests/
├── api.test.js          # API endpoint tests
├── security.test.js     # Security validation tests
├── performance.test.js  # Performance benchmarks
└── integration.test.js  # End-to-end tests
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connection
node -e "console.log(process.env.DATABASE_URL)"

# Test connection
npm run db:test
```

#### Authentication Problems
```bash
# Check session storage
# Verify environment variables
# Review authentication logs
```

#### Performance Issues
```bash
# Check system metrics
curl http://localhost:5000/api/metrics

# Monitor memory usage
curl http://localhost:5000/api/health
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start

# Application-specific debugging
DEBUG=nebulax:* npm start
```

### Log Analysis
```bash
# View system logs
tail -f logs/system.log

# Search for errors
grep "ERROR" logs/system.log

# Monitor security events
grep "SECURITY" logs/system.log
```

## API Rate Limits

| Endpoint Category | Limit | Window |
|------------------|--------|---------|
| General API | 100 requests | 15 minutes |
| Authentication | 10 requests | 15 minutes |
| Trading | 30 requests | 1 minute |
| Market Data | 60 requests | 1 minute |
| SMS | 5 requests | 1 hour |

## Support & Maintenance

### Regular Maintenance
- **Database Cleanup**: Monthly cleanup of old logs
- **Security Updates**: Regular dependency updates
- **Performance Optimization**: Quarterly performance reviews
- **Backup Verification**: Weekly backup integrity checks

### Emergency Procedures
1. **System Outage**: Check health endpoints, review logs
2. **Security Breach**: Enable IP blocking, review security logs
3. **Performance Degradation**: Check metrics, scale resources
4. **Data Loss**: Restore from backup, verify integrity

For technical support, contact: support@nebulax.exchange