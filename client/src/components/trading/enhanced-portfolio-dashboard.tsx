import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Target,
  Shield,
  Zap,
  RefreshCw,
  Settings,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useLiveData } from '@/components/websocket/live-data-provider';

export default function EnhancedPortfolioDashboard() {
  const { prices, isConnected } = useLiveData();
  const [portfolio, setPortfolio] = useState({
    totalValue: 45672.89,
    dayChange: 1234.56,
    dayChangePercent: 2.78,
    assets: [
      { symbol: 'BTC', amount: 0.8, value: 34600, allocation: 75.7 },
      { symbol: 'ETH', amount: 3.2, value: 8500, allocation: 18.6 },
      { symbol: 'SOL', amount: 25, value: 2572, allocation: 5.7 }
    ]
  });

  const [strategies, setStrategies] = useState([
    {
      id: 1,
      name: 'Momentum Trading',
      description: 'Buy high-momentum assets breaking resistance',
      active: true,
      performance: '+18.5%',
      trades: 23,
      winRate: '73%'
    },
    {
      id: 2,
      name: 'Mean Reversion',
      description: 'Buy oversold assets with strong fundamentals',
      active: false,
      performance: '+12.3%',
      trades: 15,
      winRate: '68%'
    },
    {
      id: 3,
      name: 'DCA Strategy',
      description: 'Dollar-cost averaging into top 3 assets',
      active: true,
      performance: '+8.9%',
      trades: 45,
      winRate: '89%'
    }
  ]);

  const [rebalanceRecommendations, setRebalanceRecommendations] = useState([
    {
      action: 'Sell',
      asset: 'BTC',
      amount: '0.1 BTC',
      reason: 'Overweight - reduce to target 70%',
      urgency: 'medium'
    },
    {
      action: 'Buy',
      asset: 'ETH',
      amount: '1.5 ETH',
      reason: 'Underweight - increase to target 25%',
      urgency: 'high'
    }
  ]);

  // Update portfolio values with live prices
  useEffect(() => {
    if (Object.keys(prices).length > 0) {
      setPortfolio(prev => {
        const updatedAssets = prev.assets.map(asset => {
          const priceKey = `${asset.symbol}/USDT`;
          const livePrice = prices[priceKey];
          if (livePrice) {
            const newValue = asset.amount * livePrice.price;
            return { ...asset, value: newValue };
          }
          return asset;
        });

        const newTotalValue = updatedAssets.reduce((sum, asset) => sum + asset.value, 0);
        const dayChange = newTotalValue - prev.totalValue;
        const dayChangePercent = (dayChange / prev.totalValue) * 100;

        return {
          ...prev,
          totalValue: newTotalValue,
          dayChange,
          dayChangePercent,
          assets: updatedAssets.map(asset => ({
            ...asset,
            allocation: (asset.value / newTotalValue) * 100
          }))
        };
      });
    }
  }, [prices]);

  const algorithmicTradingOptions = [
    {
      name: 'Momentum Breakout',
      description: 'Trades breakouts above key resistance levels',
      parameters: { lookback: 20, threshold: 2.5 },
      expectedReturn: '15-25%',
      riskLevel: 'Medium'
    },
    {
      name: 'Mean Reversion',
      description: 'Buys oversold conditions using Bollinger Bands',
      parameters: { period: 20, stdDev: 2 },
      expectedReturn: '8-15%',
      riskLevel: 'Low'
    },
    {
      name: 'Volatility Trading',
      description: 'Capitalizes on volatility expansion/contraction',
      parameters: { volatilityWindow: 14, threshold: 1.5 },
      expectedReturn: '20-35%',
      riskLevel: 'High'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Portfolio Dashboard</h1>
            <p className="text-gray-300">Advanced portfolio management and algorithmic trading</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={isConnected ? 'bg-green-500' : 'bg-red-500'}>
              {isConnected ? 'Live Data' : 'Disconnected'}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Change</p>
                  <p className={`text-2xl font-bold ${portfolio.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolio.dayChange >= 0 ? '+' : ''}${portfolio.dayChange.toFixed(2)}
                  </p>
                </div>
                {portfolio.dayChange >= 0 ? 
                  <TrendingUp className="w-8 h-8 text-green-400" /> : 
                  <TrendingDown className="w-8 h-8 text-red-400" />
                }
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">24h Change %</p>
                  <p className={`text-2xl font-bold ${portfolio.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolio.dayChangePercent >= 0 ? '+' : ''}{portfolio.dayChangePercent.toFixed(2)}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Strategies</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {strategies.filter(s => s.active).length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="strategies">Trading Strategies</TabsTrigger>
            <TabsTrigger value="rebalance">Rebalancing</TabsTrigger>
            <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset Allocation */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-6 h-6 text-blue-400" />
                    <span>Asset Allocation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolio.assets.map((asset, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{asset.symbol}</span>
                          <span className="text-sm text-gray-400">{asset.allocation.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{asset.amount} {asset.symbol}</span>
                          <span>${asset.value.toLocaleString()}</span>
                        </div>
                        <Progress value={asset.allocation} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span>7-Day Return</span>
                      <span className="text-green-400 font-semibold">+12.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span>30-Day Return</span>
                      <span className="text-green-400 font-semibold">+28.3%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span>Max Drawdown</span>
                      <span className="text-red-400 font-semibold">-8.2%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span>Sharpe Ratio</span>
                      <span className="text-blue-400 font-semibold">1.85</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="strategies" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <Badge className={strategy.active ? 'bg-green-500' : 'bg-gray-500'}>
                        {strategy.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{strategy.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Performance:</span>
                        <span className="text-green-400">{strategy.performance}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Trades:</span>
                        <span>{strategy.trades}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Win Rate:</span>
                        <span className="text-blue-400">{strategy.winRate}</span>
                      </div>
                      <Button 
                        variant={strategy.active ? "outline" : "default"}
                        size="sm" 
                        className="w-full"
                      >
                        {strategy.active ? 'Pause' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rebalance" className="mt-6">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RefreshCw className="w-6 h-6 text-purple-400" />
                  <span>Portfolio Rebalancing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rebalanceRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge className={rec.action === 'Buy' ? 'bg-green-500' : 'bg-red-500'}>
                          {rec.action}
                        </Badge>
                        <div>
                          <div className="font-semibold">{rec.asset} - {rec.amount}</div>
                          <div className="text-sm text-gray-400">{rec.reason}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={rec.urgency === 'high' ? 'bg-red-500' : 'bg-yellow-500'}>
                          {rec.urgency}
                        </Badge>
                        <Button size="sm">Execute</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="algorithms" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {algorithmicTradingOptions.map((algo, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">{algo.name}</CardTitle>
                    <p className="text-sm text-gray-400">{algo.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-gray-400">Expected Return: </span>
                        <span className="text-green-400">{algo.expectedReturn}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Risk Level: </span>
                        <span className={`${
                          algo.riskLevel === 'Low' ? 'text-green-400' :
                          algo.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{algo.riskLevel}</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Parameters:</h4>
                        {Object.entries(algo.parameters).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-400">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                      <Button size="sm" className="w-full">
                        <Zap className="w-4 h-4 mr-2" />
                        Deploy Algorithm
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}