import crypto from 'crypto';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

// OnRamp Money Configuration
interface OnRampMoneyConfig {
  appId: string;
  apiKey: string; // For webhook signature verification
  baseUrl: string;
  isProduction: boolean;
}

// Fiat currency mapping
export const FIAT_TYPES = {
  INR: 1,   // India
  TRY: 2,   // Turkey
  AED: 3,   // Arab Emirates
  MXN: 4,   // Mexico
  VND: 5,   // Vietnam
  NGN: 6,   // Nigeria
} as const;

// Payment method types
export const PAYMENT_METHODS = {
  INSTANT: 1,      // UPI, instant transfer
  BANK_TRANSFER: 2 // IMPS, FAST, wire transfer
} as const;

// Supported cryptocurrencies
export const SUPPORTED_CRYPTOS = [
  'usdt',
  'usdc',
  'busd',
  'eth',
  'bnb',
  'matic',
  'sol'
] as const;

// Supported networks
export const SUPPORTED_NETWORKS = [
  'bep20',
  'matic20',
  'erc20',
  'trc20',
  'bsc-testnet'
] as const;

// Supported languages
export const SUPPORTED_LANGUAGES = [
  'en',   // English (default)
  'tr',   // Turkish
  'vi',   // Vietnamese
  'es',   // Spanish
  'pt',   // Portuguese
  'fil',  // Filipino
  'th',   // Thai
  'sw',   // Swahili
  'id'    // Indonesian
] as const;

interface CreateOrderRequest {
  userId: string;
  fiatAmount: number;
  fiatCurrency: keyof typeof FIAT_TYPES;
  cryptoCurrency: typeof SUPPORTED_CRYPTOS[number];
  network: typeof SUPPORTED_NETWORKS[number];
  walletAddress: string;
  paymentMethod: number;
  phoneNumber?: string;
  language?: typeof SUPPORTED_LANGUAGES[number];
  redirectUrl?: string;
}

interface CreateOrderResponse {
  success: boolean;
  data?: {
    orderId: string; // Our internal UUID
    merchantRecognitionId: string;
    onrampUrl: string;
    estimatedCryptoAmount?: number;
  };
  error?: string;
}

interface OrderStatusResponse {
  success: boolean;
  data?: {
    orderId: string;
    status: string;
    fiatAmount: number;
    cryptoAmount?: number;
    cryptoCurrency: string;
    network: string;
    walletAddress: string;
    onrampOrderId?: string;
    createdAt: Date;
    completedAt?: Date;
  };
  error?: string;
}

interface WebhookPayload {
  orderId: string; // OnRamp Money's orderId
  status: 'success' | 'pending';
}

export class OnRampMoneyService {
  private config: OnRampMoneyConfig;

  constructor() {
    // Read from environment variables
    const appId = process.env.ONRAMP_APP_ID || '2'; // Default to sandbox
    const apiKey = process.env.ONRAMP_API_KEY || '';
    const baseUrl = process.env.ONRAMP_BASE_URL || 'https://onramp.money';

    this.config = {
      appId,
      apiKey,
      baseUrl: baseUrl.split('?')[0], // Extract base URL without query params
      isProduction: appId !== '2'
    };

    console.log('[OnRamp Money] Initialized with appId:', appId);
  }

