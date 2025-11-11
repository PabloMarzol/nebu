import crypto from 'crypto';
import axios from 'axios';
import { db } from '../db';
import { alt5Accounts } from '@shared/fx_swap_schema';
import { eq, and } from 'drizzle-orm';
import dotenv from "dotenv";
import speakeasy from 'speakeasy';
dotenv.config()

interface Alt5TradingConfig {
  email: string;
  password: string;
  baseUrl: string;
  securityGroup: string;
}

interface CreateOrderRequest {
  instrument: string;
  type: 'buy' | 'sell';
  requestedQuoteAmount?: number;
  amount?: number;
  price?: number;
  isLimit?: boolean;
  isStop?: boolean;
  activationPrice?: number;
  timeInForce?: number;
}

interface OrderResponse {
  status: 'success' | 'error';
  data?: any;
  message?: string;
}

interface BankTransferRequest {
  amount: number;
  paymentSystem: string;
  assetId: string;
  accountInfo: {
    beneficiary: string;
    beneficiaryAddress: string;
    bankName: string;
  };
  nonce: string;
}

export class Alt5TradingService {
  private config: Alt5TradingConfig;
  private sessionToken?: string;
  private userId?: string;
  private accountId?: string;

  constructor(config: Alt5TradingConfig) {
    this.config = config;
  }

