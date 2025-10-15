import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Trophy, 
  Star, 
  CheckCircle, 
  Lock,
  Play,
  Award,
  Target,
  Zap,
  Brain,
  TrendingUp,
  Shield
} from "lucide-react";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  isCompleted: boolean;
  isLocked: boolean;
  topics: string[];
  icon: any;
}

interface UserProgress {
  totalPoints: number;
  completedModules: number;
  currentStreak: number;
  achievements: string[];
  level: number;
  nextLevelPoints: number;
}

const learningModules: LearningModule[] = [
  {
    id: 'crypto-basics',
    title: 'Cryptocurrency Fundamentals',
    description: 'Learn the basics of blockchain, Bitcoin, and digital assets',
    duration: '30 min',
    difficulty: 'beginner',
    points: 100,
    isCompleted: true,
    isLocked: false,
    topics: ['Blockchain', 'Bitcoin', 'Wallets', 'Private Keys'],
    icon: BookOpen
  },
  {
    id: 'trading-basics',
    title: 'Trading Fundamentals',
    description: 'Master market orders, limit orders, and basic trading strategies',
    duration: '45 min',
    difficulty: 'beginner',
    points: 150,
    isCompleted: true,
    isLocked: false,
    topics: ['Market Orders', 'Limit Orders', 'Order Books', 'Spreads'],
    icon: TrendingUp
  },
  {
    id: 'portfolio-management',
    title: 'Portfolio Management',
    description: 'Learn diversification, risk management, and asset allocation',
    duration: '60 min',
    difficulty: 'intermediate',
    points: 200,
    isCompleted: false,
    isLocked: false,
    topics: ['Diversification', 'Risk Assessment', 'Rebalancing', 'Asset Allocation'],
    icon: Target
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis',
    description: 'Chart patterns, indicators, and technical trading strategies',
    duration: '90 min',
    difficulty: 'intermediate',
    points: 250,
    isCompleted: false,
    isLocked: false,
    topics: ['Chart Patterns', 'RSI', 'MACD', 'Support & Resistance'],
    icon: Brain
  },
  {
    id: 'defi-protocols',
    title: 'DeFi & Protocols',
    description: 'Understand decentralized finance, yield farming, and liquidity',
    duration: '75 min',
    difficulty: 'advanced',
    points: 300,
    isCompleted: false,
    isLocked: true,
    topics: ['Yield Farming', 'Liquidity Pools', 'AMMs', 'Smart Contracts'],
    icon: Zap
  },
  {
    id: 'security-best-practices',
    title: 'Security & Best Practices',
    description: 'Protect your assets with advanced security measures',
    duration: '45 min',
    difficulty: 'intermediate',
    points: 200,
    isCompleted: false,
    isLocked: true,
    topics: ['2FA', 'Cold Storage', 'Phishing Prevention', 'Multi-sig'],
    icon: Shield
  }
];

const achievements = [
  { id: 'first-steps', title: 'First Steps', description: 'Complete your first module', icon: '🎯' },
  { id: 'knowledge-seeker', title: 'Knowledge Seeker', description: 'Complete 3 modules', icon: '📚' },
  { id: 'trading-expert', title: 'Trading Expert', description: 'Complete all trading modules', icon: '💹' },
  { id: 'week-streak', title: 'Weekly Warrior', description: '7-day learning streak', icon: '🔥' },
  { id: 'point-collector', title: 'Point Collector', description: 'Earn 1000 points', icon: '⭐' }
];

export default function CryptoLearningPath() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 250,
    completedModules: 2,
    currentStreak: 3,
    achievements: ['first-steps'],
    level: 1,
    nextLevelPoints: 500
  });

  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const progressPercentage = (userProgress.totalPoints / userProgress.nextLevelPoints) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500';
      case 'advanced': return 'bg-red-500/10 text-red-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const startModule = (moduleId: string) => {
    const module = learningModules.find(m => m.id === moduleId);
    if (module && !module.isLocked) {
      setSelectedModule(moduleId);
      // Simulate module completion
      setTimeout(() => {
        completeModule(moduleId);
      }, 2000);
    }
  };

  const completeModule = (moduleId: string) => {
    const module = learningModules.find(m => m.id === moduleId);
    if (module) {
      setUserProgress(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + module.points,
        completedModules: prev.completedModules + 1,
        currentStreak: prev.currentStreak + 1
      }));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    setSelectedModule(null);
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Crypto Learning Journey</CardTitle>
              <p className="text-muted-foreground">Level {userProgress.level} • {userProgress.totalPoints} points</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Trophy className="w-4 h-4" />
                {userProgress.currentStreak} day streak
              </div>
              <Progress value={progressPercentage} className="w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {achievements.map((achievement) => {
              const isUnlocked = userProgress.achievements.includes(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    isUnlocked 
                      ? 'bg-primary/10 border-primary/20 text-primary' 
                      : 'bg-muted/50 border-muted text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-lg">{achievement.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs opacity-75">{achievement.description}</p>
                  </div>
                  {isUnlocked && <CheckCircle className="w-4 h-4" />}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningModules.map((module, index) => {
          const IconComponent = module.icon;
          const isSelected = selectedModule === module.id;
          
          return (
            <motion.div
              key={module.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all duration-300 ${
                isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
              } ${module.isLocked ? 'opacity-60' : ''}`}>
                {module.isCompleted && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-green-500 rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                
                {module.isLocked && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-muted rounded-full p-1">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="secondary" className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>{module.duration}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {module.points}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Topics covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {module.topics.map((topic, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    variant={module.isCompleted ? "outline" : "default"}
                    disabled={module.isLocked || isSelected}
                    onClick={() => startModule(module.id)}
                  >
                    {isSelected ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Learning...
                      </>
                    ) : module.isCompleted ? (
                      "Review Module"
                    ) : module.isLocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              className="bg-card border rounded-lg p-8 text-center space-y-4 shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-bold">Module Completed!</h3>
              <p className="text-muted-foreground">
                Great job! You've earned points and improved your crypto knowledge.
              </p>
              <div className="flex justify-center">
                <Badge className="text-lg px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  +{learningModules.find(m => m.id === selectedModule)?.points} points
                </Badge>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}