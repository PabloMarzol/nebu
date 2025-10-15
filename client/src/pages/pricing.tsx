import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Smartphone,
  Monitor,
  Building,
  Users,
  TrendingUp,
  Shield,
  HeadphonesIcon,
  Bot,
  Globe,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Basic",
      description: "Perfect for beginners getting started with crypto trading",
      icon: <Smartphone className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Basic spot trading",
        "10 trading pairs",
        "Mobile app access",
        "Email support",
        "Basic market data",
        "Standard charts",
        "Community access"
      ],
      limits: {
        "Daily Trading Volume": "$25,000",
        "API Calls": "1,000/day",
        "Concurrent Orders": "5"
      },
      buttonText: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      description: "Advanced features for serious traders and professionals",
      icon: <Monitor className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      price: { monthly: 49, yearly: 490 },
      features: [
        "Advanced trading tools",
        "50+ trading pairs",
        "Desktop & mobile app",
        "Priority support",
        "Real-time market data",
        "Advanced charting",
        "Copy trading access",
        "Portfolio analytics",
        "Risk management tools"
      ],
      limits: {
        "Daily Trading Volume": "$250,000",
        "API Calls": "10,000/day",
        "Concurrent Orders": "25"
      },
      buttonText: "Start Pro Trial",
      popular: true
    },
    {
      name: "Premium",
      description: "Professional-grade platform for high-volume traders",
      icon: <Crown className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-500",
      price: { monthly: 149, yearly: 1490 },
      features: [
        "All Pro features",
        "100+ trading pairs",
        "AI trading assistant",
        "24/7 phone support",
        "Institutional tools",
        "Advanced API access",
        "White-label options",
        "Custom indicators",
        "Algorithmic trading",
        "Dedicated account manager"
      ],
      limits: {
        "Daily Trading Volume": "$1,000,000",
        "API Calls": "100,000/day",
        "Concurrent Orders": "100"
      },
      buttonText: "Upgrade to Premium",
      popular: false
    },
    {
      name: "Enterprise",
      description: "Custom solutions for institutions and large organizations",
      icon: <Building className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500",
      price: { monthly: "Custom", yearly: "Custom" },
      features: [
        "All Premium features",
        "Unlimited trading pairs",
        "Custom integrations",
        "Dedicated infrastructure",
        "SLA guarantees",
        "Custom reporting",
        "Multi-user management",
        "Compliance tools",
        "On-premise options",
        "White-label solutions"
      ],
      limits: {
        "Daily Trading Volume": "Unlimited",
        "API Calls": "Unlimited",
        "Concurrent Orders": "Unlimited"
      },
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  const addOns = [
    {
      name: "AI Trading Bot",
      description: "Automated trading powered by machine learning",
      price: 29,
      icon: <Bot className="w-5 h-5" />
    },
    {
      name: "Advanced Analytics",
      description: "Deep portfolio insights and performance tracking",
      price: 19,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      name: "Premium Support",
      description: "24/7 priority support with dedicated specialist",
      price: 39,
      icon: <HeadphonesIcon className="w-5 h-5" />
    },
    {
      name: "Global Market Access",
      description: "Access to international exchanges and markets",
      price: 49,
      icon: <Globe className="w-5 h-5" />
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (typeof plan.price[billingCycle] === 'string') {
      return plan.price[billingCycle];
    }
    return plan.price[billingCycle] === 0 ? 'Free' : `$${plan.price[billingCycle]}`;
  };

  const getSavings = (monthly: number, yearly: number) => {
    if (typeof monthly === 'string' || typeof yearly === 'string') return null;
    if (monthly === 0) return null;
    const monthlyCost = monthly * 12;
    const savings = ((monthlyCost - yearly) / monthlyCost * 100).toFixed(0);
    return `${savings}% off`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Choose Your Trading Plan
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Scale your trading with flexible plans designed for every level
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                Save up to 20%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative bg-gray-800/50 border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-cyan-500/50 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.color} mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-gray-400 text-sm">{plan.description}</p>
                
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    {getPrice(plan)}
                    {plan.price[billingCycle] !== 0 && typeof plan.price[billingCycle] === 'number' && (
                      <span className="text-lg text-gray-400">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && typeof plan.price.monthly === 'number' && plan.price.monthly > 0 && (
                    <div className="text-sm text-green-400 mt-1">
                      {getSavings(plan.price.monthly, plan.price.yearly as number)}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-300 uppercase tracking-wide">Features</h4>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-300 uppercase tracking-wide">Limits</h4>
                  {Object.entries(plan.limits).map(([key, value], idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-400">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <Card className="bg-gray-800/50 border-gray-700/50 mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Add-on Services</CardTitle>
            <p className="text-gray-400 text-center">Enhance your trading experience with premium add-ons</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-gray-700/30 border border-gray-600/30">
                  <div className="inline-flex p-3 rounded-full bg-cyan-500/20 text-cyan-400 mb-4">
                    {addon.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{addon.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{addon.description}</p>
                  <div className="text-2xl font-bold text-cyan-400 mb-4">
                    ${addon.price}/mo
                  </div>
                  <Button size="sm" className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                    Add to Plan
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
                  <p className="text-gray-400 text-sm">Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-gray-400 text-sm">We accept all major credit cards, PayPal, and cryptocurrency payments including BTC, ETH, and USDT.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Is there a free trial available?</h3>
                  <p className="text-gray-400 text-sm">Yes, all paid plans come with a 14-day free trial. No credit card required to start.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">What happens if I exceed my limits?</h3>
                  <p className="text-gray-400 text-sm">We'll notify you when approaching limits. Temporary overages are allowed, but consistent excess usage requires a plan upgrade.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Do you offer enterprise discounts?</h3>
                  <p className="text-gray-400 text-sm">Yes, we offer volume discounts for teams of 10+ users and custom enterprise solutions.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                  <p className="text-gray-400 text-sm">Absolutely. Cancel anytime with no penalties. Your plan remains active until the end of your billing period.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}