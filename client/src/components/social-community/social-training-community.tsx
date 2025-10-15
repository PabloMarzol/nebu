import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, TrendingUp, Star, Crown, Medal, Award, Flame, Target, Zap, Search, UserPlus, MessageCircle } from 'lucide-react';

interface CommunityMember {
  userId: number;
  username: string;
  displayName: string;
  avatar: string;
  totalXp: number;
  level: number;
  rank: number;
  badges: string[];
  achievements: string[];
  tradingScore: number;
  communityPoints: number;
  followers: number;
  following: number;
  joinedAt: Date;
  lastActive: Date;
}

interface LeaderboardEntry {
  userId: number;
  username: string;
  score: number;
  rank: number;
  change: number;
  avatar: string;
  level: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
}

const SocialTrainingCommunity: React.FC = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('daily');
  const [searchTerm, setSearchTerm] = useState('');
  const [following, setFollowing] = useState<number[]>([2, 5, 8]);

  // Mock data for community members
  const [communityMembers] = useState<CommunityMember[]>([
    {
      userId: 1,
      username: 'CryptoTrader_Pro',
      displayName: 'Alex Thompson',
      avatar: '/avatars/alex.jpg',
      totalXp: 15420,
      level: 12,
      rank: 1,
      badges: ['early_adopter', 'trading_master', 'community_leader'],
      achievements: ['first_trade', 'profitable_month', 'risk_manager'],
      tradingScore: 94.5,
      communityPoints: 1250,
      followers: 342,
      following: 89,
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date('2025-01-01T15:30:00')
    },
    {
      userId: 2,
      username: 'DeFi_Wizard',
      displayName: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      totalXp: 12890,
      level: 10,
      rank: 2,
      badges: ['defi_expert', 'yield_farmer', 'liquidity_provider'],
      achievements: ['defi_master', 'yield_optimization', 'impermanent_loss_survivor'],
      tradingScore: 89.2,
      communityPoints: 1050,
      followers: 287,
      following: 156,
      joinedAt: new Date('2024-02-20'),
      lastActive: new Date('2025-01-01T14:15:00')
    },
    {
      userId: 3,
      username: 'BlockchainBull',
      displayName: 'Mike Rodriguez',
      avatar: '/avatars/mike.jpg',
      totalXp: 11240,
      level: 9,
      rank: 3,
      badges: ['security_expert', 'hodler', 'market_analyst'],
      achievements: ['security_master', 'long_term_holder', 'market_predictor'],
      tradingScore: 87.8,
      communityPoints: 890,
      followers: 198,
      following: 73,
      joinedAt: new Date('2024-03-10'),
      lastActive: new Date('2025-01-01T16:45:00')
    },
    {
      userId: 4,
      username: 'AltcoinHunter',
      displayName: 'Emma Wilson',
      avatar: '/avatars/emma.jpg',
      totalXp: 9850,
      level: 8,
      rank: 4,
      badges: ['altcoin_specialist', 'gem_finder', 'early_investor'],
      achievements: ['gem_hunter', 'portfolio_diversifier', 'trend_spotter'],
      tradingScore: 82.1,
      communityPoints: 720,
      followers: 145,
      following: 234,
      joinedAt: new Date('2024-04-05'),
      lastActive: new Date('2025-01-01T13:20:00')
    },
    {
      userId: 5,
      username: 'TradingBot_AI',
      displayName: 'David Kim',
      avatar: '/avatars/david.jpg',
      totalXp: 8920,
      level: 7,
      rank: 5,
      badges: ['algo_trader', 'bot_master', 'efficiency_expert'],
      achievements: ['automation_master', 'consistent_profits', 'risk_minimizer'],
      tradingScore: 91.3,
      communityPoints: 650,
      followers: 167,
      following: 45,
      joinedAt: new Date('2024-05-12'),
      lastActive: new Date('2025-01-01T12:10:00')
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: 'first_trade',
      name: 'First Trade',
      description: 'Complete your first cryptocurrency trade',
      icon: '🎯',
      rarity: 'common',
      requirement: 'Make 1 trade'
    },
    {
      id: 'profitable_month',
      name: 'Profitable Month',
      description: 'End a month with positive trading returns',
      icon: '📈',
      rarity: 'rare',
      requirement: 'Positive P&L for 30 days'
    },
    {
      id: 'risk_manager',
      name: 'Risk Manager',
      description: 'Maintain proper risk management for 100 trades',
      icon: '🛡️',
      rarity: 'epic',
      requirement: 'Use stop-loss in 100 trades'
    },
    {
      id: 'community_leader',
      name: 'Community Leader',
      description: 'Help 50 community members with trading advice',
      icon: '👑',
      rarity: 'legendary',
      requirement: 'Help 50 members'
    }
  ]);

  // Generate leaderboard data
  const generateLeaderboard = (type: string): LeaderboardEntry[] => {
    return communityMembers.slice(0, 10).map((member, index) => ({
      userId: member.userId,
      username: member.username,
      score: type === 'xp' ? member.totalXp : 
             type === 'trading' ? member.tradingScore * 100 :
             type === 'community' ? member.communityPoints : member.totalXp,
      rank: index + 1,
      change: Math.floor(Math.random() * 10) - 5, // -5 to +5
      avatar: member.avatar,
      level: member.level
    }));
  };

  const [leaderboards] = useState({
    daily: generateLeaderboard('xp'),
    weekly: generateLeaderboard('trading'),
    monthly: generateLeaderboard('community'),
    all_time: generateLeaderboard('xp')
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-yellow-400';
    if (level >= 7) return 'text-purple-400';
    if (level >= 5) return 'text-blue-400';
    return 'text-green-400';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-orange-400" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">#{rank}</span>;
    }
  };

  const toggleFollow = (userId: number) => {
    if (following.includes(userId)) {
      setFollowing(following.filter(id => id !== userId));
    } else {
      setFollowing([...following, userId]);
    }
  };

  const filteredMembers = communityMembers.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentLeaderboard = leaderboards[selectedLeaderboard as keyof typeof leaderboards];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-purple-500" />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Social Training Community
            </h2>
            <p className="text-gray-400">Connect, compete, and learn with fellow crypto traders</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{communityMembers.length} Active Members</span>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">1,247</div>
            <div className="text-sm text-gray-400">Total Competitions</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">89%</div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">$2.4M</div>
            <div className="text-sm text-gray-400">Total Profits</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">152K</div>
            <div className="text-sm text-gray-400">XP Distributed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {['daily', 'weekly', 'monthly', 'all_time'].map((period) => (
                <Button
                  key={period}
                  variant={selectedLeaderboard === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLeaderboard(period)}
                  className="capitalize"
                >
                  {period.replace('_', ' ')}
                </Button>
              ))}
            </div>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live Rankings
            </Badge>
          </div>

          <Card className="bg-black/20 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>{selectedLeaderboard.replace('_', ' ').toUpperCase()} Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentLeaderboard.map((entry, index) => (
                  <div key={entry.userId} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-500/10 to-purple-500/10 border border-yellow-500/20' : 'bg-gray-800/30'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(entry.rank)}
                        {entry.change !== 0 && (
                          <div className={`text-xs ${entry.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {entry.change > 0 ? '↗' : '↘'} {Math.abs(entry.change)}
                          </div>
                        )}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white">{entry.username}</div>
                        <div className={`text-sm ${getLevelColor(entry.level)}`}>Level {entry.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{entry.score.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">
                        {selectedLeaderboard === 'trading' ? 'Score' : 
                         selectedLeaderboard === 'community' ? 'Points' : 'XP'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">
              {filteredMembers.length} Results
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.userId} className="bg-black/20 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white">{member.username}</div>
                        <div className="text-sm text-gray-400">{member.displayName}</div>
                        <div className={`text-sm ${getLevelColor(member.level)}`}>Level {member.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-yellow-400">
                        {getRankIcon(member.rank)}
                        <span className="text-sm">#{member.rank}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">XP</span>
                      <span className="text-white">{member.totalXp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Trading Score</span>
                      <span className="text-green-400">{member.tradingScore.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Followers</span>
                      <span className="text-blue-400">{member.followers}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.badges.slice(0, 3).map((badge, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {badge.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={following.includes(member.userId) ? "default" : "outline"}
                      onClick={() => toggleFollow(member.userId)}
                      className="flex-1"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      {following.includes(member.userId) ? 'Following' : 'Follow'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-black/20 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{achievement.name}</div>
                      <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs capitalize mt-1`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                  <div className="text-xs text-gray-400">
                    Requirement: {achievement.requirement}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span>Weekly Trading Challenge</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">Achieve 10% profit in one week with maximum 5% drawdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>67/100 participants</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Reward: 500 XP + 25 Tokens</div>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
                <Button className="w-full">Join Challenge</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500/20 to-green-500/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span>DeFi Mastery Quest</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">Complete 5 different DeFi protocols and earn yield</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Your Progress</span>
                    <span>3/5 protocols</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">Reward: 750 XP + Rare Badge</div>
                  <Badge className="bg-yellow-500/20 text-yellow-400">In Progress</Badge>
                </div>
                <Button variant="outline" className="w-full">View Details</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialTrainingCommunity;