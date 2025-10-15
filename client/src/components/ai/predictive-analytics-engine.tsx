import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PredictiveAnalyticsProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

interface PricePrediction {
  asset: string;
  currentPrice: number;
  predictions: {
    timeframe: string;
    price: number;
    confidence: number;
    change: number;
    trend: 'bullish' | 'bearish' | 'neutral';
  }[];
  mlModel: string;
  lastUpdated: Date;
}

interface MarketPattern {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timeframe: string;
  description: string;
  assets: string[];
  probability: number;
}

interface VolatilityForecast {
  asset: string;
  current: number;
  predicted: number;
  timeframe: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface SentimentData {
  asset: string;
  overall: number;
  social: number;
  news: number;
  technical: number;
  trend: 'improving' | 'declining' | 'stable';
}

export default function PredictiveAnalyticsEngine({ userTier = 'basic' }: PredictiveAnalyticsProps) {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [timeframe, setTimeframe] = useState('24h');
  const [predictions, setPredictions] = useState<PricePrediction[]>([]);
  const [patterns, setPatterns] = useState<MarketPattern[]>([]);
  const [volatilityForecasts, setVolatilityForecasts] = useState<VolatilityForecast[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const assets = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE', 'MATIC'];
  const timeframes = ['1h', '4h', '24h', '7d', '30d'];

  const modelCapabilities = {
    basic: ['Basic price trends', 'Simple predictions'],
    pro: ['Advanced ML models', 'Pattern recognition', 'Volatility forecasting'],
    premium: ['Deep learning models', 'Sentiment analysis', 'Multi-asset correlation'],
    elite: ['Custom AI models', 'Real-time learning', 'Institutional-grade predictions']
  };

  // Generate mock predictions
  useEffect(() => {
    const generatePredictions = () => {
      const newPredictions: PricePrediction[] = assets.map(asset => {
        const currentPrice = {
          BTC: 43250,
          ETH: 2680,
          SOL: 98,
          ADA: 0.52,
          DOT: 7.3,
          LINK: 15.2,
          UNI: 8.5,
          AAVE: 95,
          MATIC: 0.85
        }[asset] || 100;

        return {
          asset,
          currentPrice,
          predictions: [
            {
              timeframe: '1h',
              price: currentPrice * (1 + (Math.random() - 0.5) * 0.02),
              confidence: 85 + Math.random() * 10,
              change: (Math.random() - 0.5) * 2,
              trend: Math.random() > 0.5 ? 'bullish' : 'bearish'
            },
            {
              timeframe: '24h',
              price: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
              confidence: 75 + Math.random() * 15,
              change: (Math.random() - 0.5) * 10,
              trend: Math.random() > 0.4 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral'
            },
            {
              timeframe: '7d',
              price: currentPrice * (1 + (Math.random() - 0.5) * 0.25),
              confidence: 65 + Math.random() * 20,
              change: (Math.random() - 0.5) * 25,
              trend: Math.random() > 0.4 ? 'bullish' : Math.random() > 0.3 ? 'bearish' : 'neutral'
            }
          ],
          mlModel: userTier === 'basic' ? 'Linear Regression' : 
                   userTier === 'pro' ? 'Random Forest' :
                   userTier === 'premium' ? 'LSTM Neural Network' : 'Transformer Model',
          lastUpdated: new Date()
        };
      });
      setPredictions(newPredictions);
    };

    const generatePatterns = () => {
      const patternTypes = [
        { name: 'Double Bottom', type: 'bullish', description: 'Strong support level forming reversal pattern' },
        { name: 'Head and Shoulders', type: 'bearish', description: 'Classic reversal pattern indicating downtrend' },
        { name: 'Bull Flag', type: 'bullish', description: 'Continuation pattern in uptrend' },
        { name: 'Descending Triangle', type: 'bearish', description: 'Bearish continuation pattern' },
        { name: 'Cup and Handle', type: 'bullish', description: 'Long-term bullish reversal pattern' }
      ];

      const newPatterns: MarketPattern[] = patternTypes.map((pattern, index) => ({
        id: (index + 1).toString(),
        name: pattern.name,
        type: pattern.type as 'bullish' | 'bearish' | 'neutral',
        confidence: 70 + Math.random() * 25,
        timeframe: ['4h', '1d', '1w'][Math.floor(Math.random() * 3)],
        description: pattern.description,
        assets: assets.slice(0, Math.floor(Math.random() * 3) + 1),
        probability: 60 + Math.random() * 35
      }));
      setPatterns(newPatterns);
    };

    const generateVolatilityForecasts = () => {
      const forecasts: VolatilityForecast[] = assets.map(asset => ({
        asset,
        current: 15 + Math.random() * 25,
        predicted: 12 + Math.random() * 30,
        timeframe: '24h',
        confidence: 80 + Math.random() * 15,
        riskLevel: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
      }));
      setVolatilityForecasts(forecasts);
    };

    const generateSentimentData = () => {
      const sentiment: SentimentData[] = assets.map(asset => ({
        asset,
        overall: 30 + Math.random() * 40,
        social: 25 + Math.random() * 50,
        news: 20 + Math.random() * 60,
        technical: 40 + Math.random() * 30,
        trend: ['improving', 'declining', 'stable'][Math.floor(Math.random() * 3)] as any
      }));
      setSentimentData(sentiment);
    };

    generatePredictions();
    generatePatterns();
    generateVolatilityForecasts();
    generateSentimentData();

    const interval = setInterval(() => {
      generatePredictions();
      generateVolatilityForecasts();
      generateSentimentData();
    }, 15000);

    return () => clearInterval(interval);
  }, [userTier]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const selectedPrediction = predictions.find(p => p.asset === selectedAsset);
  const selectedVolatility = volatilityForecasts.find(v => v.asset === selectedAsset);
  const selectedSentiment = sentimentData.find(s => s.asset === selectedAsset);

  // Generate chart data for predictions
  const chartData = selectedPrediction ? [
    { time: 'Now', price: selectedPrediction.currentPrice },
    ...selectedPrediction.predictions.map(p => ({
      time: p.timeframe,
      price: p.price,
      confidence: p.confidence
    }))
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Predictive Analytics Engine
          </h1>
          <p className="text-gray-300">
            AI-powered market predictions and pattern recognition
          </p>
          <Badge variant="secondary" className="mt-2">
            {userTier?.toUpperCase()} Tier - {modelCapabilities[userTier]?.length || 0} ML Models
          </Badge>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assets.map((asset) => (
                <SelectItem key={asset} value={asset}>{asset}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((tf) => (
                <SelectItem key={tf} value={tf}>{tf}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
              </motion.div>
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>

        <Tabs defaultValue="predictions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="predictions">Price Predictions</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
            <TabsTrigger value="volatility">Volatility Forecast</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          </TabsList>

          {/* Price Predictions */}
          <TabsContent value="predictions" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span>{selectedAsset} Price Prediction</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPrediction && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          ${selectedPrediction.currentPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Current Price</div>
                      </div>

                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                            />
                            <Area
                              type="monotone"
                              dataKey="price"
                              stroke="#8B5CF6"
                              fill="url(#colorPrice)"
                              strokeWidth={2}
                            />
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-2">
                        {selectedPrediction.predictions.map((pred, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{pred.timeframe}</span>
                              <Badge variant={pred.trend === 'bullish' ? 'default' : 
                                             pred.trend === 'bearish' ? 'destructive' : 'secondary'}>
                                {pred.trend}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${pred.price.toFixed(2)}</div>
                              <div className={`text-sm ${pred.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {pred.change >= 0 ? '+' : ''}{pred.change.toFixed(2)}%
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Confidence</div>
                              <div className="text-sm font-medium">{pred.confidence.toFixed(0)}%</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-center text-sm text-gray-400">
                        Model: {selectedPrediction.mlModel} • Updated: {selectedPrediction.lastUpdated.toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span>All Assets Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {predictions.map((prediction) => {
                      const dayPred = prediction.predictions.find(p => p.timeframe === '24h');
                      return (
                        <div key={prediction.asset} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{prediction.asset}</span>
                            <span className="text-sm text-gray-400">
                              ${prediction.currentPrice.toLocaleString()}
                            </span>
                          </div>
                          {dayPred && (
                            <div className="flex items-center space-x-3">
                              <div className={`text-sm ${dayPred.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {dayPred.change >= 0 ? '+' : ''}{dayPred.change.toFixed(1)}%
                              </div>
                              <Progress value={dayPred.confidence} className="w-16 h-2" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pattern Recognition */}
          <TabsContent value="patterns" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patterns.map((pattern) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{pattern.name}</span>
                        <Badge variant={
                          pattern.type === 'bullish' ? 'default' :
                          pattern.type === 'bearish' ? 'destructive' : 'secondary'
                        }>
                          {pattern.type}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-400">{pattern.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Confidence</span>
                          <span className="font-medium">{pattern.confidence.toFixed(0)}%</span>
                        </div>
                        <Progress value={pattern.confidence} className="h-2" />

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Probability</span>
                          <span className="font-medium">{pattern.probability.toFixed(0)}%</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm">Timeframe</span>
                          <span className="font-medium">{pattern.timeframe}</span>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-2">Detected in:</div>
                          <div className="flex flex-wrap gap-1">
                            {pattern.assets.map((asset) => (
                              <Badge key={asset} variant="outline" className="text-xs">
                                {asset}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Volatility Forecast */}
          <TabsContent value="volatility" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-orange-400" />
                    <span>{selectedAsset} Volatility Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedVolatility && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold">{selectedVolatility.current.toFixed(1)}%</div>
                          <div className="text-sm text-gray-400">Current Volatility</div>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold">{selectedVolatility.predicted.toFixed(1)}%</div>
                          <div className="text-sm text-gray-400">Predicted ({selectedVolatility.timeframe})</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Risk Level</span>
                        <Badge variant={
                          selectedVolatility.riskLevel === 'low' ? 'default' :
                          selectedVolatility.riskLevel === 'medium' ? 'secondary' : 'destructive'
                        }>
                          {selectedVolatility.riskLevel.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Model Confidence</span>
                        <span className="font-medium">{selectedVolatility.confidence.toFixed(0)}%</span>
                      </div>
                      <Progress value={selectedVolatility.confidence} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span>Volatility Rankings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {volatilityForecasts
                      .sort((a, b) => b.predicted - a.predicted)
                      .map((forecast, index) => (
                        <div key={forecast.asset} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium w-8">#{index + 1}</span>
                            <span className="font-medium">{forecast.asset}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm">{forecast.predicted.toFixed(1)}%</span>
                            <Badge variant={
                              forecast.riskLevel === 'low' ? 'default' :
                              forecast.riskLevel === 'medium' ? 'secondary' : 'destructive'
                            } className="text-xs">
                              {forecast.riskLevel}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sentiment Analysis */}
          <TabsContent value="sentiment" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>{selectedAsset} Sentiment Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSentiment && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{selectedSentiment.overall.toFixed(0)}</div>
                        <div className="text-sm text-gray-400">Overall Sentiment Score</div>
                        <Badge variant={selectedSentiment.trend === 'improving' ? 'default' :
                                       selectedSentiment.trend === 'declining' ? 'destructive' : 'secondary'}>
                          {selectedSentiment.trend}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Social Media</span>
                            <span className="text-sm font-medium">{selectedSentiment.social.toFixed(0)}</span>
                          </div>
                          <Progress value={selectedSentiment.social} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">News Coverage</span>
                            <span className="text-sm font-medium">{selectedSentiment.news.toFixed(0)}</span>
                          </div>
                          <Progress value={selectedSentiment.news} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Technical Analysis</span>
                            <span className="text-sm font-medium">{selectedSentiment.technical.toFixed(0)}</span>
                          </div>
                          <Progress value={selectedSentiment.technical} className="h-2" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>Market Sentiment Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sentimentData
                      .sort((a, b) => b.overall - a.overall)
                      .map((sentiment, index) => (
                        <div key={sentiment.asset} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{sentiment.asset}</span>
                            <Badge variant={sentiment.trend === 'improving' ? 'default' :
                                           sentiment.trend === 'declining' ? 'destructive' : 'secondary'} 
                                   className="text-xs">
                              {sentiment.trend}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{sentiment.overall.toFixed(0)}/100</div>
                            <Progress value={sentiment.overall} className="w-16 h-1 mt-1" />
                          </div>
                        </div>
                      ))}
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