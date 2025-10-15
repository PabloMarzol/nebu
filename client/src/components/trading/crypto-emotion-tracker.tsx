import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";

interface EmotionData {
  symbol: string;
  sentiment: "bullish" | "bearish" | "neutral";
  intensity: number;
  fear: number;
  greed: number;
  volume: number;
  socialMentions: number;
  trend: "rising" | "falling" | "stable";
}

export default function CryptoEmotionTracker() {
  const [emotions, setEmotions] = useState<EmotionData[]>([
    {
      symbol: "BTC",
      sentiment: "bullish",
      intensity: 78,
      fear: 25,
      greed: 75,
      volume: 85,
      socialMentions: 12450,
      trend: "rising"
    },
    {
      symbol: "ETH",
      sentiment: "bullish",
      intensity: 65,
      fear: 35,
      greed: 65,
      volume: 72,
      socialMentions: 8920,
      trend: "rising"
    },
    {
      symbol: "SOL",
      sentiment: "neutral",
      intensity: 45,
      fear: 50,
      greed: 50,
      volume: 58,
      socialMentions: 3240,
      trend: "stable"
    },
    {
      symbol: "ADA",
      sentiment: "bearish",
      intensity: 30,
      fear: 70,
      greed: 30,
      volume: 42,
      socialMentions: 1890,
      trend: "falling"
    }
  ]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "text-green-400";
      case "bearish": return "text-red-400";
      default: return "text-yellow-400";
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity > 70) return "bg-red-500";
    if (intensity > 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Real-time sentiment heat map
  const heatMapData = [
    { name: "Fear", value: 32, color: "bg-red-500" },
    { name: "Greed", value: 68, color: "bg-green-500" },
    { name: "FOMO", value: 45, color: "bg-yellow-500" },
    { name: "Euphoria", value: 78, color: "bg-purple-500" },
    { name: "Panic", value: 15, color: "bg-red-600" },
    { name: "Optimism", value: 62, color: "bg-blue-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setEmotions(prev => prev.map(emotion => ({
        ...emotion,
        intensity: Math.max(0, Math.min(100, emotion.intensity + (Math.random() - 0.5) * 10)),
        fear: Math.max(0, Math.min(100, emotion.fear + (Math.random() - 0.5) * 8)),
        greed: Math.max(0, Math.min(100, emotion.greed + (Math.random() - 0.5) * 8)),
        socialMentions: emotion.socialMentions + Math.floor((Math.random() - 0.5) * 100)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span>Real-Time Sentiment Heat Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {heatMapData.map((item, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-slate-800/50">
                <div className="text-lg font-bold mb-2">{item.name}</div>
                <div className={`h-3 rounded-full ${item.color} mb-2`} 
                     style={{ width: `${item.value}%`, margin: '0 auto' }} />
                <div className="text-sm text-muted-foreground">{item.value}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Crypto Emotion Tracker</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emotions.map((emotion) => (
              <div key={emotion.symbol} className="p-4 rounded-lg bg-slate-800/30 border border-purple-500/20">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold">{emotion.symbol}</div>
                    <Badge className={getSentimentColor(emotion.sentiment)}>
                      {emotion.sentiment.toUpperCase()}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {emotion.trend === "rising" && <TrendingUp className="w-4 h-4 text-green-400" />}
                      {emotion.trend === "falling" && <TrendingDown className="w-4 h-4 text-red-400" />}
                      {emotion.trend === "stable" && <div className="w-4 h-1 bg-yellow-400 rounded" />}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {emotion.socialMentions.toLocaleString()} mentions
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Intensity</div>
                    <Progress value={emotion.intensity} className="h-2" />
                    <div className="text-xs mt-1">{emotion.intensity}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Fear Index</div>
                    <Progress value={emotion.fear} className="h-2" />
                    <div className="text-xs mt-1 text-red-400">{emotion.fear}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Greed Index</div>
                    <Progress value={emotion.greed} className="h-2" />
                    <div className="text-xs mt-1 text-green-400">{emotion.greed}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Volume</div>
                    <Progress value={emotion.volume} className="h-2" />
                    <div className="text-xs mt-1">{emotion.volume}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}