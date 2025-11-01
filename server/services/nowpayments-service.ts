import axios from 'axios';

// NOWPayments API Configuration
const NOWPAYMENTS_CONFIG = {
  production: {
    baseUrl: 'https://api.nowpayments.io/v1',
    paymentUrl: 'https://api.nowpayments.io/v1/payment',
    statusUrl: 'https://api.nowpayments.io/v1/payment',
    currenciesUrl: 'https://api.nowpayments.io/v1/currencies',
    minAmountUrl: 'https://api.nowpayments.io/v1/min-amount',
    estimatedUrl: 'https://api.nowpayments.io/v1/estimate',
    invoiceUrl: 'https://api.nowpayments.io/v1/invoice',
  },
  sandbox: {
    baseUrl: 'https://api-sandbox.nowpayments.io/v1',
    paymentUrl: 'https://api-sandbox.nowpayments.io/v1/payment',
    statusUrl: 'https://api-sandbox.nowpayments.io/v1/payment',
    currenciesUrl: 'https://api-sandbox.nowpayments.io/v1/currencies',
    minAmountUrl: 'https://api-sandbox.nowpayments.io/v1/min-amount',
    estimatedUrl: 'https://api-sandbox.nowpayments.io/v1/estimate',
    invoiceUrl: 'https://api-sandbox.nowpayments.io/v1/invoice',
  }
};

interface NowPaymentsCredentials {
  apiKey: string;
  environment: 'production' | 'sandbox';
}

interface CreatePaymentParams {
  price_amount: number;
  price_currency: string;
  pay_amount?: number;
  pay_currency: string;
  ipn_callback_url?: string;
  order_id?: string;
  order_description?: string;
  purchase_id?: string;
  payout_address?: string;
  payout_currency?: string;
  payout_extra_id?: string;
  fixed_rate?: boolean;
  is_fee_paid_by_user?: boolean;
}

interface PaymentResponse {
  payment_id: string;
  payment_status: 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'finished' | 'failed' | 'refunded' | 'partially_paid' | 'overpaid';
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id?: string;
  order_description?: string;
  ipn_callback_url?: string;
  success_url?: string;
  cancel_url?: string;
  created_at: string;
  updated_at: string;
  purchase_id?: string;
  amount_received?: number;
  payin_extra_id?: string;
  smart_contract?: string;
  network?: string;
  network_precision?: number;
  time_limit?: string;
  burning_percent?: number;
  server_time?: string;
}

interface PaymentStatusResponse {
  payment_id: string;
  payment_status: 'waiting' | 'confirming' | 'confirmed' | 'sending' | 'finished' | 'failed' | 'refunded' | 'partially_paid' | 'overpaid';
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  actually_paid?: number;
  actually_paid_at_fiat?: number;
  payin_extra_id?: string;
  payout_extra_id?: string;
  order_id?: string;
  order_description?: string;
  purchase_id?: string;
  outcome_amount?: number;
  outcome_currency?: string;
  txid?: string;
  created_at: string;
  updated_at: string;
}

interface EstimatedPriceResponse {
  estimated_amount: number;
  transaction_speed_forecast: string;
  warning_message?: string;
}

interface MinAmountResponse {
  min_amount: number;
}

interface CurrencyResponse {
  currencies: string[];
  fiat: string[];
}

interface CreateInvoiceParams {
  price_amount: number;
  price_currency: string;
  order_id?: string;
  order_description?: string;
  ipn_callback_url?: string;
  success_url?: string;
  cancel_url?: string;
  partially_paid_url?: string;
}

interface InvoiceResponse {
  id: string;
  token: string;
  url: string;
  status: 'active' | 'paid' | 'partially_paid' | 'failed' | 'expired';
  price_amount: number;
  price_currency: string;
  order_id?: string;
  order_description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * NOWPayments Service
 * Handles crypto payments and fiat-to-crypto conversions
 */
export class NowPaymentsService {
  private credentials: NowPaymentsCredentials;
  private config: typeof NOWPAYMENTS_CONFIG.production;

