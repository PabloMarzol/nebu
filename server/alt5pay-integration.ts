import crypto from 'crypto';

interface Alt5PayConfig {
  apiKey: string;
  secretKey: string;
  merchantId: string;
  isProduction: boolean;
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

interface TransactionStatus {
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
}

interface WebhookPayload {
  ref_id: string;
  price: number;
  amount: number;
  total: number;
  date_time: string;
  transaction_id: string;
  coin: string;
  network: string;
  currency: string;
  confirmation: string;
  status: string;
  fee: string;
  source_address: string;
  type: 'Payment' | 'Reused';
}

export class Alt5PayService {
  private config: Alt5PayConfig;
  private baseUrl: string;

  constructor(config: Alt5PayConfig) {
    this.config = config;
    this.baseUrl = config.isProduction 
      ? 'https://api.alt5pay.com'
      : 'https://api.digitalpaydev.com';
  }

  private generateHMACAuth(bodyString: string): string {
    const hmacDigest = crypto
      .createHmac('sha512', this.config.secretKey)
      .update(bodyString)
      .digest('hex');
    
    const authentication = Buffer.from(`${this.config.apiKey}:${hmacDigest}`).toString('base64');
    return authentication;
  }

  private createBodyString(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  async createWallet(asset: string, refId: string, webhookUrl?: string, currency: 'USD' | 'CAD' | 'EUR' = 'USD'): Promise<CreateWalletResponse> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);

    const requestData: CreateWalletRequest = {
      ref_id: refId,
      timestamp,
      nonce,
      currency
    };

    if (webhookUrl) {
      requestData.url = webhookUrl;
    }

    const bodyString = this.createBodyString(requestData);
    const authentication = this.generateHMACAuth(bodyString);

    const response = await fetch(`${this.baseUrl}/usr/wallet/${asset.toLowerCase()}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey,
        'merchant_id': this.config.merchantId,
        'authentication': authentication
      },
      body: JSON.stringify(requestData)
    });

    return await response.json();
  }

  async getTransactionByAddress(address: string, getAll: boolean = false): Promise<{ status: string; data: TransactionStatus | TransactionStatus[] }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);

    const requestData = {
      address,
      all: getAll,
      timestamp,
      nonce
    };

    const bodyString = this.createBodyString(requestData);
    const authentication = this.generateHMACAuth(bodyString);

    const response = await fetch(`${this.baseUrl}/usr/wallet/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey,
        'merchant_id': this.config.merchantId,
        'authentication': authentication
      },
      body: JSON.stringify(requestData)
    });

    return await response.json();
  }

  async getTransactionByTxId(txid: string, getAll: boolean = false): Promise<{ status: string; data: TransactionStatus | TransactionStatus[] }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.floor(Math.random() * 1000000);

    const requestData = {
      txid,
      all: getAll,
      timestamp,
      nonce
    };

    const bodyString = this.createBodyString(requestData);
    const authentication = this.generateHMACAuth(bodyString);

    const response = await fetch(`${this.baseUrl}/usr/wallet/transactionsbytx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey,
        'merchant_id': this.config.merchantId,
        'authentication': authentication
      },
      body: JSON.stringify(requestData)
    });

    return await response.json();
  }

  verifyWebhookSignature(body: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha512', this.config.secretKey)
      .update(body)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  // Supported cryptocurrencies
  static readonly SUPPORTED_ASSETS = [
    'btc', 'eth', 'ltc', 'bch', 'doge', 'usdt', 'xrp', 'usdc', 
    'sol', 'bnb', 'dash', 'ada', 'avax', 'matic_poly', 'shib'
  ];

  // Asset display names
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
export const createAlt5PayService = () => {
  const config: Alt5PayConfig = {
    apiKey: process.env.ALT5PAY_API_KEY || '',
    secretKey: process.env.ALT5PAY_SECRET_KEY || '',
    merchantId: process.env.ALT5PAY_MERCHANT_ID || '',
    isProduction: process.env.NODE_ENV === 'production'
  };

  if (!config.apiKey || !config.secretKey || !config.merchantId) {
    throw new Error('Alt5Pay configuration incomplete. Please set ALT5PAY_API_KEY, ALT5PAY_SECRET_KEY, and ALT5PAY_MERCHANT_ID environment variables.');
  }

  return new Alt5PayService(config);
};

export type { CreateWalletResponse, TransactionStatus, WebhookPayload };