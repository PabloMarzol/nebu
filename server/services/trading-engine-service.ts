import { EventEmitter } from 'events';
import { storage } from '../storage';
import { balanceManagementService } from './balance-management-service';

interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  amount: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'open' | 'filled' | 'cancelled' | 'rejected';
  filled: number;
  remaining: number;
  averagePrice?: number;
  createdAt: Date;
  updatedAt: Date;
  timeInForce: 'GTC' | 'IOC' | 'FOK'; // Good Till Cancelled, Immediate or Cancel, Fill or Kill
  postOnly?: boolean;
}

interface Trade {
  id: string;
  symbol: string;
  buyOrderId: string;
  sellOrderId: string;
  buyUserId: string;
  sellUserId: string;
  price: number;
  amount: number;
  buyerFee: number;
  sellerFee: number;
  createdAt: Date;
}

interface OrderBook {
  symbol: string;
  bids: Array<{ price: number; amount: number; total: number; orders: number }>;
  asks: Array<{ price: number; amount: number; total: number; orders: number }>;
  lastUpdate: Date;
}

interface Balance {
  userId: string;
  currency: string;
  available: number;
  locked: number;
  total: number;
}

interface TradingFees {
  makerFee: number; // Fee for adding liquidity
  takerFee: number; // Fee for removing liquidity
  withdrawalFees: Record<string, number>;
}

class TradingEngineService extends EventEmitter {
  private orderBooks: Map<string, Order[]> = new Map();
  private userOrders: Map<string, Order[]> = new Map();
  private balances: Map<string, Balance[]> = new Map();
  private isRunning = false;
  
  // Trading fee structure (in percentage)
  private fees: TradingFees = {
    makerFee: 0.001, // 0.1%
    takerFee: 0.002, // 0.2%
    withdrawalFees: {
      'ETH': 0.005,
      'BTC': 0.0005,
      'USDT': 1.0,
      'USDC': 1.0,
      'DAI': 1.0,
      'LINK': 0.1,
      'UNI': 0.1
    }
  };

  // Supported trading pairs
  private supportedPairs = [
    'BTC/USDT', 'ETH/USDT', 'ETH/BTC', 'LINK/USDT', 'UNI/USDT',
    'BTC/USDC', 'ETH/USDC', 'DAI/USDT', 'LINK/ETH', 'UNI/ETH'
  ];

  constructor() {
    super();
    this.initializeOrderBooks();
    this.startEngine();
  }

  // Initialize empty order books for all trading pairs
  private initializeOrderBooks(): void {
    this.supportedPairs.forEach(symbol => {
      this.orderBooks.set(symbol, []);
    });
    console.log('[TradingEngine] Order books initialized for', this.supportedPairs.length, 'pairs');
  }

  // Start the trading engine
  startEngine(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('[TradingEngine] Trading engine started');
    
    // Process orders every 100ms for real-time matching
    setInterval(() => {
      this.processAllOrderBooks();
    }, 100);
  }

  // Stop the trading engine
  stopEngine(): void {
    this.isRunning = false;
    console.log('[TradingEngine] Trading engine stopped');
  }

  // Place a new order
  async placeOrder(orderData: {
    userId: string;
    symbol: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    amount: number;
    price?: number;
    timeInForce?: 'GTC' | 'IOC' | 'FOK';
    postOnly?: boolean;
  }): Promise<Order> {
    try {
      // Validate order
      await this.validateOrder(orderData);

      // Create order object
      const order: Order = {
        id: this.generateOrderId(),
        userId: orderData.userId,
        symbol: orderData.symbol,
        side: orderData.side,
        type: orderData.type,
        amount: orderData.amount,
        price: orderData.price,
        status: 'pending',
        filled: 0,
        remaining: orderData.amount,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeInForce: orderData.timeInForce || 'GTC',
        postOnly: orderData.postOnly || false
      };

      // Lock funds for the order
      await this.lockFundsForOrder(order);

      // Add to order book
      const orderBook = this.orderBooks.get(order.symbol) || [];
      orderBook.push(order);
      this.orderBooks.set(order.symbol, orderBook);

      // Add to user orders
      const userOrders = this.userOrders.get(order.userId) || [];
      userOrders.push(order);
      this.userOrders.set(order.userId, userOrders);

      // Set status to open
      order.status = 'open';

      // Emit order created event
      this.emit('orderCreated', order);

      // Try immediate matching for market orders or aggressive limit orders
      if (order.type === 'market' || order.timeInForce === 'IOC' || order.timeInForce === 'FOK') {
        await this.processOrderBook(order.symbol);
      }

      console.log(`[TradingEngine] Order placed: ${order.id} - ${order.side} ${order.amount} ${order.symbol}`);
      return order;

    } catch (error) {
      console.error('[TradingEngine] Error placing order:', error);
      throw error;
    }
  }

