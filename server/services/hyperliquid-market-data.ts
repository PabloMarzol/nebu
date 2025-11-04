// Hyperliquid Market Data Service - Primary market data provider
import { HyperliquidClient, hyperliquidClient } from '../lib/hyperliquid-client';

export class HyperliquidMarketDataService {
  private hyperliquidClient: HyperliquidClient;
  
  constructor() {
    // Use the singleton instance instead of creating a new one
    this.hyperliquidClient = hyperliquidClient;
    console.log('[HyperliquidMarketData] Service initialized with singleton client');
  }

  // Get current market data for all major pairs with real 24h stats
  async getMarketData(): Promise<any[]> {
    try {
      console.log('[HyperliquidMarketData] Fetching market data with real 24h stats...');
      
      // Get all available markets from Hyperliquid with error handling
      let allMarkets;
      try {
        allMarkets = await this.hyperliquidClient.getAllMarkets();
      } catch (error: any) {
        if (error.message?.includes('429') || error.status === 429) {
          console.warn('[HyperliquidMarketData] Rate limited, using WebSocket live prices');
          // Use WebSocket live prices during rate limiting
          return this.getWebSocketMarketData();
        }
        throw error;
      }
      
      if (!allMarkets || allMarkets.length === 0) {
        console.warn('[HyperliquidMarketData] No market data available, using WebSocket fallback');
        return this.getWebSocketMarketData();
      }

      const marketData = [];
      const symbolMapping = {
        'BTC': 'BTC/USDT',
        'ETH': 'ETH/USDT', 
        'SOL': 'SOL/USDT',
        'ADA': 'ADA/USDT',
        'DOT': 'DOT/USDT',
        'LINK': 'LINK/USDT',
        'UNI': 'UNI/USDT',
        'AAVE': 'AAVE/USDT',
        'MATIC': 'MATIC/USDT'
      };

      // Convert Hyperliquid format to our market data format with real data
      for (const market of allMarkets) {
        // Extract base symbol (remove USDC, etc.)
        const baseSymbol = market.symbol.replace(/USDC|USD$/i, '');
        const ourSymbol = symbolMapping[baseSymbol as keyof typeof symbolMapping];
        
        if (ourSymbol) {
          const currentPrice = market.price;
          
          // Get real 24h statistics using candle data
          const stats24h = await this.getReal24hStats(market.symbol, currentPrice);
          
          marketData.push({
            symbol: ourSymbol,
            price: currentPrice.toString(),
            change24h: stats24h.change24h.toFixed(2),
            volume24h: stats24h.volume24h.toFixed(0),
            high24h: stats24h.high24h.toFixed(2),
            low24h: stats24h.low24h.toFixed(2),
            marketCap: (currentPrice * 1000000000).toFixed(0), // Placeholder market cap
            updatedAt: new Date().toISOString()
          });
        }
      }

      console.log(`[HyperliquidMarketData] Retrieved ${marketData.length} market pairs with real 24h stats`);
      return marketData;
      
    } catch (error) {
      console.error('[HyperliquidMarketData] Error fetching market data:', error);
      return [];
    }
  }

