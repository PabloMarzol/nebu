import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CreditCard, Zap, Shield, Globe, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { getFxSwapQuote, type TargetToken } from '@/lib/fxSwapServices';

interface FXRAMPSwapProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function FXRAMPSwap({ onSuccess, onError }: FXRAMPSwapProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();
  
  const [fiatAmount, setFiatAmount] = useState("");
  const [fiatCurrency, setFiatCurrency] = useState("GBP");
  const [targetToken, setTargetToken] = useState<TargetToken>("USDT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [rampWidgetUrl, setRampWidgetUrl] = useState("");
  const [estimatedOutput, setEstimatedOutput] = useState(0);
  const [showWidget, setShowWidget] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [fxRate, setFxRate] = useState(1.34);

  const supportedTokens: TargetToken[] = ["USDT", "USDC", "DAI"];
  const supportedCurrencies = ["GBP", "USD", "EUR"];
  const minAmount = 10;
  const maxAmount = 50000;

  useEffect(() => {
    const fetchQuote = async () => {
      if (!fiatAmount || parseFloat(fiatAmount) <= 0) {
        setEstimatedOutput(0);
        setQuoteError(null);
        return;
      }

      setIsLoadingQuote(true);
      setQuoteError(null);

      try {
        const quote = await getFxSwapQuote(
          parseFloat(fiatAmount),
          fiatCurrency,
          targetToken
        );
        
        if (quote.success && quote.quote) {
          setFxRate(quote.quote.fxRate);
          setEstimatedOutput(quote.quote.estimatedOutput);
        } else {
          setQuoteError('Failed to get exchange rate');
          // Fallback calculation
          const amount = parseFloat(fiatAmount);
          const output = amount * fxRate * 0.985;
          setEstimatedOutput(output);
        }
      } catch (error: any) {
        console.error('Quote fetch error:', error);
        setQuoteError(error.message || 'Failed to get exchange rate');
        // Fallback calculation
        const amount = parseFloat(fiatAmount);
        const output = amount * fxRate * 0.985;
        setEstimatedOutput(output);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Debounce the quote fetch to avoid too many API calls
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [fiatAmount, fiatCurrency, targetToken, fxRate]);

  const handleCreateRampPurchase = async () => {
    if (!isAuthenticated || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to use FX-RAMP-Swap",
        variant: "destructive",
      });
      return;
    }

    if (!fiatAmount || parseFloat(fiatAmount) < minAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum amount is ${fiatCurrency}${minAmount}`,
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(fiatAmount) > maxAmount) {
      toast({
        title: "Amount Too High",
        description: `Maximum amount is ${fiatCurrency}${maxAmount.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create Ramp widget URL
      const rampUrl = createRampWidgetUrl({
        swapAsset: targetToken,
        fiatCurrency: fiatCurrency,
        fiatValue: parseFloat(fiatAmount),
        userAddress: walletAddress,
        hostApiKey: import.meta.env.VITE_RAMP_API_KEY || 'pk_test_...',
        hostAppName: 'NebulaX FX Swap',
        hostLogoUrl: window.location.origin + '/favicon.ico',
        webhookStatusUrl: window.location.origin + '/api/fx-ramp/webhook',
        finalUrl: window.location.origin + '/payment-success',
      });

      setRampWidgetUrl(rampUrl);
      setShowWidget(true);
      
      toast({
        title: "Ramp Widget Ready",
        description: "Complete your purchase with Ramp",
      });

      onSuccess?.({ rampUrl, fiatAmount, targetToken, walletAddress });

    } catch (error: any) {
      console.error('FX-RAMP-Swap error:', error);
      toast({
        title: "Ramp Integration Failed",
        description: error.message,
        variant: "destructive",
      });
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const createRampWidgetUrl = (params: {
    swapAsset: string;
    fiatCurrency: string;
    fiatValue: number;
    userAddress: string;
    hostApiKey: string;
    hostAppName: string;
    hostLogoUrl: string;
    webhookStatusUrl: string;
    finalUrl: string;
  }) => {
    const baseUrl = 'https://buy.ramp.network/';
    const queryParams = new URLSearchParams({
      swapAsset: params.swapAsset,
      fiatCurrency: params.fiatCurrency,
      fiatValue: params.fiatValue.toString(),
      userAddress: params.userAddress,
      hostApiKey: params.hostApiKey,
      hostAppName: params.hostAppName,
      hostLogoUrl: params.hostLogoUrl,
      webhookStatusUrl: params.webhookStatusUrl,
      finalUrl: params.finalUrl,
      variant: 'hosted',
      hostUrl: window.location.origin,
    });

    return `${baseUrl}?${queryParams.toString()}`;
  };

  const handleOpenRampWidget = () => {
    if (rampWidgetUrl) {
      window.open(rampWidgetUrl, 'RampWidget', 'width=600,height=800,scrollbars=yes,resizable=yes');
    }
  };

  return (
    <Card className="glass border-emerald-500/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              FX-RAMP-Swap
            </h3>
            <p className="text-sm text-muted-foreground">Seamless Fiat-to-Crypto Ramp</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Banner */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-300">Non-Custodial</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-300">Bank-Grade Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-300">170+ Countries</span>
          </div>
        </div>

        {/* Fiat Currency Selection */}
        <div className="space-y-2">
          <Label htmlFor="fiat-currency" className="text-sm font-medium">
            Fiat Currency
          </Label>
          <select
            id="fiat-currency"
            value={fiatCurrency}
            onChange={(e) => setFiatCurrency(e.target.value as 'GBP' | 'USD' | 'EUR')}
            className="w-full p-2 bg-slate-800/50 border border-slate-600 rounded-md text-white"
          >
            {supportedCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount ({fiatCurrency})
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {fiatCurrency === 'GBP' ? '£' : fiatCurrency === 'USD' ? '$' : '€'}
            </span>
            <Input
              id="amount"
              type="number"
              placeholder="100.00"
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              className="pl-8 bg-slate-800/50 border-slate-600"
              min={minAmount}
              max={maxAmount}
              step="0.01"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {fiatCurrency}{minAmount}</span>
            <span>Max: {fiatCurrency}{maxAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Token Selection */}
        <div className="space-y-2">
          <Label htmlFor="token" className="text-sm font-medium">
            Receive Cryptocurrency
          </Label>
          <select
            id="token"
            value={targetToken}
            onChange={(e) => setTargetToken(e.target.value as TargetToken)}
            className="w-full p-2 bg-slate-800/50 border border-slate-600 rounded-md text-white"
          >
            {supportedTokens.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Wallet */}
        <div className="space-y-2">
          <Label htmlFor="wallet" className="text-sm font-medium flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Destination Wallet
          </Label>
          {walletAddress ? (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600">
              <p className="text-sm font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
              <p className="text-xs text-muted-foreground mt-1">Connected Wallet</p>
            </div>
          ) : (
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-600 text-center">
              <p className="text-sm text-muted-foreground">Please connect your wallet</p>
            </div>
          )}
        </div>

        {/* Exchange Rate Display */}
        {fiatAmount && parseFloat(fiatAmount) > 0 && (
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Exchange Rate</span>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                {isLoadingQuote ? (
                  <span className="animate-pulse">Loading...</span>
                ) : quoteError ? (
                  <span className="text-yellow-400">Rate unavailable</span>
                ) : (
                  `1 ${fiatCurrency} ≈ ${fxRate.toFixed(4)} ${targetToken}`
                )}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You will receive</span>
              <span className="text-lg font-bold text-emerald-400">
                {isLoadingQuote ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  `${estimatedOutput.toFixed(4)} ${targetToken}`
                )}
              </span>
            </div>
            {quoteError && (
              <div className="text-xs text-yellow-400 mt-1">
                ⚠️ {quoteError}
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">
              * Real-time rates from FX swap service
            </div>
          </div>
        )}

        {!showWidget ? (
          <Button
            onClick={handleCreateRampPurchase}
            disabled={isProcessing || !isAuthenticated}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            size="lg"
          >
            {isProcessing ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                Creating Ramp Purchase...
              </>
            ) : !isAuthenticated ? (
              "Connect Wallet First"
            ) : (
              "Buy Crypto with Ramp"
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleOpenRampWidget}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              size="lg"
            >
              <Zap className="mr-2 h-4 w-4" />
              Open Ramp Widget
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowWidget(false)}
              className="w-full"
            >
              Cancel Purchase
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              Click "Open Ramp Widget" to complete your purchase in a secure popup window
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-start space-x-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <Shield className="w-4 h-4 text-emerald-400 mt-0.5" />
          <div className="text-xs text-emerald-300">
            <p className="font-medium">Non-Custodial & Secure</p>
            <p>Ramp never holds your funds. Direct wallet-to-wallet transactions with bank-grade security.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