  /**
   * Authenticate with ALT5 master account
   */
  async authenticate(): Promise<boolean> {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      // Step 1: Login with email and password
      const loginResponse = await axios.post(
        `${this.config.baseUrl}/identity/api/v2/identity/${this.config.securityGroup}/users/signin/`,
        {
          email: this.config.email,
          password: this.config.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Store the 2FA cookie that comes back
      const cookies = loginResponse.headers['set-cookie'];
      const twoFactorCookie = cookies?.find((cookie: string) => 
        cookie.includes('Identity.TwoFactorUserId')
      );

      if (!twoFactorCookie) {
        throw new Error('2FA cookie not found - account may not require 2FA or setup is incorrect');
      }

      console.log('Master account authentication initiated - proceeding with 2FA');

      // Step 2: Generate TOTP token for 2FA
      const totpSecret = process.env.ALT5_2FA_TOTP_SECRET_PRODUCTION;
      if (!totpSecret) {
        throw new Error('TOTP secret not configured - please set ALT5_2FA_TOTP_SECRET_PRODUCTION environment variable');
      }

      const twoFactorToken = speakeasy.totp({
        secret: totpSecret,
        encoding: 'base32'
      });

      console.log('Generated 2FA token:', twoFactorToken);

      // Step 3: Complete 2FA confirmation
      const twoFactorResponse = await axios.post(
        `${this.config.baseUrl}/identity/api/v2/identity/${this.config.securityGroup}/users/signin/2fa`,
        {
          VerificationCode: twoFactorToken
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': twoFactorCookie
          }
        }
      );

      console.log('2FA response status:', twoFactorResponse.status);
      console.log('2FA response headers:', twoFactorResponse.headers);
      console.log('2FA response data:', twoFactorResponse.data);

      // Extract session token from response cookies
      const sessionCookies = twoFactorResponse.headers['set-cookie'];
      
      // Look for the ASP.NET Core Identity cookie (JWT token)
      let sessionToken = sessionCookies?.find((cookie: string) => 
        cookie.includes('.AspNetCore.Identity.Scheme')
      );

      // If no ASP.NET Core Identity cookie found, look for other session cookies
      if (!sessionToken) {
        sessionToken = sessionCookies?.find((cookie: string) => 
          cookie.includes('Identity.Session') || cookie.includes('Authorization')
        );
      }

      // If still no session token, check if we can use the 2FA cookie for subsequent requests
      if (!sessionToken && twoFactorResponse.status === 200) {
        console.log('2FA successful but no session cookie found - using 2FA cookie for authentication');
        sessionToken = twoFactorCookie; // Use the 2FA cookie as session token
      }

      if (!sessionToken) {
        throw new Error('Session token not found in 2FA response');
      }

      console.log('Found session token:', sessionToken.substring(0, 50) + '...');

      // Step 4: Get account ID from user profile
      const accountResponse = await axios.get(
        `${this.config.baseUrl}/frontoffice/api/accounts`,
        {
          headers: {
            'Cookie': sessionToken
          }
        }
      );

      if (accountResponse.data && accountResponse.data.data && accountResponse.data.data.length > 0) {
        this.accountId = accountResponse.data.data[0].id;
        console.log('Retrieved ALT5 account ID:', this.accountId);
      } else {
        throw new Error('No account found for user');
      }

      // Store the real session token and user info
      this.sessionToken = sessionToken;
      this.userId = twoFactorResponse.data.id; // Fixed: Use correct response object
      this.accountId = accountResponse.data.data[0].id;
      
      console.log('ALT5 Master Account Authentication completed successfully');
      return true;
    } catch (error: any) {
      console.error('ALT5 Master Account Authentication failed:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Create a sub-account for a user under the master account
   * Since ALT5 doesn't provide API for creating sub-accounts, we use the master account
   * and track user ownership internally in our database
   */
  async createUserAccount(userId: string): Promise<string | null> {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }
      
      if (!this.sessionToken) {
        throw new Error('Not authenticated - call authenticate() first');
      }

      if (!this.accountId) {
        throw new Error('Master account ID not available - call authenticate() first');
      }

      // Use the master account for all operations
      // Track user ownership in our database instead of creating fake ALT5 sub-accounts
      console.log(`Using master account for user ${userId}: ${this.accountId}`);

      // Store the account mapping in database - user maps to master account
      const [dbAccount] = await db.insert(alt5Accounts).values({
        userId: userId,
        alt5AccountId: this.accountId, // Use master account ID
        alt5UserId: this.userId || 'master_account', // Use master user ID, fallback to 'master_account' if null
        masterAccount: true, // Mark as master account
        createdAt: new Date()
      }).returning();

      console.log(`Mapped user ${userId} to master ALT5 account: ${this.accountId}`);
      
      return this.accountId;
    } catch (error: any) {
      console.error('Failed to create user account:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get or create user's ALT5 account
   */
  async getOrCreateUserAccount(userId: string): Promise<string | null> {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      // Check if user already has an ALT5 account
      const existingAccount = await db.select().from(alt5Accounts)
        .where(eq(alt5Accounts.userId, userId))
        .limit(1);

      if (existingAccount.length > 0) {
        return existingAccount[0].alt5AccountId;
      }

      // Create new account if none exists
      return await this.createUserAccount(userId);
    } catch (error: any) {
      console.error('Failed to get or create user account:', error.message);
      return null;
    }
  }

  /**
   * Get user's ALT5 account details from database
   */
  // async getUserAccountDetails(userId: string): Promise<{ alt5AccountId: string; alt5UserId: string } | null> {
  //   try {
  //     if (!db) {
  //       throw new Error('Database not initialized');
  //     }

  //     const account = await db.select().from(alt5Accounts)
  //       .where(eq(alt5Accounts.userId, userId))
  //       .limit(1);

  //     if (account.length > 0) {
  //       return {
  //         alt5AccountId: account[0].alt5AccountId,
  //         alt5UserId: account[0].alt5UserId
  //       };
  //     }
  //     return null;
  //   } catch (error: any) {
  //     console.error('Failed to get user account details:', error.message);
  //     return null;
  //   }
  // }

  /**
   * Create a trading order (fiat-to-crypto conversion)
   */
  async createOrder(accountId: string, orderRequest: CreateOrderRequest): Promise<OrderResponse> {
    try {
      if (!this.sessionToken) {
        throw new Error('Not authenticated - call authenticate() first');
      }

      const orderData = {
        Order: {
          Instrument: orderRequest.instrument,
          Type: orderRequest.type,
          Amount: orderRequest.amount,
          Price: orderRequest.price,
          ActivationPrice: orderRequest.activationPrice,
          IsLimit: orderRequest.isLimit ?? false,
          IsStop: orderRequest.isStop ?? false,
          TimeInForce: orderRequest.timeInForce ?? null,
          RequestedQuoteAmount: orderRequest.requestedQuoteAmount
        }
      };

      const response = await axios.post(
        `${this.config.baseUrl}/frontoffice/api/${accountId}/order`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.sessionToken}` // This would be the actual session token
          }
        }
      );

      if (response.data && response.data.status !== 'error') {
        return {
          status: 'success',
          data: response.data
        };
      } else {
        return {
          status: 'error',
          message: response.data?.message || 'Failed to create order'
        };
      }
    } catch (error: any) {
      console.error('Failed to create order:', error.response?.data || error.message);
      return {
        status: 'error',
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Create bank wire transfer deposit request
   */
  async createBankTransferRequest(accountId: string, transferRequest: BankTransferRequest): Promise<OrderResponse> {
    try {
      if (!this.sessionToken) {
        throw new Error('Not authenticated - call authenticate() first');
      }

      const response = await axios.post(
        `${this.config.baseUrl}/frontoffice/api/wallet/${accountId}/deposit`,
        {
          ...transferRequest
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.sessionToken}`
          }
        }
      );

      if (response.data && response.data.status !== 'error') {
        return {
          status: 'success',
          data: response.data
        };
      } else {
        return {
          status: 'error',
          message: response.data?.message || 'Failed to create bank transfer request'
        };
      }
    } catch (error: any) {
      console.error('Failed to create bank transfer request:', error.response?.data || error.message);
      return {
        status: 'error',
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get deposit address information for bank transfer details
   */
  async getDepositAddress(accountId: string, paymentSystem: string, assetId: string): Promise<OrderResponse> {
    try {
      if (!this.sessionToken) {
        throw new Error('Not authenticated - call authenticate() first');
      }

      const response = await axios.get(
        `${this.config.baseUrl}/frontoffice/api/wallet/${accountId}/deposit?paymentSystem=${paymentSystem}&assetId=${assetId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.sessionToken}`
          }
        }
      );

      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      } else {
        return {
          status: 'error',
          message: 'Failed to get deposit address'
        };
      }
    } catch (error: any) {
      console.error('Failed to get deposit address:', error.response?.data || error.message);
      return {
        status: 'error',
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get user's account balance
   */
  async getAccountBalance(accountId: string): Promise<OrderResponse> {
    try {
      if (!this.sessionToken) {
        throw new Error('Not authenticated - call authenticate() first');
      }

      // This would be the actual endpoint to get account balance
      // The exact endpoint may vary based on ALT5 API documentation
      const response = await axios.get(
        `${this.config.baseUrl}/frontoffice/api/${accountId}/balances`, // Placeholder endpoint
        {
          headers: {
            'Authorization': `Bearer ${this.sessionToken}`
          }
        }
      );

      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      } else {
        return {
          status: 'error',
          message: 'Failed to get account balance'
        };
      }
    } catch (error: any) {
      console.error('Failed to get account balance:', error.response?.data || error.message);
      return {
        status: 'error',
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get order history for user
   */
  async getOrderHistory(accountId: string): Promise<OrderResponse> {
    try {
      if (!this.sessionToken) {
        throw new Error('Not authenticated - call authenticate() first');
      }

      const response = await axios.get(
        `${this.config.baseUrl}/frontoffice/api/${accountId}/order_history?ascOrder=CreatedAt`,
        {
          headers: {
            'Authorization': `Bearer ${this.sessionToken}`
          }
        }
      );

      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      } else {
        return {
          status: 'error',
          message: 'Failed to get order history'
        };
      }
    } catch (error: any) {
      console.error('Failed to get order history:', error.response?.data || error.message);
      return {
        status: 'error',
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get active orders for user
   */
  async getActiveOrders(accountId: string): Promise<OrderResponse> {
    try {
      if (!this.sessionToken) {
        throw new Error('Not authenticated - call authenticate() first');
      }

      const response = await axios.get(
        `${this.config.baseUrl}/frontoffice/api/${accountId}/orders/my`,
        {
          headers: {
            'Authorization': `Bearer ${this.sessionToken}`
          }
        }
      );

      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      } else {
        return {
          status: 'error',
          message: 'Failed to get active orders'
        };
      }
    } catch (error: any) {
      console.error('Failed to get active orders:', error.response?.data || error.message);
      return {
        status: 'error',
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(accountId: string, orderId: string): Promise<OrderResponse> {
    try {
      if (!this.sessionToken) {
        throw new Error('Not authenticated - call authenticate() first');
      }

      const response = await axios.delete(
        `${this.config.baseUrl}/frontoffice/api/${accountId}/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.sessionToken}`
          }
        }
      );

      if (response.data) {
        return {
          status: 'success',
          data: response.data
        };
      } else {
        return {
          status: 'error',
          message: 'Failed to cancel order'
        };
      }
    } catch (error: any) {
      console.error('Failed to cancel order:', error.response?.data || error.message);
      return {
        status: 'error',
        message: error.response?.data?.message || error.message
      };
    }
  }

  // Additional methods for the routes that expect them
  async getUserAccountDetails(userId: string) {
    // Implement the actual method since it's commented out above
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      const account = await db.select().from(alt5Accounts)
        .where(eq(alt5Accounts.userId, userId))
        .limit(1);

      if (account.length > 0) {
        return {
          alt5AccountId: account[0].alt5AccountId,
          alt5UserId: account[0].alt5UserId
        };
      }
      return null;
    } catch (error: any) {
      console.error('Failed to get user account details:', error.message);
      return null;
    }
  }

  async getActiveOrdersForUser(accountId: string) {
    return this.getActiveOrders(accountId);
  }

  async getOrderHistoryForUser(accountId: string) {
    return this.getOrderHistory(accountId);
  }

  async getDepositAddressForUser(accountId: string, paymentSystem: string, assetId: string) {
    return this.getDepositAddress(accountId, paymentSystem, assetId);
  }

  async getAccountBalanceForUser(accountId: string) {
    return this.getAccountBalance(accountId);
  }

  async createBankTransferDeposit(accountId: string, transferRequest: BankTransferRequest) {
    return this.createBankTransferRequest(accountId, transferRequest);
  }

  async createTradingOrder(accountId: string, orderRequest: CreateOrderRequest) {
    return this.createOrder(accountId, orderRequest);
  }
}

// Export singleton instance with environment configuration
export const alt5TradingService = new Alt5TradingService({
  email: process.env.ALT5_TRADING_EMAIL || process.env.ALT5_PAY_PUBLIC_KEY || '',
  password: process.env.ALT5_TRADING_PASSWORD || process.env.ALT5_PAY_SECRET_KEY || '',
  baseUrl: process.env.ALT5_TRADING_BASE_URL || 'https://exchange.digitalpaydev.com',
  securityGroup: process.env.ALT5_SECURITY_GROUP || 'exchange-users'
});

// Check if service is configured
export const isAlt5TradingServiceAvailable = () => {
  const config = {
    email: process.env.ALT5_TRADING_EMAIL || process.env.ALT5_PAY_PUBLIC_KEY || '',
    password: process.env.ALT5_TRADING_PASSWORD || process.env.ALT5_PAY_SECRET_KEY || ''
  };
  return !!(config.email && config.password);
};
