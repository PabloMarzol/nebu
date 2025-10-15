import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap, BookOpen, Target, Sparkles } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'trading' | 'learning' | 'social' | 'special';
  reward: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-trade',
    title: 'First Trade',
    description: 'Execute your first trade',
    icon: '🚀',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'trading',
    reward: '50 XP + Trading Badge'
  },
  {
    id: 'crypto-basics',
    title: 'Crypto Basics Master',
    description: 'Complete the cryptocurrency fundamentals course',
    icon: '📚',
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    category: 'learning',
    reward: '100 XP + Knowledge Badge'
  },
  {
    id: 'portfolio-diversifier',
    title: 'Portfolio Diversifier',
    description: 'Hold 5 different cryptocurrencies',
    icon: '💼',
    progress: 2,
    maxProgress: 5,
    unlocked: false,
    category: 'trading',
    reward: '75 XP + Diversity Badge'
  },
  {
    id: 'social-sharer',
    title: 'Social Butterfly',
    description: 'Share 3 portfolio screenshots',
    icon: '📸',
    progress: 1,
    maxProgress: 3,
    unlocked: false,
    category: 'social',
    reward: '60 XP + Social Badge'
  },
  {
    id: 'streak-keeper',
    title: 'Daily Streak',
    description: 'Login for 7 consecutive days',
    icon: '🔥',
    progress: 4,
    maxProgress: 7,
    unlocked: false,
    category: 'special',
    reward: '150 XP + Dedication Badge'
  }
];

export default function LearningAchievements() {
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [totalXP, setTotalXP] = useState(285);
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);

  const simulateProgress = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlocked) {
        const newProgress = Math.min(achievement.progress + 1, achievement.maxProgress);
        const isUnlocked = newProgress >= achievement.maxProgress;
        
        if (isUnlocked && !achievement.unlocked) {
          setNewUnlock(achievement);
          setTotalXP(prev => prev + 50); // Award XP
          setTimeout(() => setNewUnlock(null), 3000);
        }
        
        return {
          ...achievement,
          progress: newProgress,
          unlocked: isUnlocked
        };
      }
      return achievement;
    }));
  };

  const getProgressPercentage = (achievement: Achievement) => {
    return (achievement.progress / achievement.maxProgress) * 100;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading': return <Zap className="w-4 h-4" />;
      case 'learning': return <BookOpen className="w-4 h-4" />;
      case 'social': return <Star className="w-4 h-4" />;
      case 'special': return <Trophy className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trading': return 'bg-green-500';
      case 'learning': return 'bg-blue-500';
      case 'social': return 'bg-purple-500';
      case 'special': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Achievement Unlock Animation */}
      {newUnlock && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-6 rounded-lg shadow-2xl animate-pulse">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-bold text-lg">Achievement Unlocked!</div>
              <div className="text-sm opacity-90">{newUnlock.title}</div>
            </div>
          </div>
        </div>
      )}

      {/* XP Counter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">{totalXP} XP</div>
              <div className="text-sm text-muted-foreground">Total Experience Points</div>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Learning Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border transition-all ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {achievement.title}
                        {achievement.unlocked && (
                          <Badge className="bg-green-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={getCategoryColor(achievement.category)}>
                      {getCategoryIcon(achievement.category)}
                      <span className="ml-1 capitalize">{achievement.category}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress: {achievement.progress}/{achievement.maxProgress}</span>
                      <span className="text-muted-foreground">{achievement.reward}</span>
                    </div>
                    
                    <Progress 
                      value={getProgressPercentage(achievement)} 
                      className="h-2"
                    />
                  </div>
                  
                  {!achievement.unlocked && (
                    <Button 
                      onClick={() => simulateProgress(achievement.id)}
                      size="sm" 
                      variant="outline"
                      className="mt-2"
                    >
                      Simulate Progress
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}