import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bitcoin, Zap, Shield, ArrowRight, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";

interface FXALT5OnRampProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function FXALT5OnRamp({ onSuccess, onError }: FXALT5OnRampProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();
  
  const [gbpAmount, setGbpAmount] = useState("");
  const [targetToken, setTargetToken] = useState("USDT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [estimatedCrypto, setEstimatedCrypto] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [estimatedCryptoAmount, setEstimatedCryptoAmount] = useState(0);
  const [orderExpires, setOrderExpires] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  const supportedTokens = ["USDT", "USDC", "BTC", "ETH", "BCH", "LTC", "XRP", "SOL"];
  const supportedPaymentMethods = [
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "card", label: "Credit/Debit Card" },
    { value: "wire", label: "Wire Transfer" }
  ];
  const minAmount = 25;
  const maxAmount = 50000;

  useEffect(() => {
    if (walletAddress) {
      // User is paying with fiat, so we don't need their crypto address for input
    }
  }, [walletAddress]);

  useEffect(() => {
    if (gbpAmount && parseFloat(gbpAmount) > 0 && currentPrice > 0) {
      const amount = parseFloat(gbpAmount);
      const cryptoAmount = amount / currentPrice;
      setEstimatedCrypto(cryptoAmount);
      setExchangeRate(currentPrice);
    } else {
      setEstimatedCrypto(0);
      setExchangeRate(0);
    }
  }, [gbpAmount, currentPrice]);

  useEffect(() => {
    // Fetch current price for the target token (how much crypto they get for their GBP)
    const fetchPrice = async () => {
      if (targetToken) {
        try {
          const response = await fetch(`/api/alt5/current-price?coin=${targetToken}&currency=GBP`);
          const data = await response.json();
          if (data.success) {
            setCurrentPrice(parseFloat(data.data.price));
          }
        } catch (error) {
          console.error('Failed to fetch price:', error);
        }
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [targetToken]);

  const checkPaymentStatus = async () => {
    if (!orderId) return;
    
    try {
      const response = await fetch(`/api/alt5-onramp/order-status/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        if (data.data.status === 'paid') {
          toast({
            title: "Payment Successful! 🎉",
            description: `Your ${targetToken} has been sent to your wallet.`,
          });
        } else if (data.data.status === 'pending') {
          toast({
            title: "Payment Processing",
            description: "Waiting for fiat payment confirmation...",
          });
        } else if (data.data.status === 'failed') {
          toast({
            title: "Payment Failed",
            description: data.data.errorMessage || "Payment was not successful",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Failed to check payment status:', error);
      toast({
        title: "Status Check Failed",
        description: "Unable to check payment status. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleCreateOrder = async () => {
    if (!isAuthenticated || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to receive your cryptocurrency",
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
      // Create on-ramp order - user pays GBP to receive crypto
      const response = await fetch('/api/alt5-onramp/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gbpAmount: parseFloat(gbpAmount),
          destinationWallet: walletAddress, // User receives crypto here
          targetToken,
          userId: walletAddress,
          clientOrderId: `FXALT5_ONRAMP_${Date.now()}`,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      const responseData = data.data || data;
      
      if (!responseData.orderId) {
        throw new Error('Invalid response data from server - missing order ID');
      }
      
      setOrderId(responseData.orderId);
      setEstimatedCryptoAmount(responseData.estimatedCryptoAmount || estimatedCrypto);
      setOrderExpires(responseData.expiresAt || '');
      setShowPaymentDetails(true);
      
      toast({
        title: "Order Created",
        description: "Complete your GBP payment to receive cryptocurrency",
      });

      onSuccess?.(data);

    } catch (error: any) {
      console.error('ALT5 OnRamp error:', error);
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="glass border-green-500/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Bitcoin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ALT5 On-Ramp
            </h3>
            <p className="text-sm text-muted-foreground">Buy Crypto with GBP</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Banner */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-300">Instant Purchase</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-300">Secure Payment</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-300">Fiat → Crypto</span>
          </div>
        </div>

        {/* Amount Input - User pays GBP */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount to Pay (GBP)
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

        {/* Payment Method Selection */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod" className="text-sm font-medium">
            Payment Method
          </Label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 bg-slate-800/50 border border-slate-600 rounded-md text-white"
          >
            {supportedPaymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        {/* Target Token Selection - What crypto they receive */}
        <div className="space-y-2">
          <Label htmlFor="token" className="text-sm font-medium">
            Cryptocurrency to Receive
          </Label>
          <select
            id="token"
            value={targetToken}
            onChange={(e) => setTargetToken(e.target.value)}
            className="w-full p-2 bg-slate-800/50 border border-slate-600 rounded-md text-white"
          >
            {supportedTokens.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
        </div>

        {/* Exchange Rate Display - Shows what they get */}
        {gbpAmount && parseFloat(gbpAmount) > 0 && currentPrice > 0 && (
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Current Rate</span>
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                1 {targetToken} = £{currentPrice.toFixed(2)}
              </Badge>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">You will receive</span>
              <span className="text-lg font-bold text-green-400">
                {estimatedCrypto.toFixed(6)} {targetToken}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">For</span>
              <span className="text-lg font-bold text-blue-400">
                £{gbpAmount}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              * Rate updates every 30 seconds
            </div>
          </div>
        )}

        {/* Payment Instructions (Shown after order creation) */}
        {showPaymentDetails && orderId && (
          <div className="space-y-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="flex items-center space-x-2 mb-3">
              <CreditCard className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-green-300">Payment Instructions</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-green-200">Payment Amount</Label>
                <div className="bg-slate-800/50 rounded-lg p-3 mt-1 border border-slate-600">
                  <div className="text-2xl font-bold text-green-400">
                    £{gbpAmount}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    via {paymentMethod.replace('_', ' ')}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-green-200">You will receive</Label>
                <div className="bg-slate-800/50 rounded-lg p-3 mt-1 border border-slate-600">
                  <div className="text-2xl font-bold text-green-400">
                    {estimatedCryptoAmount.toFixed(6)} {targetToken}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    to your connected wallet
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-green-200">Order ID:</span>
                <span className="font-mono text-xs text-green-300">{orderId}</span>
              </div>

              {orderExpires && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-200">Expires:</span>
                  <span className="text-green-300">{new Date(orderExpires).toLocaleString()}</span>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-200">
                    <p className="font-medium">Next Steps:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Complete your {paymentMethod.replace('_', ' ')} payment</li>
                      <li>{targetToken} will be sent to your wallet after confirmation</li>
                      <li>Order expires in 15 minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  // Here you would integrate with payment processor
                  toast({
                    title: "Redirecting to Payment",
                    description: "Please complete your payment on the next screen",
                  });
                }}
                variant="default"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Complete Payment
              </Button>
              <Button
                onClick={() => checkPaymentStatus()}
                variant="outline"
                className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
              >
                Check Status
              </Button>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!showPaymentDetails && (
          <Button
            onClick={handleCreateOrder}
            disabled={isProcessing || !isAuthenticated}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            size="lg"
          >
            {isProcessing ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                Creating Order...
              </>
            ) : !isAuthenticated ? (
              "Connect Wallet First"
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Buy {targetToken} with GBP
              </>
            )}
          </Button>
        )}

        {/* Process Notice */}
        <div className="flex items-start space-x-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <Bitcoin className="w-4 h-4 text-green-400 mt-0.5" />
          <div className="text-xs text-green-300">
            <p className="font-medium">On-Ramp Process</p>
            <p>Pay with GBP and receive cryptocurrency directly to your wallet. Fast, secure, and crypto-native.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
