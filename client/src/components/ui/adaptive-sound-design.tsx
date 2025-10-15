import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Settings, Headphones, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface SoundTheme {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  sounds: {
    click: string;
    hover: string;
    success: string;
    error: string;
    notification: string;
    trading: string;
    ambient: string;
  };
}

const soundThemes: SoundTheme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic electronic sounds',
    icon: <Settings className="w-4 h-4" />,
    sounds: {
      click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      hover: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      notification: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      trading: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      ambient: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Subtle and clean audio feedback',
    icon: <VolumeX className="w-4 h-4" />,
    sounds: {
      click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      hover: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      notification: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      trading: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      ambient: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E'
    }
  },
  {
    id: 'orchestral',
    name: 'Orchestral',
    description: 'Rich musical feedback',
    icon: <Music className="w-4 h-4" />,
    sounds: {
      click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      hover: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      notification: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      trading: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E',
      ambient: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfBzuT1/Hjdj0E'
    }
  }
];

interface SoundSettings {
  enabled: boolean;
  masterVolume: number;
  theme: string;
  adaptiveMode: boolean;
  contextualSounds: boolean;
  ambientSounds: boolean;
  tradingAlerts: boolean;
}

interface AdaptiveSoundDesignProps {
  isInline?: boolean;
}

export default function AdaptiveSoundDesign({ isInline = false }: AdaptiveSoundDesignProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SoundSettings>({
    enabled: true,
    masterVolume: 0.5,
    theme: 'cyberpunk',
    adaptiveMode: true,
    contextualSounds: true,
    ambientSounds: false,
    tradingAlerts: true
  });
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [userActivity, setUserActivity] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate Web Audio API sounds for better quality
  const generateTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!settings.enabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(settings.masterVolume * 0.1, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  };

  // Sound generation functions for different themes
  const playSound = (soundType: keyof SoundTheme['sounds']) => {
    if (!settings.enabled) return;
    
    const currentTheme = soundThemes.find(t => t.id === settings.theme)!;
    
    switch (settings.theme) {
      case 'cyberpunk':
        switch (soundType) {
          case 'click':
            generateTone(800, 0.1, 'square');
            break;
          case 'hover':
            generateTone(600, 0.05, 'sine');
            break;
          case 'success':
            generateTone(523, 0.2, 'sine'); // C note
            setTimeout(() => generateTone(659, 0.2, 'sine'), 100); // E note
            break;
          case 'error':
            generateTone(200, 0.3, 'sawtooth');
            break;
          case 'notification':
            generateTone(880, 0.1, 'sine');
            setTimeout(() => generateTone(1108, 0.1, 'sine'), 150);
            break;
          case 'trading':
            generateTone(440, 0.05, 'triangle');
            break;
        }
        break;
      
      case 'minimal':
        switch (soundType) {
          case 'click':
            generateTone(1000, 0.03, 'sine');
            break;
          case 'hover':
            generateTone(1200, 0.02, 'sine');
            break;
          case 'success':
            generateTone(800, 0.1, 'sine');
            break;
          case 'error':
            generateTone(300, 0.15, 'sine');
            break;
        }
        break;
      
      case 'orchestral':
        switch (soundType) {
          case 'click':
            generateTone(523, 0.1, 'sine'); // C note
            break;
          case 'success':
            generateTone(523, 0.2, 'sine'); // C major chord
            setTimeout(() => generateTone(659, 0.2, 'sine'), 50); // E
            setTimeout(() => generateTone(784, 0.2, 'sine'), 100); // G
            break;
        }
        break;
    }
    
    setIsPlaying(soundType);
    setTimeout(() => setIsPlaying(null), 200);
  };

  // Track user activity for adaptive sound responses
  useEffect(() => {
    if (!settings.adaptiveMode) return;

    const handleUserActivity = (activity: string) => {
      setUserActivity(prev => [...prev.slice(-9), activity]);
    };

    const handleClick = () => {
      handleUserActivity('click');
      if (settings.contextualSounds) {
        playSound('click');
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'BUTTON' || (typeof target.closest === 'function' && target.closest('button')))) {
        handleUserActivity('hover');
        if (settings.contextualSounds) {
          playSound('hover');
        }
      }
    };

    // Add global event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseenter', handleMouseEnter, true);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [settings]);

  // Ambient soundscape based on time of day and activity
  useEffect(() => {
    if (!settings.ambientSounds) return;

    const playAmbientSound = () => {
      const hour = new Date().getHours();
      let frequency = 200;
      
      if (hour >= 6 && hour < 12) frequency = 300; // Morning
      else if (hour >= 12 && hour < 18) frequency = 250; // Afternoon
      else if (hour >= 18 && hour < 22) frequency = 220; // Evening
      else frequency = 180; // Night
      
      generateTone(frequency, 2, 'sine');
    };

    const interval = setInterval(playAmbientSound, 30000);
    return () => clearInterval(interval);
  }, [settings.ambientSounds]);

  // Expose global sound functions
  useEffect(() => {
    (window as any).AdaptiveSound = {
      playSuccess: () => playSound('success'),
      playError: () => playSound('error'),
      playNotification: () => playSound('notification'),
      playTrading: () => playSound('trading'),
      playClick: () => playSound('click'),
      playHover: () => playSound('hover')
    };
  }, [settings]);

  const toggleSettings = () => setIsOpen(!isOpen);

  const updateSetting = <K extends keyof SoundSettings>(key: K, value: SoundSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isInline) {
    return (
      <div className="relative inline-block">
        <Button
          onClick={toggleSettings}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg"
        >
          <Headphones className="h-4 w-4 mr-2" />
          Sound Design
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 z-50">
            <SoundSettingsPanel 
              settings={settings}
              updateSetting={updateSetting}
              playSound={playSound}
              soundThemes={soundThemes}
              isPlaying={isPlaying}
              onClose={() => setIsOpen(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={toggleSettings}
        size="lg"
        className="rounded-full w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Headphones className="h-6 w-6 text-white" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-16 left-0">
          <SoundSettingsPanel 
            settings={settings}
            updateSetting={updateSetting}
            playSound={playSound}
            soundThemes={soundThemes}
            isPlaying={isPlaying}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

interface SoundSettingsPanelProps {
  settings: SoundSettings;
  updateSetting: <K extends keyof SoundSettings>(key: K, value: SoundSettings[K]) => void;
  playSound: (soundType: keyof SoundTheme['sounds']) => void;
  soundThemes: SoundTheme[];
  isPlaying: string | null;
  onClose: () => void;
}

function SoundSettingsPanel({ 
  settings, 
  updateSetting, 
  playSound, 
  soundThemes, 
  isPlaying, 
  onClose 
}: SoundSettingsPanelProps) {
  return (
    <Card className="w-80 bg-gray-900/95 backdrop-blur-md border-purple-500/20 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Adaptive Sound Design
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </Button>
        </div>

        {/* Master Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Enable Sounds</span>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(enabled) => updateSetting('enabled', enabled)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Master Volume</label>
            <Slider
              value={[settings.masterVolume]}
              onValueChange={([value]) => updateSetting('masterVolume', value)}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Sound Themes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sound Theme</label>
            <div className="grid grid-cols-1 gap-2">
              {soundThemes.map((theme) => (
                <Button
                  key={theme.id}
                  variant={settings.theme === theme.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('theme', theme.id)}
                  className={`justify-start ${
                    settings.theme === theme.id
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                      : 'border-gray-600 text-gray-300'
                  }`}
                >
                  {theme.icon}
                  <span className="ml-2">{theme.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Adaptive Mode</span>
              <Switch
                checked={settings.adaptiveMode}
                onCheckedChange={(checked) => updateSetting('adaptiveMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Contextual Sounds</span>
              <Switch
                checked={settings.contextualSounds}
                onCheckedChange={(checked) => updateSetting('contextualSounds', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Ambient Sounds</span>
              <Switch
                checked={settings.ambientSounds}
                onCheckedChange={(checked) => updateSetting('ambientSounds', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Trading Alerts</span>
              <Switch
                checked={settings.tradingAlerts}
                onCheckedChange={(checked) => updateSetting('tradingAlerts', checked)}
              />
            </div>
          </div>

          {/* Sound Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sound Preview</label>
            <div className="grid grid-cols-2 gap-2">
              {(['click', 'hover', 'success', 'error', 'notification', 'trading'] as const).map((soundType) => (
                <Button
                  key={soundType}
                  variant="outline"
                  size="sm"
                  onClick={() => playSound(soundType)}
                  disabled={!settings.enabled}
                  className={`border-gray-600 text-gray-300 hover:border-purple-500 ${
                    isPlaying === soundType ? 'border-purple-500 bg-purple-500/10' : ''
                  }`}
                >
                  {soundType}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Export utility functions for other components to use
export const useSoundEffects = () => {
  const playSuccess = () => (window as any).AdaptiveSound?.playSuccess();
  const playError = () => (window as any).AdaptiveSound?.playError();
  const playNotification = () => (window as any).AdaptiveSound?.playNotification();
  const playTrading = () => (window as any).AdaptiveSound?.playTrading();
  const playClick = () => (window as any).AdaptiveSound?.playClick();
  const playHover = () => (window as any).AdaptiveSound?.playHover();

  return {
    playSuccess,
    playError,
    playNotification,
    playTrading,
    playClick,
    playHover
  };
};