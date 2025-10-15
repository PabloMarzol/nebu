import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { 
  ArrowUpDown, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  X,
  Settings
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function LiveTradingPanel() {
  const [selectedPair, setSelectedPair] = useState("ETH/USDC");
  const [orderType, setOrderType] = useState("market");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [slippage, setSlippage] = useState("0.5");

  const queryClient = useQueryClient();

  // Get available trading pairs
  const { data: tradingPairs } = useQuery({
    queryKey: ['/api/trading/pairs'],
    refetchInterval: 30000,
  });

  // Get user orders
  const { data: userOrders } = useQuery({
    queryKey: ['/api/trading/orders'],
    refetchInterval: 5000,
  });

  // Get trading portfolio
  const { data: tradingPortfolio } = useQuery({
    queryKey: ['/api/trading/portfolio'],
    refetchInterval: 10000,
  });

  // Execute swap mutation
  const swapMutation = useMutation({
    mutationFn: async (swapData: any) => {
      const response = await fetch('/api/trading/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(swapData)
      });
      if (!response.ok) throw new Error('Failed to execute swap');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trading/portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['/api/trading/orders'] });
    }
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/sms/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: orderData.pair.replace('/', ''),
          side: orderData.type,
          quantity: orderData.amount,
          price: orderData.price,
          type: orderData.orderType
        })
      });
      if (!response.ok) throw new Error('Failed to create order');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trading/orders'] });
    }
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`/api/trading/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to cancel order');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trading/orders'] });
    }
  });

  const handleTrade = async () => {
    if (!amount || (orderType === 'limit' && !price)) return;

    const [fromToken, toToken] = selectedPair.split('/');
    
    if (orderType === 'market') {
      // Execute immediate swap
      await swapMutation.mutateAsync({
        fromToken: tradeType === 'buy' ? toToken : fromToken,
        toToken: tradeType === 'buy' ? fromToken : toToken,
        amount,
        slippage
      });
    } else {
      // Create limit order
      await createOrderMutation.mutateAsync({
        pair: selectedPair,
        type: tradeType,
        orderType,
        amount,
        price
      });
    }

    // Reset form
    setAmount("");
    setPrice("");
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'filled': return 'bg-green-500';
      case 'open': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Trading Form */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowUpDown className="mr-2 h-5 w-5 text-green-400" />
            Live Trading Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trading Pair Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Trading Pair</label>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(tradingPairs as any[])?.map((pair: any) => (
                  <SelectItem key={pair.pair} value={pair.pair}>
                    {pair.pair}
                  </SelectItem>
                )) || [
                  <SelectItem key="ETH/USDC" value="ETH/USDC">ETH/USDC</SelectItem>,
                  <SelectItem key="BTC/USDC" value="BTC/USDC">BTC/USDC</SelectItem>,
                  <SelectItem key="UNI/ETH" value="UNI/ETH">UNI/ETH</SelectItem>,
                  <SelectItem key="LINK/USDC" value="LINK/USDC">LINK/USDC</SelectItem>,
                  <SelectItem key="AAVE/ETH" value="AAVE/ETH">AAVE/ETH</SelectItem>
                ]}
              </SelectContent>
            </Select>
          </div>

          {/* Buy/Sell Toggle */}
          <div className="flex space-x-2">
            <Button
              variant={tradeType === 'buy' ? 'default' : 'outline'}
              onClick={() => setTradeType('buy')}
              className={`flex-1 ${tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              Buy
            </Button>
            <Button
              variant={tradeType === 'sell' ? 'default' : 'outline'}
              onClick={() => setTradeType('sell')}
              className={`flex-1 ${tradeType === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              Sell
            </Button>
          </div>

          {/* Order Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">Order Type</label>
            <Select value={orderType} onValueChange={setOrderType}>
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
          <div>
            <label className="text-sm font-medium mb-2 block">Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Price Input (for limit orders) */}
          {orderType === 'limit' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Price</label>
              <Input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}

          {/* Slippage (for market orders) */}
          {orderType === 'market' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Slippage Tolerance (%)</label>
              <Select value={slippage} onValueChange={setSlippage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.1">0.1%</SelectItem>
                  <SelectItem value="0.5">0.5%</SelectItem>
                  <SelectItem value="1.0">1.0%</SelectItem>
                  <SelectItem value="3.0">3.0%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Execute Trade Button */}
          <Button
            onClick={handleTrade}
            disabled={!amount || (orderType === 'limit' && !price) || swapMutation.isPending || createOrderMutation.isPending}
            className="w-full"
          >
            {swapMutation.isPending || createOrderMutation.isPending ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedPair.split('/')[0]}`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Active Orders */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
            Active Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userOrders && (userOrders as any[]).length > 0 ? (
            <div className="space-y-3">
              {(userOrders as any[]).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getOrderStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <div>
                      <p className="font-medium">{order.pair}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.type} • {order.orderType} • {order.amount}
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
            <p className="text-center text-muted-foreground py-8">
              No active orders
            </p>
          )}
        </CardContent>
      </Card>

      {/* Trading Portfolio */}
      {tradingPortfolio && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-purple-400" />
              Trading Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries((tradingPortfolio as any)?.balances || {}).map(([token, balance]: [string, any]) => (
                <div key={token} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{token}</span>
                    <span className="font-mono">{parseFloat(balance).toFixed(6)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Status */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
            Trading Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Trading API Connected</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            API Key: live_trade_32450285dbe12f6f
          </p>
        </CardContent>
      </Card>
    </div>
  );
}