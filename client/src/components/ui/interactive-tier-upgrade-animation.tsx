import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, 
  Zap, 
  Star, 
  Trophy, 
  Sparkles,
  ArrowUp,
  CheckCircle,
  Lock,
  Unlock,
  Gift,
  Rocket,
  Diamond
} from "lucide-react";

interface TierInfo {
  name: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
  requirements: { action: string; current: number; target: number }[];
  unlocked: boolean;
  price?: string;
}

export default function InteractiveTierUpgradeAnimation() {
  const [currentTier, setCurrentTier] = useState('basic');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [animatingTier, setAnimatingTier] = useState<string | null>(null);
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const tiers: Record<string, TierInfo> = {
    basic: {
      name: 'Basic Trader',
      icon: <Star className="w-5 h-5" />,
      color: 'bg-gray-500',
      benefits: ['$25K daily limit', 'Basic trading', 'Email support'],
      requirements: [
        { action: 'Complete verification', current: 1, target: 1 },
        { action: 'Make first trade', current: 0, target: 1 }
      ],
      unlocked: true
    },
    pro: {
      name: 'Pro Trader',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-blue-500',
      benefits: ['$250K daily limit', 'Advanced tools', 'Priority support', 'Copy trading'],
      requirements: [
        { action: 'Trade volume $10K+', current: 2500, target: 10000 },
        { action: 'Complete KYC Level 2', current: 0, target: 1 },
        { action: 'Hold for 30 days', current: 5, target: 30 }
      ],
      unlocked: false,
      price: '$29/month'
    },
    premium: {
      name: 'Premium Elite',
      icon: <Crown className="w-5 h-5" />,
      color: 'bg-purple-500',
      benefits: ['$1M daily limit', 'AI trading bots', 'Personal advisor', 'VIP events'],
      requirements: [
        { action: 'Trade volume $100K+', current: 45000, target: 100000 },
        { action: 'Maintain Pro for 90 days', current: 20, target: 90 },
        { action: 'Portfolio value $50K+', current: 25000, target: 50000 }
      ],
      unlocked: false,
      price: '$199/month'
    },
    elite: {
      name: 'Diamond Elite',
      icon: <Diamond className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      benefits: ['Unlimited trading', 'White-label access', 'Direct API', 'Institutional rates'],
      requirements: [
        { action: 'Trade volume $1M+', current: 150000, target: 1000000 },
        { action: 'Portfolio value $500K+', current: 100000, target: 500000 },
        { action: 'Invite 10 premium users', current: 2, target: 10 }
      ],
      unlocked: false,
      price: '$999/month'
    }
  };

  const tierOrder = ['basic', 'pro', 'premium', 'elite'];

  const simulateUpgrade = (targetTier: string) => {
    setAnimatingTier(targetTier);
    setCelebrationMode(true);
    
    // Progress animation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentTier(targetTier);
          createConfetti();
          setTimeout(() => {
            setCelebrationMode(false);
            setAnimatingTier(null);
            setProgress(0);
          }, 3000);
        }, 500);
      }
    }, 50);
  };

  const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'fixed pointer-events-none z-50';
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.innerHTML = ['🎉', '⭐', '💎', '🚀', '👑'][Math.floor(Math.random() * 5)];
      confetti.style.fontSize = '20px';
      confetti.style.animation = 'fall 3s linear forwards';
      
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  const getNextTier = () => {
    const currentIndex = tierOrder.indexOf(currentTier);
    return currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
  };

  const canUpgrade = (tierKey: string) => {
    const tier = tiers[tierKey];
    return tier.requirements.every(req => req.current >= req.target);
  };

  useEffect(() => {
    const handleShowUpgrade = () => setShowUpgrade(true);
    window.addEventListener('showTierUpgrade', handleShowUpgrade);
    return () => window.removeEventListener('showTierUpgrade', handleShowUpgrade);
  }, []);

  return (
    <>
      {/* Floating Tier Indicator */}
      <motion.div
        className="fixed top-20 right-4 z-50"
        animate={{ scale: celebrationMode ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.5, repeat: celebrationMode ? Infinity : 0 }}
      >
        <Card className="bg-black/90 backdrop-blur-lg border-purple-500/30 text-white">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${tiers[currentTier].color} text-white`}>
                {tiers[currentTier].icon}
              </div>
              <div>
                <div className="font-semibold text-sm">{tiers[currentTier].name}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpgrade(true)}
                  className="h-6 text-xs p-1 text-blue-400 hover:text-blue-300"
                >
                  View Upgrade Path
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showUpgrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpgrade(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="bg-black/90 backdrop-blur-lg border-purple-500/30 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span>Tier Upgrade Center</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUpgrade(false)}
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upgrade Progress Animation */}
                  {celebrationMode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block text-6xl mb-4"
                      >
                        🚀
                      </motion.div>
                      <h2 className="text-2xl font-bold mb-2">Upgrading to {tiers[animatingTier!]?.name}!</h2>
                      <Progress value={progress} className="w-64 mx-auto mb-4" />
                      <p className="text-blue-300">Unlocking premium features...</p>
                    </motion.div>
                  )}

                  {/* Tier Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tierOrder.map((tierKey, index) => {
                      const tier = tiers[tierKey];
                      const isCurrentTier = tierKey === currentTier;
                      const canUpgradeToTier = canUpgrade(tierKey);
                      const nextTier = getNextTier();
                      const isNextUpgrade = tierKey === nextTier;

                      return (
                        <motion.div
                          key={tierKey}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative ${isCurrentTier ? 'ring-2 ring-blue-500' : ''}`}
                        >
                          <Card className={`h-full ${
                            isCurrentTier 
                              ? 'bg-blue-500/20 border-blue-500' 
                              : tier.unlocked || canUpgradeToTier
                                ? 'bg-white/5 border-white/20 hover:bg-white/10' 
                                : 'bg-gray-500/10 border-gray-500/20'
                          }`}>
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-between text-sm">
                                <span className="flex items-center space-x-2">
                                  <div className={`p-2 rounded-full ${tier.color} text-white`}>
                                    {tier.icon}
                                  </div>
                                  <span>{tier.name}</span>
                                </span>
                                {isCurrentTier && (
                                  <Badge className="bg-blue-500 text-white">Current</Badge>
                                )}
                                {!tier.unlocked && !canUpgradeToTier && (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                )}
                              </CardTitle>
                              {tier.price && (
                                <p className="text-sm text-yellow-400 font-semibold">{tier.price}</p>
                              )}
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {/* Benefits */}
                              <div>
                                <h4 className="text-xs font-medium mb-2 text-green-400">Benefits</h4>
                                <ul className="space-y-1">
                                  {tier.benefits.map((benefit, i) => (
                                    <li key={i} className="text-xs flex items-start">
                                      <CheckCircle className="w-3 h-3 text-green-400 mr-1 mt-0.5 flex-shrink-0" />
                                      {benefit}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Requirements */}
                              {tier.requirements.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-medium mb-2 text-blue-400">Requirements</h4>
                                  <div className="space-y-2">
                                    {tier.requirements.map((req, i) => {
                                      const progressPercent = Math.min((req.current / req.target) * 100, 100);
                                      const isComplete = req.current >= req.target;
                                      
                                      return (
                                        <div key={i} className="space-y-1">
                                          <div className="flex justify-between text-xs">
                                            <span className={isComplete ? 'text-green-400' : 'text-gray-400'}>
                                              {req.action}
                                            </span>
                                            <span className={isComplete ? 'text-green-400' : 'text-yellow-400'}>
                                              {req.current.toLocaleString()}/{req.target.toLocaleString()}
                                            </span>
                                          </div>
                                          <Progress 
                                            value={progressPercent} 
                                            className="h-1"
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Upgrade Button */}
                              {isNextUpgrade && canUpgradeToTier && (
                                <Button
                                  onClick={() => simulateUpgrade(tierKey)}
                                  disabled={celebrationMode}
                                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                                >
                                  <ArrowUp className="w-4 h-4 mr-2" />
                                  Upgrade Now
                                </Button>
                              )}

                              {tier.price && !isCurrentTier && canUpgradeToTier && (
                                <Button
                                  onClick={() => simulateUpgrade(tierKey)}
                                  disabled={celebrationMode}
                                  variant="outline"
                                  className="w-full"
                                >
                                  <Gift className="w-4 h-4 mr-2" />
                                  Purchase Upgrade
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Progress Summary */}
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                        Your Trading Journey
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-400">$125K</div>
                          <div className="text-sm text-gray-400">Total Volume Traded</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400">47</div>
                          <div className="text-sm text-gray-400">Days Active</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-400">12</div>
                          <div className="text-sm text-gray-400">Achievements Unlocked</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add keyframes for confetti animation */}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

// Hook for triggering upgrade animations
export function useTierUpgrade() {
  const showUpgrade = () => {
    window.dispatchEvent(new Event('showTierUpgrade'));
  };

  return { showUpgrade };
}