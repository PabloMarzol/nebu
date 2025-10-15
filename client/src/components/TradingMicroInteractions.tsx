import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAutoWidgetDismiss } from '@/hooks/use-auto-dismiss';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Star,
  Heart,
  Trophy,
  Flame
} from 'lucide-react';

interface TradingAction {
  id: string;
  type: 'buy' | 'sell' | 'cancel' | 'modify';
  symbol: string;
  amount: number;
  price: number;
  timestamp: Date;
  status: 'processing' | 'completed' | 'failed';
}

interface AnimationState {
  isAnimating: boolean;
  animationType: 'pulse' | 'bounce' | 'shake' | 'glow' | 'ripple' | 'sparkle';
  color: string;
  size: 'small' | 'medium' | 'large';
}

const tradingPairs = [
  { symbol: 'BTC/USDT', price: 67450.50, change: 2.4 },
  { symbol: 'ETH/USDT', price: 3720.75, change: -1.8 },
  { symbol: 'SOL/USDT', price: 185.20, change: 5.7 },
  { symbol: 'ADA/USDT', price: 0.85, change: -0.5 }
];

const animationClasses = {
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  shake: 'animate-shake',
  glow: 'animate-ping',
  ripple: 'animate-spin',
  sparkle: 'animate-pulse'
};

const colorClasses = {
  green: 'bg-green-500 text-white border-green-400',
  red: 'bg-red-500 text-white border-red-400',
  blue: 'bg-blue-500 text-white border-blue-400',
  purple: 'bg-purple-500 text-white border-purple-400',
  yellow: 'bg-yellow-500 text-white border-yellow-400'
};

