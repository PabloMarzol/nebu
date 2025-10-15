import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, User, Bot, Phone, Mail, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'support';
  timestamp: Date;
  type: 'text' | 'cta' | 'link';
  ctaAction?: string;
  linkUrl?: string;
}

export default function LiveChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to NebulaX! I\'m your AI assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    },
    {
      id: '2',
      content: 'Quick actions:',
      sender: 'assistant',
      timestamp: new Date(),
      type: 'cta'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          // Fallback: find any scrollable parent
          const parent = messagesEndRef.current?.parentElement;
          if (parent && (parent.style.overflow === 'auto' || parent.style.overflowY === 'auto' || parent.classList.contains('overflow-y-auto'))) {
            parent.scrollTop = parent.scrollHeight;
          }
        }
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "I can help you with trading, market analysis, or account questions. What would you like to know?",
          type: 'text' as const
        },
        {
          content: "Here are some helpful resources:",
          type: 'text' as const
        },
        {
          content: "View Live Markets",
          type: 'link' as const,
          linkUrl: '/markets'
        },
        {
          content: "Start Trading",
          type: 'cta' as const,
          ctaAction: 'start-trading'
        }
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'assistant',
        timestamp: new Date(),
        type: response.type,
        linkUrl: response.linkUrl,
        ctaAction: response.ctaAction
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { label: "📈 Market Analysis", action: "market-analysis" },
    { label: "💰 Start Trading", action: "start-trading" },
    { label: "📞 Contact Support", action: "contact-support" },
    { label: "📧 Email Updates", action: "email-updates" },
    { label: "📱 SMS Alerts", action: "sms-alerts" }
  ];

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      "market-analysis": "I'd like to see market analysis",
      "start-trading": "Help me start trading",
      "contact-support": "I need to contact support",
      "email-updates": "Set up email notifications",
      "sms-alerts": "Configure SMS alerts"
    };

    setInputValue(actionMessages[action] || action);
  };

  const handleCTAClick = (action: string) => {
    switch (action) {
      case 'start-trading':
        window.location.href = '/trading';
        break;
      case 'contact-support':
        window.location.href = 'mailto:support@nebulaxexchange.io';
        break;
      case 'market-analysis':
        window.location.href = '/markets';
        break;
      default:
        console.log('CTA clicked:', action);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white animate-bounce">
          Live
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px]">
      <Card className="w-full h-full flex flex-col shadow-2xl border-purple-500/20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">NebulaX Assistant</h3>
                <p className="text-xs opacity-90">Online • Instant replies</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 text-sm",
                    message.sender === 'user'
                      ? "bg-purple-600 text-white"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.type === 'text' && <p>{message.content}</p>}
                  
                  {message.type === 'cta' && message.sender === 'assistant' && (
                    <div className="space-y-2">
                      <p>{message.content}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {quickActions.map((action) => (
                          <Button
                            key={action.action}
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickAction(action.action)}
                            className="text-xs"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.type === 'link' && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.location.href = message.linkUrl!}
                    >
                      {message.content} →
                    </Button>
                  )}
                  
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}