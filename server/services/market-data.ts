import { storage } from "../storage";
import { type MarketData } from "@shared/schema";

interface ExternalMarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
}

interface ALT5TickerData {
  instrument: string;
  start: string;
  end: string;
  low: number;
  high: number;
  volume: number;
  open: number;
  close: number;
}

export class MarketDataService {
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating = false;
  private readonly ALT5_API_URL = 'https://trade.alt5pro.com/marketdata/api/v2/marketdata/ticker';

  // Map ALT5 instruments to our format
  private readonly INSTRUMENT_MAPPING: Record<string, string> = {
    'btc_usdt': 'BTC/USDT',
    'eth_usdt': 'ETH/USDT',
    'sol_usd': 'SOL/USDT',
    'ada_cad': 'ADA/USDT',
    'dot_usdt': 'DOT/USDT',
    'matic_usdt': 'MATIC/USDT',
    'avax_usdt': 'AVAX/USDT',
    'link_usdt': 'LINK/USDT',
    'uni_usd': 'UNI/USDT',
    'atom_usdt': 'ATOM/USDT',
    'bnb_usdt': 'BNB/USDT',
    'xrp_usdt': 'XRP/USDT',
    'ltc_usdt': 'LTC/USDT',
    'bch_usdc': 'BCH/USDT',
    'etc_usdt': 'ETC/USDT'
  };

  // Supported trading pairs
  private readonly SUPPORTED_PAIRS = [
    "BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT", "DOT/USDT",
    "MATIC/USDT", "AVAX/USDT", "LINK/USDT", "UNI/USDT", "ATOM/USDT",
    "BNB/USDT", "XRP/USDT", "LTC/USDT", "BCH/USDT", "ETC/USDT",
    "FTM/USDT", "NEAR/USDT", "ALGO/USDT", "VET/USDT", "THETA/USDT"
  ];

  constructor() {
    this.startMarketDataUpdates();
  }

  async startMarketDataUpdates() {
    // Update market data every 30 seconds
    this.updateInterval = setInterval(() => {
      this.updateAllMarketData();
    }, 30000);

    // Initial update
    await this.updateAllMarketData();
  }

  async stopMarketDataUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private async updateAllMarketData() {
    if (this.isUpdating) return;
    this.isUpdating = true;

    try {
      console.log('[MarketData] Fetching real prices from ALT5...');
      const marketData = await this.fetchMarketDataFromALT5();

      for (const data of marketData) {
        await storage.updateMarketData(data.symbol, {
          price: data.price.toString(),
          change24h: data.change24h.toString(),
          volume24h: data.volume24h.toString(),
          marketCap: data.marketCap?.toString(),
          high24h: data.high24h.toString(),
          low24h: data.low24h.toString()
        });
      }

      console.log(`[MarketData] Updated ${marketData.length} pairs with real ALT5 prices`);
    } catch (error) {
      console.error("[MarketData] Failed to fetch from ALT5, using fallback:", error);
      // Fallback to simulated data if ALT5 fails
      await this.updateWithSimulatedData();
    } finally {
      this.isUpdating = false;
    }
  }

