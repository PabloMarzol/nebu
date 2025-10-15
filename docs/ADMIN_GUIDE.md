# NebulaX Exchange - Admin Guide

## System Administration Guide

This guide provides comprehensive instructions for administering the NebulaX Exchange platform.

## Table of Contents
1. [System Overview](#system-overview)
2. [Access Management](#access-management)
3. [Monitoring & Alerts](#monitoring--alerts)
4. [Security Management](#security-management)
5. [Database Operations](#database-operations)
6. [Backup & Recovery](#backup--recovery)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

## System Overview

### Platform Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript  
- **Database**: PostgreSQL with Drizzle ORM
- **Hosting**: Replit with autoscale deployment
- **Monitoring**: Custom monitoring service
- **Security**: Multi-layer security implementation

### Admin Dashboard Access
- URL: `/admin`
- Requires admin privileges
- Multi-factor authentication required

## Access Management

### Admin Account Setup
1. **Create Admin User**
   ```sql
   INSERT INTO users (email, first_name, last_name, role, verified)
   VALUES ('admin@nebulax.exchange', 'Admin', 'User', 'admin', true);
   ```

2. **Set Admin Permissions**
   ```sql
   UPDATE users SET 
     role = 'admin',
     permissions = ARRAY['all']
   WHERE email = 'admin@nebulax.exchange';
   ```

### User Management
- **View Users**: `/admin/users`
- **User Actions**: Ban, verify, upgrade KYC level
- **Bulk Operations**: Export user data, mass communications

### Role-Based Access Control
- **Super Admin**: Full system access
- **Admin**: Platform management
- **Support**: Customer service functions
- **Compliance**: KYC/AML operations
- **Finance**: Treasury operations

## Monitoring & Alerts

### System Health Monitoring
**Health Check Endpoint**: `/api/health`
```json
{
  "status": "healthy",
  "timestamp": "2025-01-10T10:00:00Z",
  "metrics": {
    "uptime": 86400000,
    "requests": 15420,
    "errors": 12,
    "errorRate": 0.08,
    "avgResponseTime": 145,
    "memoryUsage": 256.8,
    "cpuUsage": 15.2
  }
}
```

### Key Metrics to Monitor
- **Response Time**: Target <500ms
- **Error Rate**: Keep <1%
- **Memory Usage**: Alert >500MB
- **CPU Usage**: Alert >80%
- **Active Connections**: Monitor trends
- **Database Performance**: Query response times

### Alert Thresholds
```javascript
const ALERT_THRESHOLDS = {
  responseTime: 1000,     // ms
  errorRate: 5,           // %
  memoryUsage: 500,       // MB
  cpuUsage: 80,           // %
  diskUsage: 85,          // %
  activeConnections: 1000
};
```

### Log Monitoring
- **System Logs**: `/logs/system.log`
- **Security Logs**: Filter by "SECURITY"
- **Error Logs**: Filter by "ERROR"
- **Performance Logs**: Response times and metrics

## Security Management

### Security Dashboard
Access: `/api/security`
```json
{
  "status": "operational",
  "metrics": {
    "totalEvents": 1250,
    "recentEvents": 45,
    "blockedIPs": 12,
    "topThreats": [
      {"type": "RATE_LIMIT_EXCEEDED", "count": 25},
      {"type": "SUSPICIOUS_ACTIVITY", "count": 15}
    ]
  }
}
```

### Security Event Types
- **RATE_LIMIT_EXCEEDED**: API rate limiting triggered
- **SUSPICIOUS_ACTIVITY**: Unusual user behavior
- **SQL_INJECTION_ATTEMPT**: Malicious SQL detected
- **XSS_ATTEMPT**: Cross-site scripting attempt
- **PATH_TRAVERSAL_ATTEMPT**: Directory traversal attempt

### IP Management
**Block Suspicious IP**:
```javascript
// Automatic blocking for critical events
// Manual blocking via admin interface
blockedIPs.add('192.168.1.100');
```

**Unblock IP**:
```javascript
blockedIPs.delete('192.168.1.100');
```

### Security Best Practices
1. **Regular Security Audits**: Monthly reviews
2. **Access Log Monitoring**: Daily review of access patterns
3. **Failed Login Monitoring**: Alert on multiple failures
4. **API Rate Limit Tuning**: Adjust based on usage patterns
5. **Security Update Schedule**: Weekly dependency updates

## Database Operations

### Database Access
```bash
# Connect to database
psql $DATABASE_URL

# View active connections
SELECT * FROM pg_stat_activity;

# Check database size
SELECT pg_size_pretty(pg_database_size('nebulax'));
```

### Common Operations
**User Management**:
```sql
-- View user stats
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Find unverified users
SELECT * FROM users WHERE verified = false;

-- Update KYC level
UPDATE users SET kyc_level = 2 WHERE id = 'user-id';
```

**Trading Operations**:
```sql
-- View trading volume
SELECT symbol, SUM(amount) as volume 
FROM trades 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY symbol;

-- Check order status
SELECT status, COUNT(*) FROM orders GROUP BY status;
```

**Portfolio Analysis**:
```sql
-- Top holders
SELECT user_id, symbol, balance 
FROM portfolios 
WHERE balance > 0 
ORDER BY balance DESC 
LIMIT 10;
```

### Database Maintenance
**Daily Tasks**:
- Monitor query performance
- Check for long-running queries
- Review error logs

**Weekly Tasks**:
- Analyze slow queries
- Update statistics
- Clean up old logs

**Monthly Tasks**:
- Full database backup
- Index optimization
- Performance review

## Backup & Recovery

### Automated Backups
```bash
# Daily backup script
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Compress backup
gzip backup-$(date +%Y%m%d).sql
```

### Recovery Procedures
**Full Database Restore**:
```bash
# Stop application
# Restore from backup
psql $DATABASE_URL < backup-20250110.sql
# Restart application
```

**Point-in-Time Recovery**:
```bash
# Use PostgreSQL PITR if enabled
# Restore to specific timestamp
```

### Backup Strategy
- **Frequency**: Daily automated backups
- **Retention**: 30 days online, 1 year archived
- **Testing**: Monthly restore testing
- **Offsite**: Cloud storage backup

## Performance Optimization

### Database Optimization
**Index Management**:
```sql
-- Create performance indexes
CREATE INDEX idx_orders_user_symbol ON orders(user_id, symbol);
CREATE INDEX idx_trades_created_at ON trades(created_at);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 'uuid';
```

**Query Optimization**:
- Use prepared statements
- Avoid N+1 queries
- Implement proper pagination
- Cache frequent queries

### Application Performance
**Memory Management**:
- Monitor memory leaks
- Optimize image sizes
- Implement caching strategies

**Response Time Optimization**:
- Database query optimization
- API response caching
- CDN for static assets
- Connection pooling

### Scaling Strategies
**Vertical Scaling**:
- Increase server resources
- Optimize database configuration
- Improve code efficiency

**Horizontal Scaling**:
- Load balancing
- Database sharding
- Microservices architecture

## Troubleshooting

### Common Issues

**High Response Times**:
1. Check database query performance
2. Monitor memory usage
3. Review active connections
4. Analyze slow query logs

**Authentication Problems**:
1. Verify session configuration
2. Check database connectivity
3. Review authentication logs
4. Validate user permissions

**Trading Issues**:
1. Check order matching engine
2. Verify balance calculations
3. Review trade execution logs
4. Monitor portfolio updates

### Diagnostic Commands
```bash
# Check system status
curl localhost:5000/api/health

# Monitor system metrics
curl localhost:5000/api/metrics

# Check security status
curl localhost:5000/api/security

# View application logs
tail -f logs/system.log

# Monitor database
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"
```

### Emergency Procedures

**System Outage**:
1. Check health endpoints
2. Review system logs
3. Verify database connectivity
4. Restart services if needed

**Security Breach**:
1. Enable IP blocking
2. Review security logs
3. Change critical passwords
4. Notify stakeholders

**Performance Degradation**:
1. Check system metrics
2. Scale resources if needed
3. Optimize slow queries
4. Clear caches

## Maintenance Schedule

### Daily Tasks
- [ ] Review system health metrics
- [ ] Check security event logs
- [ ] Monitor error rates
- [ ] Verify backup completion

### Weekly Tasks
- [ ] Performance analysis
- [ ] Security audit review
- [ ] Database maintenance
- [ ] Dependency updates

### Monthly Tasks
- [ ] Full system backup
- [ ] Comprehensive security review
- [ ] Performance optimization
- [ ] Disaster recovery testing

## Contact Information

**Emergency Contacts**:
- System Admin: admin@nebulax.exchange
- Security Team: security@nebulax.exchange
- Database Admin: dba@nebulax.exchange

**Support Channels**:
- Internal Slack: #nebulax-ops
- Emergency Hotline: +1-xxx-xxx-xxxx
- Escalation Email: ops@nebulax.exchange