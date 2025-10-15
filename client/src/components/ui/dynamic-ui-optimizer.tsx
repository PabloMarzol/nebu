import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Settings, Zap, Monitor, Smartphone, Tablet } from "lucide-react";

interface OptimizationSettings {
  spacing: number;
  responsiveness: number;
  animations: number;
  contrast: number;
}

export default function DynamicUIOptimizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<OptimizationSettings>({
    spacing: 50,
    responsiveness: 75,
    animations: 60,
    contrast: 80
  });
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [optimizationScore, setOptimizationScore] = useState(0);

  const devices = [
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile', breakpoint: '< 768px' },
    { id: 'tablet' as const, icon: Tablet, label: 'Tablet', breakpoint: '768px - 1024px' },
    { id: 'desktop' as const, icon: Monitor, label: 'Desktop', breakpoint: '> 1024px' }
  ];

  const calculateScore = () => {
    const weights = { spacing: 0.3, responsiveness: 0.3, animations: 0.2, contrast: 0.2 };
    const score = Object.entries(settings).reduce((total, [key, value]) => {
      return total + (value * weights[key as keyof OptimizationSettings]);
    }, 0);
    setOptimizationScore(Math.round(score));
  };

  const applyOptimizations = () => {
    const optimizationCSS = `
      :root {
        --spacing-multiplier: ${settings.spacing / 50};
        --animation-speed: ${2 - (settings.animations / 100)}s;
        --contrast-boost: ${settings.contrast / 100};
      }
      
      * {
        margin: calc(var(--spacing-multiplier) * 0.5rem) !important;
        padding: calc(var(--spacing-multiplier) * 0.5rem) !important;
        transition-duration: var(--animation-speed) !important;
      }
      
      nav {
        margin: 0 !important;
        padding: 0 !important;
        position: fixed !important;
        top: 0 !important;
        z-index: 999999 !important;
      }
      
      .container, .max-w-7xl {
        padding-top: calc(64px + var(--spacing-multiplier) * 1rem) !important;
      }
      
      @media (max-width: 768px) {
        * {
          font-size: ${activeDevice === 'mobile' ? '0.9rem' : '1rem'} !important;
          margin: calc(var(--spacing-multiplier) * 0.25rem) !important;
        }
      }
      
      @media (min-width: 769px) and (max-width: 1024px) {
        * {
          font-size: ${activeDevice === 'tablet' ? '0.95rem' : '1rem'} !important;
          margin: calc(var(--spacing-multiplier) * 0.4rem) !important;
        }
      }
      
      body {
        filter: contrast(var(--contrast-boost)) !important;
      }
    `;

    // Remove existing optimization styles
    const existingStyle = document.getElementById('ui-optimizer-styles');
    if (existingStyle) existingStyle.remove();

    // Apply new styles
    const styleElement = document.createElement('style');
    styleElement.id = 'ui-optimizer-styles';
    styleElement.textContent = optimizationCSS;
    document.head.appendChild(styleElement);

    // Show success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      z-index: 1000000; background: linear-gradient(45deg, #3b82f6, #1d4ed8);
      color: white; padding: 12px 24px; border-radius: 8px;
      font-weight: 500; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;
    notification.textContent = `UI Optimized! Score: ${optimizationScore}/100`;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  };

  const resetOptimizations = () => {
    const styleElement = document.getElementById('ui-optimizer-styles');
    if (styleElement) styleElement.remove();
    
    setSettings({
      spacing: 50,
      responsiveness: 75,
      animations: 60,
      contrast: 80
    });
  };

  useEffect(() => {
    calculateScore();
  }, [settings]);

  // Listen for custom event from hero section
  useEffect(() => {
    const handleOpenUIOptimizer = () => setIsOpen(true);
    window.addEventListener('openUIOptimizer', handleOpenUIOptimizer);
    return () => window.removeEventListener('openUIOptimizer', handleOpenUIOptimizer);
  }, []);

  return (
    <>
      <div style={{ display: 'none' }}>
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className="fixed bottom-44 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:scale-110 transition-transform"
        >
          <Settings className="w-4 h-4 mr-2" />
          Optimize
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <Card className="glass-enhanced border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Dynamic UI Optimizer</span>
                    <Badge variant="outline" className={`${
                      optimizationScore >= 80 ? 'border-green-500 text-green-500' :
                      optimizationScore >= 60 ? 'border-yellow-500 text-yellow-500' :
                      'border-red-500 text-red-500'
                    }`}>
                      Score: {optimizationScore}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Device Selection */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Target Device</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {devices.map((device) => (
                        <Button
                          key={device.id}
                          variant={activeDevice === device.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveDevice(device.id)}
                          className="flex flex-col items-center p-3 h-auto"
                        >
                          <device.icon className="w-4 h-4 mb-1" />
                          <span className="text-xs">{device.label}</span>
                          <span className="text-xs text-muted-foreground">{device.breakpoint}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Optimization Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spacing Optimization</span>
                        <span>{settings.spacing}%</span>
                      </div>
                      <Slider
                        value={[settings.spacing]}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, spacing: value[0] }))}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Responsiveness</span>
                        <span>{settings.responsiveness}%</span>
                      </div>
                      <Slider
                        value={[settings.responsiveness]}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, responsiveness: value[0] }))}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Animation Performance</span>
                        <span>{settings.animations}%</span>
                      </div>
                      <Slider
                        value={[settings.animations]}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, animations: value[0] }))}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Contrast Enhancement</span>
                        <span>{settings.contrast}%</span>
                      </div>
                      <Slider
                        value={[settings.contrast]}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, contrast: value[0] }))}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={applyOptimizations}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Apply Optimizations
                    </Button>
                    <Button onClick={resetOptimizations} variant="outline">
                      Reset
                    </Button>
                  </div>

                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}