import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnboardingTour } from '@/components/OnboardingTour';
import { PersonalizedDashboard } from '@/components/PersonalizedDashboard';
import { TradingAchievements } from '@/components/TradingAchievements';
import { MarketSentimentIndicator } from '@/components/MarketSentimentIndicator';
import { TradingMicroInteractions } from '@/components/TradingMicroInteractions';
import { 
  Sparkles, 
  Layout, 
  Trophy, 
  Activity, 
  Zap, 
  Star,
  Play,
  Palette,
  Target,
  Heart,
  Settings
} from 'lucide-react';

export default function InteractiveDemo() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const features = [
    {
      id: 'onboarding',
      title: 'Interactive Onboarding Tour',
      description: 'Animated step-by-step walkthrough with achievement system',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-purple-600 to-blue-600',
      component: OnboardingTour,
      highlights: ['🎯 Step-by-step guidance', '🏆 Achievement unlocking', '⭐ Point rewards', '🎨 Beautiful animations']
    },
    {
      id: 'dashboard',
      title: 'Personalized Dashboard',
      description: 'Drag & drop widget customization with theme selection',
      icon: <Layout className="w-6 h-6" />,
      color: 'from-green-600 to-blue-600',
      component: PersonalizedDashboard,
      highlights: ['🎨 4 Theme options', '📊 Customizable widgets', '🔄 Drag & drop', '📱 Mobile responsive']
    },
    {
      id: 'achievements',
      title: 'Trading Achievement System',
      description: 'Gamified badges and XP system for trading milestones',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-yellow-600 to-orange-600',
      component: TradingAchievements,
      highlights: ['🏆 8 Achievement categories', '⭐ Rarity system', '🎯 Progress tracking', '🔥 Streak rewards']
    },
    {
      id: 'sentiment',
      title: 'Market Sentiment Indicators',
      description: 'Real-time emoji-based market emotion tracking',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-pink-600 to-purple-600',
      component: MarketSentimentIndicator,
      highlights: ['😊 Emoji indicators', '📊 Real-time updates', '🔍 Multi-asset tracking', '📈 Sentiment analytics']
    },
    {
      id: 'micro-interactions',
      title: 'Trading Micro-Interactions',
      description: 'Subtle animations and visual feedback for every action',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-600 to-indigo-600',
      component: TradingMicroInteractions,
      highlights: ['⚡ Instant feedback', '🎯 Action animations', '🔥 Streak tracking', '🎉 Celebration effects']
    }
  ];

  const renderFeatureCard = (feature: any) => (
    <Card 
      key={feature.id}
      className={`
        cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
        ${activeFeature === feature.id ? 'ring-2 ring-purple-500 shadow-lg' : ''}
        bg-gradient-to-br ${feature.color} border-none text-white
      `}
      onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            {feature.icon}
          </div>
          <div>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
            <CardDescription className="text-white/80 text-sm">
              {feature.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {feature.highlights.map((highlight: string, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm text-white/90">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
              {highlight}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button 
            variant="secondary" 
            className="w-full bg-white/20 text-white hover:bg-white/30 border-none"
          >
            <Play className="w-4 h-4 mr-2" />
            {activeFeature === feature.id ? 'Hide Demo' : 'Try Demo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderActiveFeature = () => {
    if (!activeFeature) return null;
    
    const feature = features.find(f => f.id === activeFeature);
    if (!feature) return null;

    const FeatureComponent = feature.component;
    
    if (feature.id === 'onboarding') {
      return (
        <div className="mt-8">
          <div className="text-center mb-6">
            <Button 
              onClick={() => setShowOnboarding(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Onboarding Tour
            </Button>
          </div>
          {showOnboarding && (
            <FeatureComponent 
              onComplete={() => setShowOnboarding(false)}
              onSkip={() => setShowOnboarding(false)}
            />
          )}
        </div>
      );
    }

    return (
      <div className="mt-8">
        <FeatureComponent />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Interactive Demo Experience
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the future of cryptocurrency trading with our advanced UI features, 
            gamified achievements, and intelligent micro-interactions designed for professional traders.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Featured Capabilities</h2>
            <p className="text-slate-300">Click on any feature to explore its interactive demo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(renderFeatureCard)}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Demo Features Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-2">5</div>
                  <div className="text-slate-300 text-sm">Interactive Features</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-2">20+</div>
                  <div className="text-slate-300 text-sm">Animations</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-2">8</div>
                  <div className="text-slate-300 text-sm">Achievement Types</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">4</div>
                  <div className="text-slate-300 text-sm">Theme Options</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                How to Use This Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/50">1</Badge>
                    <div>
                      <div className="font-semibold text-white">Choose a Feature</div>
                      <div className="text-sm text-slate-300">Click on any feature card to open its interactive demo</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50">2</Badge>
                    <div>
                      <div className="font-semibold text-white">Interact & Explore</div>
                      <div className="text-sm text-slate-300">Try all the buttons, animations, and customization options</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/50">3</Badge>
                    <div>
                      <div className="font-semibold text-white">Experience Animations</div>
                      <div className="text-sm text-slate-300">Watch for micro-interactions and visual feedback</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">4</Badge>
                    <div>
                      <div className="font-semibold text-white">Unlock Achievements</div>
                      <div className="text-sm text-slate-300">Complete actions to earn badges and XP points</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Feature Display */}
        {renderActiveFeature()}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-slate-300">Built with advanced React animations and micro-interactions</span>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <span>🎨 Custom Animations</span>
            <span>⚡ Real-time Feedback</span>
            <span>🏆 Gamification</span>
            <span>📱 Mobile Responsive</span>
          </div>
        </div>
      </div>
    </div>
  );
}