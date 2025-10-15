import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadManagementCRM from "@/components/crm/LeadManagementCRM";
import InstitutionalClientCRM from "@/components/crm/InstitutionalClientCRM";
import RiskComplianceCRM from "@/components/crm/RiskComplianceCRM";
import RevenueOperationsCRM from "@/components/crm/RevenueOperationsCRM";
import MarketMakingCRM from "@/components/crm/MarketMakingCRM";
import {
  Users,
  Building2,
  Shield,
  DollarSign,
  TrendingUp,
  BarChart3,
  Handshake,
  Target,
  Activity,
  Globe,
  Star,
  Award,
  ArrowUpRight,
  Eye,
  Settings,
  RefreshCw
} from "lucide-react";

interface CRMSystem {
  id: string;
  name: string;
  description: string;
  category: "sales" | "client_management" | "compliance" | "operations" | "analytics" | "partnerships";
  status: "operational" | "development" | "planned";
  completion: number;
  users: number;
  lastUpdated: string;
  metrics: {
    label: string;
    value: string;
    trend: "up" | "down" | "stable";
  }[];
  icon: any;
}

export default function AdvancedCRMSystems() {
  const [activeSystem, setActiveSystem] = useState("overview");

  const crmSystems: CRMSystem[] = [
    {
      id: "lead_management",
      name: "Lead Management & Conversion",
      description: "Comprehensive lead tracking, scoring, and conversion optimization with AI-powered insights",
      category: "sales",
      status: "operational",
      completion: 100,
      users: 24,
      lastUpdated: "2025-01-30",
      metrics: [
        { label: "Conversion Rate", value: "15.2%", trend: "up" },
        { label: "Pipeline Value", value: "$2.55M", trend: "up" },
        { label: "Active Leads", value: "127", trend: "up" }
      ],
      icon: Users
    },
    {
      id: "institutional_clients",
      name: "Institutional Client Management",
      description: "Enterprise-grade client relationship management for institutional accounts and high-value clients",
      category: "client_management",
      status: "operational",
      completion: 100,
      users: 18,
      lastUpdated: "2025-01-30",
      metrics: [
        { label: "Total AUM", value: "$48.7B", trend: "up" },
        { label: "Active Clients", value: "156", trend: "up" },
        { label: "Avg Satisfaction", value: "94.2%", trend: "up" }
      ],
      icon: Building2
    },
    {
      id: "risk_compliance",
      name: "Risk & Compliance Monitoring",
      description: "Real-time risk assessment, compliance monitoring, and regulatory reporting automation",
      category: "compliance",
      status: "operational",
      completion: 100,
      users: 12,
      lastUpdated: "2025-01-30",
      metrics: [
        { label: "Compliance Score", value: "94%", trend: "up" },
        { label: "Open Alerts", value: "8", trend: "down" },
        { label: "Avg Resolution", value: "2.4d", trend: "down" }
      ],
      icon: Shield
    },
    {
      id: "revenue_operations",
      name: "Revenue Operations CRM",
      description: "Revenue tracking, forecasting, and operations optimization with predictive analytics",
      category: "operations",
      status: "development",
      completion: 75,
      users: 8,
      lastUpdated: "2025-01-29",
      metrics: [
        { label: "Monthly Revenue", value: "$1.2M", trend: "up" },
        { label: "Forecast Accuracy", value: "92%", trend: "stable" },
        { label: "Revenue Growth", value: "+18%", trend: "up" }
      ],
      icon: DollarSign
    },
    {
      id: "market_making",
      name: "Market Making & Liquidity CRM",
      description: "Liquidity provider management, market making operations, and trading relationship oversight",
      category: "operations",
      status: "development",
      completion: 80,
      users: 6,
      lastUpdated: "2025-01-29",
      metrics: [
        { label: "Active LPs", value: "34", trend: "up" },
        { label: "Liquidity Depth", value: "$125M", trend: "up" },
        { label: "Spread Efficiency", value: "98.5%", trend: "stable" }
      ],
      icon: TrendingUp
    },
    {
      id: "partner_management",
      name: "Partner Relationship Management",
      description: "Strategic partnership management, integration tracking, and partner performance analytics",
      category: "partnerships",
      status: "planned",
      completion: 40,
      users: 4,
      lastUpdated: "2025-01-28",
      metrics: [
        { label: "Active Partners", value: "28", trend: "up" },
        { label: "Integration Status", value: "85%", trend: "up" },
        { label: "Partner Revenue", value: "$450K", trend: "up" }
      ],
      icon: Handshake
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      operational: "bg-green-500 text-white",
      development: "bg-yellow-500 text-white",
      planned: "bg-blue-500 text-white"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      sales: "bg-purple-100 text-purple-800",
      client_management: "bg-blue-100 text-blue-800",
      compliance: "bg-red-100 text-red-800",
      operations: "bg-green-100 text-green-800",
      analytics: "bg-orange-100 text-orange-800",
      partnerships: "bg-pink-100 text-pink-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (trend === "down") return <ArrowUpRight className="w-4 h-4 text-red-500 rotate-180" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  };

  const totalUsers = crmSystems.reduce((sum, system) => sum + system.users, 0);
  const avgCompletion = crmSystems.reduce((sum, system) => sum + system.completion, 0) / crmSystems.length;
  const operationalSystems = crmSystems.filter(s => s.status === "operational").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced CRM Systems</h1>
          <p className="text-muted-foreground">Comprehensive specialized CRM modules for enterprise operations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Systems</p>
                <p className="text-2xl font-bold">{crmSystems.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-500">{operationalSystems} operational</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
                <p className="text-2xl font-bold">{avgCompletion.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+5%</span>
              <span className="text-muted-foreground ml-1">vs last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+1.2%</span>
              <span className="text-muted-foreground ml-1">uptime</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeSystem} onValueChange={setActiveSystem}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lead_management">Lead Mgmt</TabsTrigger>
          <TabsTrigger value="institutional_clients">Institutional</TabsTrigger>
          <TabsTrigger value="risk_compliance">Risk & Compliance</TabsTrigger>
          <TabsTrigger value="revenue_operations">Revenue Ops</TabsTrigger>
          <TabsTrigger value="market_making">Market Making</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {crmSystems.map((system) => {
              const Icon = system.icon;
              return (
                <Card key={system.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-xl">{system.name}</h3>
                            <p className="text-muted-foreground">{system.description}</p>
                          </div>
                          <Badge className={getCategoryColor(system.category)}>
                            {system.category.replace("_", " ")}
                          </Badge>
                          <Badge className={getStatusColor(system.status)}>
                            {system.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {system.metrics.map((metric, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">{metric.label}</p>
                                <p className="font-semibold">{metric.value}</p>
                              </div>
                              {getTrendIcon(metric.trend)}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Completion</p>
                              <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${system.completion}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{system.completion}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Active Users</p>
                              <p className="font-medium">{system.users}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Last Updated</p>
                              <p className="font-medium">{system.lastUpdated}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {system.status === "operational" && (
                              <Button 
                                onClick={() => setActiveSystem(system.id)}
                                disabled={!["lead_management", "institutional_clients", "risk_compliance", "revenue_operations", "market_making"].includes(system.id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Open System
                              </Button>
                            )}
                            <Button variant="outline">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="lead_management" className="space-y-4">
          <LeadManagementCRM />
        </TabsContent>

        <TabsContent value="institutional_clients" className="space-y-4">
          <InstitutionalClientCRM />
        </TabsContent>

        <TabsContent value="risk_compliance" className="space-y-4">
          <RiskComplianceCRM />
        </TabsContent>

        <TabsContent value="revenue_operations" className="space-y-4">
          <RevenueOperationsCRM />
        </TabsContent>

        <TabsContent value="market_making" className="space-y-4">
          <MarketMakingCRM />
        </TabsContent>
      </Tabs>

      {/* Quick Stats Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{operationalSystems}</p>
              <p className="text-sm text-muted-foreground">Operational Systems</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{totalUsers}</p>
              <p className="text-sm text-muted-foreground">Total Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">127</p>
              <p className="text-sm text-muted-foreground">Active Leads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">156</p>
              <p className="text-sm text-muted-foreground">Institutional Clients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">8</p>
              <p className="text-sm text-muted-foreground">Open Risk Alerts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">98.5%</p>
              <p className="text-sm text-muted-foreground">System Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}