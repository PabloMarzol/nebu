import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  Users, 
  BarChart3,
  Sparkles,
  Crown,
  Gem,
  Lock,
  Globe,
  Smartphone
} from 'lucide-react';

interface AdvancedFeature {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  tier: 'pro' | 'premium' | 'elite';
  category: 'ai' | 'trading' | 'analytics' | 'mobile';
  benefits: string[];
  pricing?: {
    setup: number;
    monthly: number;
  };
}

export default function AdvancedFeatures() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ai');

  const features: AdvancedFeature[] = [
    // AI Features
    {
      id: 'ai-trading-bot',
      name: 'AI Trading Bot',
      icon: <Bot className="w-6 h-6" />,
      description: 'Autonomous trading bot powered by machine learning algorithms',
      tier: 'pro',
      category: 'ai',
      benefits: [
        '24/7 automated trading',
        'Machine learning optimization',
        'Risk-adjusted strategies',
        'Backtesting capabilities',
        'Performance analytics'
      ]
    },
    {
      id: 'sentiment-analysis',
      name: 'Market Sentiment AI',
      icon: <Brain className="w-6 h-6" />,
      description: 'Real-time sentiment analysis from news, social media, and market data',
      tier: 'premium',
      category: 'ai',
      benefits: [
        'Social media sentiment tracking',
        'News impact analysis',
        'Fear & greed index',
        'Whale movement alerts',
        'Market mood predictions'
      ]
    },
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics',
      icon: <Sparkles className="w-6 h-6" />,
      description: 'Advanced AI models for price prediction and trend analysis',
      tier: 'elite',
      category: 'ai',
      benefits: [
        'Price prediction models',
        'Trend reversal detection',
        'Support/resistance levels',
        'Volume analysis',
        'Market cycle identification'
      ]
    },

    // Trading Features
    {
      id: 'copy-trading',
      name: 'Copy Trading Platform',
      icon: <Users className="w-6 h-6" />,
      description: 'Follow and copy trades from successful traders',
      tier: 'premium',
      category: 'trading',
      benefits: [
        'Follow top traders',
        'Automatic position mirroring',
        'Risk management controls',
        'Performance tracking',
        'Social trading community'
      ]
    },
    {
      id: 'algorithmic-trading',
      name: 'Algorithmic Trading',
      icon: <Target className="w-6 h-6" />,
      description: 'Custom trading algorithms and strategy automation',
      tier: 'elite',
      category: 'trading',
      benefits: [
        'Custom algorithm builder',
        'Strategy backtesting',
        'Paper trading simulation',
        'Multi-exchange arbitrage',
        'Advanced order types'
      ],
      pricing: {
        setup: 500,
        monthly: 199
      }
    },
    {
      id: 'portfolio-optimization',
      name: 'Portfolio Optimization',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'AI-powered portfolio rebalancing and optimization',
      tier: 'premium',
      category: 'trading',
      benefits: [
        'Automatic rebalancing',
        'Risk-adjusted allocation',
        'Diversification analysis',
        'Tax optimization',
        'Performance benchmarking'
      ]
    },

    // Analytics Features
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics Suite',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Professional-grade analytics and reporting tools',
      tier: 'premium',
      category: 'analytics',
      benefits: [
        'Custom dashboards',
        'Advanced charting',
        'Performance metrics',
        'Risk analysis',
        'Automated reports'
      ]
    },
    {
      id: 'risk-management',
      name: 'Enterprise Risk Management',
      icon: <Shield className="w-6 h-6" />,
      description: 'Comprehensive risk management and compliance tools',
      tier: 'elite',
      category: 'analytics',
      benefits: [
        'Real-time risk monitoring',
        'Stress testing',
        'VaR calculations',
        'Compliance reporting',
        'Regulatory alerts'
      ]
    },

    // Mobile Features
    {
      id: 'mobile-premium',
      name: 'Premium Mobile App',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Enhanced mobile experience with exclusive features',
      tier: 'pro',
      category: 'mobile',
      benefits: [
        'Advanced mobile UI',
        'Biometric security',
        'Offline mode',
        'Smart notifications',
        'Widget support'
      ]
    },
    {
      id: 'custom-mobile',
      name: 'Custom Mobile Solution',
      icon: <Crown className="w-6 h-6" />,
      description: 'White-label mobile app with your branding',
      tier: 'elite',
      category: 'mobile',
      benefits: [
        'Custom branding',
        'App store deployment',
        'Advanced features',
        'Priority support',
        'Custom integrations'
      ],
      pricing: {
        setup: 10000,
        monthly: 999
      }
    }
  ];

  const categories = [
    { id: 'ai', name: 'AI & Machine Learning', icon: <Bot className="w-5 h-5" /> },
    { id: 'trading', name: 'Advanced Trading', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'analytics', name: 'Analytics & Risk', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'mobile', name: 'Mobile Solutions', icon: <Smartphone className="w-5 h-5" /> }
  ];

  const filteredFeatures = features.filter(feature => feature.category === selectedCategory);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-blue-500';
      case 'premium': return 'bg-purple-500';
      case 'elite': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro': return <Shield className="w-4 h-4" />;
      case 'premium': return <Crown className="w-4 h-4" />;
      case 'elite': return <Gem className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Advanced Features</h1>
          <p className="text-xl text-gray-300">
            Unlock powerful tools and capabilities with premium tiers
          </p>
        </div>

        {/* Category Navigation */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="flex items-center space-x-2 p-4 h-auto"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              <span>{category.name}</span>
            </Button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFeatures.map((feature) => (
            <Card key={feature.id} className="bg-black/20 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {feature.icon}
                    <Badge className={`${getTierColor(feature.tier)} text-white`}>
                      {getTierIcon(feature.tier)}
                      <span className="ml-1 capitalize">{feature.tier}</span>
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl">{feature.name}</CardTitle>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  {feature.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                {feature.pricing && (
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <div className="text-sm text-gray-300">
                      <div className="flex justify-between mb-1">
                        <span>Setup Fee:</span>
                        <span>${feature.pricing.setup.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span>${feature.pricing.monthly}/month</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Features Showcase */}
        {selectedCategory === 'mobile' && (
          <MobileFeaturesShowcase />
        )}

        {/* AI Features Demo */}
        {selectedCategory === 'ai' && (
          <AIFeaturesDemo />
        )}
      </div>
    </div>
  );
}

function MobileFeaturesShowcase() {
  const mobileStats = [
    { label: 'Mobile Users', value: '68%', description: 'of our trading volume' },
    { label: 'App Rating', value: '4.8★', description: 'on app stores' },
    { label: 'Response Time', value: '<100ms', description: 'order execution' },
    { label: 'Uptime', value: '99.9%', description: 'mobile availability' }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-white/10 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Mobile-First Trading Platform</CardTitle>
        <p className="text-center text-gray-300">
          Our mobile app delivers institutional-grade trading in your pocket
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {mobileStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
              <div className="font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AIFeaturesDemo() {
  const [aiInsights, setAiInsights] = useState([
    {
      type: 'bullish',
      message: 'AI detected strong bullish momentum in BTC. Consider increasing allocation by 15%.',
      confidence: 87,
      timeframe: '24h'
    },
    {
      type: 'warning',
      message: 'High volatility expected in ETH. Recommend setting stop-loss at $2,450.',
      confidence: 93,
      timeframe: '4h'
    },
    {
      type: 'opportunity',
      message: 'Arbitrage opportunity detected: BTC price difference of 0.3% across exchanges.',
      confidence: 98,
      timeframe: '5m'
    }
  ]);

  return (
    <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
          <Brain className="w-6 h-6" />
          <span>AI Trading Insights</span>
        </CardTitle>
        <p className="text-center text-gray-300">
          Real-time AI analysis and trading recommendations
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              insight.type === 'bullish' ? 'bg-green-500/20 border-green-500/30' :
              insight.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500/30' :
              'bg-blue-500/20 border-blue-500/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="capitalize">
                  {insight.type}
                </Badge>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Confidence:</span>
                  <span className="text-sm font-semibold">{insight.confidence}%</span>
                  <Badge variant="secondary" size="sm">{insight.timeframe}</Badge>
                </div>
              </div>
              <p className="text-sm">{insight.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}