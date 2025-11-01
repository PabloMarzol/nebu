import crypto from 'crypto';
import axios from 'axios';

// ALT5 Pay API Configuration
const ALT5_PAY_CONFIG = {
  production: {
    baseUrl: 'https://api.alt5pay.com',
    btcUrl: 'https://api.alt5pay.com/usr/wallet/btc',
    ethUrl: 'https://api.alt5pay.com/usr/wallet/eth',
    usdtUrl: 'https://api.alt5pay.com/usr/wallet/erc20/usdt',
    usdcUrl: 'https://api.alt5pay.com/usr/wallet/erc20/usdc',
    priceUrl: 'https://api.alt5pay.com/usr/price',
    transactionsUrl: 'https://api.alt5pay.com/usr/wallet/transactions',
    balancesUrl: 'https://api.alt5pay.com/usr/balances',
  },
  sandbox: {
    baseUrl: 'https://api.digitalpaydev.com',
    btcUrl: 'https://api.digitalpaydev.com/usr/wallet/btc',
    ethUrl: 'https://api.digitalpaydev.com/usr/wallet/eth',
    usdtUrl: 'https://api.digitalpaydev.com/usr/wallet/erc20/usdt',
    usdcUrl: 'https://api.digitalpaydev.com/usr/wallet/erc20/usdc',
    priceUrl: 'https://api.digitalpaydev.com/usr/price',
    transactionsUrl: 'https://api.digitalpaydev.com/usr/wallet/transactions',
    balancesUrl: 'https://api.digitalpaydev.com/usr/balances',
  }
};

interface Alt5PayCredentials {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  environment: 'production' | 'sandbox';
}

interface CreatePaymentAddressParams {
  asset: 'btc' | 'eth' | 'usdt' | 'usdc' | 'bch' | 'ltc' | 'xrp' | 'sol';
  refId: string;
  currency?: 'USD' | 'CAD' | 'EUR';
  webhookUrl?: string;
}

interface PaymentAddressResponse {
  status: string;
  data: {
    ref_id: string;
    price: number;
    address: string;
    coin: string;
    expires: string;
    tag?: string; // For XRP and other tag-based assets
  };
}

interface GetPriceParams {
  coin: 'BTC' | 'ETH' | 'LTC' | 'BCH' | 'USDT' | 'USDC' | 'XRP' | 'SOL' | 'DASH' | 'ADA' | 'AVAX' | 'MATIC' | 'SHIB';
  currency: 'USD' | 'CAD' | 'EUR';
}

interface PriceResponse {
  status: string;
  data: {
    price: string;
    coin: string;
    date_time: string;
    currency: string;
  };
}

interface TransactionStatusParams {
  refId: string;
  all?: boolean;
}

interface TransactionResponse {
  status: string;
  data: {
    date_time: string;
    address: string;
    status: 'Paid' | 'Pending';
    payment_amount: number;
    total_payment: number;
    txid: string;
    price: number;
    currency: string;
    coin: string;
    source_address: string;
    confirmation?: string;
    type?: 'Payment' | 'Reused';
  } | Array<{
    date_time: string;
    address: string;
    status: 'Paid' | 'Pending';
    payment_amount: number;
    total_payment: number;
    txid: string;
    price: number;
    currency: string;
    coin: string;
    source_address: string;
    confirmation?: string;
    type?: 'Payment' | 'Reused';
  }>;
}

interface BalanceResponse {
  status: string;
  data: Array<{
    coin: string;
    balance: number;
  }>;
}

/**
 * ALT5 Pay Service
 * Handles crypto payment processing as alternative to Stripe
 */
export class Alt5PayService {
  private credentials: Alt5PayCredentials;
  private config: typeof ALT5_PAY_CONFIG.production;

  constructor(credentials: Alt5PayCredentials) {
    this.credentials = credentials;
    this.config = ALT5_PAY_CONFIG[credentials.environment];
  }

