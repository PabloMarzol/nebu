import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { marketDataService } from "./services/market-data";
import dotenv from 'dotenv';
import walletAuthRoutes from './routes/walletAuth';


import hyperliquidRoutes from './routes/hyperliquid';
console.log('✅ Hyperliquid routes imported:', typeof hyperliquidRoutes);
import { verifyWalletAuth } from './middleware/walletAuth'
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});


(async () => {


  // ===== REGISTER WALLET AUTH ROUTES FIRST =====
  
  app.use('/api/wallet-auth', walletAuthRoutes);
  console.log('[Wallet Auth] Routes registered');
  
  // 🆕 NEW: Register Hyperliquid routes
  app.use('/api/hyperliquid', hyperliquidRoutes);
  console.log('[Hyperliquid] Routes registered');
  // ==============================================
  
  
  // Basic health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  
  app.get('/api/metrics', (req, res) => {
    res.json({
      status: 'operational',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  });
  
  app.get('/api/security', (req, res) => {
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString()
    });
  });
  
  // 🆕 NOTE: 0x routes remain for Swap and P2P functionality
  app.get('/api/0x/price', async (req, res) => {
    try {
      const { sellToken, buyToken, sellAmount, taker, chainId } = req.query;
      
      if (!sellToken || !buyToken || !sellAmount) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Default to mainnet if not specified
      const chain = chainId || '1';

      const params = new URLSearchParams({
        chainId: chain as string,
        sellToken: sellToken as string,
        buyToken: buyToken as string,
        sellAmount: sellAmount as string,
      });

      if (taker) {
        params.append('taker', taker as string);
      }

      const response = await fetch(
        `https://api.0x.org/swap/permit2/price?${params}`,
        {
          headers: {
            '0x-api-key': process.env.ZERO_X_API_KEY || '',
            '0x-version': 'v2',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('0x API error:', error);
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('0x proxy error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/0x/quote', async (req, res) => {
    try {
      const { sellToken, buyToken, sellAmount, taker, chainId } = req.query;
      
      if (!sellToken || !buyToken || !sellAmount || !taker) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Default to mainnet if not specified
      const chain = chainId || '1';

      const params = new URLSearchParams({
        chainId: chain as string,
        sellToken: sellToken as string,
        buyToken: buyToken as string,
        sellAmount: sellAmount as string,
        taker: taker as string,
      });

      const response = await fetch(
        `https://api.0x.org/swap/permit2/quote?${params}`,
        {
          headers: {
            '0x-api-key': process.env.ZERO_X_API_KEY || '',
            '0x-version': 'v2',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('0x API error:', error);
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('0x proxy error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  const server = await registerRoutes(app);
  
  // Start market data service for real-time updates
  await marketDataService.startMarketDataUpdates();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on port 5000 or find available port
  // this serves both the API and the client.
  const port = process.env.PORT || 5000;
  
  const startServer = (portToTry: number) => {
    server.listen({
      port: portToTry,
      host: "0.0.0.0",
    }, () => {
      log(`serving on port ${portToTry}`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        log(`Port ${portToTry} is busy, trying port ${portToTry + 1}`);
        startServer(portToTry + 1);
      } else {
        throw err;
      }
    });
  };
  
  startServer(Number(port));
})();