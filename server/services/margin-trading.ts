import { db } from "../db";
import { marginPositions, futuresContracts, liquidations, riskLimits } from "@shared/schema";
import { eq, and, desc, lt, gt, sum } from "drizzle-orm";
import crypto from "crypto";

interface MarginPosition {
  userId: string;
  symbol: string;
  side: 'long' | 'short';
  size: string;
  entryPrice: string;
  leverage: number;
  marginRequired: string;
  unrealizedPnL: string;
  maintenanceMargin: string;
}

interface FuturesContract {
  symbol: string;
  underlying: string;
  expiryDate: Date;
  contractSize: string;
  tickSize: string;
  marginRequirement: string;
}

interface LiquidationEvent {
  userId: string;
  positionId: string;
  liquidationPrice: string;
  liquidationQuantity: string;
  liquidationValue: string;
  timestamp: Date;
}

export class MarginTradingService {
  private maxLeverage = new Map<string, number>([
    ['BTC/USDT', 125],
    ['ETH/USDT', 100],
    ['BNB/USDT', 75],
    ['ADA/USDT', 50],
    ['SOL/USDT', 50],
    ['MATIC/USDT', 25]
  ]);

  private maintenanceMarginRates = new Map<string, number>([
    ['BTC/USDT', 0.005], // 0.5%
    ['ETH/USDT', 0.01],  // 1%
    ['BNB/USDT', 0.015], // 1.5%
    ['ADA/USDT', 0.025], // 2.5%
    ['SOL/USDT', 0.02],  // 2%
    ['MATIC/USDT', 0.05] // 5%
  ]);

  private liquidationEngine: NodeJS.Timeout | null = null;
  private priceMonitoring: NodeJS.Timeout | null = null;

  constructor() {
    this.startLiquidationEngine();
    this.startPriceMonitoring();
  }

  // Open Margin Position
  async openMarginPosition(
    userId: string, 
    symbol: string, 
    side: 'long' | 'short',
    size: string,
    price: string,
    leverage: number
  ): Promise<{ success: boolean; positionId?: string; error?: string }> {
    try {
      // Validate leverage
      const maxLev = this.maxLeverage.get(symbol) || 10;
      if (leverage > maxLev) {
        return { success: false, error: `Maximum leverage for ${symbol} is ${maxLev}x` };
      }

      // Calculate margin requirements
      const positionValue = parseFloat(size) * parseFloat(price);
      const marginRequired = positionValue / leverage;
      const maintenanceMarginRate = this.maintenanceMarginRates.get(symbol) || 0.01;
      const maintenanceMargin = positionValue * maintenanceMarginRate;

      // Check user's available balance
      const availableBalance = await this.getUserAvailableBalance(userId, 'USDT');
      if (availableBalance < marginRequired) {
        return { success: false, error: "Insufficient margin balance" };
      }

      // Check position limits
      const positionLimitCheck = await this.checkPositionLimits(userId, symbol, positionValue);
      if (!positionLimitCheck.allowed) {
        return { success: false, error: positionLimitCheck.reason };
      }

      const positionId = crypto.randomUUID();

      // Create margin position
      await db.insert(marginPositions).values({
        id: positionId,
        userId,
        symbol,
        side,
        size,
        entryPrice: price,
        leverage,
        marginRequired: marginRequired.toString(),
        maintenanceMargin: maintenanceMargin.toString(),
        status: 'open',
        unrealizedPnL: "0",
        liquidationPrice: this.calculateLiquidationPrice(side, price, leverage, maintenanceMarginRate).toString()
      });

      // Lock margin from user balance
      await this.lockMargin(userId, marginRequired);

      return { success: true, positionId };
    } catch (error) {
      return { success: false, error: "Failed to open margin position" };
    }
  }

