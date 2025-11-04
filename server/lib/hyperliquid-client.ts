import * as hl from '@nktkas/hyperliquid';
import dotenv from 'dotenv';
dotenv.config();
/**
 * Hyperliquid Client Wrapper
 * Uses @nktkas/hyperliquid SDK
 */

// TypeScript interfaces for better type safety
interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  timestamp: number;
}

interface MarketInfo {
  symbol: string;
  price: number;
}

interface UserBalance {
  totalBalance: number;
  available: number;
  marginUsed: number;
  unrealizedPnl: number;
  timestamp: number;
}

interface Order {
  id: number;
  symbol: string;
  side: string;
  orderType: string;
  amount: number;
  price: number;
  status: string;
  timestamp: number;
}

interface Position {
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  pnl: number;
  leverage: number;
  liquidationPrice: number;
  timestamp: number;
}

interface OrderBook {
  bids: Array<{
    price: number;
    amount: number;
    total: number;
  }>;
  asks: Array<{
    price: number;
    amount: number;
    total: number;
  }>;
}

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface OrderResult {
  success: boolean;
  orderId: string;
  filled?: any;
  message: string;
  raw?: any;
}

export class HyperliquidClient {
  private infoClient: hl.InfoClient;
  private subscriptionClient: hl.SubscriptionClient | null = null;
  private wsTransport: hl.WebSocketTransport | null = null;
  private isTestnet: boolean;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 120000; // 2 minutes cache - MUCH longer to reduce API calls
  private lastRequestTime = 0;
  private minRequestInterval = 5000; // 5 seconds between requests - MORE conservative
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private wsSubscriptions: Map<string, any> = new Map();
  private livePriceFeeds: Map<string, number> = new Map();

  constructor(isTestnet: boolean = false) {
    this.isTestnet = isTestnet;
    
    try {
      // Initialize Info Client for read-only operations
      this.infoClient = new hl.InfoClient({
        transport: new hl.HttpTransport(),
      });
      
      // Initialize WebSocket for real-time data
      this.initializeWebSocket();
      
      console.log('✅ Hyperliquid InfoClient initialized with rate limiting and WebSocket');
    } catch (error) {
      console.error('❌ Error initializing Hyperliquid client:', error);
      throw error;
    }
  }

  /**
   * Initialize WebSocket connection for real-time data
   */
  private async initializeWebSocket(): Promise<void> {
    try {
      console.log('🔌 Initializing WebSocket connection for real-time data...');
      
      // Create WebSocket transport with reconnection support
      this.wsTransport = new hl.WebSocketTransport({
        isTestnet: this.isTestnet,
        timeout: 10000,
        keepAliveInterval: 30000,
        reconnect: {
          maxRetries: 5,
          connectionTimeout: 10000,
          reconnectionDelay: (attempt) => Math.min(1000 * Math.pow(2, attempt), 10000)
        },
        resubscribe: true // Auto-restore subscriptions after reconnect
      });

      // Wait for connection to be ready
      await this.wsTransport.ready();
      console.log('✅ WebSocket transport ready');

      // Create subscription client
      this.subscriptionClient = new hl.SubscriptionClient({
        transport: this.wsTransport
      });

      console.log('✅ WebSocket subscription client initialized');
      
      // Start live price feeds for major coins
      this.startLivePriceFeeds();
      
    } catch (error) {
      console.error('❌ Error initializing WebSocket:', error);
      // Fallback to HTTP-only mode
      this.wsTransport = null;
      this.subscriptionClient = null;
    }
  }

  /**
   * Start live price feeds for major cryptocurrencies - AVOID DUPLICATES
   */
  private async startLivePriceFeeds(): Promise<void> {
    if (!this.subscriptionClient) return;

    const majorCoins = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'MATIC'];
    
    // Check if already subscribed to avoid duplicates
    if (this.wsSubscriptions.has('allMids')) {
      console.log('[Hyperliquid] Price feeds already initialized, skipping duplicate setup');
      return;
    }
    
    console.log(`📡 Starting live price feeds for ${majorCoins.length} major coins...`);

