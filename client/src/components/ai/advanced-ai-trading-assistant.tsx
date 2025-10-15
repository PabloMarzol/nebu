import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Bot,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Zap,
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Star,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Clock,
  DollarSign,
  Lightbulb,
  Sparkles,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  StopCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AITradingAssistantProps {
  userTier?: 'basic' | 'pro' | 'premium' | 'elite';
}

interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  analysis?: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    risk: 'low' | 'medium' | 'high';
    recommendation?: string;
  };
  actions?: Array<{
    type: 'buy' | 'sell' | 'hold' | 'alert';
    asset: string;
    amount?: number;
    price?: number;
    executed?: boolean;
  }>;
}

interface MarketInsight {
  id: string;
  type: 'prediction' | 'analysis' | 'alert' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high';
  assets: string[];
}

interface AIPersonality {
  id: string;
  name: string;
  description: string;
  style: 'conservative' | 'aggressive' | 'balanced';
  specialization: string;
}

export default function AdvancedAITradingAssistant({ userTier = 'basic' }: AITradingAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [aiPersonality, setAiPersonality] = useState('balanced');
  const [autoExecute, setAutoExecute] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const personalities: AIPersonality[] = [
    {
      id: 'conservative',
      name: 'Warren (Conservative)',
      description: 'Risk-averse, focuses on long-term value investing',
      style: 'conservative',
      specialization: 'Value investing, risk management'
    },
    {
      id: 'aggressive',
      name: 'Alex (Aggressive)',
      description: 'High-risk high-reward, quick market moves',
      style: 'aggressive',
      specialization: 'Day trading, momentum strategies'
    },
    {
      id: 'balanced',
      name: 'Morgan (Balanced)',
      description: 'Moderate risk, diversified approach',
      style: 'balanced',
      specialization: 'Diversified portfolios, market analysis'
    },
    {
      id: 'technical',
      name: 'Taylor (Technical)',
      description: 'Chart patterns, technical indicators expert',
      style: 'balanced',
      specialization: 'Technical analysis, pattern recognition'
    }
  ];

  const aiCapabilities = {
    basic: ['Basic market analysis', 'Simple recommendations'],
    pro: ['Advanced analysis', 'Portfolio suggestions', 'Risk assessment', 'Voice commands'],
    premium: ['Predictive analytics', 'Auto-execution', 'Custom strategies', 'Real-time alerts'],
    elite: ['Full AI automation', 'Advanced ML models', 'Custom personalities', 'Institutional features']
  };

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hello! I'm your AI Trading Assistant. I can help you with market analysis, trading recommendations, and portfolio management. What would you like to know about the markets today?`,
      timestamp: new Date(),
      analysis: {
        sentiment: 'neutral',
        confidence: 95,
        risk: 'low'
      }
    };
    setMessages([welcomeMessage]);
  }, []);

  // Generate market insights
  useEffect(() => {
    const generateInsights = () => {
      const insights: MarketInsight[] = [
        {
          id: '1',
          type: 'prediction',
          title: 'Bitcoin Price Movement',
          description: 'AI predicts 15% upward movement in BTC over next 7 days based on technical indicators',
          confidence: 78,
          timeframe: '7 days',
          impact: 'high',
          assets: ['BTC']
        },
        {
          id: '2',
          type: 'opportunity',
          title: 'Ethereum Accumulation Zone',
          description: 'ETH entering strong support level, good accumulation opportunity',
          confidence: 85,
          timeframe: '3-5 days',
          impact: 'medium',
          assets: ['ETH']
        },
        {
          id: '3',
          type: 'alert',
          title: 'Market Volatility Warning',
          description: 'Increased volatility expected due to upcoming economic data release',
          confidence: 92,
          timeframe: '24 hours',
          impact: 'medium',
          assets: ['BTC', 'ETH', 'SOL']
        }
      ];
      setMarketInsights(insights);
    };

    generateInsights();
    const interval = setInterval(generateInsights, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const processAIResponse = async (userInput: string): Promise<AIMessage> => {
    // Simulate AI processing with realistic trading insights
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = [
      {
        content: `Based on current market conditions, I see strong bullish momentum in BTC. The RSI is oversold at 28, and we're approaching a key support level at $42,800. I recommend considering a position with a stop-loss at $41,500.`,
        analysis: { sentiment: 'bullish' as const, confidence: 82, risk: 'medium' as const },
        actions: [{ type: 'buy' as const, asset: 'BTC', amount: 0.1, price: 43000 }]
      },
      {
        content: `Market analysis shows ETH is consolidating in a symmetrical triangle pattern. Breaking above $2,450 could signal a move to $2,800. Volume is declining, suggesting a breakout is imminent.`,
        analysis: { sentiment: 'neutral' as const, confidence: 74, risk: 'low' as const }
      },
      {
        content: `Alert: Unusual options activity detected in SOL. Large call volume at $180 strike suggests institutional accumulation. Consider this for your portfolio diversification.`,
        analysis: { sentiment: 'bullish' as const, confidence: 89, risk: 'medium' as const },
        actions: [{ type: 'alert' as const, asset: 'SOL', price: 180 }]
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: randomResponse.content,
      timestamp: new Date(),
      analysis: randomResponse.analysis,
      actions: randomResponse.actions
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const aiResponse = await processAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);

      // Auto-execute if enabled and actions are present
      if (autoExecute && aiResponse.actions && userTier !== 'basic') {
        executeAIActions(aiResponse.actions);
      }
    } catch (error) {
      toast({
        title: "AI Processing Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAIActions = (actions: AIMessage['actions']) => {
    if (!actions) return;

    actions.forEach(action => {
      toast({
        title: `AI Action: ${action.type.toUpperCase()}`,
        description: `${action.asset} - ${action.amount || 'Alert set'}`,
        variant: "default"
      });
    });
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Voice Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    setIsListening(true);
    // Voice recognition would be implemented here
    setTimeout(() => {
      setIsListening(false);
      setInputMessage("What's the current sentiment for Bitcoin?");
    }, 3000);
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'conservative': return <Shield className="w-4 h-4" />;
      case 'aggressive': return <Zap className="w-4 h-4" />;
      case 'balanced': return <Target className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Trading Assistant
          </h1>
          <p className="text-gray-300">
            Advanced AI-powered trading insights and automation
          </p>
          <Badge variant="secondary" className="mt-2">
            {userTier?.toUpperCase()} Tier - {aiCapabilities[userTier]?.length || 0} Features
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-6 h-6 text-blue-400" />
                    <span>AI Chat</span>
                    {isProcessing && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="w-4 h-4 text-blue-400" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                    >
                      {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                    <Select value={aiPersonality} onValueChange={setAiPersonality}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {personalities.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <div className="flex items-center space-x-2">
                              {getPersonalityIcon(p.style)}
                              <span>{p.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white ml-auto' 
                            : 'bg-gray-700 text-white'
                        }`}>
                          <div className="flex items-start space-x-2">
                            {message.type === 'ai' && (
                              <Bot className="w-5 h-5 text-blue-400 mt-1" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{message.content}</p>
                              
                              {/* AI Analysis */}
                              {message.analysis && (
                                <div className="mt-2 p-2 bg-white/10 rounded text-xs">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className={`flex items-center space-x-1 ${
                                      message.analysis.sentiment === 'bullish' ? 'text-green-400' :
                                      message.analysis.sentiment === 'bearish' ? 'text-red-400' : 'text-gray-400'
                                    }`}>
                                      {message.analysis.sentiment === 'bullish' ? <TrendingUp className="w-3 h-3" /> :
                                       message.analysis.sentiment === 'bearish' ? <TrendingDown className="w-3 h-3" /> :
                                       <Activity className="w-3 h-3" />}
                                      <span>{message.analysis.sentiment}</span>
                                    </span>
                                    <span>Confidence: {message.analysis.confidence}%</span>
                                  </div>
                                  <div className={`text-xs ${
                                    message.analysis.risk === 'low' ? 'text-green-400' :
                                    message.analysis.risk === 'medium' ? 'text-yellow-400' : 'text-red-400'
                                  }`}>
                                    Risk: {message.analysis.risk.toUpperCase()}
                                  </div>
                                </div>
                              )}

                              {/* AI Actions */}
                              {message.actions && message.actions.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.actions.map((action, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-white/10 rounded text-xs">
                                      <span>{action.type.toUpperCase()} {action.asset}</span>
                                      {userTier !== 'basic' && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => executeAIActions([action])}
                                          className="h-6 text-xs"
                                        >
                                          Execute
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="text-xs text-gray-400 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me about market trends, analysis, or trading strategies..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isProcessing}
                      className="bg-white/5 border-white/10 pr-10"
                    />
                    {userTier !== 'basic' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={startVoiceRecognition}
                        disabled={isListening}
                      >
                        {isListening ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isProcessing || !inputMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* AI Settings */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>AI Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userTier !== 'basic' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto Execute</div>
                      <div className="text-sm text-gray-400">Automatically execute AI recommendations</div>
                    </div>
                    <Switch
                      checked={autoExecute}
                      onCheckedChange={setAutoExecute}
                    />
                  </div>
                )}

                <div>
                  <div className="font-medium mb-2">Risk Tolerance: {riskTolerance[0]}%</div>
                  <Slider
                    value={riskTolerance}
                    onValueChange={setRiskTolerance}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="font-medium mb-2">Current Personality</div>
                  <div className="p-2 bg-white/5 rounded">
                    <div className="flex items-center space-x-2 mb-1">
                      {getPersonalityIcon(personalities.find(p => p.id === aiPersonality)?.style || 'balanced')}
                      <span className="text-sm font-medium">
                        {personalities.find(p => p.id === aiPersonality)?.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {personalities.find(p => p.id === aiPersonality)?.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketInsights.map((insight) => (
                    <div key={insight.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={
                          insight.type === 'prediction' ? 'default' :
                          insight.type === 'opportunity' ? 'secondary' :
                          insight.type === 'alert' ? 'destructive' : 'outline'
                        }>
                          {insight.type}
                        </Badge>
                        <span className="text-xs text-gray-400">{insight.confidence}% confidence</span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-gray-400 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>{insight.timeframe}</span>
                        <div className="flex items-center space-x-2">
                          {insight.assets.map((asset) => (
                            <Badge key={asset} variant="outline" className="text-xs">
                              {asset}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setInputMessage("Analyze my portfolio")}
                  >
                    <PieChart className="w-3 h-3 mr-1" />
                    Portfolio
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setInputMessage("Market sentiment today")}
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Sentiment
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setInputMessage("Risk assessment")}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Risk Check
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setInputMessage("Trading opportunities")}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Opportunities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}