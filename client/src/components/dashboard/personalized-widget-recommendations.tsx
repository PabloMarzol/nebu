import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, Target, BarChart3, Shield, Star, Plus, X, Settings, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Widget {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'trading' | 'analytics' | 'security' | 'social' | 'tools';
  relevanceScore: number;
  isActive: boolean;
  size: 'small' | 'medium' | 'large';
  recommendationReason: string;
  personalizedData?: any;
}

const availableWidgets: Widget[] = [
  {
    id: 'quick-trade',
    title: 'Lightning Quick Trade',
    description: 'One-click trading for your favorite pairs',
    icon: <Zap className="w-5 h-5" />,
    category: 'trading',
    relevanceScore: 0,
    isActive: false,
    size: 'medium',
    recommendationReason: 'Based on your active trading patterns'
  },
  {
    id: 'portfolio-pie',
    title: 'Portfolio Breakdown',
    description: 'Visual pie chart of your holdings',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'analytics',
    relevanceScore: 0,
    isActive: false,
    size: 'small',
    recommendationReason: 'Perfect for portfolio visualization'
  },
  {
    id: 'profit-tracker',
    title: 'Profit Performance',
    description: 'Real-time P&L tracking with goals',
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'analytics',
    relevanceScore: 0,
    isActive: false,
    size: 'large',
    recommendationReason: 'Essential for performance monitoring'
  },
  {
    id: 'security-monitor',
    title: 'Security Dashboard',
    description: 'Account security status and alerts',
    icon: <Shield className="w-5 h-5" />,
    category: 'security',
    relevanceScore: 0,
    isActive: false,
    size: 'medium',
    recommendationReason: 'Recommended for account protection'
  },
  {
    id: 'trade-goals',
    title: 'Trading Goals Tracker',
    description: 'Set and track your trading objectives',
    icon: <Target className="w-5 h-5" />,
    category: 'tools',
    relevanceScore: 0,
    isActive: false,
    size: 'small',
    recommendationReason: 'Great for goal-oriented traders'
  },
  {
    id: 'social-feed',
    title: 'Trader Social Feed',
    description: 'Connect with other traders and insights',
    icon: <Star className="w-5 h-5" />,
    category: 'social',
    relevanceScore: 0,
    isActive: false,
    size: 'medium',
    recommendationReason: 'Learn from the trading community'
  }
];

interface PersonalizedWidgetRecommendationsProps {
  onWidgetToggle?: (widgetId: string, isActive: boolean) => void;
  userProfile?: {
    tradingLevel: 'beginner' | 'intermediate' | 'advanced';
    primaryGoals: string[];
    riskTolerance: 'low' | 'medium' | 'high';
    tradingFrequency: 'daily' | 'weekly' | 'monthly';
  };
  isInline?: boolean;
}

