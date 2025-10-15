/**
 * Alt5Pro API Integration Service
 * Comprehensive integration for Identity, Market Data, Front Office, and Admin APIs
 */

import crypto from 'crypto';

// Alt5Pro API Configuration
const ALT5PRO_CONFIG = {
  BASE_URLS: {
    IDENTITY: 'https://trade.alt5pro.com/identity',
    MARKET_DATA: 'https://trade.alt5pro.com/marketdata',
    FRONT_OFFICE: 'https://trade.alt5pro.com/frontoffice',
    ADMIN: 'https://trade.alt5pro.com/back-api'
  },
  SECURITY_GROUP: process.env.ALT5_SECURITY_GROUP || 'default'
};

interface Alt5ProCredentials {
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
}

class Alt5ProAPIService {
  private credentials: Alt5ProCredentials;

  constructor() {
    this.credentials = {
      apiKey: process.env.ALT5_API_KEY,
      secretKey: process.env.ALT5_SECRET_KEY,
      merchantId: process.env.ALT5_MERCHANT_ID
    };
  }

  // =====================
  // IDENTITY SERVICE API
  // =====================

  /**
   * Sign up new user with email confirmation
   */
  async signUpUser(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }) {
    try {
      const response = await fetch(
        `${ALT5PRO_CONFIG.BASE_URLS.IDENTITY}/api/v2/identity/${ALT5PRO_CONFIG.SECURITY_GROUP}/users/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNumber
          })
        }
      );

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro SignUp error:', error);
      return { success: false, error: 'Failed to create user account' };
    }
  }

  /**
   * Sign in user with 2FA support
   */
  async signInUser(email: string, password: string) {
    try {
      const response = await fetch(
        `${ALT5PRO_CONFIG.BASE_URLS.IDENTITY}/api/v2/identity/${ALT5PRO_CONFIG.SECURITY_GROUP}/users/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      );

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status,
        requires2FA: result.requires2FA || false
      };
    } catch (error) {
      console.error('Alt5Pro SignIn error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Complete 2FA authentication
   */
  async complete2FA(token: string, sessionId: string) {
    try {
      const response = await fetch(
        `${ALT5PRO_CONFIG.BASE_URLS.IDENTITY}/api/v2/identity/${ALT5PRO_CONFIG.SECURITY_GROUP}/users/signin/2fa`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token, sessionId })
        }
      );

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro 2FA error:', error);
      return { success: false, error: '2FA verification failed' };
    }
  }

  /**
   * Reset user password
   */
  async resetPassword(email: string) {
    try {
      const response = await fetch(
        `${ALT5PRO_CONFIG.BASE_URLS.IDENTITY}/api/v2/identity/${ALT5PRO_CONFIG.SECURITY_GROUP}/users/password/reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      );

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Password Reset error:', error);
      return { success: false, error: 'Password reset failed' };
    }
  }

  // =====================
  // MARKET DATA API
  // =====================

  /**
   * Get real-time ticker data
   */
  async getMarketTicker(instrument?: string) {
    try {
      const url = instrument 
        ? `${ALT5PRO_CONFIG.BASE_URLS.MARKET_DATA}/marketdata/api/v2/marketdata/ticker?instrument=${instrument}`
        : `${ALT5PRO_CONFIG.BASE_URLS.MARKET_DATA}/marketdata/api/v2/marketdata/ticker`;

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Market Ticker error:', error);
      return { success: false, error: 'Failed to fetch market data' };
    }
  }

  /**
   * Get order book depth
   */
  async getOrderBookDepth(instrument: string, limit?: number) {
    try {
      const url = limit
        ? `${ALT5PRO_CONFIG.BASE_URLS.MARKET_DATA}/marketdata/api/v2/marketdata/depth/${instrument}?limit=${limit}`
        : `${ALT5PRO_CONFIG.BASE_URLS.MARKET_DATA}/marketdata/api/v2/marketdata/depth/${instrument}`;

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Order Book error:', error);
      return { success: false, error: 'Failed to fetch order book' };
    }
  }

  /**
   * Get recent trades
   */
  async getRecentTrades(instrument: string, limit?: number) {
    try {
      const url = limit
        ? `${ALT5PRO_CONFIG.BASE_URLS.MARKET_DATA}/marketdata/api/v2/marketdata/trades/${instrument}?limit=${limit}`
        : `${ALT5PRO_CONFIG.BASE_URLS.MARKET_DATA}/marketdata/api/v2/marketdata/trades/${instrument}`;

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Recent Trades error:', error);
      return { success: false, error: 'Failed to fetch recent trades' };
    }
  }

  /**
   * Get market assets information
   */
  async getMarketAssets() {
    try {
      const response = await fetch(
        `${ALT5PRO_CONFIG.BASE_URLS.MARKET_DATA}/marketdata/api/v2/marketdata/assets`,
        {
          headers: this.getAuthHeaders()
        }
      );

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Market Assets error:', error);
      return { success: false, error: 'Failed to fetch market assets' };
    }
  }

  /**
   * Get exchange rates between currencies
   */
  async getExchangeRates(from?: string, to?: string) {
    try {
      let url = `${ALT5PRO_CONFIG.BASE_URLS.MARKET_DATA}/marketdata/api/v2/rates`;
      
      if (from && to) {
        url += `/${from}/${to}`;
      }

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Exchange Rates error:', error);
      return { success: false, error: 'Failed to fetch exchange rates' };
    }
  }

  /**
   * Get historical price data
   */
  async getHistoricalData(instrument: string, interval: string, from?: string, to?: string) {
    try {
      let url = `${ALT5PRO_CONFIG.BASE_URLS.MARKET_DATA}/marketdata/instruments/${instrument}/history?interval=${interval}`;
      
      if (from) url += `&from=${from}`;
      if (to) url += `&to=${to}`;

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Historical Data error:', error);
      return { success: false, error: 'Failed to fetch historical data' };
    }
  }

  // =====================
  // FRONT OFFICE API
  // =====================

  /**
   * Get assets information for front office
   */
  async getFrontOfficeAssets() {
    try {
      const response = await fetch(
        `${ALT5PRO_CONFIG.BASE_URLS.FRONT_OFFICE}/frontoffice/api/assets-info`,
        {
          headers: this.getAuthHeaders()
        }
      );

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Front Office Assets error:', error);
      return { success: false, error: 'Failed to fetch front office assets' };
    }
  }

  /**
   * Get platform information
   */
  async getPlatformInfo() {
    try {
      const response = await fetch(
        `${ALT5PRO_CONFIG.BASE_URLS.FRONT_OFFICE}/frontoffice/api/info`,
        {
          headers: this.getAuthHeaders()
        }
      );

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Platform Info error:', error);
      return { success: false, error: 'Failed to fetch platform info' };
    }
  }

  /**
   * Get build information
   */
  async getBuildInfo() {
    try {
      const response = await fetch(
        `${ALT5PRO_CONFIG.BASE_URLS.FRONT_OFFICE}/frontoffice/api/build-info`,
        {
          headers: this.getAuthHeaders()
        }
      );

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Build Info error:', error);
      return { success: false, error: 'Failed to fetch build info' };
    }
  }

  /**
   * Get countries information
   */
  async getCountries(countryId?: string) {
    try {
      const url = countryId
        ? `${ALT5PRO_CONFIG.BASE_URLS.FRONT_OFFICE}/frontoffice/countries/${countryId}`
        : `${ALT5PRO_CONFIG.BASE_URLS.FRONT_OFFICE}/frontoffice/countries`;

      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Countries error:', error);
      return { success: false, error: 'Failed to fetch countries data' };
    }
  }

  // =====================
  // ADMIN API (Backend Management)
  // =====================

  /**
   * Get accounts by owner ID (internal access)
   */
  async getAccountsByOwner(ownerId: string, authToken: string) {
    try {
      const response = await fetch(
        `${ALT5PRO_CONFIG.BASE_URLS.ADMIN}/admin/accounts/owned-by-internal/${ownerId}`,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      const result = await response.json();
      return {
        success: response.ok,
        data: result,
        statusCode: response.status
      };
    } catch (error) {
      console.error('Alt5Pro Admin Accounts error:', error);
      return { success: false, error: 'Failed to fetch accounts data' };
    }
  }

  // =====================
  // UTILITY METHODS
  // =====================

  /**
   * Generate HMAC authentication headers for Alt5Pay API
   */
  private generateHMACAuth(bodyString: string): string {
    if (!this.credentials.secretKey || !this.credentials.apiKey) {
      throw new Error('Alt5Pro API credentials not configured');
    }

    const hmacDigest = crypto
      .createHmac('sha512', this.credentials.secretKey)
      .update(bodyString)
      .digest('hex');

    return Buffer.from(`${this.credentials.apiKey}:${hmacDigest}`).toString('base64');
  }

  /**
   * Get standard authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'NebulaX-Exchange/1.0'
    };

    if (this.credentials.apiKey) {
      headers['X-API-Key'] = this.credentials.apiKey;
    }

    if (this.credentials.merchantId) {
      headers['X-Merchant-ID'] = this.credentials.merchantId;
    }

    return headers;
  }

  /**
   * Generate request parameters with timestamp and nonce for HMAC
   */
  private generateRequestParams(additionalParams: Record<string, any> = {}) {
    return {
      timestamp: Math.floor(Date.now() / 1000),
      nonce: Math.floor(Math.random() * 1000000),
      ...additionalParams
    };
  }

  /**
   * Convert parameters to body string for HMAC generation
   */
  private paramsToBodyString(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
  }

  /**
   * Test API connectivity and authentication
   */
  async testConnection() {
    try {
      // Test multiple endpoints to verify connectivity
      const tests = await Promise.allSettled([
        this.getPlatformInfo(),
        this.getMarketAssets(),
        this.getCountries()
      ]);

      const results = tests.map((test, index) => ({
        endpoint: ['Platform Info', 'Market Assets', 'Countries'][index],
        success: test.status === 'fulfilled' && test.value.success,
        error: test.status === 'rejected' ? test.reason : test.value.error
      }));

      const successCount = results.filter(r => r.success).length;
      
      return {
        success: successCount > 0,
        totalTests: tests.length,
        successfulTests: successCount,
        results
      };
    } catch (error) {
      console.error('Alt5Pro Connection Test error:', error);
      return {
        success: false,
        error: 'Failed to test Alt5Pro API connectivity'
      };
    }
  }
}

// Export singleton instance
export const alt5ProAPI = new Alt5ProAPIService();

// Export types for use in other files
export interface Alt5ProResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface MarketTickerData {
  instrument: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: string;
}

export interface OrderBookData {
  instrument: string;
  bids: Array<[number, number]>; // [price, quantity]
  asks: Array<[number, number]>; // [price, quantity]
  timestamp: string;
}

export interface TradeData {
  id: string;
  instrument: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  timestamp: string;
}