  // Close Margin Position
  async closeMarginPosition(userId: string, positionId: string, price?: string): Promise<{ success: boolean; pnl?: string; error?: string }> {
    try {
      const position = await db.select()
        .from(marginPositions)
        .where(and(
          eq(marginPositions.id, positionId),
          eq(marginPositions.userId, userId),
          eq(marginPositions.status, 'open')
        ))
        .limit(1);

      if (!position[0]) {
        return { success: false, error: "Position not found or already closed" };
      }

      const pos = position[0];
      const exitPrice = price || await this.getCurrentPrice(pos.symbol);
      const pnl = this.calculatePnL(pos, exitPrice);

      // Update position status
      await db.update(marginPositions)
        .set({
          status: 'closed',
          exitPrice,
          realizedPnL: pnl.toString(),
          closedAt: new Date()
        })
        .where(eq(marginPositions.id, positionId));

      // Release margin and settle PnL
      await this.releaseMargin(userId, parseFloat(pos.marginRequired), pnl);

      return { success: true, pnl: pnl.toString() };
    } catch (error) {
      return { success: false, error: "Failed to close margin position" };
    }
  }

  // Futures Contract Management
  async createFuturesContract(contract: FuturesContract): Promise<{ success: boolean; contractId?: string; error?: string }> {
    try {
      const contractId = crypto.randomUUID();

      await db.insert(futuresContracts).values({
        id: contractId,
        symbol: contract.symbol,
        underlying: contract.underlying,
        expiryDate: contract.expiryDate,
        contractSize: contract.contractSize,
        tickSize: contract.tickSize,
        marginRequirement: contract.marginRequirement,
        status: 'active'
      });

      return { success: true, contractId };
    } catch (error) {
      return { success: false, error: "Failed to create futures contract" };
    }
  }

  // Open Futures Position
  async openFuturesPosition(
    userId: string,
    contractSymbol: string,
    side: 'long' | 'short',
    quantity: string,
    price: string
  ): Promise<{ success: boolean; positionId?: string; error?: string }> {
    try {
      // Get contract details
      const contract = await db.select()
        .from(futuresContracts)
        .where(and(
          eq(futuresContracts.symbol, contractSymbol),
          eq(futuresContracts.status, 'active')
        ))
        .limit(1);

      if (!contract[0]) {
        return { success: false, error: "Futures contract not found" };
      }

      const contractInfo = contract[0];
      const notionalValue = parseFloat(quantity) * parseFloat(price) * parseFloat(contractInfo.contractSize);
      const marginRequired = notionalValue * parseFloat(contractInfo.marginRequirement);

      // Check margin availability
      const availableBalance = await this.getUserAvailableBalance(userId, 'USDT');
      if (availableBalance < marginRequired) {
        return { success: false, error: "Insufficient margin for futures position" };
      }

      const positionId = crypto.randomUUID();

      // Create futures position
      await db.insert(marginPositions).values({
        id: positionId,
        userId,
        symbol: contractSymbol,
        side,
        size: quantity,
        entryPrice: price,
        leverage: Math.floor(notionalValue / marginRequired),
        marginRequired: marginRequired.toString(),
        maintenanceMargin: (marginRequired * 0.5).toString(), // 50% of initial margin
        status: 'open',
        unrealizedPnL: "0",
        positionType: 'futures',
        contractId: contractInfo.id
      });

      await this.lockMargin(userId, marginRequired);

      return { success: true, positionId };
    } catch (error) {
      return { success: false, error: "Failed to open futures position" };
    }
  }

  // Liquidation Engine
  private startLiquidationEngine() {
    this.liquidationEngine = setInterval(async () => {
      await this.checkAndExecuteLiquidations();
    }, 10000); // Check every 10 seconds
  }

  private async checkAndExecuteLiquidations() {
    try {
      // Get all open positions
      const openPositions = await db.select()
        .from(marginPositions)
        .where(eq(marginPositions.status, 'open'));

      for (const position of openPositions) {
        const currentPrice = await this.getCurrentPrice(position.symbol);
        const unrealizedPnL = this.calculatePnL(position, currentPrice);
        
        // Update unrealized PnL
        await db.update(marginPositions)
          .set({ unrealizedPnL: unrealizedPnL.toString() })
          .where(eq(marginPositions.id, position.id));

        // Check if position should be liquidated
        const marginRatio = this.calculateMarginRatio(position, currentPrice);
        const maintenanceMarginRatio = parseFloat(position.maintenanceMargin) / 
          (parseFloat(position.size) * parseFloat(position.entryPrice));

        if (marginRatio <= maintenanceMarginRatio) {
          await this.executeLiquidation(position, currentPrice);
        }
      }
    } catch (error) {
      console.error('Liquidation engine error:', error);
    }
  }

