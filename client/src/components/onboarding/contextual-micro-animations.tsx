import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  MousePointer, 
  Hand, 
  Eye, 
  Target,
  Sparkles,
  Zap,
  ChevronDown,
  Clock,
  Navigation,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface GuideStep {
  id: string;
  element: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  animation: "pulse" | "bounce" | "glow" | "shake" | "point" | "highlight";
  trigger: "hover" | "click" | "scroll" | "focus" | "auto";
}

interface ContextualGuide {
  id: string;
  page: string;
  steps: GuideStep[];
  isActive: boolean;
}

const CONTEXTUAL_GUIDES: ContextualGuide[] = [
  {
    id: "trading-guide",
    page: "trading",
    isActive: true,
    steps: [
      {
        id: "trading-pairs",
        element: "[data-guide='trading-pairs']",
        title: "Choose Trading Pair",
        description: "Start by selecting the cryptocurrency pair you want to trade",
        position: "right",
        animation: "pulse",
        trigger: "auto"
      },
      {
        id: "order-type",
        element: "[data-guide='order-type']",
        title: "Select Order Type",
        description: "Choose between Market or Limit orders based on your strategy",
        position: "bottom",
        animation: "glow",
        trigger: "click"
      },
      {
        id: "amount-input",
        element: "[data-guide='amount-input']",
        title: "Enter Amount",
        description: "Specify how much you want to buy or sell",
        position: "left",
        animation: "highlight",
        trigger: "focus"
      }
    ]
  },
  {
    id: "portfolio-guide",
    page: "portfolio",
    isActive: true,
    steps: [
      {
        id: "portfolio-balance",
        element: "[data-guide='portfolio-balance']",
        title: "Your Balance",
        description: "View your total portfolio value and individual asset holdings",
        position: "bottom",
        animation: "bounce",
        trigger: "hover"
      },
      {
        id: "add-asset",
        element: "[data-guide='add-asset']",
        title: "Add New Asset",
        description: "Click here to add cryptocurrencies to your portfolio",
        position: "top",
        animation: "point",
        trigger: "auto"
      }
    ]
  },
  {
    id: "security-guide",
    page: "security",
    isActive: true,
    steps: [
      {
        id: "enable-2fa",
        element: "[data-guide='enable-2fa']",
        title: "Enable 2FA",
        description: "Secure your account with two-factor authentication",
        position: "right",
        animation: "shake",
        trigger: "auto"
      },
      {
        id: "backup-codes",
        element: "[data-guide='backup-codes']",
        title: "Download Backup Codes",
        description: "Save these codes in a secure location for account recovery",
        position: "bottom",
        animation: "glow",
        trigger: "click"
      }
    ]
  }
];

export function ContextualMicroAnimations({ currentPage }: { currentPage: string }) {
  const [activeGuide, setActiveGuide] = useState<ContextualGuide | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const guide = CONTEXTUAL_GUIDES.find(g => g.page === currentPage && g.isActive);
    setActiveGuide(guide || null);
    setCurrentStep(0);
  }, [currentPage]);

  const completeStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
    
    if (activeGuide && currentStep < activeGuide.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const getAnimationVariants = (animation: string) => {
    switch (animation) {
      case "pulse":
        return {
          animate: {
            scale: [1, 1.05, 1],
            transition: { duration: 1.5, repeat: Infinity }
          }
        };
      case "bounce":
        return {
          animate: {
            y: [0, -10, 0],
            transition: { duration: 1, repeat: Infinity }
          }
        };
      case "glow":
        return {
          animate: {
            boxShadow: [
              "0 0 5px rgba(59, 130, 246, 0.5)",
              "0 0 20px rgba(59, 130, 246, 0.8)",
              "0 0 5px rgba(59, 130, 246, 0.5)"
            ],
            transition: { duration: 2, repeat: Infinity }
          }
        };
      case "shake":
        return {
          animate: {
            x: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
          }
        };
      case "point":
        return {
          animate: {
            x: [0, 10, 0],
            transition: { duration: 1, repeat: Infinity }
          }
        };
      case "highlight":
        return {
          animate: {
            backgroundColor: [
              "rgba(59, 130, 246, 0.1)",
              "rgba(59, 130, 246, 0.3)",
              "rgba(59, 130, 246, 0.1)"
            ],
            transition: { duration: 1.5, repeat: Infinity }
          }
        };
      default:
        return {};
    }
  };

  const getPositionStyles = (position: string) => {
    switch (position) {
      case "top":
        return "bottom-full mb-2";
      case "bottom":
        return "top-full mt-2";
      case "left":
        return "right-full mr-2";
      case "right":
        return "left-full ml-2";
      default:
        return "top-full mt-2";
    }
  };

  if (!activeGuide || !isVisible) return null;

  return (
    <AnimatePresence>
      {activeGuide.steps.map((step, index) => (
        <GuideOverlay
          key={step.id}
          step={step}
          isActive={index === currentStep}
          isCompleted={completedSteps.includes(step.id)}
          onComplete={() => completeStep(step.id)}
          animationVariants={getAnimationVariants(step.animation)}
          positionClass={getPositionStyles(step.position)}
        />
      ))}
    </AnimatePresence>
  );
}

