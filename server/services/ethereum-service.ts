import { ethers } from 'ethers';
import axios from 'axios';

interface EthereumTransaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  gasUsed: string;
  status: number;
  timestamp: number;
  confirmations: number;
}

interface TokenBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  price?: number;
  value?: number;
}

interface EthereumAddress {
  address: string;
  balance: string;
  balanceFormatted: string;
  nonce: number;
  txCount: number;
  tokens: TokenBalance[];
}

class EthereumService {
  private provider: ethers.Provider | null = null;
  private infuraProjectId: string | undefined;
  private alchemyApiKey: string | undefined;
  private etherscanApiKey: string | undefined;

  // Common ERC-20 token contracts
  private tokenContracts = {
    'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    'USDC': '0xA0b86a33E6417C0f83b2B22BDD6a0c0d1D8C8F5e',
    'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    'LINK': '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    'UNI': '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    'WETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  };

  private erc20Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  ];

  constructor() {
    this.infuraProjectId = process.env.INFURA_PROJECT_ID;
    this.alchemyApiKey = process.env.ALCHEMY_API_KEY;
    this.etherscanApiKey = process.env.ETHERSCAN_API_KEY;

    this.initializeProvider();
  }

  private initializeProvider(): void {
    try {
      if (this.infuraProjectId && this.infuraProjectId !== 'undefined') {
        this.provider = new ethers.InfuraProvider('mainnet', this.infuraProjectId);
        console.log('[EthereumService] Connected via Infura');
      } else if (this.alchemyApiKey && this.alchemyApiKey !== 'undefined') {
        this.provider = new ethers.AlchemyProvider('mainnet', this.alchemyApiKey);
        console.log('[EthereumService] Connected via Alchemy');
      } else {
        // Use public RPC as fallback - but don't initialize if not needed
        console.log('[EthereumService] No blockchain credentials configured - running in offline mode');
        this.provider = null;
      }
    } catch (error) {
      console.error('[EthereumService] Failed to initialize provider:', error);
      this.provider = null;
    }
  }

  // Generate Ethereum address from HD wallet
  async generateAddress(userId: string, index: number = 0): Promise<{
    address: string;
    privateKey: string;
    derivationPath: string;
  }> {
    try {
      // Generate deterministic wallet from user ID
      const seed = ethers.utils.id(`ethereum_${userId}_${index}`);
      const wallet = new ethers.Wallet(seed);

      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        derivationPath: `m/44'/60'/0'/0/${index}`
      };
    } catch (error) {
      console.error('[EthereumService] Error generating address:', error);
      throw new Error('Failed to generate Ethereum address');
    }
  }

  // Get address information
  async getAddressInfo(address: string): Promise<EthereumAddress> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const [balance, nonce, txCount] = await Promise.all([
        this.provider.getBalance(address),
        this.provider.getTransactionCount(address),
        this.getTransactionCount(address)
      ]);

      const tokens = await this.getTokenBalances(address);

      return {
        address,
        balance: balance.toString(),
        balanceFormatted: ethers.utils.formatEther(balance),
        nonce,
        txCount,
        tokens
      };
    } catch (error) {
      console.error('[EthereumService] Error fetching address info:', error);
      
      // Return mock data for demo
      return {
        address,
        balance: '0',
        balanceFormatted: '0.0',
        nonce: 0,
        txCount: 0,
        tokens: []
      };
    }
  }

  // Get token balances for an address
  async getTokenBalances(address: string): Promise<TokenBalance[]> {
    try {
      if (!this.provider) {
        return [];
      }

      const tokenBalances: TokenBalance[] = [];

      for (const [symbol, contractAddress] of Object.entries(this.tokenContracts)) {
        try {
          const contract = new ethers.Contract(contractAddress, this.erc20Abi, this.provider);
          
          const [balance, name, decimals] = await Promise.all([
            contract.balanceOf(address),
            contract.name(),
            contract.decimals()
          ]);

          if (balance.gt(0)) {
            const balanceFormatted = ethers.utils.formatUnits(balance, decimals);
            
            tokenBalances.push({
              contractAddress,
              symbol,
              name,
              decimals,
              balance: balance.toString(),
              balanceFormatted
            });
          }
        } catch (error) {
          // Skip tokens that fail to load
          continue;
        }
      }

      return tokenBalances;
    } catch (error) {
      console.error('[EthereumService] Error fetching token balances:', error);
      return [];
    }
  }

  // Get address transactions
  async getAddressTransactions(address: string, limit: number = 25): Promise<EthereumTransaction[]> {
    try {
      if (!this.etherscanApiKey) {
        console.warn('[EthereumService] Etherscan API key not configured');
        return [];
      }

      const response = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: limit,
          sort: 'desc',
          apikey: this.etherscanApiKey
        }
      });

      if (response.data.status !== '1') {
        throw new Error(response.data.message);
      }

      return response.data.result.map((tx: any) => ({
        hash: tx.hash,
        blockNumber: parseInt(tx.blockNumber),
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasPrice: tx.gasPrice,
        gasLimit: tx.gas,
        gasUsed: tx.gasUsed,
        status: parseInt(tx.txreceipt_status || '1'),
        timestamp: parseInt(tx.timeStamp),
        confirmations: parseInt(tx.confirmations)
      }));
    } catch (error) {
      console.error('[EthereumService] Error fetching transactions:', error);
      return [];
    }
  }

  // Get transaction details
  async getTransaction(txHash: string): Promise<EthereumTransaction | null> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const [tx, receipt] = await Promise.all([
        this.provider.getTransaction(txHash),
        this.provider.getTransactionReceipt(txHash)
      ]);

      if (!tx) {
        return null;
      }

      const currentBlock = await this.provider.getBlockNumber();
      
      return {
        hash: tx.hash,
        blockNumber: tx.blockNumber || 0,
        from: tx.from,
        to: tx.to || '',
        value: tx.value.toString(),
        gasPrice: tx.gasPrice?.toString() || '0',
        gasLimit: tx.gasLimit.toString(),
        gasUsed: receipt?.gasUsed?.toString() || '0',
        status: receipt?.status || 0,
        timestamp: 0, // Would need block timestamp
        confirmations: tx.blockNumber ? currentBlock - tx.blockNumber : 0
      };
    } catch (error) {
      console.error('[EthereumService] Error fetching transaction:', error);
      return null;
    }
  }

  // Estimate gas for transaction
  async estimateGas(
    to: string,
    value: string,
    data?: string
  ): Promise<{
    gasLimit: string;
    gasPrice: string;
    estimatedFee: string;
  }> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const [gasLimit, feeData] = await Promise.all([
        this.provider.estimateGas({
          to,
          value: ethers.utils.parseEther(value),
          data: data || '0x'
        }),
        this.provider.getFeeData()
      ]);

      const gasPrice = feeData.gasPrice || ethers.utils.parseUnits('20', 'gwei');
      const estimatedFee = gasLimit.mul(gasPrice);

      return {
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toString(),
        estimatedFee: ethers.utils.formatEther(estimatedFee)
      };
    } catch (error) {
      console.error('[EthereumService] Error estimating gas:', error);
      
      // Return default estimates
      return {
        gasLimit: '21000',
        gasPrice: ethers.utils.parseUnits('20', 'gwei').toString(),
        estimatedFee: '0.00042'
      };
    }
  }

  // Send ETH transaction
  async sendTransaction(
    privateKey: string,
    to: string,
    value: string,
    gasPrice?: string,
    gasLimit?: string
  ): Promise<string> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const wallet = new ethers.Wallet(privateKey, this.provider);
      
      const tx = await wallet.sendTransaction({
        to,
        value: ethers.utils.parseEther(value),
        gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice) : undefined,
        gasLimit: gasLimit ? ethers.BigNumber.from(gasLimit) : undefined
      });

      console.log(`[EthereumService] Transaction sent: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('[EthereumService] Error sending transaction:', error);
      throw new Error('Failed to send Ethereum transaction');
    }
  }

  // Send ERC-20 token transaction
  async sendTokenTransaction(
    privateKey: string,
    tokenAddress: string,
    to: string,
    amount: string,
    decimals: number = 18
  ): Promise<string> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contract = new ethers.Contract(tokenAddress, this.erc20Abi, wallet);
      
      const tx = await contract.transfer(
        to,
        ethers.utils.parseUnits(amount, decimals)
      );

      console.log(`[EthereumService] Token transaction sent: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('[EthereumService] Error sending token transaction:', error);
      throw new Error('Failed to send token transaction');
    }
  }

  // Monitor address for new transactions
  async monitorAddress(address: string, callback: (tx: EthereumTransaction) => void): Promise<void> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      console.log(`[EthereumService] Starting monitoring for address: ${address}`);

      // Listen for incoming transactions
      this.provider.on({
        address: address
      }, (log) => {
        console.log(`[EthereumService] New transaction detected for ${address}`);
        
        // Process the transaction
        this.getTransaction(log.transactionHash).then(tx => {
          if (tx) {
            callback(tx);
          }
        });
      });

      // Also monitor using polling as backup
      let lastBlock = await this.provider.getBlockNumber();
      
      setInterval(async () => {
        try {
          const currentBlock = await this.provider!.getBlockNumber();
          
          if (currentBlock > lastBlock) {
            // Check for transactions in new blocks
            for (let blockNumber = lastBlock + 1; blockNumber <= currentBlock; blockNumber++) {
              const block = await this.provider!.getBlockWithTransactions(blockNumber);
              
              const relevantTxs = block.transactions.filter(tx => 
                tx.to?.toLowerCase() === address.toLowerCase() || 
                tx.from.toLowerCase() === address.toLowerCase()
              );
              
              for (const tx of relevantTxs) {
                const txDetail = await this.getTransaction(tx.hash);
                if (txDetail) {
                  callback(txDetail);
                }
              }
            }
            
            lastBlock = currentBlock;
          }
        } catch (error) {
          console.error('[EthereumService] Error monitoring blocks:', error);
        }
      }, 15000); // Check every 15 seconds
    } catch (error) {
      console.error('[EthereumService] Error setting up address monitoring:', error);
    }
  }

  // Get current gas prices
  async getGasPrices(): Promise<{
    slow: string;
    standard: string;
    fast: string;
    instant: string;
  }> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.utils.parseUnits('20', 'gwei');

      return {
        slow: ethers.utils.formatUnits(gasPrice.mul(80).div(100), 'gwei'),
        standard: ethers.utils.formatUnits(gasPrice, 'gwei'),
        fast: ethers.utils.formatUnits(gasPrice.mul(120).div(100), 'gwei'),
        instant: ethers.utils.formatUnits(gasPrice.mul(150).div(100), 'gwei')
      };
    } catch (error) {
      console.error('[EthereumService] Error fetching gas prices:', error);
      
      return {
        slow: '15',
        standard: '20',
        fast: '25',
        instant: '30'
      };
    }
  }

  // Validate Ethereum address
  isValidAddress(address: string): boolean {
    try {
      return ethers.utils.isAddress(address);
    } catch {
      return false;
    }
  }

  // Get network statistics
  async getNetworkStats(): Promise<{
    blockNumber: number;
    gasPrice: string;
    difficulty: string;
    totalSupply: string;
  }> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const [blockNumber, feeData] = await Promise.all([
        this.provider.getBlockNumber(),
        this.provider.getFeeData()
      ]);

      return {
        blockNumber,
        gasPrice: ethers.utils.formatUnits(feeData.gasPrice || 0, 'gwei'),
        difficulty: '0', // Difficulty not available post-merge
        totalSupply: '120000000' // Approximate ETH supply
      };
    } catch (error) {
      console.error('[EthereumService] Error fetching network stats:', error);
      
      return {
        blockNumber: 18500000,
        gasPrice: '20',
        difficulty: '0',
        totalSupply: '120000000'
      };
    }
  }

  // Get transaction count for address
  private async getTransactionCount(address: string): Promise<number> {
    try {
      if (!this.etherscanApiKey) {
        return 0;
      }

      const response = await axios.get('https://api.etherscan.io/api', {
        params: {
          module: 'proxy',
          action: 'eth_getTransactionCount',
          address,
          tag: 'latest',
          apikey: this.etherscanApiKey
        }
      });

      return parseInt(response.data.result, 16);
    } catch (error) {
      console.error('[EthereumService] Error fetching transaction count:', error);
      return 0;
    }
  }
}

export const ethereumService = new EthereumService();