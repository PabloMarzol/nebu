import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Zap,
  Gift,
  Bell,
  Star,
  CheckCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react';

export default function EmailCampaigns() {
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');

  const emailCampaigns = [
    {
      id: 'welcome',
      name: 'Welcome Series',
      type: 'Drip Campaign',
      emails: 5,
      duration: '7 days',
      openRate: '68.4%',
      clickRate: '12.8%',
      conversionRate: '8.2%',
      subscribers: '42,580',
      status: 'active'
    },
    {
      id: 'onboarding',
      name: 'Quick Start Guide',
      type: 'Educational',
      emails: 3,
      duration: '3 days',
      openRate: '71.2%',
      clickRate: '15.3%',
      conversionRate: '11.7%',
      subscribers: '38,920',
      status: 'active'
    },
    {
      id: 'reactivation',
      name: 'Win-Back Campaign',
      type: 'Re-engagement',
      emails: 4,
      duration: '14 days',
      openRate: '45.6%',
      clickRate: '8.9%',
      conversionRate: '4.3%',
      subscribers: '15,680',
      status: 'active'
    },
    {
      id: 'premium',
      name: 'Upgrade to Pro',
      type: 'Conversion',
      emails: 6,
      duration: '21 days',
      openRate: '58.7%',
      clickRate: '10.4%',
      conversionRate: '6.8%',
      subscribers: '28,340',
      status: 'testing'
    }
  ];

  const emailTemplates = {
    welcome: {
      subject: 'Welcome to NebulaX - Start Trading in 30 Seconds! 🚀',
      preview: 'Your crypto trading journey begins now...',
      content: `
        <h1>Welcome to the Future of Crypto Trading!</h1>
        <p>You've just joined 850,000+ traders who chose speed, simplicity, and security.</p>
        
        <div class="highlight-box">
          <h2>Your Account is Ready!</h2>
          <p>✅ Email verified - Trade up to $25,000/day<br>
             ✅ Mobile app access - iOS, Android, PWA<br>
             ✅ Real-time market data - Live prices & charts</p>
        </div>
        
        <a href="#" class="cta-button">Start Trading Now</a>
        
        <h3>What Makes NebulaX Different?</h3>
        <ul>
          <li>30-second signup (vs 15+ minutes elsewhere)</li>
          <li>$25K daily limits with email only</li>
          <li>No biometric requirements</li>
          <li>Progressive verification when you're ready</li>
        </ul>
      `,
      cta: 'Start Trading Now',
      timing: 'Immediately after signup'
    },
    trading_tips: {
      subject: 'Pro Trading Tips: Your First $1000 in Crypto',
      preview: 'Learn from our top traders...',
      content: `
        <h1>Ready to Level Up Your Trading?</h1>
        <p>Here are the strategies our most successful traders use:</p>
        
        <div class="tip-box">
          <h3>1. Start with Dollar-Cost Averaging</h3>
          <p>Invest the same amount regularly, regardless of price. Our data shows 73% better returns over 6 months.</p>
        </div>
        
        <div class="tip-box">
          <h3>2. Use Our AI Signals (Pro Feature)</h3>
          <p>Users with AI signals enabled see 34% higher win rates. Upgrade to Pro for just $29/month.</p>
        </div>
        
        <a href="#" class="cta-button">Upgrade to Pro</a>
      `,
      cta: 'Upgrade to Pro',
      timing: 'Day 3 after signup'
    },
    mobile_reminder: {
      subject: 'Trade on the go - Download our mobile app',
      preview: 'Never miss a trading opportunity...',
      content: `
        <h1>Your Pocket-Sized Trading Powerhouse</h1>
        <p>68% of our trading volume happens on mobile. Don't get left behind!</p>
        
        <div class="app-features">
          <h3>Mobile App Features:</h3>
          <ul>
            <li>🔔 Real-time price alerts</li>
            <li>📱 Biometric-free security</li>
            <li>⚡ Instant order execution</li>
            <li>📊 Live portfolio tracking</li>
          </ul>
        </div>
        
        <div class="download-buttons">
          <a href="#" class="app-store-btn">Download for iOS</a>
          <a href="#" class="play-store-btn">Download for Android</a>
        </div>
      `,
      cta: 'Download App',
      timing: 'Day 5 after signup'
    }
  };

  const segmentPerformance = [
    {
      segment: 'New Users (0-7 days)',
      size: '12,450',
      openRate: '72.3%',
      clickRate: '14.2%',
      bestTime: '9:00 AM',
      topContent: 'Getting started guides'
    },
    {
      segment: 'Active Traders (Weekly)',
      size: '28,680',
      openRate: '65.8%',
      clickRate: '11.7%',
      bestTime: '6:00 PM',
      topContent: 'Market analysis'
    },
    {
      segment: 'Premium Users',
      size: '8,920',
      openRate: '78.4%',
      clickRate: '18.9%',
      bestTime: '8:00 AM',
      topContent: 'Advanced features'
    },
    {
      segment: 'Inactive Users (30+ days)',
      size: '15,340',
      openRate: '41.2%',
      clickRate: '6.8%',
      bestTime: '2:00 PM',
      topContent: 'Win-back offers'
    }
  ];

  const automationTriggers = [
    {
      trigger: 'User Signup',
      action: 'Welcome Series (5 emails)',
      delay: 'Immediate',
      goal: 'Complete first trade'
    },
    {
      trigger: 'First Trade Complete',
      action: 'Educational Series',
      delay: '24 hours',
      goal: 'Increase trading frequency'
    },
    {
      trigger: '7 Days No Activity',
      action: 'Re-engagement Campaign',
      delay: 'Immediate',
      goal: 'Return to platform'
    },
    {
      trigger: '$10K+ Trading Volume',
      action: 'Pro Upgrade Offer',
      delay: '48 hours',
      goal: 'Convert to paid tier'
    },
    {
      trigger: 'Mobile App Not Downloaded',
      action: 'Mobile Reminder Series',
      delay: '5 days',
      goal: 'App installation'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Email Marketing Campaigns</h1>
          <p className="text-xl text-gray-300">
            Automated email sequences to nurture and convert users at scale
          </p>
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="segments">Audience Segments</TabsTrigger>
            <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="mt-6">
            {/* Campaign Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">125,520</div>
                  <div className="text-sm text-gray-400">Total Subscribers</div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">64.7%</div>
                  <div className="text-sm text-gray-400">Avg Open Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">12.4%</div>
                  <div className="text-sm text-gray-400">Avg Click Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">7.8%</div>
                  <div className="text-sm text-gray-400">Conversion Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emailCampaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge className={campaign.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{campaign.type}</span>
                      <span>•</span>
                      <span>{campaign.emails} emails</span>
                      <span>•</span>
                      <span>{campaign.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-green-400">{campaign.openRate}</div>
                        <div className="text-xs text-gray-400">Open Rate</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">{campaign.clickRate}</div>
                        <div className="text-xs text-gray-400">Click Rate</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-purple-400">{campaign.conversionRate}</div>
                        <div className="text-xs text-gray-400">Conversion</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-yellow-400">{campaign.subscribers}</div>
                        <div className="text-xs text-gray-400">Subscribers</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {Object.entries(emailTemplates).map(([key, template]) => (
                <Card 
                  key={key} 
                  className={`bg-black/20 backdrop-blur-lg border-white/10 cursor-pointer transition-all ${
                    selectedTemplate === key ? 'border-blue-500' : 'hover:border-white/20'
                  }`}
                  onClick={() => setSelectedTemplate(key)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{template.subject}</CardTitle>
                    <p className="text-sm text-gray-400">{template.preview}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>CTA:</span>
                        <span className="text-blue-400">{template.cta}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Timing:</span>
                        <span className="text-gray-400">{template.timing}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Preview Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Email Preview: {emailTemplates[selectedTemplate].subject}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white text-black p-6 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: emailTemplates[selectedTemplate].content.replace(/class="/g, 'className="') }} />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="segments" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {segmentPerformance.map((segment, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg">{segment.segment}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">{segment.size} users</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-green-400">{segment.openRate}</div>
                        <div className="text-xs text-gray-400">Open Rate</div>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">{segment.clickRate}</div>
                        <div className="text-xs text-gray-400">Click Rate</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Best Send Time:</span>
                        <span className="text-purple-400 font-semibold">{segment.bestTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Top Content:</span>
                        <span className="text-yellow-400 font-semibold">{segment.topContent}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="mt-6">
            <div className="space-y-6">
              {automationTriggers.map((trigger, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{trigger.trigger}</h3>
                          <p className="text-gray-400">{trigger.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Delay: {trigger.delay}</div>
                        <div className="text-sm text-blue-400 font-semibold">Goal: {trigger.goal}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg border-white/10 mt-8">
              <CardHeader>
                <CardTitle>Automation Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">94% Delivery Rate</h3>
                    <p className="text-sm text-gray-400">Emails successfully delivered</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Perfect Timing</h3>
                    <p className="text-sm text-gray-400">Sent at optimal times per segment</p>
                  </div>
                  <div className="text-center">
                    <Star className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Smart Personalization</h3>
                    <p className="text-sm text-gray-400">Dynamic content based on user behavior</p>
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