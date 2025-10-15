import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  TrendingUp, 
  Target, 
  Shield, 
  Settings, 
  BarChart3,
  MessageSquare,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Filter,
  Search,
  Download,
  Bell,
  Activity,
  Zap,
  Building
} from "lucide-react";

// Import existing components
import { CustomerManagement } from "./CustomerManagement";
import { SalesPipeline } from "./SalesPipeline";
import { SupportTicketing } from "./SupportTicketing";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

interface WorkspaceData {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  notifications: number;
  systems: string[];
  metrics: {
    primary: { label: string; value: string | number; trend?: 'up' | 'down' };
    secondary: { label: string; value: string | number }[];
  };
}

const workspaces: WorkspaceData[] = [
  {
    id: "customer-ops",
    name: "Customer Operations",
    icon: Users,
    description: "Customer lifecycle management and support",
    color: "bg-blue-500",
    notifications: 12,
    systems: ["Customer Management", "Support Ticketing", "Onboarding & KYC", "Account Management"],
    metrics: {
      primary: { label: "Active Customers", value: "15,420", trend: "up" },
      secondary: [
        { label: "New This Month", value: "1,250" },
        { label: "Support Tickets", value: "342" },
        { label: "Avg Response Time", value: "2.4h" }
      ]
    }
  },
  {
    id: "sales-revenue",
    name: "Sales & Revenue",
    icon: TrendingUp,
    description: "Sales pipeline and revenue operations",
    color: "bg-green-500",
    notifications: 8,
    systems: ["Sales Pipeline", "Lead Management", "Contract Management", "Revenue Analytics"],
    metrics: {
      primary: { label: "Monthly Revenue", value: "$2.45M", trend: "up" },
      secondary: [
        { label: "Open Deals", value: "145" },
        { label: "Conversion Rate", value: "12.8%" },
        { label: "Pipeline Value", value: "$8.2M" }
      ]
    }
  },
  {
    id: "marketing-growth",
    name: "Marketing & Growth",
    icon: Target,
    description: "Marketing campaigns and growth initiatives",
    color: "bg-purple-500",
    notifications: 5,
    systems: ["Campaign Management", "Email Marketing", "Social Media", "Content Management"],
    metrics: {
      primary: { label: "Lead Generation", value: "2,840", trend: "up" },
      secondary: [
        { label: "Campaign ROI", value: "18.5%" },
        { label: "Email Open Rate", value: "24.2%" },
        { label: "Social Reach", value: "45K" }
      ]
    }
  },
  {
    id: "compliance-risk",
    name: "Compliance & Risk",
    icon: Shield,
    description: "Regulatory compliance and risk management",
    color: "bg-red-500",
    notifications: 15,
    systems: ["Regulatory Compliance", "Risk Assessment", "Legal Documentation", "Audit Management"],
    metrics: {
      primary: { label: "Compliance Score", value: "98.5%", trend: "up" },
      secondary: [
        { label: "Pending Reviews", value: "23" },
        { label: "Risk Events", value: "3" },
        { label: "Audit Status", value: "Green" }
      ]
    }
  },
  {
    id: "exchange-ops",
    name: "Exchange Operations",
    icon: Settings,
    description: "Exchange-specific operations and monitoring",
    color: "bg-orange-500",
    notifications: 7,
    systems: ["Liquidity Management", "Treasury Operations", "Institutional Services", "Operational Risk"],
    metrics: {
      primary: { label: "System Uptime", value: "99.98%", trend: "up" },
      secondary: [
        { label: "Liquidity Providers", value: "12" },
        { label: "Treasury Balance", value: "$145M" },
        { label: "Active Incidents", value: "1" }
      ]
    }
  },
  {
    id: "analytics-intelligence",
    name: "Analytics & Intelligence",
    icon: BarChart3,
    description: "Business intelligence and strategic insights",
    color: "bg-indigo-500",
    notifications: 3,
    systems: ["Customer Analytics", "Business Performance", "Predictive Analytics", "Executive Dashboards"],
    metrics: {
      primary: { label: "Insights Generated", value: "847", trend: "up" },
      secondary: [
        { label: "Model Accuracy", value: "94.2%" },
        { label: "Reports Generated", value: "156" },
        { label: "Data Quality", value: "99.1%" }
      ]
    }
  }
];

