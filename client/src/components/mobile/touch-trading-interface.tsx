import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  DollarSign,
  Zap,
  Target,
  Settings,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  RefreshCw,
  Calculator,
  PieChart,
  LineChart,
  Smartphone,
  Vibrate
} from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface TouchTradingProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
  initialPair?: string;
}

interface Order {
  id: string;
  type: 'market' | 'limit' | 'stop' | 'take_profit' | 'trailing_stop';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  timestamp: Date;
  filled?: number;
}

interface Position {
  asset: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

export default function TouchTradingInterface({ 
  userTier = 'basic',
  initialPair = 'BTC/USDT'
}: TouchTradingProps) {
  const [selectedPair, setSelectedPair] = useState(initialPair);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('1000');
  const [price, setPrice] = useState('');
  const [leverage, setLeverage] = useState([1]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOrderBook, setShowOrderBook] = useState(true);
  const [enableHaptic, setEnableHaptic] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [marketData, setMarketData] = useState({
    price: 43250.89,
    change24h: 2.34,
    changePercent: 5.12,
    volume: '2.4B',
    high24h: 44200,
    low24h: 42100,
    bid: 43248.50,
    ask: 43252.30
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([
    {
      asset: 'BTC',
      amount: 0.5,
      avgPrice: 42000,
      currentPrice: 43250.89,
      pnl: 625.45,
      pnlPercent: 2.97
    }
  ]);

  const [orderBook, setOrderBook] = useState({
    bids: Array.from({ length: 8 }, (_, i) => ({
      price: 43250 - i * 5,
      amount: Math.random() * 2,
      total: Math.random() * 10
    })),
    asks: Array.from({ length: 8 }, (_, i) => ({
      price: 43252 + i * 5,
      amount: Math.random() * 2,
      total: Math.random() * 10
    }))
  });

  const [recentTrades, setRecentTrades] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      price: 43250 + (Math.random() - 0.5) * 100,
      amount: Math.random() * 1,
      side: Math.random() > 0.5 ? 'buy' : 'sell' as 'buy' | 'sell',
      timestamp: new Date(Date.now() - i * 30000)
    }))
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        price: prev.price * (1 + (Math.random() - 0.5) * 0.001),
        change24h: prev.change24h + (Math.random() - 0.5) * 0.1,
        bid: prev.price - 2 + Math.random(),
        ask: prev.price + 2 + Math.random()
      }));

      // Update order book
      setOrderBook(prev => ({
        bids: prev.bids.map(bid => ({
          ...bid,
          amount: Math.max(0.1, bid.amount + (Math.random() - 0.5) * 0.1)
        })),
        asks: prev.asks.map(ask => ({
          ...ask,
          amount: Math.max(0.1, ask.amount + (Math.random() - 0.5) * 0.1)
        }))
      }));

      // Add new trade occasionally
      if (Math.random() > 0.7) {
        setRecentTrades(prev => [{
          id: Date.now(),
          price: marketData.price + (Math.random() - 0.5) * 50,
          amount: Math.random() * 1,
          side: Math.random() > 0.5 ? 'buy' : 'sell' as 'buy' | 'sell',
          timestamp: new Date()
        }, ...prev.slice(0, 9)]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, marketData.price]);

  const hapticFeedback = (pattern: number | number[] = 100) => {
    if (enableHaptic && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const playSound = (type: 'success' | 'error' | 'info' = 'info') => {
    if (soundEnabled) {
      // Would play actual sounds in production
      console.log(`Playing ${type} sound`);
    }
  };

  const placeOrder = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      type: orderType,
      side: orderSide,
      amount: parseFloat(amount),
      price: orderType === 'market' ? undefined : parseFloat(price),
      status: 'pending',
      timestamp: new Date()
    };

    setOrders(prev => [newOrder, ...prev]);
    hapticFeedback([100, 50, 100]);
    playSound('success');

    // Simulate order execution
    setTimeout(() => {
      setOrders(prev => prev.map(order => 
        order.id === newOrder.id 
          ? { ...order, status: 'filled', filled: order.amount }
          : order
      ));
    }, Math.random() * 3000 + 1000);
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'cancelled' } : order
    ));
    hapticFeedback(50);
  };

  const quickAmountPercent = (percent: number) => {
    const balance = userTier === 'basic' ? 5000 : userTier === 'pro' ? 25000 : 100000;
    const newAmount = (balance * percent / 100).toString();
    setAmount(newAmount);
    hapticFeedback(50);
  };

  const handleSwipe = (info: PanInfo) => {
    const swipeThreshold = 100;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      setSwipeDirection(direction);
      
      if (direction === 'left') {
        setOrderSide('sell');
      } else {
        setOrderSide('buy');
      }
      
      hapticFeedback(100);
      setTimeout(() => setSwipeDirection(null), 300);
    }
  };

  const orderTypes = userTier === 'basic' 
    ? [{ value: 'market', label: 'Market' }]
    : userTier === 'pro'
    ? [
        { value: 'market', label: 'Market' },
        { value: 'limit', label: 'Limit' }
      ]
    : [
        { value: 'market', label: 'Market' },
        { value: 'limit', label: 'Limit' },
        { value: 'stop', label: 'Stop Loss' }
      ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white transition-all duration-300 ${
      isFullscreen ? 'p-0' : 'p-2'
    }`}>
      <div className="max-w-md mx-auto" ref={containerRef}>
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-lg rounded-lg mb-4"
          animate={{ 
            backgroundColor: swipeDirection === 'left' ? 'rgba(239, 68, 68, 0.3)' : 
                             swipeDirection === 'right' ? 'rgba(34, 197, 94, 0.3)' : 
                             'rgba(0, 0, 0, 0.2)' 
          }}
        >
          <div>
            <h1 className="text-xl font-bold">{selectedPair}</h1>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-2xl font-bold">
                ${marketData.price.toFixed(2)}
              </span>
              <span className={`flex items-center ${
                marketData.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {marketData.changePercent >= 0 ? 
                  <TrendingUp className="w-3 h-3 mr-1" /> : 
                  <TrendingDown className="w-3 h-3 mr-1" />
                }
                {marketData.changePercent >= 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Touch Trading Panel */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => handleSwipe(info)}
          className="mb-4"
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Touch Trading</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={orderSide === 'buy' ? 'default' : 'destructive'}>
                    {orderSide.toUpperCase()}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOrderSide(orderSide === 'buy' ? 'sell' : 'buy')}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Type Selector */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Order Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {orderTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={orderType === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setOrderType(type.value as any);
                          hapticFeedback(50);
                        }}
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Amount (USDT)</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-white/5 border-white/10 text-lg"
                  />
                  
                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[25, 50, 75, 100].map((percent) => (
                      <Button
                        key={percent}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => quickAmountPercent(percent)}
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Input (for limit orders) */}
                {orderType === 'limit' && (
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Price (USDT)</label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                )}

                {/* Leverage (Pro+) */}
                {userTier !== 'basic' && (
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Leverage: {leverage[0]}x
                    </label>
                    <Slider
                      value={leverage}
                      onValueChange={setLeverage}
                      max={userTier === 'pro' ? 10 : userTier === 'premium' ? 50 : 100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Large Touch Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 h-20 text-xl font-bold"
                      onClick={() => {
                        setOrderSide('buy');
                        placeOrder();
                      }}
                      disabled={!amount || (orderType === 'limit' && !price)}
                    >
                      <ArrowUp className="w-6 h-6 mr-2" />
                      BUY
                    </Button>
                  </motion.div>
                  
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button 
                      className="w-full bg-red-500 hover:bg-red-600 h-20 text-xl font-bold"
                      onClick={() => {
                        setOrderSide('sell');
                        placeOrder();
                      }}
                      disabled={!amount || (orderType === 'limit' && !price)}
                    >
                      <ArrowDown className="w-6 h-6 mr-2" />
                      SELL
                    </Button>
                  </motion.div>
                </div>

                {/* Swipe Hint */}
                <div className="text-center text-sm text-gray-400">
                  Swipe left for SELL • Swipe right for BUY
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="orderbook">Book</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Active Orders</span>
                  <Badge variant="secondary">{orders.filter(o => o.status === 'pending').length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        className={`p-3 rounded-lg border ${
                          order.status === 'filled' ? 'border-green-500 bg-green-500/10' :
                          order.status === 'cancelled' ? 'border-red-500 bg-red-500/10' :
                          'border-gray-500 bg-gray-500/10'
                        }`}
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        layout
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={order.side === 'buy' ? 'default' : 'destructive'}>
                                {order.side.toUpperCase()}
                              </Badge>
                              <span className="font-medium">{order.type.toUpperCase()}</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {order.amount} USDT {order.price && `@ $${order.price}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {order.status}
                            </Badge>
                            {order.status === 'pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => cancelOrder(order.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {orders.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No orders yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {positions.map((position, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{position.asset}</span>
                        <Badge variant={position.pnl >= 0 ? 'default' : 'destructive'}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-gray-400">Amount</div>
                          <div>{position.amount}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Avg Price</div>
                          <div>${position.avgPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Current</div>
                          <div>${position.currentPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {positions.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No open positions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Book Tab */}
          <TabsContent value="orderbook" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Book</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOrderBook(!showOrderBook)}
                  >
                    {showOrderBook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showOrderBook && (
                  <div className="space-y-2">
                    {/* Asks */}
                    <div className="space-y-1">
                      {orderBook.asks.slice(0, 5).reverse().map((ask, index) => (
                        <div key={index} className="flex justify-between text-sm py-1 px-2 bg-red-500/10 rounded">
                          <span className="text-red-400">${ask.price.toFixed(2)}</span>
                          <span>{ask.amount.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Spread */}
                    <div className="text-center py-2 border-y border-white/10">
                      <span className="text-sm text-gray-400">
                        Spread: ${(marketData.ask - marketData.bid).toFixed(2)}
                      </span>
                    </div>

                    {/* Bids */}
                    <div className="space-y-1">
                      {orderBook.bids.slice(0, 5).map((bid, index) => (
                        <div key={index} className="flex justify-between text-sm py-1 px-2 bg-green-500/10 rounded">
                          <span className="text-green-400">${bid.price.toFixed(2)}</span>
                          <span>{bid.amount.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-4">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Touch Trading Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Haptic Feedback</div>
                      <div className="text-sm text-gray-400">Vibration on touch</div>
                    </div>
                    <Switch
                      checked={enableHaptic}
                      onCheckedChange={(checked) => {
                        setEnableHaptic(checked);
                        if (checked) hapticFeedback(100);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Sound Effects</div>
                      <div className="text-sm text-gray-400">Audio feedback</div>
                    </div>
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto Refresh</div>
                      <div className="text-sm text-gray-400">Real-time updates</div>
                    </div>
                    <Switch
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Show Order Book</div>
                      <div className="text-sm text-gray-400">Display market depth</div>
                    </div>
                    <Switch
                      checked={showOrderBook}
                      onCheckedChange={setShowOrderBook}
                    />
                  </div>

                  {/* User Tier Info */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Current Tier</div>
                        <div className="text-sm text-gray-400">
                          {userTier === 'basic' && 'Market orders only'}
                          {userTier === 'pro' && 'Market & limit orders, 10x leverage'}
                          {userTier === 'premium' && 'All order types, 50x leverage'}
                          {userTier === 'elite' && 'All features, 100x leverage'}
                        </div>
                      </div>
                      <Badge variant={
                        userTier === 'basic' ? 'secondary' :
                        userTier === 'pro' ? 'default' :
                        userTier === 'premium' ? 'default' : 'default'
                      }>
                        {userTier.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}