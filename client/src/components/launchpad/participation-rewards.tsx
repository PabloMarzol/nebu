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
  CheckCircle
} from "lucide-react";

interface ParticipationReward {
  id: string;
  type: "early_bird" | "milestone" | "loyalty" | "referral" | "volume";
  title: string;
  description: string;
  reward: string;
  progress: number;
  target: number;
  completed: boolean;
  claimable: boolean;
  claimed: boolean;
  icon: any;
  color: string;
  points: number;
  expiresAt?: string;
}

interface LaunchParticipation {
  launchId: string;
  projectName: string;
  amountInvested: number;
  tokensReceived: number;
  bonusMultiplier: number;
  rewardsEarned: ParticipationReward[];
  status: "active" | "completed" | "pending";
  participatedAt: string;
}

interface ParticipationRewardsProps {
  launchId: string;
  projectName: string;
  userLevel?: number;
}

export default function ParticipationRewards({ 
  launchId, 
  projectName, 
  userLevel = 3 
}: ParticipationRewardsProps) {
  const [showClaimAnimation, setShowClaimAnimation] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const participationRewards: ParticipationReward[] = [
    {
      id: "early_bird_1",
      type: "early_bird",
      title: "Early Bird Bonus",
      description: "Be among the first 100 participants",
      reward: "10% Extra Allocation",
      progress: 67,
      target: 100,
      completed: true,
      claimable: true,
      claimed: false,
      icon: Crown,
      color: "text-yellow-400",
      points: 150,
      expiresAt: "2024-12-20T23:59:59Z"
    },
    {
      id: "volume_milestone_1",
      type: "volume",
      title: "Volume Milestone",
      description: "Invest $5,000 or more",
      reward: "500 NEBX Tokens",
      progress: 3250,
      target: 5000,
      completed: false,
      claimable: false,
      claimed: false,
      icon: TrendingUp,
      color: "text-green-400",
      points: 200
    },
    {
      id: "loyalty_streak",
      type: "loyalty",
      title: "Participation Streak",
      description: "Participate in 3 consecutive launches",
      reward: "15% Fee Discount",
      progress: 2,
      target: 3,
      completed: false,
      claimable: false,
      claimed: false,
      icon: Flame,
      color: "text-orange-400",
      points: 300
    },
    {
      id: "referral_bonus",
      type: "referral",
      title: "Community Builder",
      description: "Refer 5 friends to this launch",
      reward: "1000 NEBX + NFT",
      progress: 3,
      target: 5,
      completed: false,
      claimable: false,
      claimed: false,
      icon: Users,
      color: "text-blue-400",
      points: 400
    },
    {
      id: "diamond_hands",
      type: "milestone",
      title: "Diamond Hands",
      description: "Hold tokens for 30 days post-launch",
      reward: "20% Bonus Airdrop",
      progress: 0,
      target: 30,
      completed: false,
      claimable: false,
      claimed: false,
      icon: Award,
      color: "text-purple-400",
      points: 500
    }
  ];

  const activeParticipation: LaunchParticipation = {
    launchId,
    projectName,
    amountInvested: 3250,
    tokensReceived: 6500,
    bonusMultiplier: 1.25,
    rewardsEarned: participationRewards.filter(r => r.completed),
    status: "active",
    participatedAt: "2024-12-10T10:00:00Z"
  };

  const totalPointsAvailable = participationRewards.reduce((sum, reward) => sum + reward.points, 0);
  const pointsEarned = participationRewards
    .filter(r => r.completed)
    .reduce((sum, reward) => sum + reward.points, 0);

  const claimReward = (rewardId: string) => {
    setClaimedRewards(prev => [...prev, rewardId]);
    setShowClaimAnimation(true);
    setTimeout(() => setShowClaimAnimation(false), 2000);
  };

  const getProgressColor = (type: string) => {
    switch (type) {
      case "early_bird": return "bg-yellow-400";
      case "volume": return "bg-green-400";
      case "loyalty": return "bg-orange-400";
      case "referral": return "bg-blue-400";
      case "milestone": return "bg-purple-400";
      default: return "bg-gray-400";
    }
  };

  const timeUntilExpiry = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Participation Rewards
          </span>
        </h3>
        <p className="text-muted-foreground">
          Complete challenges and earn exclusive rewards for {projectName}
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="glass border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span>Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{pointsEarned}</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                ${activeParticipation.amountInvested.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Invested</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {activeParticipation.bonusMultiplier}x
              </div>
              <div className="text-sm text-muted-foreground">Bonus Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {participationRewards.filter(r => r.completed).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{pointsEarned} / {totalPointsAvailable} points</span>
            </div>
            <Progress 
              value={(pointsEarned / totalPointsAvailable) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {participationRewards.map((reward) => {
          const isExpired = reward.expiresAt && new Date(reward.expiresAt) < new Date();
          const isClaimed = claimedRewards.includes(reward.id);
          const progressPercentage = (reward.progress / reward.target) * 100;
          
          return (
            <Card 
              key={reward.id} 
              className={`glass transition-all relative overflow-hidden ${
                reward.completed && !isClaimed ? 'border-green-500/50 bg-green-500/5' :
                isExpired ? 'opacity-50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <reward.icon className={`w-6 h-6 ${reward.color}`} />
                    <div>
                      <h4 className="font-semibold">{reward.title}</h4>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                  
                  {reward.completed && !isClaimed && (
                    <Badge className="bg-green-600 text-white animate-pulse">
                      Ready!
                    </Badge>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {reward.type === "volume" ? `$${reward.progress.toLocaleString()}` : reward.progress} / 
                      {reward.type === "volume" ? `$${reward.target.toLocaleString()}` : reward.target}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={progressPercentage} 
                      className="h-2"
                    />
                    <div 
                      className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(reward.type)}`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Reward Details */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm">{reward.reward}</div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{reward.points} points</span>
                    </div>
                  </div>
                  
                  {reward.expiresAt && !isExpired && (
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-xs text-orange-400">
                        <Clock className="w-3 h-3" />
                        <span>{timeUntilExpiry(reward.expiresAt)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  size="sm"
                  disabled={!reward.completed || isClaimed || Boolean(isExpired)}
                  onClick={() => claimReward(reward.id)}
                  variant={reward.completed && !isClaimed ? "default" : "outline"}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Claimed
                    </>
                  ) : reward.completed ? (
                    <>
                      <Gift className="w-4 h-4 mr-1" />
                      Claim Reward
                    </>
                  ) : isExpired ? (
                    "Expired"
                  ) : (
                    `${Math.ceil(((reward.target - reward.progress) / reward.target) * 100)}% to go`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bonus Multiplier Info */}
      <Card className="glass border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span>Level {userLevel} Bonus</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Your current level grants you a {activeParticipation.bonusMultiplier}x multiplier on all rewards
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span>Extra allocation bonus</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>Increased rewards</span>
                </div>
              </div>
            </div>
            <Badge className="bg-blue-600 text-white">
              {activeParticipation.bonusMultiplier}x
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Claim Animation */}
      {showClaimAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce text-center">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-xl font-bold text-purple-400">Reward Claimed!</div>
          </div>
        </div>
      )}
    </div>
  );
}