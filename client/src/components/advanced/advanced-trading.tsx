import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  Settings,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AdvancedOrder {
  id: string;
  type: 'stop_loss' | 'take_profit' | 'trailing_stop' | 'iceberg' | 'twap' | 'oco';
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  status: 'pending' | 'active' | 'filled' | 'cancelled' | 'expired';
  triggerPrice?: number;
  trailAmount?: number;
  trailPercent?: number;
  visibleSize?: number;
  duration?: number;
  intervals?: number;
  stopPrice?: number;
  limitPrice?: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const ORDER_TYPES = [
  { value: 'stop_loss', label: 'Stop Loss', icon: TrendingDown, description: 'Limit losses with automatic sell orders' },
  { value: 'take_profit', label: 'Take Profit', icon: TrendingUp, description: 'Lock in profits automatically' },
  { value: 'trailing_stop', label: 'Trailing Stop', icon: Target, description: 'Dynamic stop that follows price movement' },
  { value: 'iceberg', label: 'Iceberg', icon: BarChart3, description: 'Hide large orders by showing small portions' },
  { value: 'twap', label: 'TWAP', icon: Clock, description: 'Time-weighted average price execution' },
  { value: 'oco', label: 'OCO', icon: Settings, description: 'One-cancels-other order combination' }
];

const TRADING_PAIRS = [
  'BTC/USDT', 'ETH/USDT', 'ETH/BTC', 'SOL/USDT', 'ADA/USDT', 
  'DOT/USDT', 'LINK/USDT', 'UNI/USDT', 'AAVE/USDT', 'MATIC/USDT'
];

export default function AdvancedTrading() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [orderType, setOrderType] = useState<string>('stop_loss');
  const [formData, setFormData] = useState({
    symbol: 'BTC/USDT',
    side: 'sell',
    amount: '',
    triggerPrice: '',
    trailAmount: '',
    trailPercent: '',
    visibleSize: '',
    duration: '60',
    intervals: '12',
    stopPrice: '',
    limitPrice: ''
  });

  const { data: userOrders, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['/api/advanced-orders'],
    retry: false
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest('POST', '/api/advanced-orders', orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Created",
        description: "Advanced order has been placed successfully.",
      });
      setFormData({
        symbol: 'BTC/USDT',
        side: 'sell',
        amount: '',
        triggerPrice: '',
        trailAmount: '',
        trailPercent: '',
        visibleSize: '',
        duration: '60',
        intervals: '12',
        stopPrice: '',
        limitPrice: ''
      });
      refetchOrders();
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: "Failed to create advanced order.",
        variant: "destructive",
      });
    }
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return await apiRequest('DELETE', `/api/advanced-orders/${orderId}`);
    },
    onSuccess: () => {
      toast({
        title: "Order Cancelled",
        description: "Order has been cancelled successfully.",
      });
      refetchOrders();
    },
    onError: (error) => {
      toast({
        title: "Cancel Failed",
        description: "Failed to cancel order.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.symbol) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      type: orderType,
      symbol: formData.symbol,
      side: formData.side,
      amount: parseFloat(formData.amount),
      ...(orderType === 'stop_loss' || orderType === 'take_profit' ? {
        triggerPrice: parseFloat(formData.triggerPrice)
      } : {}),
      ...(orderType === 'trailing_stop' ? {
        trailAmount: formData.trailAmount ? parseFloat(formData.trailAmount) : undefined,
        trailPercent: formData.trailPercent ? parseFloat(formData.trailPercent) : undefined
      } : {}),
      ...(orderType === 'iceberg' ? {
        visibleSize: parseFloat(formData.visibleSize)
      } : {}),
      ...(orderType === 'twap' ? {
        duration: parseInt(formData.duration),
        intervals: parseInt(formData.intervals)
      } : {}),
      ...(orderType === 'oco' ? {
        stopPrice: parseFloat(formData.stopPrice),
        limitPrice: parseFloat(formData.limitPrice)
      } : {})
    };

    createOrderMutation.mutate(orderData);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'filled': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'expired': return 'outline';
      default: return 'secondary';
    }
  };

  const renderOrderTypeFields = () => {
    switch (orderType) {
      case 'stop_loss':
      case 'take_profit':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="triggerPrice">Trigger Price</Label>
              <Input
                id="triggerPrice"
                type="number"
                step="0.01"
                value={formData.triggerPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, triggerPrice: e.target.value }))}
                placeholder="Enter trigger price"
              />
            </div>
          </div>
        );

      case 'trailing_stop':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trailAmount">Trail Amount (Optional)</Label>
              <Input
                id="trailAmount"
                type="number"
                step="0.01"
                value={formData.trailAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, trailAmount: e.target.value }))}
                placeholder="Trail by fixed amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailPercent">Trail Percentage</Label>
              <Input
                id="trailPercent"
                type="number"
                step="0.1"
                value={formData.trailPercent}
                onChange={(e) => setFormData(prev => ({ ...prev, trailPercent: e.target.value }))}
                placeholder="Trail by percentage"
              />
            </div>
          </div>
        );

      case 'iceberg':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="visibleSize">Visible Size</Label>
              <Input
                id="visibleSize"
                type="number"
                step="0.01"
                value={formData.visibleSize}
                onChange={(e) => setFormData(prev => ({ ...prev, visibleSize: e.target.value }))}
                placeholder="Amount to show in order book"
              />
            </div>
          </div>
        );

      case 'twap':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="Execution duration"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intervals">Number of Intervals</Label>
              <Input
                id="intervals"
                type="number"
                value={formData.intervals}
                onChange={(e) => setFormData(prev => ({ ...prev, intervals: e.target.value }))}
                placeholder="Number of equal intervals"
              />
            </div>
          </div>
        );

      case 'oco':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stopPrice">Stop Price</Label>
              <Input
                id="stopPrice"
                type="number"
                step="0.01"
                value={formData.stopPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, stopPrice: e.target.value }))}
                placeholder="Stop loss price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limitPrice">Limit Price</Label>
              <Input
                id="limitPrice"
                type="number"
                step="0.01"
                value={formData.limitPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, limitPrice: e.target.value }))}
                placeholder="Take profit price"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Advanced Trading</h2>
        <p className="text-muted-foreground">Professional order types and execution strategies</p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Order</TabsTrigger>
          <TabsTrigger value="orders">Active Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ORDER_TYPES.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card 
                  key={type.value}
                  className={`cursor-pointer transition-all ${
                    orderType === type.value ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setOrderType(type.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {ORDER_TYPES.find(t => t.value === orderType)?.label} Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Trading Pair</Label>
                    <Select value={formData.symbol} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, symbol: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRADING_PAIRS.map(pair => (
                          <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="side">Side</Label>
                    <Select value={formData.side} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, side: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                </div>

                {renderOrderTypeFields()}

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? 'Creating Order...' : 'Create Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Advanced Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {(!userOrders || (Array.isArray(userOrders) && userOrders.length === 0)) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No active advanced orders
                    </div>
                  ) : (
                    (Array.isArray(userOrders) ? userOrders : []).map((order: AdvancedOrder) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                          <div>
                            <div className="font-medium">
                              {order.type.replace('_', ' ').toUpperCase()} - {order.symbol}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.side.toUpperCase()} {order.amount} 
                              {order.triggerPrice && ` @ ${order.triggerPrice}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(order.status === 'pending' || order.status === 'active') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelOrderMutation.mutate(order.id)}
                              disabled={cancelOrderMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}