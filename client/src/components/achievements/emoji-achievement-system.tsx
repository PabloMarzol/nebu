import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Gift, Zap, Target, Crown } from "lucide-react";

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: 'trading' | 'portfolio' | 'social' | 'learning' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: number;
  current: number;
  reward: {
    xp: number;
    bonus?: string;
  };
  unlocked: boolean;
  dateUnlocked?: Date;
}

const tradingAchievements: Achievement[] = [
  {
    id: 'first-trade',
    emoji: '🎯',
    title: 'First Shot',
    description: 'Complete your first trade',
    category: 'trading',
    rarity: 'common',
    requirement: 1,
    current: 0,
    reward: { xp: 100, bonus: 'Trading confidence boost!' },
    unlocked: false
  },
  {
    id: 'profit-master',
    emoji: '💰',
    title: 'Profit Master',
    description: 'Make 10 profitable trades',
    category: 'trading',
    rarity: 'rare',
    requirement: 10,
    current: 0,
    reward: { xp: 500, bonus: 'Reduced trading fees for 24h' },
    unlocked: false
  },
  {
    id: 'diamond-hands',
    emoji: '💎',
    title: 'Diamond Hands',
    description: 'Hold a position for 30 days',
    category: 'trading',
    rarity: 'epic',
    requirement: 30,
    current: 0,
    reward: { xp: 1000, bonus: 'Diamond badge & special flair' },
    unlocked: false
  },
  {
    id: 'whale-trader',
    emoji: '🐋',
    title: 'Whale Trader',
    description: 'Execute a trade worth $100K+',
    category: 'trading',
    rarity: 'legendary',
    requirement: 100000,
    current: 0,
    reward: { xp: 2500, bonus: 'VIP support access' },
    unlocked: false
  },
  {
    id: 'hodl-champion',
    emoji: '🚀',
    title: 'HODL Champion',
    description: 'Portfolio value increased by 100%',
    category: 'portfolio',
    rarity: 'epic',
    requirement: 100,
    current: 0,
    reward: { xp: 1500, bonus: 'HODL champion badge' },
    unlocked: false
  },
  {
    id: 'diversified',
    emoji: '🌈',
    title: 'Diversified',
    description: 'Own 10 different cryptocurrencies',
    category: 'portfolio',
    rarity: 'rare',
    requirement: 10,
    current: 0,
    reward: { xp: 750, bonus: 'Portfolio analytics unlock' },
    unlocked: false
  },
  {
    id: 'early-bird',
    emoji: '🌅',
    title: 'Early Bird',
    description: 'Trade before 6 AM',
    category: 'trading',
    rarity: 'common',
    requirement: 1,
    current: 0,
    reward: { xp: 200, bonus: 'Morning trader badge' },
    unlocked: false
  },
  {
    id: 'night-owl',
    emoji: '🦉',
    title: 'Night Owl',
    description: 'Trade after midnight',
    category: 'trading',
    rarity: 'common',
    requirement: 1,
    current: 0,
    reward: { xp: 200, bonus: 'Night trader badge' },
    unlocked: false
  },
  {
    id: 'social-butterfly',
    emoji: '🦋',
    title: 'Social Butterfly',
    description: 'Share 5 trading insights',
    category: 'social',
    rarity: 'rare',
    requirement: 5,
    current: 0,
    reward: { xp: 400, bonus: 'Community contributor badge' },
    unlocked: false
  },
  {
    id: 'ai-whisperer',
    emoji: '🤖',
    title: 'AI Whisperer',
    description: 'Use AI assistant 50 times',
    category: 'learning',
    rarity: 'rare',
    requirement: 50,
    current: 0,
    reward: { xp: 600, bonus: 'Advanced AI features' },
    unlocked: false
  }
];

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

const rarityGlow = {
  common: 'shadow-gray-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-yellow-500/50'
};

