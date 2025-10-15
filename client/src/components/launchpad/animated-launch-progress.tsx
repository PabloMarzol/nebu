import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ICOParticipation from "./ico-participation";
import { 
  Rocket, 
  Target, 
  TrendingUp, 
  Users, 
  Clock,
  Zap,
  Star,
  Flame,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface LaunchMilestone {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  reached: boolean;
  reward?: string;
  icon: any;
  color: string;
}

interface AnimatedLaunchProgressProps {
  projectName: string;
  symbol: string;
  targetRaise: number;
  currentRaise: number;
  participants: number;
  maxParticipants: number;
  timeRemaining: string;
  status: "upcoming" | "live" | "completed" | "sold_out";
}

export default function AnimatedLaunchProgress({
  projectName,
  symbol,
  targetRaise,
  currentRaise,
  participants,
  maxParticipants,
  timeRemaining,
  status
}: AnimatedLaunchProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedParticipants, setAnimatedParticipants] = useState(0);
  const [animatedRaise, setAnimatedRaise] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showParticipationModal, setShowParticipationModal] = useState(false);

  const progressPercentage = (currentRaise / targetRaise) * 100;
  const participantPercentage = (participants / maxParticipants) * 100;

  const milestones: LaunchMilestone[] = [
    {
      id: "milestone-25",
      title: "Early Support",
      description: "25% funding reached",
      targetAmount: targetRaise * 0.25,
      reached: currentRaise >= targetRaise * 0.25,
      reward: "5% bonus allocation",
      icon: Zap,
      color: "text-blue-400"
    },
    {
      id: "milestone-50",
      title: "Community Momentum",
      description: "50% funding reached",
      targetAmount: targetRaise * 0.5,
      reached: currentRaise >= targetRaise * 0.5,
      reward: "Exclusive NFT",
      icon: Star,
      color: "text-purple-400"
    },
    {
      id: "milestone-75",
      title: "Strong Interest",
      description: "75% funding reached",
      targetAmount: targetRaise * 0.75,
      reached: currentRaise >= targetRaise * 0.75,
      reward: "Governance tokens",
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      id: "milestone-100",
      title: "Fully Funded",
      description: "100% funding reached",
      targetAmount: targetRaise,
      reached: currentRaise >= targetRaise,
      reward: "Launch celebration",
      icon: Rocket,
      color: "text-yellow-400"
    }
  ];

  // Animate progress on mount and when values change
  useEffect(() => {
    const animateValues = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedProgress(progressPercentage * progress);
        setAnimatedParticipants(Math.floor(participants * progress));
        setAnimatedRaise(currentRaise * progress);

        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedProgress(progressPercentage);
          setAnimatedParticipants(participants);
          setAnimatedRaise(currentRaise);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    animateValues();
  }, [progressPercentage, participants, currentRaise]);

  // Trigger celebration when milestones are reached
  useEffect(() => {
    const reachedMilestones = milestones.filter(m => m.reached);
    if (reachedMilestones.length > 0 && progressPercentage >= 25) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [progressPercentage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "text-green-400";
      case "upcoming": return "text-blue-400";
      case "completed": return "text-purple-400";
      case "sold_out": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live": return <Badge className="bg-green-600 text-white animate-pulse">🟢 LIVE</Badge>;
      case "upcoming": return <Badge className="bg-blue-600 text-white">⏰ UPCOMING</Badge>;
      case "completed": return <Badge className="bg-purple-600 text-white">✅ COMPLETED</Badge>;
      case "sold_out": return <Badge className="bg-yellow-600 text-white">🔥 SOLD OUT</Badge>;
      default: return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  return (
    <div className="relative">
      <Card className="glass border-blue-500/30 overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <span>{projectName}</span>
                  <Badge variant="outline">{symbol}</Badge>
                </CardTitle>
                <p className="text-muted-foreground">Token Launch Progress</p>
              </div>
              {getStatusBadge(status)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Main Progress Section */}
          <div className="space-y-4">
            {/* Funding Progress */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Funding Progress</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    ${animatedRaise.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of ${targetRaise.toLocaleString()} goal
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Progress value={animatedProgress} className="h-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white mix-blend-difference">
                    {animatedProgress.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Participants Progress */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Participants</span>
                </h3>
                <div className="text-right">
                  <div className="text-xl font-bold text-purple-400">
                    {animatedParticipants.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of {maxParticipants.toLocaleString()} max
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Progress value={participantPercentage} className="h-3" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white mix-blend-difference">
                    {participantPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Remaining */}
          {status === "live" && (
            <div className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
              <Clock className="w-5 h-5 text-orange-400 mr-2" />
              <span className="text-lg font-semibold">Time Remaining: {timeRemaining}</span>
            </div>
          )}

          {/* Milestones */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Milestones</span>
            </h3>
            
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.id}
                  className={`relative flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
                    milestone.reached
                      ? 'border-green-500/50 bg-green-500/10 animate-pulse'
                      : 'border-border bg-muted/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${milestone.reached ? 'bg-green-500/20' : 'bg-muted/30'}`}>
                      <milestone.icon className={`w-4 h-4 ${milestone.reached ? 'text-green-400' : milestone.color}`} />
                    </div>
                    <div>
                      <div className="font-semibold flex items-center space-x-2">
                        <span>{milestone.title}</span>
                        {milestone.reached && (
                          <CheckCircle className="w-4 h-4 text-green-400 animate-bounce" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{milestone.description}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      ${milestone.targetAmount.toLocaleString()}
                    </div>
                    {milestone.reward && (
                      <div className="text-xs text-blue-400">{milestone.reward}</div>
                    )}
                  </div>

                  {/* Animated background for reached milestones */}
                  {milestone.reached && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent animate-pulse rounded-lg" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Live Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-green-400">
                {((currentRaise / targetRaise) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Funded</div>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-blue-400">
                ${(currentRaise / participants).toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Investment</div>
            </div>
            
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-purple-400">
                {Math.ceil((targetRaise - currentRaise) / (currentRaise / participants))}
              </div>
              <div className="text-sm text-muted-foreground">More Needed</div>
            </div>
          </div>

          {/* Action Button */}
          {status === "live" && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => setShowParticipationModal(true)}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Participate in Launch
            </Button>
          )}
        </CardContent>

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float" />
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/30 rounded-full animate-float-delayed" />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-pink-400/30 rounded-full animate-float-slow" />
          
          {/* Progress glow */}
          {animatedProgress > 0 && (
            <div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          )}
        </div>
      </Card>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-bounce">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">Milestone Reached!</div>
              <div className="text-sm text-muted-foreground">Congratulations to all participants</div>
            </div>
          </div>
        </div>
      )}

      {/* Participation Modal */}
      {showParticipationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowParticipationModal(false)} />
          <div className="relative bg-background border border-border rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Participate in {projectName} Launch</h2>
              <Button variant="ghost" onClick={() => setShowParticipationModal(false)}>
                ✕
              </Button>
            </div>
            <div className="p-6">
              <ICOParticipation 
                launchId="defichain-1"
                projectName={projectName}
                tokenSymbol={symbol}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}