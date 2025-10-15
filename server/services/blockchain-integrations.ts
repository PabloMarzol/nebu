import { ethers } from 'ethers';

export class InfuraProvider {
  private provider: ethers.JsonRpcProvider | null = null;
  private projectId: string | undefined;
  private isEnabled: boolean = false;

  constructor(projectId?: string) {
    this.projectId = projectId || process.env.INFURA_PROJECT_ID;
    this.initializeProvider();
  }

  private initializeProvider(): void {
    if (this.projectId && this.projectId !== 'undefined') {
      this.provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${this.projectId}`);
      this.isEnabled = true;
      console.log('[InfuraProvider] Initialized with valid credentials');
    } else {
      console.log('[InfuraProvider] No credentials - blockchain features disabled');
      this.isEnabled = false;
    }
  }

  async getBlockNumber(): Promise<number> {
    if (!this.isEnabled || !this.provider) {
      return 0;
    }
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      console.error('[Infura] Error getting block number:', error);
      return 0;
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.isEnabled || !this.provider) {
      return '0';
    }
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('[Infura] Error getting balance:', error);
      return '0';
    }
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    if (!this.isEnabled || !this.provider) {
      return '0';
    }
    try {
      // ERC-20 token contract interface
      const tokenABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)'
      ];
      
      const contract = new ethers.Contract(tokenAddress, tokenABI, this.provider);
      const balance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('[Infura] Error getting token balance:', error);
      return '0';
    }
  }

  async getTransactionStatus(txHash: string): Promise<any> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return {
        status: receipt?.status,
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
        effectiveGasPrice: receipt?.gasPrice?.toString()
      };
    } catch (error) {
      console.error('[Infura] Error getting transaction status:', error);
      throw error;
    }
  }

  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.provider.getFeeData();
      return ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei');
    } catch (error) {
      console.error('[Infura] Error getting gas price:', error);
      throw error;
    }
  }
}

export class BlockchainService {
  private infura: InfuraProvider;
  
  // Common token addresses on Ethereum mainnet
  private readonly TOKEN_ADDRESSES = {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86a33E6Fe17bB1E0DB0f3e1E00bB38E7bBd9a',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA'
  };

  constructor() {
    this.infura = new InfuraProvider();
  }

  async getWalletPortfolio(address: string): Promise<any> {
    try {
      const portfolio = {
        address,
        eth: await this.infura.getBalance(address),
        tokens: {} as Record<string, string>,
        totalValueUSD: '0',
        lastUpdated: new Date().toISOString()
      };

      // Get token balances
      for (const [symbol, tokenAddress] of Object.entries(this.TOKEN_ADDRESSES)) {
        try {
          const balance = await this.infura.getTokenBalance(tokenAddress, address);
          if (parseFloat(balance) > 0) {
            portfolio.tokens[symbol] = balance;
          }
        } catch (error) {
          console.warn(`[BlockchainService] Could not fetch ${symbol} balance:`, error);
        }
      }

      return portfolio;
    } catch (error) {
      console.error('[BlockchainService] Error getting wallet portfolio:', error);
      throw error;
    }
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  // Compatibility aliases for routes that expect different method names
  async isValidAddress(address: string): Promise<boolean> {
    return this.validateAddress(address);
  }

  async getPortfolioOverview(address: string): Promise<any> {
    return this.getWalletPortfolio(address);
  }

  async getETHBalance(address: string): Promise<string> {
    return this.infura.getBalance(address);
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    return this.infura.getTokenBalance(tokenAddress, walletAddress);
  }

  async getNetworkInfo(): Promise<any> {
    try {
      const [blockNumber, gasPrice] = await Promise.all([
        this.infura.getBlockNumber(),
        this.infura.getGasPrice()
      ]);

      return {
        network: 'ethereum',
        chainId: 1,
        blockNumber,
        gasPrice: `${gasPrice} gwei`,
        isConnected: true,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      console.error('[BlockchainService] Error getting network info:', error);
      return {
        network: 'ethereum',
        chainId: 1,
        isConnected: false,
        error: (error as Error).message,
        lastCheck: new Date().toISOString()
      };
    }
  }

  async estimateTransactionFee(to: string, value: string): Promise<any> {
    try {
      const gasPrice = await this.infura.getGasPrice();
      const gasLimit = '21000'; // Standard ETH transfer
      
      const fee = parseFloat(gasPrice) * parseFloat(gasLimit) / 1e9; // Convert to ETH
      
      return {
        gasPrice: `${gasPrice} gwei`,
        gasLimit,
        estimatedFee: `${fee.toFixed(6)} ETH`,
        estimatedFeeUSD: '0' // Would need price feed integration
      };
    } catch (error) {
      console.error('[BlockchainService] Error estimating transaction fee:', error);
      throw error;
    }
  }
}