import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video, 
  Square, 
  Pause, 
  Play, 
  Download, 
  Monitor, 
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoRecorderProps {
  className?: string;
}

export default function VideoRecorder({ className = '' }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingMode, setRecordingMode] = useState<'screen' | 'camera'>('screen');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoQuality, setVideoQuality] = useState('1080p');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const getMediaConstraints = () => {
    const constraints: any = {
      audio: audioEnabled,
    };

    if (recordingMode === 'screen') {
      return {
        ...constraints,
        video: {
          mediaSource: 'screen',
          width: videoQuality === '4K' ? 3840 : videoQuality === '1080p' ? 1920 : 1280,
          height: videoQuality === '4K' ? 2160 : videoQuality === '1080p' ? 1080 : 720,
          frameRate: 30,
        }
      };
    } else {
      return {
        ...constraints,
        video: {
          width: videoQuality === '4K' ? 3840 : videoQuality === '1080p' ? 1920 : 1280,
          height: videoQuality === '4K' ? 2160 : videoQuality === '1080p' ? 1080 : 720,
          frameRate: 30,
        }
      };
    }
  };

  const startRecording = async () => {
    try {
      const constraints = getMediaConstraints();
      
      let stream: MediaStream;
      if (recordingMode === 'screen') {
        // @ts-ignore - navigator.mediaDevices.getDisplayMedia might not be in types
        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } else {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();

      toast({
        title: "Recording Started",
        description: `${recordingMode === 'screen' ? 'Screen' : 'Camera'} recording in progress`,
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();

      toast({
        title: "Recording Stopped",
        description: "Video recording completed successfully",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        startTimer();
        setIsPaused(false);
        toast({
          title: "Recording Resumed",
          description: "Video recording has been resumed",
        });
      } else {
        mediaRecorderRef.current.pause();
        stopTimer();
        setIsPaused(true);
        toast({
          title: "Recording Paused",
          description: "Video recording has been paused",
        });
      }
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nebulax-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your recording is being downloaded",
      });
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    chunksRef.current = [];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Video className="w-5 h-5 text-purple-400" />
            Video Recorder
            {isRecording && (
              <Badge variant="destructive" className="ml-2 animate-pulse">
                {isPaused ? 'PAUSED' : 'RECORDING'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recording Mode */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Recording Mode</label>
              <Select value={recordingMode} onValueChange={(value: 'screen' | 'camera') => setRecordingMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="screen">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Screen Recording
                    </div>
                  </SelectItem>
                  <SelectItem value="camera">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Camera Recording
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Quality */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Video Quality</label>
              <Select value={videoQuality} onValueChange={setVideoQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p HD</SelectItem>
                  <SelectItem value="1080p">1080p Full HD</SelectItem>
                  <SelectItem value="4K">4K Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audio Settings */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Audio</label>
              <Button
                variant={audioEnabled ? "default" : "outline"}
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="w-full justify-start"
              >
                {audioEnabled ? <Mic className="w-4 h-4 mr-2" /> : <MicOff className="w-4 h-4 mr-2" />}
                {audioEnabled ? 'Audio On' : 'Audio Off'}
              </Button>
            </div>
          </div>

          {/* Recording Timer */}
          {(isRecording || recordedBlob) && (
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Recording Duration</span>
                <span className="text-xl font-mono text-white">{formatTime(recordingTime)}</span>
              </div>
              {isRecording && (
                <Progress 
                  value={(recordingTime % 60) * (100/60)} 
                  className="h-2"
                />
              )}
            </div>
          )}

          {/* Recording Buttons */}
          <div className="flex gap-3">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isRecording}
              >
                <Video className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                >
                  {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </Button>
              </>
            )}
          </div>

          {/* Download Section */}
          {recordedBlob && !isRecording && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-green-400 font-medium">Recording Complete</h4>
                  <p className="text-sm text-gray-400">
                    Duration: {formatTime(recordingTime)} • Size: {(recordedBlob.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={downloadRecording}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={resetRecording}
                    variant="outline"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Recording Tips */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Recording Tips
            </h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Screen recording captures your entire display</li>
              <li>• Camera recording uses your webcam</li>
              <li>• Enable audio to record system sounds and microphone</li>
              <li>• Higher quality recordings create larger files</li>
              <li>• Recordings are saved locally to your device</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}