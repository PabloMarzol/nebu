// Hyperliquid WebSocket Service - Real-time price feeds
import { HyperliquidClient, hyperliquidClient } from '../lib/hyperliquid-client';

export class HyperliquidWebSocketService {
  private hyperliquidClient: HyperliquidClient;
  private isRunning: boolean = false;
  private priceUpdateCallbacks: Map<string, (price: number) => void> = new Map();
  private orderBookUpdateCallbacks: Map<string, (orderBook: any) => void> = new Map();
  private candleUpdateCallbacks: Map<string, (candle: any) => void> = new Map();

  constructor() {
    // Use the singleton instance instead of creating a new one
    this.hyperliquidClient = hyperliquidClient;
    console.log('[HyperliquidWebSocket] Service initialized with singleton client');
  }

  /**
   * Start WebSocket price feeds for major trading pairs
   */
  async startWebSocketFeeds(): Promise<void> {
    if (this.isRunning) {
      console.log('[HyperliquidWebSocket] Feeds already running');
      return;
    }

    try {
      console.log('[HyperliquidWebSocket] Starting WebSocket price feeds...');
      
      const majorCoins = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'MATIC'];
      
      // Subscribe to live price feeds
      for (const coin of majorCoins) {
        await this.subscribeToLivePrices(coin);
      }

      // Subscribe to live candle feeds for charting
      await this.subscribeToLiveCandles();

      this.isRunning = true;
      console.log('✅ [HyperliquidWebSocket] WebSocket price feeds started');

    } catch (error) {
      console.error('❌ [HyperliquidWebSocket] Error starting WebSocket feeds:', error);
    }
  }

  /**
   * Subscribe to live price updates for a specific coin
   */
  private async subscribeToLivePrices(coin: string): Promise<void> {
    try {
      console.log(`📡 Subscribing to live prices for ${coin}...`);
      
      // Use the client's WebSocket subscription for all mids
      await this.hyperliquidClient.subscribeToLivePrices();
      
      console.log(`✅ Subscribed to live prices for ${coin}`);

    } catch (error) {
      console.error(`❌ Error subscribing to ${coin} live prices:`, error);
    }
  }

  /**
   * Subscribe to live candle feeds for charting
   */
  private async subscribeToLiveCandles(): Promise<void> {
    const majorCoins = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'MATIC'];
    const intervals = ['1h', '4h', '1d']; // Common chart intervals
    
    console.log(`🕯️ Subscribing to live candles for ${majorCoins.length} coins...`);

    for (const coin of majorCoins) {
      for (const interval of intervals) {
        try {
          await this.hyperliquidClient.subscribeToCandles(coin, interval, (candle) => {
            // Store candle data in memory for quick access
            const key = `${coin}-${interval}`;
            this.candleUpdateCallbacks.forEach((callback, callbackKey) => {
              if (callbackKey === key) {
                callback(candle);
              }
            });
          });
          
          console.log(`✅ Subscribed to ${coin} candles (${interval})`);
          
        } catch (error) {
          console.error(`❌ Error subscribing to ${coin} candles (${interval}):`, error);
        }
      }
    }
  }

  /**
   * Register a callback for price updates
   */
  onPriceUpdate(symbol: string, callback: (price: number) => void): void {
    this.priceUpdateCallbacks.set(symbol, callback);
    console.log(`✅ Registered price update callback for ${symbol}`);
  }

  /**
   * Register a callback for order book updates
   */
  onOrderBookUpdate(symbol: string, callback: (orderBook: any) => void): void {
    this.orderBookUpdateCallbacks.set(symbol, callback);
    console.log(`✅ Registered order book update callback for ${symbol}`);
  }

  /**
   * Register a callback for candle updates
   */
  onCandleUpdate(symbol: string, interval: string, callback: (candle: any) => void): void {
    const key = `${symbol}-${interval}`;
    this.candleUpdateCallbacks.set(key, callback);
    console.log(`✅ Registered candle update callback for ${key}`);
  }

  /**
   * Get current live price for a symbol
   */
  getLivePrice(symbol: string): number | null {
    // Convert symbol format (BTC/USDT -> BTC)
    const coin = symbol.replace('/USDT', '').replace('/USD', '');
    return this.hyperliquidClient.getLivePrice(coin);
  }

  /**
   * Stop WebSocket feeds and cleanup
   */
  async stopWebSocketFeeds(): Promise<void> {
    if (!this.isRunning) return;

    try {
      console.log('[HyperliquidWebSocket] Stopping WebSocket feeds...');
      
      // Clear all callbacks
      this.priceUpdateCallbacks.clear();
      this.orderBookUpdateCallbacks.clear();
      this.candleUpdateCallbacks.clear();
      
      // Close WebSocket connection
      await this.hyperliquidClient.closeWebSocket();
      
      this.isRunning = false;
      console.log('✅ [HyperliquidWebSocket] WebSocket feeds stopped');

    } catch (error) {
      console.error('❌ [HyperliquidWebSocket] Error stopping WebSocket feeds:', error);
    }
  }

  /**
   * Get service status
   */
  getStatus(): { 
    running: boolean; 
    websocketConnected: boolean; 
    activeFeeds: number;
    timestamp: string 
  } {
    return {
      running: this.isRunning,
      websocketConnected: this.hyperliquidClient.getWebSocketStatus(),
      activeFeeds: this.priceUpdateCallbacks.size + this.orderBookUpdateCallbacks.size + this.candleUpdateCallbacks.size,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const hyperliquidWebSocketService = new HyperliquidWebSocketService();

// Helper function to initialize WebSocket feeds
export async function initializeHyperliquidWebSocket() {
  console.log('[HyperliquidWebSocket] Initializing WebSocket service...');
  
  try {
    await hyperliquidWebSocketService.startWebSocketFeeds();
    console.log('✅ [HyperliquidWebSocket] WebSocket service initialized');
  } catch (error) {
    console.error('❌ [HyperliquidWebSocket] Failed to initialize WebSocket service:', error);
  }
}

// Helper function to cleanup WebSocket service
export async function cleanupHyperliquidWebSocket() {
  console.log('[HyperliquidWebSocket] Cleaning up WebSocket service...');
  
  try {
    await hyperliquidWebSocketService.stopWebSocketFeeds();
    console.log('✅ [HyperliquidWebSocket] WebSocket service cleaned up');
  } catch (error) {
    console.error('❌ [HyperliquidWebSocket] Error during cleanup:', error);
  }
}
