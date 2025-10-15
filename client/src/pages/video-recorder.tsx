import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Video, Square, Download, Play, Pause, Settings, Info, Mic, MicOff } from 'lucide-react';

export default function VideoRecorder() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingMode, setRecordingMode] = useState('screen');
  const [videoQuality, setVideoQuality] = useState('1080p');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getVideoConstraints = useCallback(() => {
    const constraints: any = {
      video: {
        width: videoQuality === '4k' ? 3840 : videoQuality === '1440p' ? 2560 : videoQuality === '1080p' ? 1920 : 1280,
        height: videoQuality === '4k' ? 2160 : videoQuality === '1440p' ? 1440 : videoQuality === '1080p' ? 1080 : 720,
        frameRate: 30
      }
    };

    if (audioEnabled) {
      constraints.audio = {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      };
    }

    return constraints;
  }, [videoQuality, audioEnabled]);

  const startRecording = async () => {
    try {
      let stream: MediaStream;

      if (recordingMode === 'screen') {
        // Screen recording
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: videoQuality === '4k' ? 3840 : videoQuality === '1440p' ? 2560 : videoQuality === '1080p' ? 1920 : 1280,
            height: videoQuality === '4k' ? 2160 : videoQuality === '1440p' ? 1440 : videoQuality === '1080p' ? 1080 : 720,
            frameRate: 30
          },
          audio: audioEnabled
        });
      } else {
        // Camera recording
        stream = await navigator.mediaDevices.getUserMedia(getVideoConstraints());
      }

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setRecordedChunks(chunks);
        
        toast({
          title: "Recording Complete!",
          description: "Your video has been recorded successfully. You can now download it.",
          duration: 5000,
        });
      };

      mediaRecorder.start(1000); // Capture data every second
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started!",
        description: `${recordingMode === 'screen' ? 'Screen' : 'Camera'} recording has begun in ${videoQuality} quality.`,
        duration: 3000,
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Unable to start recording. Please check your permissions and try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const downloadRecording = () => {
    if (recordedVideoUrl) {
      const a = document.createElement('a');
      a.href = recordedVideoUrl;
      a.download = `nebulax-recording-${new Date().toISOString().split('T')[0]}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Your recording is being downloaded.",
        duration: 3000,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityDescription = (quality: string) => {
    switch (quality) {
      case '4k': return '3840x2160 (4K Ultra HD)';
      case '1440p': return '2560x1440 (2K QHD)';
      case '1080p': return '1920x1080 (Full HD)';
      case '720p': return '1280x720 (HD)';
      default: return 'Full HD';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 pt-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Video Recorder
          </h1>
          <p className="text-gray-300">Record trading sessions, create tutorials, and capture your NebulaX experience</p>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 font-medium">
                {isPaused ? 'PAUSED' : 'RECORDING'} - {formatTime(recordingTime)}
              </span>
            </div>
          </div>
        )}

        {/* Main Recording Interface */}
        <Card className="bg-gray-800/50 border-gray-700/50 mb-6 relative z-10">
          <CardHeader className="border-b border-gray-700/50">
            <CardTitle className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-purple-400" />
              <span>Video Recorder</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Recording Mode */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Recording Mode</label>
                <select 
                  value={recordingMode} 
                  onChange={(e) => setRecordingMode(e.target.value)}
                  disabled={isRecording}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="screen">📺 Screen Recording</option>
                  <option value="camera">📹 Camera Recording</option>
                </select>
              </div>

              {/* Video Quality */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Video Quality</label>
                <select 
                  value={videoQuality} 
                  onChange={(e) => setVideoQuality(e.target.value)}
                  disabled={isRecording}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="4k">4K Ultra HD (3840x2160)</option>
                  <option value="1440p">2K QHD (2560x1440)</option>
                  <option value="1080p">1080p Full HD (1920x1080)</option>
                  <option value="720p">720p HD (1280x720)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">{getQualityDescription(videoQuality)}</p>
              </div>

              {/* Audio */}
              <div>
                <label className="block text-sm font-medium mb-2">Audio</label>
                <Button
                  variant={audioEnabled ? "default" : "outline"}
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  disabled={isRecording}
                  className={`w-full ${audioEnabled ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                >
                  {audioEnabled ? (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Audio On
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Audio Off
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
                  size="lg"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <div className="flex space-x-3">
                  <Button
                    onClick={pauseRecording}
                    variant="outline"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                  >
                    {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    onClick={stopRecording}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recording Tips */}
        <Card className="bg-gray-800/50 border-gray-700/50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-400" />
              <span>Recording Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-300">
              <li>• Screen recording captures your entire display</li>
              <li>• Camera recording uses your webcam</li>
              <li>• Enable audio to record system sounds and microphone</li>
              <li>• Higher quality recordings create larger files</li>
              <li>• Recordings are saved locally to your device</li>
              <li>• Use pause feature to exclude sensitive information</li>
              <li>• Ensure good lighting for camera recordings</li>
              <li>• Close unnecessary applications for better performance</li>
            </ul>
          </CardContent>
        </Card>

        {/* Video Preview */}
        {recordedVideoUrl && (
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5 text-green-400" />
                  <span>Recorded Video</span>
                </div>
                <Button
                  onClick={downloadRecording}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <video
                src={recordedVideoUrl}
                controls
                className="w-full max-w-2xl mx-auto rounded-lg"
                style={{ maxHeight: '400px' }}
              >
                Your browser does not support the video tag.
              </video>
              <p className="text-center text-gray-400 mt-4">
                Recording duration: {formatTime(recordingTime)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}