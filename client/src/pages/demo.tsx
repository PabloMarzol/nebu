import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Users, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap, 
  Pause,
  RotateCcw,
  ArrowRight,
  DollarSign,
  BarChart3,
  Bot,
  MessageSquare,
  Smartphone,
  Globe,
  Eye,
  CheckCircle
} from 'lucide-react';

const Demo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [demoData, setDemoData] = useState({
    btcPrice: 64500,
    portfolio: 125000,
    profit: 12.5,
    orders: 3
  });

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Real-Time Trading",
      description: "Experience live market data and instant order execution"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security with multi-factor authentication"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Advanced trading recommendations and market analysis"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Social Trading",
      description: "Copy successful traders and join our community"
    }
  ];

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

  const demoStats = [
    { label: "Active Users", value: "50K+", icon: <Users className="h-4 w-4" /> },
    { label: "Success Rate", value: "94%", icon: <Star className="h-4 w-4" /> },
    { label: "Trading Volume", value: "$2.5B", icon: <TrendingUp className="h-4 w-4" /> },
    { label: "Response Time", value: "<50ms", icon: <Zap className="h-4 w-4" /> }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Watch NebulaX in Action
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how our institutional-grade cryptocurrency exchange platform delivers 
            professional trading tools with cutting-edge technology
          </p>
        </div>

        {/* Interactive Demo Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-8">
              <div className="aspect-video bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-lg relative overflow-hidden border border-purple-500/30">
                {!isPlaying ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="h-32 w-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-purple-500/50">
                        <Play className="h-16 w-16 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4">Interactive Demo</h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Experience NebulaX's professional trading platform with live simulations
                      </p>
                      <Button
                        onClick={startDemo}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full shadow-lg"
                      >
                        <Play className="h-6 w-6 mr-2" />
                        Start Interactive Demo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900/95 to-purple-900/95 p-6">
                    {/* Demo Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {demoSteps[currentStep]?.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {demoSteps[currentStep]?.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setIsPlaying(!isPlaying)}
                          variant="outline"
                          size="sm"
                          className="border-purple-500 text-purple-400"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          onClick={resetDemo}
                          variant="outline"
                          size="sm"
                          className="border-gray-500 text-gray-400"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">
                          Step {currentStep + 1} of {demoSteps.length}
                        </span>
                        <span className="text-sm text-gray-400">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2 bg-gray-700" />
                    </div>

                    {/* Demo Content Based on Current Step */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                      {/* Main Display Area */}
                      <div className="lg:col-span-2 bg-black/30 rounded-lg p-4 border border-gray-700">
                        {currentStep === 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-white">Trading Dashboard</h4>
                              <Badge className="bg-green-600 text-white">Live</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-purple-900/50 p-3 rounded">
                                <div className="text-2xl font-bold text-white">
                                  ${demoData.btcPrice.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-400">BTC/USDT</div>
                              </div>
                              <div className="bg-blue-900/50 p-3 rounded">
                                <div className="text-2xl font-bold text-green-400">
                                  +{demoData.profit.toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-400">24h Change</div>
                              </div>
                            </div>
                            <div className="h-24 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded flex items-center justify-center">
                              <BarChart3 className="h-8 w-8 text-purple-400" />
                              <span className="ml-2 text-gray-400">Live Trading Chart</span>
                            </div>
                          </div>
                        )}

                        {currentStep === 1 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-white">Order Execution</h4>
                              <Badge className="bg-green-600 text-white">Processing</Badge>
                            </div>
                            <div className="space-y-3">
                              <div className="bg-green-900/30 border border-green-500/50 p-3 rounded">
                                <div className="flex items-center justify-between">
                                  <span className="text-green-400">Buy Order Filled</span>
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                </div>
                                <div className="text-sm text-gray-400">0.1 BTC @ $64,500</div>
                              </div>
                              <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded">
                                <div className="flex items-center justify-between">
                                  <span className="text-blue-400">Limit Order Pending</span>
                                  <Eye className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="text-sm text-gray-400">0.5 ETH @ $3,200</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentStep === 2 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-white">AI Trading Assistant</h4>
                              <Badge className="bg-purple-600 text-white">Active</Badge>
                            </div>
                            <div className="bg-purple-900/30 border border-purple-500/50 p-4 rounded">
                              <div className="flex items-start gap-3">
                                <Bot className="h-6 w-6 text-purple-400 mt-1" />
                                <div>
                                  <div className="text-white font-medium mb-1">Market Analysis</div>
                                  <div className="text-sm text-gray-300">
                                    BTC showing strong bullish momentum. Consider taking profits at $67K resistance level.
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge className="bg-green-600 text-white text-xs">87% Confidence</Badge>
                                    <Badge className="bg-blue-600 text-white text-xs">Buy Signal</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentStep === 3 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-white">Portfolio Analytics</h4>
                              <Badge className="bg-blue-600 text-white">Updated</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-blue-900/50 p-3 rounded text-center">
                                <div className="text-xl font-bold text-white">
                                  ${demoData.portfolio.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400">Total Value</div>
                              </div>
                              <div className="bg-green-900/50 p-3 rounded text-center">
                                <div className="text-xl font-bold text-green-400">
                                  +{demoData.profit.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-400">P&L</div>
                              </div>
                              <div className="bg-purple-900/50 p-3 rounded text-center">
                                <div className="text-xl font-bold text-purple-400">
                                  {demoData.orders}
                                </div>
                                <div className="text-xs text-gray-400">Active Orders</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentStep === 4 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold text-white">Mobile Trading</h4>
                              <Badge className="bg-green-600 text-white">Available</Badge>
                            </div>
                            <div className="flex items-center justify-center h-32">
                              <div className="text-center">
                                <Smartphone className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                                <div className="text-white font-medium">iOS & Android Apps</div>
                                <div className="text-sm text-gray-400">Trade anywhere, anytime</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Features Sidebar */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-bold text-white">Features Showcase</h4>
                        {demoSteps[currentStep]?.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-black/20 rounded border border-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                        
                        <div className="mt-6 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded border border-purple-500/30">
                          <div className="text-center">
                            <Globe className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                            <div className="text-white font-medium mb-1">Global Platform</div>
                            <div className="text-xs text-gray-400">Available in 150+ countries</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {demoStats.map((stat, index) => (
            <Card key={index} className="bg-black/20 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2 text-purple-400">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <div className="mr-3 text-purple-400">{feature.icon}</div>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Live Trading Demo</h3>
              <p className="text-gray-300 text-sm">
                Experience real-time order execution and market data feeds
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Bot className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">AI Assistant Demo</h3>
              <p className="text-gray-300 text-sm">
                See how our AI provides intelligent trading recommendations
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Smartphone className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Mobile App Demo</h3>
              <p className="text-gray-300 text-sm">
                Explore our professional mobile trading applications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Ready to Start Trading?</CardTitle>
              <CardDescription className="text-gray-300">
                Join thousands of traders using NebulaX for professional cryptocurrency trading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
                  onClick={() => window.location.href = '/auth/register'}
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8"
                  onClick={() => window.location.href = '/contact'}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
              <div className="flex justify-center space-x-4">
                <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                  No Credit Card Required
                </Badge>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                  Instant Access
                </Badge>
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">
                  Professional Grade
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Demo;