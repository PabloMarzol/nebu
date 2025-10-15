import { storage } from "../storage";

export interface AdvancedOrder {
  id: string;
  userId: string;
  type: 'stop_loss' | 'take_profit' | 'trailing_stop' | 'iceberg' | 'twap' | 'oco';
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  status: 'pending' | 'active' | 'filled' | 'cancelled' | 'expired';
  
  // Stop Loss / Take Profit
  triggerPrice?: number;
  
  // Trailing Stop
  trailAmount?: number;
  trailPercent?: number;
  
  // Iceberg
  visibleSize?: number;
  
  // TWAP (Time-Weighted Average Price)
  duration?: number; // minutes
  intervals?: number;
  
  // OCO (One-Cancels-Other)
  stopPrice?: number;
  limitPrice?: number;
  
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export class AdvancedOrderService {
  private activeOrders: Map<string, AdvancedOrder> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startOrderMonitoring();
  }

  async createStopLossOrder(
    userId: string,
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    triggerPrice: number
  ): Promise<AdvancedOrder> {
    const order: AdvancedOrder = {
      id: this.generateOrderId(),
      userId,
      type: 'stop_loss',
      symbol,
      side,
      amount,
      triggerPrice,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.activeOrders.set(order.id, order);
    await this.saveOrderToDatabase(order);
    
    console.log(`[Advanced Orders] Stop loss order created: ${order.id}`);
    return order;
  }

  async createTrailingStopOrder(
    userId: string,
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    trailAmount?: number,
    trailPercent?: number
  ): Promise<AdvancedOrder> {
    const order: AdvancedOrder = {
      id: this.generateOrderId(),
      userId,
      type: 'trailing_stop',
      symbol,
      side,
      amount,
      trailAmount,
      trailPercent,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.activeOrders.set(order.id, order);
    await this.saveOrderToDatabase(order);
    
    console.log(`[Advanced Orders] Trailing stop order created: ${order.id}`);
    return order;
  }

  async createIcebergOrder(
    userId: string,
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    price: number,
    visibleSize: number
  ): Promise<AdvancedOrder> {
    const order: AdvancedOrder = {
      id: this.generateOrderId(),
      userId,
      type: 'iceberg',
      symbol,
      side,
      amount,
      visibleSize,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.activeOrders.set(order.id, order);
    await this.saveOrderToDatabase(order);
    
    console.log(`[Advanced Orders] Iceberg order created: ${order.id}`);
    return order;
  }

  async createTWAPOrder(
    userId: string,
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    duration: number, // minutes
    intervals: number
  ): Promise<AdvancedOrder> {
    const order: AdvancedOrder = {
      id: this.generateOrderId(),
      userId,
      type: 'twap',
      symbol,
      side,
      amount,
      duration,
      intervals,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + duration * 60 * 1000)
    };

    this.activeOrders.set(order.id, order);
    await this.saveOrderToDatabase(order);
    
    console.log(`[Advanced Orders] TWAP order created: ${order.id}`);
    this.executeTWAPOrder(order);
    return order;
  }

  async createOCOOrder(
    userId: string,
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    stopPrice: number,
    limitPrice: number
  ): Promise<AdvancedOrder> {
    const order: AdvancedOrder = {
      id: this.generateOrderId(),
      userId,
      type: 'oco',
      symbol,
      side,
      amount,
      stopPrice,
      limitPrice,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.activeOrders.set(order.id, order);
    await this.saveOrderToDatabase(order);
    
    console.log(`[Advanced Orders] OCO order created: ${order.id}`);
    return order;
  }

  private async executeTWAPOrder(order: AdvancedOrder) {
    if (!order.duration || !order.intervals || order.intervals <= 0) return;
    
    const intervalMs = (order.duration * 60 * 1000) / order.intervals;
    const amountPerInterval = order.amount / order.intervals;
    let executedIntervals = 0;

    const executeInterval = async () => {
      try {
        if (executedIntervals >= order.intervals || order.status !== 'pending') {
          order.status = 'filled';
          this.activeOrders.set(order.id, order);
          await this.updateOrderInDatabase(order);
          return;
        }

        // Execute partial order
        await this.executeMarketOrder({
          userId: order.userId,
          symbol: order.symbol,
          side: order.side,
          amount: amountPerInterval,
          type: 'market'
        });

        executedIntervals++;
        console.log(`[TWAP] Executed interval ${executedIntervals}/${order.intervals} for order ${order.id}`);

        if (executedIntervals < order.intervals) {
          setTimeout(executeInterval, intervalMs);
        } else {
          order.status = 'filled';
          this.activeOrders.set(order.id, order);
          await this.updateOrderInDatabase(order);
        }
      } catch (error) {
        console.error(`[TWAP] Error executing interval for order ${order.id}:`, error);
        order.status = 'cancelled';
        this.activeOrders.set(order.id, order);
        await this.updateOrderInDatabase(order);
      }
    };

    order.status = 'active';
    this.activeOrders.set(order.id, order);
    await this.updateOrderInDatabase(order);
    
    setTimeout(executeInterval, intervalMs);
  }

  private startOrderMonitoring() {
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.checkTriggeredOrders();
      } catch (error) {
        console.error('[Advanced Orders] Monitoring error:', error);
      }
    }, 5000); // Check every 5 seconds

    console.log('[Advanced Orders] Order monitoring started');
  }

