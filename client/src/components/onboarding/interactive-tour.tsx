import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Trophy, 
  Target, 
  Star, 
  Zap, 
  Gift, 
  ArrowRight, 
  X,
  ChevronRight,
  Crown,
  Medal,
  Gem
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  reward: number;
  badge?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NebulaX Exchange!',
    description: 'Your journey to crypto mastery begins here. Complete this tour to unlock exclusive rewards!',
    target: '.navbar',
    position: 'bottom',
    reward: 50,
    badge: 'explorer'
  },
  {
    id: 'navigation',
    title: 'Master the Navigation',
    description: 'Explore our organized dropdown menus to access all trading features effortlessly.',
    target: '.navigation-dropdowns',
    position: 'bottom',
    reward: 75
  },
  {
    id: 'trading',
    title: 'Discover Trading Terminal',
    description: 'Access professional-grade trading tools with real-time market data.',
    target: '[href="/trading"]',
    position: 'bottom',
    reward: 100,
    badge: 'trader'
  },
  {
    id: 'ai-assistant',
    title: 'Meet Your AI Trading Companion',
    description: 'Get personalized trading recommendations powered by advanced AI algorithms.',
    target: '[href="/ai-assistant"]',
    position: 'bottom',
    reward: 125,
    badge: 'ai-powered'
  },
  {
    id: 'portfolio',
    title: 'Track Your Success',
    description: 'Monitor your portfolio performance with advanced analytics and insights.',
    target: '[href="/portfolio"]',
    position: 'bottom',
    reward: 100
  },
  {
    id: 'security',
    title: 'Fortress-Level Security',
    description: 'Experience enterprise-grade security features protecting your assets.',
    target: '[href="/security"]',
    position: 'bottom',
    reward: 150,
    badge: 'guardian'
  }
];

const achievements: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first onboarding tour',
    icon: Target,
    rarity: 'common',
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 6
  },
  {
    id: 'explorer',
    title: 'Platform Explorer',
    description: 'Discover all major platform features',
    icon: Sparkles,
    rarity: 'rare',
    points: 250,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'trader-elite',
    title: 'Elite Trader',
    description: 'Master advanced trading features',
    icon: Crown,
    rarity: 'epic',
    points: 500,
    unlocked: false,
    progress: 0,
    maxProgress: 15
  },
  {
    id: 'crypto-legend',
    title: 'Crypto Legend',
    description: 'Achieve mastery across all platform features',
    icon: Gem,
    rarity: 'legendary',
    points: 1000,
    unlocked: false,
    progress: 0,
    maxProgress: 25
  }
];

export default function InteractiveTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [showReward, setShowReward] = useState(false);
  const [recentReward, setRecentReward] = useState<{ points: number; badge?: string } | null>(null);

  const currentTourStep = tourSteps[currentStep];
  const progress = (completedSteps.length / tourSteps.length) * 100;

  useEffect(() => {
    // Auto-start tour for new users
    const hasSeenTour = localStorage.getItem('nebulax-tour-completed');
    if (!hasSeenTour) {
      setIsActive(true);
    }
  }, []);

  const handleStepComplete = () => {
    const step = tourSteps[currentStep];
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps(prev => [...prev, step.id]);
      setTotalPoints(prev => prev + step.reward);
      
      // Show reward animation
      setRecentReward({ points: step.reward, badge: step.badge });
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);

      // Update achievements
      updateAchievements(step.id);
    }

    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const updateAchievements = (stepId: string) => {
    setUserAchievements(prev => prev.map(achievement => {
      if (achievement.id === 'first-steps') {
        const newProgress = Math.min((achievement.progress || 0) + 1, achievement.maxProgress || 6);
        return {
          ...achievement,
          progress: newProgress,
          unlocked: newProgress >= (achievement.maxProgress || 6)
        };
      }
      return achievement;
    }));
  };

  const completeTour = () => {
    setIsActive(false);
    localStorage.setItem('nebulax-tour-completed', 'true');
    localStorage.setItem('nebulax-user-points', totalPoints.toString());
    
    // Unlock first achievement
    setUserAchievements(prev => prev.map(achievement => 
      achievement.id === 'first-steps' 
        ? { ...achievement, unlocked: true, progress: achievement.maxProgress }
        : achievement
    ));
  };

  const skipTour = () => {
    setIsActive(false);
    localStorage.setItem('nebulax-tour-completed', 'true');
  };

  const restartTour = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setTotalPoints(0);
    setIsActive(true);
    localStorage.removeItem('nebulax-tour-completed');
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  if (!isActive) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={restartTour}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full p-4 shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Tour Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-8 right-8 z-50 w-96"
          >
            <Card className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-md border-purple-500/20 text-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{currentTourStep.title}</CardTitle>
                      <CardDescription className="text-purple-200">
                        Step {currentStep + 1} of {tourSteps.length}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                    className="text-purple-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <Progress value={progress} className="mt-2" />
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-purple-100">
                  {currentTourStep.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-purple-200">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Reward: {currentTourStep.reward} points</span>
                  {currentTourStep.badge && (
                    <>
                      <Medal className="w-4 h-4 text-blue-400" />
                      <span>Badge: {currentTourStep.badge}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleStepComplete}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  
                  <div className="text-right text-sm">
                    <div className="text-purple-200">Total Points</div>
                    <div className="text-xl font-bold text-yellow-400">
                      {totalPoints.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reward Animation */}
          <AnimatePresence>
            {showReward && recentReward && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: { type: "spring", damping: 15 }
                }}
                exit={{ opacity: 0, scale: 0.5, y: -50 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-60"
              >
                <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 text-center shadow-2xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <Trophy className="w-8 h-8" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-2">Reward Unlocked!</h3>
                  <p className="text-lg">+{recentReward.points} Points</p>
                  {recentReward.badge && (
                    <p className="text-sm mt-1">Badge: {recentReward.badge}</p>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Achievement Progress */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 space-y-2"
          >
            {userAchievements.slice(0, 3).map((achievement) => (
              <motion.div
                key={achievement.id}
                className={`p-3 rounded-lg backdrop-blur-md border ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30' 
                    : 'bg-gray-900/50 border-gray-600/30'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2">
                  <achievement.icon 
                    className={`w-5 h-5 ${
                      achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'
                    }`} 
                  />
                  <div>
                    <div className={`text-sm font-medium ${
                      achievement.unlocked ? 'text-white' : 'text-gray-300'
                    }`}>
                      {achievement.title}
                    </div>
                    {achievement.progress !== undefined && (
                      <div className="text-xs text-gray-400">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    )}
                  </div>
                </div>
                
                {achievement.progress !== undefined && (
                  <Progress 
                    value={(achievement.progress / (achievement.maxProgress || 1)) * 100} 
                    className="mt-2 h-1"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}