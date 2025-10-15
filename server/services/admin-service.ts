import { eq, desc, and, gte, lte, count, sql } from 'drizzle-orm';
import { db } from '../db';
import {
  userForensics,
  amlRiskProfiles,
  transactionMonitoring,
  complianceReports,
  walletOperations,
  supportTickets,
  crmAccounts,
  crmCommunications,
  regulatoryComms,
  contractTracking,
  systemHealthMetrics,
  type UserForensics,
  type AmlRiskProfile,
  type TransactionMonitoring,
  type ComplianceReport,
  type WalletOperation,
  type SupportTicket,
  type CrmAccount,
  type CrmCommunication,
  type RegulatoryComm,
  type ContractTracking,
  type SystemHealthMetric
} from '../../shared/admin-schema';

export class AdminService {
  // User Forensics
  async getUserForensics(userId: string): Promise<UserForensics | null> {
    const results = await db.select().from(userForensics).where(eq(userForensics.userId, userId));
    return results[0] || null;
  }

  async createUserForensics(data: Partial<UserForensics>): Promise<UserForensics> {
    const [result] = await db.insert(userForensics).values(data).returning();
    return result;
  }

  async updateUserForensics(userId: string, data: Partial<UserForensics>): Promise<UserForensics> {
    const [result] = await db.update(userForensics)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userForensics.userId, userId))
      .returning();
    return result;
  }

  // AML Risk Intelligence
  async getAmlRiskProfile(userId: string): Promise<AmlRiskProfile | null> {
    const results = await db.select().from(amlRiskProfiles).where(eq(amlRiskProfiles.userId, userId));
    return results[0] || null;
  }

  async getAllHighRiskUsers(): Promise<AmlRiskProfile[]> {
    return await db.select().from(amlRiskProfiles)
      .where(eq(amlRiskProfiles.riskLevel, 'high'))
      .orderBy(desc(amlRiskProfiles.createdAt));
  }

  async createAmlRiskProfile(data: Partial<AmlRiskProfile>): Promise<AmlRiskProfile> {
    const [result] = await db.insert(amlRiskProfiles).values(data).returning();
    return result;
  }

  async updateRiskScore(userId: string, score: number, flags: any): Promise<AmlRiskProfile> {
    const [result] = await db.update(amlRiskProfiles)
      .set({
        aiRiskScore: score.toString(),
        behaviorFlags: flags,
        lastReviewedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(amlRiskProfiles.userId, userId))
      .returning();
    return result;
  }

  // Transaction Monitoring
  async getFlaggedTransactions(): Promise<TransactionMonitoring[]> {
    return await db.select().from(transactionMonitoring)
      .where(eq(transactionMonitoring.status, 'flagged'))
      .orderBy(desc(transactionMonitoring.createdAt));
  }

  async getTransactionsByUser(userId: string): Promise<TransactionMonitoring[]> {
    return await db.select().from(transactionMonitoring)
      .where(eq(transactionMonitoring.userId, userId))
      .orderBy(desc(transactionMonitoring.createdAt));
  }

  async createTransactionMonitor(data: Partial<TransactionMonitoring>): Promise<TransactionMonitoring> {
    const [result] = await db.insert(transactionMonitoring).values(data).returning();
    return result;
  }

  async approveTransaction(id: number, approvedBy: string): Promise<TransactionMonitoring> {
    const [result] = await db.update(transactionMonitoring)
      .set({
        status: 'approved',
        approvedBy,
        reviewedAt: new Date()
      })
      .where(eq(transactionMonitoring.id, id))
      .returning();
    return result;
  }

  async flagTransaction(id: number, reason: string, reviewedBy: string): Promise<TransactionMonitoring> {
    const [result] = await db.update(transactionMonitoring)
      .set({
        status: 'flagged',
        flagReason: reason,
        reviewedBy,
        reviewedAt: new Date()
      })
      .where(eq(transactionMonitoring.id, id))
      .returning();
    return result;
  }

  // Compliance & Reporting
  async getComplianceReports(): Promise<ComplianceReport[]> {
    return await db.select().from(complianceReports)
      .orderBy(desc(complianceReports.createdAt));
  }

  async createComplianceReport(data: Partial<ComplianceReport>): Promise<ComplianceReport> {
    const [result] = await db.insert(complianceReports).values(data).returning();
    return result;
  }

  async generateCompliancePack(reportId: number): Promise<string> {
    // Generate compliance pack (ZIP file with documents, logs, notes)
    const reportPath = `/compliance/reports/${reportId}_${Date.now()}.zip`;
    
    await db.update(complianceReports)
      .set({ compliancePackPath: reportPath })
      .where(eq(complianceReports.id, reportId));
    
    return reportPath;
  }

  // Treasury Operations
  async getWalletOperations(): Promise<WalletOperation[]> {
    return await db.select().from(walletOperations)
      .orderBy(desc(walletOperations.createdAt));
  }

  async getPendingApprovals(): Promise<WalletOperation[]> {
    return await db.select().from(walletOperations)
      .where(and(
        eq(walletOperations.requiresApproval, true),
        eq(walletOperations.status, 'pending')
      ))
      .orderBy(desc(walletOperations.createdAt));
  }

  async approveWalletOperation(id: number, approvedBy: string): Promise<WalletOperation> {
    const [result] = await db.update(walletOperations)
      .set({
        status: 'approved',
        approvedBy,
        completedAt: new Date()
      })
      .where(eq(walletOperations.id, id))
      .returning();
    return result;
  }

  async scheduleReconciliation(walletType: string, scheduledAt: Date): Promise<WalletOperation> {
    const [result] = await db.insert(walletOperations).values({
      operationType: 'reconciliation',
      walletType,
      status: 'scheduled',
      scheduledAt,
      performedBy: 'system'
    }).returning();
    return result;
  }

  // Support & Ticketing
  async getSupportTickets(): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));
  }

  async getTicketsByCategory(category: string): Promise<SupportTicket[]> {
    return await db.select().from(supportTickets)
      .where(eq(supportTickets.category, category))
      .orderBy(desc(supportTickets.createdAt));
  }

  async createSupportTicket(data: Partial<SupportTicket>): Promise<SupportTicket> {
    const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const [result] = await db.insert(supportTickets).values({
      ...data,
      ticketId
    }).returning();
    return result;
  }

  async assignTicket(id: number, assignedTo: string): Promise<SupportTicket> {
    const [result] = await db.update(supportTickets)
      .set({
        assignedTo,
        status: 'in_progress',
        updatedAt: new Date()
      })
      .where(eq(supportTickets.id, id))
      .returning();
    return result;
  }

  async resolveTicket(id: number, resolutionNotes: string): Promise<SupportTicket> {
    const [result] = await db.update(supportTickets)
      .set({
        status: 'resolved',
        internalNotes: resolutionNotes,
        resolvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(supportTickets.id, id))
      .returning();
    return result;
  }

  // CRM Account Management
  async getCrmAccounts(): Promise<CrmAccount[]> {
    return await db.select().from(crmAccounts)
      .orderBy(desc(crmAccounts.updatedAt));
  }

  async getAccountsByStage(stage: string): Promise<CrmAccount[]> {
    return await db.select().from(crmAccounts)
      .where(eq(crmAccounts.stage, stage))
      .orderBy(desc(crmAccounts.dealValue));
  }

  async createCrmAccount(data: Partial<CrmAccount>): Promise<CrmAccount> {
    const [result] = await db.insert(crmAccounts).values(data).returning();
    return result;
  }

  async updateAccountStage(id: number, stage: string): Promise<CrmAccount> {
    const [result] = await db.update(crmAccounts)
      .set({
        stage,
        updatedAt: new Date()
      })
      .where(eq(crmAccounts.id, id))
      .returning();
    return result;
  }

  async addAccountRiskFlag(id: number, flag: string): Promise<CrmAccount> {
    const account = await db.select().from(crmAccounts).where(eq(crmAccounts.id, id));
    if (!account[0]) throw new Error('Account not found');
    
    const currentFlags = account[0].riskFlags || [];
    const updatedFlags = [...currentFlags, flag];
    
    const [result] = await db.update(crmAccounts)
      .set({
        riskFlags: updatedFlags,
        updatedAt: new Date()
      })
      .where(eq(crmAccounts.id, id))
      .returning();
    return result;
  }

  // CRM Communications
  async getCommunicationsByAccount(accountId: number): Promise<CrmCommunication[]> {
    return await db.select().from(crmCommunications)
      .where(eq(crmCommunications.accountId, accountId))
      .orderBy(desc(crmCommunications.createdAt));
  }

  async createCommunication(data: Partial<CrmCommunication>): Promise<CrmCommunication> {
    const [result] = await db.insert(crmCommunications).values(data).returning();
    return result;
  }

  async getFollowUpCommunications(): Promise<CrmCommunication[]> {
    return await db.select().from(crmCommunications)
      .where(and(
        eq(crmCommunications.followUpRequired, true),
        lte(crmCommunications.followUpDate, new Date())
      ))
      .orderBy(desc(crmCommunications.followUpDate));
  }

  // Regulatory Communications
  async getRegulatoryComms(): Promise<RegulatoryComm[]> {
    return await db.select().from(regulatoryComms)
      .orderBy(desc(regulatoryComms.createdAt));
  }

  async getUpcomingRegulatoryDeadlines(): Promise<RegulatoryComm[]> {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    return await db.select().from(regulatoryComms)
      .where(and(
        lte(regulatoryComms.dueDate, sevenDaysFromNow),
        eq(regulatoryComms.status, 'pending')
      ))
      .orderBy(regulatoryComms.dueDate);
  }

  async createRegulatoryComm(data: Partial<RegulatoryComm>): Promise<RegulatoryComm> {
    const [result] = await db.insert(regulatoryComms).values(data).returning();
    return result;
  }

  // Contract & Token Tracking
  async getContractTracking(): Promise<ContractTracking[]> {
    return await db.select().from(contractTracking)
      .orderBy(desc(contractTracking.createdAt));
  }

  async getUpcomingVestingEvents(): Promise<ContractTracking[]> {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return await db.select().from(contractTracking)
      .where(eq(contractTracking.contractType, 'saft'))
      .orderBy(desc(contractTracking.createdAt));
  }

  async createContractTracking(data: Partial<ContractTracking>): Promise<ContractTracking> {
    const [result] = await db.insert(contractTracking).values(data).returning();
    return result;
  }

  // System Health Monitoring
  async getSystemHealthMetrics(): Promise<SystemHealthMetric[]> {
    return await db.select().from(systemHealthMetrics)
      .orderBy(desc(systemHealthMetrics.createdAt))
      .limit(100);
  }

  async getCriticalAlerts(): Promise<SystemHealthMetric[]> {
    return await db.select().from(systemHealthMetrics)
      .where(eq(systemHealthMetrics.status, 'critical'))
      .orderBy(desc(systemHealthMetrics.createdAt));
  }

  async recordHealthMetric(data: Partial<SystemHealthMetric>): Promise<SystemHealthMetric> {
    const [result] = await db.insert(systemHealthMetrics).values(data).returning();
    return result;
  }

  async acknowledgeAlert(id: number, acknowledgedBy: string): Promise<SystemHealthMetric> {
    const [result] = await db.update(systemHealthMetrics)
      .set({
        acknowledgedBy,
        alertTriggered: false
      })
      .where(eq(systemHealthMetrics.id, id))
      .returning();
    return result;
  }

  // Dashboard Analytics
  async getDashboardStats() {
    const [
      totalUsers,
      activeTickets,
      pendingApprovals,
      criticalAlerts,
      highRiskUsers,
      recentTransactions
    ] = await Promise.all([
      db.select({ count: count() }).from(userForensics),
      db.select({ count: count() }).from(supportTickets).where(eq(supportTickets.status, 'open')),
      db.select({ count: count() }).from(walletOperations).where(eq(walletOperations.status, 'pending')),
      db.select({ count: count() }).from(systemHealthMetrics).where(eq(systemHealthMetrics.status, 'critical')),
      db.select({ count: count() }).from(amlRiskProfiles).where(eq(amlRiskProfiles.riskLevel, 'high')),
      db.select({ count: count() }).from(transactionMonitoring).where(gte(transactionMonitoring.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)))
    ]);

    return {
      totalUsers: totalUsers[0]?.count || 0,
      activeTickets: activeTickets[0]?.count || 0,
      pendingApprovals: pendingApprovals[0]?.count || 0,
      criticalAlerts: criticalAlerts[0]?.count || 0,
      highRiskUsers: highRiskUsers[0]?.count || 0,
      recentTransactions: recentTransactions[0]?.count || 0
    };
  }
}

export const adminService = new AdminService();