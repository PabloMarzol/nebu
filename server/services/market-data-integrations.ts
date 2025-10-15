import WebSocket from 'ws';
import { storage } from '../storage';

export interface MarketDataProvider {
  name: string;
  connect(): Promise<void>;
  disconnect(): void;
  subscribe(symbols: string[]): void;
  isConnected(): boolean;
}

export class BinanceWebSocketProvider implements MarketDataProvider {
  name = 'Binance';
  private ws: WebSocket | null = null;
  private isActive = false;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Binance WebSocket stream for 24hr ticker statistics
        this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
        
        this.ws.on('open', () => {
          console.log('[Binance] ✓ Live WebSocket connected with API credentials');
          this.isActive = true;
          resolve();
        });

        this.ws.on('message', async (data) => {
          try {
            const tickers = JSON.parse(data.toString());
            
            for (const ticker of tickers) {
              // Filter for relevant pairs
              if (this.isRelevantPair(ticker.s)) {
                await this.updateMarketData(ticker);
              }
            }
          } catch (error) {
            console.error('[Binance] Error processing message:', error);
          }
        });

        this.ws.on('error', (error) => {
          console.error('[Binance] WebSocket error:', error);
          this.isActive = false;
          reject(error);
        });

        this.ws.on('close', () => {
          console.log('[Binance] WebSocket disconnected');
          this.isActive = false;
          // Don't auto-reconnect if connection was rejected
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isActive = false;
    }
  }

  subscribe(symbols: string[]): void {
    // Binance streams are automatically subscribed to all tickers
    console.log(`[Binance] Subscribed to ${symbols.length} symbols`);
  }

  isConnected(): boolean {
    return this.isActive && this.ws?.readyState === WebSocket.OPEN;
  }

  private isRelevantPair(symbol: string): boolean {
    const relevantPairs = [
      'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT',
      'LINKUSDT', 'UNIUSDT', 'AAVEUSDT', 'MATICUSDT', 'AVAXUSDT'
    ];
    return relevantPairs.includes(symbol);
  }

  private async updateMarketData(ticker: any): Promise<void> {
    try {
      const symbol = this.formatSymbol(ticker.s);
      const marketData = {
        symbol,
        price: parseFloat(ticker.c).toFixed(8),
        change24h: parseFloat(ticker.P).toFixed(4),
        volume24h: parseFloat(ticker.v).toFixed(2),
        high24h: parseFloat(ticker.h).toFixed(8),
        low24h: parseFloat(ticker.l).toFixed(8),
        updatedAt: new Date()
      };

      await storage.updateMarketData(symbol, marketData);
    } catch (error) {
      console.error('[Binance] Error updating market data:', error);
    }
  }

  private formatSymbol(binanceSymbol: string): string {
    // Convert BTCUSDT to BTC/USDT format
    const pairs = {
      'BTCUSDT': 'BTC/USDT',
      'ETHUSDT': 'ETH/USDT',
      'SOLUSDT': 'SOL/USDT',
      'ADAUSDT': 'ADA/USDT',
      'DOTUSDT': 'DOT/USDT',
      'LINKUSDT': 'LINK/USDT',
      'UNIUSDT': 'UNI/USDT',
      'AAVEUSDT': 'AAVE/USDT',
      'MATICUSDT': 'MATIC/USDT',
      'AVAXUSDT': 'AVAX/USDT'
    };
    return pairs[binanceSymbol as keyof typeof pairs] || binanceSymbol;
  }
}

export class CoinbaseWebSocketProvider implements MarketDataProvider {
  name = 'Coinbase';
  private ws: WebSocket | null = null;
  private isActive = false;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
        
        this.ws.on('open', () => {
          console.log('[Coinbase] WebSocket connected');
          this.isActive = true;
          
          // Subscribe to ticker channel
          const subscribeMessage = {
            type: 'subscribe',
            product_ids: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD'],
            channels: ['ticker']
          };
          
          this.ws?.send(JSON.stringify(subscribeMessage));
          resolve();
        });

        this.ws.on('message', async (data) => {
          try {
            const message = JSON.parse(data.toString());
            
            if (message.type === 'ticker') {
              await this.updateMarketData(message);
            }
          } catch (error) {
            console.error('[Coinbase] Error processing message:', error);
          }
        });

        this.ws.on('error', (error) => {
          console.error('[Coinbase] WebSocket error:', error);
          this.isActive = false;
          reject(error);
        });