  // Execute Liquidation
  private async executeLiquidation(position: any, liquidationPrice: string) {
    try {
      const liquidationId = crypto.randomUUID();
      const liquidationValue = parseFloat(position.size) * parseFloat(liquidationPrice);

      // Record liquidation event
      await db.insert(liquidations).values({
        id: liquidationId,
        userId: position.userId,
        positionId: position.id,
        symbol: position.symbol,
        side: position.side,
        size: position.size,
        liquidationPrice,
        liquidationValue: liquidationValue.toString(),
        liquidationFee: (liquidationValue * 0.005).toString(), // 0.5% liquidation fee
        timestamp: new Date()
      });

      // Close position
      const finalPnL = this.calculatePnL(position, liquidationPrice);
      
      await db.update(marginPositions)
        .set({
          status: 'liquidated',
          exitPrice: liquidationPrice,
          realizedPnL: finalPnL.toString(),
          closedAt: new Date()
        })
        .where(eq(marginPositions.id, position.id));

      // Release remaining margin (if any) and apply liquidation penalty
      const liquidationFee = liquidationValue * 0.005;
      await this.releaseMargin(position.userId, parseFloat(position.marginRequired), finalPnL - liquidationFee);

      console.log(`Position liquidated: ${position.id} for user ${position.userId}`);
    } catch (error) {
      console.error('Error executing liquidation:', error);
    }
  }

