import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, TrendingUp, DollarSign, BarChart3 } from "lucide-react";

interface MicroSpinnerProps {
  isLoading: boolean;
  type?: 'default' | 'crypto' | 'trading' | 'analytics' | 'payment';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function MicroInteractionSpinner({ 
  isLoading, 
  type = 'default', 
  size = 'md', 
  message 
}: MicroSpinnerProps) {
  const [dots, setDots] = useState('');
  const [cryptoQuote, setCryptoQuote] = useState('');

  const cryptoQuotes = [
    "Analyzing market trends...",
    "Calculating optimal entry points...",
    "Processing blockchain data...",
    "Securing your transaction...",
    "Optimizing your portfolio..."
  ];

  useEffect(() => {
    if (!isLoading) return;

    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const quoteInterval = setInterval(() => {
      setCryptoQuote(cryptoQuotes[Math.floor(Math.random() * cryptoQuotes.length)]);
    }, 2000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(quoteInterval);
    };
  }, [isLoading]);

  const getIcon = () => {
    switch (type) {
      case 'crypto': return <Zap className="w-5 h-5" />;
      case 'trading': return <TrendingUp className="w-5 h-5" />;
      case 'analytics': return <BarChart3 className="w-5 h-5" />;
      case 'payment': return <DollarSign className="w-5 h-5" />;
      default: return <Loader2 className="w-5 h-5" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  };

  const getContainerSize = () => {
    switch (size) {
      case 'sm': return 'w-12 h-12';
      case 'lg': return 'w-20 h-20';
      default: return 'w-16 h-16';
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex flex-col items-center justify-center space-y-3"
        >
          {/* Spinning Icon Container */}
          <motion.div
            className={`${getContainerSize()} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center relative overflow-hidden`}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            {/* Animated background pulse */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            
            {/* Main icon */}
            <motion.div
              className="relative z-10 text-white"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: type === 'crypto' ? [0, 360] : 0
              }}
              transition={{ 
                duration: type === 'crypto' ? 1 : 2, 
                repeat: Infinity 
              }}
            >
              {getIcon()}
            </motion.div>
          </motion.div>

          {/* Message Text */}
          {(message || type === 'crypto') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground">
                {message || cryptoQuote}{dots}
              </p>
            </motion.div>
          )}

          {/* Progress dots */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Usage examples for integration
export function CryptoLoadingSpinner({ isLoading }: { isLoading: boolean }) {
  return (
    <MicroInteractionSpinner
      isLoading={isLoading}
      type="crypto"
      size="lg"
    />
  );
}

export function TradingLoadingSpinner({ isLoading }: { isLoading: boolean }) {
  return (
    <MicroInteractionSpinner
      isLoading={isLoading}
      type="trading"
      message="Executing trade"
    />
  );
}

export function QuickSpinner({ isLoading }: { isLoading: boolean }) {
  return (
    <MicroInteractionSpinner
      isLoading={isLoading}
      size="sm"
    />
  );
}