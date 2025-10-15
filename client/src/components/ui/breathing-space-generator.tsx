import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";

interface BreathingSettings {
  intensity: number;
  speed: number;
  direction: 'vertical' | 'horizontal' | 'both';
  easing: 'linear' | 'ease' | 'bounce';
}

export default function BreathingSpaceGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState<BreathingSettings>({
    intensity: 30,
    speed: 50,
    direction: 'vertical',
    easing: 'ease'
  });

  const directions = [
    { id: 'vertical' as const, label: 'Vertical', icon: '↕️' },
    { id: 'horizontal' as const, label: 'Horizontal', icon: '↔️' },
    { id: 'both' as const, label: 'Both', icon: '🔄' }
  ];

  const easingTypes = [
    { id: 'linear' as const, label: 'Linear', curve: 'linear' },
    { id: 'ease' as const, label: 'Smooth', curve: 'ease-in-out' },
    { id: 'bounce' as const, label: 'Bounce', curve: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }
  ];

  const generateBreathingAnimation = () => {
    const keyframes = `
      @keyframes breathe-${settings.direction} {
        0%, 100% { 
          ${settings.direction === 'vertical' || settings.direction === 'both' ? `margin-top: 0px; padding-top: 0px;` : ''}
          ${settings.direction === 'horizontal' || settings.direction === 'both' ? `margin-left: 0px; padding-left: 0px;` : ''}
        }
        50% { 
          ${settings.direction === 'vertical' || settings.direction === 'both' ? `margin-top: ${settings.intensity}px; padding-top: ${settings.intensity / 2}px;` : ''}
          ${settings.direction === 'horizontal' || settings.direction === 'both' ? `margin-left: ${settings.intensity}px; padding-left: ${settings.intensity / 2}px;` : ''}
        }
      }
    `;

    const animationCSS = `
      ${keyframes}
      
      .breathing-space {
        animation: breathe-${settings.direction} ${3 - (settings.speed / 50)}s ${easingTypes.find(e => e.id === settings.easing)?.curve} infinite !important;
      }
      
      /* Apply to layout containers but not navbar */
      .container:not(nav .container),
      .max-w-7xl:not(nav .max-w-7xl),
      .min-h-screen:not(nav),
      section:not(nav section),
      main:not(nav main) {
        animation: breathe-${settings.direction} ${3 - (settings.speed / 50)}s ${easingTypes.find(e => e.id === settings.easing)?.curve} infinite !important;
      }
      
      /* Ensure navbar stays fixed */
      nav, nav * {
        animation: none !important;
        position: fixed !important;
        top: 0 !important;
        z-index: 999999 !important;
      }
    `;

    return animationCSS;
  };

  const toggleBreathing = () => {
    const existingStyle = document.getElementById('breathing-space-styles');
    
    if (isActive) {
      // Stop breathing animation
      if (existingStyle) existingStyle.remove();
      setIsActive(false);
    } else {
      // Start breathing animation
      if (existingStyle) existingStyle.remove();
      
      const styleElement = document.createElement('style');
      styleElement.id = 'breathing-space-styles';
      styleElement.textContent = generateBreathingAnimation();
      document.head.appendChild(styleElement);
      
      setIsActive(true);
      
      // Show activation notification
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        z-index: 1000000; background: linear-gradient(45deg, #10b981, #059669);
        color: white; padding: 12px 24px; border-radius: 8px;
        font-weight: 500; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        animation: breatheNotification 2s ease-in-out infinite;
      `;
      notification.innerHTML = `
        <style>
          @keyframes breatheNotification {
            0%, 100% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.05); }
          }
        </style>
        🌬️ Breathing Space Active
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => notification.remove(), 4000);
    }
  };

  const resetSettings = () => {
    setSettings({
      intensity: 30,
      speed: 50,
      direction: 'vertical',
      easing: 'ease'
    });
  };

  // Update animation when settings change and breathing is active
  useEffect(() => {
    if (isActive) {
      const existingStyle = document.getElementById('breathing-space-styles');
      if (existingStyle) existingStyle.remove();
      
      const styleElement = document.createElement('style');
      styleElement.id = 'breathing-space-styles';
      styleElement.textContent = generateBreathingAnimation();
      document.head.appendChild(styleElement);
    }
  }, [settings, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const existingStyle = document.getElementById('breathing-space-styles');
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  // Listen for custom event from hero section
  useEffect(() => {
    const handleOpenBreathingSpace = () => setIsOpen(true);
    window.addEventListener('openBreathingSpace', handleOpenBreathingSpace);
    return () => window.removeEventListener('openBreathingSpace', handleOpenBreathingSpace);
  }, []);

  return (
    <>
      {/* Hide floating button since it's now in hero section */}
      <div style={{ display: 'none' }}>
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="outline"
          className={`fixed bottom-56 right-6 z-50 transition-all border-0 hover:scale-110 ${
            isActive 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white animate-pulse' 
              : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
          }`}
        >
          <Wind className="w-4 h-4 mr-2" />
          Breathing
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
              className="w-full max-w-md"
            >
              <Card className="glass-enhanced border-teal-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Breathing Space Generator</span>
                    <Badge variant="outline" className={
                      isActive ? 'border-green-500 text-green-500 animate-pulse' : 'border-gray-500'
                    }>
                      {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Intensity Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Breathing Intensity</span>
                      <span>{settings.intensity}px</span>
                    </div>
                    <Slider
                      value={[settings.intensity]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, intensity: value[0] }))}
                      max={100}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Speed Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Breathing Speed</span>
                      <span>{settings.speed}%</span>
                    </div>
                    <Slider
                      value={[settings.speed]}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, speed: value[0] }))}
                      max={100}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Direction Selection */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Breathing Direction</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {directions.map((direction) => (
                        <Button
                          key={direction.id}
                          variant={settings.direction === direction.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSettings(prev => ({ ...prev, direction: direction.id }))}
                          className="flex flex-col items-center p-3 h-auto"
                        >
                          <span className="text-lg mb-1">{direction.icon}</span>
                          <span className="text-xs">{direction.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Easing Selection */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Animation Easing</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {easingTypes.map((easing) => (
                        <Button
                          key={easing.id}
                          variant={settings.easing === easing.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSettings(prev => ({ ...prev, easing: easing.id }))}
                          className="text-xs"
                        >
                          {easing.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      onClick={toggleBreathing}
                      className={`flex-1 ${
                        isActive 
                          ? 'bg-gradient-to-r from-red-600 to-pink-600' 
                          : 'bg-gradient-to-r from-green-600 to-emerald-600'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Stop Breathing
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Breathing
                        </>
                      )}
                    </Button>
                    <Button onClick={resetSettings} variant="outline">
                      <RotateCcw className="w-4 h-4" />
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