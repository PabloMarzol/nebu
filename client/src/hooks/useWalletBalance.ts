import { useState, useEffect } from 'react';
import { useWalletAuth } from './useWalletAuth';
import { getTokensForChain } from '@/lib/zeroXServices';

// Mapping from token symbols to CoinGecko IDs for price fetching
const TOKEN_TO_COINGECKO_ID: Record<string, string> = {
  'ETH': 'ethereum',
  'WETH': 'weth',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'DAI': 'dai',
  'WBTC': 'wrapped-bitcoin',
  'COMP': 'compound-governance-token',
  'MATIC': 'matic-network',
  'WMATIC': 'wmatic',
  'BNB': 'binancecoin',
  'AVAX': 'avalanche-2',
  'FTM': 'fantom',
  'ARB': 'arbitrum',
  'OP': 'optimism',
  'BASE': 'ethereum', // Base uses ETH as native token
};

/**
 * Fetch real-time prices from CoinGecko API
 */
async function fetchTokenPrices(tokenSymbols: string[]): Promise<Record<string, number>> {
  try {
    // Convert symbols to CoinGecko IDs
    const coinGeckoIds = tokenSymbols
      .map(symbol => TOKEN_TO_COINGECKO_ID[symbol])
      .filter(id => id) // Remove undefined IDs
      .join(',');

    if (!coinGeckoIds) {
      console.warn('No valid CoinGecko IDs found for symbols:', tokenSymbols);
      return {};
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIds}&vs_currencies=usd`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Convert back to symbol mapping
    const priceMap: Record<string, number> = {};
    for (const [coinGeckoId, priceData] of Object.entries(data)) {
      // Find the symbol for this CoinGecko ID
      const symbol = Object.keys(TOKEN_TO_COINGECKO_ID).find(
        s => TOKEN_TO_COINGECKO_ID[s] === coinGeckoId
      );
      if (symbol && priceData && typeof priceData === 'object' && 'usd' in priceData) {
        priceMap[symbol] = (priceData as any).usd;
      }
    }

    console.log('Fetched real-time prices:', priceMap);
    return priceMap;
  } catch (error) {
    console.error('Failed to fetch token prices from CoinGecko:', error);
    // Return empty object as fallback - balances will show $0 USD value
    return {};
  }
}

interface TokenBalance {
  symbol: string;
  balance: string;
  balanceFormatted: string;
  usdValue: number;
  address: string;
}

interface WalletBalanceState {
  balances: TokenBalance[];
  totalUsdValue: number;
  isLoading: boolean;
  error: string | null;
}

export function useWalletBalance(): WalletBalanceState {
  const { walletAddress, isAuthenticated, chainId } = useWalletAuth();
  const [state, setState] = useState<WalletBalanceState>({
    balances: [],
    totalUsdValue: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isAuthenticated || !walletAddress) {
      setState({
        balances: [],
        totalUsdValue: 0,
        isLoading: false,
        error: null,
      });
      return;
    }

    fetchBalances();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [walletAddress, isAuthenticated, chainId]);

  const fetchBalances = async () => {
    if (!walletAddress || !window.ethereum) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const tokens = getTokensForChain(chainId);

      // First, fetch all balances
      const balancePromises = tokens.map(async (token) => {
        try {
          let balance = '0';

          // Get ETH balance (native token)
          if (token.symbol === 'ETH' || token.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
            const ethBalance = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [walletAddress, 'latest'],
            });
            balance = ethBalance;
          } else {
            // Get ERC-20 token balance
            const data = `0x70a08231000000000000000000000000${walletAddress.slice(2)}`;
            const result = await window.ethereum.request({
              method: 'eth_call',
              params: [{
                to: token.address,
                data: data,
              }, 'latest'],
            });
            balance = result;
          }

          // Convert to readable format
          const balanceInt = parseInt(balance, 16);
          const balanceNum = !isNaN(balanceInt) && token.decimals > 0
            ? balanceInt / Math.pow(10, token.decimals)
            : 0;

          return {
            symbol: token.symbol,
            balance: balance,
            balanceFormatted: balanceNum.toFixed(6),
            usdValue: 0, // Will be calculated after price fetch
            address: token.address,
            hasBalance: balanceNum > 0,
          };
        } catch (err) {
          console.error(`Error fetching ${token.symbol} balance:`, err);
          return {
            symbol: token.symbol,
            balance: '0',
            balanceFormatted: '0.000000',
            usdValue: 0,
            address: token.address,
            hasBalance: false,
          };
        }
      });

      const rawBalances = await Promise.all(balancePromises);

      // Filter tokens that have balances and get unique symbols
      const tokensWithBalance = rawBalances.filter(b => b.hasBalance);
      const symbolsWithBalance = [...new Set(tokensWithBalance.map(b => b.symbol))];

      // Fetch real-time prices for tokens with balances
      const prices = await fetchTokenPrices(symbolsWithBalance);

      // Calculate USD values using real prices
      const balancesWithPrices = rawBalances.map(balance => ({
        ...balance,
        usdValue: balance.hasBalance ? parseFloat(balance.balanceFormatted) * (prices[balance.symbol] || 0) : 0,
      }));

      const totalUsdValue = balancesWithPrices.reduce((sum, b) => sum + b.usdValue, 0);

      setState({
        balances: balancesWithPrices.filter(b => b.hasBalance), // Only show tokens with balance
        totalUsdValue,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error fetching wallet balances:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch balances',
      }));
    }
  };

  return state;
}
