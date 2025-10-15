import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  Globe,
  Award,
  Clock,
  Phone,
  Mail,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Settings,
  Star,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  Download,
  Filter,
  Search,
  MessageSquare,
  CreditCard,
  Wallet,
  TrendingDown,
  Activity,
  UserCheck,
  Lock,
  Unlock,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface InstitutionalClient {
  id: string;
  name: string;
  type: "hedge_fund" | "family_office" | "pension_fund" | "bank" | "corporation" | "endowment" | "sovereign_wealth" | "asset_manager";
  aum: number; // Assets Under Management
  status: "active" | "pending" | "suspended" | "prospect";
  tier: "platinum" | "gold" | "silver" | "bronze";
  onboardingDate: string;
  lastActivity: string;
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  compliance: {
    kycStatus: "approved" | "pending" | "rejected";
    amlStatus: "clear" | "review" | "flagged";
    accreditation: "verified" | "pending" | "expired";
    lastReview: string;
  };
  trading: {
    monthlyVolume: number;
    totalVolume: number;
    profitLoss: number;
    activeOrders: number;
    avgOrderSize: number;
    preferredPairs: string[];
  };
  services: {
    otc: boolean;
    api: boolean;
    custody: boolean;
    staking: boolean;
    lending: boolean;
    derivatives: boolean;
    prime: boolean;
  };
  fees: {
    maker: number;
    taker: number;
    custody: number;
    withdrawal: number;
  };
  risk: {
    score: number;
    exposure: number;
    limits: {
      daily: number;
      monthly: number;
      position: number;
    };
  };
  relationship: {
    manager: string;
    health: "excellent" | "good" | "fair" | "poor";
    satisfaction: number;
    lastMeeting: string;
    nextReview: string;
  };
  geography: {
    country: string;
    region: string;
    jurisdiction: string;
    timezone: string;
  };
  financials: {
    revenue: number;
    margin: number;
    ltv: number; // Lifetime Value
    cac: number; // Customer Acquisition Cost
    churnRisk: number;
  };
}

