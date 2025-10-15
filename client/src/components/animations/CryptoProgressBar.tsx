import React from 'react';
import { motion } from 'framer-motion';

interface CryptoProgressBarProps {
  progress: number;
  theme?: 'bitcoin' | 'ethereum' | 'trading' | 'rainbow';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
}

export const CryptoProgressBar: React.FC<CryptoProgressBarProps> = ({
  progress,
  theme = 'trading',
  size = 'md',
  showPercentage = true,
  label,
  animated = true
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'bitcoin':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/20',
          fill: 'bg-gradient-to-r from-orange-400 to-orange-600',
          text: 'text-orange-600 dark:text-orange-400'
        };
      case 'ethereum':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          fill: 'bg-gradient-to-r from-blue-400 to-blue-600',
          text: 'text-blue-600 dark:text-blue-400'
        };
      case 'trading':
        return {
          bg: 'bg-green-100 dark:bg-green-900/20',
          fill: 'bg-gradient-to-r from-green-400 to-green-600',
          text: 'text-green-600 dark:text-green-400'
        };
      case 'rainbow':
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          fill: 'bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400',
          text: 'text-purple-600 dark:text-purple-400'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          fill: 'bg-gradient-to-r from-gray-400 to-gray-600',
          text: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const colors = getThemeColors();

  const progressVariants = {
    initial: { width: '0%' },
    animate: { 
      width: `${clampedProgress}%`,
      transition: {
        duration: animated ? 1.5 : 0,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <motion.span
              className={`text-sm font-medium ${colors.text}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: animated ? 0.5 : 0 }}
            >
              {Math.round(clampedProgress)}%
            </motion.span>
          )}
        </div>
      )}
      
      <div className={`w-full ${colors.bg} rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <motion.div
          className={`${sizeClasses[size]} ${colors.fill} rounded-full relative`}
          variants={progressVariants}
          initial="initial"
          animate="animate"
        >
          {/* Animated shimmer effect */}
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={pulseVariants}
              animate="animate"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export const CryptoProgressBarWithIcon: React.FC<CryptoProgressBarProps & { icon?: string }> = ({
  icon = '📊',
  ...props
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-lg">{icon}</div>
      <div className="flex-1">
        <CryptoProgressBar {...props} />
      </div>
    </div>
  );
};