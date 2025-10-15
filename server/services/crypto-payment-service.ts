import { ethers } from 'ethers';
import { createHash } from 'crypto';

interface CryptoPayment {
  id: string;
  userId: string;
  cryptocurrency: string;
  amount: string;
  walletAddress: string;
  paymentAddress: string;
  status: 'pending' | 'confirmed' | 'failed' | 'expired';
  transactionHash?: string;
  confirmations: number;
  requiredConfirmations: number;
  createdAt: Date;
  expiresAt: Date;
}

interface PaymentAddress {
  address: string;
  privateKey: string;
  cryptocurrency: string;
  isUsed: boolean;
}

interface SupportedCrypto {
  symbol: string;
  name: string;
  network: string;
  contractAddress?: string;
  decimals: number;
  minAmount: string;
  maxAmount: string;
  confirmationsRequired: number;
  processingFee: string;
}

class CryptoPaymentService {
  private provider: ethers.JsonRpcProvider | null = null;
  private supportedCryptos: SupportedCrypto[] = [];
  private paymentAddresses: Map<string, PaymentAddress> = new Map();
  private activePayments: Map<string, CryptoPayment> = new Map();

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    // Initialize Ethereum provider
    if (process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_ID !== 'undefined') {
      this.provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
      console.log('[CryptoPayment] Ethereum provider initialized');
    }

