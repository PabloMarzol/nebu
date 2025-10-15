import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw,
  Settings,
  Eye,
  Heart,
  Star,
  TrendingUp,
  Activity,
  Coins,
  ArrowUpDown,
  MousePointer,
  Smartphone
} from "lucide-react";

export default function AnimationsPage() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentDemo, setCurrentDemo] = useState('trading');
  const [heartbeat, setHeartbeat] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeat(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tradingAnimations = [
    {
      title: "Price Pulse Animation",
      description: "Numbers that breathe with market movement",
      component: (
        <motion.div 
          className="text-4xl font-bold text-green-400"
          animate={{ 
            scale: [1, 1.05, 1],
            color: ["#4ade80", "#10b981", "#4ade80"]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          $68,450.25
        </motion.div>
      )
    },
    {
      title: "Trend Indicator",
      description: "Visual trend direction with smooth transitions",
      component: (
        <motion.div className="flex items-center space-x-2">
          <motion.div
            animate={{ 
              rotate: [0, 45, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity 
            }}
          >
            <TrendingUp className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <motion.span 
            className="text-cyan-400 font-bold"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Bullish Trend
          </motion.span>
        </motion.div>
      )
    },
    {
      title: "Loading Particles",
      description: "Floating crypto particles during data loads",
      component: (
        <div className="relative w-32 h-32">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-purple-400 rounded-full"
              animate={{
                x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <Coins className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      )
    }
  ];

  const interactionAnimations = [
    {
      title: "Button Hover Effects",
      description: "Engaging button interactions with ripple effects",
      component: (
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold"
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Trade Now
        </motion.button>
      )
    },
    {
      title: "Card Flip Animation",
      description: "Portfolio cards that flip to reveal insights",
      component: (
        <motion.div
          className="w-32 h-20 cursor-pointer perspective-1000"
          whileHover={{ rotateY: 180 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 bg-gray-700 rounded-lg flex items-center justify-center backface-hidden">
            <span className="text-cyan-400 font-bold">BTC</span>
          </div>
          <div className="absolute inset-0 bg-purple-700 rounded-lg flex items-center justify-center backface-hidden" style={{ transform: "rotateY(180deg)" }}>
            <span className="text-yellow-400 font-bold">+15%</span>
          </div>
        </motion.div>
      )
    },
    {
      title: "Heartbeat Data",
      description: "Live data that pulses with activity",
      component: (
        <motion.div 
          className="flex items-center space-x-2"
          animate={{ 
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 1, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Heart className="w-6 h-6 text-red-400" />
          <span className="text-red-400 font-mono">
            {heartbeat} beats
          </span>
        </motion.div>
      )
    }
  ];

  const achievements = [
    {
      title: "Achievement Unlock",
      description: "Celebrating user milestones with style",
      component: (
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2
          }}
        >
          <motion.div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full"
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(251, 191, 36, 0.7)",
                "0 0 0 10px rgba(251, 191, 36, 0)",
                "0 0 0 0 rgba(251, 191, 36, 0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-8 h-8 text-white" />
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            NEW!
          </motion.div>
        </motion.div>
      )
    }
  ];

  const microInteractions = [
    {
      title: "Toggle Switch",
      description: "Smooth toggle with spring physics",
      component: (
        <motion.div
          className="w-16 h-8 bg-gray-600 rounded-full p-1 cursor-pointer"
          onClick={() => setIsPlaying(!isPlaying)}
          animate={{ backgroundColor: isPlaying ? "#10b981" : "#6b7280" }}
        >
          <motion.div
            className="w-6 h-6 bg-white rounded-full"
            animate={{ x: isPlaying ? 32 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.div>
      )
    },
    {
      title: "Loading Spinner",
      description: "Elegant loading state animation",
      component: (
        <motion.div
          className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )
    },
    {
      title: "Progress Wave",
      description: "Progress bar with wave animation",
      component: (
        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
            animate={{ 
              width: ["0%", "100%", "0%"],
              x: ["0%", "0%", "100%"]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )
    }
  ];

  const handleReset = () => {
    // Reset all animations and state
    setIsPlaying(true);
    setCurrentDemo('trading');
    setHeartbeat(0);
    setResetKey(prev => prev + 1); // Force re-render of all animations
    
    // Optional: Show a toast notification
    console.log('All animations reset to initial state');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Platform Animations
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Micro-interactions and animations that bring data to life
          </motion.p>

          {/* Animation Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`${isPlaying ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause All' : 'Play All'}
            </Button>
            <Button 
              onClick={() => handleReset()}
              className="bg-gray-500/20 text-gray-400 hover:bg-gray-400/20 hover:text-gray-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <Tabs defaultValue="trading" className="space-y-8">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="trading">Trading Animations</TabsTrigger>
            <TabsTrigger value="interactions">User Interactions</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="micro">Micro-interactions</TabsTrigger>
          </TabsList>

          <TabsContent value="trading">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tradingAnimations.map((animation, index) => (
                <motion.div
                  key={`${index}-${resetKey}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700/50 h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{animation.title}</CardTitle>
                      <p className="text-gray-400 text-sm">{animation.description}</p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-32">
                      <AnimatePresence key={`animation-${index}-${resetKey}`}>
                        {isPlaying && <div key={`content-${resetKey}`}>{animation.component}</div>}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interactions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {interactionAnimations.map((animation, index) => (
                <motion.div
                  key={`${index}-${resetKey}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700/50 h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{animation.title}</CardTitle>
                      <p className="text-gray-400 text-sm">{animation.description}</p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-32">
                      <div key={`interaction-content-${resetKey}`}>{animation.component}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((animation, index) => (
                <motion.div
                  key={`${index}-${resetKey}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700/50 h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{animation.title}</CardTitle>
                      <p className="text-gray-400 text-sm">{animation.description}</p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-32">
                      <div key={`achievement-content-${resetKey}`}>{animation.component}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="micro">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {microInteractions.map((animation, index) => (
                <motion.div
                  key={`${index}-${resetKey}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700/50 h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{animation.title}</CardTitle>
                      <p className="text-gray-400 text-sm">{animation.description}</p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-32">
                      <div key={`micro-content-${resetKey}`}>{animation.component}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Animation Guidelines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <span>Animation Guidelines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Performance</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 60fps smooth animations</li>
                    <li>• Hardware acceleration</li>
                    <li>• Optimized for mobile</li>
                    <li>• Reduced motion support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">User Experience</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Meaningful animations only</li>
                    <li>• Clear visual feedback</li>
                    <li>• Consistent timing</li>
                    <li>• Accessibility first</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Implementation</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Framer Motion library</li>
                    <li>• Spring physics</li>
                    <li>• CSS transforms</li>
                    <li>• Progressive enhancement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}