import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  MessageSquare, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Brain,
  Zap,
  Bot,
  User,
  Settings,
  Languages,
  Headphones,
  Eye,
  Command,
  Keyboard,
  Search,
  TrendingUp,
  DollarSign,
  Shield,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe
} from "lucide-react";

export default function NaturalLanguageInterface() {
  const [activeTab, setActiveTab] = useState("voice-commands");
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");

  const voiceCommands = [
    {
      category: "Trading Operations",
      commands: [
        {
          phrase: "Buy 0.5 Bitcoin at market price",
          action: "Execute market buy order",
          confidence: 98,
          result: "Order placed successfully",
          execution: "2.3s"
        },
        {
          phrase: "Show me ETH/USDT order book",
          action: "Display order book",
          confidence: 95,
          result: "Order book displayed",
          execution: "0.8s"
        },
        {
          phrase: "Set stop loss at 45,000 for my BTC position",
          action: "Create stop-loss order",
          confidence: 92,
          result: "Stop-loss order created",
          execution: "1.2s"
        },
        {
          phrase: "What's my portfolio balance?",
          action: "Retrieve portfolio data",
          confidence: 99,
          result: "Portfolio balance: $247,583",
          execution: "0.5s"
        }
      ]
    },
    {
      category: "Analytics & Reporting",
      commands: [
        {
          phrase: "Show me trading volume for the last week",
          action: "Generate volume report",
          confidence: 89,
          result: "Weekly volume: $2.4M",
          execution: "1.8s"
        },
        {
          phrase: "Generate AML compliance report",
          action: "Create compliance report",
          confidence: 94,
          result: "Report generated and sent",
          execution: "3.4s"
        },
        {
          phrase: "Alert me when Bitcoin drops below 42,000",
          action: "Set price alert",
          confidence: 96,
          result: "Price alert configured",
          execution: "0.9s"
        }
      ]
    },
    {
      category: "User Management",
      commands: [
        {
          phrase: "Approve KYC for user ID 12345",
          action: "Update KYC status",
          confidence: 91,
          result: "KYC status updated",
          execution: "2.1s"
        },
        {
          phrase: "Block user transactions for suspicious activity",
          action: "Apply transaction block",
          confidence: 88,
          result: "User account restricted",
          execution: "1.5s"
        }
      ]
    }
  ];

  const nlpCapabilities = [
    {
      feature: "Multi-Language Support",
      description: "Supports 25+ languages with real-time translation",
      languages: ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Arabic"],
      accuracy: "96.4%",
      status: "Active"
    },
    {
      feature: "Context Understanding",
      description: "Maintains conversation context across multiple exchanges",
      capabilities: ["Intent Recognition", "Entity Extraction", "Sentiment Analysis", "Command Chaining"],
      accuracy: "94.7%",
      status: "Active"
    },
    {
      feature: "Voice Recognition",
      description: "Advanced speech-to-text with speaker identification",
      features: ["Noise Cancellation", "Accent Adaptation", "Real-time Processing", "Speaker Verification"],
      accuracy: "97.2%",
      status: "Active"
    },
    {
      feature: "Intelligent Responses",
      description: "AI-powered responses with market context awareness",
      intelligence: ["Market Data Integration", "Risk Assessment", "Regulatory Compliance", "Predictive Analytics"],
      accuracy: "92.8%",
      status: "Active"
    }
  ];

  const conversationHistory = [
    {
      type: "user",
      content: "What's the current price of Bitcoin?",
      timestamp: "10:34 AM",
      method: "voice"
    },
    {
      type: "assistant",
      content: "Bitcoin is currently trading at $47,234.56, up 2.3% in the last 24 hours.",
      timestamp: "10:34 AM",
      confidence: 98
    },
    {
      type: "user",
      content: "Buy 0.1 BTC at current market price",
      timestamp: "10:35 AM",
      method: "text"
    },
    {
      type: "assistant",
      content: "I've placed a market buy order for 0.1 BTC at $47,234.56. Order ID: #BTC789456. The order has been executed successfully.",
      timestamp: "10:35 AM",
      confidence: 95,
      action: "order_executed"
    },
    {
      type: "user",
      content: "Show me my portfolio performance this month",
      timestamp: "10:36 AM",
      method: "voice"
    },
    {
      type: "assistant",
      content: "Your portfolio is up 18.7% this month with a total value of $247,583. Top performer: SOL (+45.2%). Would you like a detailed breakdown?",
      timestamp: "10:36 AM",
      confidence: 92,
      action: "data_retrieved"
    }
  ];

  const supportedCommands = {
    trading: [
      "Buy/Sell orders with quantity and price",
      "Portfolio balance and performance queries",
      "Order book and market data requests",
      "Stop-loss and take-profit order creation",
      "Trading history and analytics"
    ],
    analytics: [
      "Generate performance reports",
      "Risk assessment and VaR calculations",
      "Compliance report generation",
      "Market analysis and predictions",
      "User behavior analytics"
    ],
    management: [
      "User account management",
      "KYC/AML status updates",
      "Transaction monitoring and alerts",
      "System health and performance",
      "Configuration changes"
    ]
  };

  const languageOptions = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
    { code: "fr-FR", name: "French", flag: "🇫🇷" },
    { code: "de-DE", name: "German", flag: "🇩🇪" },
    { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
    { code: "ja-JP", name: "Japanese", flag: "🇯🇵" },
    { code: "ko-KR", name: "Korean", flag: "🇰🇷" }
  ];

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop speech recognition
  };

  const handleSendMessage = () => {
    if (currentInput.trim()) {
      // Process the natural language command
      setCurrentInput("");
    }
  };

  const getMethodIcon = (method: string) => {
    return method === "voice" ? <Mic className="h-3 w-3" /> : <Keyboard className="h-3 w-3" />;
  };

  return (
    <div className="space-y-6">
      {/* NLP Interface Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Commands Processed</p>
                <p className="text-2xl font-bold text-white">2,847</p>
                <p className="text-xs text-green-400">96.4% success rate</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Languages Supported</p>
                <p className="text-2xl font-bold text-white">25+</p>
                <p className="text-xs text-blue-400">Real-time translation</p>
              </div>
              <Languages className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Voice Accuracy</p>
                <p className="text-2xl font-bold text-white">97.2%</p>
                <p className="text-xs text-green-400">Industry leading</p>
              </div>
              <Mic className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Response Time</p>
                <p className="text-2xl font-bold text-white">1.2s</p>
                <p className="text-xs text-yellow-400">Average</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="voice-commands">Voice Commands</TabsTrigger>
          <TabsTrigger value="conversation">Live Conversation</TabsTrigger>
          <TabsTrigger value="capabilities">NLP Capabilities</TabsTrigger>
          <TabsTrigger value="settings">Language Settings</TabsTrigger>
        </TabsList>

        {/* Voice Commands */}
        <TabsContent value="voice-commands">
          <div className="space-y-6">
            {voiceCommands.map((category, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Command className="h-5 w-5" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.commands.map((command, cmdIndex) => (
                      <div key={cmdIndex} className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Mic className="h-4 w-4 text-purple-400" />
                            <span className="text-white font-medium">"{command.phrase}"</span>
                          </div>
                          <Badge className="bg-green-500">
                            {command.confidence}% confidence
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Action</p>
                            <p className="text-blue-400">{command.action}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Result</p>
                            <p className="text-green-400">{command.result}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Execution Time</p>
                            <p className="text-yellow-400">{command.execution}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Supported Command Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(supportedCommands).map(([category, commands]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="text-white font-medium capitalize">{category}</h4>
                      <div className="space-y-2">
                        {commands.map((command, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                            <span className="text-gray-300">{command}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Live Conversation */}
        <TabsContent value="conversation">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Natural Language Interface
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={isListening ? "default" : "outline"}
                      onClick={handleVoiceToggle}
                      className={isListening ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-96 bg-gray-800/50 rounded-lg p-4 overflow-y-auto space-y-3">
                  {conversationHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-100'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {message.type === 'user' ? (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {message.method && getMethodIcon(message.method)}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Bot className="h-3 w-3" />
                              {message.confidence && (
                                <Badge variant="outline" className="text-xs">
                                  {message.confidence}%
                                </Badge>
                              )}
                            </div>
                          )}
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.action && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {message.action.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your command or question..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-gray-800/50"
                  />
                  <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Show market overview
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Check portfolio balance
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Generate compliance report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Find user by ID
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Show risk alerts
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Trading hours status
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NLP Capabilities */}
        <TabsContent value="capabilities">
          <div className="space-y-6">
            {nlpCapabilities.map((capability, index) => (
              <Card key={index} className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {capability.feature}
                    </div>
                    <Badge className="bg-green-500">{capability.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400">{capability.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Accuracy Rate</span>
                    <Badge className="bg-purple-500">{capability.accuracy}</Badge>
                  </div>

                  {capability.languages && (
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">Supported Languages:</p>
                      <div className="flex flex-wrap gap-2">
                        {capability.languages.map((lang, idx) => (
                          <Badge key={idx} variant="outline" className="text-blue-400 border-blue-400">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {capability.capabilities && (
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">Capabilities:</p>
                      <div className="flex flex-wrap gap-2">
                        {capability.capabilities.map((cap, idx) => (
                          <Badge key={idx} variant="outline" className="text-green-400 border-green-400">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {capability.features && (
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {capability.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-yellow-400 border-yellow-400">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {capability.intelligence && (
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">Intelligence Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {capability.intelligence.map((intel, idx) => (
                          <Badge key={idx} variant="outline" className="text-purple-400 border-purple-400">
                            {intel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Language Settings */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Primary Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Voice Recognition</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto Translation</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Context Preservation</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Voice Responses</Label>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Response Confidence Threshold</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">80%</span>
                    <Progress value={90} className="flex-1" />
                    <span className="text-sm text-gray-400">100%</span>
                  </div>
                  <p className="text-xs text-gray-500">Current: 90%</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Command Timeout (seconds)</Label>
                  <Input defaultValue="30" className="bg-gray-800/50" />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Voice Sensitivity</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Low</span>
                    <Progress value={75} className="flex-1" />
                    <span className="text-sm text-gray-400">High</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Debug Mode</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Command Logging</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Performance Metrics</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}