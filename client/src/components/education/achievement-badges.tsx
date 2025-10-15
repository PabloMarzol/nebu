import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Shield, TrendingUp, BookOpen, Zap, Target, Award } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'trading' | 'security' | 'knowledge' | 'portfolio' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  xpReward: number;
  unlockDate?: Date;
  requirements: string[];
}

interface TrainingGame {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  estimatedTime: string;
  completed: boolean;
  achievements: string[];
}

export default function AchievementBadges() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [trainingGames, setTrainingGames] = useState<TrainingGame[]>([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [activeTab, setActiveTab] = useState<'achievements' | 'training'>('achievements');
  const [showUnlockAnimation, setShowUnlockAnimation] = useState<string | null>(null);

  useEffect(() => {
    initializeAchievements();
    initializeTrainingGames();
  }, []);

  const initializeAchievements = () => {
    const achievementList: Achievement[] = [
      {
        id: 'first-trade',
        name: 'First Steps',
        description: 'Complete your first cryptocurrency trade',
        category: 'trading',
        rarity: 'common',
        icon: <TrendingUp className="w-6 h-6" />,
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        xpReward: 100,
        requirements: ['Place and execute one trade']
      },
      {
        id: 'security-master',
        name: 'Security Guardian',
        description: 'Enable all security features and complete security training',
        category: 'security',
        rarity: 'rare',
        icon: <Shield className="w-6 h-6" />,
        progress: 2,
        maxProgress: 5,
        unlocked: false,
        xpReward: 250,
        requirements: ['Enable 2FA', 'Set up backup codes', 'Complete security quiz', 'Review security settings', 'Update password']
      },
      {
        id: 'knowledge-seeker',
        name: 'Crypto Scholar',
        description: 'Complete 10 educational modules and pass all quizzes',
        category: 'knowledge',
        rarity: 'epic',
        icon: <BookOpen className="w-6 h-6" />,
        progress: 3,
        maxProgress: 10,
        unlocked: false,
        xpReward: 500,
        requirements: ['Complete educational modules', 'Pass knowledge quizzes', 'Read market analysis guides']
      },
      {
        id: 'portfolio-master',
        name: 'Portfolio Wizard',
        description: 'Build a diversified portfolio across 5+ different cryptocurrencies',
        category: 'portfolio',
        rarity: 'legendary',
        icon: <Target className="w-6 h-6" />,
        progress: 1,
        maxProgress: 5,
        unlocked: false,
        xpReward: 1000,
        requirements: ['Hold 5+ different cryptocurrencies', 'Maintain balanced allocation', 'Track performance metrics']
      },
      {
        id: 'trading-legend',
        name: 'Market Maestro',
        description: 'Execute 100 successful trades with 70%+ win rate',
        category: 'trading',
        rarity: 'mythic',
        icon: <Trophy className="w-6 h-6" />,
        progress: 5,
        maxProgress: 100,
        unlocked: false,
        xpReward: 2500,
        requirements: ['Complete 100 trades', 'Maintain 70% win rate', 'Demonstrate consistent profitability']
      }
    ];
    setAchievements(achievementList);
  };

  const initializeTrainingGames = () => {
    const gameList: TrainingGame[] = [
      {
        id: 'trading-basics',
        name: 'Trading Fundamentals',
        description: 'Learn the basics of cryptocurrency trading, order types, and market analysis',
        category: 'Trading',
        difficulty: 'beginner',
        xpReward: 150,
        estimatedTime: '15 minutes',
        completed: false,
        achievements: ['first-trade']
      },
      {
        id: 'security-protocols',
        name: 'Security Mastery',
        description: 'Master cryptocurrency security best practices and protect your assets',
        category: 'Security',
        difficulty: 'intermediate',
        xpReward: 200,
        estimatedTime: '20 minutes',
        completed: false,
        achievements: ['security-master']
      },
      {
        id: 'defi-strategies',
        name: 'DeFi Deep Dive',
        description: 'Explore decentralized finance protocols, yield farming, and liquidity provision',
        category: 'Advanced',
        difficulty: 'advanced',
        xpReward: 300,
        estimatedTime: '30 minutes',
        completed: false,
        achievements: ['knowledge-seeker']
      },
      {
        id: 'portfolio-optimization',
        name: 'Portfolio Builder',
        description: 'Learn portfolio diversification, risk management, and asset allocation strategies',
        category: 'Investment',
        difficulty: 'intermediate',
        xpReward: 250,
        estimatedTime: '25 minutes',
        completed: false,
        achievements: ['portfolio-master']
      },
      {
        id: 'market-analysis',
        name: 'Technical Analysis Pro',
        description: 'Master chart patterns, indicators, and advanced trading strategies',
        category: 'Trading',
        difficulty: 'advanced',
        xpReward: 400,
        estimatedTime: '45 minutes',
        completed: false,
        achievements: ['trading-legend']
      }
    ];
    setTrainingGames(gameList);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 bg-gray-500/10 text-gray-400';
      case 'rare': return 'border-blue-500 bg-blue-500/10 text-blue-400';
      case 'epic': return 'border-purple-500 bg-purple-500/10 text-purple-400';
      case 'legendary': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'mythic': return 'border-red-500 bg-red-500/10 text-red-400';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const completeTrainingGame = (gameId: string) => {
    setTrainingGames(prev => prev.map(game => {
      if (game.id === gameId && !game.completed) {
        // Award XP
        setTotalXP(prevXP => prevXP + game.xpReward);
        
        // Check for level up
        const newXP = totalXP + game.xpReward;
        const newLevel = Math.floor(newXP / 1000) + 1;
        if (newLevel > playerLevel) {
          setPlayerLevel(newLevel);
        }

        // Unlock related achievements
        game.achievements.forEach(achievementId => {
          unlockAchievement(achievementId);
        });

        return { ...game, completed: true };
      }
      return game;
    }));
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlocked) {
        setShowUnlockAnimation(achievementId);
        setTimeout(() => setShowUnlockAnimation(null), 3000);
        
        setTotalXP(prevXP => prevXP + achievement.xpReward);
        
        return { 
          ...achievement, 
          unlocked: true, 
          unlockDate: new Date(),
          progress: achievement.maxProgress
        };
      }
      return achievement;
    }));
  };

  const progressAchievement = (achievementId: string, amount: number = 1) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlocked) {
        const newProgress = Math.min(achievement.progress + amount, achievement.maxProgress);
        if (newProgress === achievement.maxProgress) {
          unlockAchievement(achievementId);
        }
        return { ...achievement, progress: newProgress };
      }
      return achievement;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Player Stats Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-indigo-900/20 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full">
                <Award className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Level {playerLevel} Trader</h3>
                <p className="text-gray-400">{totalXP.toLocaleString()} XP Total</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-purple-400">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </div>
              <div className="text-sm text-gray-400">Achievements Unlocked</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress to Level {playerLevel + 1}</span>
              <span className="text-purple-400">{totalXP % 1000}/1000 XP</span>
            </div>
            <Progress value={(totalXP % 1000) / 10} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        <Button
          variant={activeTab === 'achievements' ? 'default' : 'ghost'}
          className={`flex-1 ${activeTab === 'achievements' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Trophy className="w-4 h-4 mr-2" />
          Achievements
        </Button>
        <Button
          variant={activeTab === 'training' ? 'default' : 'ghost'}
          className={`flex-1 ${activeTab === 'training' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
          onClick={() => setActiveTab('training')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Training Games
        </Button>
      </div>

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`relative overflow-hidden transition-all duration-300 ${
                achievement.unlocked ? getRarityColor(achievement.rarity) : 'border-gray-600 bg-gray-800/50'
              } ${showUnlockAnimation === achievement.id ? 'animate-pulse scale-105' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-white/10' : 'bg-gray-700/50'}`}>
                    {achievement.icon}
                  </div>
                  <Badge className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </Badge>
                </div>
                
                <h4 className={`font-bold mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                  {achievement.name}
                </h4>
                <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                
                {!achievement.unlocked && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-400">{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-1" />
                  </div>
                )}
                
                {achievement.unlocked && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-400">✓ Unlocked</span>
                    <span className="text-yellow-400">+{achievement.xpReward} XP</span>
                  </div>
                )}
                
                {showUnlockAnimation === achievement.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-spin" />
                      <div className="text-yellow-400 font-bold">Achievement Unlocked!</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Training Games Tab */}
      {activeTab === 'training' && (
        <div className="space-y-4">
          {trainingGames.map((game) => (
            <Card key={game.id} className={`${game.completed ? 'border-green-500/30 bg-green-900/20' : 'border-gray-600 bg-gray-800/50'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${game.completed ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
                      {game.completed ? <Star className="w-6 h-6 text-green-400" /> : <Zap className="w-6 h-6 text-purple-400" />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{game.name}</h4>
                      <p className="text-gray-400">{game.description}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={getDifficultyColor(game.difficulty)}>
                      {game.difficulty}
                    </Badge>
                    <div className="text-sm text-gray-400">{game.estimatedTime}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-yellow-400 text-sm">+{game.xpReward} XP</span>
                    <span className="text-gray-400 text-sm">{game.category}</span>
                  </div>
                  
                  <Button
                    onClick={() => completeTrainingGame(game.id)}
                    disabled={game.completed}
                    className={game.completed ? 
                      'bg-green-600 text-white cursor-not-allowed' : 
                      'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    }
                  >
                    {game.completed ? (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Training
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={() => progressAchievement('security-master')}
          variant="outline"
          className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
        >
          <Shield className="w-4 h-4 mr-2" />
          Simulate Security Progress
        </Button>
        <Button
          onClick={() => progressAchievement('knowledge-seeker')}
          variant="outline"
          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Simulate Learning Progress
        </Button>
      </div>
    </div>
  );
}