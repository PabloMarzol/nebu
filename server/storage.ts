import {
  users, portfolios, orders, trades, stakingPositions, p2pOrders, p2pTrades,
  otcDeals, launchpadProjects, launchpadParticipations, copyTradingMasters,
  copyTradingFollows, kycVerifications, marketData, smsNotifications, priceAlerts,
  emailVerificationTokens, passwordResetTokens, securityEvents, loginAttempts, cryptoPayments,
  type User, type UpsertUser, type Portfolio, type InsertPortfolio,
  type Order, type InsertOrder, type Trade, type StakingPosition, 
  type InsertStakingPosition, type P2POrder, type InsertP2POrder,
  type P2PTrade, type OTCDeal, type InsertOTCDeal, type LaunchpadProject,
  type InsertLaunchpadProject, type LaunchpadParticipation, type CopyTradingMaster,
  type CopyTradingFollow, type KYCVerification, type InsertKYCVerification,
  type MarketData, type SMSNotification, type InsertSMSNotification,
  type PriceAlert, type InsertPriceAlert, type CryptoPayment, type InsertCryptoPayment
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, or } from "drizzle-orm";
import crypto from "crypto";

// Comprehensive storage interface for all exchange features
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserKYC(userId: string, kycStatus: string, kycLevel: number): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;
  
  // Authentication operations
  createUser(userData: any): Promise<User>;
  updateUserPassword(userId: string, passwordHash: string): Promise<User>;
  updateUserEmail(userId: string, email: string, verified: boolean): Promise<User>;
  updateUser2FA(userId: string, enabled: boolean, secret?: string, backupCodes?: string[]): Promise<User>;
  incrementLoginAttempts(userId: string): Promise<User>;
  resetLoginAttempts(userId: string): Promise<User>;
  lockUser(userId: string, until: Date): Promise<User>;
  updateLastLogin(userId: string): Promise<User>;
  
  // Email verification
  createEmailVerificationToken(userId: string, email: string, token: string, expiresAt: Date): Promise<void>;
  getEmailVerificationToken(token: string): Promise<any>;
  useEmailVerificationToken(token: string): Promise<void>;
  
  // Password reset
  createPasswordResetToken(userId: string, email: string, token: string, expiresAt: Date): Promise<void>;
  getPasswordResetToken(token: string): Promise<any>;
  usePasswordResetToken(token: string): Promise<void>;
  
  // Security events
  logSecurityEvent(userId: string, eventType: string, description: string, metadata?: any): Promise<void>;
  getSecurityEvents(userId: string, limit?: number): Promise<any[]>;
  
  // Login attempts
  logLoginAttempt(userId: string | null, email: string, ipAddress: string, userAgent: string, successful: boolean, failureReason?: string): Promise<void>;
  getRecentLoginAttempts(email: string, hours?: number): Promise<any[]>;
  
  // Portfolio operations
  getPortfolio(userId: string): Promise<Portfolio[]>;
  getPortfolioBySymbol(userId: string, symbol: string): Promise<Portfolio | undefined>;
  updatePortfolio(userId: string, symbol: string, balance: string, lockedBalance?: string): Promise<Portfolio>;
  lockBalance(userId: string, symbol: string, amount: string): Promise<void>;
  unlockBalance(userId: string, symbol: string, amount: string): Promise<void>;
  
  // Trading operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOpenOrders(symbol: string): Promise<Order[]>;
  updateOrderStatus(orderId: number, status: string): Promise<Order>;
  matchOrders(symbol: string): Promise<void>;
  
  // Trade operations
  getTrades(symbol: string, limit?: number): Promise<Trade[]>;
  createTrade(buyOrderId: number, sellOrderId: number, symbol: string, amount: string, price: string): Promise<Trade>;
  
  // Staking operations
  createStakingPosition(position: InsertStakingPosition): Promise<StakingPosition>;
  getStakingPositions(userId: string): Promise<StakingPosition[]>;
  updateStakingRewards(positionId: number, rewards: string): Promise<StakingPosition>;
  unstakePosition(positionId: number): Promise<StakingPosition>;
  
  // P2P operations
  createP2POrder(order: InsertP2POrder): Promise<P2POrder>;
  getP2POrders(filters?: { asset?: string; type?: string; fiatCurrency?: string }): Promise<P2POrder[]>;
  createP2PTrade(orderId: number, buyerId: string, sellerId: string, amount: string, fiatAmount: string, paymentMethod: string): Promise<P2PTrade>;
  updateP2PTradeStatus(tradeId: number, status: string): Promise<P2PTrade>;
  
  // OTC operations
  createOTCDeal(deal: InsertOTCDeal): Promise<OTCDeal>;
  getOTCDeals(filters?: { asset?: string; type?: string; visibility?: string }): Promise<OTCDeal[]>;
  updateOTCDealStatus(dealId: number, status: string): Promise<OTCDeal>;
  
  // Launchpad operations
  createLaunchpadProject(project: InsertLaunchpadProject): Promise<LaunchpadProject>;
  getLaunchpadProjects(status?: string): Promise<LaunchpadProject[]>;
  participateInLaunchpad(projectId: number, userId: string, amount: string): Promise<LaunchpadParticipation>;
  updateProjectRaise(projectId: number, amount: string): Promise<LaunchpadProject>;
  
  // Copy trading operations
  createCopyTradingMaster(userId: string, displayName: string, bio?: string): Promise<CopyTradingMaster>;
  getCopyTradingMasters(): Promise<CopyTradingMaster[]>;
  followMaster(followerId: string, masterId: number, copyRatio: string): Promise<CopyTradingFollow>;
  unfollowMaster(followerId: string, masterId: number): Promise<void>;
  updateMasterStats(masterId: number, stats: Partial<CopyTradingMaster>): Promise<CopyTradingMaster>;
  
  // KYC operations
  createKYCVerification(kyc: InsertKYCVerification): Promise<KYCVerification>;
  getKYCVerification(userId: string, level: number): Promise<KYCVerification | undefined>;
  updateKYCStatus(verificationId: number, status: string, rejectionReason?: string): Promise<KYCVerification>;
  
  // Market data operations
  updateMarketData(symbol: string, data: Partial<MarketData>): Promise<MarketData>;
  getMarketData(symbols?: string[]): Promise<MarketData[]>;
  getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined>;
  
  // Authentication operation aliases for compatibility
  verifyEmailToken(token: string): Promise<User | null>;
  verifyPasswordResetToken(token: string): Promise<User | null>;
  updatePassword(userId: string, passwordHash: string): Promise<User>;
  
  // SMS operations
  logSMSNotification(data: any): Promise<void>;
  createPriceAlert(data: any): Promise<any>;
  getPriceAlerts(userId: string): Promise<any[]>;
  deletePriceAlert(alertId: number, userId: string): Promise<void>;
  updateUserPhone(userId: string, phoneNumber: string, verified: boolean): Promise<User>;
  
  // Crypto payment operations
  createCryptoPayment(payment: any): Promise<any>;
  getCryptoPayment(paymentId: string): Promise<any>;
  getUserCryptoPayments(userId: string): Promise<any[]>;
  updateCryptoPaymentStatus(paymentId: string, status: string, transactionHash?: string, confirmations?: number): Promise<any>;
  
  // Admin Panel Operations
  // KYC Queue Management
  getKYCQueue(filters: { status?: string; priority?: string; assignedTo?: string; page: number; limit: number }): Promise<any[]>;
  updateKYCQueueStatus(id: number, status: string, adminId: string, notes?: string, reason?: string): Promise<any>;
  
  // AML Alerts Management
  getAMLAlerts(filters: { status?: string; severity?: string; alertType?: string; page: number; limit: number }): Promise<any[]>;
  updateAMLAlertStatus(id: number, status: string, adminId: string, notes?: string): Promise<any>;
  
  // SAR Reports Management
  getSARReports(filters: { status?: string; reportType?: string; page: number; limit: number }): Promise<any[]>;
  createSARReport(data: any): Promise<any>;
  
  // Audit Trails
  logAuditTrail(data: any): Promise<void>;
  getAuditTrails(filters: { entityType?: string; entityId?: string; action?: string; performedBy?: string; page: number; limit: number }): Promise<any[]>;
  
  // Treasury Operations
  getWalletBalances(): Promise<any[]>;
  getWithdrawalQueue(filters: { status?: string; priority?: string; page: number; limit: number }): Promise<any[]>;
  approveWithdrawal(id: number, adminId: string, notes?: string): Promise<any>;
  rejectWithdrawal(id: number, adminId: string, reason: string): Promise<any>;
  getRevenueMetrics(filters: { startDate?: string; endDate?: string; period: string }): Promise<any[]>;
  
  // Trading Operations
  getMarketMakerConfigs(): Promise<any[]>;
  updateMarketMakerConfig(symbol: string, config: any): Promise<any>;
  getTradingIncidents(filters: { status?: string; severity?: string; incidentType?: string; page: number; limit: number }): Promise<any[]>;
  createTradingIncident(data: any): Promise<any>;
  
  // OTC Operations
  getOTCRequests(filters: { status?: string; requestType?: string; assignedTo?: string; page: number; limit: number }): Promise<any[]>;
  quoteOTCRequest(id: number, quote: any): Promise<any>;
  
  // Support Operations
  getSupportTickets(filters: { status?: string; priority?: string; category?: string; assignedTo?: string; page: number; limit: number }): Promise<any[]>;
  createSupportTicket(data: any): Promise<any>;
  getSupportMessages(ticketId: number): Promise<any[]>;
  createSupportMessage(data: any): Promise<any>;
  updateSupportTicketActivity(ticketId: number): Promise<any>;
  getUserActivity(userId: string, limit: number): Promise<any[]>;
  
  // Affiliate Operations
  getAffiliatePrograms(filters: { status?: string; tier?: string; page: number; limit: number }): Promise<any[]>;
  approveAffiliateProgram(id: number, data: any): Promise<any>;
  
  // Mobile Operations
  getMobileDevices(filters: { platform?: string; riskScore?: number; isActive: boolean; page: number; limit: number }): Promise<any[]>;
  createPushNotification(data: any): Promise<any>;
  sendPushNotification(id: number): Promise<any>;
  
  // System Operations
  getSystemLogs(filters: { logLevel?: string; service?: string; startDate?: string; endDate?: string; page: number; limit: number }): Promise<any[]>;
  getSystemHealth(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const userId = crypto.randomUUID();
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt))
        .limit(100);
      return userOrders;
    } catch (error) {
      console.error('[Storage] Error fetching user orders:', error);
      return [];
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPassword(userId: string, passwordHash: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserEmail(userId: string, email: string, verified: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        email,
        emailVerified: verified,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUser2FA(userId: string, enabled: boolean, secret?: string, backupCodes?: string[]): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        twoFactorEnabled: enabled,
        twoFactorSecret: secret,
        twoFactorBackupCodes: backupCodes,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async incrementLoginAttempts(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        loginAttempts: sql`${users.loginAttempts} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async resetLoginAttempts(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        loginAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async lockUser(userId: string, until: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        lockedUntil: until,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateLastLogin(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Email verification
  async createEmailVerificationToken(userId: string, email: string, token: string, expiresAt: Date): Promise<void> {
    await db.insert(emailVerificationTokens).values({
      userId,
      email,
      token,
      expiresAt,
    });
  }

  async getEmailVerificationToken(token: string): Promise<any> {
    const [tokenRecord] = await db
      .select()
      .from(emailVerificationTokens)
      .where(and(eq(emailVerificationTokens.token, token), sql`${emailVerificationTokens.usedAt} IS NULL`));
    return tokenRecord;
  }

  async useEmailVerificationToken(token: string): Promise<void> {
    await db
      .update(emailVerificationTokens)
      .set({ usedAt: new Date() })
      .where(eq(emailVerificationTokens.token, token));
  }

  // Password reset
  async createPasswordResetToken(userId: string, email: string, token: string, expiresAt: Date): Promise<void> {
    await db.insert(passwordResetTokens).values({
      userId,
      email,
      token,
      expiresAt,
    });
  }

  async getPasswordResetToken(token: string): Promise<any> {
    const [tokenRecord] = await db
      .select()
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.token, token), sql`${passwordResetTokens.usedAt} IS NULL`));
    return tokenRecord;
  }

  async usePasswordResetToken(token: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.token, token));
  }

  // Security events
  async logSecurityEvent(userId: string, eventType: string, description: string, metadata?: any): Promise<void> {
    await db.insert(securityEvents).values({
      userId,
      eventType,
      description,
      metadata,
    });
  }

  async getSecurityEvents(userId: string, limit: number = 50): Promise<any[]> {
    return await db
      .select()
      .from(securityEvents)
      .where(eq(securityEvents.userId, userId))
      .orderBy(desc(securityEvents.createdAt))
      .limit(limit);
  }

  // Login attempts
  async logLoginAttempt(userId: string | null, email: string, ipAddress: string, userAgent: string, successful: boolean, failureReason?: string): Promise<void> {
    await db.insert(loginAttempts).values({
      userId,
      email,
      ipAddress,
      userAgent,
      successful,
      failureReason,
    });
  }

  async getRecentLoginAttempts(email: string, hours: number = 24): Promise<any[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await db
      .select()
      .from(loginAttempts)
      .where(and(eq(loginAttempts.email, email), gte(loginAttempts.createdAt, since)))
      .orderBy(desc(loginAttempts.createdAt));
  }

  // Authentication compatibility methods
  async verifyEmailToken(token: string): Promise<User | null> {
    const tokenRecord = await this.getEmailVerificationToken(token);
    if (!tokenRecord || tokenRecord.usedAt || tokenRecord.expiresAt < new Date()) {
      return null;
    }
    await this.useEmailVerificationToken(token);
    return await this.getUser(tokenRecord.userId);
  }

  async verifyPasswordResetToken(token: string): Promise<User | null> {
    const tokenRecord = await this.getPasswordResetToken(token);
    if (!tokenRecord || tokenRecord.usedAt || tokenRecord.expiresAt < new Date()) {
      return null;
    }
    return await this.getUser(tokenRecord.userId);
  }

  async updatePassword(userId: string, passwordHash: string): Promise<User> {
    return await this.updateUserPassword(userId, passwordHash);
  }

  // SMS and Alert methods for compatibility
  async logSMSNotification(data: any): Promise<void> {
    await db.insert(smsNotifications).values(data);
  }

  async createPriceAlert(data: any): Promise<any> {
    const [alert] = await db.insert(priceAlerts).values(data).returning();
    return alert;
  }

  async getPriceAlerts(userId: string): Promise<any[]> {
    return await db.select().from(priceAlerts).where(eq(priceAlerts.userId, userId));
  }

  async deletePriceAlert(alertId: number, userId: string): Promise<void> {
    await db.delete(priceAlerts).where(and(eq(priceAlerts.id, alertId), eq(priceAlerts.userId, userId)));
  }

  async updateUserPhone(userId: string, phoneNumber: string, verified: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ phoneNumber, phoneVerified: verified, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getAllKYCVerifications(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(kycVerifications)
      .where(eq(kycVerifications.userId, userId))
      .orderBy(desc(kycVerifications.createdAt));
  }

  // Trading-related methods for auth integration
  async getUserTradesFromDate(userId: string, fromDate: Date): Promise<any[]> {
    return await db
      .select()
      .from(trades)
      .where(and(eq(trades.userId, userId), gte(trades.createdAt, fromDate)))
      .orderBy(desc(trades.createdAt));
  }

  async getUserTradingVolume24h(userId: string): Promise<number> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const trades = await this.getUserTradesFromDate(userId, yesterday);
    return trades.reduce((sum, trade) => sum + parseFloat(trade.amount), 0);
  }

  async updateUserKYC(userId: string, kycStatus: string, kycLevel: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ kycStatus, kycLevel, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    const updateData: any = { stripeCustomerId, updatedAt: new Date() };
    if (stripeSubscriptionId) {
      updateData.stripeSubscriptionId = stripeSubscriptionId;
    }
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Portfolio operations
  async getPortfolio(userId: string): Promise<Portfolio[]> {
    return await db.select().from(portfolios).where(eq(portfolios.userId, userId));
  }

  async getPortfolioBySymbol(userId: string, symbol: string): Promise<Portfolio | undefined> {
    const [portfolio] = await db
      .select()
      .from(portfolios)
      .where(and(eq(portfolios.userId, userId), eq(portfolios.symbol, symbol)));
    return portfolio;
  }

  async updatePortfolio(userId: string, symbol: string, balance: string, lockedBalance?: string): Promise<Portfolio> {
    const existing = await this.getPortfolioBySymbol(userId, symbol);
    if (existing) {
      const updateData: any = { balance, updatedAt: new Date() };
      if (lockedBalance !== undefined) {
        updateData.lockedBalance = lockedBalance;
      }
      
      const [updated] = await db
        .update(portfolios)
        .set(updateData)
        .where(eq(portfolios.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(portfolios)
        .values({ 
          userId, 
          symbol, 
          balance, 
          lockedBalance: lockedBalance || "0" 
        })
        .returning();
      return created;
    }
  }

  async lockBalance(userId: string, symbol: string, amount: string): Promise<void> {
    const portfolio = await this.getPortfolioBySymbol(userId, symbol);
    if (!portfolio) throw new Error("Portfolio not found");
    
    await db
      .update(portfolios)
      .set({
        balance: sql`${portfolios.balance} - ${amount}`,
        lockedBalance: sql`${portfolios.lockedBalance} + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(portfolios.id, portfolio.id));
  }

  async unlockBalance(userId: string, symbol: string, amount: string): Promise<void> {
    const portfolio = await this.getPortfolioBySymbol(userId, symbol);
    if (!portfolio) throw new Error("Portfolio not found");
    
    await db
      .update(portfolios)
      .set({
        balance: sql`${portfolios.balance} + ${amount}`,
        lockedBalance: sql`${portfolios.lockedBalance} - ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(portfolios.id, portfolio.id));
  }

  // Trading operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOpenOrders(symbol: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(and(eq(orders.symbol, symbol), eq(orders.status, "pending")))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();
    if (!order) throw new Error("Order not found");
    return order;
  }

  async matchOrders(symbol: string): Promise<void> {
    // Simple order matching logic - in production this would be much more sophisticated
    const buyOrders = await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.symbol, symbol),
        eq(orders.side, "buy"),
        eq(orders.status, "pending")
      ))
      .orderBy(desc(orders.price));

    const sellOrders = await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.symbol, symbol),
        eq(orders.side, "sell"),
        eq(orders.status, "pending")
      ))
      .orderBy(orders.price);

    for (const buyOrder of buyOrders) {
      for (const sellOrder of sellOrders) {
        if (parseFloat(buyOrder.price || "0") >= parseFloat(sellOrder.price || "0")) {
          const tradeAmount = Math.min(parseFloat(buyOrder.amount), parseFloat(sellOrder.amount));
          const tradePrice = sellOrder.price || buyOrder.price || "0";

          // Create trade
          await this.createTrade(buyOrder.id, sellOrder.id, symbol, tradeAmount.toString(), tradePrice);

          // Update order statuses
          if (tradeAmount === parseFloat(buyOrder.amount)) {
            await this.updateOrderStatus(buyOrder.id, "filled");
          }
          if (tradeAmount === parseFloat(sellOrder.amount)) {
            await this.updateOrderStatus(sellOrder.id, "filled");
          }

          // Update portfolios
          const baseSymbol = symbol.split("/")[0];
          const quoteSymbol = symbol.split("/")[1];
          
          await this.updatePortfolio(buyOrder.userId, baseSymbol, (parseFloat(await this.getPortfolioBalance(buyOrder.userId, baseSymbol)) + tradeAmount).toString());
          await this.updatePortfolio(sellOrder.userId, quoteSymbol, (parseFloat(await this.getPortfolioBalance(sellOrder.userId, quoteSymbol)) + tradeAmount * parseFloat(tradePrice)).toString());
        }
      }
    }
  }

  private async getPortfolioBalance(userId: string, symbol: string): Promise<string> {
    const portfolio = await this.getPortfolioBySymbol(userId, symbol);
    return portfolio?.balance || "0";
  }

  // Trade operations
  async getTrades(symbol: string, limit: number = 50): Promise<Trade[]> {
    return await db
      .select()
      .from(trades)
      .where(eq(trades.symbol, symbol))
      .orderBy(desc(trades.createdAt))
      .limit(limit);
  }

  async createTrade(buyOrderId: number, sellOrderId: number, symbol: string, amount: string, price: string): Promise<Trade> {
    const [trade] = await db
      .insert(trades)
      .values({ buyOrderId, sellOrderId, symbol, amount, price })
      .returning();
    return trade;
  }

  // Staking operations
  async createStakingPosition(position: InsertStakingPosition): Promise<StakingPosition> {
    const [stakingPosition] = await db
      .insert(stakingPositions)
      .values(position)
      .returning();
    return stakingPosition;
  }

  async getStakingPositions(userId: string): Promise<StakingPosition[]> {
    return await db
      .select()
      .from(stakingPositions)
      .where(eq(stakingPositions.userId, userId))
      .orderBy(desc(stakingPositions.createdAt));
  }

  async updateStakingRewards(positionId: number, rewards: string): Promise<StakingPosition> {
    const [position] = await db
      .update(stakingPositions)
      .set({ rewards })
      .where(eq(stakingPositions.id, positionId))
      .returning();
    return position;
  }

  async unstakePosition(positionId: number): Promise<StakingPosition> {
    const [position] = await db
      .update(stakingPositions)
      .set({ status: "unstaking" })
      .where(eq(stakingPositions.id, positionId))
      .returning();
    return position;
  }

  // P2P operations
  async createP2POrder(order: InsertP2POrder): Promise<P2POrder> {
    const [p2pOrder] = await db
      .insert(p2pOrders)
      .values(order)
      .returning();
    return p2pOrder;
  }

  async getP2POrders(filters?: { asset?: string; type?: string; fiatCurrency?: string }): Promise<P2POrder[]> {
    let query = db.select().from(p2pOrders).where(eq(p2pOrders.status, "active"));
    
    if (filters?.asset) {
      query = query.where(eq(p2pOrders.asset, filters.asset));
    }
    if (filters?.type) {
      query = query.where(eq(p2pOrders.type, filters.type));
    }
    if (filters?.fiatCurrency) {
      query = query.where(eq(p2pOrders.fiatCurrency, filters.fiatCurrency));
    }
    
    return await query.orderBy(desc(p2pOrders.createdAt));
  }

  async createP2PTrade(orderId: number, buyerId: string, sellerId: string, amount: string, fiatAmount: string, paymentMethod: string): Promise<P2PTrade> {
    const [trade] = await db
      .insert(p2pTrades)
      .values({ orderId, buyerId, sellerId, amount, fiatAmount, paymentMethod })
      .returning();
    return trade;
  }

  async updateP2PTradeStatus(tradeId: number, status: string): Promise<P2PTrade> {
    const [trade] = await db
      .update(p2pTrades)
      .set({ status })
      .where(eq(p2pTrades.id, tradeId))
      .returning();
    return trade;
  }

  // OTC operations
  async createOTCDeal(deal: InsertOTCDeal): Promise<OTCDeal> {
    const [otcDeal] = await db
      .insert(otcDeals)
      .values(deal)
      .returning();
    return otcDeal;
  }

  async getOTCDeals(filters?: { asset?: string; type?: string; visibility?: string }): Promise<OTCDeal[]> {
    let query = db.select().from(otcDeals).where(eq(otcDeals.status, "pending"));
    
    if (filters?.asset) {
      query = query.where(eq(otcDeals.asset, filters.asset));
    }
    if (filters?.type) {
      query = query.where(eq(otcDeals.type, filters.type));
    }
    if (filters?.visibility) {
      query = query.where(eq(otcDeals.visibility, filters.visibility));
    }
    
    return await query.orderBy(desc(otcDeals.createdAt));
  }

  async updateOTCDealStatus(dealId: number, status: string): Promise<OTCDeal> {
    const [deal] = await db
      .update(otcDeals)
      .set({ status })
      .where(eq(otcDeals.id, dealId))
      .returning();
    return deal;
  }

  // Launchpad operations
  async createLaunchpadProject(project: InsertLaunchpadProject): Promise<LaunchpadProject> {
    const [launchpadProject] = await db
      .insert(launchpadProjects)
      .values(project)
      .returning();
    return launchpadProject;
  }

  async getLaunchpadProjects(status?: string): Promise<LaunchpadProject[]> {
    let query = db.select().from(launchpadProjects);
    
    if (status) {
      query = query.where(eq(launchpadProjects.status, status));
    }
    
    return await query.orderBy(desc(launchpadProjects.createdAt));
  }

  async participateInLaunchpad(projectId: number, userId: string, amount: string): Promise<LaunchpadParticipation> {
    const [participation] = await db
      .insert(launchpadParticipations)
      .values({ projectId, userId, amount })
      .returning();
    return participation;
  }

  async updateProjectRaise(projectId: number, amount: string): Promise<LaunchpadProject> {
    const [project] = await db
      .update(launchpadProjects)
      .set({ 
        currentRaise: sql`${launchpadProjects.currentRaise} + ${amount}` 
      })
      .where(eq(launchpadProjects.id, projectId))
      .returning();
    return project;
  }

  // Copy trading operations
  async createCopyTradingMaster(userId: string, displayName: string, bio?: string): Promise<CopyTradingMaster> {
    const [master] = await db
      .insert(copyTradingMasters)
      .values({ userId, displayName, bio })
      .returning();
    return master;
  }

  async getCopyTradingMasters(): Promise<CopyTradingMaster[]> {
    return await db
      .select()
      .from(copyTradingMasters)
      .where(eq(copyTradingMasters.isActive, true))
      .orderBy(desc(copyTradingMasters.totalReturn));
  }

  async followMaster(followerId: string, masterId: number, copyRatio: string): Promise<CopyTradingFollow> {
    const [follow] = await db
      .insert(copyTradingFollows)
      .values({ followerId, masterId, copyRatio })
      .returning();
    return follow;
  }

  async unfollowMaster(followerId: string, masterId: number): Promise<void> {
    await db
      .update(copyTradingFollows)
      .set({ isActive: false })
      .where(and(
        eq(copyTradingFollows.followerId, followerId),
        eq(copyTradingFollows.masterId, masterId)
      ));
  }

  async updateMasterStats(masterId: number, stats: Partial<CopyTradingMaster>): Promise<CopyTradingMaster> {
    const [master] = await db
      .update(copyTradingMasters)
      .set(stats)
      .where(eq(copyTradingMasters.id, masterId))
      .returning();
    return master;
  }

  // KYC operations
  async createKYCVerification(kyc: InsertKYCVerification): Promise<KYCVerification> {
    const [verification] = await db
      .insert(kycVerifications)
      .values(kyc)
      .returning();
    return verification;
  }

  async getKYCVerification(userId: string, level: number): Promise<KYCVerification | undefined> {
    const [verification] = await db
      .select()
      .from(kycVerifications)
      .where(and(
        eq(kycVerifications.userId, userId),
        eq(kycVerifications.level, level)
      ))
      .orderBy(desc(kycVerifications.createdAt));
    return verification;
  }

  async updateKYCStatus(verificationId: number, status: string, rejectionReason?: string): Promise<KYCVerification> {
    const updateData: any = { status };
    if (status === "approved") {
      updateData.verifiedAt = new Date();
    }
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    const [verification] = await db
      .update(kycVerifications)
      .set(updateData)
      .where(eq(kycVerifications.id, verificationId))
      .returning();
    return verification;
  }

  // Market data operations
  async updateMarketData(symbol: string, data: Partial<MarketData>): Promise<MarketData> {
    const existing = await this.getMarketDataBySymbol(symbol);
    
    if (existing) {
      const [updated] = await db
        .update(marketData)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(marketData.symbol, symbol))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(marketData)
        .values({ symbol, ...data } as any)
        .returning();
      return created;
    }
  }

  async getMarketData(symbols?: string[]): Promise<MarketData[]> {
    let query = db.select().from(marketData);
    
    if (symbols && symbols.length > 0) {
      query = query.where(sql`${marketData.symbol} = ANY(${symbols})`);
    }
    
    return await query.orderBy(marketData.symbol);
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    const [data] = await db
      .select()
      .from(marketData)
      .where(eq(marketData.symbol, symbol));
    return data;
  }
}

export const storage = new DatabaseStorage();