import {
  crmCustomers,
  crmCommunications,
  crmTransactions,
  crmPaymentMethods,
  crmSupportTickets,
  crmCampaigns,
  crmCustomerAnalytics,
  crmComplianceRecords,
  crmReferrals,
  crmCustomerSegments,
  crmCustomerSegmentMemberships,
  type CRMCustomer,
  type InsertCRMCustomer,
  type CRMCommunication,
  type InsertCRMCommunication,
  type CRMTransaction,
  type InsertCRMTransaction,
  type CRMPaymentMethod,
  type InsertCRMPaymentMethod,
  type CRMSupportTicket,
  type InsertCRMSupportTicket,
  type CRMCampaign,
  type InsertCRMCampaign,
  type CRMCustomerAnalytics,
  type InsertCRMCustomerAnalytics,
  type CRMComplianceRecord,
  type InsertCRMComplianceRecord,
  type CRMReferral,
  type InsertCRMReferral,
} from "@shared/crm-schema";
import { db } from "./db";
import { eq, desc, asc, and, or, gte, lte, sql, count } from "drizzle-orm";

export interface ICRMStorage {
  // Customer Management
  createCustomer(customer: InsertCRMCustomer): Promise<CRMCustomer>;
  getCustomer(id: string): Promise<CRMCustomer | undefined>;
  getCustomerByUserId(userId: string): Promise<CRMCustomer | undefined>;
  updateCustomer(id: string, updates: Partial<CRMCustomer>): Promise<CRMCustomer>;
  getCustomers(filters?: {
    tier?: string;
    status?: string;
    customerType?: string;
    riskScore?: { min?: number; max?: number };
    ltv?: { min?: number; max?: number };
    limit?: number;
    offset?: number;
  }): Promise<{ customers: CRMCustomer[]; total: number }>;
  
  // Communications
  createCommunication(communication: InsertCRMCommunication): Promise<CRMCommunication>;
  getCommunications(customerId: string, limit?: number): Promise<CRMCommunication[]>;
  updateCommunicationStatus(id: string, status: string, metadata?: any): Promise<CRMCommunication>;
  getCommunicationsByType(type: string, limit?: number): Promise<CRMCommunication[]>;
  
  // Transactions
  createTransaction(transaction: InsertCRMTransaction): Promise<CRMTransaction>;
  getTransactions(customerId: string, filters?: {
    type?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }): Promise<CRMTransaction[]>;
  updateTransactionStatus(id: string, status: string, metadata?: any): Promise<CRMTransaction>;
  getTransactionAnalytics(customerId: string, period: 'day' | 'week' | 'month'): Promise<any>;
  
  // Payment Methods
  addPaymentMethod(paymentMethod: InsertCRMPaymentMethod): Promise<CRMPaymentMethod>;
  getPaymentMethods(customerId: string): Promise<CRMPaymentMethod[]>;
  updatePaymentMethod(id: string, updates: Partial<CRMPaymentMethod>): Promise<CRMPaymentMethod>;
  setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void>;
  
  // Support Tickets
  createSupportTicket(ticket: InsertCRMSupportTicket): Promise<CRMSupportTicket>;
  getSupportTickets(filters?: {
    customerId?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    category?: string;
    limit?: number;
  }): Promise<CRMSupportTicket[]>;
  updateSupportTicket(id: string, updates: Partial<CRMSupportTicket>): Promise<CRMSupportTicket>;
  assignTicket(ticketId: string, agentId: string): Promise<CRMSupportTicket>;
  closeTicket(ticketId: string, resolution: string, rating?: number): Promise<CRMSupportTicket>;
  
  // Campaigns
  createCampaign(campaign: InsertCRMCampaign): Promise<CRMCampaign>;
  getCampaigns(filters?: { type?: string; status?: string }): Promise<CRMCampaign[]>;
  updateCampaign(id: string, updates: Partial<CRMCampaign>): Promise<CRMCampaign>;
  getCampaignMetrics(campaignId: string): Promise<any>;
  
