import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, TrendingUp, Zap, Volume2, Lightbulb, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Import our new features
import ReactionSystem, { TradingInsightCard } from "@/components/trading/reaction-system";
import { TradingDataSkeleton, PortfolioSkeleton, MarketDataSkeleton, AIInsightsSkeleton } from "@/components/loading/nebby-loading-skeletons";
import { ContextualMicroTutorial } from "@/components/tutorials/contextual-micro-tutorials";
import { GradientEmotionalFeedback, EmotionalButton, useEmotionalFeedback } from "@/components/ui/gradient-emotional-feedback";
import { useSoundEffects } from "@/components/ui/adaptive-sound-design";

export default function InteractiveFeaturesShowcase() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [showSkeletons, setShowSkeletons] = useState(false);
  const emotionalFeedback = useEmotionalFeedback();
  const { playClick: playSound } = useSoundEffects();

  const features = [
    {
      id: 'reactions',
      title: '🎭 Reaction System',
      description: 'Interactive reactions for trading insights with real-time community feedback',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10'
    },
    {
      id: 'skeletons',
      title: '✨ Nebby Loading Skeletons',
      description: 'Animated loading states featuring Nebby with contextual messages',
      icon: Sparkles,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'tutorials',
      title: '💡 Micro Tutorials',
      description: 'Contextual hints and playful tutorials that appear when you need them',
      icon: Lightbulb,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      id: 'emotions',
      title: '🌈 Emotional Gradients',
      description: 'Dynamic color transitions that respond to your trading success and mood',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'sounds',
      title: '🎧 Adaptive Sound Design',
      description: 'Contextual audio feedback that enhances your trading experience',
      icon: Volume2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveDemo(activeDemo === featureId ? null : featureId);
    playSound('click');
    
    // Trigger emotional feedback based on feature
    switch (featureId) {
      case 'reactions':
        emotionalFeedback.triggerExcitement();
        break;
      case 'skeletons':
        emotionalFeedback.triggerFocus();
        break;
      case 'tutorials':
        emotionalFeedback.triggerSuccess();
        break;
      case 'emotions':
        emotionalFeedback.triggerCelebration();
        break;
      case 'sounds':
        emotionalFeedback.triggerCalm();
        break;
    }
  };

  const demoInsights = [
    {
      id: 'insight-1',
      title: 'BTC Breaking Resistance',
      content: 'Bitcoin has successfully broken through the $45,000 resistance level with strong volume support. Technical indicators suggest continued bullish momentum.',
      confidence: 87,
      timestamp: '2 minutes ago'
    },
    {
      id: 'insight-2', 
      title: 'ETH Layer 2 Rally',
      content: 'Ethereum shows strong fundamentals as Layer 2 adoption accelerates. Smart money is accumulating ahead of the next upgrade.',
      confidence: 73,
      timestamp: '5 minutes ago'
    }
  ];

  return (
    <GradientEmotionalFeedback enableBackgroundTransitions className="space-y-6 p-6">
      <Card className="border-2 border-purple-400/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-8 h-8 text-yellow-500" />
            </motion.div>
            Interactive Features Showcase
          </CardTitle>
          <p className="text-muted-foreground">
            Experience the next generation of trading platform interactions
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeDemo === feature.id;
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-tutorial={feature.id}
                >
                  <EmotionalButton
                    emotion={isActive ? 'excitement' : 'focused'}
                    onClick={() => handleFeatureClick(feature.id)}
                    className={cn(
                      "w-full p-4 text-left border-2 transition-all duration-300",
                      isActive 
                        ? "border-primary bg-primary/5 shadow-lg scale-105"
                        : "border-border hover:border-primary/50 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn("p-2 rounded-lg", feature.bgColor)}>
                        <Icon className={cn("w-5 h-5", feature.color)} />
                      </div>
                      <h3 className="font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </EmotionalButton>
                </motion.div>
              );
            })}
          </div>

          {/* Feature Demos */}
          <AnimatePresence mode="wait">
            {activeDemo && (
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t pt-6"
              >
                {activeDemo === 'reactions' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Reaction System Demo</h4>
                    <div className="grid gap-4">
                      {demoInsights.map((insight) => (
                        <TradingInsightCard
                          key={insight.id}
                          title={insight.title}
                          content={insight.content}
                          confidence={insight.confidence}
                          timestamp={insight.timestamp}
                          insightId={insight.id}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeDemo === 'skeletons' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">Nebby Loading Skeletons Demo</h4>
                      <Button
                        onClick={() => {
                          setShowSkeletons(!showSkeletons);
                          playSound('click');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        {showSkeletons ? 'Hide' : 'Show'} Loading States
                      </Button>
                    </div>
                    
                    {showSkeletons && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <TradingDataSkeleton />
                        <PortfolioSkeleton />
                        <MarketDataSkeleton />
                        <AIInsightsSkeleton />
                      </div>
                    )}
                  </div>
                )}

                {activeDemo === 'tutorials' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Contextual Micro Tutorials Demo</h4>
                    <p className="text-muted-foreground">
                      Hover over or click the feature buttons above to see contextual tutorials in action!
                    </p>
                    
                    {/* Tutorial triggers */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button data-tutorial="trading-demo" variant="outline">
                        Trading Tutorial Trigger
                      </Button>
                      <Button data-tutorial="portfolio-demo" variant="outline">
                        Portfolio Tutorial Trigger
                      </Button>
                    </div>

                    <ContextualMicroTutorial
                      trigger='[data-tutorial="trading-demo"]'
                      tutorial={{
                        id: 'trading-demo',
                        title: 'Advanced Trading Tools',
                        content: 'Access professional trading features with real-time analytics and smart order routing.',
                        position: 'bottom',
                        playful: true,
                        emoji: '📈',
                        action: {
                          label: 'Explore Trading',
                          onClick: () => alert('Navigate to trading!')
                        }
                      }}
                      showOnHover
                    />

                    <ContextualMicroTutorial
                      trigger='[data-tutorial="portfolio-demo"]'
                      tutorial={{
                        id: 'portfolio-demo',
                        title: 'Smart Portfolio Management',
                        content: 'Track your investments with AI-powered insights and automated rebalancing.',
                        position: 'bottom',
                        playful: true,
                        emoji: '💼',
                        action: {
                          label: 'View Portfolio',
                          onClick: () => alert('Navigate to portfolio!')
                        }
                      }}
                      showOnHover
                    />
                  </div>
                )}

                {activeDemo === 'emotions' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Emotional Gradient Demo</h4>
                    <p className="text-muted-foreground">
                      Click buttons to trigger different emotional feedback states
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <EmotionalButton
                        emotion="success"
                        onClick={() => emotionalFeedback.triggerSuccess()}
                        className="bg-green-500/10 border-green-500/30 text-green-700"
                      >
                        Success
                      </EmotionalButton>
                      
                      <EmotionalButton
                        emotion="error"
                        onClick={() => emotionalFeedback.triggerError()}
                        className="bg-red-500/10 border-red-500/30 text-red-700"
                      >
                        Error
                      </EmotionalButton>
                      
                      <EmotionalButton
                        emotion="excitement"
                        onClick={() => emotionalFeedback.triggerExcitement()}
                        className="bg-purple-500/10 border-purple-500/30 text-purple-700"
                      >
                        Excitement
                      </EmotionalButton>
                      
                      <EmotionalButton
                        emotion="celebration"
                        onClick={() => emotionalFeedback.triggerCelebration()}
                        className="bg-yellow-500/10 border-yellow-500/30 text-yellow-700"
                      >
                        Celebration
                      </EmotionalButton>
                    </div>
                  </div>
                )}

                {activeDemo === 'sounds' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Adaptive Sound Design Demo</h4>
                    <p className="text-muted-foreground">
                      Click buttons to hear different contextual sounds
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        onClick={() => playSound()}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        Click
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const { playSuccess } = useSoundEffects();
                          playSuccess();
                        }}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        Success
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const { playError } = useSoundEffects();
                          playError();
                        }}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        Error
                      </Button>
                      
                      <Button
                        onClick={() => {
                          const { playNotification } = useSoundEffects();
                          playNotification();
                        }}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        Notify
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center pt-6 border-t"
          >
            <h5 className="font-semibold mb-2">Experience the Future of Trading</h5>
            <p className="text-muted-foreground text-sm mb-4">
              These features are integrated throughout the platform for an enhanced user experience
            </p>
            <Button
              onClick={() => {
                emotionalFeedback.triggerCelebration();
                playSound('success');
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Star className="w-4 h-4 mr-2" />
              Explore Full Platform
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </GradientEmotionalFeedback>
  );
}