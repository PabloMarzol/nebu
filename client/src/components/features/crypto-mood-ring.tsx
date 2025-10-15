import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MoodRingProps {
  className?: string;
}

export default function CryptoMoodRing({ className = "" }: MoodRingProps) {
  const [currentMood, setCurrentMood] = useState('neutral');
  const [bgColor, setBgColor] = useState('from-slate-800 to-slate-900');

  // Fetch market data to determine mood
  const { data: marketData } = useQuery({
    queryKey: ['/api/market/volatility'],
    refetchInterval: 30000, // Update every 30 seconds
  });

  useEffect(() => {
    if (!marketData) return;

    const volatility = (marketData as any).volatility || 0;
    const trend = (marketData as any).trend || 0;

    let mood = 'neutral';
    let gradient = 'from-slate-800 to-slate-900';

    if (volatility > 0.15) {
      // High volatility - red/orange mood
      mood = 'volatile';
      gradient = 'from-red-600 via-orange-500 to-red-700';
    } else if (trend > 0.05) {
      // Bullish trend - green mood
      mood = 'bullish';
      gradient = 'from-green-500 via-emerald-400 to-green-600';
    } else if (trend < -0.05) {
      // Bearish trend - blue mood
      mood = 'bearish';
      gradient = 'from-blue-600 via-indigo-500 to-blue-700';
    } else if (volatility < 0.03) {
      // Low volatility - purple mood
      mood = 'calm';
      gradient = 'from-purple-500 via-violet-400 to-purple-600';
    }

    setCurrentMood(mood);
    setBgColor(gradient);

    // Apply to body background for global effect
    document.body.style.background = `linear-gradient(135deg, ${gradient.replace('from-', '').replace('via-', ', ').replace('to-', ', ')})`;
  }, [marketData]);

  const getMoodIcon = () => {
    switch (currentMood) {
      case 'bullish':
        return <TrendingUp className="w-6 h-6 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="w-6 h-6 text-red-400" />;
      case 'volatile':
        return <div className="animate-pulse">⚡</div>;
      case 'calm':
        return <Minus className="w-6 h-6 text-purple-400" />;
      default:
        return <div>🌊</div>;
    }
  };

  const getMoodText = () => {
    switch (currentMood) {
      case 'bullish':
        return 'Market is feeling optimistic! 🚀';
      case 'bearish':
        return 'Market is in contemplative mode 🧘';
      case 'volatile':
        return 'Market energy is intense! ⚡';
      case 'calm':
        return 'Market is serene and stable 🌸';
      default:
        return 'Market is finding its balance 🌊';
    }
  };

  return (
    <Card className={`transition-all duration-1000 bg-gradient-to-br ${bgColor} border-opacity-50 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
          {getMoodIcon()}
          Crypto Mood Ring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-white/80 text-sm">
          {getMoodText()}
        </div>
        <div className="mt-2 text-xs text-white/60">
          Background shifts with market volatility
        </div>
      </CardContent>
    </Card>
  );
}