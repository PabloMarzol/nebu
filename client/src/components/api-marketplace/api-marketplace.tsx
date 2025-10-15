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
import { 
  Code, 
  Zap, 
  Globe, 
  Star, 
  Download,
  Upload,
  Key,
  Settings,
  Play,
  BookOpen,
  Users,
  BarChart3,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Eye,
  GitBranch,
  Package,
  Database,
  Webhook
} from "lucide-react";

export default function APIMarketplace() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const apiServices = [
    {
      id: "api-001",
      name: "Advanced Trading Engine",
      description: "High-frequency trading API with order management and execution",
      category: "Trading",
      provider: "NebulaX Labs",
      version: "v2.1.0",
      pricing: "$0.001 per request",
      rating: 4.9,
      downloads: 15420,
      endpoints: 24,
      uptime: "99.9%",
      latency: "< 50ms",
      features: ["Order Management", "Portfolio Tracking", "Real-time Data", "Risk Management"],
      documentation: "Complete",
      status: "Active"
    },
    {
      id: "api-002", 
      name: "KYC/AML Verification Service",
      description: "Automated identity verification and compliance screening",
      category: "Compliance",
      provider: "Compliance Pro",
      version: "v1.8.3",
      pricing: "$2.50 per verification",
      rating: 4.7,
      downloads: 8934,
      endpoints: 12,
      uptime: "99.8%",
      latency: "< 2s",
      features: ["Document OCR", "Biometric Matching", "Sanctions Screening", "PEP Checking"],
      documentation: "Complete",
      status: "Active"
    },
    {
      id: "api-003",
      name: "Multi-Chain Wallet Service",
      description: "Cross-chain wallet management and transaction processing",
      category: "Blockchain",
      provider: "ChainLink Solutions",
      version: "v3.0.1", 
      pricing: "$0.50 per transaction",
      rating: 4.8,
      downloads: 12067,
      endpoints: 18,
      uptime: "99.7%",
      latency: "< 5s",
      features: ["Multi-chain Support", "HD Wallets", "Gas Optimization", "Smart Contracts"],
      documentation: "Complete",
      status: "Active"
    },
    {
      id: "api-004",
      name: "Market Data Aggregator",
      description: "Real-time and historical cryptocurrency market data",
      category: "Data",
      provider: "DataStream Inc", 
      version: "v2.3.0",
      pricing: "$0.0001 per request",
      rating: 4.6,
      downloads: 23451,
      endpoints: 32,
      uptime: "99.9%",
      latency: "< 100ms",
      features: ["Real-time Prices", "Historical Data", "Technical Indicators", "News Feeds"],
      documentation: "Complete",
      status: "Active"
    },
    {
      id: "api-005",
      name: "DeFi Liquidity Aggregator", 
      description: "Access to multiple DeFi protocols for optimal liquidity",
      category: "DeFi",
      provider: "DeFi Labs",
      version: "v1.5.2",
      pricing: "$0.25 per swap",
      rating: 4.5,
      downloads: 5678,
      endpoints: 16,
      uptime: "99.5%",
      latency: "< 3s",
      features: ["DEX Aggregation", "Yield Farming", "Liquidity Mining", "Slippage Protection"],
      documentation: "Beta",
      status: "Beta"
    },
    {
      id: "api-006",
      name: "Institutional Settlement",
      description: "Enterprise-grade settlement and custody services",
      category: "Institutional", 
      provider: "Settlement Corp",
      version: "v4.2.1",
      pricing: "Custom pricing",
      rating: 4.9,
      downloads: 234,
      endpoints: 28,
      uptime: "99.99%",
      latency: "< 10ms",
      features: ["Multi-sig Custody", "Atomic Settlement", "Regulatory Reporting", "SLA Guarantees"],
      documentation: "Enterprise",
      status: "Active"
    }
  ];

  const developerTools = [
    {
      name: "API Explorer",
      description: "Interactive API testing and documentation",
      icon: Code,
      features: ["Live Testing", "Code Generation", "Response Validation"]
    },
    {
      name: "SDK Generator",
      description: "Auto-generate SDKs in multiple languages",
      icon: Package,
      features: ["Python", "JavaScript", "Go", "Java", "PHP"]
    },
    {
      name: "Webhook Manager",
      description: "Real-time event notifications and webhooks",
      icon: Webhook,
      features: ["Event Filtering", "Retry Logic", "Signature Validation"]
    },
    {
      name: "Rate Limiter",
      description: "Advanced rate limiting and quota management",
      icon: Shield,
      features: ["Custom Limits", "Burst Protection", "Fair Usage"]
    }
  ];

  const apiUsageStats = {
    totalRequests: "2.4M",
    activeAPIs: apiServices.filter(api => api.status === "Active").length,
    averageLatency: "127ms",
    uptime: "99.8%",
    revenue: "$45,230",
    developers: 1247
  };

  const myAPIs = [
    {
      id: "my-api-001",
      name: "Custom Trading Bot",
      description: "Personal algorithmic trading API",
      version: "v1.0.0",
      status: "Development",
      lastUpdated: "2 days ago",
      requests: "1,234",
      revenue: "$127.50"
    },
    {
      id: "my-api-002",
      name: "Portfolio Analytics",
      description: "Advanced portfolio analysis and reporting",
      version: "v2.1.3",
      status: "Published",
      lastUpdated: "1 week ago", 
      requests: "5,678",
      revenue: "$892.30"
    }
  ];

  const filterAPIs = () => {
    return apiServices.filter(api => {
      const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           api.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || api.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': case 'published': return 'bg-green-500';
      case 'beta': case 'development': return 'bg-yellow-500';
      case 'deprecated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* API Marketplace Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-white">{apiUsageStats.totalRequests}</p>
                <p className="text-xs text-green-400">+12.4% this month</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active APIs</p>
                <p className="text-2xl font-bold text-white">{apiUsageStats.activeAPIs}</p>
                <p className="text-xs text-blue-400">All services operational</p>
              </div>
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Latency</p>
                <p className="text-2xl font-bold text-white">{apiUsageStats.averageLatency}</p>
                <p className="text-xs text-green-400">Within SLA</p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-white">{apiUsageStats.revenue}</p>
                <p className="text-xs text-purple-400">This month</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="marketplace">API Marketplace</TabsTrigger>
          <TabsTrigger value="my-apis">My APIs</TabsTrigger>
          <TabsTrigger value="developer-tools">Developer Tools</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        {/* API Marketplace */}
        <TabsContent value="marketplace">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search APIs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/30"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="institutional">Institutional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterAPIs().map((api) => (
                <Card key={api.id} className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        {api.name}
                      </div>
                      <Badge className={getStatusColor(api.status)}>
                        {api.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">{api.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{api.category}</Badge>
                        <Badge variant="outline">{api.version}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {getRatingStars(Math.floor(api.rating))}
                        <span className="text-sm text-gray-400 ml-1">({api.rating})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Provider</p>
                        <p className="text-white">{api.provider}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Pricing</p>
                        <p className="text-green-400">{api.pricing}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Downloads</p>
                        <p className="text-blue-400">{api.downloads.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Uptime</p>
                        <p className="text-green-400">{api.uptime}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {api.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                            {feature}
                          </Badge>
                        ))}
                        {api.features.length > 3 && (
                          <Badge variant="outline">+{api.features.length - 3} more</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                        <Key className="h-4 w-4 mr-2" />
                        Get API Key
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* My APIs */}
        <TabsContent value="my-apis">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">My API Services</h3>
              <Button className="bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4 mr-2" />
                Publish New API
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myAPIs.map((api) => (
                <Card key={api.id} className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {api.name}
                      </div>
                      <Badge className={getStatusColor(api.status)}>
                        {api.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">{api.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Version</p>
                        <p className="text-white">{api.version}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Last Updated</p>
                        <p className="text-white">{api.lastUpdated}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Requests</p>
                        <p className="text-blue-400">{api.requests}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Revenue</p>
                        <p className="text-green-400">{api.revenue}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Docs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Developer Tools */}
        <TabsContent value="developer-tools">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {developerTools.map((tool, index) => (
                <Card key={index} className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <tool.icon className="h-5 w-5" />
                      {tool.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-green-400 border-green-400">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" />
                      Launch Tool
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Developer Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Getting Started</h4>
                    <div className="space-y-2">
                      <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                        Quick Start Guide
                      </a>
                      <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                        Authentication
                      </a>
                      <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                        Rate Limits
                      </a>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">API Reference</h4>
                    <div className="space-y-2">
                      <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                        REST API
                      </a>
                      <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                        WebSocket API
                      </a>
                      <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                        FIX Protocol
                      </a>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Support</h4>
                    <div className="space-y-2">
                      <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                        Developer Forum
                      </a>
                      <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                        Support Tickets
                      </a>
                      <a href="#" className="block text-blue-400 hover:text-blue-300 text-sm">
                        Status Page
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Usage Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  API Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                    <p className="text-purple-400 font-medium">Total Requests</p>
                    <p className="text-2xl font-bold text-white">2.4M</p>
                    <p className="text-xs text-green-400">+15.2% vs last month</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="text-blue-400 font-medium">Active Developers</p>
                    <p className="text-2xl font-bold text-white">1,247</p>
                    <p className="text-xs text-green-400">+8.7% vs last month</p>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-green-400 font-medium">Revenue</p>
                    <p className="text-2xl font-bold text-white">$45.2K</p>
                    <p className="text-xs text-green-400">+23.1% vs last month</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                    <p className="text-yellow-400 font-medium">Avg Latency</p>
                    <p className="text-2xl font-bold text-white">127ms</p>
                    <p className="text-xs text-green-400">-12ms vs last month</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">System Health</span>
                    <span className="text-green-400">99.8% Uptime</span>
                  </div>
                  <Progress value={99.8} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top APIs by Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiServices.slice(0, 5).map((api, index) => (
                    <div key={api.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <p className="text-white text-sm font-medium">{api.name}</p>
                          <p className="text-gray-400 text-xs">{api.downloads.toLocaleString()} requests</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 text-sm">{api.uptime}</p>
                        <p className="text-gray-400 text-xs">{api.latency} latency</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}