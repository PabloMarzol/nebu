import { storage } from '../storage';

interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  ipAddress: string;
  userAgent?: string;
  action: string;
  resource: string;
  details: any;
  status: 'success' | 'failure' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'trading' | 'financial' | 'security' | 'admin' | 'compliance';
}

interface ComplianceReport {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate: Date;
  events: AuditEvent[];
  summary: {
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    securityIncidents: number;
    tradingVolume: number;
    userActivity: number;
  };
  generatedAt: Date;
}

class AuditLoggingService {
  private auditEvents: AuditEvent[] = [];
  private complianceReports: ComplianceReport[] = [];

  // Log audit event
  async logEvent(
    action: string,
    resource: string,
    details: any,
    options?: {
      userId?: string;
      sessionId?: string;
      ipAddress?: string;
      userAgent?: string;
      status?: 'success' | 'failure' | 'warning';
      severity?: 'low' | 'medium' | 'high' | 'critical';
      category?: 'authentication' | 'trading' | 'financial' | 'security' | 'admin' | 'compliance';
    }
  ): Promise<void> {
    const event: AuditEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      userId: options?.userId,
      sessionId: options?.sessionId,
      ipAddress: options?.ipAddress || 'unknown',
      userAgent: options?.userAgent,
      action,
      resource,
      details,
      status: options?.status || 'success',
      severity: options?.severity || 'low',
      category: options?.category || 'admin'
    };

    this.auditEvents.push(event);
    
    // Keep only last 100,000 events in memory
    if (this.auditEvents.length > 100000) {
      this.auditEvents = this.auditEvents.slice(-100000);
    }

    // Log to console for immediate visibility
    console.log(`[AuditLog] ${event.severity.toUpperCase()} - ${event.category}:${event.action} by ${event.userId || 'anonymous'} from ${event.ipAddress}`);

