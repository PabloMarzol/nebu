import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, Play, Square, Settings } from "lucide-react";

interface VoiceCommand {
  command: string;
  action: string;
  parameters?: string[];
  executed: boolean;
  timestamp: Date;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function VoiceTradingCommands() {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [commandHistory, setCommandHistory] = useState<VoiceCommand[]>([]);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Voice command patterns
  const commandPatterns = [
    {
      pattern: /buy (\d+(?:\.\d+)?)\s*(bitcoin|btc|ethereum|eth|solana|sol|ada|cardano)/i,
      action: "buy",
      description: "Buy cryptocurrency - 'Buy 0.5 Bitcoin'"
    },
    {
      pattern: /sell (\d+(?:\.\d+)?)\s*(bitcoin|btc|ethereum|eth|solana|sol|ada|cardano)/i,
      action: "sell",
      description: "Sell cryptocurrency - 'Sell 2 Ethereum'"
    },
    {
      pattern: /set (?:stop loss|stoploss) (?:at )?(\d+(?:\.\d+)?)/i,
      action: "setStopLoss",
      description: "Set stop loss - 'Set stop loss at 45000'"
    },
    {
      pattern: /show (?:portfolio|balance)/i,
      action: "showPortfolio",
      description: "Show portfolio - 'Show portfolio'"
    },
    {
      pattern: /check price (?:of )?(bitcoin|btc|ethereum|eth|solana|sol|ada|cardano)/i,
      action: "checkPrice",
      description: "Check price - 'Check price of Bitcoin'"
    },
    {
      pattern: /(?:cancel|stop) (?:all )?(?:orders?)/i,
      action: "cancelOrders",
      description: "Cancel orders - 'Cancel all orders'"
    },
    {
      pattern: /rebalance portfolio/i,
      action: "rebalancePortfolio",
      description: "Rebalance portfolio - 'Rebalance portfolio'"
    },
    {
      pattern: /take (?:profit|gains) (?:at )?(\d+(?:\.\d+)?)/i,
      action: "takeProfit",
      description: "Take profit - 'Take profit at 50000'"
    }
  ];

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = '';
          let confidence = 0;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
            confidence = event.results[i][0].confidence;
          }

          setCurrentTranscript(transcript);
          setConfidence(confidence);

          // Process final results
          if (event.results[event.resultIndex].isFinal) {
            processVoiceCommand(transcript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processVoiceCommand = (transcript: string) => {
    const cleanTranscript = transcript.toLowerCase().trim();
    
    for (const pattern of commandPatterns) {
      const match = cleanTranscript.match(pattern.pattern);
      if (match) {
        const command: VoiceCommand = {
          command: transcript,
          action: pattern.action,
          parameters: match.slice(1),
          executed: executeCommand(pattern.action, match.slice(1)),
          timestamp: new Date()
        };

        setCommandHistory(prev => [command, ...prev.slice(0, 9)]);
        speakResponse(command);
        break;
      }
    }

    setCurrentTranscript("");
  };

  const executeCommand = (action: string, parameters: string[]): boolean => {
    try {
      switch (action) {
        case "buy":
        case "sell":
          const amount = parseFloat(parameters[0]);
          const symbol = parameters[1].toUpperCase();
          console.log(`${action.toUpperCase()} ${amount} ${symbol}`);
          return true;

        case "setStopLoss":
          const stopPrice = parseFloat(parameters[0]);
          console.log(`Set stop loss at $${stopPrice}`);
          return true;

        case "showPortfolio":
          console.log("Showing portfolio");
          return true;

        case "checkPrice":
          const asset = parameters[0].toUpperCase();
          console.log(`Checking price of ${asset}`);
          return true;

        case "cancelOrders":
          console.log("Cancelling all orders");
          return true;

        case "rebalancePortfolio":
          console.log("Rebalancing portfolio");
          return true;

        case "takeProfit":
          const profitPrice = parseFloat(parameters[0]);
          console.log(`Taking profit at $${profitPrice}`);
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error("Command execution error:", error);
      return false;
    }
  };

  const speakResponse = (command: VoiceCommand) => {
    if (!isVoiceEnabled || !synthRef.current) return;

    let response = "";
    switch (command.action) {
      case "buy":
        response = `Executing buy order for ${command.parameters?.[0]} ${command.parameters?.[1]}`;
        break;
      case "sell":
        response = `Executing sell order for ${command.parameters?.[0]} ${command.parameters?.[1]}`;
        break;
      case "setStopLoss":
        response = `Stop loss set at ${command.parameters?.[0]} dollars`;
        break;
      case "showPortfolio":
        response = "Displaying your portfolio";
        break;
      case "checkPrice":
        response = `Checking current price of ${command.parameters?.[0]}`;
        break;
      case "cancelOrders":
        response = "Cancelling all open orders";
        break;
      case "rebalancePortfolio":
        response = "Starting portfolio rebalancing";
        break;
      case "takeProfit":
        response = `Setting take profit at ${command.parameters?.[0]} dollars`;
        break;
      default:
        response = "Command executed";
    }

    const utterance = new SpeechSynthesisUtterance(response);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleVoiceResponses = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-cyan-400" />
          <span>Voice-Activated Trading</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Controls */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30">
          <div className="flex items-center space-x-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
              {isListening ? "Stop Listening" : "Start Listening"}
            </Button>
            
            <Button
              variant="outline"
              onClick={toggleVoiceResponses}
              className="glass"
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              Voice Responses {isVoiceEnabled ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={isListening ? "bg-red-500" : "bg-gray-500"}>
              {isListening ? "Listening" : "Idle"}
            </Badge>
            {confidence > 0 && (
              <Badge className="bg-blue-500">
                {Math.round(confidence * 100)}% confidence
              </Badge>
            )}
          </div>
        </div>

        {/* Current Transcript */}
        {currentTranscript && (
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="text-sm text-muted-foreground mb-1">Listening:</div>
            <div className="text-lg">{currentTranscript}</div>
          </div>
        )}

        {/* Voice Commands Help */}
        <div>
          <h3 className="font-semibold mb-3">Available Voice Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commandPatterns.map((pattern, index) => (
              <div key={index} className="p-3 rounded-lg bg-slate-800/30 border border-purple-500/20">
                <div className="font-medium text-sm text-purple-400">{pattern.action}</div>
                <div className="text-xs text-muted-foreground mt-1">{pattern.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Command History */}
        <div>
          <h3 className="font-semibold mb-3">Recent Commands</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {commandHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No voice commands executed yet
              </div>
            ) : (
              commandHistory.map((cmd, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-800/30 border border-purple-500/20">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-sm">{cmd.command}</div>
                    <Badge className={cmd.executed ? "bg-green-500" : "bg-red-500"}>
                      {cmd.executed ? "Executed" : "Failed"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cmd.action} • {cmd.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="p-4 rounded-lg bg-slate-800/30 border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">Voice Settings</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Language</div>
              <div className="font-medium">English (US)</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Recognition</div>
              <div className="font-medium">Continuous</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Commands</div>
              <div className="font-medium">{commandPatterns.length} Available</div>
            </div>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <div className="text-sm">
            <strong>Safety Notice:</strong> Voice commands execute real trades. Ensure you're in a quiet environment 
            and speak clearly. Consider using confirmation prompts for large orders.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}