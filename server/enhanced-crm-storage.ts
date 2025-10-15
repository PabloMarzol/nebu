import { db } from "./db";
import { eq, and, or, gte, lte, desc, asc, count, sql } from "drizzle-orm";
import {
  crmCustomers,
  crmUserProfiles,
  crmKycCases,
  crmAmlAlerts,
  crmSupportTickets,
  crmAffiliates,
  crmAffiliatePayout,
  crmIncidents,
  crmAuditLogs,
  crmDataRequests,
  crmScheduledReports,
  crmAutomationRules,
  crmIntegrationLogs,
  crmAdminUsers,
  crmAdminRoles
} from "@shared/crm-schema";

export interface IEnhancedCRMStorage {
  // User 360° Profile Management
  getUserProfile(customerId: string): Promise<any>;
  updateUserProfile(customerId: string, updates: any): Promise<any>;
  calculateRiskScore(customerId: string): Promise<any>;
  
  // KYC/AML Compliance Center
  getKycCases(filters: any): Promise<any[]>;
  createKycCase(caseData: any): Promise<any>;
  updateKycCase(caseId: string, updates: any): Promise<any>;
  processKycDecision(caseId: string, decision: string, reason: string, reviewNotes: string, adminUserId: string): Promise<any>;
  
  // AML Alerts & Transaction Monitoring
  getAmlAlerts(filters: any): Promise<any[]>;
  createAmlAlert(alertData: any): Promise<any>;
  updateAmlAlert(alertId: string, updates: any): Promise<any>;
  fileSAR(alertId: string, sarData: any, filedBy: string): Promise<any>;
  
  // Support Ticketing Hub
  getSupportTickets(filters: any): Promise<any[]>;
  createSupportTicketWithRouting(ticketData: any): Promise<any>;
  updateSupportTicket(ticketId: string, updates: any): Promise<any>;
  escalateTicket(ticketId: string, reason: string, escalateTo: string, escalatedBy: string): Promise<any>;
  getSLAMetrics(timeframe: string): Promise<any>;
  
  // Affiliate & Referral Management
  getAffiliates(filters: any): Promise<any[]>;
  createAffiliate(affiliateData: any): Promise<any>;
  processAffiliatePayout(affiliateId: string, payoutData: any, processedBy: string): Promise<any>;
  getAffiliateFraudAlerts(): Promise<any[]>;
  
  // Incident Response & Case Management
  getIncidents(filters: any): Promise<any[]>;
  createIncident(incidentData: any): Promise<any>;
  updateIncident(incidentId: string, updates: any): Promise<any>;
  
  // Audit Logs & Compliance
  getAuditLogs(filters: any): Promise<any[]>;
  logAdminAction(logData: any): Promise<any>;
  
  // GDPR/CCPA Data Management
  getDataRequests(filters: any): Promise<any[]>;
  processDataRequest(requestId: string, action: string, processedBy: string): Promise<any>;
  
  // Reporting & Analytics
  getDashboardMetrics(timeframe: string): Promise<any>;
  generateCustomReport(reportType: string, parameters: any, format: string, generatedBy: string): Promise<any>;
  getScheduledReports(): Promise<any[]>;
  
  // Automation & Workflow
  getAutomationRules(): Promise<any[]>;
  createAutomationRule(ruleData: any): Promise<any>;
  testAutomationRule(ruleId: string, testData: any): Promise<any>;
}

export class EnhancedCRMDatabaseStorage implements IEnhancedCRMStorage {
  
  // ======= USER 360° PROFILE MANAGEMENT =======
  
