import { storage } from "../storage";
import { insertOrderSchema, type Order, type Trade } from "@shared/schema";
import { z } from "zod";

export class TradingEngine {
  private isProcessing = false;
  private orderQueue: Array<{ symbol: string; timestamp: number }> = [];

  // Alias for backwards compatibility
  async addOrder(orderData: z.infer<typeof insertOrderSchema>): Promise<Order> {
    return this.placeOrder(orderData);
  }

  async placeOrder(orderData: z.infer<typeof insertOrderSchema>): Promise<Order> {
    // Validate order
    const validatedOrder = insertOrderSchema.parse(orderData);
    
    // Check user balance for buy orders
    if (validatedOrder.side === "buy") {
      await this.validateBuyOrderBalance(validatedOrder);
    } else {
      await this.validateSellOrderBalance(validatedOrder);
    }

    // Lock user funds
    await this.lockOrderFunds(validatedOrder);

    // Create order
    const order = await storage.createOrder(validatedOrder);

    // Queue for matching
    this.queueOrderMatching(validatedOrder.symbol);

    return order;
  }

  private async validateBuyOrderBalance(order: z.infer<typeof insertOrderSchema>) {
    const quoteSymbol = order.symbol.split("/")[1];
    const requiredAmount = parseFloat(order.amount) * parseFloat(order.price || "0");
    
    const portfolio = await storage.getPortfolioBySymbol(order.userId, quoteSymbol);
    const availableBalance = parseFloat(portfolio?.balance || "0");
    
    if (availableBalance < requiredAmount) {
      throw new Error("Insufficient balance for buy order");
    }
  }

  private async validateSellOrderBalance(order: z.infer<typeof insertOrderSchema>) {
    const baseSymbol = order.symbol.split("/")[0];
    const requiredAmount = parseFloat(order.amount);
    
    const portfolio = await storage.getPortfolioBySymbol(order.userId, baseSymbol);
    const availableBalance = parseFloat(portfolio?.balance || "0");
    
    if (availableBalance < requiredAmount) {
      throw new Error("Insufficient balance for sell order");
    }
  }

  private async lockOrderFunds(order: z.infer<typeof insertOrderSchema>) {
    if (order.side === "buy") {
      const quoteSymbol = order.symbol.split("/")[1];
      const lockAmount = (parseFloat(order.amount) * parseFloat(order.price || "0")).toString();
      await storage.lockBalance(order.userId, quoteSymbol, lockAmount);
    } else {
      const baseSymbol = order.symbol.split("/")[0];
      await storage.lockBalance(order.userId, baseSymbol, order.amount);
    }
  }

  private queueOrderMatching(symbol: string) {
    this.orderQueue.push({ symbol, timestamp: Date.now() });
    this.processOrderQueue();
  }

  private async processOrderQueue() {
    if (this.isProcessing || this.orderQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      const symbolsToProcess = [...new Set(this.orderQueue.map(item => item.symbol))];
      this.orderQueue = [];
      
      for (const symbol of symbolsToProcess) {
        await this.matchOrders(symbol);
      }
    } finally {
      this.isProcessing = false;
      
      // Process any new orders that came in
      if (this.orderQueue.length > 0) {
        setTimeout(() => this.processOrderQueue(), 100);
      }
    }
  }

  private async matchOrders(symbol: string) {
    const buyOrders = await storage.getOpenOrders(symbol);
    const sellOrders = buyOrders.filter(o => o.side === "sell");
    const buyOrdersFiltered = buyOrders.filter(o => o.side === "buy");

    // Sort buy orders by price (highest first), sell orders by price (lowest first)
    buyOrdersFiltered.sort((a, b) => parseFloat(b.price || "0") - parseFloat(a.price || "0"));
    sellOrders.sort((a, b) => parseFloat(a.price || "0") - parseFloat(b.price || "0"));

    for (const buyOrder of buyOrdersFiltered) {
      for (const sellOrder of sellOrders) {
        if (buyOrder.userId === sellOrder.userId) continue; // Can't trade with yourself
        
        const buyPrice = parseFloat(buyOrder.price || "0");
        const sellPrice = parseFloat(sellOrder.price || "0");
        
        if (buyPrice >= sellPrice) {
          await this.executeTrade(buyOrder, sellOrder, symbol);
          break; // Move to next buy order
        }
      }
    }
  }