  // Cancel an order
  async cancelOrder(orderId: string, userId: string): Promise<Order> {
    try {
      // Find the order
      const userOrders = this.userOrders.get(userId) || [];
      const order = userOrders.find(o => o.id === orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'open') {
        throw new Error('Cannot cancel order in current status');
      }

      // Update order status
      order.status = 'cancelled';
      order.updatedAt = new Date();

      // Unlock remaining funds
      await this.unlockFundsForOrder(order);

      // Remove from order book
      const orderBook = this.orderBooks.get(order.symbol) || [];
      const updatedOrderBook = orderBook.filter(o => o.id !== orderId);
      this.orderBooks.set(order.symbol, updatedOrderBook);

      // Emit order cancelled event
      this.emit('orderCancelled', order);

      console.log(`[TradingEngine] Order cancelled: ${orderId}`);
      return order;

    } catch (error) {
      console.error('[TradingEngine] Error cancelling order:', error);
      throw error;
    }
  }

  // Process all order books for matching
  private async processAllOrderBooks(): Promise<void> {
    if (!this.isRunning) return;

    for (const symbol of this.supportedPairs) {
      await this.processOrderBook(symbol);
    }
  }

  // Process order book for a specific symbol
  private async processOrderBook(symbol: string): Promise<void> {
    try {
      const orders = this.orderBooks.get(symbol) || [];
      if (orders.length < 2) return;

      // Separate buy and sell orders
      const buyOrders = orders.filter(o => o.side === 'buy' && o.status === 'open')
        .sort((a, b) => (b.price || 0) - (a.price || 0)); // Highest price first

      const sellOrders = orders.filter(o => o.side === 'sell' && o.status === 'open')
        .sort((a, b) => (a.price || 0) - (b.price || 0)); // Lowest price first

      // Match orders
      await this.matchOrders(symbol, buyOrders, sellOrders);

    } catch (error) {
      console.error(`[TradingEngine] Error processing order book for ${symbol}:`, error);
    }
  }

  // Match buy and sell orders
  private async matchOrders(symbol: string, buyOrders: Order[], sellOrders: Order[]): Promise<void> {
    for (const buyOrder of buyOrders) {
      if (buyOrder.remaining <= 0) continue;

      for (const sellOrder of sellOrders) {
        if (sellOrder.remaining <= 0) continue;

        // Check if orders can match
        if (!this.canOrdersMatch(buyOrder, sellOrder)) continue;

        // Execute the trade
        await this.executeTrade(buyOrder, sellOrder);

        // If buy order is fully filled, move to next buy order
        if (buyOrder.remaining <= 0) break;
      }
    }
  }

  // Check if two orders can match
  private canOrdersMatch(buyOrder: Order, sellOrder: Order): boolean {
    // Same user cannot trade with themselves
    if (buyOrder.userId === sellOrder.userId) return false;

    // Market orders can always match
    if (buyOrder.type === 'market' || sellOrder.type === 'market') return true;

    // Limit orders match if buy price >= sell price
    return (buyOrder.price || 0) >= (sellOrder.price || 0);
  }

  // Execute a trade between two orders
  private async executeTrade(buyOrder: Order, sellOrder: Order): Promise<void> {
    try {
      // Determine trade amount (minimum of remaining amounts)
      const tradeAmount = Math.min(buyOrder.remaining, sellOrder.remaining);

      // Determine trade price (price discovery)
      const tradePrice = this.determineTradePrice(buyOrder, sellOrder);

      // Calculate fees
      const buyerFee = tradeAmount * tradePrice * this.fees.takerFee;
      const sellerFee = tradeAmount * tradePrice * this.fees.makerFee;

      // Create trade record
      const trade: Trade = {
        id: this.generateTradeId(),
        symbol: buyOrder.symbol,
        buyOrderId: buyOrder.id,
        sellOrderId: sellOrder.id,
        buyUserId: buyOrder.userId,
        sellUserId: sellOrder.userId,
        price: tradePrice,
        amount: tradeAmount,
        buyerFee,
        sellerFee,
        createdAt: new Date()
      };

      // Update order quantities
      buyOrder.filled += tradeAmount;
      buyOrder.remaining -= tradeAmount;
      buyOrder.averagePrice = this.calculateAveragePrice(buyOrder, tradePrice, tradeAmount);
      buyOrder.updatedAt = new Date();

      sellOrder.filled += tradeAmount;
      sellOrder.remaining -= tradeAmount;
      sellOrder.averagePrice = this.calculateAveragePrice(sellOrder, tradePrice, tradeAmount);
      sellOrder.updatedAt = new Date();

      // Update order status if fully filled
      if (buyOrder.remaining <= 0) buyOrder.status = 'filled';
      if (sellOrder.remaining <= 0) sellOrder.status = 'filled';

      // Execute balance updates
      await this.executeBalanceUpdates(trade);

      // Emit trade executed event
      this.emit('tradeExecuted', trade);

      console.log(`[TradingEngine] Trade executed: ${trade.amount} ${buyOrder.symbol} at ${trade.price}`);

    } catch (error) {
      console.error('[TradingEngine] Error executing trade:', error);
    }
  }