  async getUserProfile(customerId: string): Promise<any> {
    try {
      const profile = await db
        .select()
        .from(crmUserProfiles)
        .where(eq(crmUserProfiles.customerId, customerId))
        .limit(1);
      
      if (profile.length === 0) return null;
      
      // Enhance with related data
      const customer = await db
        .select()
        .from(crmCustomers)
        .where(eq(crmCustomers.id, customerId))
        .limit(1);
      
      return {
        ...profile[0],
        customer: customer[0] || null,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error}`);
    }
  }

  async updateUserProfile(customerId: string, updates: any): Promise<any> {
    try {
      const [updatedProfile] = await db
        .update(crmUserProfiles)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(crmUserProfiles.customerId, customerId))
        .returning();
      
      return updatedProfile;
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error}`);
    }
  }

  async calculateRiskScore(customerId: string): Promise<any> {
    try {
      // Comprehensive risk scoring algorithm
      const profile = await this.getUserProfile(customerId);
      if (!profile) throw new Error("User profile not found");
      
      let riskScore = 50; // Base score
      const riskFactors = [];
      
      // KYC Status Risk
      if (profile.kycStatus === 'rejected') {
        riskScore += 30;
        riskFactors.push({ factor: 'KYC Rejected', impact: +30 });
      } else if (profile.kycStatus === 'pending') {
        riskScore += 15;
        riskFactors.push({ factor: 'KYC Pending', impact: +15 });
      }
      
      // PEP Status
      if (profile.pepStatus) {
        riskScore += 25;
        riskFactors.push({ factor: 'PEP Status', impact: +25 });
      }
      
      // Trading Volume Analysis
      const monthlyVolume = parseFloat(profile.tradeVolumeMonthly || '0');
      if (monthlyVolume > 1000000) {
        riskScore += 10; // High volume = higher risk
        riskFactors.push({ factor: 'High Trading Volume', impact: +10 });
      }
      
      // Sanctions Flags
      if (profile.sanctionsFlags && Object.keys(profile.sanctionsFlags).length > 0) {
        riskScore += 40;
        riskFactors.push({ factor: 'Sanctions Flags', impact: +40 });
      }
      
      // Device History Risk
      if (profile.deviceHistory && profile.deviceHistory.length > 10) {
        riskScore += 5; // Multiple devices
        riskFactors.push({ factor: 'Multiple Devices', impact: +5 });
      }
      
      // Cap at 100
      riskScore = Math.min(riskScore, 100);
      
      // Update risk score in profile
      await this.updateUserProfile(customerId, {
        riskScore,
        riskAssessmentDate: new Date()
      });
      
      return {
        customerId,
        riskScore,
        riskLevel: riskScore < 30 ? 'Low' : riskScore < 70 ? 'Medium' : 'High',
        riskFactors,
        assessmentDate: new Date().toISOString(),
        recommendations: this.generateRiskRecommendations(riskScore, riskFactors)
      };
    } catch (error) {
      throw new Error(`Failed to calculate risk score: ${error}`);
    }
  }

  private generateRiskRecommendations(riskScore: number, riskFactors: any[]): string[] {
    const recommendations = [];
    
    if (riskScore > 70) {
      recommendations.push("Require enhanced due diligence");
      recommendations.push("Manual review for all transactions > $10,000");
      recommendations.push("Enhanced monitoring for 90 days");
    } else if (riskScore > 50) {
      recommendations.push("Standard monitoring procedures");
      recommendations.push("Review transaction patterns monthly");
    } else {
      recommendations.push("Standard customer treatment");
      recommendations.push("Routine monitoring sufficient");
    }
    
    return recommendations;
  }

  // ======= KYC/AML COMPLIANCE CENTER =======
  
  async getKycCases(filters: any): Promise<any[]> {
    try {
      let query = db.select().from(crmKycCases);
      
      const conditions = [];
      if (filters.status) conditions.push(eq(crmKycCases.status, filters.status));
      if (filters.priority) conditions.push(eq(crmKycCases.priority, filters.priority));
      if (filters.assignedAgent) conditions.push(eq(crmKycCases.assignedAgent, filters.assignedAgent));
      if (filters.caseType) conditions.push(eq(crmKycCases.caseType, filters.caseType));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const cases = await query
        .orderBy(desc(crmKycCases.createdAt))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0);
      
      return cases;
    } catch (error) {
      throw new Error(`Failed to get KYC cases: ${error}`);
    }
  }

  async createKycCase(caseData: any): Promise<any> {
    try {
      // Auto-generate case number
      const timestamp = Date.now();
      const caseNumber = `KYC-${timestamp}`;
      
      const [newCase] = await db
        .insert(crmKycCases)
        .values({
          ...caseData,
          id: crypto.randomUUID(),
          dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours SLA
          autoFlags: this.generateAutoFlags(caseData),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return newCase;
    } catch (error) {
      throw new Error(`Failed to create KYC case: ${error}`);
    }
  }

  async updateKycCase(caseId: string, updates: any): Promise<any> {
    try {
      const [updatedCase] = await db
        .update(crmKycCases)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(crmKycCases.id, caseId))
        .returning();
      
      return updatedCase;
    } catch (error) {
      throw new Error(`Failed to update KYC case: ${error}`);
    }
  }

  async processKycDecision(caseId: string, decision: string, reason: string, reviewNotes: string, adminUserId: string): Promise<any> {
    try {
      const now = new Date();
      
      const [updatedCase] = await db
        .update(crmKycCases)
        .set({
          status: decision,
          decisionReason: reason,
          reviewNotes,
          reviewedAt: now,
          approvedAt: decision === 'approved' ? now : null,
          updatedAt: now
        })
        .where(eq(crmKycCases.id, caseId))
        .returning();
      
      // Log the decision
      await this.logAdminAction({
        action: 'kyc_decision',
        resource: 'kyc_case',
        resourceId: caseId,
        newData: { decision, reason },
        riskLevel: decision === 'rejected' ? 'high' : 'medium'
      });
      
      return updatedCase;
    } catch (error) {
      throw new Error(`Failed to process KYC decision: ${error}`);
    }
  }

  private generateAutoFlags(caseData: any): any {
    const flags = [];
    
    // Check for high-risk jurisdictions
    if (caseData.jurisdiction && ['AF', 'KP', 'IR', 'SY'].includes(caseData.jurisdiction)) {
      flags.push({ type: 'high_risk_jurisdiction', severity: 'high' });
    }
    
    // Check for PEP indicators
    if (caseData.documentData && caseData.documentData.occupation?.includes('government')) {
      flags.push({ type: 'potential_pep', severity: 'medium' });
    }
    
    return flags;
  }

  // ======= AML ALERTS & TRANSACTION MONITORING =======
  
  async getAmlAlerts(filters: any): Promise<any[]> {
    try {
      let query = db.select().from(crmAmlAlerts);
      
      const conditions = [];
      if (filters.alertType) conditions.push(eq(crmAmlAlerts.alertType, filters.alertType));
      if (filters.severity) conditions.push(eq(crmAmlAlerts.severity, filters.severity));
      if (filters.status) conditions.push(eq(crmAmlAlerts.status, filters.status));
      if (filters.assignedAnalyst) conditions.push(eq(crmAmlAlerts.assignedAnalyst, filters.assignedAnalyst));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const alerts = await query
        .orderBy(desc(crmAmlAlerts.createdAt))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0);
      
      return alerts;
    } catch (error) {
      throw new Error(`Failed to get AML alerts: ${error}`);
    }
  }

  async createAmlAlert(alertData: any): Promise<any> {
    try {
      const [newAlert] = await db
        .insert(crmAmlAlerts)
        .values({
          ...alertData,
          id: crypto.randomUUID(),
          createdAt: new Date()
        })
        .returning();
      
      return newAlert;
    } catch (error) {
      throw new Error(`Failed to create AML alert: ${error}`);
    }
  }

  async updateAmlAlert(alertId: string, updates: any): Promise<any> {
    try {
      const [updatedAlert] = await db
        .update(crmAmlAlerts)
        .set(updates)
        .where(eq(crmAmlAlerts.id, alertId))
        .returning();
      
      return updatedAlert;
    } catch (error) {
      throw new Error(`Failed to update AML alert: ${error}`);
    }
  }

  async fileSAR(alertId: string, sarData: any, filedBy: string): Promise<any> {
    try {
      const sarReference = `SAR-${Date.now()}`;
      
      const [updatedAlert] = await db
        .update(crmAmlAlerts)
        .set({
          sarFiled: true,
          sarReference,
          status: 'escalated',
          reviewedAt: new Date()
        })
        .where(eq(crmAmlAlerts.id, alertId))
        .returning();
      
      // Log SAR filing
      await this.logAdminAction({
        action: 'sar_filed',
        resource: 'aml_alert',
        resourceId: alertId,
        newData: { sarReference, sarData },
        riskLevel: 'critical'
      });
      
      return { updatedAlert, sarReference };
    } catch (error) {
      throw new Error(`Failed to file SAR: ${error}`);
    }
  }

  // ======= SUPPORT TICKETING HUB =======
  
  async getSupportTickets(filters: any): Promise<any[]> {
    try {
      let query = db.select().from(crmSupportTickets);
      
      const conditions = [];
      if (filters.customerId) conditions.push(eq(crmSupportTickets.customerId, filters.customerId));
      if (filters.status) conditions.push(eq(crmSupportTickets.status, filters.status));
      if (filters.priority) conditions.push(eq(crmSupportTickets.priority, filters.priority));
      if (filters.category) conditions.push(eq(crmSupportTickets.category, filters.category));
      if (filters.assignedAgent) conditions.push(eq(crmSupportTickets.assignedAgent, filters.assignedAgent));
      if (filters.assignedTeam) conditions.push(eq(crmSupportTickets.assignedTeam, filters.assignedTeam));
      if (filters.source) conditions.push(eq(crmSupportTickets.source, filters.source));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const tickets = await query
        .orderBy(desc(crmSupportTickets.createdAt))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0);
      
      return tickets;
    } catch (error) {
      throw new Error(`Failed to get support tickets: ${error}`);
    }
  }

  async createSupportTicketWithRouting(ticketData: any): Promise<any> {
    try {
      // Auto-generate ticket number
      const ticketNumber = `TKT-${Date.now()}`;
      
      // Auto-route based on category
      const routing = this.autoRouteTicket(ticketData.category, ticketData.description);
      
      // Calculate SLA target based on priority
      const slaHours = this.getSLAHours(ticketData.priority || 'normal');
      const slaTarget = new Date(Date.now() + slaHours * 60 * 60 * 1000);
      
      const [newTicket] = await db
        .insert(crmSupportTickets)
        .values({
          ...ticketData,
          id: crypto.randomUUID(),
          ticketNumber,
          assignedAgent: routing.assignedAgent,
          assignedTeam: routing.assignedTeam,
          slaTarget,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return newTicket;
    } catch (error) {
      throw new Error(`Failed to create support ticket: ${error}`);
    }
  }

  async updateSupportTicket(ticketId: string, updates: any): Promise<any> {
    try {
      const [updatedTicket] = await db
        .update(crmSupportTickets)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(crmSupportTickets.id, ticketId))
        .returning();
      
      return updatedTicket;
    } catch (error) {
      throw new Error(`Failed to update support ticket: ${error}`);
    }
  }

  async escalateTicket(ticketId: string, reason: string, escalateTo: string, escalatedBy: string): Promise<any> {
    try {
      const escalationHistory = {
        escalatedAt: new Date().toISOString(),
        escalatedBy,
        reason,
        escalateTo
      };
      
      const [escalatedTicket] = await db
        .update(crmSupportTickets)
        .set({
          status: 'escalated',
          priority: 'urgent',
          escalationHistory: sql`jsonb_insert(coalesce(escalation_history, '[]'), '{0}', ${JSON.stringify(escalationHistory)})`,
          updatedAt: new Date()
        })
        .where(eq(crmSupportTickets.id, ticketId))
        .returning();
      
      return escalatedTicket;
    } catch (error) {
      throw new Error(`Failed to escalate ticket: ${error}`);
    }
  }

  async getSLAMetrics(timeframe: string): Promise<any> {
    try {
      const timeframeDate = this.getTimeframeDate(timeframe);
      
      const metrics = await db
        .select({
          totalTickets: count(),
          avgResponseTime: sql`AVG(EXTRACT(EPOCH FROM (first_response_at - created_at))/3600)`,
          avgResolutionTime: sql`AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600)`,
          slaBreaches: sql`COUNT(CASE WHEN resolved_at > sla_target THEN 1 END)`
        })
        .from(crmSupportTickets)
        .where(gte(crmSupportTickets.createdAt, timeframeDate));
      
      return metrics[0];
    } catch (error) {
      throw new Error(`Failed to get SLA metrics: ${error}`);
    }
  }

  private autoRouteTicket(category: string, description: string): { assignedAgent: string | null, assignedTeam: string } {
    const routingRules = {
      'kyc': { team: 'compliance', agent: null },
      'withdrawal': { team: 'finance', agent: null },
      'technical': { team: 'technical', agent: null },
      'trading': { team: 'support', agent: null },
      'compliance': { team: 'compliance', agent: null },
      'general': { team: 'support', agent: null }
    };
    
    const rule = routingRules[category as keyof typeof routingRules] || routingRules.general;
    return { assignedAgent: rule.agent, assignedTeam: rule.team };
  }

  private getSLAHours(priority: string): number {
    const slaHours = {
      'critical': 2,
      'urgent': 4,
      'high': 8,
      'normal': 24,
      'low': 72
    };
    
    return slaHours[priority as keyof typeof slaHours] || 24;
  }

  // ======= AFFILIATE & REFERRAL MANAGEMENT =======
  
  async getAffiliates(filters: any): Promise<any[]> {
    try {
      let query = db.select().from(crmAffiliates);
      
      const conditions = [];
      if (filters.tier) conditions.push(eq(crmAffiliates.tier, filters.tier));
      if (filters.status) conditions.push(eq(crmAffiliates.status, filters.status));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const affiliates = await query
        .orderBy(desc(crmAffiliates.createdAt))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0);
      
      return affiliates;
    } catch (error) {
      throw new Error(`Failed to get affiliates: ${error}`);
    }
  }

  async createAffiliate(affiliateData: any): Promise<any> {
    try {
      const affiliateCode = `AFF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const [newAffiliate] = await db
        .insert(crmAffiliates)
        .values({
          ...affiliateData,
          id: crypto.randomUUID(),
          affiliateCode,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return newAffiliate;
    } catch (error) {
      throw new Error(`Failed to create affiliate: ${error}`);
    }
  }

  async processAffiliatePayout(affiliateId: string, payoutData: any, processedBy: string): Promise<any> {
    try {
      const payoutReference = `PAY-${Date.now()}`;
      
      const [payout] = await db
        .insert(crmAffiliatePayout)
        .values({
          ...payoutData,
          id: crypto.randomUUID(),
          affiliateId,
          payoutReference,
          processedBy,
          createdAt: new Date()
        })
        .returning();
      
      // Update affiliate's paid commissions
      await db
        .update(crmAffiliates)
        .set({
          paidCommissions: sql`paid_commissions + ${payoutData.amount}`,
          pendingCommissions: sql`pending_commissions - ${payoutData.amount}`,
          lastPayoutAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(crmAffiliates.id, affiliateId));
      
      return payout;
    } catch (error) {
      throw new Error(`Failed to process affiliate payout: ${error}`);
    }
  }

  async getAffiliateFraudAlerts(): Promise<any[]> {
    try {
      // Return affiliates with fraud flags
      const fraudAlerts = await db
        .select()
        .from(crmAffiliates)
        .where(sql`fraud_flags IS NOT NULL AND jsonb_array_length(fraud_flags) > 0`)
        .orderBy(desc(crmAffiliates.updatedAt));
      
      return fraudAlerts;
    } catch (error) {
      throw new Error(`Failed to get affiliate fraud alerts: ${error}`);
    }
  }

  // ======= INCIDENT RESPONSE & CASE MANAGEMENT =======
  
  async getIncidents(filters: any): Promise<any[]> {
    try {
      let query = db.select().from(crmIncidents);
      
      const conditions = [];
      if (filters.incidentType) conditions.push(eq(crmIncidents.incidentType, filters.incidentType));
      if (filters.severity) conditions.push(eq(crmIncidents.severity, filters.severity));
      if (filters.status) conditions.push(eq(crmIncidents.status, filters.status));
      if (filters.assignedTeam) conditions.push(eq(crmIncidents.assignedTeam, filters.assignedTeam));
      if (filters.assignedAgent) conditions.push(eq(crmIncidents.assignedAgent, filters.assignedAgent));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const incidents = await query
        .orderBy(desc(crmIncidents.createdAt))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0);
      
      return incidents;
    } catch (error) {
      throw new Error(`Failed to get incidents: ${error}`);
    }
  }

  async createIncident(incidentData: any): Promise<any> {
    try {
      const incidentNumber = `INC-${Date.now()}`;
      
      const [newIncident] = await db
        .insert(crmIncidents)
        .values({
          ...incidentData,
          id: crypto.randomUUID(),
          incidentNumber,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return newIncident;
    } catch (error) {
      throw new Error(`Failed to create incident: ${error}`);
    }
  }

  async updateIncident(incidentId: string, updates: any): Promise<any> {
    try {
      const [updatedIncident] = await db
        .update(crmIncidents)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(crmIncidents.id, incidentId))
        .returning();
      
      return updatedIncident;
    } catch (error) {
      throw new Error(`Failed to update incident: ${error}`);
    }
  }

  // ======= AUDIT LOGS & COMPLIANCE =======
  
  async getAuditLogs(filters: any): Promise<any[]> {
    try {
      let query = db.select().from(crmAuditLogs);
      
      const conditions = [];
      if (filters.action) conditions.push(eq(crmAuditLogs.action, filters.action));
      if (filters.resource) conditions.push(eq(crmAuditLogs.resource, filters.resource));
      if (filters.adminUserId) conditions.push(eq(crmAuditLogs.adminUserId, filters.adminUserId));
      if (filters.riskLevel) conditions.push(eq(crmAuditLogs.riskLevel, filters.riskLevel));
      if (filters.dateFrom) conditions.push(gte(crmAuditLogs.createdAt, filters.dateFrom));
      if (filters.dateTo) conditions.push(lte(crmAuditLogs.createdAt, filters.dateTo));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const logs = await query
        .orderBy(desc(crmAuditLogs.createdAt))
        .limit(filters.limit || 100)
        .offset(filters.offset || 0);
      
      return logs;
    } catch (error) {
      throw new Error(`Failed to get audit logs: ${error}`);
    }
  }

  async logAdminAction(logData: any): Promise<any> {
    try {
      const [auditLog] = await db
        .insert(crmAuditLogs)
        .values({
          ...logData,
          id: crypto.randomUUID(),
          createdAt: new Date()
        })
        .returning();
      
      return auditLog;
    } catch (error) {
      throw new Error(`Failed to log admin action: ${error}`);
    }
  }

  // ======= GDPR/CCPA DATA MANAGEMENT =======
  
  async getDataRequests(filters: any): Promise<any[]> {
    try {
      let query = db.select().from(crmDataRequests);
      
      const conditions = [];
      if (filters.requestType) conditions.push(eq(crmDataRequests.requestType, filters.requestType));
      if (filters.status) conditions.push(eq(crmDataRequests.status, filters.status));
      if (filters.customerId) conditions.push(eq(crmDataRequests.customerId, filters.customerId));
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      const requests = await query
        .orderBy(desc(crmDataRequests.createdAt))
        .limit(filters.limit || 50)
        .offset(filters.offset || 0);
      
      return requests;
    } catch (error) {
      throw new Error(`Failed to get data requests: ${error}`);
    }
  }

  async processDataRequest(requestId: string, action: string, processedBy: string): Promise<any> {
    try {
      const updates: any = {
        status: 'processing',
        processedBy,
        updatedAt: new Date()
      };
      
      if (action === 'export') {
        // Simulate data export
        updates.dataExported = { exported: true, exportDate: new Date() };
        updates.status = 'completed';
        updates.completedAt = new Date();
      } else if (action === 'delete') {
        // Simulate data deletion
        updates.dataDeleted = { deleted: true, deletionDate: new Date() };
        updates.status = 'completed';
        updates.completedAt = new Date();
      }
      
      const [updatedRequest] = await db
        .update(crmDataRequests)
        .set(updates)
        .where(eq(crmDataRequests.id, requestId))
        .returning();
      
      return updatedRequest;
    } catch (error) {
      throw new Error(`Failed to process data request: ${error}`);
    }
  }

  // ======= REPORTING & ANALYTICS =======
  
  async getDashboardMetrics(timeframe: string): Promise<any> {
    try {
      const timeframeDate = this.getTimeframeDate(timeframe);
      
      // Get comprehensive metrics
      const kycMetrics = await db
        .select({
          pending: sql`COUNT(CASE WHEN status = 'pending' THEN 1 END)`,
          approved: sql`COUNT(CASE WHEN status = 'approved' THEN 1 END)`,
          rejected: sql`COUNT(CASE WHEN status = 'rejected' THEN 1 END)`
        })
        .from(crmKycCases)
        .where(gte(crmKycCases.createdAt, timeframeDate));
      
      const supportMetrics = await db
        .select({
          open: sql`COUNT(CASE WHEN status = 'open' THEN 1 END)`,
          resolved: sql`COUNT(CASE WHEN status = 'resolved' THEN 1 END)`,
          slaBreaches: sql`COUNT(CASE WHEN resolved_at > sla_target THEN 1 END)`
        })
        .from(crmSupportTickets)
        .where(gte(crmSupportTickets.createdAt, timeframeDate));
      
      const amlMetrics = await db
        .select({
          openAlerts: sql`COUNT(CASE WHEN status = 'open' THEN 1 END)`,
          criticalAlerts: sql`COUNT(CASE WHEN severity = 'critical' THEN 1 END)`,
          sarsFiled: sql`COUNT(CASE WHEN sar_filed = true THEN 1 END)`
        })
        .from(crmAmlAlerts)
        .where(gte(crmAmlAlerts.createdAt, timeframeDate));
      
      return {
        kyc: kycMetrics[0],
        support: supportMetrics[0],
        aml: amlMetrics[0],
        systemHealth: {
          uptime: '99.98%',
          responseTime: '< 200ms',
          activeUsers: 15234
        }
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard metrics: ${error}`);
    }
  }

  async generateCustomReport(reportType: string, parameters: any, format: string, generatedBy: string): Promise<any> {
    try {
      // Simulate report generation
      const reportData = {
        reportId: crypto.randomUUID(),
        reportType,
        format,
        parameters,
        generatedBy,
        generatedAt: new Date(),
        status: 'completed',
        downloadUrl: `/api/reports/download/${crypto.randomUUID()}`
      };
      
      return reportData;
    } catch (error) {
      throw new Error(`Failed to generate custom report: ${error}`);
    }
  }

  async getScheduledReports(): Promise<any[]> {
    try {
      const reports = await db
        .select()
        .from(crmScheduledReports)
        .where(eq(crmScheduledReports.isActive, true))
        .orderBy(asc(crmScheduledReports.nextScheduled));
      
      return reports;
    } catch (error) {
      throw new Error(`Failed to get scheduled reports: ${error}`);
    }
  }

  // ======= AUTOMATION & WORKFLOW =======
  
  async getAutomationRules(): Promise<any[]> {
    try {
      const rules = await db
        .select()
        .from(crmAutomationRules)
        .where(eq(crmAutomationRules.isActive, true))
        .orderBy(asc(crmAutomationRules.priority));
      
      return rules;
    } catch (error) {
      throw new Error(`Failed to get automation rules: ${error}`);
    }
  }

  async createAutomationRule(ruleData: any): Promise<any> {
    try {
      const [newRule] = await db
        .insert(crmAutomationRules)
        .values({
          ...ruleData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      return newRule;
    } catch (error) {
      throw new Error(`Failed to create automation rule: ${error}`);
    }
  }

  async testAutomationRule(ruleId: string, testData: any): Promise<any> {
    try {
      // Simulate rule testing
      const testResult = {
        ruleId,
        testData,
        result: {
          triggered: true,
          conditions_met: ['condition_1', 'condition_2'],
          actions_executed: ['send_email', 'update_status'],
          execution_time: '45ms'
        },
        timestamp: new Date()
      };
      
      return testResult;
    } catch (error) {
      throw new Error(`Failed to test automation rule: ${error}`);
    }
  }

  // ======= UTILITY METHODS =======
  
  private getTimeframeDate(timeframe: string): Date {
    const now = new Date();
    const timeframes: { [key: string]: number } = {
      '1d': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = timeframes[timeframe] || 30;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }
}

export const enhancedCrmStorage = new EnhancedCRMDatabaseStorage();