  private async executeTrade(buyOrder: Order, sellOrder: Order, symbol: string) {
    const tradeAmount = Math.min(parseFloat(buyOrder.amount), parseFloat(sellOrder.amount));
    const tradePrice = sellOrder.price || buyOrder.price || "0";
    const tradePriceNum = parseFloat(tradePrice);

    // Create trade record
    await storage.createTrade(buyOrder.id, sellOrder.id, symbol, tradeAmount.toString(), tradePrice);

    // Update order statuses
    if (tradeAmount === parseFloat(buyOrder.amount)) {
      await storage.updateOrderStatus(buyOrder.id, "filled");
    }

    if (tradeAmount === parseFloat(sellOrder.amount)) {
      await storage.updateOrderStatus(sellOrder.id, "filled");
    }

    // Update user portfolios
    const [baseSymbol, quoteSymbol] = symbol.split("/");
    
    // Buyer gets base currency, seller gets quote currency
    await this.updateTradeBalances(
      buyOrder.userId,
      sellOrder.userId,
      baseSymbol,
      quoteSymbol,
      tradeAmount,
      tradePriceNum
    );

    // Unlock remaining funds for partial fills
    await this.unlockPartialFunds(buyOrder, sellOrder, tradeAmount, tradePriceNum);
  }

  private async updateTradeBalances(
    buyerUserId: string,
    sellerUserId: string,
    baseSymbol: string,
    quoteSymbol: string,
    tradeAmount: number,
    tradePrice: number
  ) {
    const totalValue = tradeAmount * tradePrice;

    // Update buyer portfolio (gets base currency)
    const buyerBase = await storage.getPortfolioBySymbol(buyerUserId, baseSymbol);
    const newBuyerBaseBalance = (parseFloat(buyerBase?.balance || "0") + tradeAmount).toString();
    await storage.updatePortfolio(buyerUserId, baseSymbol, newBuyerBaseBalance);

    // Update seller portfolio (gets quote currency)
    const sellerQuote = await storage.getPortfolioBySymbol(sellerUserId, quoteSymbol);
    const newSellerQuoteBalance = (parseFloat(sellerQuote?.balance || "0") + totalValue).toString();
    await storage.updatePortfolio(sellerUserId, quoteSymbol, newSellerQuoteBalance);
  }

  private async unlockPartialFunds(
    buyOrder: Order,
    sellOrder: Order,
    tradeAmount: number,
    tradePrice: number
  ) {
    const [baseSymbol, quoteSymbol] = buyOrder.symbol.split("/");

    // Unlock unused funds for buy order
    if (tradeAmount < parseFloat(buyOrder.amount)) {
      const unusedQuoteAmount = (parseFloat(buyOrder.amount) - tradeAmount) * tradePrice;
      await storage.unlockBalance(buyOrder.userId, quoteSymbol, unusedQuoteAmount.toString());
    }

    // Unlock unused funds for sell order
    if (tradeAmount < parseFloat(sellOrder.amount)) {
      const unusedBaseAmount = parseFloat(sellOrder.amount) - tradeAmount;
      await storage.unlockBalance(sellOrder.userId, baseSymbol, unusedBaseAmount.toString());
    }
  }

  async cancelOrder(orderId: number, userId: string): Promise<Order> {
    const order = await storage.updateOrderStatus(orderId, "cancelled");
    
    // Unlock funds
    if (order.side === "buy") {
      const quoteSymbol = order.symbol.split("/")[1];
      const lockedAmount = (parseFloat(order.amount) * parseFloat(order.price || "0")).toString();
      await storage.unlockBalance(order.userId, quoteSymbol, lockedAmount);
    } else {
      const baseSymbol = order.symbol.split("/")[0];
      await storage.unlockBalance(order.userId, baseSymbol, order.amount);
    }

    return order;
  }
}

export const tradingEngine = new TradingEngine();