  // Analytics
  recordCustomerActivity(analytics: InsertCRMCustomerAnalytics): Promise<CRMCustomerAnalytics>;
  getCustomerAnalytics(customerId: string, dateFrom: Date, dateTo: Date): Promise<CRMCustomerAnalytics[]>;
  getDashboardMetrics(): Promise<any>;
  getRevenueAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<any>;
  
  // Compliance
  createComplianceRecord(record: InsertCRMComplianceRecord): Promise<CRMComplianceRecord>;
  getComplianceRecords(customerId: string): Promise<CRMComplianceRecord[]>;
  updateComplianceStatus(id: string, status: string, reviewNotes?: string): Promise<CRMComplianceRecord>;
  getPendingCompliance(limit?: number): Promise<CRMComplianceRecord[]>;
  
  // Referrals
  createReferral(referral: InsertCRMReferral): Promise<CRMReferral>;
  getReferrals(referrerId: string): Promise<CRMReferral[]>;
  completeReferral(referralCode: string, refereeId: string): Promise<CRMReferral>;
  getReferralStats(referrerId: string): Promise<any>;
}

export class CRMDatabaseStorage implements ICRMStorage {
  // Customer Management
  async createCustomer(insertCustomer: InsertCRMCustomer): Promise<CRMCustomer> {
    const [customer] = await db
      .insert(crmCustomers)
      .values(insertCustomer)
      .returning();
    return customer;
  }

  async getCustomer(id: string): Promise<CRMCustomer | undefined> {
    const [customer] = await db
      .select()
      .from(crmCustomers)
      .where(eq(crmCustomers.id, id));
    return customer;
  }

  async getCustomerByUserId(userId: string): Promise<CRMCustomer | undefined> {
    const [customer] = await db
      .select()
      .from(crmCustomers)
      .where(eq(crmCustomers.userId, userId));
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<CRMCustomer>): Promise<CRMCustomer> {
    const [customer] = await db
      .update(crmCustomers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(crmCustomers.id, id))
      .returning();
    return customer;
  }

  async getCustomers(filters: {
    tier?: string;
    status?: string;
    customerType?: string;
    riskScore?: { min?: number; max?: number };
    ltv?: { min?: number; max?: number };
    limit?: number;
    offset?: number;
  } = {}): Promise<{ customers: CRMCustomer[]; total: number }> {
    let query = db.select().from(crmCustomers);
    let countQuery = db.select({ count: count() }).from(crmCustomers);

    const conditions = [];

    if (filters.tier) {
      conditions.push(eq(crmCustomers.tier, filters.tier));
    }
    if (filters.status) {
      conditions.push(eq(crmCustomers.status, filters.status));
    }
    if (filters.customerType) {
      conditions.push(eq(crmCustomers.customerType, filters.customerType));
    }
    if (filters.riskScore?.min !== undefined) {
      conditions.push(gte(crmCustomers.riskScore, filters.riskScore.min));
    }
    if (filters.riskScore?.max !== undefined) {
      conditions.push(lte(crmCustomers.riskScore, filters.riskScore.max));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
      countQuery = countQuery.where(and(...conditions));
    }

    query = query.orderBy(desc(crmCustomers.createdAt));

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const [customers, [{ count: total }]] = await Promise.all([
      query,
      countQuery
    ]);

    return { customers, total };
  }

  // Communications
  async createCommunication(insertCommunication: InsertCRMCommunication): Promise<CRMCommunication> {
    const [communication] = await db
      .insert(crmCommunications)
      .values(insertCommunication)
      .returning();
    return communication;
  }

  async getCommunications(customerId: string, limit = 50): Promise<CRMCommunication[]> {
    return await db
      .select()
      .from(crmCommunications)
      .where(eq(crmCommunications.customerId, customerId))
      .orderBy(desc(crmCommunications.createdAt))
      .limit(limit);
  }

  async updateCommunicationStatus(id: string, status: string, metadata?: any): Promise<CRMCommunication> {
    const [communication] = await db
      .update(crmCommunications)
      .set({ status, metadata })
      .where(eq(crmCommunications.id, id))
      .returning();
    return communication;
  }

  async getCommunicationsByType(type: string, limit = 100): Promise<CRMCommunication[]> {
    return await db
      .select()
      .from(crmCommunications)
      .where(eq(crmCommunications.type, type))
      .orderBy(desc(crmCommunications.createdAt))
      .limit(limit);
  }

