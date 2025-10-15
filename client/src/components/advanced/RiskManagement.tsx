import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  Target, 
  Activity,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface RiskLimit {
  id: string;
  name: string;
  type: 'position' | 'daily' | 'exposure' | 'loss';
  current: number;
  limit: number;
  enabled: boolean;
  status: 'safe' | 'warning' | 'danger';
}

interface StopLossOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  triggerPrice: number;
  stopPrice: number;
  amount: number;
  status: 'active' | 'triggered' | 'cancelled';
  createdAt: Date;
}

export default function RiskManagement() {
  const [autoStopLoss, setAutoStopLoss] = useState(true);
  const [riskBudget, setRiskBudget] = useState('10000');
  const [maxDrawdown, setMaxDrawdown] = useState('5');

  const portfolioMetrics = {
    totalValue: 125847.32,
    dailyPnL: 2847.32,
    maxDrawdown: 3.2,
    sharpeRatio: 1.8,
    beta: 0.9,
    var95: 4850.25
  };

  const riskLimits: RiskLimit[] = [
    {
      id: '1',
      name: 'Daily Trading Limit',
      type: 'daily',
      current: 85000,
      limit: 100000,
      enabled: true,
      status: 'warning'
    },
    {
      id: '2',
      name: 'Position Size Limit',
      type: 'position',
      current: 25000,
      limit: 50000,
      enabled: true,
      status: 'safe'
    },
    {
      id: '3',
      name: 'Crypto Exposure',
      type: 'exposure',
      current: 75,
      limit: 80,
      enabled: true,
      status: 'warning'
    },
    {
      id: '4',
      name: 'Daily Loss Limit',
      type: 'loss',
      current: 1500,
      limit: 5000,
      enabled: true,
      status: 'safe'
    }
  ];

  const stopLossOrders: StopLossOrder[] = [
    {
      id: '1',
      symbol: 'BTC/USDT',
      side: 'sell',
      triggerPrice: 42000,
      stopPrice: 41500,
      amount: 0.5,
      status: 'active',
      createdAt: new Date('2025-06-22T10:30:00Z')
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      side: 'sell',
      triggerPrice: 3200,
      stopPrice: 3150,
      amount: 2.5,
      status: 'active',
      createdAt: new Date('2025-06-22T09:15:00Z')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-500/20 text-green-600';
      case 'warning': return 'bg-yellow-500/20 text-yellow-600';
      case 'danger': return 'bg-red-500/20 text-red-600';
      case 'active': return 'bg-blue-500/20 text-blue-600';
      case 'triggered': return 'bg-orange-500/20 text-orange-600';
      case 'cancelled': return 'bg-gray-500/20 text-gray-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getUtilizationPercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getRiskScore = () => {
    const scores = riskLimits.map(limit => {
      const utilization = getUtilizationPercentage(limit.current, limit.limit);
      if (utilization > 90) return 10;
      if (utilization > 75) return 7;
      if (utilization > 50) return 5;
      return 2;
    });
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-enhanced border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <h3 className="text-2xl font-bold text-red-500">{getRiskScore()}/10</h3>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <h3 className="text-2xl font-bold text-orange-500">{portfolioMetrics.maxDrawdown}%</h3>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">VaR (95%)</p>
                <h3 className="text-2xl font-bold text-blue-500">${portfolioMetrics.var95.toLocaleString()}</h3>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                <h3 className="text-2xl font-bold text-green-500">{portfolioMetrics.sharpeRatio}</h3>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="limits" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="limits">Risk Limits</TabsTrigger>
          <TabsTrigger value="stops">Stop Losses</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="limits" className="space-y-6">
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Active Risk Limits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskLimits.map((limit) => (
                  <div key={limit.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={limit.enabled}
                          onCheckedChange={() => {}}
                        />
                        <div>
                          <h4 className="font-medium">{limit.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {limit.type} limit
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(limit.status)}>
                          {limit.status}
                        </Badge>
                        <div className="text-right">
                          <div className="font-medium">
                            {limit.type === 'exposure' ? `${limit.current}%` : `$${limit.current.toLocaleString()}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            of {limit.type === 'exposure' ? `${limit.limit}%` : `$${limit.limit.toLocaleString()}`}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Utilization</span>
                        <span>{getUtilizationPercentage(limit.current, limit.limit).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={getUtilizationPercentage(limit.current, limit.limit)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stops" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Stop Losses */}
            <div className="lg:col-span-2">
              <Card className="glass-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Active Stop Loss Orders</span>
                    </span>
                    <Badge className="bg-blue-500/20 text-blue-600">
                      {stopLossOrders.filter(order => order.status === 'active').length} Active
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stopLossOrders.map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{order.symbol}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.side.toUpperCase()} {order.amount} at ${order.stopPrice.toLocaleString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Trigger Price</p>
                            <p className="font-medium">${order.triggerPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Stop Price</p>
                            <p className="font-medium">${order.stopPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p className="font-medium">{order.createdAt.toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            Modify
                          </Button>
                          <Button size="sm" variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Create Stop Loss */}
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Create Stop Loss</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trading Pair</label>
                  <Input placeholder="BTC/USDT" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trigger Price</label>
                  <Input type="number" placeholder="42,000" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stop Price</label>
                  <Input type="number" placeholder="41,500" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input type="number" placeholder="0.5" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch checked={autoStopLoss} onCheckedChange={setAutoStopLoss} />
                  <label className="text-sm">Auto Stop Loss</label>
                </div>

                <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600">
                  <Target className="w-4 h-4 mr-2" />
                  Create Stop Loss
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Real-time Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-red-500/10">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium">Daily Limit Warning</p>
                        <p className="text-sm text-muted-foreground">85% of daily trading limit reached</p>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-500/10">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Exposure Warning</p>
                        <p className="text-sm text-muted-foreground">Crypto exposure at 75% of limit</p>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-green-500/10">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Stop Loss Executed</p>
                        <p className="text-sm text-muted-foreground">SOL/USDT stop loss triggered at $102.50</p>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Risk Metrics History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Yesterday's VaR</span>
                    <span className="font-medium">$4,650.32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>7-Day Avg Drawdown</span>
                    <span className="font-medium">2.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Sharpe Ratio</span>
                    <span className="font-medium">1.6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Beta vs Market</span>
                    <span className="font-medium">0.9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Volatility (30d)</span>
                    <span className="font-medium">24.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Risk Management Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Risk Budget (USD)</label>
                    <Input
                      type="number"
                      value={riskBudget}
                      onChange={(e) => setRiskBudget(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Max Drawdown (%)</label>
                    <Input
                      type="number"
                      value={maxDrawdown}
                      onChange={(e) => setMaxDrawdown(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Stop Loss</p>
                      <p className="text-sm text-muted-foreground">Automatically create stop losses</p>
                    </div>
                    <Switch checked={autoStopLoss} onCheckedChange={setAutoStopLoss} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Real-time Alerts</p>
                      <p className="text-sm text-muted-foreground">Get instant notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Portfolio Hedging</p>
                      <p className="text-sm text-muted-foreground">Auto hedge large positions</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600">
                  Save Risk Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}