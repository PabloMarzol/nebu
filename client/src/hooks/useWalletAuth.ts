import { useState, useEffect } from 'react';
import { getAuthToken, clearAuthToken } from '@/lib/walletAuth';
import { checkHyperliquidBalance, type HyperliquidBalance } from '@/lib/hyperliquidService';

interface WalletAuthState {
  walletAddress: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  chainId: number;
  hyperliquidBalance: HyperliquidBalance | null;
  isLoadingHLBalance: boolean;
  refreshHyperliquidBalance: () => Promise<void>;
}

interface JWTPayload {
  walletAddress: string;
  exp: number;
  iat: number;
}

/**
 * Decode JWT token (browser-safe, no verification needed - backend verifies)
 */
function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Hook for wallet-based authentication with Hyperliquid integration
 */
export function useWalletAuth(): WalletAuthState {
  const [state, setState] = useState({
    walletAddress: null as string | null,
    isAuthenticated: false,
    isLoading: true,
    chainId: 1, // Default to mainnet
  });

  const [hyperliquidBalance, setHyperliquidBalance] = useState<HyperliquidBalance | null>(null);
  const [isLoadingHLBalance, setIsLoadingHLBalance] = useState(false);

  useEffect(() => {
    checkAuth();
    detectChain();

    // Listen for storage changes (wallet connect/disconnect in other tabs)
    const handleStorageChange = () => checkAuth();
    window.addEventListener('storage', handleStorageChange);

    // Listen for chain changes
    if (window.ethereum) {
      const handleChainChanged = (newChainIdHex: string) => {
        const newChainId = parseInt(newChainIdHex, 16);
        setState(prev => ({ ...prev, chainId: newChainId }));
      };

      const handleAccountsChanged = () => {
        checkAuth();
        detectChain();
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('chainChanged', handleChainChanged);
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load Hyperliquid balance when wallet connects
  useEffect(() => {
    if (state.walletAddress && state.isAuthenticated) {
      loadHyperliquidBalance();
    } else {
      setHyperliquidBalance(null);
    }
  }, [state.walletAddress, state.isAuthenticated]);

  const detectChain = async () => {
    if (window.ethereum) {
      try {
        const chainIdHex = await window.ethereum.request({ 
          method: 'eth_chainId' 
        });
        const chainId = parseInt(chainIdHex, 16);
        setState(prev => ({ ...prev, chainId }));
      } catch (error) {
        console.error('Failed to detect chain:', error);
      }
    }
  };

  const checkAuth = () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setState(prev => ({
          ...prev,
          walletAddress: null,
          isAuthenticated: false,
          isLoading: false,
        }));
        return;
      }

      // Decode JWT to get wallet address (no verification - backend handles that)
      const decoded = decodeJWT(token);

      if (!decoded || !decoded.walletAddress) {
        clearAuthToken();
        setState(prev => ({
          ...prev,
          walletAddress: null,
          isAuthenticated: false,
          isLoading: false,
        }));
        return;
      }

      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        clearAuthToken();
        setState(prev => ({
          ...prev,
          walletAddress: null,
          isAuthenticated: false,
          isLoading: false,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        walletAddress: decoded.walletAddress,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuthToken();
      setState(prev => ({
        ...prev,
        walletAddress: null,
        isAuthenticated: false,
        isLoading: false,
      }));
    }
  };

  const loadHyperliquidBalance = async () => {
    if (!state.walletAddress) return;
    
    setIsLoadingHLBalance(true);
    try {
      const balance = await checkHyperliquidBalance(state.walletAddress as any);
      setHyperliquidBalance(balance);
      console.log('Hyperliquid balance loaded:', balance);
    } catch (error) {
      console.error('Error loading Hyperliquid balance:', error);
      // Set default values on error
      setHyperliquidBalance({
        hasBalance: false,
        accountValue: '0',
        withdrawable: '0',
        totalMarginUsed: '0',
        needsBridge: true,
        positions: [],
      });
    } finally {
      setIsLoadingHLBalance(false);
    }
  };

  return {
    ...state,
    hyperliquidBalance,
    isLoadingHLBalance,
    refreshHyperliquidBalance: loadHyperliquidBalance,
  };
}