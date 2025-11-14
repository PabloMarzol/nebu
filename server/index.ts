import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { marketDataService } from "./services/market-data";
import dotenv from 'dotenv';
import walletAuthRoutes from './routes/walletAuth';
import { ethers } from 'ethers';
dotenv.config()

import hyperliquidRoutes from './routes/hyperliquid';
console.log('✅ Hyperliquid routes imported:', typeof hyperliquidRoutes);
import fxSwapRoutes from './routes/fx_swap_routes';
console.log('✅ FX Swap routes imported:', typeof fxSwapRoutes);
import alt5CustodialRoutes from './routes/alt5-custodial-routes';
console.log('✅ ALT5 Custodial routes imported:', typeof alt5CustodialRoutes);
import alt5TradingRoutes from './routes/alt5-trading-routes';
console.log('✅ ALT5 Trading routes imported:', typeof alt5TradingRoutes);
import { setupHyperliquidWebSocketCandleRoutes } from './routes/hyperliquid-ws-candles';
console.log('✅ Hyperliquid WebSocket candle routes imported');
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
  
  // 🆕 NEW: Register Hyperliquid WebSocket candle routes
  setupHyperliquidWebSocketCandleRoutes(app);
  console.log('[Hyperliquid WebSocket] Candle routes registered');
  
  // 🆕 NEW: Register FX Swap routes
  app.use('/api/fx-swap', fxSwapRoutes);
  console.log('[FX Swap] Routes registered');
  
  // 🆕 NEW: Register ALT5 Trading routes
  app.use('/api/alt5-trading', alt5TradingRoutes);
  console.log('[ALT5 Trading] Routes registered');
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

      // Validate required parameters
      if (!sellToken || !buyToken || !sellAmount) {
        return res.status(400).json({
          error: 'Missing required parameters: sellToken, buyToken, sellAmount are required'
        });
      }

      // Validate parameter types
      if (typeof sellToken !== 'string' || typeof buyToken !== 'string' || typeof sellAmount !== 'string') {
        return res.status(400).json({
          error: 'Invalid parameter types: sellToken, buyToken, sellAmount must be strings'
        });
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

      console.log('🔍 0x PRICE REQUEST:', {
        sellToken,
        buyToken,
        sellAmount,
        taker,
        chainId: chain
      });

      const response = await fetch(
        `https://api.0x.org/swap/permit2/price?${params}`,
        {
          headers: {
            '0x-api-key': process.env.ZERO_X_API_KEY || '',
            '0x-version': 'v2',
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        }
      );

      console.log('🔍 0x PRICE RESPONSE STATUS:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('0x API error:', error);
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      console.log('🔍 0x PRICE RESPONSE DATA:', JSON.stringify(data, null, 2));

      res.json(data);
    } catch (error: any) {
      console.error('0x proxy error:', error);
      res.status(500).json({
        error: error.message || 'Internal server error',
        code: 'PROXY_ERROR'
      });
    }
  });
  
  // Gasless quote endpoint (for tokens that support gasless swaps)
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

      const requestUrl = `https://api.0x.org/gasless/quote?${params}`;
      console.log('🌟 0x GASLESS Quote Request:', {
        sellToken,
        buyToken,
        sellAmount,
        taker,
        chainId: chain
      });

      // Use gasless API endpoint
      const response = await fetch(requestUrl, {
        headers: {
          '0x-api-key': process.env.ZERO_X_API_KEY || '',
          '0x-version': 'v2',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log('🌟 0x Gasless Response Status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ 0x Gasless API error:', error);
        if (error.data && error.data.details) {
          console.error('Error details:', JSON.stringify(error.data.details, null, 2));
        }
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      console.log('✅ 0x Gasless Quote Success');

      res.json(data);
    } catch (error: any) {
      console.error('❌ 0x Gasless proxy error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Regular permit2 quote endpoint (for non-gasless tokens)
  app.get('/api/0x/permit2-quote', async (req, res) => {
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

      const requestUrl = `https://api.0x.org/swap/permit2/quote?${params}`;
      console.log('💰 0x PERMIT2 Quote Request:', {
        sellToken,
        buyToken,
        sellAmount,
        taker,
        chainId: chain
      });

      // Use permit2 API endpoint for non-gasless swaps
      const response = await fetch(requestUrl, {
        headers: {
          '0x-api-key': process.env.ZERO_X_API_KEY || '',
          '0x-version': 'v2',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      console.log('💰 0x Permit2 Response Status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ 0x Permit2 API error:', error);
        if (error.data && error.data.details) {
          console.error('Error details:', JSON.stringify(error.data.details, null, 2));
        }
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      console.log('✅ 0x Permit2 Quote Success');

      res.json(data);
    } catch (error: any) {
      console.error('❌ 0x Permit2 proxy error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Endpoint to get gasless approval tokens
  app.get('/api/0x/gasless/gasless-approval-tokens', async (req, res) => {
    try {
      const { chainId } = req.query;
      
      if (!chainId || isNaN(Number(chainId))) {
        return res.status(400).json({ error: 'Valid chainId required' });
      }

      console.log('🔍 Fetching gasless approval tokens for chain:', chainId);

      // Call 0x API's getGaslessApprovalTokens endpoint
      const response = await fetch(`https://api.0x.org/gasless/gasless-approval-tokens?chainId=${chainId}`, {
        headers: {
          '0x-api-key': process.env.ZERO_X_API_KEY || '',
          '0x-version': 'v2'
        }
      });

      if (!response.ok) {
        console.error('0x Gasless approval tokens API error:', response.status);
        const error = await response.json();
        console.error('Error details:', error);
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      console.log('🔍 Gasless approval tokens response:', JSON.stringify(data, null, 2));

      res.json(data);
    } catch (error: any) {
      console.error('Gasless approval tokens fetch failed:', error);
      res.status(500).json({ error: 'Failed to fetch gasless approval tokens' });
    }
  });

  // New endpoint for submitting signed metatransaction
  app.post('/api/0x/gasless-submit', async (req, res) => {
    try {
      const {
        trade_type,
        trade_eip712,
        trade_signature,
        approval_type,
        approval_eip712,
        approval_signature,
        chain_id
      } = req.body;

      if (!trade_eip712 || !trade_signature) {
        return res.status(400).json({ error: 'Missing required trade parameters' });
      }

      // Default to mainnet if not specified
      const chain = chain_id || '1';

      // Helper function to process signature
      const processSignature = (signature: string) => {
        const sigBytes = ethers.getBytes(signature);
        const r = ethers.dataSlice(sigBytes, 0, 32);
        const s = ethers.dataSlice(sigBytes, 32, 64);
        const v = sigBytes[64] === 0 ? 27 : 28; // Recovery parameter is 0 or 1, not hex

        // Validate signature components
        if (typeof v !== 'number' || isNaN(v)) {
          throw new Error('Invalid signature recovery parameter');
        }

        if (!r || !s || !/^0x[0-9a-fA-F]{64}$/.test(r) || !/^0x[0-9a-fA-F]{64}$/.test(s)) {
          throw new Error('Invalid signature r or s values');
        }

        return { v, r, s };
      };

      // Process trade signature
      const tradeSigComponents = processSignature(trade_signature);

      // Build submission payload
      const submissionPayload: any = {
        trade: {
          type: trade_type,
          signature: {
            ...tradeSigComponents,
            signatureType: 2 // Required for EIP-712 signatures
          },
          eip712: trade_eip712
        },
        chainId: chain,
      };

      // Add approval if provided
      if (approval_eip712 && approval_signature && approval_type) {
        const approvalSigComponents = processSignature(approval_signature);
        submissionPayload.approval = {
          type: approval_type,
          signature: {
            ...approvalSigComponents,
            signatureType: 2  // Required for EIP-712 signatures
          },
          eip712: approval_eip712
        };
      }

      // CRITICAL: Log signature processing for debugging
      console.log('🔍 SIGNATURE PROCESSING:', {
        tradeSignature: {
          signature: trade_signature,
          ...tradeSigComponents
        },
        approvalSignature: approval_signature ? {
          signature: approval_signature,
          ...processSignature(approval_signature)
        } : null,
        submissionPayload: JSON.stringify(submissionPayload, null, 2)
      });

      // Submit the signed metatransaction to 0x Gasless API
      const response = await fetch(
        'https://api.0x.org/gasless/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            '0x-api-key': process.env.ZERO_X_API_KEY || '',
            '0x-version': 'v2',
          },
          body: JSON.stringify(submissionPayload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('0x Gasless submission error:', error);
        if (error.data && error.data.details) {
          console.error('0x Gasless submission error details:', JSON.stringify(error.data.details, null, 2));
        }
        return res.status(response.status).json(error);
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error('0x Gasless submission proxy error:', error);
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
