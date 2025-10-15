import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  Target,
  AlertTriangle,
  Shield,
  Zap,
  DollarSign,
  Activity,
  Calendar
} from "lucide-react";

export default function PortfolioAnalytics() {
  const { toast } = useToast();
  const [portfolio] = useState({
    totalValue: 87654.32,
    change24h: 3567.89,
    changePercent: 4.25,
    assets: [
      { symbol: 'BTC', value: 45000, percentage: 51.3, change: 2.34 },
      { symbol: 'ETH', value: 25000, percentage: 28.5, change: -1.23 },
      { symbol: 'ADA', value: 8000, percentage: 9.1, change: 5.67 },
      { symbol: 'SOL', value: 6000, percentage: 6.8, change: -2.11 },
      { symbol: 'DOT', value: 3654, percentage: 4.2, change: 3.45 }
    ]
  });

  const performanceMetrics = [
    { label: '7-Day Return', value: '+12.34%', trend: 'up', color: 'text-green-400' },
    { label: '30-Day Return', value: '+28.91%', trend: 'up', color: 'text-green-400' },
    { label: 'Win Rate', value: '68.5%', trend: 'neutral', color: 'text-blue-400' },
    { label: 'Sharpe Ratio', value: '1.85', trend: 'up', color: 'text-purple-400' },
    { label: 'Max Drawdown', value: '-8.2%', trend: 'down', color: 'text-red-400' },
    { label: 'Volatility', value: '23.4%', trend: 'neutral', color: 'text-yellow-400' }
  ];

  const riskMetrics = [
    { metric: 'Portfolio Risk Score', value: 7.2, max: 10, status: 'moderate' },
    { metric: 'Diversification Score', value: 6.8, max: 10, status: 'good' },
    { metric: 'Correlation Risk', value: 3.4, max: 10, status: 'low' },
    { metric: 'Liquidity Risk', value: 2.1, max: 10, status: 'low' }
  ];

  const aiInsights = [
    {
      type: 'recommendation',
      icon: <Target className="w-4 h-4" />,
      title: 'Rebalancing Opportunity',
      message: 'Consider reducing BTC exposure (currently 51.3%) and increasing DeFi tokens for better diversification.',
      confidence: '87%'
    },
    {
      type: 'alert',
      icon: <AlertTriangle className="w-4 h-4" />,
      title: 'High Correlation Warning',
      message: 'ETH and SOL showing 0.82 correlation. Consider alternative assets to reduce portfolio risk.',
      confidence: '94%'
    },
    {
      type: 'opportunity',
      icon: <Zap className="w-4 h-4" />,
      title: 'Market Opportunity',
      message: 'Layer 2 tokens showing strong momentum. Consider 5-10% allocation to MATIC or ARB.',
      confidence: '76%'
    }
  ];

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const handleApplyInsight = (insight: any) => {
    console.log(`Apply button clicked for: ${insight.title}`);
    
    toast({
      title: "Applying AI Insight",
      description: `${insight.title} - Executing recommendation with ${insight.confidence} confidence`,
      duration: 3000,
    });

    // Simulate executing the insight
    setTimeout(() => {
      toast({
        title: "Insight Applied Successfully",
        description: `${insight.title} has been applied to your portfolio. Changes will take effect shortly.`,
        duration: 4000,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📊 Portfolio Analytics</h1>
          <p className="text-gray-300">Advanced performance metrics and AI-powered insights</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                ${portfolio.totalValue.toLocaleString()}
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+${portfolio.change24h.toFixed(2)}</span>
                <span className="text-green-400">({portfolio.changePercent.toFixed(2)}%)</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">24h change</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {portfolio.assets.slice(0, 3).map((asset) => (
                  <div key={asset.symbol} className="flex justify-between items-center">
                    <span className="font-semibold">{asset.symbol}</span>
                    <span className="text-blue-400">{asset.percentage}%</span>
                  </div>
                ))}
                <div className="text-sm text-gray-400 mt-2">
                  +{portfolio.assets.length - 3} more assets
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span>Portfolio Risk</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">Moderate</Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <div className="text-sm text-gray-400">
                Score: 7.2/10 - Well diversified with moderate volatility
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">{metric.label}</span>
                      {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                      {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                      {metric.trend === 'neutral' && <Activity className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mt-6">
              <CardHeader>
                <CardTitle>Performance Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                  <BarChart3 className="w-16 h-16 text-blue-400 opacity-50" />
                  <div className="ml-4 text-center">
                    <p className="text-lg font-semibold">Interactive Chart</p>
                    <p className="text-gray-400">Portfolio performance over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allocation" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Asset Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolio.assets.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">{asset.symbol.slice(0, 2)}</span>
                          </div>
                          <div>
                            <div className="font-semibold">{asset.symbol}</div>
                            <div className="text-sm text-gray-400">${asset.value.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{asset.percentage}%</div>
                          <div className={`text-sm ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Allocation Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
                    <PieChart className="w-16 h-16 text-purple-400 opacity-50" />
                    <div className="ml-4 text-center">
                      <p className="text-lg font-semibold">Portfolio Pie Chart</p>
                      <p className="text-gray-400">Visual asset distribution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {riskMetrics.map((risk, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold">{risk.metric}</span>
                      <Badge className={`${getRiskColor(risk.status)} bg-transparent border`}>
                        {risk.status}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Score</span>
                        <span>{risk.value}/{risk.max}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            risk.status === 'low' ? 'bg-green-400' :
                            risk.status === 'moderate' ? 'bg-yellow-400' :
                            risk.status === 'high' ? 'bg-red-400' : 'bg-blue-400'
                          }`}
                          style={{ width: `${(risk.value / risk.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <div className="space-y-6">
              {aiInsights.map((insight, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          insight.type === 'recommendation' ? 'bg-blue-500/20' :
                          insight.type === 'alert' ? 'bg-red-500/20' :
                          'bg-green-500/20'
                        }`}>
                          {insight.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant="outline" className="mt-1">
                            Confidence: {insight.confidence}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleApplyInsight(insight)}
                        className="hover:bg-purple-500/20 hover:border-purple-400 transition-colors"
                      >
                        Apply
                      </Button>
                    </div>
                    <p className="text-gray-300">{insight.message}</p>
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