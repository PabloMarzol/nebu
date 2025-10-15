import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  ChevronDown,
  Smartphone
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
  location: { x: number; y: number; z: number };
}

interface PortfolioRisk {
  symbol: string;
  allocation: number;
  riskScore: number;
  volatility: number;
  correlation: number;
  recommendation: 'hold' | 'reduce' | 'increase' | 'sell';
}

interface SecurityAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

function MobilePermissionSettings({ permissions, onUpdate }: { 
  permissions: UserPermissions; 
  onUpdate: (permissions: UserPermissions) => void;
}) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Smartphone className="h-5 w-5" />
          Security Permissions
        </CardTitle>
        <CardDescription className="text-sm">Tap to configure your security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Mobile-optimized permission toggles */}
        <div className="space-y-3">
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium text-white">View Security Logs</Label>
                <p className="text-xs text-slate-400 mt-1 truncate">Access detailed security events</p>
              </div>
              <Switch
                checked={permissions.canViewLogs}
                onCheckedChange={(checked) => onUpdate({ ...permissions, canViewLogs: checked })}
                className="ml-3 flex-shrink-0"
              />
            </div>
          </div>
          
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium text-white">Manage Users</Label>
                <p className="text-xs text-slate-400 mt-1 truncate">Control user permissions</p>
              </div>
              <Switch
                checked={permissions.canManageUsers}
                onCheckedChange={(checked) => onUpdate({ ...permissions, canManageUsers: checked })}
                className="ml-3 flex-shrink-0"
              />
            </div>
          </div>
          
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium text-white">Modify Settings</Label>
                <p className="text-xs text-slate-400 mt-1 truncate">Change security configuration</p>
              </div>
              <Switch
                checked={permissions.canModifySettings}
                onCheckedChange={(checked) => onUpdate({ ...permissions, canModifySettings: checked })}
                className="ml-3 flex-shrink-0"
              />
            </div>
          </div>
          
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <Label className="text-sm font-medium text-white">Export Data</Label>
                <p className="text-xs text-slate-400 mt-1 truncate">Download security reports</p>
              </div>
              <Switch
                checked={permissions.canExportData}
                onCheckedChange={(checked) => onUpdate({ ...permissions, canExportData: checked })}
                className="ml-3 flex-shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Mobile-optimized security level selector */}
        <div className="space-y-3 mt-4">
          <Label className="text-sm font-medium text-white">Security Level</Label>
          <Select
            value={permissions.securityLevel}
            onValueChange={(value: any) => onUpdate({ ...permissions, securityLevel: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  Basic
                </div>
              </SelectItem>
              <SelectItem value="standard">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Standard
                </div>
              </SelectItem>
              <SelectItem value="advanced">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  Advanced
                </div>
              </SelectItem>
              <SelectItem value="enterprise">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-yellow-500" />
                  Enterprise
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile-optimized alert threshold */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-white">Alert Threshold</Label>
            <Badge variant="secondary" className="text-xs">
              {permissions.alertThreshold}%
            </Badge>
          </div>
          <Slider
            value={[permissions.alertThreshold]}
            onValueChange={([value]) => onUpdate({ ...permissions, alertThreshold: value })}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-slate-400">
            Get alerts when threat level exceeds this threshold
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function MobileThreatVisualization({ threats }: { threats: ThreatData[] }) {
  const [selectedThreat, setSelectedThreat] = useState<ThreatData | null>(null);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="h-5 w-5" />
          Threat Monitor
        </CardTitle>
        <CardDescription className="text-sm">Real-time security threats</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile-optimized threat list */}
        <div className="space-y-3">
          {threats.map((threat) => (
            <motion.div
              key={threat.id}
              className="p-3 bg-slate-800/30 rounded-lg border border-slate-600 cursor-pointer"
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedThreat(selectedThreat?.id === threat.id ? null : threat)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    threat.severity === 'critical' ? 'bg-red-500' :
                    threat.severity === 'high' ? 'bg-orange-500' :
                    threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  } ${threat.status === 'active' ? 'animate-pulse' : ''}`} />
                  <div>
                    <p className="text-sm font-medium text-white capitalize">{threat.type}</p>
                    <p className="text-xs text-slate-400">{threat.source}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={threat.severity === 'critical' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {threat.severity}
                  </Badge>
                  <ChevronDown className={`h-4 w-4 transition-transform ${
                    selectedThreat?.id === threat.id ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>
              
              <AnimatePresence>
                {selectedThreat?.id === threat.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-slate-600"
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400">Target:</span>
                        <p className="text-white font-medium">{threat.target}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <p className="text-white font-medium capitalize">{threat.status}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400">Time:</span>
                        <p className="text-white font-medium">{threat.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Mobile threat summary */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Security Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-slate-800/30 rounded">
              <p className="text-slate-400">Active Threats</p>
              <p className="text-lg font-bold text-red-400">
                {threats.filter(t => t.status === 'active').length}
              </p>
            </div>
            <div className="text-center p-2 bg-slate-800/30 rounded">
              <p className="text-slate-400">Blocked</p>
              <p className="text-lg font-bold text-green-400">
                {threats.filter(t => t.status === 'blocked').length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MobilePortfolioRisk({ portfolioData }: { portfolioData: PortfolioRisk[] }) {
  const calculateOverallRisk = () => {
    if (!portfolioData.length) return 0;
    const totalRisk = portfolioData.reduce((sum, asset) => sum + (asset.riskScore * asset.allocation), 0);
    const totalAllocation = portfolioData.reduce((sum, asset) => sum + asset.allocation, 0);
    return totalAllocation > 0 ? totalRisk / totalAllocation : 0;
  };

  const overallRisk = calculateOverallRisk();
  const riskLevel = overallRisk > 80 ? 'high' : overallRisk > 60 ? 'medium' : 'low';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5" />
          Portfolio Risk
        </CardTitle>
        <CardDescription className="text-sm">AI-powered risk analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mobile risk score display */}
        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
          <div className="text-2xl font-bold text-white mb-1">
            {overallRisk.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400 mb-2">Overall Risk Score</div>
          <Badge 
            variant={riskLevel === 'high' ? 'destructive' : riskLevel === 'medium' ? 'secondary' : 'default'}
            className="text-xs"
          >
            {riskLevel.toUpperCase()} RISK
          </Badge>
        </div>

        {/* Mobile asset list */}
        <div className="space-y-2">
          {portfolioData.map((asset) => (
            <div key={asset.symbol} className="p-3 bg-slate-800/30 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{asset.symbol}</span>
                  <Badge variant="outline" className="text-xs">{asset.allocation.toFixed(1)}%</Badge>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    asset.riskScore > 80 ? 'text-red-400' : 
                    asset.riskScore > 60 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {asset.riskScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">Risk</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Vol: {asset.volatility.toFixed(1)}%
                </div>
                <Badge 
                  variant={asset.recommendation === 'sell' ? 'destructive' : 
                          asset.recommendation === 'reduce' ? 'secondary' : 'default'}
                  className="text-xs"
                >
                  {asset.recommendation.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MobileSecurityDashboard() {
  const [permissions, setPermissions] = useState<UserPermissions>({
    canViewLogs: true,
    canManageUsers: false,
    canModifySettings: true,
    canExportData: true,
    securityLevel: 'advanced',
    alertThreshold: 75
  });

  // Mock data for mobile display
  const mockThreats: ThreatData[] = [
    {
      id: '1',
      type: 'malware',
      severity: 'high',
      source: '192.168.1.100',
      target: 'api.nebulaxexchange.io',
      timestamp: new Date(),
      status: 'active',
      location: { x: 25, y: 30, z: 0 }
    },
    {
      id: '2',
      type: 'ddos',
      severity: 'critical',
      source: '10.0.0.50',
      target: 'trading.nebulaxexchange.io',
      timestamp: new Date(),
      status: 'blocked',
      location: { x: 75, y: 60, z: 0 }
    },
    {
      id: '3',
      type: 'intrusion',
      severity: 'medium',
      source: '172.16.1.20',
      target: 'auth.nebulaxexchange.io',
      timestamp: new Date(),
      status: 'investigating',
      location: { x: 50, y: 80, z: 0 }
    }
  ];

  const mockPortfolioRisk: PortfolioRisk[] = [
    { symbol: 'BTC', allocation: 40, riskScore: 65, volatility: 3.2, correlation: 0.1, recommendation: 'hold' },
    { symbol: 'ETH', allocation: 30, riskScore: 72, volatility: 4.1, correlation: 0.7, recommendation: 'reduce' },
    { symbol: 'SOL', allocation: 15, riskScore: 85, volatility: 6.8, correlation: 0.6, recommendation: 'sell' },
    { symbol: 'ADA', allocation: 15, riskScore: 58, volatility: 2.9, correlation: 0.4, recommendation: 'increase' }
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Tabs defaultValue="permissions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="permissions" className="text-xs">Settings</TabsTrigger>
          <TabsTrigger value="threats" className="text-xs">Threats</TabsTrigger>
          <TabsTrigger value="portfolio" className="text-xs">Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4">
          <MobilePermissionSettings 
            permissions={permissions} 
            onUpdate={setPermissions} 
          />
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <MobileThreatVisualization threats={mockThreats} />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <MobilePortfolioRisk portfolioData={mockPortfolioRisk} />
        </TabsContent>
      </Tabs>
    </div>
  );
}