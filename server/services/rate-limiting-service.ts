import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockedUntil?: number;
}

interface SecurityEvent {
  type: 'rate_limit_exceeded' | 'suspicious_activity' | 'ddos_attempt';
  ip: string;
  userId?: string;
  timestamp: Date;
  details: any;
}

class RateLimitingService {
  private store: Map<string, RateLimitRecord> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private blockedIPs: Set<string> = new Set();
  private suspiciousIPs: Map<string, number> = new Map();

  // Different rate limits for different endpoints
  private readonly rateLimits = {
    // Authentication endpoints
    auth: { windowMs: 15 * 60 * 1000, maxRequests: 5, message: 'Too many authentication attempts' },
    login: { windowMs: 15 * 60 * 1000, maxRequests: 5, message: 'Too many login attempts' },
    register: { windowMs: 60 * 60 * 1000, maxRequests: 3, message: 'Too many registration attempts' },
    
    // Trading endpoints
    trading: { windowMs: 60 * 1000, maxRequests: 100, message: 'Trading rate limit exceeded' },
    orderPlacement: { windowMs: 60 * 1000, maxRequests: 30, message: 'Too many orders per minute' },
    orderCancel: { windowMs: 60 * 1000, maxRequests: 50, message: 'Too many cancellations per minute' },
    
    // API endpoints
    api: { windowMs: 60 * 1000, maxRequests: 1000, message: 'API rate limit exceeded' },
    marketData: { windowMs: 60 * 1000, maxRequests: 200, message: 'Market data rate limit exceeded' },
    
    // Sensitive operations
    withdrawal: { windowMs: 60 * 60 * 1000, maxRequests: 10, message: 'Too many withdrawal attempts' },
    kyc: { windowMs: 24 * 60 * 60 * 1000, maxRequests: 5, message: 'Too many KYC submissions' },
    
    // General protection
    global: { windowMs: 60 * 1000, maxRequests: 2000, message: 'Global rate limit exceeded' }
  };

  // Create rate limiter middleware
  createRateLimit(type: keyof typeof this.rateLimits) {
    const config = this.rateLimits[type];
    
    return (req: Request, res: Response, next: NextFunction) => {
      const key = this.generateKey(req, type);
      const now = Date.now();
      
      // Check if IP is blocked
      if (this.isIPBlocked(req.ip)) {
        this.logSecurityEvent('ddos_attempt', req.ip, req.user?.id, {
          endpoint: req.path,
          userAgent: req.get('User-Agent'),
          rateLimitType: type
        });
        
        return res.status(429).json({
          error: 'IP temporarily blocked due to suspicious activity',
          retryAfter: 3600 // 1 hour
        });
      }
      
      // Get or create rate limit record
      let record = this.store.get(key);
      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + config.windowMs,
          blocked: false
        };
        this.store.set(key, record);
      }
      
      // Check if currently blocked
      if (record.blocked && record.blockedUntil && now < record.blockedUntil) {
        return res.status(429).json({
          error: config.message || 'Rate limit exceeded',
          retryAfter: Math.ceil((record.blockedUntil - now) / 1000)
        });
      }
      
      // Increment counter
      record.count++;
      
      // Check if limit exceeded
      if (record.count > config.maxRequests) {
        record.blocked = true;
        record.blockedUntil = now + (config.windowMs * 2); // Block for 2x the window
        
        // Track suspicious activity
        this.trackSuspiciousActivity(req.ip);
        
        // Log security event
        this.logSecurityEvent('rate_limit_exceeded', req.ip, req.user?.id, {
          endpoint: req.path,
          rateLimitType: type,
          requestCount: record.count,
          maxRequests: config.maxRequests,
          userAgent: req.get('User-Agent')
        });
        
        return res.status(429).json({
          error: config.message || 'Rate limit exceeded',
          retryAfter: Math.ceil((record.blockedUntil - now) / 1000)
        });
      }
      
      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': config.maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, config.maxRequests - record.count).toString(),
        'X-RateLimit-Reset': record.resetTime.toString()
      });
      
      next();
    };
  }

  // Generate unique key for rate limiting
  private generateKey(req: Request, type: string): string {
    const userId = req.user?.id;
    const ip = req.ip;
    
    // For authenticated users, use userId + type
    if (userId) {
      return `${type}:user:${userId}`;
    }
    
    // For unauthenticated, use IP + type
    return `${type}:ip:${ip}`;
  }

  // Check if IP is blocked
  private isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  // Track suspicious activity
  private trackSuspiciousActivity(ip: string): void {
    const count = this.suspiciousIPs.get(ip) || 0;
    this.suspiciousIPs.set(ip, count + 1);
    
    // Block IP if too many violations
    if (count >= 5) {
      this.blockIP(ip, 60 * 60 * 1000); // Block for 1 hour
      this.logSecurityEvent('suspicious_activity', ip, undefined, {
        violationCount: count + 1,
        action: 'ip_blocked'
      });
    }
  }

  // Block IP address
  private blockIP(ip: string, duration: number): void {
    this.blockedIPs.add(ip);
    
    // Unblock after duration
    setTimeout(() => {
      this.blockedIPs.delete(ip);
      this.suspiciousIPs.delete(ip);
    }, duration);
  }

  // Log security events
  private logSecurityEvent(
    type: SecurityEvent['type'],
    ip: string,
    userId?: string,
    details?: any
  ): void {
    const event: SecurityEvent = {
      type,
      ip,
      userId,
      timestamp: new Date(),
      details
    };
    
    this.securityEvents.push(event);
    
    // Keep only last 10000 events
    if (this.securityEvents.length > 10000) {
      this.securityEvents = this.securityEvents.slice(-10000);
    }
    
    console.log(`[SecurityEvent] ${type}: ${ip} ${userId ? `(User: ${userId})` : ''}`);
  }

  // Get security statistics
  getSecurityStats(): {
    blockedIPs: number;
    suspiciousIPs: number;
    recentEvents: SecurityEvent[];
    activeLimits: number;
  } {
    const recentEvents = this.securityEvents
      .filter(event => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000)
      .slice(-100);
    
    return {
      blockedIPs: this.blockedIPs.size,
      suspiciousIPs: this.suspiciousIPs.size,
      recentEvents,
      activeLimits: this.store.size
    };
  }

  // Manual IP management
  manuallyBlockIP(ip: string, reason: string): void {
    this.blockIP(ip, 24 * 60 * 60 * 1000); // Block for 24 hours
    this.logSecurityEvent('suspicious_activity', ip, undefined, {
      action: 'manual_block',
      reason
    });
  }

  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
    this.suspiciousIPs.delete(ip);
  }

  // Clean up expired records
  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime && !record.blocked) {
        this.store.delete(key);
      }
    }
  }

  // Start cleanup interval
  startCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Clean up every 5 minutes
  }
}

export const rateLimitingService = new RateLimitingService();

// Start cleanup process
rateLimitingService.startCleanup();