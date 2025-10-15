import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Sparkles, Moon, Sun } from 'lucide-react';

const CRYPTO_PALETTES = [
  {
    name: 'Bitcoin Gold',
    id: 'bitcoin',
    colors: {
      primary: 'hsl(39, 100%, 50%)', // Bitcoin orange/gold
      secondary: 'hsl(39, 70%, 35%)',
      accent: 'hsl(45, 100%, 60%)',
      background: 'hsl(39, 15%, 8%)',
      foreground: 'hsl(45, 100%, 95%)',
    }
  },
  {
    name: 'Ethereum Blue',
    id: 'ethereum',
    colors: {
      primary: 'hsl(214, 100%, 50%)', // Ethereum blue
      secondary: 'hsl(214, 70%, 35%)',
      accent: 'hsl(220, 100%, 65%)',
      background: 'hsl(214, 25%, 6%)',
      foreground: 'hsl(220, 100%, 95%)',
    }
  },
  {
    name: 'Solana Purple',
    id: 'solana',
    colors: {
      primary: 'hsl(284, 100%, 60%)', // Solana purple
      secondary: 'hsl(284, 70%, 40%)',
      accent: 'hsl(290, 100%, 70%)',
      background: 'hsl(284, 20%, 6%)',
      foreground: 'hsl(290, 100%, 95%)',
    }
  },
  {
    name: 'Cardano Red',
    id: 'cardano',
    colors: {
      primary: 'hsl(359, 100%, 45%)', // Cardano red
      secondary: 'hsl(359, 70%, 30%)',
      accent: 'hsl(5, 100%, 60%)',
      background: 'hsl(359, 20%, 6%)',
      foreground: 'hsl(5, 100%, 95%)',
    }
  },
  {
    name: 'Polygon Violet',
    id: 'polygon',
    colors: {
      primary: 'hsl(265, 100%, 55%)', // Polygon purple/violet
      secondary: 'hsl(265, 70%, 35%)',
      accent: 'hsl(270, 100%, 65%)',
      background: 'hsl(265, 20%, 6%)',
      foreground: 'hsl(270, 100%, 95%)',
    }
  },
  {
    name: 'NebulaX Classic',
    id: 'nebula',
    colors: {
      primary: 'hsl(260, 100%, 65%)', // Original purple
      secondary: 'hsl(260, 70%, 45%)',
      accent: 'hsl(320, 100%, 60%)',
      background: 'hsl(260, 15%, 6%)',
      foreground: 'hsl(320, 100%, 95%)',
    }
  }
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('nebula');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Apply theme colors to CSS variables
    const theme = CRYPTO_PALETTES.find(p => p.id === currentTheme);
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([key, value]) => {
        // Convert HSL to individual values for CSS variables
        const hslMatch = value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (hslMatch) {
          const [, h, s, l] = hslMatch;
          root.style.setProperty(`--${key}`, `${h} ${s}% ${l}%`);
        }
      });
    }
  }, [currentTheme]);

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    setIsOpen(false);
    
    // Animate theme transition
    document.body.style.transition = 'all 0.5s ease-in-out';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 500);
  };

  const currentPalette = CRYPTO_PALETTES.find(p => p.id === currentTheme);

  return (
    <>
      {/* Theme Switcher Button */}
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        variant="outline"
        className="fixed top-20 right-4 z-40 bg-background/80 backdrop-blur-sm"
      >
        <Palette className="w-4 h-4 mr-2" />
        {currentPalette?.name}
      </Button>

      {/* Theme Selector Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Crypto-Inspired Themes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CRYPTO_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => handleThemeChange(palette.id)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      currentTheme === palette.id 
                        ? 'border-primary ring-2 ring-primary/50' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    {/* Color Preview */}
                    <div className="flex gap-1 mb-2">
                      {Object.entries(palette.colors).slice(0, 4).map(([key, color]) => (
                        <div
                          key={key}
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    <div className="text-sm font-medium">{palette.name}</div>
                    
                    {currentTheme === palette.id && (
                      <div className="text-xs text-muted-foreground mt-1">Active</div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Each theme is inspired by major cryptocurrencies
                </div>
                <Button 
                  onClick={() => setIsOpen(false)}
                  variant="outline" 
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}