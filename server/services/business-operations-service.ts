import { db } from "../db";
import { 
  customerSegments, 
  supportTickets, 
  incidents, 
  revenueStreams, 
  affiliatePrograms,
  walletReconciliations,
  liquidityOrders,
  apiCredentials,
  orderBookHealth,
  users,
  portfolios,
  orders,
  trades
} from "../../shared/schema";
import { eq, and, desc, sql, gte, lte, count, sum } from "drizzle-orm";
import { z } from "zod";

export class BusinessOperationsService {
  
  // A. Customer Onboarding & KYC Management
  async segmentCustomer(userId: string): Promise<string> {
    try {
      // Get user data and trading history
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      const userPortfolios = await db.select().from(portfolios).where(eq(portfolios.userId, userId));
      const userTrades = await db.select().from(trades).where(eq(trades.buyOrderId, 1)); // This would join with orders table in real implementation
      
      if (user.length === 0) return "retail";
      
      const userData = user[0];
      const totalBalance = userPortfolios.reduce((sum: number, portfolio: any) => sum + parseFloat(portfolio.balance), 0);
      const tradingVolume = userTrades.length * 1000; // Simplified calculation
      
      let segment = "retail";
      let segmentScore = 0;
      let riskLevel = "low";
      
      // Business logic for customer segmentation
      if (totalBalance > 1000000 || tradingVolume > 10000000) {
        segment = "institutional";
        segmentScore = 90;
        riskLevel = "medium";
      } else if (totalBalance > 100000 || tradingVolume > 1000000) {
        segment = "vip";
        segmentScore = 70;
        riskLevel = "low";
      } else if (userData.kycLevel === 0 || userData.accountStatus !== "active") {
        segment = "high_risk";
        segmentScore = 20;
        riskLevel = "high";
      }
      
      // Update or create customer segment
      await db.insert(customerSegments).values({
        userId,
        segment,
        segmentScore: segmentScore.toString(),
        riskLevel,
        lifetimeValue: totalBalance.toString(),
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        tags: [segment, riskLevel]
      }).onConflictDoUpdate({
        target: customerSegments.userId,
        set: {
          segment,
          segmentScore: segmentScore.toString(),
          riskLevel,
          lifetimeValue: totalBalance.toString(),
          updatedAt: new Date()
        }
      });
      
      return segment;
    } catch (error) {
      console.error("Error segmenting customer:", error);
      return "retail";
    }
  }

  // B. Support & CRM Operations
  async createSupportTicket(ticketData: {
    userId?: string;
    email: string;
    name: string;
    category: string;
    priority: string;
    subject: string;
    description: string;
    channel?: string;
  }) {
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Auto-assign based on category
    let assignedTeam = "support";
    if (ticketData.category === "compliance") assignedTeam = "compliance";
    else if (ticketData.category === "technical") assignedTeam = "technical";
    else if (ticketData.priority === "urgent") assignedTeam = "vip";
    
    const ticket = await db.insert(supportTickets).values({
      ticketNumber,
      ...ticketData,
      assignedTeam,
      channel: ticketData.channel || "email"
    }).returning();
    
    return ticket[0];
  }

  async escalateTicket(ticketId: number, escalationLevel: number, assignedTo?: string) {
    await db.update(supportTickets)
      .set({
        escalationLevel,
        assignedTo,
        updatedAt: new Date()
      })
      .where(eq(supportTickets.id, ticketId));
  }

  // C. Wallet & Treasury Operations
  async performWalletReconciliation(walletType: string, asset: string) {
    try {
      // Get expected balance from database
      const portfolioBalances = await db.select({
        totalBalance: sum(portfolios.balance)
      }).from(portfolios).where(eq(portfolios.symbol, asset));
      
      const expectedBalance = portfolioBalances[0]?.totalBalance || "0";
      
      // Simulate blockchain balance check (would integrate with actual blockchain APIs)
      const actualBalance = await this.getBlockchainBalance(asset, walletType);
      
      const difference = parseFloat(actualBalance) - parseFloat(expectedBalance);
      
      const reconciliation = await db.insert(walletReconciliations).values({
        reconciliationDate: new Date(),
        walletType,
        asset,
        expectedBalance,
        actualBalance,
        difference: difference.toString(),
        status: Math.abs(difference) < 0.00000001 ? "reconciled" : "discrepancy"
      }).returning();
      
      // Alert on discrepancies
      if (Math.abs(difference) > 0.00000001) {
        await this.createIncident({
          title: `Wallet Reconciliation Discrepancy - ${asset}`,
          description: `Difference of ${difference} ${asset} detected in ${walletType} wallet`,
          category: "operational",
          severity: Math.abs(difference) > 1 ? "high" : "medium",
          affectedSystems: [walletType + "_wallet", "treasury"],
          reportedBy: "automated_reconciliation"
        });
      }
      
      return reconciliation[0];
    } catch (error) {
      console.error("Reconciliation error:", error);
      throw error;
    }
  }