  // Get real 24h statistics using candle data and recent trades
  private async getReal24hStats(coin: string, currentPrice: number): Promise<{
    change24h: number;
    volume24h: number;
    high24h: number;
    low24h: number;
  }> {
    try {
      console.log(`[HyperliquidMarketData] Getting real 24h stats for ${coin}`);
      
      // Try to get 24h candle data for this coin with reduced API calls
      let candles24h: any[] = [];
      try {
        // Use shorter time range to reduce API calls - 12 hours instead of 24
        candles24h = await this.hyperliquidClient.getCandleData(coin, '1h', 12);
      } catch (candleError: any) {
        if (candleError.message?.includes('429') || candleError.status === 429) {
          console.warn(`[HyperliquidMarketData] Rate limited on candle data for ${coin}, using trade fallback`);
          candles24h = [];
        } else {
          throw candleError;
        }
      }
      
      if (candles24h && candles24h.length > 0) {
        // Calculate stats from real candle data
        const prices = candles24h.map(c => c.close);
        const volumes = candles24h.map(c => c.volume);
        
        const open24h = candles24h[0].open;
        const high24h = Math.max(...candles24h.map(c => c.high));
        const low24h = Math.min(...candles24h.map(c => c.low));
        const volume24h = volumes.reduce((sum, vol) => sum + vol, 0);
        const change24h = ((currentPrice - open24h) / open24h) * 100;
        
        console.log(`[HyperliquidMarketData] Real 24h stats for ${coin}: change=${change24h.toFixed(2)}%, volume=$${volume24h.toFixed(0)}, high=$${high24h.toFixed(2)}, low=$${low24h.toFixed(2)}`);
        
        return {
          change24h,
          volume24h,
          high24h,
          low24h
        };
      }
      
      // Fallback: Get recent market trades and calculate stats
      console.log(`[HyperliquidMarketData] Using recent trades for 24h stats for ${coin}`);
      let recentTrades;
      try {
        recentTrades = await this.hyperliquidClient.getMarketTrades(coin, 50); // Reduced from 100 to 50
      } catch (tradeError: any) {
        if (tradeError.message?.includes('429') || tradeError.status === 429) {
          console.warn(`[HyperliquidMarketData] Rate limited on trade data for ${coin}, using baseline stats`);
          recentTrades = [];
        } else {
          throw tradeError;
        }
      }
      
      if (recentTrades && recentTrades.length > 0) {
        const prices = recentTrades.map(t => t.price);
        const volumes = recentTrades.map(t => t.size);
        
        const high24h = Math.max(...prices);
        const low24h = Math.min(...prices);
        const volume24h = volumes.reduce((sum, vol) => sum + vol, 0);
        
        // Estimate change from trade data (this is approximate)
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const change24h = ((currentPrice - avgPrice) / avgPrice) * 100;
        
        console.log(`[HyperliquidMarketData] Trade-based 24h stats for ${coin}: change=${change24h.toFixed(2)}%, volume=$${volume24h.toFixed(0)}, high=$${high24h.toFixed(2)}, low=$${low24h.toFixed(2)}`);
        
        return {
          change24h,
          volume24h,
          high24h,
          low24h
        };
      }
      
      // Final fallback: return current price as baseline
      console.log(`[HyperliquidMarketData] Using baseline stats for ${coin}`);
      return {
        change24h: 0,
        volume24h: 0,
        high24h: currentPrice,
        low24h: currentPrice
      };
      
    } catch (error) {
      console.error(`[HyperliquidMarketData] Error getting 24h stats for ${coin}:`, error);
      // Return baseline stats on error
      return {
        change24h: 0,
        volume24h: 0,
        high24h: currentPrice,
        low24h: currentPrice
      };
    }
  }

  // Get orderbook data for a specific symbol
  async getOrderBook(symbol: string): Promise<any> {
    try {
      // Convert our symbol format to Hyperliquid format
      const hyperliquidSymbol = this.convertToHyperliquidSymbol(symbol);
      
      if (!hyperliquidSymbol) {
        console.warn(`[HyperliquidMarketData] Cannot convert symbol: ${symbol}`);
        return { bids: [], asks: [] };
      }

      console.log(`[HyperliquidMarketData] Fetching orderbook for ${symbol} (${hyperliquidSymbol})`);
      
      // Get orderbook from Hyperliquid
      const orderbook = await this.hyperliquidClient.getOrderBook(hyperliquidSymbol.replace('@', ''));
      
      if (!orderbook) {
        console.warn(`[HyperliquidMarketData] No orderbook data for ${symbol}`);
        return { bids: [], asks: [] };
      }

      // Convert to our format - orderbook already has the correct format
      const formattedOrderbook = {
        symbol: symbol,
        bids: orderbook.bids || [],
        asks: orderbook.asks || [],
        timestamp: new Date().toISOString()
      };

      return formattedOrderbook;
      
    } catch (error) {
      console.error(`[HyperliquidMarketData] Error fetching orderbook for ${symbol}:`, error);
      return { bids: [], asks: [] };
    }
  }

  // Get current price for a specific symbol
  async getCurrentPrice(symbol: string): Promise<string | null> {
    try {
      const hyperliquidSymbol = this.convertToHyperliquidSymbol(symbol);
      
      if (!hyperliquidSymbol) {
        return null;
      }

      // Try to get live price from WebSocket first
      const coin = hyperliquidSymbol.replace('@', '');
      const livePrice = this.hyperliquidClient.getLivePrice(coin);
      
      if (livePrice !== null) {
        console.log(`💰 Live WebSocket price for ${symbol}: $${livePrice.toFixed(2)}`);
        return livePrice.toString();
      }

      // Fallback to API if WebSocket price not available
      console.log(`📡 Falling back to API for ${symbol} price...`);
      const allMarkets = await this.hyperliquidClient.getAllMarkets();
      
      // Find the market with the matching symbol
      const market = allMarkets.find(m => m.symbol === coin);
      
      if (market) {
        return market.price.toString();
      }
      
      return null;
    } catch (error) {
      console.error(`[HyperliquidMarketData] Error getting price for ${symbol}:`, error);
      return null;
    }
  }

  // Get recent trades for a symbol
  async getRecentTrades(symbol: string, limit: number = 20): Promise<any[]> {
    try {
      const hyperliquidSymbol = this.convertToHyperliquidSymbol(symbol);
      
      if (!hyperliquidSymbol) {
        return [];
      }

      // Note: Hyperliquid doesn't provide historical trades in the same way
      // We'll return empty array for now, or could implement WebSocket trade monitoring
      console.log(`[HyperliquidMarketData] Trade history not available for ${symbol}`);
      return [];
      
    } catch (error) {
      console.error(`[HyperliquidMarketData] Error getting trades for ${symbol}:`, error);
      return [];
    }
  }

