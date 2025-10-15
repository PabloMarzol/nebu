import { db } from "../db";
import { orders, trades, portfolios, marketData } from "@shared/schema";
import { eq, and, or, desc, asc, gte, lte } from "drizzle-orm";
import { tradingEngine } from "./trading-engine";

interface AdvancedOrder {
  userId: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit' | 'oco' | 'trailing_stop';
  side: 'buy' | 'sell';
  amount: string;
  price?: string;
  stopPrice?: string;
  trailingAmount?: string;
  timeInForce?: 'GTC' | 'IOC' | 'FOK' | 'DAY';
  ocoType?: 'stop_limit' | 'limit_stop';
  linkedOrderId?: string;
}

interface OrderExecution {
  orderId: string;
  status: 'filled' | 'partially_filled' | 'cancelled' | 'rejected';
  executedAmount?: string;
  averagePrice?: string;
  reason?: string;
}

export class AdvancedTradingEngine {
  private stopOrders = new Map<string, any>();
  private trailingStops = new Map<string, any>();
  private ocoOrders = new Map<string, Set<string>>();

  // Enhanced order placement with advanced types
  async placeAdvancedOrder(orderRequest: AdvancedOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const { userId, symbol, type, side, amount, timeInForce = 'GTC' } = orderRequest;

    try {
      // Validate user balance first
      const hasBalance = await this.validateBalance(userId, symbol, side, amount, orderRequest.price);
      if (!hasBalance) {
        return { success: false, error: "Insufficient balance" };
      }

      const orderId = `adv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Handle different order types
      switch (type) {
        case 'market':
          return await this.executeMarketOrder(orderId, orderRequest);
        
        case 'limit':
          return await this.placeLimitOrder(orderId, orderRequest);
        
        case 'stop':
          return await this.placeStopOrder(orderId, orderRequest);
        
        case 'stop_limit':
          return await this.placeStopLimitOrder(orderId, orderRequest);
        
        case 'oco':
          return await this.placeOCOOrder(orderId, orderRequest);
        
        case 'trailing_stop':
          return await this.placeTrailingStopOrder(orderId, orderRequest);
        
        default:
          return { success: false, error: "Unsupported order type" };
      }
    } catch (error) {
      return { success: false, error: "Failed to place order" };
    }
  }

  // Immediate-or-Cancel (IOC) execution
  private async executeIOC(orderId: string, orderRequest: AdvancedOrder): Promise<OrderExecution> {
    const execution = await this.tryImmediateExecution(orderId, orderRequest);
    
    if (execution.status === 'partially_filled' || execution.status === 'filled') {
      return execution;
    }
    
    // Cancel if not filled immediately
    await this.cancelOrder(orderId);
    return { orderId, status: 'cancelled', reason: 'IOC not filled immediately' };
  }

  // Fill-or-Kill (FOK) execution
  private async executeFOK(orderId: string, orderRequest: AdvancedOrder): Promise<OrderExecution> {
    const canFillCompletely = await this.checkCompleteExecutionPossible(orderRequest);
    
    if (!canFillCompletely) {
      return { orderId, status: 'cancelled', reason: 'FOK cannot be filled completely' };
    }
    
    return await this.tryImmediateExecution(orderId, orderRequest);
  }

  // Stop order implementation
  private async placeStopOrder(orderId: string, orderRequest: AdvancedOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const { stopPrice, symbol } = orderRequest;
    
    if (!stopPrice) {
      return { success: false, error: "Stop price required for stop orders" };
    }

    // Store order in database as pending
    await db.insert(orders).values({
      id: orderId,
      userId: orderRequest.userId,
      symbol: orderRequest.symbol,
      type: 'stop',
      side: orderRequest.side,
      amount: orderRequest.amount,
      price: stopPrice,
      status: 'pending',
      createdAt: new Date()
    });

    // Add to stop orders monitoring
    this.stopOrders.set(orderId, {
      ...orderRequest,
      orderId,
      triggerPrice: stopPrice,
      isTriggered: false
    });

    return { success: true, orderId };
  }

  // Stop-Limit order implementation
  private async placeStopLimitOrder(orderId: string, orderRequest: AdvancedOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const { stopPrice, price } = orderRequest;
    
    if (!stopPrice || !price) {
      return { success: false, error: "Both stop price and limit price required" };
    }

    await db.insert(orders).values({
      id: orderId,
      userId: orderRequest.userId,
      symbol: orderRequest.symbol,
      type: 'stop_limit',
      side: orderRequest.side,
      amount: orderRequest.amount,
      price: price,
      stopPrice: stopPrice,
      status: 'pending',
      createdAt: new Date()
    });

    this.stopOrders.set(orderId, {
      ...orderRequest,
      orderId,
      triggerPrice: stopPrice,
      limitPrice: price,
      isTriggered: false
    });

    return { success: true, orderId };
  }

  // One-Cancels-Other (OCO) order implementation
  private async placeOCOOrder(orderId: string, orderRequest: AdvancedOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const { stopPrice, price } = orderRequest;
    
    if (!stopPrice || !price) {
      return { success: false, error: "OCO requires both stop and limit prices" };
    }

    // Create two linked orders
    const limitOrderId = `${orderId}_limit`;
    const stopOrderId = `${orderId}_stop`;

    // Place limit order
    await db.insert(orders).values({
      id: limitOrderId,
      userId: orderRequest.userId,
      symbol: orderRequest.symbol,
      type: 'limit',
      side: orderRequest.side,
      amount: orderRequest.amount,
      price: price,
      status: 'open',
      linkedOrderId: stopOrderId,
      createdAt: new Date()
    });

    // Place stop order
    await db.insert(orders).values({
      id: stopOrderId,
      userId: orderRequest.userId,
      symbol: orderRequest.symbol,
      type: 'stop',
      side: orderRequest.side,
      amount: orderRequest.amount,
      price: stopPrice,
      status: 'pending',
      linkedOrderId: limitOrderId,
      createdAt: new Date()
    });

    // Link orders in OCO map
    this.ocoOrders.set(limitOrderId, new Set([stopOrderId]));
    this.ocoOrders.set(stopOrderId, new Set([limitOrderId]));

    return { success: true, orderId };
  }

  // Trailing stop order implementation
  private async placeTrailingStopOrder(orderId: string, orderRequest: AdvancedOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const { trailingAmount, symbol, side } = orderRequest;
    
    if (!trailingAmount) {
      return { success: false, error: "Trailing amount required" };
    }

    // Get current market price
    const [currentMarket] = await db.select()
      .from(marketData)
      .where(eq(marketData.symbol, symbol));

    if (!currentMarket) {
      return { success: false, error: "Market data not available" };
    }

    const currentPrice = parseFloat(currentMarket.price);
    const trailing = parseFloat(trailingAmount);
    
    // Calculate initial stop price
    const initialStopPrice = side === 'sell' 
      ? (currentPrice - trailing).toString()
      : (currentPrice + trailing).toString();

    await db.insert(orders).values({
      id: orderId,
      userId: orderRequest.userId,
      symbol: orderRequest.symbol,
      type: 'trailing_stop',
      side: orderRequest.side,
      amount: orderRequest.amount,
      price: initialStopPrice,
      status: 'pending',
      createdAt: new Date()
    });

    this.trailingStops.set(orderId, {
      ...orderRequest,
      orderId,
      currentStopPrice: initialStopPrice,
      trailingAmount: trailing,
      highWaterMark: currentPrice,
      lowWaterMark: currentPrice
    });

    return { success: true, orderId };
  }

  // Monitor and trigger stop orders
  async monitorStopOrders(): Promise<void> {
    for (const [orderId, stopOrder] of this.stopOrders) {
      if (stopOrder.isTriggered) continue;

      const [currentMarket] = await db.select()
        .from(marketData)
        .where(eq(marketData.symbol, stopOrder.symbol));

      if (!currentMarket) continue;

      const currentPrice = parseFloat(currentMarket.price);
      const triggerPrice = parseFloat(stopOrder.triggerPrice);

      let shouldTrigger = false;

      if (stopOrder.side === 'sell' && currentPrice <= triggerPrice) {
        shouldTrigger = true;
      } else if (stopOrder.side === 'buy' && currentPrice >= triggerPrice) {
        shouldTrigger = true;
      }

      if (shouldTrigger) {
        await this.triggerStopOrder(orderId, stopOrder);
      }
    }
  }

  // Trigger stop order execution
  private async triggerStopOrder(orderId: string, stopOrder: any): Promise<void> {
    stopOrder.isTriggered = true;

    // Cancel linked OCO orders if any
    if (this.ocoOrders.has(orderId)) {
      const linkedOrders = this.ocoOrders.get(orderId);
      if (linkedOrders) {
        for (const linkedOrderId of linkedOrders) {
          await this.cancelOrder(linkedOrderId);
        }
      }
    }

    // Convert to market order and execute
    if (stopOrder.type === 'stop') {
      await tradingEngine.placeOrder({
        userId: stopOrder.userId,
        symbol: stopOrder.symbol,
        type: 'market',
        side: stopOrder.side,
        amount: stopOrder.amount
      });
    } else if (stopOrder.type === 'stop_limit') {
      await tradingEngine.placeOrder({
        userId: stopOrder.userId,
        symbol: stopOrder.symbol,
        type: 'limit',
        side: stopOrder.side,
        amount: stopOrder.amount,
        price: stopOrder.limitPrice
      });
    }

    // Update order status
    await db.update(orders)
      .set({ status: 'triggered' })
      .where(eq(orders.id, orderId));
  }

  // Update trailing stops
  async updateTrailingStops(): Promise<void> {
    for (const [orderId, trailingStop] of this.trailingStops) {
      const [currentMarket] = await db.select()
        .from(marketData)
        .where(eq(marketData.symbol, trailingStop.symbol));

      if (!currentMarket) continue;

      const currentPrice = parseFloat(currentMarket.price);
      const { side, trailingAmount, highWaterMark, lowWaterMark } = trailingStop;

      if (side === 'sell') {
        // For sell orders, update stop price when price moves up
        if (currentPrice > highWaterMark) {
          trailingStop.highWaterMark = currentPrice;
          trailingStop.currentStopPrice = (currentPrice - trailingAmount).toString();
        }
        
        // Trigger if price falls below current stop
        if (currentPrice <= parseFloat(trailingStop.currentStopPrice)) {
          await this.triggerStopOrder(orderId, trailingStop);
        }
      } else {
        // For buy orders, update stop price when price moves down
        if (currentPrice < lowWaterMark) {
          trailingStop.lowWaterMark = currentPrice;
          trailingStop.currentStopPrice = (currentPrice + trailingAmount).toString();
        }
        
        // Trigger if price rises above current stop
        if (currentPrice >= parseFloat(trailingStop.currentStopPrice)) {
          await this.triggerStopOrder(orderId, trailingStop);
        }
      }
    }
  }

  // Helper methods
  private async validateBalance(userId: string, symbol: string, side: string, amount: string, price?: string): Promise<boolean> {
    const [base, quote] = symbol.split('/');
    const currency = side === 'buy' ? quote : base;
    const requiredAmount = side === 'buy' && price ? 
      (parseFloat(amount) * parseFloat(price)).toString() : 
      amount;

    const [portfolio] = await db.select()
      .from(portfolios)
      .where(and(
        eq(portfolios.userId, userId),
        eq(portfolios.currency, currency)
      ));

    return portfolio && parseFloat(portfolio.availableBalance) >= parseFloat(requiredAmount);
  }

  private async cancelOrder(orderId: string): Promise<void> {
    await db.update(orders)
      .set({ status: 'cancelled' })
      .where(eq(orders.id, orderId));

    // Remove from monitoring maps
    this.stopOrders.delete(orderId);
    this.trailingStops.delete(orderId);
    this.ocoOrders.delete(orderId);
  }

  private async tryImmediateExecution(orderId: string, orderRequest: AdvancedOrder): Promise<OrderExecution> {
    // Simplified immediate execution logic
    return { orderId, status: 'filled', executedAmount: orderRequest.amount };
  }

  private async checkCompleteExecutionPossible(orderRequest: AdvancedOrder): Promise<boolean> {
    // Simplified check - in production, check actual order book depth
    return true;
  }

  private async executeMarketOrder(orderId: string, orderRequest: AdvancedOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const result = await tradingEngine.placeOrder({
      userId: orderRequest.userId,
      symbol: orderRequest.symbol,
      type: 'market',
      side: orderRequest.side,
      amount: orderRequest.amount
    });

    return result;
  }

  private async placeLimitOrder(orderId: string, orderRequest: AdvancedOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
    const result = await tradingEngine.placeOrder({
      userId: orderRequest.userId,
      symbol: orderRequest.symbol,
      type: 'limit',
      side: orderRequest.side,
      amount: orderRequest.amount,
      price: orderRequest.price!
    });

    return result;
  }

  // Start monitoring services
  startMonitoring(): void {
    // Monitor stop orders every 5 seconds
    setInterval(() => {
      this.monitorStopOrders();
    }, 5000);

    // Update trailing stops every 2 seconds
    setInterval(() => {
      this.updateTrailingStops();
    }, 2000);
  }
}

export const advancedTradingEngine = new AdvancedTradingEngine();