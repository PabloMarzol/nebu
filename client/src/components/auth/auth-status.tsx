import { Shield, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useAuthStatus } from "@/hooks/useAuthStatus";

interface AuthStatusProps {
  requiredKYC?: number;
  requiredFeatures?: string[];
  showActions?: boolean;
}

export default function AuthStatus({ 
  requiredKYC = 0, 
  requiredFeatures = [],
  showActions = true 
}: AuthStatusProps) {
  const { isAuthenticated } = useWalletAuth();
  const authStatus = useAuthStatus({
    requireAuth: true,
    requiredKYC,
    requiredFeatures,
  });

  // Not connected
  if (!isAuthenticated) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Wallet Connection Required</AlertTitle>
        <AlertDescription>
          <p className="mb-4">Please connect your wallet to access this feature.</p>
          {showActions && (
            <div className="flex gap-2">
              <WalletConnect />
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Connected - show success
  if (authStatus.canAccess) {
    return (
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-500">Wallet Connected</AlertTitle>
        <AlertDescription className="text-green-400">
          You have full access to all features.
        </AlertDescription>
      </Alert>
    );
  }

  // Connected but missing requirements (shouldn't happen with wallet auth)
  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Access Requirements</AlertTitle>
      <AlertDescription>
        {authStatus.missingRequirements.map((req, i) => (
          <div key={i}>• {req}</div>
        ))}
      </AlertDescription>
    </Alert>
  );
}