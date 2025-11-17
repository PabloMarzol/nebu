import React, { useState, useEffect } from 'react';
import { useWalletAuth } from '../../hooks/useWalletAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OrderData {
  orderId: string;
  status: string;
  fiatAmount: number;
  cryptoAmount?: number;
  cryptoCurrency: string;
  network: string;
  walletAddress: string;
  onrampOrderId?: string;
  createdAt: string;
  completedAt?: string;
}

interface OnRampMoneyStatusProps {
  orderId?: string; // If provided, shows specific order
  showHistory?: boolean; // If true, shows user's order history
}

const OnRampMoneyStatus: React.FC<OnRampMoneyStatusProps> = ({
  orderId,
  showHistory = true
}) => {
  const { isAuthenticated } = useWalletAuth();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [pollingEnabled, setPollingEnabled] = useState<boolean>(false);

  // Fetch specific order or order history
  useEffect(() => {
    if (!isAuthenticated) return;

    if (orderId) {
      fetchOrderStatus(orderId);
    } else if (showHistory) {
      fetchOrderHistory();
    }
  }, [isAuthenticated, orderId, showHistory]);

  // Polling mechanism for pending orders
  useEffect(() => {
    if (!isAuthenticated || !pollingEnabled) return;

    // Check if there are any pending orders
    const hasPendingOrders = order?.status === 'pending' || orders.some(o => o.status === 'pending');

    if (!hasPendingOrders) {
      return;
    }

    // Poll every 10 seconds for pending orders
    const pollInterval = setInterval(async () => {
      if (order?.status === 'pending' && orderId) {
        await fetchOrderStatus(orderId, true); // Silent fetch (no loading state)
      } else if (orders.some(o => o.status === 'pending')) {
        await fetchOrderHistory(true); // Silent fetch (no loading state)
      }
    }, 10000); // 10 seconds

    return () => clearInterval(pollInterval);
  }, [isAuthenticated, pollingEnabled, order?.status, orderId, orders]);

  // Enable polling after initial load
  useEffect(() => {
    if (order || orders.length > 0) {
      setPollingEnabled(true);
    }
  }, [order, orders]);

  // Fetch specific order status
  const fetchOrderStatus = async (id: string, silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await fetch(`/api/onramp-money/order/${id}`, {
        credentials: 'include' // Include session cookie for authentication
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch order status');
      }

      setOrder(data.data);
    } catch (err: any) {
      console.error('Failed to fetch order status:', err);
      if (!silent) {
        setError(err.message || 'Failed to fetch order status');
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Fetch user's order history
  const fetchOrderHistory = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await fetch('/api/onramp-money/orders?limit=10', {
        credentials: 'include' // Include session cookie for authentication
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch order history');
      }

      // Extract data from success responses
      setOrders(data.data.filter((o: any) => o.success).map((o: any) => o.data));
    } catch (err: any) {
      console.error('Failed to fetch order history:', err);
      if (!silent) {
        setError(err.message || 'Failed to fetch order history');
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Refresh order status
  const handleRefresh = async () => {
    setRefreshing(true);
    if (orderId) {
      await fetchOrderStatus(orderId);
    } else {
      await fetchOrderHistory();
    }
    setRefreshing(false);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
      case 'expired':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Render single order details
  const renderOrderDetails = (orderData: OrderData) => (
    <div className="space-y-4">
      {/* Status */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Status</span>
        <div className="flex items-center gap-2">
          {getStatusBadge(orderData.status)}
          {orderData.status === 'pending' && pollingEnabled && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Auto-refreshing
            </span>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Amount Paid</span>
        <span className="text-base font-semibold">
          {orderData.fiatAmount.toFixed(2)}
        </span>
      </div>

      {/* Crypto Received */}
      {orderData.cryptoAmount && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Crypto Received</span>
          <span className="text-base font-semibold text-green-400">
            {orderData.cryptoAmount.toFixed(6)} {orderData.cryptoCurrency.toUpperCase()}
          </span>
        </div>
      )}

      {/* Network */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Network</span>
        <Badge variant="outline">{orderData.network.toUpperCase()}</Badge>
      </div>

      {/* Wallet Address */}
      <div className="space-y-1">
        <span className="text-sm text-muted-foreground">Destination Wallet</span>
        <div className="font-mono text-xs bg-slate-800/50 p-2 rounded border border-slate-700 truncate">
          {orderData.walletAddress}
        </div>
      </div>

      {/* Timestamps */}
      <div className="pt-3 border-t border-slate-700 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Created</span>
          <span>{formatDate(orderData.createdAt)}</span>
        </div>
        {orderData.completedAt && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completed</span>
            <span>{formatDate(orderData.completedAt)}</span>
          </div>
        )}
      </div>

      {/* OnRamp Order ID */}
      {orderData.onrampOrderId && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">OnRamp Order ID</span>
          <div className="font-mono text-xs bg-slate-800/50 p-2 rounded border border-slate-700">
            {orderData.onrampOrderId}
          </div>
        </div>
      )}
    </div>
  );

  // Render order history list
  const renderOrderHistory = () => (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No orders yet</p>
          <p className="text-xs mt-1">Your OnRamp Money orders will appear here</p>
        </div>
      ) : (
        orders.map((orderItem) => (
          <Card
            key={orderItem.orderId}
            className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-colors cursor-pointer"
            onClick={() => setOrder(orderItem)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                {getStatusBadge(orderItem.status)}
                <span className="text-xs text-muted-foreground">
                  {formatDate(orderItem.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">
                    {orderItem.fiatAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {orderItem.cryptoAmount
                      ? `${orderItem.cryptoAmount.toFixed(6)} ${orderItem.cryptoCurrency.toUpperCase()}`
                      : `to ${orderItem.cryptoCurrency.toUpperCase()}`}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Alert>
        <AlertDescription>
          Connect your wallet to view order status
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {order ? 'Order Details' : 'Order History'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : order ? (
          <div>
            {renderOrderDetails(order)}
            {showHistory && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-4"
                onClick={() => setOrder(null)}
              >
                Back to History
              </Button>
            )}
          </div>
        ) : (
          renderOrderHistory()
        )}
      </CardContent>
    </Card>
  );
};

export default OnRampMoneyStatus;
