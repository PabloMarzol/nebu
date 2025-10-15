import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
interface Alt5PayConfig {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  baseUrl: string;
  sandboxUrl: string;
}

interface CreateWalletRequest {
  ref_id: string;
  url?: string;
  timestamp: number;
  nonce: number;
  currency?: 'USD' | 'CAD' | 'EUR';
}

interface CreateWalletResponse {
  status: 'success' | 'error';
  data?: {
    ref_id: string;
    price: number;
    address: string;
    coin: string;
    expires: string;
  };
  message?: string;
}

interface TransactionStatusRequest {
  address?: string;
  txid?: string;
  ref_id?: string;
  all?: boolean;
  timestamp: number;
  nonce: number;
}

export class Alt5PayService {
  private config: Alt5PayConfig;
  private isProduction: boolean;

  constructor() {
    this.config = {
      apiKey: process.env.ALT5_API_KEY || '',
      secretKey: process.env.ALT5_SECRET_KEY || '',
      merchantId: process.env.ALT5_MERCHANT_ID || '',
      baseUrl: 'https://api.alt5pay.com',
      sandboxUrl: 'https://api.digitalpaydev.com'
    };
    // Test with sandbox environment first
    this.isProduction = false;
    console.log('[Alt5Pay] Initialized with credentials:', {
      apiKeyLength: this.config.apiKey.length,
      secretKeyLength: this.config.secretKey.length,
      merchantId: this.config.merchantId,
      apiKeyPrefix: this.config.apiKey.substring(0, 8),
      secretKeyValue: this.config.secretKey,
      baseUrl: this.getBaseUrl()
    });
  }

  private getBaseUrl(): string {
    return this.isProduction ? this.config.baseUrl : this.config.sandboxUrl;
  }

  private generateNonce(): number {
    return Math.floor(Math.random() * 1000000);
  }

  private generateTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  private createBodyString(params: Record<string, any>): string {
    // Alt5Pay requires specific parameter order as per documentation: ref_id, url, timestamp, nonce, currency
    const keys = Object.keys(params);
    const orderedKeys: string[] = [];
    
    // Add parameters in the exact order specified in Alt5Pay docs
    if (params.ref_id) orderedKeys.push('ref_id');
    if (params.url) orderedKeys.push('url');
    if (params.timestamp) orderedKeys.push('timestamp');
    if (params.nonce) orderedKeys.push('nonce');
    if (params.currency) orderedKeys.push('currency');
    
    return orderedKeys.map(key => `${key}=${params[key]}`).join('&');
  }

  private generateAuthentication(bodyString: string): string {
    if (!this.config.secretKey || !this.config.apiKey) {
      throw new Error('Alt5Pay credentials not configured');
    }

    // Alt5Pay uses HMAC-SHA512 with hex output, then base64 encoding as per documentation
    const hmacDigest = crypto
      .createHmac('sha512', this.config.secretKey)
      .update(bodyString)
      .digest('hex');
    
    // Documentation shows: btoa(apikey + ':' + hmacDigest)
    const authString = `${this.config.apiKey}:${hmacDigest}`;
    return Buffer.from(authString).toString('base64');
  }

  private async makeRequest(endpoint: string, body: any): Promise<any> {
    if (!this.config.apiKey || !this.config.secretKey || !this.config.merchantId) {
      throw new Error('Alt5Pay credentials required: ALT5_API_KEY, ALT5_SECRET_KEY, ALT5_MERCHANT_ID');
    }

    const bodyString = this.createBodyString(body);
    const authentication = this.generateAuthentication(bodyString);
    const url = `${this.getBaseUrl()}${endpoint}`;

    console.log('[Alt5Pay Debug] Request URL:', url);
    console.log('[Alt5Pay Debug] Body String:', bodyString);
    console.log('[Alt5Pay Debug] Request Body:', JSON.stringify(body, null, 2));
    console.log('[Alt5Pay Debug] API Key (first 10 chars):', this.config.apiKey.substring(0, 10) + '...');
    console.log('[Alt5Pay Debug] Secret Key:', this.config.secretKey);
    console.log('[Alt5Pay Debug] Merchant ID:', this.config.merchantId);
    console.log('[Alt5Pay Debug] Environment:', this.isProduction ? 'production' : 'sandbox');
    console.log('[Alt5Pay Debug] Is Production Flag:', this.isProduction);
    console.log('[Alt5Pay Debug] Using URL:', url);
    console.log('[Alt5Pay Debug] Authentication header:', authentication);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey,
        'merchant_id': this.config.merchantId,
        'authentication': authentication
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    console.log('[Alt5Pay Debug] Response:', JSON.stringify(result, null, 2));
    
    return result;
  }