  // Risk Management for Leveraged Positions
  async setRiskLimits(userId: string, limits: {
    maxLeverage?: number;
    maxPositionSize?: string;
    maxDailyLoss?: string;
    maxOpenPositions?: number;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      await db.insert(riskLimits).values({
        userId,
        maxLeverage: limits.maxLeverage || 10,
        maxPositionSize: limits.maxPositionSize || "1000000",
        maxDailyLoss: limits.maxDailyLoss || "10000",
        maxOpenPositions: limits.maxOpenPositions || 20
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to set risk limits" };
    }
  }

  // Price Monitoring for Risk Management
  private startPriceMonitoring() {
    this.priceMonitoring = setInterval(async () => {
      await this.monitorPriceMovements();
    }, 5000); // Check every 5 seconds
  }

  private async monitorPriceMovements() {
    try {
      const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 'SOL/USDT'];
      
      for (const symbol of symbols) {
        const currentPrice = await this.getCurrentPrice(symbol);
        const priceChange = await this.getPriceChange24h(symbol);
        
        // Alert for extreme price movements (>10% in 24h)
        if (Math.abs(priceChange) > 0.1) {
          await this.triggerVolatilityAlert(symbol, currentPrice, priceChange);
        }
      }
    } catch (error) {
      console.error('Price monitoring error:', error);
    }
  }

  // Calculate liquidation price
  private calculateLiquidationPrice(side: 'long' | 'short', entryPrice: string, leverage: number, maintenanceMarginRate: number): number {
    const entry = parseFloat(entryPrice);
    
    if (side === 'long') {
      return entry * (1 - (1 / leverage) + maintenanceMarginRate);
    } else {
      return entry * (1 + (1 / leverage) - maintenanceMarginRate);
    }
  }

  // Calculate PnL
  private calculatePnL(position: any, currentPrice: string): number {
    const entryPrice = parseFloat(position.entryPrice);
    const size = parseFloat(position.size);
    const current = parseFloat(currentPrice);

    if (position.side === 'long') {
      return (current - entryPrice) * size;
    } else {
      return (entryPrice - current) * size;
    }
  }

  // Calculate margin ratio
  private calculateMarginRatio(position: any, currentPrice: string): number {
    const marginUsed = parseFloat(position.marginRequired);
    const unrealizedPnL = this.calculatePnL(position, currentPrice);
    const equity = marginUsed + unrealizedPnL;
    const positionValue = parseFloat(position.size) * parseFloat(currentPrice);
    
    return equity / positionValue;
  }

  // Helper methods
  private async getCurrentPrice(symbol: string): Promise<string> {
    // In production, get from market data service
    const mockPrices: { [key: string]: number } = {
      'BTC/USDT': 45000 + (Math.random() - 0.5) * 2000,
      'ETH/USDT': 3000 + (Math.random() - 0.5) * 200,
      'BNB/USDT': 300 + (Math.random() - 0.5) * 20,
      'ADA/USDT': 1.2 + (Math.random() - 0.5) * 0.1,
      'SOL/USDT': 100 + (Math.random() - 0.5) * 10,
      'MATIC/USDT': 1.5 + (Math.random() - 0.5) * 0.1
    };
    
    return (mockPrices[symbol] || 1).toString();
  }

  private async getPriceChange24h(symbol: string): Promise<number> {
    // Mock 24h price change
    return (Math.random() - 0.5) * 0.2; // ±10%
  }

  private async getUserAvailableBalance(userId: string, currency: string): Promise<number> {
    // In production, get from portfolio service
    return Math.random() * 100000; // Mock balance
  }

  private async lockMargin(userId: string, amount: number) {
    // Implementation would lock margin in user's portfolio
    console.log(`Locking ${amount} USDT margin for user ${userId}`);
  }

  private async releaseMargin(userId: string, marginAmount: number, pnl: number) {
    // Implementation would release margin and apply PnL to user's portfolio
    const finalAmount = marginAmount + pnl;
    console.log(`Releasing ${finalAmount} USDT to user ${userId} (margin: ${marginAmount}, PnL: ${pnl})`);
  }

  private async checkPositionLimits(userId: string, symbol: string, positionValue: number): Promise<{ allowed: boolean; reason?: string }> {
    // Check user's risk limits
    const limits = await db.select()
      .from(riskLimits)
      .where(eq(riskLimits.userId, userId))
      .limit(1);

    if (limits[0]) {
      const userLimits = limits[0];
      
      if (positionValue > parseFloat(userLimits.maxPositionSize)) {
        return { allowed: false, reason: "Position size exceeds limit" };
      }

      // Check open positions count
      const openPositions = await db.select()
        .from(marginPositions)
        .where(and(
          eq(marginPositions.userId, userId),
          eq(marginPositions.status, 'open')
        ));

      if (openPositions.length >= userLimits.maxOpenPositions) {
        return { allowed: false, reason: "Maximum open positions reached" };
      }
    }

    return { allowed: true };
  }

  private async triggerVolatilityAlert(symbol: string, price: string, change: number) {
    console.log(`VOLATILITY ALERT: ${symbol} price ${price}, 24h change: ${(change * 100).toFixed(2)}%`);
    // In production, would send alerts to users and risk management team
  }

  // Portfolio risk metrics
  async getPortfolioRisk(userId: string): Promise<{
    totalMarginUsed: string;
    totalUnrealizedPnL: string;
    marginRatio: string;
    riskLevel: string;
    liquidationRisk: string;
  }> {
    const positions = await db.select()
      .from(marginPositions)
      .where(and(
        eq(marginPositions.userId, userId),
        eq(marginPositions.status, 'open')
      ));

    let totalMarginUsed = 0;
    let totalUnrealizedPnL = 0;
    let highRiskPositions = 0;

    for (const position of positions) {
      totalMarginUsed += parseFloat(position.marginRequired);
      const currentPrice = await this.getCurrentPrice(position.symbol);
      const pnl = this.calculatePnL(position, currentPrice);
      totalUnrealizedPnL += pnl;

      const marginRatio = this.calculateMarginRatio(position, currentPrice);
      if (marginRatio < 0.2) { // Less than 20% margin ratio
        highRiskPositions++;
      }
    }

    const portfolioEquity = totalMarginUsed + totalUnrealizedPnL;
    const marginRatio = portfolioEquity / totalMarginUsed;
    
    let riskLevel = 'low';
    if (marginRatio < 0.3) riskLevel = 'high';
    else if (marginRatio < 0.5) riskLevel = 'medium';

    return {
      totalMarginUsed: totalMarginUsed.toString(),
      totalUnrealizedPnL: totalUnrealizedPnL.toString(),
      marginRatio: marginRatio.toString(),
      riskLevel,
      liquidationRisk: highRiskPositions > 0 ? 'high' : 'low'
    };
  }
}

export const marginTrading = new MarginTradingService();