export default function EmojiAchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>(tradingAchievements);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    // Load achievements from localStorage
    const saved = localStorage.getItem('nebulax-achievements');
    if (saved) {
      setAchievements(JSON.parse(saved));
    }

    // Load total XP
    const savedXP = localStorage.getItem('nebulax-total-xp');
    if (savedXP) {
      setTotalXP(parseInt(savedXP));
    }
  }, []);

  const saveAchievements = (newAchievements: Achievement[]) => {
    localStorage.setItem('nebulax-achievements', JSON.stringify(newAchievements));
    setAchievements(newAchievements);
  };

  const unlockAchievement = (achievementId: string) => {
    const updated = achievements.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlocked) {
        const unlockedAchievement = {
          ...achievement,
          unlocked: true,
          dateUnlocked: new Date()
        };
        
        // Show celebration
        setNewAchievement(unlockedAchievement);
        
        // Add XP
        const newXP = totalXP + achievement.reward.xp;
        setTotalXP(newXP);
        localStorage.setItem('nebulax-total-xp', newXP.toString());
        
        return unlockedAchievement;
      }
      return achievement;
    });
    
    saveAchievements(updated);
  };

  const updateProgress = (achievementId: string, progress: number) => {
    const updated = achievements.map(achievement => {
      if (achievement.id === achievementId) {
        const newCurrent = Math.min(progress, achievement.requirement);
        const shouldUnlock = newCurrent >= achievement.requirement && !achievement.unlocked;
        
        if (shouldUnlock) {
          setTimeout(() => unlockAchievement(achievementId), 500);
        }
        
        return {
          ...achievement,
          current: newCurrent
        };
      }
      return achievement;
    });
    
    saveAchievements(updated);
  };

  // Simulate achievement progress (replace with real trading data)
  const simulateProgress = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      updateProgress(achievementId, achievement.current + 1);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          🏆 Achievement Gallery
        </h2>
        <p className="text-muted-foreground">Unlock epic rewards by conquering trading milestones!</p>
        
        {/* Overall progress */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{unlockedCount}/{achievements.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground">Total XP: {totalXP.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex justify-center space-x-2">
        {(['all', 'unlocked', 'locked'] as const).map(filterType => (
          <Button
            key={filterType}
            variant={filter === filterType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType)}
            className="capitalize"
          >
            {filterType}
            {filterType === 'unlocked' && ` (${unlockedCount})`}
            {filterType === 'locked' && ` (${achievements.length - unlockedCount})`}
          </Button>
        ))}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const progressPercent = (achievement.current / achievement.requirement) * 100;
          
          return (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`relative overflow-hidden transition-all duration-300 ${
                achievement.unlocked 
                  ? `border-2 border-transparent bg-gradient-to-r ${rarityColors[achievement.rarity]} p-[1px]` 
                  : 'border-border'
              } ${achievement.unlocked ? rarityGlow[achievement.rarity] : ''}`}>
                {achievement.unlocked && (
                  <div className="absolute inset-[1px] bg-background rounded-lg" />
                )}
                
                <CardHeader className="relative z-10 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{achievement.emoji}</div>
                    <div className="text-right">
                      <Badge variant={achievement.unlocked ? "default" : "secondary"} className="mb-1">
                        {achievement.rarity}
                      </Badge>
                      {achievement.unlocked && (
                        <div className="text-xs text-muted-foreground">
                          {achievement.dateUnlocked?.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 pt-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && (
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{achievement.current}/{achievement.requirement}</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{achievement.reward.xp} XP</span>
                      </span>
                      {achievement.unlocked && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    
                    {achievement.reward.bonus && (
                      <p className="text-xs text-primary">
                        💎 {achievement.reward.bonus}
                      </p>
                    )}
                    
                    {!achievement.unlocked && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => simulateProgress(achievement.id)}
                        className="w-full mt-2"
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        Test Progress
                      </Button>
                    )}
                  </div>
                </CardContent>
                
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Trophy className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Achievement unlock celebration */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            onClick={() => setNewAchievement(null)}
          >
            <motion.div
              initial={{ y: -50, rotateY: -90 }}
              animate={{ y: 0, rotateY: 0 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-6xl mb-4"
              >
                {newAchievement.emoji}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                Achievement Unlocked!
              </h3>
              <p className="text-white/90 mb-1">{newAchievement.title}</p>
              <p className="text-white/70 text-sm mb-4">{newAchievement.description}</p>
              
              <div className="flex items-center justify-center space-x-4 text-white">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5" />
                  <span>+{newAchievement.reward.xp} XP</span>
                </div>
                {newAchievement.reward.bonus && (
                  <div className="text-sm">
                    💎 {newAchievement.reward.bonus}
                  </div>
                )}
              </div>
              
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => setNewAchievement(null)}
              >
                Awesome! 🎉
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook for triggering achievements from other components
export function useAchievements() {
  const triggerAchievement = (achievementId: string, progress?: number) => {
    const event = new CustomEvent('achievement-progress', {
      detail: { achievementId, progress: progress || 1 }
    });
    window.dispatchEvent(event);
  };

  return { triggerAchievement };
}