import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  MessageCircle, 
  Lightbulb, 
  Target,
  Eye,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Bot,
  Sparkles,
  BookOpen,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

interface HelpTip {
  id: string;
  title: string;
  content: string;
  category: 'trading' | 'navigation' | 'features' | 'security' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  element?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface MikePersonality {
  mood: 'helpful' | 'excited' | 'confident' | 'encouraging' | 'playful';
  response: string;
  avatar: string;
}

export default function ContextualHelpTooltipsMike() {
  const [isActive, setIsActive] = useState(false);
  const [currentTip, setCurrentTip] = useState<HelpTip | null>(null);
  const [mikePersonality, setMikePersonality] = useState<MikePersonality>({
    mood: 'helpful',
    response: "Hey there! I'm Mike, your crypto trading assistant. What can I help you with today?",
    avatar: "👨‍💻"
  });
  const [showMike, setShowMike] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [tipHistory, setTipHistory] = useState<HelpTip[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['trading']);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const helpTips: HelpTip[] = [
    // Trading Tips
    {
      id: 'buy_sell',
      title: 'Buy & Sell Orders',
      content: "Click 'Buy & Sell Crypto Now' to access our trading interface. You can place market orders for instant execution or limit orders to buy/sell at specific prices. Mike's tip: Start with small amounts to get familiar!",
      category: 'trading',
      difficulty: 'beginner',
      tags: ['orders', 'trading', 'buy', 'sell'],
      element: 'trading-button',
      position: 'bottom'
    },
    {
      id: 'otc_desk',
      title: 'OTC Desk Pro',
      content: "Our Over-The-Counter desk is perfect for large trades without affecting market prices. Great for institutions and high-volume traders. Mike says: Think of it as your private trading room!",
      category: 'trading',
      difficulty: 'advanced',
      tags: ['otc', 'institutional', 'large-trades'],
      element: 'otc-button',
      position: 'bottom'
    },
    {
      id: 'portfolio',
      title: 'Portfolio Management',
      content: "Track all your crypto assets in one place. View performance, set alerts, and analyze your trading patterns. Mike's advice: Diversification is key - don't put all eggs in one basket!",
      category: 'trading',
      difficulty: 'intermediate',
      tags: ['portfolio', 'tracking', 'management'],
      element: 'portfolio-button',
      position: 'bottom'
    },

    // Navigation Tips
    {
      id: 'navbar',
      title: 'Navigation Menu',
      content: "Use the dropdown menus to access different platform sections. 'Platform' has trading tools, 'Portfolio' has management features, and 'Services' has additional options. Mike's tip: Bookmark your favorites!",
      category: 'navigation',
      difficulty: 'beginner',
      tags: ['navigation', 'menu', 'dropdown'],
      element: 'navbar',
      position: 'bottom'
    },
    {
      id: 'markets',
      title: 'Live Markets',
      content: "Real-time cryptocurrency prices with sorting and filtering options. Click any coin to see detailed charts and trading pairs. Mike loves watching those green numbers go up! 📈",
      category: 'navigation',
      difficulty: 'beginner',
      tags: ['markets', 'prices', 'charts'],
      element: 'markets-section',
      position: 'top'
    },

    // Features Tips
    {
      id: 'ai_assistant',
      title: 'AI Trading Assistant',
      content: "Get personalized trading recommendations powered by AI. The assistant analyzes market trends and your portfolio to suggest optimal trades. Mike thinks it's like having a crystal ball! 🔮",
      category: 'features',
      difficulty: 'intermediate',
      tags: ['ai', 'recommendations', 'analysis'],
      element: 'ai-widget',
      position: 'left'
    },
    {
      id: 'achievements',
      title: 'Trading Achievements',
      content: "Unlock badges and rewards by reaching trading milestones. Each achievement comes with XP and special perks. Mike's goal: Collect them all like trading cards! 🏆",
      category: 'features',
      difficulty: 'beginner',
      tags: ['achievements', 'rewards', 'gamification'],
      element: 'achievements-button',
      position: 'left'
    },

    // Security Tips
    {
      id: 'two_factor',
      title: 'Two-Factor Authentication',
      content: "Enable 2FA in your account settings for maximum security. It adds an extra layer of protection to your account. Mike says: Better safe than sorry when it comes to your crypto!",
      category: 'security',
      difficulty: 'beginner',
      tags: ['security', '2fa', 'protection'],
      element: 'security-settings',
      position: 'right'
    },
    {
      id: 'kyc_verification',
      title: 'KYC Verification',
      content: "Complete identity verification to unlock higher trading limits and premium features. It's required by regulations but gives you access to the full platform. Mike: Think of it as your VIP pass!",
      category: 'security',
      difficulty: 'beginner',
      tags: ['kyc', 'verification', 'limits'],
      element: 'kyc-status',
      position: 'right'
    }
  ];

  const categories = [
    { id: 'trading', label: 'Trading', icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-400' },
    { id: 'navigation', label: 'Navigation', icon: <Target className="w-4 h-4" />, color: 'text-blue-400' },
    { id: 'features', label: 'Features', icon: <Sparkles className="w-4 h-4" />, color: 'text-purple-400' },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" />, color: 'text-yellow-400' },
    { id: 'general', label: 'General', icon: <BookOpen className="w-4 h-4" />, color: 'text-gray-400' }
  ];

  const mikeResponses = {
    welcome: [
      "👋 Hey! I'm Mike, your crypto buddy. Need help navigating the platform?",
      "🚀 Ready to dive into crypto trading? I'm here to guide you every step!",
      "💡 Got questions? I've got answers! Let's make crypto trading fun and easy."
    ],
    encouragement: [
      "🎯 You're doing great! Every expert was once a beginner.",
      "💪 Keep learning! The crypto world rewards those who stay curious.",
      "⭐ Nice progress! You're becoming a crypto pro step by step."
    ],
    tips: [
      "🧠 Pro tip: Always do your own research before making any trades!",
      "📊 Remember: Don't invest more than you can afford to lose.",
      "🔄 Diversification is your friend in the volatile crypto market!"
    ]
  };

  const getMikeResponse = (tipCategory: string, userLevel: string = 'beginner') => {
    const responses: Record<string, string[]> = {
      trading: [
        "💹 Trading can be exciting! Remember to start small and learn the ropes.",
        "📈 I love helping with trading questions! The key is patience and practice.",
        "🎲 Trading is part skill, part timing. Let me help you with the skill part!"
      ],
      navigation: [
        "🗺️ Lost? No worries! I'll help you find your way around the platform.",
        "🧭 Navigation is easy once you know the tricks. Let me show you!",
        "📍 Think of me as your GPS for crypto trading!"
      ],
      features: [
        "✨ Our features are designed to make your life easier. Let me explain!",
        "🛠️ Cool features ahead! I'll help you unlock their full potential.",
        "🎮 These features are like power-ups for your trading game!"
      ],
      security: [
        "🔒 Security first! I'm glad you're thinking about protecting your assets.",
        "🛡️ Your security is my priority. Let's set everything up properly!",
        "🔐 Smart thinking! Secure traders are successful traders."
      ]
    };

    const categoryResponses = responses[tipCategory] || responses.trading;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const showTip = (tip: HelpTip) => {
    setCurrentTip(tip);
    setMikePersonality({
      mood: 'helpful',
      response: getMikeResponse(tip.category),
      avatar: "👨‍💻"
    });
    
    // Add to history if not already there
    if (!tipHistory.find(t => t.id === tip.id)) {
      setTipHistory([tip, ...tipHistory.slice(0, 4)]);
    }
  };

  const getSmartTip = (context: string) => {
    // Contextual tip suggestions based on current page/action
    const contextTips: Record<string, string[]> = {
      homepage: ['buy_sell', 'navbar', 'markets'],
      trading: ['buy_sell', 'portfolio', 'otc_desk'],
      portfolio: ['portfolio', 'achievements', 'ai_assistant'],
      markets: ['markets', 'buy_sell', 'ai_assistant'],
      settings: ['two_factor', 'kyc_verification']
    };

    const relevantTips = contextTips[context] || ['navbar'];
    const tipId = relevantTips[Math.floor(Math.random() * relevantTips.length)];
    const tip = helpTips.find(t => t.id === tipId);
    
    if (tip) showTip(tip);
  };

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(c => c !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  useEffect(() => {
    const handleShowHelp = (event: any) => {
      const context = event.detail?.context || 'homepage';
      setIsActive(true);
      getSmartTip(context);
    };

    window.addEventListener('showContextualHelp', handleShowHelp);
    return () => window.removeEventListener('showContextualHelp', handleShowHelp);
  }, []);

  // Auto-show Mike on first visit
  useEffect(() => {
    const hasSeenMike = localStorage.getItem('hasSeenMike');
    if (!hasSeenMike) {
      setTimeout(() => {
        setShowMike(true);
        localStorage.setItem('hasSeenMike', 'true');
      }, 3000);
    }
  }, []);

  return (
    <>
      {/* Mike's Floating Assistant */}
      <AnimatePresence>
        {(showMike || isActive) && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-4 right-20 z-50 w-80"
          >
            <Card className="bg-black/90 backdrop-blur-lg border-blue-500/30 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl"
                    >
                      {mikePersonality.avatar}
                    </motion.div>
                    <span>Mike's Help Center</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowMike(false);
                      setIsActive(false);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mike's Response */}
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <p className="text-sm">{mikePersonality.response}</p>
                </div>

                {/* Current Tip */}
                {currentTip && (
                  <div className="bg-white/5 p-3 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                      {currentTip.title}
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">{currentTip.content}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className="text-xs">{currentTip.category}</Badge>
                      <Badge variant="outline" className="text-xs">{currentTip.difficulty}</Badge>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => getSmartTip('homepage')}
                    className="text-xs"
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Smart Tip
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsActive(!isActive)}
                    className="text-xs"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Browse All
                  </Button>
                </div>

                {/* Recent Tips */}
                {tipHistory.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium mb-2 text-gray-400">Recent Tips</h5>
                    <div className="space-y-1">
                      {tipHistory.slice(0, 3).map((tip) => (
                        <button
                          key={tip.id}
                          onClick={() => showTip(tip)}
                          className="w-full text-left text-xs text-blue-300 hover:text-blue-200 truncate"
                        >
                          • {tip.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Browser Modal */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsActive(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="bg-black/90 backdrop-blur-lg border-blue-500/30 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Bot className="w-5 h-5 text-blue-400" />
                      <span>Mike's Complete Help Guide</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsActive(false)}
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  {categories.map((category) => {
                    const categoryTips = helpTips.filter(tip => tip.category === category.id);
                    const isExpanded = expandedCategories.includes(category.id);
                    
                    return (
                      <div key={category.id}>
                        <Button
                          variant="ghost"
                          onClick={() => toggleCategory(category.id)}
                          className="w-full justify-between p-0 h-auto mb-3"
                        >
                          <span className={`flex items-center space-x-2 ${category.color}`}>
                            {category.icon}
                            <span className="font-semibold">{category.label}</span>
                            <Badge variant="outline" className="ml-2">
                              {categoryTips.length}
                            </Badge>
                          </span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4"
                            >
                              {categoryTips.map((tip) => (
                                <motion.div
                                  key={tip.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="cursor-pointer"
                                  onClick={() => showTip(tip)}
                                >
                                  <Card className="bg-white/5 border-white/20 hover:bg-white/10 transition-colors">
                                    <CardContent className="p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-sm">{tip.title}</h4>
                                        <ArrowRight className="w-3 h-3 text-gray-400" />
                                      </div>
                                      <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                                        {tip.content.substring(0, 100)}...
                                      </p>
                                      <div className="flex items-center space-x-1">
                                        <Badge variant="outline" className="text-xs">
                                          {tip.difficulty}
                                        </Badge>
                                        {tip.tags.slice(0, 2).map((tag) => (
                                          <Badge key={tag} className="text-xs bg-blue-500/20">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Button */}
      {!showMike && !isActive && (
        <Button
          onClick={() => setShowMike(true)}
          className="fixed bottom-68 right-4 z-50 rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          title="Ask Mike for Help"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      )}
    </>
  );
}

// Hook for triggering contextual help
export function useContextualHelp() {
  const showHelp = (context?: string) => {
    window.dispatchEvent(new CustomEvent('showContextualHelp', { detail: { context } }));
  };

  return { showHelp };
}