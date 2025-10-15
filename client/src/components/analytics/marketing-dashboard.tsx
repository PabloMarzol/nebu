import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  Globe,
  Smartphone,
  Mail,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Eye,
  MousePointer,
  UserPlus,
  CreditCard
} from 'lucide-react';

export default function MarketingDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('conversions');
  
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 2847,
    conversionsToday: 156,
    revenueToday: 12850,
    signupsToday: 423
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        conversionsToday: prev.conversionsToday + Math.floor(Math.random() * 3),
        revenueToday: prev.revenueToday + Math.floor(Math.random() * 500),
        signupsToday: prev.signupsToday + Math.floor(Math.random() * 5)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const kpiData = [
    {
      title: 'Total Conversions',
      value: '15,247',
      change: '+12.5%',
      trend: 'up',
      icon: <Target className="w-6 h-6" />,
      color: 'text-green-400'
    },
    {
      title: 'Cost Per Acquisition',
      value: '$9.32',
      change: '-18.2%',
      trend: 'down',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-blue-400'
    },
    {
      title: 'Conversion Rate',
      value: '8.7%',
      change: '+2.1%',
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-purple-400'
    },
    {
      title: 'Active Campaigns',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-yellow-400'
    }
  ];

  const channelPerformance = [
    {
      channel: 'Social Media',
      spend: '$45,200',
      impressions: '2.8M',
      clicks: '112K',
      conversions: '4,850',
      cpa: '$9.32',
      roas: '4.2x',
      trend: 'up'
    },
    {
      channel: 'Search Ads',
      spend: '$32,100',
      impressions: '1.9M',
      clicks: '89K',
      conversions: '3,920',
      cpa: '$8.19',
      roas: '5.1x',
      trend: 'up'
    },
    {
      channel: 'Email Marketing',
      spend: '$8,500',
      impressions: '850K',
      clicks: '85K',
      conversions: '2,180',
      cpa: '$3.90',
      roas: '8.7x',
      trend: 'up'
    },
    {
      channel: 'Influencer',
      spend: '$28,900',
      impressions: '1.2M',
      clicks: '45K',
      conversions: '1,560',
      cpa: '$18.52',
      roas: '2.8x',
      trend: 'down'
    }
  ];

  const audienceSegments = [
    {
      segment: 'Crypto Beginners',
      size: '45,230',
      conversionRate: '12.3%',
      avgOrderValue: '$487',
      topContent: 'Educational guides',
      color: 'bg-green-500'
    },
    {
      segment: 'Active Traders',
      size: '28,950',
      conversionRate: '18.7%',
      avgOrderValue: '$1,250',
      topContent: 'Advanced features',
      color: 'bg-blue-500'
    },
    {
      segment: 'Mobile Users',
      size: '67,800',
      conversionRate: '9.8%',
      avgOrderValue: '$325',
      topContent: 'App features',
      color: 'bg-purple-500'
    },
    {
      segment: 'High Value',
      size: '8,920',
      conversionRate: '28.4%',
      avgOrderValue: '$2,850',
      topContent: 'Premium tools',
      color: 'bg-yellow-500'
    }
  ];

  const campaignData = [
    {
      name: '30-Second Signup',
      status: 'active',
      budget: '$15,000',
      spent: '$12,450',
      impressions: '1.2M',
      clicks: '48K',
      conversions: '2,180',
      ctr: '4.0%',
      cpa: '$5.71'
    },
    {
      name: 'Mobile-First Trading',
      status: 'active',
      budget: '$22,000',
      spent: '$18,900',
      impressions: '1.8M',
      clicks: '67K',
      conversions: '2,890',
      ctr: '3.7%',
      cpa: '$6.54'
    },
    {
      name: 'No KYC Required',
      status: 'testing',
      budget: '$8,500',
      spent: '$3,200',
      impressions: '450K',
      clicks: '18K',
      conversions: '850',
      ctr: '4.0%',
      cpa: '$3.76'
    }
  ];

  const funnelData = [
    { stage: 'Impressions', value: 8350000, conversion: 100 },
    { stage: 'Clicks', value: 334000, conversion: 4.0 },
    { stage: 'Landing Views', value: 301000, conversion: 90.1 },
    { stage: 'Signup Started', value: 48000, conversion: 15.9 },
    { stage: 'Email Verified', value: 42000, conversion: 87.5 },
    { stage: 'First Trade', value: 15247, conversion: 36.3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Marketing Analytics</h1>
            <p className="text-gray-300">Real-time client acquisition metrics and campaign performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 Days
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">Live Data</span>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-green-400">{realTimeMetrics.activeUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conversions Today</p>
                  <p className="text-2xl font-bold text-blue-400">{realTimeMetrics.conversionsToday}</p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Revenue Today</p>
                  <p className="text-2xl font-bold text-purple-400">${realTimeMetrics.revenueToday.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Signups Today</p>
                  <p className="text-2xl font-bold text-yellow-400">{realTimeMetrics.signupsToday}</p>
                </div>
                <UserPlus className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={kpi.color}>
                    {kpi.icon}
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {kpi.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-sm text-gray-400">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="channels" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="channels">Channel Performance</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Analysis</TabsTrigger>
            <TabsTrigger value="audience">Audience Insights</TabsTrigger>
            <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="mt-6">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Channel Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3">Channel</th>
                        <th className="text-center p-3">Spend</th>
                        <th className="text-center p-3">Impressions</th>
                        <th className="text-center p-3">Clicks</th>
                        <th className="text-center p-3">Conversions</th>
                        <th className="text-center p-3">CPA</th>
                        <th className="text-center p-3">ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelPerformance.map((channel, index) => (
                        <tr key={index} className="border-b border-white/5">
                          <td className="p-3">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                channel.trend === 'up' ? 'bg-green-400' : 'bg-red-400'
                              }`} />
                              <span className="font-medium">{channel.channel}</span>
                            </div>
                          </td>
                          <td className="text-center p-3">{channel.spend}</td>
                          <td className="text-center p-3">{channel.impressions}</td>
                          <td className="text-center p-3">{channel.clicks}</td>
                          <td className="text-center p-3 text-green-400 font-semibold">{channel.conversions}</td>
                          <td className="text-center p-3">{channel.cpa}</td>
                          <td className="text-center p-3 text-purple-400 font-semibold">{channel.roas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaignData.map((campaign, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge className={campaign.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Budget:</span>
                        <span>{campaign.budget}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Spent:</span>
                        <span className="text-red-400">{campaign.spent}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Impressions:</span>
                        <span>{campaign.impressions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Clicks:</span>
                        <span>{campaign.clicks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Conversions:</span>
                        <span className="text-green-400 font-semibold">{campaign.conversions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CTR:</span>
                        <span className="text-blue-400">{campaign.ctr}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CPA:</span>
                        <span className="text-purple-400">{campaign.cpa}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audience" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {audienceSegments.map((segment, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${segment.color}`} />
                      <CardTitle className="text-lg">{segment.segment}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">{segment.size}</div>
                        <div className="text-xs text-gray-400">Audience Size</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-green-400">{segment.conversionRate}</div>
                        <div className="text-xs text-gray-400">Conversion Rate</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-purple-400">{segment.avgOrderValue}</div>
                        <div className="text-xs text-gray-400">Avg Order Value</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-xs font-semibold text-yellow-400">{segment.topContent}</div>
                        <div className="text-xs text-gray-400">Top Content</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="funnel" className="mt-6">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Conversion Funnel Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((stage, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-semibold">{stage.stage}</div>
                          <Badge className="bg-blue-500 text-white">
                            {stage.conversion}%
                          </Badge>
                        </div>
                        <div className="text-lg font-bold text-green-400">
                          {stage.value.toLocaleString()}
                        </div>
                      </div>
                      {index < funnelData.length - 1 && (
                        <div className="flex justify-center my-2">
                          <ArrowDown className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}