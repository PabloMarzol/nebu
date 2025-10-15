import { useWalletAuth } from "./useWalletAuth";

// Requirement constants for different features (simplified for wallet auth)
export const TRADING_REQUIREMENTS = {
  requireAuth: true,
};

export const P2P_REQUIREMENTS = {
  requireAuth: true,
};

export const OTC_REQUIREMENTS = {
  requireAuth: true,
};

export const STAKING_REQUIREMENTS = {
  requireAuth: true,
};

export interface AuthStatusResult {
  canAccess: boolean;
  missingRequirements: string[];
  status: {
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
    kycLevel: number;
    accountTier: string;
  };
}

export interface AuthRequirements {
  requireAuth?: boolean;
  requiredKYC?: number;
  requiredFeatures?: string[];
}

/**
 * Simplified auth status for wallet-only authentication
 * All users are considered "verified" once wallet is connected
 */
export function useAuthStatus(requirements: AuthRequirements = {}): AuthStatusResult {
  const { walletAddress, isAuthenticated } = useWalletAuth();

  // For wallet-only auth, once connected = full access
  if (!isAuthenticated || !walletAddress) {
    return {
      canAccess: false,
      missingRequirements: ['Wallet not connected'],
      status: {
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
        kycLevel: 0,
        accountTier: "basic",
      },
    };
  }

  // Wallet connected = all requirements met
  return {
    canAccess: true,
    missingRequirements: [],
    status: {
      emailVerified: true, // Not applicable for wallet auth
      phoneVerified: true, // Not applicable for wallet auth
      twoFactorEnabled: true, // Wallet signature is the "2FA"
      kycLevel: 99, // Max level for wallet users
      accountTier: "premium", // All wallet users get premium access
    },
  };
}