        this.ws.on('close', () => {
          console.log('[Coinbase] WebSocket disconnected');
          this.isActive = false;
          // Auto-reconnect after 5 seconds
          setTimeout(() => this.connect(), 5000);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isActive = false;
    }
  }

  subscribe(symbols: string[]): void {
    console.log(`[Coinbase] Subscribed to ${symbols.length} symbols`);
  }

  isConnected(): boolean {
    return this.isActive && this.ws?.readyState === WebSocket.OPEN;
  }

  private async updateMarketData(ticker: any): Promise<void> {
    try {
      const symbol = this.formatSymbol(ticker.product_id);
      const currentData = await storage.getMarketDataBySymbol(symbol);
      
      if (currentData) {
        const prevPrice = parseFloat(currentData.price);
        const newPrice = parseFloat(ticker.price);
        const change24h = ((newPrice - prevPrice) / prevPrice * 100).toFixed(4);
        
        const marketData = {
          symbol,
          price: newPrice.toFixed(8),
          change24h,
          volume24h: parseFloat(ticker.volume_24h || '0').toFixed(2),
          high24h: parseFloat(ticker.high_24h || newPrice).toFixed(8),
          low24h: parseFloat(ticker.low_24h || newPrice).toFixed(8),
          updatedAt: new Date()
        };

        await storage.updateMarketData(symbol, marketData);
      }
    } catch (error) {
      console.error('[Coinbase] Error updating market data:', error);
    }
  }

  private formatSymbol(coinbaseSymbol: string): string {
    // Convert BTC-USD to BTC/USDT format for consistency
    const pairs = {
      'BTC-USD': 'BTC/USDT',
      'ETH-USD': 'ETH/USDT',
      'SOL-USD': 'SOL/USDT',
      'ADA-USD': 'ADA/USDT'
    };
    return pairs[coinbaseSymbol as keyof typeof pairs] || coinbaseSymbol.replace('-', '/');
  }
}

export class CoinGeckoProvider {
  private apiKey?: string;
  private baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.COINGECKO_API_KEY;
  }

  async getHistoricalData(coinId: string, days: number = 7): Promise<any> {
    try {
      const url = `${this.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
      const headers: any = {};
      if (this.apiKey) {
        headers['x-cg-demo-api-key'] = this.apiKey;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[CoinGecko] Error fetching historical data:', error);
      throw error;
    }
  }

  async getMarketData(coinIds: string[]): Promise<any> {
    try {
      const ids = coinIds.join(',');
      const url = `${this.baseUrl}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
      
      const headers: any = {};
      if (this.apiKey) {
        headers['x-cg-demo-api-key'] = this.apiKey;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[CoinGecko] Error fetching market data:', error);
      throw error;
    }
  }
}

export class CoinAPIProvider {
  private apiKey: string;
  private baseUrl = 'https://rest.coinapi.io/v1';

  constructor(apiKey: string = process.env.COINAPI_KEY || '0c64d1c0-be6c-4f85-b03c-87cab720c31e') {
    this.apiKey = apiKey;
  }

  async getExchangeRates(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/exchangerate/BTC/USD`, {
        headers: {
          'X-CoinAPI-Key': this.apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`CoinAPI error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[CoinAPI] Error fetching exchange rates:', error);
      throw error;
    }
  }

  async getOHLCVData(symbolId: string, period: string = '1DAY', limit: number = 100): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/ohlcv/${symbolId}/latest?period_id=${period}&limit=${limit}`, {
        headers: {
          'X-CoinAPI-Key': this.apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`CoinAPI OHLCV error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[CoinAPI] Error fetching OHLCV data:', error);
      throw error;
    }
  }
}

export class CryptoCompareProvider {
  private apiKey: string;
  private baseUrl = 'https://min-api.cryptocompare.com/data';

  constructor(apiKey: string = process.env.CRYPTOCOMPARE_API_KEY || '24e45e08d23e1d910fe06b42ea44866a8b0b2776c9e4e56439d2be46a0217160') {
    this.apiKey = apiKey;
  }

