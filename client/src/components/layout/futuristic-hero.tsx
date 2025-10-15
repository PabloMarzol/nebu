import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
// Removed FuturisticBackground import - background graphics disabled per user request
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Globe, 
  ArrowRight,
  Play,
  Sparkles,
  Pause,
  RotateCcw,
  Bot,
  CheckCircle
} from "lucide-react";

export default function FuturisticHero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [demoData, setDemoData] = useState({
    btcPrice: 64500,
    portfolio: 125000,
    profit: 12.5,
    orders: 3
  });

  const demoSteps = [
    {
      title: "Platform Overview",
      description: "Professional trading interface with real-time market data",
      duration: 3000,
      features: ["Live market data", "Professional charts", "Order management"]
    },
    {
      title: "Live Trading",
      description: "Execute trades with institutional-grade order matching",
      duration: 4000,
      features: ["Market orders", "Limit orders", "Stop-loss protection"]
    },
    {
      title: "AI Assistant",
      description: "Get intelligent trading recommendations and market analysis",
      duration: 3500,
      features: ["Market insights", "Risk analysis", "Trading signals"]
    },
    {
      title: "Portfolio Analytics",
      description: "Track performance with advanced analytics and reporting",
      duration: 3000,
      features: ["Real-time P&L", "Risk metrics", "Performance tracking"]
    },
    {
      title: "Mobile Trading",
      description: "Trade anywhere with our professional mobile applications",
      duration: 2500,
      features: ["iOS & Android", "Biometric security", "Push notifications"]
    }
  ];

  // Demo simulation effects
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDemoData(prev => ({
        btcPrice: prev.btcPrice + (Math.random() - 0.5) * 100,
        portfolio: prev.portfolio + (Math.random() - 0.4) * 1000,
        profit: prev.profit + (Math.random() - 0.4) * 0.5,
        orders: Math.max(0, prev.orders + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.8 ? 1 : 0))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Demo step progression
  useEffect(() => {
    if (!isPlaying) return;

    const stepDuration = demoSteps[currentStep]?.duration || 3000;
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentStep(prevStep => {
            const nextStep = prevStep + 1;
            if (nextStep >= demoSteps.length) {
              setIsPlaying(false);
              return 0;
            }
            return nextStep;
          });
          return 0;
        }
        return prev + (100 / (stepDuration / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isPlaying, currentStep, demoSteps]);

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setProgress(0);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
    setDemoData({
      btcPrice: 64500,
      portfolio: 125000,
      profit: 12.5,
      orders: 3
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden cyber-grid">
      {/* Futuristic Background with Particles - REMOVED per user request */}
      
      {/* Enhanced Video Background for Hero Section */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.6) contrast(1.4) saturate(1.5) hue-rotate(20deg)',
            opacity: 0.8
          }}
        >
          <source src="https://cdn.pixabay.com/video/2024/06/15/216826_large.mp4" type="video/mp4" />
          <source src="https://cdn.pixabay.com/video/2024/02/06/199558-910609536_large.mp4" type="video/mp4" />
          <source src="https://cdn.pixabay.com/video/2019/10/09/27669-365224683_large.mp4" type="video/mp4" />
        </video>
        
        {/* Enhanced overlay for visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40"></div>
      </div>

      {/* Interactive Demo Panel - REMOVED per user request */}



      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/50 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NEBULA X
              </span>
            </h1>

            {/* Subtitle */}
            <div className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
              <p className="mb-4">
                The world's most advanced cryptocurrency trading platform
              </p>
              <p className="text-lg text-gray-400">
                Trade with institutional-grade security, AI-powered insights, and lightning-fast execution
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="glass-enhanced hover-lift flex flex-col justify-center items-center text-center py-3 px-6">
                <div className="text-3xl font-bold text-cyan-400 mb-1 mono">$2.4B+</div>
                <div className="text-sm text-gray-400">Trading Volume</div>
              </div>
              <div className="glass-enhanced hover-lift flex flex-col justify-center items-center text-center py-3 px-6">
                <div className="text-3xl font-bold text-purple-400 mb-1 mono">500K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="glass-enhanced hover-lift flex flex-col justify-center items-center text-center py-3 px-6">
                <div className="text-3xl font-bold text-green-400 mb-1 mono">0.01%</div>
                <div className="text-sm text-gray-400">Trading Fees</div>
              </div>
              <div className="glass-enhanced hover-lift flex flex-col justify-center items-center text-center py-3 px-6">
                <div className="text-3xl font-bold text-pink-400 mb-1 mono">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
              <Link href="/trading">
                <Button 
                  size="lg" 
                  className="btn-futuristic btn-pulse-hover px-10 py-3 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-2xl shadow-green-500/30 flex items-center justify-center"
                >
                  <TrendingUp className="w-6 h-6 mr-3" />
                  Start Trading Now
                  <Sparkles className="w-6 h-6 ml-3" />
                </Button>
              </Link>

              <Link href="/onboarding">
                <Button 
                  size="lg" 
                  className="btn-futuristic btn-glow-hover px-8 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-0 flex items-center justify-center"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started in 30s
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/demo">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-futuristic btn-slide-hover px-8 py-3 text-lg font-semibold border-2 border-purple-400 text-purple-400 hover:bg-purple-400/10 flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}