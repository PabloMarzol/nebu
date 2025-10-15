import * as hl from '@nktkas/hyperliquid';
import { createWalletClient, custom, type Address } from 'viem';

// Transport instances
let httpTransport: hl.HttpTransport | null = null;
let wsTransport: hl.WebSocketTransport | null = null;
let infoClient: hl.InfoClient | null = null;

export interface HyperliquidBalance {
  hasBalance: boolean;
  accountValue: string;
  withdrawable: string;
  totalMarginUsed: string;
  needsBridge: boolean;
  positions: any[];
}

export interface HyperliquidMarket {
  name: string;
  szDecimals: number;
  maxLeverage: number;
  onlyIsolated: boolean;
}

export interface HyperliquidPosition {
  coin: string;
  entryPx?: string;
  leverage: {
    type: string;
    value: number;
  };
  liquidationPx?: string;
  marginUsed: string;
  maxLeverage: number;
  positionValue: string;
  returnOnEquity: string;
  szi: string;
  unrealizedPnl: string;
}

/**
 * Initialize Hyperliquid clients
 */
function initializeClients(isTestnet = false) {
  if (!httpTransport) {
    httpTransport = new hl.HttpTransport({ 
      isTestnet,
      timeout: 10000 
    });
  }
  
  if (!wsTransport) {
    wsTransport = new hl.WebSocketTransport({ 
      isTestnet,
      timeout: 10000 
    });
  }
  
  if (!infoClient) {
    infoClient = new hl.InfoClient({ transport: httpTransport });
  }
}

/**
 * Get Hyperliquid markets/assets
 */
export async function getHyperliquidMarkets(isTestnet = false): Promise<HyperliquidMarket[]> {
  try {
    initializeClients(isTestnet);
    
    const meta = await infoClient!.meta();
    return meta.universe.map((asset: any) => ({
      name: asset.name,
      szDecimals: asset.szDecimals,
      maxLeverage: asset.maxLeverage,
      onlyIsolated: asset.onlyIsolated,
    }));
  } catch (error) {
    console.error('Error fetching Hyperliquid markets:', error);
    throw error;
  }
}

/**
 * Check user's Hyperliquid balance and positions
 */
export async function checkHyperliquidBalance(
  address: Address, 
  isTestnet = false
): Promise<HyperliquidBalance> {
  try {
    initializeClients(isTestnet);
    
    const clearinghouse = await infoClient!.clearinghouseState({ user: address });
    
    if (!clearinghouse) {
      return {
        hasBalance: false,
        accountValue: '0',
        withdrawable: '0',
        totalMarginUsed: '0',
        needsBridge: true,
        positions: [],
      };
    }
    
    const accountValue = parseFloat(clearinghouse.marginSummary.accountValue);
    const withdrawable = parseFloat(clearinghouse.withdrawable);
    
    return {
      hasBalance: accountValue > 0,
      accountValue: clearinghouse.marginSummary.accountValue,
      withdrawable: clearinghouse.withdrawable,
      totalMarginUsed: clearinghouse.marginSummary.totalMarginUsed || '0',
      needsBridge: accountValue < 10, // Suggest bridge if < $10
      positions: clearinghouse.assetPositions || [],
    };
  } catch (error) {
    console.error('Error checking Hyperliquid balance:', error);
    return {
      hasBalance: false,
      accountValue: '0',
      withdrawable: '0',
      totalMarginUsed: '0',
      needsBridge: true,
      positions: [],
    };
  }
}

/**
 * Get user's open orders
 */
export async function getHyperliquidOpenOrders(address: Address, isTestnet = false) {
  try {
    initializeClients(isTestnet);
    return await infoClient!.openOrders({ user: address });
  } catch (error) {
    console.error('Error fetching open orders:', error);
    return [];
  }
}

/**
 * Get L2 order book for a specific coin
 */
export async function getHyperliquidOrderBook(coin: string, isTestnet = false) {
  try {
    initializeClients(isTestnet);
    return await infoClient!.l2Book({ coin });
  } catch (error) {
    console.error('Error fetching order book:', error);
    return null;
  }
}

/**
 * Get recent trades for a coin
 */
