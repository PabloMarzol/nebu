import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { 
  ArrowUpDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  X,
  Settings,
  Zap,
  ShieldAlert,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";

interface HyperliquidTradingPanelProps {
  tradingMode: 'spot' | 'futures';
}

interface UserBalance {
  totalBalance?: number;
  available?: number;
  marginUsed?: number;
  unrealizedPnl?: number;
}

interface Position {
  side: string;
  symbol: string;
  size: number;
  entryPrice: number;
  pnl: number;
  leverage: number;
}

export default function HyperliquidTradingPanel({ tradingMode }: HyperliquidTradingPanelProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();
  const queryClient = useQueryClient();

  // State Management
  const [selectedPair, setSelectedPair] = useState(tradingMode === 'futures' ? "BTC-PERP" : "BTC/USDC");
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop-loss">("market");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [leverage, setLeverage] = useState([5]); // For futures only
  const [reduceOnly, setReduceOnly] = useState(false); // For futures only
  const [postOnly, setPostOnly] = useState(false);

  // Hyperliquid Trading Pairs
  const spotPairs = [
    "BTC/USDC", "ETH/USDC", "SOL/USDC", "ARB/USDC", "AVAX/USDC",
    "MATIC/USDC", "ATOM/USDC", "LINK/USDC", "UNI/USDC", "AAVE/USDC"
  ];

  const futuresPairs = [
    "BTC-PERP", "ETH-PERP", "SOL-PERP", "ARB-PERP", "AVAX-PERP",
    "MATIC-PERP", "ATOM-PERP", "LINK-PERP", "OP-PERP", "DOGE-PERP"
  ];

  const availablePairs = tradingMode === 'futures' ? futuresPairs : spotPairs;

interface MarketData {
  price?: number;
  change24h?: number;
}

  // Fetch Hyperliquid Market Data
  const { data: marketData, isLoading: isLoadingMarket } = useQuery<MarketData>({
    queryKey: ['/api/hyperliquid/market', selectedPair],
    refetchInterval: 2000, // Refresh every 2 seconds
  });

  // Fetch User Balance
  const { data: userBalance } = useQuery<UserBalance>({
    queryKey: ['/api/hyperliquid/balance', walletAddress],
    enabled: !!walletAddress && isAuthenticated,
    refetchInterval: 5000,
  });

  // Fetch Active Orders
  const { data: activeOrders } = useQuery<any[]>({
    queryKey: ['/api/hyperliquid/orders', walletAddress],
    enabled: !!walletAddress && isAuthenticated,
    refetchInterval: 3000,
  });

  // Fetch Open Positions (Futures Only)
  const { data: openPositions } = useQuery<Position[]>({
    queryKey: ['/api/hyperliquid/positions', walletAddress],
    enabled: !!walletAddress && isAuthenticated && tradingMode === 'futures',
    refetchInterval: 3000,
  });

  // Place Order Mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/hyperliquid/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order Placed Successfully",
        description: `${tradeType.toUpperCase()} order for ${amount} ${selectedPair.split('/')[0]} placed.`,
        duration: 5000,
      });
      
      // Reset form
      setAmount("");
      setPrice("");
      setStopPrice("");
      
      // Refetch orders and balance
      queryClient.invalidateQueries({ queryKey: ['/api/hyperliquid/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hyperliquid/balance'] });
      if (tradingMode === 'futures') {
        queryClient.invalidateQueries({ queryKey: ['/api/hyperliquid/positions'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Cancel Order Mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch('/api/hyperliquid/cancel-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, walletAddress }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Cancelled",
        description: "Order has been successfully cancelled.",
        duration: 3000,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/hyperliquid/orders'] });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel order.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  // Set Leverage Mutation (Futures Only)
  const setLeverageMutation = useMutation({
    mutationFn: async (leverageValue: number) => {
      const response = await fetch('/api/hyperliquid/set-leverage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          symbol: selectedPair, 
          leverage: leverageValue,
          walletAddress 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to set leverage');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Leverage Updated",
        description: `Leverage set to ${data.leverage}x for ${selectedPair}`,
        duration: 3000,
      });
    },
  });

  // Handle Order Placement
  const handlePlaceOrder = async () => {
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

    if (orderType === 'limit' && (!price || parseFloat(price) <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid limit price.",
        variant: "destructive",
      });
      return;
    }

    if (orderType === 'stop-loss' && (!stopPrice || parseFloat(stopPrice) <= 0)) {
      toast({
        title: "Invalid Stop Price",
        description: "Please enter a valid stop price.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      walletAddress,
      symbol: selectedPair,
      side: tradeType,
      orderType,
      amount: parseFloat(amount),
      price: orderType === 'limit' ? parseFloat(price) : undefined,
      stopPrice: orderType === 'stop-loss' ? parseFloat(stopPrice) : undefined,
      leverage: tradingMode === 'futures' ? leverage[0] : undefined,
      reduceOnly: tradingMode === 'futures' ? reduceOnly : undefined,
      postOnly,
      tradingMode,
    };

    await placeOrderMutation.mutateAsync(orderData);
  };

  // Handle Leverage Change (Futures Only)
  const handleLeverageChange = (value: number[]) => {
    setLeverage(value);
  };

  const handleLeverageCommit = async () => {
    if (tradingMode === 'futures') {
      await setLeverageMutation.mutateAsync(leverage[0]);
    }
  };

  // Get current price from market data
  const currentPrice = marketData?.price || 0;
  const priceChange24h = marketData?.change24h || 0;

  // Calculate total cost
  const calculateTotal = () => {
    if (!amount || parseFloat(amount) <= 0) return "0.00";
    
    const qty = parseFloat(amount);
    let effectivePrice = currentPrice;
    
    if (orderType === 'limit' && price) {
      effectivePrice = parseFloat(price);
    }
    
    return (qty * effectivePrice).toFixed(2);
  };

  // Get order status color
  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled': return 'bg-green-500';
      case 'open': return 'bg-blue-500';
      case 'partially_filled': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Trading Form */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-blue-400" />
              Hyperliquid {tradingMode === 'futures' ? 'Perpetual Futures' : 'Spot'} Trading
            </div>
            <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trading Pair Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Trading Pair</Label>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availablePairs.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Price Display */}
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-mono font-bold">
                  ${isLoadingMarket ? '...' : currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`text-sm font-medium ${priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Leverage Slider (Futures Only) */}
          {tradingMode === 'futures' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Leverage: {leverage[0]}x</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLeverageCommit}
                  disabled={setLeverageMutation.isPending}
                >
                  {setLeverageMutation.isPending ? (
                    <>
                      <Clock className="mr-1 h-3 w-3 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
              <Slider
                value={leverage}
                onValueChange={handleLeverageChange}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
              </div>
              <div className="flex items-start space-x-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <ShieldAlert className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">
                  Higher leverage increases both potential profits and losses. Trade responsibly.
                </p>
              </div>
            </div>
          )}

          {/* Buy/Sell Tabs */}
          <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as 'buy' | 'sell')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="data-[state=active]:bg-green-600">
                {tradingMode === 'futures' ? 'Long' : 'Buy'}
              </TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-red-600">
                {tradingMode === 'futures' ? 'Short' : 'Sell'}
              </TabsTrigger>
            </TabsList>

            {/* Order Type Selection */}
            <div className="mt-4">
              <Label className="text-sm font-medium mb-2 block">Order Type</Label>
              <Select value={orderType} onValueChange={(v: any) => setOrderType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop-loss">Stop Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="mt-4">
              <Label className="text-sm font-medium mb-2 block">
                Amount ({selectedPair.split('/')[0].replace('-PERP', '')})
              </Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.001"
              />
            </div>

            {/* Price Input (Limit Orders) */}
            {orderType === 'limit' && (
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">Limit Price (USDC)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                />
              </div>
            )}

            {/* Stop Price Input (Stop Loss Orders) */}
            {orderType === 'stop-loss' && (
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">Stop Price (USDC)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  step="0.01"
                />
              </div>
            )}

            {/* Advanced Options */}
            <div className="mt-4 space-y-2">
              {tradingMode === 'futures' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="reduce-only"
                    checked={reduceOnly}
                    onChange={(e) => setReduceOnly(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="reduce-only" className="text-sm cursor-pointer">
                    Reduce Only (Close position only)
                  </Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="post-only"
                  checked={postOnly}
                  onChange={(e) => setPostOnly(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="post-only" className="text-sm cursor-pointer">
                  Post Only (Maker order)
                </Label>
              </div>
            </div>

            {/* Total Cost */}
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Cost</span>
                <span className="text-lg font-mono font-bold">
                  ${calculateTotal()} USDC
                </span>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={!isAuthenticated || !amount || placeOrderMutation.isPending}
              className={`w-full ${
                tradeType === 'buy' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              size="lg"
            >
              {placeOrderMutation.isPending ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : !isAuthenticated ? (
                'Connect Wallet to Trade'
              ) : (
                `${tradeType === 'buy' ? (tradingMode === 'futures' ? 'Long' : 'Buy') : (tradingMode === 'futures' ? 'Short' : 'Sell')} ${selectedPair.split('/')[0].replace('-PERP', '')}`
              )}
            </Button>
          </Tabs>
        </CardContent>
      </Card>

      {/* Account Balance */}
      {isAuthenticated && userBalance && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
                <p className="text-lg font-bold">${(userBalance.totalBalance || 0).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                <p className="text-xs text-muted-foreground mb-1">Available</p>
                <p className="text-lg font-bold">${(userBalance.available || 0).toLocaleString()}</p>
              </div>
              {tradingMode === 'futures' && (
                <>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <p className="text-xs text-muted-foreground mb-1">Margin Used</p>
                    <p className="text-lg font-bold">${(userBalance.marginUsed || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <p className="text-xs text-muted-foreground mb-1">Unrealized PNL</p>
                    <p className={`text-lg font-bold ${(userBalance.unrealizedPnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${(userBalance.unrealizedPnl || 0).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Open Positions (Futures Only) */}
      {tradingMode === 'futures' && isAuthenticated && openPositions && (openPositions as any[]).length > 0 && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
              Open Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(openPositions as any[]).map((position: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-slate-800/30">
                  <div className="flex items-center space-x-3">
                    <Badge className={position.side === 'long' ? 'bg-green-500' : 'bg-red-500'}>
                      {position.side.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="font-medium">{position.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {position.size} • Entry: ${position.entryPrice}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {position.leverage}x Leverage
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Orders */}
      {isAuthenticated && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Settings className="mr-2 h-5 w-5 text-purple-400" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeOrders && activeOrders.length > 0 ? (
              <div className="space-y-3">
                {activeOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge className={getOrderStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <div>
                        <p className="font-medium">{order.symbol}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.side.toUpperCase()} • {order.orderType} • {order.amount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {order.price && (
                        <span className="text-sm font-mono">${order.price}</span>
                      )}
                      {order.status === 'open' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelOrderMutation.mutate(order.id)}
                          disabled={cancelOrderMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No active orders</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
            Hyperliquid Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Connection</span>
              <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trading Mode</span>
              <Badge variant="outline">
                {tradingMode === 'futures' ? 'Perpetual Futures' : 'Spot Trading'}
              </Badge>
            </div>
            {isAuthenticated && walletAddress && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wallet</span>
                <span className="text-xs font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
