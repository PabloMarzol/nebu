import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Sun, 
  Moon, 
  Zap, 
  Sparkles, 
  Palette,
  Monitor,
  Eye,
  Cpu
} from "lucide-react";

type Theme = 'light' | 'dark' | 'neo-cyber' | 'crypto-green' | 'galaxy' | 'matrix';

const themes = {
  light: {
    name: "Solar Flare",
    icon: Sun,
    gradient: "from-yellow-400 to-orange-500",
    description: "Bright & energetic",
    colors: {
      bg: "hsl(0, 0%, 100%)",
      text: "hsl(222.2, 84%, 4.9%)",
      primary: "hsl(262, 83%, 70%)"
    }
  },
  dark: {
    name: "Cosmic Void",
    icon: Moon,
    gradient: "from-slate-700 to-slate-900",
    description: "Deep space vibes",
    colors: {
      bg: "hsl(216, 50%, 8%)",
      text: "hsl(213, 31%, 91%)",
      primary: "hsl(262, 83%, 70%)"
    }
  },
  'neo-cyber': {
    name: "Neon Genesis",
    icon: Zap,
    gradient: "from-cyan-400 to-purple-600",
    description: "Cyberpunk future",
    colors: {
      bg: "hsl(270, 20%, 5%)",
      text: "hsl(180, 100%, 80%)",
      primary: "hsl(180, 100%, 50%)"
    }
  },
  'crypto-green': {
    name: "Matrix Code",
    icon: Eye,
    gradient: "from-green-400 to-emerald-600",
    description: "Green screen energy",
    colors: {
      bg: "hsl(120, 100%, 2%)",
      text: "hsl(120, 100%, 80%)",
      primary: "hsl(120, 100%, 50%)"
    }
  },
  galaxy: {
    name: "Galaxy Core",
    icon: Sparkles,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    description: "Stellar beauty",
    colors: {
      bg: "hsl(240, 30%, 8%)",
      text: "hsl(300, 60%, 90%)",
      primary: "hsl(280, 80%, 60%)"
    }
  },
  matrix: {
    name: "Digital Rain",
    icon: Cpu,
    gradient: "from-black via-green-900 to-black",
    description: "Pure code aesthetic",
    colors: {
      bg: "hsl(0, 0%, 0%)",
      text: "hsl(120, 100%, 70%)",
      primary: "hsl(120, 100%, 40%)"
    }
  }
};

export default function NeoThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');
  const [isOpen, setIsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState<Theme | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('nebulax-theme') as Theme || 'dark';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: Theme) => {
    const themeData = themes[theme];
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(themeData.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Add theme class
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${theme}`);
    
    localStorage.setItem('nebulax-theme', theme);
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
    setIsOpen(false);
    
    // Trigger a visual feedback
    const event = new CustomEvent('theme-changed', { detail: { theme } });
    window.dispatchEvent(event);
  };

  const currentThemeData = themes[currentTheme];
  const CurrentIcon = currentThemeData.icon;

  return (
    <div className="relative">
      {/* Theme switcher button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="relative overflow-hidden group"
      >
        <motion.div
          key={currentTheme}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2"
        >
          <CurrentIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{currentThemeData.name}</span>
        </motion.div>
        
        {/* Animated background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${currentThemeData.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
        />
      </Button>

      {/* Theme picker dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-full right-0 mt-2 p-4 bg-background/95 backdrop-blur border border-border rounded-lg shadow-2xl z-50 min-w-[280px]"
          >
            <h3 className="text-sm font-semibold mb-3 text-foreground">Choose Your Vibe</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(themes).map(([key, theme]) => {
                const IconComponent = theme.icon;
                const isActive = currentTheme === key;
                
                return (
                  <motion.button
                    key={key}
                    onClick={() => handleThemeChange(key as Theme)}
                    onMouseEnter={() => setShowPreview(key as Theme)}
                    onMouseLeave={() => setShowPreview(null)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left relative overflow-hidden group ${
                      isActive 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Theme gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-1">
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium text-sm">{theme.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{theme.description}</p>
                      
                      {/* Color preview dots */}
                      <div className="flex space-x-1 mt-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-border" 
                          style={{ backgroundColor: theme.colors.bg }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border border-border" 
                          style={{ backgroundColor: theme.colors.text }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border border-border" 
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                      </div>
                    </div>
                    
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Quick actions */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Theme preferences auto-saved</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 px-2 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview overlay */}
      <AnimatePresence>
        {showPreview && showPreview !== currentTheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40"
          >
            <div className="absolute top-4 left-4 p-3 bg-background/90 backdrop-blur border border-border rounded-lg">
              <p className="text-sm font-medium">Preview: {themes[showPreview].name}</p>
              <p className="text-xs text-muted-foreground">Click to apply</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Theme change effect component
export function ThemeChangeEffect() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);
    };

    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  if (!isAnimating) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 0] }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 pointer-events-none z-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 0] }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sparkles className="w-24 h-24 text-primary" />
      </motion.div>
    </motion.div>
  );
}