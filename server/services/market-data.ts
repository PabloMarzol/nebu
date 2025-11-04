import { storage } from "../storage";
import { type MarketData } from "@shared/schema";
import { hyperliquidMarketDataService } from "./hyperliquid-market-data";

interface ExternalMarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap?: number;
}

export class MarketDataService {
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating = false;

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
      console.log('[MarketData] Fetching real prices from Hyperliquid...');
      const marketData = await this.fetchMarketDataFromHyperliquid();

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

      console.log(`[MarketData] Updated ${marketData.length} pairs with real Hyperliquid prices`);
    } catch (error) {
      console.error("[MarketData] Failed to fetch from Hyperliquid:", error);
      // Log error but don't use fallback - only use real Hyperliquid data
      console.warn("[MarketData] Market data update failed - will retry on next cycle");
    } finally {
      this.isUpdating = false;
    }
  }

  private async fetchMarketDataFromHyperliquid(): Promise<ExternalMarketData[]> {
    try {
      const hyperliquidData = await hyperliquidMarketDataService.getMarketData();
      console.log(`[MarketData] Received ${hyperliquidData.length} instruments from Hyperliquid`);

      const marketData: ExternalMarketData[] = [];

      for (const ticker of hyperliquidData) {
        if (!ticker.symbol || !ticker.price) {
          continue; // Skip invalid data
        }

        const price = parseFloat(ticker.price);
        const change24h = parseFloat(ticker.change24h) || 0;
        const volume24h = parseFloat(ticker.volume24h) || 0;
        const high24h = parseFloat(ticker.high24h) || price;
        const low24h = parseFloat(ticker.low24h) || price;

        marketData.push({
          symbol: ticker.symbol,
          price: price,
          change24h: change24h,
          volume24h: volume24h,
          high24h: high24h,
          low24h: low24h,
          marketCap: parseFloat(ticker.marketCap) || undefined
        });
      }

      // Only use Hyperliquid data - no fallback generation
      if (marketData.length === 0) {
        console.warn('[MarketData] No valid data received from Hyperliquid');
        throw new Error('No market data available from Hyperliquid');
      }

      return marketData;
    } catch (error) {
      console.error('[MarketData] Error fetching from Hyperliquid:', error);
      throw error;
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
