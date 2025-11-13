import type { Address } from 'viem';
import { getTokenAddress } from './chains';
import { ethers } from 'ethers';

// Define the SwapQuote interface to match the SDK response structure
export interface SwapQuote {
  transaction?: {
    to: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
  };
  trade?: {
    type: string;
    hash: string;
    eip712: {
      domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
      };
      types: Record<string, Array<{
        name: string;
        type: string;
      }>>;
      message: Record<string, any>;
    };
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

// Token list URLs per chain
const TOKEN_LISTS: Record<number, string> = {
  1: 'https://tokens.coingecko.com/uniswap/all.json',
  137: 'https://api-polygon-tokens.polygon.technology/tokenlists/default.tokenlist.json',
  42161: 'https://tokenlist.arbitrum.io/ArbTokenLists/arbed_arb_whitelist_era.json',
  10: 'https://static.optimism.io/optimism.tokenlist.json',
  8453: 'https://token-list.base.org',
  56: 'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
};

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId?: number;
  supportsGasless?: boolean; // Flag to indicate gasless swap support
}

/**
 * Fetch with retry mechanism
 */
async function fetchWithRetry(url: string, maxRetries: number = 3): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(8000), // Increased timeout
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        return response;
      }

      console.warn(`Token list fetch attempt ${attempt} failed with status ${response.status}`);
      if (attempt === maxRetries) {
        return response;
      }

    } catch (error) {
      console.warn(`Token list fetch attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
    }

    // Wait before retry (exponential backoff)
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
  }

  throw new Error('All retry attempts failed');
}

/**
 * Fetch gasless approval tokens for a specific chain
 */
async function fetchGaslessApprovalTokens(chainId: number): Promise<string[]> {
  try {
    // Use the backend proxy to avoid CORS issues and manage API keys securely
    const response = await fetch(`/api/0x/gasless/gasless-approval-tokens?chainId=${chainId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch gasless approval tokens: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched gasless approval tokens for chain', chainId, ':', data.tokens);
    return data.tokens || [];
  } catch (error) {
    console.error('Error fetching gasless approval tokens:', error);
    return []; // Return empty array as fallback
  }
}

/**
 * Ensures main tokens (USDT, USDC, ETH) are present in token list using dynamic metadata
 */
async function ensureMainTokensPresent(tokens: Token[], chainId: number): Promise<Token[]> {
  const mainSymbols = ['USDT', 'USDC', 'ETH'];
  const tokenMap = new Map(tokens.map(t => [t.symbol.toUpperCase(), t]));
  
  // Check for missing main tokens
  const missingSymbols = mainSymbols.filter(symbol => !tokenMap.has(symbol));
  
  if (missingSymbols.length === 0) return tokens;
  
  console.log('Missing main tokens for chain', chainId, ':', missingSymbols);
  
  // Fetch metadata for missing tokens from various sources
  const enhancedTokens = [...tokens];
  const tokenMetadata = await fetchTokenMetadata(missingSymbols, chainId);
  
  for (const symbol of missingSymbols) {
    const metadata = tokenMetadata.find(t => t.symbol.toUpperCase() === symbol);
    if (metadata) {
      // Check if this token supports gasless
      const gaslessTokens = await fetchGaslessApprovalTokens(chainId);
      const supportsGasless = gaslessTokens.some(gaslessAddr => 
        gaslessAddr.toLowerCase() === metadata.address.toLowerCase()
      );
      
      enhancedTokens.push({
        ...metadata,
        chainId,
        supportsGasless
      });
    }
  }
  
  return enhancedTokens;
}

/**
 * Fetches token metadata from various sources for given symbols and chain
 */
async function fetchTokenMetadata(symbols: string[], chainId: number): Promise<Token[]> {
  try {
    // Try to get token addresses from common token lists first
    const tokenListUrl = getTokenListUrl(chainId);
    if (tokenListUrl) {
      const response = await fetchWithRetry(tokenListUrl);
      if (response.ok) {
        const data = await response.json();
        const tokenArray = data.tokens || data;
        
        if (Array.isArray(tokenArray)) {
          const foundTokens: Token[] = [];
          const symbolsLower = symbols.map(s => s.toLowerCase());
          
          for (const token of tokenArray) {
            if (token.chainId === chainId && symbolsLower.includes(token.symbol.toLowerCase())) {
              foundTokens.push({
                address: token.address,
                symbol: token.symbol,
                name: token.name,
                decimals: token.decimals,
                logoURI: token.logoURI || token.logoUri,
                chainId: chainId,
                supportsGasless: false // Will be updated later
              });
            }
          }
          
          // If we found all symbols, return them
          if (foundTokens.length === symbols.length) {
            return foundTokens;
          }
        }
      }
    }
    
    // Fallback: Use curated tokens per chain as reference
    const curatedTokens = getTokensForChain(chainId);
    const foundTokens: Token[] = [];
    
    for (const symbol of symbols) {
      const token = curatedTokens.find(t => t.symbol.toUpperCase() === symbol.toUpperCase());
      if (token) {
        foundTokens.push(token);
      }
    }
    
    return foundTokens;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return [];
  }
}

/**
 * Get token list URL for a specific chain
 */
function getTokenListUrl(chainId: number): string | undefined {
  const TOKEN_LISTS: Record<number, string> = {
    1: 'https://tokens.coingecko.com/uniswap/all.json',
    137: 'https://api-polygon-tokens.polygon.technology/tokenlists/default.tokenlist.json',
    42161: 'https://tokenlist.arbitrum.io/ArbTokenLists/arbed_arb_whitelist_era.json',
    10: 'https://static.optimism.io/optimism.tokenlist.json',
    8453: 'https://token-list.base.org',
    56: 'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
  };
  return TOKEN_LISTS[chainId];
}

/**
 * Fetch popular tokens dynamically per chain with improved reliability and gasless support
 */
export async function fetchTokenList(chainId: number = 1): Promise<Token[]> {
  console.log('Fetching tokens for chain:', chainId);

  // Try to fetch chain-specific token list FIRST
  const tokenListUrl = TOKEN_LISTS[chainId];

  if (!tokenListUrl) {
    console.warn('No token list URL for chain:', chainId);
    return getTokensForChain(chainId); // Only fallback if no URL
  }

  try {
    console.log('Attempting to fetch dynamic token list...');
    const response = await fetchWithRetry(tokenListUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched token list data');

    // Handle different token list formats
    let tokenArray = data.tokens || data;

    if (!Array.isArray(tokenArray)) {
      throw new Error('Invalid token list format: expected array');
    }

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
      .slice(0, 100); // Top 10

    console.log(`Successfully processed ${fetchedTokens.length} tokens for chain ${chainId}`);

    // Fetch gasless approval tokens for this chain
    const gaslessApprovalTokens = await fetchGaslessApprovalTokens(chainId);
    console.log(`Gasless approval tokens for chain ${chainId}:`, gaslessApprovalTokens);

    // Augment tokens with gasless support flag
    const tokensWithGaslessSupport = fetchedTokens.map(token => ({
      ...token,
      supportsGasless: gaslessApprovalTokens.some(gaslessAddr => 
        gaslessAddr.toLowerCase() === token.address.toLowerCase()
      ),
    }));

    console.log(`Successfully processed ${tokensWithGaslessSupport.length} tokens with gasless support info for chain ${chainId}`);

    // Ensure main tokens are present without hardcoding
    const tokensWithMainTokens = await ensureMainTokensPresent(tokensWithGaslessSupport, chainId);
    console.log(`Successfully processed ${tokensWithMainTokens.length} tokens with main tokens ensured for chain ${chainId}`);

    // Prioritize gasless tokens by filtering to show only gasless-supported tokens first
    // This ensures the UI shows the most relevant tokens for gasless swaps
    const prioritizedTokens = tokensWithMainTokens.filter(token => token.supportsGasless);
    console.log(`Successfully filtered ${prioritizedTokens.length} gasless-supported tokens for chain ${chainId}`);
    
    // If no gasless tokens found, fall back to all tokens with gasless support info
    const finalTokens = prioritizedTokens.length > 0 ? prioritizedTokens : tokensWithMainTokens;
    console.log(`Final token list has ${finalTokens.length} tokens for chain ${chainId}`);

    // Cache the successful response
    try {
      localStorage.setItem(`tokenList_${chainId}`, JSON.stringify(finalTokens));
      localStorage.setItem(`tokenList_timestamp_${chainId}`, Date.now().toString());
    } catch (cacheError) {
      console.warn('Failed to cache token list:', cacheError);
    }

    return finalTokens;

  } catch (error) {
    console.error('Failed to fetch dynamic token list:', error);

    // Try to use cached version before falling back
    try {
      const cachedTokens = localStorage.getItem(`tokenList_${chainId}`);
      const cacheTimestamp = localStorage.getItem(`tokenList_timestamp_${chainId}`);

      if (cachedTokens && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp);
        const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours

        if (cacheAge < maxCacheAge) {
          console.log('Using cached token list (age:', Math.round(cacheAge / 1000 / 60), 'minutes)');
          return JSON.parse(cachedTokens);
        } else {
          console.log('Cached token list is too old, removing...');
          localStorage.removeItem(`tokenList_${chainId}`);
          localStorage.removeItem(`tokenList_timestamp_${chainId}`);
        }
      }
    } catch (cacheError) {
      console.warn('Failed to read cached token list:', cacheError);
    }

    // Only as last resort, use curated list
    console.log('Falling back to curated token list');
    const fallbackTokens = getTokensForChain(chainId);
    
    // Add gasless support info to fallback tokens as well
    const gaslessApprovalTokens = await fetchGaslessApprovalTokens(chainId);
    const tokensWithGaslessSupport = fallbackTokens.map(token => ({
      ...token,
      supportsGasless: gaslessApprovalTokens.some(gaslessAddr => 
        gaslessAddr.toLowerCase() === token.address.toLowerCase()
      ),
    }));

    // Prioritize gasless tokens in fallback as well
    const prioritizedFallbackTokens = tokensWithGaslessSupport.filter(token => token.supportsGasless);
    const finalFallbackTokens = prioritizedFallbackTokens.length > 0 ? prioritizedFallbackTokens : tokensWithGaslessSupport;
    
    // Cache the fallback response as well for consistency
    try {
      localStorage.setItem(`tokenList_${chainId}`, JSON.stringify(finalFallbackTokens));
      localStorage.setItem(`tokenList_timestamp_${chainId}`, Date.now().toString());
    } catch (cacheError) {
      console.warn('Failed to cache fallback token list:', cacheError);
    }
    
    return finalFallbackTokens;
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
): Promise<any> {
  const params = new URLSearchParams({
    sellToken,
    buyToken,
    sellAmount,
    taker: takerAddress,
    chainId: chainId.toString()
  });

  const response = await fetch(`/api/0x/quote?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get swap quote');
  }

  const data = await response.json();

  // CRITICAL: Log actual API response structure for interface creation
  console.log('🔍 0x GASLESS QUOTE RESPONSE STRUCTURE:', JSON.stringify(data, null, 2));

  return data;
}

/**
 * Get token price from 0x API via backend proxy
 */
export async function getTokenPrice(
  sellToken: string,
  buyToken: string,
  sellAmount: string,
  chainId: number = 1
): Promise<any> {
  const params = new URLSearchParams({
    sellToken,
    buyToken,
    sellAmount,
    chainId: chainId.toString()
  });

  const response = await fetch(`/api/0x/price?${params}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get token price');
  }

  const data = await response.json();

  // CRITICAL: Log actual API response structure for interface creation
  console.log('🔍 0x PERMIT2 PRICE RESPONSE STRUCTURE:', JSON.stringify(data, null, 2));

  return data;
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
        address: '0xaf88d065e77c8cC239327C5EDb3a432268e5831',
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
        logoURI: 'https://assets.coingecko.com/coins/images/956/small/dai-multi-collateral-mcd.png',
      },
      {
        address: '0x354a6da3fcde098f8389cad84b0182725c6c91de',
        symbol: 'COMP',
        name: 'Compound',
        decimals: 18,
        logoURI: 'https://assets.coingecko.com/coins/images/10775/small/comp.png',
      }
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
        address: '0x420000000006',
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
        address: '0x42000006',
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

// Maximum uint256 value for unlimited approval
const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

/**
 * Approve a token for spending by a specific spender contract
 * @param tokenAddress - The address of the ERC-20 token to approve
 * @param spenderAddress - The address of the contract that will be allowed to spend the tokens
 * @param amount - The amount to approve (use MAX_UINT256 for unlimited approval)
 * @param signer - The ethers.js Signer object from the user's wallet
 * @returns Transaction hash of the approval transaction
 */
export async function approveToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<string> {
  try {
    // Create contract instance using the token ABI (standard ERC-20 ABI)
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
        "function name() view returns (string)"
      ],
      signer
    );

    // Execute the approval transaction
    const tx = await tokenContract.approve(spenderAddress, amount);
    
    // Wait for the transaction to be confirmed
    const receipt = await tx.wait();
    
    console.log(`Token approval successful. Transaction hash: ${tx.hash}`);
    return tx.hash;
  } catch (error) {
    console.error('Token approval failed:', error);
    throw error;
  }
}
