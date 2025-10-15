import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  Crown,
  Flame,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Shield,
  Rocket,
  Diamond,
  Award,
  CheckCircle,
  Lock,
  Gift
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'trading' | 'social' | 'learning' | 'milestones' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress: number;
  target: number;
  unit: string;
  reward: string;
  unlocked: boolean;
  dateUnlocked?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function DynamicTradingAchievements() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);
  const [celebrationMode, setCelebrationMode] = useState<string | null>(null);

  const achievements: Achievement[] = [
    // Trading Achievements
    {
      id: 'first_trade',
      title: 'First Steps',
      description: 'Execute your first trade',
      icon: <Rocket className="w-5 h-5" />,
      category: 'trading',
      tier: 'bronze',
      progress: 1,
      target: 1,
      unit: 'trade',
      reward: '100 XP + Trading Guide',
      unlocked: true,
      dateUnlocked: new Date(Date.now() - 86400000),
      rarity: 'common'
    },
    {
      id: 'volume_warrior',
      title: 'Volume Warrior',
      description: 'Trade $10,000 in total volume',
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'trading',
      tier: 'silver',
      progress: 7500,
      target: 10000,
      unit: '$',
      reward: '500 XP + Fee Discount',
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'diamond_hands',
      title: 'Diamond Hands',
      description: 'Hold a position for 30 days',
      icon: <Diamond className="w-5 h-5" />,
      category: 'trading',
      tier: 'gold',
      progress: 23,
      target: 30,
      unit: 'days',
      reward: '1000 XP + Diamond Badge',
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'profit_master',
      title: 'Profit Master',
      description: 'Achieve 50% portfolio growth',
      icon: <Crown className="w-5 h-5" />,
      category: 'trading',
      tier: 'platinum',
      progress: 32,
      target: 50,
      unit: '%',
      reward: '2000 XP + Crown Badge',
      unlocked: false,
      rarity: 'legendary'
    },

    // Milestone Achievements
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Login for 7 consecutive days',
      icon: <Flame className="w-5 h-5" />,
      category: 'milestones',
      tier: 'bronze',
      progress: 5,
      target: 7,
      unit: 'days',
      reward: '200 XP + Streak Bonus',
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'portfolio_builder',
      title: 'Portfolio Builder',
      description: 'Own 5 different cryptocurrencies',
      icon: <Target className="w-5 h-5" />,
      category: 'milestones',
      tier: 'silver',
      progress: 3,
      target: 5,
      unit: 'assets',
      reward: '300 XP + Diversity Badge',
      unlocked: false,
      rarity: 'rare'
    },

    // Social Achievements
    {
      id: 'social_trader',
      title: 'Social Trader',
      description: 'Follow 10 successful traders',
      icon: <Users className="w-5 h-5" />,
      category: 'social',
      tier: 'bronze',
      progress: 7,
      target: 10,
      unit: 'follows',
      reward: '150 XP + Social Badge',
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'copy_trader',
      title: 'Copy Trading Pro',
      description: 'Use copy trading for 30 days',
      icon: <Shield className="w-5 h-5" />,
      category: 'social',
      tier: 'gold',
      progress: 12,
      target: 30,
      unit: 'days',
      reward: '800 XP + Pro Badge',
      unlocked: false,
      rarity: 'epic'
    },

    // Learning Achievements
    {
      id: 'knowledge_seeker',
      title: 'Knowledge Seeker',
      description: 'Complete 5 educational modules',
      icon: <Star className="w-5 h-5" />,
      category: 'learning',
      tier: 'bronze',
      progress: 3,
      target: 5,
      unit: 'modules',
      reward: '250 XP + Scholar Badge',
      unlocked: false,
      rarity: 'common'
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Score 100% on 3 quizzes',
      icon: <Award className="w-5 h-5" />,
      category: 'learning',
      tier: 'silver',
      progress: 1,
      target: 3,
      unit: 'quizzes',
      reward: '400 XP + Master Badge',
      unlocked: false,
      rarity: 'rare'
    },

    // Special Achievements
    {
      id: 'early_adopter',
      title: 'Early Adopter',
      description: 'Join during beta period',
      icon: <Zap className="w-5 h-5" />,
      category: 'special',
      tier: 'platinum',
      progress: 1,
      target: 1,
      unit: 'achievement',
      reward: '5000 XP + Exclusive Badge',
      unlocked: true,
      dateUnlocked: new Date(Date.now() - 172800000),
      rarity: 'legendary'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'trading', label: 'Trading', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'milestones', label: 'Milestones', icon: <Target className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning', icon: <Star className="w-4 h-4" /> },
    { id: 'special', label: 'Special', icon: <Crown className="w-4 h-4" /> }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-orange-400 bg-orange-500/20';
      case 'silver': return 'text-gray-300 bg-gray-500/20';
      case 'gold': return 'text-yellow-400 bg-yellow-500/20';
      case 'platinum': return 'text-purple-400 bg-purple-500/20';
      case 'diamond': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500';
      case 'rare': return 'border-blue-500';
      case 'epic': return 'border-purple-500';
      case 'legendary': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + parseInt(a.reward.match(/\d+/)?.[0] || '0'), 0);

  const simulateUnlock = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    // Update achievement
    achievement.unlocked = true;
    achievement.dateUnlocked = new Date();
    
    // Trigger celebration
    setCelebrationMode(achievementId);
    setNewUnlocks([...newUnlocks, achievementId]);
    
    // Create floating celebration
    createCelebrationEffect(achievement);
    
    setTimeout(() => {
      setCelebrationMode(null);
    }, 3000);
  };

  const createCelebrationEffect = (achievement: Achievement) => {
    // Create floating achievement notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg shadow-lg animate-pulse';
    notification.innerHTML = `
      <div class="text-center">
        <div class="text-2xl mb-2">🏆</div>
        <div class="font-bold">Achievement Unlocked!</div>
        <div class="text-sm">${achievement.title}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Confetti effect
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'fixed pointer-events-none z-50';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = Math.random() * window.innerHeight + 'px';
      confetti.innerHTML = ['🎉', '⭐', '🏆', '💎', '🎊'][Math.floor(Math.random() * 5)];
      confetti.style.fontSize = '24px';
      confetti.style.animation = 'celebrationFloat 2s ease-out forwards';
      
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }
    
    setTimeout(() => notification.remove(), 3000);
  };

  useEffect(() => {
    const handleShowAchievements = () => setIsVisible(true);
    window.addEventListener('showTradingAchievements', handleShowAchievements);
    return () => window.removeEventListener('showTradingAchievements', handleShowAchievements);
  }, []);

  return (
    <>
      {/* Floating Achievement Button */}
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-56 right-4 z-50 rounded-full w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
        title="Trading Achievements"
      >
        <Trophy className="w-5 h-5" />
        {newUnlocks.length > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-xs">
            {newUnlocks.length}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="bg-black/90 backdrop-blur-lg border-yellow-500/30 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span>Trading Achievements</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsVisible(false)}
                    >
                      ×
                    </Button>
                  </CardTitle>
                  
                  {/* Stats Overview */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-400">{unlockedCount}</div>
                        <div className="text-xs text-gray-400">Unlocked</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-blue-400">{totalXP}</div>
                        <div className="text-xs text-gray-400">Total XP</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {Math.round((unlockedCount / achievements.length) * 100)}%
                        </div>
                        <div className="text-xs text-gray-400">Complete</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center space-x-1"
                      >
                        {category.icon}
                        <span>{category.label}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Achievements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative ${celebrationMode === achievement.id ? 'ring-2 ring-yellow-500 animate-pulse' : ''}`}
                      >
                        <Card className={`h-full ${
                          achievement.unlocked 
                            ? `bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-500/50 ${getRarityColor(achievement.rarity)}` 
                            : 'bg-white/5 border-white/20'
                        } transition-all hover:scale-105`}>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div className={`p-2 rounded-full ${
                                  achievement.unlocked ? 'bg-green-500' : 'bg-gray-500'
                                } text-white`}>
                                  {achievement.unlocked ? <CheckCircle className="w-4 h-4" /> : achievement.icon}
                                </div>
                                <div>
                                  <div className="font-semibold">{achievement.title}</div>
                                  <Badge className={getTierColor(achievement.tier)}>
                                    {achievement.tier}
                                  </Badge>
                                </div>
                              </div>
                              {!achievement.unlocked && (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-gray-300">{achievement.description}</p>
                            
                            {/* Progress Bar */}
                            {!achievement.unlocked && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Progress</span>
                                  <span>
                                    {achievement.progress.toLocaleString()}/{achievement.target.toLocaleString()} {achievement.unit}
                                  </span>
                                </div>
                                <Progress 
                                  value={Math.min((achievement.progress / achievement.target) * 100, 100)} 
                                  className="h-2"
                                />
                              </div>
                            )}

                            {/* Unlock Date */}
                            {achievement.unlocked && achievement.dateUnlocked && (
                              <div className="text-xs text-green-400">
                                Unlocked: {achievement.dateUnlocked.toLocaleDateString()}
                              </div>
                            )}

                            {/* Reward */}
                            <div className="flex items-center space-x-1 text-xs">
                              <Gift className="w-3 h-3 text-yellow-400" />
                              <span className="text-yellow-400">{achievement.reward}</span>
                            </div>

                            {/* Test Unlock Button (for demo) */}
                            {!achievement.unlocked && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => simulateUnlock(achievement.id)}
                                className="w-full text-xs"
                              >
                                Unlock (Demo)
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add keyframes for celebration animation */}
      <style>{`
        @keyframes celebrationFloat {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

// Hook for triggering achievements
export function useTradingAchievements() {
  const showAchievements = () => {
    window.dispatchEvent(new Event('showTradingAchievements'));
  };

  return { showAchievements };
}