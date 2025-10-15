import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Target, 
  Zap, 
  Crown, 
  Star, 
  TrendingUp,
  Shield,
  Flame,
  Award,
  Medal,
  Sparkles,
  Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  points: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'trading' | 'portfolio' | 'social' | 'milestone' | 'streak';
  requirement: string;
  reward: string;
  unlockedAt?: string;
}

const achievements: Achievement[] = [
  {
    id: 'first-trade',
    title: 'First Steps',
    description: 'Complete your first trade',
    icon: <Target className="w-5 h-5" />,
    rarity: 'common',
    points: 50,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    category: 'trading',
    requirement: 'Execute 1 trade',
    reward: 'Trading Badge + 50 XP',
    unlockedAt: '2025-07-12T10:30:00Z'
  },
  {
    id: 'profitable-week',
    title: 'Profitable Week',
    description: 'Maintain positive P&L for 7 consecutive days',
    icon: <TrendingUp className="w-5 h-5" />,
    rarity: 'rare',
    points: 200,
    progress: 5,
    maxProgress: 7,
    unlocked: false,
    category: 'trading',
    requirement: '7 consecutive profitable days',
    reward: 'Profit Master Badge + 200 XP'
  },
  {
    id: 'volume-trader',
    title: 'Volume Trader',
    description: 'Trade over $100,000 in total volume',
    icon: <Zap className="w-5 h-5" />,
    rarity: 'epic',
    points: 500,
    progress: 75420,
    maxProgress: 100000,
    unlocked: false,
    category: 'trading',
    requirement: '$100,000 total volume',
    reward: 'High Volume Badge + 500 XP + VIP Status'
  },
  {
    id: 'hodl-master',
    title: 'HODL Master',
    description: 'Hold a position for 30 days without selling',
    icon: <Shield className="w-5 h-5" />,
    rarity: 'rare',
    points: 300,
    progress: 18,
    maxProgress: 30,
    unlocked: false,
    category: 'portfolio',
    requirement: 'Hold position for 30 days',
    reward: 'Diamond Hands Badge + 300 XP'
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Win 10 trades in a row',
    icon: <Flame className="w-5 h-5" />,
    rarity: 'legendary',
    points: 1000,
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    category: 'streak',
    requirement: '10 consecutive winning trades',
    reward: 'Fire Badge + 1000 XP + Custom Avatar'
  },
  {
    id: 'portfolio-builder',
    title: 'Portfolio Builder',
    description: 'Diversify across 5 different cryptocurrencies',
    icon: <Award className="w-5 h-5" />,
    rarity: 'common',
    points: 100,
    progress: 4,
    maxProgress: 5,
    unlocked: false,
    category: 'portfolio',
    requirement: 'Hold 5 different cryptocurrencies',
    reward: 'Diversification Badge + 100 XP'
  },
  {
    id: 'whale-status',
    title: 'Whale Status',
    description: 'Reach $1,000,000 in portfolio value',
    icon: <Crown className="w-5 h-5" />,
    rarity: 'mythic',
    points: 2500,
    progress: 125840,
    maxProgress: 1000000,
    unlocked: false,
    category: 'milestone',
    requirement: '$1M portfolio value',
    reward: 'Whale Badge + 2500 XP + Exclusive Features'
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Share 5 trading insights with the community',
    icon: <Sparkles className="w-5 h-5" />,
    rarity: 'common',
    points: 75,
    progress: 2,
    maxProgress: 5,
    unlocked: false,
    category: 'social',
    requirement: 'Share 5 insights',
    reward: 'Social Badge + 75 XP'
  }
];

const rarityColors = {
  common: 'from-gray-600 to-gray-500',
  rare: 'from-blue-600 to-blue-500',
  epic: 'from-purple-600 to-purple-500',
  legendary: 'from-yellow-600 to-yellow-500',
  mythic: 'from-red-600 to-pink-500'
};

const rarityBorders = {
  common: 'border-gray-400',
  rare: 'border-blue-400',
  epic: 'border-purple-400',
  legendary: 'border-yellow-400',
  mythic: 'border-red-400'
};