export default function PersonalizedWidgetRecommendations({ 
  onWidgetToggle,
  userProfile = {
    tradingLevel: 'intermediate',
    primaryGoals: ['profit', 'learning'],
    riskTolerance: 'medium',
    tradingFrequency: 'daily'
  },
  isInline = false
}: PersonalizedWidgetRecommendationsProps) {
  const [widgets, setWidgets] = useState<Widget[]>(availableWidgets);
  const [isOpen, setIsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Widget[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Auto-dismiss modal after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const dismissTimer = setTimeout(() => {
        console.log("Auto-dismissing widget recommendations after 5 seconds");
        setIsOpen(false);
      }, 5000);

      return () => clearTimeout(dismissTimer);
    }
  }, [isOpen]);

  // AI-powered recommendation engine
  const calculateRelevanceScore = (widget: Widget) => {
    let score = 50; // Base score
    
    // Adjust based on user profile
    if (userProfile.tradingLevel === 'beginner') {
      if (widget.category === 'security' || widget.category === 'tools') score += 30;
      if (widget.id === 'trade-goals') score += 25;
    } else if (userProfile.tradingLevel === 'advanced') {
      if (widget.category === 'analytics' || widget.category === 'trading') score += 25;
      if (widget.id === 'quick-trade') score += 30;
    }
    
    // Goal-based recommendations
    if (userProfile.primaryGoals.includes('profit')) {
      if (widget.id === 'profit-tracker') score += 40;
      if (widget.category === 'analytics') score += 20;
    }
    
    if (userProfile.primaryGoals.includes('learning')) {
      if (widget.id === 'social-feed') score += 35;
      if (widget.category === 'social') score += 15;
    }
    
    // Frequency-based adjustments
    if (userProfile.tradingFrequency === 'daily') {
      if (widget.id === 'quick-trade' || widget.id === 'profit-tracker') score += 25;
    }
    
    // Risk tolerance adjustments
    if (userProfile.riskTolerance === 'low') {
      if (widget.category === 'security') score += 20;
    }
    
    return Math.min(100, score);
  };

  // Generate personalized recommendations (only once on mount)
  useEffect(() => {
    const updatedWidgets = availableWidgets.map(widget => ({
      ...widget,
      relevanceScore: calculateRelevanceScore(widget)
    }));
    
    setWidgets(updatedWidgets);
    
    // Get top recommendations
    const topRecommendations = updatedWidgets
      .filter(w => !w.isActive && w.relevanceScore >= 70)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
    
    setRecommendations(topRecommendations);
  }, []); // Empty dependency array to run only once

  const categories = [
    { id: 'all', label: 'All Widgets', icon: <Settings className="w-4 h-4" /> },
    { id: 'trading', label: 'Trading', icon: <Zap className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Star className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', icon: <Target className="w-4 h-4" /> },
  ];

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, isActive: !w.isActive } : w
    ));
    
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      onWidgetToggle?.(widgetId, !widget.isActive);
    }
  };

  const filteredWidgets = selectedCategory === 'all' 
    ? widgets 
    : widgets.filter(w => w.category === selectedCategory);

  return (
    <>
      {/* Floating Widget Recommendations Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-1/2 left-6 z-30 transform -translate-y-1/2"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg border-0 relative"
          size="sm"
        >
          <Brain className="w-6 h-6 text-white" />
          
          {/* Recommendation Count Badge */}
          {recommendations.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {recommendations.length}
            </div>
          )}
          
          {/* Pulse Animation */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-blue-400/30"
          />
        </Button>
      </motion.div>

      {/* Quick Recommendations Preview */}
      <AnimatePresence>
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed top-1/2 left-20 z-20 transform -translate-y-1/2"
          >
            <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-lg p-3 max-w-xs">
              <div className="text-sm font-medium text-white mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2 text-blue-400" />
                AI Recommendations
              </div>
              <div className="space-y-2">
                {recommendations.slice(0, 2).map((widget) => (
                  <motion.div
                    key={widget.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between text-xs text-gray-300 bg-gray-800/50 rounded p-2 cursor-pointer"
                    onClick={() => toggleWidget(widget.id)}
                  >
                    <div className="flex items-center">
                      <div className="text-blue-400 mr-2">{widget.icon}</div>
                      <span>{widget.title}</span>
                    </div>
                    <Plus className="w-3 h-3 text-green-400" />
                  </motion.div>
                ))}
              </div>
              <Button
                onClick={() => setIsOpen(true)}
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                View All Suggestions
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Widget Recommendations Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 pt-20"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                    <Brain className="w-6 h-6 mr-3 text-blue-400" />
                    Smart Widget Recommendations
                  </h3>
                  <p className="text-gray-400">
                    AI-powered suggestions based on your trading profile and goals
                  </p>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* User Profile Summary */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="text-white font-medium mb-2">Your Profile</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Level:</span>
                    <span className="text-blue-400 ml-2 capitalize">{userProfile.tradingLevel}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Risk:</span>
                    <span className="text-purple-400 ml-2 capitalize">{userProfile.riskTolerance}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Frequency:</span>
                    <span className="text-green-400 ml-2 capitalize">{userProfile.tradingFrequency}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Goals:</span>
                    <span className="text-yellow-400 ml-2">{userProfile.primaryGoals.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Top Recommendations */}
              {recommendations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    Top AI Recommendations
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {recommendations.map((widget, index) => (
                      <motion.div
                        key={widget.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                {widget.icon}
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-yellow-400 font-medium">
                                  {widget.relevanceScore}% Match
                                </div>
                                <div className="text-xs text-gray-400">AI Score</div>
                              </div>
                            </div>
                            <h5 className="text-white font-medium mb-2">{widget.title}</h5>
                            <p className="text-gray-400 text-sm mb-3">{widget.description}</p>
                            <div className="text-xs text-yellow-300 mb-3 bg-yellow-500/10 rounded p-2">
                              💡 {widget.recommendationReason}
                            </div>
                            <Button
                              onClick={() => toggleWidget(widget.id)}
                              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Widget
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      className={`${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {category.icon}
                      <span className="ml-2">{category.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* All Widgets Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWidgets.map((widget, index) => (
                  <motion.div
                    key={widget.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`${
                      widget.isActive
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-gray-800/50 border-gray-600 hover:border-gray-500'
                    } transition-all duration-300`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            widget.isActive ? 'bg-green-500/20' : 'bg-gray-700/50'
                          }`}>
                            {widget.icon}
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400 font-medium">
                              {widget.relevanceScore}% Relevant
                            </div>
                            <div className="text-xs text-gray-500 capitalize">{widget.size}</div>
                          </div>
                        </div>
                        
                        <h5 className="text-white font-medium mb-2">{widget.title}</h5>
                        <p className="text-gray-400 text-sm mb-4">{widget.description}</p>
                        
                        <Button
                          onClick={() => toggleWidget(widget.id)}
                          variant={widget.isActive ? "destructive" : "default"}
                          size="sm"
                          className="w-full"
                        >
                          {widget.isActive ? (
                            <>
                              <X className="w-4 h-4 mr-2" />
                              Remove
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Widget
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}