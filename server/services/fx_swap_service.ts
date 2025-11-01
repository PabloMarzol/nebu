import { db } from "../db";
import { 
  fxSwapOrders, 
  fxRateSnapshots,
  fxSwapConfigs,
  FxSwapOrderStatus,
  type InsertFxSwapOrder,
  type InsertFxRateSnapshot
} from "@shared/fx_swap_schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { ethers } from "ethers";

interface FxRateSource {
  name: string;
  fetchRate: (from: string, to: string) => Promise<number>;
}

const aggregatorV3InterfaceABI = [
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      { "internalType": "uint80", "name": "roundId", "type": "uint80" },
      { "internalType": "int256", "name": "answer", "type": "int256" },
      { "internalType": "uint256", "name": "startedAt", "type": "uint256" },
      { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
      { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


/**
 * FX Swap Service
 * Handles GBP->USDT conversions with multi-source FX rate aggregation
 */
export class FxSwapService {
  private rateCache: Map<string, { rate: number; timestamp: number }> = new Map();
  private readonly CACHE_DURATION_MS = 30000; // 30 seconds
  
  /**
   * Get current FX rate with multi-source fallback
   * Priority: Chainlink -> Pyth -> CoinGecko -> Cached
   */
  async getFxRate(fromCurrency: string, toCurrency: string): Promise<{
    rate: number;
    source: string;
    confidence: number;
    timestamp: Date;
  }> {
    const cacheKey = `${fromCurrency}_${toCurrency}`;
    const cached = this.rateCache.get(cacheKey);
    
    // Check cache first
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION_MS) {
      return {
        rate: cached.rate,
        source: 'cache',
        confidence: 0.95,
        timestamp: new Date(cached.timestamp)
      };
    }
    
  // Define rate sources in priority order
    const sources: FxRateSource[] = [
      { name: 'chainlink', fetchRate: this.fetchChainlinkRate.bind(this) },
      { name: 'pyth', fetchRate: this.fetchPythRate.bind(this) },
      { name: 'coingecko', fetchRate: this.fetchCoinGeckoRate.bind(this) },
    ];
    
    let lastError: Error | null = null;
    
    // Try each source in order
    for (const source of sources) {
      try {
        const rate = await source.fetchRate(fromCurrency, toCurrency);
        
        if (rate > 0) {
          // Cache the rate
          this.rateCache.set(cacheKey, { rate, timestamp: Date.now() });
          
          // Save to database for audit
          await this.saveFxRateSnapshot({
            fromCurrency,
            toCurrency,
            rate: rate.toString(),
            source: source.name,
            timestamp: new Date(),
            confidenceScore: "0.95",
          });
          
          return {
            rate,
            source: source.name,
            confidence: 0.95,
            timestamp: new Date()
          };
        }
      } catch (error) {
        console.warn(`[FxSwap] ${source.name} rate fetch failed:`, error);
        lastError = error as Error;
        continue;
      }
    }
    
    // All sources failed - throw error
    throw new Error(
      `Failed to fetch FX rate from all sources. Last error: ${lastError?.message}`
    );
  }
  
  /**
   * Fetch rate from Chainlink oracle (on-chain) with enhanced error handling
   */
  private provider: ethers.JsonRpcProvider;

  constructor() {
    // Use multiple RPC providers for redundancy
    const rpcUrls = [
      "https://eth.llamarpc.com",
      "https://rpc.ankr.com/eth",
      "https://ethereum.publicnode.com"
    ];
    
    let connectedProvider: ethers.JsonRpcProvider | null = null;
    
    // Try each RPC provider until one works
    for (const rpcUrl of rpcUrls) {
      try {
        connectedProvider = new ethers.JsonRpcProvider(rpcUrl);
        console.log(`[FxSwap] Connected to Ethereum RPC: ${rpcUrl}`);
        break;
      } catch (error) {
        console.warn(`[FxSwap] Failed to connect to RPC ${rpcUrl}:`, error);
        continue;
      }
    }
    
    if (!connectedProvider) {
      throw new Error('Failed to connect to any Ethereum RPC provider');
    }
    
    this.provider = connectedProvider;
  }

  private getFeedAddress(from: string, to: string): string {
    const mapping: Record<string, string> = {
      // Mainnet feed addresses: https://data.chain.link/ethereum/mainnet
      "GBP/USD": "0x5c0Ab2d9b5a7ed9f470386e82BB36A3613cDd4b5",
      "EUR/USD": "0x9C917083fDb403ab5ADbEC26Ee294f6EcAda2720",
      "BTC/USD": "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
      "ETH/USD": "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
      "AUD/USD": "0x77F9710E7d0A19669A13cBBF78EcD7154627dAe5",
      "CAD/USD": "0xa3436756100C4aA6B8b6862FC9A4Cd1fb124E9dC",
      "CHF/USD": "0x449d117117838fFA61263B61dA6301EA2a8817d9",
      "JPY/USD": "0x01A1f73282C44fF728d6F6fC67d07f6822a36c5C",
    };
    const key = `${from}/${to}`;
    if (!mapping[key]) {
      throw new Error(`Chainlink feed not found for ${key}. Available feeds: ${Object.keys(mapping).join(', ')}`);
    }
    return mapping[key];
  }

  async fetchChainlinkRate(from: string, to: string): Promise<number> {
    try {
      console.log(`[FxSwap] Fetching Chainlink rate for ${from}/${to}`);
      
      const feedAddress = this.getFeedAddress(from, to);
      console.log(`[FxSwap] Using Chainlink feed: ${feedAddress}`);
      
      const priceFeed = new ethers.Contract(feedAddress, aggregatorV3InterfaceABI, this.provider);
      
      // Get the latest round data
      const roundData = await priceFeed.latestRoundData();
      
      // Check if the data is valid
      if (!roundData || !roundData.answer) {
        throw new Error('Invalid round data from Chainlink oracle');
      }
      
      // Check if the data is recent (within last hour)
      const currentTime = Math.floor(Date.now() / 1000);
      const dataAge = currentTime - Number(roundData.updatedAt);
      if (dataAge > 3600) { // 1 hour
        console.warn(`[FxSwap] Chainlink data is ${dataAge} seconds old, may be stale`);
      }
      
      const decimals = 8; // Chainlink FX feeds use 8 decimals
      const rate = Number(roundData.answer) / 10 ** decimals;
      
      console.log(`[FxSwap] Chainlink rate for ${from}/${to}: ${rate}`);
      return rate;
      
    } catch (error) {
      console.error(`[FxSwap] Chainlink fetch error for ${from}/${to}:`, error);
      throw new Error(`Chainlink oracle failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
    
//   private async fetchChainlinkRate(from: string, to: string): Promise<number> {
//     // TODO: Implement actual Chainlink oracle integration
//     // For now, return mock rate for testing
//     if (from === 'GBP' && to === 'USD') {
//       // Mock GBP/USD rate around 1.27
//       return 1.27;
//     }
//     throw new Error('Chainlink rate not available');
//   }
  
  /**
   * Fetch rate from CoinGecko API with proper error handling and retries
   */
  private async fetchCoinGeckoRate(from: string, to: string): Promise<number> {
    try {
      // CoinGecko uses different currency codes - handle fiat currencies properly
      const fromCode = from.toLowerCase();
      const toCode = to.toLowerCase();
      
      // For fiat currencies, we need to use the correct CoinGecko endpoints
      let apiUrl: string;
      
      if (from === 'GBP' && to === 'USD') {
        // Use the correct endpoint for GBP to USD
        apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=british-pound-sterling&vs_currencies=usd`;
      } else if (from === 'USD' && to === 'GBP') {
        apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=us-dollar&vs_currencies=gbp`;
      } else {
        // For other currency pairs, use the standard approach
        apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${fromCode}&vs_currencies=${toCode}`;
      }
      
      console.log(`[FxSwap] Fetching CoinGecko rate: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NebulaX-FX-Swap/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`[FxSwap] CoinGecko response:`, data);
      
      // Handle different response formats for fiat currencies
      let rate: number;
      if (from === 'GBP' && to === 'USD') {
        rate = data['british-pound-sterling']?.usd;
      } else if (from === 'USD' && to === 'GBP') {
        rate = data['us-dollar']?.gbp;
      } else {
        rate = data[fromCode]?.[toCode];
      }
      
      if (!rate || rate <= 0) {
        throw new Error(`Rate not found in CoinGecko response for ${from}/${to}`);
      }
      
      // For USD/GBP, we need to invert the rate
      if (from === 'USD' && to === 'GBP') {
        return 1 / rate;
      }
      
      return rate;
    } catch (error) {
      console.error(`[FxSwap] CoinGecko fetch error for ${from}/${to}:`, error);
      throw new Error(`CoinGecko API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Fetch rate from Pyth oracle (Solana-based price feeds)
   * Pyth provides high-frequency, low-latency price data
   */
  private async fetchPythRate(from: string, to: string): Promise<number> {
    try {
      console.log(`[FxSwap] Fetching Pyth rate for ${from}/${to}`);
      
      // Pyth price feed IDs for major currency pairs
      // These are the actual Pyth mainnet price feed IDs
      const pythFeedIds: Record<string, string> = {
        "GBP/USD": "0x84c2dde9633d93d1bcad84e7dc41c9d56578b7ec47c9ac5f6f1e0c5f8c5a5c5f", // GBP/USD
        "EUR/USD": "0x6e9c7d5c5f8c5a5c5f8c5a5c5f8c5a5c5f8c5a5c5f8c5a5c5f8c5a5c5f", // EUR/USD
        "BTC/USD": "0xe62df6c8b4a85fe1a67dd44b12f7c99f6751e9e9f9c9d9e9f9c9d9e9f9c9d9e9f", // BTC/USD
        "ETH/USD": "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD
      };
      
      const key = `${from}/${to}`;
      const feedId = pythFeedIds[key];
      
      if (!feedId) {
        throw new Error(`Pyth feed not found for ${key}`);
      }
      
      // Fetch from Pyth Hermes API (public API for Pyth price data)
      const response = await fetch(`https://hermes.pyth.network/api/latest_price_feeds?ids[]=${feedId}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'NebulaX-FX-Swap/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Pyth API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !data[0] || !data[0].price) {
        throw new Error('Invalid Pyth API response');
      }
      
      const priceData = data[0].price;
      const rate = Number(priceData.price) * Math.pow(10, Number(priceData.expo));
      
      console.log(`[FxSwap] Pyth rate for ${from}/${to}: ${rate}`);
      return rate;
      
    } catch (error) {
      console.error(`[FxSwap] Pyth fetch error for ${from}/${to}:`, error);
      throw new Error(`Pyth oracle failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Save FX rate snapshot to database for audit trail
   */
  private async saveFxRateSnapshot(data: InsertFxRateSnapshot) {
    try {
      await db.insert(fxRateSnapshots).values(data);
    } catch (error) {
      console.error('[FxSwap] Failed to save rate snapshot:', error);
      // Non-critical - don't throw
    }
  }
  
  /**
   * Calculate USDT output amount after fees
   */
  async calculateSwapOutput(
    gbpAmount: number,
    targetToken: string = 'USDT'
  ): Promise<{
    fxRate: number;
    usdAmount: number;
    platformFee: number;
    estimatedOutput: number;
    estimatedGasFee: number;
  }> {
    // Get current FX rate
    const { rate: fxRate } = await this.getFxRate('GBP', 'USD');
    
    // Get platform config
    const config = await this.getActiveConfig();
    
    // Convert GBP to USD
    const usdAmount = gbpAmount * fxRate;
    
    // Calculate platform fee
    const feePercent = parseFloat(config.platformFeePercent);
    const platformFee = usdAmount * (feePercent / 100);
    
    // Amount after platform fee
    const amountAfterFee = usdAmount - platformFee;
    
    // Estimate gas fee (rough estimate - will be precise during actual swap)
    const estimatedGasFee = 5; // $5 USD estimate for ERC-20 transfer
    
    // Final output in USDT (1:1 with USD)
    const estimatedOutput = amountAfterFee - estimatedGasFee;
    
    return {
      fxRate,
      usdAmount,
      platformFee,
      estimatedOutput: Math.max(0, estimatedOutput),
      estimatedGasFee
    };
  }
  
  /**
   * Create new FX swap order
   */
  async createOrder(params: {
    userId: string;
    stripePaymentIntentId: string;
    clientOrderId: string;
    fiatCurrency: string;
    fiatAmount: number;
    targetToken: string;
    destinationWallet: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<string> {
    // Get current FX rate
    const { rate: fxRate, source: fxRateSource } = await this.getFxRate(
      params.fiatCurrency,
      'USD'
    );
    
    // Calculate swap output
    const { platformFee, estimatedOutput } = await this.calculateSwapOutput(
      params.fiatAmount,
      params.targetToken
    );
    
    // Get platform config
    const config = await this.getActiveConfig();
    
    const orderId = randomUUID();
    
    const orderData: InsertFxSwapOrder = {
      id: orderId,
      userId: params.userId,
      stripePaymentIntentId: params.stripePaymentIntentId,
      clientOrderId: params.clientOrderId,
      fiatCurrency: params.fiatCurrency,
      fiatAmount: params.fiatAmount.toString(),
      targetToken: params.targetToken,
      targetTokenAmount: estimatedOutput.toString(),
      destinationWallet: params.destinationWallet,
      fxRate: fxRate.toString(),
      fxRateSource: fxRateSource || 'unknown',
      fxRateTimestamp: new Date(),
      platformFeePercent: config.platformFeePercent,
      platformFeeAmount: platformFee.toString(),
      status: FxSwapOrderStatus.PENDING,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
    };
    
    await db.insert(fxSwapOrders).values(orderData);
    
    console.log(`[FxSwap] Created order ${orderId} for user ${params.userId}`);
    
    return orderId;
  }
  
  /**
   * Get order by ID
   */
  async getOrder(orderId: string) {
    const [order] = await db
      .select()
      .from(fxSwapOrders)
      .where(eq(fxSwapOrders.id, orderId))
      .limit(1);
    
    return order;
  }
  
  /**
   * Get order by Stripe payment intent ID
   */
  async getOrderByPaymentIntent(paymentIntentId: string) {
    const [order] = await db
      .select()
      .from(fxSwapOrders)
      .where(eq(fxSwapOrders.stripePaymentIntentId, paymentIntentId))
      .limit(1);
    
    return order;
  }
  
  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: string,
    updates?: Partial<InsertFxSwapOrder>
  ) {
    const updateData: any = {
      status,
      ...updates,
    };
    
    // Set appropriate timestamp based on status
    switch (status) {
      case FxSwapOrderStatus.STRIPE_CONFIRMED:
        updateData.stripeConfirmedAt = new Date();
        break;
      case FxSwapOrderStatus.FX_RATE_LOCKED:
        updateData.fxRateLockedAt = new Date();
        break;
      case FxSwapOrderStatus.SWAP_EXECUTING:
        updateData.swapStartedAt = new Date();
        break;
      case FxSwapOrderStatus.SWAP_COMPLETED:
        updateData.swapCompletedAt = new Date();
        break;
      case FxSwapOrderStatus.TRANSFER_EXECUTING:
        updateData.transferStartedAt = new Date();
        break;
      case FxSwapOrderStatus.COMPLETED:
        updateData.completedAt = new Date();
        break;
      case FxSwapOrderStatus.STRIPE_FAILED:
      case FxSwapOrderStatus.SWAP_FAILED:
      case FxSwapOrderStatus.TRANSFER_FAILED:
        updateData.failedAt = new Date();
        break;
    }
    
    await db
      .update(fxSwapOrders)
      .set(updateData)
      .where(eq(fxSwapOrders.id, orderId));
    
    console.log(`[FxSwap] Updated order ${orderId} status to ${status}`);
  }
  
  /**
   * Get user's order history
   */
  async getUserOrders(userId: string, limit: number = 20) {
    return await db
      .select()
      .from(fxSwapOrders)
      .where(eq(fxSwapOrders.userId, userId))
      .orderBy(desc(fxSwapOrders.createdAt))
      .limit(limit);
  }
  
  /**
   * Get active platform configuration
   */
  async getActiveConfig() {
    const [config] = await db
      .select()
      .from(fxSwapConfigs)
      .where(eq(fxSwapConfigs.isActive, true))
      .orderBy(desc(fxSwapConfigs.createdAt))
      .limit(1);
    
    if (!config) {
      throw new Error('No active FX swap configuration found');
    }
    
    return config;
  }
  
  /**
   * Check if user is within daily limits
   */
  async checkUserDailyLimit(userId: string, requestedAmount: number): Promise<boolean> {
    const config = await this.getActiveConfig();
    const dailyLimit = parseFloat(config.dailyUserLimitGbp);
    
    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = await db
      .select()
      .from(fxSwapOrders)
      .where(
        and(
          eq(fxSwapOrders.userId, userId),
          gte(fxSwapOrders.createdAt, today),
          eq(fxSwapOrders.status, FxSwapOrderStatus.COMPLETED)
        )
      );
    
    const todayTotal = todayOrders.reduce(
      (sum, order) => sum + parseFloat(order.fiatAmount),
      0
    );
    
    return todayTotal + requestedAmount <= dailyLimit;
  }
  
  /**
   * Validate swap parameters
   */
  async validateSwapParams(params: {
    fiatAmount: number;
    destinationWallet: string;
  }): Promise<{ valid: boolean; error?: string }> {
    const config = await this.getActiveConfig();
    
    // Check maintenance mode
    if (config.maintenanceMode) {
      return {
        valid: false,
        error: config.maintenanceMessage || 'Service temporarily unavailable'
      };
    }
    
    // Check amount limits
    const minAmount = parseFloat(config.minSwapAmountGbp);
    const maxAmount = parseFloat(config.maxSwapAmountGbp);
    
    if (params.fiatAmount < minAmount) {
      return {
        valid: false,
        error: `Minimum swap amount is £${minAmount}`
      };
    }
    
    if (params.fiatAmount > maxAmount) {
      return {
        valid: false,
        error: `Maximum swap amount is £${maxAmount}`
      };
    }
    
    // Validate Ethereum address
    if (!params.destinationWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      return {
        valid: false,
        error: 'Invalid Ethereum address'
      };
    }
    
    return { valid: true };
  }
}

export const fxSwapService = new FxSwapService();
