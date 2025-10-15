// Hybrid Liquidity Service - Combines Internal Liquidity Network and Market Making
export class HybridLiquidityService {
  private orderBooks: Map<string, { bids: any[], asks: any[] }> = new Map();
  private marketMakingBots: Map<string, any> = new Map();
  
  private readonly SUPPORTED_PAIRS = [
    'BTC/USDT', 'ETH/USDT', 'ETH/BTC', 'SOL/USDT', 'ADA/USDT', 
    'DOT/USDT', 'LINK/USDT', 'UNI/USDT', 'AAVE/USDT', 'MATIC/USDT'
  ];

  constructor() {
    this.initializeOrderBooks();
    this.startMarketMaking();
    console.log(`[Hybrid Liquidity] Service initialized for ${this.SUPPORTED_PAIRS.length} pairs`);
  }

  private initializeOrderBooks() {
    this.SUPPORTED_PAIRS.forEach(pair => {
      this.orderBooks.set(pair, { bids: [], asks: [] });
    });
  }

  private startMarketMaking() {
    // Price references for market making
    const prices: Record<string, number> = {
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

    // Start automated house trading
    this.startAutomatedTrading(prices);

    // Create market making orders for each pair
    this.SUPPORTED_PAIRS.forEach(pair => {
      const basePrice = prices[pair] || 100;
      const spread = basePrice * 0.001; // 0.1% spread
      
      const orderBook = this.orderBooks.get(pair);
      if (orderBook) {
        // Create 5 bid levels
        for (let i = 0; i < 5; i++) {
          const bidPrice = basePrice - spread - (i * spread * 0.2);
          const askPrice = basePrice + spread + (i * spread * 0.2);
          
          orderBook.bids.push({
            id: `bot_bid_${pair}_${i}`,
            price: Math.round(bidPrice * 100) / 100,
            amount: 0.1 + (Math.random() * 0.5),
            userId: 'market_maker_bot',
            side: 'buy',
            type: 'limit',
            status: 'open',
            createdAt: new Date()
          });

          orderBook.asks.push({
            id: `bot_ask_${pair}_${i}`,
            price: Math.round(askPrice * 100) / 100,
            amount: 0.1 + (Math.random() * 0.5),
            userId: 'market_maker_bot',
            side: 'sell',
            type: 'limit',
            status: 'open',
            createdAt: new Date()
          });
        }

        // Sort orders
        orderBook.bids.sort((a, b) => b.price - a.price); // Highest first
        orderBook.asks.sort((a, b) => a.price - b.price); // Lowest first
      }
    });

    console.log('[Hybrid Liquidity] Market making orders initialized for all pairs');
  }

  async addOrder(orderData: any) {
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      status: 'open',
      filledAmount: 0,
      createdAt: new Date()
    };

    // Convert dash format to slash format for internal storage
    const internalPair = order.pair.replace('-', '/');
    const orderBook = this.orderBooks.get(internalPair);
    if (orderBook) {
      if (order.side === 'buy') {
        orderBook.bids.push(order);
        orderBook.bids.sort((a, b) => b.price - a.price);
      } else {
        orderBook.asks.push(order);
        orderBook.asks.sort((a, b) => a.price - b.price);
      }

      // Attempt immediate matching
      await this.matchOrders(internalPair);
    }

    return order;
  }

  private async matchOrders(pair: string) {
    const orderBook = this.orderBooks.get(pair);
    if (!orderBook || orderBook.bids.length === 0 || orderBook.asks.length === 0) {
      return;
    }

    const bestBid = orderBook.bids[0];
    const bestAsk = orderBook.asks[0];

    // Simple matching logic
    if (bestBid.price >= bestAsk.price && bestBid.userId !== bestAsk.userId) {
      const matchedAmount = Math.min(bestBid.amount, bestAsk.amount);
      const matchedPrice = (bestBid.price + bestAsk.price) / 2;

      console.log(`[Hybrid Liquidity] Trade matched: ${matchedAmount} ${pair} at ${matchedPrice}`);

      // Update orders
      bestBid.filledAmount += matchedAmount;
      bestAsk.filledAmount += matchedAmount;

      // Remove filled orders
      if (bestBid.filledAmount >= bestBid.amount) {
        orderBook.bids.shift();
      }
      if (bestAsk.filledAmount >= bestAsk.amount) {
        orderBook.asks.shift();
      }
    }
  }

  getOrderBook(pair: string) {
    // Convert dash format to slash format for internal storage
    const internalPair = pair.replace('-', '/');
    const orderBook = this.orderBooks.get(internalPair);
    if (!orderBook) {
      return { bids: [], asks: [] };
    }

    return {
      bids: orderBook.bids.map(order => ({
        price: order.price,
        amount: order.amount - (order.filledAmount || 0),
        total: (order.amount - (order.filledAmount || 0)) * order.price
      })).filter(order => order.amount > 0),
      asks: orderBook.asks.map(order => ({
        price: order.price,
        amount: order.amount - (order.filledAmount || 0),
        total: (order.amount - (order.filledAmount || 0)) * order.price
      })).filter(order => order.amount > 0)
    };
  }

