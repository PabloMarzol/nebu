import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Smartphone, 
  Globe, 
  Mail,
  MessageSquare,
  Video,
  Share2,
  Gift,
  Zap,
  Crown,
  Star
} from 'lucide-react';

export default function AcquisitionCampaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState('social');

  const campaigns = [
    {
      id: 'social',
      name: 'Social Media Blitz',
      platform: 'Multi-Platform',
      budget: '$25,000',
      reach: '2.5M',
      ctr: '3.2%',
      cpa: '$8.50',
      description: 'Targeted social media campaign across Twitter, Reddit, and TikTok',
      status: 'active'
    },
    {
      id: 'influencer',
      name: 'Crypto Influencers',
      platform: 'YouTube/Twitter',
      budget: '$50,000',
      reach: '1.8M',
      ctr: '5.1%',
      cpa: '$12.30',
      description: 'Partnership with top crypto influencers and thought leaders',
      status: 'active'
    },
    {
      id: 'content',
      name: 'Educational Content',
      platform: 'Blog/SEO',
      budget: '$15,000',
      reach: '850K',
      ctr: '4.8%',
      cpa: '$6.20',
      description: 'High-value educational content for crypto beginners',
      status: 'planning'
    },
    {
      id: 'mobile',
      name: 'Mobile App Install',
      platform: 'App Stores',
      budget: '$35,000',
      reach: '3.2M',
      ctr: '2.9%',
      cpa: '$11.80',
      description: 'App store optimization and install campaigns',
      status: 'active'
    }
  ];

  const referralProgram = {
    userReward: '$50 USDT',
    referrerReward: '$25 USDT',
    tierBonus: {
      bronze: '10 referrals → $100 bonus',
      silver: '50 referrals → $500 bonus',
      gold: '100 referrals → $1,500 bonus'
    },
    currentStats: {
      totalReferrals: '24,580',
      activeReferrers: '8,940',
      conversionRate: '68%',
      avgLifetimeValue: '$2,850'
    }
  };

  const targetAudiences = [
    {
      segment: 'Crypto Beginners',
      size: '45M',
      pain: 'Complex exchanges intimidate them',
      solution: '30-second signup, no KYC barriers',
      channels: ['TikTok', 'YouTube', 'Reddit'],
      expectedCPA: '$8-12'
    },
    {
      segment: 'Active Traders',
      size: '12M',
      pain: 'Slow verification, limited features',
      solution: 'Instant trading, advanced tools',
      channels: ['Twitter', 'Telegram', 'Discord'],
      expectedCPA: '$15-25'
    },
    {
      segment: 'Mobile-First Users',
      size: '78M',
      pain: 'Poor mobile experiences',
      solution: 'Native app, PWA, biometric-free',
      channels: ['App Store', 'Google Play', 'Mobile ads'],
      expectedCPA: '$10-18'
    },
    {
      segment: 'Institutional Clients',
      size: '2.5K',
      pain: 'Lack of professional tools',
      solution: 'White-label, API access, compliance',
      channels: ['LinkedIn', 'Industry events', 'Direct sales'],
      expectedCPA: '$500-2000'
    }
  ];

  const creativeAssets = [
    {
      type: 'Video Ad',
      title: '30 Seconds to Trading',
      description: 'Speed comparison showing NebulaX vs competitors',
      performance: 'CTR: 4.2%',
      platforms: ['YouTube', 'TikTok', 'Twitter']
    },
    {
      type: 'Carousel Ad',
      title: 'No KYC Required',
      description: 'Progressive verification benefits showcase',
      performance: 'CTR: 3.8%',
      platforms: ['Facebook', 'Instagram', 'LinkedIn']
    },
    {
      type: 'Static Banner',
      title: 'Mobile-First Exchange',
      description: 'App store screenshots and features',
      performance: 'CTR: 2.9%',
      platforms: ['Google Ads', 'App Store', 'Crypto websites']
    },
    {
      type: 'Interactive Demo',
      title: 'Try Before You Sign',
      description: 'Live trading simulator',
      performance: 'Conversion: 12%',
      platforms: ['Website', 'Landing pages']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Marketing & Client Acquisition</h1>
          <p className="text-xl text-gray-300">
            Comprehensive campaigns designed to rapidly scale user acquisition
          </p>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="audiences">Target Audiences</TabsTrigger>
            <TabsTrigger value="referrals">Referral Program</TabsTrigger>
            <TabsTrigger value="creatives">Creative Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Campaign Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">$125K</div>
                      <div className="text-sm text-gray-400">Total Budget</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">8.35M</div>
                      <div className="text-sm text-gray-400">Total Reach</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">4.0%</div>
                      <div className="text-sm text-gray-400">Avg CTR</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">$9.70</div>
                      <div className="text-sm text-gray-400">Avg CPA</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Ad Impressions</span>
                      <span className="font-bold">8.35M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Clicks</span>
                      <span className="font-bold">334K (4.0%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Landing Page Views</span>
                      <span className="font-bold">301K (90%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Signups Started</span>
                      <span className="font-bold">48K (16%)</span>
                    </div>
                    <div className="flex justify-between items-center text-green-400">
                      <span>Completed Signups</span>
                      <span className="font-bold">42K (88%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-black/20 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge className={campaign.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{campaign.platform}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Budget:</span>
                        <span className="font-bold">{campaign.budget}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reach:</span>
                        <span className="font-bold">{campaign.reach}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CTR:</span>
                        <span className="font-bold text-green-400">{campaign.ctr}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CPA:</span>
                        <span className="font-bold text-blue-400">{campaign.cpa}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">{campaign.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audiences" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {targetAudiences.map((audience, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{audience.segment}</CardTitle>
                      <Badge className="bg-blue-500 text-white">
                        <Users className="w-4 h-4 mr-1" />
                        {audience.size}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-red-400 mb-1">Pain Point</h4>
                        <p className="text-sm text-gray-300">{audience.pain}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-400 mb-1">Our Solution</h4>
                        <p className="text-sm text-gray-300">{audience.solution}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-400 mb-2">Target Channels</h4>
                        <div className="flex flex-wrap gap-2">
                          {audience.channels.map((channel, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/10">
                        <span className="text-sm text-gray-400">Expected CPA:</span>
                        <span className="font-bold text-purple-400">{audience.expectedCPA}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-6 h-6 text-green-400" />
                    <span>Referral Rewards</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-2">{referralProgram.userReward}</div>
                      <div className="text-sm text-gray-300">New User Reward</div>
                    </div>
                    <div className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-2">{referralProgram.referrerReward}</div>
                      <div className="text-sm text-gray-300">Referrer Reward</div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-purple-400">Tier Bonuses</h4>
                      {Object.entries(referralProgram.tierBonus).map(([tier, bonus]) => (
                        <div key={tier} className="flex justify-between text-sm">
                          <span className="capitalize">{tier}:</span>
                          <span className="text-yellow-400">{bonus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Referral Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-purple-400">{referralProgram.currentStats.totalReferrals}</div>
                      <div className="text-xs text-gray-400">Total Referrals</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-blue-400">{referralProgram.currentStats.activeReferrers}</div>
                      <div className="text-xs text-gray-400">Active Referrers</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-green-400">{referralProgram.currentStats.conversionRate}</div>
                      <div className="text-xs text-gray-400">Conversion Rate</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-yellow-400">{referralProgram.currentStats.avgLifetimeValue}</div>
                      <div className="text-xs text-gray-400">Avg LTV</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Referral Program Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Share2 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Easy Sharing</h3>
                    <p className="text-sm text-gray-400">One-click sharing across all social platforms</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Real-time Tracking</h3>
                    <p className="text-sm text-gray-400">Live dashboard showing referral progress</p>
                  </div>
                  <div className="text-center">
                    <Crown className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Tier Progression</h3>
                    <p className="text-sm text-gray-400">Unlock higher rewards as you refer more</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creatives" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creativeAssets.map((asset, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{asset.title}</CardTitle>
                      <Badge className="bg-purple-500 text-white">
                        {asset.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{asset.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">Performance:</span>
                      <span className="text-green-400 font-semibold">{asset.performance}</span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Platforms:</div>
                      <div className="flex flex-wrap gap-2">
                        {asset.platforms.map((platform, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Video className="w-4 h-4 mr-2" />
                      Preview Asset
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border-white/10 mt-8">
              <CardHeader>
                <CardTitle>Creative Testing Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2">A/B Testing</h3>
                    <p className="text-sm text-gray-300">Test headlines, visuals, and CTAs across all channels</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-400 mb-2">Performance Tracking</h3>
                    <p className="text-sm text-gray-300">Real-time monitoring of CTR, conversion, and engagement</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-400 mb-2">Optimization</h3>
                    <p className="text-sm text-gray-300">Continuous improvement based on data insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}