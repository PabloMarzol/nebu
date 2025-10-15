import { useState, useEffect } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2, TrendingUp, TrendingDown, Zap, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface QuickTradePanelProps {
  symbol: string; // "BTC/USDT" or "BTC-PERP"
  currentPrice: number;
  priceChange: number;
}

export default function QuickTradePanel({ symbol, currentPrice = 0.0, priceChange = 0.0 }: QuickTradePanelProps) {
  const { walletAddress, isAuthenticated } = useWalletAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State Management
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [tradeMode, setTradeMode] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>('');
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [estimatedTotal, setEstimatedTotal] = useState<string>('');

  // Determine if this is a futures symbol
  const isFutures = symbol.includes('-PERP');
  
  // Parse symbol to get base and quote tokens
  const baseToken = isFutures 
    ? symbol.replace('-PERP', '') 
    : symbol.split('/')[0];
  
  const quoteToken = isFutures ? 'USDC' : symbol.split('/')[1] || 'USDC';

  // Fetch user balance from Hyperliquid
  const { data: userBalance } = useQuery({
    queryKey: ['/api/hyperliquid/balance', walletAddress],
    enabled: !!walletAddress && isAuthenticated,
    refetchInterval: 5000,
  });

  // Place Order Mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      console.log('🚀 Sending order to backend:', orderData);
      
      const response = await fetch('/api/hyperliquid/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Backend error:', error);
        throw new Error(error.error || error.message || 'Failed to place order');
      }
      
      const result = await response.json();
      console.log('✅ Order result:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Order placed successfully:', data);
      toast({
        title: "Order Placed Successfully",
        description: `${orderType.toUpperCase()} order for ${amount} ${baseToken} placed via Hyperliquid.`,
        duration: 5000,
      });
      
      // Reset form
      setAmount('');
      setLimitPrice('');
      setEstimatedTotal('');
      
      // Refetch balance and orders
      queryClient.invalidateQueries({ queryKey: ['/api/hyperliquid/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hyperliquid/orders'] });
      if (isFutures) {
        queryClient.invalidateQueries({ queryKey: ['/api/hyperliquid/positions'] });
      }
    },
    onError: (error: any) => {
      console.error('❌ Mutation error:', error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Calculate estimated total
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setEstimatedTotal('');
      return;
    }

    const qty = parseFloat(amount);
    let price = currentPrice;

    if (tradeMode === 'limit' && limitPrice && parseFloat(limitPrice) > 0) {
      price = parseFloat(limitPrice);
    }

    const total = (qty * price).toFixed(2);
    setEstimatedTotal(total);
  }, [amount, limitPrice, tradeMode, currentPrice]);

  // Handle trade execution
  const handleTrade = async () => {
    if (!isAuthenticated || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to trade.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    if (tradeMode === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid limit price.",
        variant: "destructive",
      });
      return;
    }

    // Prepare order data for Hyperliquid
    const orderData = {
      walletAddress,
      symbol: isFutures ? symbol : `${baseToken}/USDC`, // Normalize symbol format
      side: orderType,
      orderType: tradeMode,
      amount: parseFloat(amount),
      price: tradeMode === 'limit' ? parseFloat(limitPrice) : undefined,
      tradingMode: isFutures ? 'futures' : 'spot',
    };

    await placeOrderMutation.mutateAsync(orderData);
  };

  // Quick amount buttons
  const quickAmounts = isFutures 
    ? [0.001, 0.01, 0.1, 1] 
    : [0.001, 0.01, 0.1, 1];

  const setQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  // Available balance
  const availableBalance = userBalance?.available || 0;
  const maxBuyAmount = currentPrice > 0 ? (availableBalance / currentPrice).toFixed(6) : '0';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>Quick Trade</span>
          </div>
          <div className={`flex items-center text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {priceChange >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            ${currentPrice > 0 ? currentPrice.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            }) : '--'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Hyperliquid Badge */}
        <div className="mb-4 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center space-x-2">
          <Badge variant="outline" className="bg-blue-500/20 border-blue-500/50">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Powered by Hyperliquid
          </Badge>
          <span className="text-xs text-muted-foreground">
            {isFutures ? 'Perpetual Futures' : 'Spot Trading'}
          </span>
        </div>

        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'buy' | 'sell')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="buy" className="data-[state=active]:bg-green-500">
              {isFutures ? 'Long' : 'Buy'} {baseToken}
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-500">
              {isFutures ? 'Short' : 'Sell'} {baseToken}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4 mt-0">
            {/* Order Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm">Order Type</Label>
              <Select value={tradeMode} onValueChange={(v: any) => setTradeMode(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Amount ({baseToken})</Label>
                {isAuthenticated && (
                  <span className="text-xs text-muted-foreground">
                    Available: {availableBalance.toFixed(2)} {quoteToken}
                  </span>
                )}
              </div>
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.001"
              />
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((qty) => (
                  <Button
                    key={qty}
                    size="sm"
                    variant="outline"
                    onClick={() => setQuickAmount(qty)}
                    className="text-xs"
                  >
                    {qty}
                  </Button>
                ))}
              </div>
              
              {/* Max Button */}
              {isAuthenticated && orderType === 'buy' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAmount(maxBuyAmount)}
                  className="w-full text-xs"
                >
                  Max: {maxBuyAmount} {baseToken}
                </Button>
              )}
            </div>

            {/* Limit Price Input (for limit orders) */}
            {tradeMode === 'limit' && (
              <div className="space-y-2">
                <Label>Limit Price ({quoteToken})</Label>
                <Input
                  type="number"
                  placeholder={currentPrice.toString()}
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Current: ${currentPrice.toLocaleString()}
                </p>
              </div>
            )}

            {/* Estimated Total */}
            {estimatedTotal && (
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {tradeMode === 'market' ? 'Est. Total' : 'Total'}
                  </span>
                  <span className="text-lg font-mono font-bold">
                    ${estimatedTotal} {quoteToken}
                  </span>
                </div>
              </div>
            )}

            {/* Market Info */}
            {tradeMode === 'market' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Market orders execute immediately at the best available price on Hyperliquid.
                </AlertDescription>
              </Alert>
            )}

            {/* Execute Button */}
            <Button
              onClick={handleTrade}
              disabled={!isAuthenticated || !amount || placeOrderMutation.isPending || isLoadingQuote}
              className="w-full bg-green-500 hover:bg-green-600"
              size="lg"
            >
              {placeOrderMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : isLoadingQuote ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Quote...
                </>
              ) : !isAuthenticated ? (
                'Connect Wallet'
              ) : (
                `${isFutures ? 'Long' : 'Buy'} ${baseToken}`
              )}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4 mt-0">
            {/* Order Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm">Order Type</Label>
              <Select value={tradeMode} onValueChange={(v: any) => setTradeMode(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Amount ({baseToken})</Label>
                {isAuthenticated && (
                  <span className="text-xs text-muted-foreground">
                    Available: {availableBalance.toFixed(2)} {quoteToken}
                  </span>
                )}
              </div>
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.001"
              />
              
              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((qty) => (
                  <Button
                    key={qty}
                    size="sm"
                    variant="outline"
                    onClick={() => setQuickAmount(qty)}
                    className="text-xs"
                  >
                    {qty}
                  </Button>
                ))}
              </div>
            </div>

            {/* Limit Price Input (for limit orders) */}
            {tradeMode === 'limit' && (
              <div className="space-y-2">
                <Label>Limit Price ({quoteToken})</Label>
                <Input
                  type="number"
                  placeholder={currentPrice.toString()}
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Current: ${currentPrice.toLocaleString()}
                </p>
              </div>
            )}

            {/* Estimated Total */}
            {estimatedTotal && (
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {tradeMode === 'market' ? 'Est. Total' : 'Total'}
                  </span>
                  <span className="text-lg font-mono font-bold">
                    ${estimatedTotal} {quoteToken}
                  </span>
                </div>
              </div>
            )}

            {/* Market Info */}
            {tradeMode === 'market' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Market orders execute immediately at the best available price on Hyperliquid.
                </AlertDescription>
              </Alert>
            )}

            {/* Execute Button */}
            <Button
              onClick={handleTrade}
              disabled={!isAuthenticated || !amount || placeOrderMutation.isPending || isLoadingQuote}
              className="w-full bg-red-500 hover:bg-red-600"
              size="lg"
            >
              {placeOrderMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : isLoadingQuote ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Quote...
                </>
              ) : !isAuthenticated ? (
                'Connect Wallet'
              ) : (
                `${isFutures ? 'Short' : 'Sell'} ${baseToken}`
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {/* Connection Status */}
        {!isAuthenticated && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-300">
                Connect your wallet to start trading on Hyperliquid
              </p>
            </div>
          </div>
        )}

        {/* Trading Info */}
        <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-600">
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>24h Change</span>
              <span className={priceChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Trading Via</span>
              <span className="text-blue-400">Hyperliquid DEX</span>
            </div>
            <div className="flex justify-between">
              <span>Network</span>
              <span>Arbitrum One</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}