import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

interface TradeRecord {
  id: string;
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  amount: number;
  price: number;
  fillPrice: number;
  value: number;
  fee: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  timestamp: string;
  executionTime: string;
  profit?: number;
  profitPercentage?: number;
}

interface OrderRecord {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  amount: number;
  price?: number;
  filled: number;
  remaining: number;
  status: 'pending' | 'open' | 'filled' | 'cancelled' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export default function TradeHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [symbolFilter, setSymbolFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");

  // Fetch trade history
  const { data: trades, isLoading: tradesLoading, refetch: refetchTrades } = useQuery({
    queryKey: ["/api/trading/trades"],
    refetchInterval: 30000,
  });

  // Fetch order history
  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ["/api/trading/orders"],
    refetchInterval: 30000,
  });

  // Mock data for demonstration
  const mockTrades: TradeRecord[] = [
    {
      id: 'trade_001',
      orderId: 'ord_001',
      symbol: 'BTC/USDT',
      side: 'buy',
      type: 'limit',
      amount: 0.1,
      price: 67000,
      fillPrice: 66980,
      value: 6698,
      fee: 6.698,
      status: 'filled',
      timestamp: '2025-06-21T10:30:00Z',
      executionTime: '2025-06-21T10:30:15Z',
      profit: 420,
      profitPercentage: 6.27
    },
    {
      id: 'trade_002',
      orderId: 'ord_002',
      symbol: 'ETH/USDT',
      side: 'sell',
      type: 'market',
      amount: 2,
      price: 3520,
      fillPrice: 3515,
      value: 7030,
      fee: 14.06,
      status: 'filled',
      timestamp: '2025-06-21T09:15:00Z',
      executionTime: '2025-06-21T09:15:02Z',
      profit: -150,
      profitPercentage: -2.13
    },
    {
      id: 'trade_003',
      orderId: 'ord_003',
      symbol: 'SOL/USDT',
      side: 'buy',
      type: 'limit',
      amount: 10,
      price: 180,
      fillPrice: 179.5,
      value: 1795,
      fee: 1.795,
      status: 'filled',
      timestamp: '2025-06-21T08:45:00Z',
      executionTime: '2025-06-21T08:45:30Z',
      profit: 85,
      profitPercentage: 4.74
    }
  ];

  const mockOrders: OrderRecord[] = [
    {
      id: 'ord_004',
      symbol: 'BTC/USDT',
      side: 'buy',
      type: 'limit',
      amount: 0.05,
      price: 66000,
      filled: 0,
      remaining: 0.05,
      status: 'open',
      createdAt: '2025-06-21T11:00:00Z',
      updatedAt: '2025-06-21T11:00:00Z'
    },
    {
      id: 'ord_005',
      symbol: 'ETH/USDT',
      side: 'sell',
      type: 'limit',
      amount: 1,
      price: 3600,
      filled: 0,
      remaining: 1,
      status: 'open',
      createdAt: '2025-06-21T10:45:00Z',
      updatedAt: '2025-06-21T10:45:00Z'
    }
  ];

  const tradeData = trades || mockTrades;
  const orderData = orders || mockOrders;

  // Filter functions
  const filteredTrades = tradeData.filter(trade => {
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trade.status === statusFilter;
    const matchesSymbol = symbolFilter === 'all' || trade.symbol === symbolFilter;
    return matchesSearch && matchesStatus && matchesSymbol;
  });

  const filteredOrders = orderData.filter(order => {
    const matchesSearch = order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSymbol = symbolFilter === 'all' || order.symbol === symbolFilter;
    return matchesSearch && matchesStatus && matchesSymbol;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filled':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
      case 'open':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
      case 'open':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const exportData = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Trade & Order History
          </CardTitle>
          <CardDescription>
            Complete history of your trading activity and order management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by symbol or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="filled">Filled</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={symbolFilter} onValueChange={setSymbolFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pairs</SelectItem>
                <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="trades" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="trades">Trade History</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <Button size="sm" variant="outline" onClick={() => exportData(filteredTrades, 'trade-history.csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <TabsContent value="trades" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Executed Trades</CardTitle>
              <CardDescription>
                Complete history of your executed trades with P&L information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(trade.status)}
                        <Badge 
                          variant={trade.side === 'buy' ? 'default' : 'secondary'}
                          className={trade.side === 'buy' ? 'bg-green-600' : 'bg-red-600'}
                        >
                          {trade.side.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium">{trade.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {trade.type.toUpperCase()} • {trade.amount} @ ${trade.fillPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${trade.value.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        Fee: ${trade.fee.toFixed(2)}
                      </div>
                    </div>
                    
                    {trade.profit !== undefined && (
                      <div className="text-right">
                        <div className={`font-medium ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </div>
                        <div className={`text-sm ${trade.profitPercentage && trade.profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.profitPercentage && trade.profitPercentage >= 0 ? '+' : ''}{trade.profitPercentage?.toFixed(2)}%
                        </div>
                      </div>
                    )}
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(trade.status)}>
                        {trade.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(trade.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredTrades.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No Trades Found</h3>
                    <p className="text-sm">
                      {searchTerm || statusFilter !== 'all' || symbolFilter !== 'all' 
                        ? 'Try adjusting your filters to see more results.' 
                        : 'Start trading to see your trade history here.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                All your orders including open, cancelled, and filled orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <Badge 
                          variant={order.side === 'buy' ? 'default' : 'secondary'}
                          className={order.side === 'buy' ? 'bg-green-600' : 'bg-red-600'}
                        >
                          {order.side.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium">{order.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.type.toUpperCase()} • {order.amount}
                          {order.price && ` @ $${order.price.toLocaleString()}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        {order.filled.toFixed(6)} / {order.amount.toFixed(6)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Filled / Total
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        {order.remaining.toFixed(6)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Remaining
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">No Orders Found</h3>
                    <p className="text-sm">
                      {searchTerm || statusFilter !== 'all' || symbolFilter !== 'all' 
                        ? 'Try adjusting your filters to see more results.' 
                        : 'Place your first order to see your order history here.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tradeData.length}</div>
                <p className="text-xs text-muted-foreground">
                  {tradeData.filter(t => t.status === 'filled').length} filled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trading Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${tradeData.reduce((sum, trade) => sum + trade.value, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total volume traded
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">67.3%</div>
                <p className="text-xs text-muted-foreground">
                  Profitable trades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${tradeData.reduce((sum, trade) => sum + trade.fee, 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trading fees paid
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}