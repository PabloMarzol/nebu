import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Trophy, Star, Zap, BookOpen, Target, Award, Map, Gamepad2, Gift, Crown } from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  category: "trading" | "defi" | "blockchain" | "security" | "analysis";
  estimatedTime: string;
  prerequisites: string[];
  rewards: {
    xp: number;
    coins: number;
    badges: string[];
  };
  progress: number;
  unlocked: boolean;
  completed: boolean;
  icon: string;
  lessons: number;
  quizzes: number;
}

interface UserProfile {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  streak: number;
  badges: string[];
  achievements: string[];
  currentPath: string;
  completedModules: string[];
  learningStyle: "visual" | "practical" | "theoretical" | "mixed";
  weeklyGoal: number;
  weeklyProgress: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: "streak" | "completion" | "performance" | "social";
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export default function PersonalizedLearningPath() {
  const [selectedPath, setSelectedPath] = useState("trader");
  const [showAchievements, setShowAchievements] = useState(false);
  const [animatingXP, setAnimatingXP] = useState(false);
  const [celebrationModule, setCelebrationModule] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    level: 12,
    xp: 2450,
    xpToNext: 550,
    coins: 1840,
    streak: 7,
    badges: ["🚀", "💎", "🔥", "🎯", "⚡"],
    achievements: ["first-module", "week-streak", "perfect-quiz"],
    currentPath: "trader",
    completedModules: ["crypto-basics", "bitcoin-fundamentals", "trading-101"],
    learningStyle: "mixed",
    weeklyGoal: 5,
    weeklyProgress: 3
  });

  const learningPaths = {
    trader: {
      name: "Professional Trader",
      icon: "📈",
      description: "Master technical analysis, risk management, and advanced trading strategies",
      totalModules: 15,
      estimatedWeeks: 8
    },
    investor: {
      name: "Smart Investor", 
      icon: "💼",
      description: "Learn long-term investment strategies, portfolio management, and market analysis",
      totalModules: 12,
      estimatedWeeks: 6
    },
    defi: {
      name: "DeFi Explorer",
      icon: "🏦", 
      description: "Dive deep into decentralized finance, yield farming, and protocol analysis",
      totalModules: 18,
      estimatedWeeks: 10
    },
    developer: {
      name: "Blockchain Developer",
      icon: "⚡",
      description: "Build smart contracts, dApps, and understand blockchain architecture",
      totalModules: 22,
      estimatedWeeks: 12
    }
  };

  const modules: LearningModule[] = [
    {
      id: "crypto-basics",
      title: "Cryptocurrency Fundamentals",
      description: "Understanding the basics of digital currencies and blockchain technology",
      difficulty: "beginner",
      category: "blockchain",
      estimatedTime: "2 hours",
      prerequisites: [],
      rewards: { xp: 100, coins: 50, badges: ["🌱"] },
      progress: 100,
      unlocked: true,
      completed: true,
      icon: "🪙",
      lessons: 8,
      quizzes: 2
    },
    {
      id: "bitcoin-fundamentals", 
      title: "Bitcoin Deep Dive",
      description: "Comprehensive study of Bitcoin's technology and economics",
      difficulty: "beginner",
      category: "blockchain",
      estimatedTime: "3 hours",
      prerequisites: ["crypto-basics"],
      rewards: { xp: 150, coins: 75, badges: ["₿"] },
      progress: 100,
      unlocked: true,
      completed: true,
      icon: "₿",
      lessons: 10,
      quizzes: 3
    },
    {
      id: "trading-101",
      title: "Trading Fundamentals",
      description: "Learn the basics of cryptocurrency trading and market dynamics",
      difficulty: "beginner",
      category: "trading",
      estimatedTime: "4 hours",
      prerequisites: ["bitcoin-fundamentals"],
      rewards: { xp: 200, coins: 100, badges: ["📊"] },
      progress: 100,
      unlocked: true,
      completed: true,
      icon: "📊",
      lessons: 12,
      quizzes: 4
    },
    {
      id: "technical-analysis",
      title: "Technical Analysis Mastery",
      description: "Advanced charting, indicators, and pattern recognition",
      difficulty: "intermediate",
      category: "analysis",
      estimatedTime: "6 hours",
      prerequisites: ["trading-101"],
      rewards: { xp: 300, coins: 150, badges: ["📈"] },
      progress: 65,
      unlocked: true,
      completed: false,
      icon: "📈",
      lessons: 15,
      quizzes: 5
    },
    {
      id: "risk-management",
      title: "Risk Management & Psychology",
      description: "Master position sizing, stop losses, and trading psychology",
      difficulty: "intermediate",
      category: "trading",
      estimatedTime: "5 hours",
      prerequisites: ["technical-analysis"],
      rewards: { xp: 250, coins: 125, badges: ["🛡️"] },
      progress: 0,
      unlocked: false,
      completed: false,
      icon: "🛡️",
      lessons: 12,
      quizzes: 4
    },
    {
      id: "defi-protocols",
      title: "DeFi Protocols & Yield Farming",
      description: "Explore Uniswap, Compound, Aave, and yield strategies",
      difficulty: "advanced",
      category: "defi",
      estimatedTime: "8 hours",
      prerequisites: ["trading-101"],
      rewards: { xp: 400, coins: 200, badges: ["🌾"] },
      progress: 0,
      unlocked: false,
      completed: false,
      icon: "🌾",
      lessons: 18,
      quizzes: 6
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "first-module",
      name: "First Steps",
      description: "Complete your first learning module",
      icon: "🌱",
      type: "completion",
      unlocked: true,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      rarity: "common"
    },
    {
      id: "week-streak",
      name: "Dedicated Learner", 
      description: "Maintain a 7-day learning streak",
      icon: "🔥",
      type: "streak",
      unlocked: true,
      unlockedAt: new Date(),
      rarity: "rare"
    },
    {
      id: "perfect-quiz",
      name: "Quiz Master",
      description: "Score 100% on 5 consecutive quizzes",
      icon: "🎯",
      type: "performance",
      unlocked: true,
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      rarity: "epic"
    },
    {
      id: "speed-learner",
      name: "Speed Demon",
      description: "Complete 3 modules in one day",
      icon: "⚡",
      type: "completion",
      unlocked: false,
      rarity: "legendary"
    }
  ];

  const completeModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module || module.completed) return;

    setCelebrationModule(moduleId);
    setAnimatingXP(true);

    setTimeout(() => {
      setUserProfile(prev => ({
        ...prev,
        xp: prev.xp + module.rewards.xp,
        coins: prev.coins + module.rewards.coins,
        completedModules: [...prev.completedModules, moduleId],
        weeklyProgress: prev.weeklyProgress + 1
      }));
      
      // Update module progress
      module.progress = 100;
      module.completed = true;
      
      // Unlock next modules
      modules.forEach(m => {
        if (m.prerequisites.includes(moduleId)) {
          m.unlocked = true;
        }
      });

      setAnimatingXP(false);
      setTimeout(() => setCelebrationModule(null), 3000);
    }, 1500);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400";
      case "rare": return "text-blue-400";
      case "epic": return "text-purple-400";
      case "legendary": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-orange-500";
      case "expert": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate learning progress updates
      modules.forEach(module => {
        if (!module.completed && module.unlocked && module.progress > 0 && module.progress < 100) {
          module.progress = Math.min(100, module.progress + Math.random() * 2);
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentPath = learningPaths[selectedPath as keyof typeof learningPaths];
  const pathModules = modules.filter(m => {
    if (selectedPath === "trader") return m.category === "trading" || m.category === "analysis" || m.id === "crypto-basics" || m.id === "bitcoin-fundamentals";
    if (selectedPath === "investor") return m.category === "trading" || m.category === "blockchain" || m.id === "crypto-basics";
    if (selectedPath === "defi") return m.category === "defi" || m.category === "blockchain" || m.id === "crypto-basics";
    return true;
  });

  return (
    <Card className="glass relative overflow-hidden">
      {celebrationModule && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 rounded-lg">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl text-green-400 font-bold mb-2">Module Completed!</div>
            <div className="text-lg text-purple-400">+{modules.find(m => m.id === celebrationModule)?.rewards.xp} XP</div>
            <div className="text-lg text-yellow-400">+{modules.find(m => m.id === celebrationModule)?.rewards.coins} Coins</div>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>Personalized Learning Journey</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAchievements(!showAchievements)}
              className="glass"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-strong">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">👑</div>
              <div className="text-lg font-bold text-purple-400">Level {userProfile.level}</div>
              <div className="text-sm text-muted-foreground">Crypto Enthusiast</div>
            </CardContent>
          </Card>
          
          <Card className="glass-strong">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className={`text-lg font-bold text-blue-400 ${animatingXP ? 'animate-pulse' : ''}`}>
                {userProfile.xp.toLocaleString()} XP
              </div>
              <div className="text-sm text-muted-foreground">{userProfile.xpToNext} to next level</div>
            </CardContent>
          </Card>
          
          <Card className="glass-strong">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🪙</div>
              <div className="text-lg font-bold text-yellow-400">{userProfile.coins}</div>
              <div className="text-sm text-muted-foreground">Learning Coins</div>
            </CardContent>
          </Card>
          
          <Card className="glass-strong">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-lg font-bold text-orange-400">{userProfile.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Path Selection */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <Map className="w-4 h-4 mr-2" />
            Choose Your Path
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(learningPaths).map(([key, path]) => (
              <Button
                key={key}
                variant={selectedPath === key ? "default" : "outline"}
                onClick={() => setSelectedPath(key)}
                className={`h-auto p-4 flex flex-col space-y-2 glass ${selectedPath === key ? 'border-purple-400' : ''}`}
              >
                <div className="text-2xl">{path.icon}</div>
                <div className="font-semibold text-sm">{path.name}</div>
                <div className="text-xs text-muted-foreground text-center">{path.totalModules} modules</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Path Info */}
        <Card className="glass-strong bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{currentPath.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{currentPath.name}</h3>
                <p className="text-muted-foreground mb-3">{currentPath.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Modules</div>
                    <div className="font-semibold">{currentPath.totalModules}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Estimated Time</div>
                    <div className="font-semibold">{currentPath.estimatedWeeks} weeks</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Completion</div>
                    <div className="font-semibold text-green-400">
                      {Math.round((userProfile.completedModules.length / currentPath.totalModules) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="glass-strong">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Weekly Goal
              </h4>
              <Badge className={userProfile.weeklyProgress >= userProfile.weeklyGoal ? "bg-green-500" : "bg-yellow-500"}>
                {userProfile.weeklyProgress}/{userProfile.weeklyGoal} modules
              </Badge>
            </div>
            <Progress 
              value={(userProfile.weeklyProgress / userProfile.weeklyGoal) * 100} 
              className="h-3 mb-2" 
            />
            <div className="text-sm text-muted-foreground">
              {userProfile.weeklyGoal - userProfile.weeklyProgress > 0 
                ? `${userProfile.weeklyGoal - userProfile.weeklyProgress} more modules to reach your goal!`
                : "🎉 Weekly goal achieved! Keep up the great work!"
              }
            </div>
          </CardContent>
        </Card>

        {/* Learning Modules */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <Gamepad2 className="w-4 h-4 mr-2" />
            Learning Modules
          </h3>
          <div className="space-y-3">
            {pathModules.map((module, index) => (
              <Card 
                key={module.id}
                className={`glass-strong transition-all hover:border-purple-400/50 ${
                  !module.unlocked ? 'opacity-50' : ''
                } ${
                  module.completed ? 'border-green-400/30' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className={`text-3xl ${!module.unlocked ? 'grayscale' : ''} ${module.completed ? 'animate-pulse' : ''}`}>
                        {module.icon}
                      </div>
                      {module.completed && (
                        <div className="absolute -top-1 -right-1 text-green-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{module.title}</h4>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDifficultyColor(module.difficulty)}>
                            {module.difficulty}
                          </Badge>
                          {!module.unlocked && <Badge variant="outline">🔒 Locked</Badge>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Time: </span>
                          <span>{module.estimatedTime}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Lessons: </span>
                          <span>{module.lessons}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Quizzes: </span>
                          <span>{module.quizzes}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Rewards: </span>
                          <span className="text-blue-400">{module.rewards.xp} XP</span>
                        </div>
                      </div>
                      
                      {module.unlocked && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Progress</span>
                            <span className="text-sm">{Math.round(module.progress)}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                      )}
                      
                      {module.prerequisites.length > 0 && !module.unlocked && (
                        <div className="mt-3 p-2 bg-yellow-500/10 rounded">
                          <div className="text-sm text-yellow-400">
                            Prerequisites: {module.prerequisites.join(", ")}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {module.unlocked && !module.completed && (
                        <Button 
                          size="sm"
                          onClick={() => module.progress < 100 ? completeModule(module.id) : undefined}
                          className="bg-gradient-to-r from-purple-500 to-pink-500"
                          disabled={module.progress < 100}
                        >
                          {module.progress === 0 ? "Start" : module.progress < 100 ? "Continue" : "Complete"}
                        </Button>
                      )}
                      {module.completed && (
                        <Button size="sm" variant="outline" className="glass">
                          <Crown className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements Panel */}
        {showAchievements && (
          <Card className="glass-strong">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-4 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Achievements & Badges
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      achievement.unlocked 
                        ? 'border-green-400/30 bg-green-500/10' 
                        : 'border-gray-600/30 bg-gray-500/10'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`text-2xl ${!achievement.unlocked ? 'grayscale' : ''}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-semibold">{achievement.name}</h5>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <div className="text-xs text-green-400 mt-1">
                            Unlocked {achievement.unlockedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Store */}
        <Card className="glass-strong">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Gift className="w-4 h-4 mr-2" />
              Learning Store
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 border border-purple-400/30 rounded-lg text-center">
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-semibold">Custom Avatar</div>
                <div className="text-sm text-muted-foreground mb-2">Personalize your profile</div>
                <Button size="sm" variant="outline" className="glass">
                  500 coins
                </Button>
              </div>
              <div className="p-3 border border-purple-400/30 rounded-lg text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-semibold">XP Boost</div>
                <div className="text-sm text-muted-foreground mb-2">2x XP for 24 hours</div>
                <Button size="sm" variant="outline" className="glass">
                  750 coins
                </Button>
              </div>
              <div className="p-3 border border-purple-400/30 rounded-lg text-center">
                <div className="text-2xl mb-2">🔓</div>
                <div className="font-semibold">Module Unlock</div>
                <div className="text-sm text-muted-foreground mb-2">Skip prerequisites</div>
                <Button size="sm" variant="outline" className="glass">
                  1000 coins
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}