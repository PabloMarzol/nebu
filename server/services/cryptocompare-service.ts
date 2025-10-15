const CRYPTOCOMPARE_API_KEY = process.env.CRYPTOCOMPARE_API_KEY || '24e45e08d23e1d910fe06b42ea44866a8b0b2776c9e4e56439d2be46a0217160';
const CRYPTOCOMPARE_BASE_URL = 'https://min-api.cryptocompare.com/data';

class CryptoCompareService {
  private apiKey: string;

  constructor() {
    this.apiKey = CRYPTOCOMPARE_API_KEY;
    console.log('[CryptoCompare] Service initialized with authentic API key');
  }

  // Get real-time price data for multiple symbols
  async getMultipleSymbolPrices(symbols: string[], vsSymbol: string = 'USD'): Promise<any> {
    try {
      const symbolsParam = symbols.join(',');
      const url = `${CRYPTOCOMPARE_BASE_URL}/pricemultifull?fsyms=${symbolsParam}&tsyms=${vsSymbol}&api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === 'Error') {
        throw new Error(data.Message);
      }

      return data.RAW;
    } catch (error) {
      console.error('[CryptoCompare] Error fetching multiple prices:', error);
      throw error;
    }
  }

  // Get historical price data for charting
  async getHistoricalData(symbol: string, limit: number = 100, period: string = 'day'): Promise<any> {
    try {
      const endpoint = period === 'hour' ? 'histohour' : period === 'minute' ? 'histominute' : 'histoday';
      const url = `${CRYPTOCOMPARE_BASE_URL}/${endpoint}?fsym=${symbol}&tsym=USD&limit=${limit}&api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === 'Error') {
        throw new Error(data.Message);
      }

      return data.Data;
    } catch (error) {
      console.error('[CryptoCompare] Error fetching historical data:', error);
      throw error;
    }
  }

  // Get cryptocurrency news
  async getCryptoNews(limit: number = 10): Promise<any> {
    try {
      const url = `${CRYPTOCOMPARE_BASE_URL}/v2/news/?lang=EN&api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === 'Error') {
        throw new Error(data.Message);
      }

      return data.Data.slice(0, limit);
    } catch (error) {
      console.error('[CryptoCompare] Error fetching news:', error);
      throw error;
    }
  }

  // Get top trading pairs by volume
  async getTopTradingPairs(limit: number = 20): Promise<any> {
    try {
      const url = `${CRYPTOCOMPARE_BASE_URL}/top/totaltoptiervolfull?limit=${limit}&tsym=USD&api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === 'Error') {
        throw new Error(data.Message);
      }

      return data.Data;
    } catch (error) {
      console.error('[CryptoCompare] Error fetching top pairs:', error);
      throw error;
    }
  }

  // Get exchange information
  async getExchangeList(): Promise<any> {
    try {
      const url = `${CRYPTOCOMPARE_BASE_URL}/all/exchanges?api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('[CryptoCompare] Error fetching exchanges:', error);
      throw error;
    }
  }

  // Get social media statistics
  async getSocialStats(symbol: string): Promise<any> {
    try {
      const url = `${CRYPTOCOMPARE_BASE_URL}/social/coin/histo/day?coinId=${symbol}&api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === 'Error') {
        throw new Error(data.Message);
      }

      return data.Data;
    } catch (error) {
      console.error('[CryptoCompare] Error fetching social stats:', error);
      throw error;
    }
  }

  // Transform CryptoCompare data to our market data format
  transformToMarketData(rawData: any, symbol: string) {
    if (!rawData[symbol] || !rawData[symbol].USD) {
      return null;
    }

    const usdData = rawData[symbol].USD;
    
    return {
      symbol: `${symbol}/USDT`,
      price: usdData.PRICE?.toString() || '0',
      change24h: usdData.CHANGEPCT24HOUR?.toString() || '0',
      volume24h: usdData.VOLUME24HOUR?.toString() || '0',
      marketCap: usdData.MKTCAP?.toString() || '0',
      high24h: usdData.HIGH24HOUR?.toString() || '0',
      low24h: usdData.LOW24HOUR?.toString() || '0',
      updatedAt: new Date()
    };
  }
}

export const cryptoCompareService = new CryptoCompareService();