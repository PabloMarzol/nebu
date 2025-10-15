import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bitcoin, 
  Wallet, 
  TrendingUp, 
  Shield, 
  Zap,
  DollarSign,
  BarChart3,
  Activity,
  Coins
} from "lucide-react";

interface CryptoLoadingProps {
  isLoading: boolean;
  type?: 'portfolio' | 'trading' | 'security' | 'payment' | 'analytics';
  message?: string;
}

const cryptoIcons = [Bitcoin, Coins, Wallet, TrendingUp, Shield, Zap, DollarSign, BarChart3, Activity];

const loadingMessages = {
  portfolio: [
    "Analyzing portfolio diversification...",
    "Calculating risk metrics...",
    "Optimizing asset allocation...",
    "Updating portfolio performance..."
  ],
  trading: [
    "Connecting to order books...",
    "Synchronizing market data...",
    "Processing trade orders...",
    "Updating trading positions..."
  ],
  security: [
    "Verifying security protocols...",
    "Checking authentication...",
    "Validating permissions...",
    "Securing connection..."
  ],
  payment: [
    "Processing payment...",
    "Verifying transaction...",
    "Confirming blockchain status...",
    "Updating account balance..."
  ],
  analytics: [
    "Fetching market data...",
    "Running analytics engine...",
    "Computing performance metrics...",
    "Generating insights..."
  ]
};

export function AnimatedCryptoLoader({ isLoading, type = 'portfolio', message }: CryptoLoadingProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % loadingMessages[type].length);
      }, 2000);

      // Generate floating particles
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 300,
        y: Math.random() * 200,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);

      return () => clearInterval(interval);
    }
  }, [isLoading, type]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div className="relative">
          {/* Floating Crypto Particles */}
          {particles.map((particle) => {
            const IconComponent = cryptoIcons[particle.id % cryptoIcons.length];
            return (
              <motion.div
                key={particle.id}
                className="absolute text-primary/20"
                initial={{ x: particle.x, y: particle.y, scale: 0 }}
                animate={{
                  x: particle.x + Math.sin(Date.now() / 1000 + particle.delay) * 20,
                  y: particle.y + Math.cos(Date.now() / 1000 + particle.delay) * 15,
                  scale: [0, 1, 0],
                  rotate: 360
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: particle.delay
                }}
              >
                <IconComponent size={16} />
              </motion.div>
            );
          })}

          {/* Central Loading Animation */}
          <div className="bg-card border rounded-lg p-8 shadow-lg text-center space-y-6">
            <motion.div
              className="relative mx-auto w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <motion.div
                className="absolute inset-2 bg-primary/10 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Bitcoin className="w-6 h-6 text-primary" />
              </motion.div>
            </motion.div>

            <div className="space-y-2">
              <motion.h3
                className="text-lg font-semibold"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Processing...
              </motion.h3>
              
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessage}
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {message || loadingMessages[type][currentMessage]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function QuickLoadingSpinner({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function PulseLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
}