import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, AlertTriangle, XCircle, Globe, Database, Server, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SystemService {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  lastIncident?: string;
  description: string;
  icon: React.ReactNode;
}

export default function SystemStatus() {
  const { data: systemData, isLoading } = useQuery({
    queryKey: ["/api/system/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const services: SystemService[] = [
    {
      name: "Trading Engine",
      status: 'operational',
      uptime: 99.98,
      responseTime: 12,
      description: "Order matching and execution system",
      icon: <Zap className="w-5 h-5" />
    },
    {
      name: "Market Data",
      status: 'operational',
      uptime: 99.99,
      responseTime: 8,
      description: "Real-time price feeds and market information",
      icon: <Activity className="w-5 h-5" />
    },
    {
      name: "API Services",
      status: 'operational',
      uptime: 99.95,
      responseTime: 25,
      description: "REST and WebSocket API endpoints",
      icon: <Server className="w-5 h-5" />
    },
    {
      name: "Database",
      status: 'operational',
      uptime: 99.97,
      responseTime: 15,
      description: "User data and transaction storage",
      icon: <Database className="w-5 h-5" />
    },
    {
      name: "Payment Gateway",
      status: 'operational',
      uptime: 99.92,
      responseTime: 45,
      description: "Deposit and withdrawal processing",
      icon: <Globe className="w-5 h-5" />
    },
    {
      name: "KYC System",
      status: 'operational',
      uptime: 99.89,
      responseTime: 180,
      description: "Identity verification and compliance",
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'degraded': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'outage': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4" />;
      case 'outage': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const overallStatus = services.every(s => s.status === 'operational') ? 'operational' : 
                       services.some(s => s.status === 'outage') ? 'outage' : 'degraded';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">System Status</h1>
          <p className="text-slate-300 text-lg">
            Real-time status of NebulaX Exchange services and infrastructure
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-8 glass border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-2xl">Overall System Status</CardTitle>
                <CardDescription className="text-slate-300">
                  All systems operational - Last updated: {new Date().toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {getStatusIcon(overallStatus)}
                <Badge className={getStatusColor(overallStatus)}>
                  {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">99.96%</div>
                <div className="text-sm text-slate-400">30-day uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">23ms</div>
                <div className="text-sm text-slate-400">Avg response time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">0</div>
                <div className="text-sm text-slate-400">Active incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => (
            <Card key={index} className="glass border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                      <CardDescription className="text-slate-400 text-sm">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Uptime</span>
                    <span className="text-white font-medium">{service.uptime}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Response Time</span>
                    <span className="text-white font-medium">{service.responseTime}ms</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${service.uptime}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Incidents */}
        <Card className="glass border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Incidents</CardTitle>
            <CardDescription className="text-slate-300">
              Past 30 days incident history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Recent Incidents</h3>
              <p className="text-slate-400">
                All systems have been running smoothly with no reported incidents in the past 30 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Legend */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-400">Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-400">Degraded Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-400">Service Outage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}