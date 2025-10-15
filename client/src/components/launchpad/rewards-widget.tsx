import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Gift, 
  Zap, 
  Target, 
  Award, 
  Crown, 
  Flame,
  TrendingUp,
  Calendar,
  Users,
  Coins,
  Clock,
  CheckCircle,
  X
} from "lucide-react";

interface RewardProgress {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  type: "early_bird" | "volume" | "referral" | "streak" | "milestone";
  icon: any;
  color: string;
  points: number;
  completed: boolean;
  timeLeft?: string;
}

interface RewardsWidgetProps {
  launchId: string;
  projectName: string;
  onClose?: () => void;
  minimized?: boolean;
}

export default function RewardsWidget({ 
  launchId, 
  projectName, 
  onClose,
  minimized = false 
}: RewardsWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [showCelebration, setShowCelebration] = useState(false);

  const activeRewards: RewardProgress[] = [
    {
      id: "early_bird",
      title: "Early Bird",
      description: "First 100 participants",
      progress: 73,
      target: 100,
      reward: "10% Bonus",
      type: "early_bird",
      icon: Crown,
      color: "text-yellow-400",
      points: 150,
      completed: false,
      timeLeft: "2h 15m"
    },
    {
      id: "volume_1k",
      title: "Volume Milestone",
      description: "Invest $1,000+",
      progress: 650,
      target: 1000,
      reward: "250 NEBX",
      type: "volume",
      icon: TrendingUp,
      color: "text-green-400",
      points: 100,
      completed: false
    },
    {
      id: "referral_3",
      title: "Bring Friends",
      description: "Refer 3 people",
      progress: 1,
      target: 3,
      reward: "5% Extra",
      type: "referral",
      icon: Users,
      color: "text-blue-400",
      points: 200,
      completed: false
    },
    {
      id: "first_participation",
      title: "First Timer",
      description: "Join your first launch",
      progress: 1,
      target: 1,
      reward: "Welcome NFT",
      type: "milestone",
      icon: Award,
      color: "text-purple-400",
      points: 50,
      completed: true
    }
  ];

  const completedRewards = activeRewards.filter(r => r.completed);
  const activeProgress = activeRewards.filter(r => !r.completed);
  const totalPoints = completedRewards.reduce((sum, r) => sum + r.points, 0);

  const getProgressColor = (type: string) => {
    switch (type) {
      case "early_bird": return "bg-yellow-400";
      case "volume": return "bg-green-400";
      case "referral": return "bg-blue-400";
      case "streak": return "bg-orange-400";
      case "milestone": return "bg-purple-400";
      default: return "bg-gray-400";
    }
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom duration-500">
        <Card className="glass border-purple-500/30 shadow-xl backdrop-blur-lg w-64">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-sm">Rewards</span>
                {activeProgress.length > 0 && (
                  <Badge className="bg-purple-600 text-white text-xs">
                    {activeProgress.length}
                  </Badge>
                )}
              </div>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(false)}
                  className="h-6 w-6 p-0 hover:bg-muted/20"
                >
                  ↑
                </Button>
                {onClose && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClose}
                    className="h-6 w-6 p-0 hover:bg-muted/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {completedRewards.length > 0 && (
              <div className="mt-2 text-center">
                <div className="text-xs text-muted-foreground">Points Earned</div>
                <div className="font-bold text-purple-400">{totalPoints}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 animate-in slide-in-from-bottom duration-500">
      <Card className="glass border-purple-500/30 shadow-2xl backdrop-blur-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span>Launch Rewards</span>
            </CardTitle>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0 hover:bg-muted/20"
              >
                ↓
              </Button>
              {onClose && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                  className="h-6 w-6 p-0 hover:bg-muted/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{projectName}</div>
        </CardHeader>

        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {/* Points Summary */}
          <div className="flex items-center justify-between p-2 bg-purple-500/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold">Points Earned</span>
            </div>
            <Badge className="bg-purple-600 text-white">{totalPoints}</Badge>
          </div>

          {/* Active Progress */}
          {activeProgress.map((reward) => {
            const progressPercentage = (reward.progress / reward.target) * 100;
            
            return (
              <div 
                key={reward.id} 
                className="p-3 rounded-lg border border-border bg-muted/5 hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <reward.icon className={`w-4 h-4 ${reward.color}`} />
                    <div>
                      <div className="font-semibold text-sm">{reward.title}</div>
                      <div className="text-xs text-muted-foreground">{reward.description}</div>
                    </div>
                  </div>
                  {reward.timeLeft && (
                    <div className="flex items-center space-x-1 text-xs text-orange-400">
                      <Clock className="w-3 h-3" />
                      <span>{reward.timeLeft}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span>
                      {reward.type === "volume" ? `$${reward.progress}` : reward.progress} / 
                      {reward.type === "volume" ? `$${reward.target}` : reward.target}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={progressPercentage} 
                      className="h-1.5"
                    />
                    <div 
                      className={`absolute top-0 left-0 h-1.5 rounded-full transition-all ${getProgressColor(reward.type)}`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-semibold">{reward.reward}</span>
                    <span className="text-muted-foreground"> • {reward.points}pts</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.ceil(100 - progressPercentage)}% to go
                  </div>
                </div>
              </div>
            );
          })}

          {/* Completed Rewards */}
          {completedRewards.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-green-400 flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Completed</span>
              </div>
              {completedRewards.map((reward) => (
                <div 
                  key={reward.id}
                  className="p-2 rounded-lg bg-green-500/10 border border-green-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <reward.icon className={`w-4 h-4 ${reward.color}`} />
                      <div>
                        <div className="font-semibold text-sm">{reward.title}</div>
                        <div className="text-xs text-muted-foreground">{reward.reward}</div>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white text-xs">
                      +{reward.points}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full mt-3" 
            size="sm"
            onClick={triggerCelebration}
          >
            <Gift className="w-4 h-4 mr-1" />
            View All Rewards
          </Button>
        </CardContent>
      </Card>

      {/* Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-center">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-xl font-bold text-purple-400">Reward Progress!</div>
          </div>
        </div>
      )}
    </div>
  );
}