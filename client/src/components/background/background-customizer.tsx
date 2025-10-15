import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Palette, 
  Eye, 
  Sparkles, 
  Sun, 
  Moon, 
  Zap, 
  Waves, 
  Stars,
  Sunset,
  Aurora,
  Flame,
  Snowflake,
  Leaf,
  X,
  RefreshCw,
  Wand2,
  MonitorSpeaker
} from "lucide-react";

interface BackgroundConfig {
  intensity: number;
  mood: string;
  theme: string;
  aiMode: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  opacity: number;
  speed: number;
  colorPalette: string;
}

interface BackgroundCustomizerProps {
  onConfigChange: (config: BackgroundConfig) => void;
  isVisible: boolean;
  onToggle: () => void;
}

const moodPresets = [
  { id: 'professional', name: 'Professional', color: '#1e40af', icon: MonitorSpeaker },
  { id: 'energetic', name: 'Energetic', color: '#dc2626', icon: Zap },
  { id: 'calm', name: 'Calm', color: '#059669', icon: Waves },
  { id: 'mystical', name: 'Mystical', color: '#7c3aed', icon: Stars },
  { id: 'sunset', name: 'Sunset', color: '#ea580c', icon: Sunset },
  { id: 'aurora', name: 'Aurora', color: '#06b6d4', icon: Aurora },
  { id: 'fire', name: 'Fire', color: '#dc2626', icon: Flame },
  { id: 'ice', name: 'Ice', color: '#0ea5e9', icon: Snowflake },
  { id: 'nature', name: 'Nature', color: '#16a34a', icon: Leaf }
];

