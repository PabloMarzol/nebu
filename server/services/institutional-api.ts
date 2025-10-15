import { db } from "../db";
import { users, orders, trades, portfolios, fiatGateways, fiatTransactions } from "@shared/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import crypto from "crypto";
import { vaspCompliance } from "./vasp-compliance";

interface APICredentials {
  userId: string;
  apiKey: string;
  secretKey: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
}

interface InstitutionalLimits {
  dailyTrading: string;
  dailyWithdrawal: string;
  maxOrderSize: string;
  maxOpenOrders: number;
}

export class InstitutionalAPIService {
  private apiCredentials = new Map<string, APICredentials>();
  private rateLimits = new Map<string, number[]>();

  // Generate API credentials for institutional clients
  async generateAPICredentials(userId: string, permissions: string[]): Promise<{ apiKey: string; secretKey: string }> {
    const apiKey = `nex_${crypto.randomBytes(16).toString('hex')}`;
    const secretKey = crypto.randomBytes(32).toString('hex');
    
    const credentials: APICredentials = {
      userId,
      apiKey,
      secretKey,
      permissions,
      rateLimit: 1000, // 1000 requests per minute for institutions
      isActive: true
    };

    this.apiCredentials.set(apiKey, credentials);

    // In production, store in database
    return { apiKey, secretKey };
  }

  // Authenticate API request
  async authenticateAPIRequest(apiKey: string, signature: string, timestamp: string, payload: string): Promise<{ valid: boolean; userId?: string }> {
    const credentials = this.apiCredentials.get(apiKey);
    
    if (!credentials || !credentials.isActive) {
      return { valid: false };
    }

    // Check rate limiting
    if (!this.checkRateLimit(apiKey, credentials.rateLimit)) {
      return { valid: false };
    }

    // Verify signature (HMAC-SHA256)
    const expectedSignature = crypto
      .createHmac('sha256', credentials.secretKey)
      .update(timestamp + payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    // Check timestamp (5-minute window)
    const now = Date.now();
    const requestTime = parseInt(timestamp);
    if (Math.abs(now - requestTime) > 300000) { // 5 minutes
      return { valid: false };
    }

    return { valid: true, userId: credentials.userId };
  }

  // Institutional trading with higher limits
  async placeInstitutionalOrder(
    userId: string,
    symbol: string,
    type: 'market' | 'limit',
    side: 'buy' | 'sell',
    amount: string,
    price?: string,
    timeInForce: 'GTC' | 'IOC' | 'FOK' = 'GTC'
  ): Promise<{ success: boolean; orderId?: string; error?: string }> {
    
    // Check institutional limits
    const limits = await this.getInstitutionalLimits(userId);
    const orderValue = price ? parseFloat(amount) * parseFloat(price) : parseFloat(amount) * 50000; // Estimate for market orders

    if (orderValue > parseFloat(limits.maxOrderSize)) {
      return { success: false, error: "Order exceeds maximum size limit" };
    }

    // VASP compliance check
    const complianceResult = await vaspCompliance.checkTransactionCompliance({
      userId,
      transactionType: 'trade',
      amount,
      currency: symbol.split('/')[0]
    });

    if (!complianceResult.approved) {
      return { success: false, error: complianceResult.reason || "Compliance check failed" };
    }

    // Place order with enhanced execution priority
    const orderId = `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      await db.insert(orders).values({
        userId,
        symbol,
        type,
        side,
        amount,
        price: price || null,
        status: 'open',
        createdAt: new Date()
      });

      return { success: true, orderId };
    } catch (error) {
      return { success: false, error: "Failed to place order" };
    }
  }

  // Bulk order placement for institutions
  async placeBulkOrders(
    userId: string,
    orders: Array<{
      symbol: string;
      type: 'market' | 'limit';
      side: 'buy' | 'sell';
      amount: string;
      price?: string;
    }>
  ): Promise<{ success: boolean; results: Array<{ orderId?: string; error?: string }> }> {
    
    const results = [];
    let successCount = 0;

    for (const order of orders) {
      const result = await this.placeInstitutionalOrder(
        userId,
        order.symbol,
        order.type,
        order.side,
        order.amount,
        order.price
      );
      
      results.push(result);
      if (result.success) successCount++;
    }

    return {
      success: successCount > 0,
      results
    };
  }

  // Enhanced fiat gateway integration
  async processInstitutionalFiatDeposit(
    userId: string,
    amount: string,
    currency: 'USD' | 'EUR' | 'GBP',
    gateway: 'bank_wire' | 'swift' | 'sepa',
    bankDetails: any
  ): Promise<{ success: boolean; transactionId?: string; processingTime?: string }> {
    
    // Get gateway configuration
    const [gatewayConfig] = await db.select()
      .from(fiatGateways)
      .where(and(
        eq(fiatGateways.name, gateway),
        eq(fiatGateways.isActive, true)
      ));

    if (!gatewayConfig) {
      return { success: false };
    }

    // Check minimum/maximum amounts
    const depositAmount = parseFloat(amount);
    if (gatewayConfig.minAmount && depositAmount < parseFloat(gatewayConfig.minAmount)) {
      return { success: false };
    }
    if (gatewayConfig.maxAmount && depositAmount > parseFloat(gatewayConfig.maxAmount)) {
      return { success: false };
    }

    // Calculate fees
    const fees = gatewayConfig.fees as any;
    const feeAmount = fees?.fixed || (depositAmount * (fees?.percentage || 0) / 100);
    const netAmount = depositAmount - feeAmount;

    const transactionId = `fiat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      await db.insert(fiatTransactions).values({
        id: transactionId,
        userId,
        gatewayId: gatewayConfig.id,
        type: 'deposit',
        currency,
        amount,
        fee: feeAmount.toString(),
        netAmount: netAmount.toString(),
        status: 'pending',
        bankDetails,
        createdAt: new Date()
      });

      return {
        success: true,
        transactionId,
        processingTime: gatewayConfig.processingTime || '1-3 business days'
      };
    } catch (error) {
      return { success: false };
    }
  }

