import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  X, 
  Zap, 
  Shield, 
  Crown, 
  Gem, 
  TrendingUp, 
  Bot, 
  Users, 
  BarChart3,
  Smartphone,
  Globe,
  Lock,
  Headphones
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: string[];
  limits: {
    tradingVolume: string;
    apiCalls: string;
    withdrawals: string;
    support: string;
  };
  popular?: boolean;
  color: string;
}

export default function PricingTiers() {
  const [isYearly, setIsYearly] = useState(false);

  const tiers: PricingTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      icon: <Smartphone className="w-6 h-6" />,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started with crypto trading',
      features: [
        'Basic spot trading',
        'Mobile app access',
        'Standard order types',
        'Basic portfolio tracking',
        'Email support',
        'Market data access',
        'Instant trading (email only)'
      ],
      limits: {
        tradingVolume: '$25K/day',
        apiCalls: '500/hour',
        withdrawals: '5/day',
        support: 'Email (24h)'
      },
      color: 'border-gray-500'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <Shield className="w-6 h-6" />,
      price: { monthly: 29, yearly: 290 },
      description: 'Advanced tools for serious traders',
      features: [
        'All Basic features',
        'Advanced order types',
        'Real-time analytics',
        'AI trading signals',
        'Priority support',
        'Advanced charting',
        'Risk management tools',
        'Mobile push notifications',
        'Phone verification only'
      ],
      limits: {
        tradingVolume: '$250K/day',
        apiCalls: '2,500/hour',
        withdrawals: '15/day',
        support: 'Chat (2h)'
      },
      popular: true,
      color: 'border-blue-500'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <Crown className="w-6 h-6" />,
      price: { monthly: 99, yearly: 990 },
      description: 'Professional-grade features for power users',
      features: [
        'All Pro features',
        'Copy trading platform',
        'Portfolio optimization',
        'Advanced AI insights',
        'Custom indicators',
        'Institutional data',
        'Dedicated account manager',
        'Mobile premium features',
        'Cross-platform sync'
      ],
      limits: {
        tradingVolume: '$1M/day',
        apiCalls: '10,000/hour',
        withdrawals: 'Unlimited',
        support: 'Priority (1h)'
      },
      color: 'border-purple-500'
    },
    {
      id: 'elite',
      name: 'Elite',
      icon: <Gem className="w-6 h-6" />,
      price: { monthly: 299, yearly: 2990 },
      description: 'Ultimate trading experience for institutions',
      features: [
        'All Premium features',
        'White-label solutions',
        'Custom API endpoints',
        'Institutional liquidity',
        'Advanced compliance',
        'Custom mobile app',
        '24/7 phone support',
        'On-site training',
        'Custom integrations',
        'Regulatory reporting'
      ],
      limits: {
        tradingVolume: 'Unlimited',
        apiCalls: 'Unlimited',
        withdrawals: 'Unlimited',
        support: '24/7 Phone'
      },
      color: 'border-yellow-500'
    }
  ];

  const getPrice = (tier: PricingTier) => {
    return isYearly ? tier.price.yearly : tier.price.monthly;
  };

  const getSavings = (tier: PricingTier) => {
    if (tier.price.monthly === 0) return 0;
    const yearlyMonthly = tier.price.yearly / 12;
    const savings = ((tier.price.monthly - yearlyMonthly) / tier.price.monthly) * 100;
    return Math.round(savings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Trading Tier</h1>
          <p className="text-xl text-gray-300 mb-8">
            Unlock advanced features and higher limits as you grow
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
            <Badge variant="secondary" className="bg-green-500 text-white ml-2">
              Save up to 17%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => (
            <Card key={tier.id} 
                  className={`bg-black/20 backdrop-blur-lg border-2 ${tier.color} ${tier.popular ? 'scale-105 shadow-2xl' : ''} relative`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${getPrice(tier)}
                  </span>
                  <span className="text-gray-400">
                    /{isYearly ? 'year' : 'month'}
                  </span>
                  {isYearly && getSavings(tier) > 0 && (
                    <Badge variant="outline" className="ml-2">
                      Save {getSavings(tier)}%
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-2">{tier.description}</p>
              </CardHeader>
              
              <CardContent>
                {/* Features */}
                <div className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limits */}
                <div className="border-t border-white/10 pt-4 mb-6">
                  <h4 className="font-semibold mb-3">Limits & Support</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Trading Volume:</span>
                      <span>{tier.limits.tradingVolume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Calls:</span>
                      <span>{tier.limits.apiCalls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Withdrawals:</span>
                      <span>{tier.limits.withdrawals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support:</span>
                      <span>{tier.limits.support}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className={`w-full ${tier.id === 'basic' ? 'bg-gray-600 hover:bg-gray-700' : 
                    tier.id === 'pro' ? 'bg-blue-500 hover:bg-blue-600' :
                    tier.id === 'premium' ? 'bg-purple-500 hover:bg-purple-600' :
                    'bg-yellow-500 hover:bg-yellow-600 text-black'}`}
                >
                  {tier.id === 'basic' ? 'Current Plan' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <FeatureComparison />

        {/* Mobile Features Highlight */}
        <MobileFeaturesHighlight />
      </div>
    </div>
  );
}

function FeatureComparison() {
  const features = [
    { name: 'Spot Trading', basic: true, pro: true, premium: true, elite: true },
    { name: 'Mobile App', basic: true, pro: true, premium: true, elite: true },
    { name: 'Advanced Orders', basic: false, pro: true, premium: true, elite: true },
    { name: 'AI Trading Signals', basic: false, pro: true, premium: true, elite: true },
    { name: 'Copy Trading', basic: false, pro: false, premium: true, elite: true },
    { name: 'Portfolio Optimization', basic: false, pro: false, premium: true, elite: true },
    { name: 'Institutional Data', basic: false, pro: false, premium: true, elite: true },
    { name: 'Custom Mobile App', basic: false, pro: false, premium: false, elite: true },
    { name: 'White-label Solution', basic: false, pro: false, premium: false, elite: true },
    { name: '24/7 Phone Support', basic: false, pro: false, premium: false, elite: true }
  ];

  return (
    <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-12">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Feature Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-3">Feature</th>
                <th className="text-center p-3">Basic</th>
                <th className="text-center p-3">Pro</th>
                <th className="text-center p-3">Premium</th>
                <th className="text-center p-3">Elite</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="p-3 font-medium">{feature.name}</td>
                  <td className="text-center p-3">
                    {feature.basic ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : 
                     <X className="w-5 h-5 text-gray-400 mx-auto" />}
                  </td>
                  <td className="text-center p-3">
                    {feature.pro ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : 
                     <X className="w-5 h-5 text-gray-400 mx-auto" />}
                  </td>
                  <td className="text-center p-3">
                    {feature.premium ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : 
                     <X className="w-5 h-5 text-gray-400 mx-auto" />}
                  </td>
                  <td className="text-center p-3">
                    {feature.elite ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : 
                     <X className="w-5 h-5 text-gray-400 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function MobileFeaturesHighlight() {
  const mobileFeatures = [
    {
      icon: <Smartphone className="w-8 h-8 text-blue-400" />,
      title: 'Native Mobile App',
      description: 'Full-featured mobile trading with biometric security'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: 'Instant Notifications',
      description: 'Real-time price alerts and order updates'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-400" />,
      title: 'Mobile Analytics',
      description: 'Advanced portfolio insights on the go'
    },
    {
      icon: <Bot className="w-8 h-8 text-purple-400" />,
      title: 'AI Assistant',
      description: 'Smart trading recommendations powered by AI'
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-white/10">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Mobile-First Trading Experience</CardTitle>
        <p className="text-center text-gray-300">
          Trade anywhere, anytime with our award-winning mobile platform
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mobileFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}