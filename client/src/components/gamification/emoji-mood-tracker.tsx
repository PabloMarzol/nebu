import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  BarChart3,
  Heart,
  Zap
} from "lucide-react";

interface MoodEntry {
  id: string;
  emoji: string;
  mood: string;
  portfolioChange: number;
  timestamp: Date;
  note?: string;
}

interface MoodStats {
  averagePerformance: number;
  bestMood: string;
  worstMood: string;
  totalEntries: number;
  streak: number;
}

export default function EmojiMoodTracker() {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(12750.32);
  const [portfolioChange, setPortfolioChange] = useState(2.45);
  const [showStats, setShowStats] = useState(false);

  const moods = [
    { emoji: '🚀', name: 'Moon Bound', description: 'Extremely bullish and optimistic' },
    { emoji: '😎', name: 'Cool & Confident', description: 'Steady and in control' },
    { emoji: '💎', name: 'Diamond Hands', description: 'HODLing strong through volatility' },
    { emoji: '🤑', name: 'Profit Mode', description: 'Making gains and feeling good' },
    { emoji: '📈', name: 'Trending Up', description: 'Positive about market direction' },
    { emoji: '😊', name: 'Optimistic', description: 'Generally happy with portfolio' },
    { emoji: '😐', name: 'Neutral', description: 'No strong feelings either way' },
    { emoji: '😰', name: 'Nervous', description: 'Worried about market movements' },
    { emoji: '😱', name: 'Panic Mode', description: 'Very concerned about losses' },
    { emoji: '📉', name: 'Bearish', description: 'Expecting downward movement' },
    { emoji: '💸', name: 'Losing Money', description: 'Seeing red in the portfolio' },
    { emoji: '🤬', name: 'Frustrated', description: 'Angry about market performance' }
  ];

  // Sample mood history data
  useEffect(() => {
    const sampleHistory: MoodEntry[] = [
      {
        id: '1',
        emoji: '🚀',
        mood: 'Moon Bound',
        portfolioChange: 5.2,
        timestamp: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        id: '2',
        emoji: '😎',
        mood: 'Cool & Confident',
        portfolioChange: 1.8,
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        id: '3',
        emoji: '😰',
        mood: 'Nervous',
        portfolioChange: -2.1,
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
      },
      {
        id: '4',
        emoji: '💎',
        mood: 'Diamond Hands',
        portfolioChange: -4.5,
        timestamp: new Date(Date.now() - 345600000), // 4 days ago
      }
    ];
    setMoodHistory(sampleHistory);
  }, []);

  const recordMood = (mood: { emoji: string; name: string }) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      emoji: mood.emoji,
      mood: mood.name,
      portfolioChange,
      timestamp: new Date()
    };

    setMoodHistory(prev => [newEntry, ...prev]);
    setCurrentMood(mood.emoji);
    
    // Simulate mood impact feedback
    setTimeout(() => setCurrentMood(null), 3000);
  };

  const getMoodStats = (): MoodStats => {
    if (moodHistory.length === 0) {
      return {
        averagePerformance: 0,
        bestMood: 'None',
        worstMood: 'None',
        totalEntries: 0,
        streak: 0
      };
    }

    const avgPerformance = moodHistory.reduce((sum, entry) => sum + entry.portfolioChange, 0) / moodHistory.length;
    const sortedByPerformance = [...moodHistory].sort((a, b) => b.portfolioChange - a.portfolioChange);
    
    return {
      averagePerformance: avgPerformance,
      bestMood: sortedByPerformance[0]?.mood || 'None',
      worstMood: sortedByPerformance[sortedByPerformance.length - 1]?.mood || 'None',
      totalEntries: moodHistory.length,
      streak: 7 // Sample streak
    };
  };

  const stats = getMoodStats();

  const getMoodColor = (change: number) => {
    if (change > 2) return 'text-green-400';
    if (change > 0) return 'text-green-300';
    if (change > -2) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            😊 Portfolio Mood Tracker 😊
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Track your emotional journey through the crypto markets
          </p>
        </motion.div>

        {/* Current Portfolio Status */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Current Portfolio</h2>
                <div className="text-4xl font-bold text-white mb-2">
                  ${portfolioValue.toLocaleString()}
                </div>
                <div className={`text-xl font-semibold flex items-center justify-center gap-2 ${getMoodColor(portfolioChange)}`}>
                  {portfolioChange > 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  {portfolioChange > 0 ? '+' : ''}{portfolioChange}%
                </div>
                <p className="text-gray-400 mt-2">How are you feeling about this performance?</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Mood Indicator */}
        <AnimatePresence>
          {currentMood && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed top-20 right-6 z-50 bg-purple-600 text-white px-6 py-4 rounded-full shadow-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentMood}</span>
                <span className="font-semibold">Mood Recorded!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mood Selection */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-400" />
                  How are you feeling today?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.name}
                      onClick={() => recordMood(mood)}
                      className="p-4 rounded-xl bg-gray-800/50 border border-gray-600/30 hover:border-purple-500/50 hover:bg-gray-700/50 transition-all duration-200 group text-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
                        {mood.emoji}
                      </div>
                      <div className="text-sm font-medium text-white mb-1">
                        {mood.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {mood.description}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood History */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  Recent Mood History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {moodHistory.slice(0, 8).map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{entry.emoji}</span>
                        <div>
                          <div className="font-medium text-white">{entry.mood}</div>
                          <div className="text-sm text-gray-400">
                            {entry.timestamp.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`font-semibold ${getMoodColor(entry.portfolioChange)}`}>
                        {entry.portfolioChange > 0 ? '+' : ''}{entry.portfolioChange}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Panel */}
          <div>
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                  Mood Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Average Performance</div>
                  <div className={`text-2xl font-bold ${getMoodColor(stats.averagePerformance)}`}>
                    {stats.averagePerformance > 0 ? '+' : ''}{stats.averagePerformance.toFixed(2)}%
                  </div>
                </div>

                <div className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Best Performing Mood</div>
                  <div className="text-lg font-semibold text-green-400">{stats.bestMood}</div>
                </div>

                <div className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Challenging Mood</div>
                  <div className="text-lg font-semibold text-red-400">{stats.worstMood}</div>
                </div>

                <div className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Tracking Streak</div>
                  <div className="text-2xl font-bold text-purple-400 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {stats.streak} days
                  </div>
                </div>

                <div className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Total Entries</div>
                  <div className="text-2xl font-bold text-blue-400">{stats.totalEntries}</div>
                </div>
              </CardContent>
            </Card>

            {/* Mood Insights */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-yellow-400" />
                  Mood Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="font-semibold text-blue-400 mb-1">💡 Insight</div>
                    <div className="text-gray-300">
                      Your 'Diamond Hands' mood correlates with better long-term performance during market dips.
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="font-semibold text-green-400 mb-1">📈 Pattern</div>
                    <div className="text-gray-300">
                      You tend to perform better when you maintain a 'Cool & Confident' mindset.
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <div className="font-semibold text-purple-400 mb-1">🎯 Tip</div>
                    <div className="text-gray-300">
                      Consider meditation or breaks when feeling 'Panic Mode' - it often leads to better decisions.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}