  /**
   * Generate HMAC authentication header
   */
  private generateAuthHeader(bodyString: string): string {
    const hmacDigest = crypto
      .createHmac('sha512', this.credentials.secretKey)
      .update(bodyString)
      .digest('hex');
    
    return Buffer.from(`${this.credentials.apiKey}:${hmacDigest}`).toString('base64');
  }

  /**
   * Create payment address for receiving crypto payments
   */
  async createPaymentAddress(params: CreatePaymentAddressParams): Promise<PaymentAddressResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);

    const requestBody = {
      ref_id: params.refId,
      timestamp,
      nonce,
      currency: params.currency || 'USD',
      ...(params.webhookUrl && { url: params.webhookUrl })
    };

    const bodyString = Object.entries(requestBody)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    const authHeader = this.generateAuthHeader(bodyString);

    try {
      const assetUrl = this.getAssetUrl(params.asset);
      const response = await axios.post(assetUrl + '/create', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.credentials.apiKey,
          'merchant_id': this.credentials.merchantId,
          'authentication': authHeader
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('[Alt5Pay] Create payment address failed:', error.response?.data || error.message);
      throw new Error(`Failed to create payment address: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get current crypto-to-fiat price
   */
  async getCurrentPrice(params: GetPriceParams): Promise<PriceResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);

    const requestBody = {
      coin: params.coin,
      currency: params.currency,
      timestamp,
      nonce
    };

    const bodyString = `coin=${params.coin}&currency=${params.currency}&timestamp=${timestamp}&nonce=${nonce}`;
    const authHeader = this.generateAuthHeader(bodyString);

    console.log('[Alt5Pay] Getting price with body:', bodyString);
    console.log('[Alt5Pay] Auth header:', authHeader);

    try {
      const response = await axios.post(this.config.priceUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.credentials.apiKey,
          'merchant_id': this.credentials.merchantId,
          'authentication': authHeader
        }
      });

      console.log('[Alt5Pay] Price API response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('[Alt5Pay] Get price failed:', error.response?.data || error.message);
      console.error('[Alt5Pay] Request details:', { 
        url: this.config.priceUrl, 
        body: requestBody, 
        headers: {
          'apikey': this.credentials.apiKey,
          'merchant_id': this.credentials.merchantId,
          'authentication': authHeader
        }
      });
      throw new Error(`Failed to get price: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get transaction status by reference ID
   */
  async getTransactionStatus(params: TransactionStatusParams): Promise<TransactionResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);

    const requestBody = {
      ref_id: params.refId,
      all: params.all || false,
      timestamp,
      nonce
    };

    const bodyString = `ref_id=${params.refId}&all=${params.all || false}&timestamp=${timestamp}&nonce=${nonce}`;
    const authHeader = this.generateAuthHeader(bodyString);

    try {
      const response = await axios.post(this.config.transactionsUrl + 'byref', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.credentials.apiKey,
          'merchant_id': this.credentials.merchantId,
          'authentication': authHeader
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('[Alt5Pay] Get transaction status failed:', error.response?.data || error.message);
      throw new Error(`Failed to get transaction status: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get merchant account balances
   */
  async getBalances(): Promise<BalanceResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);

    const requestBody = {
      timestamp,
      nonce
    };

    const bodyString = `timestamp=${timestamp}&nonce=${nonce}`;
    const authHeader = this.generateAuthHeader(bodyString);

    try {
      const response = await axios.post(this.config.balancesUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.credentials.apiKey,
          'merchant_id': this.credentials.merchantId,
          'authentication': authHeader
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('[Alt5Pay] Get balances failed:', error.response?.data || error.message);
      throw new Error(`Failed to get balances: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get the appropriate URL for the asset
   */
  private getAssetUrl(asset: string): string {
    const assetUrls: Record<string, string> = {
      'btc': this.config.btcUrl,
      'eth': this.config.ethUrl,
      'usdt': this.config.usdtUrl,
      'usdc': this.config.usdcUrl,
      'bch': this.config.baseUrl + '/usr/wallet/bch',
      'ltc': this.config.baseUrl + '/usr/wallet/ltc',
      'xrp': this.config.baseUrl + '/usr/wallet/xrp',
      'sol': this.config.baseUrl + '/usr/wallet/sol',
    };

    const url = assetUrls[asset.toLowerCase()];
    if (!url) {
      throw new Error(`Unsupported asset: ${asset}`);
    }

    return url;
  }

  /**
   * Create FX swap payment using ALT5 Pay (alternative to Stripe)
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
    paymentAddress: string;
    expiresAt: string;
  }> {
    try {
      console.log('[Alt5Pay] Creating FX swap payment...', params);
      
      // Get current crypto price for the target token
      const priceResponse = await this.getCurrentPrice({
        coin: this.mapTokenToAlt5Coin(params.targetToken),
        currency: (params.fiatCurrency || 'USD') as 'USD' | 'CAD' | 'EUR'
      });

      console.log('[Alt5Pay] Price response:', JSON.stringify(priceResponse, null, 2));

      if (!priceResponse.data || !priceResponse.data.price) {
        throw new Error(`Invalid price response from ALT5 Pay: ${JSON.stringify(priceResponse)}`);
      }

      const cryptoPrice = parseFloat(priceResponse.data.price);
      const cryptoAmount = params.gbpAmount / cryptoPrice;

      console.log(`[Alt5Pay] Calculated crypto amount: ${cryptoAmount} ${params.targetToken} at price ${cryptoPrice}`);

      // Create payment address
      const paymentResponse = await this.createPaymentAddress({
        asset: this.mapTokenToAlt5Asset(params.targetToken),
        refId: params.clientOrderId,
        currency: (params.fiatCurrency || 'USD') as 'USD' | 'CAD' | 'EUR',
        webhookUrl: process.env.ALT5_WEBHOOK_URL
      });

      console.log('[Alt5Pay] Payment address response:', JSON.stringify(paymentResponse, null, 2));

      return {
        clientSecret: paymentResponse.data.address, // Use address as client secret
        orderId: params.clientOrderId,
        amount: params.gbpAmount,
        paymentAddress: paymentResponse.data.address,
        expiresAt: paymentResponse.data.expires
      };
    } catch (error: any) {
      console.error('[Alt5Pay] Create FX swap payment failed:', error);
      throw error;
    }
  }

  /**
   * Map internal token symbols to ALT5 coin symbols
   */
  private mapTokenToAlt5Coin(token: string): 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'BCH' | 'LTC' | 'XRP' | 'SOL' {
    const mapping: Record<string, any> = {
      'USDT': 'USDT',
      'USDC': 'USDC',
      'BTC': 'BTC',
      'ETH': 'ETH',
      'BCH': 'BCH',
      'LTC': 'LTC',
      'XRP': 'XRP',
      'SOL': 'SOL'
    };

    const alt5Coin = mapping[token.toUpperCase()];
    if (!alt5Coin) {
      throw new Error(`Unsupported token for ALT5 Pay: ${token}`);
    }

    return alt5Coin;
  }

  /**
   * Map internal token symbols to ALT5 asset symbols (lowercase)
   */
  private mapTokenToAlt5Asset(token: string): 'btc' | 'eth' | 'usdt' | 'usdc' | 'bch' | 'ltc' | 'xrp' | 'sol' {
    const mapping: Record<string, any> = {
      'USDT': 'usdt',
      'USDC': 'usdc',
      'BTC': 'btc',
      'ETH': 'eth',
      'BCH': 'bch',
      'LTC': 'ltc',
      'XRP': 'xrp',
      'SOL': 'sol'
    };

    const alt5Asset = mapping[token.toUpperCase()];
    if (!alt5Asset) {
      throw new Error(`Unsupported token for ALT5 Pay: ${token}`);
    }

    return alt5Asset;
  }

  /**
   * Verify payment status (similar to Stripe webhook verification)
   */
  async verifyPaymentStatus(refId: string): Promise<{
    status: 'paid' | 'pending' | 'failed';
    amountReceived: number;
    transactionId: string;
    confirmations: number;
  }> {
    try {
      const transactionResponse = await this.getTransactionStatus({ refId });
      
      if (!transactionResponse.data) {
        return {
          status: 'failed',
          amountReceived: 0,
          transactionId: '',
          confirmations: 0
        };
      }

      const transaction = Array.isArray(transactionResponse.data) 
        ? transactionResponse.data[0] 
        : transactionResponse.data;

      return {
        status: transaction.status.toLowerCase() as 'paid' | 'pending' | 'failed',
        amountReceived: transaction.total_payment,
        transactionId: transaction.txid,
        confirmations: parseInt(transaction.confirmation || '0')
      };
    } catch (error: any) {
      console.error('[Alt5Pay] Verify payment status failed:', error);
      return {
        status: 'failed',
        amountReceived: 0,
        transactionId: '',
        confirmations: 0
      };
    }
  }

  /**
   * Test ALT5 Pay connection
   */
  async testConnection(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Test by getting balances (lightweight operation)
      await this.getBalances();
      return {
        success: true,
        message: 'ALT5 Pay connection successful'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `ALT5 Pay connection failed: ${error.message}`
      };
    }
  }

  /**
   * Check if ALT5 Pay is properly configured
   */
  isConfigured(): boolean {
    return !!(this.credentials.apiKey && this.credentials.secretKey && this.credentials.merchantId);
  }

  /**
   * Get supported assets
   */
  getSupportedAssets(): string[] {
    return ['BTC', 'ETH', 'USDT', 'USDC', 'BCH', 'LTC', 'XRP', 'SOL', 'DASH', 'ADA', 'AVAX', 'MATIC', 'SHIB'];
  }

  /**
   * Create BTC wallet
   */
  async createBTCWallet(refId: string, webhookUrl?: string, currency?: string): Promise<any> {
    return this.createPaymentAddress({
      asset: 'btc',
      refId,
      currency: currency as 'USD' | 'CAD' | 'EUR',
      webhookUrl
    });
  }

  /**
   * Create ETH wallet
   */
  async createETHWallet(refId: string, webhookUrl?: string, currency?: string): Promise<any> {
    return this.createPaymentAddress({
      asset: 'eth',
      refId,
      currency: currency as 'USD' | 'CAD' | 'EUR',
      webhookUrl
    });
  }

  /**
   * Create USDT wallet
   */
  async createUSDTWallet(refId: string, webhookUrl?: string, currency?: string): Promise<any> {
    return this.createPaymentAddress({
      asset: 'usdt',
      refId,
      currency: currency as 'USD' | 'CAD' | 'EUR',
      webhookUrl
    });
  }

  /**
   * Get transactions by address
   */
  async getTransactionsByAddress(address: string, all: boolean = false): Promise<any> {
    // This would need to be implemented based on ALT5 Pay API documentation
    // For now, return a mock response
    return {
      status: 'success',
      data: [],
      message: 'Transaction history not yet implemented'
    };
  }

  /**
   * Get transactions by transaction ID
   */
  async getTransactionsByTxId(txid: string, all: boolean = false): Promise<any> {
    // This would need to be implemented based on ALT5 Pay API documentation
    // For now, return a mock response
    return {
      status: 'success',
      data: [],
      message: 'Transaction history not yet implemented'
    };
  }

  /**
   * Get transactions by reference ID
   */
  async getTransactionsByRefId(refId: string, all: boolean = false): Promise<any> {
    return this.getTransactionStatus({ refId, all });
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    // Implement HMAC signature verification
    const expectedSignature = crypto
      .createHmac('sha512', this.credentials.secretKey)
      .update(body)
      .digest('hex');
    
    return signature === expectedSignature;
  }
}

// Export singleton instance
export const alt5PayService = new Alt5PayService({
  apiKey: process.env.ALT5_PAY_API_KEY || process.env.ALT5_PAY_PUBLIC_KEY || '',
  secretKey: process.env.ALT5_PAY_SECRET_KEY || process.env.ALT5_MERCHANT_SECRET_KEY || '',
  merchantId: process.env.ALT5_PAY_MERCHANT_ID || '139209',
  environment: 'production' // Force production since credentials are for production
});
