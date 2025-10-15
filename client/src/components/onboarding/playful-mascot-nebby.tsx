import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Lightbulb, Star, Zap, Heart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TutorialTip {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  trigger: string;
  emotion: 'excited' | 'helpful' | 'proud' | 'curious' | 'playful';
  xp: number;
}

const tutorialTips: TutorialTip[] = [
  {
    id: 'welcome',
    title: 'Hey there, future crypto legend! 👋',
    content: "I'm Nebby, your friendly trading companion! I'll help you navigate the galaxy of crypto trading. Let's start your space journey!",
    icon: <Star className="w-4 h-4" />,
    trigger: 'onload',
    emotion: 'excited',
    xp: 50
  },
  {
    id: 'quick-converter',
    title: 'Quick Crypto Converter Magic! ✨',
    content: "See that converter box? It's your instant crypto calculator! Try converting some amounts - it's like having a crystal ball for prices!",
    icon: <Zap className="w-4 h-4" />,
    trigger: 'converter-hover',
    emotion: 'helpful',
    xp: 75
  },
  {
    id: 'portfolio-discovery',
    title: 'Your Personal Trading Command Center! 🚀',
    content: "The Portfolio section is where the magic happens! Track your holdings, see gains, and feel like a crypto astronaut commanding your fleet!",
    icon: <Heart className="w-4 h-4" />,
    trigger: 'portfolio-click',
    emotion: 'proud',
    xp: 100
  },
  {
    id: 'ai-assistant',
    title: 'Meet Your AI Trading Buddy! 🤖',
    content: "That pink floating button? It's your AI trading assistant! Ask it anything about crypto - it's like having a genius friend who never sleeps!",
    icon: <Lightbulb className="w-4 h-4" />,
    trigger: 'ai-button-hover',
    emotion: 'curious',
    xp: 125
  },
  {
    id: 'markets-explorer',
    title: 'Market Galaxy Awaits! 🌟',
    content: "Explore the Markets section to see live prices dancing like stars! Each coin has its own story - which one will catch your eye?",
    icon: <Gift className="w-4 h-4" />,
    trigger: 'markets-visit',
    emotion: 'playful',
    xp: 150
  }
];

const nebbyEmotions = {
  excited: '🤩',
  helpful: '😊',
  proud: '🥳',
  curious: '🤔',
  playful: '😄'
};

interface PlayfulMascotNebbyProps {
  onTipComplete?: (tipId: string, xp: number) => void;
  isInline?: boolean;
}

export default function PlayfulMascotNebby({ onTipComplete, isInline = false }: PlayfulMascotNebbyProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<TutorialTip | null>(null);
  const [completedTips, setCompletedTips] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [nebbyMood, setNebbyMood] = useState<'excited' | 'helpful' | 'proud' | 'curious' | 'playful'>('excited');
  const [isFloating, setIsFloating] = useState(true);

  // Auto-dismiss tip modal after 5 seconds (only when not inline)
  useEffect(() => {
    if (isVisible && currentTip && !isInline) {
      const dismissTimer = setTimeout(() => {
        console.log("Auto-dismissing Nebby tip after 5 seconds");
        dismissTip();
      }, 5000);

      return () => clearTimeout(dismissTimer);
    }
  }, [isVisible, currentTip, isInline]);

  // Show welcome tip on load
  useEffect(() => {
    const timer = setTimeout(() => {
      showTip('welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Track user interactions for contextual tips
  useEffect(() => {
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('[data-converter]')) {
        showTip('quick-converter');
      }
      if (target.closest('[data-ai-assistant]')) {
        showTip('ai-assistant');
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('[href="/portfolio"]')) {
        showTip('portfolio-discovery');
      }
      if (target.closest('[href="/markets"]')) {
        showTip('markets-explorer');
      }
    };

    document.addEventListener('mouseover', handleHover);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseover', handleHover);
      document.removeEventListener('click', handleClick);
    };
  }, [completedTips]);

  const showTip = (tipId: string) => {
    if (completedTips.includes(tipId)) return;
    
    const tip = tutorialTips.find(t => t.id === tipId);
    if (tip) {
      setCurrentTip(tip);
      setNebbyMood(tip.emotion);
      setIsVisible(true);
      setIsFloating(false);
    }
  };

  const completeTip = () => {
    if (!currentTip) return;
    
    setCompletedTips(prev => [...prev, currentTip.id]);
    setTotalXP(prev => prev + currentTip.xp);
    onTipComplete?.(currentTip.id, currentTip.xp);
    
    setIsVisible(false);
    setCurrentTip(null);
    
    // Return to floating mode after tip
    setTimeout(() => setIsFloating(true), 1000);
  };

  const dismissTip = () => {
    setIsVisible(false);
    setCurrentTip(null);
    setTimeout(() => setIsFloating(true), 500);
  };

  const getProgressPercentage = () => {
    return (completedTips.length / tutorialTips.length) * 100;
  };

  return (
    <>
      {/* Floating Nebby Mascot */}
      <AnimatePresence>
        {isFloating && !isVisible && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <Button
                onClick={() => showTip('welcome')}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-lg border-0 relative overflow-hidden"
                size="sm"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  {nebbyEmotions[nebbyMood]}
                </motion.div>
                
                {/* XP Badge */}
                {totalXP > 0 && (
                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {Math.floor(totalXP / 50)}
                  </div>
                )}
                
                {/* Sparkle Animation */}
                <motion.div
                  animate={{ 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <Star className="w-4 h-4 text-yellow-300 absolute top-1 right-1" />
                  <Star className="w-3 h-3 text-pink-300 absolute bottom-1 left-1" />
                </motion.div>
              </Button>

              {/* Thought Bubble Indicator */}
              {completedTips.length < tutorialTips.length && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs"
                >
                  💭
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial Tip Modal */}
      <AnimatePresence>
        {isVisible && currentTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 animate-pulse" />
              </div>

              {/* Nebby Avatar */}
              <div className="relative mb-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl shadow-lg"
                >
                  {nebbyEmotions[currentTip.emotion]}
                </motion.div>
                
                {/* Floating Particles */}
                <motion.div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        y: [0, -20, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                      className="absolute top-2 left-1/2 text-yellow-400"
                    >
                      ✨
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mr-2">
                    {currentTip.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {currentTip.title}
                  </h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {currentTip.content}
                </p>

                {/* XP Reward */}
                <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-center text-yellow-400">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="font-medium">+{currentTip.xp} XP Reward!</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Tutorial Progress</span>
                    <span>{completedTips.length + 1}/{tutorialTips.length}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: `${getProgressPercentage()}%` }}
                      animate={{ width: `${((completedTips.length + 1) / tutorialTips.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    onClick={completeTip}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium"
                  >
                    Got it! (+{currentTip.xp} XP)
                  </Button>
                  <Button
                    onClick={dismissTip}
                    variant="outline"
                    className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Celebration */}
      <AnimatePresence>
        {completedTips.length === tutorialTips.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-20 right-6 z-40 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl shadow-lg max-w-xs"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-bold">Tutorial Master!</div>
              <div className="text-sm opacity-90">You've earned {totalXP} XP total!</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}