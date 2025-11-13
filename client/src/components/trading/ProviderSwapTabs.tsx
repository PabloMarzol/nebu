import { useState } from 'react';
<<<<<<< HEAD
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, AlertCircle, Banknote } from "lucide-react";
>>>>>>> d6aea94e8f211886155b80427b64130ee3695302
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import OnRampMoneyWidget from '../fx-swap/OnRampMoneyWidget';

interface ProviderSwapTabsProps {
  defaultTab?: string;
}

export default function ProviderSwapTabs({ defaultTab = "onrampmoney" }: ProviderSwapTabsProps) {
  const { toast } = useToast();
<<<<<<< HEAD
  const { walletAddress, isAuthenticated } = useWalletAuth();

  const handleProviderSuccess = (provider: string, data: any) => {
=======
  const { isAuthenticated } = useWalletAuth();

  const handleSwapInitiated = (data: any) => {
>>>>>>> d6aea94e8f211886155b80427b64130ee3695302
    toast({
      title: "OnRamp Money Order Created",
      description: "Redirecting to payment...",
    });
  };

  const handleSwapError = (error: any) => {
    toast({
      title: "Order Creation Failed",
      description: error.message || "Failed to create order",
      variant: "destructive",
    });
  };

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      {/* Single OnRamp Money Widget */}
      <OnRampMoneyWidget
        onSwapInitiated={(data: any) => handleProviderSuccess('onrampmoney', data)}
        onSwapError={(error: any) => handleProviderError('onrampmoney', error)}
=======
    <div className="w-full max-w-md mx-auto">
      {/* Header Card */}
      <Card className="mb-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Banknote className="w-5 h-5 text-green-400" />
              Fiat to Crypto
            </CardTitle>
            <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
              ● Online
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Buy crypto instantly with fiat currency
          </p>
        </CardHeader>
      </Card>

      {/* Connection Warning */}
      {!isAuthenticated && (
        <Card className="mb-4 bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Connect your wallet to continue</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OnRamp Money Widget */}
      <OnRampMoneyWidget
        onSwapInitiated={handleSwapInitiated}
        onSwapError={handleSwapError}
>>>>>>> d6aea94e8f211886155b80427b64130ee3695302
      />
    </div>
  );
}
