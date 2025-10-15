import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  Trophy, 
  Clock, 
  MapPin,
  Verified,
  Quote,
  ThumbsUp,
  Share2,
  Play,
  Award,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function SuccessStories() {
  const [selectedStory, setSelectedStory] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const successStories = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      location: 'Singapore',
      profession: 'Software Engineer',
      joinDate: '6 months ago',
      verified: true,
      tier: 'Premium',
      stats: {
        totalReturn: '+284%',
        monthlyReturn: '+18.2%',
        winRate: '76%',
        totalTrades: 152
      },
      achievement: 'Top 5% Trader',
      quote: "NebulaX's 30-second signup got me trading instantly. The AI recommendations helped me turn $5,000 into $19,200 in just 6 months. The mobile app is incredible!",
      story: "I was intimidated by crypto trading until I found NebulaX. The streamlined signup meant I was trading Bitcoin within 30 seconds of discovering the platform. What really impressed me was the AI trading assistant - it guided me through my first trades and helped me avoid common mistakes. The educational content was perfectly paced for a beginner like me.",
      beforeAfter: {
        before: '$5,000',
        after: '$19,200',
        timeframe: '6 months'
      },
      tags: ['Beginner Friendly', 'AI Trading', 'Mobile First'],
      videoThumbnail: '/api/placeholder/400/225',
      hasVideo: true
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      location: 'Miami, FL',
      profession: 'Day Trader',
      joinDate: '1 year ago',
      verified: true,
      tier: 'Elite',
      stats: {
        totalReturn: '+542%',
        monthlyReturn: '+31.5%',
        winRate: '82%',
        totalTrades: 1247
      },
      achievement: 'Master Trader',
      quote: "Switched from Binance to NebulaX for the advanced tools. Copy trading feature alone has generated $50K+ in passive income. Best decision I've made!",
      story: "As a professional trader, I've used every major exchange. NebulaX stands out with its lightning-fast execution and comprehensive analytics. The copy trading platform has been a game-changer - I now have 200+ followers copying my trades, generating significant passive income while helping others learn.",
      beforeAfter: {
        before: '$25,000',
        after: '$160,500',
        timeframe: '12 months'
      },
      tags: ['Professional Trading', 'Copy Trading', 'Advanced Analytics'],
      videoThumbnail: '/api/placeholder/400/225',
      hasVideo: true
    },
    {
      id: 3,
      name: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      location: 'London, UK',
      profession: 'Marketing Manager',
      joinDate: '8 months ago',
      verified: true,
      tier: 'Pro',
      stats: {
        totalReturn: '+156%',
        monthlyReturn: '+12.8%',
        winRate: '68%',
        totalTrades: 89
      },
      achievement: 'Consistent Performer',
      quote: "The progressive verification system was perfect. Started with email, upgraded as I needed higher limits. No barriers, just smooth growth of my portfolio.",
      story: "I loved how NebulaX didn't overwhelm me with verification requirements upfront. Started with just email verification and $1,000 investment. As my confidence grew and I wanted to invest more, the progressive KYC system made it seamless to upgrade my limits. The educational content helped me understand risk management.",
      beforeAfter: {
        before: '$3,000',
        after: '$7,680',
        timeframe: '8 months'
      },
      tags: ['Progressive KYC', 'Risk Management', 'Steady Growth'],
      videoThumbnail: '/api/placeholder/400/225',
      hasVideo: false
    },
    {
      id: 4,
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      location: 'Seoul, Korea',
      profession: 'College Student',
      joinDate: '4 months ago',
      verified: true,
      tier: 'Basic',
      stats: {
        totalReturn: '+89%',
        monthlyReturn: '+16.2%',
        winRate: '71%',
        totalTrades: 34
      },
      achievement: 'Rising Star',
      quote: "Started with just $500 from my part-time job. The gamified learning system made crypto education fun and rewarding. Now I'm funding my tuition with trading profits!",
      story: "As a college student with limited funds, NebulaX was perfect. The learning pass system taught me everything about crypto while rewarding me with actual cryptocurrency. The mobile app meant I could trade between classes, and the AI assistant helped me make smart decisions with my limited budget.",
      beforeAfter: {
        before: '$500',
        after: '$945',
        timeframe: '4 months'
      },
      tags: ['Student Friendly', 'Gamified Learning', 'Small Budget'],
      videoThumbnail: '/api/placeholder/400/225',
      hasVideo: true
    }
  ];

  const platformStats = [
    { label: 'Total Users', value: '850K+', growth: '+23%' },
    { label: 'Success Rate', value: '74%', growth: '+8%' },
    { label: 'Avg Monthly Return', value: '+19.5%', growth: '+12%' },
    { label: 'Countries', value: '180+', growth: '+15%' }
  ];

  const testimonialHighlights = [
    {
      quote: "Fastest signup I've ever experienced",
      author: "Lisa M.",
      rating: 5,
      category: "User Experience"
    },
    {
      quote: "AI recommendations are incredibly accurate",
      author: "James P.",
      rating: 5,
      category: "AI Trading"
    },
    {
      quote: "Mobile app is better than desktop versions of other exchanges",
      author: "Ana S.",
      rating: 5,
      category: "Mobile Trading"
    },
    {
      quote: "Copy trading has changed my life financially",
      author: "Robert K.",
      rating: 5,
      category: "Copy Trading"
    }
  ];

  const currentStory = successStories[selectedStory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Real Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Stories</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            See how NebulaX users are achieving their financial goals
          </p>
          
          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {platformStats.map((stat, index) => (
              <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <Badge className="bg-green-500 text-white text-xs">{stat.growth}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Story Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          {successStories.map((story, index) => (
            <Button
              key={`story-nav-${story.id}-${index}`}
              variant={selectedStory === index ? "default" : "outline"}
              onClick={() => setSelectedStory(index)}
              className="flex items-center space-x-2"
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={story.avatar} />
                <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span>{story.name}</span>
            </Button>
          ))}
        </div>

        {/* Featured Story */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Story Content */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 h-full">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={currentStory.avatar} />
                    <AvatarFallback>{currentStory.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-bold">{currentStory.name}</h2>
                      {currentStory.verified && <Verified className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{currentStory.location}</span>
                      </span>
                      <span>{currentStory.profession}</span>
                      <Badge className="bg-purple-500 text-white">{currentStory.tier}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Quote */}
                  <div className="relative p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                    <Quote className="absolute top-4 left-4 w-8 h-8 text-blue-400 opacity-50" />
                    <p className="text-lg italic text-blue-100 pl-8">"{currentStory.quote}"</p>
                  </div>

                  {/* Story */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3">The Journey</h3>
                    <p className="text-gray-300 leading-relaxed">{currentStory.story}</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="font-semibold mb-2">Key Features Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentStory.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Video/Action */}
                  <div className="flex space-x-4">
                    {currentStory.hasVideo && (
                      <Button className="bg-red-500 hover:bg-red-600">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Video Story
                      </Button>
                    )}
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Story
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Achievement */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-500/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{currentStory.stats.totalReturn}</div>
                    <div className="text-sm text-gray-400">Total Return</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="text-lg font-bold text-blue-400">{currentStory.stats.monthlyReturn}</div>
                      <div className="text-xs text-gray-400">Monthly Avg</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="text-lg font-bold text-purple-400">{currentStory.stats.winRate}</div>
                      <div className="text-xs text-gray-400">Win Rate</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-white/10 rounded-lg">
                    <div className="text-lg font-bold text-yellow-400">{currentStory.stats.totalTrades}</div>
                    <div className="text-xs text-gray-400">Total Trades</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Before/After */}
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <span>Transformation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Started with</div>
                      <div className="text-xl font-bold text-red-400">{currentStory.beforeAfter.before}</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Now has</div>
                      <div className="text-xl font-bold text-green-400">{currentStory.beforeAfter.after}</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/20 rounded-lg">
                    <div className="text-sm text-purple-300">in {currentStory.beforeAfter.timeframe}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badge */}
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border-yellow-500/30">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <div className="text-lg font-bold text-yellow-400 mb-1">{currentStory.achievement}</div>
                <div className="text-sm text-gray-300">Joined {currentStory.joinDate}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Testimonials */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-center">What Users Love Most</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonialHighlights.map((testimonial, index) => (
                <div key={`highlight-${testimonial.author}-${index}`} className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="flex justify-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm italic text-gray-300 mb-2">"{testimonial.quote}"</p>
                  <div className="text-xs text-gray-400">{testimonial.author}</div>
                  <Badge variant="outline" className="text-xs mt-2">{testimonial.category}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg border-white/10">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of traders who've transformed their financial future with NebulaX
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-lg px-12 py-4">
                <Zap className="w-6 h-6 mr-2" />
                Start Trading in 30 Seconds
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-12 py-4">
                <Target className="w-6 h-6 mr-2" />
                See Live Demo
              </Button>
            </div>
            <div className="text-sm text-gray-400 mt-4">
              No credit card required • No hidden fees • Join 850,000+ successful traders
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}