  private async checkTriggeredOrders() {
    const marketData = await storage.getMarketData();
    
    for (const [orderId, order] of Array.from(this.activeOrders.entries())) {
      if (order.status !== 'pending' && order.status !== 'active') continue;
      
      const currentPrice = this.getCurrentPrice(order.symbol, marketData);
      if (!currentPrice) continue;

      try {
        switch (order.type) {
          case 'stop_loss':
            await this.checkStopLossOrder(order, currentPrice);
            break;
          case 'trailing_stop':
            await this.checkTrailingStopOrder(order, currentPrice);
            break;
          case 'take_profit':
            await this.checkTakeProfitOrder(order, currentPrice);
            break;
          case 'oco':
            await this.checkOCOOrder(order, currentPrice);
            break;
        }
      } catch (error) {
        console.error(`[Advanced Orders] Error checking order ${orderId}:`, error);
      }
    }
  }

  private async checkStopLossOrder(order: AdvancedOrder, currentPrice: number) {
    if (!order.triggerPrice) return;

    const shouldTrigger = order.side === 'sell' 
      ? currentPrice <= order.triggerPrice
      : currentPrice >= order.triggerPrice;

    if (shouldTrigger) {
      await this.triggerOrder(order, currentPrice);
    }
  }

  private async checkTrailingStopOrder(order: AdvancedOrder, currentPrice: number) {
    // Update trailing stop price based on favorable price movement
    let updatedTrigger = false;
    
    if (order.trailPercent) {
      const trailDistance = currentPrice * (order.trailPercent / 100);
      const newTriggerPrice = order.side === 'sell' 
        ? currentPrice - trailDistance
        : currentPrice + trailDistance;
      
      if (!order.triggerPrice || 
          (order.side === 'sell' && newTriggerPrice > order.triggerPrice) ||
          (order.side === 'buy' && newTriggerPrice < order.triggerPrice)) {
        order.triggerPrice = newTriggerPrice;
        updatedTrigger = true;
      }
    }

    if (updatedTrigger) {
      this.activeOrders.set(order.id, order);
      await this.updateOrderInDatabase(order);
    }

    // Check if should trigger
    await this.checkStopLossOrder(order, currentPrice);
  }

  private async checkTakeProfitOrder(order: AdvancedOrder, currentPrice: number) {
    if (!order.triggerPrice) return;

    const shouldTrigger = order.side === 'sell' 
      ? currentPrice >= order.triggerPrice
      : currentPrice <= order.triggerPrice;

    if (shouldTrigger) {
      await this.triggerOrder(order, currentPrice);
    }
  }

  private async checkOCOOrder(order: AdvancedOrder, currentPrice: number) {
    if (!order.stopPrice || !order.limitPrice) return;

    const stopTriggered = order.side === 'sell'
      ? currentPrice <= order.stopPrice
      : currentPrice >= order.stopPrice;

    const limitTriggered = order.side === 'sell'
      ? currentPrice >= order.limitPrice
      : currentPrice <= order.limitPrice;

    if (stopTriggered || limitTriggered) {
      await this.triggerOrder(order, currentPrice);
    }
  }

  private async triggerOrder(order: AdvancedOrder, triggerPrice: number) {
    try {
      console.log(`[Advanced Orders] Triggering order ${order.id} at price ${triggerPrice}`);
      
      await this.executeMarketOrder({
        userId: order.userId,
        symbol: order.symbol,
        side: order.side,
        amount: order.amount,
        type: 'market'
      });

      order.status = 'filled';
      order.updatedAt = new Date();
      this.activeOrders.set(order.id, order);
      await this.updateOrderInDatabase(order);
      
      console.log(`[Advanced Orders] Order ${order.id} successfully filled`);
    } catch (error) {
      console.error(`[Advanced Orders] Error triggering order ${order.id}:`, error);
      order.status = 'cancelled';
      this.activeOrders.set(order.id, order);
      await this.updateOrderInDatabase(order);
    }
  }

  private async executeMarketOrder(orderData: any) {
    // Execute the actual market order through the trading engine
    try {
      const result = await storage.createOrder({
        ...orderData,
        status: 'filled',
        id: this.generateOrderId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`[Advanced Orders] Market order executed:`, result.id);
      return result;
    } catch (error) {
      console.error('[Advanced Orders] Market order execution failed:', error);
      throw error;
    }
  }

  private getCurrentPrice(symbol: string, marketData: any[]): number | null {
    const market = marketData.find(m => m.symbol === symbol);
    return market ? parseFloat(market.price) : null;
  }

  private generateOrderId(): string {
    return 'adv-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private async saveOrderToDatabase(order: AdvancedOrder) {
    try {
      // Mock implementation for now
      console.log(`[Advanced Orders] Saved order to database:`, order.id);
    } catch (error) {
      console.error('Error saving advanced order:', error);
    }
  }

  private async updateOrderInDatabase(order: AdvancedOrder) {
    try {
      // Mock implementation for now
      console.log(`[Advanced Orders] Updated order in database:`, order.id);
    } catch (error) {
      console.error('Error updating advanced order:', error);
    }
  }

  async getUserOrders(userId: string): Promise<AdvancedOrder[]> {
    try {
      return Array.from(this.activeOrders.values()).filter(order => order.userId === userId);
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  async cancelOrder(orderId: string, userId: string): Promise<boolean> {
    try {
      const order = this.activeOrders.get(orderId);
      if (!order || order.userId !== userId) {
        return false;
      }

      order.status = 'cancelled';
      order.updatedAt = new Date();
      this.activeOrders.set(orderId, order);
      await this.updateOrderInDatabase(order);
      
      console.log(`[Advanced Orders] Order ${orderId} cancelled`);
      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return false;
    }
  }

  destroy() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

export const advancedOrderService = new AdvancedOrderService();