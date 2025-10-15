import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Target,
  Handshake,
  Briefcase,
  Phone,
  Mail,
  Globe,
  Star,
  Filter,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  UserPlus,
  Calendar as CalendarIcon,
  Archive
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface CrmAccount {
  id: number;
  accountName: string;
  accountType: 'vip' | 'otc' | 'market_maker' | 'investor' | 'partner';
  dealValue: string;
  stage: 'new_lead' | 'demo' | 'kyc' | 'funded' | 'active';
  priority: 'low' | 'medium' | 'high';
  contactInfo: {
    primaryContact: string;
    email: string;
    phone: string;
    company: string;
  };
  createdAt: string;
  lastContact: string;
}

export default function BusinessCRM() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');

  // CRM accounts and pipeline data
  const { data: crmAccounts, isLoading: accountsLoading, error: accountsError } = useQuery({
    queryKey: ['/api/crm/accounts'],
    refetchInterval: 60000 // Refresh every minute
  });

  // Communications log
  const { data: communications, isLoading: commsLoading } = useQuery({
    queryKey: ['/api/crm/communications'],
    enabled: activeTab === 'communications'
  });

  // Regulatory communications
  const { data: regulatoryComms, isLoading: regulatoryLoading } = useQuery({
    queryKey: ['/api/crm/regulatory'],
    enabled: activeTab === 'regulatory'
  });

  // Contract tracking
  const { data: contracts, isLoading: contractsLoading } = useQuery({
    queryKey: ['/api/crm/contracts'],
    enabled: activeTab === 'contracts'
  });

  const accounts: CrmAccount[] = Array.isArray(crmAccounts) ? crmAccounts : [];

  // Show loading state
  if (accountsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-black/30 border-purple-500/30 p-8">
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading CRM Data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (accountsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-black/30 border-red-500/30 p-8">
          <CardContent className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-white text-lg mb-2">Error Loading CRM Data</p>
            <p className="text-gray-400">Please check your connection and try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stageStats = {
    new_lead: accounts.filter(a => a.stage === 'new_lead').length,
    demo: accounts.filter(a => a.stage === 'demo').length,
    kyc: accounts.filter(a => a.stage === 'kyc').length,
    funded: accounts.filter(a => a.stage === 'funded').length,
    active: accounts.filter(a => a.stage === 'active').length
  };

  const totalDealValue = accounts.reduce((sum, account) => sum + parseFloat(account.dealValue || '0'), 0);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new_lead': return 'border-blue-500 bg-blue-500/10';
      case 'demo': return 'border-purple-500 bg-purple-500/10';
      case 'kyc': return 'border-yellow-500 bg-yellow-500/10';
      case 'funded': return 'border-orange-500 bg-orange-500/10';
      case 'active': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-green-400 border-green-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Building2 className="h-10 w-10 text-purple-400" />
            Business CRM
          </h1>
          <p className="text-gray-300 text-lg">
            Institutional pipeline management, client relations, and regulatory compliance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-black/30 border-purple-500/30 hover:border-purple-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Accounts</p>
                  <p className="text-3xl font-bold text-white">{accounts.length}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pipeline Value</p>
                  <p className="text-2xl font-bold text-white">${(totalDealValue / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Deals</p>
                  <p className="text-2xl font-bold text-white">{stageStats.active}</p>
                </div>
                <Handshake className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">New Leads</p>
                  <p className="text-2xl font-bold text-white">{stageStats.new_lead}</p>
                </div>
                <Target className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">24%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/20 border-purple-500/20">
            <TabsTrigger value="pipeline" className="text-white">Pipeline</TabsTrigger>
            <TabsTrigger value="accounts" className="text-white">Accounts</TabsTrigger>
            <TabsTrigger value="communications" className="text-white">Communications</TabsTrigger>
            <TabsTrigger value="regulatory" className="text-white">Regulatory</TabsTrigger>
            <TabsTrigger value="contracts" className="text-white">Contracts</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white">Analytics</TabsTrigger>
          </TabsList>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search pipeline..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/20 border-purple-500/20 text-white"
                />
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Lead
              </Button>
            </div>

            {/* Pipeline Kanban View */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* New Leads */}
              <Card className="bg-black/20 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      New Leads
                    </span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {stageStats.new_lead}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {accounts.filter(a => a.stage === 'new_lead').map(account => (
                    <div key={account.id} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{account.accountName}</h4>
                        <Badge variant="outline" className={getPriorityColor(account.priority)}>
                          {account.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{account.contactInfo.company}</p>
                      <p className="text-green-400 text-sm font-medium">${parseFloat(account.dealValue).toLocaleString()}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{account.contactInfo.primaryContact}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Demo */}
              <Card className="bg-black/20 border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      Demo
                    </span>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {stageStats.demo}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {accounts.filter(a => a.stage === 'demo').map(account => (
                    <div key={account.id} className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{account.accountName}</h4>
                        <Badge variant="outline" className={getPriorityColor(account.priority)}>
                          {account.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{account.contactInfo.company}</p>
                      <p className="text-green-400 text-sm font-medium">${parseFloat(account.dealValue).toLocaleString()}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{account.contactInfo.primaryContact}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* KYC */}
              <Card className="bg-black/20 border-yellow-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      KYC
                    </span>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      {stageStats.kyc}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {accounts.filter(a => a.stage === 'kyc').map(account => (
                    <div key={account.id} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{account.accountName}</h4>
                        <Badge variant="outline" className={getPriorityColor(account.priority)}>
                          {account.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{account.contactInfo.company}</p>
                      <p className="text-green-400 text-sm font-medium">${parseFloat(account.dealValue).toLocaleString()}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{account.contactInfo.primaryContact}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Funded */}
              <Card className="bg-black/20 border-orange-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      Funded
                    </span>
                    <Badge variant="outline" className="text-orange-400 border-orange-400">
                      {stageStats.funded}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {accounts.filter(a => a.stage === 'funded').map(account => (
                    <div key={account.id} className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{account.accountName}</h4>
                        <Badge variant="outline" className={getPriorityColor(account.priority)}>
                          {account.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{account.contactInfo.company}</p>
                      <p className="text-green-400 text-sm font-medium">${parseFloat(account.dealValue).toLocaleString()}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{account.contactInfo.primaryContact}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active */}
              <Card className="bg-black/20 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Active
                    </span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {stageStats.active}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {accounts.filter(a => a.stage === 'active').map(account => (
                    <div key={account.id} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm">{account.accountName}</h4>
                        <Badge variant="outline" className={getPriorityColor(account.priority)}>
                          {account.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{account.contactInfo.company}</p>
                      <p className="text-green-400 text-sm font-medium">${parseFloat(account.dealValue).toLocaleString()}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{account.contactInfo.primaryContact}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Account Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage VIP, OTC, market maker, and partner accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search accounts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-black/20 border-purple-500/20 text-white"
                    />
                  </div>
                  <Button variant="outline" className="border-purple-500/20 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Account
                  </Button>
                </div>

                <div className="space-y-4">
                  {accounts.map(account => (
                    <div key={account.id} className="bg-black/10 rounded-lg p-4 border border-purple-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-medium">{account.accountName}</h3>
                              <Badge variant="outline" className="text-purple-400 border-purple-400">
                                {account.accountType}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm">{account.contactInfo.company}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-gray-400 text-xs flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {account.contactInfo.email}
                              </span>
                              <span className="text-gray-400 text-xs flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {account.contactInfo.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-green-400 font-medium">${parseFloat(account.dealValue).toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">{account.stage}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getPriorityColor(account.priority)}>
                              {account.priority}
                            </Badge>
                            <Button size="sm" variant="outline" className="border-purple-500/20 text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-purple-500/20 text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card className="bg-black/20 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Log
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track all client communications and follow-ups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-black/10 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Email Follow-up: OTC Partnership</h4>
                          <p className="text-gray-400 text-sm mt-1">Discussed volume requirements and fee structure with Genesis Capital</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">2 hours ago</span>
                            <Badge variant="outline" className="text-green-400 border-green-400">Completed</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-black/10 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Phone className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Discovery Call: Institutional Client</h4>
                          <p className="text-gray-400 text-sm mt-1">Initial discussion about market making services for hedge fund</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500">1 day ago</span>
                            <Badge variant="outline" className="text-yellow-400 border-yellow-400">Follow-up Required</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would continue here... */}
          
        </Tabs>
      </div>
    </div>
  );
}