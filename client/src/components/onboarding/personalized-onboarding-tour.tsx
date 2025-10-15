import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  Gift,
  Sparkles,
  Zap,
  Crown,
  Medal,
  Award,
  Rocket,
  Users,
  TrendingUp,
  Shield,
  BookOpen,
  X,
  Play,
  Pause,
  SkipForward
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  points: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "trading" | "security" | "portfolio" | "social";
  completed: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface UserProfile {
  name: string;
  level: number;
  totalPoints: number;
  currentStreak: number;
  completedSteps: number;
  experienceType: "beginner" | "intermediate" | "expert";
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to NebulaX",
    description: "Get familiar with your trading dashboard and main navigation",
    target: "dashboard",
    points: 50,
    difficulty: "beginner",
    category: "trading",
    completed: false
  },
  {
    id: "portfolio-setup",
    title: "Set Up Your Portfolio",
    description: "Create your first portfolio and add your preferred cryptocurrencies",
    target: "portfolio",
    points: 100,
    difficulty: "beginner",
    category: "portfolio",
    completed: false
  },
  {
    id: "security-enable",
    title: "Enable Security Features",
    description: "Activate 2FA and set up security preferences for maximum protection",
    target: "security",
    points: 150,
    difficulty: "intermediate",
    category: "security",
    completed: false
  },
  {
    id: "first-trade",
    title: "Execute Your First Trade",
    description: "Place your first buy order and learn about order types",
    target: "trading",
    points: 200,
    difficulty: "intermediate",
    category: "trading",
    completed: false
  },
  {
    id: "ai-assistant",
    title: "Meet Your AI Trading Assistant",
    description: "Discover how AI can enhance your trading decisions",
    target: "ai-assistant",
    points: 100,
    difficulty: "beginner",
    category: "trading",
    completed: false
  },
  {
    id: "social-features",
    title: "Join the Community",
    description: "Connect with other traders and explore social features",
    target: "social",
    points: 75,
    difficulty: "beginner",
    category: "social",
    completed: false
  },
  {
    id: "advanced-trading",
    title: "Advanced Trading Tools",
    description: "Learn about limit orders, stop-losses, and advanced charts",
    target: "trading",
    points: 250,
    difficulty: "advanced",
    category: "trading",
    completed: false
  }
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first onboarding step",
    icon: Trophy,
    rarity: "common",
    points: 25,
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: "security-champion",
    name: "Security Champion",
    description: "Enable all security features",
    icon: Shield,
    rarity: "rare",
    points: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: "trading-novice",
    name: "Trading Novice",
    description: "Complete 5 trades successfully",
    icon: TrendingUp,
    rarity: "epic",
    points: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    description: "Connect with 10 other traders",
    icon: Users,
    rarity: "rare",
    points: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: "master-trader",
    name: "Master Trader",
    description: "Complete all onboarding steps",
    icon: Crown,
    rarity: "legendary",
    points: 500,
    unlocked: false,
    progress: 0,
    maxProgress: 7
  }
];

