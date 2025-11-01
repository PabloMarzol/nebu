import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Bitcoin, ExternalLink, ArrowLeftRight, Zap, Shield, Globe, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import FXProSwap from './FX-ProSwap';
import FXALT5Swap from './FX-ALT5-Swap';
import FXNOWSwap from './FX-NOW-Swap';
import FXCRYSwap from './FX-CRY-Swap';
import FXRAMPSwap from './FX-RAMP-Swap';

interface ProviderSwapTabsProps {
  defaultTab?: string;
}

export default function ProviderSwapTabs({ defaultTab = "stripe" }: ProviderSwapTabsProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [providerHealth, setProviderHealth] = useState({
    stripe: { status: 'healthy', message: 'Operational' },
    alt5pay: { status: 'healthy', message: 'Operational' },
    nowpayments: { status: 'healthy', message: 'Operational' },
    changenow: { status: 'healthy', message: 'Operational' },
    ramp: { status: 'healthy', message: 'Operational' }
  });

  const providers = [
    {
      id: 'stripe',
      name: 'FX-ProSwap (Stripe)',
      component: FXProSwap,
      icon: CreditCard,
      color: 'from-blue-500 to-purple-600',
      description: 'Professional card payments with instant processing',
      features: ['Instant Processing', 'Fraud Protection', 'Global Access'],
      minAmount: 10,
      maxAmount: 10000,
      fees: '2.9% + £0.30'
    },
    {
      id: 'alt5pay',
      name: 'FX-ALT5-Swap',
      component: FXALT5Swap,
      icon: Bitcoin,
      color: 'from-orange-500 to-red-600',
      description: 'Cryptocurrency exchange with fast settlement',
      features: ['Fast Settlement', 'No Chargebacks', 'Crypto Native'],
      minAmount: 25,
      maxAmount: 50000,
      fees: '2.0%'
    }
    // Other providers are implemented but hidden for now:
    // {
    //   id: 'nowpayments',
    //   name: 'FX-NOW-Swap',
    //   component: FXNOWSwap,
    //   icon: ExternalLink,
    //   color: 'from-green-500 to-teal-600',
    //   description: 'Hosted crypto payments with low fees',
    //   features: ['Low Fees', 'Secure Hosted', 'Easy Payment'],
    //   minAmount: 10,
    //   maxAmount: 75000,
    //   fees: '0.5-1%'
    // },
    // {
    //   id: 'changenow',
    //   name: 'FX-CRY-Swap',
    //   component: FXCRYSwap,
    //   icon: ArrowLeftRight,
    //   color: 'from-purple-500 to-pink-600',
    //   description: 'Instant crypto exchange with fixed-rate protection',
    //   features: ['Fixed Rate', 'Rate Protection', 'Fast Exchange'],
    //   minAmount: 10,
    //   maxAmount: 100000,
    //   fees: '0.5-1%'
    // },
    // {
    //   id: 'ramp',
    //   name: 'FX-RAMP-Swap',
    //   component: FXRAMPSwap,
    //   icon: Zap,
    //   color: 'from-emerald-500 to-teal-600',
    //   description: 'Non-custodial fiat-to-crypto ramp with global coverage',
    //   features: ['Non-Custodial', '170+ Countries', 'Bank-Grade Security'],
    //   minAmount: 10,
    //   maxAmount: 50000,
    //   fees: '1.5%'
    // }
  ];

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

  const getHealthStatus = (providerId: string) => {
    const health = providerHealth[providerId as keyof typeof providerHealth];
    if (health.status === 'healthy') {
      return <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">● Online</Badge>;
    } else if (health.status === 'degraded') {
      return <Badge variant="outline" className="border-yellow-500/30 text-yellow-400 text-xs">● Slow</Badge>;
    } else {
      return <Badge variant="outline" className="border-red-500/30 text-red-400 text-xs">● Offline</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Multi-Provider FX Swap
              </h2>
              <p className="text-muted-foreground">Choose your preferred payment method</p>
            </div>
            {!isAuthenticated && (
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                <AlertCircle className="w-3 h-3 mr-1" />
                Connect Wallet First
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {providers.map((provider) => (
              <div key={provider.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-6 h-6 bg-gradient-to-r ${provider.color} rounded flex items-center justify-center`}>
                    <provider.icon className="w-3 h-3 text-white" />
                  </div>
                  {getHealthStatus(provider.id)}
                </div>
                <h3 className="font-semibold text-sm mb-1">{provider.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{provider.description}</p>
                <div className="text-xs text-muted-foreground">
                  <div>£{provider.minAmount} - £{provider.maxAmount.toLocaleString()}</div>
                  <div>Fees: {provider.fees}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provider Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-600">
          {providers.map((provider) => (
            <TabsTrigger
              key={provider.id}
              value={provider.id}
              className="data-[state=active]:bg-slate-700/50 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
            >
              <div className="flex items-center space-x-2">
                <provider.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{provider.name}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {providers.map((provider) => (
          <TabsContent key={provider.id} value={provider.id} className="mt-6">
            <div className="space-y-4">
              {/* Provider Info Banner */}
              <div className={`p-4 rounded-lg border bg-gradient-to-r ${provider.color}/10 ${provider.color}/20 border-${provider.color.split('-')[1]}-500/30`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${provider.color} rounded-lg flex items-center justify-center`}>
                    <provider.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {provider.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 text-green-400" />
                      <span className="text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Provider Component */}
              <provider.component
                onSuccess={(data) => handleProviderSuccess(provider.id, data)}
                onError={(error) => handleProviderError(provider.id, error)}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Comparison Tool */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Provider Comparison</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={async () => {
              try {
                const response = await fetch('/api/multi-provider/provider-comparison', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    gbpAmount: 100,
                    targetToken: 'USDT',
                    fiatCurrency: 'USD'
                  })
                });
                const data = await response.json();
                
                if (data.success) {
                  toast({
                    title: "Provider Comparison",
                    description: `Best provider: ${data.data.recommendedProvider} (£${data.data.comparison[0].totalCost.toFixed(2)})`,
                  });
                }
              } catch (error) {
                console.error('Comparison error:', error);
              }
            }}
            variant="outline"
            className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            Compare All Providers for £100
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