  constructor(credentials: NowPaymentsCredentials) {
    this.credentials = credentials;
    this.config = NOWPAYMENTS_CONFIG[credentials.environment];
  }

  /**
   * Get supported currencies
   */
  async getSupportedCurrencies(): Promise<CurrencyResponse> {
    try {
      const response = await axios.get(this.config.currenciesUrl, {
        headers: {
          'x-api-key': this.credentials.apiKey
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('[NOWPayments] Get supported currencies failed:', error.response?.data || error.message);
      throw new Error(`Failed to get supported currencies: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get minimum payment amount
   */
  async getMinAmount(currency_from: string, currency_to: string): Promise<number> {
    try {
      const response = await axios.get(
        `${this.config.minAmountUrl}?currency_from=${currency_from}&currency_to=${currency_to}&fiat_equivalent=usd`,
        {
          headers: {
            'x-api-key': this.credentials.apiKey
          }
        }
      );

      return response.data.min_amount;
    } catch (error: any) {
      console.error('[NOWPayments] Get min amount failed:', error.response?.data || error.message);
      throw new Error(`Failed to get min amount: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get estimated payment amount
   */
  async getEstimatedAmount(amount: number, currency_from: string, currency_to: string): Promise<EstimatedPriceResponse> {
    try {
      const response = await axios.get(
        `${this.config.estimatedUrl}?amount=${amount}&currency_from=${currency_from}&currency_to=${currency_to}`,
        {
          headers: {
            'x-api-key': this.credentials.apiKey
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('[NOWPayments] Get estimated amount failed:', error.response?.data || error.message);
      throw new Error(`Failed to get estimated amount: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a new payment
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    try {
      console.log('[NOWPayments] Creating payment...', params);

      const response = await axios.post(this.config.paymentUrl, params, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.credentials.apiKey
        }
      });

      console.log('[NOWPayments] Payment created:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('[NOWPayments] Create payment failed:', error.response?.data || error.message);
      console.error('[NOWPayments] Request details:', { 
        url: this.config.paymentUrl, 
        body: params,
        headers: {
          'x-api-key': this.credentials.apiKey
        }
      });
      throw new Error(`Failed to create payment: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get payment status by ID
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await axios.get(`${this.config.statusUrl}/${paymentId}`, {
        headers: {
          'x-api-key': this.credentials.apiKey
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('[NOWPayments] Get payment status failed:', error.response?.data || error.message);
      throw new Error(`Failed to get payment status: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create an invoice (hosted payment page)
   */
  async createInvoice(params: CreateInvoiceParams): Promise<InvoiceResponse> {
    try {
      console.log('[NOWPayments] Creating invoice...', params);

      const response = await axios.post(this.config.invoiceUrl, params, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.credentials.apiKey
        }
      });

      console.log('[NOWPayments] Invoice created:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('[NOWPayments] Create invoice failed:', error.response?.data || error.message);
      throw new Error(`Failed to create invoice: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create FX swap payment using NOWPayments
   */
  async createFxSwapPayment(params: {
    gbpAmount: number;
    destinationWallet: string;
    targetToken: string;
    userId: string;
    clientOrderId: string;
    fiatCurrency?: string;
    webhookUrl?: string;
  }): Promise<{
    clientSecret: string;
    orderId: string;
    amount: number;
    payinAddress: string;
    estimatedCryptoAmount: number;
    paymentId: string;
    invoiceUrl?: string;
  }> {
    try {
      console.log('[NOWPayments] Creating FX swap payment...', params);

      // Convert GBP to USD
      const usdAmount = params.gbpAmount * 1.25; // Approximate GBP to USD conversion
      const payCurrency = this.mapTokenToNowPaymentsToken(params.targetToken);

      // Get estimated crypto amount
      const estimatedAmount = await this.getEstimatedAmount(usdAmount, 'usd', payCurrency);
      console.log(`[NOWPayments] Estimated ${payCurrency} amount: ${estimatedAmount.estimated_amount}`);

      // Create payment
      const payment = await this.createPayment({
        price_amount: usdAmount,
        price_currency: 'usd',
        pay_currency: payCurrency,
        pay_amount: estimatedAmount.estimated_amount,
        ipn_callback_url: params.webhookUrl || process.env.NOWPAYMENTS_WEBHOOK_URL,
        order_id: params.clientOrderId,
        order_description: `FX Swap: ${params.gbpAmount} GBP to ${params.targetToken}`,
        payout_address: params.destinationWallet,
        fixed_rate: true,
        is_fee_paid_by_user: false
      });

      return {
        clientSecret: payment.payment_id, // Use payment ID as client secret
        orderId: params.clientOrderId,
        amount: params.gbpAmount,
        payinAddress: payment.pay_address,
        estimatedCryptoAmount: payment.pay_amount,
        paymentId: payment.payment_id
      };
    } catch (error: any) {
      console.error('[NOWPayments] Create FX swap payment failed:', error);
      throw error;
    }
  }

  /**
   * Create hosted invoice for better UX
   */
  async createHostedPayment(params: {
    gbpAmount: number;
    targetToken: string;
    userId: string;
    clientOrderId: string;
    webhookUrl?: string;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<{
    invoiceUrl: string;
    invoiceId: string;
    token: string;
  }> {
    try {
      console.log('[NOWPayments] Creating hosted payment...', params);

      // Convert GBP to USD
      const usdAmount = params.gbpAmount * 1.25; // Approximate GBP to USD conversion

      // Create invoice
      const invoice = await this.createInvoice({
        price_amount: usdAmount,
        price_currency: 'usd',
        order_id: params.clientOrderId,
        order_description: `FX Swap: ${params.gbpAmount} GBP to ${params.targetToken}`,
        ipn_callback_url: params.webhookUrl || process.env.NOWPAYMENTS_WEBHOOK_URL,
        success_url: params.successUrl || `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: params.cancelUrl || `${process.env.FRONTEND_URL}/payment-cancel`
      });

      return {
        invoiceUrl: invoice.url,
        invoiceId: invoice.id,
        token: invoice.token
      };
    } catch (error: any) {
      console.error('[NOWPayments] Create hosted payment failed:', error);
      throw error;
    }
  }

  /**
   * Map internal token symbols to NOWPayments token symbols
   */
  private mapTokenToNowPaymentsToken(token: string): string {
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
      'LINK': 'link',
      'MATIC': 'matic',
      'AVAX': 'avax'
    };

    const nowPaymentsToken = mapping[token.toUpperCase()];
    if (!nowPaymentsToken) {
      throw new Error(`Unsupported token for NOWPayments: ${token}`);
    }

    return nowPaymentsToken;
  }

  /**
   * Verify payment status (similar to Stripe webhook verification)
   */
  async verifyPaymentStatus(paymentId: string): Promise<{
    status: 'paid' | 'pending' | 'failed';
    amountReceived: number;
    transactionId: string;
    confirmations?: number;
  }> {
    try {
      const payment = await this.getPaymentStatus(paymentId);
      
      let status: 'paid' | 'pending' | 'failed';
      switch (payment.payment_status) {
        case 'finished':
          status = 'paid';
          break;
        case 'failed':
        case 'refunded':
          status = 'failed';
          break;
        case 'waiting':
        case 'confirming':
        case 'confirmed':
        case 'sending':
        case 'partially_paid':
        case 'overpaid':
          status = 'pending';
          break;
        default:
          status = 'pending';
      }

      return {
        status,
        amountReceived: payment.actually_paid || 0,
        transactionId: payment.txid || payment.payment_id,
        confirmations: payment.payment_status === 'finished' ? 3 : undefined
      };
    } catch (error: any) {
      console.error('[NOWPayments] Verify payment status failed:', error);
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
        message: `NOWPayments API error: ${error.message}`
      };
    }
  }
}

// Export singleton instance
export const nowPaymentsService = new NowPaymentsService({
  apiKey: process.env.NOWPAYMENTS_API_KEY || '',
  environment: 'production'
});
