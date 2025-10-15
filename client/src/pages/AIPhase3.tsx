import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Bot,
  Zap,
  Target,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Crown,
  Activity,
  Settings,
  Sparkles,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

// Import the AI components
import AdvancedAITradingAssistant from "@/components/ai/advanced-ai-trading-assistant";
import PredictiveAnalyticsEngine from "@/components/ai/predictive-analytics-engine";
import AutomatedTradingStrategies from "@/components/ai/automated-trading-strategies";
import IntelligentPortfolioManagement from "@/components/ai/intelligent-portfolio-management";

export default function AIPhase3() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<'basic' | 'pro' | 'premium' | 'elite'>('premium');

  const components = [
    {
      id: 'ai-assistant',
      title: 'Advanced AI Trading Assistant',
      description: 'Natural language trading commands and market insights',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      features: ['Natural language commands', 'Real-time market analysis', 'Personalized recommendations', 'Voice control'],
      component: AdvancedAITradingAssistant
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Analytics Engine',
      description: 'Machine learning models for market predictions',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: ['Price predictions', 'Pattern recognition', 'Volatility forecasting', 'Sentiment analysis'],
      component: PredictiveAnalyticsEngine
    },
    {
      id: 'automated-strategies',
      title: 'Automated Trading Strategies',
      description: 'AI-powered trading bots and automation',
      icon: <Bot className="w-6 h-6" />,
      color: 'from-green-500 to-teal-500',
      features: ['DCA automation', 'Grid trading bots', 'Copy trading', 'Risk management'],
      component: AutomatedTradingStrategies
    },
    {
      id: 'portfolio-management',
      title: 'Intelligent Portfolio Management',
      description: 'AI-driven portfolio optimization and rebalancing',
      icon: <Target className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      features: ['Auto-rebalancing', 'Risk analysis', 'AI recommendations', 'Tax optimization'],
      component: IntelligentPortfolioManagement
    }
  ];

  const aiCapabilities = {
    basic: ['Basic AI chat', 'Simple predictions'],
    pro: ['Advanced AI assistant', 'Predictive analytics', 'Basic automation'],
    premium: ['Full AI suite', 'Custom strategies', 'Real-time predictions', 'Auto-execution'],
    elite: ['Institutional AI', 'Custom models', 'Advanced automation', 'Priority support']
  };

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const handleBackToOverview = () => {
    setSelectedComponent(null);
  };

  if (selectedComponent) {
    const component = components.find(c => c.id === selectedComponent);
    if (component) {
      const ComponentToRender = component.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {/* Header */}
          <div className="p-4 bg-black/20 backdrop-blur-lg">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={handleBackToOverview}
                className="text-white"
              >
                ← Back to Overview
              </Button>
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">{component.title}</h1>
                <p className="text-sm text-gray-300">{component.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-purple-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  {userTier.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Component */}
          <ComponentToRender userTier={userTier} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Phase 3: AI & Automation
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Advanced artificial intelligence and automated trading systems
          </p>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">All AI Components Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <span className="text-sm">OpenAI Integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Real-time Processing</span>
            </div>
          </div>

          {/* User Tier Selector */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="text-sm text-gray-400">Test with tier:</span>
            {(['basic', 'pro', 'premium', 'elite'] as const).map((tier) => (
              <Button
                key={tier}
                variant={userTier === tier ? "default" : "outline"}
                size="sm"
                onClick={() => setUserTier(tier)}
                className={`${
                  tier === 'basic' ? 'border-gray-500' :
                  tier === 'pro' ? 'border-blue-500' :
                  tier === 'premium' ? 'border-purple-500' : 'border-yellow-500'
                }`}
              >
                {tier === 'basic' ? <Activity className="w-3 h-3 mr-1" /> :
                 tier === 'pro' ? <Star className="w-3 h-3 mr-1" /> :
                 <Crown className="w-3 h-3 mr-1" />}
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Button>
            ))}
          </div>

          {/* Tier Capabilities */}
          <div className="max-w-2xl mx-auto p-4 bg-black/20 backdrop-blur-lg rounded-lg">
            <h3 className="font-semibold mb-2">{userTier.toUpperCase()} Tier Capabilities</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {aiCapabilities[userTier].map((capability, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {capability}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {components.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group h-full"
                    onClick={() => handleComponentSelect(component.id)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${component.color}`}>
                        {component.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{component.title}</h3>
                        <p className="text-sm text-gray-400">{component.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      {component.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-white/10">
                      <Button variant="outline" className="w-full group-hover:bg-white/10 transition-colors">
                        Launch AI Component
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Features Overview */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <span>AI & Automation Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>AI Intelligence</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Natural language processing</li>
                    <li>• Market sentiment analysis</li>
                    <li>• Personalized recommendations</li>
                    <li>• Voice command support</li>
                    <li>• Real-time learning</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span>Predictive Analytics</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Machine learning models</li>
                    <li>• Price prediction algorithms</li>
                    <li>• Pattern recognition</li>
                    <li>• Volatility forecasting</li>
                    <li>• Risk assessment</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-green-400" />
                    <span>Trading Automation</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• DCA automation</li>
                    <li>• Grid trading bots</li>
                    <li>• Copy trading systems</li>
                    <li>• Portfolio rebalancing</li>
                    <li>• Risk management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Implementation Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>Phase 3 Implementation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold">AI Trading Assistant</h4>
                  <p className="text-sm text-gray-400">Natural language interface with OpenAI</p>
                </div>
                
                <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold">Predictive Analytics</h4>
                  <p className="text-sm text-gray-400">ML models for market predictions</p>
                </div>
                
                <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold">Trading Automation</h4>
                  <p className="text-sm text-gray-400">Automated strategies and bots</p>
                </div>
              </div>

              <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold mb-2">Next Phase Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Phase 4: Advanced Integrations</strong>
                    <p className="text-gray-400">DeFi integration, cross-chain support, enterprise APIs, institutional features</p>
                  </div>
                  <div>
                    <strong>Phase 5: Analytics & BI</strong>
                    <p className="text-gray-400">Business intelligence, regulatory compliance, advanced reporting, audit trails</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}