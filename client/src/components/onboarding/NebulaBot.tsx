import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PaintTransition } from '@/components/ui/paint-transitions';
import { Star, Sparkles, Zap, Heart, MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  target?: string;
  mascotMood: 'excited' | 'helpful' | 'proud' | 'thinking' | 'celebrating';
  tips: string[];
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NebulaX! 🚀',
    description: "Hi there! I'm Nebby, your personal crypto trading guide. Let's explore this amazing platform together!",
    mascotMood: 'excited',
    tips: ['Take your time', 'Ask me anything', 'Have fun learning!']
  },
  {
    id: 'navigation',
    title: 'Navigation Made Easy',
    description: "See that beautiful navbar up top? It's your command center! Click on different sections to explore.",
    target: 'navbar',
    mascotMood: 'helpful',
    tips: ['Portfolio shows your assets', 'Trading is where the magic happens', 'Security keeps you safe']
  },
  {
    id: 'portfolio',
    title: 'Your Portfolio Dashboard',
    description: "This is your financial cockpit! Track your investments, see performance, and manage your crypto empire.",
    target: 'portfolio',
    action: 'goto-portfolio',
    mascotMood: 'proud',
    tips: ['Check balance regularly', 'Monitor performance', 'Diversify wisely']
  },
  {
    id: 'trading',
    title: 'Trading Interface',
    description: "Ready to trade? This is where you buy, sell, and make those sweet crypto moves! Start small and learn.",
    target: 'trading',
    action: 'goto-trading',
    mascotMood: 'thinking',
    tips: ['Start with small amounts', 'Use limit orders', 'Learn about fees']
  },
  {
    id: 'security',
    title: 'Security First!',
    description: "Your security is my priority! Set up 2FA, use strong passwords, and keep your account locked down tight.",
    target: 'security',
    action: 'goto-security',
    mascotMood: 'helpful',
    tips: ['Enable 2FA now', 'Use unique passwords', 'Review sessions regularly']
  },
  {
    id: 'complete',
    title: 'You're All Set! 🎉',
    description: "Congratulations! You've mastered the basics. You're now ready to explore the world of crypto trading!",
    mascotMood: 'celebrating',
    tips: ['Practice makes perfect', 'Join our community', 'Keep learning!']
  }
];

const MASCOT_EXPRESSIONS = {
  excited: '(◕‿◕)',
  helpful: '(◔_◔)',
  proud: '(ᵔ◡ᵔ)',
  thinking: '(˘▾˘)',
  celebrating: '\\(^o^)/'
};

const QUICK_TIPS = [
  { icon: Star, text: "Your first trade gets a 50% fee discount!", color: "#F59E0B" },
  { icon: Sparkles, text: "Enable notifications for price alerts", color: "#8B5CF6" },
  { icon: Zap, text: "Use limit orders to control your entry price", color: "#3B82F6" },
  { icon: Heart, text: "Join our community for trading tips", color: "#EC4899" }
];

interface NebulaBot Props {
  isVisible: boolean;
  onClose: () => void;
  currentStep?: string;
  onStepComplete: (stepId: string) => void;
  onNavigate: (route: string) => void;
}

export function NebulaBot({ isVisible, onClose, currentStep = 'welcome', onStepComplete, onNavigate }: NebulaBotProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [mascotAnimation, setMascotAnimation] = useState('idle');

  const step = TUTORIAL_STEPS[currentStepIndex];

  useEffect(() => {
    const stepIndex = TUTORIAL_STEPS.findIndex(s => s.id === currentStep);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      onStepComplete(TUTORIAL_STEPS[newIndex].id);
      setMascotAnimation('bounce');
      setTimeout(() => setMascotAnimation('idle'), 1000);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleAction = () => {
    if (step.action) {
      onNavigate(step.action);
    }
    nextStep();
  };

  const toggleTips = () => {
    setShowTips(!showTips);
    setMascotAnimation('wiggle');
    setTimeout(() => setMascotAnimation('idle'), 500);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="w-80"
          >
            <PaintTransition
              isVisible={true}
              direction="up"
              paintColor="#3B82F6"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        animate={
                          mascotAnimation === 'bounce' ? { 
                            y: [-5, 0, -5, 0],
                            rotate: [-5, 5, -5, 0]
                          } : mascotAnimation === 'wiggle' ? {
                            x: [-2, 2, -2, 2, 0],
                            rotate: [-2, 2, -2, 2, 0]
                          } : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        {MASCOT_EXPRESSIONS[step.mascotMood]}
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Nebby</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Your Crypto Guide</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMinimized(true)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{currentStepIndex + 1}/{TUTORIAL_STEPS.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStepIndex + 1) / TUTORIAL_STEPS.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {step.description}
                    </p>

                    {/* Tips */}
                    <div className="space-y-1">
                      {step.tips.map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          {tip}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={previousStep}
                      disabled={currentStepIndex === 0}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      Previous
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTips}
                        className="flex items-center gap-1"
                      >
                        <MessageCircle className="h-3 w-3" />
                        Tips
                      </Button>
                      
                      {step.action ? (
                        <Button
                          onClick={handleAction}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          Let's Go!
                        </Button>
                      ) : (
                        <Button
                          onClick={nextStep}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          {currentStepIndex === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </PaintTransition>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized State */}
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsMinimized(false)}
            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg hover:scale-110 transition-transform"
          >
            {MASCOT_EXPRESSIONS[step.mascotMood]}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick Tips Popup */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-2 w-72"
          >
            <Card className="bg-white dark:bg-gray-800 border-2 border-yellow-200 dark:border-yellow-800 shadow-lg">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    Quick Tips
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTips(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {QUICK_TIPS.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <tip.icon 
                        className="h-4 w-4 flex-shrink-0" 
                        style={{ color: tip.color }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {tip.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}