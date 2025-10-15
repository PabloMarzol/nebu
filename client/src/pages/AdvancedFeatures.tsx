import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedCryptoLoader } from "@/components/ui/animated-loading-states";
import PortfolioScreenshotShare from "@/components/portfolio/portfolio-screenshot-share";
import CryptoLearningPath from "@/components/learning/crypto-learning-path";
import SubtleNotificationSystem, { useNotifications } from "@/components/notifications/subtle-notification-system";
import { CryptoMascotTooltip, FloatingMascot, useContextualTooltips, cryptoTooltips } from "@/components/help/crypto-mascot-tooltips";
import { 
  Zap, 
  Camera, 
  BookOpen, 
  Bell, 
  HelpCircle,
  Sparkles,
  Rocket,
  Star,
  TrendingUp
} from "lucide-react";

export default function AdvancedFeatures() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample portfolio data for screenshot demo
  const samplePortfolioData = {
    totalValue: 125670.45,
    dailyChange: 3420.12,
    dailyChangePercent: 2.8,
    topAssets: [
      { symbol: 'BTC', name: 'Bitcoin', value: 65000, change: 2.5, allocation: 45 },
      { symbol: 'ETH', name: 'Ethereum', value: 28500, change: 1.8, allocation: 25 },
      { symbol: 'SOL', name: 'Solana', value: 12670, change: 4.2, allocation: 15 },
      { symbol: 'ADA', name: 'Cardano', value: 8500, change: -1.2, allocation: 10 }
    ],
    performanceMetrics: {
      sharpeRatio: 1.85,
      volatility: 18.4,
      maxDrawdown: -12.3
    }
  };

  // Notification system
  const {
    notifications,
    addNotification,
    dismissNotification,
    markAsRead,
    showPriceAlert,
    showTradeNotification,
    showSecurityAlert
  } = useNotifications();

  // Tooltip system
  const {
    activeTooltip,
    tooltipPosition,
    showTooltipById,
    hideTooltip,
    triggerContextualHelp
  } = useContextualTooltips();

  const demoLoadingStates = async (type: 'portfolio' | 'trading' | 'security' | 'payment' | 'analytics') => {
    setActiveDemo(type);
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setActiveDemo(null);
      
      // Show completion notification
      addNotification({
        type: 'success',
        title: 'Demo Complete',
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} loading animation demonstrated successfully`,
        duration: 3000
      });
    }, 4000);
  };

  const demoNotifications = () => {
    // Demo different notification types
    setTimeout(() => showPriceAlert('BTC', 67850, 3.2), 500);
    setTimeout(() => showTradeNotification('Buy', 'ETH', 2.5), 1500);
    setTimeout(() => showSecurityAlert('New login detected from Chrome on MacOS'), 2500);
    setTimeout(() => addNotification({
      type: 'info',
      title: 'Market Update',
      message: 'Crypto market cap reached $2.1T milestone',
      duration: 4000
    }), 3500);
  };

  const features = [
    {
      id: 'animated-loading',
      title: 'Animated Loading States',
      description: 'Crypto-themed micro-interactions with floating particles and contextual messages',
      icon: Zap,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'portfolio-sharing',
      title: 'Portfolio Screenshot Sharing',
      description: 'One-click screenshot generation with professional branding for social media',
      icon: Camera,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'learning-path',
      title: 'Personalized Learning Path',
      description: 'Gamified crypto education with progress tracking and achievements',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'notifications',
      title: 'Subtle Notifications',
      description: 'Non-intrusive real-time alerts with smooth animations',
      icon: Bell,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'mascot-tooltips',
      title: 'Contextual Help System',
      description: 'Playful cryptocurrency mascot providing guided assistance',
      icon: HelpCircle,
      color: 'from-pink-500 to-red-500'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Advanced UX Features
          </h1>
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience next-generation user interface enhancements designed for professional cryptocurrency trading
        </p>
      </motion.div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-2 mb-4`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Demos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Interactive Feature Demonstrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="loading" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="loading">Loading States</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio Share</TabsTrigger>
              <TabsTrigger value="learning">Learning Path</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="mascot">Mascot Help</TabsTrigger>
            </TabsList>

            <TabsContent value="loading" className="space-y-4">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Animated Loading States</h3>
                <p className="text-muted-foreground">
                  Experience crypto-themed loading animations with floating particles and contextual messages
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {(['portfolio', 'trading', 'security', 'payment', 'analytics'] as const).map((type) => (
                    <Button
                      key={type}
                      onClick={() => demoLoadingStates(type)}
                      disabled={isLoading}
                      variant="outline"
                    >
                      Demo {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Portfolio Screenshot Sharing</h3>
                <PortfolioScreenshotShare portfolioData={samplePortfolioData} />
              </div>
            </TabsContent>

            <TabsContent value="learning" className="space-y-4">
              <CryptoLearningPath />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Subtle Notification System</h3>
                <p className="text-muted-foreground">
                  Non-intrusive real-time alerts with smooth animations and contextual information
                </p>
                <Button onClick={demoNotifications} className="mb-4">
                  <Bell className="w-4 h-4 mr-2" />
                  Demo Notifications
                </Button>
                
                {/* Active Notifications Display */}
                <div className="bg-muted/20 rounded-lg p-4 text-sm text-muted-foreground">
                  {notifications.length > 0 ? (
                    `Showing ${notifications.length} notification(s). Check the top-right corner!`
                  ) : (
                    'No active notifications. Click the demo button to see them in action.'
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mascot" className="space-y-4">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Contextual Help Mascot</h3>
                <p className="text-muted-foreground">
                  Interactive cryptocurrency mascot providing contextual guidance and helpful tips
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {cryptoTooltips.slice(0, 4).map((tooltip) => (
                    <Button
                      key={tooltip.id}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        showTooltipById(tooltip.id, e.currentTarget);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      {tooltip.title}
                    </Button>
                  ))}
                </div>
                
                <div className="bg-muted/20 rounded-lg p-4 text-sm text-muted-foreground">
                  Click any button above to see contextual help tooltips. The floating mascot in the bottom-right provides ongoing assistance.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Enhanced User Experience Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">+45%</div>
                <p className="text-sm text-muted-foreground">User Engagement</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-500">+60%</div>
                <p className="text-sm text-muted-foreground">Feature Discovery</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-500">+35%</div>
                <p className="text-sm text-muted-foreground">User Retention</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-500">+80%</div>
                <p className="text-sm text-muted-foreground">Learning Completion</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlay */}
      <AnimatedCryptoLoader 
        isLoading={isLoading} 
        type={activeDemo as any}
      />

      {/* Notification System */}
      <SubtleNotificationSystem
        notifications={notifications}
        onDismiss={dismissNotification}
        onMarkAsRead={markAsRead}
        position="top-right"
        maxVisible={5}
      />

      {/* Contextual Tooltip */}
      {activeTooltip && (
        <CryptoMascotTooltip
          isVisible={!!activeTooltip}
          content={activeTooltip}
          position={tooltipPosition}
          onClose={hideTooltip}
        />
      )}

      {/* Floating Mascot */}
      <FloatingMascot />
    </div>
  );
}