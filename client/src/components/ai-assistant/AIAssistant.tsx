import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  TrendingUp, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Brain,
  Zap,
  X,
  Minimize2,
  Maximize2,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?: 'text' | 'insight' | 'recommendation' | 'alert';
  data?: any;
}

interface AIInsight {
  id: string;
  title: string;
  content: string;
  type: 'customer' | 'deal' | 'support' | 'revenue';
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
}

interface AIAssistantProps {
  isFloating?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
}

export function AIAssistant({ 
  isFloating = false, 
  onClose, 
  onMinimize, 
  isMinimized = false 
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isMinimized);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: "Hi! I'm your AI assistant for NebulaX CRM. I can help you with customer insights, deal analysis, support ticket routing, and business intelligence. What would you like to know?",
      sender: 'ai',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
    
    // Load AI insights
    loadAIInsights();
    
    // Set up periodic insight updates
    const interval = setInterval(loadAIInsights, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for smooth, safe scrolling - NO PAGE SCROLL
      requestAnimationFrame(() => {
        // Find the immediate scrollable parent (ScrollArea component)
        const scrollArea = messagesEndRef.current?.closest('[data-radix-scroll-area-viewport]');
        if (scrollArea) {
          // Directly set scrollTop - no page interference
          scrollArea.scrollTop = scrollArea.scrollHeight;
        } else {
          // Fallback: find any scrollable parent container
          const parent = messagesEndRef.current?.parentElement;
          if (parent && (parent.style.overflow === 'auto' || parent.style.overflowY === 'auto' || parent.classList.contains('overflow-y-auto'))) {
            parent.scrollTop = parent.scrollHeight;
          }
        }
      });
    }
  };

  const loadAIInsights = async () => {
    try {
      const response = await fetch('/api/ai-assistant/insights');
      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-trading/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: 'crm',
          conversation_history: messages.slice(-5) // Last 5 messages for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          type: data.type || 'text',
          data: data.data
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Text-to-speech for AI responses
        if (isSpeaking) {
          speakText(data.response);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'customer': return <Users className="w-4 h-4" />;
      case 'deal': return <Target className="w-4 h-4" />;
      case 'support': return <MessageSquare className="w-4 h-4" />;
      case 'revenue': return <TrendingUp className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  if (isFloating && isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 shadow-lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${
      isFloating 
        ? 'fixed bottom-4 right-4 z-50 w-96 h-[600px] shadow-2xl' 
        : 'w-full h-full'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="w-8 h-8 bg-blue-600">
                <AvatarFallback>
                  <Bot className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <div>
              <CardTitle className="text-white text-lg">AI Assistant</CardTitle>
              <p className="text-gray-400 text-sm">NebulaX CRM Intelligence</p>
            </div>
          </div>
          
          {isFloating && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSpeaking(!isSpeaking)}
                className="text-gray-400 hover:text-white"
              >
                {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="text-gray-400 hover:text-white"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700 mx-4 mb-4">
            <TabsTrigger value="chat" className="text-gray-300 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-gray-300 data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-gray-300 data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="h-full px-4 pb-4">
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1 mb-4 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-purple-600 text-white'
                        }>
                          {message.sender === 'user' ? 
                            <User className="w-4 h-4" /> : 
                            <Bot className="w-4 h-4" />
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-xs ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`inline-block p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          {message.type === 'insight' && message.data && (
                            <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                              <p className="text-blue-400">
                                Confidence: {message.data.confidence}%
                              </p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-600 text-white">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-700 text-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
              
              <div className="flex items-center space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your CRM..."
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <Button
                  onClick={startListening}
                  disabled={isListening}
                  variant="outline"
                  size="sm"
                  className="text-gray-400 border-gray-600 hover:bg-gray-700"
                >
                  {isListening ? <Mic className="w-4 h-4 text-red-500" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="h-full px-4 pb-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {insights.map((insight) => (
                  <Card key={insight.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getInsightIcon(insight.type)}
                          <h3 className="font-semibold text-white text-sm">
                            {insight.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`${getInsightColor(insight.priority)} text-white border-0 text-xs`}
                          >
                            {insight.priority}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {insight.confidence}%
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        {insight.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(insight.timestamp)}
                        </span>
                        {insight.actionable && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-400 border-blue-400 hover:bg-blue-600/20"
                          >
                            Take Action
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="actions" className="h-full px-4 pb-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <Users className="w-6 h-6 mb-2" />
                  <span className="text-sm">Customer Analysis</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <Target className="w-6 h-6 mb-2" />
                  <span className="text-sm">Deal Insights</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <MessageSquare className="w-6 h-6 mb-2" />
                  <span className="text-sm">Support Routing</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span className="text-sm">Revenue Forecast</span>
                </Button>
              </div>
              
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:bg-gray-600"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Sales Report
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:bg-gray-600"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Identify At-Risk Customers
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:bg-gray-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Optimize Deal Pipeline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}