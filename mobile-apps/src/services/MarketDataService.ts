import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  ma20?: number[];
  ma50?: number[];
  ema12?: number[];
  ema26?: number[];
  rsi?: number[];
  macd?: {
    line: number[];
    signal: number[];
    histogram: number[];
  };
  bollingerBands?: {
    upper: number[];
    middle: number[];
    lower: number[];
  };
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
}

export interface OrderBookData {
  bids: Array<{ price: number; quantity: number; total: number }>;
  asks: Array<{ price: number; quantity: number; total: number }>;
  spread: number;
  timestamp: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

class MarketDataService {
  private static instance: MarketDataService;
  private wsConnections: Map<string, WebSocket> = new Map();

  static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  // Chart Data
  async getChartData(symbol: string, timeframe: string): Promise<ChartData[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/market/chart`, {
        params: { symbol, timeframe },
        timeout: 10000,
      });
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      // Fallback to simulated data if API fails
      return this.generateSimulatedChartData(symbol, timeframe);
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      return this.generateSimulatedChartData(symbol, timeframe);
    }
  }

  // Technical Indicators
  async getTechnicalIndicators(symbol: string, timeframe: string): Promise<TechnicalIndicators> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/market/indicators`, {
        params: { symbol, timeframe },
        timeout: 10000,
      });
      
      if (response.data && response.data.indicators) {
        return response.data.indicators;
      }
      
      return this.calculateBasicIndicators(await this.getChartData(symbol, timeframe));
    } catch (error) {
      console.error('Failed to fetch technical indicators:', error);
      return this.calculateBasicIndicators(await this.getChartData(symbol, timeframe));
    }
  }

  // Market Tickers
  async getMarketTickers(): Promise<MarketTicker[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/market/tickers`, {
        timeout: 10000,
      });
      
      if (response.data && response.data.tickers) {
        return response.data.tickers;
      }
      
      return this.getDefaultTickers();
    } catch (error) {
      console.error('Failed to fetch market tickers:', error);
      return this.getDefaultTickers();
    }
  }

  // Order Book
  async getOrderBook(symbol: string): Promise<OrderBookData> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/market/orderbook`, {
        params: { symbol },
        timeout: 10000,
      });
      
      if (response.data && response.data.orderBook) {
        return response.data.orderBook;
      }
      
      return this.generateSimulatedOrderBook(symbol);
    } catch (error) {
      console.error('Failed to fetch order book:', error);
      return this.generateSimulatedOrderBook(symbol);
    }
  }

  // Price Updates
  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/market/price`, {
        params: { symbol },
        timeout: 5000,
      });
      
      if (response.data && response.data.price) {
        return response.data.price;
      }
      
      return this.getSimulatedPrice(symbol);
    } catch (error) {
      console.error('Failed to fetch current price:', error);
      return this.getSimulatedPrice(symbol);
    }
  }

  // News
  async getCryptoNews(): Promise<NewsItem[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/market/news`, {
        timeout: 10000,
      });
      
      if (response.data && response.data.news) {
        return response.data.news;
      }
      
      return this.getDefaultNews();
    } catch (error) {
      console.error('Failed to fetch crypto news:', error);
      return this.getDefaultNews();
    }
  }

  // WebSocket Connections
  subscribeToPrice(symbol: string, callback: (price: number) => void): () => void {
    const wsKey = `price-${symbol}`;
    
    if (this.wsConnections.has(wsKey)) {
      this.wsConnections.get(wsKey)?.close();
    }

    try {
      const ws = new WebSocket(`ws://localhost:5000/ws/price/${symbol}`);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.price) {
          callback(data.price);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket price subscription error:', error);
        // Fallback to polling
        this.startPricePolling(symbol, callback);
      };

      this.wsConnections.set(wsKey, ws);

      return () => {
        ws.close();
        this.wsConnections.delete(wsKey);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      return this.startPricePolling(symbol, callback);
    }
  }

  // Private Helper Methods
  private generateSimulatedChartData(symbol: string, timeframe: string): ChartData[] {
    const now = Date.now();
    const interval = this.getTimeframeInterval(timeframe);
    const periods = 100;
    const basePrice = this.getBasePrice(symbol);
    
    const data: ChartData[] = [];
    let currentPrice = basePrice;

    for (let i = periods; i >= 0; i--) {
      const timestamp = now - (i * interval);
      const volatility = 0.02; // 2% volatility
      
      const change = (Math.random() - 0.5) * volatility;
      currentPrice = currentPrice * (1 + change);
      
      const high = currentPrice * (1 + Math.random() * 0.01);
      const low = currentPrice * (1 - Math.random() * 0.01);
      const open = i === periods ? currentPrice : data[data.length - 1]?.close || currentPrice;
      const volume = Math.random() * 1000000;

      data.push({
        timestamp,
        open,
        high,
        low,
        close: currentPrice,
        volume,
      });
    }

    return data;
  }

  private calculateBasicIndicators(chartData: ChartData[]): TechnicalIndicators {
    if (chartData.length === 0) return {};

    const prices = chartData.map(d => d.close);
    
    return {
      ma20: this.calculateSMA(prices, 20),
      ma50: this.calculateSMA(prices, 50),
      ema12: this.calculateEMA(prices, 12),
      ema26: this.calculateEMA(prices, 26),
      rsi: this.calculateRSI(prices, 14),
    };
  }

  private calculateSMA(prices: number[], period: number): number[] {
    const sma: number[] = [];
    
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    
    return sma;
  }

  private calculateEMA(prices: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    ema[0] = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }
    
    return ema;
  }

  private calculateRSI(prices: number[], period: number): number[] {
    const rsi: number[] = [];
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    
    for (let i = period; i < changes.length; i++) {
      const gains = changes.slice(i - period, i).filter(change => change > 0);
      const losses = changes.slice(i - period, i).filter(change => change < 0).map(Math.abs);
      
      const avgGain = gains.reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.reduce((a, b) => a + b, 0) / period;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  }

  private generateSimulatedOrderBook(symbol: string): OrderBookData {
    const basePrice = this.getBasePrice(symbol);
    const spread = basePrice * 0.001; // 0.1% spread
    
    const bids: Array<{ price: number; quantity: number; total: number }> = [];
    const asks: Array<{ price: number; quantity: number; total: number }> = [];
    
    // Generate bids (buy orders)
    for (let i = 0; i < 20; i++) {
      const price = basePrice - (spread / 2) - (i * spread * 0.1);
      const quantity = Math.random() * 100 + 10;
      const total = price * quantity;
      bids.push({ price, quantity, total });
    }
    
    // Generate asks (sell orders)
    for (let i = 0; i < 20; i++) {
      const price = basePrice + (spread / 2) + (i * spread * 0.1);
      const quantity = Math.random() * 100 + 10;
      const total = price * quantity;
      asks.push({ price, quantity, total });
    }
    
    return {
      bids,
      asks,
      spread,
      timestamp: Date.now(),
    };
  }

  private getDefaultTickers(): MarketTicker[] {
    return [
      {
        symbol: 'BTCUSDT',
        price: 45000,
        change24h: 2.5,
        volume24h: 28500000000,
        high24h: 46000,
        low24h: 44000,
        marketCap: 850000000000,
      },
      {
        symbol: 'ETHUSDT',
        price: 3200,
        change24h: -1.2,
        volume24h: 15000000000,
        high24h: 3300,
        low24h: 3100,
        marketCap: 380000000000,
      },
      {
        symbol: 'SOLUSDT',
        price: 120,
        change24h: 5.8,
        volume24h: 2500000000,
        high24h: 125,
        low24h: 115,
        marketCap: 45000000000,
      },
      {
        symbol: 'ADAUSDT',
        price: 0.85,
        change24h: -0.5,
        volume24h: 800000000,
        high24h: 0.88,
        low24h: 0.82,
        marketCap: 28000000000,
      },
    ];
  }

  private getDefaultNews(): NewsItem[] {
    return [
      {
        id: '1',
        title: 'Bitcoin Reaches New All-Time High',
        summary: 'Bitcoin price surges past $50,000 as institutional adoption continues.',
        content: 'Bitcoin has reached a new all-time high, driven by increased institutional adoption and growing mainstream acceptance.',
        source: 'CryptoNews',
        publishedAt: new Date().toISOString(),
        category: 'Bitcoin',
        sentiment: 'positive',
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Staking Rewards Increase',
        summary: 'Ethereum staking rewards see significant increase following network upgrades.',
        content: 'The Ethereum network has seen substantial improvements in staking rewards following recent upgrades.',
        source: 'BlockchainToday',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        category: 'Ethereum',
        sentiment: 'positive',
      },
    ];
  }

  private getTimeframeInterval(timeframe: string): number {
    const intervals: Record<string, number> = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
    };
    
    return intervals[timeframe] || intervals['1h'];
  }

  private getBasePrice(symbol: string): number {
    const basePrices: Record<string, number> = {
      'BTCUSDT': 45000,
      'ETHUSDT': 3200,
      'SOLUSDT': 120,
      'ADAUSDT': 0.85,
      'DOTUSDT': 25,
      'LINKUSDT': 18,
      'UNIUSDT': 12,
      'AAVEUSDT': 180,
    };
    
    return basePrices[symbol] || 100;
  }

  private getSimulatedPrice(symbol: string): number {
    const basePrice = this.getBasePrice(symbol);
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    return basePrice * (1 + change);
  }

  private startPricePolling(symbol: string, callback: (price: number) => void): () => void {
    const interval = setInterval(async () => {
      try {
        const price = await this.getCurrentPrice(symbol);
        callback(price);
      } catch (error) {
        console.error('Price polling error:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }
}

export const MarketDataService = MarketDataService.getInstance();
export default MarketDataService;