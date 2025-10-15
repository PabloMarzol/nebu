import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiReactionsProps {
  onReact?: (emoji: string) => void;
  className?: string;
}

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
}

export const EmojiReactions: React.FC<EmojiReactionsProps> = ({ onReact, className = '' }) => {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const tradingEmojis = [
    { emoji: '🚀', label: 'To the moon!' },
    { emoji: '📈', label: 'Bullish' },
    { emoji: '📉', label: 'Bearish' },
    { emoji: '💎', label: 'Diamond hands' },
    { emoji: '🔥', label: 'Hot trade' },
    { emoji: '⚡', label: 'Lightning fast' },
    { emoji: '💯', label: 'Perfect' },
    { emoji: '🎯', label: 'On target' },
    { emoji: '🤑', label: 'Profitable' },
    { emoji: '😎', label: 'Confident' },
    { emoji: '💪', label: 'Strong' },
    { emoji: '🌟', label: 'Excellent' }
  ];

  // Auto-cleanup floating emojis
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingEmojis(prev => prev.filter(emoji => 
        Date.now() - emoji.timestamp < 3000
      ));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    onReact?.(emoji);

    // Add floating emoji
    const newFloatingEmoji: FloatingEmoji = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      x: Math.random() * 80 + 10, // 10-90% of container width
      y: Math.random() * 60 + 20, // 20-80% of container height
      timestamp: Date.now()
    };

    setFloatingEmojis(prev => [...prev, newFloatingEmoji]);

    // Reset selection after animation
    setTimeout(() => setSelectedEmoji(null), 200);
  };

  const emojiButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    tap: { scale: 0.9 },
    selected: { scale: 1.3, rotate: 10 }
  };

  const floatingVariants = {
    initial: { 
      scale: 0.5, 
      opacity: 0, 
      y: 0,
      rotate: 0 
    },
    animate: { 
      scale: [0.5, 1.2, 1],
      opacity: [0, 1, 1, 0],
      y: [-20, -40, -60],
      rotate: [0, 180, 360],
      transition: {
        duration: 3,
        times: [0, 0.2, 0.8, 1],
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Emoji Selection Grid */}
      <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-900/30 rounded-xl backdrop-blur-sm">
        {tradingEmojis.map(({ emoji, label }) => (
          <motion.button
            key={emoji}
            className={`
              relative p-2 rounded-lg text-2xl transition-all duration-200
              ${selectedEmoji === emoji ? 'bg-blue-500/30' : 'bg-gray-800/50 hover:bg-gray-700/50'}
              border border-gray-600/30 hover:border-blue-500/50
            `}
            variants={emojiButtonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            animate={selectedEmoji === emoji ? "selected" : "initial"}
            onClick={() => handleEmojiClick(emoji)}
            title={label}
          >
            {emoji}
            
            {/* Pulse ring on selection */}
            {selectedEmoji === emoji && (
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-blue-400"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map((floatingEmoji) => (
            <motion.div
              key={floatingEmoji.id}
              className="absolute text-3xl z-10"
              style={{
                left: `${floatingEmoji.x}%`,
                top: `${floatingEmoji.y}%`
              }}
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              exit="initial"
            >
              {floatingEmoji.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reaction Counter */}
      <div className="mt-4 text-center">
        <motion.div
          className="text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click an emoji to react • {floatingEmojis.length} active reactions
        </motion.div>
      </div>
    </div>
  );
};

export default EmojiReactions;