  /**
   * Verify webhook signature using HMAC-SHA512
   * @param payload - The webhook payload as string
   * @param signature - The signature from x-onramp-signature header
   * @returns boolean indicating if signature is valid
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      if (!this.config.apiKey) {
        console.error('[OnRamp Money] API key not configured for webhook verification');
        return false;
      }

      // Generate HMAC-SHA512 signature
      const localSignature = crypto
        .createHmac('sha512', this.config.apiKey)
        .update(payload)
        .digest('hex')
        .toUpperCase();

      const isValid = localSignature === signature.toUpperCase();

      if (!isValid) {
        console.error('[OnRamp Money] Webhook signature verification failed');
      }

      return isValid;
    } catch (error) {
      console.error('[OnRamp Money] Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Generate a unique merchant recognition ID
   */
  private generateMerchantId(): string {
    return `NEBULAX_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  /**
   * URL encode phone number for OnRamp Money
   * Format: +countryCode-phoneNumber -> %2BcountryCode-phoneNumber
   */
  private encodePhoneNumber(phoneNumber: string): string {
    // Remove any existing + sign and spaces
    const cleaned = phoneNumber.replace(/[\s+]/g, '');
    // Add + back and URL encode it
    return encodeURIComponent(`+${cleaned}`);
  }

  /**
   * Create an OnRamp Money order and generate the payment URL
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      // Validate inputs
      if (request.fiatAmount <= 0) {
        return { success: false, error: 'Fiat amount must be greater than 0' };
      }

      if (!FIAT_TYPES[request.fiatCurrency]) {
        return { success: false, error: `Unsupported fiat currency: ${request.fiatCurrency}` };
      }

      if (!SUPPORTED_CRYPTOS.includes(request.cryptoCurrency)) {
        return { success: false, error: `Unsupported cryptocurrency: ${request.cryptoCurrency}` };
      }

      if (!SUPPORTED_NETWORKS.includes(request.network)) {
        return { success: false, error: `Unsupported network: ${request.network}` };
      }

      // Generate merchant recognition ID
      const merchantRecognitionId = this.generateMerchantId();

      // Get fiat type code
      const fiatType = FIAT_TYPES[request.fiatCurrency];

      // Build OnRamp Money URL parameters
      const params = new URLSearchParams({
        appId: this.config.appId,
        walletAddress: request.walletAddress,
        coinCode: request.cryptoCurrency,
        network: request.network,
        fiatAmount: request.fiatAmount.toString(),
        fiatType: fiatType.toString(),
        paymentMethod: request.paymentMethod.toString(),
        merchantRecognitionId: merchantRecognitionId,
      });

      // Add optional parameters
      if (request.phoneNumber) {
        params.append('phoneNumber', this.encodePhoneNumber(request.phoneNumber));
      }

      if (request.language) {
        params.append('lang', request.language);
      }

      // Set redirect URL to our callback endpoint
      const callbackUrl = request.redirectUrl || `${process.env.FRONTEND_URL || 'http://localhost:5000'}/fx-swap/onramp-callback`;
      params.append('redirectUrl', callbackUrl);

      // Generate full OnRamp Money URL
      // If base URL already has /app/ or /main/buy/, use it as-is, otherwise append /main/buy/
      let urlBase = this.config.baseUrl;
      if (!urlBase.includes('/app/') && !urlBase.includes('/main/buy/')) {
        urlBase = `${urlBase}/main/buy/`;
      } else if (!urlBase.endsWith('/')) {
        urlBase = `${urlBase}/`;
      }

      const onrampUrl = `${urlBase}?${params.toString()}`;

      if (!db) {
        throw new Error('Database connection not available');
      }

      // Insert order into database
      const result = await db.execute(sql`
        INSERT INTO onramp_money_orders (
          user_id,
          merchant_recognition_id,
          fiat_amount,
          fiat_currency,
          fiat_type,
          crypto_currency,
          network,
          wallet_address,
          payment_method,
          status,
          onramp_url,
          redirect_url,
          phone_number,
          language
        ) VALUES (
          ${request.userId},
          ${merchantRecognitionId},
          ${request.fiatAmount},
          ${request.fiatCurrency},
          ${fiatType},
          ${request.cryptoCurrency},
          ${request.network},
          ${request.walletAddress},
          ${request.paymentMethod},
          'pending',
          ${onrampUrl},
          ${callbackUrl},
          ${request.phoneNumber || null},
          ${request.language || 'en'}
        )
        RETURNING id, merchant_recognition_id, onramp_url
      `);

      const insertedOrder = result.rows[0] as { id: string; merchant_recognition_id: string; onramp_url: string };

      return {
        success: true,
        data: {
          orderId: insertedOrder.id,
          merchantRecognitionId: insertedOrder.merchant_recognition_id,
          onrampUrl: insertedOrder.onramp_url,
        }
      };

    } catch (error: any) {
      console.error('OnRamp Money order creation failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to create OnRamp Money order'
      };
    }
  }

  /**
   * Handle webhook from OnRamp Money (redirectUrl callback)
   */
  async handleWebhook(orderId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate status
      const validStatuses = ['pending', 'success', 'failed'];
      if (!validStatuses.includes(status)) {
        return { success: false, error: `Invalid status: ${status}` };
      }

      if (!db) {
        throw new Error('Database connection not available');
      }

      // Update order status in database
      const result = await db.execute(sql`
        UPDATE onramp_money_orders
        SET
          order_id = ${orderId},
          status = ${status},
          completed_at = ${status === 'success' ? sql`NOW()` : null},
          updated_at = NOW()
        WHERE order_id = ${orderId} OR merchant_recognition_id LIKE ${'%' + orderId + '%'}
        RETURNING id, user_id, status
      `) as { rows: Array<{ id: string; user_id: string; status: string }>; rowCount: number };

      if (result.rowCount === 0) {
        return { success: false, error: 'Order not found' };
      }

      console.log(`OnRamp Money webhook processed: orderId=${orderId}, status=${status}`);

      return { success: true };

    } catch (error: any) {
      console.error('OnRamp Money webhook handling failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to process webhook'
      };
    }
  }

  /**
   * Get order status by merchant recognition ID or order ID
   */
  async getOrderStatus(identifier: string): Promise<OrderStatusResponse> {
    try {
      if (!db) {
        throw new Error('Database connection not available');
      }

      // Try to find by merchant_recognition_id or order_id
      const result = await db.execute(sql`
        SELECT
          id,
          order_id,
          merchant_recognition_id,
          fiat_amount,
          fiat_currency,
          crypto_amount,
          crypto_currency,
          network,
          wallet_address,
          status,
          created_at,
          completed_at
        FROM onramp_money_orders
        WHERE
          merchant_recognition_id = ${identifier}
          OR order_id = ${identifier}
          OR id::text = ${identifier}
        ORDER BY created_at DESC
        LIMIT 1
      `) as { rows: Array<{
        id: string;
        order_id: string;
        merchant_recognition_id: string;
        fiat_amount: string;
        fiat_currency: string;
        crypto_amount: string | null;
        crypto_currency: string;
        network: string;
        wallet_address: string;
        status: string;
        created_at: string;
        completed_at: string | null;
      }> };

      if (result.rows.length === 0) {
        return { success: false, error: 'Order not found' };
      }

      const order = result.rows[0];

      return {
        success: true,
        data: {
          orderId: order.id,
          status: order.status,
          fiatAmount: parseFloat(order.fiat_amount),
          cryptoAmount: order.crypto_amount ? parseFloat(order.crypto_amount) : undefined,
          cryptoCurrency: order.crypto_currency,
          network: order.network,
          walletAddress: order.wallet_address,
          onrampOrderId: order.order_id,
          createdAt: new Date(order.created_at),
          completedAt: order.completed_at ? new Date(order.completed_at) : undefined,
        }
      };

    } catch (error: any) {
      console.error('Get order status failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to get order status'
      };
    }
  }

  /**
   * Get user's OnRamp Money orders
   */
  async getUserOrders(userId: string, limit: number = 10): Promise<OrderStatusResponse[]> {
    try {
      if (!db) {
        throw new Error('Database connection not available');
      }

      const result = await db.execute(sql`
        SELECT
          id,
          order_id,
          merchant_recognition_id,
          fiat_amount,
          fiat_currency,
          crypto_amount,
          crypto_currency,
          network,
          wallet_address,
          status,
          created_at,
          completed_at
        FROM onramp_money_orders
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `) as { rows: Array<{
        id: string;
        order_id: string;
        merchant_recognition_id: string;
        fiat_amount: string;
        fiat_currency: string;
        crypto_amount: string | null;
        crypto_currency: string;
        network: string;
        wallet_address: string;
        status: string;
        created_at: string;
        completed_at: string | null;
      }> };

      return result.rows.map(order => ({
        success: true,
        data: {
          orderId: order.id,
          status: order.status,
          fiatAmount: parseFloat(order.fiat_amount),
          cryptoAmount: order.crypto_amount ? parseFloat(order.crypto_amount) : undefined,
          cryptoCurrency: order.crypto_currency,
          network: order.network,
          walletAddress: order.wallet_address,
          onrampOrderId: order.order_id,
          createdAt: new Date(order.created_at),
          completedAt: order.completed_at ? new Date(order.completed_at) : undefined,
        }
      }));

    } catch (error: any) {
      console.error('Get user orders failed:', error);
      return [];
    }
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): Array<{ code: string; name: string; fiatType: number }> {
    return [
      { code: 'INR', name: 'Indian Rupee', fiatType: 1 },
      { code: 'TRY', name: 'Turkish Lira', fiatType: 2 },
      { code: 'AED', name: 'UAE Dirham', fiatType: 3 },
      { code: 'MXN', name: 'Mexican Peso', fiatType: 4 },
      { code: 'VND', name: 'Vietnamese Dong', fiatType: 5 },
      { code: 'NGN', name: 'Nigerian Naira', fiatType: 6 },
    ];
  }

  /**
   * Get supported cryptocurrencies and networks
   */
  getSupportedCryptos(): Array<{ coin: string; networks: string[] }> {
    return [
      { coin: 'usdt', networks: ['bep20', 'matic20', 'erc20', 'trc20', 'bsc-testnet'] },
      { coin: 'usdc', networks: ['bep20', 'matic20', 'erc20'] },
      { coin: 'busd', networks: ['bep20'] },
      { coin: 'matic', networks: ['matic20'] },
      { coin: 'bnb', networks: ['bep20'] },
      { coin: 'eth', networks: ['erc20', 'matic20'] },
      { coin: 'sol', networks: ['solana'] },
    ];
  }
}

// Export singleton instance
export const onRampMoneyService = new OnRampMoneyService();
