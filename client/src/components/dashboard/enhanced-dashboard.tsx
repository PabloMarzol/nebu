import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PaintTransition } from '@/components/ui/paint-transitions';
import { useIntelligentScheme } from '@/hooks/use-intelligent-scheme';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowRight, 
  Star, 
  Lightbulb, 
  Target, 
  Zap, 
  Heart,
  Activity,
  ChartArea,
  Shield,
  Gift,
  Crown,
  Sparkles,
  Brain,
  Rocket
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'action' | 'insight' | 'opportunity' | 'security' | 'learning';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  action?: {
    text: string;
    route: string;
  };
  icon: any;
  color: string;
  estimatedValue?: string;
  timeToComplete?: string;
}

const SAMPLE_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'security_2fa',
    type: 'security',
    title: 'Enable Two-Factor Authentication',
    description: 'Secure your account with 2FA to protect against unauthorized access and earn security rewards.',
    priority: 'high',
    confidence: 95,
    action: { text: 'Enable 2FA', route: '/security' },
    icon: Shield,
    color: 'text-red-400',
    estimatedValue: '+100 Security Points',
    timeToComplete: '2 minutes'
  },
  {
    id: 'trading_btc',
    type: 'opportunity',
    title: 'Bitcoin Trading Opportunity',
    description: 'BTC is showing strong support at $43,200. Consider adding to your position with our AI-recommended entry.',
    priority: 'high',
    confidence: 87,
    action: { text: 'View Analysis', route: '/trading?pair=BTCUSDT' },
    icon: TrendingUp,
    color: 'text-orange-400',
    estimatedValue: '+12.3% potential',
    timeToComplete: '5 minutes'
  },
  {
    id: 'portfolio_diversify',
    type: 'insight',
    title: 'Portfolio Diversification',
    description: 'Your portfolio is 78% Bitcoin. Consider diversifying with ETH or SOL to reduce risk.',
    priority: 'medium',
    confidence: 82,
    action: { text: 'View Suggestions', route: '/portfolio' },
    icon: ChartArea,
    color: 'text-blue-400',
    estimatedValue: '-15% risk',
    timeToComplete: '10 minutes'
  },
  {
    id: 'staking_rewards',
    type: 'opportunity',
    title: 'Stake Your ETH',
    description: 'Earn 4.2% APY by staking your Ethereum. Your idle ETH could be generating passive income.',
    priority: 'medium',
    confidence: 90,
    action: { text: 'Start Staking', route: '/staking' },
    icon: Star,
    color: 'text-purple-400',
    estimatedValue: '+4.2% APY',
    timeToComplete: '3 minutes'
  },
  {
    id: 'learning_advanced',
    type: 'learning',
    title: 'Master Advanced Trading',
    description: 'Complete our advanced trading course and unlock premium features like algorithmic trading.',
    priority: 'low',
    confidence: 75,
    action: { text: 'Start Learning', route: '/learn' },
    icon: Brain,
    color: 'text-cyan-400',
    estimatedValue: 'Premium Access',
    timeToComplete: '30 minutes'
  },
  {
    id: 'referral_bonus',
    type: 'action',
    title: 'Invite Friends, Earn Rewards',
    description: 'Refer 3 friends and earn $50 USDT plus 20% commission on their trading fees.',
    priority: 'low',
    confidence: 100,
    action: { text: 'Get Referral Link', route: '/referrals' },
    icon: Gift,
    color: 'text-green-400',
    estimatedValue: '$50 + 20% commission',
    timeToComplete: '1 minute'
  }
];

export function EnhancedDashboard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(SAMPLE_RECOMMENDATIONS);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [activeRecommendation, setActiveRecommendation] = useState<string | null>(null);
  const { currentScheme, trackInteraction, getRecommendations } = useIntelligentScheme();

  const filteredRecommendations = recommendations.filter(r => !dismissedIds.includes(r.id));

  const dismissRecommendation = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
    trackInteraction('recommendation_dismissed');
  };

  const handleRecommendationClick = (recommendation: Recommendation) => {
    trackInteraction('recommendation_clicked');
    setActiveRecommendation(recommendation.id);
    // Navigation would happen here
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'action': return Zap;
      case 'insight': return Lightbulb;
      case 'opportunity': return Target;
      case 'security': return Shield;
      case 'learning': return Brain;
      default: return Star;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header with Scheme Adaptation */}
      <PaintTransition
        isVisible={true}
        direction="down"
        paintColor={currentScheme.primaryColor}
      >
        <Card className="relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{ backgroundColor: currentScheme.accentColor }}
          />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, Trader! 
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    className="inline-block ml-2"
                  >
                    👋
                  </motion.span>
                </h1>
                <p className="text-muted-foreground">
                  I've prepared {filteredRecommendations.length} personalized recommendations for you
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">AI Confidence</div>
                  <div className="font-bold text-green-400">93% Accurate</div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center"
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PaintTransition>

      {/* Smart Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredRecommendations.map((recommendation, index) => {
            const TypeIcon = getTypeIcon(recommendation.type);
            const RecommendationIcon = recommendation.icon;
            
            return (
              <motion.div
                key={recommendation.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  layout: { duration: 0.3 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="relative overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300">
                  {/* Priority Indicator */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${getPriorityColor(recommendation.priority)}`} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <TypeIcon className="w-4 h-4 text-muted-foreground" />
                          <div className="absolute -top-1 -right-1">
                            <RecommendationIcon className={`w-3 h-3 ${recommendation.color}`} />
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {recommendation.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="text-xs text-muted-foreground">{recommendation.confidence}%</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissRecommendation(recommendation.id);
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-sm font-semibold line-clamp-2">
                      {recommendation.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-3">
                      {recommendation.description}
                    </p>

                    {/* Confidence Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">AI Confidence</span>
                        <span className="font-medium">{recommendation.confidence}%</span>
                      </div>
                      <Progress value={recommendation.confidence} className="h-1" />
                    </div>

                    {/* Value & Time Indicators */}
                    <div className="flex justify-between items-center mb-4">
                      {recommendation.estimatedValue && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Value: </span>
                          <span className="font-semibold text-green-400">
                            {recommendation.estimatedValue}
                          </span>
                        </div>
                      )}
                      {recommendation.timeToComplete && (
                        <div className="text-xs text-muted-foreground">
                          {recommendation.timeToComplete}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {recommendation.action && (
                      <Button
                        size="sm"
                        className="w-full group-hover:bg-primary/90 transition-colors"
                        onClick={() => handleRecommendationClick(recommendation)}
                      >
                        <span className="mr-2">{recommendation.action.text}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    )}
                  </CardContent>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Buy Bitcoin', icon: TrendingUp, color: 'text-orange-400', route: '/trading?pair=BTCUSDT' },
              { label: 'Check Portfolio', icon: ChartArea, color: 'text-blue-400', route: '/portfolio' },
              { label: 'Security Center', icon: Shield, color: 'text-green-400', route: '/security' },
              { label: 'Earn Rewards', icon: Star, color: 'text-yellow-400', route: '/rewards' }
            ].map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors"
                  onClick={() => trackInteraction('quick_action')}
                >
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* No Recommendations State */}
      {filteredRecommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="mb-4">
            <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">
              You've completed all recommendations. Check back later for new insights.
            </p>
          </div>
          <Button onClick={() => setDismissedIds([])}>
            <Sparkles className="w-4 h-4 mr-2" />
            Reset Recommendations
          </Button>
        </motion.div>
      )}
    </div>
  );
}