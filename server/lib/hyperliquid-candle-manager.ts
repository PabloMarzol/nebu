import * as hl from '@nktkas/hyperliquid';

/**
 * Hyperliquid Candle Manager
 * Manages WebSocket subscriptions for real-time candle data
 * Maintains a buffer of historical + real-time candles
 */

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandleBuffer {
  candles: Candle[];
  lastUpdate: number;
  subscription: any;
}

export class HyperliquidCandleManager {
  private subscriptionClient: hl.SubscriptionClient | null = null;
  private candleBuffers: Map<string, CandleBuffer> = new Map();
  private maxBufferSize: number = 500; // Keep last 500 candles per instrument/interval
  private isConnected: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize WebSocket connection
   */
  private async initialize() {
    try {
      console.log('🔌 Initializing Hyperliquid WebSocket for candles...');
      
      this.subscriptionClient = new hl.SubscriptionClient({
        transport: new hl.WebSocketTransport(),
      });

      this.isConnected = true;
      console.log('✅ WebSocket connection established');
    } catch (error: any) {
      console.error('❌ Failed to initialize WebSocket:', error);
      this.isConnected = false;
    }
  }

  /**
   * Subscribe to candle updates for a specific coin and interval
   */
  async subscribeToCandleUpdates(coin: string, interval: string): Promise<void> {
    if (!this.subscriptionClient || !this.isConnected) {
      console.log('⚠️ WebSocket not connected, reinitializing...');
      await this.initialize();
    }

    const bufferKey = `${coin}_${interval}`;

    // Check if already subscribed
    if (this.candleBuffers.has(bufferKey)) {
      console.log(`✅ Already subscribed to ${coin} ${interval}`);
      return;
    }

    try {
      console.log(`📊 Subscribing to candles: ${coin} ${interval}`);

      // Map interval to Hyperliquid format
      const hlInterval = this.mapInterval(interval);

      // Subscribe to candle updates
      const subscription = await this.subscriptionClient!.candle(
        { coin, interval: hlInterval },
        (candle: any) => {
          this.handleCandleUpdate(bufferKey, candle);
        }
      );

      // Initialize buffer
      this.candleBuffers.set(bufferKey, {
        candles: [],
        lastUpdate: Date.now(),
        subscription,
      });

      console.log(`✅ Successfully subscribed to ${coin} ${interval}`);
    } catch (error: any) {
      console.error(`❌ Error subscribing to ${coin} ${interval}:`, error);
    }
  }

  /**
   * Handle incoming candle update from WebSocket
   */
  private handleCandleUpdate(bufferKey: string, candle: any) {
    const buffer = this.candleBuffers.get(bufferKey);
    if (!buffer) return;

    try {
      // Format candle
      const formattedCandle: Candle = {
        time: parseInt(candle.t) * 1000, // Convert to milliseconds
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: parseFloat(candle.c),
        volume: parseFloat(candle.v || '0'),
      };

      // Check if this candle already exists (update) or is new
      const existingIndex = buffer.candles.findIndex(c => c.time === formattedCandle.time);

      if (existingIndex >= 0) {
        // Update existing candle
        buffer.candles[existingIndex] = formattedCandle;
        console.log(`📊 Updated candle at ${new Date(formattedCandle.time).toISOString()}`);
      } else {
        // Add new candle
        buffer.candles.push(formattedCandle);
        console.log(`📊 New candle at ${new Date(formattedCandle.time).toISOString()}`);

        // Sort by time
        buffer.candles.sort((a, b) => a.time - b.time);

        // Trim buffer if too large
        if (buffer.candles.length > this.maxBufferSize) {
          buffer.candles = buffer.candles.slice(-this.maxBufferSize);
        }
      }

      buffer.lastUpdate = Date.now();
    } catch (error: any) {
      console.error('❌ Error handling candle update:', error);
    }
  }

  /**
   * Seed buffer with historical candles (from candleSnapshot API)
   */
  async seedHistoricalCandles(
    coin: string,
    interval: string,
    historicalCandles: Candle[]
  ): Promise<void> {
    const bufferKey = `${coin}_${interval}`;
    const buffer = this.candleBuffers.get(bufferKey);

    if (!buffer) {
      console.log(`⚠️ No subscription found for ${bufferKey}, creating buffer...`);
      this.candleBuffers.set(bufferKey, {
        candles: [],
        lastUpdate: Date.now(),
        subscription: null,
      });
    }

    const targetBuffer = this.candleBuffers.get(bufferKey)!;

    // Merge historical candles with existing buffer
    const allCandles = [...historicalCandles, ...targetBuffer.candles];

    // Remove duplicates (keep the latest version of each timestamp)
    const uniqueCandles = new Map<number, Candle>();
    allCandles.forEach(candle => {
      uniqueCandles.set(candle.time, candle);
    });

    // Convert back to array and sort
    targetBuffer.candles = Array.from(uniqueCandles.values())
      .sort((a, b) => a.time - b.time)
      .slice(-this.maxBufferSize);

    targetBuffer.lastUpdate = Date.now();

    console.log(`✅ Seeded ${targetBuffer.candles.length} historical candles for ${bufferKey}`);
  }

  /**
   * Get candles from buffer
   */
  getCandles(coin: string, interval: string, limit: number = 100): Candle[] {
    const bufferKey = `${coin}_${interval}`;
    const buffer = this.candleBuffers.get(bufferKey);

    if (!buffer || buffer.candles.length === 0) {
      console.log(`⚠️ No candles in buffer for ${bufferKey}`);
      return [];
    }

    // Return most recent candles up to limit
    const candles = buffer.candles.slice(-limit);
    console.log(`📊 Returning ${candles.length} candles for ${bufferKey}`);
    
    return candles;
  }

  /**
   * Unsubscribe from candle updates
   */
  async unsubscribe(coin: string, interval: string): Promise<void> {
    const bufferKey = `${coin}_${interval}`;
    const buffer = this.candleBuffers.get(bufferKey);

    if (!buffer) {
      console.log(`⚠️ No subscription found for ${bufferKey}`);
      return;
    }

    try {
      if (buffer.subscription) {
        await buffer.subscription.unsubscribe();
        console.log(`✅ Unsubscribed from ${bufferKey}`);
      }

      this.candleBuffers.delete(bufferKey);
    } catch (error: any) {
      console.error(`❌ Error unsubscribing from ${bufferKey}:`, error);
    }
  }

  /**
   * Helper: Map frontend interval to Hyperliquid interval
   */
  private mapInterval(interval: string): '1m' | '5m' | '15m' | '1h' | '4h' | '1d' {
    const intervalMap: Record<string, '1m' | '5m' | '15m' | '1h' | '4h' | '1d'> = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1h': '1h',
      '4h': '4h',
      '1D': '1d',
      '1d': '1d',
    };

    return intervalMap[interval] || '1h';
  }

  /**
   * Get subscription status
   */
  getStatus(): { connected: boolean; subscriptions: number } {
    return {
      connected: this.isConnected,
      subscriptions: this.candleBuffers.size,
    };
  }

  /**
   * Cleanup - unsubscribe all
   */
  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up candle subscriptions...');
    
    const keys = Array.from(this.candleBuffers.keys());
    for (const key of keys) {
      const [coin, interval] = key.split('_');
      await this.unsubscribe(coin, interval);
    }

    this.isConnected = false;
    console.log('✅ Cleanup complete');
  }
}

// Singleton instance
export const hyperliquidCandleManager = new HyperliquidCandleManager();
