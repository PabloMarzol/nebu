import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, MessageCircle, TrendingUp, DollarSign, AlertTriangle, X, Minimize2, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAutoWidgetDismiss } from '@/hooks/use-auto-dismiss';

interface AIInsight {
  type: 'market' | 'portfolio' | 'risk' | 'opportunity';
  title: string;
  message: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
}

export function FloatingAIAssistant() {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<AIInsight | null>(null);
  const [insightHistory, setInsightHistory] = useState<AIInsight[]>([]);

  // Auto-dismiss the floating AI assistant after 5 seconds
  useAutoWidgetDismiss(isVisible && !isMinimized, () => setIsVisible(false));

  const sampleInsights: AIInsight[] = [
    {
      type: 'market',
      title: 'BTC Momentum Signal',
      message: 'Bitcoin showing strong bullish momentum. Consider entering position with 15% portfolio allocation.',
      confidence: 87,
      priority: 'high'
    },
    {
      type: 'portfolio',
      title: 'Diversification Alert',
      message: 'Your portfolio is 78% concentrated in BTC/ETH. Consider adding DeFi tokens for better balance.',
      confidence: 92,
      priority: 'medium'
    },
    {
      type: 'risk',
      title: 'Volatility Warning',
      message: 'Market volatility increased 34% in last 4 hours. Consider reducing leverage positions.',
      confidence: 95,
      priority: 'high'
    },
    {
      type: 'opportunity',
      title: 'Arbitrage Detected',
      message: 'Price difference of 2.3% detected between Binance and Coinbase for ETH/USDT.',
      confidence: 89,
      priority: 'medium'
    }
  ];

  const generateNewInsight = () => {
    const randomInsight = sampleInsights[Math.floor(Math.random() * sampleInsights.length)];
    setCurrentInsight({
      ...randomInsight,
      confidence: Math.floor(Math.random() * 20) + 80,
    });
    setInsightHistory(prev => [randomInsight, ...prev.slice(0, 4)]);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'market': return <TrendingUp className="w-4 h-4" />;
      case 'portfolio': return <DollarSign className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      case 'opportunity': return <MessageCircle className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400/50';
      case 'medium': return 'text-yellow-400 border-yellow-400/50';
      case 'low': return 'text-blue-400 border-blue-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  useEffect(() => {
    generateNewInsight();
    const interval = setInterval(generateNewInsight, 45000);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss the floating AI assistant after 5 seconds
  useAutoWidgetDismiss(isVisible && !isMinimized, () => setIsVisible(false));

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 rounded-full w-12 h-12"
      >
        <Bot className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80">
      <Card className="bg-slate-900/95 border-purple-500/30 shadow-2xl backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-gray-400">Live Trading Intel</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {!isMinimized && currentInsight && (
            <>
              <div className={`mb-4 p-3 rounded-lg border bg-slate-800/50 ${getPriorityColor(currentInsight.priority)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {getInsightIcon(currentInsight.type)}
                    <span className="ml-2 text-sm font-medium text-white">{currentInsight.title}</span>
                  </div>
                  <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full">
                    {currentInsight.confidence}%
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{currentInsight.message}</p>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="h-6 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => {
                      toast({
                        title: "AI Recommendation",
                        description: "Navigating to trading dashboard",
                      });
                      window.location.href = '/trading';
                    }}
                  >
                    Act Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
                    onClick={() => generateNewInsight()}
                  >
                    More Analysis
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                  onClick={() => window.location.href = '/portfolio'}
                >
                  Portfolio Scan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-green-400/50 text-green-400 hover:bg-green-400/10"
                  onClick={() => window.location.href = '/markets'}
                >
                  Market Intel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FloatingAIAssistant;