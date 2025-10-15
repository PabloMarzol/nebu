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
  CheckCircle
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

function UserPermissionSettings({ permissions, onUpdate }: { 
  permissions: UserPermissions; 
  onUpdate: (permissions: UserPermissions) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Security Permissions
        </CardTitle>
        <CardDescription>Customize your security access level and monitoring preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium">View Security Logs</Label>
              <p className="text-xs text-muted-foreground">Access to detailed security event logs</p>
            </div>
            <Switch
              checked={permissions.canViewLogs}
              onCheckedChange={(checked) => onUpdate({ ...permissions, canViewLogs: checked })}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium">Manage User Access</Label>
              <p className="text-xs text-muted-foreground">Control other users' security permissions</p>
            </div>
            <Switch
              checked={permissions.canManageUsers}
              onCheckedChange={(checked) => onUpdate({ ...permissions, canManageUsers: checked })}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium">Modify Security Settings</Label>
              <p className="text-xs text-muted-foreground">Change security configuration and policies</p>
            </div>
            <Switch
              checked={permissions.canModifySettings}
              onCheckedChange={(checked) => onUpdate({ ...permissions, canModifySettings: checked })}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <Label className="text-sm font-medium">Export Security Data</Label>
              <p className="text-xs text-muted-foreground">Download security reports and analytics</p>
            </div>
            <Switch
              checked={permissions.canExportData}
              onCheckedChange={(checked) => onUpdate({ ...permissions, canExportData: checked })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Security Level</Label>
          <Select
            value={permissions.securityLevel}
            onValueChange={(value: any) => onUpdate({ ...permissions, securityLevel: value })}
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
          <Label className="text-sm font-medium">Alert Threshold: {permissions.alertThreshold}%</Label>
          <Slider
            value={[permissions.alertThreshold]}
            onValueChange={([value]) => onUpdate({ ...permissions, alertThreshold: value })}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Receive alerts when threat level exceeds this threshold
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ThreatVisualization3D({ threats }: { threats: ThreatData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedThreat, setSelectedThreat] = useState<ThreatData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw network grid
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw threats as nodes
    threats.forEach((threat, index) => {
      const x = (threat.location.x * canvas.width) / 100;
      const y = (threat.location.y * canvas.height) / 100;
      const size = threat.severity === 'critical' ? 12 : threat.severity === 'high' ? 10 : 8;

      // Threat color based on severity
      const colors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#f97316',
        critical: '#ef4444'
      };

      // Draw threat node
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fillStyle = colors[threat.severity];
      ctx.fill();

      // Add pulsing effect for active threats
      if (threat.status === 'active') {
        const pulseSize = size + Math.sin(Date.now() * 0.01 + index) * 3;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, 2 * Math.PI);
        ctx.strokeStyle = colors[threat.severity];
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw connections between related threats
      threats.forEach((otherThreat, otherIndex) => {
        if (otherIndex <= index) return;
        
        const otherX = (otherThreat.location.x * canvas.width) / 100;
        const otherY = (otherThreat.location.y * canvas.height) / 100;
        const distance = Math.sqrt((x - otherX) ** 2 + (y - otherY) ** 2);
        
        if (distance < 100 && threat.type === otherThreat.type) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(otherX, otherY);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Add labels
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px sans-serif';
      ctx.fillText(threat.type, x + 15, y - 5);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
    };
    animate();
  }, [threats]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Real-time Threat Visualization
        </CardTitle>
        <CardDescription>3D network visualization of security threats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-80 bg-slate-900 rounded-lg border border-slate-700 cursor-crosshair"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              
              const clickedThreat = threats.find(threat => 
                Math.abs(threat.location.x - x) < 5 && Math.abs(threat.location.y - y) < 5
              );
              
              if (clickedThreat) {
                setSelectedThreat(clickedThreat);
              }
            }}
          />
          
          {/* Threat Legend */}
          <div className="absolute top-2 right-2 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
            <div className="text-xs font-medium text-slate-300">Threat Levels</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-400">Low</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-slate-400">Medium</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-slate-400">High</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-400">Critical</span>
            </div>
          </div>
        </div>

        {/* Selected Threat Details */}
        <AnimatePresence>
          {selectedThreat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium capitalize">{selectedThreat.type} Threat</h4>
                <Badge variant={selectedThreat.severity === 'critical' ? 'destructive' : 'secondary'}>
                  {selectedThreat.severity}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Source:</span>
                  <span className="ml-2">{selectedThreat.source}</span>
                </div>
                <div>
                  <span className="text-slate-400">Target:</span>
                  <span className="ml-2">{selectedThreat.target}</span>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <span className="ml-2 capitalize">{selectedThreat.status}</span>
                </div>
                <div>
                  <span className="text-slate-400">Time:</span>
                  <span className="ml-2">{selectedThreat.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function PortfolioRiskScoring({ portfolioData }: { portfolioData: PortfolioRisk[] }) {
  const calculateOverallRisk = () => {
    if (!portfolioData.length) return 0;
    const totalRisk = portfolioData.reduce((sum, asset) => sum + (asset.riskScore * asset.allocation), 0);
    const totalAllocation = portfolioData.reduce((sum, asset) => sum + asset.allocation, 0);
    return totalAllocation > 0 ? totalRisk / totalAllocation : 0;
  };

  const overallRisk = calculateOverallRisk();
  const riskLevel = overallRisk > 80 ? 'high' : overallRisk > 60 ? 'medium' : 'low';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Portfolio Risk Analysis
        </CardTitle>
        <CardDescription>Cryptocurrency portfolio risk scoring algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Risk Score */}
        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
          <div className="text-3xl font-bold text-white mb-2">
            {overallRisk.toFixed(1)}
          </div>
          <div className="text-sm text-slate-400">Overall Risk Score</div>
          <Badge 
            variant={riskLevel === 'high' ? 'destructive' : riskLevel === 'medium' ? 'secondary' : 'default'}
            className="mt-2"
          >
            {riskLevel.toUpperCase()} RISK
          </Badge>
        </div>

        {/* Individual Asset Risk */}
        <div className="space-y-3">
          <h4 className="font-medium">Asset Risk Breakdown</h4>
          {portfolioData.map((asset) => (
            <motion.div
              key={asset.symbol}
              className="p-3 bg-slate-800/30 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{asset.symbol}</span>
                  <Badge variant="outline">{asset.allocation.toFixed(1)}%</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Risk:</span>
                  <span className={`font-medium ${
                    asset.riskScore > 80 ? 'text-red-400' : 
                    asset.riskScore > 60 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {asset.riskScore.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Volatility:</span>
                  <span className="ml-2">{asset.volatility.toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-slate-400">Correlation:</span>
                  <span className="ml-2">{asset.correlation.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">Recommendation:</span>
                <Badge 
                  variant={asset.recommendation === 'sell' ? 'destructive' : 
                          asset.recommendation === 'reduce' ? 'secondary' : 'default'}
                >
                  {asset.recommendation.toUpperCase()}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Risk Recommendations */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="font-medium text-blue-400 mb-2">Risk Recommendations</h4>
          <ul className="text-sm text-slate-300 space-y-1">
            {overallRisk > 80 && (
              <li>• Consider reducing high-risk asset allocations</li>
            )}
            {overallRisk > 60 && (
              <li>• Diversify portfolio across different asset classes</li>
            )}
            <li>• Monitor correlation levels between assets</li>
            <li>• Set stop-loss orders for volatile positions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySocialSharing({ achievements }: { achievements: SecurityAchievement[] }) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const shareAchievement = async (achievement: SecurityAchievement, platform: string) => {
    const shareText = `🏆 Just unlocked "${achievement.title}" on NebulaX Security! ${achievement.description} #CyberSecurity #Achievement`;
    
    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(shareText);
        setShareStatus('Copied to clipboard!');
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
        setShareStatus('Shared to Twitter!');
      } else if (platform === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
        setShareStatus('Shared to LinkedIn!');
      }
      
      setTimeout(() => setShareStatus(null), 3000);
    } catch (error) {
      setShareStatus('Failed to share');
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Security Achievements
        </CardTitle>
        <CardDescription>Share your security milestones with the community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            className="p-4 bg-slate-800/50 rounded-lg border border-slate-600"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-slate-400">{achievement.description}</p>
                </div>
              </div>
              <Badge 
                variant={achievement.rarity === 'legendary' ? 'default' : 'secondary'}
                className={
                  achievement.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
                  achievement.rarity === 'epic' ? 'bg-purple-500' :
                  achievement.rarity === 'rare' ? 'bg-blue-500' : ''
                }
              >
                {achievement.rarity}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Award className="h-4 w-4" />
                <span>{achievement.points} points</span>
                <span>•</span>
                <span>{achievement.unlockedAt.toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => shareAchievement(achievement, 'twitter')}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => shareAchievement(achievement, 'linkedin')}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => shareAchievement(achievement, 'copy')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Share Status */}
        <AnimatePresence>
          {shareStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
            >
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">{shareStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function PersonalSecurityRecommendations({ userLevel, riskProfile }: { 
  userLevel: number; 
  riskProfile: string;
}) {
  const getRecommendations = () => {
    const recommendations = [];

    if (userLevel < 5) {
      recommendations.push({
        id: 1,
        title: "Enable Two-Factor Authentication",
        description: "Add an extra layer of security to your account",
        priority: "high",
        action: "Setup 2FA now",
        icon: Lock
      });
    }

    if (riskProfile === 'high') {
      recommendations.push({
        id: 2,
        title: "Review Portfolio Diversification",
        description: "Your current portfolio shows high risk concentration",
        priority: "medium",
        action: "Rebalance portfolio",
        icon: BarChart3
      });
    }

    recommendations.push({
      id: 3,
      title: "Update Security Preferences",
      description: "Customize your security monitoring based on your activity",
      priority: "low",
      action: "Configure settings",
      icon: Settings
    });

    recommendations.push({
      id: 4,
      title: "Join Security Community",
      description: "Connect with other security-conscious traders",
      priority: "low",
      action: "Join community",
      icon: Users
    });

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Personal Security Recommendations
        </CardTitle>
        <CardDescription>AI-powered security suggestions tailored for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            className="p-4 bg-slate-800/30 rounded-lg border border-slate-600"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  <rec.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{rec.title}</h4>
                  <p className="text-sm text-slate-400 mb-3">{rec.description}</p>
                  <Button size="sm" variant="outline">
                    {rec.action}
                  </Button>
                </div>
              </div>
              <Badge 
                variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {rec.priority}
              </Badge>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdvancedSecurityDashboard() {
  const [permissions, setPermissions] = useState<UserPermissions>({
    canViewLogs: true,
    canManageUsers: false,
    canModifySettings: true,
    canExportData: true,
    securityLevel: 'advanced',
    alertThreshold: 75
  });

  // Mock data - in production, this would come from APIs
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

  const mockAchievements: SecurityAchievement[] = [
    {
      id: '1',
      title: 'Security Guardian',
      description: 'Monitored security for 30 consecutive days',
      icon: '🛡️',
      points: 500,
      rarity: 'rare',
      unlockedAt: new Date()
    },
    {
      id: '2',
      title: 'Threat Hunter',
      description: 'Identified and reported 10 security threats',
      icon: '🎯',
      points: 1000,
      rarity: 'epic',
      unlockedAt: new Date()
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="permissions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="threats">Threat Viz</TabsTrigger>
          <TabsTrigger value="portfolio">Risk Scoring</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-6">
          <UserPermissionSettings 
            permissions={permissions} 
            onUpdate={setPermissions} 
          />
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <ThreatVisualization3D threats={mockThreats} />
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <PortfolioRiskScoring portfolioData={mockPortfolioRisk} />
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <SecuritySocialSharing achievements={mockAchievements} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <PersonalSecurityRecommendations 
            userLevel={5} 
            riskProfile="medium" 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}