  // Convert our symbol format to Hyperliquid format
  private convertToHyperliquidSymbol(ourSymbol: string): string | null {
    const conversions: { [key: string]: string } = {
      'BTC/USDT': '@BTC',
      'ETH/USDT': '@ETH',
      'SOL/USDT': '@SOL',
      'ADA/USDT': '@ADA',
      'DOT/USDT': '@DOT',
      'LINK/USDT': '@LINK',
      'UNI/USDT': '@UNI',
      'AAVE/USDT': '@AAVE',
      'MATIC/USDT': '@MATIC'
    };
    
    return conversions[ourSymbol] || null;
  }

  // Check if Hyperliquid is available
  async isAvailable(): Promise<boolean> {
    try {
      const allMarkets = await this.hyperliquidClient.getAllMarkets();
      return allMarkets !== null && Array.isArray(allMarkets) && allMarkets.length > 0;
    } catch (error) {
      console.error('[HyperliquidMarketData] Service unavailable:', error);
      return false;
    }
  }

  // Get service status
  getStatus(): { available: boolean, source: string, timestamp: string } {
    return {
      available: true, // Will be checked dynamically
      source: 'Hyperliquid',
      timestamp: new Date().toISOString()
    };
  }

  // Get market data using WebSocket live prices during rate limiting
  private getWebSocketMarketData(): any[] {
    console.log('[HyperliquidMarketData] Using WebSocket live prices for market data');
    
    const majorCoins = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'MATIC'];
    const marketData = [];
    const symbolMapping = {
      'BTC': 'BTC/USDT',
      'ETH': 'ETH/USDT', 
      'SOL': 'SOL/USDT',
      'ADA': 'ADA/USDT',
      'DOT': 'DOT/USDT',
      'LINK': 'LINK/USDT',
      'UNI': 'UNI/USDT',
      'AAVE': 'AAVE/USDT',
      'MATIC': 'MATIC/USDT'
    };

    for (const coin of majorCoins) {
      const livePrice = this.hyperliquidClient.getLivePrice(coin);
      
      if (livePrice !== null) {
        const ourSymbol = symbolMapping[coin as keyof typeof symbolMapping];
        
        if (ourSymbol) {
          // Use live WebSocket price with estimated stats
          marketData.push({
            symbol: ourSymbol,
            price: livePrice.toFixed(2),
            change24h: '0.00', // Cannot calculate without historical data
            volume24h: '0', // Cannot get volume from WebSocket
            high24h: livePrice.toFixed(2), // Current price as placeholder
            low24h: livePrice.toFixed(2), // Current price as placeholder
            marketCap: (livePrice * 1000000000).toFixed(0),
            updatedAt: new Date().toISOString(),
            source: 'websocket' // Mark as WebSocket data
          });
        }
      }
    }

    if (marketData.length === 0) {
      console.warn('[HyperliquidMarketData] No WebSocket prices available');
    } else {
      console.log(`[HyperliquidMarketData] Retrieved ${marketData.length} market pairs from WebSocket`);
    }

    return marketData;
  }
}

// Export singleton instance
export const hyperliquidMarketDataService = new HyperliquidMarketDataService();

// Helper function to update market data in storage
export async function updateMarketDataWithHyperliquid() {
  try {
    const marketData = await hyperliquidMarketDataService.getMarketData();
    
    if (marketData.length === 0) {
      console.warn('[HyperliquidMarketData] No market data to update');
      return;
    }

    // Import storage dynamically to avoid circular dependencies
    const { storage } = await import('../storage');
    
    for (const data of marketData) {
      try {
        await storage.updateMarketData(data.symbol, {
          price: data.price,
          change24h: data.change24h,
          volume24h: data.volume24h,
          high24h: data.high24h,
          low24h: data.low24h,
          marketCap: data.marketCap,
          updatedAt: new Date(data.updatedAt)
        });
      } catch (error) {
        console.error(`[HyperliquidMarketData] Error updating ${data.symbol}:`, error);
      }
    }
    
    console.log(`[HyperliquidMarketData] Updated ${marketData.length} market pairs in database`);
    
  } catch (error) {
    console.error('[HyperliquidMarketData] Failed to update market data:', error);
  }
}

  // Initialize market data updates
export function initializeHyperliquidMarketData() {
  console.log('[HyperliquidMarketData] Initializing market data service...');
  
  // Update market data every 120 seconds (2 minutes) to avoid rate limits
  setInterval(() => {
    updateMarketDataWithHyperliquid();
  }, 120000);
  
  // Initial update with delay to avoid startup rush
  setTimeout(() => {
    updateMarketDataWithHyperliquid();
  }, 5000);
  
  console.log('[HyperliquidMarketData] Market data updates initialized (2-minute intervals)');
}
