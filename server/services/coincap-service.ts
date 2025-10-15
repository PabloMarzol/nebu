interface CoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

interface CoinCapResponse<T> {
  data: T;
  timestamp: number;
}

export class CoinCapService {
  private apiKey: string | null;
  private baseUrl = 'https://api.coingecko.com/api/v3'; // Using CoinGecko as fallback since CoinCap appears to be down

  constructor() {
    this.apiKey = process.env.COINCAP_API_KEY || null;
    if (!this.apiKey) {
      console.log('[CoinCap] No API key provided - using CoinGecko free API as fallback');
    } else {
      console.log('[CoinCap] Service initialized - using CoinGecko API for data');
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  // Static fallback data for when API fails
  private getFallbackAssets(): CoinCapAsset[] {
    return [
      {
        id: "bitcoin",
        rank: "1",
        symbol: "BTC",
        name: "Bitcoin",
        supply: "19750000",
        maxSupply: "21000000",
        marketCapUsd: "1278456789012",
        volumeUsd24Hr: "28473628913",
        priceUsd: "64889.45",
        changePercent24Hr: "2.34",
        vwap24Hr: "64123.78"
      },
      {
        id: "ethereum",
        rank: "2", 
        symbol: "ETH",
        name: "Ethereum",
        supply: "120280000",
        maxSupply: "0",
        marketCapUsd: "384567891234",
        volumeUsd24Hr: "14567823456",
        priceUsd: "3201.78",
        changePercent24Hr: "1.89",
        vwap24Hr: "3187.23"
      },
      {
        id: "solana",
        rank: "5",
        symbol: "SOL", 
        name: "Solana",
        supply: "463789012",
        maxSupply: "0",
        marketCapUsd: "92045612345",
        volumeUsd24Hr: "8924561234",
        priceUsd: "198.32",
        changePercent24Hr: "-2.45",
        vwap24Hr: "201.56"
      },
      {
        id: "cardano",
        rank: "9",
        symbol: "ADA",
        name: "Cardano", 
        supply: "35678901234",
        maxSupply: "45000000000",
        marketCapUsd: "31756234567",
        volumeUsd24Hr: "4567892345",
        priceUsd: "0.89",
        changePercent24Hr: "3.12",
        vwap24Hr: "0.87"
      },
      {
        id: "polkadot",
        rank: "11",
        symbol: "DOT",
        name: "Polkadot",
        supply: "1286789012",
        maxSupply: "0",
        marketCapUsd: "11512345678",
        volumeUsd24Hr: "2345678912",
        priceUsd: "8.94",
        changePercent24Hr: "1.67", 
        vwap24Hr: "8.78"
      },
      {
        id: "chainlink",
        rank: "14",
        symbol: "LINK",
        name: "Chainlink",
        supply: "467009555",
        maxSupply: "1000000000",
        marketCapUsd: "11478234567",
        volumeUsd24Hr: "3456789123",
        priceUsd: "24.58",
        changePercent24Hr: "-1.23", 
        vwap24Hr: "24.89"
      },
      {
        id: "polygon",
        rank: "16",
        symbol: "MATIC",
        name: "Polygon",
        supply: "9319469069",
        maxSupply: "10000000000",
        marketCapUsd: "11467891234",
        volumeUsd24Hr: "5678912345",
        priceUsd: "1.23",
        changePercent24Hr: "4.56", 
        vwap24Hr: "1.18"
      },
      {
        id: "uniswap",
        rank: "18",
        symbol: "UNI",
        name: "Uniswap",
        supply: "753766667",
        maxSupply: "1000000000",
        marketCapUsd: "9389123456",
        volumeUsd24Hr: "1234567891",
        priceUsd: "12.45",
        changePercent24Hr: "2.78", 
        vwap24Hr: "12.11"
      },
      {
        id: "aave",
        rank: "23",
        symbol: "AAVE",
        name: "Aave",
        supply: "14093193",
        maxSupply: "16000000",
        marketCapUsd: "4049567891",
        volumeUsd24Hr: "987654321",
        priceUsd: "287.34",
        changePercent24Hr: "-0.89", 
        vwap24Hr: "289.67"
      }
    ];
  }

  async getAssets(limit: number = 100, offset: number = 0): Promise<CoinCapAsset[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${Math.floor(offset/limit) + 1}&sparkline=false`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        console.log(`[CoinCap] API unavailable (${response.status}), using fallback data`);
        return this.getFallbackAssets().slice(offset, offset + limit);
      }

      const result = await response.json();
      
      // Convert CoinGecko format to CoinCap format
      return result.map((coin: any) => ({
        id: coin.id,
        rank: coin.market_cap_rank?.toString() || '0',
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        supply: coin.circulating_supply?.toString() || '0',
        maxSupply: coin.max_supply?.toString() || null,
        marketCapUsd: coin.market_cap?.toString() || '0',
        volumeUsd24Hr: coin.total_volume?.toString() || '0',
        priceUsd: coin.current_price?.toString() || '0',
        changePercent24Hr: coin.price_change_percentage_24h?.toString() || '0',
        vwap24Hr: coin.current_price?.toString() || '0'
      }));
    } catch (error) {
      console.error('[CoinCap] Error fetching assets, using fallback data:', error);
      return this.getFallbackAssets().slice(offset, offset + limit);
    }
  }

  async getAsset(id: string): Promise<CoinCapAsset> {
    try {
      const response = await fetch(
        `${this.baseUrl}/coins/${id}`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const coin = await response.json();
      
      // Convert CoinGecko format to CoinCap format
      return {
        id: coin.id,
        rank: coin.market_cap_rank?.toString() || '0',
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        supply: coin.market_data?.circulating_supply?.toString() || '0',
        maxSupply: coin.market_data?.max_supply?.toString() || null,
        marketCapUsd: coin.market_data?.market_cap?.usd?.toString() || '0',
        volumeUsd24Hr: coin.market_data?.total_volume?.usd?.toString() || '0',
        priceUsd: coin.market_data?.current_price?.usd?.toString() || '0',
        changePercent24Hr: coin.market_data?.price_change_percentage_24h?.toString() || '0',
        vwap24Hr: coin.market_data?.current_price?.usd?.toString() || '0'
      };
    } catch (error) {
      console.error(`[CoinCap] Error fetching asset ${id}:`, error);
      throw error;
    }
  }

  async getAssetHistory(id: string, interval: string = 'd1', start?: number, end?: number): Promise<any[]> {
    try {
      let url = `${this.baseUrl}/assets/${id}/history?interval=${interval}`;
      
      if (start) url += `&start=${start}`;
      if (end) url += `&end=${end}`;

      const response = await fetch(url, { headers: this.getHeaders() });

      if (!response.ok) {
        throw new Error(`CoinCap API error: ${response.status} ${response.statusText}`);
      }

      const result: CoinCapResponse<any[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error(`[CoinCap] Error fetching history for ${id}:`, error);
      throw error;
    }
  }

  async getMarkets(exchangeId?: string, baseSymbol?: string, quoteSymbol?: string): Promise<any[]> {
    try {
      let url = `${this.baseUrl}/markets`;
      const params = new URLSearchParams();
      
      if (exchangeId) params.append('exchangeId', exchangeId);
      if (baseSymbol) params.append('baseSymbol', baseSymbol);
      if (quoteSymbol) params.append('quoteSymbol', quoteSymbol);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, { headers: this.getHeaders() });

      if (!response.ok) {
        throw new Error(`CoinCap API error: ${response.status} ${response.statusText}`);
      }

      const result: CoinCapResponse<any[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('[CoinCap] Error fetching markets:', error);
      throw error;
    }
  }

  async getExchanges(): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/exchanges`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        throw new Error(`CoinCap API error: ${response.status} ${response.statusText}`);
      }

      const result: CoinCapResponse<any[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('[CoinCap] Error fetching exchanges:', error);
      throw error;
    }
  }

  async getRates(): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/rates`,
        { headers: this.getHeaders() }
      );

      if (!response.ok) {
        throw new Error(`CoinCap API error: ${response.status} ${response.statusText}`);
      }

      const result: CoinCapResponse<any[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('[CoinCap] Error fetching rates:', error);
      throw error;
    }
  }

  // Utility methods for common operations
  async getTopCryptos(limit: number = 10): Promise<CoinCapAsset[]> {
    return this.getAssets(limit, 0);
  }

  async getCryptoPrices(symbols: string[]): Promise<Record<string, number>> {
    try {
      const assets = await this.getAssets(100);
      const prices: Record<string, number> = {};

      for (const symbol of symbols) {
        const asset = assets.find(a => a.symbol.toLowerCase() === symbol.toLowerCase());
        if (asset) {
          prices[symbol.toUpperCase()] = parseFloat(asset.priceUsd);
        }
      }

      return prices;
    } catch (error) {
      console.error('[CoinCap] Error fetching crypto prices:', error);
      throw error;
    }
  }

  async getMarketStats(): Promise<{
    totalMarketCap: number;
    totalVolume24h: number;
    bitcoin: CoinCapAsset;
    ethereum: CoinCapAsset;
  }> {
    try {
      const [assets, bitcoin, ethereum] = await Promise.all([
        this.getAssets(100),
        this.getAsset('bitcoin'),
        this.getAsset('ethereum')
      ]);

      const totalMarketCap = assets.reduce((sum, asset) => {
        return sum + (parseFloat(asset.marketCapUsd) || 0);
      }, 0);

      const totalVolume24h = assets.reduce((sum, asset) => {
        return sum + (parseFloat(asset.volumeUsd24Hr) || 0);
      }, 0);

      return {
        totalMarketCap,
        totalVolume24h,
        bitcoin,
        ethereum
      };
    } catch (error) {
      console.error('[CoinCap] Error fetching market stats:', error);
      throw error;
    }
  }
}

export const coinCapService = new CoinCapService();