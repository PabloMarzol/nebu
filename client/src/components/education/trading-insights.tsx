import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Brain, Lightbulb, AlertCircle } from 'lucide-react';

interface TradingInsight {
  id: string;
  title: string;
  summary: string;
  category: 'opportunity' | 'warning' | 'education' | 'strategy';
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
  relatedAssets: string[];
  actionable: boolean;
  insights: string[];
  metrics?: {
    priceChange: number;
    volume: number;
    volatility: number;
  };
}

interface PersonalProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  tradingStyle: 'scalper' | 'day trader' | 'swing trader' | 'hodler';
  preferredAssets: string[];
  portfolioSize: 'small' | 'medium' | 'large';
  experience: 'beginner' | 'intermediate' | 'advanced';
}

export default function TradingInsights() {
  const [insights, setInsights] = useState<TradingInsight[]>([]);
  const [userProfile, setUserProfile] = useState<PersonalProfile>({
    riskTolerance: 'moderate',
    tradingStyle: 'swing trader',
    preferredAssets: ['BTC', 'ETH', 'SOL'],
    portfolioSize: 'medium',
    experience: 'intermediate'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const generatePersonalizedInsights = () => {
    const sampleInsights: TradingInsight[] = [
      {
        id: 'btc-momentum',
        title: 'Bitcoin Showing Strong Momentum',
        summary: 'BTC has broken through key resistance levels with high volume, indicating potential continued upward movement.',
        category: 'opportunity',
        confidence: 85,
        impact: 'high',
        timeframe: '1-3 days',
        relatedAssets: ['BTC', 'ETH'],
        actionable: true,
        insights: [
          'Price broke above $42,000 resistance with 40% volume increase',
          'RSI approaching overbought but momentum remains strong',
          'Consider position sizing based on your moderate risk profile',
          'Watch for potential pullback to $41,200 support for entry'
        ],
        metrics: {
          priceChange: 5.2,
          volume: 140,
          volatility: 28
        }
      },
      {
        id: 'eth-defi-surge',
        title: 'Ethereum DeFi Activity Increasing',
        summary: 'Growing DeFi transactions and gas fee optimization creating positive sentiment for ETH.',
        category: 'opportunity',
        confidence: 72,
        impact: 'medium',
        timeframe: '3-7 days',
        relatedAssets: ['ETH', 'UNI', 'AAVE'],
        actionable: true,
        insights: [
          'DeFi TVL increased 12% this week',
          'Gas fees down 30% due to recent optimizations',
          'Layer 2 adoption accelerating ETH ecosystem growth',
          'Consider DCA strategy given your swing trading style'
        ],
        metrics: {
          priceChange: 3.1,
          volume: 115,
          volatility: 22
        }
      },
      {
        id: 'market-correction-warning',
        title: 'Potential Market Correction Signs',
        summary: 'Several technical indicators suggest a short-term correction may be approaching.',
        category: 'warning',
        confidence: 68,
        impact: 'medium',
        timeframe: '1-2 weeks',
        relatedAssets: ['BTC', 'ETH', 'SOL', 'ADA'],
        actionable: true,
        insights: [
          'Fear & Greed Index reaching extreme greed levels',
          'Multiple altcoins showing divergence from BTC',
          'Profit-taking activity increasing among whale wallets',
          'Consider taking partial profits and setting stop-losses'
        ]
      },
      {
        id: 'sol-ecosystem-growth',
        title: 'Solana Ecosystem Expanding Rapidly',
        summary: 'New partnerships and developer activity creating long-term value proposition for SOL.',
        category: 'education',
        confidence: 79,
        impact: 'high',
        timeframe: '1-3 months',
        relatedAssets: ['SOL', 'RAY', 'SRM'],
        actionable: false,
        insights: [
          'Developer commits up 45% month-over-month',
          'New gaming and NFT projects launching weekly',
          'Institutional partnerships being announced',
          'Consider long-term accumulation strategy'
        ],
        metrics: {
          priceChange: 8.7,
          volume: 180,
          volatility: 35
        }
      },
      {
        id: 'portfolio-rebalancing',
        title: 'Portfolio Rebalancing Recommendation',
        summary: 'Your current allocation may benefit from rebalancing based on recent market movements.',
        category: 'strategy',
        confidence: 88,
        impact: 'medium',
        timeframe: 'Now',
        relatedAssets: ['BTC', 'ETH', 'SOL'],
        actionable: true,
        insights: [
          'BTC allocation has grown to 65% due to price appreciation',
          'Consider taking profits and rebalancing to target 50%',
          'ETH position underweighted at current market conditions',
          'SOL showing strength - consider increasing allocation'
        ]
      }
    ];

    // Filter insights based on user profile
    return sampleInsights.filter(insight => {
      if (userProfile.riskTolerance === 'conservative' && insight.impact === 'high' && insight.category === 'warning') {
        return true; // Show warnings to conservative users
      }
      if (userProfile.experience === 'beginner' && insight.category === 'education') {
        return true; // Show educational content to beginners
      }
      return insight.relatedAssets.some(asset => userProfile.preferredAssets.includes(asset));
    });
  };

  const refreshInsights = async () => {
    setIsGenerating(true);
    
    // Simulate AI analysis time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInsights = generatePersonalizedInsights();
    setInsights(newInsights);
    setLastUpdate(new Date());
    setIsGenerating(false);
  };

  useEffect(() => {
    refreshInsights();
  }, [userProfile]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'opportunity': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'education': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'strategy': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'opportunity': return <TrendingUp className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'education': return <Lightbulb className="w-4 h-4" />;
      case 'strategy': return <Target className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-indigo-900/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white">Personalized Trading Insights</CardTitle>
                <p className="text-gray-400">AI-powered analysis tailored to your trading style</p>
              </div>
            </div>
            <Button
              onClick={refreshInsights}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isGenerating ? 'Analyzing...' : 'Refresh Insights'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* User Profile Summary */}
      <Card className="bg-gray-900/40 border-gray-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">Your Trading Profile</h4>
            <span className="text-xs text-gray-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="text-center">
              <div className="text-xs text-gray-400">Risk</div>
              <Badge variant="outline" className="mt-1 text-xs">
                {userProfile.riskTolerance}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Style</div>
              <Badge variant="outline" className="mt-1 text-xs">
                {userProfile.tradingStyle}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Assets</div>
              <Badge variant="outline" className="mt-1 text-xs">
                {userProfile.preferredAssets.join(', ')}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Portfolio</div>
              <Badge variant="outline" className="mt-1 text-xs">
                {userProfile.portfolioSize}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Experience</div>
              <Badge variant="outline" className="mt-1 text-xs">
                {userProfile.experience}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      {isGenerating ? (
        <Card className="bg-gray-900/40 border-gray-500/20">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Analyzing market conditions and your trading profile...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="bg-gray-900/40 border-gray-500/20 hover:border-purple-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${getCategoryColor(insight.category)}`}>
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">{insight.title}</h4>
                      <p className="text-gray-400 text-sm mb-2">{insight.summary}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs ${getCategoryColor(insight.category)}`}>
                          {insight.category}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getImpactColor(insight.impact)}`}>
                          {insight.impact} impact
                        </Badge>
                        <span className="text-xs text-gray-500">{insight.timeframe}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-400">{insight.confidence}%</div>
                    <div className="text-xs text-gray-400">Confidence</div>
                  </div>
                </div>

                {/* Metrics */}
                {insight.metrics && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-black/20 rounded-lg">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${insight.metrics.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {insight.metrics.priceChange >= 0 ? '+' : ''}{insight.metrics.priceChange.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-400">Price Change</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{insight.metrics.volume}%</div>
                      <div className="text-xs text-gray-400">Volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{insight.metrics.volatility}%</div>
                      <div className="text-xs text-gray-400">Volatility</div>
                    </div>
                  </div>
                )}

                {/* Detailed Insights */}
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-300 text-sm">Key Insights:</h5>
                  <ul className="space-y-1">
                    {insight.insights.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                        <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related Assets */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Related:</span>
                    {insight.relatedAssets.map((asset) => (
                      <Badge key={asset} variant="outline" className="text-xs">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                  {insight.actionable && (
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      Actionable
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-gray-900/40 to-purple-900/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white mb-1">Take Action</h4>
              <p className="text-gray-400 text-sm">Based on your personalized insights</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                onClick={() => window.open('/trading', '_blank')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Start Trading
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                onClick={() => window.open('/portfolio', '_blank')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}