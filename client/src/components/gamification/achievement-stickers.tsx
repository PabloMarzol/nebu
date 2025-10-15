import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  Crown,
  Zap,
  Target,
  Gift,
  Sparkles,
  Medal,
  Award,
  Gem,
  Rocket,
  Shield,
  Heart,
  TrendingUp,
  Calendar,
  Users,
  BookOpen,
  Lock,
  Unlock
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'Trading' | 'Learning' | 'Social' | 'Milestones' | 'Special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  icon: string;
  stickerDesign: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  requirements: string[];
  reward: string;
}

interface StickerCollection {
  totalStickers: number;
  unlockedStickers: number;
  rarityCount: Record<string, number>;
  completionPercentage: number;
}

export default function AchievementStickers() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSticker, setSelectedSticker] = useState<Achievement | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);

  const achievements: Achievement[] = [
    {
      id: 'first-trade',
      title: 'First Steps',
      description: 'Complete your very first cryptocurrency trade',
      category: 'Trading',
      rarity: 'Common',
      icon: '🎯',
      stickerDesign: 'bg-gradient-to-br from-green-400 to-green-600',
      unlocked: true,
      unlockedAt: new Date('2024-07-15'),
      progress: 1,
      maxProgress: 1,
      requirements: ['Execute 1 trade'],
      reward: '+100 XP'
    },
    {
      id: 'diamond-hands',
      title: 'Diamond Hands',
      description: 'Hold a position for 30 days without selling',
      category: 'Trading',
      rarity: 'Rare',
      icon: '💎',
      stickerDesign: 'bg-gradient-to-br from-blue-400 to-blue-600',
      unlocked: true,
      unlockedAt: new Date('2024-07-20'),
      progress: 30,
      maxProgress: 30,
      requirements: ['Hold position for 30 days'],
      reward: '+500 XP + Diamond Badge'
    },
    {
      id: 'whale-trader',
      title: 'Whale Trader',
      description: 'Execute a trade worth over $10,000',
      category: 'Trading',
      rarity: 'Epic',
      icon: '🐋',
      stickerDesign: 'bg-gradient-to-br from-purple-400 to-purple-600',
      unlocked: false,
      progress: 7500,
      maxProgress: 10000,
      requirements: ['Single trade ≥ $10,000'],
      reward: '+1000 XP + Whale Status'
    },
    {
      id: 'crypto-scholar',
      title: 'Crypto Scholar',
      description: 'Complete 10 educational tutorials',
      category: 'Learning',
      rarity: 'Rare',
      icon: '📚',
      stickerDesign: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      unlocked: true,
      unlockedAt: new Date('2024-07-25'),
      progress: 10,
      maxProgress: 10,
      requirements: ['Complete 10 tutorials'],
      reward: '+750 XP + Scholar Badge'
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Share 5 portfolio screenshots on social media',
      category: 'Social',
      rarity: 'Common',
      icon: '🦋',
      stickerDesign: 'bg-gradient-to-br from-pink-400 to-pink-600',
      unlocked: true,
      unlockedAt: new Date('2024-07-18'),
      progress: 5,
      maxProgress: 5,
      requirements: ['Share 5 portfolio screenshots'],
      reward: '+200 XP'
    },
    {
      id: 'hundred-k-club',
      title: '100K Club',
      description: 'Reach a portfolio value of $100,000',
      category: 'Milestones',
      rarity: 'Legendary',
      icon: '👑',
      stickerDesign: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500',
      unlocked: false,
      progress: 45750,
      maxProgress: 100000,
      requirements: ['Portfolio value ≥ $100,000'],
      reward: '+2000 XP + Crown Badge + Exclusive Benefits'
    },
    {
      id: 'mood-tracker',
      title: 'Emotion Master',
      description: 'Track your trading mood for 30 consecutive days',
      category: 'Special',
      rarity: 'Epic',
      icon: '😊',
      stickerDesign: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      unlocked: false,
      progress: 12,
      maxProgress: 30,
      requirements: ['30 day mood tracking streak'],
      reward: '+1200 XP + Zen Master Badge'
    },
    {
      id: 'early-adopter',
      title: 'Early Adopter',
      description: 'Join NebulaX in the first 1000 users',
      category: 'Special',
      rarity: 'Mythic',
      icon: '🚀',
      stickerDesign: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
      unlocked: true,
      unlockedAt: new Date('2024-07-10'),
      progress: 1,
      maxProgress: 1,
      requirements: ['Be among first 1000 users'],
      reward: '+5000 XP + Founder Badge + Lifetime Benefits'
    },
    {
      id: 'streak-master',
      title: 'Streak Master',
      description: 'Log in for 100 consecutive days',
      category: 'Milestones',
      rarity: 'Epic',
      icon: '🔥',
      stickerDesign: 'bg-gradient-to-br from-orange-400 to-red-600',
      unlocked: false,
      progress: 47,
      maxProgress: 100,
      requirements: ['100 day login streak'],
      reward: '+1500 XP + Fire Badge'
    },
    {
      id: 'ai-whisperer',
      title: 'AI Whisperer',
      description: 'Use AI trading assistant 50 times',
      category: 'Special',
      rarity: 'Rare',
      icon: '🤖',
      stickerDesign: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
      unlocked: false,
      progress: 23,
      maxProgress: 50,
      requirements: ['Use AI assistant 50 times'],
      reward: '+800 XP + AI Master Badge'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Stickers', icon: '🌟' },
    { id: 'Trading', name: 'Trading', icon: '📈' },
    { id: 'Learning', name: 'Learning', icon: '📚' },
    { id: 'Social', name: 'Social', icon: '👥' },
    { id: 'Milestones', name: 'Milestones', icon: '🎯' },
    { id: 'Special', name: 'Special', icon: '✨' }
  ];

  const rarityColors = {
    Common: 'from-gray-400 to-gray-600',
    Rare: 'from-blue-400 to-blue-600',
    Epic: 'from-purple-400 to-purple-600',
    Legendary: 'from-yellow-400 to-orange-500',
    Mythic: 'from-pink-500 to-red-500'
  };

  const rarityGlow = {
    Common: 'shadow-gray-500/25',
    Rare: 'shadow-blue-500/50',
    Epic: 'shadow-purple-500/50',
    Legendary: 'shadow-yellow-500/50',
    Mythic: 'shadow-pink-500/75'
  };

  const getCollection = (): StickerCollection => {
    const unlockedStickers = achievements.filter(a => a.unlocked).length;
    const rarityCount = achievements.reduce((acc, achievement) => {
      if (achievement.unlocked) {
        acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalStickers: achievements.length,
      unlockedStickers,
      rarityCount,
      completionPercentage: (unlockedStickers / achievements.length) * 100
    };
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const unlockedMatch = !showUnlockedOnly || achievement.unlocked;
    return categoryMatch && unlockedMatch;
  });

  const collection = getCollection();

  // Simulate unlocking a new achievement
  const simulateUnlock = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      achievement.progress = achievement.maxProgress;
      setNewUnlock(achievement);
      setTimeout(() => setNewUnlock(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* New Achievement Notification */}
        <AnimatePresence>
          {newUnlock && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Card className={`bg-gradient-to-r ${rarityColors[newUnlock.rarity]} ${rarityGlow[newUnlock.rarity]} shadow-2xl border-2 border-white/30`}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{newUnlock.icon}</div>
                    <h3 className="text-xl font-bold mb-1">Achievement Unlocked!</h3>
                    <p className="text-lg font-semibold">{newUnlock.title}</p>
                    <Badge className="mt-2 bg-white/20 text-white border-white/30">
                      {newUnlock.rarity}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            🏆 Achievement Sticker Collection 🏆
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Collect unique stickers by achieving milestones in your crypto journey!
          </p>
        </motion.div>

        {/* Collection Stats */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{collection.unlockedStickers}</div>
                  <div className="text-sm text-gray-400">/ {collection.totalStickers} Collected</div>
                  <Progress value={collection.completionPercentage} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{collection.rarityCount.Rare || 0}</div>
                  <div className="text-sm text-gray-400">Rare Stickers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{collection.rarityCount.Epic || 0}</div>
                  <div className="text-sm text-gray-400">Epic Stickers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{collection.rarityCount.Legendary || 0}</div>
                  <div className="text-sm text-gray-400">Legendary Stickers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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
          <Button
            variant="outline"
            onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
            className={`${
              showUnlockedOnly 
                ? 'bg-green-500 text-white border-green-500' 
                : 'bg-black/20 text-gray-300 border-gray-600 hover:bg-gray-700/50'
            }`}
          >
            {showUnlockedOnly ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
            {showUnlockedOnly ? 'Unlocked Only' : 'Show All'}
          </Button>
        </div>

        {/* Sticker Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              onClick={() => setSelectedSticker(achievement)}
              className="cursor-pointer"
            >
              <Card className={`${
                achievement.unlocked 
                  ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} ${rarityGlow[achievement.rarity]} border-white/30` 
                  : 'bg-black/40 border-gray-600/30'
              } backdrop-blur-lg transition-all duration-300 hover:scale-105 ${
                achievement.unlocked ? 'shadow-xl' : ''
              }`}>
                <CardContent className="p-4 text-center">
                  <div className={`text-4xl mb-3 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.unlocked ? achievement.icon : '🔒'}
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.title}
                  </h3>
                  <Badge className={`text-xs ${
                    achievement.unlocked 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-gray-700/50 text-gray-400 border-gray-600/30'
                  }`}>
                    {achievement.rarity}
                  </Badge>
                  
                  {!achievement.unlocked && achievement.progress > 0 && (
                    <div className="mt-2">
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <div className="text-xs text-white/70 mt-2">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Unlock Buttons (for demo) */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Demo: Quick Unlock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Try unlocking achievements instantly (demo mode)
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {achievements
                  .filter(a => !a.unlocked)
                  .slice(0, 4)
                  .map((achievement) => (
                    <Button
                      key={achievement.id}
                      onClick={() => simulateUnlock(achievement.id)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      Unlock {achievement.icon}
                    </Button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sticker Detail Modal */}
        <AnimatePresence>
          {selectedSticker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedSticker(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-md w-full"
              >
                <Card className={`${
                  selectedSticker.unlocked 
                    ? `bg-gradient-to-br ${rarityColors[selectedSticker.rarity]} ${rarityGlow[selectedSticker.rarity]} border-white/30` 
                    : 'bg-black/80 border-gray-600/30'
                } backdrop-blur-lg`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className={`text-6xl mb-4 ${selectedSticker.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {selectedSticker.unlocked ? selectedSticker.icon : '🔒'}
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{selectedSticker.title}</h2>
                      <Badge className={`mb-4 ${
                        selectedSticker.unlocked 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-gray-700/50 text-gray-400 border-gray-600/30'
                      }`}>
                        {selectedSticker.rarity} • {selectedSticker.category}
                      </Badge>
                      <p className="text-gray-300 mb-4">{selectedSticker.description}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Requirements:</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {selectedSticker.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                              {selectedSticker.unlocked ? (
                                <Star className="w-4 h-4 text-green-400 fill-current" />
                              ) : (
                                <div className="w-4 h-4 border border-gray-500 rounded" />
                              )}
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {!selectedSticker.unlocked && selectedSticker.progress > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Progress:</h4>
                          <Progress 
                            value={(selectedSticker.progress / selectedSticker.maxProgress) * 100} 
                            className="mb-2"
                          />
                          <div className="text-sm text-gray-400">
                            {selectedSticker.progress} / {selectedSticker.maxProgress}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2">Reward:</h4>
                        <p className="text-sm text-yellow-400">{selectedSticker.reward}</p>
                      </div>

                      {selectedSticker.unlocked && selectedSticker.unlockedAt && (
                        <div>
                          <h4 className="font-semibold mb-2">Unlocked:</h4>
                          <p className="text-sm text-green-400">
                            {selectedSticker.unlockedAt.toLocaleDateString()} at {selectedSticker.unlockedAt.toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={() => setSelectedSticker(null)}
                      className="w-full mt-6 bg-purple-500 hover:bg-purple-600"
                    >
                      Close
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}