  // Setup fiat gateways for different regions
  async setupFiatGateways(): Promise<void> {
    const gateways = [
      {
        name: 'bank_wire',
        displayName: 'Bank Wire Transfer',
        type: 'bank_transfer',
        supportedCurrencies: ['USD', 'EUR', 'GBP'],
        supportedCountries: ['US', 'EU', 'UK', 'CA', 'AU'],
        minAmount: '1000',
        maxAmount: '10000000',
        processingTime: '1-3_days',
        fees: { fixed: 25, percentage: 0.1 },
        isActive: true,
        configuration: {
          requiresVerification: true,
          autoProcessing: false
        }
      },
      {
        name: 'sepa',
        displayName: 'SEPA Transfer',
        type: 'bank_transfer',
        supportedCurrencies: ['EUR'],
        supportedCountries: ['DE', 'FR', 'ES', 'IT', 'NL'],
        minAmount: '100',
        maxAmount: '100000',
        processingTime: 'instant',
        fees: { fixed: 1, percentage: 0 },
        isActive: true,
        configuration: {
          requiresVerification: false,
          autoProcessing: true
        }
      },
      {
        name: 'swift',
        displayName: 'SWIFT International',
        type: 'bank_transfer',
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
        supportedCountries: ['*'], // Global
        minAmount: '5000',
        maxAmount: '50000000',
        processingTime: '3-5_days',
        fees: { fixed: 50, percentage: 0.25 },
        isActive: true,
        configuration: {
          requiresVerification: true,
          autoProcessing: false,
          requiresCompliance: true
        }
      }
    ];

    for (const gateway of gateways) {
      await db.insert(fiatGateways).values(gateway).onConflictDoNothing();
    }
  }

  // Institutional reporting and analytics
  async generateInstitutionalReport(userId: string, startDate: Date, endDate: Date): Promise<any> {
    const userTrades = await db.select()
      .from(trades)
      .where(and(
        eq(trades.userId, userId),
        gte(trades.createdAt, startDate),
        lte(trades.createdAt, endDate)
      ));

    const userOrders = await db.select()
      .from(orders)
      .where(and(
        eq(orders.userId, userId),
        gte(orders.createdAt, startDate),
        lte(orders.createdAt, endDate)
      ));

    const totalVolume = userTrades.reduce((sum, trade) => {
      return sum + (parseFloat(trade.amount) * parseFloat(trade.price));
    }, 0);

    const executionRate = userTrades.length / userOrders.length;
    const avgOrderSize = userOrders.reduce((sum, order) => sum + parseFloat(order.amount), 0) / userOrders.length;

    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalTrades: userTrades.length,
        totalOrders: userOrders.length,
        totalVolume: totalVolume.toFixed(2),
        executionRate: (executionRate * 100).toFixed(2) + '%',
        avgOrderSize: avgOrderSize.toFixed(8)
      },
      trades: userTrades.map(trade => ({
        id: trade.id,
        symbol: trade.symbol,
        side: trade.side,
        amount: trade.amount,
        price: trade.price,
        timestamp: trade.createdAt
      }))
    };
  }

  // Private helper methods
  private checkRateLimit(apiKey: string, limit: number): boolean {
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    
    if (!this.rateLimits.has(apiKey)) {
      this.rateLimits.set(apiKey, []);
    }

    const requests = this.rateLimits.get(apiKey)!;
    const currentMinuteRequests = requests.filter(timestamp => Math.floor(timestamp / 60000) === minute);

    if (currentMinuteRequests.length >= limit) {
      return false;
    }

    requests.push(now);
    // Keep only last hour of requests
    this.rateLimits.set(apiKey, requests.filter(timestamp => now - timestamp < 3600000));

    return true;
  }

  private async getInstitutionalLimits(userId: string): Promise<InstitutionalLimits> {
    // Enhanced limits for institutional clients
    return {
      dailyTrading: "100000000", // $100M
      dailyWithdrawal: "50000000", // $50M
      maxOrderSize: "10000000", // $10M per order
      maxOpenOrders: 1000
    };
  }
}

export const institutionalAPI = new InstitutionalAPIService();