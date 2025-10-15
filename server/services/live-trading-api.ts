const LIVE_TRADE_API_KEY = process.env.LIVE_TRADE_API_KEY || 'live_trade_32450285dbe12f6f';
const LIVE_TRADE_BASE_URL = 'https://api.live-trading.com'; // Adjust based on actual endpoint

class LiveTradingAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = LIVE_TRADE_API_KEY;
    this.baseUrl = LIVE_TRADE_BASE_URL;
    console.log('[LiveTrading] API initialized for real cryptocurrency trading');
  }

  // Generate authentication headers
  private getHeaders(secretKey?: string): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}${secretKey ? ':' + secretKey : ''}`,
      'Content-Type': 'application/json',
      'User-Agent': 'NebulaX-Exchange/1.0'
    };
  }

  // Get trading quote for a swap
  async getSwapQuote(fromToken: string, toToken: string, amount: string, userAddress?: string) {
    try {
      const params = new URLSearchParams({
        fromToken,
        toToken,
        amount,
        ...(userAddress && { userAddress })
      });

      const response = await fetch(`${this.baseUrl}/api/quote?${params}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Quote request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[LiveTrading] Error getting swap quote:', error);
      throw error;
    }
  }

  // Execute a trade/swap
  async executeSwap(swapData: {
    fromToken: string;
    toToken: string;
    amount: string;
    userAddress: string;
    slippage?: string;
    deadline?: number;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/swap`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(swapData)
      });

      if (!response.ok) {
        throw new Error(`Swap execution failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[LiveTrading] Error executing swap:', error);
      throw error;
    }
  }

  // Get available trading pairs
  async getTradingPairs() {
    try {
      const response = await fetch(`${this.baseUrl}/api/pairs`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Pairs request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[LiveTrading] Error fetching trading pairs:', error);
      throw error;
    }
  }

  // Create a limit order
  async createOrder(orderData: {
    pair: string;
    type: 'buy' | 'sell';
    orderType: 'market' | 'limit' | 'stop-loss';
    amount: string;
    price?: string;
    stopPrice?: string;
    userAddress: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[LiveTrading] Error creating order:', error);
      throw error;
    }
  }

  // Get user orders
  async getUserOrders(userAddress: string, status?: 'open' | 'filled' | 'cancelled') {
    try {
      const params = new URLSearchParams({
        userAddress,
        ...(status && { status })
      });

      const response = await fetch(`${this.baseUrl}/api/orders?${params}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Orders request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[LiveTrading] Error fetching user orders:', error);
      throw error;
    }
  }

  // Cancel an order
  async cancelOrder(orderId: string, userAddress: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify({ userAddress })
      });

      if (!response.ok) {
        throw new Error(`Order cancellation failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[LiveTrading] Error cancelling order:', error);
      throw error;
    }
  }

  // Get user portfolio/positions
  async getUserPortfolio(userAddress: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/portfolio/${userAddress}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Portfolio request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[LiveTrading] Error fetching portfolio:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactionHistory(userAddress: string, limit: number = 50) {
    try {
      const params = new URLSearchParams({
        userAddress,
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}/api/transactions?${params}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Transaction history request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[LiveTrading] Error fetching transaction history:', error);
      throw error;
    }
  }

  // Set price alert
  async setPriceAlert(alertData: {
    pair: string;
    targetPrice: string;
    condition: 'above' | 'below';
    userAddress: string;
    notificationMethod?: 'email' | 'webhook';
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/alerts`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(alertData)
      });

      if (!response.ok) {
        throw new Error(`Price alert creation failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[LiveTrading] Error setting price alert:', error);
      throw error;
    }
  }

  // Get active trading pairs with current prices
  async getActivePairs() {
    try {
      // Default pairs mentioned: ETH/USDC, BTC/USDC, UNI/ETH, LINK/USDC, AAVE/ETH
      const pairs = await this.getTradingPairs();
      return pairs;
    } catch (error) {
      console.error('[LiveTrading] Error fetching active pairs:', error);
      // Return default pairs if API call fails
      return [
        { pair: 'ETH/USDC', active: true },
        { pair: 'BTC/USDC', active: true },
        { pair: 'UNI/ETH', active: true },
        { pair: 'LINK/USDC', active: true },
        { pair: 'AAVE/ETH', active: true }
      ];
    }
  }

  // Health check
  async checkAPIStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      return {
        status: response.ok ? 'operational' : 'error',
        statusCode: response.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[LiveTrading] API health check failed:', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export const liveTradingAPI = new LiveTradingAPI();