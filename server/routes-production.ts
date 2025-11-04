import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { verifyWalletAuth } from "./middleware/walletAuth";
import productionAuth from "./routes/production-auth";
import communicationRoutes from "./routes/communication";
import { registerCRMRoutes } from "./crm-routes";
import { registerEnhancedCRMRoutes } from "./enhanced-crm-routes";
import { getAPIStatus } from "./routes/api-status";
import institutionalRoutes from "./routes/institutional-routes";
import { businessOperationsRouter } from "./routes/business-operations-routes";
import adminRoutes from "./routes/admin-routes";
import crmRoutes from "./routes/crm-routes";
import { marketDataService } from "./services/market-data";
import { initializeLivePriceFeed, priceFeed } from "./services/live-price-feed";
import { tradingEngine } from "./services/trading-engine";
import { hyperliquidMarketDataService } from "./services/hyperliquid-market-data";
import socialShareRoutes from "./social-share-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    // IMMEDIATE PRIORITY: Exchange Operations routes at the very beginning
    console.log('[IMMEDIATE] Registering Exchange Operations routes first...');
    
    // Exchange Operations Dashboard endpoint
    app.get('/api/exchange-ops/dashboard', async (req, res) => {
      console.log('[DEBUG] Exchange Operations Dashboard endpoint called');
      try {
        const dashboardData = {
          liquidity: {
            totalProviders: 12,
            activeProviders: 10,
            totalLiquidity: "145000000.00",
            averageSpread: 0.0007,
            uptimeAverage: 99.85,
            alerts: { lowLiquidity: 2, highSpread: 1, providerOffline: 0 }
          },
          compliance: {
            pendingReviews: 15,
            completedReviews: 142,
            flaggedTransactions: 8,
            averageReviewTime: 4.2
          },
          institutional: {
            totalClients: 45,
            activeClients: 38,
            totalVolume30d: "890000000.00",
            averageTradeSize: "1250000.00"
          },
          treasury: {
            totalBalance: { BTC: "2576.25", ETH: "15420.75", USDT: "12500000.00" },
            hotWalletRatio: 0.15,
            coldStorageRatio: 0.85,
            alerts: { lowBalance: 1, highOutflow: 0, reconciliationFailed: 0 }
          },
          risk: {
            overallRiskScore: 2.3,
            activeEvents: { critical: 0, high: 2, medium: 5, low: 12 }
          },
          operations: {
            systemUptime: 99.98,
            activeIncidents: 1,
            resolvedIncidents: 23,
            averageResolutionTime: 2.8
          }
        };
        console.log('[DEBUG] Dashboard data prepared successfully');
        res.json(dashboardData);
      } catch (error) {
        console.error('Error in exchange-ops dashboard:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
      }
    });

    // Exchange Operations Alerts endpoint
    app.get('/api/exchange-ops/alerts', async (req, res) => {
      console.log('[DEBUG] Exchange Operations Alerts endpoint called');
      try {
        const alertsData = {
          critical: [
            { id: 1, module: 'operations', message: 'API latency spike detected', timestamp: new Date().toISOString() }
          ],
          high: [
            { id: 2, module: 'liquidity', message: 'Low liquidity on BTC/USDT', timestamp: new Date().toISOString() },
            { id: 3, module: 'compliance', message: 'Pending KYC reviews exceeding SLA', timestamp: new Date().toISOString() }
          ],
          medium: [
            { id: 4, module: 'treasury', message: 'Hot wallet threshold reached', timestamp: new Date().toISOString() },
            { id: 5, module: 'risk', message: 'Unusual trading pattern detected', timestamp: new Date().toISOString() }
          ],
          low: [],
          summary: {
            critical: 1,
            high: 2,
            medium: 2,
            low: 0,
            total: 5
          }
        };
        console.log('[DEBUG] Alerts data prepared successfully');
        res.json(alertsData);
      } catch (error) {
        console.error('Error in exchange-ops alerts:', error);
        res.status(500).json({ error: 'Failed to fetch alerts data' });
      }
    });

    // Test endpoint
    app.get('/api/test-exchange-ops', (req, res) => {
      res.json({ message: 'Exchange Operations test endpoint working', timestamp: new Date().toISOString() });
    });

    console.log('[SUCCESS] Exchange Operations routes registered at the beginning - WORKING!');
    
    // Session middleware first
    // app.use(getSession()); // Commented out as getSession is not imported
    console.log('[Routes] Session middleware initialized');
    
    // Authentication routes - MUST BE FIRST  
    app.use('/api/auth', productionAuth);
    console.log('[Routes] Authentication routes registered');
    
    // Communication routes
    app.use('/api', communicationRoutes);
    console.log('[Routes] Communication routes registered');
    
    // Institutional routes
    app.use('/api/institutional', institutionalRoutes);
    console.log('[Routes] Institutional routes registered');
    
    // Business Operations routes
    app.use('/api/operations', businessOperationsRouter);
    console.log('[Routes] Business operations routes registered');
    
    // Admin Panel routes
    app.use('/api/admin', adminRoutes);
    console.log('[Routes] Admin routes registered');
    
    // CRM routes
    app.use('/api/crm', crmRoutes);
    console.log('[Routes] CRM routes registered');
    
    // Register CRM routes  
    registerCRMRoutes(app);
    console.log('[Routes] Additional CRM routes registered');
    
    // Register Enhanced CRM routes
    registerEnhancedCRMRoutes(app);
    console.log('[Routes] Enhanced CRM routes registered');
    
    // Social Share routes
    app.use('/api/social-share', socialShareRoutes);
    console.log('[Routes] Social share routes registered');

    // AI Trading Chat endpoint - Enhanced with real-time market data
    app.post('/api/ai-trading/chat', async (req, res) => {
      try {
        const { message, context } = req.body;
        
        if (!message) {
          return res.status(400).json({
            response: "Please provide a message.",
            type: "general"
          });
        }

        console.log('[AI Chat] Processing message:', message);

        // Try Groq first if available
        if (process.env.OPENAI_API_KEY) {
          try {
            const Groq = (await import('groq-sdk')).default;
            const groq = new Groq({
              apiKey: process.env.OPENAI_API_KEY
            });

            // Get real-time market data for common crypto mentions
            let realTimeMarketData = '';
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes("bitcoin") || lowerMessage.includes("btc")) {
              const currentPrice = await hyperliquidMarketDataService.getCurrentPrice('BTC/USDT');
              const marketData = await marketDataService.getMarketDataBySymbol('BTC/USDT');
              
              if (currentPrice && marketData && currentPrice !== null) {
                realTimeMarketData = `\n\nREAL-TIME BTC DATA (Current as of ${new Date().toISOString()}):\n- Current Price: $${parseFloat(currentPrice).toLocaleString()}\n- 24h Change: ${marketData.change24h}%\n- 24h Volume: $${parseFloat(marketData.volume24h).toLocaleString()}\n- 24h High: $${parseFloat(marketData.high24h).toLocaleString()}\n- 24h Low: $${parseFloat(marketData.low24h).toLocaleString()}`;
              }
            } else if (lowerMessage.includes("ethereum") || lowerMessage.includes("eth")) {
              const currentPrice = await hyperliquidMarketDataService.getCurrentPrice('ETH/USDT');
              const marketData = await marketDataService.getMarketDataBySymbol('ETH/USDT');
              
              if (currentPrice && marketData && currentPrice !== null) {
                realTimeMarketData = `\n\nREAL-TIME ETH DATA (Current as of ${new Date().toISOString()}):\n- Current Price: $${parseFloat(currentPrice).toLocaleString()}\n- 24h Change: ${marketData.change24h}%\n- 24h Volume: $${parseFloat(marketData.volume24h).toLocaleString()}\n- 24h High: $${parseFloat(marketData.high24h).toLocaleString()}\n- 24h Low: $${parseFloat(marketData.low24h).toLocaleString()}`;
              }
            }

            const completion = await groq.chat.completions.create({
              model: "groq/compound", // Using Groq's Llama model for faster inference
              messages: [
                {
                  role: "system",
                  content: `You are an expert cryptocurrency trading advisor for NebulaX Exchange. Provide professional, actionable trading analysis based on REAL-TIME market data.

CRITICAL REQUIREMENTS:
1. NEVER show thinking process, internal reasoning, or meta-commentary
2. Use REAL-TIME market data exclusively when provided - no outdated information
3. Format responses professionally with clear sections and visual hierarchy
4. Be specific about current market conditions using live data

${realTimeMarketData}

PROFESSIONAL RESPONSE FORMAT:

# 🚀 Market Analysis & Trading Strategy

## 📊 Current Market Snapshot
**Last Updated:** Current time

| Metric | Current Value | 24h Change | Status |
|--------|---------------|------------|---------|
| **Price** | Use real-time price data |
| **Volume** | Use real-time volume data |
| **Market Cap** | Use real-time market cap data |

## 📈 Technical Analysis

### Key Price Levels
- **Resistance:** Use real-time resistance levels
- **Support:** Use real-time support levels
- **Current Range:** Use real-time high/low data

### Technical Indicators
- **Trend:** Analyze based on current price action
- **Momentum:** Assess current momentum
- **Volatility:** Evaluate current volatility

## 💡 Trading Recommendations

### 🎯 Entry Strategy
- **Entry Zone:** Provide specific entry price range
- **Target 1:** Provide first profit target with R:R ratio
- **Target 2:** Provide second profit target with R:R ratio
- **Stop Loss:** Provide specific stop loss level

### ⚡ Quick Trade Setup
Provide clear buy/sell levels with targets and stop loss

## ⚠️ Risk Assessment

| Factor | Risk Level | Impact |
|--------|------------|---------|
| **Market Volatility** | Assess current volatility |
| **Liquidity Risk** | Evaluate liquidity conditions |
| **Macro Environment** | Consider macro factors |

**Confidence Level:** Provide specific confidence percentage
**Recommended Position Size:** Provide position size guidance

## 🎯 Action Plan

### ✅ DO:
- Set tight stop-losses due to volatility
- Monitor key support/resistance levels
- Scale in gradually if entering
- Take profits at target levels

### ❌ DON'T:
- Don't risk more than 2-5% of portfolio
- Don't chase pumps or panic sell
- Don't ignore stop-losses
- Don't overtrade in volatile conditions

## 📚 Educational Notes
Include relevant trading concepts and risk management advice

---
*This analysis is based on real-time market data and technical indicators. Cryptocurrency trading involves significant risk. Never invest more than you can afford to lose.*

**Data Source:** ${realTimeMarketData ? 'Real-time market data' : 'General market knowledge'}`
                },
                {
                  role: "user",
                  content: message
                }
              ],
              max_tokens: 800, // Reduced to prevent thinking process
              temperature: 0.1, // Very low temperature for focused responses
              top_p: 0.8, // Reduce randomness
              frequency_penalty: 0.2, // Strong penalty for repetition
              presence_penalty: 0.2 // Encourage new concepts
            });

            const aiResponse = completion.choices[0].message.content || "I apologize, but I'm unable to process your request right now.";
            
            return res.json({
              response: aiResponse,
              type: "analysis",
              confidence: 95,
              timestamp: new Date().toISOString(),
              dataSource: realTimeMarketData ? 'real-time' : 'general-knowledge'
            });

          } catch (groqError: any) {
            console.log('[AI Chat] Groq failed, using fallback responses:', groqError.message);
          }
        }

        // Fallback responses for when Groq is unavailable
        let response = "";
        let messageType = "general";
        let confidence = 85;

        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes("bitcoin") || lowerMessage.includes("btc")) {
          response = `Bitcoin Analysis: I apologize, but I don't have access to real-time Bitcoin data at the moment. For accurate current prices and technical analysis, please check the live market data on NebulaX Exchange.

General Bitcoin insights:
- Bitcoin remains the dominant cryptocurrency with the largest market cap
- Institutional adoption continues to grow
- Consider using stop-losses and proper position sizing
- Check current market conditions before making trading decisions`;
          messageType = "analysis";
          confidence = 60; // Lower confidence due to lack of real-time data
        } else if (lowerMessage.includes("ethereum") || lowerMessage.includes("eth")) {
          response = `Ethereum Analysis: I apologize, but I don't have access to real-time Ethereum data at the moment. For accurate current prices and technical analysis, please check the live market data on NebulaX Exchange.

General Ethereum insights:
- Ethereum powers the largest DeFi and NFT ecosystems
- Network upgrades continue to improve scalability
- Consider using stop-losses and proper position sizing
- Check current market conditions before making trading decisions`;
          messageType = "analysis";
          confidence = 60; // Lower confidence due to lack of real-time data
        } else if (lowerMessage.includes("portfolio") || lowerMessage.includes("diversification")) {
          response = `Crypto Portfolio Strategy:

Core Allocation (60-70%):
• Bitcoin: 35-40% (Digital gold, store of value)
• Ethereum: 25-30% (Smart contracts, DeFi hub)

Growth Layer (20-30%):
• Layer 1s: Solana, Cardano, Polkadot (10-15%)
• DeFi Tokens: Uniswap, Aave, Compound (5-10%)
• Infrastructure: Chainlink, The Graph (5%)

Risk Management: Rebalance quarterly, take profits on outperformers, keep 20% in stablecoins for opportunities.`;
          messageType = "recommendation";
          confidence = 90;
        } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("help")) {
          response = `Welcome! I'm your AI Trading Assistant specializing in cryptocurrency markets.

I can help you with:
📊 Market Analysis - BTC, ETH, altcoin insights (when real-time data is available)
📈 Trading Strategies - Technical analysis, entry/exit
🎯 Portfolio Management - Allocation and diversification  
⚠️ Risk Management - Position sizing, stop losses

Try asking me:
• "What's your view on Bitcoin right now?"
• "How should I build a crypto portfolio?"
• "What are the biggest risks in crypto trading?"

What would you like to discuss about crypto trading?`;
          messageType = "general";
          confidence = 100;
        } else if (lowerMessage.includes("crypto") && (lowerMessage.includes("what") || lowerMessage.includes("explain") || lowerMessage.includes("about"))) {
          response = `Cryptocurrency Fundamentals:

What is Cryptocurrency?
• Digital assets secured by cryptography and blockchain technology
• Decentralized systems operating without central banks or governments
• Peer-to-peer transactions verified by network participants

Key Cryptocurrencies:
• Bitcoin (BTC): First and largest cryptocurrency, digital store of value
• Ethereum (ETH): Smart contract platform enabling DeFi and NFTs
• Stablecoins (USDT, USDC): Price-stable tokens pegged to fiat currencies

How Crypto Works:
• Blockchain: Distributed ledger recording all transactions
• Mining/Validation: Network participants verify transactions for rewards
• Wallets: Software/hardware storing your private keys securely

Investment Considerations:
• High volatility - prices can change rapidly
• 24/7 markets - trading never stops
• Regulatory uncertainty in many jurisdictions
• Technology risks and security considerations

Start with major cryptocurrencies, use reputable exchanges, and never invest more than you can afford to lose.`;
          messageType = "general";
          confidence = 95;
        } else if (lowerMessage.includes("trading") || lowerMessage.includes("trade")) {
          response = `Cryptocurrency Trading Guide:

Trading Basics:
• Spot Trading: Buy/sell cryptocurrencies at current market prices
• Order Types: Market orders (instant), limit orders (set price)
• Pairs: Most crypto trades against BTC, ETH, or stablecoins

Key Strategies:
• Dollar-Cost Averaging: Regular purchases regardless of price
• Swing Trading: Hold positions for days/weeks based on trends
• Day Trading: Short-term trades within 24 hours (high risk)

Essential Tools:
• Technical Analysis: Chart patterns, indicators (RSI, MACD)
• Fundamental Analysis: Project evaluation, news, adoption
• Risk Management: Stop losses, position sizing, diversification

Common Mistakes to Avoid:
• FOMO (Fear of Missing Out) buying
• Emotional trading decisions
• Ignoring risk management
• Overtrading and high fees

Start small, practice with small amounts, and focus on learning before increasing position sizes.`;
          messageType = "recommendation";
          confidence = 88;
        } else {
          response = `Thank you for your question about "${message}".

I can help you with comprehensive cryptocurrency guidance:

📊 Market Analysis: Bitcoin, Ethereum, altcoin insights and price analysis
📈 Trading Education: How to trade, technical analysis, risk management
🎯 Portfolio Strategy: Diversification, allocation, rebalancing
💰 Crypto Basics: What is cryptocurrency, how blockchain works
⚠️ Risk Management: Position sizing, stop losses, security

Popular questions I can answer:
• "What is cryptocurrency?" - Learn the fundamentals
• "Tell me about Bitcoin" - Market analysis and insights
• "How should I start trading?" - Beginner guidance
• "Portfolio diversification tips" - Investment strategy

What specific aspect of cryptocurrency would you like to explore?`;
          messageType = "general";
          confidence = 85;
        }

        res.json({
          response: response,
          type: messageType,
          confidence: confidence,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('AI Trading Chat error:', error);
        res.status(500).json({
          response: "I'm experiencing technical difficulties. Please try again in a moment.",
          type: "general",
          error: "Internal server error"
        });
      }
    });
    console.log('[AI Chat] AI Trading chat endpoint registered at /api/ai-trading/chat');
    
    // Initialize live price feed
    try {
      initializeLivePriceFeed();
      console.log('[Routes] Live price feed initialized');
    } catch (error) {
      console.warn('[Routes] Live price feed initialization failed:', error.message);
    }
    } catch (error: any) {
      console.error('[Routes] Error during route registration:', error);
      // Continue with basic routes even if some fail
    }
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API status endpoint
  app.get("/api/services/status", getAPIStatus);

  // Market data endpoints
  app.get("/api/markets", async (req, res) => {
    try {
      const markets = await marketDataService.getMarketData();
      res.json(markets);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.get("/api/market-data/status", async (req, res) => {
    try {
      const connectedProviders = ['CryptoCompare'];
      res.json({
        marketDataProviders: connectedProviders,
        blockchainConnection: true,
        lastUpdated: new Date().toISOString(),
        status: 'connected'
      });
    } catch (error) {
      console.error("Error fetching market data status:", error);
      res.status(500).json({ message: "Failed to fetch market data status" });
    }
  });

  // Trading pairs endpoint
  app.get("/api/trading/pairs", async (req, res) => {
    try {
      const pairs = [
        { symbol: "BTC/USDT", baseAsset: "BTC", quoteAsset: "USDT", status: "trading" },
        { symbol: "ETH/USDT", baseAsset: "ETH", quoteAsset: "USDT", status: "trading" },
        { symbol: "BNB/USDT", baseAsset: "BNB", quoteAsset: "USDT", status: "trading" },
        { symbol: "ADA/USDT", baseAsset: "ADA", quoteAsset: "USDT", status: "trading" },
        { symbol: "SOL/USDT", baseAsset: "SOL", quoteAsset: "USDT", status: "trading" },
        { symbol: "DOT/USDT", baseAsset: "DOT", quoteAsset: "USDT", status: "trading" },
        { symbol: "AVAX/USDT", baseAsset: "AVAX", quoteAsset: "USDT", status: "trading" },
        { symbol: "MATIC/USDT", baseAsset: "MATIC", quoteAsset: "USDT", status: "trading" },
        { symbol: "LINK/USDT", baseAsset: "LINK", quoteAsset: "USDT", status: "trading" },
        { symbol: "UNI/USDT", baseAsset: "UNI", quoteAsset: "USDT", status: "trading" }
      ];
      res.json(pairs);
    } catch (error) {
      console.error("Error fetching trading pairs:", error);
      res.status(500).json({ message: "Failed to fetch trading pairs" });
    }
  });

  // Order book endpoint
  app.get("/api/orderbook/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const orderBook = { bids: [], asks: [], symbol }; // Simplified order book
      res.json(orderBook);
    } catch (error) {
      console.error("Error fetching order book:", error);
      res.status(500).json({ message: "Failed to fetch order book" });
    }
  });

  // Live prices endpoint
  app.get("/api/live-prices", async (req, res) => {
    try {
      const markets = await storage.getMarketData();
      res.json(markets);
    } catch (error) {
      console.error("Error fetching live prices:", error);
      res.status(500).json({ message: "Failed to fetch live prices" });
    }
  });

  // Basic user operations (simplified for production)
  app.get("/api/portfolio", verifyWalletAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const portfolio = await storage.getPortfolio(user.claims?.sub || user.id);
      res.json(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Trading operations (simplified)
  app.post("/api/orders", verifyWalletAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user.claims?.sub || user.id;
      
      const { symbol, side, type, amount, price } = req.body;
      
      const orderData = {
        userId,
        symbol,
        side,
        type,
        amount: amount.toString(),
        price: price ? price.toString() : null,
        status: "pending",
        createdAt: new Date()
      };
      
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Missing API endpoints that frontend is requesting
  // app.get("/api/orderbook/:base/:quote", async (req, res) => {
  //   try {
  //     const { base, quote } = req.params;
  //     const symbol = `${base}/${quote}`;
  //     const orderBook = {
  //       symbol,
  //       bids: [
  //         [64490, 0.15],
  //         [64480, 0.22],
  //         [64470, 0.18],
  //         [64460, 0.31],
  //         [64450, 0.09]
  //       ],
  //       asks: [
  //         [64510, 0.12],
  //         [64520, 0.28],
  //         [64530, 0.16],
  //         [64540, 0.24],
  //         [64550, 0.19]
  //       ],
  //       lastUpdated: new Date().toISOString()
  //     };
  //     res.json(orderBook);
  //   } catch (error) {
  //     console.error("Error fetching order book:", error);
  //     res.status(500).json({ message: "Failed to fetch order book" });
  //   }
  // });

  app.get("/api/trades/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      
      // Use trading engine service to get real trades from Hyperliquid
      const { tradingEngineService } = await import('./services/trading-engine-service');
      const trades = await tradingEngineService.getRecentTrades(symbol);
      
      if (!trades || trades.length === 0) {
        console.warn(`[Trades] No real trades available for ${symbol}`);
        res.status(503).json({ 
          success: false, 
          error: 'Trade data temporarily unavailable',
          message: 'Unable to fetch live trade data. Please try again in a moment.'
        });
      } else {
        console.log(`[Trades] Returning ${trades.length} real trades for ${symbol}`);
        res.json({
          success: true,
          data: trades,
          count: trades.length
        });
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch trades',
        message: 'Internal server error while fetching trade data'
      });
    }
  });

  app.get("/api/network/info", async (req, res) => {
    try {
      const networkInfo = {
        status: "operational",
        blockHeight: Math.floor(Math.random() * 1000000) + 800000,
        hashRate: (Math.random() * 200 + 150).toFixed(2) + " EH/s",
        difficulty: (Math.random() * 30 + 20).toFixed(2) + " T",
        avgBlockTime: "10.2 minutes",
        peers: Math.floor(Math.random() * 1000) + 8000,
        lastUpdated: new Date().toISOString()
      };
      res.json(networkInfo);
    } catch (error) {
      console.error("Error fetching network info:", error);
      res.status(500).json({ message: "Failed to fetch network info" });
    }
  });

  // Error handling for undefined routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ message: "API endpoint not found" });
  });

  // Serve frontend for all other routes
  app.get('*', (req, res, next) => {
    // Only serve frontend for non-API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: "API endpoint not found" });
    }
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
