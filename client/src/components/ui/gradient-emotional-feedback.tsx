import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmotionalState {
  type: 'success' | 'error' | 'warning' | 'info' | 'excitement' | 'calm' | 'focused' | 'celebration';
  intensity: number; // 0-1
  duration?: number; // milliseconds
}

interface GradientEmotionalFeedbackProps {
  children: React.ReactNode;
  className?: string;
  enableBackgroundTransitions?: boolean;
  enableBorderTransitions?: boolean;
  enableTextTransitions?: boolean;
}

const emotionalGradients = {
  success: {
    light: "from-green-100 via-emerald-50 to-green-100",
    medium: "from-green-200 via-emerald-100 to-green-200", 
    intense: "from-green-300 via-emerald-200 to-green-300",
    border: "border-green-400/50",
    text: "text-green-700"
  },
  error: {
    light: "from-red-100 via-rose-50 to-red-100",
    medium: "from-red-200 via-rose-100 to-red-200",
    intense: "from-red-300 via-rose-200 to-red-300",
    border: "border-red-400/50",
    text: "text-red-700"
  },
  warning: {
    light: "from-yellow-100 via-amber-50 to-yellow-100",
    medium: "from-yellow-200 via-amber-100 to-yellow-200",
    intense: "from-yellow-300 via-amber-200 to-yellow-300",
    border: "border-yellow-400/50",
    text: "text-yellow-700"
  },
  info: {
    light: "from-blue-100 via-sky-50 to-blue-100",
    medium: "from-blue-200 via-sky-100 to-blue-200",
    intense: "from-blue-300 via-sky-200 to-blue-300",
    border: "border-blue-400/50",
    text: "text-blue-700"
  },
  excitement: {
    light: "from-purple-100 via-pink-50 to-orange-100",
    medium: "from-purple-200 via-pink-100 to-orange-200",
    intense: "from-purple-300 via-pink-200 to-orange-300",
    border: "border-purple-400/50",
    text: "text-purple-700"
  },
  calm: {
    light: "from-slate-100 via-gray-50 to-slate-100",
    medium: "from-slate-200 via-gray-100 to-slate-200",
    intense: "from-slate-300 via-gray-200 to-slate-300",
    border: "border-slate-400/50",
    text: "text-slate-700"
  },
  focused: {
    light: "from-indigo-100 via-blue-50 to-cyan-100",
    medium: "from-indigo-200 via-blue-100 to-cyan-200",
    intense: "from-indigo-300 via-blue-200 to-cyan-300",
    border: "border-indigo-400/50",
    text: "text-indigo-700"
  },
  celebration: {
    light: "from-yellow-100 via-pink-50 to-purple-100",
    medium: "from-yellow-200 via-pink-100 to-purple-200",
    intense: "from-yellow-300 via-pink-200 to-purple-300",
    border: "border-pink-400/50",
    text: "text-pink-700"
  }
};

export function GradientEmotionalFeedback({ 
  children, 
  className,
  enableBackgroundTransitions = true,
  enableBorderTransitions = true,
  enableTextTransitions = false
}: GradientEmotionalFeedbackProps) {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionalState | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerEmotion = useCallback((emotion: EmotionalState) => {
    setCurrentEmotion(emotion);
    setIsTransitioning(true);

    const duration = emotion.duration || 2000;
    setTimeout(() => {
      setIsTransitioning(false);
      setCurrentEmotion(null);
    }, duration);
  }, []);

  // Auto-trigger emotions based on user interactions
  useEffect(() => {
    const handleSuccessEvents = () => triggerEmotion({ type: 'success', intensity: 0.7 });
    const handleErrorEvents = () => triggerEmotion({ type: 'error', intensity: 0.8 });
    const handleFocusEvents = () => triggerEmotion({ type: 'focused', intensity: 0.5, duration: 3000 });

    // Listen for global events
    window.addEventListener('trade-success', handleSuccessEvents);
    window.addEventListener('trade-error', handleErrorEvents);
    window.addEventListener('focus-mode', handleFocusEvents);

    return () => {
      window.removeEventListener('trade-success', handleSuccessEvents);
      window.removeEventListener('trade-error', handleErrorEvents);
      window.removeEventListener('focus-mode', handleFocusEvents);
    };
  }, [triggerEmotion]);

  const getGradientClass = () => {
    if (!currentEmotion || !isTransitioning) return "";
    
    const gradient = emotionalGradients[currentEmotion.type];
    const intensity = currentEmotion.intensity || 0.5;
    
    if (intensity >= 0.8) return gradient.intense;
    if (intensity >= 0.5) return gradient.medium;
    return gradient.light;
  };

  const getBorderClass = () => {
    if (!currentEmotion || !isTransitioning || !enableBorderTransitions) return "";
    return emotionalGradients[currentEmotion.type].border;
  };

  const getTextClass = () => {
    if (!currentEmotion || !isTransitioning || !enableTextTransitions) return "";
    return emotionalGradients[currentEmotion.type].text;
  };

  return (
    <motion.div
      className={cn(
        "transition-all duration-1000 ease-in-out relative overflow-hidden",
        enableBackgroundTransitions && currentEmotion && `bg-gradient-to-br ${getGradientClass()}`,
        enableBorderTransitions && getBorderClass(),
        enableTextTransitions && getTextClass(),
        className
      )}
      animate={{
        scale: isTransitioning ? [1, 1.02, 1] : 1,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Animated overlay for extra visual feedback */}
      <AnimatePresence>
        {isTransitioning && currentEmotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 bg-gradient-to-r pointer-events-none",
              getGradientClass()
            )}
          />
        )}
      </AnimatePresence>

      {/* Pulse effect for high intensity emotions */}
      <AnimatePresence>
        {isTransitioning && (currentEmotion?.intensity || 0) >= 0.8 && (
          <motion.div
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "absolute inset-0 bg-gradient-to-br pointer-events-none",
              getGradientClass()
            )}
          />
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  );
}

