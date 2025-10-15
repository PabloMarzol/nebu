import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  X, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Coffee,
  Zap,
  Star,
  Gift,
  Trophy,
  Rocket,
  Target,
  CheckCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  action?: string;
  targetElement?: string;
  personality: 'excited' | 'helpful' | 'encouraging' | 'playful' | 'wise';
  reward?: {
    type: 'xp' | 'badge' | 'unlock';
    value: string;
    amount?: number;
  };
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: "Welcome to NebulaX! 🚀",
    content: "Hey there, future crypto champion! I'm Nebby, your personal trading companion. I'm absolutely THRILLED to show you around our amazing platform! Ready to become a crypto master?",
    personality: 'excited',
    reward: { type: 'xp', value: 'First Steps', amount: 50 }
  },
  {
    id: 'dashboard',
    title: "Your Command Center 📊",
    content: "This gorgeous dashboard is your mission control! See those beautiful charts? That's real-time market data flowing like digital magic. I just love watching those numbers dance!",
    targetElement: '.dashboard-overview',
    personality: 'excited',
    action: "Explore the dashboard layout"
  },
  {
    id: 'portfolio',
    title: "Your Treasure Chest 💰",
    content: "Your portfolio is where your crypto treasures live! Think of me as your financial fairy godmother - I'll help you track every satoshi and celebrate every gain with you!",
    targetElement: '.portfolio-section',
    personality: 'helpful',
    reward: { type: 'badge', value: 'Portfolio Explorer' }
  },
  {
    id: 'trading',
    title: "Let's Make Some Magic! ✨",
    content: "Now for the fun part - TRADING! Don't worry, I'll be right here holding your hand. Remember, every expert was once a beginner, and I believe in you 100%!",
    targetElement: '.trading-interface',
    personality: 'encouraging',
    action: "Try placing your first order"
  },
  {
    id: 'markets',
    title: "The Crypto Universe 🌌",
    content: "Welcome to the markets - it's like a candy store for traders! So many delicious opportunities. I get butterflies just thinking about all the possibilities ahead of us!",
    targetElement: '.markets-section',
    personality: 'playful',
    reward: { type: 'xp', value: 'Market Explorer', amount: 75 }
  },
  {
    id: 'ai-assistant',
    title: "Meet Your AI Trading Buddy 🤖",
    content: "Psst... want to know a secret? Our AI assistant is like having a crystal ball for trading insights. It's so smart, sometimes I'm a little jealous! But don't tell it I said that 😉",
    targetElement: '.ai-assistant',
    personality: 'playful',
    action: "Ask the AI assistant a question"
  },
  {
    id: 'security',
    title: "Your Digital Fortress 🛡️",
    content: "Security isn't just important - it's EVERYTHING. I'm like your digital bodyguard, making sure your assets are safer than a dragon's treasure hoard!",
    targetElement: '.security-settings',
    personality: 'wise',
    reward: { type: 'badge', value: 'Security Champion' }
  },
  {
    id: 'completion',
    title: "You're Officially Amazing! 🎉",
    content: "WOW! You've completed the tour and I couldn't be more proud! You're now ready to conquer the crypto world. Remember, I'm always here if you need a friend or have questions. Go make some magic happen!",
    personality: 'excited',
    reward: { type: 'unlock', value: 'Advanced Features' }
  }
];

const personalityStyles = {
  excited: {
    bgGradient: "from-orange-500 to-pink-500",
    textColor: "text-orange-100",
    icon: Sparkles,
    animation: "bounce"
  },
  helpful: {
    bgGradient: "from-blue-500 to-cyan-500", 
    textColor: "text-blue-100",
    icon: Heart,
    animation: "pulse"
  },
  encouraging: {
    bgGradient: "from-green-500 to-emerald-500",
    textColor: "text-green-100", 
    icon: Trophy,
    animation: "wiggle"
  },
  playful: {
    bgGradient: "from-purple-500 to-pink-500",
    textColor: "text-purple-100",
    icon: Star,
    animation: "swing"
  },
  wise: {
    bgGradient: "from-indigo-500 to-purple-500",
    textColor: "text-indigo-100",
    icon: Zap,
    animation: "glow"
  }
};

