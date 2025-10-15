import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw,
  Settings,
  Mic,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceDescriptionProps {
  element?: string;
  content?: string;
  autoPlay?: boolean;
  includeNavigation?: boolean;
}

export default function AccessibilityVoiceDescription({ 
  element = "page", 
  content,
  autoPlay = false,
  includeNavigation = true 
}: VoiceDescriptionProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    voice: 0
  });
  const [isListening, setIsListening] = useState(false);
  const [visualMode, setVisualMode] = useState(false);
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  // Page descriptions for different sections
  const descriptions = {
    navbar: "Navigation bar with Nebula Xchange logo, platform dropdown menu with trading services, portfolio management, and institutional options. Authentication buttons for sign in and sign up on the right.",
    hero: "Main hero section featuring 'Stock Trading in 30 Seconds' headline with three primary action buttons: Buy & Sell Crypto Now, OTC Desk Pro, and Trading Dashboard. Below are secondary options for Bitcoin, Ethereum, View All Markets, Portfolio, and OTC Desk Pro.",
    trading: "Professional trading interface with real-time order book, price charts, and trading panel. Live market data showing current prices, 24-hour changes, and trading volumes for major cryptocurrencies.",
    portfolio: "Portfolio overview displaying total balance, asset allocation, recent transactions, and performance metrics. Interactive charts showing portfolio growth and diversification.",
    markets: "Live cryptocurrency markets with real-time prices, percentage changes, trading volumes, and market capitalization. Filtering options by category and sorting capabilities.",
    footer: "Footer section with company information, links to legal pages, social media channels, and contact details for Nebula Xchange platform."
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Initialize speech synthesis
      speechRef.current = new SpeechSynthesisUtterance();
      speechRef.current.rate = voiceSettings.rate;
      speechRef.current.pitch = voiceSettings.pitch;
      speechRef.current.volume = voiceSettings.volume;
      
      speechRef.current.onend = () => setIsPlaying(false);
      speechRef.current.onerror = () => setIsPlaying(false);
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        handleVoiceCommand(transcript.toLowerCase());
      };
    }

    return () => {
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    if (command.includes('describe') || command.includes('read')) {
      if (command.includes('page')) speakDescription('page');
      else if (command.includes('navigation')) speakDescription('navbar');
      else if (command.includes('trading')) speakDescription('trading');
      else if (command.includes('portfolio')) speakDescription('portfolio');
    } else if (command.includes('stop') || command.includes('pause')) {
      stopSpeaking();
    } else if (command.includes('help')) {
      speakDescription('help');
    }
  };

  const speakDescription = (type: string) => {
    if (!speechRef.current) return;

    let textToSpeak = "";
    
    switch (type) {
      case 'page':
        textToSpeak = content || getPageDescription();
        break;
      case 'help':
        textToSpeak = "Voice commands available: Say 'describe page' to hear page content, 'describe navigation' for menu options, 'describe trading' for trading interface, 'stop' to pause speech, or 'help' for this message.";
        break;
      default:
        textToSpeak = descriptions[type as keyof typeof descriptions] || "Content not available";
    }

    setCurrentDescription(textToSpeak);
    speechRef.current.text = textToSpeak;
    setIsPlaying(true);
    speechSynthesis.speak(speechRef.current);
  };

  const getPageDescription = () => {
    const path = window.location.pathname;
    if (path === '/') return descriptions.hero;
    if (path.includes('trading')) return descriptions.trading;
    if (path.includes('portfolio')) return descriptions.portfolio;
    if (path.includes('markets')) return descriptions.markets;
    return `You are on the ${path.slice(1) || 'home'} page of Nebula Xchange cryptocurrency trading platform.`;
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const announcePageChange = () => {
    if (isEnabled && autoPlay) {
      setTimeout(() => speakDescription('page'), 500);
    }
  };

  useEffect(() => {
    announcePageChange();
  }, [window.location.pathname]);

  return (
    <AnimatePresence>
      {isEnabled && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed bottom-20 right-4 z-50 w-80"
        >
          <Card className="bg-black/90 backdrop-blur-lg border-blue-500/30 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span>Voice Assistant</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEnabled(false)}
                  className="h-6 w-6 p-0"
                >
                  <EyeOff className="w-3 h-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakDescription('page')}
                  disabled={isPlaying}
                  className="text-xs"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Describe Page
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakDescription('navbar')}
                  disabled={isPlaying}
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Navigation
                </Button>
              </div>

              {/* Voice Control */}
              <div className="flex space-x-2">
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                  onClick={toggleListening}
                  className="flex-1 text-xs"
                >
                  <Mic className="w-3 h-3 mr-1" />
                  {isListening ? 'Listening...' : 'Voice Commands'}
                </Button>
                {isPlaying && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopSpeaking}
                    className="text-xs"
                  >
                    <Pause className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Current Status */}
              {currentDescription && (
                <div className="text-xs text-blue-300 bg-blue-500/20 p-2 rounded max-h-20 overflow-y-auto">
                  {currentDescription.substring(0, 100)}...
                </div>
              )}

              {/* Visual Indicators */}
              <div className="flex items-center justify-between text-xs">
                <Badge variant={isPlaying ? "default" : "secondary"} className="text-xs">
                  {isPlaying ? 'Speaking' : 'Ready'}
                </Badge>
                {isListening && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-red-500 rounded-full"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Toggle Button */}
      {!isEnabled && (
        <Button
          onClick={() => setIsEnabled(true)}
          className="fixed bottom-20 right-4 z-50 rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700"
          title="Enable Voice Accessibility"
        >
          <Volume2 className="w-5 h-5" />
        </Button>
      )}
    </AnimatePresence>
  );
}

// Hook for easy integration
export function useVoiceAnnouncement() {
  const announce = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.volume = 0.6;
      speechSynthesis.speak(utterance);
    }
  };

  return { announce };
}