export default function PersonalizedOnboardingTour() {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Trader",
    level: 1,
    totalPoints: 0,
    currentStreak: 0,
    completedSteps: 0,
    experienceType: "beginner"
  });
  const [steps, setSteps] = useState(ONBOARDING_STEPS);
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [, setLocation] = useLocation();

  // Load saved progress on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('onboardingProgress');
      if (savedProgress) {
        const { userProfile: savedProfile, steps: savedSteps, currentStep: savedCurrentStep } = JSON.parse(savedProgress);
        setUserProfile(savedProfile);
        setSteps(savedSteps);
        setCurrentStep(savedCurrentStep);
      }
    } catch (error) {
      console.warn('Failed to load onboarding progress:', error);
    }
  }, []);

  // Save progress when state changes
  useEffect(() => {
    try {
      const progressData = {
        userProfile,
        steps,
        currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem('onboardingProgress', JSON.stringify(progressData));
    } catch (error) {
      console.warn('Failed to save onboarding progress:', error);
    }
  }, [userProfile, steps, currentStep]);

  const completedStepsCount = steps.filter(step => step.completed).length;
  const totalProgress = (completedStepsCount / steps.length) * 100;

  const navigateToStep = (target: string) => {
    const routeMap: { [key: string]: string } = {
      "dashboard": "/",
      "portfolio": "/portfolio",
      "security": "/security",
      "trading": "/trading",
      "ai-assistant": "/ai-assistant",
      "social": "/social-education",
    };
    
    const route = routeMap[target] || "/";
    
    // Show navigation feedback
    toast({
      title: "Navigating to " + target,
      description: `Taking you to ${route} to complete this step`,
    });
    
    setLocation(route);
  };

  const completeStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step || step.completed) return;

    setSteps(prev => prev.map(s => 
      s.id === stepId ? { ...s, completed: true } : s
    ));
    
    setUserProfile(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + step.points,
      completedSteps: prev.completedSteps + 1,
      currentStreak: prev.currentStreak + 1,
      level: Math.floor((prev.totalPoints + step.points) / 100) + 1
    }));

    // Show completion feedback
    toast({
      title: "Step Completed! 🎉",
      description: `You earned ${step.points} points for completing "${step.title}"`,
    });

    // Check for achievement unlocks
    checkAchievements(stepId);

    // Move to next step automatically
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000);
    } else {
      // All steps completed
      toast({
        title: "Onboarding Complete! 🚀",
        description: "Congratulations! You've completed all onboarding steps.",
      });
    }
  };

  const checkAchievements = (completedStepId: string) => {
    const updatedAchievements = [...achievements];
    let newAchievement: Achievement | null = null;

    // First Steps achievement
    if (completedStepId && !updatedAchievements[0].unlocked) {
      updatedAchievements[0].unlocked = true;
      updatedAchievements[0].progress = 1;
      newAchievement = updatedAchievements[0];
    }

    // Security Champion
    const securitySteps = steps.filter(s => s.category === "security" && s.completed).length;
    if (securitySteps >= 1 && !updatedAchievements[1].unlocked) {
      updatedAchievements[1].progress = securitySteps;
      if (securitySteps >= updatedAchievements[1].maxProgress) {
        updatedAchievements[1].unlocked = true;
        newAchievement = updatedAchievements[1];
      }
    }

    // Master Trader
    if (completedStepsCount >= steps.length && !updatedAchievements[4].unlocked) {
      updatedAchievements[4].unlocked = true;
      updatedAchievements[4].progress = steps.length;
      newAchievement = updatedAchievements[4];
    }

    setAchievements(updatedAchievements);

    if (newAchievement) {
      setLatestAchievement(newAchievement);
      setShowAchievementPopup(true);
      setUserProfile(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + newAchievement.points
      }));
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-600 border-gray-300";
      case "rare": return "text-blue-600 border-blue-300";
      case "epic": return "text-purple-600 border-purple-300";
      case "legendary": return "text-yellow-600 border-yellow-300";
      default: return "text-gray-600 border-gray-300";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-yellow-100 text-yellow-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTour = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto"
      >
        <Card className="shadow-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="pb-3 px-3 sm:px-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <span className="hidden sm:inline">Personalized Onboarding</span>
                <span className="sm:hidden">Getting Started</span>
              </CardTitle>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 sm:p-2"
                >
                  {isPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={skipTour}
                  className="p-1 sm:p-2"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{completedStepsCount}/{steps.length}</span>
              </div>
              <Progress value={totalProgress} className="h-1.5 sm:h-2" />
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3">
              <div className="text-center p-1.5 sm:p-2 bg-white/50 rounded-lg">
                <div className="text-sm sm:text-lg font-bold text-blue-600">{userProfile.level}</div>
                <div className="text-xs text-muted-foreground">Level</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 bg-white/50 rounded-lg">
                <div className="text-sm sm:text-lg font-bold text-green-600">{userProfile.totalPoints}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <div className="text-center p-1.5 sm:p-2 bg-white/50 rounded-lg">
                <div className="text-sm sm:text-lg font-bold text-purple-600">{userProfile.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Current Step */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 border rounded-lg bg-white/70"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{currentStepData.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getDifficultyColor(currentStepData.difficulty)}>
                    {currentStepData.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-yellow-600">
                    <Star className="w-3 h-3" />
                    {currentStepData.points}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{currentStepData.description}</p>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigateToStep(currentStepData.target)}
                  className="flex-1"
                >
                  Go to Page
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => completeStep(currentStepData.id)}
                  disabled={currentStepData.completed}
                  className="flex-1"
                >
                  {currentStepData.completed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      Complete
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                {currentStep < steps.length - 1 && (
                  <Button size="sm" variant="outline" onClick={nextStep}>
                    <SkipForward className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Quick Achievement Preview */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Your Achievements</h4>
              <div className="grid grid-cols-5 gap-2">
                {achievements.slice(0, 5).map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.1 }}
                    className={`relative p-2 border rounded-lg text-center ${
                      achievement.unlocked 
                        ? `${getRarityColor(achievement.rarity)} bg-white` 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <achievement.icon className={`w-5 h-5 mx-auto ${
                      achievement.unlocked ? 'text-current' : 'text-gray-400'
                    }`} />
                    {achievement.unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
              <Button
                size="sm"
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievementPopup && latestAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60]"
          >
            <Card className="w-80 shadow-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1 }}
                  className="mb-4"
                >
                  <latestAchievement.icon className="w-16 h-16 mx-auto text-yellow-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Achievement Unlocked!</h3>
                <h4 className="text-lg font-semibold text-yellow-600 mb-2">{latestAchievement.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{latestAchievement.description}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge className={getRarityColor(latestAchievement.rarity)}>
                    {latestAchievement.rarity.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Star className="w-4 h-4" />
                    +{latestAchievement.points} points
                  </div>
                </div>
                <Button onClick={() => setShowAchievementPopup(false)}>
                  Awesome!
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}