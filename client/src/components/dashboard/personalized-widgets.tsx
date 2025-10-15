import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Users, 
  Zap, 
  Target, 
  Star,
  PieChart,
  BarChart3,
  LineChart,
  Wallet,
  Trophy,
  Gift,
  Bell,
  Settings,
  Plus,
  GripVertical,
  Eye,
  EyeOff
} from "lucide-react";

interface Widget {
  id: string;
  title: string;
  type: 'portfolio' | 'trading' | 'analytics' | 'rewards' | 'news' | 'performance';
  size: 'small' | 'medium' | 'large';
  visible: boolean;
  data: any;
  icon: typeof TrendingUp;
  color: string;
}

interface PortfolioData {
  totalValue: number;
  change24h: number;
  changePercent: number;
  topAssets: Array<{ symbol: string; value: number; change: number }>;
}

interface TradingData {
  activeOrders: number;
  totalTrades: number;
  winRate: number;
  pnl24h: number;
}

interface RewardsData {
  totalPoints: number;
  level: number;
  nextLevelProgress: number;
  recentAchievements: Array<{ title: string; points: number; date: string }>;
}

const defaultWidgets: Widget[] = [
  {
    id: 'portfolio-overview',
    title: 'Portfolio Overview',
    type: 'portfolio',
    size: 'large',
    visible: true,
    icon: Wallet,
    color: 'from-blue-500 to-cyan-500',
    data: {
      totalValue: 125420.50,
      change24h: 8420.30,
      changePercent: 7.2,
      topAssets: [
        { symbol: 'BTC', value: 85000, change: 5.2 },
        { symbol: 'ETH', value: 25000, change: 8.1 },
        { symbol: 'SOL', value: 15420, change: -2.1 }
      ]
    }
  },
  {
    id: 'trading-stats',
    title: 'Trading Performance',
    type: 'trading',
    size: 'medium',
    visible: true,
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    data: {
      activeOrders: 12,
      totalTrades: 247,
      winRate: 73.5,
      pnl24h: 2850.40
    }
  },
  {
    id: 'rewards-system',
    title: 'Rewards & Achievements',
    type: 'rewards',
    size: 'medium',
    visible: true,
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
    data: {
      totalPoints: 15420,
      level: 7,
      nextLevelProgress: 68,
      recentAchievements: [
        { title: 'First Trade Master', points: 500, date: '2024-06-25' },
        { title: 'Portfolio Builder', points: 250, date: '2024-06-24' }
      ]
    }
  },
  {
    id: 'market-pulse',
    title: 'Market Pulse',
    type: 'analytics',
    size: 'small',
    visible: true,
    icon: Activity,
    color: 'from-purple-500 to-pink-500',
    data: {
      sentiment: 'Bullish',
      volatility: 'Medium',
      volume24h: '2.4B',
      trending: ['BTC', 'ETH', 'SOL']
    }
  },
  {
    id: 'ai-insights',
    title: 'AI Trading Insights',
    type: 'analytics',
    size: 'medium',
    visible: true,
    icon: Zap,
    color: 'from-indigo-500 to-purple-500',
    data: {
      recommendation: 'BUY',
      confidence: 87,
      timeframe: '4H',
      reasoning: 'Strong technical indicators and positive sentiment'
    }
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    type: 'trading',
    size: 'small',
    visible: true,
    icon: Target,
    color: 'from-red-500 to-pink-500',
    data: {
      shortcuts: ['Buy BTC', 'Sell ETH', 'Set Alert', 'View Charts']
    }
  }
];

