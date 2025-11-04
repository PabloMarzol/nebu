import WebSocket from 'ws';
import { storage } from '../storage';
import dotenv from "dotenv";

dotenv.config();

const COINAPI_KEY = process.env.COINAPI_KEY;
const COINAPI_WS_URL = 'wss://ws.coinapi.io/v1/';
const COINAPI_REST_URL = 'https://rest.coinapi.io/v1';

// Coinbase Pro API configuration
const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
const COINBASE_SECRET = process.env.COINBASE_SECRET_KEY;

// Infura configuration for blockchain data
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

class LivePriceFeed {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Array<(price: any) => void>> = new Map();
  private isConnected = false;

  // Connect to live price feed
  connect() {
    console.log('[CoinAPI] Connecting to live price feed...');
    this.ws = new WebSocket(COINAPI_WS_URL);
    
    this.ws.on('open', () => {
      console.log('[CoinAPI] ✓ Connected to live feed');
      this.isConnected = true;
      
      // Authenticate
      this.ws!.send(JSON.stringify({
        type: 'hello',
        apikey: COINAPI_KEY,
        heartbeat: false,
        subscribe_data_type: ['trade']
      }));
    });

    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handlePriceUpdate(message);
      } catch (error) {
        console.error('[CoinAPI] Error parsing message:', error);
      }
    });

    this.ws.on('error', (error) => {
      console.error('[CoinAPI] WebSocket error:', error);
      this.isConnected = false;
    });

    this.ws.on('close', () => {
      console.log('[CoinAPI] Connection closed, attempting reconnect...');
      this.isConnected = false;
      setTimeout(() => this.connect(), 5000);
    });
  }

  // Subscribe to specific crypto pairs
  subscribe(symbols: string[]) {
    if (!this.ws || !this.isConnected) {
      console.warn('[CoinAPI] Not connected, cannot subscribe');
      return;
    }

    console.log('[CoinAPI] Subscribing to symbols:', symbols);
    const subscriptions = symbols.map(symbol => ({
      type: 'subscribe',
      symbol_id: symbol // e.g., 'COINBASE_SPOT_BTC_USD'
    }));
    
    subscriptions.forEach(sub => {
      this.ws!.send(JSON.stringify(sub));
    });
  }

  // Handle incoming price updates
  private handlePriceUpdate(message: any) {
    if (message.type === 'trade') {
      const price = {
        symbol: message.symbol_id,
        price: message.price,
        volume: message.size,
        timestamp: message.time_exchange
      };
      
      // Update database
      this.updateMarketData(price);
      
      // Broadcast to all subscribers
      this.notifySubscribers(price.symbol, price);
    }
  }

  // Update market data in database
  private async updateMarketData(price: any) {
    try {
      // Convert CoinAPI symbol to our format
      const symbol = this.convertSymbol(price.symbol);
      if (symbol) {
        await storage.updateMarketData(symbol, {
          price: price.price.toFixed(8),
          volume24h: price.volume?.toString() || '0',
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('[CoinAPI] Error updating market data:', error);
    }
  }

  // Convert CoinAPI symbols to our format
  private convertSymbol(coinApiSymbol: string): string | null {
    const conversions: { [key: string]: string } = {
      'COINBASE_SPOT_BTC_USD': 'BTC/USDT',
      'COINBASE_SPOT_ETH_USD': 'ETH/USDT',
      'BINANCE_SPOT_BTC_USDT': 'BTC/USDT',
      'BINANCE_SPOT_ETH_USDT': 'ETH/USDT',
      'COINBASE_SPOT_SOL_USD': 'SOL/USDT',
      'COINBASE_SPOT_ADA_USD': 'ADA/USDT'
    };
    return conversions[coinApiSymbol] || null;
  }

  // Add price update listeners
  onPriceUpdate(symbol: string, callback: (price: any) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    this.subscribers.get(symbol)!.push(callback);
  }

  private notifySubscribers(symbol: string, price: any) {
    const callbacks = this.subscribers.get(symbol);
    if (callbacks) {
      callbacks.forEach(callback => callback(price));
    }
  }

  isActive(): boolean {
    return this.isConnected;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
}

// Simple market data updater using CoinAPI REST as backup
class MarketDataUpdater {
  async updateMarketData() {
    try {
      const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
      
      for (const symbol of symbols) {
        try {
          const priceData = await getLatestPrice(`${symbol}/USD`);
          if (priceData) {
            await storage.updateMarketData(`${symbol}/USDT`, {
              price: priceData.price.toFixed(8),
              updatedAt: new Date()
            });
          }
        } catch (error) {
          console.error(`[MarketData] Error updating ${symbol}:`, error);
        }
      }
      console.log('[MarketData] Updated market data');
    } catch (error) {
      console.error('[MarketData] Update failed:', error);
    }
  }
}

// Simple REST API fallback for CoinAPI
export async function getLatestPrice(symbol: string): Promise<any> {
  try {
    if (!COINAPI_KEY) {
      throw new Error('CoinAPI key not configured');
    }
    
    const response = await fetch(
      `${COINAPI_REST_URL}/exchangerate/${symbol}`, 
      {
        headers: {
          'X-CoinAPI-Key': COINAPI_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`CoinAPI REST error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      symbol: `${data.asset_id_base}/${data.asset_id_quote}`,
      price: data.rate,
      timestamp: data.time
    };
  } catch (error) {
    console.error('[CoinAPI] REST API error:', error);
    throw error;
  }
}

// Export main price feed instance
export const priceFeed = new LivePriceFeed();
export const marketDataUpdater = new MarketDataUpdater();

// Initialize the price feed with Hyperliquid market data
export async function initializeLivePriceFeed() {
  console.log('[LivePriceFeed] Initializing with Hyperliquid market data...');
  
  // Use Hyperliquid for market data updates
  try {
    const { initializeHyperliquidMarketData } = await import('./hyperliquid-market-data');
    initializeHyperliquidMarketData();
    console.log('[LivePriceFeed] Hyperliquid market data service active');
  } catch (error) {
    console.error('[LivePriceFeed] Failed to initialize Hyperliquid market data:', error);
  }
}
