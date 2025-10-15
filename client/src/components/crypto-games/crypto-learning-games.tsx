import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Timer, Trophy, Brain, Zap, Target, BookOpen, Star, Clock, Award } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Game {
  gameId: string;
  title: string;
  description: string;
  category: 'trading' | 'defi' | 'security' | 'basics';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  tokenReward: number;
  questions: Question[];
  timeLimit: number;
}

interface GameProgress {
  gameId: string;
  score: number;
  xpEarned: number;
  tokensEarned: number;
  completed: boolean;
  bestScore: number;
  attempts: number;
}

const CryptoLearningGames: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock games data
  const [games] = useState<Game[]>([
    {
      gameId: 'btc-basics',
      title: 'Bitcoin Basics Mastery',
      description: 'Test your knowledge of Bitcoin fundamentals, mining, and blockchain technology.',
      category: 'basics',
      difficulty: 'beginner',
      xpReward: 150,
      tokenReward: 5,
      timeLimit: 300,
      questions: [
        {
          question: 'What is the maximum supply of Bitcoin?',
          options: ['21 million', '100 million', '50 million', 'Unlimited'],
          correctAnswer: 0,
          explanation: 'Bitcoin has a hard cap of 21 million coins, making it a deflationary cryptocurrency.'
        },
        {
          question: 'What consensus mechanism does Bitcoin use?',
          options: ['Proof of Stake', 'Proof of Work', 'Delegated Proof of Stake', 'Proof of Authority'],
          correctAnswer: 1,
          explanation: 'Bitcoin uses Proof of Work, where miners compete to solve complex mathematical problems.'
        },
        {
          question: 'Who created Bitcoin?',
          options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Charlie Lee', 'Gavin Andresen'],
          correctAnswer: 1,
          explanation: 'Bitcoin was created by the pseudonymous Satoshi Nakamoto in 2008.'
        }
      ]
    },
    {
      gameId: 'defi-advanced',
      title: 'DeFi Protocol Mastery',
      description: 'Advanced concepts in decentralized finance, yield farming, and liquidity provision.',
      category: 'defi',
      difficulty: 'advanced',
      xpReward: 300,
      tokenReward: 15,
      timeLimit: 600,
      questions: [
        {
          question: 'What is impermanent loss in DeFi?',
          options: ['Permanent loss of funds', 'Temporary loss due to price changes', 'Gas fee costs', 'Smart contract bugs'],
          correctAnswer: 1,
          explanation: 'Impermanent loss occurs when providing liquidity to AMMs and the price ratio of paired tokens changes.'
        },
        {
          question: 'What does TVL stand for?',
          options: ['Total Value Locked', 'Total Volume Limit', 'Token Value Logic', 'Trading Volume Limit'],
          correctAnswer: 0,
          explanation: 'TVL measures the total value of assets locked in DeFi protocols.'
        }
      ]
    },
    {
      gameId: 'security-expert',
      title: 'Crypto Security Expert',
      description: 'Master wallet security, private keys, and protection against scams.',
      category: 'security',
      difficulty: 'intermediate',
      xpReward: 200,
      tokenReward: 10,
      timeLimit: 450,
      questions: [
        {
          question: 'What is a hardware wallet?',
          options: ['Software wallet', 'Physical device for storing keys', 'Exchange wallet', 'Web wallet'],
          correctAnswer: 1,
          explanation: 'Hardware wallets are physical devices that store private keys offline for enhanced security.'
        },
        {
          question: 'What should you never share?',
          options: ['Public address', 'Private key', 'Wallet name', 'Transaction ID'],
          correctAnswer: 1,
          explanation: 'Private keys should never be shared as they give complete control over your funds.'
        }
      ]
    },
    {
      gameId: 'trading-pro',
      title: 'Trading Psychology Pro',
      description: 'Learn advanced trading strategies, risk management, and market analysis.',
      category: 'trading',
      difficulty: 'advanced',
      xpReward: 400,
      tokenReward: 20,
      timeLimit: 720,
      questions: [
        {
          question: 'What is a stop-loss order?',
          options: ['Buy order', 'Sell order to limit losses', 'Market order', 'Limit order'],
          correctAnswer: 1,
          explanation: 'A stop-loss order automatically sells an asset when its price falls to a predetermined level.'
        },
        {
          question: 'What does FOMO mean in trading?',
          options: ['Fear of Missing Out', 'Financial Order Management', 'Future Options Market', 'Fixed Order Mechanism'],
          correctAnswer: 0,
          explanation: 'FOMO (Fear of Missing Out) often leads to impulsive trading decisions and poor risk management.'
        }
      ]
    }
  ]);

  const [gameProgress, setGameProgress] = useState<GameProgress[]>([
    { gameId: 'btc-basics', score: 85, xpEarned: 128, tokensEarned: 4.2, completed: true, bestScore: 85, attempts: 2 },
    { gameId: 'security-expert', score: 0, xpEarned: 0, tokensEarned: 0, completed: false, bestScore: 0, attempts: 0 }
  ]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameInProgress && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameInProgress, timeLeft]);

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const startGame = (game: Game) => {
    setSelectedGame(game);
    setGameInProgress(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer('');
    setTimeLeft(game.timeLimit);
    setGameCompleted(false);
    setShowExplanation(false);
  };

  const submitAnswer = () => {
    if (!selectedGame || selectedAnswer === '') return;

    const answerIndex = parseInt(selectedAnswer);
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < selectedGame.questions.length - 1) {
      setShowExplanation(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
        setShowExplanation(false);
      }, 3000);
    } else {
      completeGame(newAnswers);
    }
  };

  const completeGame = (finalAnswers?: number[]) => {
    if (!selectedGame) return;

    const answersToUse = finalAnswers || answers;
    let correctCount = 0;
    selectedGame.questions.forEach((question, index) => {
      if (answersToUse[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / selectedGame.questions.length) * 100);
    const xpEarned = Math.round((scorePercentage / 100) * selectedGame.xpReward);
    const tokensEarned = (scorePercentage / 100) * selectedGame.tokenReward;

    setFinalScore(scorePercentage);
    setGameInProgress(false);
    setGameCompleted(true);

    // Update progress
    const existingProgressIndex = gameProgress.findIndex(p => p.gameId === selectedGame.gameId);
    const newProgress: GameProgress = {
      gameId: selectedGame.gameId,
      score: scorePercentage,
      xpEarned,
      tokensEarned,
      completed: true,
      bestScore: Math.max(scorePercentage, gameProgress[existingProgressIndex]?.bestScore || 0),
      attempts: (gameProgress[existingProgressIndex]?.attempts || 0) + 1
    };

    if (existingProgressIndex >= 0) {
      const newGameProgress = [...gameProgress];
      newGameProgress[existingProgressIndex] = newProgress;
      setGameProgress(newGameProgress);
    } else {
      setGameProgress([...gameProgress, newProgress]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading': return <Target className="w-5 h-5" />;
      case 'defi': return <Zap className="w-5 h-5" />;
      case 'security': return <Trophy className="w-5 h-5" />;
      case 'basics': return <BookOpen className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameCompleted && selectedGame) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-black/20 border-purple-500/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Game Complete!</CardTitle>
            <p className="text-gray-400">{selectedGame.title}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">{finalScore}%</div>
              <div className="text-gray-400">Final Score</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-500/20 rounded-lg">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">+{Math.round((finalScore / 100) * selectedGame.xpReward)}</div>
                <div className="text-sm text-gray-400">XP Earned</div>
              </div>
              <div className="text-center p-4 bg-blue-500/20 rounded-lg">
                <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">+{((finalScore / 100) * selectedGame.tokenReward).toFixed(1)}</div>
                <div className="text-sm text-gray-400">Tokens Earned</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => startGame(selectedGame)} 
                className="flex-1"
                variant="outline"
              >
                Play Again
              </Button>
              <Button 
                onClick={() => {
                  setSelectedGame(null);
                  setGameCompleted(false);
                }} 
                className="flex-1"
              >
                Choose New Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameInProgress && selectedGame) {
    const currentQ = selectedGame.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedGame.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-black/20 border-purple-500/20">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-400" />
                <span className="font-semibold">{selectedGame.title}</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-400">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="text-center text-sm text-gray-400">
              Question {currentQuestion + 1} of {selectedGame.questions.length}
            </div>
          </CardHeader>
          <CardContent>
            {!showExplanation ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">{currentQ.question}</h3>
                
                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <div className="space-y-3">
                    {currentQ.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-white">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <Button 
                  onClick={submitAnswer} 
                  disabled={selectedAnswer === ''} 
                  className="w-full"
                >
                  {currentQuestion === selectedGame.questions.length - 1 ? 'Complete Game' : 'Next Question'}
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className={`text-lg font-semibold ${
                  parseInt(selectedAnswer) === currentQ.correctAnswer ? 'text-green-400' : 'text-red-400'
                }`}>
                  {parseInt(selectedAnswer) === currentQ.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                <div className="text-gray-300 bg-gray-800/30 p-4 rounded-lg">
                  {currentQ.explanation}
                </div>
                <div className="text-sm text-gray-400">Moving to next question...</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Crypto Learning Games
            </h2>
            <p className="text-gray-400">Master cryptocurrency knowledge through interactive challenges</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 flex-wrap">
        {['all', 'basics', 'trading', 'defi', 'security'].map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === 'all' ? 'All Games' : category}
          </Button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGames.map((game) => {
          const progress = gameProgress.find(p => p.gameId === game.gameId);
          
          return (
            <Card key={game.gameId} className="bg-black/20 border-purple-500/20 hover:border-purple-400/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(game.category)}
                    <div>
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <p className="text-sm text-gray-400 capitalize">{game.category}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`${getDifficultyColor(game.difficulty)} text-white capitalize`}
                  >
                    {game.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{game.description}</p>
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{game.xpReward} XP</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-blue-400" />
                    <span>{game.tokenReward} Tokens</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Timer className="w-4 h-4 text-orange-400" />
                    <span>{Math.round(game.timeLimit / 60)}m</span>
                  </div>
                </div>

                {progress && progress.completed && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-400">Best Score: {progress.bestScore}%</span>
                      <span className="text-gray-400">Attempts: {progress.attempts}</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => startGame(game)} 
                  className="w-full"
                  variant={progress?.completed ? "outline" : "default"}
                >
                  {progress?.completed ? 'Play Again' : 'Start Game'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Summary */}
      <Card className="bg-black/20 border-purple-500/20">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {gameProgress.filter(p => p.completed).length}
              </div>
              <div className="text-sm text-gray-400">Games Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {gameProgress.reduce((sum, p) => sum + p.xpEarned, 0)}
              </div>
              <div className="text-sm text-gray-400">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {gameProgress.reduce((sum, p) => sum + p.tokensEarned, 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Tokens Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {gameProgress.length > 0 ? Math.round(gameProgress.reduce((sum, p) => sum + p.bestScore, 0) / gameProgress.length) : 0}%
              </div>
              <div className="text-sm text-gray-400">Avg Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoLearningGames;