import { ReactNode } from "react";
import AuthStatus from "./auth-status";
import AuthErrorHandler from "./auth-error-handler";
import { useAuthStatus, TRADING_REQUIREMENTS, P2P_REQUIREMENTS, OTC_REQUIREMENTS, STAKING_REQUIREMENTS } from "@/hooks/useAuthStatus";

interface ProtectedTradingWrapperProps {
  children: ReactNode;
  feature: 'trading' | 'p2p' | 'otc' | 'staking' | 'institutional';
  className?: string;
}

const FEATURE_REQUIREMENTS = {
  trading: TRADING_REQUIREMENTS,
  p2p: P2P_REQUIREMENTS,
  otc: OTC_REQUIREMENTS,
  staking: STAKING_REQUIREMENTS,
  institutional: OTC_REQUIREMENTS, // Same as OTC for institutional features
};

const FEATURE_KYC_LEVELS = {
  trading: 1,
  p2p: 2,
  otc: 3,
  staking: 1,
  institutional: 3,
};

const FEATURE_2FA = {
  trading: false,
  p2p: false,
  otc: true,
  staking: false,
  institutional: true,
};

export default function ProtectedTradingWrapper({ children, feature, className = "" }: ProtectedTradingWrapperProps) {
  const requirements = FEATURE_REQUIREMENTS[feature];
  const authStatus = useAuthStatus(requirements);

  if (!authStatus.canAccess) {
    return (
      <div className={`space-y-6 ${className}`}>
        <AuthStatus 
          requiredKYC={FEATURE_KYC_LEVELS[feature]} 
          requiredFeatures={FEATURE_2FA[feature] ? ['2fa'] : []} 
          showActions={true} 
        />
        
        {/* Allow full access to trading page without blur */}
        <div className="relative">
          {children}
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}