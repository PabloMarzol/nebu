import axios from 'axios';

// ChangeNow API Configuration
const CHANGENOW_CONFIG = {
  production: {
    baseUrl: 'https://api.changenow.io/v2',
    exchangeUrl: 'https://api.changenow.io/v2/exchange',
    statusUrl: 'https://api.changenow.io/v2/exchange/by-id',
    currenciesUrl: 'https://api.changenow.io/v2/exchange/currencies',
    minAmountUrl: 'https://api.changenow.io/v2/exchange/min-amount',
    estimatedAmountUrl: 'https://api.changenow.io/v2/exchange/estimated-amount',
  },
  sandbox: {
    baseUrl: 'https://api.changenow.io/v2',
    exchangeUrl: 'https://api.changenow.io/v2/exchange',
    statusUrl: 'https://api.changenow.io/v2/exchange/by-id',
    currenciesUrl: 'https://api.changenow.io/v2/exchange/currencies',
    minAmountUrl: 'https://api.changenow.io/v2/exchange/min-amount',
    estimatedAmountUrl: 'https://api.changenow.io/v2/exchange/estimated-amount',
  }
};

interface ChangeNowCredentials {
  apiKey: string;
  environment: 'production' | 'sandbox';
}

interface CreateExchangeParams {
  fromCurrency: string;
  toCurrency: string;
  fromAmount?: number;
  toAmount?: number;
  address: string;
  refundAddress?: string;
  userId?: string;
  clientOrderId?: string;
}

interface ExchangeResponse {
  id: string;
  status: 'new' | 'waiting' | 'confirming' | 'exchanging' | 'sending' | 'finished' | 'failed' | 'refunded' | 'verifying';
  payinAddress: string;
  payoutAddress: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  payinExtraId?: string;
  payoutExtraId?: string;
  createdAt: string;
  updatedAt: string;
  depositExtraId?: string;
}

interface ExchangeStatusResponse {
  id: string;
  status: 'new' | 'waiting' | 'confirming' | 'exchanging' | 'sending' | 'finished' | 'failed' | 'refunded' | 'verified';
  payinAddress: string;
  payoutAddress: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  payinHash?: string;
  payoutHash?: string;
  createdAt: string;
  updatedAt: string;
}

interface EstimatedAmountResponse {
  estimatedAmount: number;
  transactionSpeedForecast: string;
  warningMessage?: string;
}

interface MinAmountResponse {
  minAmount: number;
}

interface CurrencyInfo {
  ticker: string;
  name: string;
  image: string;
  hasExternalId: boolean;
  isFiat: boolean;
  featured: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
  network: string;
  tokenContract?: string;
  buy: boolean;
  sell: boolean;
  legacyTicker: string;
}

/**
 * ChangeNow Service
 * Handles fiat-to-crypto exchanges as alternative payment provider
 */
export class ChangeNowService {
  private credentials: ChangeNowCredentials;
  private config: typeof CHANGENOW_CONFIG.production;

  constructor(credentials: ChangeNowCredentials) {
    this.credentials = credentials;
    this.config = CHANGENOW_CONFIG[credentials.environment];
  }