interface GuideOverlayProps {
  step: GuideStep;
  isActive: boolean;
  isCompleted: boolean;
  onComplete: () => void;
  animationVariants: any;
  positionClass: string;
}

function GuideOverlay({ 
  step, 
  isActive, 
  isCompleted, 
  onComplete, 
  animationVariants, 
  positionClass 
}: GuideOverlayProps) {
  const [elementFound, setElementFound] = useState(false);
  const [elementPosition, setElementPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const findElement = () => {
      const element = document.querySelector(step.element);
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX
        });
        setElementFound(true);
      } else {
        setElementFound(false);
      }
    };

    findElement();
    const interval = setInterval(findElement, 1000);
    return () => clearInterval(interval);
  }, [step.element]);

  if (!elementFound || !isActive) return null;

  return (
    <>
      {/* Element Highlight */}
      <motion.div
        className="fixed pointer-events-none z-40"
        style={{
          top: elementPosition.top - 4,
          left: elementPosition.left - 4
        }}
        {...animationVariants}
      >
        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg" />
      </motion.div>

      {/* Guide Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`fixed z-50 ${positionClass}`}
        style={{
          top: elementPosition.top,
          left: elementPosition.left
        }}
      >
        <div className="relative">
          <div className="bg-white border-2 border-blue-200 rounded-lg shadow-xl p-4 max-w-64 z-50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                <button
                  onClick={onComplete}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
            
            {/* Arrow pointer */}
            <div className="absolute w-3 h-3 bg-white border-b-2 border-r-2 border-blue-200 transform rotate-45 -z-10" 
                 style={{
                   top: step.position === 'bottom' ? '-6px' : undefined,
                   bottom: step.position === 'top' ? '-6px' : undefined,
                   left: step.position === 'right' ? '-6px' : undefined,
                   right: step.position === 'left' ? '-6px' : undefined
                 }} 
            />
          </div>
        </div>
      </motion.div>

      {/* Animated Pointer */}
      <motion.div
        className="fixed pointer-events-none z-30"
        style={{
          top: elementPosition.top - 20,
          left: elementPosition.left - 20
        }}
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <MousePointer className="w-6 h-6 text-blue-500" />
      </motion.div>
    </>
  );
}

// Pulse Animation Component for interactive elements
export function PulseAnimation({ children, trigger = "hover" }: { 
  children: React.ReactNode; 
  trigger?: "hover" | "click" | "auto" 
}) {
  const [isActive, setIsActive] = useState(trigger === "auto");

  const handleMouseEnter = () => {
    if (trigger === "hover") setIsActive(true);
  };

  const handleMouseLeave = () => {
    if (trigger === "hover") setIsActive(false);
  };

  const handleClick = () => {
    if (trigger === "click") {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 1000);
    }
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={isActive ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 0 0 rgba(59, 130, 246, 0)",
          "0 0 0 10px rgba(59, 130, 246, 0.3)",
          "0 0 0 0 rgba(59, 130, 246, 0)"
        ]
      } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

// Sparkle Trail Component for success actions
export function SparkleTrail({ isActive }: { isActive: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{
                scale: 0,
                x: Math.random() * 100,
                y: Math.random() * 100
              }}
              animate={{
                scale: [0, 1, 0],
                y: -50,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            >
              <Sparkles className="w-full h-full" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Progress Indicator Animation
export function ProgressIndicator({ progress, total }: { progress: number; total: number }) {
  return (
    <div className="relative">
      <motion.div
        className="h-2 bg-blue-600 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${(progress / total) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-full -mt-0.5"
        animate={{
          scale: [1, 1.2, 1],
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.4)",
            "0 0 0 6px rgba(59, 130, 246, 0)",
            "0 0 0 0 rgba(59, 130, 246, 0)"
          ]
        }}
        transition={{
          duration: 1,
          repeat: Infinity
        }}
      />
    </div>
  );
}

// Floating Action Indicator
export function FloatingActionIndicator({ 
  icon: Icon, 
  label, 
  position 
}: { 
  icon: any; 
  label: string; 
  position: { x: number; y: number } 
}) {
  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </motion.div>
  );
}

export default ContextualMicroAnimations;