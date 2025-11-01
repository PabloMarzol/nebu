import { Router } from 'express';
import { hyperliquidClient } from '../lib/hyperliquid-client';
import { hyperliquidCandleManager } from '../lib/hyperliquid-candle-manager';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();


const HYPERLIQUID_PRIVATE_KEY = process.env.HYPERLIQUID_PRIVATE_KEY;
const HYPERLIQUID_WALLET = process.env.HYPERLIQUID_WALLET;

/**
 * GET /api/hyperliquid/market/:symbol
 * Get market data for a specific symbol
 */
router.get('/market/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const marketData = await hyperliquidClient.getMarketData(symbol);
    res.json(marketData);
  } catch (error: any) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch market data',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/markets
 * Get all available markets
 */
router.get('/market', async (req, res) => {
  try {
    const marketData = await hyperliquidClient.getMarketData('BTC');
    res.json(marketData);
  } catch (error: any) {
    console.error('Error fetching default market data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch market data',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/balance/:walletAddress
 * Get user balance
 */
router.get('/balance/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const balance = await hyperliquidClient.getUserBalance(walletAddress);
    res.json(balance);
  } catch (error: any) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ 
      error: 'Failed to fetch balance',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/orderbook/:symbol
 * Get order book (L2 book) for a symbol
 */
router.get('/orderbook/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    // Normalize symbol (BTC from BTC/USDT or BTC-PERP)
    const coin = symbol.replace('/', '').replace('-PERP', '').replace('USDC', '').replace('USDT', '');
    
    const orderBook = await hyperliquidClient.getOrderBook(coin);
    res.json(orderBook);
  } catch (error: any) {
    console.error('Error fetching order book:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order book',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/candles/:symbol
 * Get candle data with WebSocket real-time updates
 * Strategy:
 * 1. Check if we have candles in WebSocket buffer
 * 2. If not, fetch historical candles and seed the buffer
 * 3. Subscribe to WebSocket for real-time updates
 * 4. Return buffered candles
 */
router.get('/candles/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '1h', limit = '100' } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    console.log('🎯 Candles endpoint hit:', { symbol, interval, limit });

    // Normalize symbol
    const coin = symbol.replace('/', '').replace('-PERP', '').replace('USDC', '').replace('USDT', '');
    
    const intervalStr = interval as string;
    const limitNum = parseInt(limit as string);

    // Check if we already have candles in buffer
    let candles = hyperliquidCandleManager.getCandles(coin, intervalStr, limitNum);

    // If buffer is empty or has too few candles, fetch historical data
    if (!candles || candles.length < Math.min(10, limitNum)) {
      console.log('📊 Buffer empty or insufficient, fetching historical candles...');
      
      // Fetch historical candles from candleSnapshot
      const historicalCandles = await hyperliquidClient.getCandleData(coin, intervalStr, limitNum);
      
      if (historicalCandles && historicalCandles.length > 0) {
        console.log('✅ Fetched', historicalCandles.length, 'historical candles');
        
        // Seed the buffer with historical data
        await hyperliquidCandleManager.seedHistoricalCandles(coin, intervalStr, historicalCandles);
      } else {
        console.log('⚠️ No historical candles available from candleSnapshot');
      }

      // Subscribe to WebSocket updates for this instrument
      console.log('🔌 Subscribing to WebSocket candle updates...');
      await hyperliquidCandleManager.subscribeToCandleUpdates(coin, intervalStr);
      
      // Get candles from buffer after seeding
      candles = hyperliquidCandleManager.getCandles(coin, intervalStr, limitNum);
    }

    console.log('✅ Returning', candles.length, 'candles (historical + real-time)');
    
    res.json({
      success: true,
      candles,
      count: candles.length,
      source: 'websocket-buffer',
    });
  } catch (error: any) {
    console.error('❌ Error in candles endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch candle data',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/orders/:walletAddress
 * Get user's active orders
 */
router.get('/orders/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const orders = await hyperliquidClient.getUserOrders(walletAddress);
    res.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/positions/:walletAddress
 * Get user's open positions (futures)
 */
router.get('/positions/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const positions = await hyperliquidClient.getUserPositions(walletAddress);
    res.json(positions);
  } catch (error: any) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch positions',
      message: error.message 
    });
  }
});

/**
 * POST /api/hyperliquid/place-order
 * Place a new order
 * Note: Uses backend's private key for security
 */
router.post('/place-order', async (req, res) => {
  try {
    const orderData = req.body;

    console.log('📦 Order Data Received:', {
      walletAddress: orderData.walletAddress,
      symbol: orderData.symbol,
      amount: orderData.amount,
    });
    
    console.log('🔐 Environment Config:', {
      envWallet: HYPERLIQUID_WALLET,
      envWalletExists: !!HYPERLIQUID_WALLET,
      privateKeyExists: !!HYPERLIQUID_PRIVATE_KEY,
    });

    // Basic validation
    if (!orderData.walletAddress || !orderData.symbol || !orderData.amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: walletAddress, symbol, amount' 
      });
    }

    console.log('🔍 Wallet Comparison:', {
      incoming: orderData.walletAddress?.toLowerCase(),
      configured: HYPERLIQUID_WALLET?.toLowerCase(),
      match: orderData.walletAddress?.toLowerCase() === HYPERLIQUID_WALLET?.toLowerCase(),
    });

    // Security check: Verify the wallet address matches our configured wallet
    if (orderData.walletAddress.toLowerCase() !== HYPERLIQUID_WALLET?.toLowerCase()) {
      return res.status(403).json({ 
        error: 'Unauthorized: Wallet address does not match configured wallet' 
      });
    }

    if (!HYPERLIQUID_PRIVATE_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error: Private key not configured' 
      });
    }

    // Add the private key from environment (never from frontend!)
    const orderParams = {
      ...orderData,
      privateKey: HYPERLIQUID_PRIVATE_KEY,
    };

    console.log('✅ Placing order with Hyperliquid...');

    // Place order
    const result = await hyperliquidClient.placeOrder(orderParams);
    
    console.log('🎉 Order result:', result);
    
    res.json(result);
  } catch (error: any) {
    console.error('❌ Error placing order:', error);
    res.status(500).json({ 
      error: 'Failed to place order',
      message: error.message 
    });
  }
});

