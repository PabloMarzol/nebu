import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Send, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  Shield,
  Lightbulb,
  MessageCircle,
  X,
  Minimize2,
  AlertTriangle,
  Target,
  Zap,
  Sparkles,
  Brain,
  Activity,
  Loader
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  messageType?: 'analysis' | 'recommendation' | 'alert' | 'general';
}

interface AITradingAssistantProps {
  isFloating?: boolean;
  onClose?: () => void;
}

const AITradingAssistant: React.FC<AITradingAssistantProps> = ({ 
  isFloating = false, 
  onClose 
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      type: 'assistant',
      content: 'Hello! I\'m your AI Trading Assistant. I can help you analyze markets, provide trading insights, assess risks, and answer any crypto trading questions. What would you like to know?',
      timestamp: new Date(),
      messageType: 'general'
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom SAFELY - no page scroll ever
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for smooth, safe scrolling
      requestAnimationFrame(() => {
        // Find the immediate scrollable parent (ScrollArea component)
        const scrollArea = messagesEndRef.current?.closest('[data-radix-scroll-area-viewport]');
        if (scrollArea) {
          // Directly set scrollTop - no page interference
          scrollArea.scrollTop = scrollArea.scrollHeight;
        } else {
          // Fallback: find any scrollable parent
          const parent = messagesEndRef.current?.parentElement;
          if (parent && (parent.style.overflow === 'auto' || parent.style.overflowY === 'auto' || parent.classList.contains('overflow-y-auto'))) {
            parent.scrollTop = parent.scrollHeight;
          }
        }
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the AI trading API endpoint
      const response = await fetch('/api/ai-trading/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            previousMessages: messages.slice(-5), // Send last 5 messages for context
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: AIMessage = {
        id: Date.now().toString() + '_ai',
        type: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
        confidence: data.confidence,
        messageType: data.type || 'general'
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI chat error:', error);
      
      const errorMessage: AIMessage = {
        id: Date.now().toString() + '_error',
        type: 'assistant',
        content: 'I\'m having trouble connecting right now. Please check your connection and try again.',
        timestamp: new Date(),
        messageType: 'general'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach AI assistant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };

  const getMessageIcon = (messageType?: string) => {
    switch (messageType) {
      case 'analysis': return <BarChart3 className="w-4 h-4 text-blue-400" />;
      case 'recommendation': return <Target className="w-4 h-4 text-green-400" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Brain className="w-4 h-4 text-purple-400" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { text: "Analyze BTC price", icon: <BarChart3 className="w-4 h-4" /> },
    { text: "Market sentiment", icon: <Activity className="w-4 h-4" /> },
    { text: "Portfolio review", icon: <DollarSign className="w-4 h-4" /> },
    { text: "Risk assessment", icon: <Shield className="w-4 h-4" /> }
  ];

  if (isMinimized && isFloating) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`${
      isFloating 
        ? 'fixed bottom-6 right-6 z-[9999] w-96 h-[500px]' 
        : 'w-full h-[600px]'
    } bg-gradient-to-br from-slate-900/95 via-purple-900/10 to-blue-900/20 backdrop-blur-xl border-purple-500/30 shadow-2xl overflow-hidden`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-purple-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-white">AI Trading Assistant</CardTitle>
            <p className="text-sm text-gray-300">Powered by advanced AI</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isFloating && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-red-500/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-full">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-slate-800/50 border border-gray-700/50 text-gray-100'
                  }`}
                >
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      {getMessageIcon(message.messageType)}
                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        {message.messageType || 'AI Assistant'}
                      </span>
                      {message.confidence && (
                        <Badge variant="outline" className="text-xs">
                          {message.confidence}% confidence
                        </Badge>
                      )}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-60 mt-2">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/50 border border-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-sm text-gray-300">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-gray-700/50">
            <p className="text-xs text-gray-400 mb-3">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(action.text)}
                  className="justify-start text-xs border-gray-600/50 hover:border-purple-500/50 hover:bg-purple-500/10"
                >
                  {action.icon}
                  <span className="ml-2 truncate">{action.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700/50 bg-slate-800/30">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              sendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about trading, markets, or crypto..."
              disabled={isLoading}
              className="flex-1 bg-slate-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITradingAssistant;