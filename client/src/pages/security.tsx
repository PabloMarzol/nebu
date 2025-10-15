import { useState, useEffect } from "react";
import MobileSecurityDashboard from "@/components/security/mobile-security-dashboard";
import ProtectedTradingWrapper from "@/components/auth/protected-trading-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Users, 
  Settings, 
  Eye,
  Share2,
  TrendingUp,
  AlertTriangle,
  Zap,
  Target,
  Award,
  Globe,
  Lock,
  Activity,
  BarChart3,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  CheckCircle,
  Smartphone,
  Monitor
} from "lucide-react";

interface UserPermissions {
  canViewLogs: boolean;
  canManageUsers: boolean;
  canModifySettings: boolean;
  canExportData: boolean;
  securityLevel: 'basic' | 'standard' | 'advanced' | 'enterprise';
  alertThreshold: number;
}

interface ThreatData {
  id: string;
  type: 'malware' | 'phishing' | 'ddos' | 'intrusion' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  timestamp: Date;
  status: 'active' | 'blocked' | 'investigating';
}

interface PortfolioRisk {
  symbol: string;
  allocation: number;
  riskScore: number;
  volatility: number;
  correlation: number;
  recommendation: 'hold' | 'reduce' | 'increase' | 'sell';
}

function ResponsiveSecurityDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [permissions, setPermissions] = useState<UserPermissions>({
    canViewLogs: true,
    canManageUsers: false,
    canModifySettings: true,
    canExportData: true,
    securityLevel: 'advanced',
    alertThreshold: 75
  });

  const mockThreats: ThreatData[] = [
    {
      id: '1',
      type: 'malware',
      severity: 'high',
      source: '192.168.1.100',
      target: 'api.nebulax.com',
      timestamp: new Date(),
      status: 'active'
    },
    {
      id: '2',
      type: 'ddos',
      severity: 'critical',
      source: '10.0.0.50',
      target: 'trading.nebulax.com',
      timestamp: new Date(),
      status: 'blocked'
    },
    {
      id: '3',
      type: 'intrusion',
      severity: 'medium',
      source: '172.16.1.20',
      target: 'auth.nebulax.com',
      timestamp: new Date(),
      status: 'investigating'
    }
  ];

  const mockPortfolioRisk: PortfolioRisk[] = [
    { symbol: 'BTC', allocation: 40, riskScore: 65, volatility: 3.2, correlation: 0.1, recommendation: 'hold' },
    { symbol: 'ETH', allocation: 30, riskScore: 72, volatility: 4.1, correlation: 0.7, recommendation: 'reduce' },
    { symbol: 'SOL', allocation: 15, riskScore: 85, volatility: 6.8, correlation: 0.6, recommendation: 'sell' },
    { symbol: 'ADA', allocation: 15, riskScore: 58, volatility: 2.9, correlation: 0.4, recommendation: 'increase' }
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    return <MobileSecurityDashboard />;
  }

  // Desktop Security Dashboard
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="h-6 w-6 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Desktop Security Center</h2>
            <p className="text-slate-400">Enterprise-grade security management</p>
          </div>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Advanced Mode
        </Badge>
      </div>

      <Tabs defaultValue="permissions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="threats">Threat Monitor</TabsTrigger>
          <TabsTrigger value="portfolio">Risk Analysis</TabsTrigger>
          <TabsTrigger value="reports">Security Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Security Permissions & Settings
              </CardTitle>
              <CardDescription>Configure your security access levels and monitoring preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Access Controls</h3>
                  
                  <div className="security-toggle-container flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/30">
                    <div className="flex-1" onClick={() => setPermissions({ ...permissions, canViewLogs: !permissions.canViewLogs })}>
                      <Label className="text-sm font-medium cursor-pointer">View Security Logs</Label>
                      <p className="text-xs text-slate-400 mt-1">Access to detailed security event logs</p>
                    </div>
                    <div className="relative ml-4">
                      <Switch
                        checked={permissions.canViewLogs}
                        onCheckedChange={(checked) => setPermissions({ ...permissions, canViewLogs: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="security-toggle-container flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/30">
                    <div className="flex-1" onClick={() => setPermissions({ ...permissions, canManageUsers: !permissions.canManageUsers })}>
                      <Label className="text-sm font-medium cursor-pointer">Manage User Access</Label>
                      <p className="text-xs text-slate-400 mt-1">Control other users' security permissions</p>
                    </div>
                    <div className="relative ml-4">
                      <Switch
                        checked={permissions.canManageUsers}
                        onCheckedChange={(checked) => setPermissions({ ...permissions, canManageUsers: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="security-toggle-container flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/30">
                    <div className="flex-1" onClick={() => setPermissions({ ...permissions, canModifySettings: !permissions.canModifySettings })}>
                      <Label className="text-sm font-medium cursor-pointer">Modify Security Settings</Label>
                      <p className="text-xs text-slate-400 mt-1">Change security configuration and policies</p>
                    </div>
                    <div className="relative ml-4">
                      <Switch
                        checked={permissions.canModifySettings}
                        onCheckedChange={(checked) => setPermissions({ ...permissions, canModifySettings: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="security-toggle-container flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/30">
                    <div className="flex-1" onClick={() => setPermissions({ ...permissions, canExportData: !permissions.canExportData })}>
                      <Label className="text-sm font-medium cursor-pointer">Export Security Data</Label>
                      <p className="text-xs text-slate-400 mt-1">Download security reports and analytics</p>
                    </div>
                    <div className="relative ml-4">
                      <Switch
                        checked={permissions.canExportData}
                        onCheckedChange={(checked) => setPermissions({ ...permissions, canExportData: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Security Configuration</h3>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Security Level</Label>
                    <Select
                      value={permissions.securityLevel}
                      onValueChange={(value: any) => setPermissions({ ...permissions, securityLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-green-500" />
                            Basic - Essential monitoring
                          </div>
                        </SelectItem>
                        <SelectItem value="standard">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-500" />
                            Standard - Enhanced protection
                          </div>
                        </SelectItem>
                        <SelectItem value="advanced">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-purple-500" />
                            Advanced - Professional security
                          </div>
                        </SelectItem>
                        <SelectItem value="enterprise">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-yellow-500" />
                            Enterprise - Maximum protection
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Alert Threshold</Label>
                      <Badge variant="secondary">{permissions.alertThreshold}%</Badge>
                    </div>
                    <Slider
                      value={[permissions.alertThreshold]}
                      onValueChange={([value]) => setPermissions({ ...permissions, alertThreshold: value })}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Receive alerts when threat level exceeds this threshold
                    </p>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-medium text-blue-400 mb-2">Current Status</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-400">Security Level:</span>
                        <span className="ml-2 text-white capitalize">{permissions.securityLevel}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Alert Threshold:</span>
                        <span className="ml-2 text-white">{permissions.alertThreshold}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Real-time Threat Monitoring
              </CardTitle>
              <CardDescription>Live security threat detection and response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {mockThreats.map((threat) => (
                    <motion.div
                      key={threat.id}
                      className="p-4 bg-slate-800/30 rounded-lg border border-slate-600"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${
                            threat.severity === 'critical' ? 'bg-red-500' :
                            threat.severity === 'high' ? 'bg-orange-500' :
                            threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          } ${threat.status === 'active' ? 'animate-pulse' : ''}`} />
                          <h4 className="font-medium capitalize text-white">{threat.type} Threat</h4>
                        </div>
                        <Badge variant={threat.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {threat.severity}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Source:</span>
                          <span className="ml-2 text-white">{threat.source}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Target:</span>
                          <span className="ml-2 text-white">{threat.target}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Status:</span>
                          <span className="ml-2 text-white capitalize">{threat.status}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Time:</span>
                          <span className="ml-2 text-white">{threat.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium text-white mb-3">Threat Summary</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Active Threats</span>
                        <span className="text-red-400 font-bold">
                          {mockThreats.filter(t => t.status === 'active').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Blocked</span>
                        <span className="text-green-400 font-bold">
                          {mockThreats.filter(t => t.status === 'blocked').length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Investigating</span>
                        <span className="text-yellow-400 font-bold">
                          {mockThreats.filter(t => t.status === 'investigating').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Portfolio Risk Analysis
              </CardTitle>
              <CardDescription>AI-powered cryptocurrency portfolio risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-2">67.8</div>
                  <div className="text-sm text-slate-400 mb-2">Overall Risk Score</div>
                  <Badge variant="secondary">MEDIUM RISK</Badge>
                </div>

                <div className="lg:col-span-3 space-y-4">
                  {mockPortfolioRisk.map((asset) => (
                    <div key={asset.symbol} className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-white text-lg">{asset.symbol}</span>
                          <Badge variant="outline">{asset.allocation.toFixed(1)}%</Badge>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-medium ${
                            asset.riskScore > 80 ? 'text-red-400' : 
                            asset.riskScore > 60 ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {asset.riskScore.toFixed(1)}
                          </div>
                          <div className="text-xs text-slate-400">Risk Score</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Volatility:</span>
                          <span className="ml-2 text-white">{asset.volatility.toFixed(2)}%</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Correlation:</span>
                          <span className="ml-2 text-white">{asset.correlation.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-end">
                          <Badge 
                            variant={asset.recommendation === 'sell' ? 'destructive' : 
                                    asset.recommendation === 'reduce' ? 'secondary' : 'default'}
                          >
                            {asset.recommendation.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Security Reports & Achievements
              </CardTitle>
              <CardDescription>Security milestones and comprehensive reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Recent Achievements</h3>
                  
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">🛡️</div>
                      <div>
                        <h4 className="font-medium text-white">Security Guardian</h4>
                        <p className="text-sm text-slate-400">Monitored security for 30 consecutive days</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-500">RARE</Badge>
                      <span className="text-sm text-slate-400">500 points</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <h4 className="font-medium text-white">Threat Hunter</h4>
                        <p className="text-sm text-slate-400">Identified and reported 10 security threats</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-500">EPIC</Badge>
                      <span className="text-sm text-slate-400">1000 points</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Export Reports</h3>
                  
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Security Event Log (Last 30 days)
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Risk Assessment Report
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Compliance Summary
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Performance Analytics
                    </Button>
                  </div>

                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <h4 className="font-medium text-green-400 mb-2">Security Health</h4>
                    <p className="text-sm text-slate-300">
                      Your security posture is excellent. All systems are functioning optimally 
                      with no critical vulnerabilities detected.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Security() {
  return (
    <div className="container mx-auto px-4 py-4 pt-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🛡️ Advanced Security Center</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive security management with adaptive mobile interface
          </p>
        </div>

        <ProtectedTradingWrapper feature="trading">
          <ResponsiveSecurityDashboard />
        </ProtectedTradingWrapper>
      </div>
    </div>
  );
}