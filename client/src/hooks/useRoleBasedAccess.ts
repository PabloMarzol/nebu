import { useWalletAuth } from "./useWalletAuth";

export type UserRole = 
  | "user"
  | "trader"
  | "admin"
  | "premium";

export interface RoleBasedAccessResult {
  role: UserRole;
  canAccess: (requiredRole: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
}

/**
 * Simplified role-based access for wallet authentication
 * All connected wallets get "trader" role by default
 */
export function useRoleBasedAccess(): RoleBasedAccessResult {
  const { isAuthenticated } = useWalletAuth();

  const role: UserRole = isAuthenticated ? "trader" : "user";

  const roleHierarchy: Record<UserRole, number> = {
    user: 0,
    trader: 1,
    premium: 2,
    admin: 3,
  };

  const canAccess = (requiredRole: UserRole): boolean => {
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  const hasPermission = (permission: string): boolean => {
    // All connected wallets have trading permissions
    if (!isAuthenticated) return false;
    
    const traderPermissions = [
      "view_markets",
      "place_orders",
      "view_portfolio",
      "withdraw_funds",
      "deposit_funds",
    ];

    return traderPermissions.includes(permission);
  };

  return {
    role,
    canAccess,
    hasPermission,
  };
}