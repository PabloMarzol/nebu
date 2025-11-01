import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  RefreshCw, 
  History, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RecoveryStatus from './RecoveryStatus';

interface RecoveryDashboardProps {
  userId?: string;
}

interface RecoveryOrder {
  id: string;
  paymentIntentId: string;
  fiatAmount: number;
  fiatCurrency: string;
  targetToken: string;
  targetTokenAmount: number;
  status: string;
  createdAt: string;
  destinationWallet: string;
  canRecover: boolean;
  errorMessage?: string;
  recoveryAction?: string;
}

export default function RecoveryDashboard({ userId }: RecoveryDashboardProps) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<RecoveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchRecoveryOrders();
  }, []);

  const fetchRecoveryOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/recovery/pending-orders', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data.orders);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Failed to fetch recovery orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch recovery orders",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.paymentIntentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.targetToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string, canRecover: boolean) => {
    if (canRecover) {
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Needs Recovery</Badge>;
    }
    
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>;
      case 'PROCESSING':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Processing</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
    }
  };

  const handleExportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      totalOrders: orders.length,
      needsRecovery: orders.filter(o => o.canRecover).length,
      completed: orders.filter(o => o.status === 'COMPLETED').length,
      orders: filteredOrders
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovery-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Recovery report has been downloaded",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading Recovery Dashboard</h2>
          <p className="text-muted-foreground">Fetching your recovery orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-6 h-6 text-blue-400" />
              <span>Recovery Dashboard</span>
              <Badge variant="outline" className="ml-auto">
                {orders.length} Orders
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{orders.length}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">{orders.filter(o => o.canRecover).length}</div>
                <div className="text-sm text-muted-foreground">Need Recovery</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{orders.filter(o => o.status === 'COMPLETED').length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">{orders.filter(o => o.status === 'FAILED').length}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Actions */}
        <Card className="glass border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium">Search Orders</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by Payment ID, Token, or Status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={fetchRecoveryOrders} variant="outline" className="border-slate-600 hover:bg-slate-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={handleExportReport} variant="outline" className="border-slate-600 hover:bg-slate-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="glass border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recovery Orders</span>
              <Badge variant="outline">{filteredOrders.length} of {orders.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No orders match your search criteria' : 'No recovery orders found'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">
                            {order.paymentIntentId.slice(0, 8)}...
                          </span>
                          {getStatusBadge(order.status, order.canRecover)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Amount</div>
                        <div className="text-white font-medium">
                          {order.fiatAmount} {order.fiatCurrency}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Expected Output</div>
                        <div className="text-white font-medium">
                          {order.targetTokenAmount} {order.targetToken}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Destination</div>
                        <div className="font-mono text-xs">
                          {order.destinationWallet.slice(0, 6)}...{order.destinationWallet.slice(-4)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Status</div>
                        <div className="text-white">{order.status}</div>
                      </div>
                    </div>

                    {order.errorMessage && (
                      <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-red-300">
                            <p className="font-medium">Error Details</p>
                            <p>{order.errorMessage}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedOrder === order.id && (
                      <div className="mt-4 pt-4 border-t border-slate-600">
                        <RecoveryStatus 
                          orderId={order.id}
                          onRecoveryComplete={() => {
                            toast({
                              title: "Recovery Complete!",
                              description: "Order has been successfully recovered",
                            });
                            fetchRecoveryOrders();
                            setSelectedOrder(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
