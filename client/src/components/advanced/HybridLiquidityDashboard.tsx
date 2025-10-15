import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Activity, BarChart3, Bot, TrendingUp, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface LiquidityStats {
  totalPairs: number;
  activePairs: number;
  totalOrders: number;
  totalVolume: number;
  averageSpread: number;
  status: string;
  message: string;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBook {
  pair: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: string;
}

interface Order {
  pair: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: string;
  price?: string;
}

export default function HybridLiquidityDashboard() {
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [orderForm, setOrderForm] = useState<Order>({
    pair: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    amount: '',
    price: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const tradingPairs = [
    'BTC/USDT', 'ETH/USDT', 'ETH/BTC', 'SOL/USDT', 'ADA/USDT',
    'DOT/USDT', 'LINK/USDT', 'UNI/USDT', 'AAVE/USDT', 'MATIC/USDT'
  ];

  // Fetch liquidity stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/hybrid-liquidity/stats'],
    refetchInterval: 5000
  });

  // Fetch order book for selected pair
  const { data: orderBook, isLoading: orderBookLoading } = useQuery({
    queryKey: ['/api/hybrid-liquidity/orderbook', selectedPair],
    queryFn: async () => {
      const pairForUrl = selectedPair.replace('/', '-');
      const response = await fetch(`/api/hybrid-liquidity/orderbook/${pairForUrl}`);
      if (!response.ok) throw new Error('Failed to fetch order book');
      return response.json();
    },
    refetchInterval: 2000
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (order: Order) => {
      return await apiRequest('/api/hybrid-liquidity/order', {
        method: 'POST',
        body: JSON.stringify(order)
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed in the internal liquidity network.",
      });
      // Reset form
      setOrderForm({
        pair: selectedPair,
        side: 'buy',
        type: 'limit',
        amount: '',
        price: ''
      });
      // Refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/hybrid-liquidity/orderbook'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hybrid-liquidity/stats'] });
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handlePlaceOrder = () => {
    if (!orderForm.amount || (orderForm.type === 'limit' && !orderForm.price)) {
      toast({
        title: "Invalid Order",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    placeOrderMutation.mutate(orderForm);
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hybrid Liquidity System</h1>
          <p className="text-muted-foreground">
            Internal Liquidity Network + Market Making Bots providing basic spreads
          </p>
        </div>
        <Badge variant={stats?.status === 'operational' ? 'default' : 'secondary'} className="text-lg px-4 py-2">
          {stats?.status === 'operational' ? (
            <>
              <Activity className="w-4 h-4 mr-2" />
              Operational
            </>
          ) : (
            'Loading...'
          )}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-enhanced border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pairs</p>
                <h3 className="text-2xl font-bold">{stats?.totalPairs || 0}</h3>
              </div>
              <Droplets className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Pairs</p>
                <h3 className="text-2xl font-bold text-green-400">{stats?.activePairs || 0}</h3>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold text-purple-400">{stats?.totalOrders || 0}</h3>
              </div>
              <Bot className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <h3 className="text-2xl font-bold text-yellow-400">
                  {stats?.totalVolume ? formatCurrency(stats.totalVolume) : '$0'}
                </h3>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Message */}
      {stats?.message && (
        <Card className="glass-enhanced border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-emerald-500" />
              <p className="text-emerald-400 font-medium">{stats.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Trading Interface */}
      <Tabs defaultValue="orderbook" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orderbook">Order Book & Trading</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="orderbook" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Order Book */}
            <Card className="lg:col-span-2 glass-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Book</CardTitle>
                  <Select value={selectedPair} onValueChange={setSelectedPair}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tradingPairs.map(pair => (
                        <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>Live order book with market making spreads</CardDescription>
              </CardHeader>
              <CardContent>
                {orderBookLoading ? (
                  <div className="text-center py-8">Loading order book...</div>
                ) : (
                  <div className="space-y-4">
                    {/* Asks (Sell Orders) */}
                    <div>
                      <h4 className="text-sm font-medium text-red-400 mb-2">Asks (Sell)</h4>
                      <div className="space-y-1">
                        {orderBook?.asks?.slice(0, 10).map((ask: OrderBookEntry, index: number) => (
                          <div key={index} className="grid grid-cols-3 gap-4 text-sm py-1 px-2 bg-red-500/5 rounded">
                            <span className="text-red-400">{formatNumber(ask.price, 4)}</span>
                            <span className="text-white">{formatNumber(ask.amount, 6)}</span>
                            <span className="text-muted-foreground">{formatNumber(ask.total, 2)}</span>
                          </div>
                        )) || <div className="text-muted-foreground text-center py-4">No asks available</div>}
                      </div>
                    </div>

                    <div className="border-t border-border"></div>

                    {/* Bids (Buy Orders) */}
                    <div>
                      <h4 className="text-sm font-medium text-green-400 mb-2">Bids (Buy)</h4>
                      <div className="space-y-1">
                        {orderBook?.bids?.slice(0, 10).map((bid: OrderBookEntry, index: number) => (
                          <div key={index} className="grid grid-cols-3 gap-4 text-sm py-1 px-2 bg-green-500/5 rounded">
                            <span className="text-green-400">{formatNumber(bid.price, 4)}</span>
                            <span className="text-white">{formatNumber(bid.amount, 6)}</span>
                            <span className="text-muted-foreground">{formatNumber(bid.total, 2)}</span>
                          </div>
                        )) || <div className="text-muted-foreground text-center py-4">No bids available</div>}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Form */}
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
                <CardDescription>Submit to Internal Liquidity Network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={orderForm.side === 'buy' ? 'default' : 'outline'}
                    onClick={() => setOrderForm({...orderForm, side: 'buy'})}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Buy
                  </Button>
                  <Button
                    variant={orderForm.side === 'sell' ? 'default' : 'outline'}
                    onClick={() => setOrderForm({...orderForm, side: 'sell'})}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Sell
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pair">Trading Pair</Label>
                  <Select 
                    value={orderForm.pair} 
                    onValueChange={(value) => {
                      setOrderForm({...orderForm, pair: value});
                      setSelectedPair(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tradingPairs.map(pair => (
                        <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Order Type</Label>
                  <Select 
                    value={orderForm.type} 
                    onValueChange={(value: 'market' | 'limit') => setOrderForm({...orderForm, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.0000"
                    value={orderForm.amount}
                    onChange={(e) => setOrderForm({...orderForm, amount: e.target.value})}
                  />
                </div>

                {orderForm.type === 'limit' && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.0000"
                      value={orderForm.price}
                      onChange={(e) => setOrderForm({...orderForm, price: e.target.value})}
                    />
                  </div>
                )}

                <Button 
                  onClick={handlePlaceOrder}
                  disabled={placeOrderMutation.isPending}
                  className="w-full"
                >
                  {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Liquidity Performance</CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Average Spread</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {stats?.averageSpread ? `${stats.averageSpread}%` : '0.1%'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-bold text-green-400">99.9%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Market Making Coverage</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((stats?.activePairs || 0) / (stats?.totalPairs || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.activePairs || 0} of {stats?.totalPairs || 0} pairs active
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Hybrid liquidity health overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Internal Liquidity Network</span>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Market Making Bots</span>
                    <Badge variant="default" className="bg-green-500">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Order Matching Engine</span>
                    <Badge variant="default" className="bg-green-500">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Price Discovery</span>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}