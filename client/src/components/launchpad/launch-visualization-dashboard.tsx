import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Clock,
  Zap,
  Target,
  Flame,
  Star,
  Rocket,
  DollarSign
} from "lucide-react";

interface LaunchMetrics {
  totalRaised: number;
  participantCount: number;
  averageContribution: number;
  momentum: number;
  velocity: number;
  timeRemaining: number;
}

interface AnimatedMetric {
  current: number;
  target: number;
  isAnimating: boolean;
}

interface VisualizationDashboardProps {
  projectName: string;
  symbol: string;
  targetRaise: number;
  currentRaise: number;
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "live" | "completed" | "sold_out";
  startTime: string;
  endTime: string;
}

export default function LaunchVisualizationDashboard({
  projectName,
  symbol,
  targetRaise,
  currentRaise,
  participants,
  maxParticipants,
  status,
  startTime,
  endTime
}: VisualizationDashboardProps) {
  const [metrics, setMetrics] = useState<LaunchMetrics>({
    totalRaised: 0,
    participantCount: 0,
    averageContribution: 0,
    momentum: 0,
    velocity: 0,
    timeRemaining: 0
  });

  const [animatedMetrics, setAnimatedMetrics] = useState<{
    raised: AnimatedMetric;
    participants: AnimatedMetric;
    progress: AnimatedMetric;
  }>({
    raised: { current: 0, target: currentRaise, isAnimating: false },
    participants: { current: 0, target: participants, isAnimating: false },
    progress: { current: 0, target: (currentRaise / targetRaise) * 100, isAnimating: false }
  });

  // Calculate real-time metrics
  useEffect(() => {
    const calculateMetrics = () => {
      const progressPercentage = (currentRaise / targetRaise) * 100;
      const avgContribution = participants > 0 ? currentRaise / participants : 0;
      
      // Calculate momentum based on progress rate
      const momentum = Math.min(progressPercentage * 1.2, 100);
      
      // Calculate velocity (simulated based on current progress)
      const velocity = progressPercentage > 80 ? 95 : progressPercentage > 50 ? 75 : progressPercentage > 25 ? 50 : 25;
      
      // Calculate time remaining
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const timeLeft = Math.max(0, end - now);
      
      setMetrics({
        totalRaised: currentRaise,
        participantCount: participants,
        averageContribution: avgContribution,
        momentum,
        velocity,
        timeRemaining: timeLeft
      });
    };

    calculateMetrics();
    const interval = setInterval(calculateMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [currentRaise, participants, targetRaise, endTime]);

  // Animate metrics changes
  useEffect(() => {
    const animateMetric = (
      key: 'raised' | 'participants' | 'progress',
      newTarget: number
    ) => {
      setAnimatedMetrics(prev => ({
        ...prev,
        [key]: { ...prev[key], target: newTarget, isAnimating: true }
      }));

      const startValue = animatedMetrics[key].current;
      const difference = newTarget - startValue;
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const stepValue = difference / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const newValue = startValue + (stepValue * currentStep);
        
        setAnimatedMetrics(prev => ({
          ...prev,
          [key]: { ...prev[key], current: newValue }
        }));

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedMetrics(prev => ({
            ...prev,
            [key]: { current: newTarget, target: newTarget, isAnimating: false }
          }));
        }
      }, stepDuration);
    };

    animateMetric('raised', currentRaise);
    animateMetric('participants', participants);
    animateMetric('progress', (currentRaise / targetRaise) * 100);
  }, [currentRaise, participants, targetRaise]);

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return "Launch Ended";
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getMomentumColor = (momentum: number) => {
    if (momentum >= 80) return "text-green-400";
    if (momentum >= 60) return "text-yellow-400";
    if (momentum >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getVelocityIndicator = (velocity: number) => {
    if (velocity >= 80) return { icon: Rocket, color: "text-green-400", label: "Explosive" };
    if (velocity >= 60) return { icon: Flame, color: "text-orange-400", label: "Hot" };
    if (velocity >= 40) return { icon: TrendingUp, color: "text-yellow-400", label: "Growing" };
    return { icon: Activity, color: "text-blue-400", label: "Steady" };
  };

  const velocityIndicator = getVelocityIndicator(metrics.velocity);

  return (
    <div className="space-y-6">
      {/* Main Visualization Card */}
      <Card className="glass border-blue-500/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center space-x-3">
                <span>{projectName}</span>
                <Badge variant="outline" className="text-sm">{symbol}</Badge>
                <Badge 
                  className={
                    status === "live" ? "bg-green-600 text-white animate-pulse" :
                    status === "upcoming" ? "bg-blue-600 text-white" :
                    status === "completed" ? "bg-purple-600 text-white" :
                    "bg-yellow-600 text-white"
                  }
                >
                  {status.toUpperCase()}
                </Badge>
              </CardTitle>
              <p className="text-muted-foreground mt-1">Live Launch Visualization</p>
            </div>
            
            {status === "live" && (
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">
                  {formatTimeRemaining(metrics.timeRemaining)}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          {/* Primary Progress Visualization */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg font-semibold mb-1">Funding Progress</h3>
                <div className="text-3xl font-bold text-blue-400">
                  ${animatedMetrics.raised.current.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  of ${targetRaise.toLocaleString()} target
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">
                  {animatedMetrics.progress.current.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="relative">
              <Progress value={animatedMetrics.progress.current} className="h-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white mix-blend-difference">
                  {animatedMetrics.progress.current.toFixed(1)}% Funded
                </span>
              </div>
              
              {/* Progress glow effect */}
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-lg transition-all duration-1000"
                style={{ width: `${animatedMetrics.progress.current}%` }}
              />
            </div>
          </div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-muted/20 border-green-500/30">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold">
                  {animatedMetrics.participants.current.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Participants</div>
                <div className="text-xs text-green-400 mt-1">
                  {((animatedMetrics.participants.current / maxParticipants) * 100).toFixed(1)}% capacity
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/20 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xl font-bold">
                  ${metrics.averageContribution.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Avg Investment</div>
                <div className="text-xs text-blue-400 mt-1">
                  Per participant
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/20 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <Target className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <div className={`text-xl font-bold ${getMomentumColor(metrics.momentum)}`}>
                  {metrics.momentum.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Momentum</div>
                <div className="text-xs text-orange-400 mt-1">
                  Market interest
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/20 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <velocityIndicator.icon className={`w-6 h-6 ${velocityIndicator.color} mx-auto mb-2`} />
                <div className={`text-xl font-bold ${velocityIndicator.color}`}>
                  {velocityIndicator.label}
                </div>
                <div className="text-sm text-muted-foreground">Velocity</div>
                <div className="text-xs text-purple-400 mt-1">
                  {metrics.velocity.toFixed(0)}% speed
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Activity Feed */}
          <Card className="bg-muted/10 border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span>Live Activity</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <div className="flex items-center justify-between text-sm p-2 bg-green-500/10 rounded">
                  <span>🚀 New participant joined</span>
                  <span className="text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-blue-500/10 rounded">
                  <span>💰 Large investment: $5,000</span>
                  <span className="text-muted-foreground">5 min ago</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-purple-500/10 rounded">
                  <span>🎯 25% milestone reached</span>
                  <span className="text-muted-foreground">8 min ago</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-yellow-500/10 rounded">
                  <span>⭐ Community goal unlocked</span>
                  <span className="text-muted-foreground">12 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participation Button */}
          {status === "live" && (
            <Button className="w-full" size="lg">
              <Zap className="w-4 h-4 mr-2" />
              Participate Now - {formatTimeRemaining(metrics.timeRemaining)} Left
            </Button>
          )}
        </CardContent>

        {/* Animated Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating particles based on momentum */}
          {Array.from({ length: Math.floor(metrics.momentum / 20) }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.5}s`
              }}
            />
          ))}
          
          {/* Success glow when milestones hit */}
          {animatedMetrics.progress.current >= 25 && (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/5 to-transparent animate-pulse" />
          )}
        </div>
      </Card>

      {/* Secondary Visualization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Participant Growth Chart */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Participant Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Current Participants</span>
                <span className="font-semibold">{participants.toLocaleString()}</span>
              </div>
              <Progress value={(participants / maxParticipants) * 100} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{maxParticipants.toLocaleString()} max</span>
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-2">Growth Rate</div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">+12 participants/hour</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funding Velocity */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-purple-400" />
              <span>Funding Velocity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  ${(currentRaise / Math.max(1, (Date.now() - new Date(startTime).getTime()) / (1000 * 60 * 60))).toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Per Hour</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Funding Rate</span>
                  <span className={`font-semibold ${getMomentumColor(metrics.velocity)}`}>
                    {velocityIndicator.label}
                  </span>
                </div>
                <Progress value={metrics.velocity} className="h-2" />
              </div>
              
              <div className="pt-2 border-t text-center">
                <div className="text-sm text-muted-foreground mb-1">Time to Target</div>
                <div className="text-lg font-semibold">
                  {targetRaise > currentRaise 
                    ? `~${Math.ceil((targetRaise - currentRaise) / Math.max(1, currentRaise / 24))} hours`
                    : "Target Reached!"
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}