  // Determine trade price
  private determineTradePrice(buyOrder: Order, sellOrder: Order): number {
    // If either order is market order, use the limit order price
    if (buyOrder.type === 'market') return sellOrder.price || 0;
    if (sellOrder.type === 'market') return buyOrder.price || 0;

    // For limit orders, use the earlier order's price (price-time priority)
    return buyOrder.createdAt < sellOrder.createdAt 
      ? buyOrder.price || 0 
      : sellOrder.price || 0;
  }

  // Calculate average price for partially filled orders
  private calculateAveragePrice(order: Order, newPrice: number, newAmount: number): number {
    const totalFilled = order.filled;
    const previousAmount = totalFilled - newAmount;
    const previousAverage = order.averagePrice || 0;

    return (previousAverage * previousAmount + newPrice * newAmount) / totalFilled;
  }

  // Validate order before placement
  private async validateOrder(orderData: any): Promise<void> {
    // Check if symbol is supported
    if (!this.supportedPairs.includes(orderData.symbol)) {
      throw new Error('Unsupported trading pair');
    }

    // Check minimum order size
    if (orderData.amount < 0.0001) {
      throw new Error('Order amount too small');
    }

    // For now, skip balance validation since the balance management service
    // doesn't have the required methods. In production, this would check
    // if user has sufficient balance.
    console.log(`[TradingEngine] Skipping balance validation for user ${orderData.userId}`);
  }

  // Lock funds for an order
  private async lockFundsForOrder(order: Order): Promise<void> {
    const [baseCurrency, quoteCurrency] = order.symbol.split('/');
    const userId = order.userId;

    if (order.side === 'buy') {
      // Lock quote currency for buy orders
      const requiredAmount = (order.amount * (order.price || 0)).toString();
      await balanceManagementService.lockFunds(userId, quoteCurrency, requiredAmount);
    } else {
      // Lock base currency for sell orders
      const requiredAmount = order.amount.toString();
      await balanceManagementService.lockFunds(userId, baseCurrency, requiredAmount);
    }
  }

  // Unlock funds for cancelled order
  private async unlockFundsForOrder(order: Order): Promise<void> {
    const [baseCurrency, quoteCurrency] = order.symbol.split('/');
    const userId = order.userId;

    if (order.side === 'buy') {
      const remainingValue = (order.remaining * (order.price || 0)).toString();
      await balanceManagementService.unlockFunds(userId, quoteCurrency, remainingValue);
    } else {
      const remainingAmount = order.remaining.toString();
      await balanceManagementService.unlockFunds(userId, baseCurrency, remainingAmount);
    }
  }

  // Execute balance updates after trade
  private async executeBalanceUpdates(trade: Trade): Promise<void> {
    const [baseCurrency, quoteCurrency] = trade.symbol.split('/');

    // Update buyer balances
    const tradeValue = (trade.amount * trade.price).toString();
    await balanceManagementService.unlockFunds(trade.buyUserId, quoteCurrency, tradeValue);
    
    // For now, log the balance operations that would happen in production
    console.log(`[TradingEngine] Would credit ${trade.amount} ${baseCurrency} to buyer ${trade.buyUserId}`);
    console.log(`[TradingEngine] Would debit ${trade.buyerFee} ${quoteCurrency} fee from buyer ${trade.buyUserId}`);

    // Update seller balances
    const tradeAmount = trade.amount.toString();
    await balanceManagementService.unlockFunds(trade.sellUserId, baseCurrency, tradeAmount);
    
    const netAmount = (trade.amount * trade.price - trade.sellerFee).toString();
    console.log(`[TradingEngine] Would credit ${netAmount} ${quoteCurrency} to seller ${trade.sellUserId}`);
  }

