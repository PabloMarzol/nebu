import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sun, Moon, Monitor, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColorScheme {
  name: string;
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  description: string;
}

const colorSchemes: ColorScheme[] = [
  {
    name: 'Crypto Dark',
    icon: <Moon className="w-4 h-4" />,
    primary: 'hsl(259, 94%, 51%)',
    secondary: 'hsl(180, 100%, 50%)',
    accent: 'hsl(300, 100%, 75%)',
    background: 'hsl(240, 10%, 3.9%)',
    surface: 'hsl(240, 10%, 8%)',
    text: 'hsl(0, 0%, 98%)',
    description: 'Deep space trading environment'
  },
  {
    name: 'Solar Flare',
    icon: <Sun className="w-4 h-4" />,
    primary: 'hsl(25, 95%, 53%)',
    secondary: 'hsl(45, 93%, 47%)',
    accent: 'hsl(5, 85%, 60%)',
    background: 'hsl(20, 14.3%, 4.1%)',
    surface: 'hsl(24, 9.8%, 10%)',
    text: 'hsl(0, 0%, 95%)',
    description: 'Energy-rich golden theme'
  },
  {
    name: 'Ocean Depth',
    icon: <Sparkles className="w-4 h-4" />,
    primary: 'hsl(200, 94%, 51%)',
    secondary: 'hsl(180, 100%, 40%)',
    accent: 'hsl(220, 100%, 75%)',
    background: 'hsl(220, 10%, 3.9%)',
    surface: 'hsl(220, 10%, 8%)',
    text: 'hsl(210, 40%, 98%)',
    description: 'Deep blue professional look'
  },
  {
    name: 'Neon Genesis',
    icon: <Zap className="w-4 h-4" />,
    primary: 'hsl(315, 100%, 51%)',
    secondary: 'hsl(84, 100%, 50%)',
    accent: 'hsl(186, 100%, 50%)',
    background: 'hsl(300, 10%, 3.9%)',
    surface: 'hsl(300, 10%, 8%)',
    text: 'hsl(300, 20%, 98%)',
    description: 'Cyberpunk neon vibes'
  },
  {
    name: 'Auto-Adapt',
    icon: <Monitor className="w-4 h-4" />,
    primary: 'auto',
    secondary: 'auto',
    accent: 'auto',
    background: 'auto',
    surface: 'auto',
    text: 'auto',
    description: 'AI-powered color adaptation'
  }
];

interface IntelligentColorSchemeAdapterProps {
  onSchemeChange?: (scheme: ColorScheme) => void;
  isInline?: boolean;
}

export default function IntelligentColorSchemeAdapter({ onSchemeChange, isInline = false }: IntelligentColorSchemeAdapterProps) {
  const [currentScheme, setCurrentScheme] = useState<ColorScheme>(colorSchemes[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  const [userActivity, setUserActivity] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('evening');

  // Auto-dismiss modal after 5 seconds (only when not inline)
  useEffect(() => {
    if (isOpen && !isInline) {
      const dismissTimer = setTimeout(() => {
        console.log("Auto-dismissing color scheme adapter after 5 seconds");
        setIsOpen(false);
      }, 5000);

      return () => clearTimeout(dismissTimer);
    }
  }, [isOpen, isInline]);

  // Detect time of day for adaptive theming
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  // Track user activity for intelligent adaptation
  useEffect(() => {
    const trackActivity = (activity: string) => {
      setUserActivity(prev => [...prev.slice(-4), activity]);
    };

    const handleScroll = () => trackActivity('scroll');
    const handleClick = () => trackActivity('click');
    const handleKeyPress = () => trackActivity('type');

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // AI-powered scheme suggestion based on user behavior
  const getIntelligentSuggestion = () => {
    const activityLevel = userActivity.length;
    
    if (timeOfDay === 'morning') return colorSchemes[1]; // Solar Flare
    if (timeOfDay === 'night') return colorSchemes[0]; // Crypto Dark
    if (activityLevel > 3) return colorSchemes[3]; // Neon Genesis for active users
    return colorSchemes[2]; // Ocean Depth for calm sessions
  };

  // Apply color scheme to CSS variables
  const applyColorScheme = (scheme: ColorScheme) => {
    if (scheme.name === 'Auto-Adapt') {
      const suggested = getIntelligentSuggestion();
      applyColorScheme(suggested);
      setAdaptiveMode(true);
      return;
    }

    const root = document.documentElement;
    root.style.setProperty('--color-primary', scheme.primary);
    root.style.setProperty('--color-secondary', scheme.secondary);
    root.style.setProperty('--color-accent', scheme.accent);
    root.style.setProperty('--color-background', scheme.background);
    root.style.setProperty('--color-surface', scheme.surface);
    root.style.setProperty('--color-text', scheme.text);
    
    setCurrentScheme(scheme);
    onSchemeChange?.(scheme);
  };

  // Auto-adapt every 5 minutes if enabled
  useEffect(() => {
    if (!adaptiveMode) return;
    
    const interval = setInterval(() => {
      const suggested = getIntelligentSuggestion();
      applyColorScheme(suggested);
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [adaptiveMode, userActivity, timeOfDay]);

  return (
    <div className="relative">
      {/* Floating Color Scheme Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg border-0"
          size="sm"
        >
          <Palette className="w-6 h-6 text-white" />
        </Button>
      </motion.div>

      {/* Color Scheme Selector Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gray-900/90 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  🎨 Intelligent Color Schemes
                </h3>
                <p className="text-gray-400 text-sm">
                  Choose your perfect trading atmosphere or let AI adapt automatically
                </p>
              </div>

              {/* Current Time & Activity Indicator */}
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">
                    Time: <span className="text-cyan-400 capitalize">{timeOfDay}</span>
                  </span>
                  <span className="text-gray-300">
                    Activity: <span className="text-purple-400">{userActivity.length > 3 ? 'High' : 'Calm'}</span>
                  </span>
                </div>
                {adaptiveMode && (
                  <div className="mt-2 text-xs text-green-400 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Auto-Adaptation Active
                  </div>
                )}
              </div>

              {/* Color Scheme Options */}
              <div className="space-y-3">
                {colorSchemes.map((scheme, index) => (
                  <motion.button
                    key={scheme.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      applyColorScheme(scheme);
                      setIsOpen(false);
                    }}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                      currentScheme.name === scheme.name
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                          {scheme.icon}
                        </div>
                        <div>
                          <div className="text-white font-medium">{scheme.name}</div>
                          <div className="text-gray-400 text-xs">{scheme.description}</div>
                        </div>
                      </div>
                      {scheme.name !== 'Auto-Adapt' && (
                        <div className="flex space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: scheme.primary }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: scheme.secondary }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: scheme.accent }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  Apply & Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}