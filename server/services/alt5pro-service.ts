import axios from 'axios';

// ALT5 Pro API Configuration
const ALT5_PRO_CONFIG = {
  production: {
    baseUrl: 'https://trade.alt5pro.com',
    marketdataUrl: 'https://trade.alt5pro.com/marketdata',
    frontofficeUrl: 'https://exchange.alt5pro.com/frontoffice/api',
    websocketUrl: 'wss://trade.alt5pro.com/marketdata',
  },
  sandbox: {
    baseUrl: 'https://exchange.digitalpaydev.com',
    marketdataUrl: 'https://exchange.digitalpaydev.com/marketdata',
    frontofficeUrl: 'https://exchange.digitalpaydev.com/frontoffice/api',
    websocketUrl: 'wss://exchange.digitalpaydev.com/marketdata',
  }
};

interface Alt5ProCredentials {
  email: string;
  password: string;
  accountId?: string;
  environment: 'production' | 'sandbox';
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface MarketDataInstrument {
  instrument: string;
  baseAsset: string;
  quoteAsset: string;
}

interface OrderBookData {
  instrument: string;
  bids: Array<{ amount: number; price: number }>;
  asks: Array<{ amount: number; price: number }>;
  version: number;
  askTotalAmount: number;
  bidTotalAmount: number;
  snapshot: boolean;
}

interface TradeData {
  tradeId: number;
  tradeTime: string;
  amount: number;
  executionPrice: number;
  instrument: string;
  side: number; // 0 = buy, 1 = sell
}

interface TickerData {
  instrument: string;
  start: string;
  end: string;
  low: number;
  high: number;
  volume: number;
  open: number;
  close: number;
}

interface CreateOrderParams {
  accountId: string;
  instrument: string;
  type: 'buy' | 'sell';
  amount: number;
  price?: number;
  isLimit: boolean;
  isStop?: boolean;
  timeInForce?: number; // 0 = GTC, 1 = IOC, 2 = FOK
  requestedQuoteAmount?: number;
}

interface OrderResponse {
  id: string;
  status: string;
  instrument: string;
  type: string;
  amount: number;
  price: number;
  createdAt: string;
}

interface AccountBalance {
  assetId: string;
  available: number;
  orderLocked: number;
  transferLocked: number;
}

/**
 * ALT5 Pro Service
 * Handles market data and trading operations
 */
export class Alt5ProService {
  private credentials: Alt5ProCredentials;
  private config: typeof ALT5_PRO_CONFIG.production;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(credentials: Alt5ProCredentials) {
    this.credentials = credentials;
    this.config = ALT5_PRO_CONFIG[credentials.environment];
  }

