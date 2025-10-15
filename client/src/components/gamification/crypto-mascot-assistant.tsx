import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  BookOpen,
  Lightbulb,
  Heart,
  Star,
  Zap,
  HelpCircle,
  GraduationCap,
  Target,
  Gift,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  steps: string[];
  completed: boolean;
}

interface MascotMessage {
  id: string;
  text: string;
  type: 'welcome' | 'tip' | 'encouragement' | 'tutorial' | 'achievement';
  emotion: 'happy' | 'excited' | 'thinking' | 'proud' | 'winking';
}

export default function CryptoMascotAssistant() {
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState<MascotMessage | null>(null);
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited' | 'thinking' | 'proud' | 'winking'>('happy');
  const [completedTutorials, setCompletedTutorials] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const tutorials: Tutorial[] = [
    {
      id: 'crypto-basics',
      title: 'What is Cryptocurrency?',
      description: 'Learn the fundamentals of digital currencies and blockchain technology',
      difficulty: 'Beginner',
      category: 'Basics',
      steps: [
        'Cryptocurrency is digital money secured by cryptography',
        'It runs on blockchain technology - a distributed ledger',
        'Bitcoin was the first cryptocurrency, created in 2009',
        'Crypto can be used for payments, investments, and more',
        'Always store your crypto in secure wallets'
      ],
      completed: false
    },
    {
      id: 'wallet-setup',
      title: 'Setting Up Your First Wallet',
      description: 'Step-by-step guide to creating and securing your crypto wallet',
      difficulty: 'Beginner',
      category: 'Security',
      steps: [
        'Choose between hot wallets (online) and cold wallets (offline)',
        'Download a reputable wallet app like MetaMask or Trust Wallet',
        'Create a new wallet and write down your seed phrase',
        'NEVER share your seed phrase with anyone',
        'Enable two-factor authentication for extra security'
      ],
      completed: false
    },
    {
      id: 'first-trade',
      title: 'Making Your First Trade',
      description: 'Learn how to buy and sell cryptocurrencies safely',
      difficulty: 'Beginner',
      category: 'Trading',
      steps: [
        'Start with a small amount you can afford to lose',
        'Choose a reputable exchange like NebulaX',
        'Complete KYC verification for security',
        'Learn about market orders vs limit orders',
        'Always double-check the trading pair before confirming'
      ],
      completed: false
    },
    {
      id: 'defi-basics',
      title: 'Introduction to DeFi',
      description: 'Discover decentralized finance and yield farming',
      difficulty: 'Intermediate',
      category: 'DeFi',
      steps: [
        'DeFi = Decentralized Finance, built on blockchain',
        'No middlemen - smart contracts handle everything',
        'You can lend, borrow, and earn yield on your crypto',
        'Popular protocols include Uniswap, Aave, and Compound',
        'Always research risks like impermanent loss'
      ],
      completed: false
    },
    {
      id: 'nft-guide',
      title: 'Understanding NFTs',
      description: 'Learn about non-fungible tokens and digital ownership',
      difficulty: 'Intermediate',
      category: 'NFTs',
      steps: [
        'NFTs are unique digital assets on the blockchain',
        'They prove ownership of digital art, music, or collectibles',
        'Popular marketplaces include OpenSea and Rarible',
        'Gas fees apply when minting or trading NFTs',
        'Be cautious of scams and verify authenticity'
      ],
      completed: false
    },
    {
      id: 'advanced-trading',
      title: 'Advanced Trading Strategies',
      description: 'Master technical analysis and risk management',
      difficulty: 'Advanced',
      category: 'Trading',
      steps: [
        'Learn to read candlestick charts and indicators',
        'Understand support and resistance levels',
        'Use stop-losses to manage risk',
        'Dollar-cost averaging for long-term investing',
        'Never invest more than you can afford to lose'
      ],
      completed: false
    }
  ];

  const mascotMessages: MascotMessage[] = [
    {
      id: 'welcome',
      text: "Hi there! I'm Nebby, your friendly crypto guide! 🌟 Ready to learn something awesome today?",
      type: 'welcome',
      emotion: 'excited'
    },
    {
      id: 'tip1',
      text: "💡 Pro tip: Always HODL more than you trade. Time in the market beats timing the market!",
      type: 'tip',
      emotion: 'winking'
    },
    {
      id: 'encouragement1',
      text: "You're doing great! Every expert was once a beginner. Keep learning and you'll master crypto! 💪",
      type: 'encouragement',
      emotion: 'proud'
    },
    {
      id: 'security',
      text: "🛡️ Remember: Never share your private keys or seed phrase. I'll never ask for them either!",
      type: 'tip',
      emotion: 'thinking'
    }
  ];

  useEffect(() => {
    // Show welcome message on load
    setCurrentMessage(mascotMessages[0]);
    
    // Rotate through different messages
    const messageInterval = setInterval(() => {
      const randomMessage = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
      setCurrentMessage(randomMessage);
      setMascotMood(randomMessage.emotion);
    }, 15000);

    return () => clearInterval(messageInterval);
  }, []);

  const getMascotExpression = (mood: string) => {
    switch (mood) {
      case 'excited': return '🤩';
      case 'thinking': return '🤔';
      case 'proud': return '😊';
      case 'winking': return '😉';
      default: return '😄';
    }
  };

  const startTutorial = (tutorialId: string) => {
    setSelectedTutorial(tutorialId);
    setCurrentMessage({
      id: 'tutorial-start',
      text: "Great choice! Let's learn together step by step. I'll be here to help you understand everything! 📚",
      type: 'tutorial',
      emotion: 'excited'
    });
    setMascotMood('excited');
  };

  const completeTutorial = (tutorialId: string) => {
    setCompletedTutorials(prev => [...prev, tutorialId]);
    setSelectedTutorial(null);
    setCurrentMessage({
      id: 'tutorial-complete',
      text: "Awesome job! 🎉 You've mastered another topic. Ready to tackle the next challenge?",
      type: 'achievement',
      emotion: 'proud'
    });
    setMascotMood('proud');
  };

  const categories = Array.from(new Set(tutorials.map(t => t.category)));
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 3);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Mascot */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <motion.div 
              className="text-8xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {getMascotExpression(mascotMood)}
            </motion.div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Meet Nebby!
              </h1>
              <p className="text-xl text-gray-300">
                Your Cute Crypto Learning Assistant
              </p>
            </div>
          </div>
          
          {/* Mascot Message Bubble */}
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                key={currentMessage.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                      <p className="text-lg leading-relaxed">{currentMessage.text}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tutorial Selection */}
        {!selectedTutorial && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div>
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                    Learning Paths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {displayedCategories.map((category) => (
                      <div key={category} className="p-3 bg-gray-800/30 rounded-lg">
                        <div className="font-medium text-white">{category}</div>
                        <div className="text-sm text-gray-400">
                          {tutorials.filter(t => t.category === category).length} tutorials
                        </div>
                      </div>
                    ))}
                    {categories.length > 3 && (
                      <Button
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        variant="ghost"
                        className="w-full text-gray-400 hover:text-white"
                      >
                        {showAllCategories ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            Show More
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Stats */}
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-green-400" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">{completedTutorials.length}</div>
                      <div className="text-sm text-gray-400">Tutorials Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">
                        {Math.round((completedTutorials.length / tutorials.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-400">Learning Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tutorials Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials.map((tutorial, index) => (
                  <motion.div
                    key={tutorial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:border-purple-500/50 transition-all duration-300 h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>
                            {tutorial.difficulty}
                          </Badge>
                          {completedTutorials.includes(tutorial.id) && (
                            <div className="flex items-center gap-1 text-green-400">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm">Completed</span>
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                        <div className="text-sm text-purple-400">{tutorial.category}</div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 text-sm mb-4">{tutorial.description}</p>
                        <div className="text-xs text-gray-400 mb-4">
                          {tutorial.steps.length} steps • {tutorial.difficulty} level
                        </div>
                        <Button 
                          onClick={() => startTutorial(tutorial.id)}
                          disabled={completedTutorials.includes(tutorial.id)}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                        >
                          {completedTutorials.includes(tutorial.id) ? (
                            <>
                              <Star className="w-4 h-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Start Learning
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tutorial Content */}
        {selectedTutorial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {(() => {
              const tutorial = tutorials.find(t => t.id === selectedTutorial);
              if (!tutorial) return null;
              
              return (
                <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">{tutorial.title}</CardTitle>
                        <p className="text-gray-300 mt-2">{tutorial.description}</p>
                      </div>
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {tutorial.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.2 }}
                          className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-300 leading-relaxed">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 mt-8">
                      <Button 
                        onClick={() => setSelectedTutorial(null)}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:text-white"
                      >
                        Back to Tutorials
                      </Button>
                      <Button 
                        onClick={() => completeTutorial(tutorial.id)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Mark as Completed
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
}