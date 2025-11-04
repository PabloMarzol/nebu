import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, TrendingUp, Settings, Info, X, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface TradingDashboardProps {
  tradingMode: 'spot' | 'futures';
  selectedPair: string;
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

export default function TradingDashboard({ tradingMode, selectedPair }: TradingDashboardProps) {
  const { toast } = useToast();
  const { walletAddress, isAuthenticated } = useWalletAuth();
  const queryClient = useQueryClient();

  // Fetch User Balance
  const { data: userBalance } = useQuery<UserBalance>({
    queryKey: ['/api/hyperliquid/balance', walletAddress],
    enabled: !!walletAddress && isAuthenticated,
    refetchInterval: 5000,
  });

  // Fetch Active Orders
  const { data: activeOrders } = useQuery<any[]>({
    queryKey: ['/api/hyperliquid/orders', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      
      const response = await fetch(`/api/hyperliquid/orders/${walletAddress}`);
      if (!response.ok) {
        console.warn('Failed to fetch orders:', response.status);
        return [];
      }
      return response.json();
    },
    enabled: !!walletAddress && isAuthenticated,
    refetchInterval: 3000,
  });

  // Fetch Open Positions (Futures Only)
  const { data: openPositions } = useQuery<Position[]>({
    queryKey: ['/api/hyperliquid/positions', walletAddress],
    enabled: !!walletAddress && isAuthenticated && tradingMode === 'futures',
    refetchInterval: 3000,
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

  const handleCancelOrder = (orderId: string) => {
    cancelOrderMutation.mutate(orderId);
  };

  return (
    <div className="space-y-4">
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
                          onClick={() => handleCancelOrder(order.id)}
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
