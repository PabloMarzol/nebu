import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  Eye,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface PortfolioHolding {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  allocation: number;
  change24h: number;
  avgBuyPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

interface PortfolioMetrics {
  totalValue: number;
  totalChange24h: number;
  totalChange24hPercent: number;
  totalInvested: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPnLPercent: number;
  diversificationScore: number;
  riskScore: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface RiskAnalysis {
  category: string;
  level: "low" | "medium" | "high" | "critical";
  description: string;
  recommendation: string;
}

export default function PortfolioAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M");
  const [selectedTab, setSelectedTab] = useState("overview");

  const holdings: PortfolioHolding[] = [
    {
      symbol: "NEBX",
      name: "NebulaX Token",
      amount: 5000,
      value: 12500,
      allocation: 31.25,
      change24h: 5.2,
      avgBuyPrice: 2.20,
      currentPrice: 2.50,
      unrealizedPnL: 1500,
      unrealizedPnLPercent: 13.64
    },
    {
      symbol: "DCP",
      name: "DeFiChain Protocol",
      amount: 15000,
      value: 9000,
      allocation: 22.5,
      change24h: -2.1,
      avgBuyPrice: 0.65,
      currentPrice: 0.60,
      unrealizedPnL: -750,
      unrealizedPnLPercent: -7.69
    },
    {
      symbol: "HLTH",
      name: "HealthChain",
      amount: 8000,
      value: 8800,
      allocation: 22.0,
      change24h: 3.8,
      avgBuyPrice: 1.00,
      currentPrice: 1.10,
      unrealizedPnL: 800,
      unrealizedPnLPercent: 10.0
    },
    {
      symbol: "AIC",
      name: "AI Computing Chain",
      amount: 2000,
      value: 6000,
      allocation: 15.0,
      change24h: 8.5,
      avgBuyPrice: 2.50,
      currentPrice: 3.00,
      unrealizedPnL: 1000,
      unrealizedPnLPercent: 20.0
    },
    {
      symbol: "SLR",
      name: "SolarCoin",
      amount: 12000,
      value: 3700,
      allocation: 9.25,
      change24h: 1.2,
      avgBuyPrice: 0.35,
      currentPrice: 0.31,
      unrealizedPnL: -480,
      unrealizedPnLPercent: -11.43
    }
  ];

  const metrics: PortfolioMetrics = {
    totalValue: 40000,
    totalChange24h: 1640,
    totalChange24hPercent: 4.27,
    totalInvested: 38000,
    totalUnrealizedPnL: 2070,
    totalUnrealizedPnLPercent: 5.45,
    diversificationScore: 72,
    riskScore: 68,
    sharpeRatio: 1.42,
    maxDrawdown: -15.6
  };

  const riskAnalysis: RiskAnalysis[] = [
    {
      category: "Concentration Risk",
      level: "medium",
      description: "Portfolio is concentrated in top 2 holdings (53.75%)",
      recommendation: "Consider diversifying into additional sectors or assets"
    },
    {
      category: "Sector Exposure",
      level: "medium",
      description: "Heavy exposure to DeFi and AI sectors (69%)",
      recommendation: "Add exposure to traditional sectors for balance"
    },
    {
      category: "Volatility Risk",
      level: "high",
      description: "Portfolio beta indicates high correlation with crypto market",
      recommendation: "Consider adding stable assets or hedging positions"
    },
    {
      category: "Liquidity Risk",
      level: "low",
      description: "All holdings have adequate trading volume",
      recommendation: "Current liquidity levels are satisfactory"
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-400 border-green-400 bg-green-400/10";
      case "medium": return "text-yellow-400 border-yellow-400 bg-yellow-400/10";
      case "high": return "text-orange-400 border-orange-400 bg-orange-400/10";
      case "critical": return "text-red-400 border-red-400 bg-red-400/10";
      default: return "text-gray-400 border-gray-400 bg-gray-400/10";
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Portfolio Analytics
            </span>
          </h2>
          <p className="text-muted-foreground">Advanced insights and performance analysis</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">${metrics.totalValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Portfolio Value</div>
            <div className={`text-sm font-semibold ${getChangeColor(metrics.totalChange24h)}`}>
              {metrics.totalChange24h >= 0 ? '+' : ''}${metrics.totalChange24h.toLocaleString()} 
              ({metrics.totalChange24hPercent >= 0 ? '+' : ''}{metrics.totalChange24hPercent.toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getChangeColor(metrics.totalUnrealizedPnL)}`}>
              {metrics.totalUnrealizedPnL >= 0 ? '+' : ''}${metrics.totalUnrealizedPnL.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Unrealized P&L</div>
            <div className={`text-sm font-semibold ${getChangeColor(metrics.totalUnrealizedPnL)}`}>
              {metrics.totalUnrealizedPnLPercent >= 0 ? '+' : ''}{metrics.totalUnrealizedPnLPercent.toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getScoreColor(metrics.diversificationScore)}`}>
              {metrics.diversificationScore}
            </div>
            <div className="text-sm text-muted-foreground">Diversification Score</div>
            <div className="text-sm text-muted-foreground">
              {metrics.diversificationScore >= 80 ? 'Excellent' : 
               metrics.diversificationScore >= 60 ? 'Good' : 
               metrics.diversificationScore >= 40 ? 'Fair' : 'Poor'}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{metrics.sharpeRatio.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
            <div className="text-sm text-muted-foreground">
              {metrics.sharpeRatio >= 1.5 ? 'Excellent' : 
               metrics.sharpeRatio >= 1.0 ? 'Good' : 
               metrics.sharpeRatio >= 0.5 ? 'Fair' : 'Poor'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Asset Allocation */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-blue-400" />
                <span>Asset Allocation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding, index) => (
                  <div key={holding.symbol} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ 
                            backgroundColor: `hsl(${(index * 360) / holdings.length}, 70%, 50%)` 
                          }}
                        />
                        <span className="font-semibold">{holding.symbol}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{holding.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{holding.allocation.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">
                        ${holding.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Invested:</span>
                  <span className="font-semibold">${metrics.totalInvested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Value:</span>
                  <span className="font-semibold">${metrics.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Return:</span>
                  <span className={`font-semibold ${getChangeColor(metrics.totalUnrealizedPnL)}`}>
                    {metrics.totalUnrealizedPnL >= 0 ? '+' : ''}${metrics.totalUnrealizedPnL.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Drawdown:</span>
                  <span className="font-semibold text-red-400">{metrics.maxDrawdown}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Portfolio Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Diversification</span>
                    <span className="text-sm font-semibold">{metrics.diversificationScore}/100</span>
                  </div>
                  <Progress value={metrics.diversificationScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Risk Level</span>
                    <span className="text-sm font-semibold">{metrics.riskScore}/100</span>
                  </div>
                  <Progress value={metrics.riskScore} className="h-2" />
                </div>
                
                <div className="pt-2">
                  <div className="text-sm font-semibold mb-2">Overall Rating</div>
                  <div className="flex items-center space-x-2">
                    {metrics.diversificationScore >= 70 && metrics.riskScore <= 70 ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-semibold">Healthy Portfolio</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">Needs Attention</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="holdings" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Holdings Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div key={holding.symbol} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{holding.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{holding.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${holding.value.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{holding.allocation.toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Amount</div>
                        <div className="font-semibold">{holding.amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Price</div>
                        <div className="font-semibold">${holding.avgBuyPrice.toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Current Price</div>
                        <div className="font-semibold">${holding.currentPrice.toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">24h Change</div>
                        <div className={`font-semibold ${getChangeColor(holding.change24h)}`}>
                          {holding.change24h >= 0 ? '+' : ''}{holding.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Unrealized P&L:</span>
                        <div className="text-right">
                          <div className={`font-semibold ${getChangeColor(holding.unrealizedPnL)}`}>
                            {holding.unrealizedPnL >= 0 ? '+' : ''}${holding.unrealizedPnL.toLocaleString()}
                          </div>
                          <div className={`text-sm ${getChangeColor(holding.unrealizedPnL)}`}>
                            ({holding.unrealizedPnLPercent >= 0 ? '+' : ''}{holding.unrealizedPnLPercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="space-y-4">
            {riskAnalysis.map((risk, index) => (
              <Card key={index} className={`glass border ${getRiskColor(risk.level)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{risk.category}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                    </div>
                    <Badge className={`${getRiskColor(risk.level)} capitalize`}>
                      {risk.level} Risk
                    </Badge>
                  </div>
                  
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="text-sm font-semibold mb-1">Recommendation:</div>
                    <p className="text-sm text-muted-foreground">{risk.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Timeframe Selector */}
          <div className="flex space-x-2">
            {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((timeframe) => (
              <Button
                key={timeframe}
                size="sm"
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>

          {/* Performance Chart Placeholder */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Performance chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">+{metrics.totalUnrealizedPnLPercent.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">Total Return</div>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{metrics.sharpeRatio.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{metrics.maxDrawdown}%</div>
                <div className="text-sm text-muted-foreground">Max Drawdown</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}