    // Define supported cryptocurrencies
    this.supportedCryptos = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        network: 'ethereum',
        decimals: 18,
        minAmount: '0.001',
        maxAmount: '100',
        confirmationsRequired: 12,
        processingFee: '0.0001'
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        network: 'ethereum',
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        minAmount: '10',
        maxAmount: '100000',
        confirmationsRequired: 12,
        processingFee: '1'
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        network: 'ethereum',
        contractAddress: '0xA0b86a33E6c6C9C69df89A5c4b6A7B8a65Ad90F7',
        decimals: 6,
        minAmount: '10',
        maxAmount: '100000',
        confirmationsRequired: 12,
        processingFee: '1'
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        network: 'bitcoin',
        decimals: 8,
        minAmount: '0.0001',
        maxAmount: '10',
        confirmationsRequired: 6,
        processingFee: '0.00001'
      }
    ];

    console.log(`[CryptoPayment] Initialized with ${this.supportedCryptos.length} supported cryptocurrencies`);
  }

  public getSupportedCryptocurrencies(): SupportedCrypto[] {
    return this.supportedCryptos;
  }

  public async createPayment(
    userId: string,
    cryptocurrency: string,
    amount: string,
    purpose: string = 'deposit'
  ): Promise<CryptoPayment> {
    const crypto = this.supportedCryptos.find(c => c.symbol === cryptocurrency);
    if (!crypto) {
      throw new Error(`Unsupported cryptocurrency: ${cryptocurrency}`);
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (amountNum < parseFloat(crypto.minAmount) || amountNum > parseFloat(crypto.maxAmount)) {
      throw new Error(`Amount must be between ${crypto.minAmount} and ${crypto.maxAmount} ${crypto.symbol}`);
    }

    // Generate payment address
    const paymentAddress = await this.generatePaymentAddress(cryptocurrency);
    
    const paymentId = this.generatePaymentId();
    const payment: CryptoPayment = {
      id: paymentId,
      userId,
      cryptocurrency,
      amount,
      walletAddress: '', // User's wallet (filled when payment is made)
      paymentAddress: paymentAddress.address,
      status: 'pending',
      confirmations: 0,
      requiredConfirmations: crypto.confirmationsRequired,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };

    this.activePayments.set(paymentId, payment);
    
    // Store in database
    try {
      const { storage } = await import('../storage');
      await storage.createCryptoPayment(payment);
    } catch (error) {
      console.error('[CryptoPayment] Failed to store payment in database:', error);
    }

    console.log(`[CryptoPayment] Created payment ${paymentId} for ${amount} ${cryptocurrency}`);

    // Start monitoring for this payment
    this.monitorPayment(paymentId);

    return payment;
  }

  private async generatePaymentAddress(cryptocurrency: string): Promise<PaymentAddress> {
    // For demo purposes, generate a new address each time
    // In production, you'd want to use HD wallets or a proper key management system
    
    if (cryptocurrency === 'ETH' || this.isERC20Token(cryptocurrency)) {
      // Generate Ethereum address
      const wallet = ethers.Wallet.createRandom();
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        cryptocurrency,
        isUsed: false
      };
    } else if (cryptocurrency === 'BTC') {
      // For Bitcoin, you'd integrate with a Bitcoin library
      // For now, return a placeholder
      return {
        address: this.generateBitcoinAddress(),
        privateKey: 'btc-private-key-placeholder',
        cryptocurrency,
        isUsed: false
      };
    }

    throw new Error(`Address generation not implemented for ${cryptocurrency}`);
  }

  private generateBitcoinAddress(): string {
    // This is a placeholder - in production, use a proper Bitcoin library
    const randomBytes = createHash('sha256').update(Math.random().toString()).digest('hex');
    return `1${randomBytes.substring(0, 32)}`;
  }

  private isERC20Token(symbol: string): boolean {
    const erc20Tokens = ['USDT', 'USDC', 'DAI', 'LINK', 'UNI'];
    return erc20Tokens.includes(symbol);
  }

  private generatePaymentId(): string {
    return `pay_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private async monitorPayment(paymentId: string): Promise<void> {
    const payment = this.activePayments.get(paymentId);
    if (!payment) return;

    const checkInterval = setInterval(async () => {
      try {
        const currentPayment = this.activePayments.get(paymentId);
        if (!currentPayment || currentPayment.status !== 'pending') {
          clearInterval(checkInterval);
          return;
        }

        // Check if payment has expired
        if (new Date() > currentPayment.expiresAt) {
          currentPayment.status = 'expired';
          clearInterval(checkInterval);
          console.log(`[CryptoPayment] Payment ${paymentId} expired`);
          return;
        }

        // Check for transactions to the payment address
        await this.checkForPayment(paymentId);

      } catch (error) {
        console.error(`[CryptoPayment] Error monitoring payment ${paymentId}:`, error);
      }
    }, 30000); // Check every 30 seconds

    // Clear interval after 35 minutes (5 minutes past expiry)
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 35 * 60 * 1000);
  }

  private async checkForPayment(paymentId: string): Promise<void> {
    const payment = this.activePayments.get(paymentId);
    if (!payment || !this.provider) return;

    try {
      if (payment.cryptocurrency === 'ETH') {
        await this.checkEthereumPayment(payment);
      } else if (this.isERC20Token(payment.cryptocurrency)) {
        await this.checkERC20Payment(payment);
      } else if (payment.cryptocurrency === 'BTC') {
        await this.checkBitcoinPayment(payment);
      }
    } catch (error) {
      console.error(`[CryptoPayment] Error checking payment ${paymentId}:`, error);
    }
  }

  private async checkEthereumPayment(payment: CryptoPayment): Promise<void> {
    if (!this.provider) return;

    const balance = await this.provider.getBalance(payment.paymentAddress);
    const balanceEth = ethers.formatEther(balance);
    const expectedAmount = parseFloat(payment.amount);

    if (parseFloat(balanceEth) >= expectedAmount) {
      // Payment received, now check confirmations
      const latestBlock = await this.provider.getBlockNumber();
      
      // Get transaction history for this address
      const transactions = await this.getAddressTransactions(payment.paymentAddress);
      const relevantTx = transactions.find(tx => 
        parseFloat(ethers.formatEther(tx.value)) >= expectedAmount
      );

      if (relevantTx) {
        payment.transactionHash = relevantTx.hash;
        payment.confirmations = latestBlock - relevantTx.blockNumber;
        payment.walletAddress = relevantTx.from;

        if (payment.confirmations >= payment.requiredConfirmations) {
          payment.status = 'confirmed';
          await this.processConfirmedPayment(payment);
        }
        
        // Update database
        try {
          const { storage } = await import('../storage');
          await storage.updateCryptoPaymentStatus(payment.id, payment.status, payment.transactionHash, payment.confirmations);
        } catch (error) {
          console.error('[CryptoPayment] Failed to update payment in database:', error);
        }
      }
    }
  }

  private async checkERC20Payment(payment: CryptoPayment): Promise<void> {
    // Implementation for ERC20 token payments
    // This would involve checking token transfer events
    console.log(`[CryptoPayment] Checking ERC20 payment for ${payment.cryptocurrency}`);
  }

  private async checkBitcoinPayment(payment: CryptoPayment): Promise<void> {
    // Implementation for Bitcoin payments
    // This would involve integrating with a Bitcoin API or node
    console.log(`[CryptoPayment] Checking Bitcoin payment`);
  }

  private async getAddressTransactions(address: string): Promise<any[]> {
    // This is a simplified implementation
    // In production, you'd use Etherscan API or similar
    return [];
  }

  private async processConfirmedPayment(payment: CryptoPayment): Promise<void> {
    console.log(`[CryptoPayment] Payment confirmed: ${payment.id}`);
    
    // Update user's account balance
    // This would integrate with your storage system
    // await storage.updateUserBalance(payment.userId, payment.cryptocurrency, payment.amount);

    // Send confirmation notification
    // await notificationService.sendPaymentConfirmation(payment);

    // Move funds to main wallet if needed
    // await this.sweepPaymentAddress(payment);
  }

  public async getPaymentStatus(paymentId: string): Promise<CryptoPayment | null> {
    // First check in memory
    let payment = this.activePayments.get(paymentId);
    
    // If not in memory, check database
    if (!payment) {
      try {
        const { storage } = await import('../storage');
        const dbPayment = await storage.getCryptoPayment(paymentId);
        if (dbPayment) {
          payment = {
            ...dbPayment,
            createdAt: new Date(dbPayment.created_at),
            expiresAt: new Date(dbPayment.expires_at)
          };
          this.activePayments.set(paymentId, payment);
        }
      } catch (error) {
        console.error('[CryptoPayment] Failed to load payment from database:', error);
      }
    }
    
    return payment || null;
  }

  public async getUserPayments(userId: string): Promise<CryptoPayment[]> {
    try {
      const { storage } = await import('../storage');
      const dbPayments = await storage.getUserCryptoPayments(userId);
      return dbPayments.map(p => ({
        ...p,
        createdAt: new Date(p.created_at),
        expiresAt: new Date(p.expires_at)
      }));
    } catch (error) {
      console.error('[CryptoPayment] Failed to load user payments from database:', error);
      return Array.from(this.activePayments.values()).filter(p => p.userId === userId);
    }
  }

  public async estimateNetworkFee(cryptocurrency: string): Promise<string> {
    const crypto = this.supportedCryptos.find(c => c.symbol === cryptocurrency);
    if (!crypto) {
      throw new Error(`Unsupported cryptocurrency: ${cryptocurrency}`);
    }

    if (cryptocurrency === 'ETH' && this.provider) {
      const gasPrice = await this.provider.getFeeData();
      const gasLimit = 21000; // Standard ETH transfer
      const fee = gasPrice.gasPrice ? gasPrice.gasPrice * BigInt(gasLimit) : BigInt(0);
      return ethers.formatEther(fee);
    }

    return crypto.processingFee;
  }

  public async validateAddress(address: string, cryptocurrency: string): Promise<boolean> {
    try {
      if (cryptocurrency === 'ETH' || this.isERC20Token(cryptocurrency)) {
        return ethers.isAddress(address);
      } else if (cryptocurrency === 'BTC') {
        // Bitcoin address validation would go here
        return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || 
               /^bc1[a-z0-9]{39,59}$/.test(address);
      }
      return false;
    } catch {
      return false;
    }
  }

  public getPaymentInstructions(payment: CryptoPayment): string {
    const crypto = this.supportedCryptos.find(c => c.symbol === payment.cryptocurrency);
    if (!crypto) return 'Payment instructions not available';

    const timeLeft = Math.max(0, Math.floor((payment.expiresAt.getTime() - Date.now()) / 60000));
    
    return `
Send exactly ${payment.amount} ${crypto.symbol} to the address below:

Payment Address: ${payment.paymentAddress}
Amount: ${payment.amount} ${crypto.symbol}
Network: ${crypto.name}
${crypto.contractAddress ? `Contract: ${crypto.contractAddress}` : ''}

Important:
• Send the exact amount shown
• Use ${crypto.name} network only
• Payment expires in ${timeLeft} minutes
• Minimum ${crypto.confirmationsRequired} confirmations required
• Processing fee: ${crypto.processingFee} ${crypto.symbol}

Do not send from an exchange wallet. Use a wallet where you control the private keys.
    `.trim();
  }
}

export const cryptoPaymentService = new CryptoPaymentService();
export type { CryptoPayment, SupportedCrypto };