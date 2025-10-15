import axios from 'axios';

interface BitcoinTransaction {
  txid: string;
  confirmations: number;
  amount: number;
  fee: number;
  timestamp: number;
  blockHeight?: number;
  inputs: Array<{
    address: string;
    amount: number;
  }>;
  outputs: Array<{
    address: string;
    amount: number;
  }>;
}

interface BitcoinAddress {
  address: string;
  balance: number;
  totalReceived: number;
  totalSent: number;
  unconfirmedBalance: number;
  txCount: number;
}

interface BitcoinUTXO {
  txid: string;
  vout: number;
  value: number;
  confirmations: number;
  scriptPubKey: string;
}

class BitcoinService {
  private apiKey: string | undefined;
  private baseUrl: string;
  private fallbackApis: string[];

  constructor() {
    this.apiKey = process.env.BLOCKSTREAM_API_KEY;
    this.baseUrl = 'https://blockstream.info/api';
    this.fallbackApis = [
      'https://mempool.space/api',
      'https://blockchair.com/bitcoin/raw/transaction',
      'https://api.blockcypher.com/v1/btc/main'
    ];

    if (!this.apiKey) {
      console.log('[BitcoinService] Using public Blockstream API (rate limited)');
    } else {
      console.log('[BitcoinService] Blockstream Pro API configured');
    }
  }

  // Generate Bitcoin address (simplified - in production use proper HD wallets)
  async generateAddress(userId: string): Promise<string> {
    try {
      // In production, this would generate a proper HD wallet address
      // For demo, we'll create a deterministic address based on user ID
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256').update(`bitcoin_${userId}_${Date.now()}`).digest('hex');
      
      // This is a mock address - in production, use proper Bitcoin address generation
      const mockAddress = `bc1q${hash.substring(0, 39)}`;
      
      console.log(`[BitcoinService] Generated address ${mockAddress} for user ${userId}`);
      return mockAddress;
    } catch (error) {
      console.error('[BitcoinService] Error generating address:', error);
      throw new Error('Failed to generate Bitcoin address');
    }
  }

  // Get address information
  async getAddressInfo(address: string): Promise<BitcoinAddress> {
    try {
      const response = await axios.get(`${this.baseUrl}/address/${address}`);
      const data = response.data;

      return {
        address,
        balance: data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum,
        totalReceived: data.chain_stats.funded_txo_sum,
        totalSent: data.chain_stats.spent_txo_sum,
        unconfirmedBalance: data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum,
        txCount: data.chain_stats.tx_count
      };
    } catch (error) {
      console.error('[BitcoinService] Error fetching address info:', error);
      
      // Return mock data for demo
      return {
        address,
        balance: 0,
        totalReceived: 0,
        totalSent: 0,
        unconfirmedBalance: 0,
        txCount: 0
      };
    }
  }

  // Get address transactions
  async getAddressTransactions(address: string, limit: number = 25): Promise<BitcoinTransaction[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/address/${address}/txs`);
      const transactions = response.data.slice(0, limit);

      return transactions.map((tx: any) => ({
        txid: tx.txid,
        confirmations: tx.status.confirmed ? tx.status.block_height : 0,
        amount: this.calculateAddressAmount(tx, address),
        fee: tx.fee,
        timestamp: tx.status.block_time || Date.now() / 1000,
        blockHeight: tx.status.block_height,
        inputs: tx.vin.map((input: any) => ({
          address: input.prevout?.scriptpubkey_address || 'Unknown',
          amount: input.prevout?.value || 0
        })),
        outputs: tx.vout.map((output: any) => ({
          address: output.scriptpubkey_address || 'Unknown',
          amount: output.value
        }))
      }));
    } catch (error) {
      console.error('[BitcoinService] Error fetching transactions:', error);
      return [];
    }
  }

  // Get UTXOs for an address
  async getAddressUTXOs(address: string): Promise<BitcoinUTXO[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/address/${address}/utxo`);
      const utxos = response.data;

