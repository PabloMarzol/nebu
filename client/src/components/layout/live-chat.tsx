import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  User,
  Bot,
  Clock,
  CheckCircle,
  Users,
  Phone,
  Mail,
  HelpCircle
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "agent" | "system";
  message: string;
  timestamp: string;
  agentName?: string;
  status?: "sent" | "delivered" | "read";
}

interface SupportAgent {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "busy" | "away";
  specialization: string;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState<"connecting" | "connected" | "ended">("connecting");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [location] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On homepage, delay showing the live chat for 10 seconds
    if (location === '/') {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 20000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [location]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "system",
      message: "Welcome to NebulaX Support! An agent will be with you shortly.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const supportAgent: SupportAgent = {
    id: "agent1",
    name: "Sarah Johnson",
    avatar: "SJ",
    status: "online",
    specialization: "Trading & Technical Support"
  };

  const quickActions = [
    "Account verification help",
    "Trading platform tutorial", 
    "Deposit/withdrawal assistance",
    "Security settings guide",
    "API access setup"
  ];

  useEffect(() => {
    if (isOpen && chatStatus === "connecting") {
      const timer = setTimeout(() => {
        setChatStatus("connected");
        const agentMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "agent",
          message: `Hi! I'm ${supportAgent.name}, your dedicated support specialist. How can I assist you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentName: supportAgent.name,
          status: "delivered"
        };
        setMessages(prev => [...prev, agentMessage]);
        if (isMinimized) {
          setUnreadCount(prev => prev + 1);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, chatStatus, isMinimized, supportAgent.name]);

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
          // Fallback: find any scrollable parent
          const parent = messagesEndRef.current?.parentElement;
          if (parent && (parent.style.overflow === 'auto' || parent.style.overflowY === 'auto' || parent.classList.contains('overflow-y-auto'))) {
            parent.scrollTop = parent.scrollHeight;
          }
        }
      });
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: currentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "I understand your concern. Let me help you with that right away.",
        "That's a great question! I'll walk you through the process step by step.",
        "I can definitely assist you with this. Let me check your account details.",
        "Thank you for reaching out. I'll make sure we resolve this quickly.",
        "I see what you're looking for. Here's what you need to do..."
      ];
      
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: supportAgent.name,
        status: "delivered"
      };
      
      setMessages(prev => [...prev, agentResponse]);
      if (isMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setCurrentMessage(action);
    setTimeout(sendMessage, 100);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setUnreadCount(0);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-400";
      case "busy": return "bg-yellow-400";
      case "away": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  if (!isVisible) {
    return null;
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg relative"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`glass border-purple-500/30 shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        <CardHeader className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {chatStatus === "connected" ? supportAgent.avatar : <Bot className="w-4 h-4" />}
                </div>
                {chatStatus === "connected" && (
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(supportAgent.status)}`} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {chatStatus === "connected" ? supportAgent.name : "NebulaX Support"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {chatStatus === "connecting" ? "Connecting..." : 
                   chatStatus === "connected" ? supportAgent.specialization : "Chat ended"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="w-8 h-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <button
                onClick={toggleChat}
                className="w-8 h-8 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/50 rounded cursor-pointer"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0 h-[420px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] ${
                      message.type === "user" 
                        ? "bg-purple-500 text-white" 
                        : message.type === "system"
                        ? "bg-blue-500/20 text-blue-400 text-center text-sm"
                        : "bg-slate-700 text-white"
                    } rounded-lg p-3 text-sm`}>
                      {message.type === "agent" && (
                        <div className="text-xs text-gray-300 mb-1">{message.agentName}</div>
                      )}
                      <div>{message.message}</div>
                      <div className={`text-xs mt-1 ${
                        message.type === "user" ? "text-purple-200" : "text-gray-400"
                      } flex items-center justify-between`}>
                        <span>{message.timestamp}</span>
                        {message.type === "user" && message.status && (
                          <div className="flex items-center space-x-1">
                            {message.status === "sent" && <Clock className="w-3 h-3" />}
                            {message.status === "delivered" && <CheckCircle className="w-3 h-3" />}
                            {message.status === "read" && <CheckCircle className="w-3 h-3 text-blue-400" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
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
                
                <div ref={messagesEndRef} />
              </div>

              {messages.length <= 2 && (
                <div className="p-4 border-t border-border/50">
                  <div className="text-xs text-muted-foreground mb-2">Quick help topics:</div>
                  <div className="space-y-1">
                    {quickActions.slice(0, 3).map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="w-full text-left justify-start text-xs h-8"
                      >
                        <HelpCircle className="w-3 h-3 mr-2" />
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 border-t border-border/50">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!currentMessage.trim()}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>24/7 Support</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>+420 123 456 789</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Secure Chat
                  </Badge>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}