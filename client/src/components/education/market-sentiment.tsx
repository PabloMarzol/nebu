import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Brain, MessageSquare, Users, Globe } from 'lucide-react';

interface SentimentData {
  overall: number;
  fear: number;
  greed: number;
  confidence: number;
  sources: {
    social: number;
    news: number;
    whale: number;
    retail: number;
  };
  translation: string;
  recommendation: string;
  emoji: string;
  color: string;
}

interface SentimentSource {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
  icon: React.ReactNode;
}

export default function MarketSentimentTranslation() {
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'simple' | 'technical' | 'emotional'>('simple');

  const generateSentimentAnalysis = (): SentimentData => {
    const fear = Math.random() * 50;
    const greed = Math.random() * 50 + 50;
    const overall = (greed - fear + 50) / 100 * 100;
    
    const social = Math.random() * 100;
    const news = Math.random() * 100;
    const whale = Math.random() * 100;
    const retail = Math.random() * 100;
    
    const confidence = (social + news + whale + retail) / 4;

    let translation, recommendation, emoji, color;
    
    if (overall > 75) {
      translation = "The market is feeling SUPER excited! 🚀 People are buying like crazy and everyone thinks prices will go up. It's like Black Friday for crypto!";
      recommendation = "Be careful - when everyone is too excited, prices might drop soon. Maybe take some profits?";
      emoji = "🤑";
      color = "text-green-400";
    } else if (overall > 60) {
      translation = "Market vibes are pretty good! 😊 People are optimistic and there's steady buying happening. It feels like a nice sunny day.";
      recommendation = "Good time to stick with your plan. Maybe add a little more to your favorite coins.";
      emoji = "😊";
      color = "text-blue-400";
    } else if (overall > 40) {
      translation = "Markets are kinda meh right now 😐 People can't decide if they should buy or sell. It's like everyone's waiting for something to happen.";
      recommendation = "Perfect time to be patient. Wait for clearer signals before making big moves.";
      emoji = "😐";
      color = "text-yellow-400";
    } else if (overall > 25) {
      translation = "People are getting worried 😰 There's more selling than buying and folks are nervous about losing money. It's like a cloudy day.";
      recommendation = "Stay calm! This might be a good time to buy quality coins at lower prices.";
      emoji = "😰";
      color = "text-orange-400";
    } else {
      translation = "Everyone is REALLY scared! 😱 People are panic selling and think everything will crash. It's like a storm hit the market.";
      recommendation = "Don't panic sell! This is often when smart money starts buying. Consider it a big sale.";
      emoji = "😱";
      color = "text-red-400";
    }

    return {
      overall,
      fear,
      greed,
      confidence,
      sources: { social, news, whale, retail },
      translation,
      recommendation,
      emoji,
      color
    };
  };

  const getSentimentSources = (data: SentimentData): SentimentSource[] => {
    return [
      {
        name: 'Social Media',
        value: data.sources.social,
        trend: data.sources.social > 60 ? 'up' : data.sources.social < 40 ? 'down' : 'neutral',
        description: 'Twitter, Reddit, Discord sentiment',
        icon: <MessageSquare className="w-4 h-4" />
      },
      {
        name: 'News Sentiment',
        value: data.sources.news,
        trend: data.sources.news > 60 ? 'up' : data.sources.news < 40 ? 'down' : 'neutral',
        description: 'Media coverage and articles',
        icon: <Globe className="w-4 h-4" />
      },
      {
        name: 'Whale Activity',
        value: data.sources.whale,
        trend: data.sources.whale > 60 ? 'up' : data.sources.whale < 40 ? 'down' : 'neutral',
        description: 'Large wallet movements',
        icon: <TrendingUp className="w-4 h-4" />
      },
      {
        name: 'Retail Sentiment',
        value: data.sources.retail,
        trend: data.sources.retail > 60 ? 'up' : data.sources.retail < 40 ? 'down' : 'neutral',
        description: 'Small investor behavior',
        icon: <Users className="w-4 h-4" />
      }
    ];
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />;
      case 'down': return <TrendingDown className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getTranslation = (data: SentimentData) => {
    switch (currentLanguage) {
      case 'simple':
        return data.translation;
      case 'technical':
        return `Market sentiment index at ${data.overall.toFixed(1)}%. Fear & Greed ratio showing ${data.greed > data.fear ? 'greed dominance' : 'fear dominance'} with ${data.confidence.toFixed(1)}% confidence level across aggregated data sources.`;
      case 'emotional':
        return `The crypto community is feeling ${data.overall > 50 ? 'hopeful and energetic' : 'anxious and uncertain'}. ${data.emoji} There's a ${data.overall > 50 ? 'bullish' : 'bearish'} energy in the air, and ${data.overall > 75 ? 'everyone wants in' : data.overall < 25 ? 'people are running for the exits' : 'folks are playing it safe'}.`;
      default:
        return data.translation;
    }
  };

  const analyzeSentiment = async () => {
    setIsAnalyzing(true);
    
    // Simulate real-time analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const analysis = generateSentimentAnalysis();
    setSentimentData(analysis);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    analyzeSentiment();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white">Market Sentiment Translator</CardTitle>
                <p className="text-gray-400">Real-time market psychology in plain English</p>
              </div>
            </div>
            <Button
              onClick={analyzeSentiment}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isAnalyzing ? 'Reading the Room...' : 'Refresh Sentiment'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Language Toggle */}
      <Card className="bg-gray-900/40 border-gray-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Translation Style:</span>
            <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
              {(['simple', 'technical', 'emotional'] as const).map((style) => (
                <Button
                  key={style}
                  variant={currentLanguage === style ? 'default' : 'ghost'}
                  size="sm"
                  className={`${currentLanguage === style ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                  onClick={() => setCurrentLanguage(style)}
                >
                  {style === 'simple' ? '🔤 Simple' : 
                   style === 'technical' ? '📊 Technical' : 
                   '❤️ Emotional'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing ? (
        <Card className="bg-gray-900/40 border-gray-500/20">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Analyzing thousands of data points across social media, news, and on-chain metrics...</p>
          </CardContent>
        </Card>
      ) : sentimentData && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* Main Sentiment Display */}
          <Card className="bg-gradient-to-br from-gray-900/40 to-black/40 border-gray-500/20">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{sentimentData.emoji}</div>
                <div className={`text-3xl font-bold mb-2 ${sentimentData.color}`}>
                  {sentimentData.overall.toFixed(0)}%
                </div>
                <div className="text-gray-400 mb-4">Market Sentiment Score</div>
                
                <div className="max-w-2xl mx-auto">
                  <div className="p-4 bg-black/20 rounded-lg border border-purple-500/20 mb-4">
                    <p className="text-gray-300 leading-relaxed">
                      {getTranslation(sentimentData)}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <h4 className="font-semibold text-blue-400 mb-2">What should you do?</h4>
                    <p className="text-gray-300 text-sm">
                      {sentimentData.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sentiment Breakdown */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-500/20">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {sentimentData.fear.toFixed(0)}%
                  </div>
                  <div className="text-red-300 text-sm">Fear Level</div>
                  <Progress value={sentimentData.fear} className="mt-2 h-2" />
                </div>
                <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {sentimentData.greed.toFixed(0)}%
                  </div>
                  <div className="text-green-300 text-sm">Greed Level</div>
                  <Progress value={sentimentData.greed} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Sources */}
          <Card className="bg-gray-900/40 border-gray-500/20">
            <CardHeader>
              <CardTitle className="text-white">Sentiment Sources Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getSentimentSources(sentimentData).map((source, index) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {source.icon}
                        <span className="font-semibold text-white">{source.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`font-bold ${getTrendColor(source.trend)}`}>
                          {source.value.toFixed(0)}%
                        </span>
                        <div className={getTrendColor(source.trend)}>
                          {getTrendIcon(source.trend)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${
                          source.trend === 'up' ? 'bg-green-500' :
                          source.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${source.value}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">{source.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historical Context */}
          <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardContent className="p-6">
              <h4 className="font-semibold text-white mb-4">Historical Context</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-400">Bull Markets</div>
                  <div className="text-sm text-gray-400">Usually 70-90% sentiment</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-400">Neutral Markets</div>
                  <div className="text-sm text-gray-400">Usually 40-60% sentiment</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-400">Bear Markets</div>
                  <div className="text-sm text-gray-400">Usually 10-30% sentiment</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}