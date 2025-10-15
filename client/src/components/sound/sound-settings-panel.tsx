import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Volume2, VolumeX, Settings, Speaker, Headphones, Waves } from "lucide-react";
import adaptiveSound, { SoundSettings, SoundCategory } from "@/lib/adaptive-sound";

export default function SoundSettingsPanel() {
  const [settings, setSettings] = useState<SoundSettings>(adaptiveSound.getSettings());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const currentSettings = adaptiveSound.getSettings();
    setSettings(currentSettings);
  }, []);

  const updateSetting = (key: keyof SoundSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    adaptiveSound.updateSettings({ [key]: value });
  };

  const updateCategoryVolume = (category: SoundCategory, volume: number) => {
    const newVolumes = { ...settings.categoryVolumes, [category]: volume };
    const newSettings = { ...settings, categoryVolumes: newVolumes };
    setSettings(newSettings);
    adaptiveSound.updateSettings({ categoryVolumes: newVolumes });
  };

  const toggleCategoryMute = (category: SoundCategory) => {
    const isMuted = settings.muteCategories.includes(category);
    if (isMuted) {
      adaptiveSound.unmuteCategory(category);
    } else {
      adaptiveSound.muteCategory(category);
    }
    setSettings(adaptiveSound.getSettings());
  };

  const testSound = (category: SoundCategory) => {
    switch (category) {
      case 'ui':
        adaptiveSound.click();
        break;
      case 'trading':
        adaptiveSound.orderPlaced();
        break;
      case 'notification':
        adaptiveSound.success();
        break;
      case 'success':
        adaptiveSound.success();
        break;
      case 'error':
        adaptiveSound.error();
        break;
      case 'navigation':
        adaptiveSound.pageTransition();
        break;
      case 'data':
        adaptiveSound.priceUp();
        break;
      case 'ambient':
        adaptiveSound.dataUpdate();
        break;
    }
  };

  const categoryDescriptions = {
    ui: "Button clicks, hovers, and interface interactions",
    trading: "Order placement, fills, and trade execution",
    notification: "System alerts and important messages", 
    success: "Confirmation sounds for successful actions",
    error: "Alert sounds for errors and warnings",
    navigation: "Page transitions and menu interactions",
    data: "Price updates and market data changes",
    ambient: "Background atmospheric sounds"
  };

  const themeDescriptions = {
    minimal: "Clean, subtle sounds for focused work",
    futuristic: "Sci-fi inspired tones and effects",
    classic: "Traditional trading floor atmosphere",
    cyberpunk: "Neon-soaked digital soundscape"
  };

  return (
    <Card className="w-full max-w-2xl bg-gray-900/95 border-purple-500/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Waves className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white">Adaptive Sound Design</CardTitle>
              <CardDescription className="text-gray-400">
                Customize your audio experience
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-400 hover:text-purple-300"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Master Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateSetting('enabled', !settings.enabled)}
                className={`p-2 ${settings.enabled ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
              >
                {settings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <span className="text-white font-medium">
                {settings.enabled ? 'Sound Enabled' : 'Sound Disabled'}
              </span>
            </div>
            <Badge variant={settings.enabled ? "default" : "secondary"} className="capitalize">
              {settings.theme}
            </Badge>
          </div>

          {settings.enabled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Master Volume</span>
                <span className="text-purple-400 font-mono">
                  {Math.round(settings.masterVolume * 100)}%
                </span>
              </div>
              <Slider
                value={[settings.masterVolume]}
                onValueChange={([value]) => updateSetting('masterVolume', value)}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          )}
        </div>

        {settings.enabled && isExpanded && (
          <>
            <Separator className="bg-gray-700" />

            {/* Theme Selection */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center gap-2">
                <Speaker className="w-4 h-4 text-purple-400" />
                Sound Theme
              </h4>
              <Select
                value={settings.theme}
                onValueChange={(value: SoundSettings['theme']) => {
                  updateSetting('theme', value);
                  adaptiveSound.setTheme(value);
                }}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {Object.entries(themeDescriptions).map(([theme, description]) => (
                    <SelectItem key={theme} value={theme} className="text-white hover:bg-gray-700">
                      <div>
                        <div className="font-medium capitalize">{theme}</div>
                        <div className="text-xs text-gray-400">{description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gray-700" />

            {/* Category Controls */}
            <div className="space-y-4">
              <h4 className="text-white font-medium flex items-center gap-2">
                <Headphones className="w-4 h-4 text-purple-400" />
                Sound Categories
              </h4>
              
              <div className="grid gap-4">
                {Object.entries(settings.categoryVolumes).map(([category, volume]) => {
                  const isMuted = settings.muteCategories.includes(category as SoundCategory);
                  
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCategoryMute(category as SoundCategory)}
                            className={`p-1 ${isMuted ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                          >
                            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                          </Button>
                          <span className="text-white text-sm font-medium capitalize">
                            {category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 font-mono text-xs">
                            {Math.round(volume * 100)}%
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => testSound(category as SoundCategory)}
                            className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 h-6"
                            disabled={isMuted}
                          >
                            Test
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 mb-1">
                        {categoryDescriptions[category as SoundCategory]}
                      </div>
                      
                      <Slider
                        value={[volume]}
                        onValueChange={([value]) => updateCategoryVolume(category as SoundCategory, value)}
                        max={1}
                        step={0.05}
                        className="w-full"
                        disabled={isMuted}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Advanced Settings</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white text-sm">Adaptive Mode</span>
                  <div className="text-xs text-gray-400">
                    Automatically adjust volume based on context
                  </div>
                </div>
                <Switch
                  checked={settings.adaptiveMode}
                  onCheckedChange={(checked) => updateSetting('adaptiveMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white text-sm">Spatial Audio</span>
                  <div className="text-xs text-gray-400">
                    3D positioning effects (experimental)
                  </div>
                </div>
                <Switch
                  checked={settings.spatialAudio}
                  onCheckedChange={(checked) => updateSetting('spatialAudio', checked)}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adaptiveSound.updateSettings(adaptiveSound.getSettings())}
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                Reset to Default
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Play a sequence of test sounds
                  setTimeout(() => adaptiveSound.click(), 0);
                  setTimeout(() => adaptiveSound.success(), 200);
                  setTimeout(() => adaptiveSound.orderPlaced(), 400);
                  setTimeout(() => adaptiveSound.priceUp(), 600);
                }}
                className="text-blue-400 border-blue-500/50 hover:bg-blue-500/10"
              >
                Test All Sounds
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}