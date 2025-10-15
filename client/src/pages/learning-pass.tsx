import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { 
  Trophy,
  Star,
  Award,
  Target,
  Book,
  Brain,
  Zap,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  Play,
  BookOpen,
  GraduationCap,
  Medal,
  Crown,
  Shield,
  Gem,
  Flame,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";

export default function LearningPassPage() {
  const { toast } = useToast();
  const { isAuthenticated, user } = useWalletAuth();
  const [userLevel, setUserLevel] = useState(7);
  const [totalXP, setTotalXP] = useState(2847);
  const [dailyStreak, setDailyStreak] = useState(12);

  const learningPaths = [
    {
      id: "crypto_basics",
      title: "Cryptocurrency Fundamentals",
      description: "Learn the basics of blockchain, cryptocurrencies, and digital assets",
      totalModules: 8,
      completedModules: 8,
      estimatedTime: "4 hours",
      difficulty: "beginner",
      category: "Fundamentals",
      progress: 100,
      xpReward: 500
    },
    {
      id: "trading_strategies",
      title: "Trading Strategies & Analysis", 
      description: "Master technical analysis, chart patterns, and trading psychology",
      totalModules: 12,
      completedModules: 7,
      estimatedTime: "8 hours",
      difficulty: "intermediate",
      category: "Trading",
      progress: 58,
      xpReward: 800
    },
    {
      id: "defi_mastery",
      title: "DeFi Protocols & Yield Farming",
      description: "Understand decentralized finance, liquidity pools, and yield strategies",
      totalModules: 10,
      completedModules: 3,
      estimatedTime: "6 hours",
      difficulty: "advanced",
      category: "DeFi",
      progress: 30,
      xpReward: 1000
    }
  ];

  const achievements = [
    {
      id: "first_trade",
      title: "First Trade",
      description: "Complete your first cryptocurrency trade",
      icon: <Star className="w-6 h-6" />,
      unlocked: true,
      rarity: "common",
      xp: 100
    },
    {
      id: "knowledge_seeker",
      title: "Knowledge Seeker",
      description: "Complete 5 educational modules",
      icon: <Book className="w-6 h-6" />,
      unlocked: true,
      rarity: "rare",
      xp: 250
    },
    {
      id: "trading_master",
      title: "Trading Master",
      description: "Achieve 80% win rate over 50 trades",
      icon: <Crown className="w-6 h-6" />,
      unlocked: false,
      rarity: "legendary",
      xp: 1000
    }
  ];

  const dailyQuests = [
    {
      id: "daily_login",
      title: "Daily Login",
      description: "Log in to the platform",
      progress: 1,
      target: 1,
      xp: 50,
      completed: true
    },
    {
      id: "complete_trade",
      title: "Execute a Trade",
      description: "Complete at least one trade today",
      progress: 0,
      target: 1,
      xp: 100,
      completed: false
    },
    {
      id: "learn_module",
      title: "Learn Something New",
      description: "Complete one educational module",
      progress: 1,
      target: 1,
      xp: 75,
      completed: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-500/20';
      case 'rare': return 'text-blue-400 bg-blue-500/20';
      case 'epic': return 'text-purple-400 bg-purple-500/20';
      case 'legendary': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const handleLearningAction = (path: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign up or log in to access learning content and track your progress.",
        variant: "destructive",
      });
      
      // Redirect to signup/login
      setTimeout(() => {
        window.location.href = "/auth/register";
      }, 1500);
      return;
    }

    // User is authenticated, proceed with learning action
    if (path.progress === 100) {
      // Review Path action
      toast({
        title: "Reviewing Learning Path",
        description: `Starting review for ${path.title}. You can revisit completed modules and test your knowledge.`,
        variant: "default",
      });
      
      // Here you would navigate to the learning content
      console.log("Reviewing path:", path.id);
      
    } else {
      // Continue Learning action
      toast({
        title: "Continuing Learning",
        description: `Resuming ${path.title} from module ${path.completedModules + 1}/${path.totalModules}.`,
        variant: "default",
      });
      
      // Here you would navigate to the next module
      console.log("Continuing learning for path:", path.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Crypto Learning Pass
          </h1>
          <p className="text-gray-300">Level up your crypto knowledge and earn rewards</p>
        </div>

        {/* User Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{userLevel}</div>
              <p className="text-gray-400">Current Level</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{totalXP.toLocaleString()}</div>
              <p className="text-gray-400">Total XP</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">{dailyStreak}</div>
              <p className="text-gray-400">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{achievements.filter(a => a.unlocked).length}</div>
              <p className="text-gray-400">Achievements</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="paths" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="quests">Daily Quests</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="paths">
            <div className="grid gap-6">
              {learningPaths.map((path) => (
                <Card key={path.id} className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{path.title}</CardTitle>
                        <p className="text-gray-400">{path.description}</p>
                      </div>
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Progress</p>
                        <p className="text-lg font-bold">{path.completedModules}/{path.totalModules} modules</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Estimated Time</p>
                        <p className="text-lg font-bold">{path.estimatedTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Category</p>
                        <p className="text-lg font-bold">{path.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">XP Reward</p>
                        <p className="text-lg font-bold text-yellow-400">{path.xpReward} XP</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm text-cyan-400">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90"
                      onClick={() => handleLearningAction(path)}
                    >
                      {path.progress === 100 ? 'Review Path' : 'Continue Learning'}
                      <Play className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`bg-gray-800/50 border-gray-700/50 ${
                  achievement.unlocked ? 'ring-2 ring-cyan-500/50' : 'opacity-60'
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-4 rounded-full mb-4 ${
                      achievement.unlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-600/20 text-gray-500'
                    }`}>
                      {achievement.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        {achievement.xp} XP
                      </Badge>
                    </div>
                    {achievement.unlocked && (
                      <div className="mt-4">
                        <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quests">
            <div className="grid gap-4">
              {dailyQuests.map((quest) => (
                <Card key={quest.id} className="bg-gray-800/50 border-gray-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">{quest.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{quest.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{quest.progress}/{quest.target}</span>
                            </div>
                            <Progress value={(quest.progress / quest.target) * 100} className="h-2" />
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-400">
                            {quest.xp} XP
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-4">
                        {quest.completed ? (
                          <CheckCircle className="w-8 h-8 text-green-400" />
                        ) : (
                          <Clock className="w-8 h-8 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle>Weekly Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "CryptoMaster", xp: 5420, level: 12 },
                    { rank: 2, name: "BlockchainPro", xp: 4890, level: 11 },
                    { rank: 3, name: "You", xp: 2847, level: 7 },
                    { rank: 4, name: "TradingGuru", xp: 2156, level: 6 },
                    { rank: 5, name: "DeFiExplorer", xp: 1943, level: 5 }
                  ].map((user) => (
                    <div key={user.rank} className={`flex items-center justify-between p-4 rounded-lg ${
                      user.name === 'You' ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-gray-700/30'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          user.rank === 1 ? 'bg-yellow-500 text-black' :
                          user.rank === 2 ? 'bg-gray-400 text-black' :
                          user.rank === 3 ? 'bg-orange-500 text-black' :
                          'bg-gray-600 text-white'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-sm text-gray-400">Level {user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-400">{user.xp.toLocaleString()} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}