  getStats() {
    let totalOrders = 0;
    let activePairs = 0;
    let totalVolume = 0;

    for (const [pair, orderBook] of Array.from(this.orderBooks.entries())) {
      const bids = orderBook.bids.length;
      const asks = orderBook.asks.length;
      totalOrders += bids + asks;
      
      if (bids > 0 && asks > 0) {
        activePairs++;
        
        // Calculate volume based on order book depth
        const bidVolume = orderBook.bids.reduce((sum, order) => sum + (order.amount * order.price), 0);
        const askVolume = orderBook.asks.reduce((sum, order) => sum + (order.amount * order.price), 0);
        totalVolume += bidVolume + askVolume;
      }
    }

    return {
      totalPairs: this.SUPPORTED_PAIRS.length,
      activePairs,
      totalOrders,
      totalVolume,
      averageSpread: 0.1, // 0.1% default spread
      status: 'operational'
    };
  }
  // Add automated trading methods
  private startAutomatedTrading(prices: Record<string, number>) {
    // Automated house trading to provide liquidity
    setInterval(() => {
      this.SUPPORTED_PAIRS.forEach(pair => {
        const orderBook = this.orderBooks.get(pair);
        if (!orderBook) return;

        const basePrice = prices[pair] || 100;
        const spread = basePrice * 0.001; // 0.1% spread
        
        // Randomly add/remove orders to simulate market activity
        if (Math.random() > 0.7) { // 30% chance to update
          this.updateMarketMakingOrders(pair, basePrice, spread);
        }
        
        // House trading - occasionally trade against user orders
        if (Math.random() > 0.85) { // 15% chance to execute house trade
          this.executeHouseTrade(pair, basePrice);
        }
      });
    }, 5000); // Update every 5 seconds

    console.log(`[Hybrid Liquidity] Automated house trading started for liquidity provision`);
  }

  private updateMarketMakingOrders(pair: string, basePrice: number, spread: number) {
    const orderBook = this.orderBooks.get(pair);
    if (!orderBook) return;

    // Price variation ±0.5%
    const priceVariation = (Math.random() - 0.5) * 0.01 * basePrice;
    const adjustedPrice = basePrice + priceVariation;

    // Remove some old orders (30% chance)
    if (Math.random() > 0.7) {
      orderBook.bids = orderBook.bids.filter((_, index) => Math.random() > 0.3);
      orderBook.asks = orderBook.asks.filter((_, index) => Math.random() > 0.3);
    }

    // Add new market making orders
    const bidPrice = adjustedPrice - spread;
    const askPrice = adjustedPrice + spread;
    
    orderBook.bids.push({
      id: `house_bid_${pair}_${Date.now()}`,
      price: Math.round(bidPrice * 100) / 100,
      amount: 0.1 + (Math.random() * 0.8),
      userId: 'house_trader',
      side: 'buy',
      type: 'limit',
      status: 'open',
      createdAt: new Date()
    });

    orderBook.asks.push({
      id: `house_ask_${pair}_${Date.now()}`,
      price: Math.round(askPrice * 100) / 100,
      amount: 0.1 + (Math.random() * 0.8),
      userId: 'house_trader',
      side: 'sell',
      type: 'limit',
      status: 'open',
      createdAt: new Date()
    });

    // Keep order book manageable (max 20 orders per side)
    orderBook.bids.sort((a, b) => b.price - a.price).splice(20);
    orderBook.asks.sort((a, b) => a.price - b.price).splice(20);
  }

  private executeHouseTrade(pair: string, basePrice: number) {
    const orderBook = this.orderBooks.get(pair);
    if (!orderBook) return;

    // House trading logic - provide liquidity by trading
    const tradeVolume = 0.05 + (Math.random() * 0.15); // 0.05-0.2 trade size
    const side = Math.random() > 0.5 ? 'buy' : 'sell';
    
    if (side === 'buy' && orderBook.asks.length > 0) {
      // House buys from asks (removes sell orders)
      const bestAsk = orderBook.asks[0];
      if (bestAsk.amount > tradeVolume) {
        bestAsk.amount -= tradeVolume;
      } else {
        orderBook.asks.shift(); // Remove completely filled order
      }
    } else if (side === 'sell' && orderBook.bids.length > 0) {
      // House sells to bids (removes buy orders)
      const bestBid = orderBook.bids[0];
      if (bestBid.amount > tradeVolume) {
        bestBid.amount -= tradeVolume;
      } else {
        orderBook.bids.shift(); // Remove completely filled order
      }
    }

    console.log(`[House Trading] Executed ${tradeVolume.toFixed(4)} ${pair} ${side} trade`);
  }
}

// Global instance
export const hybridLiquidityService = new HybridLiquidityService();