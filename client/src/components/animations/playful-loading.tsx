import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bitcoin, Coins, TrendingUp, Zap, Rocket, Star } from "lucide-react";

interface LoadingStoryProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const cryptoStories = [
  {
    icon: Bitcoin,
    text: "Bitcoin is waking up...",
    subtitle: "The king of crypto stretches its digital wings",
    color: "from-orange-400 to-yellow-500"
  },
  {
    icon: TrendingUp,
    text: "Charts are painting patterns...",
    subtitle: "Market data flows like digital rivers",
    color: "from-green-400 to-emerald-500"
  },
  {
    icon: Rocket,
    text: "Portfolio is launching...",
    subtitle: "To the moon and beyond! 🚀",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: Zap,
    text: "Trading engine igniting...",
    subtitle: "Lightning-fast execution incoming",
    color: "from-purple-400 to-pink-500"
  },
  {
    icon: Star,
    text: "NebulaX magic activated!",
    subtitle: "Welcome to the future of trading",
    color: "from-indigo-400 to-purple-500"
  }
];

export default function PlayfulLoading({ isLoading, onComplete }: LoadingStoryProps) {
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const storyInterval = setInterval(() => {
      setCurrentStory(prev => {
        const next = (prev + 1) % cryptoStories.length;
        if (next === 0 && onComplete) {
          setTimeout(onComplete, 500);
        }
        return next;
      });
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(storyInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  const story = cryptoStories[currentStory];
  const IconComponent = story.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur"
    >
      <div className="text-center space-y-8">
        {/* Animated icon */}
        <motion.div
          key={currentStory}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-r ${story.color} flex items-center justify-center shadow-2xl`}
        >
          <IconComponent className="w-12 h-12 text-white" />
        </motion.div>

        {/* Story text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-bold text-foreground">{story.text}</h2>
            <p className="text-muted-foreground">{story.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${story.color} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}% loaded</p>
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            initial={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: 0
            }}
            animate={{
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Mini loading component for individual elements
export function MiniCryptoLoader({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`inline-flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Coins className="w-4 h-4 text-primary" />
      </motion.div>
      <span className="text-sm text-muted-foreground">Loading crypto magic...</span>
    </motion.div>
  );
}