    // Store in database for persistence (if configured)
    try {
      if (event.userId) {
        await storage.logSecurityEvent(
          event.userId,
          event.action,
          `${event.category}: ${event.action}`,
          {
            resource: event.resource,
            details: event.details,
            severity: event.severity,
            category: event.category,
            ipAddress: event.ipAddress,
            userAgent: event.userAgent,
            sessionId: event.sessionId
          }
        );
      }
    } catch (error) {
      console.error('[AuditLog] Failed to store event in database:', error);
    }
  }

  // Authentication events
  async logAuthentication(
    action: 'login' | 'logout' | 'register' | 'password_reset' | 'email_verify' | '2fa_setup' | '2fa_verify',
    userId: string,
    ipAddress: string,
    userAgent: string,
    details: any,
    status: 'success' | 'failure' = 'success'
  ): Promise<void> {
    await this.logEvent(action, 'user_account', details, {
      userId,
      ipAddress,
      userAgent,
      status,
      severity: status === 'failure' ? 'medium' : 'low',
      category: 'authentication'
    });
  }

  // Trading events
  async logTrading(
    action: 'order_placed' | 'order_cancelled' | 'trade_executed' | 'balance_update',
    userId: string,
    ipAddress: string,
    details: any,
    status: 'success' | 'failure' = 'success'
  ): Promise<void> {
    await this.logEvent(action, 'trading_account', details, {
      userId,
      ipAddress,
      status,
      severity: 'medium',
      category: 'trading'
    });
  }

  // Financial events
  async logFinancial(
    action: 'deposit' | 'withdrawal' | 'payment_processed' | 'fee_charged',
    userId: string,
    ipAddress: string,
    details: any,
    status: 'success' | 'failure' = 'success'
  ): Promise<void> {
    await this.logEvent(action, 'financial_account', details, {
      userId,
      ipAddress,
      status,
      severity: 'high',
      category: 'financial'
    });
  }

  // Security events
  async logSecurity(
    action: 'rate_limit_exceeded' | 'suspicious_activity' | 'session_hijack' | 'csrf_attempt' | 'access_denied',
    ipAddress: string,
    details: any,
    userId?: string
  ): Promise<void> {
    await this.logEvent(action, 'security_system', details, {
      userId,
      ipAddress,
      status: 'warning',
      severity: 'high',
      category: 'security'
    });
  }

  // Compliance events
  async logCompliance(
    action: 'kyc_submitted' | 'aml_check' | 'transaction_monitored' | 'report_generated',
    userId: string,
    ipAddress: string,
    details: any,
    status: 'success' | 'failure' = 'success'
  ): Promise<void> {
    await this.logEvent(action, 'compliance_system', details, {
      userId,
      ipAddress,
      status,
      severity: 'medium',
      category: 'compliance'
    });
  }

  // Administrative events
  async logAdmin(
    action: 'user_blocked' | 'system_config_changed' | 'manual_intervention' | 'data_export',
    adminUserId: string,
    ipAddress: string,
    details: any
  ): Promise<void> {
    await this.logEvent(action, 'admin_system', details, {
      userId: adminUserId,
      ipAddress,
      status: 'success',
      severity: 'high',
      category: 'admin'
    });
  }

  // Query audit events
  queryEvents(filters: {
    userId?: string;
    category?: string;
    severity?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditEvent[] {
    let events = [...this.auditEvents];

    // Apply filters
    if (filters.userId) {
      events = events.filter(e => e.userId === filters.userId);
    }
    if (filters.category) {
      events = events.filter(e => e.category === filters.category);
    }
    if (filters.severity) {
      events = events.filter(e => e.severity === filters.severity);
    }
    if (filters.action) {
      events = events.filter(e => e.action === filters.action);
    }
    if (filters.startDate) {
      events = events.filter(e => e.timestamp >= filters.startDate!);
    }
    if (filters.endDate) {
      events = events.filter(e => e.timestamp <= filters.endDate!);
    }

    // Sort by timestamp (newest first)
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit
    if (filters.limit) {
      events = events.slice(0, filters.limit);
    }

    return events;
  }

  // Generate compliance report
  async generateComplianceReport(
    type: 'daily' | 'weekly' | 'monthly' | 'custom',
    startDate?: Date,
    endDate?: Date
  ): Promise<ComplianceReport> {
    const now = new Date();
    let reportStartDate: Date;
    let reportEndDate: Date = endDate || now;

    // Calculate date range based on type
    switch (type) {
      case 'daily':
        reportStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        reportStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        reportStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        reportStartDate = startDate || new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
    }

    // Get events for the period
    const events = this.queryEvents({
      startDate: reportStartDate,
      endDate: reportEndDate
    });

    // Calculate summary statistics
    const eventsByCategory: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    let securityIncidents = 0;
    let tradingVolume = 0;
    let userActivity = 0;

    events.forEach(event => {
      // Count by category
      eventsByCategory[event.category] = (eventsByCategory[event.category] || 0) + 1;
      
      // Count by severity
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      
      // Count security incidents
      if (event.category === 'security' || event.severity === 'critical') {
        securityIncidents++;
      }
      
      // Calculate trading volume
      if (event.category === 'trading' && event.details?.amount) {
        tradingVolume += parseFloat(event.details.amount) || 0;
      }
      
      // Count user activity
      if (event.userId) {
        userActivity++;
      }
    });

    const report: ComplianceReport = {
      id: this.generateReportId(),
      type,
      startDate: reportStartDate,
      endDate: reportEndDate,
      events,
      summary: {
        totalEvents: events.length,
        eventsByCategory,
        eventsBySeverity,
        securityIncidents,
        tradingVolume,
        userActivity
      },
      generatedAt: now
    };

    this.complianceReports.push(report);
    
    // Keep only last 100 reports
    if (this.complianceReports.length > 100) {
      this.complianceReports = this.complianceReports.slice(-100);
    }

    console.log(`[AuditLog] Generated ${type} compliance report: ${report.id}`);
    return report;
  }

  // Get audit statistics
  getAuditStats(): {
    totalEvents: number;
    eventsLast24h: number;
    eventsByCategory: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topUsers: Array<{ userId: string; eventCount: number }>;
    recentCriticalEvents: AuditEvent[];
  } {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const eventsLast24h = this.auditEvents.filter(e => e.timestamp >= last24h);
    
    const eventsByCategory: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const userEventCount: Record<string, number> = {};

    this.auditEvents.forEach(event => {
      eventsByCategory[event.category] = (eventsByCategory[event.category] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      
      if (event.userId) {
        userEventCount[event.userId] = (userEventCount[event.userId] || 0) + 1;
      }
    });

    const topUsers = Object.entries(userEventCount)
      .map(([userId, count]) => ({ userId, eventCount: count }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);

    const recentCriticalEvents = this.auditEvents
      .filter(e => e.severity === 'critical' && e.timestamp >= last24h)
      .slice(-20);

    return {
      totalEvents: this.auditEvents.length,
      eventsLast24h: eventsLast24h.length,
      eventsByCategory,
      eventsBySeverity,
      topUsers,
      recentCriticalEvents
    };
  }

  // Get stored reports
  getComplianceReports(): ComplianceReport[] {
    return [...this.complianceReports].sort((a, b) => 
      b.generatedAt.getTime() - a.generatedAt.getTime()
    );
  }

  // Helper methods
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportId(): string {
    return `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clean up old events
  private cleanup(): void {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    const beforeCount = this.auditEvents.length;
    
    this.auditEvents = this.auditEvents.filter(event => event.timestamp >= cutoff);
    
    const removed = beforeCount - this.auditEvents.length;
    if (removed > 0) {
      console.log(`[AuditLog] Cleaned up ${removed} old audit events`);
    }
  }

  // Start cleanup interval
  startCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, 24 * 60 * 60 * 1000); // Clean up daily
  }
}

export const auditLoggingService = new AuditLoggingService();

// Start cleanup process
auditLoggingService.startCleanup();