import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bitcoin, Zap, Shield, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";

interface FXALT5SwapProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function FXALT5Swap({ onSuccess, onError }: FXALT5SwapProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();
  
  const [gbpAmount, setGbpAmount] = useState("");
  const [targetToken, setTargetToken] = useState("USDT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [estimatedCrypto, setEstimatedCrypto] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [payinAddress, setPayinAddress] = useState("");
  const [estimatedCryptoAmount, setEstimatedCryptoAmount] = useState(0);
  const [orderExpires, setOrderExpires] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const supportedTokens = ["USDT", "USDC", "BTC", "ETH", "BCH", "LTC", "XRP", "SOL"];
  const minAmount = 25;
  const maxAmount = 50000;

  useEffect(() => {
    if (walletAddress) {
      setCryptoAddress(walletAddress);
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
    // Fetch current price for selected token
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
      const response = await fetch(`/api/fx-alt5-swap/order-status/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        if (data.data.status === 'paid') {
          toast({
            title: "Payment Received! 🎉",
            description: "Your crypto will be sent to your wallet shortly.",
          });
        } else if (data.data.status === 'pending') {
          toast({
            title: "Payment Pending",
            description: "Waiting for blockchain confirmation...",
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
        description: "Please connect your wallet to use FX-ALT5-Swap",
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

    if (!cryptoAddress) {
      toast({
        title: "Crypto Address Required",
        description: "Please enter your cryptocurrency wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/fx-alt5-swap/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gbpAmount: parseFloat(gbpAmount),
          destinationWallet: cryptoAddress,
          targetToken,
          userId: walletAddress,
          clientOrderId: `FXALT5_${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      console.log('[FX-ALT5-Swap] API Response:', data);
      console.log('[FX-ALT5-Swap] Response data structure:', {
        hasData: !!data.data,
        hasOrderId: !!data.data?.orderId,
        hasPayinAddress: !!data.data?.payinAddress,
        hasEstimatedCryptoAmount: !!data.data?.estimatedCryptoAmount,
        hasExpiresAt: !!data.data?.expiresAt,
        fullData: data,
        dataKeys: data ? Object.keys(data) : [],
        dataDataKeys: data.data ? Object.keys(data.data) : []
      });

      // Access the correct data structure - the actual response data is in data.data
      const responseData = data.data || data;
      
      console.log('[FX-ALT5-Swap] Using responseData:', responseData);
      console.log('[FX-ALT5-Swap] responseData keys:', Object.keys(responseData));
      
      if (!responseData.orderId || !responseData.payinAddress) {
        console.error('[FX-ALT5-Swap] Missing required data in response:', responseData);
        console.error('[FX-ALT5-Swap] Required fields missing:', {
          orderId: responseData.orderId,
          payinAddress: responseData.payinAddress,
          estimatedCryptoAmount: responseData.estimatedCryptoAmount,
          expiresAt: responseData.expiresAt
        });
        throw new Error('Invalid response data from server - missing required fields');
      }
      
      setOrderId(responseData.orderId);
      setPayinAddress(responseData.payinAddress);
      setEstimatedCryptoAmount(responseData.estimatedCryptoAmount);
      // Handle different possible field names for expiration
      setOrderExpires(responseData.expiresAt || responseData.expires || '');
      setShowPaymentDetails(true);
      
      toast({
        title: "Order Created",
        description: "Please send cryptocurrency to the provided address",
      });

      onSuccess?.(data);

    } catch (error: any) {
      console.error('FX-ALT5-Swap error:', error);
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
    <Card className="glass border-orange-500/30">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Bitcoin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              FX-ALT5-Swap
            </h3>
            <p className="text-sm text-muted-foreground">Cryptocurrency Exchange</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Features Banner */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-300">Fast Settlement</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-300">No Chargebacks</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bitcoin className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-300">Crypto Native</span>
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
            Pay with Cryptocurrency
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

        {/* Crypto Address Input */}
        <div className="space-y-2">
          <Label htmlFor="cryptoAddress" className="text-sm font-medium">
            Your {targetToken} Wallet Address
          </Label>
          <Input
            id="cryptoAddress"
            type="text"
            placeholder={`Enter your ${targetToken} address`}
            value={cryptoAddress}
            onChange={(e) => setCryptoAddress(e.target.value)}
            className="bg-slate-800/50 border-slate-600 font-mono text-xs"
          />
        </div>

        {/* Exchange Rate Display */}
        {gbpAmount && parseFloat(gbpAmount) > 0 && currentPrice > 0 && (
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Current Rate</span>
              <Badge variant="outline" className="border-orange-500/30 text-orange-400">
                1 {targetToken} = £{currentPrice.toFixed(2)}
              </Badge>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">You need to send</span>
              <span className="text-lg font-bold text-orange-400">
                {estimatedCrypto.toFixed(6)} {targetToken}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">For</span>
              <span className="text-lg font-bold text-green-400">
                £{gbpAmount}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              * Rate updates every 30 seconds
            </div>
          </div>
        )}

        {/* Payment Instructions (Shown after order creation) */}
        {showPaymentDetails && payinAddress && (
          <div className="space-y-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <div className="flex items-center space-x-2 mb-3">
              <Bitcoin className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-orange-300">Payment Instructions</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-orange-200">Send Exactly</Label>
                <div className="bg-slate-800/50 rounded-lg p-3 mt-1 border border-slate-600">
                  <div className="text-2xl font-bold text-orange-400">
                    {estimatedCryptoAmount.toFixed(6)} {targetToken}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ≈ £{gbpAmount} at current rate
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-orange-200">To This Address</Label>
                <div className="bg-slate-800/50 rounded-lg p-3 mt-1 border border-slate-600">
                  <div className="font-mono text-xs break-all text-orange-300">
                    {payinAddress}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(payinAddress)}
                    className="mt-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  >
                    Copy Address
                  </Button>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-orange-200">Order ID:</span>
                <span className="font-mono text-xs text-orange-300">{orderId}</span>
              </div>

              {orderExpires && (
                <div className="flex justify-between text-sm">
                  <span className="text-orange-200">Expires:</span>
                  <span className="text-orange-300">{new Date(orderExpires).toLocaleString()}</span>
                </div>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-yellow-200">
                    <p className="font-medium">Important Instructions:</p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Send the exact amount shown above</li>
                      <li>Use only the {targetToken} network</li>
                      <li>Order expires in 15 minutes</li>
                      <li>Crypto will be sent after blockchain confirmation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => window.open(`https://etherscan.io/address/${payinAddress}`, '_blank')}
                variant="outline"
                className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                View on Explorer
              </Button>
              <Button
                onClick={() => {
                  // Check payment status
                  checkPaymentStatus();
                }}
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
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
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
                Create Crypto Order
              </>
            )}
          </Button>
        )}

        {/* Process Notice */}
        <div className="flex items-start space-x-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <Bitcoin className="w-4 h-4 text-orange-400 mt-0.5" />
          <div className="text-xs text-orange-300">
            <p className="font-medium">Cryptocurrency Payment Process</p>
            <p>Send the exact amount to the provided address. Orders are processed after blockchain confirmation.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
