import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import FuturisticHero from "@/components/layout/futuristic-hero";
import HomepageOnboarding from "@/components/onboarding/homepage-onboarding";
import PersonalizedWelcome from "@/components/trading/personalized-welcome";
import PersonalizedOnboardingTour from "@/components/onboarding/personalized-onboarding-tour";
import QuickActionFloatingMenu from "@/components/onboarding/quick-action-floating-menu";
import AchievementSystem from "@/components/onboarding/achievement-system";
import CryptoConverter from "@/components/trading/crypto-converter";
import SimpleAIChat from "@/components/trading/simple-ai-chat";
// Removed floating popup components to clean up homepage
import { Card, CardContent } from "@/components/ui/card";
import PriceCard from "@/components/ui/price-card";
import { useMarketData } from "@/hooks/use-market-data";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAutoWidgetDismiss } from "@/hooks/use-auto-dismiss";
import { 
  Rocket, 
  TrendingUp, 
  Shield, 
  Zap, 
  Smartphone, 
  Headphones,
  ArrowRight,
  ChartArea,
  Coins,
  IdCard,
  Globe,
  Users,
  Scale3d,
  FileText,
  ShieldX,
  X,
  RefreshCw,
  Eye,
  Heart,
  Activity,
  Settings,
  Bitcoin,
  PieChart,
  Building,
  Crown,
  GraduationCap,
  HelpCircle,
  BookOpen,
  UserPlus
} from "lucide-react";
// Animation components replaced with inline implementations

