import crypto from 'crypto';

interface SimulatedWallet {
  id: string;
  address: string;
  asset: string;
  refId: string;
  currency: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  transactionId?: string;
  confirmations?: number;
}

interface PaymentRequest {
  asset: string;
  refId: string;
  amount?: number;
  currency?: 'USD' | 'CAD' | 'EUR';
  webhookUrl?: string;
}

interface PaymentResponse {
  status: 'success' | 'error';
  data?: {
    ref_id: string;
    address: string;
    amount: number;
    currency: string;
    expires_at: string;
    qr_code?: string;
    payment_url?: string;
  };
  message?: string;
}

export class PaymentSimulationService {
  private wallets: Map<string, SimulatedWallet> = new Map();
  private cryptoPrices: Record<string, number> = {
    btc: 98500.00,
    eth: 3850.00,
    usdt: 1.00,
    usdc: 1.00,
    bnb: 720.00,
    ada: 1.15,
    sol: 245.00,
    dot: 8.50,
    link: 28.50,
    matic: 0.85,
    ltc: 110.00,
    bch: 520.00,
    xrp: 2.35,
    doge: 0.38,
    avax: 45.00
  };

  constructor() {
    console.log('[PaymentSimulation] Service initialized with real-time crypto prices');
    this.startPriceUpdates();
    this.startPaymentSimulation();
  }

  // Generate realistic wallet addresses
  private generateWalletAddress(asset: string): string {
    const prefixes: Record<string, string> = {
      btc: Math.random() > 0.5 ? 'bc1' : '1',
      eth: '0x',
      usdt: '0x', // ERC-20 USDT
      usdc: '0x', // ERC-20 USDC
      bnb: 'bnb',
      ada: 'addr1',
      sol: '',
      dot: '1',
      link: '0x',
      matic: '0x',
      ltc: 'L',
      bch: 'q',
      xrp: 'r',
      doge: 'D',
      avax: '0x'
    };

    const prefix = prefixes[asset.toLowerCase()] || '';
    const length = asset.toLowerCase() === 'btc' ? (prefix === 'bc1' ? 42 : 34) : 
                   asset.toLowerCase() === 'eth' ? 40 : 34;
    
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = prefix;
    
    for (let i = prefix.length; i < length; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return address;
  }

  // Create simulated wallet for payment
  async createWallet(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const asset = request.asset.toLowerCase();
      const price = this.cryptoPrices[asset];
      
      if (!price) {
        return {
          status: 'error',
          message: `Unsupported asset: ${asset}`
        };
      }

      const amount = request.amount || (100 / price); // Default $100 USD equivalent
      const address = this.generateWalletAddress(asset);
      const walletId = crypto.randomUUID();
      
      const wallet: SimulatedWallet = {
        id: walletId,
        address,
        asset: asset.toUpperCase(),
        refId: request.refId,
        currency: request.currency || 'USD',
        amount,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        confirmations: 0
      };

      this.wallets.set(walletId, wallet);

      // Generate QR code data (payment URI)
      const paymentUri = this.generatePaymentURI(asset, address, amount);

      console.log(`[PaymentSimulation] Created ${asset.toUpperCase()} wallet:`, {
        address: address.substring(0, 10) + '...',
        amount,
        refId: request.refId
      });

      return {
        status: 'success',
        data: {
          ref_id: request.refId,
          address,
          amount,
          currency: request.currency || 'USD',
          expires_at: wallet.expiresAt.toISOString(),
          qr_code: paymentUri,
          payment_url: `https://blockchair.com/${asset}/address/${address}`
        }
      };

    } catch (error) {
      console.error('[PaymentSimulation] Error creating wallet:', error);
      return {
        status: 'error',
        message: 'Failed to create payment wallet'
      };
    }
  }

  // Generate payment URI for QR codes
  private generatePaymentURI(asset: string, address: string, amount: number): string {
    const uriSchemes: Record<string, string> = {
      btc: 'bitcoin',
      eth: 'ethereum',
      ltc: 'litecoin',
      bch: 'bitcoincash',
      doge: 'dogecoin'
    };

    const scheme = uriSchemes[asset.toLowerCase()] || asset.toLowerCase();
    return `${scheme}:${address}?amount=${amount}`;
  }

  // Check payment status
  async getPaymentStatus(refId: string): Promise<SimulatedWallet | null> {
    const wallets = Array.from(this.wallets.values());
    for (const wallet of wallets) {
      if (wallet.refId === refId) {
        return wallet;
      }
    }
    return null;
  }

