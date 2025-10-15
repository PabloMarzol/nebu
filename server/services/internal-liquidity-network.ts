import { db } from "../db";
import { eq, and, or, gte, lte, desc, asc, sql } from "drizzle-orm";
import { orders, trades, portfolios, marketData } from "@shared/schema";

export interface InternalOrder {
  id: string;
  userId: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: number;
  price?: number;
  status: 'pending' | 'open' | 'filled' | 'cancelled';
  filledAmount: number;
  averagePrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiquidityMatch {
  buyOrder: InternalOrder;
  sellOrder: InternalOrder;
  matchedAmount: number;
  matchedPrice: number;
  timestamp: Date;
}

export class InternalLiquidityNetwork {
  private orderBooks: Map<string, { bids: InternalOrder[], asks: InternalOrder[] }> = new Map();
  private readonly SUPPORTED_PAIRS = [
    'BTC/USDT', 'ETH/USDT', 'ETH/BTC', 'SOL/USDT', 'ADA/USDT', 
    'DOT/USDT', 'LINK/USDT', 'UNI/USDT', 'AAVE/USDT', 'MATIC/USDT'
  ];

  constructor() {
    this.initializeOrderBooks();
    this.startMatchingEngine();
  }

  private initializeOrderBooks() {
    this.SUPPORTED_PAIRS.forEach(pair => {
      this.orderBooks.set(pair, { bids: [], asks: [] });
    });
  }

