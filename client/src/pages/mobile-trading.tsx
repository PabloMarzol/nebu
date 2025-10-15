import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Smartphone, 
  Download, 
  Shield, 
  Zap, 
  Bell, 
  Fingerprint,
  Crown,
  TrendingUp,
  BarChart3,
  Users,
  Play,
  Apple,
  Chrome
} from 'lucide-react';

export default function MobileTrading() {
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android' | 'pwa'>('ios');

  const features = {
    basic: [
      'Real-time market data',
      'Spot trading',
      'Portfolio tracking',
      'Price alerts',
      'Basic security'
    ],
    pro: [
      'All Basic features',
      'Advanced order types',
      'Push notifications',
      'Biometric login',
      'Dark mode themes',
      'Priority support'
    ],
    premium: [
      'All Pro features',
      'Copy trading',
      'AI trading signals',
      'Advanced analytics',
      'Custom widgets',
      'Portfolio optimization'
    ],
    elite: [
      'All Premium features',
      'White-label mobile app',
      'Custom branding',
      'Advanced API access',
      'Dedicated support',
      'Custom integrations'
    ]
  };

  const mobileStats = [
    { label: 'Downloads', value: '2.5M+', icon: <Download className="w-5 h-5" /> },
    { label: 'App Rating', value: '4.8★', icon: <Crown className="w-5 h-5" /> },
    { label: 'Active Users', value: '850K+', icon: <Users className="w-5 h-5" /> },
    { label: 'Daily Volume', value: '$125M+', icon: <TrendingUp className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white pt-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Smartphone className="w-16 h-16 text-blue-400" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Trade <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Anywhere</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience professional-grade cryptocurrency trading on your mobile device. 
              Advanced features, institutional security, and seamless performance.
            </p>
            
            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 flex items-center space-x-2">
                <Apple className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 flex items-center space-x-2">
                <Chrome className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs">Install</div>
                  <div className="font-semibold">Web App</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {mobileStats.map((stat, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-lg border-white/10 text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3 text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Tiers */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Mobile Trading Tiers</h2>
          <p className="text-gray-300 mb-8">Choose the mobile experience that fits your trading style</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.entries(features).map(([tier, featureList]) => (
            <Card key={tier} className={`bg-black/20 backdrop-blur-lg border-2 ${
              tier === 'pro' ? 'border-blue-500 scale-105' : 
              tier === 'premium' ? 'border-purple-500' : 
              tier === 'elite' ? 'border-yellow-500' : 
              'border-white/10'
            }`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {tier === 'basic' && <Smartphone className="w-8 h-8 text-gray-400" />}
                  {tier === 'pro' && <Shield className="w-8 h-8 text-blue-400" />}
                  {tier === 'premium' && <Crown className="w-8 h-8 text-purple-400" />}
                  {tier === 'elite' && <Zap className="w-8 h-8 text-yellow-400" />}
                </div>
                <CardTitle className="text-xl capitalize">{tier}</CardTitle>
                {tier === 'pro' && (
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {featureList.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={tier === 'basic' ? 'outline' : 'default'}>
                  {tier === 'basic' ? 'Get Started' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Features Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Fingerprint className="w-6 h-6 text-green-400" />
                <span>Advanced Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Biometric Authentication</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Device Encryption</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Remote Wipe</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Session Timeout</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-6 h-6 text-blue-400" />
                <span>Smart Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                  <div className="text-sm font-semibold text-green-300">Price Alert</div>
                  <div className="text-xs text-green-200">BTC reached $45,000 - Your target price!</div>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <div className="text-sm font-semibold text-blue-300">Order Filled</div>
                  <div className="text-xs text-blue-200">Your ETH buy order has been executed</div>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <div className="text-sm font-semibold text-purple-300">AI Insight</div>
                  <div className="text-xs text-purple-200">Market sentiment is bullish - Consider increasing allocation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Selection */}
        <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Available on All Platforms</CardTitle>
            <p className="text-center text-gray-300">Choose your preferred mobile experience</p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4 mb-8">
              <Button
                variant={selectedPlatform === 'ios' ? 'default' : 'outline'}
                onClick={() => setSelectedPlatform('ios')}
                className="flex items-center space-x-2"
              >
                <Apple className="w-4 h-4" />
                <span>iOS</span>
              </Button>
              <Button
                variant={selectedPlatform === 'android' ? 'default' : 'outline'}
                onClick={() => setSelectedPlatform('android')}
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Android</span>
              </Button>
              <Button
                variant={selectedPlatform === 'pwa' ? 'default' : 'outline'}
                onClick={() => setSelectedPlatform('pwa')}
                className="flex items-center space-x-2"
              >
                <Chrome className="w-4 h-4" />
                <span>Web App</span>
              </Button>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold mb-2">
                {selectedPlatform === 'ios' && 'iOS App Features'}
                {selectedPlatform === 'android' && 'Android App Features'}
                {selectedPlatform === 'pwa' && 'Progressive Web App Features'}
              </div>
              <div className="text-gray-300 mb-6">
                {selectedPlatform === 'ios' && 'Optimized for iPhone and iPad with native iOS integrations'}
                {selectedPlatform === 'android' && 'Full Android experience with Material Design'}
                {selectedPlatform === 'pwa' && 'Cross-platform web app that works offline'}
              </div>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Download Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}