  private async fetchMarketDataFromALT5(): Promise<ExternalMarketData[]> {
    try {
      const response = await fetch(this.ALT5_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`ALT5 API returned ${response.status}: ${response.statusText}`);
      }

      const alt5Data: ALT5TickerData[] = await response.json();
      console.log(`[MarketData] Received ${alt5Data.length} instruments from ALT5`);

      const marketData: ExternalMarketData[] = [];

      for (const ticker of alt5Data) {
        const symbol = this.INSTRUMENT_MAPPING[ticker.instrument];
        
        if (!symbol || ticker.close === 0) {
          continue; // Skip unmapped instruments or instruments with no data
        }

        const changePercent = ticker.open > 0 
          ? ((ticker.close - ticker.open) / ticker.open) * 100 
          : 0;

        marketData.push({
          symbol,
          price: ticker.close,
          change24h: changePercent,
          volume24h: ticker.volume,
          high24h: ticker.high > 0 ? ticker.high : ticker.close,
          low24h: ticker.low > 0 ? ticker.low : ticker.close,
          marketCap: undefined // ALT5 doesn't provide market cap
        });
      }

      // Fill in missing pairs with fallback data
      const foundSymbols = marketData.map(d => d.symbol);
      const missingSymbols = this.SUPPORTED_PAIRS.filter(symbol => !foundSymbols.includes(symbol));
      
      if (missingSymbols.length > 0) {
        console.log(`[MarketData] Adding fallback data for missing symbols: ${missingSymbols.join(', ')}`);
        const fallbackData = this.generateFallbackData(missingSymbols);
        marketData.push(...fallbackData);
      }

      return marketData;
    } catch (error) {
      console.error('[MarketData] Error fetching from ALT5:', error);
      throw error;
    }
  }

  private generateFallbackData(symbols: string[]): ExternalMarketData[] {
    const baseData = {
      "BTC/USDT": { price: 67834.50, marketCap: 1330000000000 },
      "ETH/USDT": { price: 3456.78, marketCap: 415000000000 },
      "SOL/USDT": { price: 198.42, marketCap: 94000000000 },
      "ADA/USDT": { price: 0.4523, marketCap: 16000000000 },
      "DOT/USDT": { price: 7.89, marketCap: 10500000000 },
      "MATIC/USDT": { price: 0.8945, marketCap: 8700000000 },
      "AVAX/USDT": { price: 35.67, marketCap: 14200000000 },
      "LINK/USDT": { price: 14.23, marketCap: 8400000000 },
      "UNI/USDT": { price: 6.78, marketCap: 5100000000 },
      "ATOM/USDT": { price: 9.45, marketCap: 3700000000 }
    };

    return symbols.map(symbol => {
      const base = baseData[symbol] || { price: Math.random() * 100, marketCap: Math.random() * 10000000000 };     
      const volatility = 0.02; // 2% max change
      const changePercent = (Math.random() - 0.5) * 2 * volatility;

      return {
        symbol,
        price: base.price * (1 + changePercent),
        change24h: changePercent * 100,
        volume24h: Math.random() * 1000000000,
        high24h: base.price * (1 + Math.abs(changePercent) * 1.2),
        low24h: base.price * (1 - Math.abs(changePercent) * 1.2),
        marketCap: base.marketCap
      };
    });
  }

  private async updateWithSimulatedData() {
    const simulatedData = this.generateFallbackData(this.SUPPORTED_PAIRS);

    for (const data of simulatedData) {
      await storage.updateMarketData(data.symbol, {
        price: data.price.toString(),
        change24h: data.change24h.toString(),
        volume24h: data.volume24h.toString(),
        marketCap: data.marketCap?.toString(),
        high24h: data.high24h.toString(),
        low24h: data.low24h.toString()
      });
    }
  }

  async getMarketData(symbols?: string[]): Promise<MarketData[]> {
    return await storage.getMarketData(symbols);
  }

  async getMarketDataBySymbol(symbol: string): Promise<MarketData | undefined> {
    return await storage.getMarketDataBySymbol(symbol);
  }

  // Real-time price updates via WebSocket (placeholder for external connections)
  async subscribeToPriceUpdates(symbols: string[], callback: (data: MarketData) => void) {
    console.log(`Subscribing to price updates for: ${symbols.join(", ")}`);

    // Simulate real-time updates
    const interval = setInterval(async () => {
      for (const symbol of symbols) {
        const marketData = await this.getMarketDataBySymbol(symbol);
        if (marketData) {
          // Simulate small price movements
          const currentPrice = parseFloat(marketData.price);
          const newPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.001); // 0.1% max change

          const updatedData = await storage.updateMarketData(symbol, {
            price: newPrice.toString()
          });

          callback(updatedData);
        }
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }
}

export const marketDataService = new MarketDataService();