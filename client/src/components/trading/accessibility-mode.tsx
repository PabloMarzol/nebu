import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Accessibility, Eye, Volume2, Type, Contrast, Keyboard } from "lucide-react";

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  audioFeedback: boolean;
  fontSize: number;
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  voiceSpeed: number;
  focusIndicator: boolean;
}

export default function AccessibilityMode() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    audioFeedback: false,
    fontSize: 16,
    colorBlindMode: "none",
    voiceSpeed: 1,
    focusIndicator: true
  });

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Apply accessibility settings to the document
    applyAccessibilitySettings();
    
    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const applyAccessibilitySettings = () => {
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrast) {
      root.style.setProperty('--background', '#000000');
      root.style.setProperty('--foreground', '#ffffff');
      root.style.setProperty('--card', '#1a1a1a');
      root.style.setProperty('--border', '#ffffff');
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size adjustment
    root.style.setProperty('--base-font-size', `${settings.fontSize}px`);

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0ms');
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Color blind mode filters
    let filterValue = 'none';
    switch (settings.colorBlindMode) {
      case 'protanopia':
        filterValue = 'url(#protanopia-filter)';
        break;
      case 'deuteranopia':
        filterValue = 'url(#deuteranopia-filter)';
        break;
      case 'tritanopia':
        filterValue = 'url(#tritanopia-filter)';
        break;
    }
    root.style.setProperty('--color-filter', filterValue);

    // Focus indicators
    if (settings.focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const announceChange = (message: string) => {
    if (settings.screenReader && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = settings.voiceSpeed;
      speechSynthesis.speak(utterance);
    }
  };

  const testAudioFeedback = () => {
    if (settings.audioFeedback) {
      // Create audio context for sound feedback
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      audioFeedback: false,
      fontSize: 16,
      colorBlindMode: "none",
      voiceSpeed: 1,
      focusIndicator: true
    };
    setSettings(defaultSettings);
    announceChange("Accessibility settings reset to default");
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Accessibility className="w-5 h-5 text-blue-400" />
            <span>Accessibility Mode</span>
          </CardTitle>
          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
            aria-label="Toggle accessibility mode"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Accessibility */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Visual Accessibility</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast" className="text-sm font-medium">
                High Contrast Mode
              </label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => {
                  updateSetting('highContrast', checked);
                  announceChange(checked ? "High contrast mode enabled" : "High contrast mode disabled");
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="large-text" className="text-sm font-medium">
                Large Text
              </label>
              <Switch
                id="large-text"
                checked={settings.largeText}
                onCheckedChange={(checked) => {
                  updateSetting('largeText', checked);
                  updateSetting('fontSize', checked ? 20 : 16);
                  announceChange(checked ? "Large text enabled" : "Large text disabled");
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Font Size: {settings.fontSize}px</label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => updateSetting('fontSize', value[0])}
                max={24}
                min={12}
                step={1}
                className="w-full"
                aria-label="Font size adjustment"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Color Blind Support</label>
              <Select
                value={settings.colorBlindMode}
                onValueChange={(value) => {
                  updateSetting('colorBlindMode', value);
                  announceChange(`Color blind mode set to ${value}`);
                }}
              >
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Motion & Animation */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Type className="w-4 h-4" />
            <span>Motion & Animation</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="reduced-motion" className="text-sm font-medium">
                Reduce Motion
              </label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => {
                  updateSetting('reducedMotion', checked);
                  announceChange(checked ? "Reduced motion enabled" : "Reduced motion disabled");
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="focus-indicator" className="text-sm font-medium">
                Enhanced Focus Indicators
              </label>
              <Switch
                id="focus-indicator"
                checked={settings.focusIndicator}
                onCheckedChange={(checked) => {
                  updateSetting('focusIndicator', checked);
                  announceChange(checked ? "Enhanced focus indicators enabled" : "Enhanced focus indicators disabled");
                }}
              />
            </div>
          </div>
        </div>

        {/* Audio & Screen Reader */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Volume2 className="w-4 h-4" />
            <span>Audio & Screen Reader</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="screen-reader" className="text-sm font-medium">
                Screen Reader Support
              </label>
              <Switch
                id="screen-reader"
                checked={settings.screenReader}
                onCheckedChange={(checked) => {
                  updateSetting('screenReader', checked);
                  announceChange(checked ? "Screen reader support enabled" : "Screen reader support disabled");
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="audio-feedback" className="text-sm font-medium">
                Audio Feedback
              </label>
              <Switch
                id="audio-feedback"
                checked={settings.audioFeedback}
                onCheckedChange={(checked) => {
                  updateSetting('audioFeedback', checked);
                  if (checked) testAudioFeedback();
                  announceChange(checked ? "Audio feedback enabled" : "Audio feedback disabled");
                }}
              />
            </div>

            {settings.screenReader && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice Speed: {settings.voiceSpeed}x</label>
                <Slider
                  value={[settings.voiceSpeed]}
                  onValueChange={(value) => updateSetting('voiceSpeed', value[0])}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                  aria-label="Voice speed adjustment"
                />
              </div>
            )}
          </div>
        </div>

        {/* Keyboard Navigation */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Keyboard className="w-4 h-4" />
            <span>Keyboard Navigation</span>
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="keyboard-nav" className="text-sm font-medium">
                Enhanced Keyboard Navigation
              </label>
              <Switch
                id="keyboard-nav"
                checked={settings.keyboardNavigation}
                onCheckedChange={(checked) => {
                  updateSetting('keyboardNavigation', checked);
                  announceChange(checked ? "Enhanced keyboard navigation enabled" : "Enhanced keyboard navigation disabled");
                }}
              />
            </div>

            <Card className="glass-strong p-4">
              <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>• Tab / Shift+Tab: Navigate between elements</div>
                <div>• Enter / Space: Activate buttons and links</div>
                <div>• Escape: Close dialogs and menus</div>
                <div>• Arrow keys: Navigate within components</div>
                <div>• Alt + 1-6: Navigate between main sections</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-4 border-t border-purple-500/20">
          <Button
            onClick={resetSettings}
            variant="outline"
            className="glass"
          >
            Reset to Default
          </Button>
          <Button
            onClick={() => announceChange("Accessibility settings applied successfully")}
            className="bg-gradient-to-r from-purple-500 to-pink-500"
          >
            Apply Settings
          </Button>
        </div>

        {/* Accessibility Status */}
        <Card className="glass-strong">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Accessibility Status</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>High Contrast:</span>
                <span className={settings.highContrast ? "text-green-400" : "text-gray-400"}>
                  {settings.highContrast ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Screen Reader:</span>
                <span className={settings.screenReader ? "text-green-400" : "text-gray-400"}>
                  {settings.screenReader ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Font Size:</span>
                <span className="text-blue-400">{settings.fontSize}px</span>
              </div>
              <div className="flex justify-between">
                <span>Motion:</span>
                <span className={settings.reducedMotion ? "text-yellow-400" : "text-green-400"}>
                  {settings.reducedMotion ? "Reduced" : "Normal"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>

      {/* Color Blind Filters (SVG) */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
          </filter>
        </defs>
      </svg>
    </Card>
  );
}