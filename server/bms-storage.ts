import {
  executiveDashboards,
  boardReports,
  kycWorkflows,
  userSegments,
  walletOperations,
  treasuryReports,
  tradingPairControls,
  riskMonitoring,
  complianceReports,
  auditLogs,
  legalDocuments,
  supportTickets,
  ticketMessages,
  customerProfiles,
  affiliatePrograms,
  affiliateTracking,
  revenueReports,
  invoices,
  securityIncidents,
  securityAlerts,
  customDashboards,
  systemAlerts,
  staffDirectory,
  performanceMetrics,
  type ExecutiveDashboard,
  type InsertExecutiveDashboard,
  type BoardReport,
  type InsertBoardReport,
  type KycWorkflow,
  type InsertKycWorkflow,
  type UserSegment,
  type InsertUserSegment,
  type WalletOperation,
  type InsertWalletOperation,
  type TreasuryReport,
  type InsertTreasuryReport,
  type TradingPairControl,
  type InsertTradingPairControl,
  type RiskMonitoring,
  type InsertRiskMonitoring,
  type ComplianceReport,
  type InsertComplianceReport,
  type AuditLog,
  type InsertAuditLog,
  type LegalDocument,
  type InsertLegalDocument,
  type SupportTicket,
  type InsertSupportTicket,
  type TicketMessage,
  type InsertTicketMessage,
  type CustomerProfile,
  type InsertCustomerProfile,
  type AffiliateProgram,
  type InsertAffiliateProgram,
  type AffiliateTracking,
  type InsertAffiliateTracking,
  type RevenueReport,
  type InsertRevenueReport,
  type Invoice,
  type InsertInvoice,
  type SecurityIncident,
  type InsertSecurityIncident,
  type SecurityAlert,
  type InsertSecurityAlert,
  type CustomDashboard,
  type InsertCustomDashboard,
  type SystemAlert,
  type InsertSystemAlert,
  type StaffDirectory,
  type InsertStaffDirectory,
  type PerformanceMetric,
  type InsertPerformanceMetric,
} from "@shared/bms-schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc, count, sum, avg, sql } from "drizzle-orm";

export interface IBMSStorage {
  // Executive Management & Dashboard
  createExecutiveDashboard(dashboard: InsertExecutiveDashboard): Promise<ExecutiveDashboard>;
  getExecutiveDashboard(id: string): Promise<ExecutiveDashboard | undefined>;
  getExecutiveDashboardsByUser(userId: string): Promise<ExecutiveDashboard[]>;
  updateExecutiveDashboard(id: string, updates: Partial<ExecutiveDashboard>): Promise<ExecutiveDashboard>;
  
  createBoardReport(report: InsertBoardReport): Promise<BoardReport>;
  getBoardReports(filters?: { period?: string; reportType?: string }): Promise<BoardReport[]>;
  getBoardReport(id: string): Promise<BoardReport | undefined>;
  updateBoardReport(id: string, updates: Partial<BoardReport>): Promise<BoardReport>;
  
  // KYC & User Management
  createKycWorkflow(workflow: InsertKycWorkflow): Promise<KycWorkflow>;
  getKycWorkflow(id: string): Promise<KycWorkflow | undefined>;
  getKycWorkflowByUser(userId: string): Promise<KycWorkflow | undefined>;
  updateKycWorkflow(id: string, updates: Partial<KycWorkflow>): Promise<KycWorkflow>;
  getKycWorkflowsByStatus(status: string): Promise<KycWorkflow[]>;
  getKycWorkflowsByReviewer(reviewerId: string): Promise<KycWorkflow[]>;
  
  createUserSegment(segment: InsertUserSegment): Promise<UserSegment>;
  getUserSegment(userId: string): Promise<UserSegment | undefined>;
  updateUserSegment(userId: string, updates: Partial<UserSegment>): Promise<UserSegment>;
  getUserSegmentsByType(segmentType: string): Promise<UserSegment[]>;
  
