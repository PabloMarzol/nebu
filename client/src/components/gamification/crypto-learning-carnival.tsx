import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Trophy,
  Gift,
  Zap,
  Target,
  Crown,
  Rocket,
  Coins,
  TrendingUp,
  Brain,
  GameController2,
  Play,
  CheckCircle
} from "lucide-react";

interface LearningGame {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  points: number;
  completed: boolean;
  icon: string;
  category: string;
}

interface CarnivalReward {
  id: string;
  name: string;
  description: string;
  points: number;
  unlocked: boolean;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export default function CryptoLearningCarnival() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(1250);
  const [completedGames, setCompletedGames] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRewards, setShowRewards] = useState(false);

  const learningGames: LearningGame[] = [
    {
      id: 'crypto-basics',
      title: 'Crypto Basics Quiz 🎯',
      description: 'Learn the fundamentals of cryptocurrency and blockchain',
      difficulty: 'Beginner',
      points: 100,
      completed: false,
      icon: '🎯',
      category: 'basics'
    },
    {
      id: 'trading-simulator',
      title: 'Trading Simulator 📈',
      description: 'Practice trading with virtual funds in real market conditions',
      difficulty: 'Intermediate',
      points: 250,
      completed: false,
      icon: '📈',
      category: 'trading'
    },
    {
      id: 'defi-adventure',
      title: 'DeFi Adventure 🌟',
      description: 'Explore decentralized finance protocols and strategies',
      difficulty: 'Advanced',
      points: 400,
      completed: false,
      icon: '🌟',
      category: 'defi'
    },
    {
      id: 'nft-creation',
      title: 'NFT Creation Workshop 🎨',
      description: 'Learn to create and mint your own NFTs',
      difficulty: 'Intermediate',
      points: 300,
      completed: false,
      icon: '🎨',
      category: 'nft'
    },
    {
      id: 'security-master',
      title: 'Security Master 🛡️',
      description: 'Master crypto security best practices',
      difficulty: 'Beginner',
      points: 150,
      completed: false,
      icon: '🛡️',
      category: 'security'
    },
    {
      id: 'whale-hunter',
      title: 'Whale Hunter 🐋',
      description: 'Learn to analyze whale movements and market sentiment',
      difficulty: 'Advanced',
      points: 500,
      completed: false,
      icon: '🐋',
      category: 'analysis'
    }
  ];

  const rewards: CarnivalReward[] = [
    {
      id: 'bronze-trader',
      name: 'Bronze Trader Badge',
      description: 'Complete 3 learning games',
      points: 300,
      unlocked: false,
      rarity: 'Common'
    },
    {
      id: 'crypto-scholar',
      name: 'Crypto Scholar Trophy',
      description: 'Master all beginner level games',
      points: 500,
      unlocked: false,
      rarity: 'Rare'
    },
    {
      id: 'defi-pioneer',
      name: 'DeFi Pioneer Crown',
      description: 'Complete advanced DeFi challenges',
      points: 800,
      unlocked: false,
      rarity: 'Epic'
    },
    {
      id: 'carnival-legend',
      name: 'Carnival Legend',
      description: 'Achieve 2000+ carnival points',
      points: 2000,
      unlocked: false,
      rarity: 'Legendary'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'basics', name: 'Basics', icon: '📚' },
    { id: 'trading', name: 'Trading', icon: '📊' },
    { id: 'defi', name: 'DeFi', icon: '🌐' },
    { id: 'nft', name: 'NFTs', icon: '🎨' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'analysis', name: 'Analysis', icon: '🔍' }
  ];

  const filteredGames = selectedCategory === 'all' 
    ? learningGames 
    : learningGames.filter(game => game.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'border-gray-500/50 bg-gray-500/10';
      case 'Rare': return 'border-blue-500/50 bg-blue-500/10';
      case 'Epic': return 'border-purple-500/50 bg-purple-500/10';
      case 'Legendary': return 'border-yellow-500/50 bg-yellow-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const playGame = (gameId: string) => {
    setActiveGame(gameId);
    // Simulate game completion after 3 seconds
    setTimeout(() => {
      setCompletedGames(prev => [...prev, gameId]);
      const game = learningGames.find(g => g.id === gameId);
      if (game) {
        setUserPoints(prev => prev + game.points);
      }
      setActiveGame(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            🎪 Crypto Learning Carnival 🎪
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Learn, play, and earn rewards in the most fun crypto education experience!
          </p>
          
          {/* User Stats */}
          <div className="flex justify-center items-center gap-6 bg-black/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-xl font-bold text-yellow-400">{userPoints}</span>
              <span className="text-gray-300">Points</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold text-purple-400">{completedGames.length}</span>
              <span className="text-gray-300">Games Completed</span>
            </div>
            <Button 
              onClick={() => setShowRewards(!showRewards)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Gift className="w-4 h-4 mr-2" />
              View Rewards
            </Button>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-black/20 text-gray-300 border-gray-600 hover:bg-gray-700/50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Rewards Panel */}
        <AnimatePresence>
          {showRewards && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-6 h-6 text-yellow-400" />
                    Carnival Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className={`p-4 rounded-lg border ${getRarityColor(reward.rarity)} ${
                          userPoints >= reward.points ? 'opacity-100' : 'opacity-50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">
                            {reward.rarity === 'Legendary' ? '👑' : 
                             reward.rarity === 'Epic' ? '🏆' : 
                             reward.rarity === 'Rare' ? '🎖️' : '🥉'}
                          </div>
                          <h4 className="font-semibold mb-1">{reward.name}</h4>
                          <p className="text-xs text-gray-400 mb-2">{reward.description}</p>
                          <Badge variant="outline" className={getRarityColor(reward.rarity)}>
                            {reward.rarity}
                          </Badge>
                          <div className="mt-2 text-sm text-yellow-400">
                            {reward.points} pts required
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-black/20 backdrop-blur-lg border-white/10 hover:border-purple-500/50 transition-all duration-300 group hover:scale-105">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{game.icon}</div>
                    <Badge className={getDifficultyColor(game.difficulty)}>
                      {game.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{game.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{game.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">{game.points} pts</span>
                    </div>
                    {completedGames.includes(game.id) && (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Completed!</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => playGame(game.id)}
                    disabled={activeGame === game.id || completedGames.includes(game.id)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                  >
                    {activeGame === game.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Playing...
                      </>
                    ) : completedGames.includes(game.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Play Game
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progress Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-4">Your Carnival Progress</h3>
              <div className="max-w-md mx-auto">
                <div className="flex justify-between mb-2">
                  <span>Progress to next reward</span>
                  <span>{userPoints}/2000 pts</span>
                </div>
                <Progress value={(userPoints / 2000) * 100} className="h-3 mb-4" />
                <p className="text-gray-400 text-sm">
                  Complete more games to unlock exclusive rewards and climb the carnival leaderboard!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}