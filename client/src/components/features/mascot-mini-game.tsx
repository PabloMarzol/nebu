import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Zap, Star } from 'lucide-react';

interface MascotMiniGameProps {
  isVisible: boolean;
  onComplete: (score: number) => void;
}

export default function MascotMiniGame({ isVisible, onComplete }: MascotMiniGameProps) {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'completed'>('waiting');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [coins, setCoins] = useState<Array<{id: number, x: number, y: number, collected: boolean}>>([]);

  const mascotPhrases = [
    "Catch the crypto coins! ⭐",
    "Quick! Collect them all! 🚀",
    "You're doing great! 💎",
    "Crypto mastery in progress! ⚡"
  ];

  const [currentPhrase, setCurrentPhrase] = useState(mascotPhrases[0]);

  useEffect(() => {
    if (gameState === 'playing') {
      // Generate coins
      const newCoins = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 80 + 10, // 10% to 90% of container width
        y: Math.random() * 60 + 20, // 20% to 80% of container height
        collected: false
      }));
      setCoins(newCoins);

      // Start timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('completed');
            onComplete(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setCurrentPhrase(mascotPhrases[Math.floor(Math.random() * mascotPhrases.length)]);
    }, 2000);

    return () => clearInterval(phraseTimer);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(10);
  };

  const collectCoin = (coinId: number) => {
    setCoins(prev => prev.map(coin => 
      coin.id === coinId ? { ...coin, collected: true } : coin
    ));
    setScore(prev => prev + 10);
  };

  const resetGame = () => {
    setGameState('waiting');
    setScore(0);
    setTimeLeft(10);
    setCoins([]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 border-0">
        <CardContent className="p-6">
          {/* Mascot Character */}
          <div className="text-center mb-4">
            <div className="text-6xl animate-bounce mb-2">🚀</div>
            <div className="text-white font-semibold text-lg">Nebby the Crypto Guide</div>
            <div className="text-white/80 text-sm animate-pulse">{currentPhrase}</div>
          </div>

          {gameState === 'waiting' && (
            <div className="text-center space-y-4">
              <div className="text-white/90 text-sm">
                Help Nebby collect crypto coins in 10 seconds!
              </div>
              <Button onClick={startGame} className="bg-white text-purple-600 hover:bg-white/90">
                <Zap className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-4">
              <div className="flex justify-between text-white text-sm">
                <span>Score: {score}</span>
                <span>Time: {timeLeft}s</span>
              </div>
              
              {/* Game Area */}
              <div className="relative bg-white/10 rounded-lg h-48 overflow-hidden">
                {coins.map(coin => !coin.collected && (
                  <button
                    key={coin.id}
                    onClick={() => collectCoin(coin.id)}
                    className="absolute animate-pulse hover:scale-110 transition-transform"
                    style={{ left: `${coin.x}%`, top: `${coin.y}%` }}
                  >
                    <Coins className="w-6 h-6 text-yellow-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState === 'completed' && (
            <div className="text-center space-y-4">
              <div className="text-4xl">🎉</div>
              <div className="text-white">
                <div className="font-semibold text-lg">Game Complete!</div>
                <div className="text-sm">Final Score: {score} points</div>
              </div>
              <div className="space-x-2">
                <Button onClick={startGame} size="sm" className="bg-white text-purple-600 hover:bg-white/90">
                  Play Again
                </Button>
                <Button onClick={resetGame} size="sm" variant="outline" className="text-white border-white hover:bg-white/10">
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}