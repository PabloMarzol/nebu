import { Router } from 'express';
import { coinCapService } from '../services/coincap-service';

const router = Router();

// Get top cryptocurrencies
router.get('/assets', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const assets = await coinCapService.getAssets(limit, offset);
    res.json({
      success: true,
      data: assets,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[CoinCap API] Error fetching assets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cryptocurrency assets',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific cryptocurrency
router.get('/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await coinCapService.getAsset(id);
    
    res.json({
      success: true,
      data: asset,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`[CoinCap API] Error fetching asset ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cryptocurrency asset',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get cryptocurrency price history
router.get('/assets/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const interval = req.query.interval as string || 'd1';
    const start = req.query.start ? parseInt(req.query.start as string) : undefined;
    const end = req.query.end ? parseInt(req.query.end as string) : undefined;
    
    const history = await coinCapService.getAssetHistory(id, interval, start, end);
    
    res.json({
      success: true,
      data: history,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`[CoinCap API] Error fetching history for ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cryptocurrency history',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get market data
router.get('/markets', async (req, res) => {
  try {
    const exchangeId = req.query.exchangeId as string;
    const baseSymbol = req.query.baseSymbol as string;
    const quoteSymbol = req.query.quoteSymbol as string;
    
    const markets = await coinCapService.getMarkets(exchangeId, baseSymbol, quoteSymbol);
    
    res.json({
      success: true,
      data: markets,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[CoinCap API] Error fetching markets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get exchanges
router.get('/exchanges', async (req, res) => {
  try {
    const exchanges = await coinCapService.getExchanges();
    
    res.json({
      success: true,
      data: exchanges,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[CoinCap API] Error fetching exchanges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exchanges',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get exchange rates
router.get('/rates', async (req, res) => {
  try {
    const rates = await coinCapService.getRates();
    
    res.json({
      success: true,
      data: rates,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[CoinCap API] Error fetching rates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exchange rates',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get top cryptocurrencies (convenience endpoint)
router.get('/top/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const topCryptos = await coinCapService.getTopCryptos(count);
    
    res.json({
      success: true,
      data: topCryptos,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[CoinCap API] Error fetching top cryptocurrencies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top cryptocurrencies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get multiple cryptocurrency prices
router.post('/prices', async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!Array.isArray(symbols)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: symbols must be an array'
      });
    }
    
    const prices = await coinCapService.getCryptoPrices(symbols);
    
    res.json({
      success: true,
      data: prices,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[CoinCap API] Error fetching crypto prices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cryptocurrency prices',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get market statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await coinCapService.getMarketStats();
    
    res.json({
      success: true,
      data: stats,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[CoinCap API] Error fetching market stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as coinCapRoutes };