export default function Home() {
  const { data: markets } = useMarketData();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAITool, setActiveAITool] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiTheme, setAiTheme] = useState("default");
  const [simpleNotification, setSimpleNotification] = useState<string | null>(null);
  const [jsRotation, setJsRotation] = useState(0);
  const [spinnerRotations, setSpinnerRotations] = useState({
    bitcoin: 0,
    ethereum: 0,
    trading: 0,
    rocket: 0,
    diamond: 0
  });

  const [progressValues, setProgressValues] = useState({
    bitcoin: 0,
    ethereum: 0,
    trading: 0,
    diversification: 0
  });

  // Auto-dismiss all popup widgets after 5 seconds
  useAutoWidgetDismiss(!!activeAITool, () => setActiveAITool(null));
  useAutoWidgetDismiss(!!simpleNotification, () => setSimpleNotification(null));
  useAutoWidgetDismiss(showAIChat, () => setShowAIChat(false));
  useAutoWidgetDismiss(showOnboarding, () => setShowOnboarding(false));
  useAutoWidgetDismiss(showNotifications, () => setShowNotifications(false));

  // JavaScript animation test
  useEffect(() => {
    const interval = setInterval(() => {
      setJsRotation(prev => (prev + 10) % 360);
      setSpinnerRotations(prev => ({
        bitcoin: (prev.bitcoin + 5) % 360,
        ethereum: (prev.ethereum + 8) % 360,
        trading: (prev.trading + 3) % 360,
        rocket: (prev.rocket + 12) % 360,
        diamond: (prev.diamond + 2) % 360
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Progress bar animations
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgressValues(prev => {
        const newValues = {
          bitcoin: Math.min(prev.bitcoin + 1, 75),
          ethereum: Math.min(prev.ethereum + 0.8, 45),
          trading: Math.min(prev.trading + 1.5, 90),
          diversification: Math.min(prev.diversification + 0.9, 65)
        };
        console.log('Progress values updated:', newValues);
        return newValues;
      });
    }, 100);
    return () => clearInterval(progressInterval);
  }, []);

  // Auto-dismiss logging for debugging
  useEffect(() => {
    if (activeAITool) {
      console.log(`AI tool widget activated: ${activeAITool} - will auto-dismiss in 5 seconds`);
    }
  }, [activeAITool]);

  // AI Suite Tool Handlers
  const handleAIAssistant = () => {
    console.log("AI Assistant clicked");
    setShowAIChat(true);
    setActiveAITool("ai-assistant");
    setSimpleNotification("AI Assistant Activated - Your intelligent trading advisor is now ready to help.");
    
    toast({
      title: "AI Assistant Activated",
      description: "Your intelligent trading advisor is now ready to help.",
      duration: 5000,
    });
  };

  const handleDeFiTimer = () => {
    console.log("DeFi Timer clicked");
    setActiveAITool("defi-timer");
    console.log("Set activeAITool to: defi-timer");
    console.log("Current activeAITool:", activeAITool);
    setSimpleNotification("DeFi Protocol Timer - Next protocol launch in 2 days, 14 hours, 23 minutes.");
    // Auto-dismissed by useAutoWidgetDismiss hook after 5 seconds
  };

  const handleQuickActions = () => {
    console.log("Quick Actions clicked");
    setActiveAITool("quick-actions");
    console.log("Set activeAITool to: quick-actions");
    console.log("Current activeAITool:", activeAITool);
    setSimpleNotification("Quick Actions Menu - Fast trading shortcuts: Buy/Sell/Transfer/Stake available.");
    // Auto-dismissed by useAutoWidgetDismiss hook after 5 seconds
  };

  const handleSmartTheme = () => {
    console.log("Smart Theme clicked");
    const themes = ["default", "cyber", "neon", "aurora", "matrix"];
    const currentIndex = themes.indexOf(aiTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setAiTheme(nextTheme);
    setActiveAITool("smart-theme");
    setSimpleNotification(`Smart Theme Activated - Interface adapted to ${nextTheme} color scheme.`);
    // Auto-dismissed by useAutoWidgetDismiss hook after 5 seconds
  };

  const handleNebbyGuide = () => {
    console.log("Nebby Guide clicked");
    setActiveAITool("nebby-guide");
    setSimpleNotification("Hey there! It's Nebby! - I'm here to guide you through your crypto journey.");
    setTimeout(() => setSimpleNotification(null), 5000);
  };

  const handleSmartWidgets = () => {
    console.log("Smart Widgets clicked");
    setActiveAITool("smart-widgets");
    setSimpleNotification("Smart Widgets Activated - Personalized dashboard widgets configured based on your trading patterns.");
    setTimeout(() => setSimpleNotification(null), 5000);
  };

  // Trading Execution Functions for Popup Widgets
  const executeAIRecommendation = () => {
    toast({
      title: "Trade Executed",
      description: "BTC Buy order placed successfully. Target: $67,500 (+12%)",
      duration: 5000,
    });
    setLocation("/trading?pair=BTCUSDT&action=buy");
    setActiveAITool(null);
  };

  const showMoreAnalysis = () => {
    setLocation("/ai-assistant");
    setActiveAITool(null);
  };

  const setDeFiAlert = () => {
    toast({
      title: "Alert Set",
      description: "You'll be notified when SolanaFi v2.0 launches in 2d 14h 23m",
      duration: 5000,
    });
    setActiveAITool(null);
  };

  const executeQuickBuy = () => {
    setLocation("/trading?action=buy&quick=true");
    setActiveAITool(null);
  };

  const executeQuickSell = () => {
    setLocation("/trading?action=sell&quick=true");
    setActiveAITool(null);
  };

  const executeTransfer = () => {
    setLocation("/wallet?action=transfer");
    setActiveAITool(null);
  };

  const executeStake = () => {
    setLocation("/staking");
    setActiveAITool(null);
  };

  const changeTheme = (theme: string) => {
    setAiTheme(theme);
    
    // Apply theme to the document root
    const root = document.documentElement;
    
    // Map theme names to actual theme application
    const themeMapping: Record<string, () => void> = {
      cyber: () => {
        root.style.setProperty('--color-primary', 'hsl(259, 94%, 51%)');
        root.style.setProperty('--color-secondary', 'hsl(180, 100%, 50%)');
        root.style.setProperty('--color-accent', 'hsl(300, 100%, 75%)');
        root.className = root.className.replace(/theme-\w+/g, '');
        root.classList.add('theme-neo-cyber');
      },
      neon: () => {
        root.style.setProperty('--color-primary', 'hsl(25, 95%, 53%)');
        root.style.setProperty('--color-secondary', 'hsl(45, 93%, 47%)');
        root.style.setProperty('--color-accent', 'hsl(5, 85%, 60%)');
        root.className = root.className.replace(/theme-\w+/g, '');
        root.classList.add('theme-crypto-green');
      },
      aurora: () => {
        root.style.setProperty('--color-primary', 'hsl(200, 94%, 51%)');
        root.style.setProperty('--color-secondary', 'hsl(180, 100%, 40%)');
        root.style.setProperty('--color-accent', 'hsl(220, 100%, 75%)');
        root.className = root.className.replace(/theme-\w+/g, '');
        root.classList.add('theme-galaxy');
      },
      matrix: () => {
        root.style.setProperty('--color-primary', 'hsl(120, 94%, 51%)');
        root.style.setProperty('--color-secondary', 'hsl(100, 100%, 40%)');
        root.style.setProperty('--color-accent', 'hsl(140, 100%, 75%)');
        root.className = root.className.replace(/theme-\w+/g, '');
        root.classList.add('theme-matrix');
      },
      default: () => {
        root.style.setProperty('--color-primary', 'hsl(210, 40%, 50%)');
        root.style.setProperty('--color-secondary', 'hsl(200, 30%, 40%)');
        root.style.setProperty('--color-accent', 'hsl(220, 50%, 60%)');
        root.className = root.className.replace(/theme-\w+/g, '');
        root.classList.add('theme-light');
      },
      dark: () => {
        root.style.setProperty('--color-primary', 'hsl(259, 94%, 51%)');
        root.style.setProperty('--color-secondary', 'hsl(180, 100%, 50%)');
        root.style.setProperty('--color-accent', 'hsl(300, 100%, 75%)');
        root.className = root.className.replace(/theme-\w+/g, '');
        root.classList.add('theme-dark');
      }
    };
    
    // Apply the theme
    const applyTheme = themeMapping[theme];
    if (applyTheme) {
      applyTheme();
      localStorage.setItem('nebulax-theme', theme);
    }
    
    toast({
      title: "Theme Applied",
      description: `Switched to ${theme} theme for enhanced trading experience`,
      duration: 3000,
    });
  };

  const askNebby = () => {
    setLocation("/ai-assistant");
    setActiveAITool(null);
  };

  const viewSmartWidgets = () => {
    setLocation("/portfolio");
    setActiveAITool(null);
  };

  // 10-second delay for notification components on homepage only
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotifications(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full relative" style={{ margin: 0, padding: 0, height: "auto", position: "static" }}>

      
      {/* Simple Notification Display */}
      {simpleNotification && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-[10000] bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg border border-green-400">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{simpleNotification}</span>
            <button 
              onClick={() => setSimpleNotification(null)}
              className="ml-4 text-white hover:text-gray-200 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Futuristic Hero Section */}
      <div className="relative z-10">
        <FuturisticHero />
      </div>

      {/* Main Content Area with Custom Video Background */}
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black">
        {/* Custom Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{
              opacity: 0.3,
              filter: 'brightness(0.4) contrast(1.2) saturate(1.1)',
              mixBlendMode: 'soft-light'
            }}
            onError={(e) => {
              console.warn("Video background failed to load:", e);
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="/videos/background.webm" type="video/webm" />
            {/* Fallback gradient if video fails */}
          </video>
        </div>
          
        {/* Gradient overlay for better content readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-gray-900/40 to-black/60 z-[1]"></div>
          
          {/* Additional subtle animated overlays */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-gray-900/30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.15),transparent_50%)]"></div>
          </div>
        </div>

        {/* Enhanced Transition Section */}
        <section className="relative py-6 overflow-hidden" style={{ zIndex: 10 }}>
          <div className="absolute inset-0 z-0">
            {/* Floating geometric shapes overlay */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute border border-purple-500/20 rounded-full animate-ping"
                  style={{
                    width: `${Math.random() * 100 + 50}px`,
                    height: `${Math.random() * 100 + 50}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${5 + Math.random() * 10}s`
                  }}
                />
              ))}
            </div>
            
            {/* Moving light particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(80)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white/10 rounded-full animate-pulse"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 8}s`,
                    animationDuration: `${2 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/30 to-black/50"></div>
          </div>
          
          {/* Content over animated background */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-white/80 text-lg font-medium mb-4">
              Experience the Future of Trading
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Advanced Technology Meets Intuitive Design
            </div>
          </div>
        </section>

        {/* Interactive Features Demo Section */}
        <section className="relative py-6 overflow-hidden" style={{ zIndex: 10 }}>
          {/* Background content inherits from main container - no additional video needed here */}
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Interactive Trading Experience</h2>
              <p className="text-gray-300 text-lg">Discover our enhanced UI with micro-interactions and real-time feedback</p>
            </div>

            {/* Emoji Reactions Demo */}
            <div className="mb-12">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-4">🎯 Emoji Reactions</h3>
                <p className="text-gray-300 mb-4">Express your trading emotions with animated emoji reactions</p>
                <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-900/30 rounded-xl backdrop-blur-sm">
                  {['🚀', '📈', '📉', '💎', '🔥', '⚡', '💯', '🎯', '🤑', '😎', '💪', '🌟'].map((emoji) => (
                    <div
                      key={emoji}
                      className="p-2 rounded-lg text-2xl transition-all duration-200 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/30 hover:border-blue-500/50 cursor-pointer hover:scale-125 transform"
                      onClick={() => {
                        console.log('Reacted with:', emoji);
                        toast({
                          title: `Reacted with ${emoji}`,
                          description: "Nice choice! Keep trading with emotion.",
                          duration: 2000,
                        });
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Click an emoji to react • Animations show your trading mood
                  </p>
                </div>
              </div>
            </div>

            {/* Trading Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="relative p-4 rounded-xl border backdrop-blur-sm bg-gray-900/40 border-gray-600/30 hover:bg-gray-800/60 hover:border-blue-500/50 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                   onClick={() => setLocation('/trading')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">₿</div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Bitcoin</div>
                      <div className="text-xl font-bold text-white">$45,250.32</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    +2.45%
                  </div>
                </div>
              </div>

              <div className="relative p-4 rounded-xl border backdrop-blur-sm bg-gray-900/40 border-gray-600/30 hover:bg-gray-800/60 hover:border-blue-500/50 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                   onClick={() => setLocation('/trading')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">Ξ</div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Ethereum</div>
                      <div className="text-xl font-bold text-white">$3,150.89</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                    -1.23%
                  </div>
                </div>
              </div>

              <div className="relative p-4 rounded-xl border backdrop-blur-sm bg-gray-900/40 border-gray-600/30 hover:bg-gray-800/60 hover:border-blue-500/50 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                   onClick={() => setLocation('/portfolio')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Portfolio</div>
                      <div className="text-xl font-bold text-white">$12,450</div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    +5.67%
                  </div>
                </div>
              </div>

              <div className="relative p-4 rounded-xl border backdrop-blur-sm bg-gray-900/40 border-gray-600/30 hover:bg-gray-800/60 hover:border-blue-500/50 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                   onClick={() => setLocation('/trading')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Active Orders</div>
                      <div className="text-xl font-bold text-white">3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Spinners Demo */}
            <div className="mb-12">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-4">🚀 Crypto Loading Spinners</h3>
                
                {/* Test Spinner to verify animations work */}
                <div className="mb-6 text-center">
                  <div 
                    className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                    style={{
                      animation: 'spin 1s linear infinite',
                      animationPlayState: 'running',
                      animationFillMode: 'both'
                    }}
                  ></div>
                  <p className="text-sm text-gray-400 mt-2">Basic Test Spinner (should be spinning)</p>
                  
                  {/* Additional test with simpler approach */}
                  <div 
                    className="inline-block w-8 h-8 bg-red-500 mt-4 mx-2"
                    style={{
                      animation: 'spin 2s linear infinite',
                      borderRadius: '50%'
                    }}
                  ></div>
                  <p className="text-sm text-gray-400 mt-2">Red circle test (should also be spinning)</p>
                  
                  {/* Test with transform directly */}
                  <div 
                    className="inline-block w-8 h-8 bg-green-500 mt-4 mx-2"
                    style={{
                      borderRadius: '50%',
                      transform: 'rotate(45deg)',
                      transition: 'transform 0.5s ease'
                    }}
                  ></div>
                  <p className="text-sm text-gray-400 mt-2">Green circle (static but should be visible)</p>
                  
                  {/* JavaScript animation test */}
                  <div 
                    className="inline-block w-8 h-8 bg-yellow-500 mt-4 mx-2"
                    style={{
                      borderRadius: '50%',
                      transform: `rotate(${jsRotation}deg)`,
                      transition: 'none'
                    }}
                  ></div>
                  <p className="text-sm text-gray-400 mt-2">JS Animation Test (rotation: {jsRotation}°)</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
                      <div 
                        className="absolute inset-0 border-4 border-transparent border-t-yellow-500 rounded-full"
                        style={{
                          transform: `rotate(${spinnerRotations.bitcoin}deg)`,
                          transition: 'none'
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-yellow-500 font-bold text-xl">₿</div>
                    </div>
                    <p className="text-sm text-gray-400">Bitcoin ({spinnerRotations.bitcoin}°)</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                      <div 
                        className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full"
                        style={{
                          transform: `rotate(${spinnerRotations.ethereum}deg)`,
                          transition: 'none'
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold text-xl">Ξ</div>
                    </div>
                    <p className="text-sm text-gray-400">Ethereum ({spinnerRotations.ethereum}°)</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <div className="absolute inset-0 border-4 border-green-500/20 rounded-full"></div>
                      <div 
                        className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full"
                        style={{
                          transform: `rotate(${spinnerRotations.trading}deg)`,
                          transition: 'none'
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-green-500 font-bold text-xl">📈</div>
                    </div>
                    <p className="text-sm text-gray-400">Trading ({spinnerRotations.trading}°)</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
                      <div 
                        className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full"
                        style={{
                          transform: `rotate(${spinnerRotations.rocket}deg)`,
                          transition: 'none'
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-xl">🚀</div>
                    </div>
                    <p className="text-sm text-gray-400">Rocket ({spinnerRotations.rocket}°)</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                      <div 
                        className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full"
                        style={{
                          transform: `rotate(${spinnerRotations.diamond}deg)`,
                          transition: 'none'
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-purple-500 font-bold text-xl">💎</div>
                    </div>
                    <p className="text-sm text-gray-400">Diamond ({spinnerRotations.diamond}°)</p>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    All spinners should be rotating continuously • If not rotating, there's a CSS animation issue
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bars Demo */}
            <div className="mb-12">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-6">📊 Crypto Progress Indicators</h3>
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-400">
                    Debug: BTC={Math.round(progressValues.bitcoin)}%, ETH={Math.round(progressValues.ethereum)}%, 
                    Trading={Math.round(progressValues.trading)}%, Div={Math.round(progressValues.diversification)}%
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">₿</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Bitcoin Portfolio Allocation</span>
                        <span className="text-sm text-yellow-400 font-medium">{Math.round(progressValues.bitcoin)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-600">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-100" 
                          style={{ 
                            width: `${progressValues.bitcoin}%`,
                            minWidth: progressValues.bitcoin > 0 ? '4px' : '0'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">Ξ</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Ethereum Staking Progress</span>
                        <span className="text-sm text-blue-400 font-medium">{Math.round(progressValues.ethereum)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-600">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full transition-all duration-100" 
                          style={{ 
                            width: `${progressValues.ethereum}%`,
                            minWidth: progressValues.ethereum > 0 ? '4px' : '0'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">📈</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Trading Goal Achievement</span>
                        <span className="text-sm text-green-400 font-medium">{Math.round(progressValues.trading)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-600">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-100" 
                          style={{ 
                            width: `${progressValues.trading}%`,
                            minWidth: progressValues.trading > 0 ? '4px' : '0'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">🌈</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">Diversification Score</span>
                        <span className="text-sm text-purple-400 font-medium">{Math.round(progressValues.diversification)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-600">
                        <div 
                          className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 h-full rounded-full transition-all duration-100" 
                          style={{ 
                            width: `${progressValues.diversification}%`,
                            minWidth: progressValues.diversification > 0 ? '4px' : '0'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Buttons Demo */}
            <div className="mb-12">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-6">⚡ Interactive Buttons</h3>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg rounded-lg font-medium transition-all duration-200 cursor-pointer hover:scale-105 transform shadow-lg"
                       onClick={() => setLocation('/trading')}>
                    Buy Now 🚀
                  </div>

                  <div className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg rounded-lg font-medium transition-all duration-200 cursor-pointer hover:scale-105 transform shadow-lg"
                       onClick={() => setLocation('/trading')}>
                    Sell Now 📉
                  </div>

                  <div className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg rounded-lg font-medium transition-all duration-200 cursor-pointer hover:scale-105 transform shadow-lg"
                       onClick={() => setLocation('/portfolio')}>
                    Analytics 📊
                  </div>

                  <div className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 text-lg rounded-lg font-medium transition-all duration-200 cursor-pointer hover:scale-105 transform shadow-lg"
                       onClick={() => setLocation('/settings')}>
                    Settings ⚙️
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Interactive buttons with hover effects • Click to navigate to different sections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Trading Assistant Suite */}
      <section className="relative py-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-y border-purple-500/30" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-white mb-2">AI Trading Assistant Suite</h3>
            <p className="text-gray-300">Intelligent trading tools and personalized assistance</p>
          </div>
          
          {/* AI Assistant Tools Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            
            {/* AI Trading Assistant */}
            <div 
              onClick={handleAIAssistant}
              className={`bg-blue-900/40 border border-blue-500/30 rounded-xl p-4 text-center hover:bg-blue-800/50 transition-colors cursor-pointer transform hover:scale-105 ${
                activeAITool === "ai-assistant" ? "ring-2 ring-blue-400 bg-blue-800/60" : ""
              }`}
              style={{
                height: '180px',
                minWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">🤖</span>
              </div>
              <h4 className="text-white text-base font-medium mb-2">AI Assistant</h4>
              <p className="text-gray-400 text-sm">Smart trading advice</p>
            </div>
            
            {/* DeFi Protocol */}
            <div 
              onClick={handleDeFiTimer}
              className={`bg-purple-900/40 border border-purple-500/30 rounded-xl p-4 text-center hover:bg-purple-800/50 transition-colors cursor-pointer transform hover:scale-105 ${
                activeAITool === "defi-timer" ? "ring-2 ring-purple-400 bg-purple-800/60" : ""
              }`}
              style={{
                height: '180px',
                minWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">⏰</span>
              </div>
              <h4 className="text-white text-base font-medium mb-2">DeFi Timer</h4>
              <p className="text-gray-400 text-sm">Launch countdown</p>
            </div>
            
            {/* Quick Actions */}
            <div 
              onClick={handleQuickActions}
              className={`bg-green-900/40 border border-green-500/30 rounded-xl p-4 text-center hover:bg-green-800/50 transition-colors cursor-pointer transform hover:scale-105 ${
                activeAITool === "quick-actions" ? "ring-2 ring-green-400 bg-green-800/60" : ""
              }`}
              style={{
                height: '180px',
                minWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">⚡</span>
              </div>
              <h4 className="text-white text-base font-medium mb-2">Quick Actions</h4>
              <p className="text-gray-400 text-sm">Fast trading tools</p>
            </div>
            
            {/* Color Adapter */}
            <div 
              onClick={handleSmartTheme}
              className={`bg-cyan-900/40 border border-cyan-500/30 rounded-xl p-4 text-center hover:bg-cyan-800/50 transition-colors cursor-pointer transform hover:scale-105 ${
                activeAITool === "smart-theme" ? "ring-2 ring-cyan-400 bg-cyan-800/60" : ""
              }`}
              style={{
                height: '180px',
                minWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">🎨</span>
              </div>
              <h4 className="text-white text-base font-medium mb-2">Smart Theme</h4>
              <p className="text-gray-400 text-sm">Auto color adapt</p>
            </div>
            
            {/* Mascot Nebby */}
            <div 
              onClick={handleNebbyGuide}
              className={`bg-pink-900/40 border border-pink-500/30 rounded-xl p-4 text-center hover:bg-pink-800/50 transition-colors cursor-pointer transform hover:scale-105 ${
                activeAITool === "nebby-guide" ? "ring-2 ring-pink-400 bg-pink-800/60" : ""
              }`}
              style={{
                height: '180px',
                minWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">🌟</span>
              </div>
              <h4 className="text-white text-base font-medium mb-2">Nebby Guide</h4>
              <p className="text-gray-400 text-sm">Personal mascot</p>
            </div>
            
            {/* Widget Recommendations */}
            <div 
              onClick={handleSmartWidgets}
              className={`bg-orange-900/40 border border-orange-500/30 rounded-xl p-4 text-center hover:bg-orange-800/50 transition-colors cursor-pointer transform hover:scale-105 ${
                activeAITool === "smart-widgets" ? "ring-2 ring-orange-400 bg-orange-800/60" : ""
              }`}
              style={{
                height: '180px',
                minWidth: '160px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-lg">📊</span>
              </div>
              <h4 className="text-white text-base font-medium mb-2">Smart Widgets</h4>
              <p className="text-gray-400 text-sm">Personalized tools</p>
            </div>
            
          </div>
          
          {/* AI Suite Status */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              AI Suite Active - 6 Tools Available
            </div>
          </div>

          {/* AI Tool Widgets - Modal/Overlay Format */}
          {/* Debug indicator */}
          {activeAITool && (
            <div className="fixed top-4 left-4 bg-red-500 text-white px-4 py-2 rounded z-[10000] text-sm">
              Debug: activeAITool = {activeAITool}
            </div>
          )}
          
          {activeAITool === "ai-assistant" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-gradient-to-b from-blue-900 to-blue-950 text-white rounded-xl shadow-2xl border border-blue-500/30 overflow-hidden">
                
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-4 border-b border-blue-600/30">
                  <div>
                    <h2 className="text-xl font-bold">AI Trading Assistant</h2>
                    <p className="text-sm text-blue-300">Powered by advanced AI</p>
                  </div>
                  <button 
                    onClick={() => setActiveAITool(null)} 
                    className="w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Status Indicator */}
                <div className="px-4 py-3 bg-blue-800/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🤖</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">NebulaX AI Assistant</div>
                      <div className="text-xs text-blue-300">Online and ready to help</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-300">Live</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-blue-700/50 hover:bg-blue-700 rounded-lg p-3 text-sm transition-colors flex items-center space-x-2">
                      <span>📊</span>
                      <span>Market Analysis</span>
                    </button>
                    <button className="bg-blue-700/50 hover:bg-blue-700 rounded-lg p-3 text-sm transition-colors flex items-center space-x-2">
                      <span>💼</span>
                      <span>Portfolio Review</span>
                    </button>
                    <button className="bg-blue-700/50 hover:bg-blue-700 rounded-lg p-3 text-sm transition-colors flex items-center space-x-2">
                      <span>⚡</span>
                      <span>Trade Signals</span>
                    </button>
                    <button className="bg-blue-700/50 hover:bg-blue-700 rounded-lg p-3 text-sm transition-colors flex items-center space-x-2">
                      <span>🎯</span>
                      <span>Risk Assessment</span>
                    </button>
                  </div>
                </div>

                {/* AI Chat Interface */}
                <div className="p-4 border-t border-blue-600/30">
                  <div className="bg-blue-900/60 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm font-medium">AI Assistant</span>
                      <div className="bg-green-500 text-green-100 px-2 py-1 rounded text-xs">High Confidence</div>
                    </div>
                    <p className="text-sm leading-relaxed">
                      Hello! I'm your AI Trading Assistant. I can help you with market analysis, 
                      trading recommendations, and portfolio optimization. What would you like to know?
                    </p>
                  </div>

                  {/* Input Section */}
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Ask me about trading or markets..."
                      className="flex-1 bg-blue-800/50 border border-blue-600/50 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
                    />
                    <button className="bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-2 text-sm transition-colors">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeAITool === "defi-timer" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-2xl border border-purple-400">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">⏰ DeFi Protocol Timer</h3>
                  <button onClick={() => setActiveAITool(null)} className="text-white hover:text-red-300 text-xl">×</button>
                </div>
                <div className="text-center space-y-3">
                  <div className="text-3xl font-mono mb-2">2d 14h 23m</div>
                  <div className="text-sm bg-black/20 rounded p-3">
                    <div className="font-bold">🚀 SolanaFi v2.0 Launch</div>
                    <div className="text-xs mt-1">Expected APY: 15-18%</div>
                    <div className="text-xs">Early access available</div>
                  </div>
                  <button 
                    onClick={setDeFiAlert}
                    className="w-full bg-pink-600 hover:bg-pink-700 p-2 rounded text-sm transition-colors"
                  >
                    Set Alert
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeAITool === "quick-actions" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-gradient-to-br from-green-600 to-emerald-600 text-white p-6 rounded-xl shadow-2xl border border-green-400">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">⚡ Quick Actions</h3>
                  <button onClick={() => setActiveAITool(null)} className="text-white hover:text-red-300 text-xl">×</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={executeQuickBuy}
                    className="bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-colors"
                  >
                    <div className="text-2xl mb-1">🚀</div>
                    <div className="text-xs font-bold">Quick Buy</div>
                  </button>
                  <button 
                    onClick={executeQuickSell}
                    className="bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-colors"
                  >
                    <div className="text-2xl mb-1">📉</div>
                    <div className="text-xs font-bold">Quick Sell</div>
                  </button>
                  <button 
                    onClick={executeTransfer}
                    className="bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-colors"
                  >
                    <div className="text-2xl mb-1">💸</div>
                    <div className="text-xs font-bold">Transfer</div>
                  </button>
                  <button 
                    onClick={executeStake}
                    className="bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-colors"
                  >
                    <div className="text-2xl mb-1">🏦</div>
                    <div className="text-xs font-bold">Stake</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeAITool === "smart-theme" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-gradient-to-br from-cyan-600 to-blue-600 text-white p-6 rounded-xl shadow-2xl border border-cyan-400">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">🎨 Smart Theme</h3>
                  <button onClick={() => setActiveAITool(null)} className="text-white hover:text-red-300 text-xl">×</button>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-xl mb-2">Current: {aiTheme} Mode</div>
                    <div className="text-xs opacity-90">Interface optimized for your viewing preference</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["cyber", "neon", "aurora", "matrix", "default", "dark"].map(theme => (
                      <button 
                        key={theme}
                        onClick={() => changeTheme(theme)}
                        className={`p-2 rounded text-xs transition-colors ${
                          aiTheme === theme ? 'bg-white text-black' : 'bg-black/20 hover:bg-black/30'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeAITool === "nebby-guide" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-gradient-to-br from-pink-600 to-purple-600 text-white p-6 rounded-xl shadow-2xl border border-pink-400">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">🌟 Nebby Guide</h3>
                  <button onClick={() => setActiveAITool(null)} className="text-white hover:text-red-300 text-xl">×</button>
                </div>
                <div className="text-center space-y-3">
                  <div className="text-4xl mb-2">🤖</div>
                  <div className="text-sm">"Hey there! I'm Nebby, your crypto guide!"</div>
                  <div className="text-xs bg-black/20 rounded p-3 text-left">
                    <div className="font-bold mb-2">Quick Tips:</div>
                    💡 Start with small trades to learn<br/>
                    📚 Check our Education section<br/>
                    🔒 Enable 2FA for security<br/>
                    📊 Use AI insights for decisions
                  </div>
                  <button 
                    onClick={askNebby}
                    className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded text-sm transition-colors"
                  >
                    Start Tutorial
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeAITool === "smart-widgets" && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-gradient-to-br from-orange-600 to-red-600 text-white p-6 rounded-xl shadow-2xl border border-orange-400">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">📊 Smart Widgets</h3>
                  <button onClick={() => setActiveAITool(null)} className="text-white hover:text-red-300 text-xl">×</button>
                </div>
                <div className="space-y-3">
                  <div className="bg-black/20 rounded p-3">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-bold">📊 Portfolio Tracker</div>
                      <div className="text-xs text-green-300">+2.3%</div>
                    </div>
                    <div className="text-sm">$12,543.28</div>
                  </div>
                  <div className="bg-black/20 rounded p-3">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-bold">🎯 Trade Alerts</div>
                      <div className="text-xs bg-red-500 px-2 py-1 rounded">3</div>
                    </div>
                    <div className="text-xs opacity-80">Active alerts</div>
                  </div>
                  <div className="bg-black/20 rounded p-3">
                    <div className="text-xs font-bold mb-1">🚀 AI Recommendations</div>
                    <div className="text-xs">Buy SOL (+15% confidence)</div>
                  </div>
                  <button 
                    onClick={viewSmartWidgets}
                    className="w-full bg-orange-600 hover:bg-orange-700 p-2 rounded text-sm transition-colors"
                  >
                    Customize Widgets
                  </button>
                </div>
              </div>
            </div>
          )}




        </div>
      </section>

      {/* Personalized Welcome, Converter & Onboarding */}
      <section className="py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Good Afternoon Trader Box */}
            <PersonalizedWelcome />
            
            {/* Quick Converter Box - Centered */}
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <div data-converter>
                  <CryptoConverter />
                </div>
              </div>
            </div>
            
            {/* Onboarding Tour */}
            <PersonalizedOnboardingTour />
          </div>
        </div>
      </section>

      {/* Instant Onboarding CTA */}
      <section className="py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-enhanced border-2 border-purple-400/30 mb-6">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <Zap className="text-white w-8 h-8" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Start Trading in 30 Seconds
              </h2>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of traders on Nebula X. Quick 3-step onboarding gets you trading instantly with demo funds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center -mt-4 mb-8">
                <Link href="/trading">
                  <Button 
                    size="lg" 
                    className="btn-bounce-hover bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xl px-12 py-3 shadow-2xl shadow-green-500/40 font-bold transform hover:scale-105 transition-all duration-300 w-full"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1',
                      height: '48px'
                    }}
                  >
                    <Coins className="mr-3 h-7 w-7" />
                    <span className="flex-1 text-center">Buy & Sell Crypto Now</span>
                    <TrendingUp className="ml-3 h-7 w-7" />
                  </Button>
                </Link>
                <Link href="/otc-desk">
                  <Button 
                    size="lg" 
                    className="btn-bounce-hover bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-xl px-12 py-3 shadow-2xl shadow-pink-500/40 font-bold transform hover:scale-105 transition-all duration-300 w-full"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1',
                      height: '48px'
                    }}
                  >
                    <Zap className="mr-3 h-7 w-7" />
                    <span className="flex-1 text-center">OTC Desk Pro</span>
                    <ArrowRight className="ml-3 h-7 w-7" />
                  </Button>
                </Link>
                <Link href="/trading">
                  <Button 
                    size="lg" 
                    className="btn-magnetic-hover bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: '1',
                      height: '48px'
                    }}
                  >
                    <ChartArea className="mr-2 h-6 w-6" />
                    <span className="flex-1 text-center">Trading Dashboard</span>
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="btn-futuristic btn-ripple-hover text-lg px-8 py-4 border-2 border-purple-400"
                  >
                    <Rocket className="mr-2 h-6 w-6" />
                    Get Started
                  </Button>
                </Link>
              </div>
              
              {/* Quick Access Pills */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/trading?pair=BTCUSDT">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-sm px-4 py-3 border-orange-400/50 text-orange-400 hover:bg-orange-400/10 flex items-center justify-center min-h-[44px]"
                  >
                    Buy Bitcoin
                  </Button>
                </Link>
                <Link href="/trading?pair=ETHUSDT">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-sm px-4 py-3 border-blue-400/50 text-blue-400 hover:bg-blue-400/10 flex items-center justify-center min-h-[44px]"
                  >
                    Buy Ethereum
                  </Button>
                </Link>
                <Link href="/markets">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-sm px-4 py-3 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 flex items-center justify-center min-h-[44px]"
                  >
                    View All Markets
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-sm px-4 py-3 border-purple-400/50 text-purple-400 hover:bg-purple-400/10 flex items-center justify-center min-h-[44px]"
                  >
                    Portfolio
                  </Button>
                </Link>
                <a href={`${window.location.protocol}//${window.location.hostname}:5001`} target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-sm px-4 py-2 border-pink-400/50 text-pink-400 hover:bg-pink-400/10"
                  >
                    OTC Desk Pro →
                  </Button>
                </a>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="text-green-400">✓ No credit card required</span> • 
                <span className="text-green-400"> ✓ $1,000 demo balance</span> • 
                <span className="text-green-400"> ✓ VASP licensed & secure</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>



      {/* Onboarding Modal/Section */}
      {showOnboarding && (
        <section className="py-6 bg-black/50 fixed inset-0 z-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-end mb-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowOnboarding(false)}
                className="text-white hover:text-purple-400"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <HomepageOnboarding />
          </div>
        </section>
      )}

      {/* Live Markets Section */}
      <section className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-enhanced rounded-2xl mb-6 hover-lift">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Live Markets
                </h3>
                <Link href="/markets">
                  <Button className="btn-futuristic">
                    View All Markets →
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {markets?.slice(0, 4).map((market) => (
                  <div key={market.symbol} className="glass p-4 rounded-lg hover-lift">
                    <PriceCard market={market} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gamification Features Section */}
      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              🎮 Interactive Crypto Features 🎮
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Level up your crypto journey with our gamified learning tools, social features, and personal tracking systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Crypto Learning Carnival */}
            <Link href="/learning-carnival">
              <Card className="glass-enhanced hover-lift cursor-pointer group transition-all duration-300 hover:scale-105 border-2 border-purple-500/30 hover:border-purple-500/60">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:animate-bounce">🎪</div>
                  <h3 className="text-lg font-bold mb-2 text-purple-400 group-hover:text-purple-300">
                    Learning Carnival
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive crypto learning with playful gamification
                  </p>
                  <div className="mt-4 bg-purple-500/20 rounded-full px-3 py-1 text-xs text-purple-300">
                    Play & Learn
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Emoji Mood Tracker */}
            <Link href="/mood-tracker">
              <Card className="glass-enhanced hover-lift cursor-pointer group transition-all duration-300 hover:scale-105 border-2 border-blue-500/30 hover:border-blue-500/60">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:animate-pulse">😊</div>
                  <h3 className="text-lg font-bold mb-2 text-blue-400 group-hover:text-blue-300">
                    Mood Tracker
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Emoji-based mood tracker for portfolio performance
                  </p>
                  <div className="mt-4 bg-blue-500/20 rounded-full px-3 py-1 text-xs text-blue-300">
                    Track Emotions
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Portfolio Screenshot */}
            <Link href="/portfolio-screenshot">
              <Card className="glass-enhanced hover-lift cursor-pointer group transition-all duration-300 hover:scale-105 border-2 border-green-500/30 hover:border-green-500/60">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:animate-spin">📸</div>
                  <h3 className="text-lg font-bold mb-2 text-green-400 group-hover:text-green-300">
                    Portfolio Flex
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    One-click social media portfolio flex screenshot
                  </p>
                  <div className="mt-4 bg-green-500/20 rounded-full px-3 py-1 text-xs text-green-300">
                    Share Gains
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Crypto Mascot Assistant */}
            <Link href="/crypto-tutor">
              <Card className="glass-enhanced hover-lift cursor-pointer group transition-all duration-300 hover:scale-105 border-2 border-pink-500/30 hover:border-pink-500/60">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:animate-bounce">🤗</div>
                  <h3 className="text-lg font-bold mb-2 text-pink-400 group-hover:text-pink-300">
                    Crypto Tutor
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cute crypto mascot assistant for beginner tutorials
                  </p>
                  <div className="mt-4 bg-pink-500/20 rounded-full px-3 py-1 text-xs text-pink-300">
                    Meet Nebby
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Achievement Stickers */}
            <Link href="/achievements">
              <Card className="glass-enhanced hover-lift cursor-pointer group transition-all duration-300 hover:scale-105 border-2 border-yellow-500/30 hover:border-yellow-500/60">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:animate-pulse">🏆</div>
                  <h3 className="text-lg font-bold mb-2 text-yellow-400 group-hover:text-yellow-300">
                    Achievement Stickers
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Personalized crypto achievement sticker collection
                  </p>
                  <div className="mt-4 bg-yellow-500/20 rounded-full px-3 py-1 text-xs text-yellow-300">
                    Collect All
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Ready to Level Up Your Crypto Game?
              </h3>
              <p className="text-gray-300 mb-6">
                Explore all our interactive features and start your gamified crypto learning journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/learning-carnival">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 font-semibold">
                    Start Learning Journey
                  </Button>
                </Link>
                <Link href="/achievements">
                  <Button variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 px-8 py-3">
                    View Achievements
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 bg-muted/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Why Choose Nebula X?</h2>
            <p className="text-xl text-muted-foreground">Advanced features for professional crypto trading</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-enhanced hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 animate-pulse">
                  <Zap className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 neon-text text-purple-400">Lightning Fast Execution</h3>
                <p className="text-muted-foreground mb-4">Ultra-low latency trading engine processes orders in microseconds with 99.9% uptime guarantee.</p>
                <div className="text-sm text-purple-400 font-bold mono">&lt; 1ms execution time</div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 animate-pulse">
                  <Shield className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 neon-text text-cyan-400">Quantum Security</h3>
                <p className="text-muted-foreground mb-4">Advanced security with cold storage, multi-signature wallets, and 24/7 monitoring systems.</p>
                <div className="text-sm text-[hsl(var(--accent-cyan))] font-medium">VASP Licensed & Compliant</div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 animate-pulse">
                  <ChartArea className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 neon-text text-pink-400">Advanced Trading Tools</h3>
                <p className="text-muted-foreground mb-4">Professional charting, technical indicators, algorithmic trading, and portfolio management tools.</p>
                <div className="text-sm text-pink-400 font-bold mono">TradingView Integration</div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 animate-pulse">
                  <Coins className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 neon-text text-green-400">Deep Liquidity</h3>
                <p className="text-muted-foreground mb-4">Access to deep liquidity pools and institutional OTC desk for large volume trades.</p>
                <div className="text-sm text-green-400 font-bold mono">$50M+ Daily Volume</div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 animate-pulse">
                  <Smartphone className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 neon-text text-purple-400">Mobile Trading</h3>
                <p className="text-muted-foreground mb-4">Full-featured mobile apps for iOS and Android with real-time notifications and trading capabilities.</p>
                <div className="text-sm text-purple-400 font-bold mono">Available on App Stores</div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced hover-lift">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-green-500 rounded-xl flex items-center justify-center mb-6 animate-pulse">
                  <Headphones className="text-white w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 neon-text text-pink-400">24/7 Support</h3>
                <p className="text-muted-foreground mb-4">Round-the-clock customer support with dedicated account managers for VIP clients.</p>
                <div className="text-sm text-pink-400 font-bold mono">Multi-language Support</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About & Compliance */}
      <section className="py-6 bg-muted/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">About NebulaX</h2>
              <p className="text-xl text-muted-foreground mb-8">
                We're building the next-generation cryptocurrency exchange platform, engineered for speed, reliability, and security. Licensed and regulated, we serve traders worldwide with cutting-edge technology.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] rounded-xl flex items-center justify-center">
                    <IdCard className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">VASP Licensed</h3>
                    <p className="text-muted-foreground">Fully compliant with Czech Republic regulations</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--accent-cyan))] to-[hsl(var(--accent-purple))] rounded-xl flex items-center justify-center">
                    <Globe className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Global Reach</h3>
                    <p className="text-muted-foreground">Serving customers in 100+ countries</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-[hsl(var(--accent-cyan))] rounded-xl flex items-center justify-center">
                    <Users className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Trusted by Millions</h3>
                    <p className="text-muted-foreground">Over 2 million active traders worldwide</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Advanced Trading Interface */}
              <div className="rounded-xl shadow-lg w-full h-48 bg-gradient-to-br from-slate-900 to-slate-800 p-6 glass overflow-hidden relative">
                <svg className="w-full h-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6">
                        <animate attributeName="stop-color" values="#8B5CF6;#06B6D4;#EC4899;#8B5CF6" dur="4s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="50%" stopColor="#06B6D4">
                        <animate attributeName="stop-color" values="#06B6D4;#EC4899;#8B5CF6;#06B6D4" dur="4s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="100%" stopColor="#EC4899">
                        <animate attributeName="stop-color" values="#EC4899;#8B5CF6;#06B6D4;#EC4899" dur="4s" repeatCount="indefinite"/>
                      </stop>
                    </linearGradient>
                    <linearGradient id="priceMove" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0"/>
                      <stop offset="50%" stopColor="#10B981" stopOpacity="1"/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
                      <animateTransform attributeName="gradientTransform" type="translate" values="-100 0;200 0;-100 0" dur="3s" repeatCount="indefinite"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Animated Trading Chart */}
                  <polyline
                    fill="none"
                    stroke="url(#chartGradient)"
                    strokeWidth="3"
                    points="10,80 30,60 50,70 70,40 90,45 110,25 130,35 150,20 170,30 190,15"
                    strokeDasharray="5,5"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;10;0" dur="2s" repeatCount="indefinite"/>
                    <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="3s" repeatCount="indefinite"/>
                  </polyline>
                  
                  {/* Moving price line */}
                  <line x1="0" y1="30" x2="200" y2="30" stroke="url(#priceMove)" strokeWidth="2"/>
                  
                  {/* Grid Lines with subtle animation */}
                  {Array.from({length: 5}).map((_, i) => (
                    <line key={i} x1="10" y1={20 + i * 20} x2="190" y2={20 + i * 20} stroke="#334155" strokeWidth="0.5" opacity="0.5">
                      <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite"/>
                    </line>
                  ))}
                  
                  {/* Animated Candlesticks */}
                  <rect x="25" y="50" width="8" height="20" fill="#10B981">
                    <animate attributeName="height" values="20;25;20" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="50;47.5;50" dur="2.5s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="65" y="35" width="8" height="15" fill="#EF4444">
                    <animate attributeName="height" values="15;18;15" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="35;33.5;35" dur="3s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="105" y="20" width="8" height="25" fill="#10B981">
                    <animate attributeName="height" values="25;30;25" dur="2.8s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="20;17.5;20" dur="2.8s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="145" y="15" width="8" height="20" fill="#10B981">
                    <animate attributeName="height" values="20;24;20" dur="3.2s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="15;13;15" dur="3.2s" repeatCount="indefinite"/>
                  </rect>
                  
                  {/* Dynamic Volume Bars */}
                  {Array.from({length: 8}).map((_, i) => (
                    <rect key={i} x={20 + i * 20} y={100 - (5 + i * 2)} width="6" height={5 + i * 2} fill="#8B5CF6" opacity="0.6">
                      <animate attributeName="height" values={`${5 + i * 2};${8 + i * 2};${5 + i * 2}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
                      <animate attributeName="y" values={`${100 - (5 + i * 2)};${100 - (8 + i * 2)};${100 - (5 + i * 2)}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite"/>
                    </rect>
                  ))}
                  
                  {/* Moving price indicators */}
                  <circle cx="190" cy="15" r="3" fill="#10B981">
                    <animate attributeName="r" values="2;4;2" dur="1.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                </svg>
                <div className="absolute bottom-2 left-2 text-xs text-purple-400 font-mono animate-pulse">Live Trading Charts</div>
              </div>

              {/* Real-time Data Analytics */}
              <div className="rounded-xl shadow-lg w-full h-48 bg-gradient-to-br from-slate-900 to-slate-800 p-6 glass overflow-hidden relative">
                <svg className="w-full h-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06B6D4">
                        <animate attributeName="stop-color" values="#06B6D4;#8B5CF6;#EC4899;#06B6D4" dur="3s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="100%" stopColor="#8B5CF6">
                        <animate attributeName="stop-color" values="#8B5CF6;#EC4899;#06B6D4;#8B5CF6" dur="3s" repeatCount="indefinite"/>
                      </stop>
                    </linearGradient>
                    <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0"/>
                      <stop offset="50%" stopColor="#06B6D4" stopOpacity="1"/>
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/>
                      <animateTransform attributeName="gradientTransform" type="translate" values="-50 0;200 0;-50 0" dur="2s" repeatCount="indefinite"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Animated Circular Progress Indicators */}
                  <circle cx="50" cy="40" r="20" fill="none" stroke="#334155" strokeWidth="3" opacity="0.3" />
                  <circle cx="50" cy="40" r="20" fill="none" stroke="url(#dataGradient)" strokeWidth="3" 
                          strokeDasharray="75 25" transform="rotate(-90 50 40)">
                    <animateTransform attributeName="transform" type="rotate" values="-90 50 40;270 50 40;-90 50 40" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dasharray" values="75 25;100 0;50 50;75 25" dur="4s" repeatCount="indefinite"/>
                  </circle>
                  
                  <circle cx="150" cy="40" r="15" fill="none" stroke="#334155" strokeWidth="2" opacity="0.3" />
                  <circle cx="150" cy="40" r="15" fill="none" stroke="#EC4899" strokeWidth="2" 
                          strokeDasharray="60 40" transform="rotate(-90 150 40)">
                    <animateTransform attributeName="transform" type="rotate" values="-90 150 40;-450 150 40;-90 150 40" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dasharray" values="60 40;80 20;40 60;60 40" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Animated Data Bars */}
                  <rect x="20" y="80" width="30" height="6" fill="#06B6D4" rx="3">
                    <animate attributeName="width" values="30;45;35;30" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.8;0.6" dur="2.5s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="60" y="85" width="45" height="6" fill="#8B5CF6" rx="3">
                    <animate attributeName="width" values="45;60;50;45" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;1;0.9;0.7" dur="3s" repeatCount="indefinite"/>
                  </rect>
                  <rect x="115" y="82" width="25" height="6" fill="#EC4899" rx="3">
                    <animate attributeName="width" values="25;35;30;25" dur="2.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.8;0.6" dur="2.8s" repeatCount="indefinite"/>
                  </rect>
                  
                  {/* Flowing data stream */}
                  <rect x="0" y="95" width="200" height="2" fill="url(#dataFlow)" opacity="0.7"/>
                  
                  {/* Animated Network Nodes */}
                  <circle cx="30" cy="100" r="3" fill="#10B981">
                    <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="70" cy="105" r="2" fill="#F59E0B">
                    <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="120" cy="100" r="4" fill="#06B6D4">
                    <animate attributeName="r" values="4;6;4" dur="1.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="170" cy="105" r="2" fill="#8B5CF6">
                    <animate attributeName="r" values="2;4;2" dur="2.2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Animated connection lines */}
                  <line x1="30" y1="100" x2="70" y2="105" stroke="#10B981" strokeWidth="1">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="1;2;1" dur="2s" repeatCount="indefinite"/>
                  </line>
                  <line x1="70" y1="105" x2="120" y2="100" stroke="#F59E0B" strokeWidth="1">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="1;2;1" dur="2.5s" repeatCount="indefinite"/>
                  </line>
                  <line x1="120" y1="100" x2="170" y2="105" stroke="#06B6D4" strokeWidth="1">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.8s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="1;2;1" dur="1.8s" repeatCount="indefinite"/>
                  </line>
                  
                  {/* Data packets moving along connections */}
                  <circle r="2" fill="#10B981">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M30,100 L70,105"/>
                    <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="2" fill="#F59E0B">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M70,105 L120,100"/>
                    <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle r="2" fill="#06B6D4">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M120,100 L170,105"/>
                    <animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite"/>
                  </circle>
                </svg>
                <div className="absolute bottom-2 left-2 text-xs text-cyan-400 font-mono animate-pulse">Real-time Analytics</div>
              </div>

              {/* Security & Compliance */}
              <div className="rounded-xl shadow-lg w-full h-48 bg-gradient-to-br from-slate-900 to-slate-800 p-6 glass overflow-hidden relative">
                <svg className="w-full h-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981">
                        <animate attributeName="stop-color" values="#10B981;#059669;#34D399;#10B981" dur="3s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="100%" stopColor="#059669">
                        <animate attributeName="stop-color" values="#059669;#34D399;#10B981;#059669" dur="3s" repeatCount="indefinite"/>
                      </stop>
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Animated Shield */}
                  <path d="M100 20 L80 30 L80 50 Q80 70 100 85 Q120 70 120 50 L120 30 Z" 
                        fill="url(#securityGradient)" filter="url(#glow)">
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
                    <animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="3s" repeatCount="indefinite"/>
                  </path>
                  
                  {/* Animated Lock Icon */}
                  <rect x="95" y="45" width="10" height="12" fill="none" stroke="white" strokeWidth="1.5" rx="2">
                    <animate attributeName="stroke-width" values="1.5;2;1.5" dur="2s" repeatCount="indefinite"/>
                  </rect>
                  <circle cx="100" cy="48" r="3" fill="none" stroke="white" strokeWidth="1.5">
                    <animate attributeName="stroke-width" values="1.5;2;1.5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Dynamic Security Rings */}
                  <circle cx="100" cy="60" r="35" fill="none" stroke="#10B981" strokeWidth="1" 
                          strokeDasharray="10 5" opacity="0.6">
                    <animateTransform attributeName="transform" type="rotate" values="0 100 60;360 100 60" dur="8s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="1;2;1" dur="4s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="100" cy="60" r="45" fill="none" stroke="#059669" strokeWidth="1" 
                          strokeDasharray="15 10" opacity="0.4">
                    <animateTransform attributeName="transform" type="rotate" values="360 100 60;0 100 60" dur="12s" repeatCount="indefinite"/>
                    <animate attributeName="stroke-width" values="1;1.5;1" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="100" cy="60" r="55" fill="none" stroke="#34D399" strokeWidth="0.5" 
                          strokeDasharray="20 15" opacity="0.2">
                    <animateTransform attributeName="transform" type="rotate" values="0 100 60;360 100 60" dur="15s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Animated Security Nodes */}
                  <circle cx="60" cy="35" r="2" fill="#10B981">
                    <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="140" cy="35" r="2" fill="#10B981">
                    <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="60" cy="85" r="2" fill="#10B981">
                    <animate attributeName="r" values="2;4;2" dur="2.2s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="140" cy="85" r="2" fill="#10B981">
                    <animate attributeName="r" values="2;4;2" dur="2.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Security scan lines */}
                  <line x1="0" y1="30" x2="200" y2="30" stroke="#10B981" strokeWidth="1" opacity="0.3">
                    <animate attributeName="y1" values="30;90;30" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="y2" values="30;90;30" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.1;0.6;0.1" dur="3s" repeatCount="indefinite"/>
                  </line>
                  
                  {/* Encryption waves */}
                  <circle cx="100" cy="60" r="25" fill="none" stroke="#34D399" strokeWidth="1" opacity="0.2">
                    <animate attributeName="r" values="20;30;20" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur="4s" repeatCount="indefinite"/>
                  </circle>
                </svg>
                <div className="absolute bottom-2 left-2 text-xs text-green-400 font-mono animate-pulse">Quantum Security</div>
              </div>

              {/* Global Network */}
              <div className="rounded-xl shadow-lg w-full h-48 bg-gradient-to-br from-slate-900 to-slate-800 p-6 glass overflow-hidden relative">
                <svg className="w-full h-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  
                  {/* Globe outline */}
                  <circle cx="100" cy="60" r="35" fill="none" stroke="url(#globeGradient)" strokeWidth="2" />
                  
                  {/* Latitude lines */}
                  <ellipse cx="100" cy="60" rx="35" ry="15" fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" />
                  <ellipse cx="100" cy="60" rx="35" ry="8" fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" />
                  
                  {/* Longitude lines */}
                  <ellipse cx="100" cy="60" rx="15" ry="35" fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" />
                  <ellipse cx="100" cy="60" rx="8" ry="35" fill="none" stroke="#334155" strokeWidth="1" opacity="0.5" />
                  
                  {/* Connection points */}
                  <circle cx="85" cy="45" r="2" fill="#06B6D4" className="animate-pulse" />
                  <circle cx="115" cy="45" r="2" fill="#8B5CF6" className="animate-pulse" />
                  <circle cx="85" cy="75" r="2" fill="#EC4899" className="animate-pulse" />
                  <circle cx="115" cy="75" r="2" fill="#10B981" className="animate-pulse" />
                  <circle cx="70" cy="60" r="2" fill="#F59E0B" className="animate-pulse" />
                  <circle cx="130" cy="60" r="2" fill="#EF4444" className="animate-pulse" />
                  
                  {/* Connection lines */}
                  <line x1="85" y1="45" x2="115" y2="75" stroke="url(#globeGradient)" strokeWidth="1" opacity="0.6" className="animate-pulse" />
                  <line x1="115" y1="45" x2="85" y2="75" stroke="url(#globeGradient)" strokeWidth="1" opacity="0.6" className="animate-pulse" />
                  <line x1="70" y1="60" x2="130" y2="60" stroke="url(#globeGradient)" strokeWidth="1" opacity="0.6" className="animate-pulse" />
                  
                  {/* Orbiting satellites */}
                  <circle cx="50" cy="30" r="1.5" fill="#06B6D4" className="animate-ping" />
                  <circle cx="150" cy="90" r="1.5" fill="#8B5CF6" className="animate-ping" />
                  <circle cx="40" cy="90" r="1.5" fill="#EC4899" className="animate-ping" />
                </svg>
                <div className="absolute bottom-2 left-2 text-xs text-pink-400 font-mono">Global Network</div>
              </div>
            </div>
          </div>
          
          {/* Compliance Section */}
          <Card className="mt-16 glass">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-2 text-center">Regulatory Compliance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--accent-purple))] to-[hsl(var(--accent-pink))] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Scale3d className="text-white text-xl" />
                  </div>
                  <h4 className="font-semibold mb-2">Golden Michael s.r.o.</h4>
                  <p className="text-muted-foreground text-sm">Registered in Czech Republic</p>
                  <p className="text-muted-foreground text-sm">Company ID: 19536143</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--accent-cyan))] to-[hsl(var(--accent-purple))] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-white text-xl" />
                  </div>
                  <h4 className="font-semibold mb-2">FAÚ Supervised</h4>
                  <p className="text-muted-foreground text-sm">Financial Administration Office</p>
                  <p className="text-muted-foreground text-sm">VASP License #CZ-2024-001</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-[hsl(var(--accent-cyan))] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ShieldX className="text-white text-xl" />
                  </div>
                  <h4 className="font-semibold mb-2">AML/KYC Compliant</h4>
                  <p className="text-muted-foreground text-sm">Full customer verification</p>
                  <p className="text-muted-foreground text-sm">Transaction monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Floating components removed to clean up homepage */}
      
      </div>
    </div>
  );
}
