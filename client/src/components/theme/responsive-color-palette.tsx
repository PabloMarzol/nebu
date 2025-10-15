import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, RefreshCw, Eye, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

interface ResponsiveColorPaletteProps {
  onPaletteChange?: (palette: ColorPalette) => void;
}

export function ResponsiveColorPalette({ onPaletteChange }: ResponsiveColorPaletteProps) {
  const { toast } = useToast();
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>({
    name: 'NebulaX Blue',
    primary: '#3B82F6',
    secondary: '#6366F1', 
    accent: '#EC4899',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC'
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const predefinedPalettes: ColorPalette[] = [
    {
      name: 'NebulaX Blue',
      primary: '#3B82F6',
      secondary: '#6366F1', 
      accent: '#EC4899',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC'
    },
    {
      name: 'Cosmic Purple',
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#06B6D4',
      background: '#1A0B2E',
      surface: '#2D1B48',
      text: '#F3E8FF'
    },
    {
      name: 'Cyber Green',
      primary: '#10B981',
      secondary: '#059669',
      accent: '#F59E0B',
      background: '#0A1B0E',
      surface: '#1A2F1E',
      text: '#ECFDF5'
    },
    {
      name: 'Solar Orange',
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#8B5CF6',
      background: '#1C0A00',
      surface: '#2D1B0A',
      text: '#FFF7ED'
    },
    {
      name: 'Arctic Silver',
      primary: '#64748B',
      secondary: '#475569',
      accent: '#06B6D4',
      background: '#0F1419',
      surface: '#1E2228',
      text: '#F1F5F9'
    }
  ];

  const generateRandomPalette = (): ColorPalette => {
    const hue = Math.floor(Math.random() * 360);
    const complementHue = (hue + 180) % 360;
    const accentHue = (hue + 120) % 360;
    
    return {
      name: 'Generated Palette',
      primary: `hsl(${hue}, 70%, 55%)`,
      secondary: `hsl(${hue + 30}, 65%, 50%)`,
      accent: `hsl(${accentHue}, 75%, 60%)`,
      background: `hsl(${hue}, 20%, 8%)`,
      surface: `hsl(${hue}, 15%, 12%)`,
      text: `hsl(${hue}, 10%, 95%)`
    };
  };

  const generateSmartPalette = () => {
    setIsGenerating(true);
    
    // Simulate intelligent color generation
    setTimeout(() => {
      const smartPalette = generateRandomPalette();
      smartPalette.name = `Smart Palette ${Date.now().toString().slice(-4)}`;
      setCurrentPalette(smartPalette);
      applyPalette(smartPalette);
      setIsGenerating(false);
      
      toast({
        title: "Smart Palette Generated",
        description: `New ${smartPalette.name} applied to platform`,
      });
    }, 1000);
  };

  const applyPalette = (palette: ColorPalette) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS custom properties
    const hexToHsl = (hex: string) => {
      if (hex.startsWith('hsl')) return hex;
      
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
          default: h = 0;
        }
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--primary', hexToHsl(palette.primary));
    root.style.setProperty('--secondary', hexToHsl(palette.secondary));
    root.style.setProperty('--accent', hexToHsl(palette.accent));
    root.style.setProperty('--background', hexToHsl(palette.background));
    root.style.setProperty('--surface', hexToHsl(palette.surface));
    
    onPaletteChange?.(palette);
  };

  const copyPaletteCode = () => {
    const code = `
:root {
  --primary: ${currentPalette.primary};
  --secondary: ${currentPalette.secondary};
  --accent: ${currentPalette.accent};
  --background: ${currentPalette.background};
  --surface: ${currentPalette.surface};
  --text: ${currentPalette.text};
}`;
    
    navigator.clipboard.writeText(code);
    toast({
      title: "Palette Code Copied",
      description: "CSS custom properties copied to clipboard",
    });
  };

  useEffect(() => {
    // Listen for palette toggle event
    const handlePaletteToggle = () => setIsVisible(!isVisible);
    window.addEventListener('openColorPalette', handlePaletteToggle);
    return () => window.removeEventListener('openColorPalette', handlePaletteToggle);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
        size="lg"
      >
        <Palette className="w-5 h-5 mr-2" />
        Colors
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-slate-900/95 border-purple-500/30 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Palette className="w-6 h-6 mr-3 text-purple-400" />
              Responsive Color Palette
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
            >
              ×
            </Button>
          </div>

          {/* Current Palette Display */}
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
            <h4 className="text-lg font-semibold text-white mb-3">{currentPalette.name}</h4>
            <div className="grid grid-cols-6 gap-3">
              {Object.entries(currentPalette).slice(1).map(([key, color]) => (
                <div key={key} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg border-2 border-white/20 mb-2 cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      navigator.clipboard.writeText(color);
                      toast({ title: "Color Copied", description: `${color} copied to clipboard` });
                    }}
                  />
                  <p className="text-xs text-gray-300 capitalize">{key}</p>
                  <p className="text-xs text-gray-400 font-mono">{color}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Predefined Palettes */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">Predefined Palettes</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {predefinedPalettes.map((palette, index) => (
                <div 
                  key={index}
                  className="p-3 bg-slate-800/30 rounded-lg border border-purple-500/20 cursor-pointer hover:border-purple-400/50 transition-colors"
                  onClick={() => {
                    setCurrentPalette(palette);
                    applyPalette(palette);
                    toast({
                      title: "Palette Applied",
                      description: `${palette.name} is now active`,
                    });
                  }}
                >
                  <div className="flex mb-2">
                    <div className="w-4 h-4 rounded-full mr-1" style={{ backgroundColor: palette.primary }} />
                    <div className="w-4 h-4 rounded-full mr-1" style={{ backgroundColor: palette.secondary }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.accent }} />
                  </div>
                  <p className="text-xs text-white font-medium">{palette.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={generateSmartPalette}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Generate Smart Palette
            </Button>
            
            <Button
              variant="outline"
              onClick={copyPaletteCode}
              className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS Code
            </Button>
            
            <Button
              variant="outline"
              onClick={() => applyPalette(currentPalette)}
              className="border-green-400/50 text-green-400 hover:bg-green-400/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              Apply Palette
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResponsiveColorPalette;