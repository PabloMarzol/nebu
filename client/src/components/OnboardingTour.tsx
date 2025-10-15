import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Target, Trophy, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string;
  route: string;
  icon: React.ReactNode;
  animation: string;
  points: number;
  achievement?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NebulaX',
    description: 'Your journey to professional crypto trading begins here. Let\'s explore your personalized dashboard!',
    target: 'dashboard',
    route: '/',
    icon: <Sparkles className="w-5 h-5" />,
    animation: 'animate-pulse',
    points: 50,
    achievement: 'First Steps'
  },
  {
    id: 'portfolio',
    title: 'Portfolio Overview',
    description: 'Track your investments with real-time analytics and performance metrics.',
    target: 'portfolio',
    route: '/portfolio',
    icon: <Target className="w-5 h-5" />,
    animation: 'animate-bounce',
    points: 75,
    achievement: 'Portfolio Explorer'
  },
  {
    id: 'trading',
    title: 'Professional Trading',
    description: 'Execute trades with institutional-grade tools and advanced order types.',
    target: 'trading',
    route: '/trading',
    icon: <Trophy className="w-5 h-5" />,
    animation: 'animate-spin',
    points: 100,
    achievement: 'Trading Pro'
  },
  {
    id: 'security',
    title: 'Security Center',
    description: 'Protect your assets with enterprise-grade security features.',
    target: 'security',
    route: '/security',
    icon: <Star className="w-5 h-5" />,
    animation: 'animate-ping',
    points: 125,
    achievement: 'Security Guardian'
  }
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  useEffect(() => {
    // Animate entry
    const timer = setTimeout(() => {
      setShowCelebration(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    const step = onboardingSteps[currentStep];
    
    // Mark step as completed
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps(prev => [...prev, step.id]);
      setTotalPoints(prev => prev + step.points);
      
      // Show achievement toast
      toast({
        title: `🎉 Achievement Unlocked!`,
        description: `${step.achievement} - Earned ${step.points} points`,
        className: "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none",
      });
    }

    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setShowCelebration(true);
    setTimeout(() => {
      onComplete();
      toast({
        title: "🚀 Onboarding Complete!",
        description: `Welcome to NebulaX! You've earned ${totalPoints} points and unlocked ${completedSteps.length} achievements.`,
        className: "bg-gradient-to-r from-green-600 to-blue-600 text-white border-none",
      });
    }, 1000);
  };

  const navigateToPage = () => {
    // Navigate to the step's target page
    window.location.href = currentStepData.route;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white transform transition-all duration-500 ${
        showCelebration ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 ${currentStepData.animation}`}>
                {currentStepData.icon}
              </div>
              <div>
                <CardTitle className="text-xl font-bold">{currentStepData.title}</CardTitle>
                <CardDescription className="text-slate-300">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2 bg-slate-700" />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-slate-400">{Math.round(progress)}% Complete</span>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                {totalPoints} Points
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-slate-300 text-lg leading-relaxed">
              {currentStepData.description}
            </p>
            
            {currentStepData.achievement && (
              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">{currentStepData.achievement}</span>
                <span className="text-slate-400">+{currentStepData.points} points</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 border-slate-600 hover:bg-slate-700 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={navigateToPage}
                className="border-blue-600 hover:bg-blue-600 text-blue-400 hover:text-white"
              >
                Go to Page
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Complete' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  completedSteps.includes(step.id)
                    ? 'bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30'
                    : index === currentStep
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-600 text-white'
                      : index === currentStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-xs font-medium">{step.title}</div>
                    <div className="text-xs text-slate-400">{step.points} pts</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Celebration Animation */}
      {showCelebration && currentStep === onboardingSteps.length - 1 && (
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}