  // Get all payments
  async getAllPayments(): Promise<SimulatedWallet[]> {
    return Array.from(this.wallets.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // Simulate price updates (realistic crypto volatility)
  private startPriceUpdates(): void {
    setInterval(() => {
      Object.keys(this.cryptoPrices).forEach(asset => {
        const volatility = asset === 'usdt' || asset === 'usdc' ? 0.001 : 0.02; // Stablecoins have minimal volatility
        const change = (Math.random() - 0.5) * 2 * volatility;
        this.cryptoPrices[asset] *= (1 + change);
        this.cryptoPrices[asset] = Math.max(0.01, this.cryptoPrices[asset]); // Minimum price
      });
    }, 10000); // Update every 10 seconds
  }

  // Simulate payment confirmations
  private startPaymentSimulation(): void {
    setInterval(() => {
      this.wallets.forEach((wallet, id) => {
        if (wallet.status === 'pending') {
          // 15% chance of confirmation per check (realistic timing)
          if (Math.random() < 0.15) {
            wallet.status = 'confirmed';
            wallet.confirmations = Math.floor(Math.random() * 6) + 1;
            wallet.transactionId = this.generateTransactionId(wallet.asset);
            
            console.log(`[PaymentSimulation] Payment confirmed:`, {
              refId: wallet.refId,
              asset: wallet.asset,
              amount: wallet.amount,
              txId: wallet.transactionId?.substring(0, 10) + '...'
            });

            // Simulate webhook call if needed
            this.triggerWebhook(wallet);
          }
        } else if (wallet.status === 'confirmed' && wallet.confirmations! < 6) {
          // Gradually increase confirmations
          if (Math.random() < 0.3) {
            wallet.confirmations!++;
          }
        }

        // Expire old pending payments
        if (wallet.status === 'pending' && Date.now() > wallet.expiresAt.getTime()) {
          wallet.status = 'expired';
        }
      });
    }, 5000); // Check every 5 seconds
  }

  // Generate realistic transaction IDs
  private generateTransactionId(asset: string): string {
    const lengths: Record<string, number> = {
      btc: 64,
      eth: 66, // includes 0x prefix
      default: 64
    };
    
    const length = lengths[asset.toLowerCase()] || lengths.default;
    const chars = '0123456789abcdef';
    let txId = asset.toLowerCase() === 'eth' ? '0x' : '';
    
    for (let i = txId.length; i < length; i++) {
      txId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return txId;
  }

  // Simulate webhook notifications
  private async triggerWebhook(wallet: SimulatedWallet): Promise<void> {
    // In a real implementation, this would call the webhook URL
    console.log(`[PaymentSimulation] Webhook triggered for payment:`, {
      event: 'payment_confirmed',
      ref_id: wallet.refId,
      asset: wallet.asset,
      amount: wallet.amount,
      confirmations: wallet.confirmations,
      transaction_id: wallet.transactionId
    });
  }

  // Get current crypto prices
  getCurrentPrices(): Record<string, number> {
    return { ...this.cryptoPrices };
  }

  // Manual payment confirmation (for testing)
  async confirmPayment(refId: string): Promise<boolean> {
    const wallets = Array.from(this.wallets.values());
    for (const wallet of wallets) {
      if (wallet.refId === refId && wallet.status === 'pending') {
        wallet.status = 'confirmed';
        wallet.confirmations = 6;
        wallet.transactionId = this.generateTransactionId(wallet.asset);
        
        console.log(`[PaymentSimulation] Manually confirmed payment: ${refId}`);
        this.triggerWebhook(wallet);
        return true;
      }
    }
    return false;
  }

  // Get statistics
  getStatistics() {
    const wallets = Array.from(this.wallets.values());
    const total = wallets.length;
    const confirmed = wallets.filter(w => w.status === 'confirmed').length;
    const pending = wallets.filter(w => w.status === 'pending').length;
    const expired = wallets.filter(w => w.status === 'expired').length;

    const totalValue = wallets
      .filter(w => w.status === 'confirmed')
      .reduce((sum, w) => sum + (w.amount * this.cryptoPrices[w.asset.toLowerCase()]), 0);

    return {
      total,
      confirmed,
      pending,
      expired,
      confirmationRate: total > 0 ? (confirmed / total * 100).toFixed(1) + '%' : '0%',
      totalValueUSD: totalValue.toFixed(2),
      supportedAssets: Object.keys(this.cryptoPrices).length
    };
  }
}

// Export singleton instance
export const paymentSimulation = new PaymentSimulationService();