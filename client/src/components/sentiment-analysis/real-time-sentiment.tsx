import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Activity, Brain, Globe, Twitter, MessageCircle, Newspaper } from 'lucide-react';

interface SentimentData {
  asset: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  source: string;
  rawData: string;
  marketImpact: number;
  timestamp: Date;
}

interface AssetSentiment {
  asset: string;
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  sources: {
    twitter: number;
    reddit: number;
    news: number;
    social: number;
  };
  volume: number;
  trend: number;
  marketImpact: number;
}

const RealTimeSentimentAnalysis: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [assetSentiments, setAssetSentiments] = useState<AssetSentiment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time sentiment data
  useEffect(() => {
    const generateMockSentimentData = (): SentimentData[] => {
      const assets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'];
      const sources = ['twitter', 'reddit', 'news', 'social'];
      const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];

      return Array.from({ length: 15 }, (_, i) => ({
        asset: assets[Math.floor(Math.random() * assets.length)],
        sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
        confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
        source: sources[Math.floor(Math.random() * sources.length)],
        rawData: generateMockText(),
        marketImpact: (Math.random() - 0.5) * 10, // -5 to +5
        timestamp: new Date(Date.now() - Math.random() * 3600000) // Last hour
      }));
    };

    const generateMockText = (): string => {
      const texts = [
        "Bitcoin showing strong institutional adoption signals",
        "Ethereum merge driving positive sentiment across DeFi",
        "Regulatory uncertainty creating bearish pressure",
        "Whale accumulation patterns suggest bullish momentum",
        "Technical analysis indicating potential breakout",
        "Market correlation with traditional assets weakening",
        "On-chain metrics showing increased network activity",
        "Social media buzz reaching monthly highs"
      ];
      return texts[Math.floor(Math.random() * texts.length)];
    };

    const updateSentimentData = () => {
      setIsLoading(true);
      setTimeout(() => {
        const newData = generateMockSentimentData();
        setSentimentData(newData);
        
        // Aggregate by asset
        const assetMap = new Map<string, SentimentData[]>();
        newData.forEach(item => {
          if (!assetMap.has(item.asset)) {
            assetMap.set(item.asset, []);
          }
          assetMap.get(item.asset)!.push(item);
        });

        const aggregated: AssetSentiment[] = Array.from(assetMap.entries()).map(([asset, data]) => {
          const bullish = data.filter(d => d.sentiment === 'bullish').length;
          const bearish = data.filter(d => d.sentiment === 'bearish').length;
          const neutral = data.filter(d => d.sentiment === 'neutral').length;
          
          let overallSentiment: 'bullish' | 'bearish' | 'neutral';
          if (bullish > bearish && bullish > neutral) overallSentiment = 'bullish';
          else if (bearish > bullish && bearish > neutral) overallSentiment = 'bearish';
          else overallSentiment = 'neutral';

          const avgConfidence = data.reduce((sum, d) => sum + d.confidence, 0) / data.length;
          const avgMarketImpact = data.reduce((sum, d) => sum + d.marketImpact, 0) / data.length;

          return {
            asset,
            overallSentiment,
            confidence: avgConfidence,
            sources: {
              twitter: data.filter(d => d.source === 'twitter').length,
              reddit: data.filter(d => d.source === 'reddit').length,
              news: data.filter(d => d.source === 'news').length,
              social: data.filter(d => d.source === 'social').length
            },
            volume: data.length,
            trend: Math.random() * 20 - 10, // -10 to +10
            marketImpact: avgMarketImpact
          };
        });

        setAssetSentiments(aggregated);
        setIsLoading(false);
      }, 1000);
    };

    updateSentimentData();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(updateSentimentData, 30000); // Update every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-500';
      case 'bearish': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />;
      case 'bearish': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'reddit': return <MessageCircle className="w-4 h-4" />;
      case 'news': return <Newspaper className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const selectedAssetData = assetSentiments.find(a => a.asset === selectedAsset);
  const filteredSentimentData = sentimentData.filter(d => d.asset === selectedAsset);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Real-Time Sentiment Analysis
            </h2>
            <p className="text-gray-400">AI-powered market sentiment tracking from multiple sources</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assetSentiments.map(asset => (
                <SelectItem key={asset.asset} value={asset.asset}>
                  {asset.asset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? "Auto ON" : "Auto OFF"}
          </Button>
        </div>
      </div>

      {/* Asset Overview */}
      {selectedAssetData && (
        <Card className="bg-black/20 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl">{selectedAsset} Sentiment Overview</span>
              <Badge 
                variant="secondary" 
                className={`${getSentimentColor(selectedAssetData.overallSentiment)} bg-opacity-20`}
              >
                {getSentimentIcon(selectedAssetData.overallSentiment)}
                <span className="ml-1 capitalize">{selectedAssetData.overallSentiment}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {(selectedAssetData.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {selectedAssetData.volume}
                </div>
                <div className="text-sm text-gray-400">Mentions</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${selectedAssetData.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedAssetData.trend >= 0 ? '+' : ''}{selectedAssetData.trend.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">24h Trend</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${selectedAssetData.marketImpact >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {selectedAssetData.marketImpact >= 0 ? '+' : ''}{selectedAssetData.marketImpact.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Impact Score</div>
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Source Distribution</h4>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(selectedAssetData.sources).map(([source, count]) => (
                  <div key={source} className="text-center p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {getSourceIcon(source)}
                    </div>
                    <div className="text-lg font-bold text-white">{count}</div>
                    <div className="text-xs text-gray-400 capitalize">{source}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Feed */}
      <Card className="bg-black/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Sentiment Feed - {selectedAsset}</span>
            {isLoading && <div className="animate-spin w-4 h-4 border-2 border-purple-500 rounded-full border-t-transparent" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredSentimentData.map((item, index) => (
              <div key={index} className="p-4 bg-gray-800/30 rounded-lg border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className={getSentimentColor(item.sentiment)}>
                      {getSentimentIcon(item.sentiment)}
                      <span className="ml-1 capitalize">{item.sentiment}</span>
                    </Badge>
                    <div className="flex items-center space-x-1 text-gray-400">
                      {getSourceIcon(item.source)}
                      <span className="text-sm capitalize">{item.source}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2">{item.rawData}</p>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Confidence: {(item.confidence * 100).toFixed(1)}%</span>
                  <span>Impact: {item.marketImpact >= 0 ? '+' : ''}{item.marketImpact.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Impact Heatmap */}
      <Card className="bg-black/20 border-purple-500/20">
        <CardHeader>
          <CardTitle>Market Impact Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {assetSentiments.map((asset) => (
              <div
                key={asset.asset}
                className={`p-4 rounded-lg text-center cursor-pointer transition-all ${
                  asset.asset === selectedAsset ? 'ring-2 ring-purple-500' : ''
                } ${
                  asset.marketImpact >= 2 ? 'bg-green-500/20 border border-green-500/30' :
                  asset.marketImpact <= -2 ? 'bg-red-500/20 border border-red-500/30' :
                  'bg-yellow-500/20 border border-yellow-500/30'
                }`}
                onClick={() => setSelectedAsset(asset.asset)}
              >
                <div className="font-bold text-lg">{asset.asset}</div>
                <div className={`text-sm ${getSentimentColor(asset.overallSentiment)}`}>
                  {asset.overallSentiment.toUpperCase()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Impact: {asset.marketImpact >= 0 ? '+' : ''}{asset.marketImpact.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeSentimentAnalysis;