import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Trophy, Star, Zap, Gift, Award, Target, Brain, CheckCircle, XCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "basics" | "defi" | "trading" | "security" | "blockchain";
  points: number;
  funFact: string;
}

interface UserProgress {
  totalPoints: number;
  level: number;
  streak: number;
  badges: string[];
  completedQuizzes: string[];
  correctAnswers: number;
  totalAnswers: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  unlocked: boolean;
  type: "badge" | "avatar" | "theme" | "feature";
}

export default function CryptoEducationQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 2850,
    level: 12,
    streak: 7,
    badges: ["🚀", "💎", "🔥", "🎯"],
    completedQuizzes: ["basics-1", "trading-1"],
    correctAnswers: 0,
    totalAnswers: 0
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const questions: Question[] = [
    {
      id: "q1",
      question: "What does 'HODL' originally stand for?",
      options: [
        "Hold On for Dear Life",
        "A misspelling of 'hold' that became popular",
        "High Order Digital Ledger",
        "Holders of Digital Liquidity"
      ],
      correctAnswer: 1,
      explanation: "HODL originated from a misspelled 'hold' in a Bitcoin forum post during a market crash. It became a popular crypto investment strategy.",
      difficulty: "beginner",
      category: "basics",
      points: 10,
      funFact: "The original HODL post was made during Bitcoin's crash from $716 to $438 in 2013!"
    },
    {
      id: "q2",
      question: "What is the maximum supply of Bitcoin?",
      options: ["20 million", "21 million", "22 million", "Unlimited"],
      correctAnswer: 1,
      explanation: "Bitcoin has a fixed maximum supply of 21 million coins, making it deflationary by design.",
      difficulty: "beginner",
      category: "basics",
      points: 15,
      funFact: "The last Bitcoin is expected to be mined around the year 2140!"
    },
    {
      id: "q3",
      question: "What does DeFi stand for?",
      options: [
        "Digital Finance",
        "Decentralized Finance",
        "Delegated Finance",
        "Diversified Finance"
      ],
      correctAnswer: 1,
      explanation: "DeFi (Decentralized Finance) refers to financial services built on blockchain networks without traditional intermediaries.",
      difficulty: "intermediate",
      category: "defi",
      points: 20,
      funFact: "The total value locked in DeFi protocols reached over $200 billion at its peak!"
    },
    {
      id: "q4",
      question: "What is a 'whale' in crypto trading?",
      options: [
        "A large sea mammal",
        "A trader with very large holdings",
        "A type of cryptocurrency",
        "A trading strategy"
      ],
      correctAnswer: 1,
      explanation: "A whale is an individual or entity that holds large amounts of cryptocurrency, capable of significantly impacting market prices.",
      difficulty: "beginner",
      category: "trading",
      points: 10,
      funFact: "Some Bitcoin whales hold over 100,000 BTC worth billions of dollars!"
    },
    {
      id: "q5",
      question: "What is a smart contract?",
      options: [
        "A legal document",
        "An AI-powered contract",
        "Self-executing code on blockchain",
        "A contract with smart clauses"
      ],
      correctAnswer: 2,
      explanation: "Smart contracts are self-executing contracts with terms directly written into code, automatically enforcing agreements.",
      difficulty: "intermediate",
      category: "blockchain",
      points: 25,
      funFact: "Ethereum processes over 1 million smart contract transactions daily!"
    }
  ];

  const rewards: Reward[] = [
    {
      id: "novice",
      name: "Crypto Novice",
      description: "Complete your first quiz",
      icon: "🌱",
      pointsRequired: 50,
      unlocked: true,
      type: "badge"
    },
    {
      id: "streak5",
      name: "Consistency Master",
      description: "Maintain a 5-day learning streak",
      icon: "🔥",
      pointsRequired: 200,
      unlocked: true,
      type: "badge"
    },
    {
      id: "defi-expert",
      name: "DeFi Expert",
      description: "Master DeFi fundamentals",
      icon: "🏦",
      pointsRequired: 500,
      unlocked: false,
      type: "badge"
    },
    {
      id: "whale-status",
      name: "Whale Status",
      description: "Reach 1000 knowledge points",
      icon: "🐋",
      pointsRequired: 1000,
      unlocked: true,
      type: "badge"
    },
    {
      id: "diamond-hands",
      name: "Diamond Hands",
      description: "Perfect score on advanced quiz",
      icon: "💎",
      pointsRequired: 750,
      unlocked: true,
      type: "badge"
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const points = isCorrect ? questions[currentQuestion].points : 0;

    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      totalAnswers: prev.totalAnswers + 1,
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    setEarnedPoints(points);
    setShowResult(true);

    if (isCorrect && points > 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setUserProgress(prev => ({
      ...prev,
      correctAnswers: 0,
      totalAnswers: 0
    }));
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🚀";
    if (streak >= 20) return "🔥";
    if (streak >= 10) return "⚡";
    if (streak >= 5) return "💪";
    return "🌟";
  };

  const getLevelTitle = (level: number) => {
    if (level >= 50) return "Crypto Legend";
    if (level >= 30) return "Blockchain Master";
    if (level >= 20) return "DeFi Expert";
    if (level >= 10) return "Crypto Enthusiast";
    if (level >= 5) return "Digital Trader";
    return "Crypto Newbie";
  };

  if (quizCompleted) {
    const accuracy = Math.round((userProgress.correctAnswers / userProgress.totalAnswers) * 100);
    
    return (
      <Card className="glass">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Quiz Completed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-strong">
              <CardContent className="p-4">
                <div className="text-2xl text-green-400 mb-2">
                  {userProgress.correctAnswers}/{userProgress.totalAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </CardContent>
            </Card>
            <Card className="glass-strong">
              <CardContent className="p-4">
                <div className="text-2xl text-blue-400 mb-2">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </CardContent>
            </Card>
            <Card className="glass-strong">
              <CardContent className="p-4">
                <div className="text-2xl text-purple-400 mb-2">+{earnedPoints}</div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rewards Unlocked!</h3>
            <div className="flex justify-center space-x-4">
              {rewards.filter(r => r.unlocked).map(reward => (
                <div key={reward.id} className="text-center">
                  <div className="text-3xl mb-2 animate-pulse">{reward.icon}</div>
                  <div className="text-xs text-muted-foreground">{reward.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={resetQuiz} className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Trophy className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" className="glass">
              <Gift className="w-4 h-4 mr-2" />
              Claim Rewards
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="glass relative">
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 rounded-lg">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl text-green-400 font-bold">+{earnedPoints} Points!</div>
            <div className="text-sm text-muted-foreground">Excellent work!</div>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>Crypto Knowledge Quiz</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              Level {userProgress.level}: {getLevelTitle(userProgress.level)}
            </Badge>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getStreakEmoji(userProgress.streak)}</span>
              <span className="text-sm text-muted-foreground">{userProgress.streak} day streak</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{currentQuestion + 1} of {questions.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-strong">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-purple-400">{userProgress.totalPoints.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </CardContent>
          </Card>
          <Card className="glass-strong">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-blue-400">{userProgress.badges.length}</div>
              <div className="text-xs text-muted-foreground">Badges Earned</div>
            </CardContent>
          </Card>
          <Card className="glass-strong">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-green-400">{userProgress.completedQuizzes.length}</div>
              <div className="text-xs text-muted-foreground">Quizzes Done</div>
            </CardContent>
          </Card>
          <Card className="glass-strong">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-yellow-400">
                {userProgress.totalAnswers > 0 ? Math.round((userProgress.correctAnswers / userProgress.totalAnswers) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Question */}
        <Card className="glass-strong">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Badge className={`${
                question.difficulty === 'beginner' ? 'bg-green-500' :
                question.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {question.difficulty} • {question.points} pts
              </Badge>
              <Badge variant="outline">{question.category}</Badge>
            </div>
            
            <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start h-auto p-4 glass ${
                    selectedAnswer === index ? 'border-purple-400 bg-purple-500/20' : ''
                  } ${
                    showResult ? (
                      index === question.correctAnswer ? 'border-green-400 bg-green-500/20' :
                      selectedAnswer === index && index !== question.correctAnswer ? 'border-red-400 bg-red-500/20' : ''
                    ) : ''
                  }`}
                  onClick={() => !showResult && handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index ? 'border-purple-400' : 'border-muted-foreground'
                    }`}>
                      {selectedAnswer === index && (
                        showResult ? (
                          index === question.correctAnswer ? 
                            <CheckCircle className="w-4 h-4 text-green-400" /> :
                            <XCircle className="w-4 h-4 text-red-400" />
                        ) : <div className="w-3 h-3 bg-purple-400 rounded-full" />
                      )}
                      {showResult && index === question.correctAnswer && selectedAnswer !== index && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Result Explanation */}
        {showResult && (
          <Card className="glass-strong bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">
                  {selectedAnswer === question.correctAnswer ? '🎉' : '💡'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-2">
                    {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Not quite right'}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{question.explanation}</p>
                  <div className="bg-purple-500/20 rounded-lg p-3">
                    <div className="text-sm font-medium text-purple-400 mb-1">Fun Fact:</div>
                    <div className="text-sm">{question.funFact}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null || showResult}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-8"
          >
            {showResult ? (
              currentQuestion < questions.length - 1 ? 'Next Question...' : 'View Results...'
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Submit Answer
              </>
            )}
          </Button>
        </div>

        {/* Available Rewards */}
        <Card className="glass-strong">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Gift className="w-4 h-4 mr-2" />
              Upcoming Rewards
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {rewards.filter(r => !r.unlocked).slice(0, 5).map(reward => (
                <div key={reward.id} className="text-center p-2 rounded bg-black/20">
                  <div className="text-2xl mb-1 grayscale">{reward.icon}</div>
                  <div className="text-xs font-medium">{reward.name}</div>
                  <div className="text-xs text-muted-foreground">{reward.pointsRequired} pts</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}