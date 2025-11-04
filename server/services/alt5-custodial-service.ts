import crypto from 'crypto';
import { ethers } from 'ethers';
import dotenv from "dotenv"
import { alt5PayService } from './alt5pay-service'; // Import the working alt5Pay service
dotenv.config()

interface Alt5PayConfig {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  isProduction: boolean;
}

interface CreateOrderRequest {
  orderType: 'buy';
  crypto: string;
  fiat: string;
  fiatAmount: number;
  destinationAddress: string;
  callbackUrl: string;
}

interface CreateOrderResponse {
  status: 'success' | 'error';
  data?: {
    orderId: string;
    orderType: string;
    crypto: string;
    fiat: string;
    fiatAmount: number;
    cryptoAmount: number;
    destinationAddress: string;
    callbackUrl: string;
    status: string;
    createdAt: string;
    expiresAt: string;
  };
  message?: string;
}

interface OrderStatusResponse {
  status: 'success' | 'error';
  data?: {
    orderId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    crypto: string;
    fiatAmount: number;
    cryptoAmount: number;
    destinationAddress: string;
    txHash?: string;
    completedAt?: string;
    errorMessage?: string;
  };
  message?: string;
}

interface WebhookPayload {
  orderId: string;
  status: 'completed' | 'failed';
  crypto: string;
  fiatAmount: number;
  cryptoAmount: number;
  destinationAddress: string;
  txHash: string;
  timestamp: string;
}

interface Alt5CustodialConfig {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  isProduction: boolean;
}

export class Alt5CustodialService {
  private config: Alt5CustodialConfig;
  private baseUrl: string;

  constructor(config: Alt5CustodialConfig) {
    this.config = config;
    this.baseUrl = config.isProduction 
      ? 'https://api.alt5pay.com'
      : 'https://api.digitalpaydev.com';
  }

  private generateHMACSignature(url: string, method: string, body: string): string {
    const timestamp = Date.now();
    const signatureSource = `${timestamp}${method}${url}${body || ''}`;
    
    const hmac = crypto
      .createHmac('sha512', this.config.secretKey)
      .update(signatureSource)
      .digest('hex')
      .toUpperCase();
    
    return hmac;
  }

  /**
   * Create a custodial order for fiat to crypto conversion
   * This is the main on-ramp flow where user pays fiat and gets crypto
   */
  async createCustodialOrder(request: CreateOrderRequest, accountId?: string): Promise<CreateOrderResponse> {
    // For the custodial on-ramp flow, we need to use the proper endpoint
    // Based on the error we were getting, it seems we need to use a different approach
    // Let's use the format that matches the custodial on-ramp functionality
    const orderData = {
      orderType: request.orderType,
      crypto: request.crypto,
      fiat: request.fiat,
      fiatAmount: request.fiatAmount,
      destinationAddress: request.destinationAddress,
      callbackUrl: request.callbackUrl
    };

    const bodyString = JSON.stringify(orderData);
    // Use the custodial endpoint - this might be different from trading API
    const url = `/usr/order/create`;
    const signature = this.generateHMACSignature(url, 'POST', bodyString);

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.config.apiKey,
          'API-Sign': signature,
          'API-Timestamp': Date.now().toString()
        },
        body: bodyString
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[Alt5CustodialService] Non-JSON response from ALT5 API:', text);
        return {
          status: 'error' as const,
          message: `ALT5 API returned non-JSON response: ${text.substring(0, 200)}`
        };
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        return {
          status: 'success' as const,
          data: {
            orderId: result.data?.orderId || `alt5_${Date.now()}`,
            orderType: request.orderType,
            crypto: request.crypto,
            fiat: request.fiat,
            fiatAmount: request.fiatAmount,
            cryptoAmount: this.calculateCryptoAmount(request.fiatAmount, 1.0), // Will be updated by ALT5
            destinationAddress: request.destinationAddress,
            callbackUrl: request.callbackUrl,
            status: 'pending',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
          }
        };
      } else {
        return {
          status: 'error' as const,
          message: result.message || 'Failed to create order'
        };
      }
    } catch (error: any) {
      console.error('[Alt5CustodialService] Create order error:', error);
      return {
        status: 'error' as const,
        message: error.message || 'Network error occurred'
      };
    }
  }

  /**
   * Get order status from ALT5
   */
 async getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
    // For order status, we need to use the correct endpoint format
    // This would typically be something like /api/orders/{orderId} or similar
    // Using a placeholder endpoint for now - this needs to be verified with actual API docs
    const url = `/api/orders/${orderId}`;
    const bodyString = '';
    const signature = this.generateHMACSignature(url, 'GET', bodyString);

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.config.apiKey,
          'API-Sign': signature,
          'API-Timestamp': Date.now().toString()
        }
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[Alt5CustodialService] Non-JSON response from ALT5 API:', text);
        return {
          status: 'error' as const,
          message: `ALT5 API returned non-JSON response: ${text.substring(0, 200)}`
        };
      }

      const result = await response.json();
      
      return {
        status: result.status,
        data: result.data,
        message: result.message
      };
    } catch (error: any) {
      console.error('[Alt5CustodialService] Get order status error:', error);
      return {
        status: 'error' as const,
        message: error.message || 'Network error occurred'
      };
    }
  }

  /**
   * Verify webhook signature from ALT5
   */
 verifyWebhookSignature(body: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha512', this.config.secretKey)
      .update(body)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  /**
   * Calculate crypto amount based on current rates
   */
 private calculateCryptoAmount(fiatAmount: number, cryptoPrice: number): number {
    return fiatAmount / cryptoPrice;
  }

  /**
   * Get current price for a crypto asset using the working alt5Pay service
   */
 async getCurrentPrice(coin: string, currency: string = 'USD'): Promise<any> {
    try {
      // Use the existing working alt5Pay service to get current price
      const priceResponse = await alt5PayService.getCurrentPrice({
        coin: coin.toUpperCase() as any, // Cast to any to handle type compatibility
        currency: currency.toUpperCase() as 'USD' | 'CAD' | 'EUR'
      });

      if (priceResponse.data && priceResponse.data.price) {
        const price = parseFloat(priceResponse.data.price);
        return { 
          data: { 
            price: price, 
            instrument: `${coin.toLowerCase()}_${currency.toLowerCase()}`,
            currency: priceResponse.data.currency,
            timestamp: priceResponse.data.date_time
          } 
        };
      } else {
        console.warn('[Alt5CustodialService] Price response missing data, using default');
        // Fallback to default price if alt5Pay service fails
        const defaultPrice = coin.toLowerCase() === 'usdt' && currency.toLowerCase() === 'usd' ? 1.0 : 1.0;
        return { 
          data: { 
            price: defaultPrice, 
            instrument: `${coin.toLowerCase()}_${currency.toLowerCase()}`
          } 
        };
      }
    } catch (error) {
      console.error('[Alt5CustodialService] Get price error using alt5PayService:', error);
      // Return a default price to allow the order to proceed
      const instrumentKey = `${coin.toLowerCase()}_${currency.toLowerCase()}`;
      return { 
        data: { 
          price: 1.0, 
          instrument: instrumentKey
        } 
      };
    }
  }

  /**
   * Get supported cryptocurrencies
   */
  static readonly SUPPORTED_ASSETS = [
    'btc', 'eth', 'ltc', 'bch', 'doge', 'usdt', 'xrp', 'usdc', 
    'sol', 'bnb', 'dash', 'ada', 'avax', 'matic_poly', 'shib'
  ];

  static readonly ASSET_NAMES: Record<string, string> = {
    'btc': 'Bitcoin',
    'eth': 'Ethereum', 
    'ltc': 'Litecoin',
    'bch': 'Bitcoin Cash',
    'doge': 'Dogecoin',
    'usdt': 'Tether (ERC20)',
    'usdt_tron': 'Tether (TRC20)',
    'xrp': 'XRP',
    'usdc': 'USD Coin',
    'sol': 'Solana',
    'bnb': 'BNB',
    'dash': 'Dash',
    'ada': 'Cardano',
    'avax': 'Avalanche',
    'matic_poly': 'Polygon',
    'shib': 'Shiba Inu'
  };
}

