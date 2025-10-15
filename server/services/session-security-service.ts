import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface SessionSecurityConfig {
  maxAge: number;
  idleTimeout: number;
  maxConcurrentSessions: number;
  requireSecureTransport: boolean;
  enableCSRFProtection: boolean;
}

interface UserSession {
  sessionId: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
  fingerprint: string;
  csrfToken?: string;
}

interface SecurityAlert {
  type: 'concurrent_session' | 'session_hijack' | 'csrf_attempt' | 'session_timeout';
  userId: string;
  sessionId: string;
  details: any;
  timestamp: Date;
}

class SessionSecurityService {
  private activeSessions: Map<string, UserSession> = new Map();
  private userSessions: Map<string, Set<string>> = new Map();
  private securityAlerts: SecurityAlert[] = [];
  
  private config: SessionSecurityConfig = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    idleTimeout: 30 * 60 * 1000, // 30 minutes
    maxConcurrentSessions: 5,
    requireSecureTransport: process.env.NODE_ENV === 'production',
    enableCSRFProtection: true
  };

  // Create secure session
  createSession(req: Request, userId: string): UserSession {
    const sessionId = this.generateSecureSessionId();
    const fingerprint = this.generateFingerprint(req);
    
    const session: UserSession = {
      sessionId,
      userId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true,
      fingerprint,
      csrfToken: this.config.enableCSRFProtection ? this.generateCSRFToken() : undefined
    };

    // Check concurrent session limits
    this.enforceSessionLimits(userId, sessionId);
    
    // Store session
    this.activeSessions.set(sessionId, session);
    
    // Track user sessions
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(sessionId);
    
    console.log(`[SessionSecurity] Created session ${sessionId} for user ${userId}`);
    return session;
  }

  // Validate session middleware
  validateSession() {
    return (req: Request, res: Response, next: NextFunction) => {
      const sessionId = req.sessionID;
      if (!sessionId) {
        return next();
      }

      const session = this.activeSessions.get(sessionId);
      if (!session) {
        return this.handleInvalidSession(req, res, 'Session not found');
      }

      // Check if session is active
      if (!session.isActive) {
        return this.handleInvalidSession(req, res, 'Session inactive');
      }

      // Check session timeout
      const now = new Date();
      const timeSinceActivity = now.getTime() - session.lastActivity.getTime();
      
      if (timeSinceActivity > this.config.idleTimeout) {
        this.invalidateSession(sessionId, 'idle_timeout');
        return this.handleInvalidSession(req, res, 'Session timed out');
      }

      // Check session age
      const sessionAge = now.getTime() - session.createdAt.getTime();
      if (sessionAge > this.config.maxAge) {
        this.invalidateSession(sessionId, 'max_age_exceeded');
        return this.handleInvalidSession(req, res, 'Session expired');
      }

      // Validate fingerprint
      const currentFingerprint = this.generateFingerprint(req);
      if (session.fingerprint !== currentFingerprint) {
        this.logSecurityAlert('session_hijack', session.userId, sessionId, {
          originalFingerprint: session.fingerprint,
          currentFingerprint,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
        
        this.invalidateSession(sessionId, 'fingerprint_mismatch');
        return this.handleInvalidSession(req, res, 'Session security violation');
      }

      // Update last activity
      session.lastActivity = now;
      session.ipAddress = req.ip;
      
      // Add session info to request
      req.sessionInfo = session;
      
      next();
    };
  }

  // CSRF protection middleware
  csrfProtection() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.config.enableCSRFProtection) {
        return next();
      }

      // Skip CSRF check for GET requests
      if (req.method === 'GET') {
        return next();
      }

      const sessionId = req.sessionID;
      const session = this.activeSessions.get(sessionId);
      
      if (!session || !session.csrfToken) {
        return res.status(403).json({ error: 'CSRF token required' });
      }

      const providedToken = req.get('X-CSRF-Token') || req.body.csrfToken;
      if (!providedToken || providedToken !== session.csrfToken) {
        this.logSecurityAlert('csrf_attempt', session.userId, sessionId, {
          providedToken,
          expectedToken: session.csrfToken,
          endpoint: req.path,
          method: req.method
        });
        
        return res.status(403).json({ error: 'Invalid CSRF token' });
      }

      next();
    };
  }

  // Get CSRF token for session
  getCSRFToken(sessionId: string): string | null {
    const session = this.activeSessions.get(sessionId);
    return session?.csrfToken || null;
  }

  // Invalidate session
  invalidateSession(sessionId: string, reason: string): void {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    session.isActive = false;
    
    // Remove from user sessions
    const userSessions = this.userSessions.get(session.userId);
    if (userSessions) {
      userSessions.delete(sessionId);
      if (userSessions.size === 0) {
        this.userSessions.delete(session.userId);
      }
    }
    
    // Remove from active sessions
    this.activeSessions.delete(sessionId);
    
    console.log(`[SessionSecurity] Invalidated session ${sessionId}: ${reason}`);
  }

  // Invalidate all user sessions
  invalidateAllUserSessions(userId: string, reason: string): void {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) return;

    const sessionIds = Array.from(userSessions);
    sessionIds.forEach(sessionId => {
      this.invalidateSession(sessionId, reason);
    });
    
    console.log(`[SessionSecurity] Invalidated ${sessionIds.length} sessions for user ${userId}: ${reason}`);
  }

  // Enforce concurrent session limits
  private enforceSessionLimits(userId: string, newSessionId: string): void {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) return;

    if (userSessions.size >= this.config.maxConcurrentSessions) {
      // Find oldest session to remove
      let oldestSession: UserSession | null = null;
      let oldestSessionId: string | null = null;
      
      for (const sessionId of userSessions) {
        const session = this.activeSessions.get(sessionId);
        if (session && (!oldestSession || session.createdAt < oldestSession.createdAt)) {
          oldestSession = session;
          oldestSessionId = sessionId;
        }
      }
      
      if (oldestSessionId) {
        this.logSecurityAlert('concurrent_session', userId, newSessionId, {
          action: 'oldest_session_removed',
          removedSessionId: oldestSessionId,
          maxSessions: this.config.maxConcurrentSessions
        });
        
        this.invalidateSession(oldestSessionId, 'concurrent_session_limit');
      }
    }
  }

  // Generate secure session ID
  private generateSecureSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Generate browser fingerprint
  private generateFingerprint(req: Request): string {
    const components = [
      req.get('User-Agent') || '',
      req.get('Accept-Language') || '',
      req.get('Accept-Encoding') || '',
      req.ip
    ];
    
    return crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex');
  }

  // Generate CSRF token
  private generateCSRFToken(): string {
    return crypto.randomBytes(24).toString('hex');
  }

  // Handle invalid session
  private handleInvalidSession(req: Request, res: Response, reason: string): void {
    // Clear session
    req.session.destroy(() => {});
    
    res.status(401).json({
      error: 'Session invalid',
      reason,
      code: 'SESSION_INVALID'
    });
  }

  // Log security alerts
  private logSecurityAlert(
    type: SecurityAlert['type'],
    userId: string,
    sessionId: string,
    details: any
  ): void {
    const alert: SecurityAlert = {
      type,
      userId,
      sessionId,
      details,
      timestamp: new Date()
    };
    
    this.securityAlerts.push(alert);
    
    // Keep only last 1000 alerts
    if (this.securityAlerts.length > 1000) {
      this.securityAlerts = this.securityAlerts.slice(-1000);
    }
    
    console.log(`[SecurityAlert] ${type}: User ${userId}, Session ${sessionId}`);
  }

  // Get active sessions for user
  getUserSessions(userId: string): UserSession[] {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) return [];

    return Array.from(userSessions)
      .map(sessionId => this.activeSessions.get(sessionId))
      .filter((session): session is UserSession => session !== undefined);
  }

  // Get session statistics
  getSessionStats(): {
    totalActiveSessions: number;
    activeUsers: number;
    recentAlerts: SecurityAlert[];
    sessionsByHour: number[];
  } {
    const recentAlerts = this.securityAlerts
      .filter(alert => Date.now() - alert.timestamp.getTime() < 24 * 60 * 60 * 1000)
      .slice(-50);

    // Calculate sessions created in last 24 hours by hour
    const now = new Date();
    const sessionsByHour = new Array(24).fill(0);
    
    for (const session of this.activeSessions.values()) {
      const hoursDiff = Math.floor((now.getTime() - session.createdAt.getTime()) / (60 * 60 * 1000));
      if (hoursDiff < 24) {
        sessionsByHour[23 - hoursDiff]++;
      }
    }

    return {
      totalActiveSessions: this.activeSessions.size,
      activeUsers: this.userSessions.size,
      recentAlerts,
      sessionsByHour
    };
  }

  // Clean up expired sessions
  private cleanup(): void {
    const now = new Date();
    const expiredSessions: string[] = [];
    
    for (const [sessionId, session] of this.activeSessions) {
      const timeSinceActivity = now.getTime() - session.lastActivity.getTime();
      const sessionAge = now.getTime() - session.createdAt.getTime();
      
      if (timeSinceActivity > this.config.idleTimeout || sessionAge > this.config.maxAge) {
        expiredSessions.push(sessionId);
      }
    }
    
    expiredSessions.forEach(sessionId => {
      this.invalidateSession(sessionId, 'cleanup_expired');
    });
    
    if (expiredSessions.length > 0) {
      console.log(`[SessionSecurity] Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }

  // Start cleanup interval
  startCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // Clean up every 5 minutes
  }
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      sessionInfo?: UserSession;
    }
  }
}

export const sessionSecurityService = new SessionSecurityService();

// Start cleanup process
sessionSecurityService.startCleanup();