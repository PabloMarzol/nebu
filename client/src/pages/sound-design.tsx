import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Waves, Settings, Activity, Brain, Volume2 } from "lucide-react";
import SoundSettingsPanel from "@/components/sound/sound-settings-panel";
import SoundVisualizer from "@/components/sound/sound-visualizer";
import ContextualAudioCues from "@/components/sound/contextual-audio-cues";
import AmbientSoundscape from "@/components/sound/ambient-soundscape";
import AudioPerformanceMonitor from "@/components/sound/audio-performance-monitor";
import adaptiveSound from "@/lib/adaptive-sound";

export default function SoundDesign() {
  const [activeTab, setActiveTab] = useState("overview");
  const soundSettings = adaptiveSound.getSettings();

  const features = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Sound Settings Panel",
      description: "Comprehensive audio control with theme selection and category volume management",
      status: "Active"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Sound Visualizer", 
      description: "Real-time frequency spectrum display with test sound capabilities",
      status: "Operational"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Contextual Audio Cues",
      description: "Intelligent audio feedback that adapts to trading context and user behavior",
      status: "Learning"
    },
    {
      icon: <Waves className="w-6 h-6" />,
      title: "Ambient Soundscape",
      description: "Customizable background audio environment with mood-based presets",
      status: "Enhanced"
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: "Performance Monitor",
      description: "Real-time audio system diagnostics and performance optimization",
      status: "Monitoring"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-400';
      case 'operational': return 'text-blue-400';
      case 'learning': return 'text-purple-400';
      case 'enhanced': return 'text-orange-400';
      case 'monitoring': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const testAllSystems = () => {
    // Play a sequence of demonstration sounds
    setTimeout(() => adaptiveSound.click(), 100);
    setTimeout(() => adaptiveSound.hover(), 300);
    setTimeout(() => adaptiveSound.success(), 500);
    setTimeout(() => adaptiveSound.orderPlaced(), 700);
    setTimeout(() => adaptiveSound.priceUp(), 900);
    setTimeout(() => adaptiveSound.priceDown(), 1100);
    setTimeout(() => adaptiveSound.warning(), 1300);
    setTimeout(() => adaptiveSound.pageTransition(), 1500);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Waves className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Adaptive Sound Design</h1>
            <p className="text-gray-400">
              Intelligent audio system for enhanced user interactions
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant={soundSettings.enabled ? "default" : "secondary"}>
            {soundSettings.enabled ? 'Audio Enabled' : 'Audio Disabled'}
          </Badge>
          <Badge variant="outline" className="capitalize">
            Theme: {soundSettings.theme}
          </Badge>
          <Badge variant="outline">
            Master Volume: {Math.round(soundSettings.masterVolume * 100)}%
          </Badge>
          <Button
            onClick={testAllSystems}
            variant="outline"
            className="text-purple-400 border-purple-500/50 hover:bg-purple-500/10"
            disabled={!soundSettings.enabled}
          >
            Test All Systems
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
          <TabsTrigger value="cues">Audio Cues</TabsTrigger>
          <TabsTrigger value="soundscape">Soundscape</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Overview */}
          <Card className="bg-gray-900/95 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                System Overview
              </CardTitle>
              <CardDescription className="text-gray-400">
                Complete adaptive sound design system for NebulaX Exchange
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div key={index} className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-purple-400">
                        {feature.icon}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(feature.status)} border-current`}
                      >
                        {feature.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900/95 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {Object.keys(soundSettings.categoryVolumes).length}
                </div>
                <div className="text-sm text-gray-400">Audio Categories</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/95 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {soundSettings.muteCategories.length}
                </div>
                <div className="text-sm text-gray-400">Muted Categories</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/95 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {soundSettings.adaptiveMode ? 'ON' : 'OFF'}
                </div>
                <div className="text-sm text-gray-400">Adaptive Mode</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900/95 border-purple-500/20">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {soundSettings.spatialAudio ? 'ON' : 'OFF'}
                </div>
                <div className="text-sm text-gray-400">Spatial Audio</div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Description */}
          <Card className="bg-gray-900/95 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Adaptive Sound Design Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Core Capabilities</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Dynamic volume adjustment based on market activity</li>
                    <li>• Context-aware audio cues for trading actions</li>
                    <li>• Real-time frequency visualization</li>
                    <li>• Performance monitoring and optimization</li>
                    <li>• Customizable ambient soundscapes</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white font-medium">Advanced Features</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Machine learning adaptation to user preferences</li>
                    <li>• Spatial audio positioning (experimental)</li>
                    <li>• Theme-based sound design (4 themes available)</li>
                    <li>• Comprehensive audio diagnostics</li>
                    <li>• Low-latency audio processing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <SoundSettingsPanel />
        </TabsContent>

        <TabsContent value="visualizer">
          <SoundVisualizer isActive={activeTab === "visualizer"} />
        </TabsContent>

        <TabsContent value="cues">
          <ContextualAudioCues />
        </TabsContent>

        <TabsContent value="soundscape">
          <AmbientSoundscape />
        </TabsContent>

        <TabsContent value="performance">
          <AudioPerformanceMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}