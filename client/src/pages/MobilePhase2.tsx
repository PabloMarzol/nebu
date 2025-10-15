import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Smartphone,
  Bell,
  Cloud,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Crown,
  Shield,
  Activity,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";

// Import the mobile components
import EnhancedMobileApp from "@/components/mobile/enhanced-mobile-app";
import PushNotificationSystem from "@/components/mobile/push-notification-system";
import PWAServiceWorker from "@/components/mobile/pwa-service-worker";
import TouchTradingInterface from "@/components/mobile/touch-trading-interface";

export default function MobilePhase2() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<'basic' | 'pro' | 'premium' | 'elite'>('premium');

  const components = [
    {
      id: 'enhanced-mobile',
      title: 'Enhanced Mobile App',
      description: 'Complete mobile optimization with real-time features',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: ['Real-time portfolio updates', 'Touch-optimized interface', 'Haptic feedback', 'Biometric authentication'],
      component: EnhancedMobileApp
    },
    {
      id: 'push-notifications',
      title: 'Push Notification System',
      description: 'Real-time alerts and customizable notifications',
      icon: <Bell className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      features: ['Price alerts', 'Trade notifications', 'Security alerts', 'Custom rules'],
      component: PushNotificationSystem
    },
    {
      id: 'pwa',
      title: 'Progressive Web App',
      description: 'Offline capabilities and native app experience',
      icon: <Cloud className="w-6 h-6" />,
      color: 'from-green-500 to-teal-500',
      features: ['Offline functionality', 'App installation', 'Service workers', 'Background sync'],
      component: PWAServiceWorker
    },
    {
      id: 'touch-trading',
      title: 'Touch Trading Interface',
      description: 'Mobile-optimized trading terminal with gestures',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      features: ['Swipe gestures', 'Touch controls', 'Real-time data', 'Order management'],
      component: TouchTradingInterface
    }
  ];

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const handleBackToOverview = () => {
    setSelectedComponent(null);
  };

  if (selectedComponent) {
    const component = components.find(c => c.id === selectedComponent);
    if (component) {
      const ComponentToRender = component.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {/* Header */}
          <div className="p-4 bg-black/20 backdrop-blur-lg">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <Button
                variant="ghost"
                onClick={handleBackToOverview}
                className="text-white"
              >
                ← Back to Overview
              </Button>
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">{component.title}</h1>
                <p className="text-sm text-gray-300">{component.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-purple-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  {userTier.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Component */}
          <ComponentToRender userTier={userTier} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Phase 2: Mobile & Cross-Platform Optimization
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Complete mobile optimization with all 4 advanced components
          </p>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm">All Components Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Production Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-sm">Real-time Integration</span>
            </div>
          </div>

          {/* User Tier Selector */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="text-sm text-gray-400">Test with tier:</span>
            {(['basic', 'pro', 'premium', 'elite'] as const).map((tier) => (
              <Button
                key={tier}
                variant={userTier === tier ? "default" : "outline"}
                size="sm"
                onClick={() => setUserTier(tier)}
                className={`${
                  tier === 'basic' ? 'border-gray-500' :
                  tier === 'pro' ? 'border-blue-500' :
                  tier === 'premium' ? 'border-purple-500' : 'border-yellow-500'
                }`}
              >
                {tier === 'basic' ? <Smartphone className="w-3 h-3 mr-1" /> :
                 tier === 'pro' ? <Star className="w-3 h-3 mr-1" /> :
                 <Crown className="w-3 h-3 mr-1" />}
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {components.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleComponentSelect(component.id)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${component.color}`}>
                        {component.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{component.title}</h3>
                        <p className="text-sm text-gray-400">{component.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {component.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-white/10">
                      <Button variant="outline" className="w-full group-hover:bg-white/10 transition-colors">
                        Launch Component
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Implementation Status */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>Phase 2 Implementation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold">Mobile App Optimization</h4>
                  <p className="text-sm text-gray-400">Enhanced UI/UX with real-time features</p>
                </div>
                
                <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold">Push Notification System</h4>
                  <p className="text-sm text-gray-400">Real-time alerts and custom rules</p>
                </div>
                
                <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold">PWA Implementation</h4>
                  <p className="text-sm text-gray-400">Offline capabilities and app install</p>
                </div>
                
                <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold">Mobile Trading Interface</h4>
                  <p className="text-sm text-gray-400">Touch-optimized trading terminal</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <h4 className="font-semibold mb-2">Next Phase Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Phase 3: AI & Automation</strong>
                    <p className="text-gray-400">Advanced AI trading assistant, predictive analytics, automated strategies</p>
                  </div>
                  <div>
                    <strong>Phase 4: Advanced Integrations</strong>
                    <p className="text-gray-400">DeFi integration, cross-chain support, enterprise APIs</p>
                  </div>
                  <div>
                    <strong>Phase 5: Analytics & BI</strong>
                    <p className="text-gray-400">Advanced analytics, business intelligence, regulatory compliance</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}