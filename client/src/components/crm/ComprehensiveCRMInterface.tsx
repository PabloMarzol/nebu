import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare, 
  Settings,
  BarChart3,
  Shield,
  Zap,
  Target,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface CRMSystemStatus {
  name: string;
  status: 'operational' | 'warning' | 'error';
  completion: number;
  description: string;
  location: 'main' | 'subdomain';
  frontend: boolean;
  backend: boolean;
}

export default function ComprehensiveCRMInterface() {
  const [crmSystems] = useState<CRMSystemStatus[]>([
    // Client-Facing CRM (Main Platform)
    {
      name: 'Client Portal',
      status: 'operational',
      completion: 95,
      description: 'Personal account management and portfolio overview',
      location: 'main',
      frontend: true,
      backend: true
    },
    {
      name: 'Support Center',
      status: 'operational',
      completion: 90,
      description: 'Public support access and live chat',
      location: 'main',
      frontend: true,
      backend: true
    },
    {
      name: 'AI Assistant',
      status: 'operational',
      completion: 85,
      description: 'Personal trading recommendations and guidance',
      location: 'main',
      frontend: true,
      backend: true
    },
    
    // Admin/Management CRM (Subdomains)
    {
      name: 'Analytics & Reporting',
      status: 'warning',
      completion: 70,
      description: 'Platform-wide metrics and business intelligence',
      location: 'subdomain',
      frontend: false,
      backend: true
    },
    {
      name: 'Customer Database',
      status: 'warning',
      completion: 75,
      description: 'Complete customer lifecycle management',
      location: 'subdomain',
      frontend: false,
      backend: true
    },
    {
      name: 'Business Management',
      status: 'warning',
      completion: 65,
      description: 'Operational process and workflow management',
      location: 'subdomain',
      frontend: false,
      backend: true
    },
    {
      name: 'Operations Dashboard',
      status: 'operational',
      completion: 80,
      description: 'Real-time system monitoring and health tracking',
      location: 'subdomain',
      frontend: true,
      backend: true
    },
    {
      name: 'Compliance Dashboard',
      status: 'warning',
      completion: 60,
      description: 'Regulatory compliance and AML monitoring',
      location: 'subdomain',
      frontend: false,
      backend: true
    },
    {
      name: 'Trading Operations',
      status: 'operational',
      completion: 85,
      description: 'Exchange-specific operations and monitoring',
      location: 'subdomain',
      frontend: true,
      backend: true
    },
    {
      name: 'Treasury Panel',
      status: 'warning',
      completion: 70,
      description: 'Multi-currency balance and treasury management',
      location: 'subdomain',
      frontend: false,
      backend: true
    },
    {
      name: 'User Roles Management',
      status: 'warning',
      completion: 55,
      description: 'Role-based access controls and permissions',
      location: 'subdomain',
      frontend: false,
      backend: true
    }
  ]);

  const [stats, setStats] = useState({
    total: 0,
    operational: 0,
    warning: 0,
    error: 0,
    avgCompletion: 0,
    frontendComplete: 0,
    backendComplete: 0
  });

  useEffect(() => {
    const total = crmSystems.length;
    const operational = crmSystems.filter(s => s.status === 'operational').length;
    const warning = crmSystems.filter(s => s.status === 'warning').length;
    const error = crmSystems.filter(s => s.status === 'error').length;
    const avgCompletion = Math.round(crmSystems.reduce((acc, s) => acc + s.completion, 0) / total);
    const frontendComplete = crmSystems.filter(s => s.frontend).length;
    const backendComplete = crmSystems.filter(s => s.backend).length;

    setStats({ total, operational, warning, error, avgCompletion, frontendComplete, backendComplete });
  }, [crmSystems]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'error': return 'bg-red-500/20 border-red-500/30 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const mainPlatformSystems = crmSystems.filter(s => s.location === 'main');
  const subdomainSystems = crmSystems.filter(s => s.location === 'subdomain');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Comprehensive CRM System Analysis
        </h1>
        <p className="text-gray-400">
          Complete audit of all CRM systems, frontend interfaces, and operational status
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
            <div className="text-sm text-gray-400">Total CRM Systems</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.operational}</div>
            <div className="text-sm text-gray-400">Operational</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.warning}</div>
            <div className="text-sm text-gray-400">Need Frontend</div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{stats.avgCompletion}%</div>
            <div className="text-sm text-gray-400">Avg Completion</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="main-platform">Main Platform</TabsTrigger>
          <TabsTrigger value="subdomains">Subdomains</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Implementation Status */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Implementation Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Frontend Interfaces</span>
                    <span className="text-white">{stats.frontendComplete}/{stats.total}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(stats.frontendComplete / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Backend APIs</span>
                    <span className="text-white">{stats.backendComplete}/{stats.total}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.backendComplete / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="text-sm font-medium text-red-400">LP Provider Missing</div>
                    <div className="text-xs text-gray-400">MANDATORY for professional exchange</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-sm font-medium text-yellow-400">Frontend Interfaces Incomplete</div>
                    <div className="text-xs text-gray-400">{stats.total - stats.frontendComplete} systems need frontend</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <Target className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-medium text-blue-400">Mobile Apps 70% Complete</div>
                    <div className="text-xs text-gray-400">CRM integration needed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="main-platform" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-2">Client-Facing CRM Systems</h3>
            <p className="text-gray-400">These systems remain on the main platform for client access</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainPlatformSystems.map((system, index) => (
              <Card key={index} className={`glass border ${getStatusColor(system.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(system.status)}
                      <span className="font-medium text-white">{system.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {system.completion}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{system.description}</p>
                  <div className="flex gap-2">
                    <Badge variant={system.frontend ? 'default' : 'secondary'} className="text-xs">
                      Frontend: {system.frontend ? 'Ready' : 'Missing'}
                    </Badge>
                    <Badge variant={system.backend ? 'default' : 'secondary'} className="text-xs">
                      Backend: {system.backend ? 'Ready' : 'Missing'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subdomains" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-2">Internal Operations CRM</h3>
            <p className="text-gray-400">These systems should be moved to specialized subdomains</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subdomainSystems.map((system, index) => (
              <Card key={index} className={`glass border ${getStatusColor(system.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(system.status)}
                      <span className="font-medium text-white">{system.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {system.completion}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{system.description}</p>
                  <div className="flex gap-2">
                    <Badge variant={system.frontend ? 'default' : 'secondary'} className="text-xs">
                      Frontend: {system.frontend ? 'Ready' : 'Missing'}
                    </Badge>
                    <Badge variant={system.backend ? 'default' : 'secondary'} className="text-xs">
                      Backend: {system.backend ? 'Ready' : 'Missing'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Immediate Actions */}
            <Card className="glass border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Zap className="w-5 h-5" />
                  Immediate Actions Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <div className="font-medium text-red-400">Integrate LP Provider</div>
                      <div className="text-sm text-gray-400">MANDATORY for professional exchange operations</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <div className="font-medium text-yellow-400">Complete Frontend Interfaces</div>
                      <div className="text-sm text-gray-400">8 systems need frontend implementation</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <div className="font-medium text-blue-400">Finalize Mobile Apps</div>
                      <div className="text-sm text-gray-400">Complete CRM integration and deploy</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subdomain Migration Plan */}
            <Card className="glass border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Settings className="w-5 h-5" />
                  Subdomain Migration Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="font-medium text-purple-400 mb-1">admin.nebulax.exchange</div>
                    <div className="text-sm text-gray-400">Analytics, Compliance, User Management</div>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="font-medium text-purple-400 mb-1">crm.nebulax.exchange</div>
                    <div className="text-sm text-gray-400">Business CRM, Sales, Marketing</div>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="font-medium text-purple-400 mb-1">ops.nebulax.exchange</div>
                    <div className="text-sm text-gray-400">Operations, Trading, Treasury</div>
                  </div>
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="font-medium text-purple-400 mb-1">support.nebulax.exchange</div>
                    <div className="text-sm text-gray-400">Internal Support Management</div>
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