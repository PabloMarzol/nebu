import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Shield,
  Coins,
  Crown,
  CheckCircle,
  Lock,
  Play,
  Gift
} from 'lucide-react';

export default function CryptoLearningPass() {
  const [userProgress, setUserProgress] = useState({
    level: 3,
    xp: 2450,
    nextLevelXp: 3000,
    streak: 7,
    totalLessons: 45,
    completedLessons: 28,
    achievements: 12
  });

  const [currentLesson, setCurrentLesson] = useState(null);

  const learningTracks = [
    {
      id: 'basics',
      title: 'Crypto Basics',
      description: 'Learn the fundamentals of cryptocurrency',
      progress: 85,
      lessons: 8,
      completed: 7,
      xpReward: 100,
      badge: 'Crypto Novice',
      icon: <BookOpen className="w-6 h-6" />,
      unlocked: true
    },
    {
      id: 'trading',
      title: 'Trading Mastery',
      description: 'Master the art of crypto trading',
      progress: 60,
      lessons: 12,
      completed: 7,
      xpReward: 200,
      badge: 'Trading Pro',
      icon: <TrendingUp className="w-6 h-6" />,
      unlocked: true
    },
    {
      id: 'defi',
      title: 'DeFi Explorer',
      description: 'Discover decentralized finance',
      progress: 25,
      lessons: 10,
      completed: 2,
      xpReward: 300,
      badge: 'DeFi Master',
      icon: <Coins className="w-6 h-6" />,
      unlocked: true
    },
    {
      id: 'security',
      title: 'Security Expert',
      description: 'Protect your crypto assets',
      progress: 0,
      lessons: 6,
      completed: 0,
      xpReward: 150,
      badge: 'Security Guardian',
      icon: <Shield className="w-6 h-6" />,
      unlocked: false
    }
  ];

  const achievements = [
    {
      id: 'first-trade',
      title: 'First Trade',
      description: 'Complete your first crypto trade',
      xp: 50,
      unlocked: true,
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 'week-streak',
      title: '7-Day Streak',
      description: 'Learn for 7 consecutive days',
      xp: 100,
      unlocked: true,
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Score 100% on 5 quizzes',
      xp: 75,
      unlocked: true,
      icon: <Star className="w-5 h-5" />
    },
    {
      id: 'social-learner',
      title: 'Social Learner',
      description: 'Share 3 lessons with friends',
      xp: 60,
      unlocked: false,
      icon: <Crown className="w-5 h-5" />
    }
  ];

  const dailyQuests = [
    {
      id: 'daily-lesson',
      title: 'Complete Daily Lesson',
      progress: 1,
      target: 1,
      xp: 25,
      status: 'completed'
    },
    {
      id: 'market-check',
      title: 'Check Market Prices',
      progress: 3,
      target: 5,
      xp: 15,
      status: 'in-progress'
    },
    {
      id: 'portfolio-review',
      title: 'Review Portfolio Performance',
      progress: 0,
      target: 1,
      xp: 20,
      status: 'not-started'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'in-progress': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Progress */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Crypto Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Pass</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Gamified crypto education that pays you to learn
          </p>
        </div>

        {/* User Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">Level {userProgress.level}</div>
              <div className="text-sm text-gray-400">Crypto Apprentice</div>
              <Progress value={(userProgress.xp / userProgress.nextLevelXp) * 100} className="mt-2" />
              <div className="text-xs text-gray-400 mt-1">
                {userProgress.xp}/{userProgress.nextLevelXp} XP
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-yellow-400 mb-1">{userProgress.streak}</div>
              <div className="text-sm text-gray-400">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {userProgress.completedLessons}/{userProgress.totalLessons}
              </div>
              <div className="text-sm text-gray-400">Lessons Complete</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-400 mb-1">{userProgress.achievements}</div>
              <div className="text-sm text-gray-400">Achievements</div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Quests */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-orange-400" />
              <span>Daily Quests</span>
              <Badge className="bg-orange-500 text-white">24h Reset</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyQuests.map((quest) => (
                <div key={quest.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      quest.status === 'completed' ? 'bg-green-400' : 
                      quest.status === 'in-progress' ? 'bg-blue-400' : 'bg-gray-400'
                    }`} />
                    <div>
                      <div className="font-semibold">{quest.title}</div>
                      <div className="text-sm text-gray-400">
                        Progress: {quest.progress}/{quest.target}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(quest.status)}>
                      +{quest.xp} XP
                    </Badge>
                    {quest.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {learningTracks.map((track) => (
            <Card key={track.id} className={`bg-black/20 backdrop-blur-lg border-white/10 ${
              !track.unlocked ? 'opacity-60' : 'hover:border-white/20 transition-all'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      track.unlocked ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {track.unlocked ? track.icon : <Lock className="w-6 h-6" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{track.title}</CardTitle>
                      <p className="text-sm text-gray-400">{track.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-500 text-white">
                    +{track.xpReward} XP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{track.completed}/{track.lessons} lessons</span>
                    </div>
                    <Progress value={track.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      {track.badge}
                    </Badge>
                    <Button 
                      size="sm" 
                      disabled={!track.unlocked}
                      className={track.unlocked ? 'bg-purple-500 hover:bg-purple-600' : ''}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {track.unlocked ? 'Continue' : 'Locked'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements Gallery */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span>Achievement Gallery</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border text-center transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:scale-105' 
                      : 'bg-gray-500/20 border-gray-500/30 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="font-semibold text-sm mb-1">{achievement.title}</div>
                  <div className="text-xs text-gray-400 mb-2">{achievement.description}</div>
                  <Badge className={achievement.unlocked ? 'bg-yellow-500 text-black' : 'bg-gray-500'}>
                    +{achievement.xp} XP
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Section */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-center">
              <Gift className="w-6 h-6 text-purple-400" />
              <span>Learning Rewards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">$50 USDT</div>
                <div className="text-sm text-gray-300">Complete Crypto Basics Track</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">Free Pro</div>
                <div className="text-sm text-gray-300">Reach Level 5 - 1 Month Free</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">$200 Bonus</div>
                <div className="text-sm text-gray-300">Complete All Learning Tracks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}