const colorPalettes = [
  { id: 'blue', name: 'Ocean Blue', colors: ['#1e40af', '#3b82f6', '#60a5fa'] },
  { id: 'purple', name: 'Purple Nebula', colors: ['#7c3aed', '#8b5cf6', '#a78bfa'] },
  { id: 'green', name: 'Forest Green', colors: ['#059669', '#10b981', '#34d399'] },
  { id: 'red', name: 'Mars Red', colors: ['#dc2626', '#ef4444', '#f87171'] },
  { id: 'gold', name: 'Golden Hour', colors: ['#d97706', '#f59e0b', '#fbbf24'] },
  { id: 'cyan', name: 'Cyber Cyan', colors: ['#0891b2', '#06b6d4', '#22d3ee'] },
  { id: 'pink', name: 'Neon Pink', colors: ['#be185d', '#ec4899', '#f472b6'] },
  { id: 'rainbow', name: 'Rainbow', colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'] }
];

const contextualThemes = [
  { id: 'trading', name: 'Trading Focus', description: 'Optimized for market analysis' },
  { id: 'portfolio', name: 'Portfolio View', description: 'Wealth visualization theme' },
  { id: 'security', name: 'Security Mode', description: 'High-contrast security theme' },
  { id: 'ai', name: 'AI Assistant', description: 'Neural network inspired' },
  { id: 'mobile', name: 'Mobile Optimized', description: 'Battery-efficient theme' },
  { id: 'presentation', name: 'Presentation', description: 'Clean presentation mode' }
];

export default function BackgroundCustomizer({ onConfigChange, isVisible, onToggle }: BackgroundCustomizerProps) {
  const [config, setConfig] = useState<BackgroundConfig>({
    intensity: 50,
    mood: 'professional',
    theme: 'trading',
    aiMode: false,
    brightness: 40,
    contrast: 120,
    saturation: 80,
    blur: 0.5,
    opacity: 60,
    speed: 1,
    colorPalette: 'blue'
  });

  const [aiGenerating, setAiGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    onConfigChange(config);
  }, [config, onConfigChange]);

  const handleConfigChange = (updates: Partial<BackgroundConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const generateAIBackground = async () => {
    setAiGenerating(true);
    
    // Simulate AI generation with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate intelligent background based on current context
    const aiConfig = {
      intensity: Math.floor(Math.random() * 40) + 30,
      brightness: Math.floor(Math.random() * 30) + 25,
      contrast: Math.floor(Math.random() * 50) + 100,
      saturation: Math.floor(Math.random() * 40) + 60,
      blur: Math.random() * 1,
      opacity: Math.floor(Math.random() * 30) + 40,
      speed: Math.random() * 2 + 0.5,
      colorPalette: colorPalettes[Math.floor(Math.random() * colorPalettes.length)].id
    };
    
    handleConfigChange(aiConfig);
    setAiGenerating(false);
  };

  const resetToDefaults = () => {
    setConfig({
      intensity: 50,
      mood: 'professional',
      theme: 'trading',
      aiMode: false,
      brightness: 40,
      contrast: 120,
      saturation: 80,
      blur: 0.5,
      opacity: 60,
      speed: 1,
      colorPalette: 'blue'
    });
  };

  const applyMoodPreset = (moodId: string) => {
    const moodConfigs = {
      professional: { intensity: 30, brightness: 35, contrast: 110, saturation: 70, opacity: 50 },
      energetic: { intensity: 80, brightness: 55, contrast: 140, saturation: 100, opacity: 75 },
      calm: { intensity: 25, brightness: 30, contrast: 100, saturation: 60, opacity: 40 },
      mystical: { intensity: 70, brightness: 45, contrast: 130, saturation: 90, opacity: 65 },
      sunset: { intensity: 60, brightness: 50, contrast: 125, saturation: 95, opacity: 70 },
      aurora: { intensity: 85, brightness: 60, contrast: 135, saturation: 105, opacity: 80 },
      fire: { intensity: 90, brightness: 65, contrast: 145, saturation: 110, opacity: 85 },
      ice: { intensity: 40, brightness: 40, contrast: 115, saturation: 75, opacity: 55 },
      nature: { intensity: 55, brightness: 45, contrast: 120, saturation: 85, opacity: 65 }
    };

    const moodConfig = moodConfigs[moodId as keyof typeof moodConfigs];
    if (moodConfig) {
      handleConfigChange({ ...moodConfig, mood: moodId });
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
      >
        <Settings className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="h-6 w-6" />
            Background Customizer
          </CardTitle>
          <Button onClick={onToggle} variant="ghost" size="sm">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={generateAIBackground}
              disabled={aiGenerating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {aiGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              AI Generate
            </Button>
            <Button onClick={resetToDefaults} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <div className="flex items-center gap-2">
              <Switch
                checked={previewMode}
                onCheckedChange={setPreviewMode}
                id="preview-mode"
              />
              <Label htmlFor="preview-mode" className="text-sm text-gray-300">
                Live Preview
              </Label>
            </div>
          </div>

          {/* Mood Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">Mood Presets</Label>
            <div className="grid grid-cols-3 gap-2">
              {moodPresets.map((mood) => {
                const IconComponent = mood.icon;
                return (
                  <Button
                    key={mood.id}
                    onClick={() => applyMoodPreset(mood.id)}
                    variant={config.mood === mood.id ? "default" : "outline"}
                    className="flex items-center gap-2 h-12"
                    style={config.mood === mood.id ? { backgroundColor: mood.color } : {}}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{mood.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">Color Palette</Label>
            <Select value={config.colorPalette} onValueChange={(value) => handleConfigChange({ colorPalette: value })}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorPalettes.map((palette) => (
                  <SelectItem key={palette.id} value={palette.id}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {palette.colors.slice(0, 3).map((color, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      {palette.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contextual Themes */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">Contextual Themes</Label>
            <div className="grid grid-cols-2 gap-2">
              {contextualThemes.map((theme) => (
                <Button
                  key={theme.id}
                  onClick={() => handleConfigChange({ theme: theme.id })}
                  variant={config.theme === theme.id ? "default" : "outline"}
                  className="flex flex-col items-start h-16 p-3"
                >
                  <span className="text-sm font-medium">{theme.name}</span>
                  <span className="text-xs text-gray-400">{theme.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-300">Intensity</Label>
                <Slider
                  value={[config.intensity]}
                  onValueChange={([value]) => handleConfigChange({ intensity: value })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-400 mt-1">{config.intensity}%</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-300">Brightness</Label>
                <Slider
                  value={[config.brightness]}
                  onValueChange={([value]) => handleConfigChange({ brightness: value })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-400 mt-1">{config.brightness}%</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-300">Contrast</Label>
                <Slider
                  value={[config.contrast]}
                  onValueChange={([value]) => handleConfigChange({ contrast: value })}
                  max={200}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-400 mt-1">{config.contrast}%</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-300">Saturation</Label>
                <Slider
                  value={[config.saturation]}
                  onValueChange={([value]) => handleConfigChange({ saturation: value })}
                  max={200}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-400 mt-1">{config.saturation}%</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-300">Blur</Label>
                <Slider
                  value={[config.blur]}
                  onValueChange={([value]) => handleConfigChange({ blur: value })}
                  max={5}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-400 mt-1">{config.blur.toFixed(1)}px</div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-300">Opacity</Label>
                <Slider
                  value={[config.opacity]}
                  onValueChange={([value]) => handleConfigChange({ opacity: value })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-400 mt-1">{config.opacity}%</div>
              </div>
            </div>
          </div>

          {/* AI Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-300">AI Dynamic Mode</Label>
              <p className="text-xs text-gray-400">Automatically adjusts background based on context</p>
            </div>
            <Switch
              checked={config.aiMode}
              onCheckedChange={(checked) => handleConfigChange({ aiMode: checked })}
            />
          </div>

          {/* Current Settings Summary */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <Label className="text-sm font-medium text-gray-300 mb-2 block">Current Settings</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {moodPresets.find(m => m.id === config.mood)?.name || 'Custom'}
              </Badge>
              <Badge variant="secondary">
                {colorPalettes.find(p => p.id === config.colorPalette)?.name || 'Custom'}
              </Badge>
              <Badge variant="secondary">
                {contextualThemes.find(t => t.id === config.theme)?.name || 'Custom'}
              </Badge>
              {config.aiMode && <Badge className="bg-purple-600">AI Mode</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}