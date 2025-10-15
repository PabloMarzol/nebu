import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import minimalAuth from "./routes/minimal-auth";
import communicationRoutes from "./routes/communication";
import { getAPIStatus } from "./routes/api-status";

export async function registerRoutes(app: Express): Promise<Server> {
  // Minimal authentication routes - MUST BE FIRST
  app.use('/api/auth', minimalAuth);
  
  // Communication routes
  app.use('/api', communicationRoutes);
  
  console.log('[Auth] Minimal authentication routes registered');
  console.log('[Communication] Email, SMS, and AI chat routes registered');

  // Markets endpoint - Live data verified working
  app.get("/api/markets", async (req, res) => {
    try {
      const marketData = await storage.getMarketData();
      res.json(marketData);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  // Portfolio endpoint with safe error handling
  app.get("/api/portfolio", async (req, res) => {
    try {
      const demoPortfolio = {
        totalValue: 25430.50,
        change24h: 2.35,
        holdings: [
          { symbol: 'BTC', amount: 0.358, value: 24500.00, change24h: 1.85 },
          { symbol: 'ETH', amount: 2.75, value: 8925.00, change24h: 2.15 },
          { symbol: 'SOL', amount: 45.2, value: 4200.00, change24h: -0.85 }
        ]
      };
      res.json(demoPortfolio);
    } catch (error) {
      console.error("Portfolio error:", error);
      res.status(500).json({ message: "Portfolio service temporarily unavailable" });
    }
  });

  // API Status endpoint
  app.get("/api/status", getAPIStatus);

  // Trading endpoints - simplified without authentication middleware
  app.get("/api/trading/orders", async (req, res) => {
    try {
      const demoOrders = [
        { id: 1, symbol: 'BTC/USDT', type: 'limit', side: 'buy', amount: '0.1', price: '68000', status: 'open' },
        { id: 2, symbol: 'ETH/USDT', type: 'market', side: 'sell', amount: '1.0', status: 'filled' }
      ];
      res.json(demoOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // P2P Trading endpoints
  app.get("/api/p2p/orders", async (req, res) => {
    try {
      const demoP2POrders = [
        { id: 1, type: 'buy', currency: 'BTC', amount: '0.5', price: '68500', status: 'active' },
        { id: 2, type: 'sell', currency: 'ETH', amount: '2.0', price: '3420', status: 'completed' }
      ];
      res.json(demoP2POrders);
    } catch (error) {
      console.error("Error fetching P2P orders:", error);
      res.status(500).json({ message: "Failed to fetch P2P orders" });
    }
  });

  // OTC Trading endpoints
  app.get("/api/otc/deals", async (req, res) => {
    try {
      const demoOTCDeals = [
        { id: 1, asset: 'BTC', amount: '10.0', price: '68200', status: 'pending', type: 'buy' },
        { id: 2, asset: 'ETH', amount: '50.0', price: '3415', status: 'executed', type: 'sell' }
      ];
      res.json(demoOTCDeals);
    } catch (error) {
      console.error("Error fetching OTC deals:", error);
      res.status(500).json({ message: "Failed to fetch OTC deals" });
    }
  });

  // Staking endpoints
  app.get("/api/staking/positions", async (req, res) => {
    try {
      const demoStaking = [
        { id: 1, asset: 'ETH', amount: '5.0', apy: '4.5%', duration: '30 days', status: 'active' },
        { id: 2, asset: 'SOL', amount: '100.0', apy: '6.2%', duration: '90 days', status: 'active' }
      ];
      res.json(demoStaking);
    } catch (error) {
      console.error("Error fetching staking positions:", error);
      res.status(500).json({ message: "Failed to fetch staking positions" });
    }
  });

  // Copy Trading endpoints
  app.get("/api/copy-trading/masters", async (req, res) => {
    try {
      const demoMasters = [
        { id: 1, name: 'CryptoMaster Pro', followers: 1250, roi: '85.3%', winRate: '78%' },
        { id: 2, name: 'DeFi Wizard', followers: 892, roi: '67.8%', winRate: '72%' }
      ];
      res.json(demoMasters);
    } catch (error) {
      console.error("Error fetching copy trading masters:", error);
      res.status(500).json({ message: "Failed to fetch copy trading masters" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}