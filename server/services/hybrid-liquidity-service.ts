// Cleaned Hybrid Liquidity Service - Removed fake implementations
export class HybridLiquidityService {
  private orderBooks: Map<string, { bids: any[], asks: any[] }> = new Map();
  
  private readonly SUPPORTED_PAIRS = [
    'BTC/USDT', 'ETH/USDT', 'ETH/BTC', 'SOL/USDT', 'ADA/USDT', 
    'DOT/USDT', 'LINK/USDT', 'UNI/USDT', 'AAVE/USDT', 'MATIC/USDT'
  ];

  constructor() {
    this.initializeOrderBooks();
    console.log(`[Hybrid Liquidity] Service initialized for ${this.SUPPORTED_PAIRS.length} pairs`);
  }

  private initializeOrderBooks() {
    this.SUPPORTED_PAIRS.forEach(pair => {
      this.orderBooks.set(pair, { bids: [], asks: [] });
    });
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
}

// Global instance
export const hybridLiquidityService = new HybridLiquidityService();
