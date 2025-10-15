import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Brain, 
  Star, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Shield,
  DollarSign,
  Activity,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

export default function TradingRecommendations() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [userProfile, setUserProfile] = useState({
    riskTolerance: 'medium',
    tradingExperience: 'intermediate',
    portfolioValue: 15750,
    preferredAssets: ['BTC', 'ETH', 'SOL'],
    tradingStyle: 'swing',
    goals: 'growth'
  });

  const [recommendations, setRecommendations] = useState([]);

  // Simulate AI recommendations based on user profile
  useEffect(() => {
    const generateRecommendations = () => {
      const baseRecommendations = [
        {
          id: 1,
          type: 'buy',
          asset: 'BTC',
          confidence: 87,
          reasoning: 'Strong technical indicators suggest upward momentum. RSI indicates oversold conditions.',
          targetPrice: 45500,
          currentPrice: 43250,
          timeframe: '7-14 days',
          riskLevel: 'medium',
          potentialGain: 5.2,
          stopLoss: 41800,
          aiScore: 8.7,
          signals: ['Golden Cross', 'Volume Surge', 'Support Bounce']
        },
        {
          id: 2,
          type: 'sell',
          asset: 'DOGE',
          confidence: 72,
          reasoning: 'Overbought conditions detected. Consider taking profits at current levels.',
          targetPrice: 0.085,
          currentPrice: 0.092,
          timeframe: '3-5 days',
          riskLevel: 'high',
          potentialGain: -7.6,
          stopLoss: 0.095,
          aiScore: 7.2,
          signals: ['Overbought RSI', 'Resistance Level', 'Profit Taking']
        },
        {
          id: 3,
          type: 'hold',
          asset: 'ETH',
          confidence: 91,
          reasoning: 'Consolidation phase with strong fundamentals. Perfect for DCA strategy.',
          targetPrice: 2850,
          currentPrice: 2654,
          timeframe: '2-4 weeks',
          riskLevel: 'low',
          potentialGain: 7.4,
          stopLoss: 2500,
          aiScore: 9.1,
          signals: ['Strong Support', 'Accumulation', 'Bullish Divergence']
        },
        {
          id: 4,
          type: 'buy',
          asset: 'SOL',
          confidence: 79,
          reasoning: 'Ecosystem growth and recent partnerships signal strong potential.',
          targetPrice: 125,
          currentPrice: 108.45,
          timeframe: '10-21 days',
          riskLevel: 'medium',
          potentialGain: 15.3,
          stopLoss: 98,
          aiScore: 7.9,
          signals: ['Breakout Pattern', 'Volume Increase', 'Ecosystem Growth']
        }
      ];

      setRecommendations(baseRecommendations);
    };

    generateRecommendations();
  }, [userProfile]);

  const marketInsights = [
    {
      title: 'Market Sentiment',
      value: 'Bullish',
      score: 74,
      change: '+12%',
      description: 'Overall market sentiment has improved significantly'
    },
    {
      title: 'Fear & Greed Index',
      value: 'Neutral',
      score: 52,
      change: '+8%',
      description: 'Market showing balanced emotions'
    },
    {
      title: 'Volatility Index',
      value: 'Medium',
      score: 38,
      change: '-15%',
      description: 'Reduced volatility creates better entry opportunities'
    }
  ];

  const personalizedTips = [
    {
      category: 'Risk Management',
      tip: 'Based on your medium risk tolerance, consider allocating 60% to BTC/ETH and 40% to altcoins.',
      priority: 'high'
    },
    {
      category: 'Portfolio Diversification',
      tip: 'Your portfolio is concentrated in top 3 assets. Consider adding DeFi tokens for better diversification.',
      priority: 'medium'
    },
    {
      category: 'Trading Timing',
      tip: 'As a swing trader, current market conditions favor 1-2 week holding periods.',
      priority: 'high'
    },
    {
      category: 'Profit Taking',
      tip: 'Set up trailing stops to lock in profits during this bullish phase.',
      priority: 'medium'
    }
  ];

  const getActionColor = (type) => {
    switch (type) {
      case 'buy': return 'text-green-400 bg-green-500/20';
      case 'sell': return 'text-red-400 bg-red-500/20';
      case 'hold': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-400 bg-red-500/10';
      case 'medium': return 'border-l-yellow-400 bg-yellow-500/10';
      case 'low': return 'border-l-green-400 bg-green-500/10';
      default: return 'border-l-gray-400 bg-gray-500/10';
    }
  };

  // Trading execution functions
  const executeTradeRecommendation = async (recommendation) => {
    try {
      // Calculate trade amount based on recommendation and user profile
      const tradeAmount = Math.min(
        userProfile.portfolioValue * 0.1, // Max 10% of portfolio
        recommendation.type === 'buy' ? 1000 : userProfile.portfolioValue * 0.05
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
        description: `${recommendation.type.toUpperCase()} order for ${recommendation.asset} placed. Order ID: ${result.orderId || 'N/A'}`,
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

  const addToWatchList = async (recommendation) => {
    try {
      const watchData = {
        symbol: `${recommendation.asset}USDT`,
        targetPrice: recommendation.targetPrice,
        currentPrice: recommendation.currentPrice,
        type: recommendation.type,
        notes: recommendation.reasoning
      };

      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(watchData),
      });

      if (response.ok) {
        toast({
          title: "Added to Watch List",
          description: `${recommendation.asset} has been added to your watch list with target price $${recommendation.targetPrice}`,
          duration: 3000,
        });
      } else {
        throw new Error('Failed to add to watchlist');
      }
    } catch (error) {
      console.error('Watchlist error:', error);
      toast({
        title: "Watch List Error",
        description: `Unable to add ${recommendation.asset} to watch list. Please try again.`,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const provideFeedback = (recommendation, isHelpful) => {
    // Send feedback to AI system
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            AI Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Recommendations</span>
          </h1>
          <p className="text-xl text-gray-300">
            Personalized crypto trading insights powered by machine learning
          </p>
        </div>

        {/* User Profile Summary */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-400" />
              <span>Your Trading Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-blue-400">{userProfile.riskTolerance}</div>
                <div className="text-sm text-gray-400">Risk Tolerance</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-green-400">${userProfile.portfolioValue.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Portfolio Value</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-purple-400">{userProfile.tradingStyle}</div>
                <div className="text-sm text-gray-400">Trading Style</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <div className="text-lg font-bold text-yellow-400">{userProfile.goals}</div>
                <div className="text-sm text-gray-400">Primary Goal</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {marketInsights.map((insight, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{insight.title}</h3>
                  <Badge className="bg-blue-500 text-white">{insight.change}</Badge>
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-2">{insight.value}</div>
                <Progress value={insight.score} className="mb-2" />
                <p className="text-sm text-gray-400">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold">{rec.asset}</div>
                    <Badge className={getActionColor(rec.type)}>
                      {rec.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="font-bold">{rec.aiScore}/10</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Price Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Current Price</div>
                      <div className="text-lg font-bold">${rec.currentPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Target Price</div>
                      <div className="text-lg font-bold text-green-400">${rec.targetPrice.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Confidence and Risk */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Confidence</div>
                      <Progress value={rec.confidence} />
                      <div className="text-sm text-blue-400 mt-1">{rec.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Risk Level</div>
                      <div className={`text-lg font-bold ${getRiskColor(rec.riskLevel)}`}>
                        {rec.riskLevel.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Potential Gain */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span>Potential Gain:</span>
                    <span className={`font-bold ${rec.potentialGain > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {rec.potentialGain > 0 ? '+' : ''}{rec.potentialGain.toFixed(1)}%
                    </span>
                  </div>

                  {/* AI Reasoning */}
                  <div className="p-3 bg-blue-500/10 rounded-lg border-l-4 border-blue-400">
                    <div className="text-sm text-blue-300">{rec.reasoning}</div>
                  </div>

                  {/* Signals */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Key Signals:</div>
                    <div className="flex flex-wrap gap-2">
                      {rec.signals.map((signal, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      onClick={() => executeTradeRecommendation(rec)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Execute Trade
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => addToWatchList(rec)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Watch List
                    </Button>
                  </div>

                  {/* Feedback */}
                  <div className="flex items-center justify-center space-x-4 pt-4 border-t border-white/10">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => provideFeedback(rec, true)}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Helpful
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => provideFeedback(rec, false)}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Not Useful
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personalized Tips */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-green-400" />
              <span>Personalized Trading Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {personalizedTips.map((tip, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(tip.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-blue-400 mb-1">{tip.category}</div>
                      <div className="text-gray-300">{tip.tip}</div>
                    </div>
                    <Badge className={tip.priority === 'high' ? 'bg-red-500' : tip.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}>
                      {tip.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Tracking */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-center">AI Recommendation Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">73.5%</div>
                <div className="text-sm text-gray-300">Success Rate</div>
                <div className="text-xs text-gray-400">Last 30 days</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">+12.8%</div>
                <div className="text-sm text-gray-300">Avg Return</div>
                <div className="text-xs text-gray-400">Per recommendation</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">156</div>
                <div className="text-sm text-gray-300">Recommendations</div>
                <div className="text-xs text-gray-400">This month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}