  private async getBlockchainBalance(asset: string, walletType: string): Promise<string> {
    // Mock implementation - would integrate with actual blockchain APIs
    const baseBalance = Math.random() * 1000;
    const variance = (Math.random() - 0.5) * 0.001; // Small random variance
    return (baseBalance + variance).toFixed(8);
  }

  // D. Incident Management
  async createIncident(incidentData: {
    title: string;
    description: string;
    category: string;
    severity: string;
    affectedSystems: string[];
    reportedBy: string;
    affectedUsers?: number;
  }) {
    const incidentNumber = `INC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Auto-assign based on severity and category
    let assignedTo = "operations_team";
    if (incidentData.severity === "critical") assignedTo = "senior_engineer";
    else if (incidentData.category === "security") assignedTo = "security_team";
    
    const incident = await db.insert(incidents).values({
      incidentNumber,
      ...incidentData,
      assignedTo,
      affectedUsers: incidentData.affectedUsers || 0
    }).returning();
    
    // Auto-escalate critical incidents
    if (incidentData.severity === "critical") {
      await this.escalateIncident(incident[0].id, "senior_management");
    }
    
    return incident[0];
  }

  async escalateIncident(incidentId: number, escalatedTo: string) {
    await db.update(incidents)
      .set({
        escalatedTo,
        updatedAt: new Date()
      })
      .where(eq(incidents.id, incidentId));
  }

  async resolveIncident(incidentId: number, resolution: string, preventiveMeasures?: string) {
    const startTime = await db.select({ createdAt: incidents.createdAt })
      .from(incidents)
      .where(eq(incidents.id, incidentId))
      .limit(1);
      
    const mttr = startTime[0] ? Math.floor((Date.now() - startTime[0].createdAt.getTime()) / 60000) : 0;
    
    await db.update(incidents)
      .set({
        status: "resolved",
        resolution,
        preventiveMeasures,
        mttr,
        resolvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(incidents.id, incidentId));
  }

  // E. Revenue Tracking & Financial Operations
  async recordRevenue(revenueData: {
    streamType: string;
    userId?: string;
    orderId?: number;
    tradeId?: number;
    amount: string;
    currency: string;
    feeRate?: string;
    description?: string;
  }) {
    const revenue = await db.insert(revenueStreams).values({
      ...revenueData,
      transactionDate: new Date(),
      settlementDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // T+1 settlement
    }).returning();
    
    return revenue[0];
  }

  async getRevenueReport(startDate: Date, endDate: Date) {
    const revenues = await db.select({
      streamType: revenueStreams.streamType,
      totalAmount: sum(revenueStreams.amount),
      currency: revenueStreams.currency,
      transactionCount: count(revenueStreams.id)
    })
    .from(revenueStreams)
    .where(and(
      gte(revenueStreams.transactionDate, startDate),
      lte(revenueStreams.transactionDate, endDate)
    ))
    .groupBy(revenueStreams.streamType, revenueStreams.currency);
    
    return revenues;
  }

  // F. Affiliate & Partnership Management
  async createAffiliateProgram(userId: string, commissionRate?: string) {
    const affiliateCode = `AFF-${userId.slice(-6).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const program = await db.insert(affiliatePrograms).values({
      userId,
      affiliateCode,
      commissionRate: commissionRate || "0.001", // 0.1% default
      tier: "bronze"
    }).returning();
    
    return program[0];
  }

  async processAffiliatePayout(affiliateId: number) {
    const program = await db.select().from(affiliatePrograms)
      .where(eq(affiliatePrograms.id, affiliateId))
      .limit(1);
      
    if (program.length === 0) throw new Error("Affiliate program not found");
    
    const affiliate = program[0];
    if (parseFloat(affiliate.unpaidCommissions) < parseFloat(affiliate.minimumPayout)) {
      throw new Error("Minimum payout threshold not met");
    }
    
    // Process payout (would integrate with payment processor)
    await db.update(affiliatePrograms)
      .set({
        unpaidCommissions: "0",
        lastPayoutDate: new Date()
      })
      .where(eq(affiliatePrograms.id, affiliateId));
      
    // Record revenue
    await this.recordRevenue({
      streamType: "affiliate_payout",
      userId: affiliate.userId,
      amount: "-" + affiliate.unpaidCommissions,
      currency: "USD",
      description: `Affiliate payout for ${affiliate.affiliateCode}`
    });
  }

  // G. Market Making & Liquidity Management
  async updateOrderBookHealth(symbol: string) {
    // Mock implementation - would integrate with actual order book data
    const healthData = {
      symbol,
      bidDepth: (Math.random() * 100000).toFixed(8),
      askDepth: (Math.random() * 100000).toFixed(8),
      spread: (Math.random() * 10).toFixed(8),
      spreadPercent: (Math.random() * 0.5).toFixed(4),
      midPrice: (Math.random() * 50000).toFixed(8),
      volume24h: (Math.random() * 1000000).toFixed(2),
      orderCount: Math.floor(Math.random() * 1000),
      avgOrderSize: (Math.random() * 1000).toFixed(8),
      latency: Math.floor(Math.random() * 50),
      healthScore: (70 + Math.random() * 30).toFixed(2)
    };
    
    await db.insert(orderBookHealth).values(healthData);
    
    // Alert on poor health
    if (parseFloat(healthData.healthScore) < 50) {
      await this.createIncident({
        title: `Poor Order Book Health - ${symbol}`,
        description: `Health score: ${healthData.healthScore}%, Spread: ${healthData.spreadPercent}%`,
        category: "operational",
        severity: "medium",
        affectedSystems: ["trading_engine", "order_book"],
        reportedBy: "automated_monitoring"
      });
    }
    
    return healthData;
  }

  // H. API Management
  async createApiCredentials(userId: string, credentialName: string, permissions: string[]) {
    const apiKey = `nxa_${Math.random().toString(36).substr(2, 32)}`;
    const apiSecret = `nxs_${Math.random().toString(36).substr(2, 64)}`;
    
    const credentials = await db.insert(apiCredentials).values({
      userId,
      credentialName,
      apiKey,
      apiSecret,
      permissions,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    }).returning();
    
    return credentials[0];
  }

  async validateApiKey(apiKey: string): Promise<any> {
    const credentials = await db.select()
      .from(apiCredentials)
      .where(and(
        eq(apiCredentials.apiKey, apiKey),
        eq(apiCredentials.isActive, true)
      ))
      .limit(1);
      
    if (credentials.length === 0) return null;
    
    const cred = credentials[0];
    
    // Check expiration
    if (cred.expiresAt && cred.expiresAt < new Date()) {
      return null;
    }
    
    // Update usage statistics
    await db.update(apiCredentials)
      .set({
        lastUsed: new Date(),
        totalRequests: cred.totalRequests + 1
      })
      .where(eq(apiCredentials.id, cred.id));
      
    return cred;
  }

  // I. Daily Operational Reports
  async generateDailyOperationalReport(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get various metrics
    const [
      newTickets,
      resolvedTickets,
      openIncidents,
      dailyRevenue,
      newUsers,
      tradingVolume
    ] = await Promise.all([
      db.select({ count: count() }).from(supportTickets)
        .where(and(
          gte(supportTickets.createdAt, startOfDay),
          lte(supportTickets.createdAt, endOfDay)
        )),
      db.select({ count: count() }).from(supportTickets)
        .where(and(
          gte(supportTickets.resolvedAt, startOfDay),
          lte(supportTickets.resolvedAt, endOfDay)
        )),
      db.select({ count: count() }).from(incidents)
        .where(eq(incidents.status, "open")),
      db.select({ total: sum(revenueStreams.amount) }).from(revenueStreams)
        .where(and(
          gte(revenueStreams.transactionDate, startOfDay),
          lte(revenueStreams.transactionDate, endOfDay)
        )),
      db.select({ count: count() }).from(users)
        .where(and(
          gte(users.createdAt, startOfDay),
          lte(users.createdAt, endOfDay)
        )),
      db.select({ count: count() }).from(trades)
        .where(and(
          gte(trades.createdAt, startOfDay),
          lte(trades.createdAt, endOfDay)
        ))
    ]);
    
    return {
      date: date.toISOString().split('T')[0],
      support: {
        newTickets: newTickets[0]?.count || 0,
        resolvedTickets: resolvedTickets[0]?.count || 0,
        openIncidents: openIncidents[0]?.count || 0
      },
      financial: {
        dailyRevenue: dailyRevenue[0]?.total || "0",
        currency: "USD"
      },
      operations: {
        newUsers: newUsers[0]?.count || 0,
        tradingVolume: tradingVolume[0]?.count || 0
      },
      generatedAt: new Date()
    };
  }

  // J. Compliance Reporting
  async generateComplianceReport(startDate: Date, endDate: Date) {
    // Get compliance-related data
    const suspiciousTransactions = await db.select()
      .from(revenueStreams)
      .where(and(
        gte(revenueStreams.transactionDate, startDate),
        lte(revenueStreams.transactionDate, endDate),
        sql`CAST(${revenueStreams.amount} AS DECIMAL) > 50000` // Large transactions
      ));
      
    const highRiskUsers = await db.select()
      .from(customerSegments)
      .where(eq(customerSegments.riskLevel, "high"));
      
    return {
      reportPeriod: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      },
      suspiciousTransactions: suspiciousTransactions.length,
      highRiskUsers: highRiskUsers.length,
      largeTransactionCount: suspiciousTransactions.length,
      complianceAlerts: await this.getComplianceAlerts(startDate, endDate),
      generatedAt: new Date()
    };
  }

  private async getComplianceAlerts(startDate: Date, endDate: Date) {
    // Mock compliance alerts - would integrate with actual compliance monitoring
    return [
      {
        type: "large_transaction",
        count: Math.floor(Math.random() * 10),
        severity: "medium"
      },
      {
        type: "unusual_pattern",
        count: Math.floor(Math.random() * 5),
        severity: "low"
      }
    ];
  }
}

export const businessOperationsService = new BusinessOperationsService();