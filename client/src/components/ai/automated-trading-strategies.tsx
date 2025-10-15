import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Bot,
  Play,
  Pause,
  Square,
  Settings,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Brain,
  Star,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useToast } from "@/hooks/use-toast";

interface AutomatedTradingProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

interface TradingStrategy {
  id: string;
  name: string;
  type: 'dca' | 'grid' | 'arbitrage' | 'momentum' | 'mean_reversion' | 'copy_trading';
  status: 'active' | 'paused' | 'stopped';
  description: string;
  performance: {
    totalReturn: number;
    winRate: number;
    trades: number;
    profit: number;
  };
  settings: {
    riskLevel: 'low' | 'medium' | 'high';
    maxDrawdown: number;
    targetReturn: number;
  };
  assets: string[];
  created: Date;
  lastTrade?: Date;
}

interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
  triggered: number;
  lastTriggered?: Date;
}

interface PerformanceMetrics {
  totalProfit: number;
  totalTrades: number;
  winRate: number;
  avgReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export default function AutomatedTradingStrategies({ userTier = 'basic' }: AutomatedTradingProps) {
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [isCreatingStrategy, setIsCreatingStrategy] = useState(false);
  const [newStrategyType, setNewStrategyType] = useState<string>('dca');
  
  const { toast } = useToast();

  const strategyTypes = {
    dca: {
      name: 'Dollar Cost Averaging',
      description: 'Automatically invest fixed amounts at regular intervals',
      riskLevel: 'low',
      minTier: 'basic'
    },
    grid: {
      name: 'Grid Trading',
      description: 'Place buy/sell orders at regular price intervals',
      riskLevel: 'medium',
      minTier: 'pro'
    },
    arbitrage: {
      name: 'Arbitrage Bot',
      description: 'Exploit price differences across exchanges',
      riskLevel: 'low',
      minTier: 'premium'
    },
    momentum: {
      name: 'Momentum Strategy',
      description: 'Follow trending assets with automated entries',
      riskLevel: 'high',
      minTier: 'pro'
    },
    mean_reversion: {
      name: 'Mean Reversion',
      description: 'Buy oversold and sell overbought conditions',
      riskLevel: 'medium',
      minTier: 'premium'
    },
    copy_trading: {
      name: 'Copy Trading',
      description: 'Automatically copy successful traders',
      riskLevel: 'medium',
      minTier: 'pro'
    }
  };

  const tierLimits = {
    basic: { maxStrategies: 1, maxRules: 2 },
    pro: { maxStrategies: 3, maxRules: 5 },
    premium: { maxStrategies: 10, maxRules: 15 },
    elite: { maxStrategies: 50, maxRules: 100 }
  };

  // Initialize strategies and rules
  useEffect(() => {
    const initializeData = () => {
      const mockStrategies: TradingStrategy[] = [
        {
          id: '1',
          name: 'BTC DCA Strategy',
          type: 'dca',
          status: 'active',
          description: 'Daily $100 investment in Bitcoin',
          performance: {
            totalReturn: 15.67,
            winRate: 72,
            trades: 156,
            profit: 1567.89
          },
          settings: {
            riskLevel: 'low',
            maxDrawdown: 5,
            targetReturn: 15
          },
          assets: ['BTC'],
          created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lastTrade: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          name: 'ETH Grid Bot',
          type: 'grid',
          status: 'active',
          description: 'Grid trading on ETH/USDT pair',
          performance: {
            totalReturn: 8.34,
            winRate: 65,
            trades: 89,
            profit: 834.22
          },
          settings: {
            riskLevel: 'medium',
            maxDrawdown: 10,
            targetReturn: 20
          },
          assets: ['ETH'],
          created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          lastTrade: new Date(Date.now() - 30 * 60 * 1000)
        }
      ];

      const mockRules: AutomationRule[] = [
        {
          id: '1',
          name: 'Stop Loss Protection',
          condition: 'Portfolio loss > 5%',
          action: 'Pause all strategies',
          enabled: true,
          triggered: 0
        },
        {
          id: '2',
          name: 'Profit Taking',
          condition: 'Strategy profit > 25%',
          action: 'Take 50% profit',
          enabled: true,
          triggered: 3,
          lastTriggered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];

      const mockPerformance: PerformanceMetrics = {
        totalProfit: 2402.11,
        totalTrades: 245,
        winRate: 68.5,
        avgReturn: 12.1,
        maxDrawdown: 8.7,
        sharpeRatio: 1.85
      };

      setStrategies(mockStrategies);
      setRules(mockRules);
      setPerformance(mockPerformance);
    };

    initializeData();
  }, []);

  const toggleStrategy = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { 
            ...strategy, 
            status: strategy.status === 'active' ? 'paused' : 'active' 
          }
        : strategy
    ));
    
