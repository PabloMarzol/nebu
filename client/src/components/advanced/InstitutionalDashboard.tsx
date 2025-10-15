import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Users, 
  Shield, 
  FileText, 
  Activity, 
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings
} from "lucide-react";

interface InstitutionalClient {
  id: string;
  name: string;
  type: 'hedge_fund' | 'bank' | 'family_office' | 'corporation';
  aum: number;
  monthlyVolume: number;
  status: 'active' | 'pending' | 'suspended';
  tier: 'platinum' | 'gold' | 'silver';
  onboardedDate: Date;
}

interface ComplianceItem {
  id: string;
  type: 'kyc' | 'aml' | 'reporting' | 'audit';
  status: 'completed' | 'pending' | 'review' | 'expired';
  dueDate: Date;
  description: string;
}

export default function InstitutionalDashboard() {
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [timeframe, setTimeframe] = useState('30d');

  const institutionalMetrics = {
    totalAUM: 2840000000, // $2.84B
    activeClients: 147,
    monthlyVolume: 1650000000, // $1.65B
    avgTicketSize: 2500000, // $2.5M
    revenue: 8450000, // $8.45M
    growthRate: 23.4
  };

  const clients: InstitutionalClient[] = [
    {
      id: '1',
      name: 'Quantum Capital Partners',
      type: 'hedge_fund',
      aum: 850000000,
      monthlyVolume: 245000000,
      status: 'active',
      tier: 'platinum',
      onboardedDate: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Global Securities Bank',
      type: 'bank',
      aum: 1200000000,
      monthlyVolume: 380000000,
      status: 'active',
      tier: 'platinum',
      onboardedDate: new Date('2023-08-22')
    },
    {
      id: '3',
      name: 'Meridian Family Office',
      type: 'family_office',
      aum: 450000000,
      monthlyVolume: 125000000,
      status: 'active',
      tier: 'gold',
      onboardedDate: new Date('2024-03-10')
    }
  ];

  const complianceItems: ComplianceItem[] = [
    {
      id: '1',
      type: 'kyc',
      status: 'pending',
      dueDate: new Date('2025-07-01'),
      description: 'Annual KYC renewal for Quantum Capital Partners'
    },
    {
      id: '2',
      type: 'aml',
      status: 'review',
      dueDate: new Date('2025-06-25'),
      description: 'AML compliance review for Q2 2025'
    },
    {
      id: '3',
      type: 'reporting',
      status: 'completed',
      dueDate: new Date('2025-06-15'),
      description: 'Monthly transaction reporting'
    },
    {
      id: '4',
      type: 'audit',
      status: 'pending',
      dueDate: new Date('2025-08-01'),
      description: 'External audit preparation'
    }
  ];

  const getClientTypeIcon = (type: string) => {
    switch (type) {
      case 'hedge_fund': return '🏛️';
      case 'bank': return '🏦';
      case 'family_office': return '👑';
      case 'corporation': return '🏢';
      default: return '🏛️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-600';
      case 'pending': return 'bg-yellow-500/20 text-yellow-600';
      case 'suspended': return 'bg-red-500/20 text-red-600';
      case 'completed': return 'bg-green-500/20 text-green-600';
      case 'review': return 'bg-blue-500/20 text-blue-600';
      case 'expired': return 'bg-red-500/20 text-red-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-500/20 text-purple-600';
      case 'gold': return 'bg-yellow-500/20 text-yellow-600';
      case 'silver': return 'bg-gray-500/20 text-gray-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Institutional Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="glass-enhanced border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Total AUM</p>
                <p className="text-lg font-bold">${(institutionalMetrics.totalAUM / 1000000000).toFixed(2)}B</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Active Clients</p>
                <p className="text-lg font-bold">{institutionalMetrics.activeClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Monthly Volume</p>
                <p className="text-lg font-bold">${(institutionalMetrics.monthlyVolume / 1000000000).toFixed(2)}B</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Avg Ticket</p>
                <p className="text-lg font-bold">${(institutionalMetrics.avgTicketSize / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-pink-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold">${(institutionalMetrics.revenue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-enhanced border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-xs text-muted-foreground">Growth Rate</p>
                <p className="text-lg font-bold text-green-500">+{institutionalMetrics.growthRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="clients">Client Management</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Client List */}
            <div className="lg:col-span-2">
              <Card className="glass-enhanced">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5" />
                      <span>Institutional Clients</span>
                    </span>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                      Add Client
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.map((client) => (
                      <div
                        key={client.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedClient(client.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">{getClientTypeIcon(client.type)}</div>
                            <div>
                              <h4 className="font-medium">{client.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {client.type.replace('_', ' ')}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={getStatusColor(client.status)}>
                                  {client.status}
                                </Badge>
                                <Badge className={getTierColor(client.tier)}>
                                  {client.tier}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(client.aum / 1000000000).toFixed(2)}B AUM</p>
                            <p className="text-sm text-muted-foreground">
                              ${(client.monthlyVolume / 1000000).toFixed(1)}M monthly
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Client Details */}
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Client Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Compliance Check
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  Trading Limits
                </Button>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Quick Contact</h4>
                  <div className="space-y-2 text-sm">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start p-2"
                      onClick={() => window.location.href = 'mailto:sales@nebulaxexchange.io'}
                    >
                      📧 Email Sales Team
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start p-2"
                      onClick={() => window.location.href = 'mailto:enquiries@nebulaxexchange.io'}
                    >
                      💼 Business Enquiries
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Compliance Dashboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : item.status === 'pending' ? (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <h4 className="font-medium">{item.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {item.dueDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Institutional Reporting</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex flex-col space-y-2">
                  <FileText className="w-6 h-6" />
                  <span>Monthly Report</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col space-y-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>Performance Analytics</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col space-y-2">
                  <Shield className="w-6 h-6" />
                  <span>Compliance Report</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col space-y-2">
                  <Activity className="w-6 h-6" />
                  <span>Trading Summary</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col space-y-2">
                  <DollarSign className="w-6 h-6" />
                  <span>Fee Report</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col space-y-2">
                  <Users className="w-6 h-6" />
                  <span>Client Summary</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>Operational Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Settlement Time</span>
                    <Badge className="bg-green-500/20 text-green-600">2.3 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SLA Compliance</span>
                    <Badge className="bg-green-500/20 text-green-600">99.8%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Failed Transactions</span>
                    <Badge className="bg-yellow-500/20 text-yellow-600">0.02%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Support Response Time</span>
                    <Badge className="bg-blue-500/20 text-blue-600">&lt; 1 hour</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Trading Engine</span>
                    <Badge className="bg-green-500/20 text-green-600">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Market Data</span>
                    <Badge className="bg-green-500/20 text-green-600">Live</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Settlement System</span>
                    <Badge className="bg-green-500/20 text-green-600">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>API Services</span>
                    <Badge className="bg-green-500/20 text-green-600">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="glass-enhanced">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Institutional Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Default Trading Limits</label>
                  <Input placeholder="$10,000,000" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Settlement Currency</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Risk Management Level</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}