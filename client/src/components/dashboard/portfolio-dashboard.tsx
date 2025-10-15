import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Activity, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

interface PortfolioData {
  totalValue: number;
  totalChange24h: number;
  totalChangePercentage: number;
  availableBalance: number;
  lockedBalance: number;
  profitLoss: number;
  profitLossPercentage: number;
  assets: Array<{
    symbol: string;
    balance: number;
    value: number;
    change24h: number;
    changePercentage: number;
    allocation: number;
  }>;
  performance: Array<{
    date: string;
    value: number;
    pnl: number;
  }>;
  trades: Array<{
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    amount: number;
    price: number;
    value: number;
    timestamp: string;
    status: string;
  }>;
}

export default function PortfolioDashboard() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '1y'>('24h');

  // Fetch portfolio data
  const { data: portfolio, isLoading, refetch } = useQuery({
    queryKey: ["/api/trading/portfolio"],
    refetchInterval: 30000,
  });

  // Mock data for demonstration
  const mockPortfolio: PortfolioData = {
    totalValue: 45231.89,
    totalChange24h: 2843.67,
    totalChangePercentage: 6.72,
    availableBalance: 42188.23,
    lockedBalance: 3043.66,
    profitLoss: 8947.23,
    profitLossPercentage: 24.67,
    assets: [
      { symbol: 'BTC', balance: 0.7542, value: 50387.65, change24h: 1247.89, changePercentage: 2.54, allocation: 35.2 },
      { symbol: 'ETH', balance: 8.234, value: 28847.12, change24h: 892.34, changePercentage: 3.19, allocation: 28.1 },
      { symbol: 'USDT', balance: 15420.34, value: 15420.34, change24h: 0, changePercentage: 0, allocation: 25.3 },
      { symbol: 'SOL', balance: 45.67, value: 8234.89, change24h: 412.67, changePercentage: 5.27, allocation: 11.4 }
    ],
    performance: [
      { date: '2025-06-14', value: 42388.22, pnl: 1247.89 },
      { date: '2025-06-15', value: 43892.56, pnl: 1504.34 },
      { date: '2025-06-16', value: 44567.89, pnl: 675.33 },
      { date: '2025-06-17', value: 43234.12, pnl: -1333.77 },
      { date: '2025-06-18', value: 44891.23, pnl: 1657.11 },
      { date: '2025-06-19', value: 45892.34, pnl: 1001.11 },
      { date: '2025-06-20', value: 46234.89, pnl: 342.55 },
      { date: '2025-06-21', value: 45231.89, pnl: -1002.99 }
    ],
    trades: [
      { id: '1', symbol: 'BTC/USDT', side: 'buy', amount: 0.1, price: 67420, value: 6742, timestamp: '2025-06-21T10:30:00Z', status: 'completed' },
      { id: '2', symbol: 'ETH/USDT', side: 'sell', amount: 2, price: 3520, value: 7040, timestamp: '2025-06-21T09:15:00Z', status: 'completed' },
      { id: '3', symbol: 'SOL/USDT', side: 'buy', amount: 10, price: 180, value: 1800, timestamp: '2025-06-21T08:45:00Z', status: 'completed' }
    ]
  };

  const data = portfolio || mockPortfolio;
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const pieData = data.assets.map(asset => ({
    name: asset.symbol,
    value: asset.allocation,
    amount: asset.value
  }));

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {data.totalChangePercentage >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={data.totalChangePercentage >= 0 ? "text-green-600" : "text-red-600"}>
                {data.totalChangePercentage >= 0 ? '+' : ''}{data.totalChangePercentage.toFixed(2)}%
              </span>
              <span className="ml-1">from 24h</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.availableBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${data.lockedBalance.toLocaleString()} locked in orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.profitLoss >= 0 ? '+' : ''}${data.profitLoss.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={data.profitLossPercentage >= 0 ? "text-green-600" : "text-red-600"}>
                {data.profitLossPercentage >= 0 ? '+' : ''}{data.profitLossPercentage.toFixed(2)}%
              </span>
              total return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.assets.length}</div>
            <p className="text-xs text-muted-foreground">
              {data.trades.length} trades today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trades">Trade History</TabsTrigger>
          </TabsList>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Value over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Asset Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Holdings</CardTitle>
              <CardDescription>Your current cryptocurrency positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.assets.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {asset.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{asset.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.balance.toFixed(6)} {asset.symbol}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${asset.value.toLocaleString()}</div>
                      <div className="text-sm flex items-center">
                        {asset.changePercentage >= 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                        )}
                        <span className={asset.changePercentage >= 0 ? "text-green-600" : "text-red-600"}>
                          {asset.changePercentage >= 0 ? '+' : ''}{asset.changePercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Allocation</div>
                      <div className="font-medium">{asset.allocation.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily P&L</CardTitle>
                <CardDescription>Profit and loss over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Return</span>
                    <span className={`font-medium ${data.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.profitLossPercentage >= 0 ? '+' : ''}{data.profitLossPercentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">24h Change</span>
                    <span className={`font-medium ${data.totalChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.totalChangePercentage >= 0 ? '+' : ''}{data.totalChangePercentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Win Rate</span>
                    <span className="font-medium text-green-600">67.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sharpe Ratio</span>
                    <span className="font-medium">1.84</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Max Drawdown</span>
                    <span className="font-medium text-red-600">-8.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Your trading history and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.trades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant={trade.side === 'buy' ? 'default' : 'secondary'}
                        className={trade.side === 'buy' ? 'bg-green-600' : 'bg-red-600'}
                      >
                        {trade.side.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="font-medium">{trade.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {trade.amount} @ ${trade.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">${trade.value.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {trade.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="text-sm capitalize">{trade.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}