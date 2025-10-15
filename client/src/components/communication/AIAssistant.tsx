import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Brain, TrendingUp, DollarSign, Shield, Zap, ExternalLink, MessageSquare, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AIResponse {
  message: string;
  confidence: number;
  suggestions: string[];
  ctas: CTA[];
  relatedLinks: RelatedLink[];
}

interface CTA {
  id: string;
  text: string;
  action: 'navigate' | 'email' | 'phone' | 'external';
  target: string;
  variant: 'primary' | 'secondary' | 'outline';
  icon?: string;
}

interface RelatedLink {
  title: string;
  url: string;
  description: string;
}

export default function AIAssistant() {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string | AIResponse;
    timestamp: Date;
  }>>([
    {
      id: '1',
      type: 'ai',
      content: {
        message: "Welcome! I'm your NebulaX AI Assistant. I can help you with trading strategies, market analysis, account questions, and platform navigation. What would you like to know?",
        confidence: 100,
        suggestions: [
          "Show me market trends",
          "Help with trading strategies",
          "Account verification help",
          "Platform features overview"
        ],
        ctas: [
          {
            id: 'market',
            text: 'View Live Markets',
            action: 'navigate',
            target: '/markets',
            variant: 'primary',
            icon: 'TrendingUp'
          },
          {
            id: 'trade',
            text: 'Start Trading',
            action: 'navigate',
            target: '/trading',
            variant: 'secondary',
            icon: 'DollarSign'
          },
          {
            id: 'support',
            text: 'Contact Support',
            action: 'email',
            target: 'support@nebulaxexchange.io',
            variant: 'outline',
            icon: 'Mail'
          }
        ],
        relatedLinks: [
          {
            title: "Trading Guide",
            url: "/education",
            description: "Learn professional trading strategies"
          },
          {
            title: "API Documentation", 
            url: "/developers",
            description: "Integrate with NebulaX APIs"
          }
        ]
      },
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
  }, [conversation]);

  const aiQueryMutation = useMutation({
    mutationFn: async (userQuery: string) => {
      return apiRequest('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ query: userQuery })
      });
    },
    onSuccess: (response: AIResponse) => {
      setConversation(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      }]);
    },
    onError: (error: any) => {
      // Fallback AI response for demo
      const fallbackResponse: AIResponse = {
        message: generateFallbackResponse(query),
        confidence: 85,
        suggestions: generateSuggestions(query),
        ctas: generateCTAs(query),
        relatedLinks: [
          {
            title: "Help Center",
            url: "/support",
            description: "Find answers to common questions"
          }
        ]
      };

      setConversation(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: fallbackResponse,
        timestamp: new Date()
      }]);
    }
  });

  const handleSendQuery = () => {
    if (!query.trim()) return;

    // Add user message
    setConversation(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    }]);

    aiQueryMutation.mutate(query);
    setQuery('');
  };

  const handleCTAClick = (cta: CTA) => {
    switch (cta.action) {
      case 'navigate':
        window.location.href = cta.target;
        break;
      case 'email':
        window.location.href = `mailto:${cta.target}`;
        break;
      case 'phone':
        window.location.href = `tel:${cta.target}`;
        break;
      case 'external':
        window.open(cta.target, '_blank');
        break;
    }
  };

  const generateFallbackResponse = (userQuery: string): string => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('trading') || query.includes('trade')) {
      return "For trading assistance, I recommend checking our live markets and starting with small positions. Our trading platform offers limit orders, stop losses, and advanced charting tools.";
    }
    
    if (query.includes('price') || query.includes('market')) {
      return "Current market conditions show active trading across all major pairs. You can view real-time prices, set price alerts, and analyze trends on our markets page.";
    }
    
    if (query.includes('account') || query.includes('verification')) {
      return "For account-related questions, our accounts team can help with verification, limits, and security settings. Contact accounts@nebulaxexchange.io for personalized assistance.";
    }
    
    return "I can help you with trading strategies, market analysis, account management, and platform features. Feel free to ask specific questions or use the suggested actions below.";
  };

  const generateSuggestions = (userQuery: string): string[] => {
    return [
      "How do I set up price alerts?",
      "What are the trading fees?",
      "How to verify my account?",
      "Show me advanced trading features"
    ];
  };

  const generateCTAs = (userQuery: string): CTA[] => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('trading')) {
      return [
        {
          id: 'trade-now',
          text: 'Start Trading Now',
          action: 'navigate',
          target: '/trading',
          variant: 'primary',
          icon: 'DollarSign'
        },
        {
          id: 'trading-guide',
          text: 'Trading Guide',
          action: 'navigate',
          target: '/education',
          variant: 'secondary'
        }
      ];
    }
    
    return [
      {
        id: 'contact-support',
        text: 'Contact Support',
        action: 'email',
        target: 'support@nebulaxexchange.io',
        variant: 'primary',
        icon: 'Mail'
      },
      {
        id: 'live-chat',
        text: 'Live Chat',
        action: 'navigate',
        target: '/chat',
        variant: 'secondary',
        icon: 'MessageSquare'
      }
    ];
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      TrendingUp: <TrendingUp className="w-4 h-4" />,
      DollarSign: <DollarSign className="w-4 h-4" />,
      Mail: <Mail className="w-4 h-4" />,
      MessageSquare: <MessageSquare className="w-4 h-4" />,
      Phone: <Phone className="w-4 h-4" />,
      Shield: <Shield className="w-4 h-4" />
    };
    return icons[iconName] || <Zap className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <span>NebulaX AI Assistant</span>
            <Badge className="bg-green-500/20 text-green-600">Online</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
              <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
              <TabsTrigger value="help">Smart Help</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto space-y-4 p-4 border rounded-lg bg-muted/20">
                {conversation.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-card border'
                      }`}
                    >
                      {typeof message.content === 'string' ? (
                        <p className="text-sm">{message.content}</p>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm">{message.content.message}</p>
                          
                          {/* Confidence Score */}
                          <div className="flex items-center space-x-2">
                            <div className="text-xs text-muted-foreground">Confidence:</div>
                            <Badge variant="outline">{message.content.confidence}%</Badge>
                          </div>

                          {/* CTAs */}
                          {message.content.ctas.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-muted-foreground">Quick Actions:</div>
                              <div className="flex flex-wrap gap-2">
                                {message.content.ctas.map((cta) => (
                                  <Button
                                    key={cta.id}
                                    size="sm"
                                    variant={cta.variant as any}
                                    onClick={() => handleCTAClick(cta)}
                                    className="h-8 text-xs"
                                  >
                                    {cta.icon && getIcon(cta.icon)}
                                    {cta.text}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Related Links */}
                          {message.content.relatedLinks.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-muted-foreground">Related:</div>
                              {message.content.relatedLinks.map((link, index) => (
                                <a
                                  key={index}
                                  href={link.url}
                                  className="block p-2 border rounded text-xs hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium">{link.title}</div>
                                      <div className="text-muted-foreground">{link.description}</div>
                                    </div>
                                    <ExternalLink className="w-3 h-3" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Suggestions */}
                          {message.content.suggestions.length > 0 && (
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-muted-foreground">Try asking:</div>
                              <div className="space-y-1">
                                {message.content.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setQuery(suggestion)}
                                    className="h-auto p-2 text-xs text-left justify-start w-full"
                                  >
                                    "{suggestion}"
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything about NebulaX trading..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendQuery}
                  disabled={aiQueryMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Bot className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium">Market Sentiment</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Current market shows bullish sentiment across major assets.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => window.location.href = '/market-sentiment'}>
                      View Full Analysis
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <h3 className="font-medium">Trading Opportunities</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      AI identified 3 potential trading opportunities today.
                    </p>
                    <Button size="sm" variant="outline" onClick={() => window.location.href = '/recommendations'}>
                      View Recommendations
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="help" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => window.location.href = 'mailto:support@nebulaxexchange.io?subject=AI Assistant Help Request'}
                >
                  <Mail className="w-5 h-5 mr-3 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Email Support Team</div>
                    <div className="text-sm text-muted-foreground">Get personalized help via email</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => window.location.href = '/education'}
                >
                  <Brain className="w-5 h-5 mr-3 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Trading Education</div>
                    <div className="text-sm text-muted-foreground">Learn from comprehensive guides</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start"
                  onClick={() => window.location.href = 'mailto:developers@nebulaxexchange.io?subject=API Integration Question'}
                >
                  <Bot className="w-5 h-5 mr-3 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Developer Support</div>
                    <div className="text-sm text-muted-foreground">API and integration assistance</div>
                  </div>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}