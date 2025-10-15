import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaintTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  paintColor?: string;
}

export function PaintTransition({ 
  children, 
  isVisible, 
  direction = 'right',
  duration = 0.6,
  delay = 0,
  paintColor = '#3B82F6'
}: PaintTransitionProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowContent(true), (duration * 500) + (delay * 1000));
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isVisible, duration, delay]);

  const directionVariants = {
    left: { x: '-100%' },
    right: { x: '100%' },
    up: { y: '-100%' },
    down: { y: '100%' }
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Paint brush effect */}
            <motion.div
              className="absolute inset-0 z-10"
              style={{ backgroundColor: paintColor }}
              initial={directionVariants[direction]}
              animate={{ x: 0, y: 0 }}
              exit={directionVariants[direction]}
              transition={{ 
                duration, 
                delay,
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
            />
            
            {/* Content reveal */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FluidPaintProps {
  trigger: boolean;
  colors?: string[];
  children: React.ReactNode;
}

export function FluidPaint({ trigger, colors = ['#3B82F6', '#8B5CF6', '#EC4899'], children }: FluidPaintProps) {
  return (
    <div className="relative overflow-hidden">
      <AnimatePresence>
        {trigger && (
          <motion.div className="absolute inset-0">
            {colors.map((color, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                style={{ backgroundColor: color }}
                initial={{ 
                  clipPath: 'circle(0% at 50% 50%)',
                  scale: 0.8
                }}
                animate={{ 
                  clipPath: 'circle(150% at 50% 50%)',
                  scale: 1
                }}
                transition={{ 
                  duration: 1.2,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface MorphingShapeProps {
  isActive: boolean;
  colors: string[];
  className?: string;
}

export function MorphingShape({ isActive, colors, className = "w-32 h-32" }: MorphingShapeProps) {
  const shapes = [
    "50% 50% 50% 50%", // circle
    "0% 0% 0% 0%",     // square
    "50% 0% 50% 0%",   // diamond
    "25% 75% 75% 25%", // blob
  ];

  return (
    <motion.div
      className={`${className} relative overflow-hidden`}
      animate={{
        borderRadius: isActive ? shapes : [shapes[0]],
        background: isActive 
          ? `linear-gradient(45deg, ${colors.join(', ')})` 
          : colors[0]
      }}
      transition={{
        duration: 2,
        repeat: isActive ? Infinity : 0,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    />
  );
}