import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Shield, 
  Users, 
  MessageSquare,
  Settings,
  Bell,
  Search,
  Zap,
  Target,
  Star,
  ChevronDown,
  ChevronUp,
  Activity,
  BarChart3,
  Wallet,
  BookOpen,
  Gift,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  route: string;
  category: "trading" | "portfolio" | "security" | "social" | "learning";
  priority: "high" | "medium" | "low";
  frequency: number;
  lastUsed?: Date;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "new-trade",
    label: "New Trade",
    icon: TrendingUp,
    route: "/trading",
    category: "trading",
    priority: "high",
    frequency: 0
  },
  {
    id: "portfolio",
    label: "Portfolio",
    icon: Wallet,
    route: "/portfolio",
    category: "portfolio",
    priority: "high",
    frequency: 0
  },
  {
    id: "security-settings",
    label: "Security",
    icon: Shield,
    route: "/security",
    category: "security",
    priority: "medium",
    frequency: 0
  },
  {
    id: "market-analysis",
    label: "Markets",
    icon: BarChart3,
    route: "/markets",
    category: "trading",
    priority: "high",
    frequency: 0
  },
  {
    id: "social-feed",
    label: "Community",
    icon: Users,
    route: "/social-leaderboard",
    category: "social",
    priority: "medium",
    frequency: 0
  },
  {
    id: "learning-center",
    label: "Learn",
    icon: BookOpen,
    route: "/education",
    category: "learning",
    priority: "medium",
    frequency: 0
  },
  {
    id: "notifications",
    label: "Alerts",
    icon: Bell,
    route: "/notifications",
    category: "trading",
    priority: "low",
    frequency: 0
  },
  {
    id: "rewards",
    label: "Rewards",
    icon: Gift,
    route: "/rewards",
    category: "social",
    priority: "low",
    frequency: 0
  }
];

export default function QuickActionFloatingMenu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [actions, setActions] = useState(QUICK_ACTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  // AI-powered suggestions based on usage patterns
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Simulate AI learning user patterns
    const generateAISuggestions = () => {
      const frequentActions = actions
        .filter(action => action.frequency > 2)
        .map(action => action.id);
      
      if (frequentActions.length === 0) {
        setAiSuggestions(["new-trade", "portfolio", "market-analysis"]);
      } else {
        setAiSuggestions(frequentActions.slice(0, 3));
      }
    };

    generateAISuggestions();
  }, [actions]);

  const handleActionClick = (action: QuickAction) => {
    // Update frequency and last used
    setActions(prev => prev.map(a => 
      a.id === action.id 
        ? { ...a, frequency: a.frequency + 1, lastUsed: new Date() }
        : a
    ));

    // Navigate to route
    setLocation(action.route);
    setIsExpanded(false);
  };

  const getTopActions = () => {
    return actions
      .filter(action => selectedCategory === "all" || action.category === selectedCategory)
      .sort((a, b) => {
        // Sort by priority and frequency
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const scoreA = priorityWeight[a.priority] + a.frequency;
        const scoreB = priorityWeight[b.priority] + b.frequency;
        return scoreB - scoreA;
      })
      .slice(0, 6);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "trading": return "bg-blue-100 text-blue-700 border-blue-200";
      case "portfolio": return "bg-green-100 text-green-700 border-green-200";
      case "security": return "bg-red-100 text-red-700 border-red-200";
      case "social": return "bg-purple-100 text-purple-700 border-purple-200";
      case "learning": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const categories = ["all", "trading", "portfolio", "security", "social", "learning"];

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-20 sm:bottom-24 left-4 sm:left-6 z-40"
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4"
          >
            <Card className="w-72 sm:w-80 shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 max-h-[70vh] overflow-y-auto">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Quick Actions
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsVisible(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-medium text-gray-600">AI Suggestions</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {aiSuggestions.map(suggestionId => {
                        const action = actions.find(a => a.id === suggestionId);
                        if (!action) return null;
                        return (
                          <motion.button
                            key={suggestionId}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleActionClick(action)}
                            className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full hover:bg-yellow-200 transition-colors"
                          >
                            {action.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Category Filter */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-2 py-1 text-xs rounded-full border transition-all ${
                          selectedCategory === category 
                            ? "bg-blue-100 text-blue-700 border-blue-200" 
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {getTopActions().map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleActionClick(action)}
                      className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                          <action.icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">
                          {action.label}
                        </span>
                        {action.frequency > 0 && (
                          <Badge variant="secondary" className="text-xs px-1">
                            {action.frequency}
                          </Badge>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Usage Stats */}
                <div className="mt-4 p-2 bg-white/50 rounded-lg">
                  <div className="text-xs text-gray-500 text-center">
                    {actions.reduce((sum, action) => sum + action.frequency, 0)} total actions performed
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-xl border-2 border-white"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-white" />
            ) : (
              <Plus className="w-5 h-5 text-white" />
            )}
          </motion.div>
        </Button>
      </motion.div>

      {/* Notification Badge */}
      {aiSuggestions.length > 0 && !isExpanded && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-xs font-bold text-white">{aiSuggestions.length}</span>
        </motion.div>
      )}
    </motion.div>
  );
}