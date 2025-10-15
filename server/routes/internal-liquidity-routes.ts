import type { Express } from "express";
import { internalLiquidityNetwork } from "../services/internal-liquidity-network";
import { marketMakingBots } from "../services/market-making-bots";
import { verifyWalletAuth } from "../middleware/walletAuth";

export function registerInternalLiquidityRoutes(app: Express): void {
  
  // Internal Liquidity Network Routes
  app.post("/api/internal-liquidity/order", verifyWalletAuth, async (req: any, res) => {
    try {
      const { pair, side, type, amount, price } = req.body;
      const userId = req.user?.id || 'user_' + Date.now();

      if (!pair || !side || !type || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const order = await internalLiquidityNetwork.addOrder({
        userId,
        pair,
        side,
        type,
        amount: parseFloat(amount),
        price: price ? parseFloat(price) : undefined,
        status: 'open',
        filledAmount: 0
      });

      res.json({
        success: true,
        order: {
          id: order.id,
          pair: order.pair,
          side: order.side,
          type: order.type,
          amount: order.amount,
          price: order.price,
          status: order.status,
          createdAt: order.createdAt
        }
      });
    } catch (error) {
      console.error("[ILN API] Order placement failed:", error);
      res.status(500).json({ error: "Failed to place order" });
    }
  });

  app.get("/api/internal-liquidity/orderbook/:pair", async (req, res) => {
    try {
      const { pair } = req.params;
      const orderBook = await internalLiquidityNetwork.getOrderBook(pair);
      
      res.json({
        pair,
        bids: orderBook.bids.map(order => ({
          price: order.price,
          amount: order.amount - order.filledAmount,
          total: (order.amount - order.filledAmount) * (order.price || 0)
        })),
        asks: orderBook.asks.map(order => ({
          price: order.price,
          amount: order.amount - order.filledAmount,
          total: (order.amount - order.filledAmount) * (order.price || 0)
        })),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("[ILN API] Order book retrieval failed:", error);
      res.status(500).json({ error: "Failed to get order book" });
    }
  });

  app.get("/api/internal-liquidity/stats", async (req, res) => {
    try {
      const stats = await internalLiquidityNetwork.getLiquidityStats();
      res.json(stats);
    } catch (error) {
      console.error("[ILN API] Stats retrieval failed:", error);
      res.status(500).json({ error: "Failed to get liquidity stats" });
    }
  });

  // Market Making Bot Routes
  app.get("/api/market-making/stats", async (req, res) => {
    try {
      const stats = marketMakingBots.getStats();
      res.json({
        timestamp: new Date().toISOString(),
        bots: stats
      });
    } catch (error) {
      console.error("[MM API] Stats retrieval failed:", error);
      res.status(500).json({ error: "Failed to get market making stats" });
    }
  });

  app.post("/api/market-making/config/:pair", verifyWalletAuth, async (req: any, res) => {
    try {
      const { pair } = req.params;
      const config = req.body;

      // Validate user has admin permissions (simplified for demo)
      if (req.user?.role !== 'admin' && req.user?.id !== 'market_maker_bot') {
        return res.status(403).json({ error: "Admin access required" });
      }

      const success = await marketMakingBots.updateConfig(pair, config);
      
      if (success) {
        res.json({ 
          success: true, 
          message: `Market making config updated for ${pair}` 
        });
      } else {
        res.status(404).json({ error: "Trading pair not found" });
      }
    } catch (error) {
      console.error("[MM API] Config update failed:", error);
      res.status(500).json({ error: "Failed to update config" });
    }
  });

  // Combined Dashboard Route
  app.get("/api/hybrid-liquidity/dashboard", async (req, res) => {
    try {
      const [liquidityStats, marketMakingStats] = await Promise.all([
        internalLiquidityNetwork.getLiquidityStats(),
        Promise.resolve(marketMakingBots.getStats())
      ]);

      res.json({
        timestamp: new Date().toISOString(),
        internalLiquidity: liquidityStats,
        marketMaking: {
          totalBots: marketMakingStats.length,
          activeBots: marketMakingStats.filter(bot => bot.enabled).length,
          totalOrders: marketMakingStats.reduce((sum, bot) => sum + bot.activeOrders, 0),
          pairs: marketMakingStats
        },
        status: "operational"
      });
    } catch (error) {
      console.error("[Hybrid Liquidity API] Dashboard failed:", error);
      res.status(500).json({ error: "Failed to get dashboard data" });
    }
  });

  console.log("[Routes] Internal Liquidity and Market Making routes registered");
}