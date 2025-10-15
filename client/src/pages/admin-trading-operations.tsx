import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  Settings, 
  Pause, 
  Play, 
  RefreshCw, 
  BarChart3,
  Target,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Plus,
  Zap,
  AlertCircle,
  TrendingDown,
  Users,
  Calendar
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface MarketMakerConfig {
  id: number;
  symbol: string;
  isActive: boolean;
  spreadBps: number;
  maxPositionSize: string;
  orderRefreshInterval: number;
  volatilityThreshold: string;
  emergencyHalt: boolean;
  lastPriceUpdate?: string;
  updatedAt: string;
}

interface TradingIncident {
  id: number;
  incidentType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symbol?: string;
  description: string;
  affectedUsers: number;
  affectedOrders: any[];
  status: 'open' | 'investigating' | 'resolved';
  resolution?: string;
  assignedTo?: string;
  resolvedAt?: string;
  createdAt: string;
}

export default function AdminTradingOperations() {
  const [activeTab, setActiveTab] = useState('market-maker');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const queryClient = useQueryClient();

  // Market Maker Configs Data
  const { data: marketMakerConfigs, isLoading: configsLoading } = useQuery({
    queryKey: ['/api/admin-panel/trading/market-maker-config'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Trading Incidents Data
  const { data: tradingIncidents, isLoading: incidentsLoading } = useQuery({
    queryKey: ['/api/admin-panel/trading/incidents', { status: statusFilter, severity: severityFilter }],
    enabled: activeTab === 'incidents'
  });

  // Market Maker Config Update Mutation
  const updateConfigMutation = useMutation({
    mutationFn: async ({ symbol, config }: { symbol: string; config: any }) => {
      return apiRequest(`/api/admin-panel/trading/market-maker-config/${symbol}`, {
        method: 'POST',
        body: JSON.stringify(config)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin-panel/trading/market-maker-config'] });
    }
  });

  // Create Incident Mutation
  const createIncidentMutation = useMutation({
    mutationFn: async (incidentData: any) => {
      return apiRequest('/api/admin-panel/trading/incidents', {
        method: 'POST',
        body: JSON.stringify(incidentData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin-panel/trading/incidents'] });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'investigating': return 'bg-blue-500';
      case 'open': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleEmergencyHalt = (symbol: string, currentState: boolean) => {
    updateConfigMutation.mutate({
      symbol,
      config: { emergencyHalt: !currentState }
    });
  };

  const toggleMarketMaker = (symbol: string, currentState: boolean) => {
    updateConfigMutation.mutate({
      symbol,
      config: { isActive: !currentState }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-blue-400" />
            Trading & Liquidity Operations
          </h1>
          <p className="text-lg text-gray-300">
            Monitor market making, manage liquidity, and track trading incidents
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Markets</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(marketMakerConfigs) ? marketMakerConfigs.filter(c => c.isActive).length : 0}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Emergency Halts</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(marketMakerConfigs) ? marketMakerConfigs.filter(c => c.emergencyHalt).length : 0}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Open Incidents</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(tradingIncidents) ? tradingIncidents.filter(i => i.status === 'open').length : 0}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Spread</p>
                  <p className="text-2xl font-bold text-white">
                    {Array.isArray(marketMakerConfigs) && marketMakerConfigs.length > 0
                      ? (marketMakerConfigs.reduce((sum, c) => sum + c.spreadBps, 0) / marketMakerConfigs.length).toFixed(1)
                      : '0'} bps
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="market-maker">Market Maker</TabsTrigger>
            <TabsTrigger value="incidents">Trading Incidents</TabsTrigger>
            <TabsTrigger value="listing-management">Listing Management</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          </TabsList>

          {/* Market Maker Interface Tab */}
          <TabsContent value="market-maker" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Market Maker Configuration
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure spreads, position limits, and market making parameters
                </CardDescription>
                <div className="flex gap-4">
                  <Button variant="outline" className="border-green-500 text-green-400">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All
                  </Button>
                  <Button variant="outline" className="border-red-500 text-red-400">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Halt All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {configsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Symbol</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Spread (bps)</TableHead>
                        <TableHead className="text-gray-300">Max Position</TableHead>
                        <TableHead className="text-gray-300">Refresh Interval</TableHead>
                        <TableHead className="text-gray-300">Vol Threshold</TableHead>
                        <TableHead className="text-gray-300">Emergency</TableHead>
                        <TableHead className="text-gray-300">Last Update</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(marketMakerConfigs) && marketMakerConfigs.map((config: MarketMakerConfig) => (
                        <TableRow key={config.id}>
                          <TableCell className="text-white font-medium">
                            {config.symbol}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${config.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className={config.isActive ? 'text-green-400' : 'text-red-400'}>
                                {config.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            {config.spreadBps} bps
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {parseFloat(config.maxPositionSize).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {config.orderRefreshInterval}s
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {(parseFloat(config.volatilityThreshold) * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            {config.emergencyHalt ? (
                              <Badge className="bg-red-500 text-white">
                                <Pause className="h-3 w-3 mr-1" />
                                HALTED
                              </Badge>
                            ) : (
                              <Badge className="bg-green-500 text-white">
                                <Play className="h-3 w-3 mr-1" />
                                Running
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {config.lastPriceUpdate 
                              ? new Date(config.lastPriceUpdate).toLocaleTimeString()
                              : 'Never'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className={`h-8 ${config.isActive 
                                  ? 'border-red-500 text-red-400 hover:bg-red-500/20' 
                                  : 'border-green-500 text-green-400 hover:bg-green-500/20'
                                }`}
                                onClick={() => toggleMarketMaker(config.symbol, config.isActive)}
                              >
                                {config.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 border-orange-500 text-orange-400 hover:bg-orange-500/20"
                                onClick={() => toggleEmergencyHalt(config.symbol, config.emergencyHalt)}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trading Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Trading Incident Management
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Track and resolve trading system incidents and anomalies
                </CardDescription>
                
                {/* Filters */}
                <div className="flex gap-4 mt-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-40 bg-black/30 border-purple-500/30 text-white">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Report Incident
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {incidentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-300">Incident Type</TableHead>
                        <TableHead className="text-gray-300">Severity</TableHead>
                        <TableHead className="text-gray-300">Symbol</TableHead>
                        <TableHead className="text-gray-300">Description</TableHead>
                        <TableHead className="text-gray-300">Affected Users</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Assigned To</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(tradingIncidents) && tradingIncidents.map((incident: TradingIncident) => (
                        <TableRow key={incident.id}>
                          <TableCell className="text-white font-medium">
                            {incident.incidentType.replace('_', ' ').toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getSeverityColor(incident.severity)} text-white`}>
                              {incident.severity.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            {incident.symbol || 'System-wide'}
                          </TableCell>
                          <TableCell className="text-gray-300 max-w-xs truncate">
                            {incident.description}
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              {incident.affectedUsers.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(incident.status)} text-white`}>
                              {incident.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {incident.assignedTo || 'Unassigned'}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(incident.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {incident.status === 'open' && (
                                <Button size="sm" variant="outline" className="h-8 border-blue-500 text-blue-400">
                                  Investigate
                                </Button>
                              )}
                              {incident.status === 'investigating' && (
                                <Button size="sm" variant="outline" className="h-8 border-green-500 text-green-400">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listing Management Tab */}
          <TabsContent value="listing-management" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Trading Pair Management
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Add, edit, and manage trading pairs and their configurations
                </CardDescription>
                <div className="flex gap-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Pair
                  </Button>
                  <Button variant="outline" className="border-blue-500 text-blue-400">
                    <Settings className="h-4 w-4 mr-2" />
                    Bulk Settings
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Active Trading Pairs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT', 'DOT/USDT', 'LINK/USDT'].map((pair) => (
                      <Card key={pair} className="bg-black/20 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white">{pair}</h3>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-green-400">Live</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">24h Volume:</span>
                              <span className="text-white">$2.4M</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Spread:</span>
                              <span className="text-white">0.1%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Orders:</span>
                              <span className="text-white">147</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500 text-red-400">
                              <Pause className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Performance */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Order Processing Rate</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-bold">1,247/sec</span>
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Latency (P99)</span>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-bold">2.1ms</span>
                        <Clock className="h-4 w-4 text-yellow-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">System Load</span>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">34%</span>
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Memory Usage</span>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-bold">67%</span>
                        <Activity className="h-4 w-4 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Book Health */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Order Book Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Avg Spread</span>
                      <span className="text-green-400 font-bold">0.08%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Order Book Depth</span>
                      <span className="text-blue-400 font-bold">$847K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Price Impact (1%)</span>
                      <span className="text-yellow-400 font-bold">0.03%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Market Quality Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-bold">9.2/10</span>
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Activity Feed */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Real-time Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '14:32:15', event: 'Large order executed', symbol: 'BTC/USDT', details: '$2.4M market buy', severity: 'info' },
                    { time: '14:31:48', event: 'Spread widened', symbol: 'ETH/USDT', details: 'Spread: 0.05% → 0.08%', severity: 'warning' },
                    { time: '14:31:22', event: 'MM algorithm adjusted', symbol: 'SOL/USDT', details: 'Volatility threshold reached', severity: 'info' },
                    { time: '14:30:55', event: 'Order book imbalance', symbol: 'ADA/USDT', details: 'Buy/Sell ratio: 3.2:1', severity: 'warning' },
                    { time: '14:30:33', event: 'New trading pair added', symbol: 'AVAX/USDT', details: 'Pair activated successfully', severity: 'success' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg">
                      <div className="text-xs text-gray-400 w-16">{activity.time}</div>
                      <div className={`w-2 h-2 rounded-full ${
                        activity.severity === 'success' ? 'bg-green-500' :
                        activity.severity === 'warning' ? 'bg-yellow-500' :
                        activity.severity === 'error' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{activity.event}</span>
                          <Badge variant="outline" className="text-xs">{activity.symbol}</Badge>
                        </div>
                        <div className="text-sm text-gray-400">{activity.details}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}