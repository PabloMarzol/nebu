import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Zap, Star, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Nebby character animations
const nebbyVariants = {
  idle: {
    scale: [1, 1.05, 1],
    rotate: [0, 5, -5, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  },
  thinking: {
    scale: [1, 1.1, 0.95, 1],
    y: [0, -5, 0],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
  },
  excited: {
    scale: [1, 1.2, 1, 1.1, 1],
    rotate: [0, 10, -10, 0],
    transition: { duration: 0.8, repeat: Infinity }
  }
};

// Nebby character component
function NebbyCharacter({ mood = "idle", size = "md" }: { mood?: keyof typeof nebbyVariants; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  return (
    <motion.div
      variants={nebbyVariants}
      animate={mood}
      className={cn("relative", sizeClasses[size])}
    >
      {/* Nebby body */}
      <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full relative overflow-hidden">
        {/* Sparkle overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
        
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>

        {/* Floating particles */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ 
            scale: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <Sparkles className="w-3 h-3 text-yellow-300" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Base skeleton component with Nebby
function NebbySkeletonBase({ 
  children, 
  message, 
  nebbyMood = "thinking",
  className 
}: { 
  children: React.ReactNode; 
  message?: string; 
  nebbyMood?: keyof typeof nebbyVariants;
  className?: string;
}) {
  return (
    <div className={cn("relative p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg", className)}>
      {/* Nebby and message */}
      <div className="flex items-center gap-3 mb-4">
        <NebbyCharacter mood={nebbyMood} />
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-medium text-foreground"
          >
            {message || "Nebby is working on this..."}
          </motion.div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xs text-muted-foreground mt-1"
          >
            Please wait while I analyze the data
          </motion.div>
        </div>
      </div>

      {/* Content skeleton */}
      {children}

      {/* Progress indicator */}
      <div className="mt-4 w-full bg-muted/50 rounded-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "70%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

// Trading data skeleton
export function TradingDataSkeleton() {
  return (
    <NebbySkeletonBase 
      message="Analyzing market trends..." 
      nebbyMood="thinking"
      className="space-y-4"
    >
      {/* Price chart skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted/60 rounded w-24 animate-pulse" />
          <div className="h-4 bg-muted/60 rounded w-16 animate-pulse" />
        </div>
        
        {/* Chart bars */}
        <div className="flex items-end justify-between h-24 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-t from-blue-500/20 to-purple-500/20 rounded-t"
              style={{ width: `${100/12}%`, height: `${Math.random() * 70 + 30}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.random() * 70 + 30}%` }}
              transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div 
            key={i}
            className="p-3 bg-muted/30 rounded border"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          >
            <div className="h-3 bg-muted/60 rounded w-full mb-2 animate-pulse" />
            <div className="h-5 bg-muted/60 rounded w-3/4 animate-pulse" />
          </motion.div>
        ))}
      </div>
    </NebbySkeletonBase>
  );
}

// Portfolio skeleton
export function PortfolioSkeleton() {
  return (
    <NebbySkeletonBase 
      message="Calculating your portfolio..." 
      nebbyMood="excited"
      className="space-y-4"
    >
      {/* Balance overview */}
      <div className="text-center space-y-2">
        <div className="h-8 bg-muted/60 rounded w-32 mx-auto animate-pulse" />
        <div className="h-4 bg-muted/60 rounded w-20 mx-auto animate-pulse" />
      </div>

      {/* Asset list */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-between p-3 bg-muted/20 rounded"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted/60 rounded-full animate-pulse" />
              <div className="space-y-1">
                <div className="h-3 bg-muted/60 rounded w-12 animate-pulse" />
                <div className="h-2 bg-muted/60 rounded w-16 animate-pulse" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="h-3 bg-muted/60 rounded w-16 animate-pulse" />
              <div className="h-2 bg-muted/60 rounded w-12 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </NebbySkeletonBase>
  );
}

// Market data skeleton
export function MarketDataSkeleton() {
  return (
    <NebbySkeletonBase 
      message="Fetching live market data..." 
      nebbyMood="idle"
      className="space-y-4"
    >
      {/* Market overview */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="text-center space-y-2 p-3 bg-muted/20 rounded"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="h-4 bg-muted/60 rounded w-16 mx-auto animate-pulse" />
            <div className="h-6 bg-muted/60 rounded w-20 mx-auto animate-pulse" />
            <div className="h-3 bg-muted/60 rounded w-12 mx-auto animate-pulse" />
          </motion.div>
        ))}
      </div>

      {/* Trending coins */}
      <div className="space-y-2">
        <div className="h-4 bg-muted/60 rounded w-24 animate-pulse mb-3" />
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center justify-between p-2 bg-muted/20 rounded"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted/60 rounded-full animate-pulse" />
              <div className="h-3 bg-muted/60 rounded w-16 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 bg-muted/60 rounded w-12 animate-pulse" />
              <TrendingUp className="w-3 h-3 text-green-500 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </NebbySkeletonBase>
  );
}

// AI insights skeleton
export function AIInsightsSkeleton() {
  return (
    <NebbySkeletonBase 
      message="AI is generating insights..." 
      nebbyMood="excited"
      className="space-y-4"
    >
      {/* Insight cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="p-4 bg-muted/20 rounded border space-y-3"
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ delay: i * 0.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted/60 rounded w-32 animate-pulse" />
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
              <div className="h-3 bg-muted/60 rounded w-8 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-3 bg-muted/60 rounded w-full animate-pulse" />
            <div className="h-3 bg-muted/60 rounded w-4/5 animate-pulse" />
            <div className="h-3 bg-muted/60 rounded w-3/5 animate-pulse" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="h-2 bg-muted/60 rounded w-16 animate-pulse" />
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="w-6 h-6 bg-muted/60 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </NebbySkeletonBase>
  );
}

// Generic content skeleton
export function ContentSkeleton({ 
  title = "Loading content...", 
  rows = 5,
  showChart = false 
}: { 
  title?: string; 
  rows?: number;
  showChart?: boolean;
}) {
  return (
    <NebbySkeletonBase message={title}>
      <div className="space-y-3">
        {showChart && (
          <div className="h-32 bg-muted/20 rounded flex items-end justify-between p-4 gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-t from-blue-500/30 to-purple-500/30 rounded-t flex-1"
                initial={{ height: "20%" }}
                animate={{ height: `${Math.random() * 60 + 20}%` }}
                transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
              />
            ))}
          </div>
        )}
        
        {Array.from({ length: rows }).map((_, i) => (
          <motion.div
            key={i}
            className="h-4 bg-muted/60 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
      </div>
    </NebbySkeletonBase>
  );
}