import { ethers } from 'ethers';

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const INFURA_MAINNET_URL = INFURA_PROJECT_ID && INFURA_PROJECT_ID !== 'undefined' 
  ? `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}` 
  : null;

// ERC-20 Token ABI for balance checking
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Common token addresses on Ethereum mainnet
const TOKEN_ADDRESSES = {
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86a33E6441E2d4dB55B2C1a2ac6c2ddB9F8b7',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA'
};

class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private isEnabled: boolean = false;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider(): void {
    try {
      if (INFURA_MAINNET_URL) {
        this.provider = new ethers.JsonRpcProvider(INFURA_MAINNET_URL);
        this.isEnabled = true;
        console.log('[Blockchain] Connected to Ethereum mainnet via Infura');
      } else {
        console.log('[Blockchain] No Infura credentials - blockchain features disabled');
        this.isEnabled = false;
      }
    } catch (error) {
      console.error('[Blockchain] Failed to initialize provider:', error);
      this.isEnabled = false;
    }
  }

  // Get ETH balance for an address
  async getETHBalance(address: string): Promise<string> {
    if (!this.isEnabled || !this.provider) {
      return '0';
    }
    
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('[Blockchain] Error fetching ETH balance:', error);
      return '0';
    }
  }

  // Get ERC-20 token balance
  async getTokenBalance(address: string, tokenSymbol: string): Promise<string> {
    if (!this.isEnabled || !this.provider) {
      return '0';
    }
    
    try {
      const tokenAddress = TOKEN_ADDRESSES[tokenSymbol as keyof typeof TOKEN_ADDRESSES];
      if (!tokenAddress) {
        return '0';
      }

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error(`[Blockchain] Error fetching ${tokenSymbol} balance:`, error);
      return '0';
    }
  }

  // Get portfolio overview for a wallet address
  async getPortfolioOverview(address: string) {
    try {
      const ethBalance = await this.getETHBalance(address);
      const tokenBalances = {};

      // Check major token balances
      for (const [symbol, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
        try {
          const balance = await this.getTokenBalance(address, symbol);
          if (parseFloat(balance) > 0) {
            tokenBalances[symbol] = balance;
          }
        } catch (error) {
          console.log(`[Blockchain] Skipping ${symbol} balance check`);
        }
      }

      return {
        address,
        ethBalance,
        tokenBalances,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[Blockchain] Error fetching portfolio:', error);
      throw error;
    }
  }

  // Get transaction history for an address
  async getTransactionHistory(address: string, limit: number = 10) {
    try {
      const latestBlock = await this.provider.getBlockNumber();
      const startBlock = Math.max(0, latestBlock - 1000); // Last ~1000 blocks

      const filter = {
        fromBlock: startBlock,
        toBlock: 'latest',
        address: address
      };

      const logs = await this.provider.getLogs(filter);
      
      return logs.slice(0, limit).map(log => ({
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
        address: log.address,
        topics: log.topics,
        data: log.data
      }));
    } catch (error) {
      console.error('[Blockchain] Error fetching transaction history:', error);
      throw error;
    }
  }

  // Validate Ethereum address
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  // Get current gas price
  async getCurrentGasPrice(): Promise<string> {
    try {
      const feeData = await this.provider.getFeeData();
      return ethers.formatUnits(feeData.gasPrice || BigInt(0), 'gwei');
    } catch (error) {
      console.error('[Blockchain] Error fetching gas price:', error);
      throw error;
    }
  }

  // Get network information
  async getNetworkInfo() {
    try {
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.getCurrentGasPrice();

      return {
        chainId: network.chainId.toString(),
        name: network.name,
        blockNumber,
        gasPrice: gasPrice + ' gwei',
        rpcUrl: INFURA_MAINNET_URL
      };
    } catch (error) {
      console.error('[Blockchain] Error fetching network info:', error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
export { TOKEN_ADDRESSES };