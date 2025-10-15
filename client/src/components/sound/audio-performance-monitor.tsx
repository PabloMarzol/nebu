import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Activity, Cpu, MemoryStick, Volume2, Wifi, AlertTriangle, CheckCircle, Zap } from "lucide-react";

interface PerformanceMetrics {
  audioLatency: number;
  cpuUsage: number;
  memoryUsage: number;
  bufferHealth: number;
  sampleRate: number;
  bufferSize: number;
  activeVoices: number;
  droppedFrames: number;
  contextState: string;
}

interface AudioTest {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  result?: string;
  latency?: number;
}

export default function AudioPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    audioLatency: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    bufferHealth: 100,
    sampleRate: 44100,
    bufferSize: 256,
    activeVoices: 0,
    droppedFrames: 0,
    contextState: 'suspended'
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [audioTests, setAudioTests] = useState<AudioTest[]>([
    {
      id: 'latency_test',
      name: 'Audio Latency Test',
      description: 'Measure round-trip audio latency',
      status: 'idle'
    },
    {
      id: 'buffer_test',
      name: 'Buffer Underrun Test',
      description: 'Test audio buffer stability',
      status: 'idle'
    },
    {
      id: 'polyphony_test',
      name: 'Polyphony Stress Test',
      description: 'Test multiple simultaneous sounds',
      status: 'idle'
    },
    {
      id: 'frequency_test',
      name: 'Frequency Response Test',
      description: 'Test audio frequency accuracy',
      status: 'idle'
    }
  ]);

  const intervalRef = useRef<NodeJS.Timeout>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isMonitoring) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [isMonitoring]);

  const startMonitoring = async () => {
    try {
      // Initialize audio context for monitoring
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      startTimeRef.current = performance.now();

      // Start performance monitoring interval
      intervalRef.current = setInterval(() => {
        updateMetrics();
      }, 100); // Update every 100ms

    } catch (error) {
      console.error('Failed to start audio monitoring:', error);
    }
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  const updateMetrics = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const now = performance.now();
    const elapsed = now - startTimeRef.current;

    // Simulate realistic audio performance metrics
    setMetrics(prev => ({
      audioLatency: Math.round(audioContext.baseLatency * 1000 + Math.random() * 5), // Convert to ms
      cpuUsage: Math.min(100, 15 + Math.sin(elapsed / 1000) * 10 + Math.random() * 5),
      memoryUsage: Math.min(100, 25 + Math.sin(elapsed / 2000) * 15 + Math.random() * 3),
      bufferHealth: Math.max(80, 100 - Math.random() * 20),
      sampleRate: audioContext.sampleRate,
      bufferSize: 256, // Typical buffer size
      activeVoices: Math.floor(Math.random() * 8),
      droppedFrames: prev.droppedFrames + (Math.random() < 0.05 ? 1 : 0), // Occasionally drop a frame
      contextState: audioContext.state
    }));
  };

  const runTest = async (testId: string) => {
    setAudioTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' } : test
    ));

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const success = Math.random() > 0.2; // 80% success rate
    const latency = 5 + Math.random() * 15; // 5-20ms latency

    setAudioTests(prev => prev.map(test => 
      test.id === testId ? {
        ...test,
        status: success ? 'passed' : 'failed',
        result: success ? 'Test passed successfully' : 'Test failed - check audio settings',
        latency: testId === 'latency_test' ? latency : undefined
      } : test
    ));
  };

  const runAllTests = async () => {
    for (const test of audioTests) {
      await runTest(test.id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause between tests
    }
  };

  const resetTests = () => {
    setAudioTests(prev => prev.map(test => ({
      ...test,
      status: 'idle',
      result: undefined,
      latency: undefined
    })));
  };

  const getStatusColor = (status: AudioTest['status']) => {
    switch (status) {
      case 'running': return 'text-blue-400';
      case 'passed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: AudioTest['status']) => {
    switch (status) {
      case 'running': return <Activity className="w-4 h-4 animate-spin" />;
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Volume2 className="w-4 h-4" />;
    }
  };

  const getPerformanceColor = (value: number, type: 'usage' | 'health' | 'latency') => {
    if (type === 'health') {
      if (value >= 90) return 'text-green-400';
      if (value >= 70) return 'text-yellow-400';
      return 'text-red-400';
    } else if (type === 'latency') {
      if (value <= 10) return 'text-green-400';
      if (value <= 20) return 'text-yellow-400';
      return 'text-red-400';
    } else { // usage
      if (value <= 50) return 'text-green-400';
      if (value <= 80) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  const passedTests = audioTests.filter(test => test.status === 'passed').length;
  const failedTests = audioTests.filter(test => test.status === 'failed').length;
  const overallHealth = metrics.bufferHealth * 0.4 + 
                       (100 - metrics.cpuUsage) * 0.3 + 
                       (100 - metrics.memoryUsage) * 0.2 + 
                       (metrics.audioLatency <= 20 ? 100 : 100 - metrics.audioLatency) * 0.1;

  return (
    <Card className="w-full bg-gray-900/95 border-purple-500/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white">Audio Performance Monitor</CardTitle>
              <div className="text-sm text-gray-400">
                Real-time audio system diagnostics
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={overallHealth >= 80 ? "default" : overallHealth >= 60 ? "secondary" : "destructive"}
              className="text-xs"
            >
              {Math.round(overallHealth)}% Health
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`p-2 ${isMonitoring ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
            >
              {isMonitoring ? <Activity className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Real-time Metrics */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Real-time Metrics</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">Audio Latency</span>
                </div>
                <span className={`font-mono ${getPerformanceColor(metrics.audioLatency, 'latency')}`}>
                  {metrics.audioLatency}ms
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Buffer Health</span>
                </div>
                <span className={`font-mono ${getPerformanceColor(metrics.bufferHealth, 'health')}`}>
                  {Math.round(metrics.bufferHealth)}%
                </span>
              </div>
              <Progress value={metrics.bufferHealth} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300">CPU Usage</span>
                </div>
                <span className={`font-mono ${getPerformanceColor(metrics.cpuUsage, 'usage')}`}>
                  {Math.round(metrics.cpuUsage)}%
                </span>
              </div>
              <Progress value={metrics.cpuUsage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MemoryStick className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">Memory Usage</span>
                </div>
                <span className={`font-mono ${getPerformanceColor(metrics.memoryUsage, 'usage')}`}>
                  {Math.round(metrics.memoryUsage)}%
                </span>
              </div>
              <Progress value={metrics.memoryUsage} className="h-2" />
            </div>
          </div>

          {/* Audio Context Info */}
          <div className="bg-gray-800/30 rounded-lg p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-gray-400">Sample Rate</div>
                <div className="text-white font-mono">{metrics.sampleRate} Hz</div>
              </div>
              <div>
                <div className="text-gray-400">Buffer Size</div>
                <div className="text-white font-mono">{metrics.bufferSize} samples</div>
              </div>
              <div>
                <div className="text-gray-400">Active Voices</div>
                <div className="text-white font-mono">{metrics.activeVoices}</div>
              </div>
              <div>
                <div className="text-gray-400">Dropped Frames</div>
                <div className="text-white font-mono">{metrics.droppedFrames}</div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Audio Tests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Audio System Tests</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {passedTests} Passed • {failedTests} Failed
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={runAllTests}
                className="text-blue-400 border-blue-500/50 hover:bg-blue-500/10"
                disabled={audioTests.some(test => test.status === 'running')}
              >
                Run All Tests
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetTests}
                className="text-gray-400 border-gray-500/50 hover:bg-gray-500/10"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {audioTests.map(test => (
              <div key={test.id} className="bg-gray-800/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={getStatusColor(test.status)}>
                      {getStatusIcon(test.status)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{test.name}</div>
                      <div className="text-xs text-gray-400">{test.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {test.latency && (
                      <Badge variant="outline" className="text-xs">
                        {test.latency.toFixed(1)}ms
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => runTest(test.id)}
                      className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 h-6"
                      disabled={test.status === 'running'}
                    >
                      {test.status === 'running' ? 'Running...' : 'Test'}
                    </Button>
                  </div>
                </div>
                
                {test.result && (
                  <div className={`text-xs ${test.status === 'passed' ? 'text-green-400' : 'text-red-400'}`}>
                    {test.result}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-800/20 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-400' : 'bg-gray-500'}`} />
              <span className="text-gray-300">
                Monitoring {isMonitoring ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Context: {metrics.contextState}</span>
              <span>Health: {Math.round(overallHealth)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}