export function UnifiedCRMWorkspaces() {
  const [activeWorkspace, setActiveWorkspace] = useState("customer-ops");
  const [quickActions, setQuickActions] = useState([
    { id: "new-ticket", label: "New Support Ticket", icon: MessageSquare, urgent: true },
    { id: "customer-360", label: "Customer 360 View", icon: Users, urgent: false },
    { id: "revenue-report", label: "Revenue Report", icon: DollarSign, urgent: false },
    { id: "compliance-check", label: "Compliance Check", icon: Shield, urgent: true }
  ]);

  const currentWorkspace = workspaces.find(w => w.id === activeWorkspace);

  const renderWorkspaceContent = () => {
    switch (activeWorkspace) {
      case "customer-ops":
        return <CustomerOperationsWorkspace />;
      case "sales-revenue":
        return <SalesRevenueWorkspace />;
      case "marketing-growth":
        return <MarketingGrowthWorkspace />;
      case "compliance-risk":
        return <ComplianceRiskWorkspace />;
      case "exchange-ops":
        return <ExchangeOperationsWorkspace />;
      case "analytics-intelligence":
        return <AnalyticsIntelligenceWorkspace />;
      default:
        return <CustomerOperationsWorkspace />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">CRM Workspaces</h1>
              <p className="text-gray-400">Unified customer relationship management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-gray-600">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1">
                  {workspaces.reduce((sum, w) => sum + w.notifications, 0)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Navigation */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex space-x-2 overflow-x-auto">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            const isActive = activeWorkspace === workspace.id;
            return (
              <Button
                key={workspace.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => setActiveWorkspace(workspace.id)}
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  isActive ? workspace.color : "hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{workspace.name}</span>
                {workspace.notifications > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {workspace.notifications}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Workspace Overview */}
      {currentWorkspace && (
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{currentWorkspace.metrics.primary.label}</p>
                    <p className="text-2xl font-bold">{currentWorkspace.metrics.primary.value}</p>
                  </div>
                  {currentWorkspace.metrics.primary.trend === 'up' && (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  )}
                </div>
              </CardContent>
            </Card>
            {currentWorkspace.metrics.secondary.map((metric, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">{metric.label}</p>
                  <p className="text-xl font-semibold">{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <Button variant="ghost" size="sm" className="text-gray-400">
            View All
          </Button>
        </div>
        <div className="flex space-x-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className={`flex items-center space-x-2 ${
                  action.urgent ? "border-red-500 text-red-400" : "border-gray-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
                {action.urgent && (
                  <AlertCircle className="w-3 h-3 text-red-400" />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {renderWorkspaceContent()}
      </div>
    </div>
  );
}

// Workspace Components
function CustomerOperationsWorkspace() {
  return (
    <div>
      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-6">
          <TabsTrigger value="customers">Customer Management</TabsTrigger>
          <TabsTrigger value="support">Support Ticketing</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding & KYC</TabsTrigger>
          <TabsTrigger value="accounts">Account Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers">
          <CustomerManagement />
        </TabsContent>
        
        <TabsContent value="support">
          <SupportTicketing />
        </TabsContent>
        
        <TabsContent value="onboarding">
          <OnboardingKYCComponent />
        </TabsContent>
        
        <TabsContent value="accounts">
          <AccountManagementComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SalesRevenueWorkspace() {
  return (
    <div>
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-6">
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="leads">Lead Management</TabsTrigger>
          <TabsTrigger value="contracts">Contract Management</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipeline">
          <SalesPipeline />
        </TabsContent>
        
        <TabsContent value="leads">
          <LeadManagementComponent />
        </TabsContent>
        
        <TabsContent value="contracts">
          <ContractManagementComponent />
        </TabsContent>
        
        <TabsContent value="revenue">
          <RevenueAnalyticsComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MarketingGrowthWorkspace() {
  return (
    <div>
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-6">
          <TabsTrigger value="campaigns">Campaign Management</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns">
          <CampaignManagementComponent />
        </TabsContent>
        
        <TabsContent value="email">
          <EmailMarketingComponent />
        </TabsContent>
        
        <TabsContent value="social">
          <SocialMediaComponent />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentManagementComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ComplianceRiskWorkspace() {
  return (
    <div>
      <Tabs defaultValue="compliance" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-6">
          <TabsTrigger value="compliance">Regulatory Compliance</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="legal">Legal Documentation</TabsTrigger>
          <TabsTrigger value="audit">Audit Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compliance">
          <RegulatoryComplianceComponent />
        </TabsContent>
        
        <TabsContent value="risk">
          <RiskAssessmentComponent />
        </TabsContent>
        
        <TabsContent value="legal">
          <LegalDocumentationComponent />
        </TabsContent>
        
        <TabsContent value="audit">
          <AuditManagementComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ExchangeOperationsWorkspace() {
  return (
    <div>
      <Tabs defaultValue="liquidity" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-6">
          <TabsTrigger value="liquidity">Liquidity Management</TabsTrigger>
          <TabsTrigger value="treasury">Treasury Operations</TabsTrigger>
          <TabsTrigger value="institutional">Institutional Services</TabsTrigger>
          <TabsTrigger value="operational">Operational Risk</TabsTrigger>
        </TabsList>
        
        <TabsContent value="liquidity">
          <LiquidityManagementComponent />
        </TabsContent>
        
        <TabsContent value="treasury">
          <TreasuryOperationsComponent />
        </TabsContent>
        
        <TabsContent value="institutional">
          <InstitutionalServicesComponent />
        </TabsContent>
        
        <TabsContent value="operational">
          <OperationalRiskComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnalyticsIntelligenceWorkspace() {
  return (
    <div>
      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-6">
          <TabsTrigger value="customer">Customer Analytics</TabsTrigger>
          <TabsTrigger value="business">Business Performance</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="executive">Executive Dashboards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer">
          <CustomerAnalyticsComponent />
        </TabsContent>
        
        <TabsContent value="business">
          <AnalyticsDashboard />
        </TabsContent>
        
        <TabsContent value="predictive">
          <PredictiveAnalyticsComponent />
        </TabsContent>
        
        <TabsContent value="executive">
          <ExecutiveDashboardComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Placeholder components for new systems
function OnboardingKYCComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Onboarding & KYC Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">KYC verification pipeline and onboarding workflow management.</p>
      </CardContent>
    </Card>
  );
}

function AccountManagementComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Account Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Premium account management and relationship tracking.</p>
      </CardContent>
    </Card>
  );
}

function LeadManagementComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Lead Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Lead scoring, qualification, and conversion tracking.</p>
      </CardContent>
    </Card>
  );
}

function ContractManagementComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Contract Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Contract lifecycle management and pricing agreements.</p>
      </CardContent>
    </Card>
  );
}

function RevenueAnalyticsComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Revenue Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Revenue tracking, forecasting, and performance analysis.</p>
      </CardContent>
    </Card>
  );
}

function CampaignManagementComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Campaign Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Multi-channel campaign orchestration and optimization.</p>
      </CardContent>
    </Card>
  );
}

function EmailMarketingComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Email Marketing</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Automated email campaigns and marketing automation.</p>
      </CardContent>
    </Card>
  );
}

function SocialMediaComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Social Media Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Social media monitoring and community management.</p>
      </CardContent>
    </Card>
  );
}

function ContentManagementComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Content Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Content creation, distribution, and performance tracking.</p>
      </CardContent>
    </Card>
  );
}

function RegulatoryComplianceComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Regulatory Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">AML/KYC compliance monitoring and regulatory reporting.</p>
      </CardContent>
    </Card>
  );
}

function RiskAssessmentComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Customer risk scoring and fraud detection.</p>
      </CardContent>
    </Card>
  );
}

function LegalDocumentationComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Legal Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Legal document management and regulatory correspondence.</p>
      </CardContent>
    </Card>
  );
}

function AuditManagementComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Audit Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Audit trail management and compliance reporting.</p>
      </CardContent>
    </Card>
  );
}

function LiquidityManagementComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Liquidity Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Liquidity provider management and pool monitoring.</p>
      </CardContent>
    </Card>
  );
}

function TreasuryOperationsComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Treasury Operations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Treasury balance management and reconciliation.</p>
      </CardContent>
    </Card>
  );
}

function InstitutionalServicesComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Institutional Services</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Institutional client management and OTC services.</p>
      </CardContent>
    </Card>
  );
}

function OperationalRiskComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Operational Risk Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Operational risk monitoring and incident management.</p>
      </CardContent>
    </Card>
  );
}

function CustomerAnalyticsComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Customer Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Customer behavior analysis and lifetime value tracking.</p>
      </CardContent>
    </Card>
  );
}

function PredictiveAnalyticsComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Predictive Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Predictive modeling and forecasting capabilities.</p>
      </CardContent>
    </Card>
  );
}

function ExecutiveDashboardComponent() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Executive Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">Executive-level KPIs and strategic insights.</p>
      </CardContent>
    </Card>
  );
}