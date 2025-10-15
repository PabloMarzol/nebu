import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Crown, 
  Medal,
  Award,
  Target,
  Flame,
  Shield,
  TrendingUp,
  Users,
  BookOpen,
  Zap,
  Gift,
  CheckCircle,
  Lock,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  rarity: "common" | "rare" | "epic" | "legendary";
  category: "trading" | "security" | "social" | "learning" | "milestone";
  points: number;
  xpReward: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
  requirements: string[];
}

interface UserProgress {
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  totalAchievements: number;
  unlockedAchievements: number;
  currentStreak: number;
  longestStreak: number;
  rank: string;
}

const ACHIEVEMENTS: Achievement[] = [
  // Trading Achievements
  {
    id: "first-trade",
    name: "First Steps",
    description: "Execute your first trade",
    icon: TrendingUp,
    rarity: "common",
    category: "trading",
    points: 100,
    xpReward: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    requirements: ["Complete 1 trade"]
  },
  {
    id: "trading-apprentice",
    name: "Trading Apprentice",
    description: "Complete 10 successful trades",
    icon: Target,
    rarity: "rare",
    category: "trading",
    points: 300,
    xpReward: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    requirements: ["Complete 10 trades", "Maintain 70% success rate"]
  },
  {
    id: "master-trader",
    name: "Master Trader",
    description: "Complete 100 trades with 80% success rate",
    icon: Crown,
    rarity: "legendary",
    category: "trading",
    points: 1000,
    xpReward: 500,
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    requirements: ["Complete 100 trades", "Maintain 80% success rate", "Reach Level 10"]
  },

  // Security Achievements
  {
    id: "security-conscious",
    name: "Security Conscious",
    description: "Enable 2FA and security features",
    icon: Shield,
    rarity: "common",
    category: "security",
    points: 150,
    xpReward: 75,
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    requirements: ["Enable 2FA", "Set up backup codes", "Configure security alerts"]
  },
  {
    id: "fortress-builder",
    name: "Fortress Builder",
    description: "Complete all security configurations",
    icon: Medal,
    rarity: "epic",
    category: "security",
    points: 500,
    xpReward: 250,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    requirements: ["Enable all security features", "Complete security audit", "Set withdrawal limits"]
  },

  // Social Achievements
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    description: "Connect with 10 traders",
    icon: Users,
    rarity: "rare",
    category: "social",
    points: 250,
    xpReward: 125,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    requirements: ["Follow 10 traders", "Join community discussions"]
  },
  {
    id: "influencer",
    name: "Crypto Influencer",
    description: "Gain 100 followers",
    icon: Star,
    rarity: "epic",
    category: "social",
    points: 750,
    xpReward: 375,
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    requirements: ["Gain 100 followers", "Share 50 insights", "Maintain 4+ rating"]
  },

  // Learning Achievements
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Complete 5 learning modules",
    icon: BookOpen,
    rarity: "common",
    category: "learning",
    points: 200,
    xpReward: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    requirements: ["Complete 5 educational modules", "Pass all quizzes"]
  },
  {
    id: "crypto-scholar",
    name: "Crypto Scholar",
    description: "Master all educational content",
    icon: Award,
    rarity: "legendary",
    category: "learning",
    points: 1200,
    xpReward: 600,
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    requirements: ["Complete all modules", "Score 95%+ on final exam", "Contribute to knowledge base"]
  },

  // Milestone Achievements
  {
    id: "early-adopter",
    name: "Early Adopter",
    description: "Join NebulaX in the first month",
    icon: Flame,
    rarity: "rare",
    category: "milestone",
    points: 400,
    xpReward: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    requirements: ["Register within first month of launch"]
  },
  {
    id: "loyalty-champion",
    name: "Loyalty Champion",
    description: "Active for 365 consecutive days",
    icon: Trophy,
    rarity: "legendary",
    category: "milestone",
    points: 2000,
    xpReward: 1000,
    unlocked: false,
    progress: 0,
    maxProgress: 365,
    requirements: ["Log in daily for 365 days", "Complete weekly challenges"]
  }
];

