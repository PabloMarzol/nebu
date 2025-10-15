import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ThumbsUp, ThumbsDown, TrendingUp, TrendingDown, Zap, Target, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reaction {
  id: string;
  type: 'like' | 'dislike' | 'bullish' | 'bearish' | 'fire' | 'target' | 'warning' | 'love';
  count: number;
  hasReacted: boolean;
}

interface ReactionSystemProps {
  insightId: string;
  initialReactions?: Reaction[];
  onReactionUpdate?: (reactions: Reaction[]) => void;
  className?: string;
}

const reactionConfig = {
  like: { icon: ThumbsUp, color: "text-green-500", bg: "bg-green-500/10", label: "Helpful" },
  dislike: { icon: ThumbsDown, color: "text-red-500", bg: "bg-red-500/10", label: "Not Helpful" },
  bullish: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Bullish" },
  bearish: { icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10", label: "Bearish" },
  fire: { icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10", label: "Hot Take" },
  target: { icon: Target, color: "text-blue-500", bg: "bg-blue-500/10", label: "On Target" },
  warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Risky" },
  love: { icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10", label: "Love It" }
};

export default function ReactionSystem({ 
  insightId, 
  initialReactions = [], 
  onReactionUpdate,
  className 
}: ReactionSystemProps) {
  const [reactions, setReactions] = useState<Reaction[]>(() => {
    // Initialize with default reactions if none provided
    if (initialReactions.length === 0) {
      return Object.keys(reactionConfig).map(type => ({
        id: `${insightId}-${type}`,
        type: type as Reaction['type'],
        count: Math.floor(Math.random() * 20),
        hasReacted: false
      }));
    }
    return initialReactions;
  });

  const [recentReactions, setRecentReactions] = useState<string[]>([]);

  const handleReaction = useCallback((reactionType: Reaction['type']) => {
    setReactions(prev => {
      const updated = prev.map(reaction => {
        if (reaction.type === reactionType) {
          const newHasReacted = !reaction.hasReacted;
          return {
            ...reaction,
            count: newHasReacted ? reaction.count + 1 : reaction.count - 1,
            hasReacted: newHasReacted
          };
        }
        return reaction;
      });
      
      onReactionUpdate?.(updated);
      return updated;
    });

    // Add to recent reactions for animation
    setRecentReactions(prev => [...prev, reactionType]);
    setTimeout(() => {
      setRecentReactions(prev => prev.filter(r => r !== reactionType));
    }, 2000);
  }, [onReactionUpdate]);

  const getTotalReactions = () => reactions.reduce((sum, r) => sum + r.count, 0);
  const getMostPopular = () => reactions.reduce((max, r) => r.count > max.count ? r : max, reactions[0]);

  return (
    <div className={cn("relative", className)}>
      {/* Floating reaction particles */}
      <AnimatePresence>
        {recentReactions.map((reactionType, index) => {
          const config = reactionConfig[reactionType as keyof typeof reactionConfig];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={`${reactionType}-${index}`}
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ 
                opacity: 0, 
                scale: 1.2, 
                y: -50,
                x: Math.random() * 40 - 20
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none z-10"
            >
              <Icon className={cn("w-6 h-6", config.color)} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Main reaction bar */}
      <div className="flex items-center gap-1 p-2 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
        {/* Quick stats */}
        <div className="text-xs text-muted-foreground mr-2 hidden sm:block">
          {getTotalReactions()} reactions
        </div>

        {/* Reaction buttons */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {reactions.map((reaction) => {
            const config = reactionConfig[reaction.type];
            const Icon = config.icon;

            return (
              <motion.button
                key={reaction.id}
                onClick={() => handleReaction(reaction.type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md transition-all",
                  "hover:shadow-sm border border-transparent",
                  reaction.hasReacted
                    ? cn(config.bg, config.color, "border-current/20")
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )}
                title={config.label}
              >
                <Icon className="w-4 h-4" />
                {reaction.count > 0 && (
                  <span className="text-xs font-medium min-w-[1ch]">
                    {reaction.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Most popular indicator */}
        {getMostPopular().count > 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ml-2 flex items-center gap-1 text-xs text-muted-foreground"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
            <span className="hidden sm:inline">Trending</span>
          </motion.div>
        )}
      </div>

      {/* Reaction insights tooltip */}
      <AnimatePresence>
        {getTotalReactions() > 20 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 p-2 bg-popover text-popover-foreground text-xs rounded-md border shadow-md z-20"
          >
            <div className="font-medium">Community Sentiment</div>
            <div className="text-muted-foreground">
              High engagement • {getMostPopular().type} leading
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Trading insight card with integrated reactions
export function TradingInsightCard({ 
  title, 
  content, 
  confidence, 
  timestamp,
  insightId,
  className 
}: {
  title: string;
  content: string;
  confidence: number;
  timestamp: string;
  insightId: string;
  className?: string;
}) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "text-green-500";
    if (conf >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-card border rounded-lg p-4 space-y-3", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">{title}</h3>
        <div className={cn("text-xs font-medium", getConfidenceColor(confidence))}>
          {confidence}% confidence
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-muted-foreground">{content}</p>

      {/* Footer with reactions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">{timestamp}</span>
        <ReactionSystem insightId={insightId} />
      </div>
    </motion.div>
  );
}