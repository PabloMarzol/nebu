import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Lock,
  Key,
  Eye,
  EyeOff,
  Smartphone,
  HardDrive,
  Wifi,
  Activity,
  Zap,
  Clock,
  RefreshCw,
  Settings,
  Download,
  Upload,
  Globe,
  Users,
  FileText
} from "lucide-react";

interface SecurityMetric {
  id: string;
  name: string;
  score: number;
  status: "excellent" | "good" | "warning" | "critical";
  description: string;
  lastCheck: string;
  recommendations: string[];
}

interface SecurityThreat {
  id: string;
  type: "phishing" | "malware" | "breach" | "suspicious_login" | "api_abuse";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  affectedAssets: string[];
}

interface SecurityDevice {
  id: string;
  name: string;
  type: "hardware_wallet" | "mobile" | "desktop" | "browser";
  status: "connected" | "disconnected" | "compromised" | "pending";
  lastSeen: string;
  location: string;
  riskLevel: number;
}

export default function SecurityHealthDashboard() {
  const [overallScore, setOverallScore] = useState(87);
  const [isScanning, setIsScanning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const securityMetrics: SecurityMetric[] = [
    {
      id: "password",
      name: "Password Security",
      score: 95,
      status: "excellent",
      description: "Strong password with 2FA enabled",
      lastCheck: "2 minutes ago",
      recommendations: []
    },
    {
      id: "wallet",
      name: "Wallet Security", 
      score: 92,
      status: "excellent",
      description: "Multi-signature wallet with hardware protection",
      lastCheck: "5 minutes ago",
      recommendations: ["Consider upgrading to Ledger Nano S Plus"]
    },
    {
      id: "network",
      name: "Network Security",
      score: 78,
      status: "good",
      description: "Secure connection with VPN protection",
      lastCheck: "1 minute ago",
      recommendations: ["Enable automatic VPN on public networks"]
    },
    {
      id: "device",
      name: "Device Security",
      score: 85,
      status: "good",
      description: "Device encryption and biometric locks active",
      lastCheck: "3 minutes ago",
      recommendations: ["Update browser security settings"]
    },
    {
      id: "api",
      name: "API Security",
      score: 88,
      status: "good",
      description: "API keys properly secured and rotated",
      lastCheck: "10 minutes ago",
      recommendations: []
    },
    {
      id: "backup",
      name: "Backup Security",
      score: 72,
      status: "warning",
      description: "Backup exists but not recently verified",
      lastCheck: "2 hours ago",
      recommendations: ["Verify backup integrity", "Test recovery process"]
    }
  ];

  const securityThreats: SecurityThreat[] = [
    {
      id: "1",
      type: "suspicious_login",
      severity: "medium",
      title: "Unusual Login Location",
      description: "Login detected from Prague, Czech Republic - different from your usual location",
      timestamp: "2024-01-15 14:32:00",
      resolved: false,
      affectedAssets: ["Account Access"]
    },
    {
      id: "2", 
      type: "phishing",
      severity: "high",
      title: "Phishing Attempt Blocked",
      description: "Malicious email claiming to be from NebulaX exchange blocked by security filters",
      timestamp: "2024-01-15 11:45:00",
      resolved: true,
      affectedAssets: ["Email Security"]
    },
    {
      id: "3",
      type: "api_abuse",
      severity: "low",
      title: "High API Request Volume",
      description: "Unusual number of API requests detected - monitoring for potential abuse",
      timestamp: "2024-01-15 09:20:00", 
      resolved: false,
      affectedAssets: ["API Access"]
    }
  ];

  const connectedDevices: SecurityDevice[] = [
    {
      id: "1",
      name: "Ledger Nano X",
      type: "hardware_wallet",
      status: "connected",
      lastSeen: "Active now",
      location: "Hardware Device",
      riskLevel: 5
    },
    {
      id: "2",
      name: "iPhone 15 Pro",
      type: "mobile", 
      status: "connected",
      lastSeen: "2 minutes ago",
      location: "Prague, CZ",
      riskLevel: 15
    },
    {
      id: "3",
      name: "MacBook Pro",
      type: "desktop",
      status: "connected", 
      lastSeen: "Active now",
      location: "Prague, CZ",
      riskLevel: 12
    },
    {
      id: "4",
      name: "Chrome Browser",
      type: "browser",
      status: "connected",
      lastSeen: "Active now", 
      location: "Prague, CZ",
      riskLevel: 25
    },
    {
      id: "5",
      name: "Unknown Android",
      type: "mobile",
      status: "disconnected",
      lastSeen: "3 days ago",
      location: "Berlin, DE", 
      riskLevel: 75
    }
  ];

  const runSecurityScan = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsScanning(false);
    setOverallScore(Math.min(overallScore + Math.floor(Math.random() * 5), 100));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400 bg-green-400/10";
    if (score >= 70) return "text-blue-400 bg-blue-400/10";
    if (score >= 50) return "text-yellow-400 bg-yellow-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "good": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "warning": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "critical": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "high": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "critical": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "hardware_wallet": return <HardDrive className="w-5 h-5" />;
      case "mobile": return <Smartphone className="w-5 h-5" />;
      case "desktop": return <Globe className="w-5 h-5" />;
      case "browser": return <Globe className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getDeviceStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "text-green-400";
      case "disconnected": return "text-gray-400";
      case "compromised": return "text-red-400";
      case "pending": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Security Score */}
      <Card className="glass border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Security Health Score</h3>
                <p className="text-muted-foreground">Real-time security assessment</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore).split(' ')[0]}`}>
                {overallScore}
              </div>
              <div className="text-sm text-muted-foreground mb-2">out of 100</div>
              <Progress value={overallScore} className="w-32 h-3" />
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showDetails ? "Hide" : "Show"} Details
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={runSecurityScan}
                disabled={isScanning}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? "Scanning..." : "Quick Scan"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityMetrics.map((metric) => (
          <Card key={metric.id} className="glass hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">{metric.name}</h4>
                <Badge className={getStatusColor(metric.status)} variant="outline">
                  {metric.status}
                </Badge>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Score:</span>
                  <span className={`font-bold ${getScoreColor(metric.score).split(' ')[0]}`}>
                    {metric.score}%
                  </span>
                </div>
                <Progress value={metric.score} className="h-2" />
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
              
              {metric.recommendations.length > 0 && showDetails && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-yellow-400">Recommendations:</div>
                  {metric.recommendations.map((rec, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      • {rec}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-3 text-xs text-muted-foreground">
                Last check: {metric.lastCheck}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Threats */}
      <Card className="glass border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <span>Security Alerts & Threats</span>
            <Badge variant="outline" className="ml-2">
              {securityThreats.filter(t => !t.resolved).length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityThreats.map((threat) => (
            <div key={threat.id} className={`p-4 border rounded-lg ${threat.resolved ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getSeverityColor(threat.severity)}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold">{threat.title}</h5>
                      <Badge className={getSeverityColor(threat.severity)} variant="outline">
                        {threat.severity}
                      </Badge>
                      {threat.resolved && (
                        <Badge className="bg-green-500/20 text-green-400" variant="outline">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{threat.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{threat.timestamp}</span>
                      <span>Affected: {threat.affectedAssets.join(", ")}</span>
                    </div>
                  </div>
                </div>
                
                {!threat.resolved && (
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <Card className="glass border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-green-400" />
            <span>Connected Devices & Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg bg-slate-800/50 ${getDeviceStatusColor(device.status)}`}>
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  <h5 className="font-semibold">{device.name}</h5>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{device.location}</span>
                    <span>Last seen: {device.lastSeen}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-sm font-semibold ${getScoreColor(100 - device.riskLevel).split(' ')[0]}`}>
                    Risk: {device.riskLevel}%
                  </div>
                  <Badge className={getStatusColor(device.status === "connected" ? "excellent" : "warning")} variant="outline">
                    {device.status}
                  </Badge>
                </div>
                
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Download className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Backup Wallet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create secure backup of your wallet keys
            </p>
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Create Backup
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Key className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Rotate API Keys</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Generate new API keys for enhanced security
            </p>
            <Button variant="outline" className="w-full">
              <Key className="w-4 h-4 mr-2" />
              Rotate Keys
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-orange-500/30">
          <CardContent className="p-6 text-center">
            <FileText className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Security Report</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Download comprehensive security analysis
            </p>
            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}