import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Star, TrendingUp } from "lucide-react";

interface EmojiReaction {
  emoji: string;
  label: string;
  count: number;
  color: string;
  category: 'positive' | 'negative' | 'neutral';
}

interface FeedbackData {
  pageViews: number;
  averageRating: number;
  totalReactions: number;
  topEmoji: string;
}

export default function EmojiFeedbackSystem() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    pageViews: 1247,
    averageRating: 4.7,
    totalReactions: 89,
    topEmoji: '🚀'
  });

  const emojiReactions: EmojiReaction[] = [
    { emoji: '🚀', label: 'Bullish', count: 24, color: 'bg-green-500', category: 'positive' },
    { emoji: '💎', label: 'Diamond Hands', count: 18, color: 'bg-blue-500', category: 'positive' },
    { emoji: '📈', label: 'To the Moon', count: 15, color: 'bg-green-400', category: 'positive' },
    { emoji: '🔥', label: 'Hot Take', count: 12, color: 'bg-orange-500', category: 'positive' },
    { emoji: '⚡', label: 'Fast Trade', count: 10, color: 'bg-yellow-500', category: 'positive' },
    { emoji: '🎯', label: 'Perfect Entry', count: 8, color: 'bg-purple-500', category: 'positive' },
    { emoji: '😍', label: 'Love It', count: 6, color: 'bg-pink-500', category: 'positive' },
    { emoji: '🤔', label: 'Thinking', count: 4, color: 'bg-gray-500', category: 'neutral' },
    { emoji: '😱', label: 'Surprised', count: 3, color: 'bg-red-400', category: 'neutral' },
    { emoji: '📉', label: 'Bearish', count: 2, color: 'bg-red-500', category: 'negative' }
  ];

  const tradingEmojis = ['🚀', '💎', '📈', '🔥', '⚡', '🎯', '💰', '🌙', '🐂', '🐻'];
  const reactionEmojis = ['😍', '🤩', '😊', '🤔', '😮', '😱', '😅', '🙄', '😐', '😞'];

  const handleEmojiClick = (emoji: string, label: string) => {
    setSelectedEmoji(emoji);
    setShowThankYou(true);
    
    // Update reaction count
    const updatedReactions = emojiReactions.map(reaction => 
      reaction.emoji === emoji 
        ? { ...reaction, count: reaction.count + 1 }
        : reaction
    );
    
    // Show celebration animation
    createFloatingEmojis(emoji);
    
    // Hide thank you message after 2 seconds
    setTimeout(() => {
      setShowThankYou(false);
      setSelectedEmoji(null);
    }, 2000);
    
    // Update feedback data
    setFeedbackData(prev => ({
      ...prev,
      totalReactions: prev.totalReactions + 1,
      topEmoji: emoji
    }));
  };

  const createFloatingEmojis = (emoji: string) => {
    for (let i = 0; i < 5; i++) {
      const floatingEmoji = document.createElement('div');
      floatingEmoji.textContent = emoji;
      floatingEmoji.className = 'fixed text-2xl pointer-events-none z-50 animate-bounce';
      floatingEmoji.style.left = `${Math.random() * window.innerWidth}px`;
      floatingEmoji.style.top = `${Math.random() * window.innerHeight}px`;
      floatingEmoji.style.animationDuration = '2s';
      
      document.body.appendChild(floatingEmoji);
      
      setTimeout(() => {
        floatingEmoji.remove();
      }, 2000);
    }
  };

  const getTopReactions = () => {
    return emojiReactions
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getTrendingEmoji = () => {
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 16) return '📈'; // Market hours
    if (hour >= 17 && hour <= 20) return '🌙'; // Evening
    return '💎'; // Default
  };

  useEffect(() => {
    // Show feedback widget after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Listen for custom events to show feedback
    const handleShowFeedback = () => setIsVisible(true);
    window.addEventListener('showEmojiFeedback', handleShowFeedback);
    return () => window.removeEventListener('showEmojiFeedback', handleShowFeedback);
  }, []);

  return (
    <>
      {/* Floating Quick Reaction Buttons */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col space-y-2">
        {tradingEmojis.slice(0, 3).map((emoji, index) => (
          <motion.button
            key={emoji}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            onClick={() => handleEmojiClick(emoji, 'Quick Reaction')}
            className="w-12 h-12 bg-black/20 backdrop-blur-lg border border-white/20 rounded-full text-2xl hover:scale-110 transition-transform"
            title={`React with ${emoji}`}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      {/* Main Feedback Widget */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-96 max-w-[90vw]"
          >
            <Card className="bg-black/90 backdrop-blur-lg border-purple-500/30 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span>How's your trading experience?</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Thank You Message */}
                <AnimatePresence>
                  {showThankYou && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center py-4"
                    >
                      <div className="text-4xl mb-2">{selectedEmoji}</div>
                      <p className="text-green-400 font-semibold">Thanks for your feedback!</p>
                      <p className="text-xs text-gray-400">Your reaction helps us improve</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showThankYou && (
                  <>
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/5 rounded p-2">
                        <div className="text-lg font-bold text-blue-400">{feedbackData.pageViews}</div>
                        <div className="text-xs text-gray-400">Views</div>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <div className="text-lg font-bold text-yellow-400">{feedbackData.averageRating}/5</div>
                        <div className="text-xs text-gray-400">Rating</div>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <div className="text-lg font-bold text-green-400">{feedbackData.totalReactions}</div>
                        <div className="text-xs text-gray-400">Reactions</div>
                      </div>
                    </div>

                    {/* Trading Emotions */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                        Trading Mood
                      </h4>
                      <div className="grid grid-cols-5 gap-2">
                        {tradingEmojis.map((emoji, index) => (
                          <motion.button
                            key={emoji}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEmojiClick(emoji, 'Trading Mood')}
                            className="aspect-square bg-white/5 rounded-lg text-xl hover:bg-white/10 transition-colors flex items-center justify-center"
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* General Reactions */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1 text-blue-400" />
                        Overall Experience
                      </h4>
                      <div className="grid grid-cols-5 gap-2">
                        {reactionEmojis.map((emoji, index) => (
                          <motion.button
                            key={emoji}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEmojiClick(emoji, 'General Reaction')}
                            className="aspect-square bg-white/5 rounded-lg text-xl hover:bg-white/10 transition-colors flex items-center justify-center"
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Top Reactions */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        Community Favorites
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {getTopReactions().map((reaction, index) => (
                          <Badge
                            key={reaction.emoji}
                            variant="outline"
                            className="bg-white/5 border-white/20 hover:bg-white/10 cursor-pointer transition-colors"
                            onClick={() => handleEmojiClick(reaction.emoji, reaction.label)}
                          >
                            <span className="mr-1">{reaction.emoji}</span>
                            <span className="text-xs">{reaction.count}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Trending Emoji */}
                    <div className="text-center border-t border-white/10 pt-3">
                      <p className="text-xs text-gray-400 mb-2">Trending now</p>
                      <motion.button
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        onClick={() => handleEmojiClick(getTrendingEmoji(), 'Trending')}
                        className="text-3xl hover:scale-110 transition-transform"
                      >
                        {getTrendingEmoji()}
                      </motion.button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook for triggering feedback from anywhere
export function useEmojiFeedback() {
  const showFeedback = () => {
    window.dispatchEvent(new Event('showEmojiFeedback'));
  };

  const quickReaction = (emoji: string) => {
    // Create floating emoji animation
    const floatingEmoji = document.createElement('div');
    floatingEmoji.textContent = emoji;
    floatingEmoji.className = 'fixed text-3xl pointer-events-none z-50 animate-pulse';
    floatingEmoji.style.left = '50%';
    floatingEmoji.style.top = '50%';
    floatingEmoji.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(floatingEmoji);
    
    setTimeout(() => {
      floatingEmoji.remove();
    }, 1500);
  };

  return { showFeedback, quickReaction };
}