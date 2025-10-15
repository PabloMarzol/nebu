import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Brain, Volume2, Zap, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import adaptiveSound from "@/lib/adaptive-sound";

interface AudioCue {
  id: string;
  name: string;
  description: string;
  category: string;
  trigger: string;
  enabled: boolean;
  volume: number;
  lastTriggered?: Date;
}

export default function ContextualAudioCues() {
  const [audioCues, setAudioCues] = useState<AudioCue[]>([
    {
      id: 'price_movement_major',
      name: 'Major Price Movement',
      description: 'Alert when price moves >5% in 5 minutes',
      category: 'trading',
      trigger: 'price_change_threshold',
      enabled: true,
      volume: 0.8
    },
    {
      id: 'order_status_change',
      name: 'Order Status Change',
      description: 'Sound when order fills, cancels, or fails',
      category: 'trading',
      trigger: 'order_update',
      enabled: true,
      volume: 0.7
    },
    {
      id: 'portfolio_milestone',
      name: 'Portfolio Milestone',
      description: 'Celebrate reaching profit/loss thresholds',
      category: 'success',
      trigger: 'portfolio_threshold',
      enabled: true,
      volume: 0.6
    },
    {
      id: 'market_volatility',
      name: 'Market Volatility Alert',
      description: 'Warn when market becomes highly volatile',
      category: 'notification',
      trigger: 'volatility_spike',
      enabled: true,
      volume: 0.9
    },
    {
      id: 'connection_status',
      name: 'Connection Status',
      description: 'Audio feedback for connection changes',
      category: 'data',
      trigger: 'websocket_status',
      enabled: true,
      volume: 0.5
    },
    {
      id: 'news_impact',
      name: 'High Impact News',
      description: 'Alert for market-moving news events',
      category: 'notification',
      trigger: 'news_alert',
      enabled: false,
      volume: 0.8
    },
    {
      id: 'ui_efficiency',
      name: 'UI Efficiency Cues',
      description: 'Subtle sounds for interface interactions',
      category: 'ui',
      trigger: 'user_interaction',
      enabled: true,
      volume: 0.3
    },
    {
      id: 'risk_warning',
      name: 'Risk Level Warning',
      description: 'Alert when portfolio risk exceeds limits',
      category: 'error',
      trigger: 'risk_threshold',
      enabled: true,
      volume: 1.0
    }
  ]);

  const [contextualMode, setContextualMode] = useState(true);
  const [learningMode, setLearningMode] = useState(true);
  const [adaptiveVolume, setAdaptiveVolume] = useState(0.7);

  const updateCue = (id: string, updates: Partial<AudioCue>) => {
    setAudioCues(prev => prev.map(cue => 
      cue.id === id ? { ...cue, ...updates } : cue
    ));
  };

  const toggleCue = (id: string) => {
    updateCue(id, { enabled: !audioCues.find(c => c.id === id)?.enabled });
  };

  const testCue = (cue: AudioCue) => {
    // Play appropriate test sound based on category
    switch (cue.category) {
      case 'trading':
        if (cue.id.includes('price')) {
          Math.random() > 0.5 ? adaptiveSound.priceUp() : adaptiveSound.priceDown();
        } else {
          adaptiveSound.orderPlaced();
        }
        break;
      case 'success':
        adaptiveSound.success();
        break;
      case 'error':
        adaptiveSound.error();
        break;
      case 'notification':
        adaptiveSound.warning();
        break;
      case 'data':
        adaptiveSound.dataUpdate();
        break;
      case 'ui':
        adaptiveSound.click();
        break;
      default:
        adaptiveSound.click();
    }

    // Update last triggered
    updateCue(cue.id, { lastTriggered: new Date() });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading': return <TrendingUp className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'notification': return <Volume2 className="w-4 h-4" />;
      case 'data': return <Zap className="w-4 h-4" />;
      case 'ui': return <Brain className="w-4 h-4" />;
      default: return <Volume2 className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trading': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'notification': return 'text-yellow-400';
      case 'data': return 'text-purple-400';
      case 'ui': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const enabledCues = audioCues.filter(cue => cue.enabled);
  const recentCues = audioCues.filter(cue => cue.lastTriggered).sort((a, b) => 
    (b.lastTriggered?.getTime() || 0) - (a.lastTriggered?.getTime() || 0)
  ).slice(0, 3);

  return (
    <Card className="w-full bg-gray-900/95 border-purple-500/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white">Contextual Audio Cues</CardTitle>
              <div className="text-sm text-gray-400">
                Intelligent audio feedback based on context
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={contextualMode ? "default" : "secondary"} className="text-xs">
              {contextualMode ? 'Active' : 'Manual'}
            </Badge>
            {learningMode && (
              <Badge variant="outline" className="text-xs text-blue-400 border-blue-500/50">
                Learning
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Global Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white text-sm font-medium">Contextual Mode</span>
              <div className="text-xs text-gray-400">
                Automatically adapt cues based on trading context
              </div>
            </div>
            <Switch
              checked={contextualMode}
              onCheckedChange={setContextualMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-white text-sm font-medium">Learning Mode</span>
              <div className="text-xs text-gray-400">
                Learn your preferences and adapt over time
              </div>
            </div>
            <Switch
              checked={learningMode}
              onCheckedChange={setLearningMode}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Adaptive Volume</span>
              <span className="text-purple-400 font-mono">
                {Math.round(adaptiveVolume * 100)}%
              </span>
            </div>
            <Slider
              value={[adaptiveVolume]}
              onValueChange={([value]) => setAdaptiveVolume(value)}
              max={1}
              step={0.05}
              className="w-full"
            />
            <div className="text-xs text-gray-500">
              Automatically adjusts volume based on market activity
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-white">{enabledCues.length}</div>
            <div className="text-xs text-gray-400">Active Cues</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-purple-400">
              {recentCues.length}
            </div>
            <div className="text-xs text-gray-400">Recent Triggers</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-blue-400">
              {audioCues.length}
            </div>
            <div className="text-xs text-gray-400">Total Cues</div>
          </div>
        </div>

        {/* Audio Cues List */}
        <div className="space-y-3">
          <h4 className="text-white font-medium">Audio Cue Configuration</h4>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {audioCues.map((cue) => (
              <div key={cue.id} className="bg-gray-800/30 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`${getCategoryColor(cue.category)}`}>
                      {getCategoryIcon(cue.category)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{cue.name}</div>
                      <div className="text-xs text-gray-400">{cue.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={cue.enabled}
                      onCheckedChange={() => toggleCue(cue.id)}
                      size="sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testCue(cue)}
                      className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 h-6"
                      disabled={!cue.enabled}
                    >
                      Test
                    </Button>
                  </div>
                </div>

                {cue.enabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Volume</span>
                      <span className="text-purple-400 font-mono">
                        {Math.round(cue.volume * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[cue.volume]}
                      onValueChange={([value]) => updateCue(cue.id, { volume: value })}
                      max={1}
                      step={0.05}
                      className="w-full"
                    />
                  </div>
                )}

                {cue.lastTriggered && (
                  <div className="text-xs text-gray-500">
                    Last triggered: {cue.lastTriggered.toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {recentCues.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Recent Activity</h4>
            <div className="space-y-2">
              {recentCues.map((cue) => (
                <div key={`recent-${cue.id}`} className="flex items-center justify-between bg-gray-800/20 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className={`${getCategoryColor(cue.category)}`}>
                      {getCategoryIcon(cue.category)}
                    </div>
                    <span className="text-white text-sm">{cue.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {cue.lastTriggered?.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Enable all cues
              setAudioCues(prev => prev.map(cue => ({ ...cue, enabled: true })));
            }}
            className="text-green-400 border-green-500/50 hover:bg-green-500/10"
          >
            Enable All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Test all enabled cues in sequence
              enabledCues.forEach((cue, index) => {
                setTimeout(() => testCue(cue), index * 300);
              });
            }}
            className="text-blue-400 border-blue-500/50 hover:bg-blue-500/10"
          >
            Test Sequence
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Reset all to defaults
              setAudioCues(prev => prev.map(cue => ({ 
                ...cue, 
                enabled: true, 
                volume: 0.7,
                lastTriggered: undefined 
              })));
            }}
            className="text-gray-400 border-gray-500/50 hover:bg-gray-500/10"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}