import crypto from 'crypto';

const COINBASE_API_KEY = process.env.COINBASE_API_KEY || '1600553b-7593-4278-9fa1-09124c199955';
const COINBASE_SECRET = process.env.COINBASE_SECRET_KEY || 'T53J/Htmqp6h3mUh7wjohlk4TQjuOc1x5WK6hY17q7+WX4EuQvxbsMqx7bEKRM+msMWMhDas0sr3vUpocdFLaQ==';
const COINBASE_BASE_URL = 'https://api.exchange.coinbase.com';

class CoinbaseService {
  private apiKey: string;
  private apiSecret: string;

  constructor() {
    this.apiKey = COINBASE_API_KEY;
    this.apiSecret = COINBASE_SECRET;
    console.log('[Coinbase] Professional exchange service initialized');
  }

  // Generate authentication signature for Coinbase Pro API
  private generateSignature(timestamp: string, method: string, requestPath: string, body: string = ''): string {
    const message = timestamp + method.toUpperCase() + requestPath + body;
    const key = Buffer.from(this.apiSecret, 'base64');
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(message);
    return hmac.digest('base64');
  }

  // Make authenticated request to Coinbase Pro API
  private async makeRequest(method: string, endpoint: string, body?: any): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const requestPath = endpoint;
    const bodyString = body ? JSON.stringify(body) : '';
    
    const signature = this.generateSignature(timestamp, method, requestPath, bodyString);
    
    const headers = {
      'CB-ACCESS-KEY': this.apiKey,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-PASSPHRASE': 'your-passphrase', // This would need to be provided
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(`${COINBASE_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: bodyString || undefined
      });

      if (!response.ok) {
        throw new Error(`Coinbase API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[Coinbase] API request failed:', error);
      throw error;
    }
  }

  // Get all trading products
  async getProducts(): Promise<any[]> {
    try {
      return await this.makeRequest('GET', '/products');
    } catch (error) {
      console.error('[Coinbase] Error fetching products:', error);
      // Return public endpoint data as fallback
      return this.getPublicProducts();
    }
  }

  // Get public products (no authentication required)
  async getPublicProducts(): Promise<any[]> {
    try {
      const response = await fetch(`${COINBASE_BASE_URL}/products`);
      return await response.json();
    } catch (error) {
      console.error('[Coinbase] Error fetching public products:', error);
      throw error;
    }
  }

  // Get 24hr stats for a product
  async getProduct24HrStats(productId: string): Promise<any> {
    try {
      const response = await fetch(`${COINBASE_BASE_URL}/products/${productId}/stats`);
      return await response.json();
    } catch (error) {
      console.error(`[Coinbase] Error fetching stats for ${productId}:`, error);
      throw error;
    }
  }

  // Get order book for a product
  async getOrderBook(productId: string, level: number = 2): Promise<any> {
    try {
      const response = await fetch(`${COINBASE_BASE_URL}/products/${productId}/book?level=${level}`);
      return await response.json();
    } catch (error) {
      console.error(`[Coinbase] Error fetching order book for ${productId}:`, error);
      throw error;
    }
  }

  // Get recent trades for a product
  async getTrades(productId: string, limit: number = 100): Promise<any[]> {
    try {
      const response = await fetch(`${COINBASE_BASE_URL}/products/${productId}/trades`);
      const trades = await response.json();
      return trades.slice(0, limit);
    } catch (error) {
      console.error(`[Coinbase] Error fetching trades for ${productId}:`, error);
      throw error;
    }
  }

  // Get current ticker for a product
  async getTicker(productId: string): Promise<any> {
    try {
      const response = await fetch(`${COINBASE_BASE_URL}/products/${productId}/ticker`);
      return await response.json();
    } catch (error) {
      console.error(`[Coinbase] Error fetching ticker for ${productId}:`, error);
      throw error;
    }
  }

  // Get historical candles (OHLCV data)
  async getCandles(productId: string, start?: string, end?: string, granularity: number = 3600): Promise<any[]> {
    try {
      let url = `${COINBASE_BASE_URL}/products/${productId}/candles?granularity=${granularity}`;
      if (start) url += `&start=${start}`;
      if (end) url += `&end=${end}`;
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error(`[Coinbase] Error fetching candles for ${productId}:`, error);
      throw error;
    }
  }

  // Transform Coinbase data to our market data format
  transformToMarketData(ticker: any, stats: any, productId: string) {
    return {
      symbol: productId.replace('-', '/'),
      price: ticker.price || '0',
      change24h: ((parseFloat(ticker.price) - parseFloat(stats.last)) / parseFloat(stats.last) * 100).toString(),
      volume24h: stats.volume || '0',
      marketCap: '0', // Not provided by Coinbase
      high24h: stats.high || '0',
      low24h: stats.low || '0',
      updatedAt: new Date()
    };
  }

  // Get multiple market data efficiently
  async getMultipleMarketData(productIds: string[]): Promise<any[]> {
    try {
      const results = await Promise.allSettled(
        productIds.map(async (productId) => {
          const [ticker, stats] = await Promise.all([
            this.getTicker(productId),
            this.getProduct24HrStats(productId)
          ]);
          return this.transformToMarketData(ticker, stats, productId);
        })
      );

      return results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);
    } catch (error) {
      console.error('[Coinbase] Error fetching multiple market data:', error);
      throw error;
    }
  }
}

export const coinbaseService = new CoinbaseService();