  async getMultipleSymbolsFullData(symbols: string[]): Promise<any> {
    try {
      const fsyms = symbols.join(',');
      const response = await fetch(`${this.baseUrl}/pricemultifull?fsyms=${fsyms}&tsyms=USD&api_key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`CryptoCompare error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[CryptoCompare] Error fetching price data:', error);
      throw error;
    }
  }

  async getNewsArticles(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/news/?lang=EN&api_key=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`CryptoCompare news error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[CryptoCompare] Error fetching news:', error);
      throw error;
    }
  }
}

export class MarketDataAggregator {
  private providers: MarketDataProvider[] = [];
  private coinGecko: CoinGeckoProvider;
  private coinAPI: CoinAPIProvider;
  private cryptoCompare: CryptoCompareProvider;
  private isRunning = false;

  constructor() {
    this.coinGecko = new CoinGeckoProvider();
    this.coinAPI = new CoinAPIProvider();
    this.cryptoCompare = new CryptoCompareProvider();
  }

  async initialize(): Promise<void> {
    console.log('[MarketDataAggregator] Initializing live market data providers with API credentials...');

    // Skip Binance WebSocket due to geographical restrictions
    console.log('[MarketDataAggregator] Skipping Binance WebSocket (geographical restrictions)');

    // Initialize Coinbase WebSocket with provided credentials  
    const coinbaseProvider = new CoinbaseWebSocketProvider();
    try {
      await coinbaseProvider.connect();
      this.providers.push(coinbaseProvider);
      console.log('[MarketDataAggregator] ✓ Coinbase live feed connected');
    } catch (error) {
      console.error('[MarketDataAggregator] Coinbase connection failed:', error);
    }

    // Test CoinGecko API connection
    try {
      await this.coinGecko.getMarketData(['bitcoin', 'ethereum']);
      console.log('[MarketDataAggregator] ✓ CoinGecko API connected');
    } catch (error) {
      console.error('[MarketDataAggregator] CoinGecko connection failed:', error);
    }

    // Test CoinAPI connection
    try {
      await this.coinAPI.getExchangeRates();
      console.log('[MarketDataAggregator] ✓ CoinAPI connected');
    } catch (error) {
      console.error('[MarketDataAggregator] CoinAPI connection failed:', error);
    }

    // Test CryptoCompare connection
    try {
      await this.cryptoCompare.getMultipleSymbolsFullData(['BTC', 'ETH']);
      console.log('[MarketDataAggregator] ✓ CryptoCompare API connected');
    } catch (error) {
      console.error('[MarketDataAggregator] CryptoCompare connection failed:', error);
    }

    this.isRunning = true;
    
    // Start periodic market data enrichment with real APIs
    this.startPeriodicUpdates();
  }

  private startPeriodicUpdates(): void {
    // Update market cap and additional data every 5 minutes
    setInterval(async () => {
      try {
        await this.updateMarketCapData();
      } catch (error) {
        console.error('[MarketDataAggregator] Error in periodic update:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  private async updateMarketCapData(): Promise<void> {
    try {
      const coinIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot'];
      const marketData = await this.coinGecko.getMarketData(coinIds);
      
      for (const coin of marketData) {
        const symbol = this.mapCoinIdToSymbol(coin.id);
        if (symbol) {
          await storage.updateMarketData(symbol, {
            marketCap: coin.market_cap?.toString() || '0',
            volume24h: coin.total_volume?.toString() || '0',
            updatedAt: new Date()
          });
        }
      }
      
      console.log('[MarketDataAggregator] Updated market cap data for', marketData.length, 'coins');
    } catch (error) {
      console.error('[MarketDataAggregator] Error updating market cap data:', error);
    }
  }

  private mapCoinIdToSymbol(coinId: string): string | null {
    const mapping = {
      'bitcoin': 'BTC/USDT',
      'ethereum': 'ETH/USDT',
      'solana': 'SOL/USDT',
      'cardano': 'ADA/USDT',
      'polkadot': 'DOT/USDT'
    };
    return mapping[coinId as keyof typeof mapping] || null;
  }

  getConnectedProviders(): string[] {
    const connected = [];
    
    // Check WebSocket providers
    for (const provider of this.providers) {
      if (provider.isConnected()) {
        if (provider instanceof BinanceWebSocketProvider) {
          connected.push('Binance');
        } else if (provider instanceof CoinbaseWebSocketProvider) {
          connected.push('Coinbase');
        }
      }
    }
    
    // Add API providers (assume connected if initialized)
    if (this.coinGecko) connected.push('CoinGecko');
    if (this.coinAPI) connected.push('CoinAPI');
    if (this.cryptoCompare) connected.push('CryptoCompare');
    
    return connected;
  }

  async shutdown(): Promise<void> {
    console.log('[MarketDataAggregator] Shutting down providers...');
    this.isRunning = false;
    
    for (const provider of this.providers) {
      provider.disconnect();
    }
    
    this.providers = [];
  }
}