  /**
   * Login to ALT5 Pro and get access token
   */
  private async login(): Promise<void> {
    try {
      // Step 1: Initial login with email/password
      const loginResponse = await axios.post(
        `${this.config.baseUrl}/identity/api/v2/identity/exchange-users/users/signin/`,
        {
          email: this.credentials.email,
          password: this.credentials.password
        }
      );

      // Step 2: 2FA confirmation (assuming we have the code)
      // In production, this would need to be handled properly with 2FA
      const twoFactorResponse = await axios.post(
        `${this.config.baseUrl}/identity/api/v2/identity/exchange-users/users/signin/2fa`,
        {
          VerificationCode: '123456' // This would come from 2FA provider
        },
        {
          headers: {
            Cookie: loginResponse.headers['set-cookie']?.join('; ')
          }
        }
      );

      // Extract tokens from response
      this.accessToken = twoFactorResponse.data.access_token;
      this.refreshToken = twoFactorResponse.data.refresh_token;
      this.tokenExpiry = Date.now() + (twoFactorResponse.data.expires_in * 1000);

      // Get account ID if not provided
      if (!this.credentials.accountId) {
        const accountsResponse = await this.makeAuthenticatedRequest('GET', '/frontoffice/api/accounts');
        if (accountsResponse.data && accountsResponse.data.length > 0) {
          this.credentials.accountId = accountsResponse.data[0].id;
        }
      }

    } catch (error: any) {
      console.error('[Alt5Pro] Login failed:', error.response?.data || error.message);
      throw new Error(`ALT5 Pro login failed: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Make authenticated request to ALT5 Pro API
   */
  private async makeAuthenticatedRequest(method: string, endpoint: string, data?: any): Promise<any> {
    // Check if token is expired or missing
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.login();
    }

    try {
      const response = await axios({
        method,
        url: `${this.config.baseUrl}${endpoint}`,
        data,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      // If token expired, try to refresh and retry
      if (error.response?.status === 401) {
        await this.login();
        return this.makeAuthenticatedRequest(method, endpoint, data);
      }
      throw error;
    }
  }

  /**
   * Get available trading instruments
   */
  async getInstruments(): Promise<MarketDataInstrument[]> {
    try {
      const response = await axios.get(`${this.config.marketdataUrl}/instruments`);
      return response.data.map((instrument: string) => {
        const [base, quote] = instrument.split('_');
        return {
          instrument,
          baseAsset: base,
          quoteAsset: quote
        };
      });
    } catch (error: any) {
      console.error('[Alt5Pro] Get instruments failed:', error.response?.data || error.message);
      throw new Error(`Failed to get instruments: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get order book for specific instrument
   */
  async getOrderBook(instrument: string): Promise<OrderBookData> {
    try {
      const response = await axios.get(`${this.config.marketdataUrl}/api/v2/marketdata/depth/${instrument}`);
      return response.data;
    } catch (error: any) {
      console.error('[Alt5Pro] Get order book failed:', error.response?.data || error.message);
      throw new Error(`Failed to get order book: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get recent trades for specific instrument
   */
  async getRecentTrades(instrument: string): Promise<TradeData[]> {
    try {
      const response = await axios.get(`${this.config.marketdataUrl}/api/v2/marketdata/trades/${instrument}`);
      return response.data;
    } catch (error: any) {
      console.error('[Alt5Pro] Get recent trades failed:', error.response?.data || error.message);
      throw new Error(`Failed to get recent trades: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get ticker data for specific instrument
   */
  async getTicker(instrument: string): Promise<TickerData> {
    try {
      const response = await axios.get(`${this.config.marketdataUrl}/api/v2/marketdata/ticker`);
      const tickers = response.data;
      const ticker = tickers.find((t: TickerData) => t.instrument === instrument);
      
      if (!ticker) {
        throw new Error(`Ticker not found for instrument: ${instrument}`);
      }
      
      return ticker;
    } catch (error: any) {
      console.error('[Alt5Pro] Get ticker failed for instrument:', instrument, error.response?.data || error.message);
      throw new Error(`Failed to get ticker for ${instrument}: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create trading order
   */
  async createOrder(params: CreateOrderParams): Promise<OrderResponse> {
    if (!this.credentials.accountId) {
      throw new Error('Account ID is required for creating orders');
    }

    const orderData = {
      Order: {
        Instrument: params.instrument,
        Type: params.type,
        Amount: params.amount,
        Price: params.price || null,
        IsLimit: params.isLimit,
        IsStop: params.isStop || false,
        TimeInForce: params.timeInForce !== undefined ? params.timeInForce : (params.isLimit ? 0 : 1),
        RequestedQuoteAmount: params.requestedQuoteAmount || null
      }
    };

    return this.makeAuthenticatedRequest('POST', `/frontoffice/api/${this.credentials.accountId}/order`, orderData);
  }

  /**
   * Get account balances
   */
  async getAccountBalances(): Promise<AccountBalance[]> {
    if (!this.credentials.accountId) {
      throw new Error('Account ID is required for getting balances');
    }

    const response = await this.makeAuthenticatedRequest('GET', `/frontoffice/api/${this.credentials.accountId}/balance`);
    return response.data;
  }

  /**
   * Get current market price for FX rate calculation
   */
  async getMarketPrice(baseAsset: string, quoteAsset: string): Promise<number> {
    const instrument = `${baseAsset.toLowerCase()}_${quoteAsset.toLowerCase()}`;
    
    try {
      const ticker = await this.getTicker(instrument);
      return ticker.close; // Use closing price as current market price
    } catch (error) {
      // Try reverse pair if direct pair not found
      const reverseInstrument = `${quoteAsset.toLowerCase()}_${baseAsset.toLowerCase()}`;
      try {
        const reverseTicker = await this.getTicker(reverseInstrument);
        return 1 / reverseTicker.close; // Calculate inverse price
      } catch (reverseError) {
        throw new Error(`Market price not available for ${baseAsset}/${quoteAsset}`);
      }
    }
  }

  /**
   * Get best execution price from order book
   */
  async getBestPrice(instrument: string, side: 'buy' | 'sell'): Promise<{
    price: number;
    amount: number;
    liquidity: number;
  }> {
    const orderBook = await this.getOrderBook(instrument);
    
    if (side === 'buy') {
      // Get best ask (lowest sell price)
      const bestAsk = orderBook.asks[0];
      return {
        price: bestAsk.price,
        amount: bestAsk.amount,
        liquidity: orderBook.askTotalAmount
      };
    } else {
      // Get best bid (highest buy price)
      const bestBid = orderBook.bids[0];
      return {
        price: bestBid.price,
        amount: bestBid.amount,
        liquidity: orderBook.bidTotalAmount
      };
    }
  }

  /**
   * Calculate FX rate using ALT5 Pro market data
   */
  async calculateFxRate(fromCurrency: string, toCurrency: string): Promise<{
    rate: number;
    source: string;
    timestamp: Date;
    spread: number;
    liquidity: number;
  }> {
    try {
      // Try direct pair first
      const instrument = `${fromCurrency.toLowerCase()}_${toCurrency.toLowerCase()}`;
      const ticker = await this.getTicker(instrument);
      
      return {
        rate: ticker.close,
        source: 'alt5pro_direct',
        timestamp: new Date(ticker.end),
        spread: (ticker.high - ticker.low) / ticker.close * 100,
        liquidity: ticker.volume
      };
    } catch (error) {
      // Try reverse pair
      const reverseInstrument = `${toCurrency.toLowerCase()}_${fromCurrency.toLowerCase()}`;
      try {
        const reverseTicker = await this.getTicker(reverseInstrument);
        return {
          rate: 1 / reverseTicker.close,
          source: 'alt5pro_inverse',
          timestamp: new Date(reverseTicker.end),
          spread: (reverseTicker.high - reverseTicker.low) / reverseTicker.close * 100,
          liquidity: reverseTicker.volume
        };
      } catch (reverseError) {
        // Try via USD as intermediate
        if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
          const fromToUsd = await this.getTicker(`${fromCurrency.toLowerCase()}_usd`);
          const toToUsd = await this.getTicker(`${toCurrency.toLowerCase()}_usd`);
          
          return {
            rate: fromToUsd.close / toToUsd.close,
            source: 'alt5pro_usd_cross',
            timestamp: new Date(Math.max(new Date(fromToUsd.end).getTime(), new Date(toToUsd.end).getTime())),
            spread: ((fromToUsd.high - fromToUsd.low) / fromToUsd.close + (toToUsd.high - toToUsd.low) / toToUsd.close) * 100,
            liquidity: Math.min(fromToUsd.volume, toToUsd.volume)
          };
        }
        throw new Error(`FX rate not available for ${fromCurrency}/${toCurrency}`);
      }
    }
  }

  /**
   * Get market data for FX swap rate comparison
   */
  async getMarketDataForFxSwap(fiatCurrency: string, cryptoCurrency: string): Promise<{
    directRate: number | null;
    inverseRate: number | null;
    usdCrossRate: number | null;
    bestRate: number;
    bestSource: string;
    spread: number;
    liquidity: number;
    timestamp: Date;
  }> {
    const results: any = {
      directRate: null,
      inverseRate: null,
      usdCrossRate: null,
      bestRate: 0,
      bestSource: '',
      spread: 0,
      liquidity: 0,
      timestamp: new Date()
    };

    // Try direct pair
    try {
      const directInstrument = `${fiatCurrency.toLowerCase()}_${cryptoCurrency.toLowerCase()}`;
      const directTicker = await this.getTicker(directInstrument);
      results.directRate = directTicker.close;
      results.bestRate = directTicker.close;
      results.bestSource = 'direct';
      results.spread = (directTicker.high - directTicker.low) / directTicker.close * 100;
      results.liquidity = directTicker.volume;
      results.timestamp = new Date(directTicker.end);
    } catch (error) {
      // Direct pair not available
    }

    // Try inverse pair
    try {
      const inverseInstrument = `${cryptoCurrency.toLowerCase()}_${fiatCurrency.toLowerCase()}`;
      const inverseTicker = await this.getTicker(inverseInstrument);
      results.inverseRate = 1 / inverseTicker.close;
      
      if (!results.bestRate || results.inverseRate > results.bestRate) {
        results.bestRate = results.inverseRate;
        results.bestSource = 'inverse';
        results.spread = (inverseTicker.high - inverseTicker.low) / inverseTicker.close * 100;
        results.liquidity = inverseTicker.volume;
        results.timestamp = new Date(inverseTicker.end);
      }
    } catch (error) {
      // Inverse pair not available
    }

    // Try USD cross if both fiat and crypto are not USD
    if (fiatCurrency !== 'USD' && cryptoCurrency !== 'USD') {
      try {
        const fiatToUsd = await this.getTicker(`${fiatCurrency.toLowerCase()}_usd`);
        const cryptoToUsd = await this.getTicker(`${cryptoCurrency.toLowerCase()}_usd`);
        results.usdCrossRate = fiatToUsd.close / cryptoToUsd.close;
        
        if (!results.bestRate || results.usdCrossRate > results.bestRate) {
          results.bestRate = results.usdCrossRate;
          results.bestSource = 'usd_cross';
          results.spread = ((fiatToUsd.high - fiatToUsd.low) / fiatToUsd.close + (cryptoToUsd.high - cryptoToUsd.low) / cryptoToUsd.close) * 100;
          results.liquidity = Math.min(fiatToUsd.volume, cryptoToUsd.volume);
          results.timestamp = new Date(Math.max(new Date(fiatToUsd.end).getTime(), new Date(cryptoToUsd.end).getTime()));
        }
      } catch (error) {
        // USD cross not available
      }
    }

    if (results.bestRate === 0) {
      throw new Error(`No market data available for ${fiatCurrency}/${cryptoCurrency}`);
    }

    return results;
  }
}

// Export singleton instance
export const alt5ProService = new Alt5ProService({
  email: process.env.ALT5_EMAIL || process.env.ALT5_PRO_EMAIL || '',
  password: process.env.ALT5_PASSWORD || process.env.ALT5_PRO_PASSWORD || '',
  accountId: process.env.ALT5_PRO_ACCOUNT_ID,
  environment: (process.env.ALT5_PRO_ENVIRONMENT as 'production' | 'sandbox') || 'sandbox'
});
