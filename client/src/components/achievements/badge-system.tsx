import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Crown, 
  Gem, 
  Target, 
  Zap, 
  Shield, 
  Rocket,
  Medal,
  Award,
  Sparkles,
  Gift,
  Lock,
  Unlock,
  TrendingUp,
  Users,
  Brain,
  DollarSign
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'trading' | 'portfolio' | 'social' | 'learning' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: typeof Trophy;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  requirements: string[];
  reward?: string;
}

const achievements: Achievement[] = [
  {
    id: 'first-trade',
    title: 'Trading Initiate',
    description: 'Execute your first successful trade',
    category: 'trading',
    rarity: 'common',
    icon: Target,
    points: 100,
    unlocked: true,
    unlockedAt: new Date('2024-06-25'),
    progress: 1,
    maxProgress: 1,
    requirements: ['Complete 1 trade'],
    reward: 'Trading fee discount'
  },
  {
    id: 'portfolio-builder',
    title: 'Portfolio Architect',
    description: 'Build a diversified portfolio with 5+ assets',
    category: 'portfolio',
    rarity: 'rare',
    icon: Gem,
    points: 250,
    unlocked: true,
    unlockedAt: new Date('2024-06-24'),
    progress: 5,
    maxProgress: 5,
    requirements: ['Hold 5 different cryptocurrencies'],
    reward: 'Portfolio analytics unlock'
  },
  {
    id: 'profit-master',
    title: 'Profit Master',
    description: 'Achieve 50% portfolio gains',
    category: 'trading',
    rarity: 'epic',
    icon: Crown,
    points: 500,
    unlocked: false,
    progress: 32,
    maxProgress: 50,
    requirements: ['Reach 50% total portfolio gains'],
    reward: 'VIP trading features'
  },
  {
    id: 'ai-savant',
    title: 'AI Trading Savant',
    description: 'Follow 100 AI recommendations successfully',
    category: 'learning',
    rarity: 'legendary',
    icon: Brain,
    points: 1000,
    unlocked: false,
    progress: 23,
    maxProgress: 100,
    requirements: ['Successfully follow 100 AI recommendations'],
    reward: 'Advanced AI features'
  },
  {
    id: 'diamond-hands',
    title: 'Diamond Hands',
    description: 'Hold positions through 30% volatility',
    category: 'trading',
    rarity: 'epic',
    icon: Shield,
    points: 750,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    requirements: ['Survive 5 major market corrections'],
    reward: 'Risk management tools'
  },
  {
    id: 'social-butterfly',
    title: 'Community Leader',
    description: 'Help 50 users with trading advice',
    category: 'social',
    rarity: 'rare',
    icon: Users,
    points: 300,
    unlocked: false,
    progress: 12,
    maxProgress: 50,
    requirements: ['Provide helpful advice to 50 users'],
    reward: 'Community features unlock'
  },
  {
    id: 'millionaire',
    title: 'Crypto Millionaire',
    description: 'Reach $1,000,000 portfolio value',
    category: 'portfolio',
    rarity: 'mythic',
    icon: DollarSign,
    points: 2500,
    unlocked: false,
    progress: 125420,
    maxProgress: 1000000,
    requirements: ['Achieve $1M portfolio value'],
    reward: 'Exclusive millionaire perks'
  },
  {
    id: 'speed-trader',
    title: 'Lightning Trader',
    description: 'Execute 100 trades in 24 hours',
    category: 'trading',
    rarity: 'epic',
    icon: Zap,
    points: 600,
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    requirements: ['Complete 100 trades in 24 hours'],
    reward: 'High-frequency trading tools'
  }
];

