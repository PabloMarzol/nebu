import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Plus, 
  X, 
  TrendingUp, 
  Bot, 
  Bell, 
  Target, 
  DollarSign, 
  BarChart3, 
  Shield,
  Sparkles,
  Brain,
  Rocket,
  Star,
  Gift
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: typeof TrendingUp;
  color: string;
  aiPowered?: boolean;
  href?: string;
  onClick?: () => void;
  category: 'trading' | 'ai' | 'alerts' | 'portfolio';
}

interface AIInsight {
  type: 'buy' | 'sell' | 'hold' | 'alert';
  asset: string;
  confidence: number;
  reasoning: string;
  timeframe: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'ai-trade-suggestion',
    title: 'AI Trade Suggestion',
    description: 'Get personalized trading recommendations',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    aiPowered: true,
    category: 'ai'
  },
  {
    id: 'quick-buy',
    title: 'Quick Buy',
    description: 'Execute instant market orders',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    href: '/trading?action=buy',
    category: 'trading'
  },
  {
    id: 'set-alert',
    title: 'Price Alert',
    description: 'Set smart price notifications',
    icon: Bell,
    color: 'from-yellow-500 to-orange-500',
    aiPowered: true,
    category: 'alerts'
  },
  {
    id: 'portfolio-analysis',
    title: 'Portfolio Insights',
    description: 'AI-powered portfolio analysis',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500',
    aiPowered: true,
    href: '/portfolio-analytics',
    category: 'portfolio'
  },
  {
    id: 'risk-check',
    title: 'Risk Assessment',
    description: 'Analyze portfolio risk levels',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    aiPowered: true,
    category: 'portfolio'
  },
  {
    id: 'market-scanner',
    title: 'Market Scanner',
    description: 'Find trending opportunities',
    icon: Target,
    color: 'from-indigo-500 to-purple-500',
    aiPowered: true,
    category: 'ai'
  }
];

const aiInsights: AIInsight[] = [
  {
    type: 'buy',
    asset: 'BTC',
    confidence: 87,
    reasoning: 'Strong breakout pattern with high volume',
    timeframe: '4H'
  },
  {
    type: 'alert',
    asset: 'ETH',
    confidence: 92,
    reasoning: 'Approaching key resistance level',
    timeframe: '1D'
  },
  {
    type: 'sell',
    asset: 'SOL',
    confidence: 76,
    reasoning: 'Overbought conditions detected',
    timeframe: '1H'
  }
];

interface QuickActionFABProps {
  isInline?: boolean;
}

export default function QuickActionFAB({ isInline = false }: QuickActionFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [showAiPulse, setShowAiPulse] = useState(false);

  useEffect(() => {
    // Simulate AI insights updates
    const interval = setInterval(() => {
      const randomInsight = aiInsights[Math.floor(Math.random() * aiInsights.length)];
      setAiInsight(randomInsight);
      setShowAiPulse(true);
      setTimeout(() => setShowAiPulse(false), 3000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'ai', label: 'AI', icon: Brain },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'portfolio', label: 'Portfolio', icon: BarChart3 }
  ];

  const filteredActions = activeCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === activeCategory);

  const handleActionClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      window.location.href = action.href;
    }
    setIsOpen(false);
  };

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'text-green-400 border-green-400';
      case 'sell': return 'text-red-400 border-red-400';
      case 'hold': return 'text-yellow-400 border-yellow-400';
      case 'alert': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <>
      {/* AI Insight Notification */}
      <AnimatePresence>
        {aiInsight && showAiPulse && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-4 z-40 w-80"
          >
            <Card className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-md border-purple-500/30 text-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                  >
                    <Brain className="w-4 h-4" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">AI Insight</span>
                      <Badge 
                        variant="outline" 
                        className={getActionTypeColor(aiInsight.type)}
                      >
                        {aiInsight.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{aiInsight.asset}</span>
                        <span className="text-purple-200">
                          {aiInsight.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-purple-100 text-xs">
                        {aiInsight.reasoning}
                      </p>
                      <div className="text-xs text-purple-300">
                        Timeframe: {aiInsight.timeframe}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Actions Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="fixed bottom-24 right-4 z-40 w-96"
            >
              <Card className="bg-gray-900/95 backdrop-blur-md border-purple-500/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Quick Actions
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Category Filter */}
                  <div className="flex gap-1 mb-4 overflow-x-auto">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-1 whitespace-nowrap ${
                          activeCategory === category.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'border-gray-600 text-gray-300'
                        }`}
                      >
                        <category.icon className="w-3 h-3" />
                        {category.label}
                      </Button>
                    ))}
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {filteredActions.map((action, index) => (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: index * 0.1 }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className="h-auto p-4 border-gray-700 hover:border-purple-400 w-full flex flex-col items-start gap-2 relative overflow-hidden group"
                          onClick={() => handleActionClick(action)}
                        >
                          {/* Background Gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                          
                          <div className="flex items-center gap-2 w-full">
                            <div className={`w-6 h-6 bg-gradient-to-r ${action.color} rounded flex items-center justify-center relative`}>
                              <action.icon className="w-3 h-3 text-white" />
                              {action.aiPowered && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                                />
                              )}
                            </div>
                            {action.aiPowered && (
                              <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs">
                                AI
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-left w-full">
                            <div className="font-medium text-sm text-white">
                              {action.title}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {action.description}
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  {/* AI Status */}
                  <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                      >
                        <Brain className="w-2 h-2 text-white" />
                      </motion.div>
                      <span className="text-sm text-purple-200">
                        AI Assistant is analyzing market conditions...
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button or Inline Button */}
      {isInline ? (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
          >
            <Zap className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      ) : (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl relative overflow-hidden group"
          >
            {/* Animated Background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-50"
            />
            
            {/* Pulse Effect */}
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-purple-400 rounded-full"
            />
            
            {/* Icon */}
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative z-10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
            </motion.div>
            
            {/* AI Indicator */}
            {showAiPulse && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: 3 }}
                className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border border-white"
              />
            )}
          </Button>
        </motion.div>
      )}
    </>
  );
}