  // Get user balances for display
  async getUserBalances(userId: string): Promise<any[]> {
    return await balanceManagementService.getUserBalances(userId);
  }

  // Get portfolio value
  async getUserPortfolioValue(userId: string): Promise<number> {
    return await balanceManagementService.getPortfolioValue(userId);
  }

  // Utility methods
  private generateOrderId(): string {
    return 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateTradeId(): string {
    return 'trd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Public API methods
  getOrderBook(symbol: string): OrderBook {
    const orders = this.orderBooks.get(symbol) || [];
    const openOrders = orders.filter(o => o.status === 'open');

    const bids = this.aggregateOrders(openOrders.filter(o => o.side === 'buy'), 'buy');
    const asks = this.aggregateOrders(openOrders.filter(o => o.side === 'sell'), 'sell');

    return {
      symbol,
      bids,
      asks,
      lastUpdate: new Date()
    };
  }

  private aggregateOrders(orders: Order[], side: 'buy' | 'sell'): Array<{ price: number; amount: number; total: number; orders: number }> {
    const priceMap = new Map<number, { amount: number; orders: number }>();

    orders.forEach(order => {
      const price = order.price || 0;
      const existing = priceMap.get(price) || { amount: 0, orders: 0 };
      existing.amount += order.remaining;
      existing.orders += 1;
      priceMap.set(price, existing);
    });

    const result = Array.from(priceMap.entries())
      .map(([price, data]) => ({
        price,
        amount: data.amount,
        total: price * data.amount,
        orders: data.orders
      }));

    // Sort by price
    return side === 'buy' 
      ? result.sort((a, b) => b.price - a.price) // Highest first for bids
      : result.sort((a, b) => a.price - b.price); // Lowest first for asks
  }

  getUserOrders(userId: string): Order[] {
    return this.userOrders.get(userId) || [];
  }

  getSupportedPairs(): string[] {
    return [...this.supportedPairs];
  }

  getTradingFees(): TradingFees {
    return { ...this.fees };
  }

  getEngineStatus(): { isRunning: boolean; orderBooks: number; totalOrders: number } {
    const totalOrders = Array.from(this.orderBooks.values())
      .reduce((sum, orders) => sum + orders.length, 0);

    return {
      isRunning: this.isRunning,
      orderBooks: this.orderBooks.size,
      totalOrders
    };
  }

  // Get recent trades for a symbol
  async getRecentTrades(symbol: string): Promise<any[]> {
    try {
      // Convert our symbol format to Hyperliquid format
      const hyperliquidSymbol = this.convertToHyperliquidSymbol(symbol);
      if (!hyperliquidSymbol) {
        console.warn(`[TradingEngine] Cannot convert symbol: ${symbol}`);
        return [];
      }

      // Import Hyperliquid client dynamically to avoid circular dependencies
      const { hyperliquidClient } = await import('../lib/hyperliquid-client');
      
      // Get real market trades from Hyperliquid
      const trades = await hyperliquidClient.getMarketTrades(hyperliquidSymbol, 20);
      
      if (!trades || trades.length === 0) {
        console.warn(`[TradingEngine] No trades available for ${symbol}`);
        return [];
      }

      // Convert Hyperliquid trade format to our format
      const formattedTrades = trades.map((trade: any, index: number) => ({
        id: index + 1,
        price: trade.price,
        quantity: trade.size,
        side: trade.side,
        timestamp: new Date(trade.time)
      }));

      console.log(`[TradingEngine] Retrieved ${formattedTrades.length} real trades for ${symbol}`);
      return formattedTrades;

    } catch (error) {
      console.error(`[TradingEngine] Error getting recent trades for ${symbol}:`, error);
      return [];
    }
  }

  // Convert our symbol format to Hyperliquid format
  private convertToHyperliquidSymbol(ourSymbol: string): string | null {
    const conversions: { [key: string]: string } = {
      'BTC/USDT': 'BTC',
      'ETH/USDT': 'ETH',
      'SOL/USDT': 'SOL',
      'ADA/USDT': 'ADA',
      'DOT/USDT': 'DOT',
      'LINK/USDT': 'LINK',
      'UNI/USDT': 'UNI',
      'AAVE/USDT': 'AAVE',
      'MATIC/USDT': 'MATIC'
    };
    
    return conversions[ourSymbol] || null;
  }

  
  
}

export const tradingEngineService = new TradingEngineService();