/**
 * POST /api/hyperliquid/cancel-order
 * Cancel an existing order
 */
router.post('/cancel-order', async (req, res) => {
  try {
    const { orderId, walletAddress, symbol } = req.body;

    if (!orderId || !walletAddress) {
      return res.status(400).json({ 
        error: 'Missing required fields: orderId, walletAddress' 
      });
    }

    // Security check
    if (walletAddress.toLowerCase() !== HYPERLIQUID_WALLET?.toLowerCase()) {
      return res.status(403).json({ 
        error: 'Unauthorized: Wallet address does not match configured wallet' 
      });
    }

    if (!HYPERLIQUID_PRIVATE_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error: Private key not configured' 
      });
    }

    const cancelParams = {
      orderId,
      walletAddress,
      symbol,
      privateKey: HYPERLIQUID_PRIVATE_KEY,
    };

    // Cancel order
    const result = await hyperliquidClient.cancelOrder(cancelParams);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ 
      error: 'Failed to cancel order',
      message: error.message 
    });
  }
});

/**
 * POST /api/hyperliquid/set-leverage
 * Set leverage for a symbol (futures)
 */
router.post('/set-leverage', async (req, res) => {
  try {
    const { symbol, leverage, walletAddress } = req.body;

    if (!symbol || !leverage || !walletAddress) {
      return res.status(400).json({ 
        error: 'Missing required fields: symbol, leverage, walletAddress' 
      });
    }

    // Security check
    if (walletAddress.toLowerCase() !== HYPERLIQUID_WALLET?.toLowerCase()) {
      return res.status(403).json({ 
        error: 'Unauthorized: Wallet address does not match configured wallet' 
      });
    }

    if (!HYPERLIQUID_PRIVATE_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error: Private key not configured' 
      });
    }

    const leverageParams = {
      ...req.body,
      privateKey: HYPERLIQUID_PRIVATE_KEY,
    };

    // Set leverage
    const result = await hyperliquidClient.setLeverage(leverageParams);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error setting leverage:', error);
    res.status(500).json({ 
      error: 'Failed to set leverage',
      message: error.message 
    });
  }
});