      return utxos.map((utxo: any) => ({
        txid: utxo.txid,
        vout: utxo.vout,
        value: utxo.value,
        confirmations: utxo.status.confirmed ? 1 : 0,
        scriptPubKey: ''
      }));
    } catch (error) {
      console.error('[BitcoinService] Error fetching UTXOs:', error);
      return [];
    }
  }

  // Get transaction details
  async getTransaction(txid: string): Promise<BitcoinTransaction | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/tx/${txid}`);
      const tx = response.data;

      return {
        txid: tx.txid,
        confirmations: tx.status.confirmed ? 1 : 0,
        amount: tx.vout.reduce((sum: number, output: any) => sum + output.value, 0),
        fee: tx.fee,
        timestamp: tx.status.block_time || Date.now() / 1000,
        blockHeight: tx.status.block_height,
        inputs: tx.vin.map((input: any) => ({
          address: input.prevout?.scriptpubkey_address || 'Unknown',
          amount: input.prevout?.value || 0
        })),
        outputs: tx.vout.map((output: any) => ({
          address: output.scriptpubkey_address || 'Unknown',
          amount: output.value
        }))
      };
    } catch (error) {
      console.error('[BitcoinService] Error fetching transaction:', error);
      return null;
    }
  }

  // Estimate transaction fee
  async estimateFee(priority: 'slow' | 'medium' | 'fast' = 'medium'): Promise<number> {
    try {
      const response = await axios.get(`${this.baseUrl}/fee-estimates`);
      const feeEstimates = response.data;

      // Return fee rate in satoshi/vbyte
      switch (priority) {
        case 'slow':
          return feeEstimates['144'] || 1; // 24 hour confirmation
        case 'medium':
          return feeEstimates['6'] || 5;   // 1 hour confirmation
        case 'fast':
          return feeEstimates['1'] || 10;  // Next block confirmation
        default:
          return feeEstimates['6'] || 5;
      }
    } catch (error) {
      console.error('[BitcoinService] Error estimating fee:', error);
      // Return default fee rates
      switch (priority) {
        case 'slow': return 1;
        case 'medium': return 5;
        case 'fast': return 10;
        default: return 5;
      }
    }
  }

  // Broadcast transaction
  async broadcastTransaction(txHex: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/tx`, txHex, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      
      return response.data; // Returns transaction ID
    } catch (error) {
      console.error('[BitcoinService] Error broadcasting transaction:', error);
      throw new Error('Failed to broadcast Bitcoin transaction');
    }
  }

  // Get current Bitcoin price
  async getCurrentPrice(): Promise<number> {
    try {
      const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
      const price = response.data.bpi.USD.rate_float;
      return price;
    } catch (error) {
      console.error('[BitcoinService] Error fetching price:', error);
      return 67000; // Fallback price
    }
  }

  // Monitor address for new transactions
  async monitorAddress(address: string, callback: (tx: BitcoinTransaction) => void): Promise<void> {
    console.log(`[BitcoinService] Starting monitoring for address: ${address}`);
    
    let lastTxCount = 0;
    const addressInfo = await this.getAddressInfo(address);
    lastTxCount = addressInfo.txCount;

    // Poll for new transactions every 30 seconds
    const interval = setInterval(async () => {
      try {
        const currentInfo = await this.getAddressInfo(address);
        
        if (currentInfo.txCount > lastTxCount) {
          console.log(`[BitcoinService] New transaction detected for ${address}`);
          
          // Get recent transactions
          const transactions = await this.getAddressTransactions(address, 5);
          const newTransactions = transactions.slice(0, currentInfo.txCount - lastTxCount);
          
          newTransactions.forEach(tx => callback(tx));
          lastTxCount = currentInfo.txCount;
        }
      } catch (error) {
        console.error('[BitcoinService] Error monitoring address:', error);
      }
    }, 30000);

    // Store interval for cleanup (in production, use a proper job queue)
    (this as any).monitoringIntervals = (this as any).monitoringIntervals || [];
    (this as any).monitoringIntervals.push(interval);
  }

  // Helper method to calculate amount for specific address in transaction
  private calculateAddressAmount(tx: any, address: string): number {
    let amount = 0;
    
    // Calculate received amount
    tx.vout.forEach((output: any) => {
      if (output.scriptpubkey_address === address) {
        amount += output.value;
      }
    });
    
    // Subtract sent amount
    tx.vin.forEach((input: any) => {
      if (input.prevout?.scriptpubkey_address === address) {
        amount -= input.prevout.value;
      }
    });
    
    return amount;
  }

  // Validate Bitcoin address
  isValidAddress(address: string): boolean {
    // Basic Bitcoin address validation
    const patterns = [
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy P2PKH/P2SH
      /^bc1[a-z0-9]{39,59}$/,              // Bech32 P2WPKH/P2WSH
      /^bc1p[a-z0-9]{58}$/                 // Bech32m P2TR
    ];
    
    return patterns.some(pattern => pattern.test(address));
  }

  // Get network statistics
  async getNetworkStats(): Promise<{
    difficulty: number;
    hashrate: number;
    blockHeight: number;
    memPoolSize: number;
    avgFee: number;
  }> {
    try {
      const [statsResponse, mempoolResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/blocks/tip/height`),
        axios.get(`${this.baseUrl}/mempool`)
      ]);

      return {
        difficulty: 0, // Would need additional API call
        hashrate: 0,   // Would need additional API call
        blockHeight: statsResponse.data,
        memPoolSize: mempoolResponse.data.count,
        avgFee: mempoolResponse.data.total_fee / mempoolResponse.data.count || 0
      };
    } catch (error) {
      console.error('[BitcoinService] Error fetching network stats:', error);
      return {
        difficulty: 0,
        hashrate: 0,
        blockHeight: 820000,
        memPoolSize: 0,
        avgFee: 0
      };
    }
  }
}

export const bitcoinService = new BitcoinService();