export function TradingAchievements() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [animatingAchievement, setAnimatingAchievement] = useState<string | null>(null);
  const { toast } = useToast();

  const categories = ['all', 'trading', 'portfolio', 'social', 'milestone', 'streak'];
  
  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlockedMatch = !showUnlockedOnly || achievement.unlocked;
    return categoryMatch && unlockedMatch;
  });

  const totalPoints = achievements.reduce((sum, achievement) => 
    sum + (achievement.unlocked ? achievement.points : 0), 0
  );

  const totalUnlocked = achievements.filter(a => a.unlocked).length;

  const simulateAchievementUnlock = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    setAnimatingAchievement(achievementId);
    
    setTimeout(() => {
      achievement.unlocked = true;
      achievement.progress = achievement.maxProgress;
      achievement.unlockedAt = new Date().toISOString();
      
      toast({
        title: "🎉 Achievement Unlocked!",
        description: `${achievement.title} - ${achievement.reward}`,
        className: `bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white border-none`,
      });
      
      setAnimatingAchievement(null);
    }, 2000);
  };

  const getProgressPercentage = (achievement: Achievement) => {
    return (achievement.progress / achievement.maxProgress) * 100;
  };

  const renderAchievementCard = (achievement: Achievement) => {
    const isAnimating = animatingAchievement === achievement.id;
    
    return (
      <Card 
        key={achievement.id}
        className={`relative overflow-hidden transition-all duration-500 transform hover:scale-105 ${
          achievement.unlocked 
            ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} text-white border-2 ${rarityBorders[achievement.rarity]}` 
            : 'bg-slate-800 border-slate-700 text-slate-300'
        } ${isAnimating ? 'animate-pulse scale-110' : ''}`}
      >
        {achievement.unlocked && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Trophy className="w-3 h-3 mr-1" />
              Unlocked
            </Badge>
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              achievement.unlocked 
                ? 'bg-white/20' 
                : 'bg-slate-700'
            }`}>
              {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {achievement.title}
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    achievement.unlocked 
                      ? 'border-white/30 text-white' 
                      : 'border-slate-600 text-slate-400'
                  }`}
                >
                  {achievement.rarity}
                </Badge>
              </CardTitle>
              <CardDescription className={achievement.unlocked ? 'text-white/80' : 'text-slate-400'}>
                {achievement.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Progress</span>
              <span className="text-sm font-medium">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
            <Progress 
              value={getProgressPercentage(achievement)} 
              className={`h-2 ${
                achievement.unlocked 
                  ? 'bg-white/20' 
                  : 'bg-slate-700'
              }`}
            />
            <div className="text-xs opacity-80">
              {achievement.requirement}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Reward</span>
              <Badge variant="outline" className={`text-xs ${
                achievement.unlocked 
                  ? 'border-white/30 text-white' 
                  : 'border-slate-600 text-slate-400'
              }`}>
                {achievement.points} XP
              </Badge>
            </div>
            <div className="text-xs opacity-80">
              {achievement.reward}
            </div>
          </div>

          {achievement.unlockedAt && (
            <div className="text-xs opacity-60">
              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}

          {!achievement.unlocked && achievement.progress >= achievement.maxProgress * 0.8 && (
            <Button
              onClick={() => simulateAchievementUnlock(achievement.id)}
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Simulate Unlock
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                Trading Achievements
              </h1>
              <p className="text-slate-300 mt-2">
                Unlock badges and earn XP by completing trading challenges
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{totalPoints.toLocaleString()} XP</div>
              <div className="text-slate-300">{totalUnlocked}/{achievements.length} Unlocked</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                  : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {showUnlockedOnly ? 'Show All' : 'Show Unlocked Only'}
            </Button>
            <div className="flex items-center gap-2">
              <Medal className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300 text-sm">
                {filteredAchievements.length} achievements
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(renderAchievementCard)}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              No achievements found
            </h3>
            <p className="text-slate-500">
              Try adjusting your filters or start trading to unlock achievements!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}