export async function getHyperliquidRecentTrades(coin: string, isTestnet = false) {
  try {
    initializeClients(isTestnet);
    return await infoClient!.recentTrades({ coin });
  } catch (error) {
    console.error('Error fetching recent trades:', error);
    return [];
  }
}

/**
 * Get all mids (mid prices) for all assets
 */
export async function getHyperliquidAllMids(isTestnet = false) {
  try {
    initializeClients(isTestnet);
    return await infoClient!.allMids();
  } catch (error) {
    console.error('Error fetching all mids:', error);
    return {};
  }
}

/**
 * Create exchange client for trading (requires wallet connection)
 */
export function createHyperliquidExchangeClient(isTestnet = false) {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected');
  }
  
  // Create viem wallet client for MetaMask
  const walletClient = createWalletClient({
    transport: custom(window.ethereum),
  });
  
  const transport = new hl.HttpTransport({ isTestnet, timeout: 10000 });
  
  return new hl.ExchangeClient({
    wallet: walletClient,
    transport,
  });
}

/**
 * Bridge information for funding Hyperliquid account
 */
export function getHyperliquidBridgeInfo(isTestnet = false) {
  return {
    bridgeUrl: isTestnet 
      ? 'https://app.hyperliquid.xyz/bridge?testnet=true'
      : 'https://app.hyperliquid.xyz/bridge',
    network: isTestnet ? 'Hyperliquid Testnet' : 'Hyperliquid Mainnet',
    minDeposit: isTestnet ? '1 USDC' : '10 USDC',
    supportedTokens: ['USDC'],
    chainInfo: {
      name: 'Hyperliquid',
      chainId: isTestnet ? 998 : 42161, // Testnet uses 998, mainnet bridges from Arbitrum
      rpcUrl: isTestnet 
        ? 'https://api.hyperliquid-testnet.xyz/evm' 
        : 'https://api.hyperliquid.xyz/evm',
      blockExplorer: isTestnet 
        ? 'https://explorer.hyperliquid-testnet.xyz' 
        : 'https://explorer.hyperliquid.xyz',
      nativeCurrency: {
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      }
    },
    instructions: [
      '1. Visit the Hyperliquid bridge',
      '2. Connect your Ethereum/Arbitrum wallet',
      '3. Bridge USDC to Hyperliquid L1',
      '4. Wait 2-3 minutes for confirmation',
      '5. Return to NebulaX to start trading'
    ]
  };
}

/**
 * Popular trading pairs on Hyperliquid
 */
export const POPULAR_HL_PAIRS = [
  'BTC',
  'ETH',
  'SOL',
  'DOGE',
  'PEPE',
  'WIF',
  'POPCAT',
  'ARB',
  'AVAX',
  'LINK'
];

/**
 * Check if user needs to switch to Hyperliquid network
 */
export async function checkHyperliquidNetwork(isTestnet = false) {
  if (!window.ethereum) return { needsSwitch: true, error: 'No wallet detected' };
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const targetChainId = isTestnet ? '0x3e6' : '0xa4b1'; // 998 or 42161
    
    return {
      needsSwitch: chainId !== targetChainId,
      currentChain: parseInt(chainId, 16),
      targetChain: parseInt(targetChainId, 16),
      error: null
    };
  } catch (error) {
    return { needsSwitch: true, error: 'Failed to check network' };
  }
}

/**
 * Add/Switch to Hyperliquid network in MetaMask
 */
export async function switchToHyperliquidNetwork(isTestnet = false) {
  if (!window.ethereum) throw new Error('MetaMask not detected');
  
  const bridgeInfo = getHyperliquidBridgeInfo(isTestnet);
  const chainId = `0x${bridgeInfo.chainInfo.chainId.toString(16)}`;
  
  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (switchError: any) {
    // If network doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId,
          chainName: bridgeInfo.chainInfo.name,
          nativeCurrency: bridgeInfo.chainInfo.nativeCurrency,
          rpcUrls: [bridgeInfo.chainInfo.rpcUrl],
          blockExplorerUrls: [bridgeInfo.chainInfo.blockExplorer],
        }],
      });
    } else {
      throw switchError;
    }
  }
}

// Cleanup function for WebSocket connections
export function cleanupHyperliquidConnections() {
  if (wsTransport) {
    wsTransport.close();
    wsTransport = null;
  }
  httpTransport = null;
  infoClient = null;
}