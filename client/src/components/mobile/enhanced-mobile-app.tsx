import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Settings, 
  Wallet, 
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Smartphone,
  Star,
  Crown,
  Zap,
  Target,
  BarChart3,
  DollarSign,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  EyeOff,
  Vibrate,
  Volume2,
  VolumeX,
  Shield,
  Fingerprint,
  Lock,
  Unlock,
  Maximize2,
  Minimize2,
  Activity,
  PieChart,
  LineChart,
  TrendingUpIcon,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedMobileAppProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
  pushNotificationsEnabled?: boolean;
  biometricEnabled?: boolean;
}

interface Notification {
  id: string;
  type: 'price_alert' | 'trade_executed' | 'security' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function EnhancedMobileApp({ 
  userTier = 'basic',
  pushNotificationsEnabled = false,
  biometricEnabled = false
}: EnhancedMobileAppProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [portfolio, setPortfolio] = useState({
    balance: 45672.89,
    change24h: 2.34,
    changePercent: 5.12,
    hidden: false
  });
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'price_alert',
      title: 'BTC Price Alert',
      message: 'Bitcoin reached $43,500 (+2.8%)',
      timestamp: new Date(),
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'trade_executed',
      title: 'Trade Executed',
      message: 'Buy order for 0.1 ETH completed',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      priority: 'medium'
    }
  ]);
  const [activeTab, setActiveTab] = useState('markets');
  const [settings, setSettings] = useState({
    notifications: pushNotificationsEnabled,
    biometric: biometricEnabled,
    hapticFeedback: true,
    soundEnabled: true,
    pushEnabled: true,
    priceAlerts: true,
    tradeAlerts: true,
    securityAlerts: true
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('1000');
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');

  // Mock real-time data
  const [marketData, setMarketData] = useState([
    { symbol: 'BTC/USDT', price: 43250.89, change: 2.34, volume: '2.4B', high: 44200, low: 42100 },
    { symbol: 'ETH/USDT', price: 2654.23, change: -1.23, volume: '1.8B', high: 2720, low: 2580 },
    { symbol: 'ADA/USDT', price: 0.523, change: 4.56, volume: '890M', high: 0.545, low: 0.485 },
    { symbol: 'SOL/USDT', price: 89.34, change: -2.11, volume: '1.2B', high: 95.20, low: 87.10 },
    { symbol: 'MATIC/USDT', price: 0.89, change: 3.21, volume: '456M', high: 0.92, low: 0.84 },
    { symbol: 'DOT/USDT', price: 7.23, change: -0.89, volume: '234M', high: 7.45, low: 7.01 }
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(market => ({
        ...market,
        price: market.price * (1 + (Math.random() - 0.5) * 0.002),
        change: market.change + (Math.random() - 0.5) * 0.1
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Push notification simulation
  useEffect(() => {
    if (settings.pushEnabled && settings.priceAlerts) {
      const interval = setInterval(() => {
        const randomMarket = marketData[Math.floor(Math.random() * marketData.length)];
        if (Math.random() > 0.8) { // 20% chance of alert
          addNotification({
            type: 'price_alert',
            title: `${randomMarket.symbol} Alert`,
            message: `Price: $${randomMarket.price.toFixed(2)} (${randomMarket.change >= 0 ? '+' : ''}${randomMarket.change.toFixed(2)}%)`,
            priority: Math.abs(randomMarket.change) > 3 ? 'high' : 'medium'
          });
        }
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [settings.pushEnabled, settings.priceAlerts, marketData]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    
    // Trigger haptic feedback if enabled
    if (settings.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
    
    // Show browser notification if supported
    if (settings.pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, pushEnabled: true }));
        addNotification({
          type: 'info',
          title: 'Notifications Enabled',
          message: 'You will now receive push notifications',
          priority: 'low'
        });
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_alert': return <TrendingUp className="w-4 h-4" />;
      case 'trade_executed': return <CheckCircle className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'border-red-500 bg-red-500/10';
    switch (type) {
      case 'price_alert': return 'border-blue-500 bg-blue-500/10';
      case 'trade_executed': return 'border-green-500 bg-green-500/10';
      case 'security': return 'border-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-gray-500 bg-gray-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const quickActions = [
    { id: 'buy', title: 'Buy Crypto', icon: <ArrowUp className="w-4 h-4" />, enabled: true, color: 'bg-green-500' },
    { id: 'sell', title: 'Sell Crypto', icon: <ArrowDown className="w-4 h-4" />, enabled: true, color: 'bg-red-500' },
    { id: 'p2p', title: 'P2P Trading', icon: <Target className="w-4 h-4" />, enabled: userTier !== 'basic', color: 'bg-blue-500' },
    { id: 'ai', title: 'AI Trading', icon: <Zap className="w-4 h-4" />, enabled: userTier === 'premium' || userTier === 'elite', color: 'bg-purple-500' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white transition-all duration-300 ${
      isFullscreen ? 'p-0' : 'p-4'
    }`}>
      {/* Enhanced Mobile Header */}
      <motion.div 
        className="flex items-center justify-between mb-6 bg-black/20 backdrop-blur-lg rounded-lg p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">NebulaX Mobile</h1>
            <Badge variant="secondary" className={`${
              userTier === 'pro' ? 'bg-blue-500' : 
              userTier === 'premium' ? 'bg-purple-500' : 
              userTier === 'elite' ? 'bg-yellow-500' : 'bg-gray-500'
            } text-white`}>
              {userTier === 'pro' ? <Star className="w-3 h-3 mr-1" /> : 
               userTier === 'premium' || userTier === 'elite' ? <Crown className="w-3 h-3 mr-1" /> : 
               <Smartphone className="w-3 h-3 mr-1" />}
              <span className="capitalize">{userTier}</span>
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-80 bg-gray-900 p-6 overflow-y-auto"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Menu</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <nav className="space-y-3">
                {[
                  { id: 'portfolio', title: 'Portfolio', icon: <Wallet className="w-5 h-5" /> },
                  { id: 'markets', title: 'Markets', icon: <BarChart3 className="w-5 h-5" /> },
                  { id: 'trading', title: 'Trading', icon: <TrendingUp className="w-5 h-5" /> },
                  { id: 'analytics', title: 'Analytics', icon: <PieChart className="w-5 h-5" /> },
                  { id: 'notifications', title: 'Notifications', icon: <Bell className="w-5 h-5" /> },
                  { id: 'settings', title: 'Settings', icon: <Settings className="w-5 h-5" /> }
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start space-x-3"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Portfolio Overview */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Portfolio</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPortfolio(prev => ({ ...prev, hidden: !prev.hidden }))}
                >
                  {portfolio.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Wallet className="w-5 h-5" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {portfolio.hidden ? '••••••' : `$${portfolio.balance.toLocaleString()}`}
            </div>
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="w-4 h-4 text-green-400" />
              <span className="text-green-400">
                {portfolio.hidden ? '••••' : `+$${portfolio.change24h.toFixed(2)}`}
              </span>
              <span className="text-green-400">
                {portfolio.hidden ? '••••' : `(${portfolio.changePercent.toFixed(2)}%)`}
              </span>
            </div>
            
            {/* Quick Performance Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {portfolio.hidden ? '••••' : '+12.34%'}
                </div>
                <div className="text-xs text-gray-400">7-Day</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">
                  {portfolio.hidden ? '••••' : '68.5%'}
                </div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {portfolio.hidden ? '••••' : '1.25x'}
                </div>
                <div className="text-xs text-gray-400">Leverage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Quick Actions */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={action.enabled ? "default" : "secondary"}
                  disabled={!action.enabled}
                  className={`flex items-center space-x-2 p-4 h-auto w-full ${
                    action.enabled ? action.color : ''
                  }`}
                  onClick={() => {
                    if (settings.hapticFeedback && 'vibrate' in navigator) {
                      navigator.vibrate(50);
                    }
                  }}
                >
                  {action.icon}
                  <span>{action.title}</span>
                  {!action.enabled && <Badge variant="outline" className="ml-2">Upgrade</Badge>}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg mb-4">
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Alerts
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Markets Tab */}
        <TabsContent value="markets" className="mt-4">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Markets</span>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {marketData.map((market, index) => (
                  <motion.div 
                    key={market.symbol}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedPair(market.symbol);
                      setActiveTab('trading');
                    }}
                  >
                    <div>
                      <div className="font-semibold">{market.symbol}</div>
                      <div className="text-sm text-gray-400">Vol: {market.volume}</div>
                      <div className="text-xs text-gray-500">
                        H: ${market.high.toFixed(2)} L: ${market.low.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${market.price.toFixed(market.price < 1 ? 4 : 2)}</div>
                      <div className={`text-sm flex items-center ${
                        market.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {market.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enhanced Trading Tab */}
        <TabsContent value="trading" className="mt-4">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>Touch Trading - {selectedPair}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Trading Pair Selector */}
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-sm text-gray-400">Trading Pair</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{selectedPair}</span>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Amount (USDT)</label>
                  <Input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-white/5 border-white/10"
                  />
                  
                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {['25%', '50%', '75%', '100%'].map((percent) => (
                      <Button
                        key={percent}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setTradeAmount((parseFloat(tradeAmount) * (parseInt(percent) / 100)).toString())}
                      >
                        {percent}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Buy/Sell Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 h-16 text-lg font-semibold"
                      onClick={() => {
                        addNotification({
                          type: 'trade_executed',
                          title: 'Buy Order Placed',
                          message: `Buy ${tradeAmount} USDT of ${selectedPair}`,
                          priority: 'medium'
                        });
                      }}
                    >
                      <ArrowUp className="w-5 h-5 mr-2" />
                      BUY
                    </Button>
                  </motion.div>
                  
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500 text-red-400 hover:bg-red-500/10 h-16 text-lg font-semibold"
                      onClick={() => {
                        addNotification({
                          type: 'trade_executed',
                          title: 'Sell Order Placed',
                          message: `Sell ${tradeAmount} USDT of ${selectedPair}`,
                          priority: 'medium'
                        });
                      }}
                    >
                      <ArrowDown className="w-5 h-5 mr-2" />
                      SELL
                    </Button>
                  </motion.div>
                </div>

                {/* Advanced Order Types (Pro+) */}
                {userTier !== 'basic' && (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Order Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">Market</Button>
                      <Button variant="outline" size="sm">Limit</Button>
                      {(userTier === 'premium' || userTier === 'elite') && (
                        <>
                          <Button variant="outline" size="sm">Stop Loss</Button>
                          <Button variant="outline" size="sm">Take Profit</Button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {userTier === 'basic' && (
                  <div className="text-center p-3 bg-purple-500/20 rounded-lg">
                    <p className="text-sm text-purple-300">
                      Upgrade to Pro for advanced order types
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Upgrade Now
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          {userTier === 'premium' || userTier === 'elite' ? (
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>AI Insights & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-500/20 rounded-lg">
                      <PieChart className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-lg font-bold">Portfolio</div>
                      <div className="text-sm text-gray-400">Balanced</div>
                    </div>
                    <div className="text-center p-3 bg-green-500/20 rounded-lg">
                      <TrendingUpIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-lg font-bold">Trend</div>
                      <div className="text-sm text-gray-400">Bullish</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <p className="text-sm text-blue-300">
                        Market sentiment is bullish. Consider increasing BTC allocation.
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-300">
                        High volatility expected in the next 24h. Consider stop-loss orders.
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <p className="text-sm text-green-300">
                        DCA strategy performing well. Next purchase recommended in 2 days.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardContent className="text-center p-6">
                <Crown className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Premium Analytics</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Get AI-powered insights, risk analysis, and advanced metrics
                </p>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Enhanced Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Notifications</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{unreadCount} new</Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  >
                    Mark All Read
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${getNotificationColor(notification.type, notification.priority)} ${
                        !notification.read ? 'ring-2 ring-blue-500/50' : ''
                      }`}
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'price_alert' ? 'bg-blue-500/20' :
                          notification.type === 'trade_executed' ? 'bg-green-500/20' :
                          notification.type === 'security' ? 'bg-yellow-500/20' :
                          'bg-gray-500/20'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            <div className="flex items-center space-x-2">
                              {notification.priority === 'high' && (
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                              )}
                              <span className="text-xs text-gray-400">
                                {notification.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-4">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle>Mobile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Push Notifications */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Push Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Enable Notifications</div>
                      <div className="text-sm text-gray-400">Receive push notifications</div>
                    </div>
                    <Switch
                      checked={settings.pushEnabled}
                      onCheckedChange={(checked) => {
                        if (checked && !settings.pushEnabled) {
                          requestNotificationPermission();
                        } else {
                          setSettings(prev => ({ ...prev, pushEnabled: checked }));
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Price Alerts</div>
                      <div className="text-sm text-gray-400">Crypto price movements</div>
                    </div>
                    <Switch
                      checked={settings.priceAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, priceAlerts: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Trade Alerts</div>
                      <div className="text-sm text-gray-400">Order executions</div>
                    </div>
                    <Switch
                      checked={settings.tradeAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, tradeAlerts: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Security Alerts</div>
                      <div className="text-sm text-gray-400">Account security events</div>
                    </div>
                    <Switch
                      checked={settings.securityAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, securityAlerts: checked }))}
                    />
                  </div>
                </div>

                {/* Interface Settings */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="font-semibold">Interface</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Haptic Feedback</div>
                      <div className="text-sm text-gray-400">Vibration on interactions</div>
                    </div>
                    <Switch
                      checked={settings.hapticFeedback}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({ ...prev, hapticFeedback: checked }));
                        if (checked && 'vibrate' in navigator) {
                          navigator.vibrate(100);
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Sound Effects</div>
                      <div className="text-sm text-gray-400">Audio feedback</div>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEnabled: checked }))}
                    />
                  </div>
                </div>

                {/* Security Settings */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="font-semibold">Security</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Biometric Authentication</div>
                      <div className="text-sm text-gray-400">Fingerprint/Face unlock</div>
                    </div>
                    <Switch
                      checked={settings.biometric}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({ ...prev, biometric: checked }));
                        if (checked) {
                          addNotification({
                            type: 'security',
                            title: 'Biometric Auth Enabled',
                            message: 'Your account is now secured with biometric authentication',
                            priority: 'medium'
                          });
                        }
                      }}
                    />
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      addNotification({
                        type: 'security',
                        title: 'Security Check',
                        message: 'All security features are active and working properly',
                        priority: 'low'
                      });
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security Status Check
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}