  /**
   * Get supported currencies
   */
  async getSupportedCurrencies(): Promise<CurrencyInfo[]> {
    try {
      const response = await axios.get(`${this.config.currenciesUrl}?active=true&flow=fixed-rate`, {
        headers: {
          'x-changenow-api-key': this.credentials.apiKey
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('[ChangeNow] Get supported currencies failed:', error.response?.data || error.message);
      throw new Error(`Failed to get supported currencies: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get minimum exchange amount
   */
  async getMinAmount(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      const response = await axios.get(`${this.config.minAmountUrl}?from_currency=${fromCurrency}&to_currency=${toCurrency}`, {
        headers: {
          'x-changenow-api-key': this.credentials.apiKey
        }
      });

      return response.data.minAmount;
    } catch (error: any) {
      console.error('[ChangeNow] Get min amount failed:', error.response?.data || error.message);
      throw new Error(`Failed to get min amount: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get estimated exchange amount
   */
  async getEstimatedAmount(fromCurrency: string, toCurrency: string, fromAmount: number): Promise<EstimatedAmountResponse> {
    try {
      const response = await axios.get(
        `${this.config.estimatedAmountUrl}?from_currency=${fromCurrency}&to_currency=${toCurrency}&from_amount=${fromAmount}&flow=fixed-rate`,
        {
          headers: {
            'x-changenow-api-key': this.credentials.apiKey
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('[ChangeNow] Get estimated amount failed:', error.response?.data || error.message);
      throw new Error(`Failed to get estimated amount: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a new exchange (fiat to crypto)
   */
  async createExchange(params: CreateExchangeParams): Promise<ExchangeResponse> {
    try {
      console.log('[ChangeNow] Creating exchange...', params);

      const requestBody: any = {
        from: params.fromCurrency,
        to: params.toCurrency,
        address: params.address,
        refundAddress: params.refundAddress,
        flow: 'fixed-rate',
        userId: params.userId,
        externalId: params.clientOrderId
      };

      // Add amount based on which one is provided
      if (params.fromAmount) {
        requestBody.fromAmount = params.fromAmount;
      } else if (params.toAmount) {
        requestBody.toAmount = params.toAmount;
      }

      const response = await axios.post(this.config.exchangeUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'x-changenow-api-key': this.credentials.apiKey
        }
      });

      console.log('[ChangeNow] Exchange created:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('[ChangeNow] Create exchange failed:', error.response?.data || error.message);
      throw new Error(`Failed to create exchange: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get exchange status by ID
   */
  async getExchangeStatus(exchangeId: string): Promise<ExchangeStatusResponse> {
    try {
      const response = await axios.get(`${this.config.statusUrl}?id=${exchangeId}`, {
        headers: {
          'x-changenow-api-key': this.credentials.apiKey
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('[ChangeNow] Get exchange status failed:', error.response?.data || error.message);
      throw new Error(`Failed to get exchange status: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create FX swap payment using ChangeNow (fiat to crypto conversion)
   */
  async createFxSwapPayment(params: {
    gbpAmount: number;
    destinationWallet: string;
    targetToken: string;
    userId: string;
    clientOrderId: string;
    fiatCurrency?: string;
  }): Promise<{
    clientSecret: string;
    orderId: string;
    amount: number;
    payinAddress: string;
    estimatedCryptoAmount: number;
    exchangeId: string;
  }> {
    try {
      console.log('[ChangeNow] Creating FX swap payment...', params);

      // Convert GBP to USD for ChangeNow (they primarily work with USD)
      const usdAmount = params.gbpAmount * 1.25; // Approximate GBP to USD conversion
      const fromCurrency = 'usd';
      const toCurrency = this.mapTokenToChangeNowToken(params.targetToken);

      // Get estimated crypto amount
      const estimatedAmount = await changeNowService.getEstimatedAmount(fromCurrency, toCurrency, usdAmount);
      console.log(`[ChangeNow] Estimated ${toCurrency} amount: ${estimatedAmount.estimatedAmount}`);

      // Create the exchange
      const exchange = await changeNowService.createExchange({
        fromCurrency,
        toCurrency,
        fromAmount: usdAmount,
        address: params.destinationWallet,
        userId: params.userId,
        clientOrderId: params.clientOrderId
      });

      return {
        clientSecret: exchange.id, // Use exchange ID as client secret
        orderId: params.clientOrderId,
        amount: params.gbpAmount,
        payinAddress: exchange.payinAddress,
        estimatedCryptoAmount: exchange.toAmount,
        exchangeId: exchange.id
      };
    } catch (error: any) {
      console.error('[ChangeNow] Create FX swap payment failed:', error);
      throw error;
    }
  }

  /**
   * Map internal token symbols to ChangeNow token symbols
   */
  private mapTokenToChangeNowToken(token: string): string {
    const mapping: Record<string, string> = {
      'USDT': 'usdt',
      'USDC': 'usdc',
      'BTC': 'btc',
      'ETH': 'eth',
      'BCH': 'bch',
      'LTC': 'ltc',
      'XRP': 'xrp',
      'SOL': 'sol',
      'BNB': 'bnb',
      'ADA': 'ada',
      'DOT': 'dot',
      'LINK': 'link'
    };

    const changeNowToken = mapping[token.toUpperCase()];
    if (!changeNowToken) {
      throw new Error(`Unsupported token for ChangeNow: ${token}`);
    }

    return changeNowToken;
  }

  /**
   * Verify payment status (similar to Stripe webhook verification)
   */
  async verifyPaymentStatus(exchangeId: string): Promise<{
    status: 'paid' | 'pending' | 'failed';
    amountReceived: number;
    transactionId: string;
    confirmations?: number;
  }> {
    try {
      const exchange = await this.getExchangeStatus(exchangeId);
      
      let status: 'paid' | 'pending' | 'failed';
      switch (exchange.status) {
        case 'finished':
        case 'verified':
          status = 'paid';
          break;
        case 'failed':
        case 'refunded':
          status = 'failed';
          break;
        case 'new':
        case 'waiting':
        case 'confirming':
        case 'exchanging':
        case 'sending':
          status = 'pending';
          break;
        default:
          status = 'pending';
      }

      return {
        status,
        amountReceived: exchange.toAmount,
        transactionId: exchange.payoutHash || exchange.id,
        confirmations: exchange.status === 'finished' ? 3 : undefined
      };
    } catch (error: any) {
      console.error('[ChangeNow] Verify payment status failed:', error);
      return {
        status: 'failed',
        amountReceived: 0,
        transactionId: '',
        confirmations: 0
      };
    }
  }

  /**
   * Get provider health status
   */
  async getProviderHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    message: string;
  }> {
    try {
      // Test API connectivity by getting supported currencies
      await this.getSupportedCurrencies();
      return {
        status: 'healthy',
        message: 'All systems operational'
      };
    } catch (error: any) {
      return {
        status: 'down',
        message: `ChangeNow API error: ${error.message}`
      };
    }
  }
}

// Export singleton instance
export const changeNowService = new ChangeNowService({
  apiKey: process.env.CHANGENOW_API_KEY || '',
  environment: 'production'
});
