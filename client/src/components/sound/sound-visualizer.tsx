import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Pause, Play, RotateCcw } from "lucide-react";
import adaptiveSound from "@/lib/adaptive-sound";

interface SoundVisualizerProps {
  isActive?: boolean;
  className?: string;
}

export default function SoundVisualizer({ isActive = false, className = "" }: SoundVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<string>('');
  const [waveData, setWaveData] = useState<number[]>(new Array(64).fill(0));

  useEffect(() => {
    if (isActive && isRunning) {
      startVisualization();
    } else {
      stopVisualization();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isRunning]);

  const startVisualization = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(17, 24, 39, 0.8)'; // bg-gray-900
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Generate wave data (simulate frequency spectrum)
      const newWaveData = waveData.map((_, index) => {
        const decay = 0.95;
        const currentValue = waveData[index] * decay;
        
        // Add some random activity to simulate sound
        if (Math.random() < 0.1) {
          return Math.min(1, currentValue + Math.random() * 0.5);
        }
        
        return currentValue;
      });

      setWaveData(newWaveData);

      // Draw frequency bars
      const barWidth = (canvas.width / window.devicePixelRatio) / newWaveData.length;
      const maxHeight = (canvas.height / window.devicePixelRatio) - 40;

      newWaveData.forEach((value, index) => {
        const barHeight = value * maxHeight;
        const x = index * barWidth;
        const y = (canvas.height / window.devicePixelRatio) - barHeight - 20;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, `rgba(168, 85, 247, ${0.8 * value})`); // purple-500
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.6 * value})`); // purple-400
        gradient.addColorStop(1, `rgba(96, 165, 250, ${0.4 * value})`); // blue-400

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, barHeight);

        // Add glow effect for active bars
        if (value > 0.3) {
          ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
          ctx.shadowBlur = 10;
          ctx.fillRect(x, y, barWidth - 1, barHeight);
          ctx.shadowBlur = 0;
        }
      });

      // Draw center frequency line
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, (canvas.height / window.devicePixelRatio) / 2);
      ctx.lineTo(canvas.width / window.devicePixelRatio, (canvas.height / window.devicePixelRatio) / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };

  const triggerSoundEvent = (event: string, soundFunction: () => void) => {
    setCurrentEvent(event);
    soundFunction();
    
    // Create a spike in the visualization
    const newWaveData = [...waveData];
    const spikeIndex = Math.floor(Math.random() * newWaveData.length);
    const spikeWidth = 5;
    
    for (let i = Math.max(0, spikeIndex - spikeWidth); i < Math.min(newWaveData.length, spikeIndex + spikeWidth); i++) {
      newWaveData[i] = Math.max(newWaveData[i], 0.8 + Math.random() * 0.2);
    }
    
    setWaveData(newWaveData);
    
    // Clear current event after 2 seconds
    setTimeout(() => {
      setCurrentEvent('');
    }, 2000);
  };

  const resetVisualization = () => {
    setWaveData(new Array(64).fill(0));
    setCurrentEvent('');
  };

  const testSounds = [
    { name: 'Click', event: 'button_click', fn: adaptiveSound.click },
    { name: 'Success', event: 'success', fn: adaptiveSound.success },
    { name: 'Error', event: 'error', fn: adaptiveSound.error },
    { name: 'Order', event: 'order_placed', fn: adaptiveSound.orderPlaced },
    { name: 'Price ↑', event: 'price_up', fn: adaptiveSound.priceUp },
    { name: 'Price ↓', event: 'price_down', fn: adaptiveSound.priceDown },
  ];

  return (
    <Card className={`bg-gray-900/95 border-purple-500/20 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">Sound Visualizer</CardTitle>
              <div className="text-sm text-gray-400">
                Real-time audio frequency display
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentEvent && (
              <Badge variant="outline" className="text-purple-400 border-purple-500/50">
                {currentEvent}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 ${isRunning ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetVisualization}
              className="p-2 text-blue-400 hover:text-blue-300"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visualization Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-32 bg-gray-800 rounded-lg border border-gray-700"
            style={{ width: '100%', height: '128px' }}
          />
          
          {!isRunning && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 rounded-lg">
              <div className="text-center">
                <Activity className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Visualizer Paused</p>
              </div>
            </div>
          )}
        </div>

        {/* Test Sound Buttons */}
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm">Test Sounds</h4>
          <div className="grid grid-cols-3 gap-2">
            {testSounds.map(({ name, event, fn }) => (
              <Button
                key={event}
                variant="outline"
                size="sm"
                onClick={() => triggerSoundEvent(event, fn)}
                className="text-xs text-gray-300 border-gray-600 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-300"
                disabled={!adaptiveSound.getSettings().enabled}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${adaptiveSound.getSettings().enabled ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-gray-400">
                Audio {adaptiveSound.getSettings().enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-blue-400' : 'bg-gray-500'}`} />
              <span className="text-gray-400">
                Visualizer {isRunning ? 'Active' : 'Paused'}
              </span>
            </div>
          </div>
          
          <div className="text-gray-500">
            Theme: <span className="text-purple-400 capitalize">{adaptiveSound.getSettings().theme}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}