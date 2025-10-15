import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Smile, Frown, Meh, Zap, Heart, Flame } from "lucide-react";

interface MarketMood {
  sentiment: "euphoric" | "bullish" | "neutral" | "bearish" | "panic" | "despair";
  emoji: string;
  description: string;
  color: string;
  intensity: number;
  whimsicalPhrase: string;
  advice: string;
  bgGradient: string;
}

interface CryptoMoodData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  mood: MarketMood;
  socialBuzz: number;
  fearGreedIndex: number;
}

export default function MarketMoodTranslator() {
  const [selectedCrypto, setSelectedCrypto] = useState<string>("BTC");
  const [animationKey, setAnimationKey] = useState(0);

  const marketMoods: MarketMood[] = [
    {
      sentiment: "euphoric",
      emoji: "🚀🌙",
      description: "To the Moon!",
      color: "text-green-400",
      intensity: 100,
      whimsicalPhrase: "Rocket fuel engaged, moon boots on!",
      advice: "HODL tight, we're going interstellar!",
      bgGradient: "from-green-400 to-emerald-600"
    },
    {
      sentiment: "bullish",
      emoji: "🐂💪",
      description: "Bull Rampage",
      color: "text-green-300",
      intensity: 75,
      whimsicalPhrase: "Bulls are charging with diamond horns!",
      advice: "Ride the bull, but keep your safety helmet on!",
      bgGradient: "from-green-300 to-green-500"
    },
    {
      sentiment: "neutral",
      emoji: "😐📊",
      description: "Chill Vibes",
      color: "text-gray-400",
      intensity: 50,
      whimsicalPhrase: "Market's having a zen meditation session",
      advice: "Perfect time for DCA and chill",
      bgGradient: "from-gray-400 to-gray-600"
    },
    {
      sentiment: "bearish",
      emoji: "🐻❄️",
      description: "Bear Hibernation",
      color: "text-red-300",
      intensity: 25,
      whimsicalPhrase: "Bears brought the winter coat collection",
      advice: "Time to stack sats and stay cozy",
      bgGradient: "from-red-300 to-red-500"
    },
    {
      sentiment: "panic",
      emoji: "😱🔥",
      description: "Chaos Mode",
      color: "text-red-400",
      intensity: 15,
      whimsicalPhrase: "Everything is fine... *sips coffee in burning room*",
      advice: "This too shall pass. Diamond hands activated!",
      bgGradient: "from-red-400 to-red-600"
    },
    {
      sentiment: "despair",
      emoji: "💀⚰️",
      description: "Crypto Winter",
      color: "text-purple-400",
      intensity: 5,
      whimsicalPhrase: "Winter is here, but spring always follows",
      advice: "Perfect accumulation weather. Stay strong!",
      bgGradient: "from-purple-400 to-purple-600"
    }
  ];

  const cryptoData: CryptoMoodData[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 67420,
      change24h: 8.5,
      mood: marketMoods[1], // bullish
      socialBuzz: 85,
      fearGreedIndex: 72
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 3850,
      change24h: 12.3,
      mood: marketMoods[0], // euphoric
      socialBuzz: 92,
      fearGreedIndex: 78
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 195,
      change24h: -2.1,
      mood: marketMoods[2], // neutral
      socialBuzz: 65,
      fearGreedIndex: 58
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      price: 0.385,
      change24h: 15.7,
      mood: marketMoods[0], // euphoric
      socialBuzz: 98,
      fearGreedIndex: 85
    }
  ];

  const selectedData = cryptoData.find(crypto => crypto.symbol === selectedCrypto) || cryptoData[0];

  const getMoodBasedAnimation = (mood: MarketMood) => {
    switch (mood.sentiment) {
      case "euphoric":
        return "animate-bounce";
      case "bullish":
        return "animate-pulse";
      case "bearish":
        return "animate-ping";
      case "panic":
        return "animate-spin";
      default:
        return "";
    }
  };

  const getRandomWhimsicalUpdate = () => {
    const phrases = [
      "Market spirits are dancing!",
      "The crypto gods have spoken!",
      "Blockchain magic is happening!",
      "Digital fortune cookies incoming!",
      "Satoshi's wisdom flows through the charts!"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="text-2xl animate-spin-slow">🎭</div>
          <span>Whimsical Market Mood Translator</span>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            Live Vibes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Crypto Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {cryptoData.map((crypto) => (
            <Button
              key={crypto.symbol}
              variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
              onClick={() => setSelectedCrypto(crypto.symbol)}
              className="glass flex flex-col h-16 p-2"
            >
              <div className="text-sm font-bold">{crypto.symbol}</div>
              <div className={`text-xs ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(1)}%
              </div>
            </Button>
          ))}
        </div>

        {/* Main Mood Display */}
        <Card className={`glass-strong bg-gradient-to-br ${selectedData.mood.bgGradient} bg-opacity-20`}>
          <CardContent className="p-6 text-center">
            <div 
              key={animationKey}
              className={`text-6xl mb-4 ${getMoodBasedAnimation(selectedData.mood)}`}
            >
              {selectedData.mood.emoji}
            </div>
            
            <h3 className={`text-2xl font-bold mb-2 ${selectedData.mood.color}`}>
              {selectedData.mood.description}
            </h3>
            
            <p className="text-lg text-muted-foreground mb-4 italic">
              "{selectedData.mood.whimsicalPhrase}"
            </p>
            
            <div className="bg-black/20 rounded-lg p-4 mb-4">
              <div className="text-sm text-yellow-400 mb-2">🔮 Mood Oracle Says:</div>
              <p className="text-white">{selectedData.mood.advice}</p>
            </div>

            {/* Mood Intensity Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vibe Intensity</span>
                <span className={selectedData.mood.color}>{selectedData.mood.intensity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${selectedData.mood.bgGradient} transition-all duration-1000`}
                  style={{ width: `${selectedData.mood.intensity}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Sentiment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-strong">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm text-muted-foreground">Social Buzz</div>
              <div className="text-lg font-bold text-blue-400">{selectedData.socialBuzz}%</div>
              <div className="text-xs text-muted-foreground">
                {selectedData.socialBuzz > 80 ? "🔥 Trending!" : 
                 selectedData.socialBuzz > 60 ? "📈 Active" : "😴 Quiet"}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-strong">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm text-muted-foreground">Fear & Greed</div>
              <div className="text-lg font-bold text-purple-400">{selectedData.fearGreedIndex}</div>
              <div className="text-xs text-muted-foreground">
                {selectedData.fearGreedIndex > 75 ? "🤑 Extreme Greed" : 
                 selectedData.fearGreedIndex > 55 ? "😊 Greed" :
                 selectedData.fearGreedIndex > 45 ? "😐 Neutral" : 
                 selectedData.fearGreedIndex > 25 ? "😰 Fear" : "😱 Extreme Fear"}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-strong">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-sm text-muted-foreground">Price Action</div>
              <div className={`text-lg font-bold ${selectedData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${selectedData.price.toLocaleString()}
              </div>
              <div className={`text-xs ${selectedData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {selectedData.change24h >= 0 ? '↗️' : '↘️'} {Math.abs(selectedData.change24h).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood History Timeline */}
        <Card className="glass-strong">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold mb-4 flex items-center">
              <span className="mr-2">📅</span>
              24H Mood Journey
            </h4>
            <div className="flex justify-between items-start gap-3 overflow-x-auto pb-2">
              {[
                { time: "6h ago", emoji: "😱", mood: "Panic" },
                { time: "4h ago", emoji: "😟", mood: "Fear" },
                { time: "2h ago", emoji: "😐", mood: "Neutral" },
                { time: "1h ago", emoji: "😊", mood: "Optimism" },
                { time: "Now", emoji: selectedData.mood.emoji, mood: selectedData.mood.description }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center min-w-[80px] flex-shrink-0">
                  <div className="text-2xl mb-2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    {item.emoji}
                  </div>
                  <div className="text-xs text-muted-foreground text-center mb-1 font-medium">
                    {item.time}
                  </div>
                  <div className="text-xs text-center text-white/80 leading-tight max-w-[70px]">
                    {item.mood}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fun Actions */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="glass"
            onClick={() => setAnimationKey(prev => prev + 1)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Refresh Vibes
          </Button>
          <Button variant="outline" className="glass">
            <Heart className="w-4 h-4 mr-2" />
            Share Mood
          </Button>
          <Button variant="outline" className="glass">
            <Flame className="w-4 h-4 mr-2" />
            Mood Alert
          </Button>
        </div>

        {/* Random Wisdom */}
        <Card className="glass-strong bg-gradient-to-r from-purple-500/10 to-pink-500/10">
          <CardContent className="p-4 text-center">
            <div className="text-sm text-yellow-400 mb-2">🧙‍♂️ Crypto Wisdom of the Moment:</div>
            <p className="text-sm italic">"{getRandomWhimsicalUpdate()}"</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}