  // Create wallet address for different cryptocurrencies
  async createWalletAddress(asset: string, refId: string, webhookUrl?: string, currency?: 'USD' | 'CAD' | 'EUR'): Promise<CreateWalletResponse> {
    const body: CreateWalletRequest = {
      ref_id: refId,
      timestamp: this.generateTimestamp(),
      nonce: this.generateNonce(),
      currency: currency || 'USD'
    };

    if (webhookUrl) {
      body.url = webhookUrl;
    }

    const endpoint = `/usr/wallet/${asset.toLowerCase()}/create`;
    return this.makeRequest(endpoint, body);
  }

  // Create BTC wallet
  async createBTCWallet(refId: string, webhookUrl?: string, currency?: 'USD' | 'CAD' | 'EUR'): Promise<CreateWalletResponse> {
    return this.createWalletAddress('btc', refId, webhookUrl, currency);
  }

  // Create ETH wallet
  async createETHWallet(refId: string, webhookUrl?: string, currency?: 'USD' | 'CAD' | 'EUR'): Promise<CreateWalletResponse> {
    return this.createWalletAddress('eth', refId, webhookUrl, currency);
  }

  // Create USDT wallet (ERC20)
  async createUSDTWallet(refId: string, webhookUrl?: string, currency?: 'USD' | 'CAD' | 'EUR'): Promise<CreateWalletResponse> {
    return this.createWalletAddress('erc20/usdt', refId, webhookUrl, currency);
  }

  // Create USDC wallet (ERC20)
  async createUSDCWallet(refId: string, webhookUrl?: string, currency?: 'USD' | 'CAD' | 'EUR'): Promise<CreateWalletResponse> {
    return this.createWalletAddress('erc20/usdc', refId, webhookUrl, currency);
  }

  // Get transaction status by address
  async getTransactionsByAddress(address: string, all: boolean = false): Promise<any> {
    const body: TransactionStatusRequest = {
      address,
      all,
      timestamp: this.generateTimestamp(),
      nonce: this.generateNonce()
    };

    return this.makeRequest('/usr/wallet/transactions', body);
  }

  // Get transaction status by transaction ID
  async getTransactionsByTxId(txid: string, all: boolean = false): Promise<any> {
    const body: TransactionStatusRequest = {
      txid,
      all,
      timestamp: this.generateTimestamp(),
      nonce: this.generateNonce()
    };

    return this.makeRequest('/usr/wallet/transactionsbytx', body);
  }

  // Get transaction status by reference ID
  async getTransactionsByRefId(refId: string, all: boolean = false): Promise<any> {
    const body: TransactionStatusRequest = {
      ref_id: refId,
      all,
      timestamp: this.generateTimestamp(),
      nonce: this.generateNonce()
    };

    return this.makeRequest('/usr/wallet/transactionsbyref', body);
  }

  // Verify webhook signature
  verifyWebhookSignature(body: string, signature: string): boolean {
    if (!this.config.secretKey) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha512', this.config.secretKey)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }

  // Test connection with detailed debugging
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          message: 'Alt5Pay credentials not configured',
          details: { configured: false }
        };
      }

      // Try to create a test wallet to verify credentials
      const testRefId = `test_${Date.now()}`;
      console.log('[Alt5Pay] Testing connection with ref_id:', testRefId);
      
      const result = await this.createBTCWallet(testRefId);
      console.log('[Alt5Pay] Test result:', JSON.stringify(result, null, 2));
      
      return {
        success: result.status === 'success',
        message: result.status === 'success' ? 'Alt5Pay connection successful' : `Alt5Pay connection failed: ${result.message}`,
        details: result
      };
    } catch (error) {
      console.error('[Alt5Pay] Test connection error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Alt5Pay connection failed',
        details: error
      };
    }
  }

  // Get supported assets
  getSupportedAssets(): string[] {
    return [
      'btc', 'eth', 'bch', 'ltc', 'doge', 'dash', 'xrp', 'sol', 'bnb', 'ada', 'avax',
      'matic_poly', 'erc20/usdt', 'erc20/usdc', 'erc20/shib', 'usdt_tron'
    ];
  }

  // Check if credentials are configured
  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.secretKey && this.config.merchantId);
  }
}

export const alt5PayService = new Alt5PayService();