  // Transactions
  async createTransaction(insertTransaction: InsertCRMTransaction): Promise<CRMTransaction> {
    const [transaction] = await db
      .insert(crmTransactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getTransactions(customerId: string, filters: {
    type?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  } = {}): Promise<CRMTransaction[]> {
    let query = db
      .select()
      .from(crmTransactions)
      .where(eq(crmTransactions.customerId, customerId));

    const conditions = [eq(crmTransactions.customerId, customerId)];

    if (filters.type) {
      conditions.push(eq(crmTransactions.type, filters.type));
    }
    if (filters.status) {
      conditions.push(eq(crmTransactions.status, filters.status));
    }
    if (filters.dateFrom) {
      conditions.push(gte(crmTransactions.createdAt, filters.dateFrom));
    }
    if (filters.dateTo) {
      conditions.push(lte(crmTransactions.createdAt, filters.dateTo));
    }

    query = query.where(and(...conditions));
    query = query.orderBy(desc(crmTransactions.createdAt));

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  async updateTransactionStatus(id: string, status: string, metadata?: any): Promise<CRMTransaction> {
    const updateData: any = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }
    if (metadata) {
      updateData.metadata = metadata;
    }

    const [transaction] = await db
      .update(crmTransactions)
      .set(updateData)
      .where(eq(crmTransactions.id, id))
      .returning();
    return transaction;
  }

  async getTransactionAnalytics(customerId: string, period: 'day' | 'week' | 'month'): Promise<any> {
    const intervals = {
      day: '1 day',
      week: '7 days',
      month: '30 days'
    };

    const result = await db
      .select({
        totalVolume: sql<string>`SUM(${crmTransactions.amount})`,
        totalFees: sql<string>`SUM(${crmTransactions.fee})`,
        transactionCount: count(),
        avgAmount: sql<string>`AVG(${crmTransactions.amount})`
      })
      .from(crmTransactions)
      .where(
        and(
          eq(crmTransactions.customerId, customerId),
          gte(crmTransactions.createdAt, sql`NOW() - INTERVAL ${intervals[period]}`)
        )
      );

    return result[0];
  }

  // Payment Methods
  async addPaymentMethod(insertPaymentMethod: InsertCRMPaymentMethod): Promise<CRMPaymentMethod> {
    const [paymentMethod] = await db
      .insert(crmPaymentMethods)
      .values(insertPaymentMethod)
      .returning();
    return paymentMethod;
  }

  async getPaymentMethods(customerId: string): Promise<CRMPaymentMethod[]> {
    return await db
      .select()
      .from(crmPaymentMethods)
      .where(eq(crmPaymentMethods.customerId, customerId))
      .orderBy(desc(crmPaymentMethods.isDefault), desc(crmPaymentMethods.createdAt));
  }

  async updatePaymentMethod(id: string, updates: Partial<CRMPaymentMethod>): Promise<CRMPaymentMethod> {
    const [paymentMethod] = await db
      .update(crmPaymentMethods)
      .set(updates)
      .where(eq(crmPaymentMethods.id, id))
      .returning();
    return paymentMethod;
  }

  async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<void> {
    // Remove default from all other payment methods
    await db
      .update(crmPaymentMethods)
      .set({ isDefault: false })
      .where(eq(crmPaymentMethods.customerId, customerId));

    // Set new default
    await db
      .update(crmPaymentMethods)
      .set({ isDefault: true })
      .where(eq(crmPaymentMethods.id, paymentMethodId));
  }

  // Support Tickets
  async createSupportTicket(insertTicket: InsertCRMSupportTicket): Promise<CRMSupportTicket> {
    // Generate ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const [ticket] = await db
      .insert(crmSupportTickets)
      .values({ ...insertTicket, ticketNumber })
      .returning();
    return ticket;
  }

  async getSupportTickets(filters: {
    customerId?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    category?: string;
    limit?: number;
  } = {}): Promise<CRMSupportTicket[]> {
    let query = db.select().from(crmSupportTickets);
    const conditions = [];

    if (filters.customerId) {
      conditions.push(eq(crmSupportTickets.customerId, filters.customerId));
    }
    if (filters.status) {
      conditions.push(eq(crmSupportTickets.status, filters.status));
    }
    if (filters.priority) {
      conditions.push(eq(crmSupportTickets.priority, filters.priority));
    }
    if (filters.assignedTo) {
      conditions.push(eq(crmSupportTickets.assignedTo, filters.assignedTo));
    }
    if (filters.category) {
      conditions.push(eq(crmSupportTickets.category, filters.category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.orderBy(desc(crmSupportTickets.createdAt));

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  async updateSupportTicket(id: string, updates: Partial<CRMSupportTicket>): Promise<CRMSupportTicket> {
    const [ticket] = await db
      .update(crmSupportTickets)
      .set(updates)
      .where(eq(crmSupportTickets.id, id))
      .returning();
    return ticket;
  }

  async assignTicket(ticketId: string, agentId: string): Promise<CRMSupportTicket> {
    const [ticket] = await db
      .update(crmSupportTickets)
      .set({ 
        assignedTo: agentId, 
        status: 'in_progress',
        lastAgentResponse: new Date()
      })
      .where(eq(crmSupportTickets.id, ticketId))
      .returning();
    return ticket;
  }

  async closeTicket(ticketId: string, resolution: string, rating?: number): Promise<CRMSupportTicket> {
    const updateData: any = {
      status: 'resolved',
      resolution,
      resolvedAt: new Date()
    };

    if (rating) {
      updateData.satisfactionRating = rating;
    }

    const [ticket] = await db
      .update(crmSupportTickets)
      .set(updateData)
      .where(eq(crmSupportTickets.id, ticketId))
      .returning();
    return ticket;
  }

  // Campaigns
  async createCampaign(insertCampaign: InsertCRMCampaign): Promise<CRMCampaign> {
    const [campaign] = await db
      .insert(crmCampaigns)
      .values(insertCampaign)
      .returning();
    return campaign;
  }

  async getCampaigns(filters: { type?: string; status?: string } = {}): Promise<CRMCampaign[]> {
    let query = db.select().from(crmCampaigns);
    const conditions = [];

    if (filters.type) {
      conditions.push(eq(crmCampaigns.type, filters.type));
    }
    if (filters.status) {
      conditions.push(eq(crmCampaigns.status, filters.status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(crmCampaigns.createdAt));
  }

  async updateCampaign(id: string, updates: Partial<CRMCampaign>): Promise<CRMCampaign> {
    const [campaign] = await db
      .update(crmCampaigns)
      .set(updates)
      .where(eq(crmCampaigns.id, id))
      .returning();
    return campaign;
  }

  async getCampaignMetrics(campaignId: string): Promise<any> {
    const communications = await db
      .select({
        sent: count(),
        delivered: sql<number>`COUNT(*) FILTER (WHERE status = 'delivered')`,
        opened: sql<number>`COUNT(*) FILTER (WHERE status = 'opened')`,
        clicked: sql<number>`COUNT(*) FILTER (WHERE status = 'clicked')`,
      })
      .from(crmCommunications)
      .where(eq(crmCommunications.campaignId, campaignId));

    return communications[0];
  }

  // Analytics
  async recordCustomerActivity(insertAnalytics: InsertCRMCustomerAnalytics): Promise<CRMCustomerAnalytics> {
    const [analytics] = await db
      .insert(crmCustomerAnalytics)
      .values(insertAnalytics)
      .returning();
    return analytics;
  }

  async getCustomerAnalytics(customerId: string, dateFrom: Date, dateTo: Date): Promise<CRMCustomerAnalytics[]> {
    return await db
      .select()
      .from(crmCustomerAnalytics)
      .where(
        and(
          eq(crmCustomerAnalytics.customerId, customerId),
          gte(crmCustomerAnalytics.date, dateFrom),
          lte(crmCustomerAnalytics.date, dateTo)
        )
      )
      .orderBy(asc(crmCustomerAnalytics.date));
  }

  async getDashboardMetrics(): Promise<any> {
    const totalCustomers = await db
      .select({ count: count() })
      .from(crmCustomers);

    const activeCustomers = await db
      .select({ count: count() })
      .from(crmCustomers)
      .where(eq(crmCustomers.status, 'active'));

    const totalRevenue = await db
      .select({ total: sql<string>`SUM(${crmTransactions.netAmount})` })
      .from(crmTransactions)
      .where(eq(crmTransactions.status, 'completed'));

    const openTickets = await db
      .select({ count: count() })
      .from(crmSupportTickets)
      .where(eq(crmSupportTickets.status, 'open'));

    return {
      totalCustomers: totalCustomers[0].count,
      activeCustomers: activeCustomers[0].count,
      totalRevenue: totalRevenue[0].total || '0',
      openTickets: openTickets[0].count
    };
  }

  async getRevenueAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<any> {
    const intervals = {
      day: '1 day',
      week: '7 days',
      month: '30 days',
      year: '365 days'
    };

    return await db
      .select({
        date: sql<string>`DATE_TRUNC('day', ${crmTransactions.createdAt})`,
        revenue: sql<string>`SUM(${crmTransactions.netAmount})`,
        fees: sql<string>`SUM(${crmTransactions.fee})`,
        transactions: count()
      })
      .from(crmTransactions)
      .where(
        and(
          eq(crmTransactions.status, 'completed'),
          gte(crmTransactions.createdAt, sql`NOW() - INTERVAL ${intervals[period]}`)
        )
      )
      .groupBy(sql`DATE_TRUNC('day', ${crmTransactions.createdAt})`)
      .orderBy(sql`DATE_TRUNC('day', ${crmTransactions.createdAt})`);
  }

  // Compliance
  async createComplianceRecord(insertRecord: InsertCRMComplianceRecord): Promise<CRMComplianceRecord> {
    const [record] = await db
      .insert(crmComplianceRecords)
      .values(insertRecord)
      .returning();
    return record;
  }

  async getComplianceRecords(customerId: string): Promise<CRMComplianceRecord[]> {
    return await db
      .select()
      .from(crmComplianceRecords)
      .where(eq(crmComplianceRecords.customerId, customerId))
      .orderBy(desc(crmComplianceRecords.createdAt));
  }

  async updateComplianceStatus(id: string, status: string, reviewNotes?: string): Promise<CRMComplianceRecord> {
    const updateData: any = { status };
    if (status === 'approved' || status === 'rejected') {
      updateData.completedAt = new Date();
    }
    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }

    const [record] = await db
      .update(crmComplianceRecords)
      .set(updateData)
      .where(eq(crmComplianceRecords.id, id))
      .returning();
    return record;
  }

  async getPendingCompliance(limit = 50): Promise<CRMComplianceRecord[]> {
    return await db
      .select()
      .from(crmComplianceRecords)
      .where(eq(crmComplianceRecords.status, 'pending'))
      .orderBy(asc(crmComplianceRecords.createdAt))
      .limit(limit);
  }

  // Referrals
  async createReferral(insertReferral: InsertCRMReferral): Promise<CRMReferral> {
    const [referral] = await db
      .insert(crmReferrals)
      .values(insertReferral)
      .returning();
    return referral;
  }

  async getReferrals(referrerId: string): Promise<CRMReferral[]> {
    return await db
      .select()
      .from(crmReferrals)
      .where(eq(crmReferrals.referrerId, referrerId))
      .orderBy(desc(crmReferrals.createdAt));
  }

  async completeReferral(referralCode: string, refereeId: string): Promise<CRMReferral> {
    const [referral] = await db
      .update(crmReferrals)
      .set({
        refereeId,
        status: 'completed',
        conversionDate: new Date()
      })
      .where(eq(crmReferrals.referralCode, referralCode))
      .returning();
    return referral;
  }

  async getReferralStats(referrerId: string): Promise<any> {
    const stats = await db
      .select({
        totalReferrals: count(),
        completedReferrals: sql<number>`COUNT(*) FILTER (WHERE status = 'completed')`,
        totalRewards: sql<string>`SUM(${crmReferrals.rewardAmount})`
      })
      .from(crmReferrals)
      .where(eq(crmReferrals.referrerId, referrerId));

    return stats[0];
  }
}

export const crmStorage = new CRMDatabaseStorage();