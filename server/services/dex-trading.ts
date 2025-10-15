import { Request, Response } from 'express';

// 1inch DEX Aggregator Service
class DEXTradingService {
  private baseUrl = 'https://api.1inch.dev';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ONEINCH_API_KEY || '';
  }

  private async makeRequest(endpoint: string, params?: Record<string, any>) {
    if (!this.apiKey) {
      throw new Error('1inch API key not configured');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // Get supported tokens on Ethereum mainnet
  async getSupportedTokens(chainId: number = 1) {
    try {
      return await this.makeRequest(`/swap/v6.0/${chainId}/tokens`);
    } catch (error) {
      console.error('Error fetching supported tokens:', error);
      throw error;
    }
  }

  // Get quote for token swap
  async getSwapQuote(params: {
    src: string;
    dst: string;
    amount: string;
    chainId?: number;
  }) {
    const { src, dst, amount, chainId = 1 } = params;
    
    try {
      return await this.makeRequest(`/swap/v6.0/${chainId}/quote`, {
        src,
        dst,
        amount
      });
    } catch (error) {
      console.error('Error getting swap quote:', error);
      throw error;
    }
  }

  // Build swap transaction
  async buildSwapTransaction(params: {
    src: string;
    dst: string;
    amount: string;
    from: string;
    slippage: number;
    chainId?: number;
  }) {
    const { src, dst, amount, from, slippage, chainId = 1 } = params;
    
    try {
      return await this.makeRequest(`/swap/v6.0/${chainId}/swap`, {
        src,
        dst,
        amount,
        from,
        slippage
      });
    } catch (error) {
      console.error('Error building swap transaction:', error);
      throw error;
    }
  }

  // Get liquidity sources for better price discovery
  async getLiquiditySources(chainId: number = 1) {
    try {
      return await this.makeRequest(`/swap/v6.0/${chainId}/liquidity-sources`);
    } catch (error) {
      console.error('Error fetching liquidity sources:', error);
      throw error;
    }
  }

  // Check if API key is properly configured
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const dexTradingService = new DEXTradingService();