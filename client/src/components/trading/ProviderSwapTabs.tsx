import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import OnRampMoneyWidget from '../fx-swap/OnRampMoneyWidget';

interface ProviderSwapTabsProps {
  defaultTab?: string;
}

export default function ProviderSwapTabs({ defaultTab = "onrampmoney" }: ProviderSwapTabsProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();

  const handleProviderSuccess = (provider: string, data: any) => {
    toast({
      title: `${provider.toUpperCase()} Payment Created`,
      description: "Payment initiated successfully",
    });
  };

  const handleProviderError = (provider: string, error: any) => {
    toast({
      title: `${provider.toUpperCase()} Payment Failed`,
      description: error.message || "Payment creation failed",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Single OnRamp Money Widget */}
      <OnRampMoneyWidget
        onSwapInitiated={(data: any) => handleProviderSuccess('onrampmoney', data)}
        onSwapError={(error: any) => handleProviderError('onrampmoney', error)}
      />
    </div>
  );
}