export default function AchievementSystem() {
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    totalXP: 0,
    currentLevelXP: 0,
    nextLevelXP: 1000,
    totalAchievements: ACHIEVEMENTS.length,
    unlockedAchievements: 0,
    currentStreak: 0,
    longestStreak: 0,
    rank: "Rookie Trader"
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
        glow: "shadow-gray-200"
      };
      case "rare": return {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-300",
        glow: "shadow-blue-200"
      };
      case "epic": return {
        bg: "bg-purple-100",
        text: "text-purple-700",
        border: "border-purple-300",
        glow: "shadow-purple-200"
      };
      case "legendary": return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-300",
        glow: "shadow-yellow-200"
      };
      default: return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
        glow: "shadow-gray-200"
      };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trading": return TrendingUp;
      case "security": return Shield;
      case "social": return Users;
      case "learning": return BookOpen;
      case "milestone": return Trophy;
      default: return Star;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory !== "all" && achievement.category !== selectedCategory) return false;
    if (showUnlockedOnly && !achievement.unlocked) return false;
    return true;
  });

  const categories = ["all", "trading", "security", "social", "learning", "milestone"];

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, unlocked: true, unlockedAt: new Date(), progress: achievement.maxProgress }
        : achievement
    ));

    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
      setUserProgress(prev => ({
        ...prev,
        totalXP: prev.totalXP + achievement.xpReward,
        unlockedAchievements: prev.unlockedAchievements + 1
      }));
    }
  };

  const progressPercentage = (progress: number, maxProgress: number) => {
    return (progress / maxProgress) * 100;
  };

  return (
    <div className="space-y-6">
      {/* User Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{userProgress.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userProgress.totalXP.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{userProgress.unlockedAchievements}/{userProgress.totalAchievements}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{userProgress.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {userProgress.level} Progress</span>
              <span className="text-sm text-muted-foreground">
                {userProgress.currentLevelXP}/{userProgress.nextLevelXP} XP
              </span>
            </div>
            <Progress 
              value={(userProgress.currentLevelXP / userProgress.nextLevelXP) * 100} 
              className="h-3"
            />
          </div>

          {/* Rank Badge */}
          <div className="mt-4 text-center">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              {userProgress.rank}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Category:</span>
              <div className="flex flex-wrap gap-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-sm rounded-full border transition-all ${
                      selectedCategory === category 
                        ? "bg-blue-100 text-blue-700 border-blue-300" 
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              className={`px-3 py-1 text-sm rounded-full border transition-all ${
                showUnlockedOnly 
                  ? "bg-green-100 text-green-700 border-green-300" 
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {showUnlockedOnly ? "Unlocked Only" : "Show All"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => {
            const colors = getRarityColor(achievement.rarity);
            const CategoryIcon = getCategoryIcon(achievement.category);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`relative overflow-hidden transition-all duration-300 ${
                    achievement.unlocked 
                      ? `${colors.border} ${colors.glow} shadow-lg` 
                      : "border-gray-200 opacity-75"
                  }`}
                >
                  <CardContent className="p-4">
                    {/* Rarity Indicator */}
                    <div className="absolute top-2 right-2">
                      <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                        {achievement.rarity}
                      </Badge>
                    </div>

                    {/* Achievement Icon */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      achievement.unlocked ? colors.bg : "bg-gray-100"
                    }`}>
                      {achievement.unlocked ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.2 }}
                        >
                          <achievement.icon className={`w-8 h-8 ${achievement.unlocked ? colors.text : "text-gray-400"}`} />
                        </motion.div>
                      ) : (
                        <Lock className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Achievement Details */}
                    <h3 className={`font-semibold mb-2 ${achievement.unlocked ? "text-gray-900" : "text-gray-500"}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm mb-3 ${achievement.unlocked ? "text-gray-600" : "text-gray-400"}`}>
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Progress</span>
                        <span className="text-xs text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress 
                        value={progressPercentage(achievement.progress, achievement.maxProgress)} 
                        className="h-2"
                      />
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{achievement.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs font-medium">{achievement.points}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-500" />
                          <span className="text-xs font-medium">{achievement.xpReward} XP</span>
                        </div>
                      </div>
                    </div>

                    {/* Unlock Date */}
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </div>
                    )}

                    {/* Demo Unlock Button */}
                    {!achievement.unlocked && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => unlockAchievement(achievement.id)}
                        className="w-full mt-3"
                      >
                        <Gift className="w-3 h-3 mr-1" />
                        Demo Unlock
                      </Button>
                    )}

                    {/* Unlocked Effect */}
                    {achievement.unlocked && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 pointer-events-none"
                      >
                        <div className="absolute top-2 left-2">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Requirements Tooltip */}
      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No achievements found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more achievements.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}