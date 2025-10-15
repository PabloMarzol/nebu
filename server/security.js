/**
 * NebulaX Exchange Security Hardening Module
 * Comprehensive security measures for production deployment
 */

const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

class SecurityService {
  constructor() {
    this.suspiciousActivities = [];
    this.blockedIPs = new Set();
    this.securityEvents = [];
    this.startTime = Date.now();
  }
  
  // Rate limiting configurations
  createRateLimiter(windowMs = 15 * 60 * 1000, max = 100) {
    return rateLimit({
      windowMs,
      max,
      message: {
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        this.logSecurityEvent('RATE_LIMIT_EXCEEDED', req.ip, req.path);
        res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }
    });
  }
  
  // API-specific rate limiters
  getRateLimiters() {
    return {
      // General API rate limiting
      general: this.createRateLimiter(15 * 60 * 1000, 100), // 100 requests per 15 minutes
      
      // Authentication rate limiting
      auth: this.createRateLimiter(15 * 60 * 1000, 10), // 10 auth attempts per 15 minutes
      
      // Trading rate limiting
      trading: this.createRateLimiter(60 * 1000, 30), // 30 trades per minute
      
      // Market data rate limiting
      marketData: this.createRateLimiter(60 * 1000, 60), // 60 requests per minute
      
      // SMS rate limiting
      sms: this.createRateLimiter(60 * 60 * 1000, 5) // 5 SMS per hour
    };
  }
  
  // Security headers configuration
  getSecurityHeaders() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https://api.cryptocompare.com', 'wss://']
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  }
  
  // Input validation and sanitization
  validateInput(input, type = 'string') {
    if (!input) return false;
    
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'phone':
        return /^\+?[1-9]\d{1,14}$/.test(input);
      case 'amount':
        return /^\d+(\.\d{1,8})?$/.test(input) && parseFloat(input) > 0;
      case 'symbol':
        return /^[A-Z]{3,10}\/[A-Z]{3,10}$/.test(input);
      case 'uuid':
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input);
      default:
        return typeof input === 'string' && input.length > 0 && input.length < 1000;
    }
  }
  
  // SQL injection protection
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove potential XSS
      .replace(/['";]/g, '') // Remove potential SQL injection
      .trim();
  }
  
  // Suspicious activity detection
  detectSuspiciousActivity(req) {
    const suspicious = [];
    
    // Check for common attack patterns
    const userAgent = req.get('User-Agent') || '';
    const referer = req.get('Referer') || '';
    
    // Bot detection
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      suspicious.push('BOT_DETECTED');
    }
    
    // SQL injection patterns
    if (JSON.stringify(req.body).match(/(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b)/i)) {
      suspicious.push('SQL_INJECTION_ATTEMPT');
    }
    
    // XSS patterns
    if (JSON.stringify(req.body).includes('<script>')) {
      suspicious.push('XSS_ATTEMPT');
    }
    
    // Unusual request patterns
    if (req.path.includes('..') || req.path.includes('/etc/')) {
      suspicious.push('PATH_TRAVERSAL_ATTEMPT');
    }
    
    if (suspicious.length > 0) {
      this.logSecurityEvent('SUSPICIOUS_ACTIVITY', req.ip, req.path, suspicious);
      return true;
    }
    
    return false;
  }
  
  // Security event logging
  logSecurityEvent(type, ip, path, details = []) {
    const event = {
      timestamp: new Date().toISOString(),
      type,
      ip,
      path,
      details,
      severity: this.getEventSeverity(type)
    };
    
    this.securityEvents.push(event);
    console.log(`[SECURITY] ${type}: ${ip} - ${path}`, details);
    
    // Keep only last 1000 events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }
    
    // Auto-block IP for critical events
    if (event.severity === 'CRITICAL') {
      this.blockedIPs.add(ip);
    }
  }
  
  getEventSeverity(type) {
    const severityMap = {
      'RATE_LIMIT_EXCEEDED': 'MEDIUM',
      'SUSPICIOUS_ACTIVITY': 'HIGH',
      'SQL_INJECTION_ATTEMPT': 'CRITICAL',
      'XSS_ATTEMPT': 'CRITICAL',
      'PATH_TRAVERSAL_ATTEMPT': 'CRITICAL',
      'BOT_DETECTED': 'LOW'
    };
    
    return severityMap[type] || 'MEDIUM';
  }
  
  // Security middleware
  securityMiddleware() {
    return (req, res, next) => {
      // Check blocked IPs
      if (this.blockedIPs.has(req.ip)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // Detect suspicious activity
      if (this.detectSuspiciousActivity(req)) {
        return res.status(400).json({ error: 'Suspicious activity detected' });
      }
      
      // Sanitize inputs
      if (req.body) {
        for (const key in req.body) {
          if (typeof req.body[key] === 'string') {
            req.body[key] = this.sanitizeInput(req.body[key]);
          }
        }
      }
      
      next();
    };
  }
  
  // Get security metrics
  getSecurityMetrics() {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;
    
    const recentEvents = this.securityEvents.filter(
      event => new Date(event.timestamp).getTime() > last24h
    );
    
    const eventsByType = recentEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalEvents: this.securityEvents.length,
      recentEvents: recentEvents.length,
      blockedIPs: this.blockedIPs.size,
      eventsByType,
      topThreats: Object.entries(eventsByType)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([type, count]) => ({ type, count }))
    };
  }
}

// Password strength validation
const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(requirements).filter(Boolean).length;
  
  return {
    isValid: score >= 4,
    score: score,
    requirements: requirements
  };
};

// Generate secure tokens
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash sensitive data
const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = {
  SecurityService,
  validatePassword,
  generateSecureToken,
  hashData
};

// ES6 export for TypeScript compatibility
exports.SecurityService = SecurityService;
exports.validatePassword = validatePassword;
exports.generateSecureToken = generateSecureToken;
exports.hashData = hashData;