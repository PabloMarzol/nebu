import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CryptoGlossary from "@/components/launchpad/crypto-glossary";
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Star,
  Lightbulb,
  Target,
  Trophy,
  Play,
  Lock,
  Unlock,
  Brain,
  Coins,
  Shield,
  TrendingUp,
  Zap,
  Users,
  Globe,
  Wallet
} from "lucide-react";

interface EducationModule {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  topics: string[];
  completed: boolean;
  locked: boolean;
  progress: number;
  icon: any;
  color: string;
  prerequisite?: string;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ModuleContent {
  id: string;
  sections: {
    title: string;
    content: string;
    keyPoints: string[];
    examples?: string[];
  }[];
  quiz: Quiz[];
}

export default function CryptoEducationModules() {
  const [selectedTab, setSelectedTab] = useState("modules");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState(65); // Overall progress
  const [currentQuiz, setCurrentQuiz] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const modules: EducationModule[] = [
    {
      id: "crypto-basics",
      title: "Cryptocurrency Basics",
      description: "Learn the fundamentals of digital currencies and blockchain technology",
      difficulty: "Beginner",
      duration: "15 min",
      topics: ["What is cryptocurrency", "Blockchain basics", "Digital wallets", "Security"],
      completed: true,
      locked: false,
      progress: 100,
      icon: Coins,
      color: "text-blue-400"
    },
    {
      id: "wallet-security",
      title: "Wallet Security",
      description: "Master the art of keeping your crypto assets safe and secure",
      difficulty: "Beginner",
      duration: "12 min",
      topics: ["Private keys", "Seed phrases", "Hardware wallets", "Best practices"],
      completed: true,
      locked: false,
      progress: 100,
      icon: Shield,
      color: "text-green-400"
    },
    {
      id: "trading-basics",
      title: "Trading Fundamentals",
      description: "Understanding markets, orders, and basic trading strategies",
      difficulty: "Intermediate",
      duration: "20 min",
      topics: ["Market orders", "Limit orders", "Chart reading", "Risk management"],
      completed: false,
      locked: false,
      progress: 75,
      icon: TrendingUp,
      color: "text-purple-400"
    },
    {
      id: "defi-intro",
      title: "Introduction to DeFi",
      description: "Explore decentralized finance and its revolutionary applications",
      difficulty: "Intermediate",
      duration: "25 min",
      topics: ["Lending protocols", "DEXs", "Yield farming", "Liquidity pools"],
      completed: false,
      locked: false,
      progress: 40,
      icon: Zap,
      color: "text-yellow-400"
    },
    {
      id: "advanced-trading",
      title: "Advanced Trading Strategies",
      description: "Professional trading techniques and market analysis",
      difficulty: "Advanced",
      duration: "35 min",
      topics: ["Technical analysis", "Derivatives", "Arbitrage", "Portfolio management"],
      completed: false,
      locked: true,
      progress: 0,
      icon: Target,
      color: "text-red-400",
      prerequisite: "trading-basics"
    },
    {
      id: "nft-guide",
      title: "NFTs and Digital Assets",
      description: "Understanding non-fungible tokens and their ecosystem",
      difficulty: "Intermediate",
      duration: "18 min",
      topics: ["NFT standards", "Marketplaces", "Creation", "Valuation"],
      completed: false,
      locked: false,
      progress: 0,
      icon: Star,
      color: "text-pink-400"
    }
  ];

  const moduleContent: { [key: string]: ModuleContent } = {
    "crypto-basics": {
      id: "crypto-basics",
      sections: [
        {
          title: "What is Cryptocurrency?",
          content: "Cryptocurrency is a digital or virtual currency secured by cryptography, making it nearly impossible to counterfeit. Unlike traditional currencies, cryptocurrencies operate on decentralized networks based on blockchain technology.",
          keyPoints: [
            "Digital currency secured by cryptography",
            "Operates on decentralized networks",
            "Not controlled by any central authority",
            "Transactions are recorded on a blockchain"
          ],
          examples: [
            "Bitcoin (BTC) - The first cryptocurrency",
            "Ethereum (ETH) - Smart contract platform",
            "Stablecoins - Pegged to fiat currencies"
          ]
        },
        {
          title: "Blockchain Technology",
          content: "A blockchain is a distributed ledger that maintains a continuously growing list of records, called blocks, linked and secured using cryptography. Each block contains a cryptographic hash of the previous block, timestamp, and transaction data.",
          keyPoints: [
            "Distributed and decentralized ledger",
            "Immutable transaction records",
            "Cryptographic security",
            "Consensus mechanisms validate transactions"
          ]
        }
      ],
      quiz: [
        {
          id: "q1",
          question: "What makes cryptocurrency secure?",
          options: ["Bank verification", "Cryptography", "Government backing", "Physical storage"],
          correctAnswer: 1,
          explanation: "Cryptography provides the security for cryptocurrencies, making them nearly impossible to counterfeit or double-spend."
        },
        {
          id: "q2",
          question: "What is a blockchain?",
          options: ["A type of cryptocurrency", "A distributed ledger", "A trading platform", "A wallet"],
          correctAnswer: 1,
          explanation: "A blockchain is a distributed ledger that records transactions across multiple computers in a secure and immutable way."
        }
      ]
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-600 text-white";
      case "Intermediate": return "bg-yellow-600 text-white";
      case "Advanced": return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "text-green-400";
    if (progress >= 50) return "text-yellow-400";
    return "text-blue-400";
  };

  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;

  const handleStartModule = (moduleId: string) => {
    setSelectedModule(moduleId);
    setShowQuiz(false);
    setCurrentQuiz(0);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuiz(0);
  };

  const handleNextQuiz = () => {
    const content = moduleContent[selectedModule!];
    if (currentQuiz < content.quiz.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      // Quiz completed
      setShowQuiz(false);
      // Update progress (would normally sync with backend)
    }
  };

  if (selectedModule && moduleContent[selectedModule]) {
    const content = moduleContent[selectedModule];
    const module = modules.find(m => m.id === selectedModule)!;

    if (showQuiz) {
      const quiz = content.quiz[currentQuiz];
      return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="glass border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  <span>Knowledge Check</span>
                </CardTitle>
                <Badge variant="outline">
                  Question {currentQuiz + 1} of {content.quiz.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">{quiz.question}</h3>
                <div className="space-y-3">
                  {quiz.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => {
                        // Handle answer selection
                        setTimeout(handleNextQuiz, 1500);
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <Button variant="outline" onClick={() => setShowQuiz(false)}>
                  Back to Module
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setSelectedModule(null)}>
            ← Back to Modules
          </Button>
        </div>

        <Card className="glass border-blue-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <module.icon className={`w-8 h-8 ${module.color}`} />
                <div>
                  <CardTitle className="text-2xl">{module.title}</CardTitle>
                  <p className="text-muted-foreground">{module.description}</p>
                </div>
              </div>
              <Badge className={getDifficultyColor(module.difficulty)}>
                {module.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-400">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span>Key Points</span>
                  </h4>
                  <ul className="space-y-1">
                    {section.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {section.examples && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Examples</h4>
                    <ul className="space-y-1">
                      {section.examples.map((example, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          • {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 border-t">
              <Button className="w-full" onClick={handleStartQuiz}>
                <Brain className="w-4 h-4 mr-2" />
                Test Your Knowledge
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modules">Learning Modules</TabsTrigger>
          <TabsTrigger value="glossary">Crypto Glossary</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6 mt-8">

      {/* Progress Overview */}
      <Card className="glass border-green-500/30 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span>Your Learning Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                {completedModules}/{totalModules}
              </div>
              <div className="text-sm text-muted-foreground">Modules Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{userProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
              <Progress value={userProgress} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {Math.floor((completedModules / totalModules) * 100)}
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card 
            key={module.id} 
            className={`glass hover:shadow-2xl transition-all duration-300 ${
              module.locked ? 'opacity-60' : 'cursor-pointer'
            }`}
            onClick={() => !module.locked && handleStartModule(module.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-muted/20`}>
                    {module.locked ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : (
                      <module.icon className={`w-6 h-6 ${module.color}`} />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getDifficultyColor(module.difficulty)} variant="outline">
                        {module.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {module.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {module.completed && (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{module.description}</p>
              
              {/* Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Progress</span>
                  <span className={`text-sm font-semibold ${getProgressColor(module.progress)}`}>
                    {module.progress}%
                  </span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>

              {/* Topics */}
              <div>
                <div className="text-sm font-semibold mb-2">Topics Covered</div>
                <div className="flex flex-wrap gap-1">
                  {module.topics.slice(0, 3).map((topic, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {module.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{module.topics.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full" 
                disabled={module.locked}
                variant={module.completed ? "outline" : "default"}
              >
                {module.locked ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Complete {module.prerequisite} first
                  </>
                ) : module.completed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Review Module
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {module.progress > 0 ? "Continue" : "Start Learning"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Path Suggestion */}
      <Card className="glass border-blue-500/20 mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-400" />
            <span>Recommended Learning Path</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Based on your progress, here's your suggested learning path:
            </p>
            <div className="flex flex-wrap gap-2">
              {modules
                .filter(m => !m.completed && !m.locked)
                .slice(0, 3)
                .map((module, index) => (
                  <div key={module.id} className="flex items-center space-x-2">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <span>{module.title}</span>
                    </Badge>
                    {index < 2 && <span className="text-muted-foreground">→</span>}
                  </div>
                ))}
            </div>
          </div>
          </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="glossary" className="mt-8">
          <CryptoGlossary />
        </TabsContent>
      </Tabs>
    </div>
  );
}