export default function BadgeSystem() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const points = achievements
      .filter(achievement => achievement.unlocked)
      .reduce((sum, achievement) => sum + achievement.points, 0);
    setTotalPoints(points);
  }, []);

  const categories = [
    { id: 'all', label: 'All Badges', count: achievements.length },
    { id: 'trading', label: 'Trading', count: achievements.filter(a => a.category === 'trading').length },
    { id: 'portfolio', label: 'Portfolio', count: achievements.filter(a => a.category === 'portfolio').length },
    { id: 'social', label: 'Social', count: achievements.filter(a => a.category === 'social').length },
    { id: 'learning', label: 'Learning', count: achievements.filter(a => a.category === 'learning').length },
    { id: 'special', label: 'Special', count: achievements.filter(a => a.category === 'special').length }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlockedMatch = !showUnlockedOnly || achievement.unlocked;
    return categoryMatch && unlockedMatch;
  });

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return {
          color: 'from-gray-500 to-gray-600',
          borderColor: 'border-gray-400',
          textColor: 'text-gray-400',
          bgColor: 'bg-gray-500/10'
        };
      case 'rare':
        return {
          color: 'from-blue-500 to-blue-600',
          borderColor: 'border-blue-400',
          textColor: 'text-blue-400',
          bgColor: 'bg-blue-500/10'
        };
      case 'epic':
        return {
          color: 'from-purple-500 to-purple-600',
          borderColor: 'border-purple-400',
          textColor: 'text-purple-400',
          bgColor: 'bg-purple-500/10'
        };
      case 'legendary':
        return {
          color: 'from-yellow-500 to-orange-500',
          borderColor: 'border-yellow-400',
          textColor: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10'
        };
      case 'mythic':
        return {
          color: 'from-pink-500 to-red-500',
          borderColor: 'border-pink-400',
          textColor: 'text-pink-400',
          bgColor: 'bg-pink-500/10'
        };
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          borderColor: 'border-gray-400',
          textColor: 'text-gray-400',
          bgColor: 'bg-gray-500/10'
        };
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const completionRate = (unlockedCount / achievements.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Achievement System
          </CardTitle>
          <CardDescription className="text-purple-200">
            Unlock badges and earn rewards by mastering the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-400/20"
            >
              <motion.div 
                className="text-3xl font-bold text-yellow-400"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {totalPoints.toLocaleString()}
              </motion.div>
              <div className="text-sm text-yellow-200">Total Points</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-green-500/10 rounded-lg border border-green-400/20"
            >
              <div className="text-3xl font-bold text-green-400">{unlockedCount}</div>
              <div className="text-sm text-green-200">Badges Unlocked</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-400/20"
            >
              <div className="text-3xl font-bold text-blue-400">{completionRate.toFixed(0)}%</div>
              <div className="text-sm text-blue-200">Completion Rate</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-400/20"
            >
              <div className="text-3xl font-bold text-purple-400">{achievements.length - unlockedCount}</div>
              <div className="text-sm text-purple-200">Remaining</div>
            </motion.div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-purple-200">Progress to next milestone</span>
              <span className="text-white">{completionRate.toFixed(1)}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={`${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : 'border-gray-600 text-gray-300'
            }`}
          >
            {category.label} ({category.count})
          </Button>
        ))}
        
        <Button
          variant={showUnlockedOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
          className={showUnlockedOnly ? 'bg-green-600' : 'border-gray-600 text-gray-300'}
        >
          {showUnlockedOnly ? <Unlock className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />}
          {showUnlockedOnly ? 'Unlocked Only' : 'Show All'}
        </Button>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement, index) => {
          const rarityConfig = getRarityConfig(achievement.rarity);
          const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.1 }
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="relative"
            >
              <Card className={`${
                achievement.unlocked 
                  ? `${rarityConfig.bgColor} border-2 ${rarityConfig.borderColor}` 
                  : 'bg-gray-900/50 border-gray-700'
              } transition-all duration-300 relative overflow-hidden`}>
                
                {/* Animated Background for Unlocked */}
                {achievement.unlocked && (
                  <motion.div
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`absolute inset-0 bg-gradient-to-r ${rarityConfig.color} opacity-5`}
                    style={{
                      backgroundSize: '200% 200%'
                    }}
                  />
                )}
                
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={achievement.unlocked ? { 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: achievement.unlocked ? Infinity : 0 }}
                        className={`w-12 h-12 bg-gradient-to-r ${rarityConfig.color} rounded-lg flex items-center justify-center ${
                          !achievement.unlocked && 'grayscale opacity-50'
                        }`}
                      >
                        <achievement.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      
                      <div>
                        <CardTitle className={`text-lg ${
                          achievement.unlocked ? 'text-white' : 'text-gray-400'
                        }`}>
                          {achievement.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`${rarityConfig.borderColor} ${rarityConfig.textColor} text-xs capitalize`}
                          >
                            {achievement.rarity}
                          </Badge>
                          <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs">
                            {achievement.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {achievement.unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <Trophy className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <p className={`text-sm mb-4 ${
                    achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">
                            {achievement.progress.toLocaleString()} / {achievement.maxProgress.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Requirements:</div>
                        <ul className="text-xs text-gray-300 space-y-1">
                          {achievement.requirements.map((req, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-purple-400 rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-gray-400">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                  
                  {achievement.reward && (
                    <div className="mt-3 p-2 bg-yellow-500/10 rounded border border-yellow-400/20">
                      <div className="flex items-center gap-1">
                        <Gift className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-300">Reward: {achievement.reward}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Unlock Animation */}
      <AnimatePresence>
        {recentUnlock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setRecentUnlock(null)}
          >
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-8 text-center max-w-md mx-4">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-10 h-10" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-2">Achievement Unlocked!</h3>
              <h4 className="text-xl mb-2">{recentUnlock.title}</h4>
              <p className="text-yellow-100 mb-4">{recentUnlock.description}</p>
              <div className="text-lg font-bold">+{recentUnlock.points} Points!</div>
              
              <Button
                onClick={() => setRecentUnlock(null)}
                className="mt-4 bg-white text-orange-500 hover:bg-gray-100"
              >
                Awesome!
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}