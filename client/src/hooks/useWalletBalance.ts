import { useState, useEffect } from 'react';
import { useWalletAuth } from './useWalletAuth';
import { getTokensForChain } from '@/lib/zeroXServices';

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
          const balanceNum = parseInt(balance, 16) / Math.pow(10, token.decimals);
          
          // Mock USD prices (replace with real API later)
          const mockPrices: Record<string, number> = {
            'ETH': 3500,
            'WETH': 3500,
            'USDC': 1,
            'USDT': 1,
            'DAI': 1,
            'WBTC': 97000,
          };
          
          const usdValue = balanceNum * (mockPrices[token.symbol] || 0);

          return {
            symbol: token.symbol,
            balance: balance,
            balanceFormatted: balanceNum.toFixed(6),
            usdValue: usdValue,
            address: token.address,
          };
        } catch (err) {
          console.error(`Error fetching ${token.symbol} balance:`, err);
          return {
            symbol: token.symbol,
            balance: '0',
            balanceFormatted: '0.000000',
            usdValue: 0,
            address: token.address,
          };
        }
      });

      const balances = await Promise.all(balancePromises);
      const totalUsdValue = balances.reduce((sum, b) => sum + b.usdValue, 0);

      setState({
        balances: balances.filter(b => parseFloat(b.balanceFormatted) > 0), // Only show tokens with balance
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