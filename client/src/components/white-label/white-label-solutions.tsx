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
  Package, 
  Rocket, 
  Settings, 
  Globe, 
  Palette,
  Code,
  Shield,
  Zap,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Server,
  Database,
  Cloud,
  Monitor
} from "lucide-react";

export default function WhiteLabelSolutions() {
  const [activeTab, setActiveTab] = useState("deployment-wizard");
  const [selectedTemplate, setSelectedTemplate] = useState("enterprise");
  const [deploymentStatus, setDeploymentStatus] = useState("ready");

  const whitelabelTemplates = [
    {
      id: "enterprise",
      name: "Enterprise Exchange",
      description: "Full-featured institutional cryptocurrency exchange",
      features: [
        "Advanced Trading Engine",
        "Institutional Dashboard", 
        "Compliance Suite",
        "API Management",
        "Multi-Asset Support",
        "Risk Management"
      ],
      pricing: "$50,000 setup + $5,000/month",
      deploymentTime: "2-3 weeks",
      customization: "High",
      support: "24/7 Premium",
      clients: 12
    },
    {
      id: "retail",
      name: "Retail Trading Platform",
      description: "User-friendly platform for retail cryptocurrency trading",
      features: [
        "Simple Trading Interface",
        "Mobile App Ready",
        "Basic KYC/AML",
        "Payment Integration",
        "Social Features",
        "Educational Content"
      ],
      pricing: "$25,000 setup + $2,500/month",
      deploymentTime: "1-2 weeks",
      customization: "Medium",
      support: "Business Hours",
      clients: 34
    },
    {
      id: "otc",
      name: "OTC Desk Solution",
      description: "Specialized over-the-counter trading platform",
      features: [
        "RFQ System",
        "Block Trading",
        "Institutional Tools",
        "Settlement Network",
        "Prime Brokerage",
        "Regulatory Reporting"
      ],
      pricing: "$75,000 setup + $7,500/month",
      deploymentTime: "3-4 weeks",
      customization: "Very High",
      support: "Dedicated Team",
      clients: 8
    },
    {
      id: "defi",
      name: "DeFi Integration Hub",
      description: "Decentralized finance aggregation platform",
      features: [
        "DEX Aggregation",
        "Yield Farming",
        "Liquidity Mining",
        "Cross-Chain Support",
        "Protocol Integration",
        "Smart Contract Tools"
      ],
      pricing: "$35,000 setup + $3,500/month",
      deploymentTime: "2-3 weeks",
      customization: "High",
      support: "Technical Support",
      clients: 18
    }
  ];

  const deploymentSteps = [
    {
      step: 1,
      title: "Configuration Setup",
      description: "Define platform parameters and business logic",
      duration: "2-3 days",
      status: "completed",
      tasks: [
        "Trading pairs configuration",
        "Fee structure setup",
        "KYC/AML parameters",
        "Regional compliance settings"
      ]
    },
    {
      step: 2,
      title: "Branding & Customization",
      description: "Apply custom branding and UI modifications",
      duration: "3-5 days",
      status: "completed",
      tasks: [
        "Logo and color scheme",
        "Custom domain setup",
        "UI/UX modifications",
        "Mobile app branding"
      ]
    },
    {
      step: 3,
      title: "Integration & Testing",
      description: "Connect external services and perform testing",
      duration: "5-7 days",
      status: "in-progress",
      tasks: [
        "Payment gateway integration",
        "KYC provider setup",
        "API testing and validation",
        "Security penetration testing"
      ]
    },
    {
      step: 4,
      title: "Deployment & Launch",
      description: "Deploy to production and go live",
      duration: "1-2 days",
      status: "pending",
      tasks: [
        "Production deployment",
        "DNS configuration",
        "SSL certificate setup",
        "Monitoring and alerts"
      ]
    }
  ];

  const activeDeployments = [
    {
      id: "WL-001",
      client: "Alpha Capital Exchange",
      template: "Enterprise Exchange",
      progress: 85,
      status: "Testing Phase",
      launchDate: "2025-07-15",
      features: ["Advanced Trading", "Institutional Dashboard", "Compliance Suite"],
      region: "Europe",
      revenue: "$5,000/month"
    },
    {
      id: "WL-002", 
      client: "Beta Trading Platform",
      template: "Retail Trading Platform",
      progress: 92,
      status: "Ready for Launch",
      launchDate: "2025-07-08",
      features: ["Simple Trading", "Mobile App", "Basic KYC"],
      region: "Asia Pacific",
      revenue: "$2,500/month"
    },
    {
      id: "WL-003",
      client: "Gamma OTC Desk",
      template: "OTC Desk Solution", 
      progress: 65,
      status: "Integration Phase",
      launchDate: "2025-07-25",
      features: ["RFQ System", "Block Trading", "Settlement"],
      region: "North America",
      revenue: "$7,500/month"
    }
  ];

  const customizationOptions = {
    branding: [
      {
        category: "Visual Identity",
        options: ["Custom Logo", "Color Scheme", "Typography", "Icon Set", "Background Images"]
      },
      {
        category: "UI Components",
        options: ["Trading Interface", "Dashboard Layout", "Navigation Menu", "Chart Styles", "Form Designs"]
      },
      {
        category: "Mobile App",
        options: ["App Icon", "Splash Screen", "Bottom Navigation", "Color Theme", "Push Notifications"]
      }
    ],
    features: [
      {
        category: "Trading Features",
        options: ["Order Types", "Chart Tools", "Market Data", "Social Trading", "Copy Trading", "News Feed"]
      },
      {
        category: "User Management",
        options: ["KYC Levels", "User Tiers", "Referral Program", "Loyalty System", "VIP Services"]
      },
      {
        category: "Compliance",
        options: ["AML Rules", "Geographic Restrictions", "Transaction Limits", "Reporting", "Audit Trails"]
      }
    ]
  };

  const revenueSharing = {
    totalRevenue: "$847,500",
    monthlyRecurring: "$67,500",
    setupFees: "$780,000",
    partnerShare: "$169,500",
    platformShare: "$678,000",
    growthRate: "+23.4%"
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': case 'ready for launch': return 'bg-green-500';
      case 'in-progress': case 'testing phase': case 'integration phase': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCustomizationLevel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'very high': return 'bg-purple-500';
      case 'high': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* White Label Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Deployments</p>
                <p className="text-2xl font-bold text-white">{activeDeployments.length}</p>
                <p className="text-xs text-green-400">+2 this month</p>
              </div>
              <Package className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">{revenueSharing.monthlyRecurring}</p>
                <p className="text-xs text-green-400">{revenueSharing.growthRate}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Templates Available</p>
                <p className="text-2xl font-bold text-white">{whitelabelTemplates.length}</p>
                <p className="text-xs text-blue-400">All categories</p>
              </div>
              <Layers className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Deploy Time</p>
                <p className="text-2xl font-bold text-white">2.5 weeks</p>
                <p className="text-xs text-yellow-400">Industry leading</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="deployment-wizard">Deployment Wizard</TabsTrigger>
          <TabsTrigger value="templates">Platform Templates</TabsTrigger>
          <TabsTrigger value="customization">Customization Studio</TabsTrigger>
          <TabsTrigger value="management">Deployment Management</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
        </TabsList>

        {/* Deployment Wizard */}
        <TabsContent value="deployment-wizard">
          <div className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Automated Deployment Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {deploymentSteps.map((step) => (
                  <div key={step.step} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.status === 'completed' ? 'bg-green-500' :
                      step.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      {step.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{step.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(step.status)}>
                            {step.status.replace('-', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-400">{step.duration}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                      <div className="space-y-1">
                        {step.tasks.map((task, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`h-3 w-3 ${
                              step.status === 'completed' ? 'text-green-400' : 'text-gray-400'
                            }`} />
                            <span className="text-gray-300">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
                <Play className="h-4 w-4 mr-2" />
                Start New Deployment
              </Button>
              <Button variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Monitor Current
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Platform Templates */}
        <TabsContent value="templates">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {whitelabelTemplates.map((template) => (
                <Card key={template.id} className="bg-black/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {template.name}
                      </div>
                      <Badge className={getCustomizationLevel(template.customization)}>
                        {template.customization} Customization
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">{template.description}</p>

                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm font-medium">Core Features:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {template.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Pricing</p>
                        <p className="text-green-400 font-semibold">{template.pricing}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Deploy Time</p>
                        <p className="text-white">{template.deploymentTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Support Level</p>
                        <p className="text-blue-400">{template.support}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Active Clients</p>
                        <p className="text-purple-400">{template.clients}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <Rocket className="h-4 w-4 mr-2" />
                        Deploy Template
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Customization Studio */}
        <TabsContent value="customization">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Branding Customization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customizationOptions.branding.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="text-white font-medium">{category.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.options.map((option, idx) => (
                          <Badge key={idx} variant="outline" className="text-purple-400 border-purple-400">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Palette className="h-4 w-4 mr-2" />
                    Open Branding Studio
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Feature Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customizationOptions.features.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="text-white font-medium">{category.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.options.map((option, idx) => (
                          <Badge key={idx} variant="outline" className="text-blue-400 border-blue-400">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Features
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Advanced Customization Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Code Editor</h4>
                    <p className="text-gray-400 text-sm">Custom CSS, JavaScript, and React components</p>
                    <Button size="sm" className="w-full">
                      <Code className="h-4 w-4 mr-2" />
                      Open IDE
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">API Configuration</h4>
                    <p className="text-gray-400 text-sm">Custom endpoints and webhook configurations</p>
                    <Button size="sm" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      API Builder
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Database Schema</h4>
                    <p className="text-gray-400 text-sm">Custom tables and data relationships</p>
                    <Button size="sm" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Schema Editor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Deployment Management */}
        <TabsContent value="management">
          <div className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Active White Label Deployments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeDeployments.map((deployment) => (
                    <div key={deployment.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{deployment.id}</Badge>
                          <span className="text-white font-medium">{deployment.client}</span>
                          <Badge className="bg-purple-500">{deployment.template}</Badge>
                        </div>
                        <Badge className={getStatusColor(deployment.status)}>
                          {deployment.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-400">Launch Date</p>
                          <p className="text-white">{deployment.launchDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Region</p>
                          <p className="text-blue-400">{deployment.region}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Monthly Revenue</p>
                          <p className="text-green-400">{deployment.revenue}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Progress</p>
                          <p className="text-white">{deployment.progress}%</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Deployment Progress</span>
                          <span className="text-white">{deployment.progress}%</span>
                        </div>
                        <Progress value={deployment.progress} className="h-2" />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {deployment.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-green-400 border-green-400">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Monitor
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Cloud className="h-4 w-4 mr-2" />
                          Deploy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Analytics */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                    <p className="text-green-400 font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">{revenueSharing.totalRevenue}</p>
                    <p className="text-xs text-green-400">All time</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="text-blue-400 font-medium">Monthly Recurring</p>
                    <p className="text-2xl font-bold text-white">{revenueSharing.monthlyRecurring}</p>
                    <p className="text-xs text-blue-400">{revenueSharing.growthRate}</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                    <p className="text-purple-400 font-medium">Setup Fees</p>
                    <p className="text-2xl font-bold text-white">{revenueSharing.setupFees}</p>
                    <p className="text-xs text-purple-400">One-time</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                    <p className="text-yellow-400 font-medium">Partner Share</p>
                    <p className="text-2xl font-bold text-white">{revenueSharing.partnerShare}</p>
                    <p className="text-xs text-yellow-400">20% revenue share</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Client Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeDeployments.map((deployment, index) => (
                    <div key={deployment.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                      <div>
                        <p className="text-white font-medium">{deployment.client}</p>
                        <p className="text-gray-400 text-sm">{deployment.template}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">{deployment.revenue}</p>
                        <p className="text-gray-400 text-xs">{deployment.region}</p>
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