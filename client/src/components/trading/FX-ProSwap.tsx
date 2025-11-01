import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CreditCard, Zap, Shield, Globe, RefreshCw, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import StripePaymentForm from '@/components/StripePaymentForm';
import RecoveryStatus from '../RecoveryStatus';
import { createFxSwapPayment, getFxSwapQuote, type TargetToken } from '@/lib/fxSwapServices';

interface FXProSwapProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function FXProSwap({ onSuccess, onError }: FXProSwapProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();
  
  const [gbpAmount, setGbpAmount] = useState("");
  const [targetToken, setTargetToken] = useState<TargetToken>("USDT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [fxRate, setFxRate] = useState(1.34);
  const [estimatedOutput, setEstimatedOutput] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const supportedTokens: TargetToken[] = ["USDT", "USDC", "DAI"];
  const minAmount = 5;
  const maxAmount = 10000;

  useEffect(() => {
    const fetchQuote = async () => {
      if (!gbpAmount || parseFloat(gbpAmount) <= 0) {
        setEstimatedOutput(0);
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
        } else {
          setQuoteError('Failed to get exchange rate');
          // Fallback to current rate
          const output = parseFloat(gbpAmount) * fxRate * 0.97;
          setEstimatedOutput(output);
        }
      } catch (error: any) {
        console.error('Quote fetch error:', error);
        setQuoteError(error.message || 'Failed to get exchange rate');
        // Fallback to current rate
        const output = parseFloat(gbpAmount) * fxRate * 0.97;
        setEstimatedOutput(output);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Debounce the quote fetch to avoid too many API calls
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [gbpAmount, targetToken, fxRate]);

  const handleCreatePayment = async () => {
    if (!isAuthenticated || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to use FX-ProSwap",
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
      // Use the existing working FX swap payment creation - FORCE STRIPE for FX-ProSwap
      const payment = await createFxSwapPayment(
        parseFloat(gbpAmount),
        walletAddress,
        'GBP',
        targetToken
      );
      
      // Check if we got a Stripe payment response
      if (!payment.clientSecret) {
        throw new Error('Stripe payment creation failed - no client secret received');
      }

      setClientSecret(payment.clientSecret);
      setPaymentIntentId(payment.orderId);
      
      toast({
        title: "Payment Created",
        description: "Complete your payment with Stripe",
      });

      // Show Stripe payment form
      if (payment.clientSecret) {
        setClientSecret(payment.clientSecret);
        setPaymentIntentId(payment.orderId);
        setShowPaymentForm(true);
        
        // Store FX swap details for the payment success page
        sessionStorage.setItem('fxSwapDetails', JSON.stringify({
          fiatAmount: parseFloat(gbpAmount),
          fiatCurrency: 'GBP',
          targetToken,
          estimatedOutput: estimatedOutput,
          destinationWallet: walletAddress,
          paymentIntentId: payment.orderId,
          clientSecret: payment.clientSecret
        }));
        
        onSuccess?.(payment);
      }

    } catch (error: any) {
      console.error('FX-ProSwap error:', error);
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="glass border-blue-500/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FX-ProSwap
            </h3>
            <p className="text-sm text-muted-foreground">Professional Card Payments</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Banner */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-300">Instant Processing</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-300">Fraud Protection</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-300">Global Access</span>
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
              <span className="text-sm text-muted-foreground">Exchange Rate</span>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                {isLoadingQuote ? (
                  <span className="animate-pulse">Loading...</span>
                ) : quoteError ? (
                  <span className="text-yellow-400">Rate unavailable</span>
                ) : (
                  `1 GBP = ${fxRate.toFixed(4)} ${targetToken}`
                )}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You will receive</span>
              <span className="text-lg font-bold text-green-400">
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
              * Includes processing fees
            </div>
          </div>
        )}

        {!showPaymentForm ? (
          <Button
            onClick={handleCreatePayment}
            disabled={isProcessing || !isAuthenticated}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            {isProcessing ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                Creating Payment...
              </>
            ) : !isAuthenticated ? (
              "Connect Wallet First"
            ) : (
              "Pay with Card via Stripe"
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <StripePaymentForm 
              clientSecret={clientSecret}
              onSuccess={() => {
                toast({
                  title: "Payment Successful!",
                  description: "Your payment has been processed successfully.",
                });
                setShowPaymentForm(false);
                onSuccess?.({ paymentIntentId, clientSecret });
              }}
            />
            <Button
              variant="outline"
              onClick={() => setShowPaymentForm(false)}
              className="w-full"
            >
              Cancel Payment
            </Button>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-start space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <Shield className="w-4 h-4 text-green-400 mt-0.5" />
          <div className="text-xs text-green-300">
            <p className="font-medium">Secure Payment Processing</p>
            <p>Powered by Stripe with bank-level security and fraud protection.</p>
          </div>
        </div>

        {/* Recovery Status - Shows if payment was processed but swap failed */}
        {paymentIntentId && (
          <RecoveryStatus 
            paymentIntentId={paymentIntentId}
            onRecoveryComplete={() => {
              toast({
                title: "Recovery Complete!",
                description: "Your swap has been completed successfully.",
              });
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
