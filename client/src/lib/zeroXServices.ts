import type { Address } from 'viem';
import { getTokenAddress } from './chains';

const API_BASE_URL = '/api/0x';

// Token list URLs per chain
const TOKEN_LISTS: Record<number, string> = {
  1: 'https://tokens.coingecko.com/uniswap/all.json',
  137: 'https://api-polygon-tokens.polygon.technology/tokenlists/default.tokenlist.json',
  42161: 'https://tokenlist.arbitrum.io/ArbTokenLists/arbed_arb_whitelist_era.json',
  10: 'https://static.optimism.io/optimism.tokenlist.json',
  8453: 'https://token-list.base.org',
  56: 'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
};

export interface SwapQuote {
  transaction: {
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  };
  buyAmount: string;
  sellAmount: string;
  buyToken: string;
  sellToken: string;
  price: string;
  guaranteedPrice: string;
  issues?: {
    allowance?: {
      spender: string;
    };
  };
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId?: number;
}

/**
 * Fetch popular tokens dynamically per chain
 */
export async function fetchTokenList(chainId: number = 1): Promise<Token[]> {
  console.log('Fetching tokens for chain:', chainId);
  
  // Always start with curated list
  const curatedTokens = getTokensForChain(chainId);
  
  // Try to fetch chain-specific token list
  const tokenListUrl = TOKEN_LISTS[chainId];
  
  if (!tokenListUrl) {
    console.warn('No token list URL for chain:', chainId);
    return curatedTokens;
  }
  
  try {
    const response = await fetch(tokenListUrl, { 
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      console.warn('Token list fetch failed, using curated list');
      return curatedTokens;
    }
    
    const data = await response.json();
    
    // Handle different token list formats
    let tokenArray = data.tokens || data;
    
    // Filter tokens for the specific chain
    const fetchedTokens = tokenArray
      .filter((token: any) => {
        // Some lists use chainId, others use chain
        const tokenChainId = token.chainId || token.chain || chainId;
        return tokenChainId === chainId;
      })
      .map((token: any) => ({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: token.logoURI || token.logoUri || token.icon,
        chainId: chainId,
      }))
      .slice(0, 100); // Top 100
    
    // Merge: curated tokens first, then unique fetched tokens
    const allTokens = [...curatedTokens];
    const existingAddresses = new Set(curatedTokens.map(t => t.address.toLowerCase()));
    
    for (const token of fetchedTokens) {
      if (!existingAddresses.has(token.address.toLowerCase())) {
        allTokens.push(token);
      }
    }
    
    console.log(`Total tokens loaded for chain ${chainId}:`, allTokens.length);
    return allTokens;
    
  } catch (error) {
    console.error('Failed to fetch token list:', error);
    return curatedTokens;
  }
}

/**
 * Search tokens by symbol or name
 */
export function searchTokens(tokens: Token[], query: string): Token[] {
  if (!query) return tokens;
  
  const lowerQuery = query.toLowerCase();
  return tokens.filter(token => 
    token.symbol.toLowerCase().includes(lowerQuery) ||
    token.name.toLowerCase().includes(lowerQuery) ||
    token.address.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get a swap quote from 0x API via backend proxy
 */
export async function getSwapQuote(
  sellToken: string,
  buyToken: string,
  sellAmount: string,
  takerAddress: string,
  chainId: number = 1
): Promise<SwapQuote> {
  const params = new URLSearchParams({
    sellToken,
    buyToken,
    sellAmount,
    taker: takerAddress,
    chainId: chainId.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/quote?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.reason || error.error || 'Failed to get swap quote');
  }

  return response.json();
}

/**
 * Get token price from 0x API via backend proxy
 */
export async function getTokenPrice(
  sellToken: string,
  buyToken: string,
  sellAmount: string,
  chainId: number = 1
): Promise<{ price: string; buyAmount: string }> {
  const params = new URLSearchParams({
    sellToken,
    buyToken,
    sellAmount,
    chainId: chainId.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/price?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.reason || error.error || 'Failed to get token price');
  }

  return response.json();
}

// Curated tokens per chain (fallback + guaranteed liquidity)
export function getTokensForChain(chainId: number): Token[] {
  const tokenLists: Record<number, Token[]> = {
    // Ethereum Mainnet
    1: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      },
      {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      },
      {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      },
      {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      },
      {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
      },
      {
        address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        decimals: 8,
        logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
      },
    ],
    
    // Polygon
    137: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'MATIC',
        name: 'Polygon',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      },
      {
        address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        symbol: 'WMATIC',
        name: 'Wrapped Matic',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      },
      {
        address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      },
      {
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      },
      {
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
      },
      {
        address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      },
    ],
    
    // Arbitrum
    42161: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      },
      {
        address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      },
      {
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      },
      {
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      },
      {
        address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
      },
    ],
    
    // Optimism
    10: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      },
      {
        address: '0x4200000000000000000000000000000000000006',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      },
      {
        address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      },
      {
        address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      },
      {
        address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
      },
    ],
    
    // Base
    8453: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      },
      {
        address: '0x4200000000000000000000000000000000000006',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      },
      {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      },
      {
        address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/9956/small/dai-multi-collateral-mcd.png',
      },
    ],
    
    // Sepolia Testnet
    11155111: [
      {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'ETH',
        name: 'Sepolia Ether',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      },
      {
        address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
        symbol: 'WETH',
        name: 'Wrapped Ether',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      },
      {
        address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        symbol: 'USDC',
        name: 'USD Coin (Sepolia)',
        decimals: 6,
        logoURI: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      },
    ],
  };
  
  return tokenLists[chainId] || tokenLists[1];
}

export const COMMON_TOKENS = getTokensForChain(1);