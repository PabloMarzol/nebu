import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: number;
  price?: number;
  status: string;
  filled: number;
  remaining: number;
  createdAt: string;
}

interface OrderBook {
  symbol: string;
  bids: Array<{ price: number; amount: number; total: number; orders: number }>;
  asks: Array<{ price: number; amount: number; total: number; orders: number }>;
  lastUpdate: string;
}

interface TradingFees {
  makerFee: number;
  takerFee: number;
  withdrawalFees: Record<string, number>;
}

export default function EnhancedTradingInterface() {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch trading pairs
  const { data: tradingPairs } = useQuery({
    queryKey: ["/api/trading/pairs"],
  });

  // Fetch order book
  const { data: orderBook } = useQuery({
    queryKey: ["/api/trading/orderbook", selectedPair],
    refetchInterval: 1000, // Update every second
  });

  // Fetch user orders
  const { data: userOrders } = useQuery({
    queryKey: ["/api/trading/orders"],
    refetchInterval: 2000,
  });

  // Fetch trading fees
  const { data: tradingFees } = useQuery({
    queryKey: ["/api/trading/fees"],
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("/api/trading/order", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/trading/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trading/orderbook"] });
      setAmount("");
      setPrice("");
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return apiRequest(`/api/trading/order/${orderId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/trading/orders"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle order submission
  const handlePlaceOrder = () => {
    if (!amount || (orderType === 'limit' && !price)) {
      toast({
        title: "Invalid Order",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      symbol: selectedPair,
      side: orderSide,
      type: orderType,
      amount: parseFloat(amount),
      ...(orderType === 'limit' && { price: parseFloat(price) }),
    };

    placeOrderMutation.mutate(orderData);
  };

  // Calculate order total
  const calculateTotal = () => {
    if (!amount) return "0.00";
    
    if (orderType === 'market') {
      // Use best available price from order book
      const bestPrice = orderSide === 'buy' 
        ? orderBook?.asks[0]?.price || 0
        : orderBook?.bids[0]?.price || 0;
      return (parseFloat(amount) * bestPrice).toFixed(2);
    }
    
    if (!price) return "0.00";
    return (parseFloat(amount) * parseFloat(price)).toFixed(2);
  };

  // Calculate estimated fee
  const calculateFee = () => {
    if (!tradingFees || !amount) return "0.00";
    
    const total = parseFloat(calculateTotal());
    const feeRate = orderType === 'market' ? tradingFees.takerFee : tradingFees.makerFee;
    return (total * feeRate).toFixed(6);
  };

  return (
    <div className="space-y-6">
      {/* Trading Pair Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Enhanced Trading Interface
          </CardTitle>
          <CardDescription>
            Real-time order matching with professional trading features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label>Trading Pair:</Label>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tradingPairs?.map((pair: string) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="ml-auto">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Live Trading
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Placement */}
        <Card>
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Side */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={orderSide === 'buy' ? 'default' : 'outline'}
                onClick={() => setOrderSide('buy')}
                className={orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Buy
              </Button>
              <Button
                variant={orderSide === 'sell' ? 'default' : 'outline'}
                onClick={() => setOrderSide('sell')}
                className={orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Sell
              </Button>
            </div>

            {/* Order Type */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={orderType === 'market' ? 'default' : 'outline'}
                onClick={() => setOrderType('market')}
              >
                Market
              </Button>
              <Button
                variant={orderType === 'limit' ? 'default' : 'outline'}
                onClick={() => setOrderType('limit')}
              >
                Limit
              </Button>
            </div>

            {/* Price Input (for limit orders) */}
            {orderType === 'limit' && (
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Order Summary */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span>{calculateTotal()} {selectedPair.split('/')[1]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Est. Fee:</span>
                <span>{calculateFee()} {selectedPair.split('/')[1]}</span>
              </div>
              {tradingFees && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fee Rate:</span>
                  <span>
                    {orderType === 'market' 
                      ? (tradingFees.takerFee * 100).toFixed(2)
                      : (tradingFees.makerFee * 100).toFixed(2)
                    }%
                  </span>
                </div>
              )}
            </div>

            {/* Place Order Button */}
            <Button
              onClick={handlePlaceOrder}
              disabled={placeOrderMutation.isPending}
              className={`w-full ${
                orderSide === 'buy' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {placeOrderMutation.isPending 
                ? 'Placing Order...' 
                : `${orderSide === 'buy' ? 'Buy' : 'Sell'} ${selectedPair.split('/')[0]}`
              }
            </Button>
          </CardContent>
        </Card>

        {/* Order Book */}
        <Card>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
            <CardDescription>{selectedPair}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Asks (Sell Orders) */}
              <div>
                <h4 className="text-sm font-medium text-red-600 mb-2">Asks</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {orderBook?.asks?.slice(0, 10).reverse().map((ask, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 text-xs">
                      <span className="text-red-600">{ask.price.toFixed(2)}</span>
                      <span>{ask.amount.toFixed(4)}</span>
                      <span className="text-right">{ask.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spread */}
              {orderBook && orderBook.bids[0] && orderBook.asks[0] && (
                <div className="text-center py-2 border-y">
                  <div className="text-xs text-muted-foreground">Spread</div>
                  <div className="text-sm font-medium">
                    {(orderBook.asks[0].price - orderBook.bids[0].price).toFixed(2)}
                  </div>
                </div>
              )}

              {/* Bids (Buy Orders) */}
              <div>
                <h4 className="text-sm font-medium text-green-600 mb-2">Bids</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {orderBook?.bids?.slice(0, 10).map((bid, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 text-xs">
                      <span className="text-green-600">{bid.price.toFixed(2)}</span>
                      <span>{bid.amount.toFixed(4)}</span>
                      <span className="text-right">{bid.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Open Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userOrders && userOrders.length > 0 ? (
                userOrders
                  .filter((order: Order) => order.status === 'open')
                  .map((order: Order) => (
                    <div key={order.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant={order.side === 'buy' ? 'default' : 'secondary'}
                          className={order.side === 'buy' ? 'bg-green-600' : 'bg-red-600'}
                        >
                          {order.side.toUpperCase()} {order.symbol}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelOrderMutation.mutate(order.id)}
                          disabled={cancelOrderMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>{order.amount.toFixed(4)}</span>
                        </div>
                        {order.price && (
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span>{order.price.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Filled:</span>
                          <span>{order.filled.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining:</span>
                          <span>{order.remaining.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No open orders
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {userOrders && userOrders.length > 0 ? (
              userOrders.slice(0, 10).map((order: Order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={order.side === 'buy' ? 'default' : 'secondary'}
                      className={order.side === 'buy' ? 'bg-green-600' : 'bg-red-600'}
                    >
                      {order.side.toUpperCase()}
                    </Badge>
                    <div>
                      <div className="font-medium">{order.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.type.toUpperCase()} • {order.amount.toFixed(4)}
                        {order.price && ` @ ${order.price.toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {order.status === 'filled' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {order.status === 'open' && <Clock className="h-4 w-4 text-blue-600" />}
                      {order.status === 'cancelled' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      <span className="text-sm font-medium capitalize">{order.status}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No orders found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}