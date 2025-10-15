import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Users, 
  Lock, 
  Trophy,
  Star,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  TrendingUp,
  Award,
  Flame
} from "lucide-react";

interface SecurityStats {
  security: {
    blockedIPs: number;
    suspiciousIPs: number;
    recentEvents: any[];
    activeLimits: number;
  };
  sessions: {
    totalActiveSessions: number;
    activeUsers: number;
    recentAlerts: any[];
    sessionsByHour: number[];
  };
  audit: {
    totalEvents: number;
    eventsLast24h: number;
    eventsByCategory: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    topUsers: Array<{ userId: string; eventCount: number }>;
    recentCriticalEvents: any[];
  };
  risk: {
    totalProfiles: number;
    alertsByType: Record<string, number>;
    alertsBySeverity: Record<string, number>;
    recentAlerts: any[];
    riskDistribution: Record<string, number>;
  };
  compliance: {
    pendingReports: number;
    completedReports: number;
    flaggedTransactions: number;
    complianceScore: number;
  };
  timestamp: string;
}

interface SecurityAchievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AnimatedProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

function AnimatedProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = "#10b981", 
  showPercentage = true,
  animated = true 
}: AnimatedProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={animated ? strokeDashoffset : 0}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      {showPercentage && (
        <motion.div
          className="absolute text-xl font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  );
}

function SecurityHeatMap({ riskData }: { riskData: Record<string, number> }) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  
  const heatMapData = [
    { id: 'auth', label: 'Authentication', value: riskData.auth || 0, color: '#10b981' },
    { id: 'network', label: 'Network Security', value: riskData.network || 0, color: '#3b82f6' },
    { id: 'data', label: 'Data Protection', value: riskData.data || 0, color: '#8b5cf6' },
    { id: 'compliance', label: 'Compliance', value: riskData.compliance || 95, color: '#f59e0b' },
    { id: 'monitoring', label: 'Monitoring', value: riskData.monitoring || 0, color: '#ef4444' },
    { id: 'access', label: 'Access Control', value: riskData.access || 0, color: '#06b6d4' },
  ];

  const getIntensity = (value: number) => {
    if (value >= 90) return 'bg-green-500 dark:bg-green-400';
    if (value >= 70) return 'bg-yellow-500 dark:bg-yellow-400';
    if (value >= 50) return 'bg-orange-500 dark:bg-orange-400';
    return 'bg-red-500 dark:bg-red-400';
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {heatMapData.map((item) => (
        <motion.div
          key={item.id}
          className={`relative h-16 rounded-lg cursor-pointer transition-all duration-300 ${getIntensity(item.value)}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setHoveredCell(item.id)}
          onHoverEnd={() => setHoveredCell(null)}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs font-medium">
            <div>{item.label}</div>
            <div className="text-lg font-bold">{item.value}%</div>
          </div>
          <AnimatePresence>
            {hoveredCell === item.id && (
              <motion.div
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                Risk Level: {item.value}%
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function SecurityAchievements({ userLevel }: { userLevel: number }) {
  const achievements: SecurityAchievement[] = [
    {
      id: 'guardian',
      title: 'Security Guardian',
      description: 'Monitor security for 24 hours',
      icon: Shield,
      unlocked: userLevel >= 1,
      progress: Math.min(userLevel * 10, 100),
      maxProgress: 100,
      points: 100,
      rarity: 'common'
    },
    {
      id: 'threat_hunter',
      title: 'Threat Hunter',
      description: 'Identify 10 security threats',
      icon: Target,
      unlocked: userLevel >= 3,
      progress: Math.min(userLevel * 15, 100),
      maxProgress: 100,
      points: 250,
      rarity: 'rare'
    },
    {
      id: 'compliance_master',
      title: 'Compliance Master',
      description: 'Maintain 95% compliance score',
      icon: Award,
      unlocked: userLevel >= 5,
      progress: Math.min(userLevel * 20, 100),
      maxProgress: 100,
      points: 500,
      rarity: 'epic'
    },
    {
      id: 'security_legend',
      title: 'Security Legend',
      description: 'Zero security incidents for 30 days',
      icon: Trophy,
      unlocked: userLevel >= 10,
      progress: Math.min(userLevel * 10, 100),
      maxProgress: 100,
      points: 1000,
      rarity: 'legendary'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50 dark:bg-gray-900';
      case 'rare': return 'border-blue-400 bg-blue-50 dark:bg-blue-900';
      case 'epic': return 'border-purple-400 bg-purple-50 dark:bg-purple-900';
      case 'legendary': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900';
      default: return 'border-gray-400 bg-gray-50 dark:bg-gray-900';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          className={`relative p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} ${
            achievement.unlocked ? 'opacity-100' : 'opacity-50'
          }`}
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: achievement.unlocked ? 1 : 0.5, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
            <div>
              <h4 className="font-semibold text-sm">{achievement.title}</h4>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Progress value={achievement.progress} className="flex-1 mr-2" />
            <Badge variant={achievement.unlocked ? "default" : "secondary"}>
              {achievement.points}pts
            </Badge>
          </div>
          {achievement.unlocked && (
            <motion.div
              className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Star className="h-3 w-3" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function ThreatLevelIndicator({ level }: { level: 'low' | 'medium' | 'high' | 'critical' }) {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'low':
        return { color: 'bg-green-500', text: 'Low Risk', icon: CheckCircle, pulse: false };
      case 'medium':
        return { color: 'bg-yellow-500', text: 'Medium Risk', icon: AlertTriangle, pulse: false };
      case 'high':
        return { color: 'bg-orange-500', text: 'High Risk', icon: AlertTriangle, pulse: true };
      case 'critical':
        return { color: 'bg-red-500', text: 'Critical Risk', icon: XCircle, pulse: true };
      default:
        return { color: 'bg-gray-500', text: 'Unknown', icon: Activity, pulse: false };
    }
  };

  const config = getLevelConfig(level);

  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-2 rounded-full ${config.color} text-white`}
      animate={config.pulse ? { scale: [1, 1.05, 1] } : {}}
      transition={config.pulse ? { repeat: Infinity, duration: 2 } : {}}
    >
      <config.icon className="h-4 w-4" />
      <span className="text-sm font-medium">{config.text}</span>
      {config.pulse && <Flame className="h-4 w-4 animate-pulse" />}
    </motion.div>
  );
}

export default function InteractiveSecurityDashboard() {
  const [userLevel, setUserLevel] = useState(3);
  const [securityScore, setSecurityScore] = useState(85);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [showNotification, setShowNotification] = useState(false);

  const { data: securityData, isLoading, refetch } = useQuery({
    queryKey: ["/api/security/dashboard"],
    refetchInterval: 30000,
  });

  const stats = securityData as SecurityStats;

  // Calculate dynamic security score based on real data
  useEffect(() => {
    if (stats) {
      const baseScore = stats.compliance?.complianceScore || 85;
      const threatPenalty = (stats.security?.blockedIPs || 0) * 5;
      const alertPenalty = (stats.risk?.recentAlerts?.length || 0) * 2;
      const newScore = Math.max(0, Math.min(100, baseScore - threatPenalty - alertPenalty));
      setSecurityScore(newScore);

      // Determine threat level
      if (newScore >= 90) setThreatLevel('low');
      else if (newScore >= 70) setThreatLevel('medium');
      else if (newScore >= 50) setThreatLevel('high');
      else setThreatLevel('critical');
    }
  }, [stats]);

  const generateSecurityReport = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    // In a real implementation, this would generate and download a PDF report
    const reportData = {
      timestamp: new Date().toISOString(),
      securityScore,
      threatLevel,
      compliance: stats?.compliance,
      recommendations: [
        "Enable two-factor authentication for all admin accounts",
        "Review and update access control policies",
        "Implement automated threat detection rules",
        "Schedule regular security audits"
      ]
    };
    
    console.log("Security Report Generated:", reportData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading interactive security dashboard...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Animated Security Score Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              Security Health Score
            </CardTitle>
            <CardDescription>Real-time security assessment</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <AnimatedProgressRing 
              progress={securityScore} 
              size={150} 
              color={securityScore >= 90 ? "#10b981" : securityScore >= 70 ? "#f59e0b" : "#ef4444"}
            />
            <ThreatLevelIndicator level={threatLevel} />
            <Button 
              onClick={generateSecurityReport}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Download className="h-4 w-4" />
              Generate Security Report
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Heat Map */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-500" />
              Security Risk Heat Map
            </CardTitle>
            <CardDescription>Color-coded security assessment by domain</CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityHeatMap riskData={stats?.risk?.riskDistribution || {}} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Gaming Achievements */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Security Achievements
              <Badge variant="secondary">Level {userLevel}</Badge>
            </CardTitle>
            <CardDescription>Unlock achievements by maintaining security excellence</CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityAchievements userLevel={userLevel} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-blue-700 dark:text-blue-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
              >
                {stats?.sessions?.totalActiveSessions || 0}
              </motion.div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {stats?.sessions?.activeUsers || 0} unique users
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked Threats</CardTitle>
              <Lock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-green-700 dark:text-green-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1, type: "spring" }}
              >
                {stats?.security?.blockedIPs || 0}
              </motion.div>
              <p className="text-xs text-green-600 dark:text-green-400">
                IPs blocked today
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-2xl font-bold text-purple-700 dark:text-purple-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                {stats?.compliance?.complianceScore || 95}%
              </motion.div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Regulatory compliance
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Playful Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed top-4 right-4 z-50"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <Alert className="bg-green-100 border-green-500 text-green-800">
              <Zap className="h-4 w-4" />
              <AlertDescription className="flex items-center gap-2">
                <span>Security report generated successfully!</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="h-4 w-4 text-yellow-500" />
                </motion.div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}