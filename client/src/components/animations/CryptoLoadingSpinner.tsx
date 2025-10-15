import React from 'react';
import { motion } from 'framer-motion';

interface CryptoLoadingSpinnerProps {
  type?: 'bitcoin' | 'ethereum' | 'trading' | 'rocket' | 'diamond';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CryptoLoadingSpinner: React.FC<CryptoLoadingSpinnerProps> = ({ 
  type = 'bitcoin', 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const bounceVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderSpinner = () => {
    switch (type) {
      case 'bitcoin':
        return (
          <div className={`${sizeClasses[size]} ${className} relative`}>
            <motion.div
              className="absolute inset-0 border-2 border-orange-400 border-t-transparent rounded-full"
              variants={spinnerVariants}
              animate="animate"
            />
            <motion.div
              className={`absolute inset-0 flex items-center justify-center ${textSizes[size]} font-bold text-orange-400`}
              variants={pulseVariants}
              animate="animate"
            >
              ₿
            </motion.div>
          </div>
        );

      case 'ethereum':
        return (
          <div className={`${sizeClasses[size]} ${className} relative`}>
            <motion.div
              className="absolute inset-0 border-2 border-blue-400 border-t-transparent rounded-full"
              variants={spinnerVariants}
              animate="animate"
            />
            <motion.div
              className={`absolute inset-0 flex items-center justify-center ${textSizes[size]} font-bold text-blue-400`}
              variants={pulseVariants}
              animate="animate"
            >
              Ξ
            </motion.div>
          </div>
        );

      case 'trading':
        return (
          <div className={`${sizeClasses[size]} ${className} relative`}>
            <motion.div
              className="absolute inset-0 border-2 border-green-400 border-t-transparent rounded-full"
              variants={spinnerVariants}
              animate="animate"
            />
            <motion.div
              className={`absolute inset-0 flex items-center justify-center ${textSizes[size]} font-bold text-green-400`}
              variants={pulseVariants}
              animate="animate"
            >
              📈
            </motion.div>
          </div>
        );

      case 'rocket':
        return (
          <div className={`${sizeClasses[size]} ${className} relative`}>
            <motion.div
              className={`${textSizes[size]} text-purple-400`}
              variants={bounceVariants}
              animate="animate"
            >
              🚀
            </motion.div>
          </div>
        );

      case 'diamond':
        return (
          <div className={`${sizeClasses[size]} ${className} relative`}>
            <motion.div
              className={`${textSizes[size]} text-cyan-400`}
              variants={pulseVariants}
              animate="animate"
            >
              💎
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderSpinner()}
    </div>
  );
};

export const CryptoLoadingSpinnerWithText: React.FC<CryptoLoadingSpinnerProps & { text?: string }> = ({
  text = "Loading...",
  ...props
}) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <CryptoLoadingSpinner {...props} />
      <motion.div
        className="text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {text}
      </motion.div>
    </div>
  );
};