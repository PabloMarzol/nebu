import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, animate } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, Zap, Heart, Eye } from "lucide-react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function AnimatedNumber({ 
  value, 
  prefix = "", 
  suffix = "", 
  decimals = 2, 
  className = "",
  trend = 'neutral'
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest);
    });

    motionValue.set(value);

    return () => unsubscribe();
  }, [value, motionValue, springValue]);

  const formatNumber = (num: number) => {
    return `${prefix}${num.toFixed(decimals)}${suffix}`;
  };

  const trendIcon = {
    up: <TrendingUp className="w-4 h-4 text-green-500 inline ml-1" />,
    down: <TrendingDown className="w-4 h-4 text-red-500 inline ml-1" />,
    neutral: null
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-flex items-center ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.span
        animate={{
          textShadow: isHovered 
            ? "0 0 8px rgba(168, 85, 247, 0.6)" 
            : "0 0 0px rgba(168, 85, 247, 0)"
        }}
        transition={{ duration: 0.3 }}
      >
        {formatNumber(displayValue)}
      </motion.span>
      {trendIcon[trend]}
      
      {/* Pulse effect for significant changes */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={
          Math.abs(value - displayValue) > value * 0.05 
            ? {
                scale: [1, 1.2, 1],
                opacity: [0, 0.3, 0]
              }
            : {}
        }
        transition={{ duration: 0.6 }}
        style={{
          background: trend === 'up' 
            ? 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)'
            : trend === 'down'
            ? 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)'
        }}
      />
    </motion.span>
  );
}

interface PulsingPriceCardProps {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  className?: string;
}

export function PulsingPriceCard({ symbol, price, change, volume, className = "" }: PulsingPriceCardProps) {
  const [heartbeat, setHeartbeat] = useState(false);
  const [lastPrice, setLastPrice] = useState(price);
  const [watchers, setWatchers] = useState(Math.floor(Math.random() * 1000) + 100);

  useEffect(() => {
    if (price !== lastPrice) {
      setHeartbeat(true);
      setTimeout(() => setHeartbeat(false), 200);
      setLastPrice(price);
      
      // Simulate watchers changing
      setWatchers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }
  }, [price, lastPrice]);

  const isPositive = change >= 0;
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

  return (
    <motion.div
      className={`relative p-4 rounded-lg border bg-card transition-all duration-300 ${className}`}
      whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
      animate={{
        borderColor: heartbeat 
          ? (isPositive ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)")
          : "hsl(var(--border))",
        scale: heartbeat ? [1, 1.02, 1] : 1
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Heartbeat indicator */}
      <motion.div
        className="absolute top-2 right-2"
        animate={{
          scale: heartbeat ? [1, 1.3, 1] : 1,
          opacity: heartbeat ? [0.7, 1, 0.7] : 0.5
        }}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`w-4 h-4 ${heartbeat ? (isPositive ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground'}`}
          fill={heartbeat ? 'currentColor' : 'none'}
        />
      </motion.div>

      {/* Live indicator */}
      <div className="flex items-center space-x-2 mb-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-green-500 rounded-full"
        />
        <span className="text-sm font-medium text-foreground">{symbol}</span>
      </div>

      {/* Price with breathing animation */}
      <motion.div
        animate={{
          scale: heartbeat ? [1, 1.05, 1] : [1, 1.01, 1]
        }}
        transition={{ 
          duration: heartbeat ? 0.3 : 3,
          repeat: heartbeat ? 0 : Infinity,
          ease: "easeInOut"
        }}
        className="text-2xl font-bold text-foreground mb-1"
      >
        <AnimatedNumber 
          value={price} 
          prefix="$" 
          decimals={price > 1 ? 2 : 6}
          trend={trend}
        />
      </motion.div>

      {/* Change percentage */}
      <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        <AnimatedNumber 
          value={change} 
          suffix="%" 
          decimals={2}
          trend={trend}
        />
      </div>

      {/* Volume with particle effect */}
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Activity className="w-3 h-3" />
          <span>Vol: </span>
          <AnimatedNumber 
            value={volume} 
            prefix="$" 
            decimals={0}
          />
        </div>
        
        <motion.div 
          className="flex items-center space-x-1"
          whileHover={{ scale: 1.05 }}
        >
          <Eye className="w-3 h-3" />
          <AnimatedNumber value={watchers} decimals={0} />
        </motion.div>
      </div>

      {/* Floating particles for high activity */}
      {Math.abs(change) > 5 && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 80,
                opacity: 0
              }}
              animate={{
                y: [null, -20],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}

interface LiveDataVisualizerProps {
  data: number[];
  className?: string;
  color?: string;
}

export function LiveDataVisualizer({ data, className = "", color = "rgb(168, 85, 247)" }: LiveDataVisualizerProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className={`flex items-end space-x-1 h-12 ${className}`}
      onHoverStart={() => setIsActive(true)}
      onHoverEnd={() => setIsActive(false)}
    >
      {data.slice(-20).map((value, index) => (
        <motion.div
          key={index}
          className="flex-1 min-w-[2px] rounded-t"
          style={{ backgroundColor: color }}
          initial={{ height: 0 }}
          animate={{ 
            height: `${(value / Math.max(...data)) * 100}%`,
            opacity: isActive ? [0.5, 1, 0.5] : 0.7
          }}
          transition={{ 
            height: { duration: 0.5, ease: "easeOut" },
            opacity: { duration: 1, repeat: Infinity }
          }}
        />
      ))}
      
      {/* Scanning line effect */}
      <motion.div
        className="absolute top-0 w-full h-full pointer-events-none"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "linear",
          repeatDelay: 2
        }}
        style={{
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          width: "20%"
        }}
      />
    </motion.div>
  );
}

interface ConnectivityIndicatorProps {
  isConnected: boolean;
  label: string;
  className?: string;
}

export function ConnectivityIndicator({ isConnected, label, className = "" }: ConnectivityIndicatorProps) {
  return (
    <motion.div 
      className={`flex items-center space-x-2 ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{
          scale: isConnected ? [1, 1.2, 1] : 1,
          opacity: isConnected ? [1, 0.5, 1] : 0.3
        }}
        transition={{
          duration: isConnected ? 2 : 0.3,
          repeat: isConnected ? Infinity : 0
        }}
        className={`w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className={`text-sm ${isConnected ? 'text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </span>
      
      {isConnected && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-3 h-3 text-green-500" />
        </motion.div>
      )}
    </motion.div>
  );
}

// Data stream effect for background
export function DataStreamBackground() {
  const streams = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
      {streams.map((stream) => (
        <motion.div
          key={stream}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
          style={{
            left: `${20 + stream * 15}%`,
            height: "100vh"
          }}
          animate={{
            y: ["-100vh", "100vh"]
          }}
          transition={{
            duration: 3 + stream,
            repeat: Infinity,
            ease: "linear",
            delay: stream * 0.5
          }}
        />
      ))}
      
      {/* Binary rain effect */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`binary-${i}`}
          className="absolute text-xs text-primary/20 font-mono"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-20px"
          }}
          animate={{
            y: ["0vh", "100vh"],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        >
          {Math.random() > 0.5 ? "1" : "0"}
        </motion.div>
      ))}
    </div>
  );
}