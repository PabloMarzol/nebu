import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  Target, 
  Shield, 
  Zap,
  DollarSign,
  Activity,
  AlertTriangle
} from "lucide-react";

interface PortfolioHolding {
  symbol: string;
  amount: number;
  value: number;
  percentage: number;
  change24h: number;
  avgBuyPrice: number;
  currentPrice: number;
}

interface RiskMetric {
  name: string;
  value: number;
  status: 'low' | 'medium' | 'high';
  description: string;
}

export default function PortfolioAnalytics() {
  const [timeframe, setTimeframe] = useState('7d');

  // Mock portfolio data
  const portfolioValue = 125847.32;
  const totalPnL = 15847.32;
  const totalPnLPercent = 14.41;

  const holdings: PortfolioHolding[] = [
    {
      symbol: 'BTC',
      amount: 2.5432,
      value: 109876.54,
      percentage: 65.2,
      change24h: 2.34,
      avgBuyPrice: 41250.00,
      currentPrice: 43251.25
    },
    {
      symbol: 'ETH',
      amount: 8.7654,
      value: 28934.21,
      percentage: 17.2,
      change24h: -1.23,
      avgBuyPrice: 3180.50,
      currentPrice: 3301.75
    },
    {
      symbol: 'SOL',
      amount: 125.43,
      value: 12876.45,
      percentage: 7.6,
      change24h: 5.67,
      avgBuyPrice: 98.50,
      currentPrice: 102.65
    },
    {
      symbol: 'LINK',
      amount: 890.12,
      value: 15234.87,
      percentage: 9.0,
      change24h: -0.89,
      avgBuyPrice: 16.85,
      currentPrice: 17.11
    },
    {
      symbol: 'DOT',
      amount: 456.78,
      value: 2925.25,
      percentage: 1.0,
      change24h: 3.21,
      avgBuyPrice: 6.12,
      currentPrice: 6.40
    }
  ];

  const riskMetrics: RiskMetric[] = [
    {
      name: 'Portfolio Volatility',
      value: 68,
      status: 'medium',
      description: 'Expected price variation based on historical data'
    },
    {
      name: 'Concentration Risk',
      value: 85,
      status: 'high',
      description: 'Risk from holding too much of single assets'
    },
    {
      name: 'Correlation Risk',
      value: 42,
      status: 'low',
      description: 'Risk from assets moving in same direction'
    },
    {
      name: 'Liquidity Risk',
      value: 25,
      status: 'low',
      description: 'Risk of not being able to exit positions quickly'
    }
  ];

  const performanceData = [
    { period: '1D', return: 2.34, benchmark: 1.89 },
    { period: '7D', return: 8.92, benchmark: 6.45 },
    { period: '30D', return: 15.67, benchmark: 12.34 },
    { period: '90D', return: 28.91, benchmark: 22.45 },
    { period: '1Y', return: 145.23, benchmark: 98.76 }
  ];

  const getRiskColor = (status: 'low' | 'medium' | 'high') => {
    switch (status) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
    }
  };

  const getRiskBadgeColor = (status: 'low' | 'medium' | 'high') => {
    switch (status) {
      case 'low': return 'bg-green-500/20 text-green-600';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600';
      case 'high': return 'bg-red-500/20 text-red-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-enhanced border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <h3 className="text-2xl font-bold">${portfolioValue.toLocaleString()}</h3>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <h3 className="text-2xl font-bold text-green-500">+${totalPnL.toLocaleString()}</h3>
                <p className="text-sm text-green-500">+{totalPnLPercent}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">24h Change</p>
                <h3 className="text-2xl font-bold text-green-500">+$2,847.32</h3>
                <p className="text-sm text-green-500">+2.31%</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <h3 className="text-2xl font-bold text-orange-500">6.8/10</h3>
                <p className="text-sm text-orange-500">Medium Risk</p>
              </div>
              <Shield className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="holdings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-6">
          {/* Asset Allocation */}
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Asset Allocation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div key={holding.symbol} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {holding.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{holding.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding.amount.toFixed(4)} {holding.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${holding.value.toLocaleString()}</div>
                        <div className={`text-sm ${holding.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {holding.change24h >= 0 ? '+' : ''}{holding.change24h}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={holding.percentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground w-12">
                        {holding.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Performance vs Benchmark</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((data) => (
                  <div key={data.period} className="grid grid-cols-4 gap-4 items-center">
                    <div className="font-medium">{data.period}</div>
                    <div className="text-right">
                      <div className="text-green-500 font-medium">+{data.return}%</div>
                      <div className="text-xs text-muted-foreground">Portfolio</div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-500 font-medium">+{data.benchmark}%</div>
                      <div className="text-xs text-muted-foreground">Benchmark</div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/20 text-green-600">
                        +{(data.return - data.benchmark).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Risk Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {riskMetrics.map((metric) => (
                  <div key={metric.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{metric.name}</h4>
                      <Badge className={getRiskBadgeColor(metric.status)}>
                        {metric.status.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{metric.description}</span>
                      <span className={`font-medium ${getRiskColor(metric.status)}`}>
                        {metric.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>AI-Powered Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-500">Diversification Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  Your portfolio is heavily concentrated in Bitcoin (65.2%). Consider reducing exposure and adding more DeFi tokens for better diversification.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-green-500">Strong Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Your portfolio has outperformed the market benchmark by 46.47% over the past year. Your SOL position has been a major contributor.
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-yellow-500">Rebalancing Suggestion</h4>
                <p className="text-sm text-muted-foreground">
                  Consider taking profits on BTC and increasing your altcoin allocation. Market sentiment suggests alt season may be approaching.
                </p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-red-500">Risk Alert</h4>
                <p className="text-sm text-muted-foreground">
                  High concentration risk detected. Your top 2 holdings represent 82.4% of your portfolio value. Consider gradual diversification.
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <Target className="w-4 h-4 mr-2" />
                  Get Personalized Recommendations
                </Button>
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Contact Portfolio Manager
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}