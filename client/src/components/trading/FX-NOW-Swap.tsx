import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CreditCard, Zap, Shield, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { getFxSwapQuote, type TargetToken } from '@/lib/fxSwapServices';

interface FXNOWSwapProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function FXNOWSwap({ onSuccess, onError }: FXNOWSwapProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();
  
  const [gbpAmount, setGbpAmount] = useState("");
  const [targetToken, setTargetToken] = useState<TargetToken>("USDT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [hostedUrl, setHostedUrl] = useState("");
  const [estimatedOutput, setEstimatedOutput] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [fxRate, setFxRate] = useState(1.34);

  const supportedTokens = ["USDT", "USDC", "BTC", "ETH", "BCH", "LTC", "XRP", "SOL", "BNB", "ADA", "DOT", "LINK", "MATIC", "AVAX"];
  const minAmount = 10;
  const maxAmount = 75000;

  useEffect(() => {
    const fetchQuote = async () => {
      if (!gbpAmount || parseFloat(gbpAmount) <= 0) {
        setEstimatedOutput(0);
        setPayAmount(0);
        setQuoteError(null);
        return;
      }

      setIsLoadingQuote(true);
      setQuoteError(null);

      try {
        const quote = await getFxSwapQuote(
          parseFloat(gbpAmount),
          'GBP',
          targetToken
        );
        
        if (quote.success && quote.quote) {
          setFxRate(quote.quote.fxRate);
          setEstimatedOutput(quote.quote.estimatedOutput);
          // Calculate USD amount for payment using real FX rate
          const usdAmount = parseFloat(gbpAmount) * quote.quote.fxRate;
          setPayAmount(usdAmount);
        } else {
          setQuoteError('Failed to get exchange rate');
          // Fallback calculations
          const amount = parseFloat(gbpAmount);
          const output = amount * 0.985;
          const usdAmount = amount / 1.34;
          setEstimatedOutput(output);
          setPayAmount(usdAmount);
        }
      } catch (error: any) {
        console.error('Quote fetch error:', error);
        setQuoteError(error.message || 'Failed to get exchange rate');
        // Fallback calculations
        const amount = parseFloat(gbpAmount);
        const output = amount * 0.985;
        const usdAmount = amount / 1.34;
        setEstimatedOutput(output);
        setPayAmount(usdAmount);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Debounce the quote fetch to avoid too many API calls
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [gbpAmount, targetToken]);

  const handleCreateInvoice = async () => {
    if (!isAuthenticated || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to use FX-NOW-Swap",
        variant: "destructive",
      });
      return;
    }

    if (!gbpAmount || parseFloat(gbpAmount) < minAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum amount is £${minAmount}`,
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(gbpAmount) > maxAmount) {
      toast({
        title: "Amount Too High",
        description: `Maximum amount is £${maxAmount.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/fx-now-swap/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gbpAmount: parseFloat(gbpAmount),
          destinationWallet: walletAddress,
          targetToken,
          userId: walletAddress,
          clientOrderId: `FXNOW_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invoice');
      }

      setInvoiceUrl(data.invoiceUrl);
      setPaymentId(data.paymentId);
      setHostedUrl(data.hostedUrl);
      
      toast({
        title: "Invoice Created",
        description: "Opening hosted payment page...",
      });

      // Open the hosted payment page
      if (data.hostedUrl) {
        window.open(data.hostedUrl, '_blank');
      }

      onSuccess?.(data);

    } catch (error: any) {
      console.error('FX-NOW-Swap error:', error);
      toast({
        title: "Invoice Failed",
        description: error.message,
        variant: "destructive",
      });
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenPaymentPage = () => {
    if (hostedUrl) {
      window.open(hostedUrl, '_blank');
    }
  };

  return (
    <Card className="glass border-green-500/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              FX-NOW-Swap
            </h3>
            <p className="text-sm text-muted-foreground">Hosted Crypto Payments</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Banner */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-300">Low Fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-300">Secure Hosted</span>
          </div>
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-300">Easy Payment</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount (GBP)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
            <Input
              id="amount"
              type="number"
              placeholder="100.00"
              value={gbpAmount}
              onChange={(e) => setGbpAmount(e.target.value)}
              className="pl-8 bg-slate-800/50 border-slate-600"
              min={minAmount}
              max={maxAmount}
              step="0.01"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: £{minAmount}</span>
            <span>Max: £{maxAmount.toLocaleString()}</span>
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

        {/* Exchange Rate Display */}
        {gbpAmount && parseFloat(gbpAmount) > 0 && (
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Estimated Output</span>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                {isLoadingQuote ? (
                  <span className="animate-pulse">Loading...</span>
                ) : quoteError ? (
                  <span className="text-yellow-400">Rate unavailable</span>
                ) : (
                  `~${estimatedOutput.toFixed(4)} ${targetToken}`
                )}
              </Badge>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Pay Amount (USD)</span>
              <span className="text-lg font-bold text-green-400">
                ${isLoadingQuote ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  payAmount.toFixed(2)
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Exchange Rate</span>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                {isLoadingQuote ? (
                  <span className="animate-pulse">Loading...</span>
                ) : quoteError ? (
                  <span className="text-yellow-400">Rate unavailable</span>
                ) : (
                  `1 GBP = ${fxRate.toFixed(4)} USD`
                )}
              </Badge>
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

        {/* Action Button */}
        <Button
          onClick={handleCreateInvoice}
          disabled={isProcessing || !isAuthenticated}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
              Creating Invoice...
            </>
          ) : !isAuthenticated ? (
            "Connect Wallet First"
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Create Hosted Invoice
            </>
          )}
        </Button>

        {/* Open Payment Page Button */}
        {hostedUrl && (
          <Button
            onClick={handleOpenPaymentPage}
            variant="outline"
            className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Payment Page
          </Button>
        )}

        {/* Process Notice */}
        <div className="flex items-start space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CreditCard className="w-4 h-4 text-green-400 mt-0.5" />
          <div className="text-xs text-green-300">
            <p className="font-medium">Hosted Payment Process</p>
            <p>You will be redirected to a secure hosted payment page to complete your cryptocurrency payment.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
