import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  X, 
  ArrowRight, 
  Lightbulb,
  TrendingUp,
  Shield,
  Wallet,
  BarChart3,
  Zap
} from "lucide-react";

interface TooltipContent {
  id: string;
  title: string;
  content: string;
  category: 'basics' | 'trading' | 'security' | 'advanced';
  mascotExpression: 'happy' | 'thinking' | 'excited' | 'serious';
  actionText?: string;
  onAction?: () => void;
}

interface MascotTooltipProps {
  isVisible: boolean;
  content: TooltipContent;
  position: { x: number; y: number };
  onClose: () => void;
  onNext?: () => void;
}

const mascotExpressions = {
  happy: "😊",
  thinking: "🤔", 
  excited: "🤩",
  serious: "😐"
};

const categoryIcons = {
  basics: HelpCircle,
  trading: TrendingUp,
  security: Shield,
  advanced: BarChart3
};

const categoryColors = {
  basics: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  trading: "bg-green-500/10 text-green-500 border-green-500/20",
  security: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  advanced: "bg-purple-500/10 text-purple-500 border-purple-500/20"
};

export function CryptoMascotTooltip({ 
  isVisible, 
  content, 
  position, 
  onClose, 
  onNext 
}: MascotTooltipProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const CategoryIcon = categoryIcons[content.category];

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="fixed z-50 max-w-sm"
        style={{
          left: Math.min(position.x, window.innerWidth - 400),
          top: Math.max(position.y - 200, 20)
        }}
      >
        {/* Mascot Character */}
        <motion.div
          className="absolute -top-8 left-4 text-4xl z-10"
          animate={{ 
            y: isAnimating ? [-5, 5, -5] : [0, -3, 0],
            rotate: isAnimating ? [-5, 5, -5] : 0 
          }}
          transition={{ 
            duration: isAnimating ? 0.5 : 2,
            repeat: isAnimating ? 1 : Infinity,
            ease: "easeInOut"
          }}
        >
          {mascotExpressions[content.mascotExpression]}
        </motion.div>

        {/* Speech Bubble */}
        <div className="bg-card border shadow-lg rounded-lg p-4 mt-4 relative">
          {/* Speech Bubble Tail */}
          <div className="absolute -top-2 left-8 w-4 h-4 bg-card border-l border-t rotate-45 transform"></div>
          
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={categoryColors[content.category]}>
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {content.category}
                </Badge>
                <Lightbulb className="w-4 h-4 text-yellow-500" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Content */}
            <div>
              <h4 className="font-semibold text-sm mb-2">{content.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              {content.actionText && content.onAction && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={content.onAction}
                  className="text-xs"
                >
                  {content.actionText}
                </Button>
              )}
              
              {onNext && (
                <Button 
                  size="sm" 
                  onClick={onNext}
                  className="text-xs ml-auto"
                >
                  Next Tip
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Predefined tooltip content
export const cryptoTooltips: TooltipContent[] = [
  {
    id: 'welcome',
    title: 'Welcome to NebulaX!',
    content: 'Hi there! I\'m Nebby, your crypto trading assistant. I\'ll help you navigate the platform and learn about cryptocurrency trading.',
    category: 'basics',
    mascotExpression: 'happy'
  },
  {
    id: 'portfolio',
    title: 'Your Portfolio',
    content: 'This shows all your cryptocurrency holdings, their current values, and performance. Click on any asset to see detailed charts and trading options.',
    category: 'basics',
    mascotExpression: 'thinking',
    actionText: 'View Portfolio',
    onAction: () => window.location.href = '/portfolio'
  },
  {
    id: 'market-orders',
    title: 'Market vs Limit Orders',
    content: 'Market orders execute immediately at current prices. Limit orders let you set your desired price and wait for the market to reach it.',
    category: 'trading',
    mascotExpression: 'excited'
  },
  {
    id: 'security-2fa',
    title: 'Two-Factor Authentication',
    content: 'Enable 2FA to add an extra layer of security to your account. This protects your funds even if someone gets your password.',
    category: 'security',
    mascotExpression: 'serious',
    actionText: 'Setup 2FA',
    onAction: () => window.location.href = '/security'
  },
  {
    id: 'stop-loss',
    title: 'Stop-Loss Orders',
    content: 'Set automatic sell orders to limit your losses. If the price drops to your stop level, the order triggers to protect your investment.',
    category: 'advanced',
    mascotExpression: 'thinking'
  },
  {
    id: 'diversification',
    title: 'Portfolio Diversification',
    content: 'Don\'t put all your eggs in one basket! Spread your investments across different cryptocurrencies to reduce risk.',
    category: 'advanced',
    mascotExpression: 'happy'
  }
];

// Context-aware tooltip system
export function useContextualTooltips() {
  const [activeTooltip, setActiveTooltip] = useState<TooltipContent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const showTooltip = (content: TooltipContent, element?: HTMLElement) => {
    if (element) {
      const rect = element.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10
      });
    }
    setActiveTooltip(content);
  };

  const showTooltipById = (id: string, element?: HTMLElement) => {
    const tooltip = cryptoTooltips.find(t => t.id === id);
    if (tooltip) {
      showTooltip(tooltip, element);
    }
  };

  const showNextTooltip = () => {
    const nextIndex = (currentIndex + 1) % cryptoTooltips.length;
    setCurrentIndex(nextIndex);
    setActiveTooltip(cryptoTooltips[nextIndex]);
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  // Auto-show tooltips based on user actions
  const triggerContextualHelp = (context: string, element?: HTMLElement) => {
    const contextMap: Record<string, string> = {
      'first-visit': 'welcome',
      'portfolio-view': 'portfolio',
      'trading-page': 'market-orders',
      'security-settings': 'security-2fa',
      'advanced-trading': 'stop-loss'
    };

    const tooltipId = contextMap[context];
    if (tooltipId) {
      showTooltipById(tooltipId, element);
    }
  };

  return {
    activeTooltip,
    tooltipPosition,
    showTooltip,
    showTooltipById,
    showNextTooltip,
    hideTooltip,
    triggerContextualHelp
  };
}

// Floating mascot component
export function FloatingMascot() {
  const [isVisible, setIsVisible] = useState(true);
  const [expression, setExpression] = useState<keyof typeof mascotExpressions>('happy');
  const { triggerContextualHelp } = useContextualTooltips();

  const expressions = Object.keys(mascotExpressions) as Array<keyof typeof mascotExpressions>;

  useEffect(() => {
    // Change expression every 10 seconds
    const interval = setInterval(() => {
      setExpression(expressions[Math.floor(Math.random() * expressions.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.button
        className="w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        onClick={() => triggerContextualHelp('welcome')}
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {mascotExpressions[expression]}
      </motion.button>

      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-background border shadow-sm"
        onClick={() => setIsVisible(false)}
      >
        <X className="w-3 h-3" />
      </Button>
    </motion.div>
  );
}