  async addOrder(order: Omit<InternalOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<InternalOrder> {
    const newOrder: InternalOrder = {
      ...order,
      id: `iln_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to database
    await db.insert(orders).values({
      userId: newOrder.userId,
      symbol: newOrder.pair,
      side: newOrder.side,
      type: newOrder.type,
      amount: newOrder.amount.toString(),
      price: newOrder.price?.toString(),
      status: newOrder.status
    });

    // Add to in-memory order book
    const orderBook = this.orderBooks.get(newOrder.pair);
    if (orderBook) {
      if (newOrder.side === 'buy') {
        orderBook.bids.push(newOrder);
        orderBook.bids.sort((a, b) => (b.price || 0) - (a.price || 0)); // Highest price first
      } else {
        orderBook.asks.push(newOrder);
        orderBook.asks.sort((a, b) => (a.price || 0) - (b.price || 0)); // Lowest price first
      }
    }

    console.log(`[ILN] Order added: ${newOrder.side} ${newOrder.amount} ${newOrder.pair} at ${newOrder.price}`);
    
    // Trigger immediate matching
    await this.matchOrders(newOrder.pair);
    
    return newOrder;
  }

  async matchOrders(pair: string): Promise<LiquidityMatch[]> {
    const matches: LiquidityMatch[] = [];
    const orderBook = this.orderBooks.get(pair);
    
    if (!orderBook || orderBook.bids.length === 0 || orderBook.asks.length === 0) {
      return matches;
    }

    let bidIndex = 0;
    let askIndex = 0;

    while (bidIndex < orderBook.bids.length && askIndex < orderBook.asks.length) {
      const buyOrder = orderBook.bids[bidIndex];
      const sellOrder = orderBook.asks[askIndex];

      // Check if orders can match (buy price >= sell price)
      if (!buyOrder.price || !sellOrder.price || buyOrder.price < sellOrder.price) {
        break;
      }

      // Calculate matched amount
      const buyRemaining = buyOrder.amount - buyOrder.filledAmount;
      const sellRemaining = sellOrder.amount - sellOrder.filledAmount;
      const matchedAmount = Math.min(buyRemaining, sellRemaining);

      if (matchedAmount <= 0) {
        if (buyRemaining <= 0) bidIndex++;
        if (sellRemaining <= 0) askIndex++;
        continue;
      }

      // Determine execution price (price-time priority)
      const executionPrice = buyOrder.createdAt <= sellOrder.createdAt ? buyOrder.price : sellOrder.price;

      // Create match
      const match: LiquidityMatch = {
        buyOrder,
        sellOrder,
        matchedAmount,
        matchedPrice: executionPrice,
        timestamp: new Date()
      };

      matches.push(match);

      // Update order fill amounts
      buyOrder.filledAmount += matchedAmount;
      sellOrder.filledAmount += matchedAmount;
      buyOrder.updatedAt = new Date();
      sellOrder.updatedAt = new Date();

      // Update order status if fully filled
      if (buyOrder.filledAmount >= buyOrder.amount) {
        buyOrder.status = 'filled';
        buyOrder.averagePrice = executionPrice;
      }
      
      if (sellOrder.filledAmount >= sellOrder.amount) {
        sellOrder.status = 'filled';
        sellOrder.averagePrice = executionPrice;
      }

      // Execute the trade
      await this.executeTrade(match);

      // Remove filled orders
      if (buyOrder.status === 'filled') {
        orderBook.bids.splice(bidIndex, 1);
      } else {
        bidIndex++;
      }

      if (sellOrder.status === 'filled') {
        orderBook.asks.splice(askIndex, 1);
      } else {
        askIndex++;
      }
    }

    if (matches.length > 0) {
      console.log(`[ILN] Matched ${matches.length} orders for ${pair}`);
    }

    return matches;
  }

  private async executeTrade(match: LiquidityMatch): Promise<void> {
    const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Record trade in database
      await db.insert(trades).values({
        symbol: match.buyOrder.pair,
        amount: match.matchedAmount.toString(),
        price: match.matchedPrice.toString()
      });

      // Update user portfolios
      await this.updatePortfolios(match);

      console.log(`[ILN] Trade executed: ${match.matchedAmount} ${match.buyOrder.pair} at ${match.matchedPrice}`);
    } catch (error) {
      console.error(`[ILN] Trade execution failed:`, error);
    }
  }

  private async updatePortfolios(match: LiquidityMatch): Promise<void> {
    const [baseCurrency, quoteCurrency] = match.buyOrder.pair.split('/');
    const tradedAmount = match.matchedAmount;
    const tradedValue = match.matchedAmount * match.matchedPrice;

    try {
      // Update buyer portfolio (receives base currency, pays quote currency)
      const buyerPortfolio = await db.select().from(portfolios)
        .where(eq(portfolios.userId, match.buyOrder.userId));
      
      if (buyerPortfolio.length > 0) {
        // Update base currency balance
        await db.update(portfolios)
          .set({ balance: (parseFloat(buyerPortfolio[0].balance) + tradedAmount).toString() })
          .where(and(eq(portfolios.userId, match.buyOrder.userId), eq(portfolios.symbol, baseCurrency)));
        
        // Update quote currency balance
        await db.update(portfolios)
          .set({ balance: (parseFloat(buyerPortfolio[0].balance) - tradedValue).toString() })
          .where(and(eq(portfolios.userId, match.buyOrder.userId), eq(portfolios.symbol, quoteCurrency)));
      }

      // Update seller portfolio (pays base currency, receives quote currency)
      const sellerPortfolio = await db.select().from(portfolios)
        .where(eq(portfolios.userId, match.sellOrder.userId));
      
      if (sellerPortfolio.length > 0) {
        // Update base currency balance
        await db.update(portfolios)
          .set({ balance: (parseFloat(sellerPortfolio[0].balance) - tradedAmount).toString() })
          .where(and(eq(portfolios.userId, match.sellOrder.userId), eq(portfolios.symbol, baseCurrency)));
        
        // Update quote currency balance
        await db.update(portfolios)
          .set({ balance: (parseFloat(sellerPortfolio[0].balance) + tradedValue).toString() })
          .where(and(eq(portfolios.userId, match.sellOrder.userId), eq(portfolios.symbol, quoteCurrency)));
      }
    } catch (error) {
      console.error(`[ILN] Portfolio update failed:`, error);
    }
  }

  async getOrderBook(pair: string): Promise<{ bids: InternalOrder[], asks: InternalOrder[] }> {
    const orderBook = this.orderBooks.get(pair);
    return orderBook || { bids: [], asks: [] };
  }

  async getLiquidityStats(): Promise<{
    totalPairs: number;
    totalOrders: number;
    totalVolume24h: number;
    averageSpread: number;
  }> {
    let totalOrders = 0;
    let totalVolume24h = 0;
    let spreadSum = 0;
    let pairsWithSpread = 0;

    for (const [pair, orderBook] of Array.from(this.orderBooks.entries())) {
      totalOrders += orderBook.bids.length + orderBook.asks.length;
      
      // Calculate spread
      if (orderBook.bids.length > 0 && orderBook.asks.length > 0) {
        const bestBid = orderBook.bids[0].price || 0;
        const bestAsk = orderBook.asks[0].price || 0;
        const spread = ((bestAsk - bestBid) / bestBid) * 100;
        spreadSum += spread;
        pairsWithSpread++;
      }
    }

    // Get 24h volume from database
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTrades = await db.select().from(trades)
      .where(gte(trades.createdAt, yesterday));
    
    totalVolume24h = recentTrades.reduce((sum, trade) => {
      return sum + (parseFloat(trade.amount) * parseFloat(trade.price));
    }, 0);

    return {
      totalPairs: this.SUPPORTED_PAIRS.length,
      totalOrders,
      totalVolume24h,
      averageSpread: pairsWithSpread > 0 ? spreadSum / pairsWithSpread : 0
    };
  }

  private startMatchingEngine(): void {
    // Run matching every 100ms for real-time execution
    setInterval(async () => {
      for (const pair of this.SUPPORTED_PAIRS) {
        await this.matchOrders(pair);
      }
    }, 100);

    console.log(`[ILN] Internal Liquidity Network started for ${this.SUPPORTED_PAIRS.length} pairs`);
  }
}

// Global instance
export const internalLiquidityNetwork = new InternalLiquidityNetwork();