export default function PersonalizedWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const savedLayout = localStorage.getItem('nebulax-dashboard-layout');
    if (savedLayout) {
      setWidgets(JSON.parse(savedLayout));
    }
  }, []);

  const saveLayout = (newWidgets: Widget[]) => {
    localStorage.setItem('nebulax-dashboard-layout', JSON.stringify(newWidgets));
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    );
    setWidgets(updatedWidgets);
    saveLayout(updatedWidgets);
    setAnimationKey(prev => prev + 1);
  };

  const reorderWidgets = (newOrder: Widget[]) => {
    setWidgets(newOrder);
    saveLayout(newOrder);
  };

  const getGridClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'medium': return 'col-span-2 row-span-1';
      case 'large': return 'col-span-3 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'portfolio':
        return <PortfolioWidget data={widget.data} />;
      case 'trading':
        return <TradingWidget data={widget.data} widget={widget} />;
      case 'rewards':
        return <RewardsWidget data={widget.data} />;
      case 'analytics':
        return <AnalyticsWidget data={widget.data} widget={widget} />;
      default:
        return <div>Widget content</div>;
    }
  };

  const visibleWidgets = widgets.filter(widget => widget.visible);

  return (
    <div className="space-y-6">
      {/* Customization Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Personalized Dashboard
          </h2>
          <p className="text-gray-400 mt-1">Customize your widgets to match your trading style</p>
        </div>
        
        <Button
          onClick={() => setIsCustomizing(!isCustomizing)}
          variant={isCustomizing ? "default" : "outline"}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Settings className="w-4 h-4 mr-2" />
          {isCustomizing ? 'Done' : 'Customize'}
        </Button>
      </div>

      {/* Widget Visibility Controls */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20"
          >
            <h3 className="text-lg font-semibold mb-3 text-white">Widget Visibility</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {widgets.map((widget) => (
                <motion.div
                  key={widget.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={widget.visible ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={`w-full justify-start ${
                      widget.visible 
                        ? `bg-gradient-to-r ${widget.color}` 
                        : 'border-gray-600 text-gray-400'
                    }`}
                  >
                    <widget.icon className="w-4 h-4 mr-2" />
                    {widget.title}
                    {widget.visible ? <Eye className="w-4 h-4 ml-auto" /> : <EyeOff className="w-4 h-4 ml-auto" />}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Grid */}
      <motion.div key={animationKey} layout>
        {isCustomizing ? (
          <Reorder.Group values={visibleWidgets} onReorder={reorderWidgets}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
              {visibleWidgets.map((widget) => (
                <Reorder.Item key={widget.id} value={widget}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    className={`${getGridClass(widget.size)} cursor-grab active:cursor-grabbing`}
                  >
                    <Card className="h-full bg-gray-900/50 border-purple-500/20 backdrop-blur-sm relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 bg-gradient-to-r ${widget.color} rounded-lg flex items-center justify-center`}>
                            <widget.icon className="w-4 h-4 text-white" />
                          </div>
                          <CardTitle className="text-lg text-white">{widget.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {renderWidgetContent(widget)}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Reorder.Item>
              ))}
            </div>
          </Reorder.Group>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
            {visibleWidgets.map((widget, index) => (
              <motion.div
                key={widget.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className={getGridClass(widget.size)}
              >
                <Card className="h-full bg-gray-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className={`w-8 h-8 bg-gradient-to-r ${widget.color} rounded-lg flex items-center justify-center`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <widget.icon className="w-4 h-4 text-white" />
                      </motion.div>
                      <CardTitle className="text-lg text-white">{widget.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {renderWidgetContent(widget)}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Widget Components
function PortfolioWidget({ data }: { data: PortfolioData }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <motion.div 
          className="text-3xl font-bold text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          ${data.totalValue.toLocaleString()}
        </motion.div>
        <div className={`flex items-center justify-center gap-1 ${
          data.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {data.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>${Math.abs(data.change24h).toLocaleString()} ({Math.abs(data.changePercent)}%)</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {data.topAssets.map((asset, index) => (
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
          >
            <span className="text-white font-medium">{asset.symbol}</span>
            <div className="text-right">
              <div className="text-white">${asset.value.toLocaleString()}</div>
              <div className={`text-sm ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {asset.change >= 0 ? '+' : ''}{asset.change}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TradingWidget({ data, widget }: { data: TradingData; widget: Widget }) {
  if (widget.id === 'quick-actions') {
    return (
      <div className="grid grid-cols-1 gap-2">
        {data.shortcuts?.map((action: string, index: number) => (
          <motion.div
            key={action}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-gray-600 hover:border-purple-400 hover:bg-purple-500/10"
            >
              <Zap className="w-4 h-4 mr-2" />
              {action}
            </Button>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-2xl font-bold text-white">{data.activeOrders}</div>
        <div className="text-sm text-gray-400">Active Orders</div>
      </motion.div>
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-2xl font-bold text-white">{data.totalTrades}</div>
        <div className="text-sm text-gray-400">Total Trades</div>
      </motion.div>
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-2xl font-bold text-green-400">{data.winRate}%</div>
        <div className="text-sm text-gray-400">Win Rate</div>
      </motion.div>
      <motion.div 
        className="text-center"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-2xl font-bold text-yellow-400">${data.pnl24h}</div>
        <div className="text-sm text-gray-400">24h P&L</div>
      </motion.div>
    </div>
  );
}

function RewardsWidget({ data }: { data: RewardsData }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <motion.div 
          className="text-2xl font-bold text-yellow-400"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {data.totalPoints.toLocaleString()} Points
        </motion.div>
        <div className="text-sm text-gray-400">Level {data.level}</div>
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Next Level</span>
          <span className="text-white">{data.nextLevelProgress}%</span>
        </div>
        <Progress value={data.nextLevelProgress} className="h-2" />
      </div>
      
      <div className="space-y-1">
        {data.recentAchievements.slice(0, 2).map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{achievement.title}</div>
              <div className="text-xs text-yellow-400">+{achievement.points} points</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsWidget({ data, widget }: { data: any; widget: Widget }) {
  if (widget.id === 'market-pulse') {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Sentiment</span>
          <Badge variant="outline" className="border-green-400 text-green-400">
            {data.sentiment}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Volatility</span>
          <Badge variant="outline" className="border-yellow-400 text-yellow-400">
            {data.volatility}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">24h Volume</span>
          <span className="text-white font-medium">{data.volume24h}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className={`text-xl font-bold ${
          data.recommendation === 'BUY' ? 'text-green-400' : 
          data.recommendation === 'SELL' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {data.recommendation}
        </div>
        <Badge variant="outline" className="border-purple-400 text-purple-400">
          {data.confidence}% Confidence
        </Badge>
      </div>
      <div className="text-sm text-gray-400">
        {data.timeframe} • {data.reasoning}
      </div>
    </div>
  );
}