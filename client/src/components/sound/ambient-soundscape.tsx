import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wind, Waves, Zap, Building2, Trees, Volume2, Play, Pause, RotateCcw } from "lucide-react";
import adaptiveSound from "@/lib/adaptive-sound";

interface SoundscapeLayer {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  baseFrequency: number;
  volume: number;
  enabled: boolean;
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
  modulation?: {
    frequency: number;
    depth: number;
  };
}

interface SoundscapePreset {
  id: string;
  name: string;
  description: string;
  layers: Partial<SoundscapeLayer>[];
  mood: 'relaxing' | 'energetic' | 'focused' | 'intense';
}

export default function AmbientSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<string>('trading_floor');
  const [masterVolume, setMasterVolume] = useState(0.4);
  const [adaptToMarket, setAdaptToMarket] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());

  const [soundscapeLayers, setSoundscapeLayers] = useState<SoundscapeLayer[]>([
    {
      id: 'data_stream',
      name: 'Data Stream',
      icon: <Zap className="w-4 h-4" />,
      description: 'Digital data flow ambience',
      baseFrequency: 110,
      volume: 0.3,
      enabled: true,
      waveform: 'sine',
      modulation: { frequency: 0.1, depth: 0.2 }
    },
    {
      id: 'market_hum',
      name: 'Market Hum',
      icon: <Building2 className="w-4 h-4" />,
      description: 'Trading floor background atmosphere',
      baseFrequency: 80,
      volume: 0.4,
      enabled: true,
      waveform: 'sawtooth',
      modulation: { frequency: 0.05, depth: 0.15 }
    },
    {
      id: 'wind',
      name: 'Ambient Wind',
      icon: <Wind className="w-4 h-4" />,
      description: 'Gentle wind sounds for focus',
      baseFrequency: 200,
      volume: 0.2,
      enabled: false,
      waveform: 'triangle',
      modulation: { frequency: 0.08, depth: 0.3 }
    },
    {
      id: 'ocean_waves',
      name: 'Ocean Waves',
      icon: <Waves className="w-4 h-4" />,
      description: 'Calming ocean wave sounds',
      baseFrequency: 60,
      volume: 0.25,
      enabled: false,
      waveform: 'sine',
      modulation: { frequency: 0.03, depth: 0.4 }
    },
    {
      id: 'forest_ambient',
      name: 'Forest Ambient',
      icon: <Trees className="w-4 h-4" />,
      description: 'Natural forest soundscape',
      baseFrequency: 440,
      volume: 0.15,
      enabled: false,
      waveform: 'triangle',
      modulation: { frequency: 0.02, depth: 0.25 }
    }
  ]);

  const presets: SoundscapePreset[] = [
    {
      id: 'trading_floor',
      name: 'Trading Floor',
      description: 'Active trading environment',
      mood: 'energetic',
      layers: [
        { id: 'data_stream', enabled: true, volume: 0.4 },
        { id: 'market_hum', enabled: true, volume: 0.5 },
        { id: 'wind', enabled: false },
        { id: 'ocean_waves', enabled: false },
        { id: 'forest_ambient', enabled: false }
      ]
    },
    {
      id: 'focused_analysis',
      name: 'Focused Analysis',
      description: 'Deep concentration mode',
      mood: 'focused',
      layers: [
        { id: 'data_stream', enabled: true, volume: 0.2 },
        { id: 'market_hum', enabled: false },
        { id: 'wind', enabled: true, volume: 0.3 },
        { id: 'ocean_waves', enabled: true, volume: 0.2 },
        { id: 'forest_ambient', enabled: false }
      ]
    },
    {
      id: 'zen_trading',
      name: 'Zen Trading',
      description: 'Calm and balanced approach',
      mood: 'relaxing',
      layers: [
        { id: 'data_stream', enabled: true, volume: 0.15 },
        { id: 'market_hum', enabled: false },
        { id: 'wind', enabled: false },
        { id: 'ocean_waves', enabled: true, volume: 0.4 },
        { id: 'forest_ambient', enabled: true, volume: 0.3 }
      ]
    },
    {
      id: 'high_frequency',
      name: 'High Frequency',
      description: 'Fast-paced trading environment',
      mood: 'intense',
      layers: [
        { id: 'data_stream', enabled: true, volume: 0.6 },
        { id: 'market_hum', enabled: true, volume: 0.7 },
        { id: 'wind', enabled: true, volume: 0.2 },
        { id: 'ocean_waves', enabled: false },
        { id: 'forest_ambient', enabled: false }
      ]
    },
    {
      id: 'silent',
      name: 'Silent',
      description: 'No ambient sounds',
      mood: 'focused',
      layers: [
        { id: 'data_stream', enabled: false },
        { id: 'market_hum', enabled: false },
        { id: 'wind', enabled: false },
        { id: 'ocean_waves', enabled: false },
        { id: 'forest_ambient', enabled: false }
      ]
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      startSoundscape();
    } else {
      stopSoundscape();
    }

    return () => {
      stopSoundscape();
    };
  }, [isPlaying, soundscapeLayers, masterVolume]);

  const initAudioContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    }
    return audioContextRef.current;
  };

  const startSoundscape = async () => {
    const audioContext = await initAudioContext();
    if (!audioContext) return;

    // Stop any existing oscillators
    stopSoundscape();

    soundscapeLayers.filter(layer => layer.enabled).forEach(layer => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configure oscillator
      oscillator.type = layer.waveform;
      oscillator.frequency.setValueAtTime(layer.baseFrequency, audioContext.currentTime);
      
      // Configure gain
      const finalVolume = layer.volume * masterVolume * (adaptiveSound.getSettings().masterVolume || 1);
      gainNode.gain.setValueAtTime(finalVolume, audioContext.currentTime);
      
      // Add modulation if specified
      if (layer.modulation) {
        const modulator = audioContext.createOscillator();
        const modulatorGain = audioContext.createGain();
        
        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(layer.modulation.frequency, audioContext.currentTime);
        modulatorGain.gain.setValueAtTime(layer.baseFrequency * layer.modulation.depth, audioContext.currentTime);
        
        modulator.connect(modulatorGain);
        modulatorGain.connect(oscillator.frequency);
        modulator.start();
      }
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start oscillator
      oscillator.start();
      
      // Store references
      oscillatorsRef.current.set(layer.id, oscillator);
      gainNodesRef.current.set(layer.id, gainNode);
    });
  };

  const stopSoundscape = () => {
    // Stop all oscillators
    oscillatorsRef.current.forEach(oscillator => {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    
    // Disconnect gain nodes
    gainNodesRef.current.forEach(gainNode => {
      try {
        gainNode.disconnect();
      } catch (e) {
        // Node might already be disconnected
      }
    });
    
    // Clear references
    oscillatorsRef.current.clear();
    gainNodesRef.current.clear();
  };

  const updateLayerVolume = (layerId: string, volume: number) => {
    setSoundscapeLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, volume } : layer
    ));
    
    // Update live volume if playing
    const gainNode = gainNodesRef.current.get(layerId);
    if (gainNode && audioContextRef.current) {
      const finalVolume = volume * masterVolume * (adaptiveSound.getSettings().masterVolume || 1);
      gainNode.gain.setValueAtTime(finalVolume, audioContextRef.current.currentTime);
    }
  };

  const toggleLayer = (layerId: string) => {
    setSoundscapeLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ));
  };

  const applyPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    setSoundscapeLayers(prev => prev.map(layer => {
      const presetLayer = preset.layers.find(pl => pl.id === layer.id);
      return presetLayer ? { ...layer, ...presetLayer } : layer;
    }));
    
    setCurrentPreset(presetId);
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'relaxing': return 'text-green-400';
      case 'energetic': return 'text-orange-400';
      case 'focused': return 'text-blue-400';
      case 'intense': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getMoodBadgeVariant = (mood: string) => {
    switch (mood) {
      case 'relaxing': return 'default';
      case 'energetic': return 'secondary';
      case 'focused': return 'outline';
      case 'intense': return 'destructive';
      default: return 'secondary';
    }
  };

  const enabledLayers = soundscapeLayers.filter(layer => layer.enabled);
  const currentPresetData = presets.find(p => p.id === currentPreset);

  return (
    <Card className="w-full bg-gray-900/95 border-purple-500/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Waves className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white">Ambient Soundscape</CardTitle>
              <div className="text-sm text-gray-400">
                Customizable background audio environment
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentPresetData && (
              <Badge 
                variant={getMoodBadgeVariant(currentPresetData.mood)} 
                className="text-xs capitalize"
              >
                {currentPresetData.mood}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 ${isPlaying ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Master Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Master Volume</span>
              <span className="text-purple-400 font-mono">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>
            <Slider
              value={[masterVolume]}
              onValueChange={([value]) => setMasterVolume(value)}
              max={1}
              step={0.05}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-white text-sm font-medium">Adapt to Market</span>
              <div className="text-xs text-gray-400">
                Automatically adjust ambience based on market activity
              </div>
            </div>
            <Switch
              checked={adaptToMarket}
              onCheckedChange={setAdaptToMarket}
            />
          </div>
        </div>

        {/* Preset Selection */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Soundscape Presets</h4>
          <Select value={currentPreset} onValueChange={applyPreset}>
            <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {presets.map(preset => (
                <SelectItem key={preset.id} value={preset.id} className="text-white hover:bg-gray-700">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-gray-400">{preset.description}</div>
                    </div>
                    <Badge 
                      variant={getMoodBadgeVariant(preset.mood)} 
                      className="text-xs ml-2 capitalize"
                    >
                      {preset.mood}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Layer Controls */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Soundscape Layers</h4>
          
          <div className="space-y-3">
            {soundscapeLayers.map(layer => (
              <div key={layer.id} className="bg-gray-800/30 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-purple-400">
                      {layer.icon}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{layer.name}</div>
                      <div className="text-xs text-gray-400">{layer.description}</div>
                    </div>
                  </div>
                  
                  <Switch
                    checked={layer.enabled}
                    onCheckedChange={() => toggleLayer(layer.id)}
                    size="sm"
                  />
                </div>

                {layer.enabled && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-300">Volume</span>
                        <span className="text-purple-400 font-mono">
                          {Math.round(layer.volume * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[layer.volume]}
                        onValueChange={([value]) => updateLayerVolume(layer.id, value)}
                        max={1}
                        step={0.05}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Frequency: {layer.baseFrequency}Hz</span>
                      <span>Wave: {layer.waveform}</span>
                      {layer.modulation && (
                        <span>Mod: {layer.modulation.frequency}Hz</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Status and Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-gray-500'}`} />
                <span className="text-gray-400">
                  {isPlaying ? 'Playing' : 'Stopped'}
                </span>
              </div>
              <span className="text-gray-400">
                {enabledLayers.length} layers active
              </span>
            </div>
            
            <div className="text-gray-500">
              {currentPresetData?.name || 'Custom'}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Enable all layers at medium volume
                setSoundscapeLayers(prev => prev.map(layer => ({
                  ...layer,
                  enabled: true,
                  volume: 0.3
                })));
              }}
              className="text-green-400 border-green-500/50 hover:bg-green-500/10"
            >
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Reset to trading floor preset
                applyPreset('trading_floor');
              }}
              className="text-blue-400 border-blue-500/50 hover:bg-blue-500/10"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Mute all layers
                setSoundscapeLayers(prev => prev.map(layer => ({
                  ...layer,
                  enabled: false
                })));
              }}
              className="text-gray-400 border-gray-500/50 hover:bg-gray-500/10"
            >
              Mute All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}