import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target,
  PieChart,
  Clock,
  DollarSign,
  Brain,
  Rocket,
  ChevronRight,
  CheckCircle,
  Star,
  Lightbulb
} from "lucide-react";

interface UserProfile {
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  goals: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeCommitment: 'casual' | 'active' | 'fulltime';
  interests: string[];
  preferredAssets: string[];
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  completed: boolean;
}

export default function PersonalizedCryptoOnboarding() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    experience: 'beginner',
    goals: [],
    riskTolerance: 'moderate',
    timeCommitment: 'casual',
    interests: [],
    preferredAssets: []
  });
  const [showRecommendations, setShowRecommendations] = useState(false);

  const experienceOptions = [
    { value: 'beginner', label: 'New to Crypto', icon: '🌱', description: 'Just starting my crypto journey' },
    { value: 'intermediate', label: 'Some Experience', icon: '🚀', description: 'Made a few trades, learning more' },
    { value: 'advanced', label: 'Experienced Trader', icon: '⚡', description: 'Regular trading, understand markets' },
    { value: 'expert', label: 'Crypto Expert', icon: '💎', description: 'Professional level knowledge' }
  ];

  const goalOptions = [
    { id: 'longterm', label: 'Long-term Investment', icon: '📈' },
    { id: 'daytrading', label: 'Day Trading', icon: '⚡' },
    { id: 'passive', label: 'Passive Income', icon: '💰' },
    { id: 'learning', label: 'Learning & Education', icon: '🎓' },
    { id: 'diversify', label: 'Portfolio Diversification', icon: '🎯' },
    { id: 'defi', label: 'DeFi Protocols', icon: '🔗' }
  ];

  const assetOptions = [
    { id: 'btc', label: 'Bitcoin (BTC)', icon: '₿', risk: 'moderate' },
    { id: 'eth', label: 'Ethereum (ETH)', icon: '⟠', risk: 'moderate' },
    { id: 'stablecoins', label: 'Stablecoins', icon: '💵', risk: 'low' },
    { id: 'altcoins', label: 'Altcoins', icon: '🚀', risk: 'high' },
    { id: 'defi', label: 'DeFi Tokens', icon: '🔗', risk: 'high' },
    { id: 'nft', label: 'NFT Collections', icon: '🎨', risk: 'high' }
  ];

  const generatePersonalizedPlan = () => {
    const plans = {
      beginner: {
        title: "Crypto Basics Bootcamp",
        weeks: 4,
        features: ["Educational content", "Paper trading", "Basic portfolio", "Community support"],
        startingAmount: "$100-500",
        assets: ["BTC", "ETH", "Stablecoins"]
      },
      intermediate: {
        title: "Active Trader Path",
        weeks: 8,
        features: ["Advanced tools", "Real trading", "Risk management", "Market analysis"],
        startingAmount: "$500-2000",
        assets: ["BTC", "ETH", "Top 10 Altcoins"]
      },
      advanced: {
        title: "Pro Trader Suite",
        weeks: 12,
        features: ["AI signals", "Portfolio optimization", "Advanced charts", "API access"],
        startingAmount: "$2000-10000",
        assets: ["Full market access", "DeFi protocols"]
      },
      expert: {
        title: "Institutional Platform",
        weeks: 16,
        features: ["Custom strategies", "Institutional tools", "Priority support", "White-label"],
        startingAmount: "$10000+",
        assets: ["All assets", "Custom instruments"]
      }
    };
    
    return plans[profile.experience];
  };

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to NebulaX',
      description: 'Let\'s personalize your crypto experience',
      icon: <Rocket className="w-6 h-6" />,
      component: (
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🚀
          </motion.div>
          <h2 className="text-2xl font-bold">Welcome to Your Crypto Journey!</h2>
          <p className="text-gray-400">
            We'll customize your experience based on your goals, experience, and preferences.
            This takes just 2 minutes and helps us serve you better.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Your data is secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Faster learning curve</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-purple-400" />
              <span>Exclusive features</span>
            </div>
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'experience',
      title: 'Your Experience Level',
      description: 'How familiar are you with cryptocurrency?',
      icon: <Brain className="w-6 h-6" />,
      component: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">What's your crypto experience?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {experienceOptions.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    profile.experience === option.value 
                      ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50' 
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                  onClick={() => setProfile({...profile, experience: option.value as any})}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{option.icon}</div>
                      <div>
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm text-gray-400">{option.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'goals',
      title: 'Your Goals',
      description: 'What do you want to achieve?',
      icon: <Target className="w-6 h-6" />,
      component: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">What are your crypto goals? (Select all that apply)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {goalOptions.map((goal) => {
              const isSelected = profile.goals.includes(goal.id);
              return (
                <motion.div
                  key={goal.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-green-500/20 border-green-500 ring-1 ring-green-500/50' 
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => {
                      const newGoals = isSelected 
                        ? profile.goals.filter(g => g !== goal.id)
                        : [...profile.goals, goal.id];
                      setProfile({...profile, goals: newGoals});
                    }}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl mb-2">{goal.icon}</div>
                      <div className="text-sm font-medium">{goal.label}</div>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'risk',
      title: 'Risk Tolerance',
      description: 'How comfortable are you with market volatility?',
      icon: <Shield className="w-6 h-6" />,
      component: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold mb-4">What's your risk tolerance?</h3>
          <div className="space-y-3">
            {[
              { value: 'conservative', label: 'Conservative', icon: '🛡️', desc: 'Prefer stable, lower-risk investments' },
              { value: 'moderate', label: 'Moderate', icon: '⚖️', desc: 'Balance between risk and reward' },
              { value: 'aggressive', label: 'Aggressive', icon: '🚀', desc: 'Comfortable with high volatility for higher returns' }
            ].map((option) => (
              <Card 
                key={option.value}
                className={`cursor-pointer transition-all ${
                  profile.riskTolerance === option.value 
                    ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50' 
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
                onClick={() => setProfile({...profile, riskTolerance: option.value as any})}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{option.icon}</div>
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
      completed: false
    },
    {
      id: 'assets',
      title: 'Preferred Assets',
      description: 'Which cryptocurrencies interest you?',
      icon: <PieChart className="w-6 h-6" />,
      component: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Which assets interest you? (Select all that apply)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {assetOptions.map((asset) => {
              const isSelected = profile.preferredAssets.includes(asset.id);
              const riskColor = asset.risk === 'low' ? 'text-green-400' : 
                              asset.risk === 'moderate' ? 'text-yellow-400' : 'text-red-400';
              
              return (
                <motion.div
                  key={asset.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-blue-500/20 border-blue-500 ring-1 ring-blue-500/50' 
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    onClick={() => {
                      const newAssets = isSelected 
                        ? profile.preferredAssets.filter(a => a !== asset.id)
                        : [...profile.preferredAssets, asset.id];
                      setProfile({...profile, preferredAssets: newAssets});
                    }}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl mb-2">{asset.icon}</div>
                      <div className="text-sm font-medium mb-1">{asset.label}</div>
                      <Badge className={`text-xs ${riskColor} bg-transparent border-current`}>
                        {asset.risk} risk
                      </Badge>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-blue-400 mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ),
      completed: false
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowRecommendations(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    const handleShowOnboarding = () => setIsActive(true);
    window.addEventListener('showCryptoOnboarding', handleShowOnboarding);
    return () => window.removeEventListener('showCryptoOnboarding', handleShowOnboarding);
  }, []);

  const plan = generatePersonalizedPlan();

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsActive(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-black/90 backdrop-blur-lg border-purple-500/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-purple-400" />
                    <span>Personalized Crypto Onboarding</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsActive(false)}
                  >
                    ×
                  </Button>
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <Progress value={((currentStep + 1) / steps.length) * 100} className="flex-1" />
                  <span className="text-sm text-gray-400">
                    {currentStep + 1} of {steps.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!showRecommendations ? (
                  <>
                    {/* Current Step Content */}
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="min-h-[400px]"
                    >
                      {steps[currentStep].component}
                    </motion.div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-6 border-t border-white/10">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={nextStep}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        {currentStep === steps.length - 1 ? 'Get My Plan' : 'Next'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Personalized Recommendations */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl mb-4"
                      >
                        🎯
                      </motion.div>
                      <h2 className="text-2xl font-bold mb-2">Your Personalized Crypto Plan</h2>
                      <p className="text-gray-400">Based on your preferences, here's what we recommend:</p>
                    </div>

                    <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 mr-2" />
                          {plan.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                              <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                              Recommended Features
                            </h4>
                            <ul className="space-y-1">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="text-sm flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2 text-green-400" />
                              Getting Started
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Timeline:</span>
                                <span className="text-blue-400">{plan.weeks} weeks</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Starting amount:</span>
                                <span className="text-green-400">{plan.startingAmount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Recommended assets:</span>
                                <span className="text-purple-400">{plan.assets.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex space-x-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        onClick={() => setIsActive(false)}
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Start My Journey
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowRecommendations(false);
                          setCurrentStep(0);
                        }}
                      >
                        Restart Quiz
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for triggering onboarding
export function useCryptoOnboarding() {
  const showOnboarding = () => {
    window.dispatchEvent(new Event('showCryptoOnboarding'));
  };

  return { showOnboarding };
}