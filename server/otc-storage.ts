import {
  users,
  otcDeals,
  otcQuotes,
  blockTrades,
  liquidityPools,
  settlementInstructions,
  creditLines,
  marketData,
  type User,
  type UpsertUser,
  type OTCDeal,
  type InsertOTCDeal,
  type OTCQuote,
  type InsertOTCQuote,
  type BlockTrade,
  type InsertBlockTrade,
  type LiquidityPool,
  type InsertLiquidityPool,
  type SettlementInstruction,
  type InsertSettlementInstruction,
  type CreditLine,
  type InsertCreditLine,
  type MarketData,
} from "../shared/otc-schema";
import { db } from "./otc-db";
import { eq, desc, and, or, gte, lte, sql } from "drizzle-orm";

export interface IOTCStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserKYC(userId: string, kycStatus: string, kycLevel: number): Promise<User>;
  
  // OTC Deal operations
  createOTCDeal(deal: InsertOTCDeal): Promise<OTCDeal>;
  getOTCDeals(filters?: { 
    asset?: string; 
    type?: string; 
    visibility?: string;
    minAmount?: string;
    maxAmount?: string;
    status?: string;
  }): Promise<OTCDeal[]>;
  getOTCDealById(dealId: string): Promise<OTCDeal | undefined>;
  updateOTCDealStatus(dealId: string, status: string, counterpartyId?: string): Promise<OTCDeal>;
  matchOTCDeal(dealId: string, counterpartyId: string): Promise<OTCDeal>;
  
  // Quote operations
  createQuoteRequest(quote: InsertOTCQuote): Promise<OTCQuote>;
  getQuoteRequests(clientId?: string): Promise<OTCQuote[]>;
  updateQuotePrice(quoteId: string, price: string, spread: string): Promise<OTCQuote>;
  acceptQuote(quoteId: string): Promise<OTCQuote>;
  
  // Block Trading operations
  createBlockTrade(trade: InsertBlockTrade): Promise<BlockTrade>;
  getBlockTrades(userId?: string): Promise<BlockTrade[]>;
  executeBlockTrade(tradeId: string): Promise<BlockTrade>;
  
  // Liquidity Pool operations
  createLiquidityPool(pool: InsertLiquidityPool): Promise<LiquidityPool>;
  getLiquidityPools(currency?: string): Promise<LiquidityPool[]>;
  updatePoolUtilization(poolId: string, utilization: string, volume: string): Promise<LiquidityPool>;
  
  // Settlement operations
  addSettlementInstruction(instruction: InsertSettlementInstruction): Promise<SettlementInstruction>;
  getSettlementInstructions(userId: string): Promise<SettlementInstruction[]>;
  verifySettlementInstruction(instructionId: number): Promise<SettlementInstruction>;
  
  // Credit Line operations
  createCreditLine(creditLine: InsertCreditLine): Promise<CreditLine>;
  getCreditLines(clientId: string): Promise<CreditLine[]>;
  updateCreditUtilization(creditLineId: number, amount: string): Promise<CreditLine>;
  
  // Market Data operations
  updateMarketData(symbol: string, data: Partial<MarketData>): Promise<MarketData>;
  getMarketData(symbols?: string[]): Promise<MarketData[]>;
  getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined>;
}