/**
 * POST /api/hyperliquid/close-position
 * Close a position (futures)
 */
router.post('/close-position', async (req, res) => {
  try {
    const { symbol, walletAddress, size } = req.body;

    if (!symbol || !walletAddress) {
      return res.status(400).json({ 
        error: 'Missing required fields: symbol, walletAddress' 
      });
    }

    // Security check
    if (walletAddress.toLowerCase() !== HYPERLIQUID_WALLET?.toLowerCase()) {
      return res.status(403).json({ 
        error: 'Unauthorized: Wallet address does not match configured wallet' 
      });
    }

    if (!HYPERLIQUID_PRIVATE_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error: Private key not configured' 
      });
    }

    const closeParams = {
      symbol,
      walletAddress,
      size,
      privateKey: HYPERLIQUID_PRIVATE_KEY,
    };

    // Close position
    const result = await hyperliquidClient.closePosition(closeParams);
    
    res.json(result);
  } catch (error: any) {
    console.error('Error closing position:', error);
    res.status(500).json({ 
      error: 'Failed to close position',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/candles-from-trades/:symbol
 * Build candle data from recent trades (explicit trade aggregation)
 */
router.get('/candles-from-trades/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '1h', limit = '100' } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    console.log('🕯️ Building candles from trades:', { symbol, interval, limit });

    // Normalize symbol
    const coin = symbol.replace('/', '').replace('-PERP', '').replace('USDC', '').replace('USDT', '');
    
    const candles = await hyperliquidClient.getCandlesFromTrades(coin, interval as string, parseInt(limit as string));
    
    console.log('✅ Returning', candles.length, 'trade-based candles');
    
    res.json({
      success: true,
      candles,
      count: candles.length,
      source: 'trades',
    });
  } catch (error: any) {
    console.error('❌ Error building candles from trades:', error);
    res.status(500).json({ 
      error: 'Failed to build candles from trades',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/trades/user/:walletAddress
 * Get user's recent trade fills
 */
router.get('/trades/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { limit = '100' } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    console.log('📊 Fetching user trades for:', walletAddress, 'limit:', limit);

    const trades = await hyperliquidClient.getUserTrades(walletAddress, parseInt(limit as string));
    
    console.log('✅ Returning', trades.length, 'user trades');
    
    res.json({
      success: true,
      trades,
      count: trades.length,
    });
  } catch (error: any) {
    console.error('❌ Error fetching user trades:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user trades',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/trades/market/:symbol
 * Get recent market trades for a symbol
 */
router.get('/trades/market/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { limit = '1000' } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    console.log('📊 Fetching market trades for:', symbol, 'limit:', limit);

    // Normalize symbol
    const coin = symbol.replace('/', '').replace('-PERP', '').replace('USDC', '').replace('USDT', '');
    
    const trades = await hyperliquidClient.getMarketTrades(coin, parseInt(limit as string));
    
    console.log('✅ Returning', trades.length, 'market trades');
    
    res.json({
      success: true,
      trades,
      count: trades.length,
    });
  } catch (error: any) {
    console.error('❌ Error fetching market trades:', error);
    res.status(500).json({ 
      error: 'Failed to fetch market trades',
      message: error.message 
    });
  }
});

/**
 * GET /api/hyperliquid/health
 * Health check endpoint with WebSocket status
 */
router.get('/health', async (req, res) => {
  try {
    const markets = await hyperliquidClient.getAllMarkets();
    const wsStatus = hyperliquidCandleManager.getStatus();
    
    res.json({
      status: 'healthy',
      timestamp: Date.now(),
      marketsAvailable: markets.length,
      walletConfigured: !!HYPERLIQUID_WALLET,
      privateKeyConfigured: !!HYPERLIQUID_PRIVATE_KEY,
      websocket: {
        connected: wsStatus.connected,
        activeSubscriptions: wsStatus.subscriptions,
      },
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: Date.now(),
    });
  }
});

export default router;