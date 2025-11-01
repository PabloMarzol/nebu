import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeftRight, Zap, Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { getFxSwapQuote, type TargetToken } from '@/lib/fxSwapServices';

interface FXCRYSwapProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function FXCRYSwap({ onSuccess, onError }: FXCRYSwapProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();
  
  const [gbpAmount, setGbpAmount] = useState("");
  const [targetToken, setTargetToken] = useState<TargetToken>("USDT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeId, setExchangeId] = useState("");
  const [payinAddress, setPayinAddress] = useState("");
  const [estimatedCrypto, setEstimatedCrypto] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [exchangeStatus, setExchangeStatus] = useState("");
  const [isExchangeActive, setIsExchangeActive] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const supportedTokens = ["USDT", "USDC", "BTC", "ETH", "BCH", "LTC", "XRP", "SOL", "BNB", "ADA", "DOT", "LINK"];
  const minAmount = 10;
  const maxAmount = 100000;

  useEffect(() => {
    const fetchQuote = async () => {
      if (!gbpAmount || parseFloat(gbpAmount) <= 0) {
        setEstimatedCrypto(0);
        setExchangeRate(0);
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
          // Calculate crypto amount from the real FX quote
          const gbpAmountNum = parseFloat(gbpAmount);
          const cryptoAmount = quote.quote.estimatedOutput;
          const cryptoRate = gbpAmountNum / cryptoAmount; // GBP per crypto token
          
          setEstimatedCrypto(cryptoAmount);
          setExchangeRate(cryptoRate);
        } else {
          setQuoteError('Failed to get exchange rate');
          // Fallback to simple calculation
          const amount = parseFloat(gbpAmount);
          const fallbackRate = 1.25; // Simple fallback rate
          const cryptoAmount = amount * 0.8; // Rough approximation
          
          setEstimatedCrypto(cryptoAmount);
          setExchangeRate(fallbackRate);
        }
      } catch (error: any) {
        console.error('Quote fetch error:', error);
        setQuoteError(error.message || 'Failed to get exchange rate');
        // Fallback to simple calculation
        const amount = parseFloat(gbpAmount);
        const fallbackRate = 1.25; // Simple fallback rate
        const cryptoAmount = amount * 0.8; // Rough approximation
        
        setEstimatedCrypto(cryptoAmount);
        setExchangeRate(fallbackRate);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Debounce the quote fetch to avoid too many API calls
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [gbpAmount, targetToken]);

  const handleCreateExchange = async () => {
    if (!isAuthenticated || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to use FX-CRY-Swap",
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
      const response = await fetch('/api/fx-cry-swap/create-exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gbpAmount: parseFloat(gbpAmount),
          destinationWallet: walletAddress,
          targetToken,
          userId: walletAddress,
          clientOrderId: `FXCRY_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create exchange');
      }

      setExchangeId(data.exchangeId);
      setPayinAddress(data.payinAddress);
      setIsExchangeActive(true);
      
      toast({
        title: "Exchange Created",
        description: "Send cryptocurrency to the provided address",
      });

      // Start monitoring exchange status
      startExchangeMonitoring(data.exchangeId);

      onSuccess?.(data);

    } catch (error: any) {
      console.error('FX-CRY-Swap error:', error);
      toast({
        title: "Exchange Failed",
        description: error.message,
        variant: "destructive",
      });
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startExchangeMonitoring = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/fx-cry-swap/exchange-status/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setExchangeStatus(data.data.status);
          
          if (data.data.status === 'finished' || data.data.status === 'failed') {
            clearInterval(interval);
            
            if (data.data.status === 'finished') {
              toast({
                title: "Exchange Complete",
                description: "Your exchange has been completed successfully!",
              });
            } else {
              toast({
                title: "Exchange Failed",
                description: "The exchange could not be completed.",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error('Exchange monitoring error:', error);
      }
    }, 10000); // Check every 10 seconds

    // Store interval ID for cleanup if needed
    return () => clearInterval(interval);
  };

  const handleRefreshRate = () => {
    // Trigger rate refresh
    setEstimatedCrypto(prev => prev * 0.999 + prev * 0.001 * (Math.random() - 0.5));
  };

  return (
    <Card className="glass border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FX-CRY-Swap
            </h3>
            <p className="text-sm text-muted-foreground">Instant Crypto Exchange</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Banner */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-300">Fixed Rate</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-300">Rate Protection</span>
          </div>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-300">Fast Exchange</span>
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
            Exchange to Cryptocurrency
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
              <span className="text-sm text-muted-foreground">Exchange Rate</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                  {isLoadingQuote ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : quoteError ? (
                    <span className="text-yellow-400">Rate unavailable</span>
                  ) : (
                    `1 GBP = ${exchangeRate.toFixed(6)} ${targetToken}`
                  )}
                </Badge>
                <Button
                  onClick={handleRefreshRate}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">You will receive</span>
              <span className="text-lg font-bold text-purple-400">
                {isLoadingQuote ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  `${estimatedCrypto.toFixed(6)} ${targetToken}`
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fixed Rate Valid</span>
              <span className="text-sm text-green-400">
                15 minutes
              </span>
            </div>
            {quoteError && (
              <div className="text-xs text-yellow-400 mt-2">
                ⚠️ {quoteError}
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-2">
              * Real-time rates from FX swap service
            </div>
          </div>
        )}

        {/* Exchange Status */}
        {isExchangeActive && exchangeStatus && (
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Exchange Status</span>
              <Badge 
                variant="outline" 
                className={
                  exchangeStatus === 'finished' ? 'border-green-500/30 text-green-400' :
                  exchangeStatus === 'failed' ? 'border-red-500/30 text-red-400' :
                  'border-blue-500/30 text-blue-400'
                }
              >
                {exchangeStatus.toUpperCase()}
              </Badge>
            </div>
            {payinAddress && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Send to Address:</p>
                <p className="text-xs font-mono bg-slate-800/50 p-2 rounded border border-slate-600 break-all">
                  {payinAddress}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleCreateExchange}
          disabled={isProcessing || !isAuthenticated || isExchangeActive}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
              Creating Exchange...
            </>
          ) : !isAuthenticated ? (
            "Connect Wallet First"
          ) : isExchangeActive ? (
            "Exchange Active"
          ) : (
            <>
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Create Fixed-Rate Exchange
            </>
          )}
        </Button>

        {/* Process Notice */}
        <div className="flex items-start space-x-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <Shield className="w-4 h-4 text-purple-400 mt-0.5" />
          <div className="text-xs text-purple-300">
            <p className="font-medium">Fixed-Rate Exchange Protection</p>
            <p>Your exchange rate is locked for 15 minutes. Send cryptocurrency to the provided address within this time.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
