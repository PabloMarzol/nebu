import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  BarChart3, 
  Zap,
  Globe,
  Mail,
  MessageSquare,
  Share2,
  Award,
  Clock,
  ArrowRight,
  Star,
  PlayCircle
} from "lucide-react";

export default function MarketingPage() {
  const [campaigns] = useState([
    {
      id: 1,
      name: "DeFi Revolution Campaign",
      type: "Social Media",
      status: "active",
      reach: "2.8M",
      engagement: "12.4%",
      conversions: 847,
      budget: "$15,000",
      remaining: "$8,200"
    },
    {
      id: 2,
      name: "Institutional Trading Push",
      type: "Email Marketing",
      status: "active",
      reach: "125K",
      engagement: "18.7%",
      conversions: 1203,
      budget: "$8,500",
      remaining: "$3,100"
    },
    {
      id: 3,
      name: "Mobile App Launch",
      type: "Influencer Partnership",
      status: "completed",
      reach: "1.2M",
      engagement: "8.9%",
      conversions: 2156,
      budget: "$25,000",
      remaining: "$0"
    }
  ]);

  const analytics = {
    totalReach: "8.3M",
    conversionRate: "5.7%",
    avgEngagement: "13.2%",
    totalROI: "285%",
    newUsers: "12,847",
    retentionRate: "76%"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Marketing Dashboard
          </h1>
          <p className="text-gray-300">Track campaigns, analyze performance, and grow your trading community</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Reach</p>
                  <p className="text-xl font-bold text-cyan-400">{analytics.totalReach}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Conversion Rate</p>
                  <p className="text-xl font-bold text-green-400">{analytics.conversionRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Engagement</p>
                  <p className="text-xl font-bold text-purple-400">{analytics.avgEngagement}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">ROI</p>
                  <p className="text-xl font-bold text-yellow-400">{analytics.totalROI}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-400">New Users</p>
                  <p className="text-xl font-bold text-orange-400">{analytics.newUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-pink-400" />
                <div>
                  <p className="text-sm text-gray-400">Retention</p>
                  <p className="text-xl font-bold text-pink-400">{analytics.retentionRate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="content">Content Hub</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <div className="grid gap-6">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{campaign.type}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Reach</p>
                        <p className="text-xl font-bold text-cyan-400">{campaign.reach}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Engagement</p>
                        <p className="text-xl font-bold text-green-400">{campaign.engagement}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Conversions</p>
                        <p className="text-xl font-bold text-purple-400">{campaign.conversions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Budget</p>
                        <p className="text-xl font-bold text-yellow-400">{campaign.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Remaining</p>
                        <p className="text-xl font-bold text-orange-400">{campaign.remaining}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress 
                        value={((parseFloat(campaign.budget.replace(/[$,]/g, '')) - parseFloat(campaign.remaining.replace(/[$,]/g, ''))) / parseFloat(campaign.budget.replace(/[$,]/g, ''))) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>User Acquisition</span>
                      <span className="text-green-400">+24.7%</span>
                    </div>
                    <Progress value={74} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>Engagement Rate</span>
                      <span className="text-cyan-400">+18.2%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>Revenue Impact</span>
                      <span className="text-purple-400">+31.5%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded bg-gray-700/30">
                      <div>
                        <p className="font-medium">DeFi Yield Farming Guide</p>
                        <p className="text-sm text-gray-400">Video Tutorial</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">847K views</p>
                        <p className="text-sm text-gray-400">18.7% CTR</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded bg-gray-700/30">
                      <div>
                        <p className="font-medium">Market Analysis: Bull Run Signals</p>
                        <p className="text-sm text-gray-400">Blog Post</p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-bold">623K reads</p>
                        <p className="text-sm text-gray-400">12.4% CTR</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded bg-gray-700/30">
                      <div>
                        <p className="font-medium">Security Best Practices</p>
                        <p className="text-sm text-gray-400">Infographic</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-400 font-bold">445K shares</p>
                        <p className="text-sm text-gray-400">9.8% CTR</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="channels">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50 hover:border-cyan-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Globe className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Social Media</h3>
                  <p className="text-gray-400 text-sm mb-4">2.8M followers across platforms</p>
                  <Button className="w-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                    Manage Posts
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50 hover:border-green-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Email Marketing</h3>
                  <p className="text-gray-400 text-sm mb-4">125K active subscribers</p>
                  <Button className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30">
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Community</h3>
                  <p className="text-gray-400 text-sm mb-4">45K Discord & Telegram members</p>
                  <Button className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                    Engage Users
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50 hover:border-yellow-500/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <PlayCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Content Creation</h3>
                  <p className="text-gray-400 text-sm mb-4">Weekly educational content</p>
                  <Button className="w-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                    Content Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="grid gap-6">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle>Content Strategy & Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-cyan-400">This Week's Focus</h4>
                      <div className="space-y-2">
                        <div className="p-3 rounded bg-gray-700/30">
                          <p className="font-medium">Market Analysis Monday</p>
                          <p className="text-sm text-gray-400">Weekly market breakdown</p>
                        </div>
                        <div className="p-3 rounded bg-gray-700/30">
                          <p className="font-medium">Tutorial Tuesday</p>
                          <p className="text-sm text-gray-400">Advanced trading strategies</p>
                        </div>
                        <div className="p-3 rounded bg-gray-700/30">
                          <p className="font-medium">Feature Friday</p>
                          <p className="text-sm text-gray-400">New platform updates</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-400">Top Performers</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 rounded bg-gray-700/30">
                          <span>DeFi Guide Series</span>
                          <span className="text-green-400">2.1M views</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded bg-gray-700/30">
                          <span>Security Tips</span>
                          <span className="text-cyan-400">1.8M views</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded bg-gray-700/30">
                          <span>Market Updates</span>
                          <span className="text-purple-400">1.5M views</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-400">Upcoming Content</h4>
                      <div className="space-y-2">
                        <div className="p-3 rounded bg-gray-700/30">
                          <p className="font-medium">NFT Trading Masterclass</p>
                          <p className="text-sm text-gray-400">Coming Dec 28</p>
                        </div>
                        <div className="p-3 rounded bg-gray-700/30">
                          <p className="font-medium">2025 Crypto Predictions</p>
                          <p className="text-sm text-gray-400">Coming Jan 1</p>
                        </div>
                        <div className="p-3 rounded bg-gray-700/30">
                          <p className="font-medium">Platform 3.0 Reveal</p>
                          <p className="text-sm text-gray-400">Coming Jan 15</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}