export default function InteractiveTutorialBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [userXP, setUserXP] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [isPaused, setPaused] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const step = tutorialSteps[currentStep];
  const personality = personalityStyles[step?.personality || 'helpful'];
  const IconComponent = personality.icon;
  
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  useEffect(() => {
    // Auto-start tutorial for new users
    const hasSeenTutorial = localStorage.getItem('nebulax-tutorial-completed');
    if (!hasSeenTutorial) {
      setTimeout(() => {
        setIsOpen(true);
        setIsActive(true);
      }, 2000);
    }
  }, []);

  // Auto-dismiss tutorial after 5 seconds when it opens
  useEffect(() => {
    let dismissTimer: NodeJS.Timeout;
    
    if (isOpen && isActive) {
      dismissTimer = setTimeout(() => {
        setIsOpen(false);
        setIsActive(false);
      }, 5000);
    }
    
    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    };
  }, [isOpen, isActive]);

  const handleNext = () => {
    if (step?.reward) {
      if (step.reward.type === 'xp' && step.reward.amount) {
        setUserXP(prev => prev + step.reward!.amount!);
      } else if (step.reward.type === 'badge' && step.reward.value) {
        setEarnedBadges(prev => [...prev, step.reward!.value]);
      }
      setShowReward(true);
      setTimeout(() => setShowReward(false), 2000);
    }

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Tutorial completed
      localStorage.setItem('nebulax-tutorial-completed', 'true');
      setIsActive(false);
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    setIsOpen(false);
  };

  const restart = () => {
    setCurrentStep(0);
    setUserXP(0);
    setEarnedBadges([]);
    setIsActive(true);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 rounded-full w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
        title="Tutorial Bot"
      >
        <Bot className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="fixed bottom-4 right-4 z-50 w-96 max-w-[90vw]"
      >
        <Card className="bg-background/95 backdrop-blur border border-border shadow-2xl">
          <CardHeader className={`bg-gradient-to-r ${personality.bgGradient} text-white relative overflow-hidden`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="p-2 bg-white/20 rounded-full"
                  animate={{ 
                    rotate: personality.animation === 'bounce' ? [0, 10, -10, 0] : 0,
                    scale: personality.animation === 'pulse' ? [1, 1.1, 1] : 1
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </motion.div>
                <div>
                  <CardTitle className="text-lg font-bold">Nebby</CardTitle>
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                    Your Tutorial Companion
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isPaused ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPaused(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPaused(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Tutorial Progress</span>
                <span>{currentStep + 1}/{tutorialSteps.length}</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>

            {/* XP and badges display */}
            <div className="flex items-center justify-between mt-2 text-sm">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>{userXP} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>{earnedBadges.length} badges</span>
              </div>
            </div>
          </CardHeader>

          {!isPaused && (
            <CardContent className="p-6">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-bold mb-3 text-foreground">
                  {step?.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {step?.content}
                </p>

                {step?.action && (
                  <div className="mb-4 p-3 bg-muted rounded-lg border border-border">
                    <div className="flex items-center space-x-2 text-sm font-medium">
                      <Target className="w-4 h-4 text-primary" />
                      <span>Try this: {step.action}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={restart}
                      className="flex items-center space-x-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restart</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSkip}
                    >
                      Skip Tutorial
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleNext}
                    className={`bg-gradient-to-r ${personality.bgGradient} hover:opacity-90 flex items-center space-x-2`}
                  >
                    <span>{currentStep === tutorialSteps.length - 1 ? 'Complete!' : 'Next'}</span>
                    {currentStep === tutorialSteps.length - 1 ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          )}

          {isPaused && (
            <CardContent className="p-6 text-center">
              <Coffee className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">Tutorial paused. Take your time!</p>
              <Button 
                onClick={() => setPaused(false)}
                className="mt-3"
                variant="outline"
              >
                Continue Learning
              </Button>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Reward popup */}
      <AnimatePresence>
        {showReward && step?.reward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 text-center shadow-2xl">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <Gift className="w-12 h-12 mx-auto mb-3" />
              </motion.div>
              <h3 className="text-lg font-bold mb-2">Reward Earned!</h3>
              <p className="text-sm">
                {step.reward.type === 'xp' && `+${step.reward.amount} XP`}
                {step.reward.type === 'badge' && `Badge: ${step.reward.value}`}
                {step.reward.type === 'unlock' && `Unlocked: ${step.reward.value}`}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}