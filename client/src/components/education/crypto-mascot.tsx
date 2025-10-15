import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Shield, BookOpen, Star } from 'lucide-react';

interface MascotTip {
  id: string;
  title: string;
  message: string;
  category: 'trading' | 'security' | 'market' | 'defi';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ReactNode;
}

const cryptoTips: MascotTip[] = [
  {
    id: 'tip-1',
    title: 'Dollar Cost Averaging',
    message: "Hey there! 🚀 I'm Nebby, your crypto buddy! Let's talk about DCA - buying a fixed amount regularly instead of timing the market. It's like having a steady coffee habit, but for crypto!",
    category: 'trading',
    difficulty: 'beginner',
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    id: 'tip-2',
    title: 'Never Share Your Seed Phrase',
    message: "Your seed phrase is like your house key - never give it to strangers! 🔐 Real crypto services never ask for it. Keep it safe, write it down, and store it offline!",
    category: 'security',
    difficulty: 'beginner',
    icon: <Shield className="w-4 h-4" />
  },
  {
    id: 'tip-3',
    title: 'Market Volatility is Normal',
    message: "Don't panic when prices swing! 📈📉 Crypto markets are like roller coasters - exciting but bumpy. Focus on long-term trends and don't let daily movements stress you out.",
    category: 'market',
    difficulty: 'beginner',
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: 'tip-4',
    title: 'Understanding Liquidity Pools',
    message: "Liquidity pools are like community piggy banks! 🏦 People contribute paired tokens, and traders can swap between them. You earn fees for providing liquidity, but watch out for impermanent loss!",
    category: 'defi',
    difficulty: 'intermediate',
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    id: 'tip-5',
    title: 'Risk Management Basics',
    message: "Never invest more than you can afford to lose! 💡 A good rule: start with 1-5% of your savings in crypto. Diversify across different coins and always have an emergency fund first!",
    category: 'trading',
    difficulty: 'beginner',
    icon: <Star className="w-4 h-4" />
  }
];

const mascotMoods = [
  { emoji: '🚀', name: 'excited', message: "Markets are looking bullish!" },
  { emoji: '🤔', name: 'thoughtful', message: "Let me think about this..." },
  { emoji: '😊', name: 'happy', message: "Great job learning!" },
  { emoji: '📚', name: 'teaching', message: "Ready for a lesson?" },
  { emoji: '⚡', name: 'energetic', message: "Let's dive into crypto!" }
];

export default function CryptoMascot() {
  const [currentTip, setCurrentTip] = useState<MascotTip>(cryptoTips[0]);
  const [currentMood, setCurrentMood] = useState(mascotMoods[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [learnedTips, setLearnedTips] = useState<string[]>([]);

  const getRandomTip = () => {
    const availableTips = cryptoTips.filter(tip => !learnedTips.includes(tip.id));
    if (availableTips.length === 0) return cryptoTips[Math.floor(Math.random() * cryptoTips.length)];
    return availableTips[Math.floor(Math.random() * availableTips.length)];
  };

  const getRandomMood = () => {
    return mascotMoods[Math.floor(Math.random() * mascotMoods.length)];
  };

  const handleNextTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const newTip = getRandomTip();
      setCurrentTip(newTip);
      setCurrentMood(getRandomMood());
      
      if (!learnedTips.includes(newTip.id)) {
        setLearnedTips([...learnedTips, newTip.id]);
        if (learnedTips.length % 3 === 2) {
          setUserLevel(prev => prev + 1);
        }
      }
      
      setIsAnimating(false);
    }, 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trading': return 'bg-blue-500/20 text-blue-400';
      case 'security': return 'bg-purple-500/20 text-purple-400';
      case 'market': return 'bg-cyan-500/20 text-cyan-400';
      case 'defi': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMood(getRandomMood());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border-purple-500/30">
      <CardContent className="p-6">
        {/* Mascot Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`text-4xl transition-all duration-300 ${isAnimating ? 'scale-75 opacity-50' : 'scale-100 opacity-100'}`}>
              {currentMood.emoji}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nebby</h3>
              <p className="text-sm text-gray-400">Your Crypto Learning Buddy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/50">
              Level {userLevel}
            </Badge>
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50">
              {learnedTips.length} Tips Learned
            </Badge>
          </div>
        </div>

        {/* Current Tip */}
        <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 bg-purple-500/20 rounded">
              {currentTip.icon}
            </div>
            <h4 className="font-semibold text-white">{currentTip.title}</h4>
            <Badge className={`text-xs ${getDifficultyColor(currentTip.difficulty)}`}>
              {currentTip.difficulty}
            </Badge>
            <Badge className={`text-xs ${getCategoryColor(currentTip.category)}`}>
              {currentTip.category}
            </Badge>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {currentTip.message}
          </p>
        </div>

        {/* Mood Indicator */}
        <div className="mb-4 p-3 bg-black/20 rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-400 mb-1">Nebby says:</p>
          <p className="text-sm text-gray-300 italic">"{currentMood.message}"</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleNextTip}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            disabled={isAnimating}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isAnimating ? 'Learning...' : 'Next Tip'}
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            onClick={() => window.open('/trading', '_blank')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Practice
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 pt-4 border-t border-purple-500/20">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Learning Progress</span>
            <span>{learnedTips.length}/{cryptoTips.length} Tips</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(learnedTips.length / cryptoTips.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-2 right-2 text-purple-400/30">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="absolute bottom-2 left-2 text-blue-400/30">
          <Star className="w-4 h-4 animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
      </CardContent>
    </Card>
  );
}