    toast({
      title: "Strategy Updated",
      description: "Strategy status has been changed successfully.",
      variant: "default"
    });
  };

  const deleteStrategy = (strategyId: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== strategyId));
    toast({
      title: "Strategy Deleted",
      description: "Strategy has been removed successfully.",
      variant: "default"
    });
  };

  const createStrategy = () => {
    const newStrategy: TradingStrategy = {
      id: Date.now().toString(),
      name: `New ${strategyTypes[newStrategyType as keyof typeof strategyTypes].name}`,
      type: newStrategyType as any,
      status: 'paused',
      description: strategyTypes[newStrategyType as keyof typeof strategyTypes].description,
      performance: {
        totalReturn: 0,
        winRate: 0,
        trades: 0,
        profit: 0
      },
      settings: {
        riskLevel: 'medium',
        maxDrawdown: 10,
        targetReturn: 15
      },
      assets: ['BTC'],
      created: new Date()
    };

    setStrategies(prev => [...prev, newStrategy]);
    setIsCreatingStrategy(false);
    
    toast({
      title: "Strategy Created",
      description: "New strategy has been created successfully.",
      variant: "default"
    });
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getStrategyIcon = (type: string) => {
    switch (type) {
      case 'dca': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'grid': return <BarChart3 className="w-5 h-5 text-green-400" />;
      case 'arbitrage': return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'momentum': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'mean_reversion': return <Target className="w-5 h-5 text-orange-400" />;
      case 'copy_trading': return <Star className="w-5 h-5 text-pink-400" />;
      default: return <Bot className="w-5 h-5 text-gray-400" />;
    }
  };

  const canCreateStrategy = strategies.length < tierLimits[userTier].maxStrategies;
  const canCreateRule = rules.length < tierLimits[userTier].maxRules;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Automated Trading Strategies
          </h1>
          <p className="text-gray-300">
            AI-powered automated trading bots and strategies
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <Badge variant="secondary">
              {userTier?.toUpperCase()} Tier
            </Badge>
            <Badge variant="outline">
              {strategies.length}/{tierLimits[userTier].maxStrategies} Strategies
            </Badge>
            <Badge variant="outline">
              {rules.length}/{tierLimits[userTier].maxRules} Rules
            </Badge>
          </div>
        </motion.div>

        <Tabs defaultValue="strategies" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Strategies Tab */}
          <TabsContent value="strategies" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strategy List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Active Strategies</h2>
                  <Button 
                    onClick={() => setIsCreatingStrategy(true)}
                    disabled={!canCreateStrategy}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Create Strategy
                  </Button>
                </div>

                <AnimatePresence>
                  {strategies.map((strategy) => (
                    <motion.div
                      key={strategy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      layout
                    >
                      <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getStrategyIcon(strategy.type)}
                              <div>
                                <h3 className="font-bold">{strategy.name}</h3>
                                <p className="text-sm text-gray-400">{strategy.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={
                                strategy.status === 'active' ? 'default' :
                                strategy.status === 'paused' ? 'secondary' : 'destructive'
                              }>
                                {strategy.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStrategy(strategy.id)}
                              >
                                {strategy.status === 'active' ? 
                                  <Pause className="w-4 h-4" /> : 
                                  <Play className="w-4 h-4" />
                                }
                              </Button>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-400">
                                +{strategy.performance.totalReturn.toFixed(2)}%
                              </div>
                              <div className="text-xs text-gray-400">Total Return</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold">
                                {strategy.performance.winRate}%
                              </div>
                              <div className="text-xs text-gray-400">Win Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold">
                                {strategy.performance.trades}
                              </div>
                              <div className="text-xs text-gray-400">Trades</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-400">
                                ${strategy.performance.profit.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-400">Profit</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Shield className={`w-4 h-4 ${
                                strategy.settings.riskLevel === 'low' ? 'text-green-400' :
                                strategy.settings.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                              }`} />
                              <span>Risk: {strategy.settings.riskLevel}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              {strategy.lastTrade && (
                                <span className="text-gray-400">
                                  Last trade: {strategy.lastTrade.toLocaleTimeString()}
                                </span>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteStrategy(strategy.id)}
                              >
                                <XCircle className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {strategies.length === 0 && (
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                    <CardContent className="text-center py-12">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">No Strategies Yet</h3>
                      <p className="text-gray-400 mb-4">Create your first automated trading strategy</p>
                      <Button 
                        onClick={() => setIsCreatingStrategy(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Strategy Creation Panel */}
              <div>
                {isCreatingStrategy && (
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                    <CardHeader>
                      <CardTitle>Create New Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Strategy Type</label>
                        <Select value={newStrategyType} onValueChange={setNewStrategyType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(strategyTypes).map(([key, strategy]) => (
                              <SelectItem 
                                key={key} 
                                value={key}
                                disabled={userTier === 'basic' && strategy.minTier !== 'basic'}
                              >
                                <div className="flex items-center space-x-2">
                                  {getStrategyIcon(key)}
                                  <div>
                                    <div>{strategy.name}</div>
                                    {userTier === 'basic' && strategy.minTier !== 'basic' && (
                                      <div className="text-xs text-gray-400">
                                        Requires {strategy.minTier}+ tier
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="text-sm text-gray-400">
                        {strategyTypes[newStrategyType as keyof typeof strategyTypes]?.description}
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          onClick={createStrategy}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Create
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsCreatingStrategy(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Strategy Types Info */}
                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <span>Available Strategies</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(strategyTypes).map(([key, strategy]) => (
                        <div 
                          key={key} 
                          className={`p-3 rounded-lg border ${
                            userTier === 'basic' && strategy.minTier !== 'basic' 
                              ? 'border-gray-600 opacity-50' 
                              : 'border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              {getStrategyIcon(key)}
                              <span className="font-medium text-sm">{strategy.name}</span>
                            </div>
                            {userTier === 'basic' && strategy.minTier !== 'basic' && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{strategy.description}</div>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className={`text-xs ${
                              strategy.riskLevel === 'low' ? 'border-green-400 text-green-400' :
                              strategy.riskLevel === 'medium' ? 'border-yellow-400 text-yellow-400' : 
                              'border-red-400 text-red-400'
                            }`}>
                              {strategy.riskLevel} risk
                            </Badge>
                            {userTier === 'basic' && strategy.minTier !== 'basic' && (
                              <span className="text-xs text-gray-500">
                                {strategy.minTier}+ required
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6">
            {performance && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span>Total Profit</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">
                      ${performance.totalProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      From {performance.totalTrades} trades
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span>Win Rate</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {performance.winRate}%
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Average success rate
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <span>Sharpe Ratio</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {performance.sharpeRatio}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Risk-adjusted return
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-yellow-400" />
                      <span>Avg Return</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {performance.avgReturn}%
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Per strategy
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span>Max Drawdown</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-400">
                      {performance.maxDrawdown}%
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Worst loss period
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-orange-400" />
                      <span>Total Trades</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {performance.totalTrades}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Executed orders
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Automation Rules</h2>
                <Button 
                  disabled={!canCreateRule}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rules.map((rule) => (
                  <Card key={rule.id} className="bg-black/20 backdrop-blur-lg border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{rule.name}</span>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-400">Condition</div>
                          <div className="font-medium">{rule.condition}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Action</div>
                          <div className="font-medium">{rule.action}</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Triggered: {rule.triggered} times</span>
                          {rule.lastTriggered && (
                            <span className="text-gray-400">
                              Last: {rule.lastTriggered.toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Global Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Enable All Strategies</div>
                      <div className="text-sm text-gray-400">Master control for all automated strategies</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Risk Management</div>
                      <div className="text-sm text-gray-400">Automatic risk controls and stop losses</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-gray-400">Get alerts for strategy events</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <div className="font-medium mb-2">Maximum Portfolio Risk</div>
                    <Slider defaultValue={[15]} max={50} step={5} className="w-full" />
                    <div className="text-sm text-gray-400 mt-1">
                      Maximum 15% of portfolio at risk
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2">Strategy Allocation</div>
                    <Slider defaultValue={[25]} max={100} step={5} className="w-full" />
                    <div className="text-sm text-gray-400 mt-1">
                      25% of portfolio for automated strategies
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}