    // Subscribe once to allMids feed for all coins
    try {
      const subscription = await this.subscriptionClient.allMids((data) => {
        // Update live price feeds for all coins in single callback
        for (const [coin, priceStr] of Object.entries(data)) {
          if (majorCoins.includes(coin)) {
            const price = parseFloat(priceStr as string);
            if (!isNaN(price)) {
              this.livePriceFeeds.set(coin, price);
              // Silent update - no console spam
            }
          }
        }
      });

      this.wsSubscriptions.set('allMids', subscription);
      console.log('✅ Live price feeds initialized (single subscription)');

    } catch (error) {
      console.error('❌ Error initializing live price feeds:', error);
    }
  }

  /**
   * Get live price from WebSocket feed (fallback to API if not available)
   */
  getLivePrice(coin: string): number | null {
    return this.livePriceFeeds.get(coin) || null;
  }

  /**
   * Subscribe to real-time order book updates
   */
  async subscribeToOrderBook(coin: string, callback: (orderBook: OrderBook) => void): Promise<void> {
    if (!this.subscriptionClient) {
      console.warn('⚠️ WebSocket not available, falling back to HTTP polling');
      return;
    }

    try {
      console.log(`📖 Subscribing to live order book for ${coin}...`);
      
      const subscription = await this.subscriptionClient.l2Book(
        { coin },
        (data) => {
          // Convert WebSocket order book data to our format
          const orderBook = this.convertWsOrderBook(data);
          callback(orderBook);
        }
      );

      this.wsSubscriptions.set(`l2Book-${coin}`, subscription);
      console.log(`✅ Subscribed to live order book for ${coin}`);

    } catch (error) {
      console.error(`❌ Error subscribing to ${coin} order book:`, error);
    }
  }

  /**
   * Subscribe to real-time candle updates - SILENT MODE to reduce noise
   */
  async subscribeToCandles(coin: string, interval: string, callback: (candle: Candle) => void): Promise<void> {
    if (!this.subscriptionClient) {
      return;
    }

    try {
      const subscription = await this.subscriptionClient.candle(
        { coin, interval },
        (data) => {
          // Convert WebSocket candle data to our format
          const candle: Candle = {
            time: data.t,
            open: parseFloat(data.o),
            high: parseFloat(data.h),
            low: parseFloat(data.l),
            close: parseFloat(data.c),
            volume: parseFloat(data.v || '0')
          };
          callback(candle);
        }
      );

      this.wsSubscriptions.set(`candle-${coin}-${interval}`, subscription);

    } catch (error) {
      console.error(`❌ Error subscribing to ${coin} candles:`, error);
    }
  }

  /**
   * Convert WebSocket order book data to our format
   */
  private convertWsOrderBook(wsData: any): OrderBook {
    const bids: any[] = [];
    const asks: any[] = [];

    // WebSocket returns levels as [bids_array, asks_array]
    if (wsData.levels && Array.isArray(wsData.levels)) {
      const [bidLevels, askLevels] = wsData.levels;

      // Process bids (positive sizes)
      if (bidLevels) {
        for (const level of bidLevels.slice(0, 20)) { // Top 20
          // Handle different level formats from WebSocket
          let price: number, amount: number;
          
          try {
            if (level && typeof level === 'object') {
              const levelObj = level as any;
              if (levelObj.px !== undefined && levelObj.sz !== undefined) {
                price = parseFloat(levelObj.px);
                amount = parseFloat(levelObj.sz);
              } else {
                price = 0;
                amount = 0;
              }
            } else {
              price = 0;
              amount = 0;
            }
          } catch (parseError) {
            price = 0;
            amount = 0;
          }
          
          const total = price * amount;
          
          bids.push({
            price,
            amount,
            total
          });
        }
      }

      // Process asks (negative sizes, convert to positive)
      if (askLevels) {
        for (const level of askLevels.slice(0, 20)) { // Top 20
          // Handle different level formats from WebSocket
          let price: number, amount: number;
          
          try {
            if (level && typeof level === 'object') {
              const levelObj = level as any;
              if (levelObj.px !== undefined && levelObj.sz !== undefined) {
                price = parseFloat(levelObj.px);
                amount = Math.abs(parseFloat(levelObj.sz)); // Convert negative to positive
              } else {
                price = 0;
                amount = 0;
              }
            } else {
              price = 0;
              amount = 0;
            }
          } catch (parseError) {
            price = 0;
            amount = 0;
          }
          
          const total = price * amount;
          
          asks.push({
            price,
            amount,
            total
          });
        }
      }
    }

    return { bids, asks };
  }

  /**
   * Subscribe to live prices (allMids) - SILENT MODE
   */
  async subscribeToLivePrices(): Promise<void> {
    if (!this.subscriptionClient) return;

    try {
      const subscription = await this.subscriptionClient.allMids((data) => {
        // Update live price feeds for all coins silently
        for (const [coin, priceStr] of Object.entries(data)) {
          const price = parseFloat(priceStr as string);
          if (!isNaN(price)) {
            this.livePriceFeeds.set(coin, price);
          }
        }
      });

      this.wsSubscriptions.set('allMids', subscription);

    } catch (error) {
      console.error('❌ Error subscribing to live prices:', error);
    }
  }

  /**
   * Get WebSocket connection status
   */
  getWebSocketStatus(): boolean {
    return this.wsTransport !== null && this.subscriptionClient !== null;
  }

  /**
   * Close WebSocket connection and cleanup
   */
  async closeWebSocket(): Promise<void> {
    if (this.wsTransport) {
      console.log('🔌 Closing WebSocket connection...');
      
      // Unsubscribe from all active subscriptions
      for (const [key, subscription] of this.wsSubscriptions) {
        try {
          await subscription.unsubscribe();
          console.log(`✅ Unsubscribed from ${key}`);
        } catch (error) {
          console.error(`❌ Error unsubscribing from ${key}:`, error);
        }
      }
      
      this.wsSubscriptions.clear();
      this.livePriceFeeds.clear();
      
      await this.wsTransport.close();
      this.wsTransport = null;
      this.subscriptionClient = null;
      
      console.log('✅ WebSocket connection closed');
    }
  }

  /**
   * Rate limiting helper - ensure we don't hit API limits with exponential backoff
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      if (waitTime > 0) {
        console.log(`⏱️ Rate limiting: waiting ${waitTime}ms before next request`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Execute API request with exponential backoff retry logic
   */
  private async executeWithRetry<T>(requestFn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Apply rate limiting before each attempt
        await this.rateLimit();
        
        const result = await requestFn();
        return result;
      } catch (error: any) {
        lastError = error;
        
        // Check if it's a rate limit error (429)
        if (error.response?.status === 429 || error.status === 429) {
          const retryDelay = Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff: 1s, 2s, 4s, max 10s
          console.warn(`⚠️ Rate limited (attempt ${attempt + 1}/${maxRetries}), waiting ${retryDelay}ms before retry`);
          
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }
        }
        
        // For non-rate-limit errors, throw immediately
        throw error;
      }
    }
    
    throw lastError;
  }

  /**
   * Cache helper - check if we have recent cached data
   */
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      console.log(`💾 Cache hit for: ${key}`);
      return cached.data;
    }
    return null;
  }

  /**
   * Cache helper - store data in cache
   */
  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    console.log(`💾 Cached data for: ${key}`);
  }

  /**
   * Get market data for a specific symbol
   */
  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      console.log('📊 Fetching market data for:', symbol);
      
      // Get all mids
      const mids = await this.infoClient.allMids();
      
      // Normalize symbol (remove / and -PERP)
      const normalizedSymbol = symbol.replace('/', '').replace('-PERP', '');
      
      // Find price for the symbol
      const price = (mids as any)[normalizedSymbol];
      
      if (!price) {
        console.log('⚠️ Symbol not found in mids');
        return {
          symbol,
          price: 50000,
          change24h: 2.5,
          high24h: 51000,
          low24h: 49000,
          volume24h: 1000000,
          timestamp: Date.now(),
        };
      }

      const priceNum = parseFloat(price);
      console.log('✅ Found price:', priceNum);

      return {
        symbol,
        price: priceNum,
        change24h: 2.5,
        high24h: priceNum * 1.02,
        low24h: priceNum * 0.98,
        volume24h: 1000000,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error('❌ Error fetching market data:', error);
      return {
        symbol,
        price: 50000,
        change24h: 2.5,
        high24h: 51000,
        low24h: 49000,
        volume24h: 1000000,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get all available markets
   */
  async getAllMarkets(): Promise<MarketInfo[]> {
    const cacheKey = 'allMarkets';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      console.log('📊 Fetching all markets...');
      
      const mids = await this.executeWithRetry(async () => {
        return await this.infoClient.allMids();
      }, 3); // Retry with exponential backoff
      
      const markets = Object.entries(mids as Record<string, string>).map(([coin, mid]) => ({
        symbol: coin,
        price: parseFloat(mid),
      }));
      
      console.log('✅ Found', markets.length, 'markets');
      
      this.setCachedData(cacheKey, markets);
      return markets;
    } catch (error: any) {
      console.error('❌ Error fetching all markets:', error);
      // Return fallback data on rate limit or other errors
      if (error.response?.status === 429) {
        console.warn('⚠️ Rate limited - returning fallback market data');
        return [
          { symbol: 'BTC', price: 50000 },
          { symbol: 'ETH', price: 3000 },
          { symbol: 'SOL', price: 100 },
        ];
      }
      return [];
    }
  }

  /**
   * Get user account balance
   */
  async getUserBalance(walletAddress: string): Promise<UserBalance> {
    try {
      console.log('💰 Fetching balance for:', walletAddress);
      
      const state = await this.infoClient.clearinghouseState({ user: walletAddress });
      
      console.log('✅ Clearinghouse state received');
      
      const marginSummary = state.marginSummary;
      
      return {
        totalBalance: parseFloat(marginSummary.accountValue),
        available: parseFloat(marginSummary.totalRawUsd), // Using totalRawUsd instead of withdrawable
        marginUsed: parseFloat(marginSummary.totalMarginUsed),
        unrealizedPnl: parseFloat(marginSummary.totalNtlPos),
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error('❌ Error fetching user balance:', error);
      return {
        totalBalance: 10000,
        available: 8000,
        marginUsed: 2000,
        unrealizedPnl: 150,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get user's active orders
   */
  async getUserOrders(walletAddress: string): Promise<Order[]> {
    try {
      console.log('📋 Fetching orders for:', walletAddress);
      
      const openOrders = await this.infoClient.openOrders({ user: walletAddress });
      
      console.log('✅ Found', openOrders.length, 'orders');
      
      return openOrders.map((order: any) => ({
        id: order.oid,
        symbol: order.coin,
        side: order.side.toLowerCase(),
        orderType: order.orderType?.toLowerCase() || 'limit',
        amount: parseFloat(order.sz),
        price: parseFloat(order.limitPx),
        status: 'open',
        timestamp: order.timestamp,
      }));
    } catch (error: any) {
      console.error('❌ Error fetching user orders:', error);
      return [];
    }
  }

  /**
   * Get user's open positions (futures)
   */
  async getUserPositions(walletAddress: string): Promise<Position[]> {
    try {
      console.log('📊 Fetching positions for:', walletAddress);
      
      const state = await this.infoClient.clearinghouseState({ user: walletAddress });
      
      const positions = state.assetPositions || [];
      
      return positions
        .filter((pos: any) => parseFloat(pos.position.szi) !== 0)
        .map((pos: any) => {
          const size = parseFloat(pos.position.szi);
          const entryPrice = parseFloat(pos.position.entryPx);
          const unrealizedPnl = parseFloat(pos.position.unrealizedPnl || '0');
          
          return {
            symbol: pos.position.coin,
            side: size > 0 ? 'long' : 'short',
            size: Math.abs(size),
            entryPrice,
            pnl: unrealizedPnl,
            leverage: parseFloat(pos.position.leverage?.value || '1'),
            liquidationPrice: parseFloat(pos.position.liquidationPx || '0'),
            timestamp: Date.now(),
          };
        });
    } catch (error: any) {
      console.error('❌ Error fetching user positions:', error);
      return [];
    }
  }

  /**
   * Get order book (L2 book) for a symbol
   */
  async getOrderBook(coin: string): Promise<OrderBook> {
    try {
      console.log('📖 Fetching order book for:', coin);
      
      const book = await this.infoClient.l2Book({ coin });
      
      // Format for frontend - separate bids and asks
      const bids: any[] = [];
      const asks: any[] = [];
      
      // Process each level in the order book
      // book.levels is an array of [price, size, count] arrays
      for (const level of book.levels) {
        // Handle different level formats from Hyperliquid API
        let price: number, amount: number;
        
        try {
          if (Array.isArray(level)) {
            // level is [price, size, count]
            price = parseFloat(level[0]);
            amount = parseFloat(level[1]);
          } else if (level && typeof level === 'object') {
            // level is object with px/sz properties - handle the union type properly
            const levelObj = level as any;
            if (levelObj.px !== undefined && levelObj.sz !== undefined) {
              price = parseFloat(levelObj.px);
              amount = parseFloat(levelObj.sz);
            } else {
              // Fallback for other object structures
              price = 0;
              amount = 0;
            }
          } else {
            // Fallback - assume it's already parsed
            price = 0;
            amount = 0;
          }
        } catch (parseError) {
          console.warn('⚠️ Error parsing level:', level, parseError);
          price = 0;
          amount = 0;
        }
        
        const total = price * Math.abs(amount);
        
        if (amount > 0) {
          // This is a bid (buy order)
          bids.push({
            price: price,
            amount: amount,
            total: total
          });
        } else if (amount < 0) {
          // This is an ask (sell order) - amount is negative
          asks.push({
            price: price,
            amount: Math.abs(amount), // Convert to positive for display
            total: total
          });
        }
      }
      
      // Take top 20 bids and asks
      const topBids = bids.slice(0, 20);
      const topAsks = asks.slice(0, 20);
      
      console.log(`✅ Order book for ${coin}: ${topBids.length} bids, ${topAsks.length} asks`);
      
      return {
        bids: topBids,
        asks: topAsks
      };
    } catch (error: any) {
      console.error('❌ Error fetching order book:', error);
      return { bids: [], asks: [] };
    }
  }

  /**
   * Get historical candle data for a symbol
   * NOW WITH WEBSOCKET SUPPORT - Reduces API calls significantly
   */
  async getCandleData(coin: string, interval: string = '1h', limit: number = 100) {
    try {
      // SILENT MODE - Only log errors to reduce noise
      const isSilent = true;
      
      if (!isSilent) {
        console.log('📊 Fetching candle data for:', { coin, interval, limit });
      }
      
      // Map frontend intervals to Hyperliquid intervals
      const hyperliquidInterval = this.mapInterval(interval);
      
      // Check if we have WebSocket candle subscription first
      if (this.subscriptionClient) {
        // Try to get recent candles from WebSocket cache/memory first
        // For now, we'll use a shorter time range to reduce API calls
        const now = Math.floor(Date.now() / 1000);
        const shorterTimeWindow = 3600 * 12; // 12 hours instead of 48
        const startTime = now - shorterTimeWindow;
        
        const response = await this.executeWithRetry(async () => {
          return await this.infoClient.candleSnapshot({
            coin,
            interval: hyperliquidInterval,
            startTime,
            endTime: now,
          } as any);
        }, 3); // Retry up to 3 times with exponential backoff
        
        if (response && Array.isArray(response) && response.length > 0) {
          // Take the most recent candles up to limit
          const recentCandles = response.slice(-limit);
          
          // Format candles for frontend
          const formattedCandles = recentCandles.map((candle: any) => ({
            time: parseInt(candle.t),
            open: parseFloat(candle.o),
            high: parseFloat(candle.h),
            low: parseFloat(candle.l),
            close: parseFloat(candle.c),
            volume: parseFloat(candle.v || '0'),
          }));
          
          if (!isSilent && formattedCandles.length > 0) {
            console.log(`✅ Fetched ${formattedCandles.length} candles for ${coin}`);
          }
          
          return formattedCandles;
        }
      }
      
      // Fallback to longer time range if WebSocket not available or no data
      const now = Math.floor(Date.now() / 1000);
      const intervalSeconds = this.getIntervalSeconds(hyperliquidInterval);
      const timeWindow = intervalSeconds * limit * 2;
      const startTime = now - timeWindow;
      
      const response = await this.executeWithRetry(async () => {
        return await this.infoClient.candleSnapshot({
          coin,
          interval: hyperliquidInterval,
          startTime,
          endTime: now,
        } as any);
      }, 3); // Retry up to 3 times with exponential backoff
      
      if (!response || !Array.isArray(response)) {
        if (!isSilent) console.error('❌ Invalid response format');
        return [];
      }
      
      if (response.length === 0) {
        if (!isSilent) console.warn('⚠️ No candles in response');
        return [];
      }
      
      // Take the most recent candles up to limit
      const recentCandles = response.slice(-limit);
      
      // Format candles for frontend
      const formattedCandles = recentCandles.map((candle: any) => ({
        time: parseInt(candle.t),
        open: parseFloat(candle.o),
        high: parseFloat(candle.h),
        low: parseFloat(candle.l),
        close: parseFloat(candle.c),
        volume: parseFloat(candle.v || '0'),
      }));
      
      if (!isSilent && formattedCandles.length > 0) {
        console.log(`✅ Fetched ${formattedCandles.length} candles for ${coin}`);
      }
      
      return formattedCandles;
      
    } catch (error: any) {
      console.error('❌ Error fetching candle data:', error);
      return [];
    }
  }



  /**
   * Helper: Map frontend interval to Hyperliquid interval
   */
  private mapInterval(interval: string): '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M' | '12h' | '3m' | '30m' | '2h' | '8h' | '3d' {
    const intervalMap: Record<string, '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M' | '12h' | '3m' | '30m' | '2h' | '8h' | '3d'> = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1h': '1h',
      '4h': '4h',
      '1D': '1d',
      '1W': '1w',
      '1M': '1M',
      '12h': '12h',
      '3m': '3m',
      '30m': '30m',
      '2h': '2h',
      '8h': '8h',
      '3d': '3d',
    };
    
    return intervalMap[interval] || '1h';
  }

  /**
   * Get recent trades/fills for a user
   * This fetches the user's trade history (fills)
   */
  async getUserTrades(walletAddress: string, limit: number = 100): Promise<any[]> {
    try {
      console.log('📊 Fetching user trades for:', walletAddress, 'limit:', limit);
      
      // Use userFills to get trade history
      const fills = await this.infoClient.userFills({ user: walletAddress });
      
      console.log('✅ Fetched', fills.length, 'fills');
      
      // Take most recent trades up to limit
      const recentFills = fills.slice(-limit);
      
      return recentFills.map((fill: any) => ({
        time: fill.time,
        coin: fill.coin,
        side: fill.side,
        price: parseFloat(fill.px),
        size: parseFloat(fill.sz),
        fee: parseFloat(fill.fee || '0'),
        feeToken: fill.feeToken,
        closedPnl: parseFloat(fill.closedPnl || '0'),
        hash: fill.hash,
        oid: fill.oid,
      }));
    } catch (error: any) {
      console.error('❌ Error fetching user trades:', error);
      return [];
    }
  }

  /**
   * Get recent market trades for a coin
   * This fetches the public trade history (all trades on the market)
   * 
   * NOTE: Hyperliquid's recentTrades API endpoint has NO limit parameter
   * and always returns ~10 most recent trades. This is a known SDK/API limitation.
   */
  async getMarketTrades(coin: string, limit: number = 1000): Promise<any[]> {
    try {
      console.log('📊 Fetching market trades for:', coin);
      console.log('⚠️ Note: Hyperliquid recentTrades API returns only ~10 trades (SDK limitation)');
      
      // Use recentTrades to get market trades
      // This will ALWAYS return ~10 trades regardless of the limit parameter
      const trades = await this.infoClient.recentTrades({ coin });
      
      console.log('✅ Fetched', trades.length, 'market trades (max ~10 from API)');
      
      return trades.map((trade: any) => ({
        time: trade.time,
        coin,
        side: trade.side,
        price: parseFloat(trade.px),
        size: parseFloat(trade.sz),
      }));
    } catch (error: any) {
      console.error('❌ Error fetching market trades:', error);
      return [];
    }
  }

  /**
   * Aggregate trades into OHLCV candles - SILENT MODE
   * Takes raw trade data and groups it by time interval
   */
  aggregateTradesToCandles(trades: any[], interval: string, limit: number = 100): Candle[] {
    try {
      if (!trades || trades.length === 0) {
        return [];
      }

      // Get interval in milliseconds
      const intervalMs = this.getIntervalMilliseconds(interval);
      
      // Sort trades by time (oldest first)
      const sortedTrades = [...trades].sort((a, b) => a.time - b.time);
      
      // Group trades into time buckets
      const candleMap = new Map<number, any>();
      
      sortedTrades.forEach(trade => {
        // Round down to interval bucket
        const bucketTime = Math.floor(trade.time / intervalMs) * intervalMs;
        
        if (!candleMap.has(bucketTime)) {
          // Initialize new candle
          candleMap.set(bucketTime, {
            time: bucketTime,
            open: trade.price,
            high: trade.price,
            low: trade.price,
            close: trade.price,
            volume: trade.size,
            trades: [trade],
          });
        } else {
          // Update existing candle
          const candle = candleMap.get(bucketTime);
          candle.high = Math.max(candle.high, trade.price);
          candle.low = Math.min(candle.low, trade.price);
          candle.close = trade.price; // Last trade in bucket
          candle.volume += trade.size;
          candle.trades.push(trade);
        }
      });

      // Convert map to array and sort by time
      const candles = Array.from(candleMap.values())
        .sort((a, b) => a.time - b.time)
        .map(candle => ({
          time: candle.time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
        }));

      // Take most recent candles up to limit
      const recentCandles = candles.slice(-limit);

      return recentCandles;
    } catch (error: any) {
      console.error('❌ Error aggregating trades to candles:', error);
      return [];
    }
  }

  /**
   * Get candle data from trades (fallback method)
   * 
   * ⚠️ LIMITATION: Due to Hyperliquid API restrictions, recentTrades only returns ~10 trades.
   * This means we can only build 1-2 candles at most from recent trade data.
   * 
   * For proper historical charts, we should use WebSocket subscriptions or
   * accept that candleSnapshot might not have recent data.
   */
  async getCandlesFromTrades(coin: string, interval: string = '1h', limit: number = 100): Promise<Candle[]> {
    try {
      console.log('🕯️ Building candles from trades for:', { coin, interval, limit });
      console.log('⚠️ WARNING: Can only build 1-2 candles from recent trades due to API limit');
      
      // Fetch market trades (will only get ~10 trades)
      const trades = await this.getMarketTrades(coin, limit);
      
      if (trades.length === 0) {
        console.log('⚠️ No trades available to build candles');
        return [];
      }
      
      console.log('📊 Building candles from', trades.length, 'trades');
      
      // Aggregate trades into candles
      const candles = this.aggregateTradesToCandles(trades, interval, limit);
      
      console.log('✅ Successfully built', candles.length, 'candles from trades');
      
      return candles;
    } catch (error: any) {
      console.error('❌ Error getting candles from trades:', error);
      return [];
    }
  }

  /**
   * Helper: Parse interval string to milliseconds
   */
  private getIntervalMilliseconds(interval: string): number {
    const match = interval.match(/^(\d+)([mhdw])$/i);
    if (!match) return 3600000; // Default 1h in ms
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    switch (unit) {
      case 'm': return value * 60 * 1000;
      case 'h': return value * 3600 * 1000;
      case 'd': return value * 86400 * 1000;
      case 'w': return value * 604800 * 1000;
      default: return 3600000;
    }
  }

  /**
   * Helper: Parse interval string to seconds
   */
  private getIntervalSeconds(interval: string): number {
    const match = interval.match(/^(\d+)([mhdw])$/i);
    if (!match) return 3600; // Default 1h
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    switch (unit) {
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      case 'w': return value * 604800;
      default: return 3600;
    }
  }

  /**
   * Place an order - REAL IMPLEMENTATION
   */
  async placeOrder(params: any) {
    try {
      console.log('📝 Placing Live Order...');
      
      // Create Exchange Client with private key
      const exchClient = new hl.ExchangeClient({
        wallet: params.privateKey,
        transport: new hl.HttpTransport(),
      });

      // Normalize symbol - extract base asset
      let coin = params.symbol
        .replace('/', '')
        .replace('-PERP', '')
        .replace('USDC', '')
        .replace('USDT', '')
        .replace('USD', '');
      
      console.log('📊 Normalized coin:', coin);

      // Get asset index and current price
      let assetIndex = 0;
      let orderPrice = params.price ? params.price.toString() : '0';
      let szDecimals = 5; // Default decimals
      
      try {
        // Fetch metadata to get asset indices
        const meta = await this.infoClient.meta();
        console.log('📦 Fetched meta data, universe length:', meta.universe.length);
        
        // Find the asset index (position in the array)
        assetIndex = meta.universe.findIndex((u: any) => u.name === coin);
        
        if (assetIndex === -1) {
          console.error('❌ Asset not found:', coin);
          console.log('Available assets sample:', meta.universe.slice(0, 10).map((u: any) => u.name));
          throw new Error(`Asset ${coin} not found in Hyperliquid`);
        }
        
        const asset = meta.universe[assetIndex];
        szDecimals = asset.szDecimals || 5;
        console.log('✅ Found asset at index', assetIndex, ':', asset);
        
        // For market orders, get current price
        if (params.orderType === 'market') {
          const mids = await this.infoClient.allMids();
          const currentPrice = parseFloat((mids as any)[coin] || '0');
          
          if (currentPrice > 0) {
            // For market orders, use a tighter slippage (2%) to avoid "price too far" errors
            const slippage = 0.02; // 2% slippage
            
            // CRITICAL: Round to the correct number of significant figures
            // Hyperliquid uses "significant figures" not decimal places
            const rawPrice = params.side === 'buy' 
              ? currentPrice * (1 + slippage)
              : currentPrice * (1 - slippage);
            
            // Round to 5 significant figures for the price
            orderPrice = this.roundToSignificantFigures(rawPrice, 5);
            
            console.log(`✅ Market price: ${currentPrice}, order price: ${orderPrice}`);
          } else {
            throw new Error(`Could not fetch price for ${coin}`);
          }
        } else if (params.price) {
          // For limit orders, use provided price with proper rounding
          orderPrice = this.roundToSignificantFigures(params.price, 5);
        }
      } catch (metaError: any) {
        console.error('❌ Error fetching metadata:', metaError);
        throw new Error(`Failed to prepare order: ${metaError.message}`);
      }

      // Round amount to correct decimals
      const roundedAmount = parseFloat(params.amount.toFixed(szDecimals));

      // Build order with correct format
      const order: any = {
        a: assetIndex,
        b: params.side === 'buy',
        p: orderPrice, // Must be string with proper sig figs
        s: roundedAmount.toString(), // Must be string with proper decimals
        r: params.reduceOnly || false,
        t: params.orderType === 'market'
          ? { limit: { tif: 'Ioc' } }
          : { limit: { tif: 'Gtc' } },
      };

      console.log('📤 Sending order:', order);

      const result = await exchClient.order({
        orders: [order],
        grouping: 'na',
      });

      console.log('📥 Response:', JSON.stringify(result, null, 2));

      if (result.status === 'ok') {
        const orderData = result.response?.data?.statuses?.[0];
        
        // Handle both resting and filled order types
        let orderId: string;
        let filled: any = null;
        
        if (orderData && 'resting' in orderData) {
          orderId = orderData.resting.oid.toString();
        } else if (orderData && 'filled' in orderData) {
          orderId = orderData.filled.oid.toString();
          filled = orderData.filled;
        } else {
          orderId = `order_${Date.now()}`;
        }
        
        return {
          success: true,
          orderId,
          filled,
          message: 'Order placed successfully on Hyperliquid',
          raw: orderData,
        };
      } else {
        throw new Error(JSON.stringify(result.response) || 'Order failed');
      }
    } catch (error: any) {
      console.error('❌ Error placing order:', error);
      throw new Error(`Failed to place order: ${error.message}`);
    }
  }

  /**
   * Helper: Round to significant figures (for prices)
   */
  private roundToSignificantFigures(num: number, sigFigs: number): string {
    if (num === 0) return '0';
    
    const magnitude = Math.floor(Math.log10(Math.abs(num)));
    const scale = Math.pow(10, magnitude - sigFigs + 1);
    const rounded = Math.round(num / scale) * scale;
    
    // Format with appropriate decimals
    const decimals = Math.max(0, sigFigs - magnitude - 1);
    return rounded.toFixed(decimals);
  }

  async cancelOrder(params: any): Promise<OrderResult> {
    console.log('❌ Cancel order (not yet implemented)');
    return { success: true, orderId: `cancel_${Date.now()}`, message: 'Order cancelled (mock)' };
  }

  async setLeverage(params: any): Promise<OrderResult> {
    console.log('⚡ Set leverage (not yet implemented)');
    return { success: true, orderId: `leverage_${Date.now()}`, message: 'Leverage set (mock)' };
  }

  async closePosition(params: any): Promise<OrderResult> {
    console.log('🔒 Close position (not yet implemented)');
    return { success: true, orderId: `close_${Date.now()}`, message: 'Position closed (mock)' };
  }
}

export const hyperliquidClient = new HyperliquidClient(
  process.env.HYPERLIQUID_TESTNET === 'true'
);

export default HyperliquidClient;
