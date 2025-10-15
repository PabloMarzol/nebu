import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Brain,
  PieChart,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Activity,
  Star,
  Crown,
  Settings,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calculator,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { useToast } from "@/hooks/use-toast";

interface IntelligentPortfolioProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

interface PortfolioAsset {
  symbol: string;
  name: string;
  allocation: number;
  targetAllocation: number;
  value: number;
  change24h: number;
  risk: 'low' | 'medium' | 'high';
  correlation: number;
}

interface RebalanceRecommendation {
  asset: string;
  action: 'buy' | 'sell';
  amount: number;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  impact: number;
}

interface RiskMetrics {
  overall: number;
  volatility: number;
  sharpe: number;
  maxDrawdown: number;
  beta: number;
  diversification: number;
}

interface AIRecommendation {
  id: string;
  type: 'rebalance' | 'diversify' | 'reduce_risk' | 'take_profit' | 'tax_optimize';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
  actions: Array<{
    asset: string;
    action: string;
    amount: number;
  }>;
}

export default function IntelligentPortfolioManagement({ userTier = 'basic' }: IntelligentPortfolioProps) {
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [rebalanceRecs, setRebalanceRecs] = useState<RebalanceRecommendation[]>([]);
  const [autoRebalance, setAutoRebalance] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [targetReturn, setTargetReturn] = useState([15]);
  const [rebalanceThreshold, setRebalanceThreshold] = useState([5]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPrivateData, setShowPrivateData] = useState(true);

  const { toast } = useToast();

  const portfolioColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#84CC16', '#6366F1'];

  // Initialize portfolio data
  useEffect(() => {
    const mockPortfolio: PortfolioAsset[] = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        allocation: 40,
        targetAllocation: 35,
        value: 20000,
        change24h: 2.5,
        risk: 'high',
        correlation: 0.3
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        allocation: 25,
        targetAllocation: 30,
        value: 12500,
        change24h: 4.2,
        risk: 'high',
        correlation: 0.7
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        allocation: 15,
        targetAllocation: 15,
        value: 7500,
        change24h: -1.8,
        risk: 'high',
        correlation: 0.6
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        allocation: 10,
        targetAllocation: 10,
        value: 5000,
        change24h: 1.2,
        risk: 'medium',
        correlation: 0.5
      },
      {
        symbol: 'DOT',
        name: 'Polkadot',
        allocation: 10,
        targetAllocation: 10,
        value: 5000,
        change24h: -0.5,
        risk: 'medium',
        correlation: 0.4
      }
    ];

    const mockRiskMetrics: RiskMetrics = {
      overall: 68,
      volatility: 45,
      sharpe: 1.8,
      maxDrawdown: 25,
      beta: 1.2,
      diversification: 72
    };

    const mockRecommendations: AIRecommendation[] = [
      {
        id: '1',
        type: 'rebalance',
        title: 'Portfolio Rebalancing Needed',
        description: 'BTC allocation is 5% above target. Consider rebalancing to reduce concentration risk.',
        confidence: 85,
        impact: 'medium',
        timeframe: '1-2 days',
        actions: [
          { asset: 'BTC', action: 'Sell', amount: 2500 },
          { asset: 'ETH', action: 'Buy', amount: 2500 }
        ]
      },
      {
        id: '2',
        type: 'diversify',
        title: 'Diversification Opportunity',
        description: 'Consider adding LINK or AAVE to reduce correlation and improve risk-adjusted returns.',
        confidence: 78,
        impact: 'medium',
        timeframe: '3-7 days',
        actions: [
          { asset: 'LINK', action: 'Buy', amount: 1250 },
          { asset: 'AAVE', action: 'Buy', amount: 1250 }
        ]
      },
      {
        id: '3',
        type: 'reduce_risk',
        title: 'Risk Reduction Suggestion',
        description: 'Portfolio risk is above target. Consider reducing high-correlation positions.',
        confidence: 92,
        impact: 'high',
        timeframe: 'Immediate',
        actions: [
          { asset: 'SOL', action: 'Reduce', amount: 1500 }
        ]
      }
    ];

    const mockRebalanceRecs: RebalanceRecommendation[] = [
      {
        asset: 'BTC',
        action: 'sell',
        amount: 2500,
        reason: 'Above target allocation',
        priority: 'medium',
        impact: 5
      },
      {
        asset: 'ETH',
        action: 'buy',
        amount: 2500,
        reason: 'Below target allocation',
        priority: 'medium',
        impact: 5
      }
    ];

    setPortfolio(mockPortfolio);
    setRiskMetrics(mockRiskMetrics);
    setRecommendations(mockRecommendations);
    setRebalanceRecs(mockRebalanceRecs);
  }, []);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast({
      title: "AI Analysis Complete",
      description: "Updated portfolio recommendations based on current market conditions.",
      variant: "default"
    });
    
    setIsAnalyzing(false);
  };

  const executeRecommendation = async (recommendation: AIRecommendation) => {
    toast({
      title: "Executing Recommendation",
      description: `${recommendation.title} - Processing ${recommendation.actions.length} actions`,
      variant: "default"
    });

    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Remove executed recommendation
    setRecommendations(prev => prev.filter(r => r.id !== recommendation.id));
    
    toast({
      title: "Recommendation Executed",
      description: "Portfolio adjustments have been made successfully.",
      variant: "default"
    });
  };

  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);

  const pieChartData = portfolio.map((asset, index) => ({
    name: asset.symbol,
    value: asset.allocation,
    actualValue: asset.value,
    color: portfolioColors[index % portfolioColors.length]
  }));

  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: 50000 + Math.random() * 10000 - 5000,
    benchmark: 50000 + Math.random() * 5000 - 2500
  }));

  const correlationData = portfolio.map((asset, index) => ({
    asset: asset.symbol,
    correlation: asset.correlation * 100,
    color: portfolioColors[index % portfolioColors.length]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Intelligent Portfolio Management
          </h1>
          <p className="text-gray-300">
            AI-powered portfolio optimization and risk management
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <Badge variant="secondary">
              {userTier?.toUpperCase()} Tier
            </Badge>
            <Badge variant="outline">
              ${totalValue.toLocaleString()} Total Value
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrivateData(!showPrivateData)}
            >
              {showPrivateData ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Portfolio Performance */}
              <div className="lg:col-span-2">
                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Portfolio Performance</span>
                      <Button
                        onClick={runAIAnalysis}
                        disabled={isAnalyzing}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isAnalyzing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                          </motion.div>
                        ) : (
                          <Brain className="w-4 h-4 mr-2" />
                        )}
                        {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="day" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#8B5CF6"
                            fill="url(#colorValue)"
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey="benchmark"
                            stroke="#06B6D4"
                            fill="url(#colorBenchmark)"
                            strokeWidth={1}
                            opacity={0.6}
                          />
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">+12.5%</div>
                        <div className="text-xs text-gray-400">30D Return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">1.8</div>
                        <div className="text-xs text-gray-400">Sharpe Ratio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">-8.5%</div>
                        <div className="text-xs text-gray-400">Max Drawdown</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">68%</div>
                        <div className="text-xs text-gray-400">Risk Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span>Portfolio Value</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {showPrivateData ? `$${totalValue.toLocaleString()}` : '••••••'}
                    </div>
                    <div className="text-sm text-green-400 mt-1">+8.2% (24h)</div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span>Allocation Health</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>On Target</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <div className="text-xs text-gray-400">
                        2 assets need rebalancing
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <span>Risk Level</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-400">Medium-High</div>
                      <Progress value={68} className="h-2 mt-2" />
                      <div className="text-xs text-gray-400 mt-1">
                        Above target risk level
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Allocation Tab */}
          <TabsContent value="allocation" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Current Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any, name: any, props: any) => [
                            `${value}% ($${props.payload.actualValue.toLocaleString()})`,
                            name
                          ]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {pieChartData.map((asset, index) => (
                      <div key={asset.name} className="flex items-center space-x-2 text-sm">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: asset.color }}
                        />
                        <span>{asset.name}: {asset.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Asset Details */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Asset Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {portfolio.map((asset) => (
                      <div key={asset.symbol} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{asset.symbol}</span>
                            <Badge variant={
                              asset.risk === 'low' ? 'default' :
                              asset.risk === 'medium' ? 'secondary' : 'destructive'
                            } className="text-xs">
                              {asset.risk} risk
                            </Badge>
                          </div>
                          <span className={`text-sm ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Current: {asset.allocation}%</span>
                          <span>Target: {asset.targetAllocation}%</span>
                        </div>
                        
                        <Progress 
                          value={(asset.allocation / asset.targetAllocation) * 100} 
                          className="h-2"
                        />
                        
                        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                          <span>{showPrivateData ? `$${asset.value.toLocaleString()}` : '••••••'}</span>
                          <span>Correlation: {(asset.correlation * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Risk Analysis Tab */}
          <TabsContent value="risk" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Metrics */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    <span>Risk Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {riskMetrics && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Overall Risk</span>
                          <span className="text-sm font-medium">{riskMetrics.overall}/100</span>
                        </div>
                        <Progress value={riskMetrics.overall} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Volatility</span>
                          <span className="text-sm font-medium">{riskMetrics.volatility}%</span>
                        </div>
                        <Progress value={riskMetrics.volatility} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Diversification</span>
                          <span className="text-sm font-medium">{riskMetrics.diversification}/100</span>
                        </div>
                        <Progress value={riskMetrics.diversification} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-bold">{riskMetrics.sharpe}</div>
                          <div className="text-xs text-gray-400">Sharpe Ratio</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-lg font-bold">{riskMetrics.beta}</div>
                          <div className="text-xs text-gray-400">Beta</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Correlation Matrix */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span>Asset Correlations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={correlationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="asset" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                        />
                        <Bar dataKey="correlation" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Lower correlation indicates better diversification
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">AI-Powered Recommendations</h2>
                <Badge variant="secondary">{recommendations.length} Active</Badge>
              </div>

              <AnimatePresence>
                {recommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                  >
                    <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              rec.type === 'rebalance' ? 'bg-blue-500/20' :
                              rec.type === 'diversify' ? 'bg-green-500/20' :
                              rec.type === 'reduce_risk' ? 'bg-red-500/20' :
                              rec.type === 'take_profit' ? 'bg-yellow-500/20' : 'bg-purple-500/20'
                            }`}>
                              {rec.type === 'rebalance' ? <Target className="w-5 h-5" /> :
                               rec.type === 'diversify' ? <PieChart className="w-5 h-5" /> :
                               rec.type === 'reduce_risk' ? <Shield className="w-5 h-5" /> :
                               rec.type === 'take_profit' ? <TrendingUp className="w-5 h-5" /> : 
                               <Sparkles className="w-5 h-5" />}
                            </div>
                            <div>
                              <h3 className="font-bold">{rec.title}</h3>
                              <p className="text-sm text-gray-400">{rec.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              rec.impact === 'high' ? 'destructive' :
                              rec.impact === 'medium' ? 'secondary' : 'outline'
                            }>
                              {rec.impact} impact
                            </Badge>
                            <Badge variant="outline">
                              {rec.confidence}% confidence
                            </Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-400">
                            Timeframe: {rec.timeframe}
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-2">Suggested Actions:</div>
                            <div className="space-y-1">
                              {rec.actions.map((action, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded text-sm">
                                  <span>{action.action} {action.asset}</span>
                                  <span className="font-medium">
                                    {showPrivateData ? `$${action.amount.toLocaleString()}` : '••••••'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <Button
                              onClick={() => executeRecommendation(rec)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              disabled={userTier === 'basic'}
                            >
                              {userTier === 'basic' ? 'Upgrade Required' : 'Execute'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setRecommendations(prev => prev.filter(r => r.id !== rec.id))}
                              className="flex-1"
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {recommendations.length === 0 && (
                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardContent className="text-center py-12">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">No Recommendations</h3>
                    <p className="text-gray-400 mb-4">Your portfolio is optimally balanced</p>
                    <Button onClick={runAIAnalysis} className="bg-purple-600 hover:bg-purple-700">
                      Run AI Analysis
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Portfolio Management Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-Rebalancing</div>
                      <div className="text-sm text-gray-400">Automatically rebalance when thresholds are exceeded</div>
                    </div>
                    <Switch
                      checked={autoRebalance}
                      onCheckedChange={setAutoRebalance}
                      disabled={userTier === 'basic'}
                    />
                  </div>

                  <div>
                    <div className="font-medium mb-2">Risk Tolerance: {riskTolerance[0]}%</div>
                    <Slider
                      value={riskTolerance}
                      onValueChange={setRiskTolerance}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-400 mt-1">
                      Higher values allow for more aggressive strategies
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Target Annual Return: {targetReturn[0]}%</div>
                    <Slider
                      value={targetReturn}
                      onValueChange={setTargetReturn}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="font-medium mb-2">Rebalance Threshold: {rebalanceThreshold[0]}%</div>
                    <Slider
                      value={rebalanceThreshold}
                      onValueChange={setRebalanceThreshold}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-400 mt-1">
                      Trigger rebalancing when allocation deviates by this amount
                    </div>
                  </div>

                  {userTier === 'basic' && (
                    <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span>Upgrade for Advanced Features</span>
                      </h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Auto-rebalancing</li>
                        <li>• AI recommendation execution</li>
                        <li>• Advanced risk analytics</li>
                        <li>• Tax optimization</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}