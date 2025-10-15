import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Send, 
  MessageCircle, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Zap,
  X,
  Minimize2,
  Target,
  TrendingDown,
  Shield,
  Activity,
  Palette,
  Monitor,
  Moon,
  Sun,
  Sparkles,
  Phone,
  Users,
  HelpCircle,
  Bot
} from 'lucide-react';
import { useLiveData } from '@/components/websocket/live-data-provider';
import { useQuery } from '@tanstack/react-query';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: string;
  messageType?: 'analysis' | 'recommendation' | 'alert' | 'general';
}

interface AIRecommendation {
  id: number;
  type: 'buy' | 'sell' | 'hold';
  asset: string;
  confidence: number;
  reasoning: string;
  targetPrice: number;
  currentPrice: number;
  timeframe: string;
  riskLevel: 'low' | 'medium' | 'high';
  potentialGain: number;
  stopLoss: number;
  aiScore: number;
  signals: string[];
  timestamp: string;
}

interface SupportMessage {
  id: string;
  type: "user" | "agent" | "system";
  message: string;
  timestamp: string;
  agentName?: string;
  status?: "sent" | "delivered" | "read";
}

interface AITradingAssistantProps {
  isFloating?: boolean;
  onClose?: () => void;
}

export default function AITradingAssistant({ isFloating = false, onClose }: AITradingAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Trading Assistant. I can help you with market analysis, trading recommendations, and portfolio optimization. What would you like to know?',
      timestamp: new Date(),
      confidence: 'high',
      messageType: 'general'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'schemes' | 'support'>('chat');
  const { prices } = useLiveData();

  // If dismissed, don't render anything
  if (isDismissed) {
    console.log("AI Assistant dismissed, not rendering");
    return null;
  }

  console.log("AI Assistant rendering with floating:", isFloating);

  // AI Recommendations data
  const recommendations: AIRecommendation[] = [
    {
      id: 1,
      type: 'buy',
      asset: 'BTC',
      confidence: 87,
      reasoning: 'Strong technical indicators suggest upward momentum. RSI indicates oversold conditions with high volume support.',
      targetPrice: 45500,
      currentPrice: 43250,
      timeframe: '7-14 days',
      riskLevel: 'medium',
      potentialGain: 5.2,
      stopLoss: 41800,
      aiScore: 8.7,
      signals: ['Golden Cross', 'Volume Surge', 'Support Bounce'],
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'sell',
      asset: 'DOGE',
      confidence: 72,
      reasoning: 'Overbought conditions detected with weakening momentum. Consider taking profits at current resistance levels.',
      targetPrice: 0.085,
      currentPrice: 0.092,
      timeframe: '3-5 days',
      riskLevel: 'high',
      potentialGain: -7.6,
      stopLoss: 0.095,
      aiScore: 7.2,
      signals: ['Overbought RSI', 'Resistance Level', 'Profit Taking'],
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      type: 'hold',
      asset: 'ETH',
      confidence: 91,
      reasoning: 'Consolidation phase with strong fundamentals. Perfect accumulation opportunity with DCA strategy recommended.',
      targetPrice: 2850,
      currentPrice: 2654,
      timeframe: '2-4 weeks',
      riskLevel: 'low',
      potentialGain: 7.4,
      stopLoss: 2500,
      aiScore: 9.1,
      signals: ['Strong Support', 'DCA Opportunity', 'Fundamentals'],
      timestamp: '1 hour ago'
    }
  ];

  // Color Schemes data
  const [currentScheme, setCurrentScheme] = useState(0);
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  const colorSchemes = [
    {
      name: 'Crypto Dark',
      icon: <Moon className="w-4 h-4" />,
      primary: 'hsl(259, 94%, 51%)',
      secondary: 'hsl(180, 100%, 50%)',
      accent: 'hsl(300, 100%, 75%)',
      background: 'hsl(240, 10%, 3.9%)',
      surface: 'hsl(240, 10%, 8%)',
      text: 'hsl(0, 0%, 98%)',
      description: 'Deep space trading environment'
    },
    {
      name: 'Solar Flare',
      icon: <Sun className="w-4 h-4" />,
      primary: 'hsl(25, 95%, 53%)',
      secondary: 'hsl(45, 93%, 47%)',
      accent: 'hsl(5, 85%, 60%)',
      background: 'hsl(20, 14.3%, 4.1%)',
      surface: 'hsl(24, 9.8%, 10%)',
      text: 'hsl(0, 0%, 95%)',
      description: 'Energy-rich golden theme'
    },
    {
      name: 'Ocean Depth',
      icon: <Sparkles className="w-4 h-4" />,
      primary: 'hsl(200, 94%, 51%)',
      secondary: 'hsl(180, 100%, 40%)',
      accent: 'hsl(220, 100%, 75%)',
      background: 'hsl(220, 10%, 3.9%)',
      surface: 'hsl(220, 10%, 8%)',
      text: 'hsl(210, 40%, 98%)',
      description: 'Deep blue professional look'
    }
  ];

  // Support Agent data
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    {
      id: "1",
      type: "system",
      message: "Welcome to NebulaX Support! An agent will be with you shortly.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [supportMessage, setSupportMessage] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState<"connecting" | "connected" | "ended">("connecting");

  const supportAgent = {
    id: "agent1",
    name: "Sarah Johnson",
    avatar: "SJ",
    status: "online" as const,
    specialization: "Trading & Technical Support"
  };

  // Sample portfolio data
  const portfolioData = {
    totalValue: 45672.89,
    assets: [
      { symbol: 'BTC', amount: 0.8, value: 34600 },
      { symbol: 'ETH', amount: 3.2, value: 8500 },
      { symbol: 'SOL', amount: 25, value: 2572 }
    ]
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Based on current market conditions, I recommend monitoring BTC for potential entry points. The RSI is showing oversold conditions which could indicate a good buying opportunity.',
        timestamp: new Date(),
        confidence: 'high',
        messageType: 'recommendation'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getActionColor = (type: 'buy' | 'sell' | 'hold') => {
    switch (type) {
      case 'buy': return 'bg-green-500 hover:bg-green-600';
      case 'sell': return 'bg-red-500 hover:bg-red-600';
      case 'hold': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const applyColorScheme = (schemeIndex: number) => {
    if (schemeIndex >= colorSchemes.length) return;
    
    const scheme = colorSchemes[schemeIndex];
    const root = document.documentElement;
    root.style.setProperty('--color-primary', scheme.primary);
    root.style.setProperty('--color-secondary', scheme.secondary);
    root.style.setProperty('--color-accent', scheme.accent);
    root.style.setProperty('--color-background', scheme.background);
    root.style.setProperty('--color-surface', scheme.surface);
    root.style.setProperty('--color-text', scheme.text);
    
    setCurrentScheme(schemeIndex);
  };

  const sendSupportMessage = () => {
    if (!supportMessage.trim()) return;

    const userMessage: SupportMessage = {
      id: Date.now().toString(),
      type: "user",
      message: supportMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };

    setSupportMessages(prev => [...prev, userMessage]);
    setSupportMessage("");
    setIsAgentTyping(true);

    setTimeout(() => {
      setIsAgentTyping(false);
      const responses = [
        "I understand your concern. Let me help you with that right away.",
        "That's a great question! I'll walk you through the process step by step.",
        "I can definitely assist you with this. Let me check your account details.",
        "Thank you for reaching out. I'll make sure we resolve this quickly."
      ];
      
      const agentResponse: SupportMessage = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: supportAgent.name,
        status: "delivered"
      };
      
      setSupportMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  // Render main interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold">AI Trading Assistant Suite</h1>
              <p className="text-gray-400">Complete trading intelligence platform</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-red-400"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="schemes" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Color Schemes</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Support Agent</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="mt-6">
            <Card className="glass border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>AI Trading Assistant</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-96 overflow-y-auto space-y-4 p-4 bg-black/20 rounded-lg">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-800 text-gray-200'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-white rounded-lg p-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about trading..."
                    className="bg-gray-800 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="glass border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl font-bold">{rec.asset}</div>
                        <Badge className={getActionColor(rec.type)}>
                          {rec.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold">{rec.aiScore}/10</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400">Current Price</div>
                          <div className="text-lg font-bold">${rec.currentPrice.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Target Price</div>
                          <div className="text-lg font-bold">${rec.targetPrice.toLocaleString()}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Reasoning</div>
                        <p className="text-sm">{rec.reasoning}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className={`text-sm ${getRiskColor(rec.riskLevel)}`}>
                          Risk: {rec.riskLevel.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-400">{rec.timestamp}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Color Schemes Tab */}
          <TabsContent value="schemes" className="mt-6">
            <Card className="glass border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  <span>Intelligent Color Schemes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {colorSchemes.map((scheme, index) => (
                    <Button
                      key={index}
                      variant={currentScheme === index ? "default" : "outline"}
                      onClick={() => applyColorScheme(index)}
                      className="h-auto p-4 flex flex-col items-start space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        {scheme.icon}
                        <span className="font-semibold">{scheme.name}</span>
                      </div>
                      <div className="text-xs text-gray-400">{scheme.description}</div>
                      <div className="flex space-x-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: scheme.primary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: scheme.secondary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: scheme.accent }}
                        />
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Agent Tab */}
          <TabsContent value="support" className="mt-6">
            <Card className="glass border-purple-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {supportAgent.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{supportAgent.name}</div>
                      <div className="text-sm text-gray-400">{supportAgent.specialization}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-96 overflow-y-auto space-y-4 p-4 bg-black/20 rounded-lg">
                  {supportMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs p-3 rounded-lg text-sm ${
                        message.type === "user" 
                          ? "bg-purple-500 text-white" 
                          : message.type === "system"
                          ? "bg-blue-500/20 text-blue-400 text-center"
                          : "bg-slate-700 text-white"
                      }`}>
                        {message.type === "agent" && message.agentName && (
                          <div className="text-xs text-gray-300 mb-1">{message.agentName}</div>
                        )}
                        <div>{message.message}</div>
                        <div className="text-xs mt-1 text-gray-400">{message.timestamp}</div>
                      </div>
                    </div>
                  ))}
                  {isAgentTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 text-white rounded-lg p-3 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="bg-gray-800 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && sendSupportMessage()}
                  />
                  <Button 
                    onClick={sendSupportMessage}
                    disabled={!supportMessage.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}