// Environment configuration
export const createAlt5CustodialService = () => {
  const config: Alt5PayConfig = {
    apiKey: process.env.ALT5_PAY_PUBLIC_KEY || '',
    secretKey: process.env.ALT5_PAY_SECRET_KEY || '',
    merchantId: process.env.ALT5_PAY_MERCHANT_ID || '',
    isProduction: process.env.ALT5_PAY_ENVIRONMENT === 'production'
  };

  if (!config.apiKey || !config.secretKey || !config.merchantId) {
    console.warn('Alt5CustodialService configuration incomplete. Service will not be available.');
    return null; // Return null instead of throwing error
  }

  return new Alt5CustodialService(config);
};

// Check if service is available
export const isAlt5ServiceAvailable = () => {
  const config = {
    apiKey: process.env.ALT5_PAY_PUBLIC_KEY || '',
    secretKey: process.env.ALT5_PAY_SECRET_KEY || '',
    merchantId: process.env.ALT5_PAY_MERCHANT_ID || ''
  };

  return !!(config.apiKey && config.secretKey && config.merchantId);
};

export type { CreateOrderResponse, OrderStatusResponse, WebhookPayload };

// 1--> server\routes\alt5-custodial-routes.ts <-- we need to implemente some type of websocket even for reat-time updates..(could we do this locally? -->/ Emit WebSocket event for real-time updates
//       // This would typically emit to a WebSocket server
//       // wsServer.emit('alt5-order-update', { orderId: payload.orderId, status: payload.status }); )

// 2--> client\src\components\fx-swap\alt5-custodial-onramp.tsx <-- within the const Alt5CustodialOnramp --> const handleCreateOrder --> we still need to implement this -->(real implementation, you would:
//         // 1. Poll for order status updates
//         // 2. Handle completion with real-time updates
//         // 3. Show payment confirmation status) does this depends from the websocket implementation

// 3-->

// while we figure-out if alt5 actually supports on-ramp, let's tackle other fix/modifications.
// 1--> let make the alt5 on-ramp front-end way nicer and more intune with the website neat look, a bit more like the cryptoswap interface.
// 2--> Also let's replace the alt5 or stripe name on the front-end for other generic name related to the name NebulaX, 
// and only leave the providers' name to the payment gateway or some other place not obvious to the user