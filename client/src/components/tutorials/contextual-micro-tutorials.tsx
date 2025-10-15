import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, ChevronRight, Sparkles, Target, Zap, HelpCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tutorial {
  id: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  playful?: boolean;
  emoji?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ContextualTutorialProps {
  trigger: string;
  tutorial: Tutorial;
  delay?: number;
  showOnHover?: boolean;
  persistUntilDismissed?: boolean;
  className?: string;
}

const playfulMessages = [
  "Psst! Here's a secret tip! 🤫",
  "Hey trader! Check this out! 👋",
  "Nebby here with a pro tip! ✨",
  "Want to level up? Try this! 🚀",
  "Hidden feature alert! 🎯",
  "Power user move coming up! ⚡"
];

const getPlayfulMessage = () => playfulMessages[Math.floor(Math.random() * playfulMessages.length)];

export function ContextualMicroTutorial({ 
  trigger, 
  tutorial, 
  delay = 1000,
  showOnHover = false,
  persistUntilDismissed = false,
  className 
}: ContextualTutorialProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dismissed, setDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const tutorialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.querySelector(trigger) as HTMLElement;
    if (!element) return;

    const showTutorial = () => {
      if (dismissed && !persistUntilDismissed) return;
      
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const tutorialWidth = 300;
        const tutorialHeight = 120;
        
        let x = rect.left + rect.width / 2 - tutorialWidth / 2;
        let y = rect.top;

        switch (tutorial.position) {
          case 'top':
            y = rect.top - tutorialHeight - 10;
            break;
          case 'bottom':
            y = rect.bottom + 10;
            break;
          case 'left':
            x = rect.left - tutorialWidth - 10;
            y = rect.top + rect.height / 2 - tutorialHeight / 2;
            break;
          case 'right':
            x = rect.right + 10;
            y = rect.top + rect.height / 2 - tutorialHeight / 2;
            break;
        }

        x = Math.max(10, Math.min(window.innerWidth - tutorialWidth - 10, x));
        y = Math.max(10, Math.min(window.innerHeight - tutorialHeight - 10, y));

        setPosition({ x, y });
        setIsVisible(true);
        setIsAnimating(true);
      }, delay);
    };

    const hideTutorial = () => {
      if (!showOnHover) return;
      setIsVisible(false);
      setIsAnimating(false);
    };

    if (showOnHover) {
      element.addEventListener('mouseenter', showTutorial);
      element.addEventListener('mouseleave', hideTutorial);
    } else {
      const handleFirstInteraction = () => {
        showTutorial();
        element.removeEventListener('click', handleFirstInteraction);
      };
      element.addEventListener('click', handleFirstInteraction);
    }

    return () => {
      element.removeEventListener('mouseenter', showTutorial);
      element.removeEventListener('mouseleave', hideTutorial);
    };
  }, [trigger, tutorial, delay, showOnHover, dismissed, persistUntilDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    setIsAnimating(false);
  };

  if (!isVisible || dismissed) return null;

  const playfulPrefix = tutorial.playful ? getPlayfulMessage() : null;

  return (
    <AnimatePresence>
      <motion.div
        ref={tutorialRef}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        style={{ 
          position: 'fixed', 
          left: position.x, 
          top: position.y,
          zIndex: 9999
        }}
        className={cn(
          "max-w-xs bg-popover text-popover-foreground border rounded-lg shadow-lg",
          "border-border/50",
          className
        )}
      >
        <div className={cn(
          "absolute w-3 h-3 bg-popover border-l border-t border-border/50 rotate-45",
          tutorial.position === 'top' && "bottom-[-6px] left-1/2 transform -translate-x-1/2",
          tutorial.position === 'bottom' && "top-[-6px] left-1/2 transform -translate-x-1/2",
          tutorial.position === 'left' && "right-[-6px] top-1/2 transform -translate-y-1/2",
          tutorial.position === 'right' && "left-[-6px] top-1/2 transform -translate-y-1/2"
        )} />

        <div className="p-4 space-y-3">
          {playfulPrefix && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-muted-foreground font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-500" />
              {playfulPrefix}
            </motion.div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                {tutorial.emoji && <span>{tutorial.emoji}</span>}
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                {tutorial.title}
              </h4>
              <button
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tutorial.content}
            </p>
          </div>

          {tutorial.action && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                tutorial.action?.onClick();
                handleDismiss();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Play className="w-3 h-3" />
              {tutorial.action.label}
              <ChevronRight className="w-3 h-3" />
            </motion.button>
          )}
        </div>

        {tutorial.playful && isAnimating && (
          <>
            <motion.div
              className="absolute -top-2 -left-2"
              animate={{ 
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Zap className="w-4 h-4 text-yellow-400" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-2 -right-2"
              animate={{ 
                scale: [0, 1, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            >
              <Target className="w-3 h-3 text-blue-400" />
            </motion.div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}