// Hook for manual emotion triggering
export function useEmotionalFeedback() {
  const triggerSuccess = (intensity = 0.7, duration = 2000) => {
    window.dispatchEvent(new CustomEvent('trade-success'));
  };

  const triggerError = (intensity = 0.8, duration = 2000) => {
    window.dispatchEvent(new CustomEvent('trade-error'));
  };

  const triggerExcitement = (intensity = 0.9, duration = 3000) => {
    const event = new CustomEvent('emotion-trigger', { 
      detail: { type: 'excitement', intensity, duration }
    });
    window.dispatchEvent(event);
  };

  const triggerCelebration = (intensity = 1.0, duration = 4000) => {
    const event = new CustomEvent('emotion-trigger', { 
      detail: { type: 'celebration', intensity, duration }
    });
    window.dispatchEvent(event);
  };

  const triggerFocus = (intensity = 0.6, duration = 5000) => {
    window.dispatchEvent(new CustomEvent('focus-mode'));
  };

  const triggerCalm = (intensity = 0.4, duration = 3000) => {
    const event = new CustomEvent('emotion-trigger', { 
      detail: { type: 'calm', intensity, duration }
    });
    window.dispatchEvent(event);
  };

  return {
    triggerSuccess,
    triggerError,
    triggerExcitement,
    triggerCelebration,
    triggerFocus,
    triggerCalm
  };
}

// Enhanced button with emotional feedback
export function EmotionalButton({ 
  children, 
  onClick, 
  emotion = 'focused',
  className,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  emotion?: EmotionalState['type'];
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    
    // Trigger emotional feedback
    const event = new CustomEvent('emotion-trigger', { 
      detail: { type: emotion, intensity: 0.6, duration: 1500 }
    });
    window.dispatchEvent(event);

    setTimeout(() => setIsPressed(false), 150);
    onClick?.(e);
  };

  return (
    <GradientEmotionalFeedback enableBackgroundTransitions enableBorderTransitions>
      <motion.button
        {...props}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative px-4 py-2 rounded-lg transition-all duration-200",
          "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2",
          isPressed && "ring-2 ring-opacity-50",
          className
        )}
      >
        {children}
      </motion.button>
    </GradientEmotionalFeedback>
  );
}

// Trading card with emotional responses
export function EmotionalTradingCard({ 
  children, 
  profit, 
  className 
}: { 
  children: React.ReactNode; 
  profit?: number;
  className?: string;
}) {
  const getEmotionFromProfit = () => {
    if (profit === undefined) return null;
    if (profit > 100) return { type: 'celebration' as const, intensity: 0.9 };
    if (profit > 10) return { type: 'success' as const, intensity: 0.7 };
    if (profit > 0) return { type: 'success' as const, intensity: 0.4 };
    if (profit < -50) return { type: 'error' as const, intensity: 0.8 };
    if (profit < 0) return { type: 'warning' as const, intensity: 0.5 };
    return { type: 'calm' as const, intensity: 0.3 };
  };

  const emotion = getEmotionFromProfit();

  useEffect(() => {
    if (emotion) {
      const event = new CustomEvent('emotion-trigger', { 
        detail: { ...emotion, duration: 2000 }
      });
      window.dispatchEvent(event);
    }
  }, [profit]);

  return (
    <GradientEmotionalFeedback 
      enableBackgroundTransitions 
      enableBorderTransitions
      className={cn("rounded-lg border p-4", className)}
    >
      {children}
    </GradientEmotionalFeedback>
  );
}