export default function InstitutionalClientCRM() {
  const [clients, setClients] = useState<InstitutionalClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<InstitutionalClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<InstitutionalClient | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  // Sample institutional clients data
  useEffect(() => {
    const sampleClients: InstitutionalClient[] = [
      {
        id: "inst-001",
        name: "Apex Capital Management",
        type: "hedge_fund",
        aum: 2500000000,
        status: "active",
        tier: "platinum",
        onboardingDate: "2024-08-15",
        lastActivity: "2025-01-29",
        primaryContact: {
          name: "Robert Chen",
          title: "Chief Investment Officer",
          email: "r.chen@apexcapital.com",
          phone: "+1-212-555-0123"
        },
        compliance: {
          kycStatus: "approved",
          amlStatus: "clear",
          accreditation: "verified",
          lastReview: "2025-01-15"
        },
        trading: {
          monthlyVolume: 45000000,
          totalVolume: 180000000,
          profitLoss: 2850000,
          activeOrders: 23,
          avgOrderSize: 125000,
          preferredPairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT"]
        },
        services: {
          otc: true,
          api: true,
          custody: true,
          staking: true,
          lending: false,
          derivatives: true,
          prime: true
        },
        fees: {
          maker: 0.02,
          taker: 0.05,
          custody: 0.15,
          withdrawal: 0.01
        },
        risk: {
          score: 92,
          exposure: 15000000,
          limits: {
            daily: 5000000,
            monthly: 50000000,
            position: 10000000
          }
        },
        relationship: {
          manager: "Sarah Mitchell",
          health: "excellent",
          satisfaction: 95,
          lastMeeting: "2025-01-20",
          nextReview: "2025-02-15"
        },
        geography: {
          country: "United States",
          region: "North America",
          jurisdiction: "Delaware",
          timezone: "EST"
        },
        financials: {
          revenue: 285000,
          margin: 68,
          ltv: 1200000,
          cac: 15000,
          churnRisk: 5
        }
      },
      {
        id: "inst-002",
        name: "Nordic Sovereign Wealth Fund",
        type: "sovereign_wealth",
        aum: 45000000000,
        status: "active",
        tier: "platinum",
        onboardingDate: "2024-06-10",
        lastActivity: "2025-01-28",
        primaryContact: {
          name: "Erik Andersson",
          title: "Portfolio Manager",
          email: "erik.andersson@nordicswf.no",
          phone: "+47-22-555-0456"
        },
        compliance: {
          kycStatus: "approved",
          amlStatus: "clear",
          accreditation: "verified",
          lastReview: "2025-01-10"
        },
        trading: {
          monthlyVolume: 120000000,
          totalVolume: 850000000,
          profitLoss: 12500000,
          activeOrders: 45,
          avgOrderSize: 2500000,
          preferredPairs: ["BTC/USDT", "ETH/USDT", "BTC/EUR"]
        },
        services: {
          otc: true,
          api: true,
          custody: true,
          staking: true,
          lending: true,
          derivatives: false,
          prime: true
        },
        fees: {
          maker: 0.01,
          taker: 0.03,
          custody: 0.10,
          withdrawal: 0.005
        },
        risk: {
          score: 98,
          exposure: 85000000,
          limits: {
            daily: 50000000,
            monthly: 200000000,
            position: 100000000
          }
        },
        relationship: {
          manager: "David Kumar",
          health: "excellent",
          satisfaction: 98,
          lastMeeting: "2025-01-25",
          nextReview: "2025-03-01"
        },
        geography: {
          country: "Norway",
          region: "Europe",
          jurisdiction: "Norway",
          timezone: "CET"
        },
        financials: {
          revenue: 950000,
          margin: 82,
          ltv: 4500000,
          cac: 25000,
          churnRisk: 2
        }
      },
      {
        id: "inst-003",
        name: "University Endowment Foundation",
        type: "endowment",
        aum: 1200000000,
        status: "active",
        tier: "gold",
        onboardingDate: "2024-11-20",
        lastActivity: "2025-01-27",
        primaryContact: {
          name: "Dr. Jennifer Walsh",
          title: "Chief Investment Officer",
          email: "j.walsh@university.edu",
          phone: "+1-617-555-0789"
        },
        compliance: {
          kycStatus: "approved",
          amlStatus: "clear",
          accreditation: "verified",
          lastReview: "2025-01-05"
        },
        trading: {
          monthlyVolume: 8500000,
          totalVolume: 25000000,
          profitLoss: 450000,
          activeOrders: 12,
          avgOrderSize: 75000,
          preferredPairs: ["BTC/USDT", "ETH/USDT"]
        },
        services: {
          otc: false,
          api: true,
          custody: true,
          staking: true,
          lending: false,
          derivatives: false,
          prime: false
        },
        fees: {
          maker: 0.05,
          taker: 0.08,
          custody: 0.20,
          withdrawal: 0.02
        },
        risk: {
          score: 85,
          exposure: 3500000,
          limits: {
            daily: 1000000,
            monthly: 10000000,
            position: 5000000
          }
        },
        relationship: {
          manager: "Michael Torres",
          health: "good",
          satisfaction: 88,
          lastMeeting: "2025-01-15",
          nextReview: "2025-02-28"
        },
        geography: {
          country: "United States",
          region: "North America",
          jurisdiction: "Massachusetts",
          timezone: "EST"
        },
        financials: {
          revenue: 125000,
          margin: 72,
          ltv: 650000,
          cac: 12000,
          churnRisk: 15
        }
      }
    ];
    setClients(sampleClients);
    setFilteredClients(sampleClients);
  }, []);

  // Filter clients
  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.primaryContact.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(client => client.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    if (tierFilter !== "all") {
      filtered = filtered.filter(client => client.tier === tierFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, typeFilter, statusFilter, tierFilter]);

  const getTierColor = (tier: string) => {
    const colors = {
      platinum: "bg-purple-500 text-white",
      gold: "bg-yellow-500 text-white",
      silver: "bg-gray-400 text-white",
      bronze: "bg-orange-600 text-white"
    };
    return colors[tier as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500 text-white",
      pending: "bg-yellow-500 text-white",
      suspended: "bg-red-500 text-white",
      prospect: "bg-blue-500 text-white"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      hedge_fund: "🏦",
      family_office: "👑",
      pension_fund: "🏛️",
      bank: "🏪",
      corporation: "🏢",
      endowment: "🎓",
      sovereign_wealth: "🌍",
      asset_manager: "📊"
    };
    return icons[type as keyof typeof icons] || "🏢";
  };

  const getHealthColor = (health: string) => {
    const colors = {
      excellent: "text-green-500",
      good: "text-blue-500",
      fair: "text-yellow-500",
      poor: "text-red-500"
    };
    return colors[health as keyof typeof colors] || "text-gray-500";
  };

  const totalAUM = clients.reduce((sum, client) => sum + client.aum, 0);
  const totalRevenue = clients.reduce((sum, client) => sum + client.financials.revenue, 0);
  const avgSatisfaction = clients.reduce((sum, client) => sum + client.relationship.satisfaction, 0) / clients.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Institutional Client Management</h1>
          <p className="text-muted-foreground">Comprehensive institutional relationship management platform</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total AUM</p>
                <p className="text-2xl font-bold">${(totalAUM / 1000000000).toFixed(1)}B</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+8.2%</span>
              <span className="text-muted-foreground ml-1">this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{clients.filter(c => c.status === "active").length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+3</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
                <p className="text-2xl font-bold">{avgSatisfaction.toFixed(1)}%</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500">+2.1%</span>
              <span className="text-muted-foreground ml-1">this quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Client Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="hedge_fund">Hedge Fund</SelectItem>
                    <SelectItem value="sovereign_wealth">Sovereign Wealth</SelectItem>
                    <SelectItem value="endowment">Endowment</SelectItem>
                    <SelectItem value="pension_fund">Pension Fund</SelectItem>
                    <SelectItem value="family_office">Family Office</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Clients List */}
          <div className="grid gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div>
                          <h3 className="font-semibold text-xl">{client.name}</h3>
                          <p className="text-muted-foreground flex items-center">
                            {getTypeIcon(client.type)} {client.type.replace("_", " ")}
                          </p>
                        </div>
                        <Badge className={getTierColor(client.tier)}>
                          {client.tier}
                        </Badge>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Assets Under Management</p>
                          <p className="text-lg font-semibold">${(client.aum / 1000000000).toFixed(1)}B</p>
                          <p className="text-sm text-muted-foreground">Monthly Volume: ${(client.trading.monthlyVolume / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Primary Contact</p>
                          <p className="font-medium">{client.primaryContact.name}</p>
                          <p className="text-sm text-muted-foreground">{client.primaryContact.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Relationship Health</p>
                          <p className={`font-semibold ${getHealthColor(client.relationship.health)}`}>
                            {client.relationship.health}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Satisfaction: {client.relationship.satisfaction}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue (Monthly)</p>
                          <p className="text-lg font-semibold text-green-500">
                            ${client.financials.revenue.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Margin: {client.financials.margin}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(client.services).map(([service, enabled]) => (
                          enabled && (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service.toUpperCase()}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <p>Risk Score: {client.risk.score}/100</p>
                        <p>Last Activity: {client.lastActivity}</p>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => setSelectedClient(client)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers by Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients
                    .sort((a, b) => b.trading.monthlyVolume - a.trading.monthlyVolume)
                    .slice(0, 5)
                    .map((client) => (
                      <div key={client.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(client.trading.monthlyVolume / 1000000).toFixed(1)}M</p>
                          <p className="text-sm text-muted-foreground">monthly volume</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients
                    .sort((a, b) => b.financials.revenue - a.financials.revenue)
                    .slice(0, 5)
                    .map((client) => (
                      <div key={client.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <Badge className={getTierColor(client.tier)} variant="outline">
                            {client.tier}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-500">
                            ${client.financials.revenue.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {((client.financials.revenue / totalRevenue) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>KYC Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["approved", "pending", "rejected"].map((status) => {
                    const count = clients.filter(c => c.compliance.kycStatus === status).length;
                    const percentage = (count / clients.length) * 100;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {status === "approved" && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {status === "pending" && <Clock className="w-4 h-4 text-yellow-500" />}
                          {status === "rejected" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          <span className="capitalize">{status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AML Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["clear", "review", "flagged"].map((status) => {
                    const count = clients.filter(c => c.compliance.amlStatus === status).length;
                    const percentage = (count / clients.length) * 100;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {status === "clear" && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {status === "review" && <Clock className="w-4 h-4 text-yellow-500" />}
                          {status === "flagged" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          <span className="capitalize">{status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accreditation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["verified", "pending", "expired"].map((status) => {
                    const count = clients.filter(c => c.compliance.accreditation === status).length;
                    const percentage = (count / clients.length) * 100;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {status === "verified" && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {status === "pending" && <Clock className="w-4 h-4 text-yellow-500" />}
                          {status === "expired" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          <span className="capitalize">{status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Relationship Health Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["excellent", "good", "fair", "poor"].map((health) => {
                    const count = clients.filter(c => c.relationship.health === health).length;
                    const percentage = (count / clients.length) * 100;
                    return (
                      <div key={health} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize">{health}</span>
                          <span>{count} clients ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients
                    .filter(c => new Date(c.relationship.nextReview) > new Date())
                    .sort((a, b) => new Date(a.relationship.nextReview).getTime() - new Date(b.relationship.nextReview).getTime())
                    .slice(0, 5)
                    .map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.relationship.manager}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{client.relationship.nextReview}</p>
                          <Badge variant="outline">Review Due</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Distribution by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["hedge_fund", "sovereign_wealth", "endowment", "pension_fund", "family_office"].map((type) => {
                    const count = clients.filter(c => c.type === type).length;
                    const percentage = (count / clients.length) * 100;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{getTypeIcon(type)}</span>
                          <span className="capitalize">{type.replace("_", " ")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["United States", "Norway", "United Kingdom", "Singapore", "Switzerland"].map((country) => {
                    const count = clients.filter(c => c.geography.country === country).length;
                    const percentage = (count / clients.length) * 100;
                    return (
                      <div key={country} className="flex items-center justify-between">
                        <span>{country}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedClient(null)} />
          <div className="relative bg-background border border-border rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                <p className="text-muted-foreground">{selectedClient.type.replace("_", " ")} • {selectedClient.geography.country}</p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedClient(null)}>
                ✕
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Assets Under Management</p>
                      <p className="text-2xl font-bold">${(selectedClient.aum / 1000000000).toFixed(1)}B</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Client Since</p>
                      <p className="font-medium">{selectedClient.onboardingDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(selectedClient.status)}>
                        {selectedClient.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tier</p>
                      <Badge className={getTierColor(selectedClient.tier)}>
                        {selectedClient.tier}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trading Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Volume</p>
                      <p className="text-xl font-bold">${(selectedClient.trading.monthlyVolume / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Volume</p>
                      <p className="font-medium">${(selectedClient.trading.totalVolume / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">P&L</p>
                      <p className={`font-medium ${selectedClient.trading.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${selectedClient.trading.profitLoss.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Orders</p>
                      <p className="font-medium">{selectedClient.trading.activeOrders}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Relationship</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Account Manager</p>
                      <p className="font-medium">{selectedClient.relationship.manager}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Health</p>
                      <p className={`font-medium ${getHealthColor(selectedClient.relationship.health)}`}>
                        {selectedClient.relationship.health}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                      <p className="font-medium">{selectedClient.relationship.satisfaction}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Review</p>
                      <p className="font-medium">{selectedClient.relationship.nextReview}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Primary Contact</p>
                      <p className="font-medium">{selectedClient.primaryContact.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedClient.primaryContact.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedClient.primaryContact.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedClient.primaryContact.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timezone</p>
                      <p className="font-medium">{selectedClient.geography.timezone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Services & Fees</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Services</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(selectedClient.services).map(([service, enabled]) => (
                          enabled && (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service.toUpperCase()}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Maker Fee</p>
                        <p className="font-medium">{selectedClient.fees.maker}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Taker Fee</p>
                        <p className="font-medium">{selectedClient.fees.taker}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}