  // Wallet & Treasury Management
  createWalletOperation(operation: InsertWalletOperation): Promise<WalletOperation>;
  getWalletOperation(id: string): Promise<WalletOperation | undefined>;
  getWalletOperations(filters?: {
    walletType?: string;
    asset?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<WalletOperation[]>;
  updateWalletOperation(id: string, updates: Partial<WalletOperation>): Promise<WalletOperation>;
  
  createTreasuryReport(report: InsertTreasuryReport): Promise<TreasuryReport>;
  getTreasuryReport(id: string): Promise<TreasuryReport | undefined>;
  getTreasuryReports(dateFrom?: Date, dateTo?: Date): Promise<TreasuryReport[]>;
  getLatestTreasuryReport(): Promise<TreasuryReport | undefined>;
  
  // Trading Operations & Risk
  createTradingPairControl(control: InsertTradingPairControl): Promise<TradingPairControl>;
  getTradingPairControl(symbol: string): Promise<TradingPairControl | undefined>;
  getTradingPairControls(): Promise<TradingPairControl[]>;
  updateTradingPairControl(symbol: string, updates: Partial<TradingPairControl>): Promise<TradingPairControl>;
  
  createRiskMonitoring(risk: InsertRiskMonitoring): Promise<RiskMonitoring>;
  getRiskMonitoring(id: string): Promise<RiskMonitoring | undefined>;
  getRiskMonitoringAlerts(riskLevel?: string): Promise<RiskMonitoring[]>;
  updateRiskMonitoring(id: string, updates: Partial<RiskMonitoring>): Promise<RiskMonitoring>;
  
  // Compliance & Legal
  createComplianceReport(report: InsertComplianceReport): Promise<ComplianceReport>;
  getComplianceReport(id: string): Promise<ComplianceReport | undefined>;
  getComplianceReports(filters?: {
    reportType?: string;
    jurisdiction?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<ComplianceReport[]>;
  updateComplianceReport(id: string, updates: Partial<ComplianceReport>): Promise<ComplianceReport>;
  
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(filters?: {
    userId?: string;
    action?: string;
    resourceType?: string;
    department?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<AuditLog[]>;
  
  createLegalDocument(document: InsertLegalDocument): Promise<LegalDocument>;
  getLegalDocument(id: string): Promise<LegalDocument | undefined>;
  getLegalDocuments(documentType?: string): Promise<LegalDocument[]>;
  updateLegalDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument>;
  
  // CRM & Support
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getSupportTicket(id: string): Promise<SupportTicket | undefined>;
  getSupportTickets(filters?: {
    userId?: string;
    status?: string;
    assignedTo?: string;
    priority?: string;
    category?: string;
  }): Promise<SupportTicket[]>;
  updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket>;
  
  createTicketMessage(message: InsertTicketMessage): Promise<TicketMessage>;
  getTicketMessages(ticketId: string): Promise<TicketMessage[]>;
  
  createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile>;
  getCustomerProfile(userId: string): Promise<CustomerProfile | undefined>;
  updateCustomerProfile(userId: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile>;
  getCustomersByTier(tier: string): Promise<CustomerProfile[]>;
  
  // Affiliate & Partnership
  createAffiliateProgram(program: InsertAffiliateProgram): Promise<AffiliateProgram>;
  getAffiliateProgram(id: string): Promise<AffiliateProgram | undefined>;
  getAffiliatePrograms(): Promise<AffiliateProgram[]>;
  updateAffiliateProgram(id: string, updates: Partial<AffiliateProgram>): Promise<AffiliateProgram>;
  
  createAffiliateTracking(tracking: InsertAffiliateTracking): Promise<AffiliateTracking>;
  getAffiliateTracking(filters?: {
    affiliateId?: string;
    programId?: string;
    paymentStatus?: string;
  }): Promise<AffiliateTracking[]>;
  updateAffiliateTracking(id: string, updates: Partial<AffiliateTracking>): Promise<AffiliateTracking>;
  
  // Financial Management
  createRevenueReport(report: InsertRevenueReport): Promise<RevenueReport>;
  getRevenueReport(id: string): Promise<RevenueReport | undefined>;
  getRevenueReports(period?: string): Promise<RevenueReport[]>;
  
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoices(filters?: {
    clientId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Invoice[]>;
  updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice>;
  
  // Security & Incident Management
  createSecurityIncident(incident: InsertSecurityIncident): Promise<SecurityIncident>;
  getSecurityIncident(id: string): Promise<SecurityIncident | undefined>;
  getSecurityIncidents(filters?: {
    incidentType?: string;
    severity?: string;
    status?: string;
  }): Promise<SecurityIncident[]>;
  updateSecurityIncident(id: string, updates: Partial<SecurityIncident>): Promise<SecurityIncident>;
  
  createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert>;
  getSecurityAlerts(filters?: { alertType?: string; severity?: string; status?: string }): Promise<SecurityAlert[]>;
  updateSecurityAlert(id: string, updates: Partial<SecurityAlert>): Promise<SecurityAlert>;
  
  // Analytics & Reporting
  createCustomDashboard(dashboard: InsertCustomDashboard): Promise<CustomDashboard>;
  getCustomDashboard(id: string): Promise<CustomDashboard | undefined>;
  getCustomDashboards(userId: string): Promise<CustomDashboard[]>;
  updateCustomDashboard(id: string, updates: Partial<CustomDashboard>): Promise<CustomDashboard>;
  
  createSystemAlert(alert: InsertSystemAlert): Promise<SystemAlert>;
  getSystemAlert(id: string): Promise<SystemAlert | undefined>;
  getSystemAlerts(department?: string): Promise<SystemAlert[]>;
  updateSystemAlert(id: string, updates: Partial<SystemAlert>): Promise<SystemAlert>;
  
  // HR & Internal Operations
  createStaffMember(staff: InsertStaffDirectory): Promise<StaffDirectory>;
  getStaffMember(id: string): Promise<StaffDirectory | undefined>;
  getStaffByDepartment(department: string): Promise<StaffDirectory[]>;
  updateStaffMember(id: string, updates: Partial<StaffDirectory>): Promise<StaffDirectory>;
  
  createPerformanceMetric(metric: InsertPerformanceMetric): Promise<PerformanceMetric>;
  getPerformanceMetrics(employeeId: string, period?: string): Promise<PerformanceMetric[]>;
  
  // Analytics & Dashboard Data
  getDashboardKPIs(): Promise<any>;
  getSystemHealthMetrics(): Promise<any>;
  getRiskSummary(): Promise<any>;
  getComplianceSummary(): Promise<any>;
}

export class BMSDatabaseStorage implements IBMSStorage {
  // Executive Management & Dashboard
  async createExecutiveDashboard(insertDashboard: InsertExecutiveDashboard): Promise<ExecutiveDashboard> {
    const [dashboard] = await db
      .insert(executiveDashboards)
      .values(insertDashboard)
      .returning();
    return dashboard;
  }

  async getExecutiveDashboard(id: string): Promise<ExecutiveDashboard | undefined> {
    const [dashboard] = await db
      .select()
      .from(executiveDashboards)
      .where(eq(executiveDashboards.id, id));
    return dashboard;
  }

  async getExecutiveDashboardsByUser(userId: string): Promise<ExecutiveDashboard[]> {
    return await db
      .select()
      .from(executiveDashboards)
      .where(and(
        eq(executiveDashboards.userId, userId),
        eq(executiveDashboards.isActive, true)
      ))
      .orderBy(desc(executiveDashboards.createdAt));
  }

  async updateExecutiveDashboard(id: string, updates: Partial<ExecutiveDashboard>): Promise<ExecutiveDashboard> {
    const [dashboard] = await db
      .update(executiveDashboards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(executiveDashboards.id, id))
      .returning();
    return dashboard;
  }

  async createBoardReport(insertReport: InsertBoardReport): Promise<BoardReport> {
    const [report] = await db
      .insert(boardReports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getBoardReports(filters: { period?: string; reportType?: string } = {}): Promise<BoardReport[]> {
    let query = db.select().from(boardReports);
    
    if (filters.period) {
      query = query.where(eq(boardReports.period, filters.period));
    }
    if (filters.reportType) {
      query = query.where(eq(boardReports.reportType, filters.reportType));
    }
    
    return await query.orderBy(desc(boardReports.createdAt));
  }

  async getBoardReport(id: string): Promise<BoardReport | undefined> {
    const [report] = await db
      .select()
      .from(boardReports)
      .where(eq(boardReports.id, id));
    return report;
  }

  async updateBoardReport(id: string, updates: Partial<BoardReport>): Promise<BoardReport> {
    const [report] = await db
      .update(boardReports)
      .set(updates)
      .where(eq(boardReports.id, id))
      .returning();
    return report;
  }

  // KYC & User Management
  async createKycWorkflow(insertWorkflow: InsertKycWorkflow): Promise<KycWorkflow> {
    const [workflow] = await db
      .insert(kycWorkflows)
      .values(insertWorkflow)
      .returning();
    return workflow;
  }

  async getKycWorkflow(id: string): Promise<KycWorkflow | undefined> {
    const [workflow] = await db
      .select()
      .from(kycWorkflows)
      .where(eq(kycWorkflows.id, id));
    return workflow;
  }

  async getKycWorkflowByUser(userId: string): Promise<KycWorkflow | undefined> {
    const [workflow] = await db
      .select()
      .from(kycWorkflows)
      .where(eq(kycWorkflows.userId, userId))
      .orderBy(desc(kycWorkflows.createdAt))
      .limit(1);
    return workflow;
  }

  async updateKycWorkflow(id: string, updates: Partial<KycWorkflow>): Promise<KycWorkflow> {
    const [workflow] = await db
      .update(kycWorkflows)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(kycWorkflows.id, id))
      .returning();
    return workflow;
  }

  async getKycWorkflowsByStatus(status: string): Promise<KycWorkflow[]> {
    return await db
      .select()
      .from(kycWorkflows)
      .where(eq(kycWorkflows.status, status))
      .orderBy(desc(kycWorkflows.createdAt));
  }

  async getKycWorkflowsByReviewer(reviewerId: string): Promise<KycWorkflow[]> {
    return await db
      .select()
      .from(kycWorkflows)
      .where(eq(kycWorkflows.assignedReviewer, reviewerId))
      .orderBy(desc(kycWorkflows.createdAt));
  }

  async createUserSegment(insertSegment: InsertUserSegment): Promise<UserSegment> {
    const [segment] = await db
      .insert(userSegments)
      .values(insertSegment)
      .returning();
    return segment;
  }

  async getUserSegment(userId: string): Promise<UserSegment | undefined> {
    const [segment] = await db
      .select()
      .from(userSegments)
      .where(eq(userSegments.userId, userId));
    return segment;
  }

  async updateUserSegment(userId: string, updates: Partial<UserSegment>): Promise<UserSegment> {
    const [segment] = await db
      .update(userSegments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSegments.userId, userId))
      .returning();
    return segment;
  }

  async getUserSegmentsByType(segmentType: string): Promise<UserSegment[]> {
    return await db
      .select()
      .from(userSegments)
      .where(eq(userSegments.segmentType, segmentType))
      .orderBy(desc(userSegments.updatedAt));
  }

  // Wallet & Treasury Management
  async createWalletOperation(insertOperation: InsertWalletOperation): Promise<WalletOperation> {
    const [operation] = await db
      .insert(walletOperations)
      .values(insertOperation)
      .returning();
    return operation;
  }

  async getWalletOperation(id: string): Promise<WalletOperation | undefined> {
    const [operation] = await db
      .select()
      .from(walletOperations)
      .where(eq(walletOperations.id, id));
    return operation;
  }

  async getWalletOperations(filters: {
    walletType?: string;
    asset?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}): Promise<WalletOperation[]> {
    let query = db.select().from(walletOperations);
    const conditions = [];

    if (filters.walletType) {
      conditions.push(eq(walletOperations.walletType, filters.walletType));
    }
    if (filters.asset) {
      conditions.push(eq(walletOperations.asset, filters.asset));
    }
    if (filters.status) {
      conditions.push(eq(walletOperations.status, filters.status));
    }
    if (filters.dateFrom) {
      conditions.push(gte(walletOperations.createdAt, filters.dateFrom));
    }
    if (filters.dateTo) {
      conditions.push(lte(walletOperations.createdAt, filters.dateTo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(walletOperations.createdAt));
  }

  async updateWalletOperation(id: string, updates: Partial<WalletOperation>): Promise<WalletOperation> {
    const [operation] = await db
      .update(walletOperations)
      .set(updates)
      .where(eq(walletOperations.id, id))
      .returning();
    return operation;
  }

  async createTreasuryReport(insertReport: InsertTreasuryReport): Promise<TreasuryReport> {
    const [report] = await db
      .insert(treasuryReports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getTreasuryReport(id: string): Promise<TreasuryReport | undefined> {
    const [report] = await db
      .select()
      .from(treasuryReports)
      .where(eq(treasuryReports.id, id));
    return report;
  }

  async getTreasuryReports(dateFrom?: Date, dateTo?: Date): Promise<TreasuryReport[]> {
    let query = db.select().from(treasuryReports);
    const conditions = [];

    if (dateFrom) {
      conditions.push(gte(treasuryReports.reportDate, dateFrom));
    }
    if (dateTo) {
      conditions.push(lte(treasuryReports.reportDate, dateTo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(treasuryReports.reportDate));
  }

  async getLatestTreasuryReport(): Promise<TreasuryReport | undefined> {
    const [report] = await db
      .select()
      .from(treasuryReports)
      .orderBy(desc(treasuryReports.reportDate))
      .limit(1);
    return report;
  }

  // Trading Operations & Risk
  async createTradingPairControl(insertControl: InsertTradingPairControl): Promise<TradingPairControl> {
    const [control] = await db
      .insert(tradingPairControls)
      .values(insertControl)
      .returning();
    return control;
  }

  async getTradingPairControl(symbol: string): Promise<TradingPairControl | undefined> {
    const [control] = await db
      .select()
      .from(tradingPairControls)
      .where(eq(tradingPairControls.symbol, symbol));
    return control;
  }

  async getTradingPairControls(): Promise<TradingPairControl[]> {
    return await db
      .select()
      .from(tradingPairControls)
      .orderBy(asc(tradingPairControls.symbol));
  }

  async updateTradingPairControl(symbol: string, updates: Partial<TradingPairControl>): Promise<TradingPairControl> {
    const [control] = await db
      .update(tradingPairControls)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tradingPairControls.symbol, symbol))
      .returning();
    return control;
  }

  async createRiskMonitoring(insertRisk: InsertRiskMonitoring): Promise<RiskMonitoring> {
    const [risk] = await db
      .insert(riskMonitoring)
      .values(insertRisk)
      .returning();
    return risk;
  }

  async getRiskMonitoring(id: string): Promise<RiskMonitoring | undefined> {
    const [risk] = await db
      .select()
      .from(riskMonitoring)
      .where(eq(riskMonitoring.id, id));
    return risk;
  }

  async getRiskMonitoringAlerts(riskLevel?: string): Promise<RiskMonitoring[]> {
    let query = db.select().from(riskMonitoring);
    
    if (riskLevel) {
      query = query.where(eq(riskMonitoring.riskLevel, riskLevel));
    }
    
    return await query
      .where(eq(riskMonitoring.alertTriggered, true))
      .orderBy(desc(riskMonitoring.createdAt));
  }

  async updateRiskMonitoring(id: string, updates: Partial<RiskMonitoring>): Promise<RiskMonitoring> {
    const [risk] = await db
      .update(riskMonitoring)
      .set(updates)
      .where(eq(riskMonitoring.id, id))
      .returning();
    return risk;
  }

  // Compliance & Legal
  async createComplianceReport(insertReport: InsertComplianceReport): Promise<ComplianceReport> {
    const [report] = await db
      .insert(complianceReports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getComplianceReport(id: string): Promise<ComplianceReport | undefined> {
    const [report] = await db
      .select()
      .from(complianceReports)
      .where(eq(complianceReports.id, id));
    return report;
  }

  async getComplianceReports(filters: {
    reportType?: string;
    jurisdiction?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}): Promise<ComplianceReport[]> {
    let query = db.select().from(complianceReports);
    const conditions = [];

    if (filters.reportType) {
      conditions.push(eq(complianceReports.reportType, filters.reportType));
    }
    if (filters.jurisdiction) {
      conditions.push(eq(complianceReports.jurisdiction, filters.jurisdiction));
    }
    if (filters.status) {
      conditions.push(eq(complianceReports.status, filters.status));
    }
    if (filters.dateFrom) {
      conditions.push(gte(complianceReports.createdAt, filters.dateFrom));
    }
    if (filters.dateTo) {
      conditions.push(lte(complianceReports.createdAt, filters.dateTo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(complianceReports.createdAt));
  }

  async updateComplianceReport(id: string, updates: Partial<ComplianceReport>): Promise<ComplianceReport> {
    const [report] = await db
      .update(complianceReports)
      .set(updates)
      .where(eq(complianceReports.id, id))
      .returning();
    return report;
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db
      .insert(auditLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    resourceType?: string;
    department?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs);
    const conditions = [];

    if (filters.userId) {
      conditions.push(eq(auditLogs.userId, filters.userId));
    }
    if (filters.action) {
      conditions.push(eq(auditLogs.action, filters.action));
    }
    if (filters.resourceType) {
      conditions.push(eq(auditLogs.resourceType, filters.resourceType));
    }
    if (filters.department) {
      conditions.push(eq(auditLogs.department, filters.department));
    }
    if (filters.dateFrom) {
      conditions.push(gte(auditLogs.createdAt, filters.dateFrom));
    }
    if (filters.dateTo) {
      conditions.push(lte(auditLogs.createdAt, filters.dateTo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(auditLogs.createdAt));
  }

  async createLegalDocument(insertDocument: InsertLegalDocument): Promise<LegalDocument> {
    const [document] = await db
      .insert(legalDocuments)
      .values(insertDocument)
      .returning();
    return document;
  }

  async getLegalDocument(id: string): Promise<LegalDocument | undefined> {
    const [document] = await db
      .select()
      .from(legalDocuments)
      .where(eq(legalDocuments.id, id));
    return document;
  }

  async getLegalDocuments(documentType?: string): Promise<LegalDocument[]> {
    let query = db.select().from(legalDocuments);
    
    if (documentType) {
      query = query.where(eq(legalDocuments.documentType, documentType));
    }
    
    return await query
      .where(eq(legalDocuments.isActive, true))
      .orderBy(desc(legalDocuments.effectiveDate));
  }

  async updateLegalDocument(id: string, updates: Partial<LegalDocument>): Promise<LegalDocument> {
    const [document] = await db
      .update(legalDocuments)
      .set(updates)
      .where(eq(legalDocuments.id, id))
      .returning();
    return document;
  }

  // CRM & Support
  async createSupportTicket(insertTicket: InsertSupportTicket): Promise<SupportTicket> {
    const [ticket] = await db
      .insert(supportTickets)
      .values(insertTicket)
      .returning();
    return ticket;
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, id));
    return ticket;
  }

  async getSupportTickets(filters: {
    userId?: string;
    status?: string;
    assignedTo?: string;
    priority?: string;
    category?: string;
  } = {}): Promise<SupportTicket[]> {
    let query = db.select().from(supportTickets);
    const conditions = [];

    if (filters.userId) {
      conditions.push(eq(supportTickets.userId, filters.userId));
    }
    if (filters.status) {
      conditions.push(eq(supportTickets.status, filters.status));
    }
    if (filters.assignedTo) {
      conditions.push(eq(supportTickets.assignedTo, filters.assignedTo));
    }
    if (filters.priority) {
      conditions.push(eq(supportTickets.priority, filters.priority));
    }
    if (filters.category) {
      conditions.push(eq(supportTickets.category, filters.category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(supportTickets.createdAt));
  }

  async updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket> {
    const [ticket] = await db
      .update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return ticket;
  }

  async createTicketMessage(insertMessage: InsertTicketMessage): Promise<TicketMessage> {
    const [message] = await db
      .insert(ticketMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    return await db
      .select()
      .from(ticketMessages)
      .where(eq(ticketMessages.ticketId, ticketId))
      .orderBy(asc(ticketMessages.createdAt));
  }

  async createCustomerProfile(insertProfile: InsertCustomerProfile): Promise<CustomerProfile> {
    const [profile] = await db
      .insert(customerProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async getCustomerProfile(userId: string): Promise<CustomerProfile | undefined> {
    const [profile] = await db
      .select()
      .from(customerProfiles)
      .where(eq(customerProfiles.userId, userId));
    return profile;
  }

  async updateCustomerProfile(userId: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    const [profile] = await db
      .update(customerProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customerProfiles.userId, userId))
      .returning();
    return profile;
  }

  async getCustomersByTier(tier: string): Promise<CustomerProfile[]> {
    return await db
      .select()
      .from(customerProfiles)
      .where(eq(customerProfiles.customerTier, tier))
      .orderBy(desc(customerProfiles.lifetimeValue));
  }

  // Affiliate & Partnership
  async createAffiliateProgram(insertProgram: InsertAffiliateProgram): Promise<AffiliateProgram> {
    const [program] = await db
      .insert(affiliatePrograms)
      .values(insertProgram)
      .returning();
    return program;
  }

  async getAffiliateProgram(id: string): Promise<AffiliateProgram | undefined> {
    const [program] = await db
      .select()
      .from(affiliatePrograms)
      .where(eq(affiliatePrograms.id, id));
    return program;
  }

  async getAffiliatePrograms(): Promise<AffiliateProgram[]> {
    return await db
      .select()
      .from(affiliatePrograms)
      .orderBy(desc(affiliatePrograms.createdAt));
  }

  async updateAffiliateProgram(id: string, updates: Partial<AffiliateProgram>): Promise<AffiliateProgram> {
    const [program] = await db
      .update(affiliatePrograms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(affiliatePrograms.id, id))
      .returning();
    return program;
  }

  async createAffiliateTracking(insertTracking: InsertAffiliateTracking): Promise<AffiliateTracking> {
    const [tracking] = await db
      .insert(affiliateTracking)
      .values(insertTracking)
      .returning();
    return tracking;
  }

  async getAffiliateTracking(filters: {
    affiliateId?: string;
    programId?: string;
    paymentStatus?: string;
  } = {}): Promise<AffiliateTracking[]> {
    let query = db.select().from(affiliateTracking);
    const conditions = [];

    if (filters.affiliateId) {
      conditions.push(eq(affiliateTracking.affiliateId, filters.affiliateId));
    }
    if (filters.programId) {
      conditions.push(eq(affiliateTracking.programId, filters.programId));
    }
    if (filters.paymentStatus) {
      conditions.push(eq(affiliateTracking.paymentStatus, filters.paymentStatus));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(affiliateTracking.createdAt));
  }

  async updateAffiliateTracking(id: string, updates: Partial<AffiliateTracking>): Promise<AffiliateTracking> {
    const [tracking] = await db
      .update(affiliateTracking)
      .set(updates)
      .where(eq(affiliateTracking.id, id))
      .returning();
    return tracking;
  }

  // Financial Management
  async createRevenueReport(insertReport: InsertRevenueReport): Promise<RevenueReport> {
    const [report] = await db
      .insert(revenueReports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getRevenueReport(id: string): Promise<RevenueReport | undefined> {
    const [report] = await db
      .select()
      .from(revenueReports)
      .where(eq(revenueReports.id, id));
    return report;
  }

  async getRevenueReports(period?: string): Promise<RevenueReport[]> {
    let query = db.select().from(revenueReports);
    
    if (period) {
      query = query.where(eq(revenueReports.reportPeriod, period));
    }
    
    return await query.orderBy(desc(revenueReports.createdAt));
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db
      .insert(invoices)
      .values(insertInvoice)
      .returning();
    return invoice;
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id));
    return invoice;
  }

  async getInvoices(filters: {
    clientId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}): Promise<Invoice[]> {
    let query = db.select().from(invoices);
    const conditions = [];

    if (filters.clientId) {
      conditions.push(eq(invoices.clientId, filters.clientId));
    }
    if (filters.status) {
      conditions.push(eq(invoices.status, filters.status));
    }
    if (filters.dateFrom) {
      conditions.push(gte(invoices.createdAt, filters.dateFrom));
    }
    if (filters.dateTo) {
      conditions.push(lte(invoices.createdAt, filters.dateTo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(invoices.createdAt));
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const [invoice] = await db
      .update(invoices)
      .set(updates)
      .where(eq(invoices.id, id))
      .returning();
    return invoice;
  }

  // Security & Incident Management
  async createSecurityIncident(insertIncident: InsertSecurityIncident): Promise<SecurityIncident> {
    const [incident] = await db
      .insert(securityIncidents)
      .values(insertIncident)
      .returning();
    return incident;
  }

  async getSecurityIncident(id: string): Promise<SecurityIncident | undefined> {
    const [incident] = await db
      .select()
      .from(securityIncidents)
      .where(eq(securityIncidents.id, id));
    return incident;
  }

  async getSecurityIncidents(filters: {
    incidentType?: string;
    severity?: string;
    status?: string;
  } = {}): Promise<SecurityIncident[]> {
    let query = db.select().from(securityIncidents);
    const conditions = [];

    if (filters.incidentType) {
      conditions.push(eq(securityIncidents.incidentType, filters.incidentType));
    }
    if (filters.severity) {
      conditions.push(eq(securityIncidents.severity, filters.severity));
    }
    if (filters.status) {
      conditions.push(eq(securityIncidents.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(securityIncidents.createdAt));
  }

  async updateSecurityIncident(id: string, updates: Partial<SecurityIncident>): Promise<SecurityIncident> {
    const [incident] = await db
      .update(securityIncidents)
      .set(updates)
      .where(eq(securityIncidents.id, id))
      .returning();
    return incident;
  }

  async createSecurityAlert(insertAlert: InsertSecurityAlert): Promise<SecurityAlert> {
    const [alert] = await db
      .insert(securityAlerts)
      .values(insertAlert)
      .returning();
    return alert;
  }

  async getSecurityAlerts(filters: { alertType?: string; severity?: string; status?: string } = {}): Promise<SecurityAlert[]> {
    let query = db.select().from(securityAlerts);
    const conditions = [];

    if (filters.alertType) {
      conditions.push(eq(securityAlerts.alertType, filters.alertType));
    }
    if (filters.severity) {
      conditions.push(eq(securityAlerts.severity, filters.severity));
    }
    if (filters.status) {
      conditions.push(eq(securityAlerts.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(securityAlerts.createdAt));
  }

  async updateSecurityAlert(id: string, updates: Partial<SecurityAlert>): Promise<SecurityAlert> {
    const [alert] = await db
      .update(securityAlerts)
      .set(updates)
      .where(eq(securityAlerts.id, id))
      .returning();
    return alert;
  }

  // Analytics & Reporting
  async createCustomDashboard(insertDashboard: InsertCustomDashboard): Promise<CustomDashboard> {
    const [dashboard] = await db
      .insert(customDashboards)
      .values(insertDashboard)
      .returning();
    return dashboard;
  }

  async getCustomDashboard(id: string): Promise<CustomDashboard | undefined> {
    const [dashboard] = await db
      .select()
      .from(customDashboards)
      .where(eq(customDashboards.id, id));
    return dashboard;
  }

  async getCustomDashboards(userId: string): Promise<CustomDashboard[]> {
    return await db
      .select()
      .from(customDashboards)
      .where(eq(customDashboards.userId, userId))
      .orderBy(desc(customDashboards.lastViewedAt));
  }

  async updateCustomDashboard(id: string, updates: Partial<CustomDashboard>): Promise<CustomDashboard> {
    const [dashboard] = await db
      .update(customDashboards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(customDashboards.id, id))
      .returning();
    return dashboard;
  }

  async createSystemAlert(insertAlert: InsertSystemAlert): Promise<SystemAlert> {
    const [alert] = await db
      .insert(systemAlerts)
      .values(insertAlert)
      .returning();
    return alert;
  }

  async getSystemAlert(id: string): Promise<SystemAlert | undefined> {
    const [alert] = await db
      .select()
      .from(systemAlerts)
      .where(eq(systemAlerts.id, id));
    return alert;
  }

  async getSystemAlerts(department?: string): Promise<SystemAlert[]> {
    let query = db.select().from(systemAlerts);
    
    if (department) {
      query = query.where(eq(systemAlerts.department, department));
    }
    
    return await query
      .where(eq(systemAlerts.isActive, true))
      .orderBy(desc(systemAlerts.createdAt));
  }

  async updateSystemAlert(id: string, updates: Partial<SystemAlert>): Promise<SystemAlert> {
    const [alert] = await db
      .update(systemAlerts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(systemAlerts.id, id))
      .returning();
    return alert;
  }

  // HR & Internal Operations
  async createStaffMember(insertStaff: InsertStaffDirectory): Promise<StaffDirectory> {
    const [staff] = await db
      .insert(staffDirectory)
      .values(insertStaff)
      .returning();
    return staff;
  }

  async getStaffMember(id: string): Promise<StaffDirectory | undefined> {
    const [staff] = await db
      .select()
      .from(staffDirectory)
      .where(eq(staffDirectory.id, id));
    return staff;
  }

  async getStaffByDepartment(department: string): Promise<StaffDirectory[]> {
    return await db
      .select()
      .from(staffDirectory)
      .where(and(
        eq(staffDirectory.department, department),
        eq(staffDirectory.status, "active")
      ))
      .orderBy(asc(staffDirectory.lastName));
  }

  async updateStaffMember(id: string, updates: Partial<StaffDirectory>): Promise<StaffDirectory> {
    const [staff] = await db
      .update(staffDirectory)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(staffDirectory.id, id))
      .returning();
    return staff;
  }

  async createPerformanceMetric(insertMetric: InsertPerformanceMetric): Promise<PerformanceMetric> {
    const [metric] = await db
      .insert(performanceMetrics)
      .values(insertMetric)
      .returning();
    return metric;
  }

  async getPerformanceMetrics(employeeId: string, period?: string): Promise<PerformanceMetric[]> {
    let query = db.select().from(performanceMetrics).where(eq(performanceMetrics.employeeId, employeeId));
    
    if (period) {
      query = query.where(eq(performanceMetrics.period, period));
    }
    
    return await query.orderBy(desc(performanceMetrics.createdAt));
  }

  // Analytics & Dashboard Data
  async getDashboardKPIs(): Promise<any> {
    // This would aggregate key metrics across all modules
    const totalUsers = await db.select({ count: count() }).from(userSegments);
    const totalRevenue = await db
      .select({ total: sum(revenueReports.totalRevenue) })
      .from(revenueReports);
    const openTickets = await db
      .select({ count: count() })
      .from(supportTickets)
      .where(eq(supportTickets.status, "open"));
    const securityAlerts = await db
      .select({ count: count() })
      .from(securityAlerts)
      .where(eq(securityAlerts.status, "open"));

    return {
      totalUsers: totalUsers[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.total || "0",
      openTickets: openTickets[0]?.count || 0,
      securityAlerts: securityAlerts[0]?.count || 0,
    };
  }

  async getSystemHealthMetrics(): Promise<any> {
    const tradingPairs = await db.select({ count: count() }).from(tradingPairControls);
    const walletOps = await db
      .select({ count: count() })
      .from(walletOperations)
      .where(eq(walletOperations.status, "pending"));
    const riskAlerts = await db
      .select({ count: count() })
      .from(riskMonitoring)
      .where(eq(riskMonitoring.alertTriggered, true));

    return {
      activeTradingPairs: tradingPairs[0]?.count || 0,
      pendingWalletOps: walletOps[0]?.count || 0,
      riskAlerts: riskAlerts[0]?.count || 0,
    };
  }

  async getRiskSummary(): Promise<any> {
    const highRiskUsers = await db
      .select({ count: count() })
      .from(userSegments)
      .where(sql`json_extract(risk_flags, '$') != '[]'`);
    
    const criticalIncidents = await db
      .select({ count: count() })
      .from(securityIncidents)
      .where(eq(securityIncidents.severity, "critical"));

    return {
      highRiskUsers: highRiskUsers[0]?.count || 0,
      criticalIncidents: criticalIncidents[0]?.count || 0,
    };
  }

  async getComplianceSummary(): Promise<any> {
    const pendingKyc = await db
      .select({ count: count() })
      .from(kycWorkflows)
      .where(eq(kycWorkflows.status, "pending"));
    
    const pendingReports = await db
      .select({ count: count() })
      .from(complianceReports)
      .where(eq(complianceReports.status, "pending"));

    return {
      pendingKyc: pendingKyc[0]?.count || 0,
      pendingReports: pendingReports[0]?.count || 0,
    };
  }
}

export const bmsStorage = new BMSDatabaseStorage();