import { internalLiquidityNetwork } from "./internal-liquidity-network";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { marketData } from "@shared/schema";

export interface MarketMakingConfig {
  pair: string;
  enabled: boolean;
  spreadPercentage: number; // e.g., 0.5 for 0.5%
  orderSize: number; // Base order size
  maxOrders: number; // Maximum orders per side
  priceSteps: number; // Number of price levels
  refreshInterval: number; // Milliseconds
}

export interface BotOrder {
  id: string;
  pair: string;
  side: 'buy' | 'sell';
  price: number;
  amount: number;
  level: number; // Price level (0 = closest to mid)
}

export class MarketMakingBots {
  private configs: Map<string, MarketMakingConfig> = new Map();
  private activeOrders: Map<string, BotOrder[]> = new Map();
  private readonly BOT_USER_ID = 'market_maker_bot';
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeConfigs();
    this.startMarketMaking();
  }

  private initializeConfigs(): void {
    const defaultConfigs: MarketMakingConfig[] = [
      {
        pair: 'BTC/USDT',
        enabled: true,
        spreadPercentage: 0.1, // 0.1% spread
        orderSize: 0.01, // 0.01 BTC per order
        maxOrders: 5,
        priceSteps: 5,
        refreshInterval: 5000 // 5 seconds
      },
      {
        pair: 'ETH/USDT',
        enabled: true,
        spreadPercentage: 0.15,
        orderSize: 0.1, // 0.1 ETH per order
        maxOrders: 5,
        priceSteps: 5,
        refreshInterval: 5000
      },
      {
        pair: 'ETH/BTC',
        enabled: true,
        spreadPercentage: 0.2,
        orderSize: 0.1,
        maxOrders: 3,
        priceSteps: 3,
        refreshInterval: 10000
      },
      {
        pair: 'SOL/USDT',
        enabled: true,
        spreadPercentage: 0.25,
        orderSize: 1, // 1 SOL per order
        maxOrders: 4,
        priceSteps: 4,
        refreshInterval: 7000
      },
      {
        pair: 'ADA/USDT',
        enabled: true,
        spreadPercentage: 0.3,
        orderSize: 100, // 100 ADA per order
        maxOrders: 4,
        priceSteps: 4,
        refreshInterval: 8000
      }
    ];

    defaultConfigs.forEach(config => {
      this.configs.set(config.pair, config);
      this.activeOrders.set(config.pair, []);
    });
  }

  private async getCurrentPrice(pair: string): Promise<number | null> {
    try {
    // Get latest market data from database
      const latestData = await db.select().from(marketData)
        .where(eq(marketData.symbol, pair.replace('/', '')))
        .orderBy(marketData.updatedAt)
        .limit(1);

      if (latestData.length > 0) {
        return parseFloat(latestData[0].price);
      }

      // Fallback to hardcoded prices for development
      const fallbackPrices: Record<string, number> = {
        'BTC/USDT': 65000,
        'ETH/USDT': 3200,
        'ETH/BTC': 0.049,
        'SOL/USDT': 140,
        'ADA/USDT': 0.45,
        'DOT/USDT': 8.5,
        'LINK/USDT': 18,
        'UNI/USDT': 12,
        'AAVE/USDT': 85,
        'MATIC/USDT': 0.95
      };

      return fallbackPrices[pair] || null;
    } catch (error) {
      console.error(`[MarketMaker] Failed to get price for ${pair}:`, error);
      return null;
    }
  }

  private calculateOrderLevels(config: MarketMakingConfig, midPrice: number): {
    bids: { price: number; amount: number; level: number }[];
    asks: { price: number; amount: number; level: number }[];
  } {
    const bids = [];
    const asks = [];
    const baseSpread = midPrice * (config.spreadPercentage / 100);

    for (let i = 0; i < config.maxOrders; i++) {
      // Calculate price levels with increasing spread
      const spreadMultiplier = 1 + (i * 0.2); // Increase spread by 20% per level
      const adjustedSpread = baseSpread * spreadMultiplier;

      // Bid prices (below mid price)
      const bidPrice = midPrice - adjustedSpread - (i * baseSpread * 0.1);
      // Ask prices (above mid price)
      const askPrice = midPrice + adjustedSpread + (i * baseSpread * 0.1);

      // Vary order sizes slightly for more realistic depth
      const sizeVariation = 0.8 + (Math.random() * 0.4); // 80% to 120% of base size
      const orderAmount = config.orderSize * sizeVariation;

      bids.push({
        price: Math.round(bidPrice * 100) / 100, // Round to 2 decimals
        amount: Math.round(orderAmount * 10000) / 10000, // Round to 4 decimals
        level: i
      });

      asks.push({
        price: Math.round(askPrice * 100) / 100,
        amount: Math.round(orderAmount * 10000) / 10000,
        level: i
      });
    }

    return { bids, asks };
  }

  private async cancelExistingOrders(pair: string): Promise<void> {
    const existingOrders = this.activeOrders.get(pair) || [];
    
    // In a real implementation, you would cancel orders through the trading engine
    // For now, we'll just clear the tracking
    this.activeOrders.set(pair, []);
    
    if (existingOrders.length > 0) {
      console.log(`[MarketMaker] Cancelled ${existingOrders.length} existing orders for ${pair}`);
    }
  }

  private async placeMarketMakingOrders(pair: string): Promise<void> {
    const config = this.configs.get(pair);
    if (!config || !config.enabled) return;

    const currentPrice = await this.getCurrentPrice(pair);
    if (!currentPrice) {
      console.warn(`[MarketMaker] No price data available for ${pair}`);
      return;
    }

    try {
      // Cancel existing orders first
      await this.cancelExistingOrders(pair);

      // Calculate new order levels
      const { bids, asks } = this.calculateOrderLevels(config, currentPrice);
      const newOrders: BotOrder[] = [];

      // Place bid orders
      for (const bid of bids) {
        try {
          const order = await internalLiquidityNetwork.addOrder({
            userId: this.BOT_USER_ID,
            pair,
            side: 'buy',
            type: 'limit',
            amount: bid.amount,
            price: bid.price,
            status: 'open',
            filledAmount: 0
          });

          newOrders.push({
            id: order.id,
            pair,
            side: 'buy',
            price: bid.price,
            amount: bid.amount,
            level: bid.level
          });
        } catch (error) {
          console.error(`[MarketMaker] Failed to place bid order for ${pair}:`, error);
        }
      }

      // Place ask orders
      for (const ask of asks) {
        try {
          const order = await internalLiquidityNetwork.addOrder({
            userId: this.BOT_USER_ID,
            pair,
            side: 'sell',
            type: 'limit',
            amount: ask.amount,
            price: ask.price,
            status: 'open',
            filledAmount: 0
          });

          newOrders.push({
            id: order.id,
            pair,
            side: 'sell',
            price: ask.price,
            amount: ask.amount,
            level: ask.level
          });
        } catch (error) {
          console.error(`[MarketMaker] Failed to place ask order for ${pair}:`, error);
        }
      }

      // Update active orders tracking
      this.activeOrders.set(pair, newOrders);

      console.log(`[MarketMaker] Placed ${newOrders.length} market making orders for ${pair} (mid: ${currentPrice})`);
    } catch (error) {
      console.error(`[MarketMaker] Failed to place orders for ${pair}:`, error);
    }
  }

  private startMarketMaking(): void {
    console.log(`[MarketMaker] Starting market making bots for ${this.configs.size} pairs`);

    // Start market making for each configured pair
    Array.from(this.configs.entries()).forEach(([pair, config]) => {
      if (config.enabled) {
        // Initial order placement
        this.placeMarketMakingOrders(pair);

        // Set up refresh interval
        const interval = setInterval(() => {
          this.placeMarketMakingOrders(pair);
        }, config.refreshInterval);

        this.intervals.set(pair, interval);
        console.log(`[MarketMaker] Bot started for ${pair} (refresh: ${config.refreshInterval}ms)`);
      }
    });
  }

  async updateConfig(pair: string, newConfig: Partial<MarketMakingConfig>): Promise<boolean> {
    const existingConfig = this.configs.get(pair);
    if (!existingConfig) return false;

    const updatedConfig = { ...existingConfig, ...newConfig };
    this.configs.set(pair, updatedConfig);

    // Restart bot for this pair if enabled
    if (updatedConfig.enabled) {
      const existingInterval = this.intervals.get(pair);
      if (existingInterval) {
        clearInterval(existingInterval);
      }

      // Restart with new config
      await this.placeMarketMakingOrders(pair);
      const newInterval = setInterval(() => {
        this.placeMarketMakingOrders(pair);
      }, updatedConfig.refreshInterval);

      this.intervals.set(pair, newInterval);
      console.log(`[MarketMaker] Config updated for ${pair}`);
    } else {
      // Stop bot if disabled
      const interval = this.intervals.get(pair);
      if (interval) {
        clearInterval(interval);
        this.intervals.delete(pair);
      }
      await this.cancelExistingOrders(pair);
      console.log(`[MarketMaker] Bot disabled for ${pair}`);
    }

    return true;
  }

  getStats(): {
    pair: string;
    enabled: boolean;
    activeOrders: number;
    bidOrders: number;
    askOrders: number;
    spread: number;
    lastUpdate: Date;
  }[] {
    const stats = [];

    for (const [pair, config] of this.configs.entries()) {
      const orders = this.activeOrders.get(pair) || [];
      const bidOrders = orders.filter(o => o.side === 'buy').length;
      const askOrders = orders.filter(o => o.side === 'sell').length;

      stats.push({
        pair,
        enabled: config.enabled,
        activeOrders: orders.length,
        bidOrders,
        askOrders,
        spread: config.spreadPercentage,
        lastUpdate: new Date()
      });
    }

    return stats;
  }

  async stop(): Promise<void> {
    console.log(`[MarketMaker] Stopping all market making bots`);
    
    // Clear all intervals
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();

    // Cancel all active orders
    for (const pair of Array.from(this.configs.keys())) {
      await this.cancelExistingOrders(pair);
    }
  }
}

// Global instance
export const marketMakingBots = new MarketMakingBots();