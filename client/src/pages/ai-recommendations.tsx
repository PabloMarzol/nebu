import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Zap,
  Star,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Clock,
  ArrowRight,
  Activity,
  DollarSign,
  Shield
} from "lucide-react";

export default function AIRecommendationsPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      type: 'buy',
      asset: 'BTC',
      confidence: 87,
      reasoning: 'Strong technical indicators suggest upward momentum. RSI indicates oversold conditions with high volume support.',
      targetPrice: 45500,
      currentPrice: 43250,
      timeframe: '7-14 days',
      riskLevel: 'medium',
      potentialGain: 5.2,
      stopLoss: 41800,
      aiScore: 8.7,
      signals: ['Golden Cross', 'Volume Surge', 'Support Bounce'],
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'sell',
      asset: 'DOGE',
      confidence: 72,
      reasoning: 'Overbought conditions detected with weakening momentum. Consider taking profits at current resistance levels.',
      targetPrice: 0.085,
      currentPrice: 0.092,
      timeframe: '3-5 days',
      riskLevel: 'high',
      potentialGain: -7.6,
      stopLoss: 0.095,
      aiScore: 7.2,
      signals: ['Overbought RSI', 'Resistance Level', 'Profit Taking'],
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      type: 'hold',
      asset: 'ETH',
      confidence: 91,
      reasoning: 'Consolidation phase with strong fundamentals. Perfect accumulation opportunity with DCA strategy recommended.',
      targetPrice: 2850,
      currentPrice: 2654,
      timeframe: '2-4 weeks',
      riskLevel: 'low',
      potentialGain: 7.4,
      stopLoss: 2500,
      aiScore: 9.1,
      signals: ['Strong Fundamentals', 'Accumulation Zone', 'DCA Opportunity'],
      timestamp: '1 hour ago'
    }
  ]);

  const portfolioInsights = [
    {
      type: 'rebalance',
      title: 'Portfolio Rebalancing Opportunity',
      description: 'Your BTC allocation is 51.3% - consider reducing to 40% for better diversification',
      confidence: 89,
      impact: 'Medium',
      action: 'Reduce BTC by 11.3%'
    },
    {
      type: 'opportunity',
      title: 'Layer 2 Growth Potential',
      description: 'L2 tokens showing strong momentum - consider 5-10% allocation to MATIC or ARB',
      confidence: 76,
      impact: 'High',
      action: 'Allocate to L2 tokens'
    },
    {
      type: 'warning',
      title: 'High Correlation Risk',
      description: 'ETH and SOL showing 0.82 correlation - diversify to reduce portfolio risk',
      confidence: 94,
      impact: 'High',
      action: 'Add uncorrelated assets'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'sell': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'hold': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'rebalance': return <Target className="w-5 h-5" />;
      case 'opportunity': return <Zap className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  // Trading execution functions
  const executeTradeRecommendation = async (recommendation: any) => {
    try {
      const portfolioValue = 15750; // Simulated portfolio value
      const tradeAmount = Math.min(
        portfolioValue * 0.1, // Max 10% of portfolio
        recommendation.type === 'buy' ? 1000 : portfolioValue * 0.05
      );

      const tradeData = {
        symbol: `${recommendation.asset}USDT`,
        side: recommendation.type === 'hold' ? 'buy' : recommendation.type,
        amount: tradeAmount,
        price: recommendation.currentPrice,
        type: 'market',
        source: 'ai_recommendation',
        recommendationId: recommendation.id
      };

      // Place the trade order using working endpoint
      const response = await fetch('/api/sms/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tradeData,
          quantity: tradeData.amount // API expects 'quantity' not 'amount'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute trade');
      }

      const result = await response.json();

      toast({
        title: "Trade Executed Successfully!",
        description: `${recommendation.type.toUpperCase()} order for ${recommendation.asset} placed. Target: $${recommendation.targetPrice.toLocaleString()}`,
        duration: 5000,
      });

      // Navigate to trading page to view the order
      setLocation(`/trading?pair=${recommendation.asset}USDT&executed=true`);

    } catch (error) {
      console.error('Trade execution error:', error);
      toast({
        title: "Trade Execution Failed",
        description: `Unable to execute ${recommendation.type} order for ${recommendation.asset}. Please try manually.`,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const provideFeedback = (recommendation: any, isHelpful: boolean) => {
    const feedback = {
      recommendationId: recommendation.id,
      isHelpful,
      timestamp: new Date().toISOString()
    };

    fetch('/api/ai-trading/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    }).catch(console.error);

    toast({
      title: "Feedback Recorded",
      description: `Thank you for your feedback on the ${recommendation.asset} recommendation!`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AI Trading Recommendations
          </h1>
          <p className="text-gray-300">Intelligent trading insights powered by machine learning algorithms</p>
        </div>

        {/* AI Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-gray-400">AI Accuracy</p>
                  <p className="text-xl font-bold text-cyan-400">87.3%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Win Rate</p>
                  <p className="text-xl font-bold text-green-400">74.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Avg Return</p>
                  <p className="text-xl font-bold text-purple-400">+12.7%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Active Signals</p>
                  <p className="text-xl font-bold text-yellow-400">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="recommendations">Trading Recommendations</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Insights</TabsTrigger>
            <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
            <TabsTrigger value="settings">AI Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Current Recommendations</h2>
                <Button className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh AI Analysis
                </Button>
              </div>

              <div className="grid gap-6">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="bg-gray-800/50 border-gray-700/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge className={getTypeColor(rec.type)}>
                            {rec.type.toUpperCase()}
                          </Badge>
                          <h3 className="text-xl font-bold">{rec.asset}</h3>
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-bold">{rec.aiScore}/10</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Confidence</p>
                          <p className="text-xl font-bold text-cyan-400">{rec.confidence}%</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{rec.reasoning}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Current Price</p>
                          <p className="text-lg font-bold">${rec.currentPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Target Price</p>
                          <p className="text-lg font-bold text-green-400">${rec.targetPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Potential Return</p>
                          <p className={`text-lg font-bold ${rec.potentialGain > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {rec.potentialGain > 0 ? '+' : ''}{rec.potentialGain}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Risk Level</p>
                          <p className={`text-lg font-bold ${getRiskColor(rec.riskLevel)}`}>
                            {rec.riskLevel}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {rec.signals.map((signal, idx) => (
                          <Badge key={idx} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            {signal}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Updated {rec.timestamp}</span>
                          <span>•</span>
                          <span>Timeframe: {rec.timeframe}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                            onClick={() => provideFeedback(rec, true)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                            onClick={() => provideFeedback(rec, false)}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                            onClick={() => executeTradeRecommendation(rec)}
                          >
                            Execute Trade
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Portfolio Optimization</h2>
              
              <div className="grid gap-6">
                {portfolioInsights.map((insight, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-cyan-400">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold">{insight.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-cyan-500/20 text-cyan-400">
                                {insight.confidence}% confidence
                              </Badge>
                              <Badge className={
                                insight.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                                insight.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }>
                                {insight.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-4">{insight.description}</p>
                          <Button className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                            {insight.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Market Analysis</h2>
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-6">
                  <p className="text-gray-300 text-center py-4">
                    Advanced market analysis and trend prediction features coming soon...
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">AI Configuration</h2>
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-6">
                  <p className="text-gray-300 text-center py-4">
                    AI model settings and customization options coming soon...
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}