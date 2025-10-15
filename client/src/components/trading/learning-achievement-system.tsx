import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "trading" | "security" | "defi" | "fundamentals" | "advanced";
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  points: number;
  icon: any;
  color: string;
  unlocked: boolean;
  progress: number;
  requirement: string;
  unlockedDate?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  totalModules: number;
  completedModules: number;
  estimatedTime: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  prerequisites: string[];
  achievements: string[];
  progress: number;
}

interface UserProgress {
  level: number;
  totalPoints: number;
  pointsToNextLevel: number;
  streak: number;
  completedCourses: number;
  totalAchievements: number;
  unlockedAchievements: number;
  rank: string;
  percentile: number;
}

export default function LearningAchievementSystem() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const userProgress: UserProgress = {
    level: 12,
    totalPoints: 2340,
    pointsToNextLevel: 660,
    streak: 7,
    completedCourses: 8,
    totalAchievements: 45,
    unlockedAchievements: 23,
    rank: "Crypto Scholar",
    percentile: 78
  };

  const achievements: Achievement[] = [
    {
      id: "first_trade",
      title: "First Steps",
      description: "Complete your first cryptocurrency trade",
      category: "trading",
      difficulty: "beginner",
      points: 50,
      icon: Target,
      color: "#10b981",
      unlocked: true,
      progress: 100,
      requirement: "Execute 1 trade",
      unlockedDate: "2024-01-10",
      rarity: "common"
    },
    {
      id: "security_master",
      title: "Security Guardian",
      description: "Enable all security features including 2FA and hardware wallet",
      category: "security",
      difficulty: "intermediate",
      points: 150,
      icon: Shield,
      color: "#3b82f6",
      unlocked: true,
      progress: 100,
      requirement: "Enable 2FA + Hardware Wallet",
      unlockedDate: "2024-01-12",
      rarity: "rare"
    },
    {
      id: "defi_explorer",
      title: "DeFi Pioneer",
      description: "Participate in your first DeFi protocol",
      category: "defi",
      difficulty: "intermediate",
      points: 200,
      icon: Zap,
      color: "#8b5cf6",
      unlocked: false,
      progress: 60,
      requirement: "Use DeFi protocol",
      rarity: "rare"
    },
    {
      id: "crypto_scholar",
      title: "Crypto Scholar",
      description: "Complete all fundamental crypto courses",
      category: "fundamentals",
      difficulty: "intermediate",
      points: 300,
      icon: GraduationCap,
      color: "#f59e0b",
      unlocked: true,
      progress: 100,
      requirement: "Complete 5 courses",
      unlockedDate: "2024-01-14",
      rarity: "epic"
    },
    {
      id: "trading_master",
      title: "Trading Master",
      description: "Achieve 100 successful trades with 80%+ success rate",
      category: "trading",
      difficulty: "advanced",
      points: 500,
      icon: Crown,
      color: "#ef4444",
      unlocked: false,
      progress: 45,
      requirement: "100 trades, 80% success",
      rarity: "legendary"
    },
    {
      id: "knowledge_streak",
      title: "Knowledge Streak",
      description: "Maintain a 7-day learning streak",
      category: "fundamentals",
      difficulty: "beginner",
      points: 100,
      icon: Flame,
      color: "#f97316",
      unlocked: true,
      progress: 100,
      requirement: "7 consecutive days learning",
      unlockedDate: "2024-01-15",
      rarity: "common"
    },
    {
      id: "portfolio_diversifier",
      title: "Portfolio Diversifier",
      description: "Hold positions in 10+ different cryptocurrencies",
      category: "trading",
      difficulty: "intermediate",
      points: 250,
      icon: TrendingUp,
      color: "#06b6d4",
      unlocked: false,
      progress: 70,
      requirement: "Hold 10+ different assets",
      rarity: "rare"
    },
    {
      id: "community_teacher",
      title: "Community Teacher",
      description: "Help 10 new users learn crypto basics",
      category: "fundamentals",
      difficulty: "advanced",
      points: 400,
      icon: Users,
      color: "#84cc16",
      unlocked: false,
      progress: 30,
      requirement: "Help 10 new users",
      rarity: "epic"
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: "crypto_basics",
      title: "Cryptocurrency Fundamentals",
      description: "Learn the basics of blockchain, cryptocurrencies, and digital assets",
      totalModules: 8,
      completedModules: 8,
      estimatedTime: "4 hours",
      difficulty: "beginner",
      category: "Fundamentals",
      prerequisites: [],
      achievements: ["first_steps", "knowledge_seeker"],
      progress: 100
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
      prerequisites: ["crypto_basics"],
      achievements: ["chart_reader", "risk_manager"],
      progress: 58
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
      prerequisites: ["crypto_basics", "trading_strategies"],
      achievements: ["defi_explorer", "yield_farmer"],
      progress: 30
    },
    {
      id: "security_advanced",
      title: "Advanced Security Practices",
      description: "Learn advanced wallet security, cold storage, and threat prevention",
      totalModules: 6,
      completedModules: 6,
      estimatedTime: "3 hours",
      difficulty: "intermediate",
      category: "Security",
      prerequisites: ["crypto_basics"],
      achievements: ["security_expert", "vault_keeper"],
      progress: 100
    },
    {
      id: "institutional_crypto",
      title: "Institutional Cryptocurrency",
      description: "Corporate treasury management, compliance, and institutional investing",
      totalModules: 15,
      completedModules: 0,
      estimatedTime: "12 hours",
      difficulty: "advanced",
      category: "Professional",
      prerequisites: ["crypto_basics", "trading_strategies", "defi_mastery"],
      achievements: ["institutional_trader", "compliance_master"],
      progress: 0
    }
  ];

  const getAchievementsByCategory = () => {
    if (selectedCategory === "all") return achievements;
    return achievements.filter(achievement => achievement.category === selectedCategory);
  };

  const getFilteredAchievements = () => {
    let filtered = getAchievementsByCategory();
    if (showUnlockedOnly) {
      filtered = filtered.filter(achievement => achievement.unlocked);
    }
    return filtered;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400 border-gray-400";
      case "rare": return "text-blue-400 border-blue-400";
      case "epic": return "text-purple-400 border-purple-400";
      case "legendary": return "text-yellow-400 border-yellow-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400 bg-green-400/10";
      case "intermediate": return "text-yellow-400 bg-yellow-400/10";
      case "advanced": return "text-orange-400 bg-orange-400/10";
      case "expert": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  const getLevelProgress = () => {
    return ((userProgress.totalPoints % 1000) / 1000) * 100;
  };

  return (
    <div className="space-y-6">
      {/* User Progress Overview */}
      <Card className="glass border-purple-500/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">Level {userProgress.level}</div>
              <div className="text-sm text-muted-foreground">{userProgress.rank}</div>
              <Progress value={getLevelProgress()} className="mt-2 h-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {userProgress.pointsToNextLevel} XP to next level
              </div>
            </div>

            <div className="text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {userProgress.totalPoints.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Points</div>
              <div className="text-xs text-muted-foreground mt-1">
                Top {100 - userProgress.percentile}% of users
              </div>
            </div>

            <div className="text-center">
              <Flame className="w-12 h-12 text-orange-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-orange-400 mb-1">{userProgress.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
              <div className="text-xs text-muted-foreground mt-1">
                Keep learning daily!
              </div>
            </div>

            <div className="text-center">
              <Award className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-400 mb-1">
                {userProgress.unlockedAchievements}/{userProgress.totalAchievements}
              </div>
              <div className="text-sm text-muted-foreground">Achievements</div>
              <Progress 
                value={(userProgress.unlockedAchievements / userProgress.totalAchievements) * 100} 
                className="mt-2 h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          {/* Filters */}
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold">Filter by category:</span>
                  <select 
                    className="px-3 py-1 bg-background border border-border rounded text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="trading">Trading</option>
                    <option value="security">Security</option>
                    <option value="defi">DeFi</option>
                    <option value="fundamentals">Fundamentals</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="unlocked-only"
                    checked={showUnlockedOnly}
                    onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                  />
                  <label htmlFor="unlocked-only" className="text-sm">Show unlocked only</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredAchievements().map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <Card 
                  key={achievement.id} 
                  className={`glass hover:shadow-2xl transition-all duration-300 ${
                    achievement.unlocked ? 'border-green-500/30' : 'border-gray-600'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        <IconComponent 
                          className="w-8 h-8" 
                          style={{ color: achievement.color }}
                        />
                      </div>
                      <div className="text-right">
                        <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                          {achievement.rarity}
                        </Badge>
                        <div className="text-sm font-bold mt-1" style={{ color: achievement.color }}>
                          {achievement.points} XP
                        </div>
                      </div>
                    </div>

                    <h4 className={`font-semibold text-lg mb-2 ${achievement.unlocked ? '' : 'text-gray-400'}`}>
                      {achievement.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {achievement.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <Badge className={getDifficultyColor(achievement.difficulty)} variant="outline">
                          {achievement.difficulty}
                        </Badge>
                        <span className="text-muted-foreground">{achievement.requirement}</span>
                      </div>

                      {achievement.unlocked ? (
                        <div className="flex items-center space-x-2 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Unlocked {achievement.unlockedDate}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress:</span>
                            <span className="font-semibold">{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6">
          <div className="space-y-4">
            {learningPaths.map((path) => (
              <Card key={path.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="font-semibold text-lg">{path.title}</h4>
                        <Badge className={getDifficultyColor(path.difficulty)} variant="outline">
                          {path.difficulty}
                        </Badge>
                        <Badge variant="outline">{path.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{path.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Progress</div>
                          <div className="font-semibold">
                            {path.completedModules}/{path.totalModules} modules
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Time</div>
                          <div className="font-semibold">{path.estimatedTime}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Achievements</div>
                          <div className="font-semibold">{path.achievements.length} available</div>
                        </div>
                      </div>

                      {path.prerequisites.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-semibold mb-2">Prerequisites:</div>
                          <div className="flex flex-wrap gap-2">
                            {path.prerequisites.map((prereq, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {prereq.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Progress value={path.progress} className="mb-3" />
                      <div className="text-sm text-muted-foreground">
                        {path.progress}% completed
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <Button className="mb-2">
                        {path.progress > 0 ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Start Path
                          </>
                        )}
                      </Button>
                      
                      {path.progress === 100 && (
                        <div className="flex items-center space-x-1 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span>Learning Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { rank: 1, name: "Alex Chen", points: 4250, level: 18, badge: "Crypto Master" },
                { rank: 2, name: "Sarah Johnson", points: 3890, level: 16, badge: "DeFi Expert" },
                { rank: 3, name: "Mike Rodriguez", points: 3120, level: 14, badge: "Trading Pro" },
                { rank: 4, name: "You", points: userProgress.totalPoints, level: userProgress.level, badge: userProgress.rank },
                { rank: 5, name: "Emma Watson", points: 2180, level: 11, badge: "Security Specialist" },
                { rank: 6, name: "David Kim", points: 1950, level: 10, badge: "Blockchain Scholar" },
                { rank: 7, name: "Lisa Zhang", points: 1780, level: 9, badge: "Crypto Enthusiast" }
              ].map((user, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    user.name === "You" ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      user.rank === 1 ? 'bg-yellow-500' :
                      user.rank === 2 ? 'bg-gray-400' :
                      user.rank === 3 ? 'bg-amber-600' :
                      'bg-slate-600'
                    }`}>
                      {user.rank <= 3 ? (
                        user.rank === 1 ? <Crown className="w-4 h-4" /> :
                        user.rank === 2 ? <Medal className="w-4 h-4" /> :
                        <Award className="w-4 h-4" />
                      ) : (
                        user.rank
                      )}
                    </div>
                    
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.badge}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">{user.points.toLocaleString()} XP</div>
                    <div className="text-sm text-muted-foreground">Level {user.level}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Challenges */}
          <Card className="glass border-orange-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-orange-400" />
                <span>Weekly Challenges</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold">Complete 3 Trading Courses</h5>
                  <Badge className="bg-orange-500/20 text-orange-400" variant="outline">
                    500 XP
                  </Badge>
                </div>
                <Progress value={67} className="mb-2" />
                <div className="text-sm text-muted-foreground">2/3 completed • 2 days left</div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold">Maintain Learning Streak</h5>
                  <Badge className="bg-blue-500/20 text-blue-400" variant="outline">
                    300 XP
                  </Badge>
                </div>
                <Progress value={100} className="mb-2" />
                <div className="text-sm text-green-400">Completed! 7/7 days</div>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold">Help 2 Community Members</h5>
                  <Badge className="bg-purple-500/20 text-purple-400" variant="outline">
                    400 XP
                  </Badge>
                </div>
                <Progress value={50} className="mb-2" />
                <div className="text-sm text-muted-foreground">1/2 completed • 4 days left</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}