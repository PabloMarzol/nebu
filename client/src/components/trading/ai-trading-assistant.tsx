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
  DollarSign,
  BarChart3,
  Shield,
  MessageCircle,
  X,
  Minimize2,
  AlertTriangle,
  Target,
  Sparkles,
  Brain,
  Activity,
  Loader2
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
      content: 'Hello! I\'m your AI Trading Assistant. I can help you analyze markets, provide trading insights, assess risks, and answer crypto questions. What would you like to know?',
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
      const response = await fetch('/api/ai-trading/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: {
            previousMessages: messages.slice(-5),
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
        content: data.response || 'I apologize, but I encountered an issue. Please try again.',
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

  // Removed handleKeyPress as we're now using onKeyDown and form submission

  const getMessageTypeColor = (messageType?: string) => {
    switch (messageType) {
      case 'analysis': return 'text-blue-400';
      case 'recommendation': return 'text-green-400';
      case 'alert': return 'text-yellow-400';
      default: return 'text-purple-400';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    "Analyze BTC price trend",
    "Market sentiment today",
    "Portfolio risk assessment",
    "Best trading opportunities"
  ];

  if (isMinimized && isFloating) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Brain className="w-5 h-5 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`${
      isFloating 
        ? 'fixed bottom-6 right-6 z-[9999] w-96 h-[500px]' 
        : 'w-full max-w-2xl mx-auto h-[600px]'
    } bg-slate-900/95 backdrop-blur-xl border-purple-500/20 shadow-2xl`}>
      
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b border-purple-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-white">AI Trading Assistant</CardTitle>
            <p className="text-xs text-gray-400">Powered by GPT-4</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {isFloating && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 text-gray-400 hover:text-white hover:bg-red-500/20"
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
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-slate-800/70 border border-slate-700/50 text-gray-100'
                  }`}
                >
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getMessageTypeColor(message.messageType)}`} />
                      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                        {message.messageType === 'analysis' ? 'Analysis' :
                         message.messageType === 'recommendation' ? 'Recommendation' :
                         message.messageType === 'alert' ? 'Alert' : 'AI Assistant'}
                      </span>
                      {message.confidence && (
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          {message.confidence}%
                        </Badge>
                      )}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-50 mt-2">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-sm text-gray-300">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-slate-700/50">
            <p className="text-xs text-gray-400 mb-3">Try asking:</p>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(action)}
                  className="w-full justify-start text-xs h-8 border-slate-600/50 hover:border-purple-500/50 hover:bg-purple-500/10 text-gray-300"
                >
                  <MessageCircle className="w-3 h-3 mr-2" />
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700/50">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="flex-1 bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
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