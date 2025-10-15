import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CryptoMascot from '@/components/education/crypto-mascot';
import RiskAssessment from '@/components/education/risk-assessment';
import AchievementBadges from '@/components/education/achievement-badges';
import TradingInsights from '@/components/education/trading-insights';
import MarketSentimentTranslation from '@/components/education/market-sentiment';
import { BookOpen, Trophy, Brain, TrendingUp, Target, Sparkles, Users, Globe } from 'lucide-react';

export default function Education() {
  const [activeTab, setActiveTab] = useState('overview');

  const educationStats = {
    totalLearners: 15420,
    coursesCompleted: 8934,
    averageProgress: 67,
    activeToday: 342
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-purple-900/10">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full">
              <BookOpen className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">🎓 Crypto Education Hub</h1>
              <p className="text-gray-400 mt-2">Master cryptocurrency trading with gamified learning and AI-powered insights</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">{educationStats.totalLearners.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Total Learners</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">{educationStats.coursesCompleted.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Courses Completed</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-purple-400">{educationStats.averageProgress}%</div>
              <div className="text-xs text-gray-400">Avg Progress</div>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">{educationStats.activeToday}</div>
              <div className="text-xs text-gray-400">Active Today</div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-gray-800/50 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="mascot" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Nebby</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Risk Tool</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Sentiment</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Welcome Card */}
              <Card className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🚀</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Welcome to Your Learning Journey!</h3>
                      <p className="text-gray-400">Everything you need to become a confident crypto trader</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Meet Nebby, your AI learning companion
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Get instant risk assessments with one click
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Earn achievement badges as you learn
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      Receive personalized trading insights
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-pink-500 rounded-full" />
                      Understand market sentiment in plain English
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-900/40 border-gray-500/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Start</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab('mascot')}
                      className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Chat with Nebby - Get Your First Crypto Tip
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('risk')}
                      variant="outline"
                      className="w-full justify-start border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Check Your Portfolio Risk (One Click)
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('achievements')}
                      variant="outline"
                      className="w-full justify-start border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Start Earning Achievement Badges
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30 cursor-pointer hover:border-green-400/50 transition-colors" onClick={() => setActiveTab('mascot')}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">🤖</div>
                  <h4 className="font-bold text-white mb-2">Nebby AI Mascot</h4>
                  <p className="text-gray-400 text-sm">Your friendly crypto learning companion with personality-driven tips</p>
                  <Badge className="mt-3 bg-green-500/20 text-green-400">Interactive</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 cursor-pointer hover:border-blue-400/50 transition-colors" onClick={() => setActiveTab('risk')}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="font-bold text-white mb-2">Risk Assessment</h4>
                  <p className="text-gray-400 text-sm">One-click portfolio analysis with visual risk breakdown</p>
                  <Badge className="mt-3 bg-blue-500/20 text-blue-400">One-Click</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30 cursor-pointer hover:border-yellow-400/50 transition-colors" onClick={() => setActiveTab('achievements')}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <h4 className="font-bold text-white mb-2">Achievement System</h4>
                  <p className="text-gray-400 text-sm">5 training badges with XP rewards and level progression</p>
                  <Badge className="mt-3 bg-yellow-500/20 text-yellow-400">Gamified</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 cursor-pointer hover:border-purple-400/50 transition-colors" onClick={() => setActiveTab('insights')}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">🧠</div>
                  <h4 className="font-bold text-white mb-2">Trading Insights</h4>
                  <p className="text-gray-400 text-sm">Personalized AI-powered market analysis tailored to your style</p>
                  <Badge className="mt-3 bg-purple-500/20 text-purple-400">AI-Powered</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 border-cyan-500/30 cursor-pointer hover:border-cyan-400/50 transition-colors" onClick={() => setActiveTab('sentiment')}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">📈</div>
                  <h4 className="font-bold text-white mb-2">Sentiment Translation</h4>
                  <p className="text-gray-400 text-sm">Market psychology explained in simple, everyday language</p>
                  <Badge className="mt-3 bg-cyan-500/20 text-cyan-400">Simplified</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/40 to-indigo-900/20 border-gray-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">🔮</div>
                  <h4 className="font-bold text-white mb-2">Coming Soon</h4>
                  <p className="text-gray-400 text-sm">Advanced courses, live mentoring, and social learning features</p>
                  <Badge className="mt-3 bg-gray-500/20 text-gray-400">Future</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Individual Feature Tabs */}
          <TabsContent value="mascot">
            <CryptoMascot />
          </TabsContent>

          <TabsContent value="risk">
            <RiskAssessment />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementBadges />
          </TabsContent>

          <TabsContent value="insights">
            <TradingInsights />
          </TabsContent>

          <TabsContent value="sentiment">
            <MarketSentimentTranslation />
          </TabsContent>
        </Tabs>

        {/* Community Stats Footer */}
        <Card className="mt-8 bg-gradient-to-r from-gray-900/40 via-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Join the Learning Community</h4>
                  <p className="text-gray-400">Connect with fellow traders and share your progress</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}