export function TradingMicroInteractions() {
  const [actions, setActions] = useState<TradingAction[]>([]);
  const [animations, setAnimations] = useState<Record<string, AnimationState>>({});
  const [selectedPair, setSelectedPair] = useState(tradingPairs[0]);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [successCount, setSuccessCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Add CSS for custom animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      @keyframes ripple {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
      .animate-shake { animation: shake 0.5s ease-in-out; }
      .animate-ripple { animation: ripple 0.6s ease-out; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const triggerAnimation = (elementId: string, type: 'buy' | 'sell' | 'cancel' | 'modify' | 'success' | 'error') => {
    const animationConfigs = {
      buy: { animationType: 'bounce', color: 'green', size: 'medium' },
      sell: { animationType: 'pulse', color: 'red', size: 'medium' },
      cancel: { animationType: 'shake', color: 'yellow', size: 'small' },
      modify: { animationType: 'glow', color: 'blue', size: 'small' },
      success: { animationType: 'sparkle', color: 'purple', size: 'large' },
      error: { animationType: 'shake', color: 'red', size: 'large' }
    };

    const config = animationConfigs[type];
    
    setAnimations(prev => ({
      ...prev,
      [elementId]: {
        isAnimating: true,
        animationType: config.animationType as any,
        color: config.color,
        size: config.size
      }
    }));

    // Clear animation after duration
    setTimeout(() => {
      setAnimations(prev => ({
        ...prev,
        [elementId]: { ...prev[elementId], isAnimating: false }
      }));
    }, 1000);
  };

  const executeTrade = (type: 'buy' | 'sell') => {
    if (!amount || !price) {
      triggerAnimation('form', 'error');
      toast({
        title: "Invalid Input",
        description: "Please enter both amount and price",
        variant: "destructive"
      });
      return;
    }

    const action: TradingAction = {
      id: Date.now().toString(),
      type,
      symbol: selectedPair.symbol,
      amount: parseFloat(amount),
      price: parseFloat(price),
      timestamp: new Date(),
      status: 'processing'
    };

    setActions(prev => [action, ...prev.slice(0, 9)]);
    triggerAnimation(`action-${action.id}`, type);

    // Simulate processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      
      setActions(prev => prev.map(a => 
        a.id === action.id 
          ? { ...a, status: success ? 'completed' : 'failed' }
          : a
      ));

      if (success) {
        setSuccessCount(prev => prev + 1);
        setStreak(prev => prev + 1);
        triggerAnimation(`action-${action.id}`, 'success');
        
        toast({
          title: "🎉 Trade Executed!",
          description: `${type.toUpperCase()} ${amount} ${selectedPair.symbol} at $${price}`,
          className: "bg-gradient-to-r from-green-600 to-blue-600 text-white border-none"
        });

        // Trigger celebration effects for streak milestones
        if (streak > 0 && streak % 5 === 0) {
          triggerCelebration();
        }
      } else {
        setStreak(0);
        triggerAnimation(`action-${action.id}`, 'error');
        
        toast({
          title: "Trade Failed",
          description: "Trade execution failed. Please try again.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const triggerCelebration = () => {
    // Create celebration particles
    const particles = document.createElement('div');
    particles.className = 'fixed inset-0 pointer-events-none z-50';
    particles.innerHTML = Array.from({ length: 20 }, (_, i) => `
      <div 
        class="absolute animate-bounce"
        style="
          left: ${Math.random() * 100}%; 
          top: ${Math.random() * 100}%;
          animation-delay: ${Math.random() * 2}s;
          animation-duration: ${1 + Math.random() * 2}s;
        "
      >
        <span class="text-2xl">${['🎉', '⭐', '🚀', '💎', '🔥'][Math.floor(Math.random() * 5)]}</span>
      </div>
    `).join('');
    
    document.body.appendChild(particles);
    setTimeout(() => document.body.removeChild(particles), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'sell': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'cancel': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'modify': return <Target className="w-4 h-4 text-blue-400" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const renderActionButton = (type: 'buy' | 'sell', icon: React.ReactNode) => {
    const isAnimating = animations[type]?.isAnimating;
    const animationType = animations[type]?.animationType;
    const color = type === 'buy' ? 'green' : 'red';
    
    return (
      <Button
        onClick={() => executeTrade(type)}
        className={`
          relative overflow-hidden transition-all duration-300 transform hover:scale-105 
          ${type === 'buy' ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600' : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'}
          ${isAnimating ? animationClasses[animationType] : ''}
          text-white border-none
        `}
        disabled={isAnimating}
      >
        {isAnimating && (
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        )}
        {icon}
        <span className="ml-2 font-semibold">{type.toUpperCase()}</span>
        {isAnimating && (
          <div className="absolute inset-0 border-2 border-white/50 animate-ping rounded-md" />
        )}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                Trading Micro-Interactions
              </h1>
              <p className="text-slate-300 mt-2">
                Experience smooth animations and visual feedback for every trading action
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{successCount}</div>
                <div className="text-slate-300 text-sm">Successful Trades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 flex items-center gap-2">
                  <Flame className="w-6 h-6" />
                  {streak}
                </div>
                <div className="text-slate-300 text-sm">Current Streak</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trading Form */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Place Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {tradingPairs.map((pair) => (
                  <Button
                    key={pair.symbol}
                    variant={selectedPair.symbol === pair.symbol ? "default" : "outline"}
                    onClick={() => setSelectedPair(pair)}
                    className={`
                      ${selectedPair.symbol === pair.symbol 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                        : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      }
                      transition-all duration-200 hover:scale-105
                    `}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{pair.symbol}</div>
                      <div className="text-xs opacity-80">${pair.price.toLocaleString()}</div>
                    </div>
                    <div className={`ml-2 ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pair.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    </div>
                  </Button>
                ))}
              </div>

              <div 
                id="form"
                className={`
                  space-y-4 p-4 rounded-lg border border-slate-700 
                  ${animations.form?.isAnimating ? 'animate-shake border-red-500' : ''}
                `}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Amount
                    </label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-slate-800 border-slate-600 text-white focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Price (USDT)
                    </label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="bg-slate-800 border-slate-600 text-white focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  {renderActionButton('buy', <TrendingUp className="w-4 h-4" />)}
                  {renderActionButton('sell', <TrendingDown className="w-4 h-4" />)}
                </div>

                <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-sm text-slate-400">
                    Total: ${((parseFloat(amount) || 0) * (parseFloat(price) || 0)).toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action History */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Recent Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No trades yet. Start trading to see your activity!</p>
                  </div>
                ) : (
                  actions.map((action) => (
                    <div
                      key={action.id}
                      id={`action-${action.id}`}
                      className={`
                        p-3 rounded-lg border transition-all duration-300
                        ${action.status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
                          action.status === 'failed' ? 'bg-red-500/10 border-red-500/30' :
                          'bg-blue-500/10 border-blue-500/30'}
                        ${animations[`action-${action.id}`]?.isAnimating ? 'scale-105 shadow-lg' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getActionIcon(action.type)}
                          <div>
                            <div className="font-semibold text-white">
                              {action.type.toUpperCase()} {action.symbol}
                            </div>
                            <div className="text-sm text-slate-400">
                              {action.amount} @ ${action.price}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(action.status)}
                          <Badge variant="outline" className="text-xs">
                            {action.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Metrics */}
        <Card className="mt-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Trading Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {((successCount / Math.max(actions.length, 1)) * 100).toFixed(1)}%
                </div>
                <div className="text-slate-300">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {actions.length}
                </div>
                <div className="text-slate-300">Total Trades</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-400 mb-2">
                  {streak}
                </div>
                <div className="text-slate-300">Current Streak</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {Math.max(...actions.map(a => a.amount), 0).toFixed(2)}
                </div>
                <div className="text-slate-300">Largest Trade</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}