export class OTCDatabaseStorage implements IOTCStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
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

  async updateUserKYC(userId: string, kycStatus: string, kycLevel: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        kycStatus, 
        kycLevel,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // OTC Deal operations
  async createOTCDeal(insertDeal: InsertOTCDeal): Promise<OTCDeal> {
    const dealId = `OTC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const [deal] = await db
      .insert(otcDeals)
      .values({
        ...insertDeal,
        dealId,
      })
      .returning();
    return deal;
  }

  async getOTCDeals(filters?: { 
    asset?: string; 
    type?: string; 
    visibility?: string;
    minAmount?: string;
    maxAmount?: string;
    status?: string;
  }): Promise<OTCDeal[]> {
    let query = db.select().from(otcDeals);
    
    if (filters) {
      const conditions = [];
      
      if (filters.asset) {
        conditions.push(
          or(
            eq(otcDeals.baseCurrency, filters.asset),
            eq(otcDeals.quoteCurrency, filters.asset)
          )
        );
      }
      
      if (filters.type) {
        conditions.push(eq(otcDeals.dealType, filters.type));
      }
      
      if (filters.visibility) {
        conditions.push(eq(otcDeals.visibility, filters.visibility));
      }
      
      if (filters.status) {
        conditions.push(eq(otcDeals.status, filters.status));
      }
      
      if (filters.minAmount) {
        conditions.push(gte(otcDeals.amount, filters.minAmount));
      }
      
      if (filters.maxAmount) {
        conditions.push(lte(otcDeals.amount, filters.maxAmount));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query.orderBy(desc(otcDeals.createdAt));
  }

  async getOTCDealById(dealId: string): Promise<OTCDeal | undefined> {
    const [deal] = await db.select().from(otcDeals).where(eq(otcDeals.dealId, dealId));
    return deal;
  }

  async updateOTCDealStatus(dealId: string, status: string, counterpartyId?: string): Promise<OTCDeal> {
    const updateData: any = { 
      status,
      updatedAt: new Date(),
    };
    
    if (counterpartyId) {
      updateData.counterpartyId = counterpartyId;
    }
    
    if (status === 'executing') {
      updateData.executedAt = new Date();
    }
    
    if (status === 'completed') {
      updateData.settledAt = new Date();
    }

    const [deal] = await db
      .update(otcDeals)
      .set(updateData)
      .where(eq(otcDeals.dealId, dealId))
      .returning();
    return deal;
  }

  async matchOTCDeal(dealId: string, counterpartyId: string): Promise<OTCDeal> {
    return this.updateOTCDealStatus(dealId, 'matched', counterpartyId);
  }

  // Quote operations
  async createQuoteRequest(insertQuote: InsertOTCQuote): Promise<OTCQuote> {
    const quoteId = `QTE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + (insertQuote.validFor || 300) * 1000);
    
    const [quote] = await db
      .insert(otcQuotes)
      .values({
        ...insertQuote,
        quoteId,
        expiresAt,
      })
      .returning();
    return quote;
  }

  async getQuoteRequests(clientId?: string): Promise<OTCQuote[]> {
    let query = db.select().from(otcQuotes);
    
    if (clientId) {
      query = query.where(eq(otcQuotes.clientId, clientId));
    }
    
    return await query.orderBy(desc(otcQuotes.createdAt));
  }

  async updateQuotePrice(quoteId: string, price: string, spread: string): Promise<OTCQuote> {
    const [quote] = await db
      .update(otcQuotes)
      .set({
        quotedPrice: price,
        spread,
        status: 'quoted',
        quotedAt: new Date(),
      })
      .where(eq(otcQuotes.quoteId, quoteId))
      .returning();
    return quote;
  }

  async acceptQuote(quoteId: string): Promise<OTCQuote> {
    const [quote] = await db
      .update(otcQuotes)
      .set({ status: 'accepted' })
      .where(eq(otcQuotes.quoteId, quoteId))
      .returning();
    return quote;
  }

  // Block Trading operations
  async createBlockTrade(insertTrade: InsertBlockTrade): Promise<BlockTrade> {
    const tradeId = `BLK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const [trade] = await db
      .insert(blockTrades)
      .values({
        ...insertTrade,
        tradeId,
      })
      .returning();
    return trade;
  }

  async getBlockTrades(userId?: string): Promise<BlockTrade[]> {
    let query = db.select().from(blockTrades);
    
    if (userId) {
      query = query.where(
        or(
          eq(blockTrades.buyerId, userId),
          eq(blockTrades.sellerId, userId)
        )
      );
    }
    
    return await query.orderBy(desc(blockTrades.createdAt));
  }

  async executeBlockTrade(tradeId: string): Promise<BlockTrade> {
    const [trade] = await db
      .update(blockTrades)
      .set({
        status: 'executing',
        executedAt: new Date(),
      })
      .where(eq(blockTrades.tradeId, tradeId))
      .returning();
    return trade;
  }

  // Liquidity Pool operations
  async createLiquidityPool(insertPool: InsertLiquidityPool): Promise<LiquidityPool> {
    const poolId = `LP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const [pool] = await db
      .insert(liquidityPools)
      .values({
        ...insertPool,
        poolId,
      })
      .returning();
    return pool;
  }

  async getLiquidityPools(currency?: string): Promise<LiquidityPool[]> {
    let query = db.select().from(liquidityPools).where(eq(liquidityPools.isActive, true));
    
    if (currency) {
      query = query.where(
        and(
          eq(liquidityPools.isActive, true),
          or(
            eq(liquidityPools.baseCurrency, currency),
            eq(liquidityPools.quoteCurrency, currency)
          )
        )
      );
    }
    
    return await query.orderBy(desc(liquidityPools.volume24h));
  }

  async updatePoolUtilization(poolId: string, utilization: string, volume: string): Promise<LiquidityPool> {
    const [pool] = await db
      .update(liquidityPools)
      .set({
        utilization,
        volume24h: volume,
        updatedAt: new Date(),
      })
      .where(eq(liquidityPools.poolId, poolId))
      .returning();
    return pool;
  }

  // Settlement operations
  async addSettlementInstruction(insertInstruction: InsertSettlementInstruction): Promise<SettlementInstruction> {
    const [instruction] = await db
      .insert(settlementInstructions)
      .values(insertInstruction)
      .returning();
    return instruction;
  }

  async getSettlementInstructions(userId: string): Promise<SettlementInstruction[]> {
    return await db
      .select()
      .from(settlementInstructions)
      .where(eq(settlementInstructions.userId, userId))
      .orderBy(desc(settlementInstructions.isDefault), desc(settlementInstructions.createdAt));
  }

  async verifySettlementInstruction(instructionId: number): Promise<SettlementInstruction> {
    const [instruction] = await db
      .update(settlementInstructions)
      .set({
        isVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(settlementInstructions.id, instructionId))
      .returning();
    return instruction;
  }

  // Credit Line operations
  async createCreditLine(insertCreditLine: InsertCreditLine): Promise<CreditLine> {
    const [creditLine] = await db
      .insert(creditLines)
      .values({
        ...insertCreditLine,
        availableCredit: insertCreditLine.creditLimit,
      })
      .returning();
    return creditLine;
  }

  async getCreditLines(clientId: string): Promise<CreditLine[]> {
    return await db
      .select()
      .from(creditLines)
      .where(eq(creditLines.clientId, clientId))
      .orderBy(desc(creditLines.createdAt));
  }

  async updateCreditUtilization(creditLineId: number, amount: string): Promise<CreditLine> {
    const [creditLine] = await db
      .update(creditLines)
      .set({
        availableCredit: sql`${creditLines.availableCredit} - ${amount}`,
        utilizationRate: sql`(${creditLines.creditLimit} - ${creditLines.availableCredit}) / ${creditLines.creditLimit}`,
        updatedAt: new Date(),
      })
      .where(eq(creditLines.id, creditLineId))
      .returning();
    return creditLine;
  }

  // Market Data operations
  async updateMarketData(symbol: string, data: Partial<MarketData>): Promise<MarketData> {
    const [marketDataRow] = await db
      .insert(marketData)
      .values({
        symbol,
        ...data,
        lastUpdated: new Date(),
      } as any)
      .onConflictDoUpdate({
        target: marketData.symbol,
        set: {
          ...data,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return marketDataRow;
  }

  async getMarketData(symbols?: string[]): Promise<MarketData[]> {
    let query = db.select().from(marketData);
    
    if (symbols && symbols.length > 0) {
      query = query.where(sql`${marketData.symbol} = ANY(${symbols})`);
    }
    
    return await query.orderBy(desc(marketData.lastUpdated));
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    const [data] = await db.select().from(marketData).where(eq(marketData.symbol, symbol));
    return data;
  }
}

export const otcStorage = new OTCDatabaseStorage();