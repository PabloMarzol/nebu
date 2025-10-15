import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TradingTooltipProps {
  trigger: React.ReactNode;
  content: string;
  insight?: string;
  type?: 'bullish' | 'bearish' | 'neutral' | 'warning';
  position?: 'top' | 'bottom' | 'left' | 'right';
  showArrow?: boolean;
  delay?: number;
}

export const TradingTooltip: React.FC<TradingTooltipProps> = ({
  trigger,
  content,
  insight,
  type = 'neutral',
  position = 'top',
  showArrow = true,
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }
    setIsVisible(false);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'bullish':
        return {
          bg: 'bg-green-900/95',
          border: 'border-green-500/50',
          text: 'text-green-100',
          icon: '📈'
        };
      case 'bearish':
        return {
          bg: 'bg-red-900/95',
          border: 'border-red-500/50',
          text: 'text-red-100',
          icon: '📉'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-900/95',
          border: 'border-yellow-500/50',
          text: 'text-yellow-100',
          icon: '⚠️'
        };
      default:
        return {
          bg: 'bg-gray-900/95',
          border: 'border-gray-500/50',
          text: 'text-gray-100',
          icon: '💡'
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return {
          tooltip: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
          arrow: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent'
        };
      case 'bottom':
        return {
          tooltip: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
          arrow: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent'
        };
      case 'left':
        return {
          tooltip: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
          arrow: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent'
        };
      case 'right':
        return {
          tooltip: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
          arrow: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
        };
      default:
        return {
          tooltip: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
          arrow: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent'
        };
    }
  };

  const typeStyles = getTypeStyles();
  const positionStyles = getPositionStyles();

  const tooltipVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${positionStyles.tooltip}`}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className={`${typeStyles.bg} ${typeStyles.border} ${typeStyles.text} rounded-lg p-3 shadow-lg border backdrop-blur-sm min-w-64 max-w-80`}>
              <div className="flex items-start gap-2">
                <span className="text-sm">{typeStyles.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">{content}</div>
                  {insight && (
                    <div className="text-xs opacity-80 border-t border-gray-500/30 pt-2 mt-2">
                      <strong>Insight:</strong> {insight}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {showArrow && (
              <div className={`absolute w-0 h-0 border-4 ${positionStyles.arrow} ${typeStyles.border}`} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TradingInsightTooltip: React.FC<{ 
  children: React.ReactNode;
  price?: number;
  change?: number;
  volume?: number;
  trend?: 'up' | 'down' | 'sideways';
}> = ({ children, price, change, volume, trend }) => {
  const generateInsight = () => {
    const insights = [
      "Strong volume indicates high liquidity",
      "RSI approaching oversold territory",
      "Breaking through resistance level",
      "Volume spike suggests institutional activity",
      "Bullish momentum building",
      "Support level holding strong",
      "Volatility increasing - trade carefully"
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const getType = () => {
    if (trend === 'up') return 'bullish';
    if (trend === 'down') return 'bearish';
    return 'neutral';
  };

  const content = `
    ${price ? `Price: $${price.toFixed(2)}` : ''}
    ${change ? `Change: ${change > 0 ? '+' : ''}${change.toFixed(2)}%` : ''}
    ${volume ? `Volume: ${volume.toLocaleString()}` : ''}
  `.trim();

  return (
    <TradingTooltip
      trigger={children}
      content={content}
      insight={generateInsight()}
      type={getType()}
    />
  );
};