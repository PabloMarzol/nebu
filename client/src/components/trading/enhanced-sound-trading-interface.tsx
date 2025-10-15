import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSoundEffects } from '@/components/ui/adaptive-sound-design';
import { 
  TrendingUp, 
  TrendingDown, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Headphones,
  BarChart3,
  Music
} from 'lucide-react';

interface TradingAction {
  id: string;
  type: 'buy' | 'sell' | 'limit' | 'stop';
  asset: string;
  amount: number;
  price: number;
  timestamp: Date;
  status: 'pending' | 'executed' | 'cancelled';
}

export default function EnhancedSoundTradingInterface() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentActions, setRecentActions] = useState<TradingAction[]>([]);
  const [marketTrend, setMarketTrend] = useState<'bullish' | 'bearish' | 'sideways'>('bullish');
  const soundEffects = useSoundEffects();

  // Simulate market movements with sound feedback
  useEffect(() => {
    const interval = setInterval(() => {
      const trends = ['bullish', 'bearish', 'sideways'] as const;
      const newTrend = trends[Math.floor(Math.random() * trends.length)];
      setMarketTrend(newTrend);
      
      // Play different sounds based on market movement
      if (newTrend === 'bullish') {
        soundEffects.playSuccess();
      } else if (newTrend === 'bearish') {
        soundEffects.playError();
      } else {
        soundEffects.playNotification();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [soundEffects]);

  const handleTrade = (type: 'buy' | 'sell', asset: string) => {
    const newAction: TradingAction = {
      id: Date.now().toString(),
      type,
      asset,
      amount: Math.random() * 10,
      price: Math.random() * 50000 + 30000,
      timestamp: new Date(),
      status: 'pending'
    };

    setRecentActions(prev => [newAction, ...prev.slice(0, 4)]);
    
    // Play appropriate sound effect
    if (type === 'buy') {
      soundEffects.playSuccess();
    } else {
      soundEffects.playTrading();
    }

    // Simulate execution after delay
    setTimeout(() => {
      setRecentActions(prev => 
        prev.map(action => 
          action.id === newAction.id 
            ? { ...action, status: 'executed' }
            : action
        )
      );
      soundEffects.playNotification();
    }, 2000);
  };

  const tradingPairs = [
    { symbol: 'BTC/USDT', price: 43250.50, change: '+2.34%' },
    { symbol: 'ETH/USDT', price: 2650.75, change: '-1.12%' },
    { symbol: 'SOL/USDT', price: 98.45, change: '+5.67%' },
    { symbol: 'ADA/USDT', price: 0.45, change: '+1.23%' }
  ];

  return (
    <div className="space-y-6">
      {/* Sound-Enhanced Trading Header */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Sound-Enhanced Trading</h2>
                <p className="text-gray-400">Experience trading with adaptive audio feedback</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={`${
                  marketTrend === 'bullish' ? 'border-green-500 text-green-400' :
                  marketTrend === 'bearish' ? 'border-red-500 text-red-400' :
                  'border-yellow-500 text-yellow-400'
                }`}
              >
                Market: {marketTrend}
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  soundEffects.playClick();
                }}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Audio Visualization */}
          <div className="grid grid-cols-8 gap-1 h-16 mb-4">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className={`bg-gradient-to-t from-blue-500 to-purple-600 rounded-sm transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{
                  height: `${Math.random() * 100}%`,
                  opacity: isPlaying ? Math.random() * 0.8 + 0.2 : 0.3
                }}
              />
            ))}
          </div>

          {/* Sound Features Demo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundEffects.playSuccess()}
              className="border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Success Sound
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundEffects.playError()}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Alert Sound
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundEffects.playNotification()}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Notification
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => soundEffects.playTrading()}
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <Music className="w-4 h-4 mr-2" />
              Trading Tone
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Trading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Trade Panel */}
        <Card className="bg-gray-900/50 border border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Headphones className="w-5 h-5 mr-2 text-purple-400" />
              Quick Trade (Audio Enhanced)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {tradingPairs.map((pair) => (
                <div key={pair.symbol} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white">{pair.symbol}</span>
                    <span className={`text-sm ${
                      pair.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {pair.change}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleTrade('buy', pair.symbol)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Buy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTrade('sell', pair.symbol)}
                      className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      Sell
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Actions with Sound Feedback */}
        <Card className="bg-gray-900/50 border border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Actions</h3>
            
            <div className="space-y-3">
              {recentActions.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No recent trades</p>
              ) : (
                recentActions.map((action) => (
                  <div 
                    key={action.id} 
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        action.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {action.type.toUpperCase()} {action.asset}
                        </div>
                        <div className="text-xs text-gray-400">
                          {action.amount.toFixed(4)} @ ${action.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="outline"
                      className={`${
                        action.status === 'executed' ? 'border-green-500 text-green-400' :
                        action.status === 'pending' ? 'border-yellow-500 text-yellow-400' :
                        'border-red-500 text-red-400'
                      }`}
                    >
                      {action.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sound Features Info */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Adaptive Sound Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white">Market Feedback</h4>
              <p className="text-sm text-gray-400">
                Audio cues for price movements and market trends
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <Volume2 className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white">Contextual Sounds</h4>
              <p className="text-sm text-gray-400">
                Smart audio that adapts to your trading activity
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Music className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white">Theme Selection</h4>
              <p className="text-sm text-gray-400">
                Choose from Cyberpunk, Minimal, or Orchestral themes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}