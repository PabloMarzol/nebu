/**
 * Multi-network configuration for FX swaps
 * Supports Ethereum mainnet, Arbitrum, Polygon, and other L2s
 */

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  usdtAddress: string;
  explorerUrl: string;
  gasPrice: {
    maxFeePerGas: string; // in gwei
    maxPriorityFeePerGas: string; // in gwei
  };
  isTestnet?: boolean;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  ethereum: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    explorerUrl: 'https://etherscan.io',
    gasPrice: {
      maxFeePerGas: '20',
      maxPriorityFeePerGas: '2',
    },
  },
  arbitrum: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    usdtAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    explorerUrl: 'https://arbiscan.io',
    gasPrice: {
      maxFeePerGas: '0.1',
      maxPriorityFeePerGas: '0.01',
    },
  },
  polygon: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    usdtAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    explorerUrl: 'https://polygonscan.com',
    gasPrice: {
      maxFeePerGas: '30',
      maxPriorityFeePerGas: '30',
    },
  },
  arbitrumGoerli: {
    chainId: 421613,
    name: 'Arbitrum Goerli',
    rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    usdtAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    explorerUrl: 'https://goerli.arbiscan.io',
    gasPrice: {
      maxFeePerGas: '0.1',
      maxPriorityFeePerGas: '0.01',
    },
    isTestnet: true,
  },
};

export function getNetworkConfig(network: string): NetworkConfig {
  const config = NETWORKS[network];
  if (!config) {
    throw new Error(`Network ${network} not supported`);
  }
  return config;
}

export function getSupportedNetworks(): string[] {
  return Object.keys(NETWORKS);
}

export function getDefaultNetwork(): string {
  // Use Arbitrum for testing due to low gas fees
  return process.env.DEFAULT_NETWORK || 'arbitrum';
}
