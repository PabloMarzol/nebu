import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

interface SentimentData {
  symbol: string;
  sentiment: 'extremely_bullish' | 'bullish' | 'neutral' | 'bearish' | 'extremely_bearish';
  score: number;
  emoji: string;
  change24h: number;
  volume: number;
  socialMentions: number;
  fearGreedIndex: number;
  volatility: number;
  color: string;
  bgColor: string;
}

const sentimentEmojis = {
  extremely_bullish: '🚀',
  bullish: '😊',
  neutral: '😐',
  bearish: '😰',
  extremely_bearish: '💀'
};

const sentimentColors = {
  extremely_bullish: { color: 'text-green-400', bg: 'bg-green-500/20' },
  bullish: { color: 'text-green-300', bg: 'bg-green-500/10' },
  neutral: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  bearish: { color: 'text-red-300', bg: 'bg-red-500/10' },
  extremely_bearish: { color: 'text-red-400', bg: 'bg-red-500/20' }
};

export function MarketSentimentIndicator() {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    generateSentimentData();
    const interval = setInterval(generateSentimentData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const generateSentimentData = () => {
    const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'AVAX', 'MATIC', 'LINK'];
    const sentiments: (keyof typeof sentimentEmojis)[] = ['extremely_bullish', 'bullish', 'neutral', 'bearish', 'extremely_bearish'];
    
    const data: SentimentData[] = symbols.map(symbol => {
      const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      const score = Math.floor(Math.random() * 100);
      const change24h = (Math.random() - 0.5) * 20;
      const volume = Math.floor(Math.random() * 1000000000);
      const socialMentions = Math.floor(Math.random() * 10000);
      const fearGreedIndex = Math.floor(Math.random() * 100);
      const volatility = Math.floor(Math.random() * 50);
      
      return {
        symbol,
        sentiment,
        score,
        emoji: sentimentEmojis[sentiment],
        change24h,
        volume,
        socialMentions,
        fearGreedIndex,
        volatility,
        color: sentimentColors[sentiment].color,
        bgColor: sentimentColors[sentiment].bg
      };
    });

    setSentimentData(data);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const getOverallSentiment = () => {
    if (sentimentData.length === 0) return { emoji: '😐', text: 'Neutral', score: 50 };
    
    const avgScore = sentimentData.reduce((sum, item) => sum + item.score, 0) / sentimentData.length;
    
    if (avgScore >= 80) return { emoji: '🚀', text: 'Extremely Bullish', score: avgScore };
    if (avgScore >= 60) return { emoji: '😊', text: 'Bullish', score: avgScore };
    if (avgScore >= 40) return { emoji: '😐', text: 'Neutral', score: avgScore };
    if (avgScore >= 20) return { emoji: '😰', text: 'Bearish', score: avgScore };
    return { emoji: '💀', text: 'Extremely Bearish', score: avgScore };
  };

  const overallSentiment = getOverallSentiment();

  const renderSentimentCard = (data: SentimentData) => (
    <Card 
      key={data.symbol} 
      className={`${data.bgColor} border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            {data.symbol}
            <span className="text-2xl animate-pulse">{data.emoji}</span>
          </CardTitle>
          <Badge variant="outline" className={`${data.color} border-current`}>
            {data.sentiment.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Sentiment Score</span>
            <span className={`text-sm font-bold ${data.color}`}>{data.score}/100</span>
          </div>
          <Progress value={data.score} className="h-2 bg-slate-800" />
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">24h Change</span>
              <span className={data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Volume</span>
              <span className="text-slate-300">${(data.volume / 1000000).toFixed(1)}M</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Social</span>
              <span className="text-slate-300">{(data.socialMentions / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Volatility</span>
              <span className="text-slate-300">{data.volatility}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
          <Activity className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-400">
            Fear & Greed: {data.fearGreedIndex}
          </span>
          <Progress value={data.fearGreedIndex} className="h-1 bg-slate-800 flex-1" />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading market sentiment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Activity className="w-8 h-8 text-purple-400" />
                Market Sentiment
              </h1>
              <p className="text-slate-300 mt-2">
                Real-time emotional indicators for cryptocurrency markets
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Last updated</div>
              <div className="text-slate-300">{lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Overall Sentiment */}
          <Card className="mb-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <span className="text-4xl animate-bounce">{overallSentiment.emoji}</span>
                Overall Market Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {overallSentiment.score.toFixed(0)}/100
                  </div>
                  <div className="text-purple-300 text-lg">
                    {overallSentiment.text}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {sentimentData.filter(d => d.sentiment.includes('bullish')).length}
                  </div>
                  <div className="text-green-300">
                    Bullish Assets
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {sentimentData.filter(d => d.sentiment.includes('bearish')).length}
                  </div>
                  <div className="text-red-300">
                    Bearish Assets
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={overallSentiment.score} className="h-3 bg-slate-800" />
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Legend */}
          <div className="flex flex-wrap gap-3 mb-6">
            {Object.entries(sentimentEmojis).map(([key, emoji]) => (
              <Badge 
                key={key} 
                variant="outline" 
                className={`${sentimentColors[key as keyof typeof sentimentColors].color} border-current`}
              >
                <span className="mr-2">{emoji}</span>
                {key.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        {/* Individual Asset Sentiment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sentimentData.map(renderSentimentCard)}
        </div>

        {/* Sentiment Insights */}
        <Card className="mt-8 bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  {sentimentData.filter(d => d.change24h > 0).length}
                </div>
                <div className="text-slate-300">Assets Up 24h</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {Math.round(sentimentData.reduce((sum, d) => sum + d.volatility, 0) / sentimentData.length)}%
                </div>
                <div className="text-slate-300">Avg Volatility</div>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-400 mb-2">
                  {Math.round(sentimentData.reduce((sum, d) => sum + d.fearGreedIndex, 0) / sentimentData.length)}
                </div>
                <div className="text-slate-300">Fear & Greed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}