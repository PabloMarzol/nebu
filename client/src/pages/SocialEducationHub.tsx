import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RealTimeSentimentAnalysis from '@/components/sentiment-analysis/real-time-sentiment';
import CryptoLearningGames from '@/components/crypto-games/crypto-learning-games';
import SocialTrainingCommunity from '@/components/social-community/social-training-community';
import PortfolioWellnessIndicator from '@/components/portfolio-wellness/portfolio-wellness-indicator';
import EducationConsentGenerator from '@/components/education-consent/education-consent-generator';
import { 
  Brain, 
  Gamepad2, 
  Users, 
  Heart, 
  FileText, 
  TrendingUp, 
  Award,
  Target,
  BookOpen,
  Zap
} from 'lucide-react';

const SocialEducationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sentiment');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Social Education Hub
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Advanced social trading features, personalized education, and intelligent portfolio wellness analysis
          </p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <Card className="bg-black/20 border-purple-500/20 hover:border-purple-400/40 transition-colors">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-sm font-semibold">Real-time Sentiment</div>
                <div className="text-xs text-gray-400">AI Market Analysis</div>
              </CardContent>
            </Card>
            <Card className="bg-black/20 border-green-500/20 hover:border-green-400/40 transition-colors">
              <CardContent className="p-4 text-center">
                <Gamepad2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-sm font-semibold">Learning Games</div>
                <div className="text-xs text-gray-400">Interactive Education</div>
              </CardContent>
            </Card>
            <Card className="bg-black/20 border-blue-500/20 hover:border-blue-400/40 transition-colors">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm font-semibold">Social Community</div>
                <div className="text-xs text-gray-400">Trading Network</div>
              </CardContent>
            </Card>
            <Card className="bg-black/20 border-red-500/20 hover:border-red-400/40 transition-colors">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-sm font-semibold">Portfolio Wellness</div>
                <div className="text-xs text-gray-400">Health Analysis</div>
              </CardContent>
            </Card>
            <Card className="bg-black/20 border-yellow-500/20 hover:border-yellow-400/40 transition-colors">
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-sm font-semibold">Consent Generator</div>
                <div className="text-xs text-gray-400">Legal Compliance</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">98.7%</div>
              <div className="text-sm text-gray-400">Sentiment Accuracy</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">15,420</div>
              <div className="text-sm text-gray-400">XP Distributed</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-sm text-gray-400">Active Traders</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">87.3%</div>
              <div className="text-sm text-gray-400">Portfolio Health</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-black/40">
            <TabsTrigger value="sentiment" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span className="hidden md:inline">Sentiment</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden md:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="wellness" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="hidden md:inline">Wellness</span>
            </TabsTrigger>
            <TabsTrigger value="consent" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">Consent</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sentiment" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Real-Time Sentiment Analysis</h2>
                <p className="text-gray-400">AI-powered market sentiment tracking across multiple sources</p>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300">
                Live Data
              </Badge>
            </div>
            <RealTimeSentimentAnalysis />
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Crypto Learning Games</h2>
                <p className="text-gray-400">Master cryptocurrency knowledge through interactive challenges</p>
              </div>
              <Badge className="bg-green-500/20 text-green-300">
                <BookOpen className="w-3 h-3 mr-1" />
                Educational
              </Badge>
            </div>
            <CryptoLearningGames />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Social Trading Community</h2>
                <p className="text-gray-400">Connect, compete, and learn with fellow crypto traders</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300">
                <Users className="w-3 h-3 mr-1" />
                Social
              </Badge>
            </div>
            <SocialTrainingCommunity />
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Portfolio Wellness Indicator</h2>
                <p className="text-gray-400">Comprehensive health analysis and personalized recommendations</p>
              </div>
              <Badge className="bg-red-500/20 text-red-300">
                <Heart className="w-3 h-3 mr-1" />
                Health Monitor
              </Badge>
            </div>
            <PortfolioWellnessIndicator />
          </TabsContent>

          <TabsContent value="consent" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Education Consent Generator</h2>
                <p className="text-gray-400">Generate compliant consent documents with one click</p>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-300">
                <FileText className="w-3 h-3 mr-1" />
                Legal Compliance
              </Badge>
            </div>
            <EducationConsentGenerator />
          </TabsContent>
        </Tabs>

        {/* Quick Access Panel */}
        <Card className="bg-gradient-to-r from-gray-800/20 to-gray-900/20 border-gray-600/20">
          <CardHeader>
            <CardTitle className="text-center">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <button 
                onClick={() => setActiveTab('sentiment')}
                className="p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors text-center"
              >
                <Brain className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-xs text-purple-300">Market Sentiment</div>
              </button>
              <button 
                onClick={() => setActiveTab('games')}
                className="p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-center"
              >
                <Gamepad2 className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-xs text-green-300">Start Learning</div>
              </button>
              <button 
                onClick={() => setActiveTab('community')}
                className="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-center"
              >
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-xs text-blue-300">Join Community</div>
              </button>
              <button 
                onClick={() => setActiveTab('wellness')}
                className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-center"
              >
                <Heart className="w-6 h-6 text-red-400 mx-auto mb-1" />
                <div className="text-xs text-red-300">Check Health</div>
              </button>
              <button 
                onClick={() => setActiveTab('consent')}
                className="p-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors text-center"
              >
                <FileText className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-xs text-yellow-300">Generate Docs</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SocialEducationHub;